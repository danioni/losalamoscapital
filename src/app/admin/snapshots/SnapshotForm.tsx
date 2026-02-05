"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SnapshotForm() {
  const router = useRouter();
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    total_value_usd: "",
    nav_per_share: "1000",
    benchmark_value: "1000",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: insertError } = await supabase.from("portfolio_snapshots").insert({
      date: formData.date,
      total_value_usd: parseFloat(formData.total_value_usd),
      nav_per_share: parseFloat(formData.nav_per_share),
      benchmark_value: parseFloat(formData.benchmark_value),
      notes: formData.notes || null,
    });

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setFormData({
      date: new Date().toISOString().split("T")[0],
      total_value_usd: "",
      nav_per_share: "1000",
      benchmark_value: "1000",
      notes: "",
    });
    setIsOpen(false);
    router.refresh();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-green-primary text-white rounded-lg text-sm font-medium hover:bg-green-light transition-colors"
      >
        + Nuevo Snapshot
      </button>
    );
  }

  return (
    <div className="bg-bg-card border border-border rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-[family-name:var(--font-display)] text-lg">
          Nuevo Snapshot
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

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
            Valor Total (USD)
          </label>
          <input
            type="number"
            step="any"
            value={formData.total_value_usd}
            onChange={(e) => setFormData({ ...formData, total_value_usd: e.target.value })}
            required
            className="w-full px-3 py-2 bg-bg-deep border border-border rounded-lg text-text-primary focus:outline-none focus:border-green-light"
            placeholder="150000"
          />
        </div>
        <div>
          <label className="block text-text-muted text-xs uppercase tracking-wider mb-2">
            NAV por Acción
          </label>
          <input
            type="number"
            step="any"
            value={formData.nav_per_share}
            onChange={(e) => setFormData({ ...formData, nav_per_share: e.target.value })}
            required
            className="w-full px-3 py-2 bg-bg-deep border border-border rounded-lg text-text-primary focus:outline-none focus:border-green-light"
            placeholder="1000"
          />
          <p className="text-text-muted text-xs mt-1">Base inicial: 1000</p>
        </div>
        <div>
          <label className="block text-text-muted text-xs uppercase tracking-wider mb-2">
            Benchmark S&P 500
          </label>
          <input
            type="number"
            step="any"
            value={formData.benchmark_value}
            onChange={(e) => setFormData({ ...formData, benchmark_value: e.target.value })}
            required
            className="w-full px-3 py-2 bg-bg-deep border border-border rounded-lg text-text-primary focus:outline-none focus:border-green-light"
            placeholder="1000"
          />
          <p className="text-text-muted text-xs mt-1">Valor equivalente S&P 500</p>
        </div>
        <div>
          <label className="block text-text-muted text-xs uppercase tracking-wider mb-2">
            Notas (opcional)
          </label>
          <input
            type="text"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 bg-bg-deep border border-border rounded-lg text-text-primary focus:outline-none focus:border-green-light"
            placeholder="Notas del día..."
          />
        </div>
        <div className="md:col-span-2 lg:col-span-5 flex justify-end gap-3 mt-2">
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
            {loading ? "Guardando..." : "Guardar Snapshot"}
          </button>
        </div>
      </form>
    </div>
  );
}
