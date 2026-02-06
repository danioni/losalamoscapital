import type { Metadata } from "next";
import { Header, Footer } from "@/components/public";
import { AnalisisActivos } from "@/components/public/AnalisisActivos";

export const metadata: Metadata = {
  title: "Análisis: Los 50 Activos Más Valiosos del Mundo por CAGR",
  description:
    "Análisis comparativo de rendimiento compuesto (CAGR) de los 50 activos con mayor capitalización de mercado del mundo. Datos actualizados a febrero 2026.",
  openGraph: {
    title: "Los 50 Activos Más Valiosos del Mundo — Análisis CAGR",
    description:
      "Comparativa de CAGR histórico y reciente de Gold, Apple, NVIDIA, Bitcoin, Microsoft y 45 más. Por Los Álamos Capital.",
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
