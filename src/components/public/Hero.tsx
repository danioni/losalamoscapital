"use client";

export function Hero() {
  return (
    <section className="hero-section">
      {/* Cinematic Background Layers */}
      <div className="hero-bg-layers">
        {/* Aurora/ambient light effect */}
        <div className="hero-aurora" />

        {/* Light rays through trees */}
        <div className="hero-rays" />

        {/* Deep vignette */}
        <div className="hero-vignette" />

        {/* Golden hour light */}
        <div className="hero-light-flicker" />

        {/* Film grain */}
        <div className="hero-grain" />

        {/* Floating particles */}
        <div className="hero-leaves">
          <div className="leaf leaf-1" />
          <div className="leaf leaf-2" />
          <div className="leaf leaf-3" />
          <div className="leaf leaf-4" />
          <div className="leaf leaf-5" />
        </div>

        {/* Haze effects */}
        <div className="hero-haze-top" />
        <div className="hero-haze-bottom" />
      </div>

      {/* Content */}
      <div className="hero-content">
        <div className="hero-badge animate-fade-up">
          <span className="hero-badge-dot" />
          Track Record Público · Transparencia Total
        </div>

        <h1 className="hero-title animate-fade-up animate-delay-1">
          Donde hay álamos,
          <br />
          hay raíces
        </h1>

        <p className="hero-subtitle animate-fade-up animate-delay-2">
          Gestión de inversiones con track record público y transparencia
          absoluta. Cada decisión documentada, cada resultado verificable.
        </p>
      </div>
    </section>
  );
}
