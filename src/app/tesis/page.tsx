import Link from 'next/link'
import './tesis.css'

export const metadata = {
  title: 'Tesis de Inversión | Los Álamos Capital',
  description: 'Racionales de inversión: por qué elegimos cada activo',
}

export default function TesisPage() {
  return (
    <div className="tesis-page">
      {/* Hero */}
      <header className="hero">
        <div className="hero-content">
          <span className="tagline">Transparencia Total</span>
          <h1>Tesis de Inversión</h1>
          <p className="subtitle">
            No invertimos en lo que no entendemos. Aquí explicamos el racional
            detrás de cada activo en nuestro portafolio.
          </p>
        </div>
      </header>

      <main className="content">
        {/* Filosofía */}
        <section>
          <h2>Nuestra Filosofía</h2>
          <p>
            Cada inversión debe tener una <strong>tesis clara</strong>: un argumento
            fundamentado de por qué creemos que el activo va a apreciarse en el tiempo.
            Si no podemos articularlo, no invertimos.
          </p>
          <p>
            Buscamos activos con <strong>ventajas estructurales</strong> — características
            inherentes que los hacen valiosos independientemente del ciclo de mercado.
            No especulamos, construimos.
          </p>
        </section>

        <div className="divider">◆ ◆ ◆</div>

        {/* Lista de Tesis */}
        <section>
          <h2>Activos en Portafolio</h2>

          <div className="tesis-grid">
            {/* Bitcoin */}
            <Link href="/tesis/bitcoin" className="tesis-card featured">
              <div className="tesis-icon">₿</div>
              <div className="tesis-info">
                <h3>Bitcoin</h3>
                <p className="tesis-tagline">La salida del sistema</p>
                <p className="tesis-summary">
                  Independencia financiera absoluta. Autocustodia, resistencia a censura,
                  portabilidad global. El único activo que realmente posees.
                </p>
                <div className="tesis-meta">
                  <span className="conviction high">Convicción Alta</span>
                  <span className="horizon">Horizonte: 10+ años</span>
                </div>
              </div>
              <span className="tesis-arrow">→</span>
            </Link>

            {/* Próximamente */}
            <div className="tesis-card coming-soon">
              <div className="tesis-icon">🚗</div>
              <div className="tesis-info">
                <h3>Tesla</h3>
                <p className="tesis-tagline">Próximamente</p>
                <p className="tesis-summary">
                  Energía, autonomía, IA, y manufactura integrada.
                </p>
              </div>
            </div>

            <div className="tesis-card coming-soon">
              <div className="tesis-icon">🏛️</div>
              <div className="tesis-info">
                <h3>Magnificent 7</h3>
                <p className="tesis-tagline">Próximamente</p>
                <p className="tesis-summary">
                  Las empresas que definen la economía moderna.
                </p>
              </div>
            </div>

            <div className="tesis-card coming-soon">
              <div className="tesis-icon">💳</div>
              <div className="tesis-info">
                <h3>Redes de Pago</h3>
                <p className="tesis-tagline">Próximamente</p>
                <p className="tesis-summary">
                  Efecto red en acción: Visa, Mastercard, y el flujo del dinero.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="divider">◆ ◆ ◆</div>

        {/* Disclaimer */}
        <section className="disclaimer-section">
          <div className="disclaimer-box">
            <h3>⚠️ Importante</h3>
            <p>
              Estas tesis representan nuestra visión personal y no constituyen
              asesoría financiera. Cada inversor debe hacer su propia investigación
              y evaluar su tolerancia al riesgo antes de invertir.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <Link href="/" className="back-link">← Volver al inicio</Link>
        <p className="company">Los Álamos Capital</p>
      </footer>
    </div>
  )
}
