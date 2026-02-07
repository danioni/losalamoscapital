"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Fundamentals {
  trailingPE: number | null;
  forwardPE: number | null;
  dividendYield: number | null;
  revenueGrowth: number | null;
  epsGrowth: number | null;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow: number | null;
}

interface LivePrices {
  [ticker: string]: {
    price: number;
    priceLabel: string;
    marketCap: number;
    marketCapLabel: string;
  };
}

interface LiveFundamentals {
  [ticker: string]: Fundamentals;
}

interface ProyeccionesProps {
  livePrices?: LivePrices;
  liveFundamentals?: LiveFundamentals;
  lastUpdated?: string | null;
}

interface AssetProjection {
  rank: number;
  name: string;
  ticker: string;
  type: "company" | "commodity" | "crypto" | "index";
  sector: string;
  currentPrice: number;
  currentPriceLabel: string;
  marketCap: string;
  marketCapSort: number;
  cagrHistorico: number;
  cagr5y: number;
  // Fundamentals (live)
  trailingPE: number | null;
  forwardPE: number | null;
  dividendYield: number | null;
  epsGrowth: number | null;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow: number | null;
  pctFrom52wHigh: number | null;
  // Projected CAGRs
  cagrConservador: number;
  cagrBase: number;
  cagrOptimista: number;
  // Model factor count (how many live data points fed the model)
  factorCount: number;
  // Projected prices
  price5yConservador: number;
  price5yBase: number;
  price5yOptimista: number;
  price10yConservador: number;
  price10yBase: number;
  price10yOptimista: number;
}

// ─── Utilities ───────────────────────────────────────────────────────────────

function projectPrice(current: number, cagr: number, years: number): number {
  return current * Math.pow(1 + cagr / 100, years);
}

function formatPrice(value: number): string {
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
  if (value >= 100) return `$${value.toFixed(0)}`;
  if (value >= 1) return `$${value.toFixed(2)}`;
  return `$${value.toFixed(4)}`;
}

function formatUSD(value: number): string {
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
}

function calcCAGR(start: number, end: number, years: number): number {
  if (start <= 0 || years <= 0) return 0;
  return (Math.pow(end / start, 1 / years) - 1) * 100;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function round1(v: number) {
  return Math.round(v * 10) / 10;
}

// ─── Multi-Factor Projection Model ──────────────────────────────────────────
//
// The model adjusts the base CAGR extrapolation using live fundamentals:
//
// 1. P/E Valuation Adjustment:
//    - If Forward P/E < Trailing P/E → earnings growth expected → bonus
//    - If Forward P/E > 40 (expensive) → penalty on base/optimista
//    - If Forward P/E < 15 (cheap) → bonus on conservador
//
// 2. EPS Growth:
//    - Directly feeds into base scenario as a forward-looking signal
//
// 3. Dividend Yield:
//    - Added to total return in all scenarios
//
// 4. 52-Week Position:
//    - Near 52w low → conservative is less pessimistic
//    - Near 52w high → optimistic is moderated

function computeProjectedCAGR(
  cagrHist: number,
  cagr5y: number,
  fund: Fundamentals | null,
  currentPrice: number,
): { conservador: number; base: number; optimista: number; factorCount: number } {
  // Use the lower and higher of the two CAGRs to anchor scenarios correctly.
  // This prevents inversion when historical and recent CAGRs diverge significantly
  // (e.g., BTC: 90% historical vs 6% recent).
  const lowerCAGR = Math.min(cagrHist, cagr5y);
  const higherCAGR = Math.max(cagrHist, cagr5y);
  const blendedCAGR = cagrHist * 0.4 + cagr5y * 0.6;

  let conservador = lowerCAGR * 0.7;           // 30% haircut on the weaker signal
  let base = blendedCAGR;                       // Weighted average of both
  let optimista = higherCAGR;                    // The stronger signal sustained

  let factorCount = 2; // CAGR hist + CAGR 5y always available

  if (!fund) return { conservador: round1(conservador), base: round1(base), optimista: round1(optimista), factorCount };

  // ── P/E Valuation adjustment ──
  if (fund.forwardPE != null && fund.forwardPE > 0) {
    factorCount++;
    // Expensive (P/E > 35): penalize base/optimista by up to -3%
    // Cheap (P/E < 15): boost conservador by up to +2%
    if (fund.forwardPE > 35) {
      const penalty = clamp((fund.forwardPE - 35) * 0.1, 0, 3);
      base -= penalty;
      optimista -= penalty;
    } else if (fund.forwardPE < 15) {
      const bonus = clamp((15 - fund.forwardPE) * 0.15, 0, 2);
      conservador += bonus;
    }

    // P/E compression signal: forward < trailing means market expects growth
    if (fund.trailingPE != null && fund.trailingPE > 0) {
      factorCount++;
      const peChange = (fund.forwardPE - fund.trailingPE) / fund.trailingPE;
      // Negative peChange = P/E contracting = bullish
      if (peChange < -0.1) {
        const boost = clamp(Math.abs(peChange) * 5, 0, 2);
        base += boost;
      } else if (peChange > 0.15) {
        const drag = clamp(peChange * 3, 0, 2);
        base -= drag;
      }
    }
  }

  // ── EPS Growth adjustment ──
  if (fund.epsGrowth != null) {
    factorCount++;
    const epsSignal = fund.epsGrowth * 100; // convert to percentage
    // Blend EPS growth into base: 20% weight
    base = base * 0.8 + (base + epsSignal * 0.3) * 0.2;
    // Strong EPS growth boosts optimista
    if (epsSignal > 15) {
      optimista += clamp(epsSignal * 0.1, 0, 3);
    }
  }

  // ── Dividend Yield — adds to total return ──
  if (fund.dividendYield != null && fund.dividendYield > 0) {
    factorCount++;
    const divPct = fund.dividendYield * 100;
    conservador += divPct;
    base += divPct;
    optimista += divPct;
  }

  // ── 52-Week Range position ──
  if (fund.fiftyTwoWeekHigh != null && fund.fiftyTwoWeekLow != null && fund.fiftyTwoWeekHigh > fund.fiftyTwoWeekLow) {
    factorCount++;
    const range = fund.fiftyTwoWeekHigh - fund.fiftyTwoWeekLow;
    const position = (currentPrice - fund.fiftyTwoWeekLow) / range; // 0 = at low, 1 = at high
    // Near 52w low (position < 0.3): conservador gets a boost
    if (position < 0.3) {
      conservador += clamp((0.3 - position) * 5, 0, 2);
    }
    // Near 52w high (position > 0.85): optimista gets moderated
    if (position > 0.85) {
      optimista -= clamp((position - 0.85) * 8, 0, 2);
    }
  }

  // Enforce logical ordering: conservador ≤ base ≤ optimista
  // After all adjustments, scenarios could still cross in edge cases
  const c = round1(conservador);
  const b = round1(base);
  const o = round1(optimista);
  const sorted = [c, b, o].sort((a, b) => a - b);

  return {
    conservador: sorted[0],
    base: sorted[1],
    optimista: sorted[2],
    factorCount,
  };
}

// ─── Data Builder ────────────────────────────────────────────────────────────

function buildProjections(livePrices?: LivePrices, liveFundamentals?: LiveFundamentals): AssetProjection[] {
  const now = livePrices ? new Date() : new Date("2026-02-06");
  const yearsSince = (d: string) =>
    (now.getTime() - new Date(d).getTime()) / (365.25 * 24 * 60 * 60 * 1000);

  type R = [string, string, "company"|"commodity"|"crypto"|"index", string, string, number, number, string, string, number];
  const d: R[] = [
    ["Gold", "XAU", "commodity", "Materias Primas", "1971-08-15", 35, 4800, "$4,800/oz", "$19.4T", 19400],
    ["Silver", "XAG", "commodity", "Materias Primas", "1971-08-15", 1.39, 75, "$75/oz", "$1.6T", 1600],
    ["Bitcoin", "BTC", "crypto", "Cripto", "2013-01-01", 13.3, 62000, "$62,000", "$1.2T", 1200],
    ["S&P 500", "SPX", "index", "Índice", "1957-03-04", 44.06, 6000, "6,000", "Referencia", 0],
    ["NVIDIA", "NVDA", "company", "Semiconductores", "1999-01-22", 0.04, 185.14, "$185.14", "$4.51T", 4507],
    ["Apple", "AAPL", "company", "Tecnología", "1980-12-12", 0.10, 277.92, "$277.92", "$4.08T", 4084],
    ["Alphabet", "GOOGL", "company", "Tecnología", "2004-08-19", 1.27, 322.89, "$322.89", "$3.91T", 3906],
    ["Microsoft", "MSFT", "company", "Tecnología", "1986-03-13", 0.07, 399.78, "$399.78", "$2.97T", 2971],
    ["Amazon", "AMZN", "company", "Comercio Electrónico", "1997-05-15", 0.075, 206.96, "$206.96", "$2.21T", 2212],
    ["TSMC", "TSM", "company", "Semiconductores", "1997-10-08", 1.17, 348.61, "$348.61", "$1.81T", 1808],
    ["Meta", "META", "company", "Tecnología", "2012-05-18", 38, 658, "$658", "$1.66T", 1664],
    ["Saudi Aramco", "2222.SR", "company", "Energía", "2019-12-11", 32, 25.60, "25.60 SAR", "$1.65T", 1650],
    ["Broadcom", "AVGO", "company", "Semiconductores", "2009-08-06", 1.53, 333.28, "$333.28", "$1.58T", 1580],
    ["Tesla", "TSLA", "company", "Automotriz", "2010-06-29", 1.13, 413.85, "$413.85", "$1.55T", 1552],
    ["Berkshire Hathaway", "BRK.B", "company", "Financiero", "1965-05-10", 0.012, 505.84, "$505.84", "$1.09T", 1091],
    ["Walmart", "WMT", "company", "Comercio", "1970-10-01", 0.006, 130.89, "$130.89", "$1.04T", 1043],
    ["Eli Lilly", "LLY", "company", "Farmacéutica", "1952-01-01", 0.085, 1057, "$1,057", "$947B", 947],
    ["JPMorgan Chase", "JPM", "company", "Financiero", "1969-03-05", 0.52, 323.13, "$323.13", "$880B", 880],
    ["Samsung", "005930.KS", "company", "Semiconductores", "1975-06-11", 0.05, 108.42, "$108.42", "$725B", 725],
    ["Tencent", "TCEHY", "company", "Tecnología", "2004-06-16", 0.07, 71.22, "$71.22", "$642B", 642],
    ["Visa", "V", "company", "Pagos", "2008-03-19", 11, 329.96, "$329.96", "$636B", 636],
    ["Exxon Mobil", "XOM", "company", "Energía", "1920-01-01", 0.001, 149.12, "$149.12", "$629B", 629],
    ["Johnson & Johnson", "JNJ", "company", "Farmacéutica", "1944-09-24", 0.025, 240.61, "$240.61", "$580B", 580],
    ["ASML", "ASML", "company", "Semiconductores", "1995-03-14", 0.55, 1411, "$1,411", "$548B", 548],
    ["Mastercard", "MA", "company", "Pagos", "2006-05-25", 3.90, 545.74, "$545.74", "$488B", 488],
    ["Costco", "COST", "company", "Comercio", "1985-12-01", 2.50, 998.12, "$998.12", "$443B", 443],
    ["Micron", "MU", "company", "Semiconductores", "1984-06-01", 0.07, 393.65, "$393.65", "$443B", 443],
    ["Bank of America", "BAC", "company", "Financiero", "1973-01-02", 0.08, 56.52, "$56.52", "$413B", 413],
    ["Oracle", "ORCL", "company", "Tecnología", "1986-03-12", 0.03, 140.86, "$140.86", "$405B", 405],
    ["AbbVie", "ABBV", "company", "Farmacéutica", "2013-01-02", 35.23, 224.38, "$224.38", "$397B", 397],
    ["Alibaba", "BABA", "company", "Comercio Electrónico", "2014-09-19", 68, 161.90, "$161.90", "$387B", 387],
    ["Home Depot", "HD", "company", "Comercio", "1981-09-29", 0.03, 385.20, "$385.20", "$383B", 383],
    ["Procter & Gamble", "PG", "company", "Consumo", "1890-01-01", 0.0005, 159.10, "$159.10", "$372B", 372],
    ["Roche", "ROG.SW", "company", "Farmacéutica", "1956-05-01", 0.15, 459.69, "$459.69", "$366B", 366],
    ["Chevron", "CVX", "company", "Energía", "1921-06-01", 0.001, 180.34, "$180.34", "$361B", 361],
    ["Netflix", "NFLX", "company", "Tecnología", "2002-05-23", 0.054, 81.27, "$81.27", "$345B", 345],
    ["Coca-Cola", "KO", "company", "Consumo", "1919-09-05", 0.00002, 78.92, "$78.92", "$340B", 340],
    ["General Electric", "GE", "company", "Industrial", "1892-04-15", 0.008, 321.88, "$321.88", "$340B", 340],
    ["Caterpillar", "CAT", "company", "Industrial", "1929-12-02", 0.07, 724.18, "$724.18", "$339B", 339],
    ["AMD", "AMD", "company", "Semiconductores", "1972-09-27", 0.05, 206.84, "$206.84", "$337B", 337],
    ["Cisco", "CSCO", "company", "Tecnología", "1990-02-16", 0.04, 84.60, "$84.60", "$334B", 334],
    ["Palantir", "PLTR", "company", "Tecnología / IA", "2020-09-30", 9.50, 135.38, "$135.38", "$323B", 323],
    ["Toyota", "TM", "company", "Automotriz", "1949-05-01", 0.01, 244.69, "$244.69", "$320B", 320],
    ["LVMH", "MC.PA", "company", "Lujo", "1987-06-01", 0.35, 633.96, "$633.96", "$315B", 315],
    ["HSBC", "HSBC", "company", "Financiero", "1991-01-01", 2.50, 89.38, "$89.38", "$307B", 307],
    ["Merck", "MRK", "company", "Farmacéutica", "1946-01-01", 0.015, 121.87, "$121.87", "$304B", 304],
    ["Novartis", "NVS", "company", "Farmacéutica", "1996-12-20", 12.50, 156.25, "$156.25", "$302B", 302],
    ["AstraZeneca", "AZN", "company", "Farmacéutica", "1999-04-06", 14, 193.58, "$193.58", "$300B", 300],
    ["Wells Fargo", "WFC", "company", "Financiero", "1978-01-01", 0.05, 94.32, "$94.32", "$296B", 296],
  ];

  const prices5yAgo: Record<string, number> = {
    XAU: 1810, XAG: 27, BTC: 46000, SPX: 3886,
    NVDA: 13.2, AAPL: 134, GOOGL: 100, MSFT: 232, AMZN: 162.5,
    TSM: 130, META: 265, "2222.SR": 34.5, AVGO: 47.5, TSLA: 55.8,
    "BRK.B": 230, WMT: 72, LLY: 210, JPM: 140, "005930.KS": 72,
    TCEHY: 82, V: 210, XOM: 46, JNJ: 165, ASML: 580,
    MA: 340, COST: 360, MU: 80, BAC: 33, ORCL: 60,
    ABBV: 105, BABA: 265, HD: 270, PG: 130, "ROG.SW": 300,
    CVX: 88, NFLX: 24.4, KO: 50, GE: 105, CAT: 190,
    AMD: 87, CSCO: 45, PLTR: 27, TM: 160, "MC.PA": 320,
    HSBC: 28, MRK: 76, NVS: 90, AZN: 50, WFC: 32,
  };

  return d.map(([name, ticker, type, sector, inceptionDate, startPrice, currentPrice, currentPriceLabel, marketCap, marketCapSort], i) => {
    const live = livePrices?.[ticker];
    const price = live ? live.price : currentPrice;
    const priceLabel = live ? live.priceLabel : currentPriceLabel;
    const mCap = live ? live.marketCapLabel : marketCap;
    const mCapSort = live ? Math.round(live.marketCap / 1e9) : marketCapSort;

    const years = yearsSince(inceptionDate);
    const p5y = prices5yAgo[ticker] || startPrice;
    const cagrHistorico = round1(calcCAGR(startPrice, price, years));
    const cagr5y = round1(calcCAGR(p5y, price, 5));

    // Get live fundamentals
    const fund = liveFundamentals?.[ticker] || null;

    // Multi-factor projection
    const projected = computeProjectedCAGR(cagrHistorico, cagr5y, fund, price);

    // 52-week distance
    let pctFrom52wHigh: number | null = null;
    const high52 = fund?.fiftyTwoWeekHigh;
    if (high52 != null && high52 > 0) {
      pctFrom52wHigh = round1(((price - high52) / high52) * 100);
    }

    return {
      rank: i + 1,
      name, ticker, type, sector,
      currentPrice: price,
      currentPriceLabel: priceLabel,
      marketCap: mCap,
      marketCapSort: mCapSort,
      cagrHistorico,
      cagr5y,
      trailingPE: fund?.trailingPE ?? null,
      forwardPE: fund?.forwardPE ?? null,
      dividendYield: fund?.dividendYield ?? null,
      epsGrowth: fund?.epsGrowth ?? null,
      fiftyTwoWeekHigh: fund?.fiftyTwoWeekHigh ?? null,
      fiftyTwoWeekLow: fund?.fiftyTwoWeekLow ?? null,
      pctFrom52wHigh,
      cagrConservador: projected.conservador,
      cagrBase: projected.base,
      cagrOptimista: projected.optimista,
      factorCount: projected.factorCount,
      price5yConservador: projectPrice(price, projected.conservador, 5),
      price5yBase: projectPrice(price, projected.base, 5),
      price5yOptimista: projectPrice(price, projected.optimista, 5),
      price10yConservador: projectPrice(price, projected.conservador, 10),
      price10yBase: projectPrice(price, projected.base, 10),
      price10yOptimista: projectPrice(price, projected.optimista, 10),
    };
  });
}

// ─── Rendering helpers ───────────────────────────────────────────────────────

type SortKey = "marketCap" | "cagrBase" | "cagrConservador" | "cagrOptimista" | "name" | "sector";
type SortDir = "asc" | "desc";
type Horizon = "5y" | "10y";

function getTypeColor(type: string) {
  switch (type) {
    case "company": return "#52b788";
    case "commodity": return "#d4a373";
    case "crypto": return "#a78bfa";
    case "index": return "#8a9e93";
    default: return "#8a9e93";
  }
}

function formatCAGR(value: number) {
  const color = value > 20 ? "#52b788" : value > 10 ? "#95d5b2" : value > 0 ? "#8a9e93" : "#e07a5f";
  const sign = value > 0 ? "+" : "";
  return { color, label: `${sign}${value.toFixed(1)}%` };
}

function scenarioColor(scenario: "conservador" | "base" | "optimista") {
  switch (scenario) {
    case "conservador": return "#d4a373";
    case "base": return "#52b788";
    case "optimista": return "#a78bfa";
  }
}

function signalStrength(count: number): { label: string; color: string; dots: number } {
  if (count >= 6) return { label: "Alta", color: "#52b788", dots: 3 };
  if (count >= 4) return { label: "Media", color: "#d4a373", dots: 2 };
  return { label: "Baja", color: "#e07a5f", dots: 1 };
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ProyeccionesActivos({ livePrices, liveFundamentals, lastUpdated }: ProyeccionesProps) {
  const ASSETS = useMemo(() => buildProjections(livePrices, liveFundamentals), [livePrices, liveFundamentals]);
  const SECTORS = useMemo(() => Array.from(new Set(ASSETS.map((a) => a.sector))).sort(), [ASSETS]);
  const hasLiveData = !!liveFundamentals && Object.keys(liveFundamentals).length > 0;

  const [sortBy, setSortBy] = useState<SortKey>("cagrBase");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [horizon, setHorizon] = useState<Horizon>("5y");

  const [simTicker, setSimTicker] = useState("NVDA");
  const [simAmount, setSimAmount] = useState(10000);

  const handleSort = (key: SortKey) => {
    if (sortBy === key) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else { setSortBy(key); setSortDir("desc"); }
  };

  const filtered = useMemo(() => {
    let result = ASSETS;
    if (sectorFilter !== "all") result = result.filter((a) => a.sector === sectorFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((a) =>
        a.name.toLowerCase().includes(q) || a.ticker.toLowerCase().includes(q) || a.sector.toLowerCase().includes(q));
    }
    return result;
  }, [ASSETS, sectorFilter, searchQuery]);

  const sorted = useMemo(() => {
    const dir = sortDir === "desc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "marketCap": return (b.marketCapSort - a.marketCapSort) * dir;
        case "cagrBase": return (b.cagrBase - a.cagrBase) * dir;
        case "cagrConservador": return (b.cagrConservador - a.cagrConservador) * dir;
        case "cagrOptimista": return (b.cagrOptimista - a.cagrOptimista) * dir;
        case "name": return a.name.localeCompare(b.name) * dir;
        case "sector": return a.sector.localeCompare(b.sector) * dir;
        default: return 0;
      }
    });
  }, [filtered, sortBy, sortDir]);

  const topBase = useMemo(() => [...ASSETS].sort((a, b) => b.cagrBase - a.cagrBase).slice(0, 5), [ASSETS]);

  // Benchmark (S&P 500) and alpha calculations
  const spx = useMemo(() => ASSETS.find((a) => a.ticker === "SPX"), [ASSETS]);
  const benchmarkCAGR = spx?.cagrBase ?? 0;
  const assetsAboveBenchmark = useMemo(
    () => ASSETS.filter((a) => a.ticker !== "SPX" && a.cagrBase > benchmarkCAGR)
      .sort((a, b) => b.cagrBase - a.cagrBase),
    [ASSETS, benchmarkCAGR]
  );
  const topAlpha = useMemo(() => assetsAboveBenchmark.slice(0, 5), [assetsAboveBenchmark]);
  const avgAlpha = useMemo(
    () => assetsAboveBenchmark.length > 0
      ? round1(assetsAboveBenchmark.reduce((sum, a) => sum + (a.cagrBase - benchmarkCAGR), 0) / assetsAboveBenchmark.length)
      : 0,
    [assetsAboveBenchmark, benchmarkCAGR]
  );

  const simAsset = ASSETS.find((a) => a.ticker === simTicker) || ASSETS[0];
  const simYears = horizon === "5y" ? 5 : 10;
  const simResults = {
    conservador: simAmount * Math.pow(1 + simAsset.cagrConservador / 100, simYears),
    base: simAmount * Math.pow(1 + simAsset.cagrBase / 100, simYears),
    optimista: simAmount * Math.pow(1 + simAsset.cagrOptimista / 100, simYears),
  };
  const simSignal = signalStrength(simAsset.factorCount);

  return (
    <div>
      {/* ── Hero ── */}
      <section style={{ padding: "4rem 0 2rem", textAlign: "center" }}>
        <div className="animate-fade-up" style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          padding: "0.4rem 1rem", border: "1px solid rgba(167, 139, 250, 0.2)",
          borderRadius: "100px", fontSize: "0.75rem", fontWeight: 500, color: "#c4b5fd",
          letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "2rem",
          background: "rgba(167, 139, 250, 0.1)",
        }}>
          <span className="animate-pulse-dot" style={{ width: "6px", height: "6px", background: "#a78bfa", borderRadius: "50%" }} />
          Proyecciones a Futuro{lastUpdated ? ` · Datos ${new Date(lastUpdated).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" })}` : " · Febrero 2026"}
        </div>
        <h2 className="animate-fade-up animate-delay-1 hero-title-responsive" style={{
          fontFamily: "var(--font-display)", fontSize: "2.8rem", fontWeight: 400, lineHeight: 1.15,
          marginBottom: "1rem", color: "#e8efe6",
        }}>
          Proyecciones de<br />Rendimiento
        </h2>
        <p className="animate-fade-up animate-delay-2" style={{
          fontSize: "1.05rem", color: "#8a9e93", maxWidth: "640px", margin: "0 auto", fontWeight: 300,
        }}>
          Modelo multi-factor que combina CAGR histórico con datos fundamentales en vivo:
          P/E ratio, crecimiento de GPA, rendimiento por dividendo y posición en rango de 52 semanas.
        </p>

        {/* Live data indicator + disclaimer stacked and centered */}
        <div className="animate-fade-up animate-delay-2" style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", marginTop: "1.5rem",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            padding: "0.35rem 0.85rem", borderRadius: "100px",
            border: `1px solid ${hasLiveData ? "rgba(82, 183, 136, 0.3)" : "rgba(224, 122, 95, 0.3)"}`,
            background: hasLiveData ? "rgba(82, 183, 136, 0.08)" : "rgba(224, 122, 95, 0.08)",
            fontSize: "0.7rem", color: hasLiveData ? "#52b788" : "#e07a5f",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: hasLiveData ? "#52b788" : "#e07a5f" }} />
            {hasLiveData ? "Datos fundamentales en vivo" : "Usando datos estáticos (sin datos fundamentales)"}
          </div>

          <div style={{
            padding: "0.6rem 1.25rem",
            background: "rgba(224, 122, 95, 0.08)", border: "1px solid rgba(224, 122, 95, 0.2)",
            borderRadius: "8px", fontSize: "0.72rem", color: "#e07a5f", fontWeight: 500,
            letterSpacing: "0.02em", maxWidth: "640px", textAlign: "center",
          }}>
            ESPECULATIVO — Las proyecciones son ejercicios matemáticos. NO constituyen predicciones,
            asesoría financiera ni recomendaciones de inversión. Los rendimientos pasados no garantizan resultados futuros.
          </div>
        </div>
      </section>

      {/* ── Model factors ── */}
      <section className="animate-fade-up animate-delay-3 stats-grid-responsive" style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2.5rem",
      }}>
        {([
          { label: "Conservador", color: "#d4a373",
            formula: "mín(CAGRs) × 0.70 + Dividendo",
            desc: "Toma el menor de los dos CAGRs con recorte del 30%. Mejora si P/E bajo o precio cerca del mínimo de 52 semanas." },
          { label: "Base", color: "#52b788",
            formula: "CAGR combinado + ajuste P/E + crec. GPA + Div",
            desc: "Promedio ponderado (40% histórico + 60% reciente), ajustado por valuación, GPA y dividendos." },
          { label: "Optimista", color: "#a78bfa",
            formula: "máx(CAGRs) + impulso GPA + Div",
            desc: "El mayor de los dos CAGRs sostenido, con impulso por GPA fuerte. Moderado si cerca del máximo de 52 semanas." },
        ] as const).map((s) => (
          <div key={s.label} style={{
            background: "#111a16", border: `1px solid ${s.color}33`, borderRadius: "12px",
            padding: "1.5rem", borderLeft: `3px solid ${s.color}`,
          }}>
            <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#5a6e63", marginBottom: "0.5rem" }}>Escenario</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: s.color, marginBottom: "0.35rem" }}>{s.label}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: s.color, marginBottom: "0.75rem", opacity: 0.8 }}>{s.formula}</div>
            <p style={{ fontSize: "0.78rem", color: "#8a9e93", lineHeight: 1.5 }}>{s.desc}</p>
          </div>
        ))}
      </section>

      {/* ── Simulator ── */}
      <section className="animate-fade-up animate-delay-4" style={{ marginBottom: "3rem" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "#e8efe6", marginBottom: "1.25rem" }}>
          Simulador de Inversión
        </h3>
        <div style={{ background: "#111a16", border: "1px solid rgba(45, 106, 79, 0.2)", borderRadius: "12px", padding: "1.5rem" }}>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ flex: "1 1 200px" }}>
              <label style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#5a6e63", marginBottom: "0.4rem" }}>Activo</label>
              <select value={simTicker} onChange={(e) => setSimTicker(e.target.value)} style={{
                width: "100%", padding: "0.5rem 0.75rem", background: "#0a0f0d",
                border: "1px solid rgba(45, 106, 79, 0.25)", borderRadius: "8px",
                color: "#e8efe6", fontSize: "0.85rem", fontFamily: "inherit", cursor: "pointer",
              }}>
                {ASSETS.map((a) => <option key={a.ticker} value={a.ticker}>{a.ticker} — {a.name}</option>)}
              </select>
            </div>
            <div style={{ flex: "0 1 180px" }}>
              <label style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#5a6e63", marginBottom: "0.4rem" }}>Monto (USD)</label>
              <input type="number" value={simAmount} onChange={(e) => setSimAmount(Math.max(0, Number(e.target.value)))} style={{
                width: "100%", padding: "0.5rem 0.75rem", background: "#0a0f0d",
                border: "1px solid rgba(45, 106, 79, 0.25)", borderRadius: "8px",
                color: "#e8efe6", fontSize: "0.85rem", fontFamily: "var(--font-mono)",
              }} />
            </div>
            <div style={{ flex: "0 0 auto" }}>
              <label style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#5a6e63", marginBottom: "0.4rem" }}>Horizonte</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {(["5y", "10y"] as Horizon[]).map((h) => (
                  <button key={h} onClick={() => setHorizon(h)} style={{
                    padding: "0.5rem 1rem", borderRadius: "8px",
                    border: `1px solid ${horizon === h ? "#52b788" : "rgba(45, 106, 79, 0.25)"}`,
                    background: horizon === h ? "rgba(82, 183, 136, 0.15)" : "transparent",
                    color: horizon === h ? "#52b788" : "#8a9e93", fontSize: "0.85rem", fontWeight: 600,
                    cursor: "pointer", fontFamily: "var(--font-mono)", transition: "all 0.2s",
                  }}>{h === "5y" ? "5 Años" : "10 Años"}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Fundamentals strip for selected asset */}
          <div style={{
            display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "1.25rem",
            padding: "0.75rem 1rem", background: "#0a0f0d", borderRadius: "8px",
            border: "1px solid rgba(45, 106, 79, 0.15)",
          }}>
            {([
              { label: "P/E Actual", value: simAsset.trailingPE != null ? simAsset.trailingPE.toFixed(1) : "—" },
              { label: "P/E Proyectado", value: simAsset.forwardPE != null ? simAsset.forwardPE.toFixed(1) : "—" },
              { label: "Rend. Div.", value: simAsset.dividendYield != null ? `${(simAsset.dividendYield * 100).toFixed(2)}%` : "—" },
              { label: "Crec. GPA", value: simAsset.epsGrowth != null ? `${(simAsset.epsGrowth * 100).toFixed(1)}%` : "—" },
              { label: "vs Máx 52s", value: simAsset.pctFrom52wHigh != null ? `${simAsset.pctFrom52wHigh}%` : "—" },
              { label: "Factores", value: `${simAsset.factorCount}/7` },
            ]).map((item) => (
              <div key={item.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#5a6e63", marginBottom: "0.2rem" }}>{item.label}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "#e8efe6" }}>{item.value}</div>
              </div>
            ))}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#5a6e63", marginBottom: "0.2rem" }}>Confianza</div>
              <div style={{ display: "flex", gap: "3px", justifyContent: "center", alignItems: "center" }}>
                {[1, 2, 3].map((dot) => (
                  <span key={dot} style={{
                    width: "6px", height: "6px", borderRadius: "50%",
                    background: dot <= simSignal.dots ? simSignal.color : "rgba(90, 110, 99, 0.3)",
                  }} />
                ))}
                <span style={{ fontSize: "0.7rem", color: simSignal.color, marginLeft: "0.3rem" }}>{simSignal.label}</span>
              </div>
            </div>
          </div>

          {/* Simulator results */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }} className="stats-grid-responsive">
            {([
              { label: "Conservador", key: "conservador" as const, cagr: simAsset.cagrConservador },
              { label: "Base", key: "base" as const, cagr: simAsset.cagrBase },
              { label: "Optimista", key: "optimista" as const, cagr: simAsset.cagrOptimista },
            ]).map((s) => {
              const finalValue = simResults[s.key];
              const gain = finalValue - simAmount;
              const returnPct = simAmount > 0 ? ((finalValue / simAmount - 1) * 100) : 0;
              const color = scenarioColor(s.key);
              return (
                <div key={s.key} style={{
                  background: "#0a0f0d", border: `1px solid ${color}33`, borderRadius: "10px",
                  padding: "1.25rem", textAlign: "center",
                }}>
                  <div style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color, marginBottom: "0.3rem" }}>{s.label}</div>
                  <div style={{ fontSize: "0.7rem", color: "#5a6e63", marginBottom: "0.75rem" }}>CAGR: {s.cagr > 0 ? "+" : ""}{s.cagr}%</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", color: "#e8efe6", marginBottom: "0.25rem" }}>{formatUSD(finalValue)}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: gain >= 0 ? "#52b788" : "#e07a5f" }}>
                    {gain >= 0 ? "+" : ""}{formatUSD(gain)} ({returnPct >= 0 ? "+" : ""}{returnPct.toFixed(0)}%)
                  </div>
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: "0.68rem", color: "#5a6e63", marginTop: "1rem", textAlign: "center", fontStyle: "italic" }}>
            Simulación puramente ilustrativa. No constituye recomendación de inversión.
          </p>
        </div>
      </section>

      {/* ── Costo de Oportunidad del Capital ── */}
      {spx && (
        <section style={{ marginBottom: "3rem" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "#e8efe6", marginBottom: "0.5rem" }}>
            Costo de Oportunidad del Capital
          </h3>
          <p style={{ fontSize: "0.82rem", color: "#8a9e93", marginBottom: "1.25rem", maxWidth: "640px" }}>
            El S&P 500 es el benchmark pasivo en USD. Cualquier activo que no supere este CAGR destruye valor relativo
            — porque podrías obtener este retorno sin esfuerzo con un ETF (SPY/VOO).
          </p>

          <div style={{ background: "#111a16", border: "1px solid rgba(45, 106, 79, 0.2)", borderRadius: "12px", padding: "1.5rem" }}>
            {/* Benchmark card */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "1rem 1.25rem", background: "#0a0f0d", borderRadius: "10px",
              border: "1px solid rgba(138, 158, 147, 0.2)", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem",
            }}>
              <div>
                <div style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#5a6e63", marginBottom: "0.3rem" }}>
                  Referencia — Tasa Mínima
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "#8a9e93" }}>SPX</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "#e8efe6" }}>S&P 500</span>
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#5a6e63", marginBottom: "0.2rem" }}>CAGR Base</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", color: "#8a9e93" }}>+{benchmarkCAGR}%</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#5a6e93", marginBottom: "0.2rem" }}>
                  $10K → {horizon === "5y" ? "2031" : "2036"}
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "1.1rem", color: "#8a9e93" }}>
                  {formatUSD(10000 * Math.pow(1 + benchmarkCAGR / 100, horizon === "5y" ? 5 : 10))}
                </div>
              </div>
              <div style={{ fontSize: "0.68rem", color: "#5a6e63", fontStyle: "italic", flex: "1 1 100%" }}>
                Retorno nominal en USD. Invertir pasivamente en SPY/VOO requiere cero análisis.
              </div>
            </div>

            {/* Stats row */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem",
            }} className="stats-grid-responsive">
              <div style={{
                background: "#0a0f0d", borderRadius: "10px", padding: "1rem", textAlign: "center",
                border: "1px solid rgba(82, 183, 136, 0.15)",
              }}>
                <div style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#5a6e63", marginBottom: "0.3rem" }}>Superan referencia</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "#52b788" }}>
                  {assetsAboveBenchmark.length}
                  <span style={{ fontSize: "0.8rem", color: "#5a6e63" }}> / {ASSETS.length - 1}</span>
                </div>
              </div>
              <div style={{
                background: "#0a0f0d", borderRadius: "10px", padding: "1rem", textAlign: "center",
                border: "1px solid rgba(82, 183, 136, 0.15)",
              }}>
                <div style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#5a6e63", marginBottom: "0.3rem" }}>Exceso promedio</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "#52b788" }}>+{avgAlpha}%</div>
              </div>
              <div style={{
                background: "#0a0f0d", borderRadius: "10px", padding: "1rem", textAlign: "center",
                border: "1px solid rgba(224, 122, 95, 0.15)",
              }}>
                <div style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#5a6e63", marginBottom: "0.3rem" }}>No superan</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "#e07a5f" }}>
                  {ASSETS.length - 1 - assetsAboveBenchmark.length}
                  <span style={{ fontSize: "0.8rem", color: "#5a6e63" }}> / {ASSETS.length - 1}</span>
                </div>
              </div>
            </div>

            {/* Proportion bar */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{
                height: "8px", background: "rgba(224, 122, 95, 0.2)", borderRadius: "4px", overflow: "hidden",
              }}>
                <div style={{
                  height: "100%",
                  width: `${(assetsAboveBenchmark.length / (ASSETS.length - 1)) * 100}%`,
                  background: "linear-gradient(90deg, #2d6a4f, #52b788)",
                  borderRadius: "4px",
                  transition: "width 0.5s ease",
                }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.3rem" }}>
                <span style={{ fontSize: "0.65rem", color: "#52b788" }}>Superan al índice</span>
                <span style={{ fontSize: "0.65rem", color: "#e07a5f" }}>No superan al índice</span>
              </div>
            </div>

            {/* Top 5 Alpha table */}
            <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#5a6e63", marginBottom: "0.75rem" }}>
              Top 5 — Mayor Exceso vs S&P 500
            </div>
            {topAlpha.map((asset, i) => {
              const alpha = round1(asset.cagrBase - benchmarkCAGR);
              const spxResult = 10000 * Math.pow(1 + benchmarkCAGR / 100, horizon === "5y" ? 5 : 10);
              const assetResult = 10000 * Math.pow(1 + asset.cagrBase / 100, horizon === "5y" ? 5 : 10);
              const extraGain = assetResult - spxResult;
              return (
                <div key={asset.ticker} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "0.6rem 0.75rem", borderBottom: i < 4 ? "1px solid rgba(45, 106, 79, 0.1)" : "none",
                  flexWrap: "wrap", gap: "0.5rem",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: "1 1 200px" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: getTypeColor(asset.type) }}>{asset.ticker}</span>
                    <span style={{ fontSize: "0.82rem", color: "#e8efe6" }}>{asset.name}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "0.6rem", color: "#5a6e63" }}>CAGR Base</div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "#52b788", fontWeight: 600 }}>+{asset.cagrBase}%</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "0.6rem", color: "#5a6e63" }}>Exceso</div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "#a78bfa", fontWeight: 600 }}>+{alpha}%</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "0.6rem", color: "#5a6e63" }}>Ganancia extra / $10K</div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "#52b788" }}>+{formatUSD(extraGain)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
            <p style={{ fontSize: "0.68rem", color: "#5a6e63", marginTop: "1rem", fontStyle: "italic" }}>
              Exceso = CAGR Base del activo menos CAGR Base del S&P 500. Ganancia extra muestra la diferencia sobre $10K invertidos a {horizon === "5y" ? "5" : "10"} años vs el mismo monto en SPX.
            </p>
          </div>
        </section>
      )}

      {/* ── Top 5 bars ── */}
      <section style={{ marginBottom: "3rem" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "#e8efe6", marginBottom: "1.25rem" }}>
          Top 5 — Mejor CAGR Proyectado (Base)
        </h3>
        <div style={{ background: "#111a16", border: "1px solid rgba(45, 106, 79, 0.2)", borderRadius: "12px", padding: "1.5rem" }}>
          {topBase.map((asset, i) => {
            const priceTarget = horizon === "5y" ? asset.price5yBase : asset.price10yBase;
            const sig = signalStrength(asset.factorCount);
            return (
              <div key={asset.ticker} style={{ marginBottom: i < 4 ? "1rem" : 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                  <span style={{ fontSize: "0.8rem", color: "#e8efe6" }}>
                    <span style={{ color: getTypeColor(asset.type), fontFamily: "var(--font-mono)", fontSize: "0.7rem", marginRight: "0.5rem" }}>{asset.ticker}</span>
                    {asset.name}
                    <span style={{ marginLeft: "0.5rem", display: "inline-flex", gap: "2px", verticalAlign: "middle" }}>
                      {[1, 2, 3].map((dot) => (
                        <span key={dot} style={{ width: "4px", height: "4px", borderRadius: "50%", background: dot <= sig.dots ? sig.color : "rgba(90, 110, 99, 0.3)", display: "inline-block" }} />
                      ))}
                    </span>
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "#52b788" }}>+{asset.cagrBase}% anual</span>
                </div>
                <div style={{ height: "6px", background: "rgba(45, 106, 79, 0.15)", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${Math.min((asset.cagrBase / topBase[0].cagrBase) * 100, 100)}%`,
                    background: "linear-gradient(90deg, #2d6a4f, #52b788)", borderRadius: "3px", transition: "width 1s ease",
                  }} />
                </div>
                <div style={{ fontSize: "0.65rem", color: "#5a6e63", marginTop: "0.2rem" }}>
                  {asset.currentPriceLabel} hoy → {formatPrice(priceTarget)} proyectado ({horizon === "5y" ? "2031" : "2036"})
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Table ── */}
      <section style={{ marginBottom: "3rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "#e8efe6" }}>
            Tabla de Proyecciones — {horizon === "5y" ? "5 Años (2031)" : "10 Años (2036)"}
          </h3>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "#5a6e63" }}>{sorted.length} de {ASSETS.length} activos</span>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: "1 1 250px", maxWidth: "350px" }}>
            <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#5a6e63", fontSize: "0.8rem", pointerEvents: "none" }}>&#x1F50D;</span>
            <input type="text" placeholder="Buscar activo, ticker o sector..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{
              width: "100%", padding: "0.5rem 0.75rem 0.5rem 2.25rem", background: "#111a16",
              border: "1px solid rgba(45, 106, 79, 0.25)", borderRadius: "8px", color: "#e8efe6",
              fontSize: "0.8rem", outline: "none", fontFamily: "inherit",
            }} />
          </div>
          <select value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)} style={{
            padding: "0.5rem 0.75rem", background: "#111a16", border: "1px solid rgba(45, 106, 79, 0.25)",
            borderRadius: "8px", color: sectorFilter === "all" ? "#8a9e93" : "#95d5b2",
            fontSize: "0.8rem", cursor: "pointer", fontFamily: "inherit", minWidth: "160px",
          }}>
            <option value="all">Todos los sectores</option>
            {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            {(["5y", "10y"] as Horizon[]).map((h) => (
              <button key={h} onClick={() => setHorizon(h)} style={{
                padding: "0.45rem 0.85rem", borderRadius: "8px",
                border: `1px solid ${horizon === h ? "#52b788" : "rgba(45, 106, 79, 0.25)"}`,
                background: horizon === h ? "rgba(82, 183, 136, 0.15)" : "transparent",
                color: horizon === h ? "#52b788" : "#8a9e93", fontSize: "0.75rem", fontWeight: 600,
                cursor: "pointer", fontFamily: "var(--font-mono)", transition: "all 0.2s",
              }}>{h === "5y" ? "5 Años" : "10 Años"}</button>
            ))}
          </div>
          {(searchQuery || sectorFilter !== "all") && (
            <button onClick={() => { setSearchQuery(""); setSectorFilter("all"); }} style={{
              padding: "0.45rem 0.85rem", borderRadius: "8px", border: "1px solid rgba(224, 122, 95, 0.3)",
              background: "rgba(224, 122, 95, 0.1)", color: "#e07a5f", fontSize: "0.75rem", fontWeight: 500,
              cursor: "pointer", transition: "all 0.2s",
            }}>Limpiar filtros</button>
          )}
        </div>

        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", margin: "0 -0.5rem", padding: "0 0.5rem" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem", minWidth: "750px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(45, 106, 79, 0.3)" }}>
                {([
                  { label: "#", key: null, align: "left" },
                  { label: "Activo", key: "name" as SortKey, align: "left" },
                  { label: "Sector", key: "sector" as SortKey, align: "left" },
                  { label: "Precio", key: null, align: "right" },
                  { label: "P/E Proy.", key: null, align: "right" },
                  { label: "Conservador", key: "cagrConservador" as SortKey, align: "right" },
                  { label: "Base", key: "cagrBase" as SortKey, align: "right" },
                  { label: "Optimista", key: "cagrOptimista" as SortKey, align: "right" },
                  { label: `Precio ${horizon === "5y" ? "2031" : "2036"}`, key: null, align: "right" },
                ] as const).map((col) => (
                  <th key={col.label} onClick={col.key ? () => handleSort(col.key!) : undefined} style={{
                    padding: "0.75rem 0.5rem", textAlign: col.align as "left" | "right",
                    color: sortBy === col.key ? "#95d5b2" : "#5a6e63", fontWeight: 600,
                    fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em",
                    whiteSpace: "nowrap", cursor: col.key ? "pointer" : "default",
                    userSelect: "none", transition: "color 0.2s",
                  }}>
                    {col.label}
                    {col.key && sortBy === col.key && <span style={{ marginLeft: "0.3rem", fontSize: "0.6rem" }}>{sortDir === "desc" ? "\u25BC" : "\u25B2"}</span>}
                    {col.key && sortBy !== col.key && <span style={{ marginLeft: "0.3rem", fontSize: "0.6rem", opacity: 0.3 }}>{"\u25BC"}</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 && (
                <tr><td colSpan={9} style={{ padding: "2rem", textAlign: "center", color: "#5a6e63", fontStyle: "italic" }}>No se encontraron activos.</td></tr>
              )}
              {sorted.map((asset, i) => {
                const cC = formatCAGR(asset.cagrConservador);
                const cB = formatCAGR(asset.cagrBase);
                const cO = formatCAGR(asset.cagrOptimista);
                const projectedPrice = horizon === "5y" ? asset.price5yBase : asset.price10yBase;
                const isHovered = hoveredRow === i;
                return (
                  <tr key={asset.ticker} onMouseEnter={() => setHoveredRow(i)} onMouseLeave={() => setHoveredRow(null)} style={{
                    borderBottom: "1px solid rgba(45, 106, 79, 0.1)",
                    background: isHovered ? "rgba(45, 106, 79, 0.08)" : "transparent", transition: "background 0.2s",
                  }}>
                    <td style={{ padding: "0.65rem 0.5rem", color: "#5a6e63", fontFamily: "var(--font-mono)", fontSize: "0.7rem" }}>{i + 1}</td>
                    <td style={{ padding: "0.65rem 0.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ color: "#e8efe6", fontWeight: 500 }}>{asset.name}</span>
                        <span style={{ color: "#5a6e63", fontFamily: "var(--font-mono)", fontSize: "0.7rem" }}>{asset.ticker}</span>
                      </div>
                    </td>
                    <td style={{ padding: "0.65rem 0.5rem" }}>
                      <span onClick={() => setSectorFilter(asset.sector)} style={{
                        fontSize: "0.65rem", padding: "0.15rem 0.5rem", borderRadius: "100px",
                        border: `1px solid ${getTypeColor(asset.type)}33`, color: getTypeColor(asset.type),
                        background: `${getTypeColor(asset.type)}15`, whiteSpace: "nowrap", cursor: "pointer", transition: "all 0.2s",
                      }}>{asset.sector}</span>
                    </td>
                    <td style={{ padding: "0.65rem 0.5rem", textAlign: "right", fontFamily: "var(--font-mono)", color: "#e8efe6", fontSize: "0.8rem" }}>{asset.currentPriceLabel}</td>
                    <td style={{ padding: "0.65rem 0.5rem", textAlign: "right", fontFamily: "var(--font-mono)", color: "#8a9e93", fontSize: "0.78rem" }}>
                      {asset.forwardPE != null ? asset.forwardPE.toFixed(1) : "—"}
                    </td>
                    <td style={{ padding: "0.65rem 0.5rem", textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 600, color: cC.color }}>{cC.label}</td>
                    <td style={{ padding: "0.65rem 0.5rem", textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 600, color: cB.color }}>{cB.label}</td>
                    <td style={{ padding: "0.65rem 0.5rem", textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 600, color: cO.color }}>{cO.label}</td>
                    <td style={{ padding: "0.65rem 0.5rem", textAlign: "right", fontFamily: "var(--font-mono)", color: "#95d5b2", fontSize: "0.8rem" }}>{formatPrice(projectedPrice)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Methodology ── */}
      <section style={{ background: "#111a16", border: "1px solid rgba(45, 106, 79, 0.2)", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
        <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "#e8efe6", marginBottom: "0.75rem" }}>Modelo Multi-Factor</h4>
        <div style={{ fontSize: "0.78rem", color: "#8a9e93", lineHeight: 1.7 }}>
          <p style={{ marginBottom: "0.5rem" }}>
            <strong style={{ color: "#95d5b2" }}>Base</strong>: CAGR ponderado (40% histórico + 60% reciente 5 años).
            Si datos fundamentales están disponibles, se ajusta por:
          </p>
          <p style={{ marginBottom: "0.5rem", paddingLeft: "1rem" }}>
            <strong style={{ color: "#52b788" }}>Valuación P/E</strong> — P/E proyectado &gt; 35 penaliza; &lt; 15 beneficia.
            P/E en contracción (proyectado &lt; actual) indica expectativa de crecimiento.
          </p>
          <p style={{ marginBottom: "0.5rem", paddingLeft: "1rem" }}>
            <strong style={{ color: "#52b788" }}>Crecimiento de GPA</strong> — Crecimiento de ganancias por acción
            (actual vs proyectado) se incorpora con 20% de peso en el escenario base.
          </p>
          <p style={{ marginBottom: "0.5rem", paddingLeft: "1rem" }}>
            <strong style={{ color: "#52b788" }}>Rendimiento por dividendo</strong> — Se suma al retorno total proyectado
            en los tres escenarios.
          </p>
          <p style={{ marginBottom: "0.5rem", paddingLeft: "1rem" }}>
            <strong style={{ color: "#52b788" }}>Rango de 52 semanas</strong> — Precio cerca del mínimo de 52 semanas
            mejora el escenario conservador; cerca del máximo modera el optimista.
          </p>
          <p style={{ marginBottom: "0.5rem" }}>
            <strong style={{ color: "#d4a373" }}>Indicador de confianza</strong> — Los puntos muestran cuántos
            factores están disponibles para cada activo (2-7). Más factores = proyección más informada.
          </p>
          <p>
            <Link href="/proyecciones/metodologia" style={{
              color: "#a78bfa", textDecoration: "none", fontSize: "0.82rem", fontWeight: 500,
              borderBottom: "1px solid rgba(167, 139, 250, 0.3)", paddingBottom: "1px",
            }}>
              Ver documentación completa del modelo →
            </Link>
          </p>
        </div>
      </section>

      {/* ── Disclaimer ── */}
      <section style={{
        background: "rgba(224, 122, 95, 0.05)", border: "1px solid rgba(224, 122, 95, 0.15)",
        borderRadius: "12px", padding: "1.5rem", marginBottom: "2rem",
      }}>
        <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "#e07a5f", marginBottom: "0.75rem" }}>Aviso Legal</h4>
        <div style={{ fontSize: "0.75rem", color: "#8a9e93", lineHeight: 1.8 }}>
          <p style={{ marginBottom: "0.6rem" }}>
            <strong style={{ color: "#e07a5f" }}>Este contenido es puramente especulativo, informativo y educativo.</strong>{" "}
            Las proyecciones son ejercicios matemáticos que combinan datos históricos con fundamentales de mercado.
            NO constituyen predicciones, asesoría financiera, recomendación de inversión ni oferta de valores.
          </p>
          <p style={{ marginBottom: "0.6rem" }}>
            <strong style={{ color: "#e07a5f" }}>Los rendimientos pasados y los fundamentales actuales no garantizan resultados futuros.</strong>{" "}
            Los mercados son inherentemente impredecibles. Los precios reales pueden diferir drásticamente de cualquier proyección.
          </p>
          <p style={{ marginBottom: "0.6rem" }}>
            Los modelos no consideran: cambios regulatorios, disrupciones tecnológicas, recesiones, guerras,
            inflación, cambios en tasas de interés, ni otros eventos que impacten precios.
          </p>
          <p style={{ marginBottom: "0.6rem" }}>
            Consulte con un asesor financiero acreditado antes de invertir.
            Los Álamos Capital SpA NO se encuentra regulada por la CMF de Chile ni acepta capital de terceros.
          </p>
          <p>La información se proporciona &quot;tal cual&quot; sin garantías de ningún tipo.</p>
        </div>
      </section>
    </div>
  );
}
