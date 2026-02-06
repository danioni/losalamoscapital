'use client';

import { useState, useEffect } from 'react';
import './familia.css';

const CORRECT_PIN = '8955';

export default function FamiliaPage() {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  // Check if already authenticated in this session
  useEffect(() => {
    const auth = sessionStorage.getItem('familia-auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Handle keyboard input for PIN
  useEffect(() => {
    if (isAuthenticated) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle number keys (both main keyboard and numpad)
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        if (pin.length < 4) {
          const newPin = pin + e.key;
          setPin(newPin);
          setError(false);

          // Auto-submit when 4 digits entered
          if (newPin.length === 4) {
            if (newPin === CORRECT_PIN) {
              setIsAuthenticated(true);
              sessionStorage.setItem('familia-auth', 'true');
            } else {
              setError(true);
              setShake(true);
              setTimeout(() => {
                setPin('');
                setShake(false);
              }, 500);
            }
          }
        }
      }
      // Handle backspace
      else if (e.key === 'Backspace') {
        e.preventDefault();
        setPin(prev => prev.slice(0, -1));
        setError(false);
      }
      // Handle delete/clear
      else if (e.key === 'Delete' || e.key === 'Escape') {
        e.preventDefault();
        setPin('');
        setError(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated, pin]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === CORRECT_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem('familia-auth', 'true');
      setError(false);
    } else {
      setError(true);
      setShake(true);
      setPin('');
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleDigitClick = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      setError(false);

      // Auto-submit when 4 digits entered
      if (newPin.length === 4) {
        if (newPin === CORRECT_PIN) {
          setIsAuthenticated(true);
          sessionStorage.setItem('familia-auth', 'true');
        } else {
          setError(true);
          setShake(true);
          setTimeout(() => {
            setPin('');
            setShake(false);
          }, 500);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  const handleClear = () => {
    setPin('');
    setError(false);
  };

  if (isAuthenticated) {
    return <FamiliaContent />;
  }

  return (
    <div className="pin-gate">
      <div className="pin-container">
        <div className="pin-logo">🌳</div>
        <h1 className="pin-title">Acceso Familia</h1>
        <p className="pin-subtitle">Ingresa el PIN para continuar</p>

        <form onSubmit={handlePinSubmit}>
          <div className={`pin-dots ${shake ? 'shake' : ''}`}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`pin-dot ${pin.length > i ? 'filled' : ''} ${error ? 'error' : ''}`}
              />
            ))}
          </div>

          <div className="pin-keypad">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                className="pin-key"
                onClick={() => handleDigitClick(digit)}
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              className="pin-key action"
              onClick={handleClear}
            >
              C
            </button>
            <button
              type="button"
              className="pin-key"
              onClick={() => handleDigitClick('0')}
            >
              0
            </button>
            <button
              type="button"
              className="pin-key action"
              onClick={handleDelete}
            >
              ←
            </button>
          </div>

          <button type="submit" style={{ display: 'none' }} />
        </form>

        <p className="pin-error-msg">
          {error ? 'PIN incorrecto. Intenta de nuevo.' : ''}
        </p>
        <p className="pin-keyboard-hint">
          También puedes usar el teclado
        </p>
      </div>
    </div>
  );
}

function FamiliaContent() {
  return (
    <div className="familia-page">
      {/* HERO */}
      <div className="hero">
        <div className="hero-content">
          <div className="tagline">Donde hay álamos, hay raíces</div>
          <h1>Los Álamos Capital</h1>
          <div className="subtitle">Nuestro capital familiar, trabajando para las próximas generaciones</div>
          <div className="for-mama">Preparado con cariño para María Henríquez</div>
        </div>
      </div>

      <div className="content">
        {/* LA HISTORIA */}
        <section>
          <h2>Todo empieza con el tata</h2>
          <p>El tata fue inversionista hasta su último día. Literalmente — preguntando por la bolsa, atento a los números, siempre pensando en hacer crecer lo que tenía. Porque él entendía algo que la mayoría no entiende:</p>

          <div className="quote-card">
            <p className="quote-text">Las vueltas son las que dejan</p>
            <p className="quote-secondary">Peso ahorrado es peso ganado</p>
          </div>

          <p>Las vueltas son las que dejan. No el sueldo, no el ahorro quieto en el banco — <span className="highlight">las vueltas.</span> Poner la plata a trabajar, que genere más, y volver a invertir. Eso hizo el tata toda su vida.</p>
          <p>Y nos dejó dos encargos: cuidar a la abuela, y cuidar lo que construyó. Los Álamos Capital existe para cumplir los dos.</p>
          <p>Ahora ese capital está en nuestras manos. Y la pregunta es simple: ¿qué haría el tata? La respuesta ya la sabemos — lo mismo que hizo siempre. Ponerlo a trabajar, con cabeza, con paciencia, pensando en el largo plazo. Para la abuela, para ti, para el Lucianito, para los que vengan.</p>
        </section>

        <div className="divider">· · ·</div>

        {/* EL NOMBRE + EL PROBLEMA */}
        <section>
          <h2>Los Álamos Capital</h2>
          <p>Los álamos tienen raíces profundas — se sostienen en las tormentas y crecen alto cuando les das tiempo. Por eso elegimos ese nombre para nuestra empresa familiar: tuya y mía, 50/50, transparente, profesional.</p>
          <p>Pero primero, ¿por qué mover la plata? Porque parte del capital estaba en un fondo mutuo de Itaú que en realidad <strong>pierde valor</strong>:</p>

          <div className="stats-card danger">
            <div className="stat-row">
              <div className="stat-number">~4%</div>
              <div className="stat-text"><strong>Renta el fondo mutuo</strong> — lo que el banco dice que ganas.</div>
            </div>
            <div className="stat-row">
              <div className="stat-number">~5%</div>
              <div className="stat-text"><strong>Inflación en Chile</strong> — lo que suben los precios cada año.</div>
            </div>
            <div className="stat-row">
              <div className="stat-number danger">-1%</div>
              <div className="stat-text"><strong>Resultado real</strong> — el capital se achica cada año sin que nadie lo toque.</div>
            </div>
          </div>

          <p>Y eso sin contar que el peso chileno pierde valor frente al dólar. <span className="highlight">$100 millones hoy compran menos que $100 millones hace 5 años.</span> El tata no dejaría su plata así.</p>
        </section>

        <div className="divider">· · ·</div>

        {/* EL PLAN + BITCOIN + ESCENARIOS */}
        <section>
          <h2>El plan: hacer crecer las raíces</h2>
          <p>En vez de dejar la plata donde se achica, vamos a invertirla en activos que crecen — principalmente <strong>Bitcoin</strong> y <strong>fondos de tecnología en dólares</strong>. Suena nuevo, pero la lógica es antigua: <span className="highlight">poner la plata donde crece, en una moneda que no se devalúa, y tener paciencia.</span></p>

          <div className="compare-grid">
            <div className="compare-card before">
              <div className="label">Hoy — Fondo Itaú</div>
              <div className="value">-1%</div>
              <div className="desc">Retorno real después de inflación<br/>Todo en pesos chilenos</div>
            </div>
            <div className="compare-card after">
              <div className="label">Mañana — Los Álamos Capital</div>
              <div className="value">+501%</div>
              <div className="desc">Objetivo escenario base a 3-4 años<br/>95% en dólares y Bitcoin</div>
            </div>
          </div>

          <h3>¿Y por qué Bitcoin?</h3>
          <p>Bitcoin es como el oro, pero del siglo XXI. <strong>Solo van a existir 21 millones, nunca más.</strong> Nadie puede &quot;imprimir&quot; más Bitcoin, como sí pueden imprimir más pesos o más dólares. Por eso cada vez más empresas, bancos y hasta gobiernos lo están comprando.</p>

          <div className="stats-card">
            <div className="stat-row">
              <div className="stat-number">16</div>
              <div className="stat-text"><strong>Años funcionando</strong> — desde 2009, sin parar ni un solo día.</div>
            </div>
            <div className="stat-row">
              <div className="stat-number success">0</div>
              <div className="stat-text"><strong>Veces que ha perdido plata</strong> si lo mantienes más de 4 años. Cero.</div>
            </div>
          </div>

          <h3>Lo más escaso que existe</h3>
          <p>Para entender Bitcoin, hay que entender la escasez. <span className="highlight">Solo existirán 21 millones de Bitcoin. Punto.</span> No 21 millones &quot;por ahora&quot; — 21 millones para siempre. Es matemáticamente imposible crear más.</p>

          <div className="stats-card">
            <div className="stat-row">
              <div className="stat-number gold">59M+</div>
              <div className="stat-text"><strong>Millonarios en dólares</strong> en el mundo hoy. Y creciendo cada año.</div>
            </div>
            <div className="stat-row">
              <div className="stat-number">21M</div>
              <div className="stat-text"><strong>Bitcoin que existirán</strong> — para siempre. Nunca habrá más.</div>
            </div>
          </div>

          <p>Piénsalo así: <strong>hay más millonarios en el mundo que Bitcoin disponibles.</strong> Si cada millonario quisiera tener aunque sea 1 Bitcoin completo, no alcanzaría para todos. Y eso sin contar empresas, fondos, gobiernos...</p>

          <div className="asset-list">
            <div className="asset-item">
              <div className="asset-icon">🥇</div>
              <div className="asset-info">
                <div className="asset-name">Oro</div>
                <div className="asset-detail">Se sigue minando ~3,000 toneladas al año. La oferta crece ~1.5% anual.</div>
              </div>
              <div className="asset-value">∞</div>
            </div>
            <div className="asset-item">
              <div className="asset-icon">💵</div>
              <div className="asset-info">
                <div className="asset-name">Dólares</div>
                <div className="asset-detail">La Fed imprime cuando quiere. En 2020 imprimió 40% más dólares.</div>
              </div>
              <div className="asset-value">∞</div>
            </div>
            <div className="asset-item featured">
              <div className="asset-icon">₿</div>
              <div className="asset-info">
                <div className="asset-name">Bitcoin</div>
                <div className="asset-detail">Máximo 21 millones. Matemáticamente imposible crear más.</div>
              </div>
              <div className="asset-value">21M</div>
            </div>
          </div>

          <p>El oro fue el dinero definitivo durante 5,000 años porque era escaso y difícil de falsificar. <span className="highlight">Bitcoin es más escaso que el oro, imposible de falsificar, y además se puede enviar por internet.</span> Es el dinero definitivo del siglo XXI.</p>

          <div className="quote-card">
            <p className="quote-text">Tener 1 Bitcoin completo hoy es como haber comprado una manzana en Manhattan en 1800</p>
            <p className="quote-secondary">El club de los &quot;whole-coiners&quot; (personas con 1+ BTC) es más exclusivo que el club de millonarios.</p>
          </div>

          <h3>El Rainbow Chart: siempre sube, y ahora está en oportunidad</h3>
          <p>El &quot;Rainbow Chart&quot; es una herramienta visual que muestra el precio histórico de Bitcoin en bandas de colores. <span className="highlight">En 16 años de historia, Bitcoin SIEMPRE ha subido cuando miras períodos de 4+ años.</span> Las bandas muestran si está &quot;caro&quot; o &quot;barato&quot; relativo a su tendencia histórica.</p>

          {/* Rainbow Chart - Embedded from blockchaincenter.net */}
          <div className="rainbow-chart-embed">
            <div className="rainbow-header">
              <span className="rainbow-title">Bitcoin Rainbow Chart</span>
              <span className="rainbow-subtitle">Precio histórico en escala logarítmica</span>
            </div>
            <div className="rainbow-iframe-container">
              <iframe
                src="https://www.blockchaincenter.net/static/rainbow-chart.html"
                title="Bitcoin Rainbow Chart"
                className="rainbow-iframe"
                loading="lazy"
              />
            </div>
            <div className="rainbow-legend">
              <div className="legend-item"><span className="dot fire"></span>Burbuja máxima</div>
              <div className="legend-item"><span className="dot red"></span>Euforia / Vender</div>
              <div className="legend-item"><span className="dot orange"></span>Toma de ganancias</div>
              <div className="legend-item"><span className="dot yellow"></span>¿Está caro?</div>
              <div className="legend-item"><span className="dot green"></span>Mantener</div>
              <div className="legend-item"><span className="dot cyan"></span>Acumular</div>
              <div className="legend-item"><span className="dot blue"></span>Comprar</div>
              <div className="legend-item current"><span className="dot purple"></span>Liquidación ← Estamos aquí</div>
            </div>
            <div className="rainbow-footer">
              <strong>Lectura actual:</strong> Bitcoin (~$65K) está en la zona azul/violeta — &quot;Liquidación total&quot; según su tendencia histórica.
              Históricamente, comprar en esta zona ha generado retornos de <strong>300-1000%</strong> en los siguientes 2-3 años.
            </div>
          </div>

          <div className="stats-card info">
            <div className="stat-row">
              <div className="stat-number info">~$65K</div>
              <div className="stat-text"><strong>Precio actual de Bitcoin</strong> — en zona de oportunidad según el Rainbow Chart.</div>
            </div>
            <div className="stat-row">
              <div className="stat-number success">$150K+</div>
              <div className="stat-text"><strong>Precio proyectado</strong> para cuando Bitcoin entre en zona amarilla/naranja (1-2 años).</div>
            </div>
          </div>

          <p>Mira la historia: cada vez que Bitcoin ha estado en la zona azul/verde (como ahora), los que compraron y esperaron 3-4 años multiplicaron su inversión. <span className="highlight">No es &quot;timing perfecto&quot; — es que el activo más escaso del mundo sigue siendo incomprendido por la mayoría.</span></p>

          <div className="quote-card">
            <p className="quote-text">El mejor momento para plantar un árbol fue hace 20 años.</p>
            <p className="quote-secondary">El segundo mejor momento es hoy.</p>
          </div>

          <h3>¿Cuánto podría crecer el capital?</h3>
          <p>Con el capital actual de Los Álamos:</p>

          <div className="scenarios">
            <div className="scenario green">
              <div className="scenario-icon">🌱</div>
              <div className="scenario-text">
                <div className="name">Conservador</div>
                <div className="detail">Bitcoin sube moderadamente.</div>
              </div>
              <div className="scenario-result">$474M</div>
            </div>
            <div className="scenario gold">
              <div className="scenario-icon">🌳</div>
              <div className="scenario-text">
                <div className="name">Base (lo que esperamos)</div>
                <div className="detail">El ciclo se materializa como anticipamos.</div>
              </div>
              <div className="scenario-result">$901M</div>
            </div>
            <div className="scenario blue">
              <div className="scenario-icon">🏔️</div>
              <div className="scenario-text">
                <div className="name">Agresivo</div>
                <div className="detail">Bitcoin se convierte en reserva de valor global.</div>
              </div>
              <div className="scenario-result">$1,743M</div>
            </div>
            <div className="scenario red">
              <div className="scenario-icon">🌧️</div>
              <div className="scenario-text">
                <div className="name">Adverso</div>
                <div className="detail">Mercado baja fuerte. Temporal — siempre se ha recuperado.</div>
              </div>
              <div className="scenario-result">$70M</div>
            </div>
          </div>
        </section>

        <div className="divider">· · ·</div>

        {/* ACUMULAR + BBD */}
        <section>
          <h2>Acumular y nunca vender</h2>
          <p>Las vueltas son las que dejan — el tata lo decía y lo vivía. Las familias más ricas del mundo hacen exactamente lo mismo: Musk, Bezos, los Walton. Tienen muchas capas de inversión funcionando al mismo tiempo, como un bosque. <span className="highlight">Nunca cortan los árboles — dejan que crezcan y piden prestado contra ellos.</span></p>

          <h3>¿Y si necesitamos plata?</h3>
          <p>En vez de vender (y perder 27% en impuestos + perder la posición), pedimos prestado contra lo que tenemos:</p>

          <div className="timeline">
            <div className="timeline-step" data-step="1">
              <div className="timeline-content">
                <h4 className="timeline-title">Invertimos el capital</h4>
                <p className="timeline-desc">Ejemplo: 2 Bitcoin a $65,000 USD cada uno = $130,000 USD total.</p>
              </div>
            </div>
            <div className="timeline-step" data-step="2">
              <div className="timeline-content">
                <h4 className="timeline-title">Bitcoin sube con el tiempo</h4>
                <p className="timeline-desc">En 3 años vale $500,000 cada uno. Ahora tenemos $1,000,000 USD. No vendemos nada.</p>
              </div>
            </div>
            <div className="timeline-step" data-step="3">
              <div className="timeline-content">
                <h4 className="timeline-title">¿Necesitas plata? Pedimos prestado</h4>
                <p className="timeline-desc">El banco presta encantado porque tenemos $1M de respaldo. Pagamos intereses bajos, no pagamos impuestos, y seguimos dueños de todo.</p>
              </div>
            </div>
          </div>

          <h3>¿Quién puede pedir prestado?</h3>

          <div className="persona-grid">
            <div className="persona-card">
              <div className="emoji">👩</div>
              <div className="name">María</div>
              <div className="badge low">Acceso limitado</div>
              <div className="detail">Difícil acceder a créditos personales.</div>
            </div>
            <div className="persona-card">
              <div className="emoji">👨‍💼</div>
              <div className="name">Franco</div>
              <div className="badge high">Buen acceso</div>
              <div className="detail">Sueldo estable, historial crediticio, líneas de crédito.</div>
            </div>
            <div className="persona-card">
              <div className="emoji">🏢</div>
              <div className="name">Los Álamos Capital</div>
              <div className="badge high">Mejor acceso</div>
              <div className="detail">Créditos empresariales y productos financieros especiales.</div>
            </div>
          </div>

          <p>La plata está en la empresa (50/50). Si necesitamos liquidez, <span className="highlight">Franco o la empresa piden prestado — no vendemos nada.</span></p>
        </section>

        <div className="divider">· · ·</div>

        {/* SEGURIDAD + IMPUESTOS + CIERRE */}
        <section>
          <h2>Protecciones y lo que necesito de ti</h2>
          <p>Bitcoin puede bajar 50% temporalmente. La palabra clave es <strong>temporalmente</strong> — siempre se ha recuperado si esperas 4+ años. Y tenemos protecciones:</p>

          <div className="safety-box">
            <div className="safety-grid">
              <div className="safety-item">
                <div className="icon">🛡️</div>
                <div className="title">Colchón para la abuela</div>
                <div className="desc">~5% del capital siempre en el banco, disponible inmediatamente. El tata nos encargó cuidarla — eso es sagrado.</div>
              </div>
              <div className="safety-item">
                <div className="icon">⏰</div>
                <div className="title">Horizonte largo</div>
                <div className="desc">Inversión a 5+ años. Las caídas son normales. No vendemos en pánico.</div>
              </div>
              <div className="safety-item">
                <div className="icon">📊</div>
                <div className="title">Reporte mensual</div>
                <div className="desc">Franco te manda un reporte cada mes. Transparencia total.</div>
              </div>
              <div className="safety-item">
                <div className="icon">🔐</div>
                <div className="title">Custodia segura</div>
                <div className="desc">Bitcoin en dispositivo físico (como una caja fuerte digital). Respaldos en dos ubicaciones.</div>
              </div>
            </div>
          </div>

          <p><strong>Impuestos:</strong> El capital está limpio y documentado. Como la estrategia es no vender sino pedir prestado contra los activos, minimizamos impuestos futuros.</p>

          <div className="need-grid">
            <div className="need-card">
              <div className="number">1</div>
              <div className="title">Paciencia</div>
              <div className="desc">5+ años. Va a haber momentos donde el número baje. Eso es normal.</div>
            </div>
            <div className="need-card">
              <div className="number">2</div>
              <div className="title">Confianza</div>
              <div className="desc">Franco maneja las decisiones. Reporte mensual con todo.</div>
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <div className="footer">
        <div className="sign">Con todo el cariño, Franco 🌳</div>
        <p>El tata estaría orgulloso.</p>
        <div className="company">Los Álamos Capital SpA — Donde hay álamos, hay raíces</div>
      </div>
    </div>
  );
}
