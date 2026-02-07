"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartDataPoint } from "@/lib/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface PerformanceChartProps {
  data: ChartDataPoint[];
  lastUpdated: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string }>;
  label?: string;
}) {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "#111a16",
          border: "1px solid rgba(45, 106, 79, 0.2)",
          borderRadius: "8px",
          padding: "0.75rem",
        }}
      >
        <p
          style={{
            color: "#5a6e63",
            fontSize: "0.75rem",
            marginBottom: "0.5rem",
            fontFamily: "var(--font-mono)",
          }}
        >
          {label}
        </p>
        {payload.map((entry, index) => (
          <p
            key={index}
            style={{
              fontSize: "0.875rem",
              fontFamily: "var(--font-mono)",
              color: entry.color,
            }}
          >
            {entry.dataKey === "fund" ? "Los Álamos" : "S&P 500"}: $
            {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export function PerformanceChart({ data, lastUpdated }: PerformanceChartProps) {
  const formattedDate = lastUpdated
    ? format(new Date(lastUpdated), "dd/MM/yyyy", { locale: es })
    : "-";

  return (
    <section id="performance" style={{ padding: "3rem 0" }}>
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
          Rendimiento
        </h3>
        <span className="section-subtitle" style={{ fontSize: "0.8rem", color: "#5a6e63", fontWeight: 500 }}>
          Actualizado: {formattedDate}
        </span>
      </div>

      <div
        style={{
          background: "#111a16",
          border: "1px solid rgba(45, 106, 79, 0.2)",
          borderRadius: "16px",
          padding: "1.5rem",
        }}
      >
        <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "#8a9e93" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#52b788" }} />
            Los Álamos Capital
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "#8a9e93" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#5a6e63" }} />
            S&P 500 (Benchmark)
          </div>
        </div>

        <div style={{ height: "300px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="0"
                stroke="rgba(255,255,255,0.04)"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#5a6e63",
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#5a6e63",
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                }}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="fund"
                stroke="#52b788"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5, fill: "#52b788" }}
              />
              <Line
                type="monotone"
                dataKey="benchmark"
                stroke="#5a6e63"
                strokeWidth={1.5}
                strokeDasharray="6 4"
                dot={false}
                activeDot={{ r: 4, fill: "#5a6e63" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
