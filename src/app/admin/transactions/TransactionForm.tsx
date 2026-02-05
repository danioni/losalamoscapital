"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TransactionType, transactionTypeLabels } from "@/lib/types";

export function TransactionForm() {
  const router = useRouter();
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    ticker: "",
    type: "buy" as TransactionType,
    quantity: "",
    price_usd: "",
    commission_usd: "0",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const ticker = formData.ticker.toUpperCase();
    const quantity = parseFloat(formData.quantity);
    const price = parseFloat(formData.price_usd);
    const commission = parseFloat(formData.commission_usd) || 0;

    // Insert transaction
    const { error: insertError } = await supabase.from("transactions").insert({
      date: formData.date,
      ticker,
      type: formData.type,
      quantity,
      price_usd: price,
      commission_usd: commission,
      notes: formData.notes || null,
    });

    if (insertError) {
      setLoading(false);
      setError(insertError.message);
      return;
    }

    // Update positions for buy/sell transactions
    if (formData.type === "buy" || formData.type === "sell") {
      // Check if position exists
      const { data: existingPosition } = await supabase
        .from("positions")
        .select("*")
        .eq("ticker", ticker)
        .single();

      if (formData.type === "buy") {
        if (existingPosition) {
          // Update existing position with weighted average cost
          const newQuantity = existingPosition.quantity + quantity;
          const totalCost = (existingPosition.quantity * existingPosition.avg_cost_usd) + (quantity * price) + commission;
          const newAvgCost = totalCost / newQuantity;
          const marketValue = newQuantity * existingPosition.current_price_usd;
          const unrealizedPnl = marketValue - (newQuantity * newAvgCost);
          const unrealizedPnlPct = (unrealizedPnl / (newQuantity * newAvgCost)) * 100;

          await supabase
            .from("positions")
            .update({
              quantity: newQuantity,
              avg_cost_usd: newAvgCost,
              market_value_usd: marketValue,
              unrealized_pnl_usd: unrealizedPnl,
              unrealized_pnl_pct: unrealizedPnlPct,
              last_updated: new Date().toISOString(),
            })
            .eq("ticker", ticker);
        } else {
          // Create new position
          await supabase.from("positions").insert({
            ticker,
            name: ticker, // Can be updated later
            asset_class: "acciones_usa", // Default, can be updated
            geography: "usa", // Default, can be updated
            quantity,
            avg_cost_usd: price + (commission / quantity),
            current_price_usd: price,
            market_value_usd: quantity * price,
            weight_pct: 0, // Will be recalculated
            unrealized_pnl_usd: 0,
            unrealized_pnl_pct: 0,
          });
        }
      } else if (formData.type === "sell" && existingPosition) {
        const newQuantity = existingPosition.quantity - quantity;

        if (newQuantity <= 0) {
          // Delete position if fully sold
          await supabase.from("positions").delete().eq("ticker", ticker);
        } else {
          // Update position
          const marketValue = newQuantity * existingPosition.current_price_usd;
          const unrealizedPnl = marketValue - (newQuantity * existingPosition.avg_cost_usd);
          const unrealizedPnlPct = (unrealizedPnl / (newQuantity * existingPosition.avg_cost_usd)) * 100;

          await supabase
            .from("positions")
            .update({
              quantity: newQuantity,
              market_value_usd: marketValue,
              unrealized_pnl_usd: unrealizedPnl,
              unrealized_pnl_pct: unrealizedPnlPct,
              last_updated: new Date().toISOString(),
            })
            .eq("ticker", ticker);
        }
      }

      // Recalculate weights for all positions
      const { data: allPositions } = await supabase.from("positions").select("*");
      if (allPositions && allPositions.length > 0) {
        const totalValue = allPositions.reduce((sum, p) => sum + (p.market_value_usd || 0), 0);

        for (const pos of allPositions) {
          const weight = totalValue > 0 ? ((pos.market_value_usd || 0) / totalValue) * 100 : 0;
          await supabase
            .from("positions")
            .update({ weight_pct: weight })
            .eq("id", pos.id);
        }
      }
    }

    setLoading(false);

    setFormData({
      date: new Date().toISOString().split("T")[0],
      ticker: "",
      type: "buy",
      quantity: "",
      price_usd: "",
      commission_usd: "0",
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
        + Nueva Transacción
      </button>
    );
  }

  return (
    <div className="bg-bg-card border border-border rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-[family-name:var(--font-display)] text-lg">
          Nueva Transacción
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
            Ticker
          </label>
          <input
            type="text"
            value={formData.ticker}
            onChange={(e) => setFormData({ ...formData, ticker: e.target.value })}
            required
            className="w-full px-3 py-2 bg-bg-deep border border-border rounded-lg text-text-primary focus:outline-none focus:border-green-light"
            placeholder="BTC, AAPL..."
          />
        </div>
        <div>
          <label className="block text-text-muted text-xs uppercase tracking-wider mb-2">
            Tipo
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as TransactionType })}
            className="w-full px-3 py-2 bg-bg-deep border border-border rounded-lg text-text-primary focus:outline-none focus:border-green-light"
          >
            {Object.entries(transactionTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-text-muted text-xs uppercase tracking-wider mb-2">
            Cantidad
          </label>
          <input
            type="number"
            step="any"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            required
            className="w-full px-3 py-2 bg-bg-deep border border-border rounded-lg text-text-primary focus:outline-none focus:border-green-light"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-text-muted text-xs uppercase tracking-wider mb-2">
            Precio (USD)
          </label>
          <input
            type="number"
            step="any"
            value={formData.price_usd}
            onChange={(e) => setFormData({ ...formData, price_usd: e.target.value })}
            required
            className="w-full px-3 py-2 bg-bg-deep border border-border rounded-lg text-text-primary focus:outline-none focus:border-green-light"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-text-muted text-xs uppercase tracking-wider mb-2">
            Comisión (USD)
          </label>
          <input
            type="number"
            step="any"
            value={formData.commission_usd}
            onChange={(e) => setFormData({ ...formData, commission_usd: e.target.value })}
            className="w-full px-3 py-2 bg-bg-deep border border-border rounded-lg text-text-primary focus:outline-none focus:border-green-light"
            placeholder="0.00"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-text-muted text-xs uppercase tracking-wider mb-2">
            Notas (opcional)
          </label>
          <input
            type="text"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 bg-bg-deep border border-border rounded-lg text-text-primary focus:outline-none focus:border-green-light"
            placeholder="Notas adicionales..."
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
            {loading ? "Guardando..." : "Guardar Transacción"}
          </button>
        </div>
      </form>
    </div>
  );
}
