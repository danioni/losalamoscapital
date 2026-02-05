"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Position } from "@/lib/types";

interface UpdatePricesButtonProps {
  positions: Position[];
}

const inputStyle = {
  width: "100%",
  padding: "0.625rem 0.75rem",
  background: "#0a0f0d",
  border: "1px solid rgba(45, 106, 79, 0.2)",
  borderRadius: "8px",
  color: "#e8efe6",
  fontSize: "0.875rem",
  fontFamily: "var(--font-mono)",
  outline: "none",
  transition: "border-color 0.2s",
};

export function UpdatePricesButton({ positions }: UpdatePricesButtonProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prices, setPrices] = useState<Record<string, string>>({});

  const handleOpen = () => {
    const initialPrices: Record<string, string> = {};
    positions.forEach((pos) => {
      initialPrices[pos.id] = pos.current_price_usd.toString();
    });
    setPrices(initialPrices);
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    for (const pos of positions) {
      const newPrice = parseFloat(prices[pos.id] || pos.current_price_usd.toString());
      const marketValue = pos.quantity * newPrice;
      const unrealizedPnl = marketValue - pos.quantity * pos.avg_cost_usd;
      const unrealizedPnlPct =
        pos.quantity * pos.avg_cost_usd > 0
          ? (unrealizedPnl / (pos.quantity * pos.avg_cost_usd)) * 100
          : 0;

      await supabase
        .from("positions")
        .update({
          current_price_usd: newPrice,
          market_value_usd: marketValue,
          unrealized_pnl_usd: unrealizedPnl,
          unrealized_pnl_pct: unrealizedPnlPct,
          last_updated: new Date().toISOString(),
        })
        .eq("id", pos.id);
    }

    const { data: allPositions } = await supabase.from("positions").select("*");
    if (allPositions && allPositions.length > 0) {
      const totalValue = allPositions.reduce(
        (sum, p) => sum + (p.market_value_usd || 0),
        0
      );

      for (const pos of allPositions) {
        const weight =
          totalValue > 0 ? ((pos.market_value_usd || 0) / totalValue) * 100 : 0;
        await supabase.from("positions").update({ weight_pct: weight }).eq("id", pos.id);
      }
    }

    setLoading(false);
    setIsOpen(false);
    router.refresh();
  };

  if (positions.length === 0) {
    return null;
  }

  if (!isOpen) {
    return (
      <button
        onClick={handleOpen}
        style={{
          padding: "0.625rem 1rem",
          background: "transparent",
          border: "1px solid rgba(45, 106, 79, 0.2)",
          borderRadius: "8px",
          color: "#8a9e93",
          fontSize: "0.875rem",
          fontWeight: 500,
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#e8efe6";
          e.currentTarget.style.borderColor = "rgba(45, 106, 79, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#8a9e93";
          e.currentTarget.style.borderColor = "rgba(45, 106, 79, 0.2)";
        }}
      >
        Actualizar Precios
      </button>
    );
  }

  return (
    <div
      style={{
        background: "#111a16",
        border: "1px solid rgba(45, 106, 79, 0.2)",
        borderRadius: "12px",
        padding: "1.5rem",
        flex: 1,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.125rem",
            color: "#e8efe6",
            fontWeight: 400,
          }}
        >
          Actualizar Precios
        </h2>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: "none",
            border: "none",
            color: "#5a6e63",
            cursor: "pointer",
            padding: "0.25rem",
          }}
        >
          <svg
            style={{ width: "20px", height: "20px" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
          }}
        >
          {positions.map((pos) => (
            <div key={pos.id}>
              <label
                style={{
                  display: "block",
                  color: "#5a6e63",
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "0.5rem",
                  fontWeight: 600,
                }}
              >
                {pos.ticker}
              </label>
              <input
                type="number"
                step="any"
                value={prices[pos.id] || ""}
                onChange={(e) => setPrices({ ...prices, [pos.id]: e.target.value })}
                style={inputStyle}
                placeholder="0.00"
                onFocus={(e) => (e.target.style.borderColor = "#40916c")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(45, 106, 79, 0.2)")}
              />
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
            marginTop: "1rem",
          }}
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            style={{
              padding: "0.625rem 1rem",
              background: "transparent",
              border: "1px solid rgba(45, 106, 79, 0.2)",
              borderRadius: "8px",
              color: "#8a9e93",
              fontSize: "0.875rem",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.625rem 1rem",
              background: loading ? "#1a3a2a" : "#2d6a4f",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "background 0.2s",
            }}
          >
            {loading ? "Actualizando..." : "Guardar Precios"}
          </button>
        </div>
      </form>
    </div>
  );
}
