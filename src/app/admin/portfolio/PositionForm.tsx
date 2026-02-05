"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  AssetClass,
  Geography,
  assetClassLabels,
  geographyLabels,
} from "@/lib/types";

const inputStyle = {
  width: "100%",
  padding: "0.625rem 0.75rem",
  background: "#0a0f0d",
  border: "1px solid rgba(45, 106, 79, 0.2)",
  borderRadius: "8px",
  color: "#e8efe6",
  fontSize: "0.875rem",
  outline: "none",
  transition: "border-color 0.2s",
};

const labelStyle = {
  display: "block",
  color: "#5a6e63",
  fontSize: "0.7rem",
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  marginBottom: "0.5rem",
  fontWeight: 600,
};

export function PositionForm() {
  const router = useRouter();
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    ticker: "",
    name: "",
    asset_class: "acciones_usa" as AssetClass,
    geography: "usa" as Geography,
    quantity: "",
    avg_cost_usd: "",
    current_price_usd: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: insertError } = await supabase.from("positions").insert({
      ticker: formData.ticker.toUpperCase(),
      name: formData.name,
      asset_class: formData.asset_class,
      geography: formData.geography,
      quantity: parseFloat(formData.quantity),
      avg_cost_usd: parseFloat(formData.avg_cost_usd),
      current_price_usd: parseFloat(formData.current_price_usd),
    });

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setFormData({
      ticker: "",
      name: "",
      asset_class: "acciones_usa",
      geography: "usa",
      quantity: "",
      avg_cost_usd: "",
      current_price_usd: "",
    });
    setIsOpen(false);
    router.refresh();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
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
        onMouseEnter={(e) => (e.currentTarget.style.background = "#40916c")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#2d6a4f")}
      >
        + Nueva Posición
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
          Nueva Posición
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

      {error && (
        <div
          style={{
            marginBottom: "1rem",
            padding: "0.75rem",
            background: "rgba(224, 122, 95, 0.1)",
            border: "1px solid #e07a5f",
            borderRadius: "8px",
            color: "#e07a5f",
            fontSize: "0.875rem",
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
        }}
      >
        <div>
          <label style={labelStyle}>Ticker</label>
          <input
            type="text"
            value={formData.ticker}
            onChange={(e) => setFormData({ ...formData, ticker: e.target.value })}
            required
            style={inputStyle}
            placeholder="BTC, AAPL, VOO..."
            onFocus={(e) => (e.target.style.borderColor = "#40916c")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(45, 106, 79, 0.2)")}
          />
        </div>
        <div style={{ gridColumn: "span 2" }}>
          <label style={labelStyle}>Nombre</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            style={inputStyle}
            placeholder="Bitcoin, Apple Inc., Vanguard S&P 500..."
            onFocus={(e) => (e.target.style.borderColor = "#40916c")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(45, 106, 79, 0.2)")}
          />
        </div>
        <div>
          <label style={labelStyle}>Clase de Activo</label>
          <select
            value={formData.asset_class}
            onChange={(e) =>
              setFormData({ ...formData, asset_class: e.target.value as AssetClass })
            }
            style={inputStyle}
          >
            {Object.entries(assetClassLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Geografía</label>
          <select
            value={formData.geography}
            onChange={(e) =>
              setFormData({ ...formData, geography: e.target.value as Geography })
            }
            style={inputStyle}
          >
            {Object.entries(geographyLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Cantidad</label>
          <input
            type="number"
            step="any"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            required
            style={inputStyle}
            placeholder="0.00"
            onFocus={(e) => (e.target.style.borderColor = "#40916c")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(45, 106, 79, 0.2)")}
          />
        </div>
        <div>
          <label style={labelStyle}>Costo Promedio (USD)</label>
          <input
            type="number"
            step="any"
            value={formData.avg_cost_usd}
            onChange={(e) => setFormData({ ...formData, avg_cost_usd: e.target.value })}
            required
            style={inputStyle}
            placeholder="0.00"
            onFocus={(e) => (e.target.style.borderColor = "#40916c")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(45, 106, 79, 0.2)")}
          />
        </div>
        <div>
          <label style={labelStyle}>Precio Actual (USD)</label>
          <input
            type="number"
            step="any"
            value={formData.current_price_usd}
            onChange={(e) =>
              setFormData({ ...formData, current_price_usd: e.target.value })
            }
            required
            style={inputStyle}
            placeholder="0.00"
            onFocus={(e) => (e.target.style.borderColor = "#40916c")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(45, 106, 79, 0.2)")}
          />
        </div>
        <div
          style={{
            gridColumn: "span 3",
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
            marginTop: "0.5rem",
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
            {loading ? "Guardando..." : "Guardar Posición"}
          </button>
        </div>
      </form>
    </div>
  );
}
