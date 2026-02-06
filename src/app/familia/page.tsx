'use client';

import { useState, useEffect } from 'react';

const CORRECT_PIN = '1234';

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
      setPin(prev => prev + digit);
      setError(false);
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
      <style jsx>{`
        .pin-gate {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a3a2a 0%, #2d5a3f 50%, #7fa98a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .pin-container {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 24px;
          padding: 48px 40px;
          max-width: 340px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          text-align: center;
        }

        .pin-logo {
          font-size: 3rem;
          margin-bottom: 16px;
        }

        .pin-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.5rem;
          color: #1a3a2a;
          margin-bottom: 8px;
        }

        .pin-subtitle {
          color: #6b6560;
          font-size: 0.9rem;
          margin-bottom: 32px;
        }

        .pin-dots {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 32px;
        }

        .pin-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #e8ddd0;
          transition: all 0.2s ease;
        }

        .pin-dot.filled {
          background: #1a3a2a;
          transform: scale(1.1);
        }

        .pin-dot.error {
          background: #c45c4a;
        }

        .shake {
          animation: shake 0.5s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(-10px); }
          80% { transform: translateX(10px); }
        }

        .pin-keypad {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          max-width: 260px;
          margin: 0 auto;
        }

        .pin-key {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          border: 2px solid #e8ddd0;
          background: white;
          font-size: 1.5rem;
          font-weight: 600;
          color: #1a3a2a;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pin-key:hover {
          background: #f5f0e8;
          border-color: #1a3a2a;
        }

        .pin-key:active {
          transform: scale(0.95);
          background: #1a3a2a;
          color: white;
        }

        .pin-key.action {
          font-size: 1.2rem;
          color: #6b6560;
        }

        .pin-key.action:hover {
          color: #1a3a2a;
        }

        .pin-error-msg {
          color: #c45c4a;
          font-size: 0.85rem;
          margin-top: 16px;
          min-height: 20px;
        }
      `}</style>

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

          {/* Hidden submit for enter key */}
          <button type="submit" style={{ display: 'none' }} />
        </form>

        <p className="pin-error-msg">
          {error ? 'PIN incorrecto. Intenta de nuevo.' : ''}
        </p>
      </div>
    </div>
  );
}

function FamiliaContent() {
  return (
    <>
      <style jsx global>{`
        :root {
          --forest: #1a3a2a;
          --forest-light: #2d5a3f;
          --sage: #7fa98a;
          --sage-light: #b8d4c0;
          --cream: #f5f0e8;
          --warm: #e8ddd0;
          --gold: #c5a55a;
          --gold-light: #e8d5a0;
          --bark: #5c4a3a;
          --text: #2c2a26;
          --text-light: #6b6560;
          --white: #fefdfb;
          --danger: #c45c4a;
          --danger-light: #f0d5cf;
        }

        .familia-page * { margin: 0; padding: 0; box-sizing: border-box; }

        .familia-page {
          font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif;
          background: var(--cream);
          color: var(--text);
          line-height: 1.7;
          font-size: 18px;
          font-weight: 300;
        }

        .familia-page .hero {
          background: linear-gradient(135deg, var(--forest) 0%, var(--forest-light) 50%, var(--sage) 100%);
          min-height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 60px 24px;
          position: relative;
          overflow: hidden;
        }

        .familia-page .hero::before {
          content: '🌳';
          position: absolute;
          font-size: 300px;
          opacity: 0.06;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .familia-page .hero-content { position: relative; z-index: 1; max-width: 700px; }

        .familia-page .hero h1 {
          font-family: 'Playfair Display', Georgia, serif;
          color: var(--white);
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 700;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }

        .familia-page .hero .subtitle {
          font-family: 'Playfair Display', Georgia, serif;
          color: var(--sage-light);
          font-size: clamp(1.1rem, 3vw, 1.5rem);
          font-style: italic;
          margin-bottom: 32px;
        }

        .familia-page .hero .tagline {
          color: var(--gold-light);
          font-size: 1rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 600;
        }

        .familia-page .hero .for-mama {
          display: inline-block;
          margin-top: 40px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 100px;
          padding: 12px 32px;
          color: var(--white);
          font-size: 0.95rem;
          backdrop-filter: blur(10px);
        }

        .familia-page .content { max-width: 800px; margin: 0 auto; padding: 0 24px; }

        .familia-page section {
          padding: 56px 0;
          animation: fadeUp 0.6s ease-out both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .familia-page section h2 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          color: var(--forest);
          margin-bottom: 32px;
          letter-spacing: -0.02em;
        }

        .familia-page section h3 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.4rem;
          color: var(--forest-light);
          margin-bottom: 16px;
          margin-top: 40px;
        }

        .familia-page section p {
          margin-bottom: 20px;
          color: var(--text);
        }

        .familia-page .highlight {
          background: linear-gradient(120deg, var(--gold-light) 0%, var(--gold-light) 100%);
          background-size: 100% 40%;
          background-position: 0 88%;
          background-repeat: no-repeat;
          font-weight: 600;
        }

        .familia-page .problem-card {
          background: var(--white);
          border-radius: 20px;
          padding: 48px;
          margin: 40px 0;
          box-shadow: 0 4px 30px rgba(0,0,0,0.06);
          border-left: 5px solid var(--danger);
        }

        .familia-page .problem-card .stat {
          display: flex;
          align-items: center;
          gap: 20px;
          margin: 24px 0;
        }

        .familia-page .problem-card .stat-number {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 3rem;
          font-weight: 700;
          color: var(--danger);
          min-width: 120px;
          text-align: center;
        }

        .familia-page .problem-card .stat-text {
          font-size: 1.05rem;
          color: var(--text-light);
        }

        .familia-page .solution-card {
          background: var(--white);
          border-radius: 20px;
          padding: 48px;
          margin: 40px 0;
          box-shadow: 0 4px 30px rgba(0,0,0,0.06);
          border-left: 5px solid var(--sage);
        }

        .familia-page .compare {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin: 40px 0;
        }

        @media (max-width: 640px) { .familia-page .compare { grid-template-columns: 1fr; } }

        .familia-page .compare-card {
          border-radius: 20px;
          padding: 36px;
          text-align: center;
        }

        .familia-page .compare-card.before {
          background: var(--warm);
          border: 2px solid #d4c4b0;
        }

        .familia-page .compare-card.after {
          background: linear-gradient(135deg, var(--forest) 0%, var(--forest-light) 100%);
          color: var(--white);
          border: 2px solid var(--sage);
        }

        .familia-page .compare-card .label {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-weight: 600;
          margin-bottom: 12px;
          opacity: 0.7;
        }

        .familia-page .compare-card .big-number {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 2.8rem;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .familia-page .compare-card .desc { font-size: 0.95rem; opacity: 0.8; }

        .familia-page .bbd-flow {
          display: flex;
          flex-direction: column;
          gap: 0;
          margin: 40px 0;
        }

        .familia-page .bbd-step {
          display: flex;
          align-items: stretch;
          gap: 24px;
        }

        .familia-page .bbd-line {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 60px;
          flex-shrink: 0;
        }

        .familia-page .bbd-dot {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--white);
          flex-shrink: 0;
          z-index: 1;
        }

        .familia-page .bbd-connector {
          width: 3px;
          flex-grow: 1;
          background: var(--sage-light);
          min-height: 20px;
        }

        .familia-page .bbd-content {
          background: var(--white);
          border-radius: 16px;
          padding: 28px 32px;
          margin-bottom: 16px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.05);
          flex-grow: 1;
        }

        .familia-page .bbd-content h4 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.2rem;
          color: var(--forest);
          margin-bottom: 8px;
        }

        .familia-page .bbd-content p {
          font-size: 0.95rem;
          color: var(--text-light);
          margin-bottom: 0;
        }

        .familia-page .scenarios {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin: 40px 0;
        }

        .familia-page .scenario {
          background: var(--white);
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.05);
          display: flex;
          align-items: center;
          gap: 24px;
          transition: transform 0.2s;
        }

        .familia-page .scenario:hover { transform: translateY(-2px); }

        .familia-page .scenario-icon {
          font-size: 2.5rem;
          flex-shrink: 0;
          width: 70px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
        }

        .familia-page .scenario-text { flex-grow: 1; }

        .familia-page .scenario-text .name {
          font-weight: 600;
          font-size: 1.05rem;
          margin-bottom: 4px;
        }

        .familia-page .scenario-text .detail {
          font-size: 0.9rem;
          color: var(--text-light);
        }

        .familia-page .scenario-result {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.6rem;
          font-weight: 700;
          flex-shrink: 0;
          text-align: right;
        }

        .familia-page .scenario.green .scenario-icon { background: #e8f5e9; }
        .familia-page .scenario.green .scenario-result { color: #2e7d32; }
        .familia-page .scenario.gold .scenario-icon { background: #fff8e1; }
        .familia-page .scenario.gold .scenario-result { color: var(--gold); }
        .familia-page .scenario.blue .scenario-icon { background: #e3f2fd; }
        .familia-page .scenario.blue .scenario-result { color: #1565c0; }
        .familia-page .scenario.red .scenario-icon { background: var(--danger-light); }
        .familia-page .scenario.red .scenario-result { color: var(--danger); }

        .familia-page .borrow-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin: 40px 0;
        }

        @media (max-width: 640px) { .familia-page .borrow-cards { grid-template-columns: 1fr; } }

        .familia-page .borrow-card {
          background: var(--white);
          border-radius: 16px;
          padding: 32px;
          text-align: center;
          box-shadow: 0 2px 16px rgba(0,0,0,0.05);
        }

        .familia-page .borrow-card .emoji { font-size: 2.5rem; margin-bottom: 12px; }

        .familia-page .borrow-card .name {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.1rem;
          color: var(--forest);
          margin-bottom: 8px;
        }

        .familia-page .borrow-card .access {
          display: inline-block;
          padding: 4px 16px;
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .familia-page .borrow-card .access.low { background: var(--danger-light); color: var(--danger); }
        .familia-page .borrow-card .access.high { background: #e8f5e9; color: #2e7d32; }

        .familia-page .borrow-card .detail { font-size: 0.85rem; color: var(--text-light); }

        .familia-page .safety-box {
          background: linear-gradient(135deg, var(--forest) 0%, var(--forest-light) 100%);
          border-radius: 20px;
          padding: 48px;
          margin: 40px 0;
          color: var(--white);
        }

        .familia-page .safety-box h3 {
          font-family: 'Playfair Display', Georgia, serif;
          color: var(--gold-light);
          margin-top: 0;
        }

        .familia-page .safety-box p { color: rgba(255,255,255,0.85); }

        .familia-page .safety-items {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 24px;
        }

        @media (max-width: 640px) { .familia-page .safety-items { grid-template-columns: 1fr; } }

        .familia-page .safety-item {
          background: rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 20px;
          backdrop-filter: blur(10px);
        }

        .familia-page .safety-item .icon { font-size: 1.5rem; margin-bottom: 8px; }
        .familia-page .safety-item .title { font-weight: 600; margin-bottom: 4px; }
        .familia-page .safety-item .desc { font-size: 0.85rem; opacity: 0.8; }

        .familia-page .need-cards {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin: 40px 0;
        }

        @media (max-width: 640px) { .familia-page .need-cards { grid-template-columns: 1fr; } }

        .familia-page .need-card {
          background: var(--white);
          border-radius: 16px;
          padding: 36px 28px;
          text-align: center;
          box-shadow: 0 2px 16px rgba(0,0,0,0.05);
          border-top: 4px solid var(--sage);
        }

        .familia-page .need-card .number {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 2rem;
          color: var(--sage);
          margin-bottom: 8px;
        }

        .familia-page .need-card .title {
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--forest);
          margin-bottom: 8px;
        }

        .familia-page .need-card .desc { font-size: 0.9rem; color: var(--text-light); }

        .familia-page .divider {
          text-align: center;
          padding: 20px 0;
          color: var(--sage);
          font-size: 1.5rem;
          letter-spacing: 0.5em;
        }

        .familia-page .footer {
          text-align: center;
          padding: 60px 24px;
          background: var(--forest);
          color: var(--sage-light);
        }

        .familia-page .footer .sign {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.3rem;
          font-style: italic;
          color: var(--white);
          margin-bottom: 8px;
        }

        .familia-page .footer .company {
          font-size: 0.85rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-top: 16px;
          opacity: 0.6;
        }

        .familia-page section + section { border-top: 1px solid rgba(0,0,0,0.06); }

        @media (max-width: 640px) {
          .familia-page .problem-card, .familia-page .solution-card, .familia-page .safety-box { padding: 32px 24px; }
          .familia-page .problem-card .stat { flex-direction: column; text-align: center; }
          .familia-page .scenario { flex-direction: column; text-align: center; }
          .familia-page .scenario-result { text-align: center; }
        }
      `}</style>

      <div className="familia-page">
        {/* HERO */}
        <div className="hero">
          <div className="hero-content">
            <div className="tagline">Donde hay álamos, hay raíces</div>
            <h1>Los Álamos Capital</h1>
            <div className="subtitle">La herencia del tata, trabajando para las próximas generaciones</div>
            <div className="for-mama">Preparado con cariño para María Henríquez</div>
          </div>
        </div>

        <div className="content">
          {/* LA HISTORIA */}
          <section>
            <h2>Todo empieza con el tata</h2>
            <p>El tata fue inversionista hasta su último día. Literalmente — preguntando por la bolsa, atento a los números, siempre pensando en hacer crecer lo que tenía. Porque él entendía algo que la mayoría no entiende:</p>

            <div className="solution-card" style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.6rem', color: 'var(--forest)', fontStyle: 'italic', marginBottom: '16px' }}>"Las vueltas son las que dejan"</p>
              <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.2rem', color: 'var(--forest-light)', fontStyle: 'italic', marginBottom: 0 }}>"Peso ahorrado es peso ganado"</p>
            </div>

            <p>Las vueltas son las que dejan. No el sueldo, no el ahorro quieto en el banco — <span className="highlight">las vueltas.</span> Poner la plata a trabajar, que genere más, y volver a invertir. Eso hizo el tata toda su vida.</p>
            <p>Y nos dejó dos encargos: cuidar a la abuela, y cuidar lo que construyó. Los Álamos Capital existe para cumplir los dos.</p>
            <p>Ahora esa herencia está en nuestras manos. Y la pregunta es simple: ¿qué haría el tata? La respuesta ya la sabemos — lo mismo que hizo siempre. Ponerla a trabajar, con cabeza, con paciencia, pensando en el largo plazo. Para la abuela, para ti, para el Lucianito, para los que vengan.</p>
          </section>

          <div className="divider">· · ·</div>

          {/* EL NOMBRE + EL PROBLEMA */}
          <section>
            <h2>Los Álamos Capital</h2>
            <p>Los álamos tienen raíces profundas — se sostienen en las tormentas y crecen alto cuando les das tiempo. Por eso elegimos ese nombre para nuestra empresa familiar: tuya y mía, 50/50, transparente, profesional.</p>
            <p>Pero primero, ¿por qué mover la plata? Porque la herencia del tata está en un fondo mutuo de Itaú que en realidad <strong>pierde valor</strong>:</p>

            <div className="problem-card">
              <div className="stat">
                <div className="stat-number">~4%</div>
                <div className="stat-text"><strong>Renta el fondo mutuo</strong> — lo que el banco dice que ganas.</div>
              </div>
              <div className="stat">
                <div className="stat-number">~5%</div>
                <div className="stat-text"><strong>Inflación en Chile</strong> — lo que suben los precios cada año.</div>
              </div>
              <div className="stat">
                <div className="stat-number" style={{ color: 'var(--danger)' }}>-1%</div>
                <div className="stat-text"><strong>Resultado real</strong> — la herencia se achica cada año sin que nadie la toque.</div>
              </div>
            </div>

            <p>Y eso sin contar que el peso chileno pierde valor frente al dólar. <span className="highlight">$100 millones hoy compran menos que $100 millones hace 5 años.</span> El tata no dejaría su plata así.</p>
          </section>

          <div className="divider">· · ·</div>

          {/* EL PLAN + BITCOIN + ESCENARIOS */}
          <section>
            <h2>El plan: hacer crecer las raíces</h2>
            <p>En vez de dejar la plata donde se achica, vamos a invertirla en activos que crecen — principalmente <strong>Bitcoin</strong> y <strong>fondos de tecnología en dólares</strong>. Suena nuevo, pero la lógica es antigua: <span className="highlight">poner la plata donde crece, en una moneda que no se devalúa, y tener paciencia.</span></p>

            <div className="compare">
              <div className="compare-card before">
                <div className="label">Hoy — Fondo Itaú</div>
                <div className="big-number" style={{ color: 'var(--danger)' }}>-1%</div>
                <div className="desc">Retorno real después de inflación<br/>Todo en pesos chilenos</div>
              </div>
              <div className="compare-card after">
                <div className="label">Mañana — Los Álamos Capital</div>
                <div className="big-number" style={{ color: 'var(--gold-light)' }}>+501%</div>
                <div className="desc">Objetivo escenario base a 3-4 años<br/>95% en dólares y Bitcoin</div>
              </div>
            </div>

            <h3>¿Y por qué Bitcoin?</h3>
            <p>Bitcoin es como el oro, pero del siglo XXI. <strong>Solo van a existir 21 millones, nunca más.</strong> Nadie puede "imprimir" más Bitcoin, como sí pueden imprimir más pesos o más dólares. Por eso cada vez más empresas, bancos y hasta gobiernos lo están comprando.</p>

            <div className="problem-card" style={{ borderLeftColor: 'var(--sage)' }}>
              <div className="stat">
                <div className="stat-number" style={{ color: 'var(--forest)' }}>16</div>
                <div className="stat-text"><strong>Años funcionando</strong> — desde 2009, sin parar ni un solo día.</div>
              </div>
              <div className="stat">
                <div className="stat-number" style={{ color: 'var(--forest)' }}>0</div>
                <div className="stat-text"><strong>Veces que ha perdido plata</strong> si lo mantienes más de 4 años. Cero.</div>
              </div>
            </div>

            <h3>¿Cuánto podría crecer la herencia?</h3>
            <p>Con una inversión de $150 millones del tata:</p>

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

            <div className="bbd-flow">
              <div className="bbd-step">
                <div className="bbd-line">
                  <div className="bbd-dot" style={{ background: 'var(--forest)' }}>1</div>
                  <div className="bbd-connector"></div>
                </div>
                <div className="bbd-content">
                  <h4>Invertimos la herencia</h4>
                  <p>Ejemplo: 2 Bitcoin a $65,000 USD cada uno = $130,000 USD total.</p>
                </div>
              </div>
              <div className="bbd-step">
                <div className="bbd-line">
                  <div className="bbd-dot" style={{ background: 'var(--sage)' }}>2</div>
                  <div className="bbd-connector"></div>
                </div>
                <div className="bbd-content">
                  <h4>Bitcoin sube con el tiempo</h4>
                  <p>En 3 años vale $500,000 cada uno. Ahora tenemos $1,000,000 USD. No vendemos nada.</p>
                </div>
              </div>
              <div className="bbd-step">
                <div className="bbd-line">
                  <div className="bbd-dot" style={{ background: 'var(--gold)' }}>3</div>
                  <div className="bbd-connector"></div>
                </div>
                <div className="bbd-content">
                  <h4>¿Necesitas plata? Pedimos prestado</h4>
                  <p>El banco presta encantado porque tenemos $1M de respaldo. Pagamos intereses bajos, no pagamos impuestos, y seguimos dueños de todo.</p>
                </div>
              </div>
            </div>

            <h3>¿Quién puede pedir prestado?</h3>
            <div className="borrow-cards">
              <div className="borrow-card">
                <div className="emoji">👩</div>
                <div className="name">María</div>
                <div className="access low">Acceso limitado</div>
                <div className="detail">Difícil acceder a créditos personales.</div>
              </div>
              <div className="borrow-card">
                <div className="emoji">👨‍💼</div>
                <div className="name">Franco</div>
                <div className="access high">Buen acceso</div>
                <div className="detail">Sueldo estable, historial crediticio, líneas de crédito.</div>
              </div>
              <div className="borrow-card">
                <div className="emoji">🏢</div>
                <div className="name">Los Álamos Capital</div>
                <div className="access high">Mejor acceso</div>
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
              <div className="safety-items">
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

            <p><strong>Impuestos:</strong> El impuesto a la herencia ya se pagó cuando recibiste la plata del tata. El capital está limpio. Y como la estrategia es no vender sino pedir prestado, minimizamos impuestos futuros.</p>

            <div className="need-cards">
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
    </>
  );
}
