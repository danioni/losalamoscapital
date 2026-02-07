import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

// Vercel Cron Job — runs weekly (Sundays 20:00 UTC)
// Also callable manually via GET with CRON_SECRET

// All tickers to fetch, grouped by source
const YAHOO_TICKERS = [
  "NVDA", "AAPL", "GOOGL", "MSFT", "AMZN", "TSM", "META",
  "2222.SR", "AVGO", "TSLA", "BRK-B", "WMT", "LLY", "JPM",
  "005930.KS", "TCEHY", "V", "XOM", "JNJ", "ASML", "MA",
  "COST", "MU", "BAC", "ORCL", "ABBV", "BABA", "HD", "PG",
  "ROG.SW", "CVX", "NFLX", "KO", "GE", "CAT", "AMD", "CSCO",
  "PLTR", "TM", "MC.PA", "HSBC", "MRK", "NVS", "AZN", "WFC",
  // Index
  "^GSPC",
  // Commodities
  "GC=F", "SI=F",
];

// Map Yahoo tickers to our internal tickers
const TICKER_MAP: Record<string, string> = {
  "BRK-B": "BRK.B",
  "^GSPC": "SPX",
  "GC=F": "XAU",
  "SI=F": "XAG",
};

function formatMarketCap(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${Math.round(value / 1e9)}B`;
  if (value >= 1e6) return `$${Math.round(value / 1e6)}M`;
  return `$${value}`;
}

function formatPrice(ticker: string, price: number): string {
  if (ticker === "XAU") return `$${price.toLocaleString("en-US", { maximumFractionDigits: 0 })}/oz`;
  if (ticker === "XAG") return `$${price.toFixed(2)}/oz`;
  if (ticker === "BTC") return `$${price.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  if (ticker === "SPX") return price.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (["2222.SR"].includes(ticker)) return `${price.toFixed(2)} SAR`;
  return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

async function fetchYahooQuotes(tickers: string[]): Promise<Record<string, { price: number; marketCap: number }>> {
  const results: Record<string, { price: number; marketCap: number }> = {};

  // Fetch in batches of 10 to avoid URL length issues
  const batchSize = 10;
  for (let i = 0; i < tickers.length; i += batchSize) {
    const batch = tickers.slice(i, i + batchSize);
    const symbols = batch.join(",");

    try {
      const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}&fields=regularMarketPrice,marketCap`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        signal: AbortSignal.timeout(15000),
      });

      if (!res.ok) {
        console.error(`Yahoo batch failed (${res.status}): ${symbols}`);
        continue;
      }

      const data = await res.json();
      const quotes = data?.quoteResponse?.result || [];

      for (const q of quotes) {
        const internalTicker = TICKER_MAP[q.symbol] || q.symbol;
        results[internalTicker] = {
          price: q.regularMarketPrice || 0,
          marketCap: q.marketCap || 0,
        };
      }
    } catch (err) {
      console.error(`Yahoo batch error: ${symbols}`, err);
    }
  }

  return results;
}

async function fetchBitcoinPrice(): Promise<{ price: number; marketCap: number }> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true",
      { signal: AbortSignal.timeout(10000) }
    );
    const data = await res.json();
    return {
      price: data.bitcoin?.usd || 0,
      marketCap: data.bitcoin?.usd_market_cap || 0,
    };
  } catch (err) {
    console.error("CoinGecko error:", err);
    return { price: 0, marketCap: 0 };
  }
}

export async function GET(request: Request) {
  // Verify cron secret (Vercel sends this header for cron jobs)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("[CRON] Starting price update...");

    // Fetch all prices in parallel
    const [yahooData, btcData] = await Promise.all([
      fetchYahooQuotes(YAHOO_TICKERS),
      fetchBitcoinPrice(),
    ]);

    // Merge BTC data
    const allPrices: Record<string, { price: number; marketCap: number }> = {
      ...yahooData,
      BTC: btcData,
    };

    // Special market cap estimates for non-equity assets
    if (allPrices.XAU && allPrices.XAU.marketCap === 0) {
      // Gold: ~12.1B oz above ground × price
      allPrices.XAU.marketCap = allPrices.XAU.price * 12.1e9;
    }
    if (allPrices.XAG && allPrices.XAG.marketCap === 0) {
      // Silver: ~1.8B oz investible × price (rough)
      allPrices.XAG.marketCap = allPrices.XAG.price * 1.8e9 * 12;
    }
    if (allPrices.SPX) {
      // S&P 500 doesn't have a meaningful market cap for our comparison
      allPrices.SPX.marketCap = 0;
    }

    // Prepare upsert rows
    const rows = Object.entries(allPrices)
      .filter(([, v]) => v.price > 0)
      .map(([ticker, { price, marketCap }]) => ({
        ticker,
        current_price: price,
        market_cap_value: Math.round(marketCap),
        market_cap_label: ticker === "SPX" ? "Benchmark" : formatMarketCap(marketCap),
        current_price_label: formatPrice(ticker, price),
        updated_at: new Date().toISOString(),
      }));

    if (rows.length === 0) {
      return NextResponse.json({ error: "No prices fetched" }, { status: 500 });
    }

    // Upsert to Supabase
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("analysis_prices")
      .upsert(rows, { onConflict: "ticker" });

    if (error) {
      console.error("[CRON] Supabase upsert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Revalidate the analysis page so it shows fresh data
    revalidatePath("/analisis", "page");

    console.log(`[CRON] Updated ${rows.length} prices successfully`);

    return NextResponse.json({
      success: true,
      updated: rows.length,
      timestamp: new Date().toISOString(),
      sample: rows.slice(0, 5).map((r) => `${r.ticker}: ${r.current_price_label}`),
    });
  } catch (error) {
    console.error("[CRON] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
