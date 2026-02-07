import { createAdminClient } from "@/lib/supabase/admin";
import { fetchStockPrices, fetchCryptoPrices } from "@/lib/price-apis";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  // Verify CRON_SECRET
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const token = authHeader.substring(7);
  if (token !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const startTime = Date.now();

  try {
    const supabase = createAdminClient();

    // Fetch positions that need price updates
    const { data: positions, error: fetchError } = await supabase
      .from("positions")
      .select("id, ticker, asset_class, current_price_usd")
      .in("asset_class", ["acciones_usa", "etf", "crypto"]);

    if (fetchError) {
      return NextResponse.json(
        { error: "Error al obtener posiciones", details: fetchError.message },
        { status: 500 }
      );
    }

    if (!positions || positions.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No hay posiciones para actualizar",
        updated: [],
        failed: [],
        duration_ms: Date.now() - startTime,
      });
    }

    // Group by API type
    const stockTickers = positions
      .filter((p) => p.asset_class === "acciones_usa" || p.asset_class === "etf")
      .map((p) => p.ticker);

    const cryptoTickers = positions
      .filter((p) => p.asset_class === "crypto")
      .map((p) => p.ticker);

    // Fetch prices from both APIs in parallel
    const [stockData, cryptoData] = await Promise.all([
      stockTickers.length > 0
        ? fetchStockPrices(stockTickers)
        : { results: [], errors: [] },
      cryptoTickers.length > 0
        ? fetchCryptoPrices(cryptoTickers)
        : { results: [], errors: [] },
    ]);

    // Build a price map: ticker → price
    const priceMap = new Map<string, number>();
    for (const r of [...stockData.results, ...cryptoData.results]) {
      priceMap.set(r.ticker, r.price);
    }

    // Update positions in the database
    const updated: { ticker: string; oldPrice: number; newPrice: number }[] = [];
    const dbErrors: { ticker: string; error: string }[] = [];

    for (const pos of positions) {
      const newPrice = priceMap.get(pos.ticker);
      if (newPrice === undefined) continue;

      const { error: updateError } = await supabase
        .from("positions")
        .update({
          current_price_usd: newPrice,
          last_updated: new Date().toISOString(),
        })
        .eq("id", pos.id);

      if (updateError) {
        dbErrors.push({ ticker: pos.ticker, error: updateError.message });
      } else {
        updated.push({
          ticker: pos.ticker,
          oldPrice: pos.current_price_usd,
          newPrice,
        });
      }
    }

    // Revalidate the public site
    revalidatePath("/", "page");

    const allErrors = [
      ...stockData.errors,
      ...cryptoData.errors,
      ...dbErrors,
    ];

    return NextResponse.json({
      success: allErrors.length === 0,
      updated,
      failed: allErrors,
      summary: `${updated.length} actualizados, ${allErrors.length} errores`,
      duration_ms: Date.now() - startTime,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Error interno",
        details: err instanceof Error ? err.message : "Error desconocido",
        duration_ms: Date.now() - startTime,
      },
      { status: 500 }
    );
  }
}

// Vercel Cron calls GET by default
export async function GET(request: NextRequest) {
  return POST(request);
}
