import { createClient } from "@/lib/supabase/server";
import { Decision, decisionTypeLabels } from "@/lib/types";
import { DecisionForm } from "./DecisionForm";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const dynamic = "force-dynamic";

async function getDecisions() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("decisions")
    .select("*")
    .order("date", { ascending: false });
  return (data || []) as Decision[];
}

function getTypeClass(type: Decision["type"]): string {
  switch (type) {
    case "buy":
      return "bg-[rgba(82,183,136,0.15)] text-green-bright";
    case "sell":
      return "bg-[rgba(224,122,95,0.15)] text-red";
    case "hold":
    case "rebalance":
      return "bg-[rgba(212,163,115,0.15)] text-gold";
    default:
      return "bg-[rgba(90,110,99,0.15)] text-text-secondary";
  }
}

export default async function DecisionsPage() {
  const decisions = await getDecisions();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl text-text-primary">
          Decisiones
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Documenta las decisiones de inversión del fondo
        </p>
      </div>

      {/* Add Decision Form */}
      <DecisionForm />

      {/* Decisions List */}
      <div className="space-y-4">
        {decisions.length > 0 ? (
          decisions.map((decision) => (
            <div
              key={decision.id}
              className="bg-bg-card border border-border rounded-xl p-6 hover:border-border-hover transition-colors"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-[family-name:var(--font-mono)] text-sm text-text-muted">
                    {format(new Date(decision.date), "dd/MM/yyyy", { locale: es })}
                  </span>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium uppercase ${getTypeClass(decision.type)}`}
                  >
                    {decisionTypeLabels[decision.type]}
                  </span>
                  {!decision.is_public && (
                    <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-bg-card-hover text-text-muted">
                      Privado
                    </span>
                  )}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {decision.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {decision.description}
              </p>
            </div>
          ))
        ) : (
          <div className="bg-bg-card border border-border rounded-xl p-12 text-center">
            <p className="text-text-muted">
              No hay decisiones registradas. Usa el botón de arriba para
              documentar tu primera decisión de inversión.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
