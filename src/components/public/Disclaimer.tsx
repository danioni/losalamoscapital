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
          Los Álamos Capital es un registro personal de inversiones familiares
          publicado con fines exclusivamente informativos y de transparencia interna.
          <strong style={{ color: '#6b7f72' }}> Este sitio NO constituye asesoría financiera, recomendación de inversión,
          oferta de valores, ni servicio de gestión de activos para terceros.</strong> El
          contenido representa únicamente opiniones familiares y decisiones personales de
          inversión — no debe ser interpretado como consejo financiero aplicable a ninguna
          otra persona o situación. No solicitamos ni aceptamos capital de terceros.
          Rendimientos pasados no garantizan resultados futuros. Toda inversión conlleva
          riesgo de pérdida parcial o total del capital. Antes de tomar cualquier decisión
          de inversión, consulte con un asesor financiero debidamente acreditado.
          Los Álamos Capital SpA NO se encuentra regulada ni supervisada por la Comisión
          para el Mercado Financiero (CMF) de Chile ni por ningún otro organismo regulador.
          La información se proporciona &quot;tal cual&quot; sin garantías de ningún tipo.
        </p>
      </div>
    </div>
  );
}
