import { createClient } from "@/lib/supabase/server";
import { FundMetrics, Position } from "@/lib/types";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  const supabase = await createClient();

  const [metricsRes, positionsRes] = await Promise.all([
    supabase
      .from("fund_metrics")
      .select("*")
      .order("date", { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from("positions")
      .select("*")
      .order("weight_pct", { ascending: false })
      .limit(5),
  ]);

  return {
    metrics: metricsRes.data as FundMetrics | null,
    topPositions: (positionsRes.data || []) as Position[],
  };
}

async function revalidateSite() {
  "use server";
  revalidatePath("/", "page");
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export default async function AdminDashboard() {
  const { metrics, topPositions } = await getDashboardData();

  const cardStyle = {
    background: "#111a16",
    border: "1px solid rgba(45, 106, 79, 0.2)",
    borderRadius: "12px",
    padding: "1.5rem",
  };

  const labelStyle = {
    color: "#5a6e63",
    fontSize: "0.7rem",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    marginBottom: "0.5rem",
  };

  const valueStyle = {
    fontFamily: "var(--font-mono)",
    fontSize: "1.5rem",
    fontWeight: 500,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              color: "#e8efe6",
              fontWeight: 400,
            }}
          >
            Dashboard
          </h1>
          <p style={{ color: "#8a9e93", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            Resumen del estado actual del fondo
          </p>
        </div>
        <form action={revalidateSite}>
          <button
            type="submit"
            style={{
              padding: "0.625rem 1rem",
              background: "#2d6a4f",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            Actualizar sitio público
          </button>
        </form>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1rem",
        }}
        className="admin-stats-grid"
      >
        <div style={cardStyle}>
          <div style={labelStyle}>AUM</div>
          <div style={{ ...valueStyle, color: "#e8efe6" }}>
            {metrics ? formatCurrency(metrics.aum_usd) : "$0"}
          </div>
        </div>
        <div style={cardStyle}>
          <div style={labelStyle}>Rendimiento Total</div>
          <div
            style={{
              ...valueStyle,
              color: metrics && metrics.total_return_pct >= 0 ? "#52b788" : "#e07a5f",
            }}
          >
            {metrics ? formatPercent(metrics.total_return_pct) : "+0.00%"}
          </div>
        </div>
        <div style={cardStyle}>
          <div style={labelStyle}>CAGR</div>
          <div
            style={{
              ...valueStyle,
              color: metrics && metrics.cagr_pct >= 0 ? "#52b788" : "#e07a5f",
            }}
          >
            {metrics ? formatPercent(metrics.cagr_pct) : "+0.00%"}
          </div>
        </div>
        <div style={cardStyle}>
          <div style={labelStyle}>Alpha vs S&P 500</div>
          <div style={{ ...valueStyle, color: "#d4a373" }}>
            {metrics ? formatPercent(metrics.alpha_vs_sp500_pct) : "+0.00%"}
          </div>
        </div>
      </div>

      {/* Top Positions */}
      <div style={cardStyle}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.125rem",
            color: "#e8efe6",
            marginBottom: "1rem",
            fontWeight: 400,
          }}
        >
          Posiciones Principales
        </h2>
        {topPositions.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    textAlign: "left",
                    color: "#5a6e63",
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  <th style={{ paddingBottom: "0.75rem", fontWeight: 600 }}>Ticker</th>
                  <th style={{ paddingBottom: "0.75rem", fontWeight: 600 }}>Nombre</th>
                  <th style={{ paddingBottom: "0.75rem", fontWeight: 600, textAlign: "right" }}>Valor</th>
                  <th style={{ paddingBottom: "0.75rem", fontWeight: 600, textAlign: "right" }}>Peso</th>
                  <th style={{ paddingBottom: "0.75rem", fontWeight: 600, textAlign: "right" }}>P&L</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: "0.875rem" }}>
                {topPositions.map((position, index) => (
                  <tr
                    key={position.id}
                    style={{
                      borderTop: "1px solid rgba(45, 106, 79, 0.1)",
                      background: index % 2 === 1 ? "rgba(22, 35, 32, 0.3)" : "transparent",
                    }}
                  >
                    <td
                      style={{
                        padding: "0.75rem 0",
                        fontFamily: "var(--font-mono)",
                        color: "#52b788",
                      }}
                    >
                      {position.ticker}
                    </td>
                    <td style={{ padding: "0.75rem 0", color: "#8a9e93" }}>
                      {position.name}
                    </td>
                    <td
                      style={{
                        padding: "0.75rem 0",
                        textAlign: "right",
                        fontFamily: "var(--font-mono)",
                        color: "#e8efe6",
                      }}
                    >
                      {formatCurrency(position.market_value_usd)}
                    </td>
                    <td
                      style={{
                        padding: "0.75rem 0",
                        textAlign: "right",
                        fontFamily: "var(--font-mono)",
                        color: "#8a9e93",
                      }}
                    >
                      {position.weight_pct.toFixed(1)}%
                    </td>
                    <td
                      style={{
                        padding: "0.75rem 0",
                        textAlign: "right",
                        fontFamily: "var(--font-mono)",
                        color: position.unrealized_pnl_pct >= 0 ? "#52b788" : "#e07a5f",
                      }}
                    >
                      {formatPercent(position.unrealized_pnl_pct)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: "#5a6e63", textAlign: "center", padding: "2rem 0" }}>
            No hay posiciones registradas. Ve a Portafolio para agregar posiciones.
          </p>
        )}
      </div>

      {/* Quick Actions */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
        }}
        className="admin-actions-grid"
      >
        <a
          href="/admin/snapshots"
          style={{
            ...cardStyle,
            textDecoration: "none",
            transition: "border-color 0.2s",
          }}
        >
          <h3 style={{ fontWeight: 500, color: "#e8efe6", marginBottom: "0.25rem" }}>
            Registrar Snapshot
          </h3>
          <p style={{ color: "#5a6e63", fontSize: "0.875rem" }}>
            Capturar el valor actual del portafolio
          </p>
        </a>
        <a
          href="/admin/transactions"
          style={{
            ...cardStyle,
            textDecoration: "none",
            transition: "border-color 0.2s",
          }}
        >
          <h3 style={{ fontWeight: 500, color: "#e8efe6", marginBottom: "0.25rem" }}>
            Nueva Transacción
          </h3>
          <p style={{ color: "#5a6e63", fontSize: "0.875rem" }}>
            Registrar compra, venta o dividendo
          </p>
        </a>
        <a
          href="/admin/decisions"
          style={{
            ...cardStyle,
            textDecoration: "none",
            transition: "border-color 0.2s",
          }}
        >
          <h3 style={{ fontWeight: 500, color: "#e8efe6", marginBottom: "0.25rem" }}>
            Nueva Decisión
          </h3>
          <p style={{ color: "#5a6e63", fontSize: "0.875rem" }}>
            Documentar una decisión de inversión
          </p>
        </a>
      </div>
    </div>
  );
}
