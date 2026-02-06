"use client";

import { useState } from "react";

interface AssetData {
  rank: number;
  name: string;
  ticker: string;
  type: "company" | "commodity" | "crypto" | "index";
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

// CAGR formula: ((end/start)^(1/years) - 1) * 100
function calcCAGR(start: number, end: number, years: number): number {
  if (start <= 0 || years <= 0) return 0;
  return (Math.pow(end / start, 1 / years) - 1) * 100;
}

// Data as of Feb 6, 2026 — prices from live market data
const ASSETS: AssetData[] = (() => {
  const now = new Date("2026-02-06");
  const yearsSince = (d: string) =>
    (now.getTime() - new Date(d).getTime()) / (365.25 * 24 * 60 * 60 * 1000);

  const raw = [
    {
      name: "Gold",
      ticker: "XAU",
      type: "commodity" as const,
      inceptionDate: "1971-08-15",
      inceptionLabel: "Ago 1971",
      startPrice: 35,
      startPriceLabel: "$35/oz",
      currentPrice: 4800,
      currentPriceLabel: "$4,800/oz",
      marketCap: "$19.4T",
      marketCapSort: 19400,
      note: "Precio libre desde Nixon Shock",
    },
    {
      name: "Apple",
      ticker: "AAPL",
      type: "company" as const,
      inceptionDate: "1980-12-12",
      inceptionLabel: "Dic 1980",
      startPrice: 0.1,
      startPriceLabel: "$0.10 (adj)",
      currentPrice: 272.36,
      currentPriceLabel: "$272.36",
      marketCap: "$4.0T",
      marketCapSort: 4000,
    },
    {
      name: "NVIDIA",
      ticker: "NVDA",
      type: "company" as const,
      inceptionDate: "1999-01-22",
      inceptionLabel: "Ene 1999",
      startPrice: 0.04,
      startPriceLabel: "$0.04 (adj)",
      currentPrice: 189.21,
      currentPriceLabel: "$189.21",
      marketCap: "$4.5T",
      marketCapSort: 4500,
    },
    {
      name: "Alphabet",
      ticker: "GOOGL",
      type: "company" as const,
      inceptionDate: "2004-08-19",
      inceptionLabel: "Ago 2004",
      startPrice: 1.27,
      startPriceLabel: "$1.27 (adj)",
      currentPrice: 210,
      currentPriceLabel: "$210",
      marketCap: "$3.8T",
      marketCapSort: 3800,
    },
    {
      name: "Microsoft",
      ticker: "MSFT",
      type: "company" as const,
      inceptionDate: "1986-03-13",
      inceptionLabel: "Mar 1986",
      startPrice: 0.07,
      startPriceLabel: "$0.07 (adj)",
      currentPrice: 399,
      currentPriceLabel: "$399",
      marketCap: "$2.9T",
      marketCapSort: 2900,
    },
    {
      name: "Amazon",
      ticker: "AMZN",
      type: "company" as const,
      inceptionDate: "1997-05-15",
      inceptionLabel: "May 1997",
      startPrice: 0.075,
      startPriceLabel: "$0.075 (adj)",
      currentPrice: 233.1,
      currentPriceLabel: "$233.10",
      marketCap: "$2.5T",
      marketCapSort: 2500,
    },
    {
      name: "Bitcoin",
      ticker: "BTC",
      type: "crypto" as const,
      inceptionDate: "2013-01-01",
      inceptionLabel: "Ene 2013",
      startPrice: 13.3,
      startPriceLabel: "$13.30",
      currentPrice: 62000,
      currentPriceLabel: "$62,000",
      marketCap: "$1.2T",
      marketCapSort: 1200,
      note: "Desde precio significativo en exchanges",
    },
    {
      name: "TSMC",
      ticker: "TSM",
      type: "company" as const,
      inceptionDate: "1997-10-08",
      inceptionLabel: "Oct 1997",
      startPrice: 1.17,
      startPriceLabel: "$1.17 (adj)",
      currentPrice: 205,
      currentPriceLabel: "$205",
      marketCap: "$1.8T",
      marketCapSort: 1800,
    },
    {
      name: "Meta",
      ticker: "META",
      type: "company" as const,
      inceptionDate: "2012-05-18",
      inceptionLabel: "May 2012",
      startPrice: 38,
      startPriceLabel: "$38.00",
      currentPrice: 669.26,
      currentPriceLabel: "$669.26",
      marketCap: "$1.7T",
      marketCapSort: 1700,
    },
    {
      name: "Saudi Aramco",
      ticker: "2222.SR",
      type: "company" as const,
      inceptionDate: "2019-12-11",
      inceptionLabel: "Dic 2019",
      startPrice: 32,
      startPriceLabel: "32 SAR",
      currentPrice: 25.6,
      currentPriceLabel: "25.60 SAR",
      marketCap: "$1.65T",
      marketCapSort: 1650,
      note: "Precios en SAR",
    },
    {
      name: "Silver",
      ticker: "XAG",
      type: "commodity" as const,
      inceptionDate: "1971-08-15",
      inceptionLabel: "Ago 1971",
      startPrice: 1.39,
      startPriceLabel: "$1.39/oz",
      currentPrice: 75,
      currentPriceLabel: "$75/oz",
      marketCap: "$1.6T",
      marketCapSort: 1600,
      note: "Incluye toda la plata sobre tierra",
    },
    {
      name: "Broadcom",
      ticker: "AVGO",
      type: "company" as const,
      inceptionDate: "2009-08-06",
      inceptionLabel: "Ago 2009",
      startPrice: 1.53,
      startPriceLabel: "$1.53 (adj)",
      currentPrice: 230,
      currentPriceLabel: "$230",
      marketCap: "$1.47T",
      marketCapSort: 1470,
    },
    {
      name: "Tesla",
      ticker: "TSLA",
      type: "company" as const,
      inceptionDate: "2010-06-29",
      inceptionLabel: "Jun 2010",
      startPrice: 1.13,
      startPriceLabel: "$1.13 (adj)",
      currentPrice: 397.21,
      currentPriceLabel: "$397.21",
      marketCap: "$1.27T",
      marketCapSort: 1270,
    },
    {
      name: "Berkshire Hathaway",
      ticker: "BRK.A",
      type: "company" as const,
      inceptionDate: "1965-05-10",
      inceptionLabel: "May 1965",
      startPrice: 18,
      startPriceLabel: "$18",
      currentPrice: 710000,
      currentPriceLabel: "$710,000",
      marketCap: "$1.09T",
      marketCapSort: 1090,
      note: "Era Buffett desde 1965",
    },
    {
      name: "S&P 500",
      ticker: "SPX",
      type: "index" as const,
      inceptionDate: "1957-03-04",
      inceptionLabel: "Mar 1957",
      startPrice: 44.06,
      startPriceLabel: "44.06",
      currentPrice: 6000,
      currentPriceLabel: "6,000",
      marketCap: "Benchmark",
      marketCapSort: 0,
      note: "Referencia (sin dividendos)",
    },
  ];

  // 5-year-ago prices (Feb 2021, adjusted for splits)
  const prices5yAgo: Record<string, number> = {
    XAU: 1810,
    AAPL: 134,
    NVDA: 13.2,
    GOOGL: 100,
    MSFT: 232,
    AMZN: 162.5,
    BTC: 46000,
    TSM: 130,
    META: 265,
    "2222.SR": 34.5,
    XAG: 27,
    AVGO: 47.5,
    TSLA: 55.8,
    "BRK.A": 370000,
    SPX: 3886,
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
})();

type SortKey = "marketCap" | "cagrInception" | "cagr5y" | "years";

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

export function AnalisisActivos() {
  const [sortBy, setSortBy] = useState<SortKey>("marketCap");
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const sorted = [...ASSETS].sort((a, b) => {
    switch (sortBy) {
      case "marketCap": return b.marketCapSort - a.marketCapSort;
      case "cagrInception": return b.cagrInception - a.cagrInception;
      case "cagr5y": return b.cagr5y - a.cagr5y;
      case "years": return b.years - a.years;
      default: return 0;
    }
  });

  const topCAGR = [...ASSETS].sort((a, b) => b.cagrInception - a.cagrInception).slice(0, 5);
  const top5y = [...ASSETS].sort((a, b) => b.cagr5y - a.cagr5y).slice(0, 5);

  const sortButtons: { key: SortKey; label: string }[] = [
    { key: "marketCap", label: "Market Cap" },
    { key: "cagrInception", label: "CAGR Histórico" },
    { key: "cagr5y", label: "CAGR 5 Años" },
    { key: "years", label: "Antigüedad" },
  ];

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
          Análisis de Mercado · Febrero 2026
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
          Análisis comparativo de rendimiento compuesto (CAGR) de los 15 activos
          con mayor capitalización de mercado. Datos al 6 de febrero de 2026.
        </p>
      </section>

      {/* Key insights cards */}
      <section
        className="animate-fade-up animate-delay-3"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
          marginBottom: "2.5rem",
        }}
      >
        <div
          className="stats-grid-responsive"
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "#e8efe6" }}>
            Tabla Completa
          </h3>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {sortButtons.map((btn) => (
              <button
                key={btn.key}
                onClick={() => setSortBy(btn.key)}
                style={{
                  padding: "0.35rem 0.85rem",
                  borderRadius: "100px",
                  border: sortBy === btn.key ? "1px solid #52b788" : "1px solid rgba(45, 106, 79, 0.2)",
                  background: sortBy === btn.key ? "rgba(82, 183, 136, 0.15)" : "transparent",
                  color: sortBy === btn.key ? "#95d5b2" : "#8a9e93",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  letterSpacing: "0.02em",
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(45, 106, 79, 0.3)" }}>
                {["#", "Activo", "Tipo", "Market Cap", "IPO / Inicio", "Precio Inicio", "Precio Actual", "Años", "CAGR Histórico", "CAGR 5 Años"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "0.75rem 0.5rem",
                      textAlign: h === "#" || h === "Activo" || h === "Tipo" ? "left" : "right",
                      color: "#5a6e63",
                      fontWeight: 600,
                      fontSize: "0.7rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
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
                        style={{
                          fontSize: "0.65rem",
                          padding: "0.15rem 0.5rem",
                          borderRadius: "100px",
                          border: `1px solid ${getTypeColor(asset.type)}33`,
                          color: getTypeColor(asset.type),
                          background: `${getTypeColor(asset.type)}15`,
                        }}
                      >
                        {getTypeLabel(asset.type)}
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
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="allocation-grid-responsive">
          {[
            {
              title: "Bitcoin: Rey del CAGR Histórico",
              text: "Desde $13 en 2013, Bitcoin mantiene el mayor CAGR histórico entre todos los activos, aunque su reciente caída desde $126K muestra la volatilidad inherente del activo.",
              color: "#a78bfa",
            },
            {
              title: "Gold: El Rally de 2025-2026",
              text: "El oro pasó de $2,000 a casi $5,000/oz en un rally histórico, impulsado por incertidumbre geopolítica y compras de bancos centrales. Su CAGR de 5 años se disparó.",
              color: "#d4a373",
            },
            {
              title: "NVIDIA: Momentum de la IA",
              text: "El semiconductor más valioso del mundo con $4.5T de market cap. Su CAGR de 5 años supera el 70%, impulsado por la demanda insaciable de GPUs para IA.",
              color: "#52b788",
            },
            {
              title: "Berkshire: 60 Años Compounding",
              text: "De $18 a $710,000 por acción. Buffett demostró que ~18% anual sostenido por 60 años crea una de las mayores fortunas de la historia.",
              color: "#95d5b2",
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
          marginBottom: "2rem",
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
          <p style={{ marginBottom: "0.5rem" }}>
            <strong style={{ color: "#95d5b2" }}>Solo apreciación de precio</strong>. No incluye dividendos reinvertidos. El retorno total sería mayor para acciones que pagan dividendos.
          </p>
          <p>
            <strong style={{ color: "#95d5b2" }}>Disclaimer</strong>: Este análisis es informativo. No constituye asesoría de inversión. Los rendimientos pasados no garantizan resultados futuros.
          </p>
        </div>
      </section>
    </div>
  );
}
