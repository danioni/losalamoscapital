"use client";

import { useState, useMemo } from "react";

interface AssetData {
  rank: number;
  name: string;
  ticker: string;
  type: "company" | "commodity" | "crypto" | "index";
  sector: string;
  inceptionDate: string;
  inceptionLabel: string;
  startPrice: number;
  startPriceLabel: string;
  currentPrice: number;
  currentPriceLabel: string;
  marketCap: string;
  marketCapSort: number;
  years: number;
  cagrInception: number;
  cagr5y: number;
  note?: string;
}

interface LivePrices {
  [ticker: string]: {
    price: number;
    priceLabel: string;
    marketCap: number;
    marketCapLabel: string;
  };
}

interface AnalisisProps {
  livePrices?: LivePrices;
  lastUpdated?: string | null;
}

// CAGR formula: ((end/start)^(1/years) - 1) * 100
function calcCAGR(start: number, end: number, years: number): number {
  if (start <= 0 || years <= 0) return 0;
  return (Math.pow(end / start, 1 / years) - 1) * 100;
}

// Static fallback data as of Feb 6, 2026
function buildAssets(livePrices?: LivePrices): AssetData[] {
  const now = livePrices ? new Date() : new Date("2026-02-06");
  const yearsSince = (d: string) =>
    (now.getTime() - new Date(d).getTime()) / (365.25 * 24 * 60 * 60 * 1000);

  // [name, ticker, type, sector, inceptionDate, inceptionLabel, startPrice, startPriceLabel, currentPrice, currentPriceLabel, marketCap, marketCapSort, note?]
  type R = [string, string, "company"|"commodity"|"crypto"|"index", string, string, string, number, string, number, string, string, number, string?];
  const d: R[] = [
    // Commodities & Crypto
    ["Gold", "XAU", "commodity", "Commodity", "1971-08-15", "Ago 1971", 35, "$35/oz", 4800, "$4,800/oz", "$19.4T", 19400, "Precio libre desde Nixon Shock"],
    ["Silver", "XAG", "commodity", "Commodity", "1971-08-15", "Ago 1971", 1.39, "$1.39/oz", 75, "$75/oz", "$1.6T", 1600, "Incluye toda la plata sobre tierra"],
    ["Bitcoin", "BTC", "crypto", "Crypto", "2013-01-01", "Ene 2013", 13.3, "$13.30", 62000, "$62,000", "$1.2T", 1200, "Desde precio significativo en exchanges"],
    // Benchmark
    ["S&P 500", "SPX", "index", "Indice", "1957-03-04", "Mar 1957", 44.06, "44.06", 6000, "6,000", "Benchmark", 0, "Referencia (sin dividendos)"],
    // Top 50 companies by market cap (Feb 6, 2026 — companiesmarketcap.com)
    ["NVIDIA", "NVDA", "company", "Semiconductores", "1999-01-22", "Ene 1999", 0.04, "$0.04 (adj)", 185.14, "$185.14", "$4.51T", 4507],
    ["Apple", "AAPL", "company", "Tech", "1980-12-12", "Dic 1980", 0.10, "$0.10 (adj)", 277.92, "$277.92", "$4.08T", 4084],
    ["Alphabet", "GOOGL", "company", "Tech", "2004-08-19", "Ago 2004", 1.27, "$1.27 (adj)", 322.89, "$322.89", "$3.91T", 3906],
    ["Microsoft", "MSFT", "company", "Tech", "1986-03-13", "Mar 1986", 0.07, "$0.07 (adj)", 399.78, "$399.78", "$2.97T", 2971],
    ["Amazon", "AMZN", "company", "E-Commerce", "1997-05-15", "May 1997", 0.075, "$0.075 (adj)", 206.96, "$206.96", "$2.21T", 2212],
    ["TSMC", "TSM", "company", "Semiconductores", "1997-10-08", "Oct 1997", 1.17, "$1.17 (adj)", 348.61, "$348.61", "$1.81T", 1808],
    ["Meta", "META", "company", "Tech", "2012-05-18", "May 2012", 38, "$38.00", 658, "$658", "$1.66T", 1664],
    ["Saudi Aramco", "2222.SR", "company", "Energía", "2019-12-11", "Dic 2019", 32, "32 SAR", 25.60, "25.60 SAR", "$1.65T", 1650, "Precios en SAR"],
    ["Broadcom", "AVGO", "company", "Semiconductores", "2009-08-06", "Ago 2009", 1.53, "$1.53 (adj)", 333.28, "$333.28", "$1.58T", 1580],
    ["Tesla", "TSLA", "company", "Automotriz", "2010-06-29", "Jun 2010", 1.13, "$1.13 (adj)", 413.85, "$413.85", "$1.55T", 1552],
    ["Berkshire Hathaway", "BRK.B", "company", "Financiero", "1965-05-10", "May 1965", 0.012, "$0.012 (adj)", 505.84, "$505.84", "$1.09T", 1091, "Era Buffett desde 1965"],
    ["Walmart", "WMT", "company", "Retail", "1970-10-01", "Oct 1970", 0.006, "$0.006 (adj)", 130.89, "$130.89", "$1.04T", 1043],
    ["Eli Lilly", "LLY", "company", "Pharma", "1952-01-01", "Ene 1952", 0.085, "$0.085 (adj)", 1057, "$1,057", "$947B", 947],
    ["JPMorgan Chase", "JPM", "company", "Financiero", "1969-03-05", "Mar 1969", 0.52, "$0.52 (adj)", 323.13, "$323.13", "$880B", 880],
    ["Samsung", "005930.KS", "company", "Semiconductores", "1975-06-11", "Jun 1975", 0.05, "$0.05 (adj)", 108.42, "$108.42", "$725B", 725, "Precios en USD (ADR equiv.)"],
    ["Tencent", "TCEHY", "company", "Tech", "2004-06-16", "Jun 2004", 0.07, "$0.07 (adj)", 71.22, "$71.22", "$642B", 642],
    ["Visa", "V", "company", "Pagos", "2008-03-19", "Mar 2008", 11, "$11 (adj)", 329.96, "$329.96", "$636B", 636],
    ["Exxon Mobil", "XOM", "company", "Energía", "1920-01-01", "Ene 1920", 0.001, "$0.001 (adj)", 149.12, "$149.12", "$629B", 629, "Standard Oil legacy"],
    ["Johnson & Johnson", "JNJ", "company", "Pharma", "1944-09-24", "Sep 1944", 0.025, "$0.025 (adj)", 240.61, "$240.61", "$580B", 580],
    ["ASML", "ASML", "company", "Semiconductores", "1995-03-14", "Mar 1995", 0.55, "$0.55 (adj)", 1411, "$1,411", "$548B", 548],
    ["Mastercard", "MA", "company", "Pagos", "2006-05-25", "May 2006", 3.90, "$3.90 (adj)", 545.74, "$545.74", "$488B", 488],
    ["Costco", "COST", "company", "Retail", "1985-12-01", "Dic 1985", 2.50, "$2.50 (adj)", 998.12, "$998.12", "$443B", 443],
    ["Micron", "MU", "company", "Semiconductores", "1984-06-01", "Jun 1984", 0.07, "$0.07 (adj)", 393.65, "$393.65", "$443B", 443],
    ["Bank of America", "BAC", "company", "Financiero", "1973-01-02", "Ene 1973", 0.08, "$0.08 (adj)", 56.52, "$56.52", "$413B", 413],
    ["Oracle", "ORCL", "company", "Tech", "1986-03-12", "Mar 1986", 0.03, "$0.03 (adj)", 140.86, "$140.86", "$405B", 405],
    ["AbbVie", "ABBV", "company", "Pharma", "2013-01-02", "Ene 2013", 35.23, "$35.23", 224.38, "$224.38", "$397B", 397],
    ["Alibaba", "BABA", "company", "E-Commerce", "2014-09-19", "Sep 2014", 68, "$68", 161.90, "$161.90", "$387B", 387],
    ["Home Depot", "HD", "company", "Retail", "1981-09-29", "Sep 1981", 0.03, "$0.03 (adj)", 385.20, "$385.20", "$383B", 383],
    ["Procter & Gamble", "PG", "company", "Consumo", "1890-01-01", "Ene 1890", 0.0005, "$0.0005 (adj)", 159.10, "$159.10", "$372B", 372, "Cotiza desde siglo XIX"],
    ["Roche", "ROG.SW", "company", "Pharma", "1956-05-01", "May 1956", 0.15, "$0.15 (adj)", 459.69, "$459.69", "$366B", 366, "Precios en CHF"],
    ["Chevron", "CVX", "company", "Energía", "1921-06-01", "Jun 1921", 0.001, "$0.001 (adj)", 180.34, "$180.34", "$361B", 361],
    ["Netflix", "NFLX", "company", "Tech", "2002-05-23", "May 2002", 0.054, "$0.054 (adj)", 81.27, "$81.27", "$345B", 345],
    ["Coca-Cola", "KO", "company", "Consumo", "1919-09-05", "Sep 1919", 0.00002, "$0.00002 (adj)", 78.92, "$78.92", "$340B", 340, "Split-adjusted desde 1919"],
    ["General Electric", "GE", "company", "Industrial", "1892-04-15", "Abr 1892", 0.008, "$0.008 (adj)", 321.88, "$321.88", "$340B", 340, "Reestructurada 2024"],
    ["Caterpillar", "CAT", "company", "Industrial", "1929-12-02", "Dic 1929", 0.07, "$0.07 (adj)", 724.18, "$724.18", "$339B", 339],
    ["AMD", "AMD", "company", "Semiconductores", "1972-09-27", "Sep 1972", 0.05, "$0.05 (adj)", 206.84, "$206.84", "$337B", 337],
    ["Cisco", "CSCO", "company", "Tech", "1990-02-16", "Feb 1990", 0.04, "$0.04 (adj)", 84.60, "$84.60", "$334B", 334],
    ["Palantir", "PLTR", "company", "Tech / IA", "2020-09-30", "Sep 2020", 9.50, "$9.50", 135.38, "$135.38", "$323B", 323],
    ["Toyota", "TM", "company", "Automotriz", "1949-05-01", "May 1949", 0.01, "$0.01 (adj)", 244.69, "$244.69", "$320B", 320, "Precios en USD (ADR)"],
    ["LVMH", "MC.PA", "company", "Lujo", "1987-06-01", "Jun 1987", 0.35, "$0.35 (adj)", 633.96, "$633.96", "$315B", 315, "Precios en EUR"],
    ["HSBC", "HSBC", "company", "Financiero", "1991-01-01", "Ene 1991", 2.50, "$2.50 (adj)", 89.38, "$89.38", "$307B", 307],
    ["Merck", "MRK", "company", "Pharma", "1946-01-01", "Ene 1946", 0.015, "$0.015 (adj)", 121.87, "$121.87", "$304B", 304],
    ["Novartis", "NVS", "company", "Pharma", "1996-12-20", "Dic 1996", 12.50, "$12.50 (adj)", 156.25, "$156.25", "$302B", 302],
    ["AstraZeneca", "AZN", "company", "Pharma", "1999-04-06", "Abr 1999", 14, "$14 (adj)", 193.58, "$193.58", "$300B", 300],
    ["Wells Fargo", "WFC", "company", "Financiero", "1978-01-01", "Ene 1978", 0.05, "$0.05 (adj)", 94.32, "$94.32", "$296B", 296],
  ];

  const raw = d.map(([name, ticker, type, sector, inceptionDate, inceptionLabel, startPrice, startPriceLabel, currentPrice, currentPriceLabel, marketCap, marketCapSort, note]) => {
    // Override with live prices if available
    const live = livePrices?.[ticker];
    return {
      name, ticker, type, sector, inceptionDate, inceptionLabel, startPrice, startPriceLabel,
      currentPrice: live ? live.price : currentPrice,
      currentPriceLabel: live ? live.priceLabel : currentPriceLabel,
      marketCap: live ? live.marketCapLabel : marketCap,
      marketCapSort: live ? Math.round(live.marketCap / 1e9) : marketCapSort,
      note,
    };
  });

  // 5-year-ago prices (Feb 2021, adjusted for splits)
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

  return raw.map((a, i) => {
    const years = yearsSince(a.inceptionDate);
    const p5y = prices5yAgo[a.ticker] || a.startPrice;
    return {
      ...a,
      rank: i + 1,
      years: Math.round(years * 10) / 10,
      cagrInception: Math.round(calcCAGR(a.startPrice, a.currentPrice, years) * 10) / 10,
      cagr5y: Math.round(calcCAGR(p5y, a.currentPrice, 5) * 10) / 10,
    };
  });
}

type SortKey = "marketCap" | "cagrInception" | "cagr5y" | "years" | "name" | "sector";
type SortDir = "asc" | "desc";

// SECTORS computed inside component now

function getTypeColor(type: string) {
  switch (type) {
    case "company": return "#52b788";
    case "commodity": return "#d4a373";
    case "crypto": return "#a78bfa";
    case "index": return "#8a9e93";
    default: return "#8a9e93";
  }
}

function getTypeLabel(type: string) {
  switch (type) {
    case "company": return "Empresa";
    case "commodity": return "Commodity";
    case "crypto": return "Crypto";
    case "index": return "Indice";
    default: return type;
  }
}

function formatCAGR(value: number) {
  const color = value > 20 ? "#52b788" : value > 10 ? "#95d5b2" : value > 0 ? "#8a9e93" : "#e07a5f";
  const sign = value > 0 ? "+" : "";
  return { color, label: `${sign}${value.toFixed(1)}%` };
}

export function AnalisisActivos({ livePrices, lastUpdated }: AnalisisProps) {
  const ASSETS = useMemo(() => buildAssets(livePrices), [livePrices]);
  const SECTORS = useMemo(() => Array.from(new Set(ASSETS.map((a) => a.sector))).sort(), [ASSETS]);

  const [sortBy, setSortBy] = useState<SortKey>("marketCap");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sectorFilter, setSectorFilter] = useState<string>("all");

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
  }, [sectorFilter, searchQuery]);

  const sorted = useMemo(() => {
    const dir = sortDir === "desc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "marketCap": return (b.marketCapSort - a.marketCapSort) * dir;
        case "cagrInception": return (b.cagrInception - a.cagrInception) * dir;
        case "cagr5y": return (b.cagr5y - a.cagr5y) * dir;
        case "years": return (b.years - a.years) * dir;
        case "name": return a.name.localeCompare(b.name) * dir;
        case "sector": return a.sector.localeCompare(b.sector) * dir;
        default: return 0;
      }
    });
  }, [filtered, sortBy, sortDir]);

  const topCAGR = [...ASSETS].sort((a, b) => b.cagrInception - a.cagrInception).slice(0, 5);
  const top5y = [...ASSETS].sort((a, b) => b.cagr5y - a.cagr5y).slice(0, 5);

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
            border: "1px solid rgba(45, 106, 79, 0.2)",
            borderRadius: "100px",
            fontSize: "0.75rem",
            fontWeight: 500,
            color: "#95d5b2",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "2rem",
            background: "rgba(82, 183, 136, 0.15)",
          }}
        >
          <span
            className="animate-pulse-dot"
            style={{
              width: "6px",
              height: "6px",
              background: "#52b788",
              borderRadius: "50%",
            }}
          />
          Análisis de Mercado{lastUpdated ? ` · Actualizado ${new Date(lastUpdated).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" })}` : " · Febrero 2026"}
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
          Los Activos Más Valiosos
          <br />
          del Mundo
        </h2>
        <p
          className="animate-fade-up animate-delay-2"
          style={{
            fontSize: "1.05rem",
            color: "#8a9e93",
            maxWidth: "600px",
            margin: "0 auto",
            fontWeight: 300,
          }}
        >
          Análisis comparativo de rendimiento compuesto (CAGR) de los 50 activos
          con mayor capitalización de mercado.{livePrices ? " Precios actualizados automáticamente cada semana." : " Datos al 6 de febrero de 2026."}
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
            maxWidth: "600px",
          }}
        >
          Este análisis es exclusivamente informativo y educativo. NO constituye asesoría financiera,
          recomendación de inversión, ni oferta de valores. Los rendimientos pasados no garantizan resultados futuros.
        </div>
      </section>

      {/* Key insights cards */}
      <section
        className="animate-fade-up animate-delay-3 stats-grid-responsive"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
          marginBottom: "2.5rem",
        }}
      >
        <div
          style={{
            background: "#111a16",
            border: "1px solid rgba(45, 106, 79, 0.2)",
            borderRadius: "12px",
            padding: "1.5rem",
          }}
        >
          <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#5a6e63", marginBottom: "0.5rem" }}>
            Activo Más Valioso
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "#d4a373" }}>
            Gold
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "#52b788", marginTop: "0.25rem" }}>
            $19.4T Market Cap
          </div>
        </div>
        <div
          style={{
            background: "#111a16",
            border: "1px solid rgba(45, 106, 79, 0.2)",
            borderRadius: "12px",
            padding: "1.5rem",
          }}
        >
          <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#5a6e63", marginBottom: "0.5rem" }}>
            Mejor CAGR Histórico
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "#52b788" }}>
            {topCAGR[0].name}
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "#52b788", marginTop: "0.25rem" }}>
            +{topCAGR[0].cagrInception}% anual ({topCAGR[0].years} años)
          </div>
        </div>
        <div
          style={{
            background: "#111a16",
            border: "1px solid rgba(45, 106, 79, 0.2)",
            borderRadius: "12px",
            padding: "1.5rem",
          }}
        >
          <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#5a6e63", marginBottom: "0.5rem" }}>
            Mejor CAGR 5 Años
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "#52b788" }}>
            {top5y[0].name}
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "#52b788", marginTop: "0.25rem" }}>
            +{top5y[0].cagr5y}% anual (2021–2026)
          </div>
        </div>
      </section>

      {/* Top 5 CAGR bars */}
      <section className="animate-fade-up animate-delay-4" style={{ marginBottom: "3rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }} className="allocation-grid-responsive">
          {/* Historical CAGR */}
          <div style={{ background: "#111a16", border: "1px solid rgba(45, 106, 79, 0.2)", borderRadius: "12px", padding: "1.5rem" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "#e8efe6", marginBottom: "1.25rem" }}>
              Top 5 — CAGR Desde Inicio
            </h3>
            {topCAGR.map((asset, i) => (
              <div key={asset.ticker} style={{ marginBottom: i < 4 ? "1rem" : 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                  <span style={{ fontSize: "0.8rem", color: "#e8efe6" }}>
                    <span style={{ color: getTypeColor(asset.type), fontFamily: "var(--font-mono)", fontSize: "0.7rem", marginRight: "0.5rem" }}>
                      {asset.ticker}
                    </span>
                    {asset.name}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "#52b788" }}>
                    +{asset.cagrInception}%
                  </span>
                </div>
                <div style={{ height: "6px", background: "rgba(45, 106, 79, 0.15)", borderRadius: "3px", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.min((asset.cagrInception / topCAGR[0].cagrInception) * 100, 100)}%`,
                      background: `linear-gradient(90deg, #2d6a4f, #52b788)`,
                      borderRadius: "3px",
                      transition: "width 1s ease",
                    }}
                  />
                </div>
                <div style={{ fontSize: "0.65rem", color: "#5a6e63", marginTop: "0.2rem" }}>
                  {asset.years} años · {asset.startPriceLabel} → {asset.currentPriceLabel}
                </div>
              </div>
            ))}
          </div>

          {/* 5-Year CAGR */}
          <div style={{ background: "#111a16", border: "1px solid rgba(45, 106, 79, 0.2)", borderRadius: "12px", padding: "1.5rem" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "#e8efe6", marginBottom: "1.25rem" }}>
              Top 5 — CAGR Últimos 5 Años
            </h3>
            {top5y.map((asset, i) => (
              <div key={asset.ticker} style={{ marginBottom: i < 4 ? "1rem" : 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                  <span style={{ fontSize: "0.8rem", color: "#e8efe6" }}>
                    <span style={{ color: getTypeColor(asset.type), fontFamily: "var(--font-mono)", fontSize: "0.7rem", marginRight: "0.5rem" }}>
                      {asset.ticker}
                    </span>
                    {asset.name}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "#52b788" }}>
                    +{asset.cagr5y}%
                  </span>
                </div>
                <div style={{ height: "6px", background: "rgba(45, 106, 79, 0.15)", borderRadius: "3px", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.min((asset.cagr5y / top5y[0].cagr5y) * 100, 100)}%`,
                      background: `linear-gradient(90deg, #2d6a4f, #52b788)`,
                      borderRadius: "3px",
                      transition: "width 1s ease",
                    }}
                  />
                </div>
                <div style={{ fontSize: "0.65rem", color: "#5a6e63", marginTop: "0.2rem" }}>
                  2021–2026 · {asset.currentPriceLabel}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full table */}
      <section style={{ marginBottom: "3rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "#e8efe6" }}>
            Tabla Completa
          </h3>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "#5a6e63" }}>
            {sorted.length} de {ASSETS.length} activos
          </span>
        </div>

        {/* Search & Filter bar */}
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

        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", margin: "0 -0.5rem", padding: "0 0.5rem" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem", minWidth: "800px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(45, 106, 79, 0.3)" }}>
                {([
                  { label: "#", key: null, align: "left" },
                  { label: "Activo", key: "name" as SortKey, align: "left" },
                  { label: "Sector", key: "sector" as SortKey, align: "left" },
                  { label: "Market Cap", key: "marketCap" as SortKey, align: "right" },
                  { label: "IPO / Inicio", key: null, align: "right" },
                  { label: "Precio Inicio", key: null, align: "right" },
                  { label: "Precio Actual", key: null, align: "right" },
                  { label: "Años", key: "years" as SortKey, align: "right" },
                  { label: "CAGR Histórico", key: "cagrInception" as SortKey, align: "right" },
                  { label: "CAGR 5 Años", key: "cagr5y" as SortKey, align: "right" },
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
                  <td colSpan={10} style={{ padding: "2rem", textAlign: "center", color: "#5a6e63", fontStyle: "italic" }}>
                    No se encontraron activos con los filtros seleccionados.
                  </td>
                </tr>
              )}
              {sorted.map((asset, i) => {
                const cagrI = formatCAGR(asset.cagrInception);
                const cagr5 = formatCAGR(asset.cagr5y);
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
                      {asset.marketCap}
                    </td>
                    <td style={{ padding: "0.65rem 0.5rem", textAlign: "right", color: "#8a9e93", fontSize: "0.78rem" }}>
                      {asset.inceptionLabel}
                    </td>
                    <td style={{ padding: "0.65rem 0.5rem", textAlign: "right", fontFamily: "var(--font-mono)", color: "#8a9e93", fontSize: "0.78rem" }}>
                      {asset.startPriceLabel}
                    </td>
                    <td style={{ padding: "0.65rem 0.5rem", textAlign: "right", fontFamily: "var(--font-mono)", color: "#e8efe6", fontSize: "0.8rem" }}>
                      {asset.currentPriceLabel}
                    </td>
                    <td style={{ padding: "0.65rem 0.5rem", textAlign: "right", fontFamily: "var(--font-mono)", color: "#8a9e93", fontSize: "0.78rem" }}>
                      {asset.years}
                    </td>
                    <td style={{ padding: "0.65rem 0.5rem", textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 600, color: cagrI.color }}>
                      {cagrI.label}
                    </td>
                    <td style={{ padding: "0.65rem 0.5rem", textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 600, color: cagr5.color }}>
                      {cagr5.label}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Observations */}
      <section style={{ marginBottom: "3rem" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "#e8efe6", marginBottom: "1.25rem" }}>
          Observaciones Clave
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }} className="stats-grid-responsive">
          {[
            {
              title: "Semiconductores Dominan el Top 50",
              text: "NVIDIA, TSMC, Broadcom, ASML, Samsung, Micron y AMD suman más de $9T de market cap. El sector de chips es el gran ganador de la era IA, con CAGRs de 5 años excepcionales.",
              color: "#52b788",
            },
            {
              title: "Gold: El Rally de 2025-2026",
              text: "El oro pasó de $1,800 a $4,800/oz en un rally histórico, impulsado por incertidumbre geopolítica y compras de bancos centrales. Sigue siendo el activo más valioso del mundo con $19.4T.",
              color: "#d4a373",
            },
            {
              title: "Bitcoin: CAGR Histórico Insuperable",
              text: "Desde $13 en 2013, Bitcoin mantiene el mayor CAGR histórico entre todos los activos analizados. Su caída reciente desde $126K a $62K muestra la volatilidad inherente del activo.",
              color: "#a78bfa",
            },
            {
              title: "Pharma: Resiliencia Centenaria",
              text: "Eli Lilly, J&J, Roche, Merck, Novartis y AstraZeneca representan más de $3T combinados. Sus CAGRs históricos de +10-13% por décadas muestran el poder del compounding en salud.",
              color: "#95d5b2",
            },
            {
              title: "Los Centenarios: PG, KO, GE, XOM",
              text: "Empresas con 100+ años cotizando. Procter & Gamble desde 1890 y Coca-Cola desde 1919 demuestran que incluso modestos CAGRs del 9-13% generan retornos astronómicos con suficiente tiempo.",
              color: "#d4a373",
            },
            {
              title: "Palantir: El Outlier Reciente",
              text: "Con solo 5 años cotizando, Palantir ya alcanza $323B de market cap. Su CAGR de 5 años es de los más altos del top 50, impulsado por contratos de defensa e IA.",
              color: "#a78bfa",
            },
          ].map((obs) => (
            <div
              key={obs.title}
              style={{
                background: "#111a16",
                border: "1px solid rgba(45, 106, 79, 0.2)",
                borderRadius: "12px",
                padding: "1.25rem",
                borderLeft: `3px solid ${obs.color}`,
              }}
            >
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", color: obs.color, marginBottom: "0.5rem" }}>
                {obs.title}
              </h4>
              <p style={{ fontSize: "0.82rem", color: "#8a9e93", lineHeight: 1.5 }}>
                {obs.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Methodology note */}
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
          Metodología
        </h4>
        <div style={{ fontSize: "0.78rem", color: "#8a9e93", lineHeight: 1.7 }}>
          <p style={{ marginBottom: "0.5rem" }}>
            <strong style={{ color: "#95d5b2" }}>CAGR</strong> = ((Precio Final / Precio Inicial) ^ (1/Años) - 1) x 100. Representa el retorno anualizado compuesto.
          </p>
          <p style={{ marginBottom: "0.5rem" }}>
            <strong style={{ color: "#95d5b2" }}>Precios ajustados</strong> por splits. Los precios de IPO reflejan el valor ajustado por todas las divisiones de acciones posteriores.
          </p>
          <p>
            <strong style={{ color: "#95d5b2" }}>Solo apreciación de precio</strong>. No incluye dividendos reinvertidos. El retorno total sería mayor para acciones que pagan dividendos.
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
            <strong style={{ color: "#e07a5f" }}>Este contenido es exclusivamente informativo y educativo.</strong>{" "}
            NO constituye asesoría financiera, recomendación de inversión, oferta de valores, servicio de gestión de activos
            para terceros, ni ningún tipo de consejo financiero personalizado.
          </p>
          <p style={{ marginBottom: "0.6rem" }}>
            Los datos presentados representan un análisis histórico de precios públicos. Los <strong style={{ color: "#e07a5f" }}>rendimientos
            pasados no garantizan ni son indicativos de resultados futuros</strong>. Toda inversión conlleva riesgo de pérdida
            parcial o total del capital invertido.
          </p>
          <p style={{ marginBottom: "0.6rem" }}>
            La información no debe ser interpretada como una recomendación de compra o venta de ningún activo mencionado.
            Antes de tomar cualquier decisión de inversión, consulte con un asesor financiero debidamente acreditado que
            conozca su situación personal y tolerancia al riesgo.
          </p>
          <p style={{ marginBottom: "0.6rem" }}>
            Los Álamos Capital SpA NO se encuentra regulada ni supervisada por la Comisión para el Mercado Financiero (CMF) de Chile
            ni por ningún otro organismo regulador. No solicitamos ni aceptamos capital de terceros.
          </p>
          <p>
            La información se proporciona &quot;tal cual&quot; sin garantías de ningún tipo respecto a su exactitud,
            integridad o vigencia. Los precios y datos de mercado pueden contener inexactitudes y están sujetos a cambios sin previo aviso.
          </p>
        </div>
      </section>
    </div>
  );
}
