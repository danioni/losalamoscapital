import Link from 'next/link'
import '../tesis.css'
import './tesla.css'

export const metadata = {
  title: 'Tesis: Tesla | Los Álamos Capital',
  description: 'Por qué invertimos en Tesla: conducción autónoma, integración vertical y robots',
}

export default function TeslaTesisPage() {
  return (
    <div className="tesis-page tesla-tesis">
      {/* Hero */}
      <header className="hero tesla-hero">
        <div className="hero-content">
          <Link href="/tesis" className="back-nav">← Tesis de Inversión</Link>
          <div className="asset-badge">
            <span className="asset-icon">🚗</span>
            <span>Tesla</span>
          </div>
          <h1>El Experimento Más Grande del Mundo</h1>
          <p className="subtitle">
            Tesla no es solo una empresa de autos eléctricos. Es el laboratorio de
            conducción autónoma más grande del planeta, con millones de vehículos
            recolectando datos reales cada día.
          </p>
        </div>
      </header>

      <main className="content">
        {/* Resumen Ejecutivo */}
        <section className="executive-summary">
          <h2>Resumen</h2>
          <div className="summary-grid">
            <div className="summary-card">
              <span className="summary-label">Razón Principal</span>
              <p>Conducción autónoma</p>
            </div>
            <div className="summary-card">
              <span className="summary-label">Convicción</span>
              <p>Alta</p>
            </div>
            <div className="summary-card">
              <span className="summary-label">Horizonte</span>
              <p>5-10 años</p>
            </div>
            <div className="summary-card">
              <span className="summary-label">Riesgo Principal</span>
              <p>Competencia china</p>
            </div>
          </div>
        </section>

        <div className="divider">◆ ◆ ◆</div>

        {/* La Tesis */}
        <section>
          <h2>La Tesis</h2>
          <p className="lead">
            Tesla tiene un <strong>posicionamiento único en el mercado de autos eléctricos</strong>.
            No llegaron primero por casualidad — construyeron la marca, la tecnología, y la
            infraestructura que los convirtió en el líder indiscutible del mercado.
          </p>
          <p className="lead">
            Pero lo más importante es lo que están construyendo para el futuro: <strong>millones
            de autos en las calles, recolectando datos de manejo real</strong>. Cada Tesla es un
            sensor móvil que alimenta su inteligencia artificial. Mientras más autos
            venden, más inteligente se vuelve el sistema.
          </p>

          <div className="quote-block">
            <p>&ldquo;Los datos son el nuevo petróleo. Tesla tiene el pozo más grande del mundo.&rdquo;</p>
          </div>
        </section>

        <div className="divider">◆ ◆ ◆</div>

        {/* Los 3 Pilares */}
        <section>
          <h2>Los Tres Pilares</h2>

          <div className="pillar">
            <div className="pillar-number">01</div>
            <div className="pillar-content">
              <h3>Conducción Autónoma</h3>
              <p className="pillar-tagline">El experimento más grande del mundo</p>
              <p>
                Imagina tener millones de profesores de manejo enseñándole a una
                computadora cómo manejar. Eso es Tesla. Cada vez que un conductor
                humano corrige al piloto automático, el sistema aprende.
              </p>
              <p>
                Los competidores tienen cientos o miles de autos de prueba. Tesla
                tiene <strong>millones</strong>. Esta ventaja de datos es casi
                imposible de alcanzar — tendrían que vender millones de autos primero.
              </p>
              <p>
                Cuando la conducción autónoma funcione de verdad, el ganador será
                quien tenga más datos. Tesla lleva años de ventaja.
              </p>
            </div>
          </div>

          <div className="pillar">
            <div className="pillar-number">02</div>
            <div className="pillar-content">
              <h3>Integración Vertical</h3>
              <p className="pillar-tagline">Fabrican casi todo ellos mismos</p>
              <p>
                La mayoría de las empresas de autos compran partes de cientos de
                proveedores y las ensamblan. Tesla diseña y fabrica sus propias
                baterías, motores, software, chips de computadora, y hasta sus
                propias máquinas de fabricación.
              </p>
              <p>
                Esto significa que <strong>controlan toda la cadena</strong>: pueden
                mejorar cada pieza, reducir costos, y moverse más rápido que la
                competencia. Cuando otros esperan que un proveedor les entregue
                partes, Tesla ya está produciendo la siguiente versión.
              </p>
              <p>
                Sus fábricas (las &ldquo;Gigafábricas&rdquo;) son de las más avanzadas del
                mundo. No solo hacen autos — hacen las máquinas que hacen los autos.
              </p>
            </div>
          </div>

          <div className="pillar">
            <div className="pillar-number">03</div>
            <div className="pillar-content">
              <h3>Robots</h3>
              <p className="pillar-tagline">El futuro (todavía lejano)</p>
              <p>
                Tesla está desarrollando Optimus, un robot humanoide que podría hacer
                trabajos físicos repetitivos: en fábricas, almacenes, o eventualmente
                en hogares.
              </p>
              <p>
                ¿Por qué Tesla puede hacer robots? Porque ya resolvieron los problemas
                más difíciles: visión por computadora (el auto &ldquo;ve&rdquo; el mundo),
                inteligencia artificial (toma decisiones), baterías eficientes, y
                fabricación a gran escala.
              </p>
              <p>
                <strong>Somos honestos:</strong> esto todavía está lejos del mercado
                masivo. Nos entusiasma el potencial, pero no es la razón principal
                por la que invertimos hoy.
              </p>
            </div>
          </div>
        </section>

        <div className="divider">◆ ◆ ◆</div>

        {/* Márgenes */}
        <section>
          <h2>Márgenes Superiores</h2>

          <p>
            Tesla gana más dinero por cada auto que vende que casi cualquier otro
            fabricante. ¿Por qué? Porque <strong>no depende de otros</strong>.
          </p>

          <div className="margins-box">
            <p>
              La mayoría de los fabricantes de autos compran miles de piezas de
              cientos de proveedores. Cada proveedor quiere su margen de ganancia.
              Tesla diseña y fabrica sus propias baterías, motores, software, y
              chips — las partes más valiosas del auto.
            </p>
            <p>
              <strong>Resultado:</strong> mientras otros fabricantes de autos
              tienen márgenes de 5-10%, Tesla ha llegado a tener márgenes sobre 20%.
              Menos intermediarios = más ganancia por auto.
            </p>
            <p>
              Esto también significa que pueden bajar precios cuando quieren
              (para ganar mercado) y seguir siendo rentables. La competencia no
              tiene ese lujo.
            </p>
          </div>
        </section>

        <div className="divider">◆ ◆ ◆</div>

        {/* El Negocio Hoy */}
        <section>
          <h2>El Negocio Hoy</h2>

          <p>
            Mientras esperamos que la conducción autónoma madure, Tesla tiene un
            negocio real y rentable:
          </p>

          <div className="business-grid">
            <div className="business-card">
              <div className="business-icon">🚗</div>
              <h3>Autos Eléctricos</h3>
              <p>
                Son el fabricante de autos eléctricos más grande del mundo. Venden
                millones de vehículos al año y tienen márgenes de ganancia más altos
                que la mayoría de sus competidores.
              </p>
            </div>

            <div className="business-card">
              <div className="business-icon">🔋</div>
              <h3>Energía</h3>
              <p>
                Venden baterías gigantes para casas (Powerwall) y para empresas/ciudades
                (Megapack). Este negocio está creciendo rápido mientras el mundo se
                mueve hacia energías renovables.
              </p>
            </div>

            <div className="business-card">
              <div className="business-icon">⚡</div>
              <h3>Carga</h3>
              <p>
                Tienen la red de cargadores rápidos más grande del mundo (Superchargers).
                Ahora otras marcas de autos están pagando para usarla — se convierte
                en un negocio adicional.
              </p>
            </div>

            <div className="business-card">
              <div className="business-icon">💻</div>
              <h3>Software</h3>
              <p>
                Venden actualizaciones de software que mejoran el auto después de
                comprarlo. Es como si tu auto se volviera más rápido o más inteligente
                con el tiempo.
              </p>
            </div>
          </div>
        </section>

        <div className="divider">◆ ◆ ◆</div>

        {/* ARK Invest */}
        <section>
          <h2>La Perspectiva de ARK Invest</h2>

          <p>
            ARK Invest, uno de los fondos de inversión más conocidos en tecnología,
            tiene una tesis muy alcista sobre Tesla basada principalmente en el
            negocio de robotaxi:
          </p>

          <div className="ark-section">
            <h3>Proyecciones de Precio</h3>

            <div className="ark-targets">
              <div className="ark-target">
                <div className="label">Precio Objetivo 2026</div>
                <div className="value">$2,600</div>
                <div className="note">Caso base</div>
              </div>
              <div className="ark-target">
                <div className="label">Caso Optimista</div>
                <div className="value">$3,100</div>
                <div className="note">Bull case</div>
              </div>
              <div className="ark-target">
                <div className="label">% del Robotaxi</div>
                <div className="value">~90%</div>
                <div className="note">del valor total</div>
              </div>
            </div>

            <p>
              Según ARK, el <strong>88-90% del valor de Tesla</strong> vendrá del negocio
              de robotaxi, y solo ~9% de la venta de autos tradicionales. Proyectan un
              mercado global de robotaxis de <strong>$10 billones</strong>.
            </p>

            <p>
              Su modelo asume que Tesla logrará lanzar un servicio de robotaxi
              comercial en los próximos años, capturando una porción significativa
              de este mercado.
            </p>

            <p className="ark-source">
              Fuente: <a href="https://www.ark-invest.com/articles/valuation-models/arks-tesla-model" target="_blank" rel="noopener noreferrer">ARK Invest Tesla Valuation Model</a>
            </p>
          </div>

          <p>
            <strong>Nuestra visión:</strong> Compartimos la tesis de que la conducción
            autónoma es el factor más importante, aunque somos más conservadores en
            los tiempos. El mercado puede tardar más de lo que ARK proyecta, pero
            la dirección es correcta.
          </p>
        </section>

        <div className="divider">◆ ◆ ◆</div>

        {/* Riesgos */}
        <section>
          <h2>Riesgos a Considerar</h2>
          <p>
            Ninguna inversión está libre de riesgos. Ser honestos sobre ellos es
            parte de nuestra tesis:
          </p>

          <div className="risks-grid">
            <div className="risk-card">
              <h4>Competencia China</h4>
              <p>
                Empresas chinas como BYD están creciendo muy rápido y vendiendo autos
                eléctricos más baratos. China es el mercado de autos más grande del
                mundo y los fabricantes locales tienen ventajas ahí. Esta es nuestra
                principal preocupación.
              </p>
            </div>
            <div className="risk-card">
              <h4>Valoración Alta</h4>
              <p>
                Tesla es una empresa cara. El precio de la acción ya incluye muchas
                expectativas de crecimiento futuro. Si la conducción autónoma se
                demora más de lo esperado, la acción podría sufrir.
              </p>
            </div>
            <div className="risk-card">
              <h4>Regulación</h4>
              <p>
                Los autos que se manejan solos necesitan aprobación de gobiernos.
                Cada país tiene reglas diferentes y el proceso puede ser lento.
                Un accidente grave podría retrasar todo.
              </p>
            </div>
            <div className="risk-card">
              <h4>Ejecución</h4>
              <p>
                Tesla tiene que seguir produciendo millones de autos, expandiendo
                fábricas, y mejorando su tecnología — todo al mismo tiempo. Es
                difícil hacer tantas cosas bien.
              </p>
            </div>
          </div>
        </section>

        <div className="divider">◆ ◆ ◆</div>

        {/* Conclusión */}
        <section className="conclusion">
          <h2>Nuestra Posición</h2>
          <div className="conclusion-box">
            <p>
              Invertimos en Tesla porque creemos que <strong>la conducción autónoma
              va a transformar el transporte</strong>, y Tesla tiene la mejor posición
              para ganar esa carrera gracias a sus datos.
            </p>
            <p>
              No es una apuesta fácil. Hay competencia real, especialmente de China.
              Pero las ventajas de Tesla — los millones de autos recolectando datos,
              la integración vertical, la capacidad de fabricación — son difíciles
              de replicar.
            </p>
            <p className="final-statement">
              <strong>El futuro del transporte se está escribiendo hoy. Tesla tiene el lápiz.</strong>
            </p>
          </div>
        </section>
      </main>

      {/* Navigation between theses */}
      <nav className="footer" style={{ borderTop: "1px solid rgba(45, 106, 79, 0.2)", padding: "2rem 0" }}>
        <div className="footer-nav">
          <Link href="/tesis/bitcoin" className="back-link">← Bitcoin</Link>
          <Link href="/tesis" className="next-link">Todas las Tesis →</Link>
        </div>
      </nav>
    </div>
  )
}
