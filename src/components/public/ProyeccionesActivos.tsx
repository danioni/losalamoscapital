"use client";

import { useState, useMemo } from "react";

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
  // Projected CAGRs
  cagrConservador: number;
  cagrBase: number;
  cagrOptimista: number;
  // Projected prices at 5 years
  price5yConservador: number;
  price5yBase: number;
  price5yOptimista: number;
  // Projected prices at 10 years
  price10yConservador: number;
  price10yBase: number;
  price10yOptimista: number;
}

interface LivePrices {
  [ticker: string]: {
    price: number;
    priceLabel: string;
    marketCap: number;
    marketCapLabel: string;
  };
}

interface ProyeccionesProps {
  livePrices?: LivePrices;
  lastUpdated?: string | null;
}

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

function buildProjections(livePrices?: LivePrices): AssetProjection[] {
  const now = livePrices ? new Date() : new Date("2026-02-06");
  const yearsSince = (d: string) =>
    (now.getTime() - new Date(d).getTime()) / (365.25 * 24 * 60 * 60 * 1000);

  type R = [string, string, "company"|"commodity"|"crypto"|"index", string, string, number, number, string, string, number];
  // [name, ticker, type, sector, inceptionDate, startPrice, currentPrice, currentPriceLabel, marketCap, marketCapSort]
  const d: R[] = [
    ["Gold", "XAU", "commodity", "Commodity", "1971-08-15", 35, 4800, "$4,800/oz", "$19.4T", 19400],
    ["Silver", "XAG", "commodity", "Commodity", "1971-08-15", 1.39, 75, "$75/oz", "$1.6T", 1600],
    ["Bitcoin", "BTC", "crypto", "Crypto", "2013-01-01", 13.3, 62000, "$62,000", "$1.2T", 1200],
    ["S&P 500", "SPX", "index", "Indice", "1957-03-04", 44.06, 6000, "6,000", "Benchmark", 0],
    ["NVIDIA", "NVDA", "company", "Semiconductores", "1999-01-22", 0.04, 185.14, "$185.14", "$4.51T", 4507],
    ["Apple", "AAPL", "company", "Tech", "1980-12-12", 0.10, 277.92, "$277.92", "$4.08T", 4084],
    ["Alphabet", "GOOGL", "company", "Tech", "2004-08-19", 1.27, 322.89, "$322.89", "$3.91T", 3906],
    ["Microsoft", "MSFT", "company", "Tech", "1986-03-13", 0.07, 399.78, "$399.78", "$2.97T", 2971],
    ["Amazon", "AMZN", "company", "E-Commerce", "1997-05-15", 0.075, 206.96, "$206.96", "$2.21T", 2212],
    ["TSMC", "TSM", "company", "Semiconductores", "1997-10-08", 1.17, 348.61, "$348.61", "$1.81T", 1808],
    ["Meta", "META", "company", "Tech", "2012-05-18", 38, 658, "$658", "$1.66T", 1664],
    ["Saudi Aramco", "2222.SR", "company", "Energía", "2019-12-11", 32, 25.60, "25.60 SAR", "$1.65T", 1650],
    ["Broadcom", "AVGO", "company", "Semiconductores", "2009-08-06", 1.53, 333.28, "$333.28", "$1.58T", 1580],
    ["Tesla", "TSLA", "company", "Automotriz", "2010-06-29", 1.13, 413.85, "$413.85", "$1.55T", 1552],
    ["Berkshire Hathaway", "BRK.B", "company", "Financiero", "1965-05-10", 0.012, 505.84, "$505.84", "$1.09T", 1091],
    ["Walmart", "WMT", "company", "Retail", "1970-10-01", 0.006, 130.89, "$130.89", "$1.04T", 1043],
    ["Eli Lilly", "LLY", "company", "Pharma", "1952-01-01", 0.085, 1057, "$1,057", "$947B", 947],
    ["JPMorgan Chase", "JPM", "company", "Financiero", "1969-03-05", 0.52, 323.13, "$323.13", "$880B", 880],
    ["Samsung", "005930.KS", "company", "Semiconductores", "1975-06-11", 0.05, 108.42, "$108.42", "$725B", 725],
    ["Tencent", "TCEHY", "company", "Tech", "2004-06-16", 0.07, 71.22, "$71.22", "$642B", 642],
    ["Visa", "V", "company", "Pagos", "2008-03-19", 11, 329.96, "$329.96", "$636B", 636],
    ["Exxon Mobil", "XOM", "company", "Energía", "1920-01-01", 0.001, 149.12, "$149.12", "$629B", 629],
    ["Johnson & Johnson", "JNJ", "company", "Pharma", "1944-09-24", 0.025, 240.61, "$240.61", "$580B", 580],
    ["ASML", "ASML", "company", "Semiconductores", "1995-03-14", 0.55, 1411, "$1,411", "$548B", 548],
    ["Mastercard", "MA", "company", "Pagos", "2006-05-25", 3.90, 545.74, "$545.74", "$488B", 488],
    ["Costco", "COST", "company", "Retail", "1985-12-01", 2.50, 998.12, "$998.12", "$443B", 443],
    ["Micron", "MU", "company", "Semiconductores", "1984-06-01", 0.07, 393.65, "$393.65", "$443B", 443],
    ["Bank of America", "BAC", "company", "Financiero", "1973-01-02", 0.08, 56.52, "$56.52", "$413B", 413],
    ["Oracle", "ORCL", "company", "Tech", "1986-03-12", 0.03, 140.86, "$140.86", "$405B", 405],
    ["AbbVie", "ABBV", "company", "Pharma", "2013-01-02", 35.23, 224.38, "$224.38", "$397B", 397],
    ["Alibaba", "BABA", "company", "E-Commerce", "2014-09-19", 68, 161.90, "$161.90", "$387B", 387],
    ["Home Depot", "HD", "company", "Retail", "1981-09-29", 0.03, 385.20, "$385.20", "$383B", 383],
    ["Procter & Gamble", "PG", "company", "Consumo", "1890-01-01", 0.0005, 159.10, "$159.10", "$372B", 372],
    ["Roche", "ROG.SW", "company", "Pharma", "1956-05-01", 0.15, 459.69, "$459.69", "$366B", 366],
    ["Chevron", "CVX", "company", "Energía", "1921-06-01", 0.001, 180.34, "$180.34", "$361B", 361],
    ["Netflix", "NFLX", "company", "Tech", "2002-05-23", 0.054, 81.27, "$81.27", "$345B", 345],
    ["Coca-Cola", "KO", "company", "Consumo", "1919-09-05", 0.00002, 78.92, "$78.92", "$340B", 340],
    ["General Electric", "GE", "company", "Industrial", "1892-04-15", 0.008, 321.88, "$321.88", "$340B", 340],
    ["Caterpillar", "CAT", "company", "Industrial", "1929-12-02", 0.07, 724.18, "$724.18", "$339B", 339],
    ["AMD", "AMD", "company", "Semiconductores", "1972-09-27", 0.05, 206.84, "$206.84", "$337B", 337],
    ["Cisco", "CSCO", "company", "Tech", "1990-02-16", 0.04, 84.60, "$84.60", "$334B", 334],
    ["Palantir", "PLTR", "company", "Tech / IA", "2020-09-30", 9.50, 135.38, "$135.38", "$323B", 323],
    ["Toyota", "TM", "company", "Automotriz", "1949-05-01", 0.01, 244.69, "$244.69", "$320B", 320],
    ["LVMH", "MC.PA", "company", "Lujo", "1987-06-01", 0.35, 633.96, "$633.96", "$315B", 315],
    ["HSBC", "HSBC", "company", "Financiero", "1991-01-01", 2.50, 89.38, "$89.38", "$307B", 307],
    ["Merck", "MRK", "company", "Pharma", "1946-01-01", 0.015, 121.87, "$121.87", "$304B", 304],
    ["Novartis", "NVS", "company", "Pharma", "1996-12-20", 12.50, 156.25, "$156.25", "$302B", 302],
    ["AstraZeneca", "AZN", "company", "Pharma", "1999-04-06", 14, 193.58, "$193.58", "$300B", 300],
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
    const cagrHistorico = Math.round(calcCAGR(startPrice, price, years) * 10) / 10;
    const cagr5y = Math.round(calcCAGR(p5y, price, 5) * 10) / 10;

    // --- Projection Models ---
    // Conservador: historical CAGR reduced 30% (mean reversion)
    const cagrConservador = Math.round(cagrHistorico * 0.7 * 10) / 10;
    // Base: weighted average — 40% historical + 60% recent 5y
    const cagrBase = Math.round((cagrHistorico * 0.4 + cagr5y * 0.6) * 10) / 10;
    // Optimista: recent 5y CAGR sustained
    const cagrOptimista = Math.round(cagr5y * 10) / 10;

    return {
      rank: i + 1,
      name, ticker, type, sector,
      currentPrice: price,
      currentPriceLabel: priceLabel,
      marketCap: mCap,
      marketCapSort: mCapSort,
      cagrHistorico,
      cagr5y,
      cagrConservador,
      cagrBase,
      cagrOptimista,
      price5yConservador: projectPrice(price, cagrConservador, 5),
      price5yBase: projectPrice(price, cagrBase, 5),
      price5yOptimista: projectPrice(price, cagrOptimista, 5),
      price10yConservador: projectPrice(price, cagrConservador, 10),
      price10yBase: projectPrice(price, cagrBase, 10),
      price10yOptimista: projectPrice(price, cagrOptimista, 10),
    };
  });
}

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

export function ProyeccionesActivos({ livePrices, lastUpdated }: ProyeccionesProps) {
  const ASSETS = useMemo(() => buildProjections(livePrices), [livePrices]);
  const SECTORS = useMemo(() => Array.from(new Set(ASSETS.map((a) => a.sector))).sort(), [ASSETS]);

  const [sortBy, setSortBy] = useState<SortKey>("cagrBase");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [horizon, setHorizon] = useState<Horizon>("5y");

  // Simulator state
  const [simTicker, setSimTicker] = useState("NVDA");
  const [simAmount, setSimAmount] = useState(10000);

  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortBy(key);
      setSortDir("desc");
    }
  };

  const filtered = useMemo(() => {
    let result = ASSETS;
    if (sectorFilter !== "all") {
      result = result.filter((a) => a.sector === sectorFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.ticker.toLowerCase().includes(q) ||
          a.sector.toLowerCase().includes(q)
      );
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

  // Simulator
  const simAsset = ASSETS.find((a) => a.ticker === simTicker) || ASSETS[0];
  const simYears = horizon === "5y" ? 5 : 10;
  const simResults = {
    conservador: simAmount * Math.pow(1 + simAsset.cagrConservador / 100, simYears),
    base: simAmount * Math.pow(1 + simAsset.cagrBase / 100, simYears),
    optimista: simAmount * Math.pow(1 + simAsset.cagrOptimista / 100, simYears),
  };

  return (
    <div>
      {/* Hero section */}
      <section style={{ padding: "4rem 0 2rem", textAlign: "center" }}>
        <div
          className="animate-fade-up"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.4rem 1rem",
            border: "1px solid rgba(167, 139, 250, 0.2)",
            borderRadius: "100px",
            fontSize: "0.75rem",
            fontWeight: 500,
            color: "#c4b5fd",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "2rem",
            background: "rgba(167, 139, 250, 0.1)",
          }}
        >
          <span
            className="animate-pulse-dot"
            style={{
              width: "6px",
              height: "6px",
              background: "#a78bfa",
              borderRadius: "50%",
            }}
          />
          Proyecciones Forward-Looking{lastUpdated ? ` · Datos ${new Date(lastUpdated).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" })}` : " · Febrero 2026"}
        </div>
        <h2
          className="animate-fade-up animate-delay-1 hero-title-responsive"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2.8rem",
            fontWeight: 400,
            lineHeight: 1.15,
            marginBottom: "1rem",
            color: "#e8efe6",
          }}
        >
          Proyecciones de
          <br />
          Rendimiento
        </h2>
        <p
          className="animate-fade-up animate-delay-2"
          style={{
            fontSize: "1.05rem",
            color: "#8a9e93",
            maxWidth: "640px",
            margin: "0 auto",
            fontWeight: 300,
          }}
        >
          Estimaciones a 5 y 10 años basadas en tres escenarios cuantitativos derivados
          del rendimiento histórico y reciente de cada activo.
        </p>
        <div
          className="animate-fade-up animate-delay-3"
          style={{
            display: "inline-block",
            marginTop: "1.5rem",
            padding: "0.6rem 1.25rem",
            background: "rgba(224, 122, 95, 0.08)",
            border: "1px solid rgba(224, 122, 95, 0.2)",
            borderRadius: "8px",
            fontSize: "0.72rem",
            color: "#e07a5f",
            fontWeight: 500,
            letterSpacing: "0.02em",
            maxWidth: "640px",
          }}
        >
          ESPECULATIVO — Las proyecciones son ejercicios matemáticos basados en datos pasados.
          NO constituyen predicciones, asesoría financiera ni recomendaciones de inversión.
          Los rendimientos pasados no garantizan resultados futuros.
        </div>
      </section>

      {/* Methodology cards — 3 scenarios */}
      <section
        className="animate-fade-up animate-delay-3"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
          marginBottom: "2.5rem",
        }}
      >
        {([
          {
            label: "Conservador",
            color: "#d4a373",
            formula: "CAGR Hist. × 0.70",
            desc: "Mean reversion: el rendimiento histórico se reduce un 30% para reflejar desaceleración y madurez del activo.",
          },
          {
            label: "Base",
            color: "#52b788",
            formula: "(Hist. × 0.4) + (5Y × 0.6)",
            desc: "Promedio ponderado que combina la tendencia de largo plazo con el momentum reciente de 5 años.",
          },
          {
            label: "Optimista",
            color: "#a78bfa",
            formula: "CAGR 5 Años sostenido",
            desc: "Asume que el rendimiento reciente de 5 años se mantiene. Refleja continuación de momentum actual.",
          },
        ] as const).map((scenario) => (
          <div
            key={scenario.label}
            className="stats-grid-responsive"
            style={{
              background: "#111a16",
              border: `1px solid ${scenario.color}33`,
              borderRadius: "12px",
              padding: "1.5rem",
              borderLeft: `3px solid ${scenario.color}`,
            }}
          >
            <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#5a6e63", marginBottom: "0.5rem" }}>
              Escenario
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: scenario.color, marginBottom: "0.35rem" }}>
              {scenario.label}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: scenario.color, marginBottom: "0.75rem", opacity: 0.8 }}>
              {scenario.formula}
            </div>
            <p style={{ fontSize: "0.78rem", color: "#8a9e93", lineHeight: 1.5 }}>
              {scenario.desc}
            </p>
          </div>
        ))}
      </section>

      {/* Investment Simulator */}
      <section className="animate-fade-up animate-delay-4" style={{ marginBottom: "3rem" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "#e8efe6", marginBottom: "1.25rem" }}>
          Simulador de Inversión
        </h3>
        <div
          style={{
            background: "#111a16",
            border: "1px solid rgba(45, 106, 79, 0.2)",
            borderRadius: "12px",
            padding: "1.5rem",
          }}
        >
          {/* Controls */}
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ flex: "1 1 200px" }}>
              <label style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#5a6e63", marginBottom: "0.4rem" }}>
                Activo
              </label>
              <select
                value={simTicker}
                onChange={(e) => setSimTicker(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem 0.75rem",
                  background: "#0a0f0d",
                  border: "1px solid rgba(45, 106, 79, 0.25)",
                  borderRadius: "8px",
                  color: "#e8efe6",
                  fontSize: "0.85rem",
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
              >
                {ASSETS.map((a) => (
                  <option key={a.ticker} value={a.ticker}>
                    {a.ticker} — {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ flex: "0 1 180px" }}>
              <label style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#5a6e63", marginBottom: "0.4rem" }}>
                Monto (USD)
              </label>
              <input
                type="number"
                value={simAmount}
                onChange={(e) => setSimAmount(Math.max(0, Number(e.target.value)))}
                style={{
                  width: "100%",
                  padding: "0.5rem 0.75rem",
                  background: "#0a0f0d",
                  border: "1px solid rgba(45, 106, 79, 0.25)",
                  borderRadius: "8px",
                  color: "#e8efe6",
                  fontSize: "0.85rem",
                  fontFamily: "var(--font-mono)",
                }}
              />
            </div>
            <div style={{ flex: "0 0 auto" }}>
              <label style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#5a6e63", marginBottom: "0.4rem" }}>
                Horizonte
              </label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {(["5y", "10y"] as Horizon[]).map((h) => (
                  <button
                    key={h}
                    onClick={() => setHorizon(h)}
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "8px",
                      border: `1px solid ${horizon === h ? "#52b788" : "rgba(45, 106, 79, 0.25)"}`,
                      background: horizon === h ? "rgba(82, 183, 136, 0.15)" : "transparent",
                      color: horizon === h ? "#52b788" : "#8a9e93",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "var(--font-mono)",
                      transition: "all 0.2s",
                    }}
                  >
                    {h === "5y" ? "5 Años" : "10 Años"}
                  </button>
                ))}
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
                <div
                  key={s.key}
                  style={{
                    background: "#0a0f0d",
                    border: `1px solid ${color}33`,
                    borderRadius: "10px",
                    padding: "1.25rem",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color, marginBottom: "0.3rem" }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "#5a6e63", marginBottom: "0.75rem" }}>
                    CAGR: {s.cagr > 0 ? "+" : ""}{s.cagr}%
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", color: "#e8efe6", marginBottom: "0.25rem" }}>
                    {formatUSD(finalValue)}
                  </div>
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

      {/* Top 5 projected CAGR bars */}
      <section style={{ marginBottom: "3rem" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "#e8efe6", marginBottom: "1.25rem" }}>
          Top 5 — Mejor CAGR Proyectado (Base)
        </h3>
        <div style={{ background: "#111a16", border: "1px solid rgba(45, 106, 79, 0.2)", borderRadius: "12px", padding: "1.5rem" }}>
          {topBase.map((asset, i) => {
            const priceTarget = horizon === "5y" ? asset.price5yBase : asset.price10yBase;
            return (
              <div key={asset.ticker} style={{ marginBottom: i < 4 ? "1rem" : 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                  <span style={{ fontSize: "0.8rem", color: "#e8efe6" }}>
                    <span style={{ color: getTypeColor(asset.type), fontFamily: "var(--font-mono)", fontSize: "0.7rem", marginRight: "0.5rem" }}>
                      {asset.ticker}
                    </span>
                    {asset.name}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "#52b788" }}>
                    +{asset.cagrBase}% anual
                  </span>
                </div>
                <div style={{ height: "6px", background: "rgba(45, 106, 79, 0.15)", borderRadius: "3px", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.min((asset.cagrBase / topBase[0].cagrBase) * 100, 100)}%`,
                      background: "linear-gradient(90deg, #2d6a4f, #52b788)",
                      borderRadius: "3px",
                      transition: "width 1s ease",
                    }}
                  />
                </div>
                <div style={{ fontSize: "0.65rem", color: "#5a6e63", marginTop: "0.2rem" }}>
                  {asset.currentPriceLabel} hoy → {formatPrice(priceTarget)} proyectado ({horizon === "5y" ? "2031" : "2036"})
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Horizon toggle + Table */}
      <section style={{ marginBottom: "3rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "#e8efe6" }}>
            Tabla de Proyecciones — {horizon === "5y" ? "5 Años (2031)" : "10 Años (2036)"}
          </h3>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "#5a6e63" }}>
            {sorted.length} de {ASSETS.length} activos
          </span>
        </div>

        {/* Search, Filter, Horizon */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: "1 1 250px", maxWidth: "350px" }}>
            <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#5a6e63", fontSize: "0.8rem", pointerEvents: "none" }}>
              &#x1F50D;
            </span>
            <input
              type="text"
              placeholder="Buscar activo, ticker o sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem 0.5rem 2.25rem",
                background: "#111a16",
                border: "1px solid rgba(45, 106, 79, 0.25)",
                borderRadius: "8px",
                color: "#e8efe6",
                fontSize: "0.8rem",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
          </div>
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            style={{
              padding: "0.5rem 0.75rem",
              background: "#111a16",
              border: "1px solid rgba(45, 106, 79, 0.25)",
              borderRadius: "8px",
              color: sectorFilter === "all" ? "#8a9e93" : "#95d5b2",
              fontSize: "0.8rem",
              cursor: "pointer",
              fontFamily: "inherit",
              minWidth: "160px",
            }}
          >
            <option value="all">Todos los sectores</option>
            {SECTORS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            {(["5y", "10y"] as Horizon[]).map((h) => (
              <button
                key={h}
                onClick={() => setHorizon(h)}
                style={{
                  padding: "0.45rem 0.85rem",
                  borderRadius: "8px",
                  border: `1px solid ${horizon === h ? "#52b788" : "rgba(45, 106, 79, 0.25)"}`,
                  background: horizon === h ? "rgba(82, 183, 136, 0.15)" : "transparent",
                  color: horizon === h ? "#52b788" : "#8a9e93",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "var(--font-mono)",
                  transition: "all 0.2s",
                }}
              >
                {h === "5y" ? "5 Años" : "10 Años"}
              </button>
            ))}
          </div>
          {(searchQuery || sectorFilter !== "all") && (
            <button
              onClick={() => { setSearchQuery(""); setSectorFilter("all"); }}
              style={{
                padding: "0.45rem 0.85rem",
                borderRadius: "8px",
                border: "1px solid rgba(224, 122, 95, 0.3)",
                background: "rgba(224, 122, 95, 0.1)",
                color: "#e07a5f",
                fontSize: "0.75rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Limpiar filtros
            </button>
          )}
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(45, 106, 79, 0.3)" }}>
                {([
                  { label: "#", key: null, align: "left" },
                  { label: "Activo", key: "name" as SortKey, align: "left" },
                  { label: "Sector", key: "sector" as SortKey, align: "left" },
                  { label: "Precio Actual", key: null, align: "right" },
                  { label: "Conservador", key: "cagrConservador" as SortKey, align: "right" },
                  { label: "Base", key: "cagrBase" as SortKey, align: "right" },
                  { label: "Optimista", key: "cagrOptimista" as SortKey, align: "right" },
                  { label: `Precio ${horizon === "5y" ? "2031" : "2036"} (Base)`, key: null, align: "right" },
                ] as const).map((col) => (
                  <th
                    key={col.label}
                    onClick={col.key ? () => handleSort(col.key!) : undefined}
                    style={{
                      padding: "0.75rem 0.5rem",
                      textAlign: col.align as "left" | "right",
                      color: sortBy === col.key ? "#95d5b2" : "#5a6e63",
                      fontWeight: 600,
                      fontSize: "0.7rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      whiteSpace: "nowrap",
                      cursor: col.key ? "pointer" : "default",
                      userSelect: "none",
                      transition: "color 0.2s",
                    }}
                  >
                    {col.label}
                    {col.key && sortBy === col.key && (
                      <span style={{ marginLeft: "0.3rem", fontSize: "0.6rem" }}>
                        {sortDir === "desc" ? "\u25BC" : "\u25B2"}
                      </span>
                    )}
                    {col.key && sortBy !== col.key && (
                      <span style={{ marginLeft: "0.3rem", fontSize: "0.6rem", opacity: 0.3 }}>
                        {"\u25BC"}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: "2rem", textAlign: "center", color: "#5a6e63", fontStyle: "italic" }}>
                    No se encontraron activos con los filtros seleccionados.
                  </td>
                </tr>
              )}
              {sorted.map((asset, i) => {
                const cC = formatCAGR(asset.cagrConservador);
                const cB = formatCAGR(asset.cagrBase);
                const cO = formatCAGR(asset.cagrOptimista);
                const projectedPrice = horizon === "5y" ? asset.price5yBase : asset.price10yBase;
                const isHovered = hoveredRow === i;
                return (
                  <tr
                    key={asset.ticker}
                    onMouseEnter={() => setHoveredRow(i)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      borderBottom: "1px solid rgba(45, 106, 79, 0.1)",
                      background: isHovered ? "rgba(45, 106, 79, 0.08)" : "transparent",
                      transition: "background 0.2s",
                    }}
                  >
                    <td style={{ padding: "0.65rem 0.5rem", color: "#5a6e63", fontFamily: "var(--font-mono)", fontSize: "0.7rem" }}>
                      {i + 1}
                    </td>
                    <td style={{ padding: "0.65rem 0.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ color: "#e8efe6", fontWeight: 500 }}>{asset.name}</span>
                        <span style={{ color: "#5a6e63", fontFamily: "var(--font-mono)", fontSize: "0.7rem" }}>{asset.ticker}</span>
                      </div>
                    </td>
                    <td style={{ padding: "0.65rem 0.5rem" }}>
                      <span
                        onClick={() => setSectorFilter(asset.sector)}
                        style={{
                          fontSize: "0.65rem",
                          padding: "0.15rem 0.5rem",
                          borderRadius: "100px",
                          border: `1px solid ${getTypeColor(asset.type)}33`,
                          color: getTypeColor(asset.type),
                          background: `${getTypeColor(asset.type)}15`,
                          whiteSpace: "nowrap",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        {asset.sector}
                      </span>
                    </td>
                    <td style={{ padding: "0.65rem 0.5rem", textAlign: "right", fontFamily: "var(--font-mono)", color: "#e8efe6", fontSize: "0.8rem" }}>
                      {asset.currentPriceLabel}
                    </td>
                    <td style={{ padding: "0.65rem 0.5rem", textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 600, color: cC.color }}>
                      {cC.label}
                    </td>
                    <td style={{ padding: "0.65rem 0.5rem", textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 600, color: cB.color }}>
                      {cB.label}
                    </td>
                    <td style={{ padding: "0.65rem 0.5rem", textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 600, color: cO.color }}>
                      {cO.label}
                    </td>
                    <td style={{ padding: "0.65rem 0.5rem", textAlign: "right", fontFamily: "var(--font-mono)", color: "#95d5b2", fontSize: "0.8rem" }}>
                      {formatPrice(projectedPrice)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Methodology */}
      <section
        style={{
          background: "#111a16",
          border: "1px solid rgba(45, 106, 79, 0.2)",
          borderRadius: "12px",
          padding: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "#e8efe6", marginBottom: "0.75rem" }}>
          Metodología de Proyección
        </h4>
        <div style={{ fontSize: "0.78rem", color: "#8a9e93", lineHeight: 1.7 }}>
          <p style={{ marginBottom: "0.5rem" }}>
            <strong style={{ color: "#d4a373" }}>Conservador</strong> = CAGR Histórico × 0.70.
            Aplica una reducción del 30% para reflejar mean reversion y desaceleración natural a medida que los activos maduran.
          </p>
          <p style={{ marginBottom: "0.5rem" }}>
            <strong style={{ color: "#52b788" }}>Base</strong> = (CAGR Histórico × 0.40) + (CAGR 5 Años × 0.60).
            Combina la tendencia de largo plazo con el momentum reciente, dando mayor peso al rendimiento más actual.
          </p>
          <p style={{ marginBottom: "0.5rem" }}>
            <strong style={{ color: "#a78bfa" }}>Optimista</strong> = CAGR 5 Años sostenido.
            Asume que las condiciones favorables recientes continúan durante todo el horizonte de proyección.
          </p>
          <p>
            <strong style={{ color: "#95d5b2" }}>Precio Proyectado</strong> = Precio Actual × (1 + CAGR/100) ^ Años.
            Solo refleja apreciación de precio, sin dividendos reinvertidos.
          </p>
        </div>
      </section>

      {/* Legal disclaimer */}
      <section
        style={{
          background: "rgba(224, 122, 95, 0.05)",
          border: "1px solid rgba(224, 122, 95, 0.15)",
          borderRadius: "12px",
          padding: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "#e07a5f", marginBottom: "0.75rem" }}>
          Aviso Legal — Disclaimer
        </h4>
        <div style={{ fontSize: "0.75rem", color: "#8a9e93", lineHeight: 1.8 }}>
          <p style={{ marginBottom: "0.6rem" }}>
            <strong style={{ color: "#e07a5f" }}>Este contenido es puramente especulativo, informativo y educativo.</strong>{" "}
            Las proyecciones presentadas son ejercicios matemáticos que extrapolan rendimientos pasados hacia el futuro.
            NO constituyen predicciones de mercado, asesoría financiera, recomendación de inversión ni oferta de valores.
          </p>
          <p style={{ marginBottom: "0.6rem" }}>
            <strong style={{ color: "#e07a5f" }}>Los rendimientos pasados no garantizan ni son indicativos de resultados futuros.</strong>{" "}
            Los mercados financieros son inherentemente impredecibles. Los precios reales pueden diferir
            drásticamente de cualquier proyección, incluyendo pérdida total del capital.
          </p>
          <p style={{ marginBottom: "0.6rem" }}>
            Los modelos utilizados son simplificaciones que no consideran factores como: cambios regulatorios,
            disrupciones tecnológicas, recesiones, guerras, inflación, cambios en la tasa de interés, competencia,
            ni ningún otro evento futuro que pueda impactar los precios.
          </p>
          <p style={{ marginBottom: "0.6rem" }}>
            Antes de tomar cualquier decisión de inversión, consulte con un asesor financiero debidamente acreditado.
            Los Álamos Capital SpA NO se encuentra regulada por la CMF de Chile ni acepta capital de terceros.
          </p>
          <p>
            La información se proporciona &quot;tal cual&quot; sin garantías de ningún tipo respecto a su exactitud,
            integridad o vigencia.
          </p>
        </div>
      </section>
    </div>
  );
}
