import { createClient } from "@/lib/supabase/server";
import { Position, assetClassLabels, geographyLabels } from "@/lib/types";
import { PositionForm } from "./PositionForm";
import { UpdatePricesButton } from "./UpdatePricesButton";

export const dynamic = "force-dynamic";

async function getPositions() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("positions")
    .select("*")
    .order("weight_pct", { ascending: false });
  return (data || []) as Position[];
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

export default async function PortfolioPage() {
  const positions = await getPositions();
  const totalValue = positions.reduce((sum, p) => sum + p.market_value_usd, 0);

  const cardStyle = {
    background: "#111a16",
    border: "1px solid rgba(45, 106, 79, 0.2)",
    borderRadius: "12px",
    overflow: "hidden",
  };

  const thStyle = {
    padding: "1rem 1.5rem",
    fontWeight: 600,
    fontSize: "0.7rem",
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    color: "#5a6e63",
    textAlign: "left" as const,
  };

  const tdStyle = {
    padding: "1rem 1.5rem",
    fontSize: "0.875rem",
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
            Portafolio
          </h1>
          <p style={{ color: "#8a9e93", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            Gestiona las posiciones actuales del fondo
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              color: "#5a6e63",
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Valor Total
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "1.5rem",
              color: "#e8efe6",
            }}
          >
            {formatCurrency(totalValue)}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <PositionForm />
        <UpdatePricesButton positions={positions} />
      </div>

      {/* Positions Table */}
      <div style={cardStyle}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#162320" }}>
              <tr>
                <th style={thStyle}>Ticker</th>
                <th style={thStyle}>Nombre</th>
                <th style={thStyle}>Clase</th>
                <th style={thStyle}>Geografía</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Cantidad</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Precio</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Valor</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Peso</th>
                <th style={{ ...thStyle, textAlign: "right" }}>P&L</th>
              </tr>
            </thead>
            <tbody>
              {positions.length > 0 ? (
                positions.map((position, index) => (
                  <tr
                    key={position.id}
                    style={{
                      borderTop: "1px solid rgba(45, 106, 79, 0.1)",
                      background: index % 2 === 1 ? "rgba(22, 35, 32, 0.5)" : "transparent",
                    }}
                  >
                    <td
                      style={{
                        ...tdStyle,
                        fontFamily: "var(--font-mono)",
                        color: "#52b788",
                        fontWeight: 500,
                      }}
                    >
                      {position.ticker}
                    </td>
                    <td style={{ ...tdStyle, color: "#e8efe6" }}>
                      {position.name}
                    </td>
                    <td style={{ ...tdStyle, color: "#8a9e93" }}>
                      {assetClassLabels[position.asset_class]}
                    </td>
                    <td style={{ ...tdStyle, color: "#8a9e93" }}>
                      {geographyLabels[position.geography]}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        textAlign: "right",
                        fontFamily: "var(--font-mono)",
                        color: "#e8efe6",
                      }}
                    >
                      {position.quantity.toLocaleString()}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        textAlign: "right",
                        fontFamily: "var(--font-mono)",
                        color: "#e8efe6",
                      }}
                    >
                      ${position.current_price_usd.toFixed(2)}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        textAlign: "right",
                        fontFamily: "var(--font-mono)",
                        color: "#e8efe6",
                      }}
                    >
                      {formatCurrency(position.market_value_usd)}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        textAlign: "right",
                        fontFamily: "var(--font-mono)",
                        color: "#8a9e93",
                      }}
                    >
                      {position.weight_pct.toFixed(1)}%
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        textAlign: "right",
                        fontFamily: "var(--font-mono)",
                        color: position.unrealized_pnl_pct >= 0 ? "#52b788" : "#e07a5f",
                      }}
                    >
                      {formatPercent(position.unrealized_pnl_pct)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      padding: "3rem 1.5rem",
                      textAlign: "center",
                      color: "#5a6e63",
                    }}
                  >
                    No hay posiciones registradas. Usa el formulario de arriba
                    para agregar la primera.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
