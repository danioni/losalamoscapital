import yahooFinance from "yahoo-finance2";

// ═══ CoinGecko ticker → ID mapping ═══

const CRYPTO_ID_MAP: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  USDT: "tether",
  USDC: "usd-coin",
  ADA: "cardano",
  AVAX: "avalanche-2",
  DOT: "polkadot",
  MATIC: "matic-network",
  LINK: "chainlink",
  UNI: "uniswap",
  ATOM: "cosmos",
  XRP: "ripple",
  DOGE: "dogecoin",
  SHIB: "shiba-inu",
  LTC: "litecoin",
  BCH: "bitcoin-cash",
  XLM: "stellar",
  ALGO: "algorand",
  NEAR: "near",
  FTM: "fantom",
  AAVE: "aave",
  ARB: "arbitrum",
  OP: "optimism",
  SUI: "sui",
};

export interface PriceResult {
  ticker: string;
  price: number;
}

export interface PriceError {
  ticker: string;
  error: string;
}

// ═══ Yahoo Finance: Acciones y ETFs ═══

export async function fetchStockPrices(
  tickers: string[]
): Promise<{ results: PriceResult[]; errors: PriceError[] }> {
  const results: PriceResult[] = [];
  const errors: PriceError[] = [];

  for (const ticker of tickers) {
    try {
      const quote = await yahooFinance.quote(ticker) as { regularMarketPrice?: number };
      if (quote.regularMarketPrice && quote.regularMarketPrice > 0) {
        results.push({ ticker, price: quote.regularMarketPrice });
      } else {
        errors.push({ ticker, error: "Precio no disponible" });
      }
    } catch (err) {
      errors.push({
        ticker,
        error: err instanceof Error ? err.message : "Error desconocido",
      });
    }
  }

  return { results, errors };
}

// ═══ CoinGecko: Crypto ═══

export async function fetchCryptoPrices(
  tickers: string[]
): Promise<{ results: PriceResult[]; errors: PriceError[] }> {
  const results: PriceResult[] = [];
  const errors: PriceError[] = [];

  // Map tickers to CoinGecko IDs
  const tickerToId: Record<string, string> = {};
  for (const ticker of tickers) {
    const id = CRYPTO_ID_MAP[ticker.toUpperCase()];
    if (id) {
      tickerToId[ticker] = id;
    } else {
      errors.push({ ticker, error: `Ticker "${ticker}" no tiene mapeo a CoinGecko` });
    }
  }

  const ids = Object.values(tickerToId);
  if (ids.length === 0) return { results, errors };

  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(",")}&vs_currencies=usd`;
    const response = await fetch(url);

    if (!response.ok) {
      const text = await response.text();
      for (const ticker of Object.keys(tickerToId)) {
        errors.push({ ticker, error: `CoinGecko API error ${response.status}: ${text}` });
      }
      return { results, errors };
    }

    const data = await response.json();

    for (const [ticker, id] of Object.entries(tickerToId)) {
      const priceData = data[id];
      if (priceData && priceData.usd && priceData.usd > 0) {
        results.push({ ticker, price: priceData.usd });
      } else {
        errors.push({ ticker, error: `Precio no encontrado para ${id}` });
      }
    }
  } catch (err) {
    for (const ticker of Object.keys(tickerToId)) {
      errors.push({
        ticker,
        error: err instanceof Error ? err.message : "Error de conexión a CoinGecko",
      });
    }
  }

  return { results, errors };
}
