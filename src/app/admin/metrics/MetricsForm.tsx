"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FundMetrics } from "@/lib/types";

interface MetricsFormProps {
  currentMetrics: FundMetrics | null;
}

export function MetricsForm({ currentMetrics }: MetricsFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    total_return_pct: currentMetrics?.total_return_pct?.toString() || "0",
    cagr_pct: currentMetrics?.cagr_pct?.toString() || "0",
    alpha_vs_sp500_pct: currentMetrics?.alpha_vs_sp500_pct?.toString() || "0",
    max_drawdown_pct: currentMetrics?.max_drawdown_pct?.toString() || "0",
    sharpe_ratio: currentMetrics?.sharpe_ratio?.toString() || "",
    inception_date: currentMetrics?.inception_date || new Date().toISOString().split("T")[0],
    aum_usd: currentMetrics?.aum_usd?.toString() || "0",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: insertError } = await supabase.from("fund_metrics").upsert(
      {
        date: formData.date,
        total_return_pct: parseFloat(formData.total_return_pct),
        cagr_pct: parseFloat(formData.cagr_pct),
        alpha_vs_sp500_pct: parseFloat(formData.alpha_vs_sp500_pct),
        max_drawdown_pct: parseFloat(formData.max_drawdown_pct),
        sharpe_ratio: formData.sharpe_ratio ? parseFloat(formData.sharpe_ratio) : null,
        inception_date: formData.inception_date,
        aum_usd: parseFloat(formData.aum_usd),
      },
      { onConflict: "date" }
    );

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setIsOpen(false);
    router.refresh();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-green-primary text-white rounded-lg text-sm font-medium hover:bg-green-light transition-colors"
      >
        + Actualizar Métricas
      </button>
    );
  }

  return (
    <div className="bg-bg-card border border-border rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-[family-name:var(--font-display)] text-lg">
          Actualizar Métricas
        </h2>
        <button
          onClick={() => setIsOpen(false)}
          className="text-text-muted hover:text-text-primary"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-[rgba(224,122,95,0.1)] border border-red rounded-lg text-red text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-text-muted text-xs uppercase tracking-wider mb-2">
            Fecha
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
            className="w-full px-3 py-2 bg-bg-deep border border-border rounded-lg text-text-primary focus:outline-none focus:border-green-light"
          />
        </div>
        <div>
          <label className="block text-text-muted text-xs uppercase tracking-wider mb-2">
            Fecha de Inicio
          </label>
          <input
            type="date"
            value={formData.inception_date}
            onChange={(e) => setFormData({ ...formData, inception_date: e.target.value })}
            required
            className="w-full px-3 py-2 bg-bg-deep border border-border rounded-lg text-text-primary focus:outline-none focus:border-green-light"
          />
        </div>
        <div>
          <label className="block text-text-muted text-xs uppercase tracking-wider mb-2">
            AUM (USD)
          </label>
          <input
            type="number"
            step="any"
            value={formData.aum_usd}
            onChange={(e) => setFormData({ ...formData, aum_usd: e.target.value })}
            required
            className="w-full px-3 py-2 bg-bg-deep border border-border rounded-lg text-text-primary focus:outline-none focus:border-green-light"
          />
        </div>
        <div>
          <label className="block text-text-muted text-xs uppercase tracking-wider mb-2">
            Retorno Total (%)
          </label>
          <input
            type="number"
            step="any"
            value={formData.total_return_pct}
            onChange={(e) => setFormData({ ...formData, total_return_pct: e.target.value })}
            required
            className="w-full px-3 py-2 bg-bg-deep border border-border rounded-lg text-text-primary focus:outline-none focus:border-green-light"
          />
        </div>
        <div>
          <label className="block text-text-muted text-xs uppercase tracking-wider mb-2">
            CAGR (%)
          </label>
          <input
            type="number"
            step="any"
            value={formData.cagr_pct}
            onChange={(e) => setFormData({ ...formData, cagr_pct: e.target.value })}
            required
            className="w-full px-3 py-2 bg-bg-deep border border-border rounded-lg text-text-primary focus:outline-none focus:border-green-light"
          />
        </div>
        <div>
          <label className="block text-text-muted text-xs uppercase tracking-wider mb-2">
            Alpha vs S&P 500 (%)
          </label>
          <input
            type="number"
            step="any"
            value={formData.alpha_vs_sp500_pct}
            onChange={(e) => setFormData({ ...formData, alpha_vs_sp500_pct: e.target.value })}
            required
            className="w-full px-3 py-2 bg-bg-deep border border-border rounded-lg text-text-primary focus:outline-none focus:border-green-light"
          />
        </div>
        <div>
          <label className="block text-text-muted text-xs uppercase tracking-wider mb-2">
            Max Drawdown (%)
          </label>
          <input
            type="number"
            step="any"
            value={formData.max_drawdown_pct}
            onChange={(e) => setFormData({ ...formData, max_drawdown_pct: e.target.value })}
            required
            className="w-full px-3 py-2 bg-bg-deep border border-border rounded-lg text-text-primary focus:outline-none focus:border-green-light"
          />
        </div>
        <div>
          <label className="block text-text-muted text-xs uppercase tracking-wider mb-2">
            Sharpe Ratio (opcional)
          </label>
          <input
            type="number"
            step="any"
            value={formData.sharpe_ratio}
            onChange={(e) => setFormData({ ...formData, sharpe_ratio: e.target.value })}
            className="w-full px-3 py-2 bg-bg-deep border border-border rounded-lg text-text-primary focus:outline-none focus:border-green-light"
            placeholder="Ej: 1.5"
          />
        </div>
        <div className="md:col-span-4 flex justify-end gap-3 mt-2">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 border border-border rounded-lg text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-primary text-white rounded-lg font-medium hover:bg-green-light transition-colors disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar Métricas"}
          </button>
        </div>
      </form>
    </div>
  );
}
