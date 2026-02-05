import { createClient } from "@/lib/supabase/server";
import { PortfolioSnapshot } from "@/lib/types";
import { SnapshotForm } from "./SnapshotForm";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const dynamic = "force-dynamic";

async function getSnapshots() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("portfolio_snapshots")
    .select("*")
    .order("date", { ascending: false })
    .limit(30);
  return (data || []) as PortfolioSnapshot[];
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function SnapshotsPage() {
  const snapshots = await getSnapshots();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl text-text-primary">
          Snapshots
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Registros periódicos del valor del portafolio
        </p>
      </div>

      {/* Add Snapshot Form */}
      <SnapshotForm />

      {/* Snapshots Table */}
      <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-card-hover">
              <tr className="text-left text-text-muted text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Fecha</th>
                <th className="px-6 py-4 font-semibold text-right">Valor Total (USD)</th>
                <th className="px-6 py-4 font-semibold text-right">NAV por Acción</th>
                <th className="px-6 py-4 font-semibold text-right">Benchmark S&P 500</th>
                <th className="px-6 py-4 font-semibold">Notas</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {snapshots.length > 0 ? (
                snapshots.map((snapshot, index) => (
                  <tr
                    key={snapshot.id}
                    className={`border-t border-border/50 hover:bg-bg-card-hover transition-colors ${index % 2 === 1 ? "bg-bg-card-hover/50" : ""}`}
                  >
                    <td className="px-6 py-4 font-[family-name:var(--font-mono)] text-text-secondary">
                      {format(new Date(snapshot.date), "dd/MM/yyyy", { locale: es })}
                    </td>
                    <td className="px-6 py-4 text-right font-[family-name:var(--font-mono)] text-text-primary">
                      {formatCurrency(snapshot.total_value_usd)}
                    </td>
                    <td className="px-6 py-4 text-right font-[family-name:var(--font-mono)] text-green-bright">
                      ${snapshot.nav_per_share.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right font-[family-name:var(--font-mono)] text-text-muted">
                      ${snapshot.benchmark_value.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-text-muted truncate max-w-[200px]">
                      {snapshot.notes || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-text-muted"
                  >
                    No hay snapshots registrados. Registra el primer snapshot
                    para comenzar a rastrear el rendimiento.
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
