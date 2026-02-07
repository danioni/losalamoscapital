"use client";

import { useState } from "react";

const methodologyItems = [
  {
    number: "01 — FILOSOFÍA",
    title: "Concentración extrema",
    description:
      "Dos activos centrales: Tesla (TSLA) como posición principal en equities y Bitcoin (BTC) como activo central off-system. Preferimos conocer profundamente pocos activos y tener alta convicción, en vez de diversificar sin criterio.",
  },
  {
    number: "02 — ESTRUCTURA",
    title: "Stocks + Off-System",
    description:
      "El portafolio se divide en dos mundos: activos dentro del sistema financiero tradicional (acciones) y activos fuera de él (crypto, commodities). Cada mundo tiene su tesis propia, su horizonte temporal, y su lógica de sizing.",
  },
  {
    number: "03 — TRANSPARENCIA",
    title: "Todo público, todo auditable",
    description:
      "Cada decisión se documenta con tesis, precio de entrada, y criterios de salida. Los resultados se publican sin filtro — las pérdidas se reportan con la misma prominencia que las ganancias.",
  },
];

function MethodCard({ item }: { item: typeof methodologyItems[0] }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        background: "#111a16",
        border: `1px solid ${isHovered ? "rgba(45, 106, 79, 0.4)" : "rgba(45, 106, 79, 0.2)"}`,
        borderRadius: "12px",
        padding: "2rem",
        transition: "border-color 0.3s, transform 0.3s",
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.7rem",
          color: "#40916c",
          letterSpacing: "0.1em",
          marginBottom: "1rem",
        }}
      >
        {item.number}
      </div>
      <h4
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.15rem",
          fontWeight: 400,
          marginBottom: "0.75rem",
          color: "#e8efe6",
        }}
      >
        {item.title}
      </h4>
      <p
        style={{
          fontSize: "0.82rem",
          color: "#8a9e93",
          lineHeight: 1.65,
        }}
      >
        {item.description}
      </p>
    </div>
  );
}

export function Methodology() {
  return (
    <section id="methodology" style={{ padding: "3rem 0" }}>
      <div
        className="section-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: "2rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid rgba(45, 106, 79, 0.2)",
        }}
      >
        <h3
          className="section-title"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.6rem",
            fontWeight: 400,
            color: "#e8efe6",
          }}
        >
          Metodología
        </h3>
        <span className="section-subtitle" style={{ fontSize: "0.8rem", color: "#5a6e63", fontWeight: 500 }}>
          Cómo invertimos
        </span>
      </div>

      <div
        className="method-grid-responsive"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
        }}
      >
        {methodologyItems.map((item, index) => (
          <MethodCard key={index} item={item} />
        ))}
      </div>
    </section>
  );
}
