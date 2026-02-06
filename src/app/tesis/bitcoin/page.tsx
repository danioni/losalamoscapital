import Link from 'next/link'
import '../tesis.css'
import './bitcoin.css'

export const metadata = {
  title: 'Tesis: Bitcoin | Los Álamos Capital',
  description: 'Por qué invertimos en Bitcoin: la salida del sistema financiero tradicional',
}

export default function BitcoinTesisPage() {
  return (
    <div className="tesis-page bitcoin-tesis">
      {/* Hero */}
      <header className="hero bitcoin-hero">
        <div className="hero-content">
          <Link href="/tesis" className="back-nav">← Tesis de Inversión</Link>
          <div className="asset-badge">
            <span className="asset-icon">₿</span>
            <span>Bitcoin</span>
          </div>
          <h1>La Salida del Sistema</h1>
          <p className="subtitle">
            Bitcoin no es una inversión especulativa. Es la única forma de poseer
            riqueza que nadie puede confiscar, censurar o diluir.
          </p>
        </div>
      </header>

      <main className="content">
        {/* Resumen Ejecutivo */}
        <section className="executive-summary">
          <h2>Resumen Ejecutivo</h2>
          <div className="summary-grid">
            <div className="summary-card">
              <span className="summary-label">Tesis Central</span>
              <p>Independencia financiera absoluta</p>
            </div>
            <div className="summary-card">
              <span className="summary-label">Convicción</span>
              <p>Alta</p>
            </div>
            <div className="summary-card">
              <span className="summary-label">Horizonte</span>
              <p>10+ años</p>
            </div>
            <div className="summary-card">
              <span className="summary-label">Riesgo Principal</span>
              <p>Volatilidad a corto plazo</p>
            </div>
          </div>
        </section>

        <div className="divider">◆ ◆ ◆</div>

        {/* La Tesis */}
        <section>
          <h2>La Tesis</h2>
          <p className="lead">
            Bitcoin es <strong>la salida</strong>. En un mundo donde los gobiernos pueden
            congelar cuentas, los bancos pueden quebrar, y las monedas se devalúan
            constantemente, Bitcoin ofrece algo que ningún otro activo puede:
            <strong> soberanía financiera real</strong>.
          </p>

          <div className="quote-block">
            <p>&ldquo;No es tu dinero si alguien más puede decidir si puedes usarlo.&rdquo;</p>
          </div>
        </section>

        <div className="divider">◆ ◆ ◆</div>

        {/* Los 4 Pilares */}
        <section>
          <h2>Los Cuatro Pilares</h2>

          <div className="pillar">
            <div className="pillar-number">01</div>
            <div className="pillar-content">
              <h3>Autocustodia</h3>
              <p className="pillar-tagline">Tus llaves, tu dinero</p>
              <p>
                Con Bitcoin, tú controlas tus fondos directamente. No hay banco que
                pueda negar un retiro, no hay institución que pueda &ldquo;congelar tu cuenta
                mientras investigan&rdquo;. Si tienes las llaves privadas, el Bitcoin es tuyo.
                Punto.
              </p>
              <p>
                Esto es fundamentalmente diferente a cualquier otro activo. Tus acciones
                están en un broker, tu dinero en un banco, tus propiedades en un registro
                público. Todo depende de terceros. Bitcoin no.
              </p>
            </div>
          </div>

          <div className="pillar">
            <div className="pillar-number">02</div>
            <div className="pillar-content">
              <h3>Resistencia a Censura</h3>
              <p className="pillar-tagline">Nadie puede congelar tu cuenta</p>
              <p>
                En el sistema tradicional, un juez, un banco, o incluso un error
                administrativo pueden dejarte sin acceso a tu dinero. Hemos visto
                esto en Argentina, Venezuela, Grecia, Chipre, Canadá, Rusia...
              </p>
              <p>
                Bitcoin opera en una red descentralizada global. No hay un punto central
                que atacar, no hay un CEO que pueda ser presionado, no hay un servidor
                que apagar. <strong>Tu transacción se procesa si pagas la comisión de red</strong>.
                Nadie puede impedirlo.
              </p>
            </div>
          </div>

          <div className="pillar">
            <div className="pillar-number">03</div>
            <div className="pillar-content">
              <h3>Portabilidad</h3>
              <p className="pillar-tagline">Tu riqueza cruza fronteras contigo</p>
              <p>
                Puedes memorizar 12 palabras y cruzar cualquier frontera del mundo
                con tu patrimonio completo. No hay que declarar nada en aduana,
                no hay límites de efectivo, no hay confiscación posible.
              </p>
              <p>
                En un mundo cada vez más incierto geopolíticamente, la capacidad de
                mover tu riqueza sin restricciones no es un lujo — es un seguro de vida.
              </p>
            </div>
          </div>

          <div className="pillar">
            <div className="pillar-number">04</div>
            <div className="pillar-content">
              <h3>Sin Permiso</h3>
              <p className="pillar-tagline">No necesitas banco ni aprobación</p>
              <p>
                Para abrir una cuenta bancaria necesitas documentos, aprobación,
                historial crediticio. Para usar Bitcoin solo necesitas un smartphone.
                Nadie te pide permiso, nadie puede negarte el acceso.
              </p>
              <p>
                Esto es especialmente poderoso para los 1.7 mil millones de personas
                en el mundo sin acceso bancario. Pero también para cualquiera que
                valore no depender de la gracia de una institución.
              </p>
            </div>
          </div>
        </section>

        <div className="divider">◆ ◆ ◆</div>

        {/* Por qué Bitcoin */}
        <section>
          <h2>¿Por Qué Bitcoin Como Dinero?</h2>

          <p className="lead">
            Existen miles de criptomonedas. Para <strong>dinero duro</strong>, solo una
            importa. Las demás tienen otros casos de uso válidos — DeFi, smart contracts,
            infraestructura — pero ninguna compite con Bitcoin como reserva de valor.
          </p>

          <div className="why-bitcoin-grid">
            <div className="why-card">
              <div className="why-icon">💰</div>
              <h3>100% Monetario</h3>
              <p>
                Bitcoin es el único activo cuyo valor es <strong>puramente monetario</strong>.
                No tiene otro uso. El oro se usa en joyería e industria. Las acciones
                dependen de earnings. Las propiedades de su ubicación.
              </p>
              <p>
                Bitcoin existe solo para ser dinero. Todo su valor viene de sus
                propiedades monetarias: escasez, portabilidad, divisibilidad,
                durabilidad, verificabilidad. Nada más. Nada menos.
              </p>
            </div>

            <div className="why-card">
              <div className="why-icon">🔒</div>
              <h3>El Valor de No Cambiar</h3>
              <p>
                En un mundo donde todo cambia según conveniencia política,
                Bitcoin es <strong>inmutable por diseño</strong>. Las reglas son las reglas.
                21 millones. Cada 10 minutos un bloque. Cada 4 años el halving.
              </p>
              <p>
                Esta rigidez no es un bug — es la feature principal. Cuando la única
                constante es el cambio, un sistema que no puede cambiar tiene valor infinito.
              </p>
            </div>

            <div className="why-card featured">
              <div className="why-icon">⚖️</div>
              <h3>Lanzamiento Justo</h3>
              <p>
                Bitcoin empezó como un experimento que se <strong>regalaba</strong>.
                Los primeros años existían &ldquo;faucets&rdquo; donde cualquiera podía
                obtener bitcoins gratis. No hubo ICO, no hubo pre-mine, no hubo
                inversores privilegiados.
              </p>
              <p>
                Satoshi Nakamoto, su creador, <strong>desapareció</strong>. No hay CEO,
                no hay fundación que pueda cambiar las reglas, no hay equipo con
                tokens para vender. Compara esto con cualquier otra cripto: todas
                tienen fundadores enriqueciéndose, VCs con tokens bloqueados,
                equipos que pueden modificar el protocolo.
              </p>
              <p>
                Bitcoin es el único dinero digital que nació sin dueño. Y sigue
                siendo justo: las reglas son iguales para todos, transparentes,
                verificables. <strong>El que lo entiende y adopta primero tiene
                ventaja</strong> — no por privilegio, sino por mérito. Así debería
                funcionar el dinero.
              </p>
            </div>
          </div>
        </section>

        <div className="divider">◆ ◆ ◆</div>

        {/* Colateral y Programabilidad */}
        <section>
          <h2>Propiedades Únicas</h2>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">🏦</div>
              <h3>El Mejor Colateral del Mundo</h3>
              <p>
                Bitcoin es el colateral perfecto: líquido 24/7, verificable al instante,
                no tiene riesgo de contraparte, y no se puede falsificar. No hay que
                confiar en auditores, no hay que esperar horarios bancarios, no hay
                que negociar valuaciones.
              </p>
              <p>
                Por esto, cada vez más instituciones aceptan Bitcoin como garantía
                para préstamos. Es más simple, más rápido, y más seguro que cualquier
                alternativa tradicional.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚙️</div>
              <h3>Programable</h3>
              <p>
                Bitcoin puede quedar programado. Puedes crear herencias que se ejecutan
                automáticamente, pagos que se liberan bajo condiciones específicas,
                o vaults con múltiples firmas que requieren aprobación familiar.
              </p>
              <p>
                No necesitas abogados, notarios, ni confiar en que un banco ejecute
                tus instrucciones. El código es la ley, y se ejecuta sin intermediarios.
              </p>
            </div>
          </div>
        </section>

        <div className="divider">◆ ◆ ◆</div>

        {/* Escasez */}
        <section>
          <h2>La Matemática de la Escasez</h2>
          <p>
            Solo existirán <strong>21 millones de Bitcoin</strong>. Nunca. Jamás.
            No hay banco central que pueda imprimir más, no hay gobierno que pueda
            cambiar las reglas.
          </p>

          <div className="scarcity-compare">
            <div className="scarcity-item">
              <span className="scarcity-asset">Dólar</span>
              <span className="scarcity-supply">+7% anual (y acelerando)</span>
            </div>
            <div className="scarcity-item">
              <span className="scarcity-asset">Oro</span>
              <span className="scarcity-supply">+1.5% anual</span>
            </div>
            <div className="scarcity-item featured">
              <span className="scarcity-asset">Bitcoin</span>
              <span className="scarcity-supply">Máximo fijo: 21M</span>
            </div>
          </div>

          <p>
            Cuando la demanda aumenta y la oferta es fija, solo hay un resultado
            posible: el precio sube. No es especulación, es aritmética básica.
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
              <h4>Volatilidad</h4>
              <p>
                Bitcoin puede caer 50-80% en correcciones. Esto ha pasado múltiples
                veces y probablemente pase de nuevo. Si no puedes tolerar ver tu
                inversión en rojo por meses o años, Bitcoin no es para ti.
              </p>
            </div>
            <div className="risk-card">
              <h4>Regulación</h4>
              <p>
                Los gobiernos podrían dificultar (aunque no prohibir efectivamente)
                el uso de Bitcoin. China lo ha intentado sin éxito. EEUU ha optado
                por regularlo, legitimándolo.
              </p>
            </div>
            <div className="risk-card">
              <h4>Custodia</h4>
              <p>
                Si pierdes tus llaves, pierdes tu Bitcoin. La autocustodia requiere
                responsabilidad. Esto es tanto una fortaleza como un riesgo.
              </p>
            </div>
            <div className="risk-card">
              <h4>Tecnológico</h4>
              <p>
                Aunque la red ha funcionado sin fallas mayores por 15 años, siempre
                existe un riesgo técnico residual. Es bajo pero no es cero.
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
              Bitcoin no es un get-rich-quick scheme. Es una <strong>tecnología de libertad
              financiera</strong> que existe independientemente de cualquier gobierno,
              banco, o institución.
            </p>
            <p>
              21 millones. Ni uno más. Mientras el mundo imprime dinero sin parar,
              mientras los mercados se manipulan, mientras las reglas cambian según
              quien gobierne — Bitcoin permanece inmutable. <strong>Orden perfecto
              contra el caos de la vida</strong>.
            </p>
            <p>
              Lo compramos porque queremos un activo que <strong>realmente poseemos</strong>.
              No porque pensamos que va a subir (aunque creemos que lo hará), sino
              porque es el único activo donde &ldquo;poseer&rdquo; significa exactamente eso.
            </p>
            <p className="final-statement">
              <strong>Bitcoin es la salida. Y la salida siempre tiene valor.</strong>
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-nav">
          <Link href="/tesis" className="back-link">← Volver a Tesis</Link>
        </div>
        <p className="company">Los Álamos Capital</p>
      </footer>
    </div>
  )
}
