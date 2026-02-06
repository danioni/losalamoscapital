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
              <p>Sube y baja mucho a corto plazo</p>
            </div>
          </div>
        </section>

        <div className="divider">◆ ◆ ◆</div>

        {/* La Tesis */}
        <section>
          <h2>La Tesis</h2>
          <p className="lead">
            Bitcoin es <strong>la salida</strong>. En un mundo donde los gobiernos pueden
            congelar cuentas, los bancos pueden quebrar, y las monedas pierden valor
            constantemente, Bitcoin ofrece algo que ningún otro activo puede:
            <strong> libertad financiera real</strong>.
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
              <h3>Tú lo Guardas</h3>
              <p className="pillar-tagline">Tu clave, tu dinero</p>
              <p>
                Con Bitcoin, tú controlas tu dinero directamente. No hay banco que
                pueda negar un retiro, no hay institución que pueda &ldquo;congelar tu cuenta
                mientras investigan&rdquo;. Si tienes la clave, el Bitcoin es tuyo.
                Punto.
              </p>
              <p>
                Esto es muy diferente a cualquier otro activo. Tus acciones
                están en una corredora, tu dinero en un banco, tus propiedades en un registro
                público. Todo depende de otros. Bitcoin no.
              </p>
            </div>
          </div>

          <div className="pillar">
            <div className="pillar-number">02</div>
            <div className="pillar-content">
              <h3>Imposible de Bloquear</h3>
              <p className="pillar-tagline">Nadie puede congelar tu cuenta</p>
              <p>
                En el sistema tradicional, un juez, un banco, o incluso un error
                administrativo pueden dejarte sin acceso a tu dinero. Hemos visto
                esto en Argentina, Venezuela, Grecia, Chipre, Canadá, Rusia...
              </p>
              <p>
                Bitcoin funciona en una red mundial sin dueño. No hay una oficina central
                que atacar, no hay un jefe que pueda ser presionado, no hay un computador central
                que apagar. <strong>Tu pago se procesa si pagas la comisión</strong>.
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
                En un mundo cada vez más incierto, la capacidad de
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
                historial de crédito. Para usar Bitcoin solo necesitas un teléfono.
                Nadie te pide permiso, nadie puede negarte el acceso.
              </p>
              <p>
                Esto es especialmente importante para los 1.700 millones de personas
                en el mundo sin acceso a bancos. Pero también para cualquiera que
                valore no depender de la buena voluntad de una institución.
              </p>
            </div>
          </div>
        </section>

        <div className="divider">◆ ◆ ◆</div>

        {/* Por qué Bitcoin */}
        <section>
          <h2>¿Por Qué Bitcoin Como Dinero?</h2>

          <p className="lead">
            Existen miles de criptomonedas. Como <strong>dinero</strong>, solo una
            importa. Las demás sirven para otras cosas — finanzas automáticas, contratos
            digitales, infraestructura — pero ninguna compite con Bitcoin para guardar valor.
          </p>

          <div className="why-bitcoin-grid">
            <div className="why-card">
              <div className="why-icon">💰</div>
              <h3>100% Dinero</h3>
              <p>
                Bitcoin es el único activo cuyo valor es <strong>puramente monetario</strong>.
                No tiene otro uso. El oro se usa en joyas e industria. Las acciones
                dependen de las ganancias de empresas. Las propiedades de su ubicación.
              </p>
              <p>
                Bitcoin existe solo para ser dinero. Todo su valor viene de sus
                propiedades como dinero: es escaso, portable, divisible,
                duradero, y verificable. Nada más. Nada menos.
              </p>
            </div>

            <div className="why-card">
              <div className="why-icon">🔒</div>
              <h3>El Valor de No Cambiar</h3>
              <p>
                En un mundo donde todo cambia según conveniencia política,
                Bitcoin es <strong>inmutable por diseño</strong>. Las reglas son las reglas.
                21 millones. Cada 10 minutos se crea un nuevo registro. Cada 4 años se reduce la emisión a la mitad.
              </p>
              <p>
                Esta rigidez no es un defecto — es la característica principal. Cuando la única
                constante es el cambio, un sistema que no puede cambiar tiene valor infinito.
              </p>
            </div>

            <div className="why-card featured">
              <div className="why-icon">⚖️</div>
              <h3>Nació Justo</h3>
              <p>
                Bitcoin empezó como un experimento que se <strong>regalaba</strong>.
                Los primeros años existían páginas donde cualquiera podía
                obtener bitcoins gratis. No hubo venta anticipada, no hubo
                inversionistas privilegiados.
              </p>
              <p>
                Satoshi Nakamoto, su creador, <strong>desapareció</strong>. No hay jefe,
                no hay fundación que pueda cambiar las reglas, no hay equipo con
                monedas para vender. Compara esto con cualquier otra criptomoneda: todas
                tienen fundadores enriqueciéndose, inversionistas con monedas reservadas,
                equipos que pueden modificar las reglas.
              </p>
              <p>
                Bitcoin es el único dinero digital que nació sin dueño. Y sigue
                siendo justo: las reglas son iguales para todos, transparentes,
                verificables. <strong>El que lo entiende y lo adopta primero tiene
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
              <h3>La Mejor Garantía del Mundo</h3>
              <p>
                Bitcoin es la garantía perfecta para pedir préstamos: se puede vender
                las 24 horas del día, se verifica al instante, no depende de que nadie
                cumpla su palabra, y no se puede falsificar. No hay que confiar en
                auditores, no hay que esperar horarios de banco, no hay que negociar
                cuánto vale.
              </p>
              <p>
                Por esto, cada vez más instituciones aceptan Bitcoin como garantía
                para préstamos. Es más simple, más rápido, y más seguro que cualquier
                alternativa tradicional.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚙️</div>
              <h3>Se Puede Programar</h3>
              <p>
                Bitcoin puede quedar programado. Puedes crear herencias que se ejecutan
                automáticamente, pagos que se liberan cuando se cumplen ciertas condiciones,
                o cajas fuertes que requieren la aprobación de varios familiares para abrirse.
              </p>
              <p>
                No necesitas abogados, notarios, ni confiar en que un banco siga
                tus instrucciones. Las reglas se cumplen automáticamente, sin intermediarios.
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
              <h4>Sube y Baja Mucho</h4>
              <p>
                Bitcoin puede caer 50-80% en sus correcciones. Esto ha pasado múltiples
                veces y probablemente pase de nuevo. Si no puedes tolerar ver tu
                inversión en rojo por meses o años, Bitcoin no es para ti.
              </p>
            </div>
            <div className="risk-card">
              <h4>Regulación</h4>
              <p>
                Los gobiernos podrían dificultar (aunque no prohibir realmente)
                el uso de Bitcoin. China lo ha intentado sin éxito. Estados Unidos ha optado
                por regularlo, lo que lo hace más legítimo.
              </p>
            </div>
            <div className="risk-card">
              <h4>Guardar las Claves</h4>
              <p>
                Si pierdes tus claves, pierdes tu Bitcoin. Guardarlo tú mismo requiere
                responsabilidad. Esto es tanto una fortaleza como un riesgo.
              </p>
            </div>
            <div className="risk-card">
              <h4>Tecnología</h4>
              <p>
                Aunque la red ha funcionado sin fallas importantes por 15 años, siempre
                existe un riesgo técnico. Es bajo pero no es cero.
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
              Bitcoin no es un esquema para hacerse rico rápido. Es una <strong>herramienta de libertad
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
