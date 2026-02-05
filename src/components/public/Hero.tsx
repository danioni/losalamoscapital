export function Hero() {
  return (
    <section
      style={{
        padding: "5rem 0 3rem",
        textAlign: "center",
      }}
    >
      <div
        className="animate-fade-up"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.4rem 1rem",
          border: "1px solid rgba(45, 106, 79, 0.2)",
          borderRadius: "100px",
          fontSize: "0.75rem",
          fontWeight: 500,
          color: "#95d5b2",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: "2rem",
          background: "rgba(82, 183, 136, 0.15)",
        }}
      >
        <span
          className="animate-pulse-dot"
          style={{
            width: "6px",
            height: "6px",
            background: "#52b788",
            borderRadius: "50%",
          }}
        />
        Track Record Público · Transparencia Total
      </div>
      <h2
        className="animate-fade-up animate-delay-1 hero-title-responsive"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "3.2rem",
          fontWeight: 400,
          lineHeight: 1.15,
          marginBottom: "1rem",
          color: "#e8efe6",
        }}
      >
        Donde hay álamos,
        <br />
        hay raíces
      </h2>
      <p
        className="animate-fade-up animate-delay-2"
        style={{
          fontSize: "1.1rem",
          color: "#8a9e93",
          maxWidth: "540px",
          margin: "0 auto",
          fontWeight: 300,
        }}
      >
        Gestión de inversiones con track record público y transparencia
        absoluta. Cada decisión documentada, cada resultado verificable.
      </p>
    </section>
  );
}
