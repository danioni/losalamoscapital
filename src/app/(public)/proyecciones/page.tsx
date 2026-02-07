import type { Metadata } from "next";
import { ProyeccionesActivos } from "@/components/public/ProyeccionesActivos";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Proyecciones: Rendimiento Futuro Estimado | Solo Informativo — Especulativo",
  description:
    "Proyecciones especulativas de rendimiento a 5 y 10 años basadas en CAGR histórico. NO constituye asesoría financiera, predicción de mercado ni recomendación de inversión.",
  openGraph: {
    title: "Proyecciones de Rendimiento — Análisis Forward-Looking",
    description:
      "Estimaciones especulativas a 5 y 10 años en 3 escenarios. NO es asesoría financiera. Los rendimientos pasados no garantizan resultados futuros.",
  },
};

// Revalidate every 12 hours
export const revalidate = 43200;

export default async function ProyeccionesPage() {
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
    console.error("[Proyecciones] Failed to fetch live prices, using fallback");
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
      <ProyeccionesActivos
        livePrices={Object.keys(livePrices).length > 0 ? livePrices : undefined}
        lastUpdated={lastUpdated}
      />
    </div>
  );
}
