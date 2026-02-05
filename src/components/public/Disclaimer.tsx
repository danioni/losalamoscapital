export function Disclaimer() {
  return (
    <div
      style={{
        padding: "3rem 0",
        borderTop: "1px solid rgba(45, 106, 79, 0.2)",
        marginTop: "3rem",
      }}
    >
      <div
        style={{
          background: "rgba(45, 106, 79, 0.06)",
          border: "1px solid rgba(45, 106, 79, 0.2)",
          borderRadius: "12px",
          padding: "2rem",
        }}
      >
        <h4
          style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "#5a6e63",
            marginBottom: "0.75rem",
          }}
        >
          Aviso Legal
        </h4>
        <p
          style={{
            fontSize: "0.78rem",
            color: "#5a6e63",
            lineHeight: 1.7,
          }}
        >
          Los Álamos Capital es un track record de inversiones familiares
          publicado con fines informativos y de transparencia. Este sitio no
          constituye asesoría financiera, recomendación de inversión, ni oferta
          de valores. Rendimientos pasados no garantizan resultados futuros.
          Toda inversión conlleva riesgo de pérdida parcial o total del capital
          invertido. Antes de tomar decisiones de inversión, consulte con un
          asesor financiero calificado. Los Álamos SpA no se encuentra regulada
          por la Comisión para el Mercado Financiero (CMF) de Chile.
        </p>
      </div>
    </div>
  );
}
