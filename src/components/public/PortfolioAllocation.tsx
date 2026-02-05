import { AllocationData, AllocationItem } from "@/lib/types";

interface PortfolioAllocationProps {
  data: AllocationData;
}

function AllocationBar({ items, title }: { items: AllocationItem[]; title: string }) {
  return (
    <div
      style={{
        background: "#111a16",
        border: "1px solid rgba(45, 106, 79, 0.2)",
        borderRadius: "16px",
        padding: "2rem",
      }}
    >
      <h4
        style={{
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "#5a6e63",
          marginBottom: "1.5rem",
        }}
      >
        {title}
      </h4>
      <div>
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.85rem 0",
              borderBottom: index < items.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "3px",
                  backgroundColor: item.color,
                }}
              />
              <span style={{ fontSize: "0.9rem", fontWeight: 500, color: "#e8efe6" }}>
                {item.name}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.9rem",
                  color: "#8a9e93",
                }}
              >
                {item.percentage.toFixed(0)}%
              </span>
              <div
                style={{
                  width: "120px",
                  height: "4px",
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: "2px",
                  overflow: "hidden",
                  marginLeft: "1rem",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    borderRadius: "2px",
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                    transition: "width 0.8s ease",
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PortfolioAllocation({ data }: PortfolioAllocationProps) {
  return (
    <section id="portfolio" style={{ padding: "3rem 0" }}>
      <div
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
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.6rem",
            fontWeight: 400,
            color: "#e8efe6",
          }}
        >
          Composición del Portafolio
        </h3>
        <span style={{ fontSize: "0.8rem", color: "#5a6e63", fontWeight: 500 }}>
          Distribución actual
        </span>
      </div>

      <div
        className="allocation-grid-responsive"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
        }}
      >
        <AllocationBar items={data.byAssetClass} title="Por Clase de Activo" />
        <AllocationBar items={data.byGeography} title="Por Geografía" />
      </div>
    </section>
  );
}
