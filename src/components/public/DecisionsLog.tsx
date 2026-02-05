import { Decision, decisionTypeLabels } from "@/lib/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface DecisionsLogProps {
  decisions: Decision[];
}

function getTagStyles(type: Decision["type"]): { background: string; color: string } {
  switch (type) {
    case "buy":
      return { background: "rgba(82, 183, 136, 0.15)", color: "#52b788" };
    case "sell":
      return { background: "rgba(224, 122, 95, 0.15)", color: "#e07a5f" };
    case "hold":
    case "rebalance":
      return { background: "rgba(212, 163, 115, 0.15)", color: "#d4a373" };
    default:
      return { background: "rgba(212, 163, 115, 0.15)", color: "#d4a373" };
  }
}

const sectionHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  marginBottom: "2rem",
  paddingBottom: "1rem",
  borderBottom: "1px solid rgba(45, 106, 79, 0.2)",
};

const h3Style = {
  fontFamily: "var(--font-display)",
  fontSize: "1.6rem",
  fontWeight: 400,
  color: "#e8efe6",
};

const subtitleStyle = {
  fontSize: "0.8rem",
  color: "#5a6e63",
  fontWeight: 500,
};

export function DecisionsLog({ decisions }: DecisionsLogProps) {
  if (decisions.length === 0) {
    return (
      <section id="decisions" style={{ padding: "3rem 0" }}>
        <div style={sectionHeaderStyle}>
          <h3 style={h3Style}>Registro de Decisiones</h3>
          <span style={subtitleStyle}>Transparencia total</span>
        </div>
        <div
          style={{
            background: "#111a16",
            border: "1px solid rgba(45, 106, 79, 0.2)",
            borderRadius: "12px",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#5a6e63" }}>
            Aún no hay decisiones registradas públicamente.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="decisions" style={{ padding: "3rem 0" }}>
      <div style={sectionHeaderStyle}>
        <h3 style={h3Style}>Registro de Decisiones</h3>
        <span style={subtitleStyle}>Transparencia total</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {decisions.map((decision) => {
          const tagStyles = getTagStyles(decision.type);
          return (
            <div
              key={decision.id}
              className="decision-card-responsive"
              style={{
                background: "#111a16",
                border: "1px solid rgba(45, 106, 79, 0.2)",
                borderRadius: "12px",
                padding: "1.5rem 2rem",
                display: "grid",
                gridTemplateColumns: "100px 1fr auto",
                gap: "1.5rem",
                alignItems: "center",
                transition: "border-color 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(45, 106, 79, 0.4)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(45, 106, 79, 0.2)")}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.8rem",
                  color: "#5a6e63",
                }}
              >
                {format(new Date(decision.date), "dd/MM/yyyy", { locale: es })}
              </div>
              <div>
                <h4
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    marginBottom: "0.25rem",
                    color: "#e8efe6",
                  }}
                >
                  {decision.title}
                </h4>
                <p
                  style={{
                    fontSize: "0.82rem",
                    color: "#8a9e93",
                    lineHeight: 1.5,
                  }}
                >
                  {decision.description}
                </p>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  padding: "0.3rem 0.8rem",
                  borderRadius: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  background: tagStyles.background,
                  color: tagStyles.color,
                }}
              >
                {decisionTypeLabels[decision.type]}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
