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
            Cada inversión debe tener una <strong>razón clara</strong>: un argumento
            sólido de por qué creemos que va a subir de valor con el tiempo.
            Si no podemos explicarlo, no invertimos.
          </p>
          <p>
            Buscamos activos con <strong>ventajas de fondo</strong> — características
            propias que los hacen valiosos sin importar si el mercado está arriba o abajo.
            No apostamos, construimos.
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
                  Libertad financiera total. Lo guardas tú, nadie lo puede bloquear,
                  lo llevas a cualquier parte. El único activo que realmente es tuyo.
                </p>
                <div className="tesis-meta">
                  <span className="conviction high">Convicción Alta</span>
                  <span className="horizon">Horizonte: 10+ años</span>
                </div>
              </div>
              <span className="tesis-arrow">→</span>
            </Link>

            {/* Tesla */}
            <Link href="/tesis/tesla" className="tesis-card">
              <div className="tesis-icon">🚗</div>
              <div className="tesis-info">
                <h3>Tesla</h3>
                <p className="tesis-tagline">El experimento más grande del mundo</p>
                <p className="tesis-summary">
                  Conducción autónoma con millones de autos recolectando datos.
                  Integración vertical. Robots en el futuro.
                </p>
                <div className="tesis-meta">
                  <span className="conviction high">Convicción Alta</span>
                  <span className="horizon">Horizonte: 5-10 años</span>
                </div>
              </div>
              <span className="tesis-arrow">→</span>
            </Link>

            {/* Próximamente */}

            <div className="tesis-card coming-soon">
              <div className="tesis-icon">🏛️</div>
              <div className="tesis-info">
                <h3>Las 7 Magníficas</h3>
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
                  Mientras más gente las usa, más valen: Visa, Mastercard, y el flujo del dinero.
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
              Estas explicaciones representan nuestra visión personal y no son
              consejos financieros. Cada persona debe investigar por su cuenta
              y entender cuánto riesgo puede tolerar antes de invertir.
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
