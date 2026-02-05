"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DecisionType, decisionTypeLabels } from "@/lib/types";

export function DecisionForm() {
  const router = useRouter();
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    title: "",
    description: "",
    type: "buy" as DecisionType,
    is_public: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: insertError } = await supabase.from("decisions").insert({
      date: formData.date,
      title: formData.title,
      description: formData.description,
      type: formData.type,
      is_public: formData.is_public,
    });

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setFormData({
      date: new Date().toISOString().split("T")[0],
      title: "",
      description: "",
      type: "buy",
      is_public: true,
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
        + Nueva Decisión
      </button>
    );
  }

  return (
    <div className="bg-bg-card border border-border rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-[family-name:var(--font-display)] text-lg">
          Nueva Decisión
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              Tipo
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as DecisionType })}
              className="w-full px-3 py-2 bg-bg-deep border border-border rounded-lg text-text-primary focus:outline-none focus:border-green-light"
            >
              {Object.entries(decisionTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_public}
                onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                className="w-4 h-4 rounded border-border bg-bg-deep text-green-primary focus:ring-green-light"
              />
              <span className="text-sm text-text-secondary">Público en el sitio</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-text-muted text-xs uppercase tracking-wider mb-2">
            Título
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-3 py-2 bg-bg-deep border border-border rounded-lg text-text-primary focus:outline-none focus:border-green-light"
            placeholder="Ej: Compra inicial de BTC, Apertura posición en AAPL..."
          />
        </div>
        <div>
          <label className="block text-text-muted text-xs uppercase tracking-wider mb-2">
            Descripción / Tesis
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={4}
            className="w-full px-3 py-2 bg-bg-deep border border-border rounded-lg text-text-primary focus:outline-none focus:border-green-light resize-none"
            placeholder="Describe la tesis de inversión, por qué tomas esta decisión, precio de entrada, catalizadores esperados, criterios de salida..."
          />
        </div>
        <div className="flex justify-end gap-3">
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
            {loading ? "Guardando..." : "Guardar Decisión"}
          </button>
        </div>
      </form>
    </div>
  );
}
