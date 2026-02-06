import type { Metadata } from "next";
import { Header, Footer } from "@/components/public";
import { AnalisisActivos } from "@/components/public/AnalisisActivos";

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

export default function AnalisisPage() {
  return (
    <>
      <Header />
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 2rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <AnalisisActivos />
      </div>
      <Footer />
    </>
  );
}
