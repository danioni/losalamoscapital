import { createClient } from "@/lib/supabase/server";
import { Transaction, transactionTypeLabels } from "@/lib/types";
import { TransactionForm } from "./TransactionForm";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const dynamic = "force-dynamic";

async function getTransactions() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false })
    .limit(50);
  return (data || []) as Transaction[];
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function getTypeClass(type: Transaction["type"]): string {
  switch (type) {
    case "buy":
      return "bg-[rgba(82,183,136,0.15)] text-green-bright";
    case "sell":
      return "bg-[rgba(224,122,95,0.15)] text-red";
    case "dividend":
      return "bg-[rgba(212,163,115,0.15)] text-gold";
    default:
      return "bg-[rgba(90,110,99,0.15)] text-text-secondary";
  }
}

export default async function TransactionsPage() {
  const transactions = await getTransactions();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl text-text-primary">
          Transacciones
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Registro de todas las operaciones del fondo
        </p>
      </div>

      {/* Add Transaction Form */}
      <TransactionForm />

      {/* Transactions Table */}
      <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-card-hover">
              <tr className="text-left text-text-muted text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Fecha</th>
                <th className="px-6 py-4 font-semibold">Ticker</th>
                <th className="px-6 py-4 font-semibold">Tipo</th>
                <th className="px-6 py-4 font-semibold text-right">Cantidad</th>
                <th className="px-6 py-4 font-semibold text-right">Precio</th>
                <th className="px-6 py-4 font-semibold text-right">Total</th>
                <th className="px-6 py-4 font-semibold">Notas</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {transactions.length > 0 ? (
                transactions.map((tx, index) => (
                  <tr
                    key={tx.id}
                    className={`border-t border-border/50 hover:bg-bg-card-hover transition-colors ${index % 2 === 1 ? "bg-bg-card-hover/50" : ""}`}
                  >
                    <td className="px-6 py-4 font-[family-name:var(--font-mono)] text-text-secondary">
                      {format(new Date(tx.date), "dd/MM/yyyy", { locale: es })}
                    </td>
                    <td className="px-6 py-4 font-[family-name:var(--font-mono)] text-green-bright font-medium">
                      {tx.ticker}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium uppercase ${getTypeClass(tx.type)}`}
                      >
                        {transactionTypeLabels[tx.type]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-[family-name:var(--font-mono)]">
                      {tx.quantity.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-[family-name:var(--font-mono)]">
                      {formatCurrency(tx.price_usd)}
                    </td>
                    <td className="px-6 py-4 text-right font-[family-name:var(--font-mono)] text-text-primary">
                      {formatCurrency(tx.total_usd)}
                    </td>
                    <td className="px-6 py-4 text-text-muted truncate max-w-[200px]">
                      {tx.notes || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-text-muted"
                  >
                    No hay transacciones registradas.
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
