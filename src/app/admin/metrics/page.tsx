import { createClient } from "@/lib/supabase/server";
import { FundMetrics } from "@/lib/types";
import { MetricsForm } from "./MetricsForm";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const dynamic = "force-dynamic";

async function getMetrics() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("fund_metrics")
    .select("*")
    .order("date", { ascending: false })
    .limit(12);
  return (data || []) as FundMetrics[];
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

export default async function MetricsPage() {
  const metricsHistory = await getMetrics();
  const latestMetrics = metricsHistory[0] || null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl text-text-primary">
          Métricas del Fondo
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Calcula y registra las métricas de rendimiento
        </p>
      </div>

      {/* Current Metrics Summary */}
      {latestMetrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-bg-card border border-border rounded-xl p-5">
            <div className="text-text-muted text-xs uppercase tracking-wider mb-2">
              AUM
            </div>
            <div className="font-[family-name:var(--font-mono)] text-xl text-text-primary">
              {formatCurrency(latestMetrics.aum_usd)}
            </div>
          </div>
          <div className="bg-bg-card border border-border rounded-xl p-5">
            <div className="text-text-muted text-xs uppercase tracking-wider mb-2">
              Rendimiento Total
            </div>
            <div
              className={`font-[family-name:var(--font-mono)] text-xl ${latestMetrics.total_return_pct >= 0 ? "text-green-bright" : "text-red"}`}
            >
              {formatPercent(latestMetrics.total_return_pct)}
            </div>
          </div>
          <div className="bg-bg-card border border-border rounded-xl p-5">
            <div className="text-text-muted text-xs uppercase tracking-wider mb-2">
              CAGR
            </div>
            <div
              className={`font-[family-name:var(--font-mono)] text-xl ${latestMetrics.cagr_pct >= 0 ? "text-green-bright" : "text-red"}`}
            >
              {formatPercent(latestMetrics.cagr_pct)}
            </div>
          </div>
          <div className="bg-bg-card border border-border rounded-xl p-5">
            <div className="text-text-muted text-xs uppercase tracking-wider mb-2">
              Max Drawdown
            </div>
            <div className="font-[family-name:var(--font-mono)] text-xl text-text-primary">
              {latestMetrics.max_drawdown_pct.toFixed(2)}%
            </div>
          </div>
        </div>
      )}

      {/* Add/Update Metrics Form */}
      <MetricsForm currentMetrics={latestMetrics} />

      {/* Metrics History Table */}
      <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-[family-name:var(--font-display)] text-lg">
            Historial de Métricas
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-card-hover">
              <tr className="text-left text-text-muted text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Fecha</th>
                <th className="px-6 py-4 font-semibold text-right">AUM</th>
                <th className="px-6 py-4 font-semibold text-right">Retorno Total</th>
                <th className="px-6 py-4 font-semibold text-right">CAGR</th>
                <th className="px-6 py-4 font-semibold text-right">Alpha</th>
                <th className="px-6 py-4 font-semibold text-right">Drawdown</th>
                <th className="px-6 py-4 font-semibold text-right">Sharpe</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {metricsHistory.length > 0 ? (
                metricsHistory.map((metrics, index) => (
                  <tr
                    key={metrics.id}
                    className={`border-t border-border/50 hover:bg-bg-card-hover transition-colors ${index % 2 === 1 ? "bg-bg-card-hover/50" : ""}`}
                  >
                    <td className="px-6 py-4 font-[family-name:var(--font-mono)] text-text-secondary">
                      {format(new Date(metrics.date), "dd/MM/yyyy", { locale: es })}
                    </td>
                    <td className="px-6 py-4 text-right font-[family-name:var(--font-mono)]">
                      {formatCurrency(metrics.aum_usd)}
                    </td>
                    <td
                      className={`px-6 py-4 text-right font-[family-name:var(--font-mono)] ${metrics.total_return_pct >= 0 ? "text-green-bright" : "text-red"}`}
                    >
                      {formatPercent(metrics.total_return_pct)}
                    </td>
                    <td
                      className={`px-6 py-4 text-right font-[family-name:var(--font-mono)] ${metrics.cagr_pct >= 0 ? "text-green-bright" : "text-red"}`}
                    >
                      {formatPercent(metrics.cagr_pct)}
                    </td>
                    <td className="px-6 py-4 text-right font-[family-name:var(--font-mono)] text-gold">
                      {formatPercent(metrics.alpha_vs_sp500_pct)}
                    </td>
                    <td className="px-6 py-4 text-right font-[family-name:var(--font-mono)] text-text-muted">
                      {metrics.max_drawdown_pct.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 text-right font-[family-name:var(--font-mono)] text-text-muted">
                      {metrics.sharpe_ratio?.toFixed(2) || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-text-muted"
                  >
                    No hay métricas registradas. Usa el formulario de arriba
                    para calcular las primeras métricas.
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
