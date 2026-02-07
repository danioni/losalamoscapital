import type { Metadata } from "next";
import { ProyeccionesActivos } from "@/components/public/ProyeccionesActivos";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Proyecciones: Rendimiento Futuro Estimado | Solo Informativo — Especulativo",
  description:
    "Proyecciones especulativas de rendimiento a 5 y 10 años basadas en modelo multi-factor: CAGR histórico, P/E, crecimiento de GPA y rendimiento por dividendo. NO constituye asesoría financiera.",
  openGraph: {
    title: "Proyecciones de Rendimiento — Modelo Multi-Factor",
    description:
      "Estimaciones especulativas a 5 y 10 años con datos fundamentales en vivo. NO es asesoría financiera.",
  },
};

// Revalidate every 12 hours
export const revalidate = 43200;

export default async function ProyeccionesPage() {
  let livePrices: Record<string, { price: number; priceLabel: string; marketCap: number; marketCapLabel: string }> = {};
  let liveFundamentals: Record<string, {
    trailingPE: number | null;
    forwardPE: number | null;
    dividendYield: number | null;
    revenueGrowth: number | null;
    epsGrowth: number | null;
    fiftyTwoWeekHigh: number | null;
    fiftyTwoWeekLow: number | null;
  }> = {};
  let lastUpdated: string | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("analysis_prices")
      .select("ticker, current_price, current_price_label, market_cap_value, market_cap_label, trailing_pe, forward_pe, dividend_yield, revenue_growth, eps_growth, fifty_two_week_high, fifty_two_week_low, updated_at")
      .order("updated_at", { ascending: false });

    if (data && data.length > 0) {
      lastUpdated = data[0].updated_at;
      for (const row of data) {
        livePrices[row.ticker] = {
          price: Number(row.current_price),
          priceLabel: row.current_price_label,
          marketCap: Number(row.market_cap_value),
          marketCapLabel: row.market_cap_label,
        };
        liveFundamentals[row.ticker] = {
          trailingPE: row.trailing_pe != null ? Number(row.trailing_pe) : null,
          forwardPE: row.forward_pe != null ? Number(row.forward_pe) : null,
          dividendYield: row.dividend_yield != null ? Number(row.dividend_yield) : null,
          revenueGrowth: row.revenue_growth != null ? Number(row.revenue_growth) : null,
          epsGrowth: row.eps_growth != null ? Number(row.eps_growth) : null,
          fiftyTwoWeekHigh: row.fifty_two_week_high != null ? Number(row.fifty_two_week_high) : null,
          fiftyTwoWeekLow: row.fifty_two_week_low != null ? Number(row.fifty_two_week_low) : null,
        };
      }
    }
  } catch {
    console.error("[Proyecciones] Failed to fetch live data, using fallback");
  }

  const hasLiveFundamentals = Object.values(liveFundamentals).some(
    (f) => f.trailingPE != null || f.forwardPE != null || f.epsGrowth != null
  );

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 2rem",
        position: "relative",
        zIndex: 1,
      }}
    >
      <ProyeccionesActivos
        livePrices={Object.keys(livePrices).length > 0 ? livePrices : undefined}
        liveFundamentals={hasLiveFundamentals ? liveFundamentals : undefined}
        lastUpdated={lastUpdated}
      />
    </div>
  );
}
