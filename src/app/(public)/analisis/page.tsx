import type { Metadata } from "next";
import { AnalisisActivos } from "@/components/public/AnalisisActivos";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Análisis: Los 50 Activos Más Valiosos del Mundo por CAGR | Solo Informativo",
  description:
    "Análisis comparativo informativo de rendimiento compuesto (CAGR) de los 50 activos con mayor capitalización de mercado. NO constituye asesoría financiera ni recomendación de inversión.",
  openGraph: {
    title: "Los 50 Activos Más Valiosos del Mundo — Análisis CAGR",
    description:
      "Análisis informativo de CAGR histórico y reciente. NO es asesoría financiera. Los rendimientos pasados no garantizan resultados futuros.",
  },
};

// Revalidate every 12 hours — cron runs weekly but this ensures freshness
export const revalidate = 43200;

export default async function AnalisisPage() {
  // Fetch latest prices from Supabase (populated by cron job)
  let livePrices: Record<string, { price: number; priceLabel: string; marketCap: number; marketCapLabel: string }> = {};
  let lastUpdated: string | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("analysis_prices")
      .select("ticker, current_price, current_price_label, market_cap_value, market_cap_label, updated_at")
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
      }
    }
  } catch {
    // If Supabase fails, component will use hardcoded fallback data
    console.error("[Analisis] Failed to fetch live prices, using fallback");
  }

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
      <AnalisisActivos
        livePrices={Object.keys(livePrices).length > 0 ? livePrices : undefined}
        lastUpdated={lastUpdated}
      />
    </div>
  );
}
