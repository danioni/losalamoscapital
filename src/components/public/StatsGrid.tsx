"use client";

import { FundMetrics } from "@/lib/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";

interface StatsGridProps {
  metrics: FundMetrics | null;
}

function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

function formatDate(dateStr: string): string {
  return format(new Date(dateStr), "d MMM yyyy", { locale: es });
}

function StatCard({
  label,
  value,
  sub,
  colorClass,
}: {
  label: string;
  value: string;
  sub: string;
  colorClass: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const getValueColor = (colorClass: string) => {
    switch (colorClass) {
      case "positive":
        return "#52b788";
      case "negative":
        return "#e07a5f";
      case "gold":
        return "#d4a373";
      default:
        return "#e8efe6";
    }
  };

  return (
    <div
      style={{
        background: isHovered ? "#162320" : "#111a16",
        padding: "1.75rem",
        transition: "background 0.3s",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          fontSize: "0.72rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "#5a6e63",
          marginBottom: "0.75rem",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "1.85rem",
          fontWeight: 500,
          lineHeight: 1,
          color: getValueColor(colorClass),
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "0.75rem",
          color: "#5a6e63",
          marginTop: "0.5rem",
          fontFamily: "var(--font-mono)",
        }}
      >
        {sub}
      </div>
    </div>
  );
}

export function StatsGrid({ metrics }: StatsGridProps) {
  const stats = [
    {
      label: "Rendimiento Acumulado",
      value: metrics ? formatPercent(metrics.total_return_pct) : "+0.00%",
      sub: metrics ? `Desde: ${formatDate(metrics.inception_date)}` : "Desde: -",
      colorClass: metrics && metrics.total_return_pct >= 0 ? "positive" : "negative",
    },
    {
      label: "Rendimiento Anualizado",
      value: metrics ? formatPercent(metrics.cagr_pct) : "+0.00%",
      sub: "CAGR",
      colorClass: metrics && metrics.cagr_pct >= 0 ? "positive" : "negative",
    },
    {
      label: "vs S&P 500",
      value: metrics ? formatPercent(metrics.alpha_vs_sp500_pct) : "+0.00%",
      sub: "Alpha generado",
      colorClass: "gold",
    },
    {
      label: "Max Drawdown",
      value: metrics ? `${metrics.max_drawdown_pct.toFixed(2)}%` : "0.00%",
      sub: "Caída máxima",
      colorClass: "neutral",
    },
  ];

  return (
    <div
      className="animate-fade-up animate-delay-3 stats-grid-responsive"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "1px",
        background: "rgba(45, 106, 79, 0.2)",
        border: "1px solid rgba(45, 106, 79, 0.2)",
        borderRadius: "16px",
        overflow: "hidden",
        margin: "3rem 0",
      }}
    >
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          label={stat.label}
          value={stat.value}
          sub={stat.sub}
          colorClass={stat.colorClass}
        />
      ))}
    </div>
  );
}
