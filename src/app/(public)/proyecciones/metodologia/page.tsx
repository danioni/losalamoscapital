import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Metodología del Modelo Multi-Factor | Los Álamos Capital",
  description:
    "Documentación completa del modelo cuantitativo multi-factor utilizado para las proyecciones de rendimiento. Fórmulas, supuestos y limitaciones.",
};

export default function MetodologiaProyeccionesPage() {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "0 2rem",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Hero */}
      <section style={{ padding: "4rem 0 2rem", textAlign: "center" }}>
        <div
          className="animate-fade-up"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.4rem 1rem",
            border: "1px solid rgba(167, 139, 250, 0.2)",
            borderRadius: "100px",
            fontSize: "0.75rem",
            fontWeight: 500,
            color: "#c4b5fd",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "2rem",
            background: "rgba(167, 139, 250, 0.1)",
          }}
        >
          Documentación Técnica
        </div>
        <h1
          className="animate-fade-up animate-delay-1"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2.4rem",
            fontWeight: 400,
            lineHeight: 1.2,
            marginBottom: "1rem",
            color: "#e8efe6",
          }}
        >
          Metodología del Modelo
          <br />
          Multi-Factor
        </h1>
        <p
          className="animate-fade-up animate-delay-2"
          style={{
            fontSize: "1rem",
            color: "#8a9e93",
            maxWidth: "580px",
            margin: "0 auto 1.5rem",
            fontWeight: 300,
            lineHeight: 1.6,
          }}
        >
          Explicación detallada de cómo se calculan las proyecciones de rendimiento
          para los 50 activos más valiosos del mundo.
        </p>
        <Link
          href="/proyecciones"
          className="animate-fade-up animate-delay-3"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.8rem",
            color: "#52b788",
            textDecoration: "none",
            border: "1px solid rgba(82, 183, 136, 0.3)",
            padding: "0.4rem 1rem",
            borderRadius: "100px",
          }}
        >
          ← Volver a Proyecciones
        </Link>
      </section>

      {/* Table of Contents */}
      <nav
        className="animate-fade-up animate-delay-3"
        style={{
          background: "#111a16",
          border: "1px solid rgba(45, 106, 79, 0.2)",
          borderRadius: "12px",
          padding: "1.5rem",
          marginBottom: "2.5rem",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1rem",
            color: "#e8efe6",
            marginBottom: "0.75rem",
          }}
        >
          Contenido
        </h2>
        <ol
          style={{
            listStyle: "decimal",
            paddingLeft: "1.25rem",
            fontSize: "0.85rem",
            color: "#52b788",
            lineHeight: 2,
          }}
        >
          <li><a href="#overview" style={{ color: "#52b788", textDecoration: "none" }}>Visión General del Modelo</a></li>
          <li><a href="#data-sources" style={{ color: "#52b788", textDecoration: "none" }}>Fuentes de Datos</a></li>
          <li><a href="#cagr-base" style={{ color: "#52b788", textDecoration: "none" }}>Capa 1: CAGR Base</a></li>
          <li><a href="#pe-adjustment" style={{ color: "#52b788", textDecoration: "none" }}>Capa 2: Ajuste por P/E</a></li>
          <li><a href="#eps-growth" style={{ color: "#52b788", textDecoration: "none" }}>Capa 3: Crecimiento de GPA</a></li>
          <li><a href="#dividends" style={{ color: "#52b788", textDecoration: "none" }}>Capa 4: Rendimiento por Dividendo</a></li>
          <li><a href="#52w-range" style={{ color: "#52b788", textDecoration: "none" }}>Capa 5: Rango de 52 Semanas</a></li>
          <li><a href="#scenarios" style={{ color: "#52b788", textDecoration: "none" }}>Los Tres Escenarios</a></li>
          <li><a href="#confidence" style={{ color: "#52b788", textDecoration: "none" }}>Indicador de Confianza</a></li>
          <li><a href="#limitations" style={{ color: "#52b788", textDecoration: "none" }}>Limitaciones y Sesgos</a></li>
        </ol>
      </nav>

      {/* Section 1: Overview */}
      <Section id="overview" number={1} title="Visión General del Modelo">
        <P>
          El modelo genera proyecciones de rendimiento anualizado (CAGR) a 5 y 10 años
          para cada activo utilizando un enfoque de <Strong color="#95d5b2">capas aditivas</Strong>.
          Parte de una base de CAGR histórico y la ajusta con datos fundamentales en vivo
          obtenidos semanalmente de Yahoo Finance.
        </P>
        <P>
          Se generan <Strong color="#52b788">tres escenarios</Strong> (Conservador, Base, Optimista)
          que representan un rango de resultados posibles. El modelo es <Strong color="#d4a373">determinístico</Strong>:
          dados los mismos inputs, siempre produce los mismos outputs. No utiliza machine learning,
          Monte Carlo, ni ninguna forma de aleatoriedad.
        </P>
        <FormulaBox>
          CAGR Proyectado = CAGR Base ± Ajuste P/E ± Ajuste GPA + Rend. Dividendo ± Ajuste 52s
        </FormulaBox>
      </Section>

      {/* Section 2: Data Sources */}
      <Section id="data-sources" number={2} title="Fuentes de Datos">
        <P>
          El modelo combina datos estáticos (hardcoded) con datos dinámicos (actualizados semanalmente):
        </P>
        <DataTable
          rows={[
            { dato: "Precio de inicio (IPO)", fuente: "Datos históricos, ajustados por splits", freq: "Estático" },
            { dato: "Precio actual", fuente: "Yahoo Finance API (v7/finance/quote)", freq: "Semanal" },
            { dato: "Cap. de Mercado", fuente: "Yahoo Finance / CoinGecko (BTC)", freq: "Semanal" },
            { dato: "P/E Actual", fuente: "Yahoo Finance (trailingPE)", freq: "Semanal" },
            { dato: "P/E Proyectado", fuente: "Yahoo Finance (forwardPE)", freq: "Semanal" },
            { dato: "Rend. por Dividendo", fuente: "Yahoo Finance (trailingAnnualDividendYield)", freq: "Semanal" },
            { dato: "Crec. de GPA", fuente: "Derivado: (GPA proyectado / GPA actual) - 1", freq: "Semanal" },
            { dato: "Máx/Mín 52 Semanas", fuente: "Yahoo Finance", freq: "Semanal" },
            { dato: "Precios 5 años atrás", fuente: "Datos estáticos (Feb 2021)", freq: "Estático" },
          ]}
        />
        <P>
          El cron job se ejecuta cada domingo a las 20:00 UTC. Si Yahoo Finance no devuelve
          algún dato fundamental (común en commodities, crypto e índices), el modelo opera
          con los factores disponibles y ajusta el indicador de confianza.
        </P>
      </Section>

      {/* Section 3: CAGR Base */}
      <Section id="cagr-base" number={3} title="Capa 1: CAGR Base">
        <P>
          El punto de partida para las proyecciones son dos CAGRs calculados para cada activo:
        </P>
        <FormulaBox>
          CAGR = ((Precio Final / Precio Inicial) ^ (1 / Años) - 1) × 100
        </FormulaBox>
        <ul style={{ paddingLeft: "1.25rem", marginBottom: "1rem" }}>
          <Li><Strong color="#52b788">CAGR Histórico</Strong>: Desde la fecha de inicio (IPO o primera cotización significativa) hasta hoy. Para empresas centenarias como P&G (1890) o Coca-Cola (1919), esto puede abarcar más de 100 años.</Li>
          <Li><Strong color="#52b788">CAGR 5 Años</Strong>: Desde febrero 2021 hasta hoy. Captura el impulso reciente, incluyendo el auge de IA/semiconductores y la volatilidad de las criptomonedas.</Li>
        </ul>
        <P>
          Ambos CAGRs reflejan <Strong color="#d4a373">solo apreciación de precio</Strong>, sin incluir
          dividendos reinvertidos. Los precios de IPO están ajustados por todas las divisiones de acciones
          (splits) posteriores.
        </P>
        <P>
          Para asignar los escenarios, el modelo identifica el <Strong color="#52b788">CAGR menor</Strong> y
          el <Strong color="#52b788">CAGR mayor</Strong> entre los dos, independientemente de cuál sea histórico
          y cuál reciente. Esto previene inversiones lógicas cuando ambos CAGRs divergen significativamente
          (por ejemplo, Bitcoin tiene ~90% histórico pero solo ~6% en 5 años):
        </P>
        <FormulaBox>
          Conservador = min(CAGR Hist, CAGR 5Y) × 0.70{"\n"}
          Base = CAGR Hist × 0.40 + CAGR 5Y × 0.60{"\n"}
          Optimista = max(CAGR Hist, CAGR 5Y)
        </FormulaBox>
        <P>
          Después de aplicar todos los ajustes fundamentales, el modelo <Strong color="#d4a373">re-ordena</Strong> los
          tres valores para garantizar que siempre se cumpla: Conservador ≤ Base ≤ Optimista.
        </P>
      </Section>

      {/* Section 4: P/E Adjustment */}
      <Section id="pe-adjustment" number={4} title="Capa 2: Ajuste por Valuación (P/E)">
        <P>
          El ratio Precio/Ganancia (P/E) mide cuánto paga el mercado por cada dólar de ganancias.
          El modelo usa el <Strong color="#52b788">P/E Proyectado</Strong> (basado en GPA proyectada)
          como señal principal y la relación entre P/E Proyectado y P/E Actual como señal secundaria.
        </P>

        <SubSection title="A. Penalización por P/E alto">
          <P>
            Si el P/E Proyectado supera 35, el activo se considera caro. Se aplica una penalización
            a los escenarios Base y Optimista:
          </P>
          <FormulaBox>
            Penalización = mín((P/E Proy. - 35) × 0.10, 3.0) puntos porcentuales
          </FormulaBox>
          <P>
            Ejemplo: NVDA con P/E Proyectado = 45 recibiría una penalización de (45-35)×0.10 = 1.0pp.
          </P>
        </SubSection>

        <SubSection title="B. Bonus por P/E bajo">
          <P>
            Si el P/E Proyectado es menor a 15, el activo se considera barato. Se aplica un bonus
            al escenario Conservador:
          </P>
          <FormulaBox>
            Bonus = mín((15 - P/E Proy.) × 0.15, 2.0) puntos porcentuales
          </FormulaBox>
        </SubSection>

        <SubSection title="C. Señal de compresión de P/E">
          <P>
            Cuando el P/E Proyectado es menor que el P/E Actual, significa que el mercado espera
            que las ganancias crezcan más rápido que el precio — una señal alcista.
          </P>
          <FormulaBox>
            Cambio P/E = (P/E Proy. - P/E Actual) / P/E Actual
          </FormulaBox>
          <ul style={{ paddingLeft: "1.25rem", marginBottom: "1rem" }}>
            <Li>Si Cambio P/E &lt; -10%: Impulso de hasta +2pp al escenario Base</Li>
            <Li>Si Cambio P/E &gt; +15%: Lastre de hasta -2pp al escenario Base</Li>
          </ul>
        </SubSection>
      </Section>

      {/* Section 5: EPS Growth */}
      <Section id="eps-growth" number={5} title="Capa 3: Crecimiento de GPA">
        <P>
          El crecimiento de GPA se deriva comparando las ganancias por acción proyectadas (GPA proyectada)
          con las actuales (GPA actual):
        </P>
        <FormulaBox>
          Crec. GPA = (GPA Proyectada / GPA Actual) - 1
        </FormulaBox>
        <P>
          Este factor se incorpora al escenario <Strong color="#52b788">Base</Strong> con un
          peso del 20%:
        </P>
        <FormulaBox>
          Base ajustado = Base × 0.80 + (Base + Crec. GPA% × 0.30) × 0.20
        </FormulaBox>
        <P>
          Adicionalmente, si el crecimiento de GPA supera el 15%, el escenario
          <Strong color="#a78bfa"> Optimista</Strong> recibe un impulso de hasta +3pp:
        </P>
        <FormulaBox>
          Impulso Optimista = mín(Crec. GPA% × 0.10, 3.0) pp
        </FormulaBox>
        <P>
          Nota: Este dato solo está disponible para empresas con ganancias reportadas.
          No aplica a materias primas (XAU, XAG), cripto (BTC) ni índices (SPX).
        </P>
      </Section>

      {/* Section 6: Dividends */}
      <Section id="dividends" number={6} title="Capa 4: Rendimiento por Dividendo">
        <P>
          El rendimiento anual por dividendo se suma directamente al retorno proyectado
          en <Strong color="#52b788">los tres escenarios</Strong>. Esto convierte la proyección
          de &quot;solo precio&quot; a una estimación de retorno total.
        </P>
        <FormulaBox>
          CAGR ajustado = CAGR precio + Rend. Dividendo%
        </FormulaBox>
        <P>
          Ejemplo: KO (Coca-Cola) con CAGR precio de 8.5% y rendimiento por dividendo de 2.8%
          tendría un CAGR ajustado de ~11.3%.
        </P>
        <P>
          <Strong color="#d4a373">Supuesto simplificador</Strong>: Se asume que el rendimiento por dividendo
          actual se mantiene constante. En la realidad, los dividendos pueden crecer, reducirse o eliminarse.
          No se modela la reinversión de dividendos (DRIP).
        </P>
      </Section>

      {/* Section 7: 52-Week Range */}
      <Section id="52w-range" number={7} title="Capa 5: Posición en Rango de 52 Semanas">
        <P>
          Este factor mide dónde está el precio actual respecto al rango de las últimas 52 semanas.
          Actúa como un indicador contrario de sentimiento:
        </P>
        <FormulaBox>
          Posición = (Precio Actual - Mín 52s) / (Máx 52s - Mín 52s)
        </FormulaBox>
        <P>
          Donde Posición = 0 significa que está en el mínimo de 52 semanas, y Posición = 1 en el máximo.
        </P>
        <ul style={{ paddingLeft: "1.25rem", marginBottom: "1rem" }}>
          <Li>
            <Strong color="#d4a373">Posición &lt; 0.30</Strong> (cerca del mínimo):
            Impulso al Conservador de hasta +2pp. La lógica es que comprar cerca del piso
            históricamente ofrece mejor relación riesgo/retorno.
          </Li>
          <Li>
            <Strong color="#a78bfa">Posición &gt; 0.85</Strong> (cerca del máximo):
            Moderación al Optimista de hasta -2pp. Precio en máximos históricos implica
            menor margen de apreciación adicional.
          </Li>
        </ul>
      </Section>

      {/* Section 8: Three Scenarios */}
      <Section id="scenarios" number={8} title="Los Tres Escenarios">
        <div style={{ display: "grid", gap: "1rem", marginBottom: "1.5rem" }}>
          <ScenarioCard
            name="Conservador"
            color="#d4a373"
            formula="mín(CAGR Hist, CAGR 5A) × 0.70 + Rend. Div. + Bonus P/E bajo + Impulso 52s mín"
            description="Toma el menor de los dos CAGRs y le aplica un recorte del 30% (reversión a la media). Refleja que las tasas de crecimiento tienden a desacelerarse. Los bonuses por P/E bajo y proximidad al mínimo de 52 semanas actúan como colchón."
          />
          <ScenarioCard
            name="Base"
            color="#52b788"
            formula="(CAGR Hist × 0.40 + CAGR 5A × 0.60) ± ajuste P/E ± ajuste GPA + Rend. Div."
            description="El escenario más informado. Combina tendencia de largo plazo con impulso reciente (60/40), y luego aplica todas las correcciones fundamentales disponibles. Representa la 'mejor estimación' del modelo con los datos actuales."
          />
          <ScenarioCard
            name="Optimista"
            color="#a78bfa"
            formula="máx(CAGR Hist, CAGR 5A) - Penalización P/E alto + impulso GPA + Rend. Div. - Mod 52s máx"
            description="Toma el mayor de los dos CAGRs y asume que se sostiene. Recibe bonus si hay fuerte crecimiento de GPA, pero se modera si el precio está en máximos de 52 semanas o el P/E está inflado."
          />
        </div>
        <P>
          El <Strong color="#95d5b2">precio proyectado</Strong> se calcula aplicando el CAGR
          de cada escenario al precio actual:
        </P>
        <FormulaBox>
          Precio Futuro = Precio Actual × (1 + CAGR/100) ^ Años
        </FormulaBox>
      </Section>

      {/* Section 9: Confidence Indicator */}
      <Section id="confidence" number={9} title="Indicador de Confianza">
        <P>
          No todos los activos tienen la misma cantidad de datos disponibles. El indicador de confianza
          muestra cuántos de los 7 factores posibles están alimentando el modelo:
        </P>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "0.5rem 1rem", marginBottom: "1rem", fontSize: "0.85rem" }}>
          <span style={{ fontFamily: "var(--font-mono)", color: "#52b788" }}>●●●</span>
          <span style={{ color: "#8a9e93" }}><Strong color="#52b788">Alta (6-7 factores)</Strong> — Proyección completa con CAGR + P/E + GPA + Dividendos + 52s</span>
          <span style={{ fontFamily: "var(--font-mono)", color: "#d4a373" }}>●●○</span>
          <span style={{ color: "#8a9e93" }}><Strong color="#d4a373">Media (4-5 factores)</Strong> — Proyección parcial, faltan algunos datos fundamentales</span>
          <span style={{ fontFamily: "var(--font-mono)", color: "#e07a5f" }}>●○○</span>
          <span style={{ color: "#8a9e93" }}><Strong color="#e07a5f">Baja (2-3 factores)</Strong> — Solo CAGR, sin datos fundamentales (típico en commodities y crypto)</span>
        </div>
        <P>
          Los 7 factores son: (1) CAGR Histórico, (2) CAGR 5 Años, (3) P/E Proyectado,
          (4) P/E Actual vs P/E Proyectado, (5) Crecimiento de GPA, (6) Rendimiento por Dividendo,
          (7) Rango de 52 Semanas.
        </P>
      </Section>

      {/* Section 10: Limitations */}
      <Section id="limitations" number={10} title="Limitaciones y Sesgos">
        <P>Este modelo tiene limitaciones importantes que el usuario debe conocer:</P>
        <ol style={{ paddingLeft: "1.25rem", marginBottom: "1rem" }}>
          <Li>
            <Strong color="#e07a5f">Sesgo de extrapolación</Strong>: Asume que patrones pasados
            tienen algún poder predictivo. En la realidad, rupturas estructurales (nuevas tecnologías,
            regulación, crisis) pueden invalidar cualquier extrapolación.
          </Li>
          <Li>
            <Strong color="#e07a5f">Sesgo de supervivencia</Strong>: Los 50 activos analizados
            son los más valiosos <em>hoy</em>. Empresas que quebraron, fueron adquiridas o perdieron
            valor significativo no aparecen, creando una ilusión de retornos consistentemente positivos.
          </Li>
          <Li>
            <Strong color="#e07a5f">Modelo estático</Strong>: Los ajustes de P/E, GPA y dividendos
            se basan en una captura semanal. No modela la evolución temporal de estos datos fundamentales.
          </Li>
          <Li>
            <Strong color="#e07a5f">Sin factores macro</Strong>: No considera tasas de interés,
            inflación, política monetaria, geopolítica, ciclos económicos ni disrupciones tecnológicas.
          </Li>
          <Li>
            <Strong color="#e07a5f">Coeficientes arbitrarios</Strong>: Los pesos y umbrales del modelo
            (0.70, 40/60, P/E &gt; 35, etc.) fueron definidos por criterio del autor, no optimizados
            estadísticamente contra datos históricos.
          </Li>
          <Li>
            <Strong color="#e07a5f">Sin correlación</Strong>: Trata cada activo independientemente.
            No modela correlaciones entre activos ni efectos de contagio de mercado.
          </Li>
          <Li>
            <Strong color="#e07a5f">Materias primas y cripto</Strong>: Oro, plata y Bitcoin no tienen
            P/E, GPA ni dividendos. Sus proyecciones dependen exclusivamente del CAGR, lo que las
            hace menos informadas que las de empresas.
          </Li>
        </ol>
      </Section>

      {/* Disclaimer */}
      <section
        style={{
          background: "rgba(224, 122, 95, 0.05)",
          border: "1px solid rgba(224, 122, 95, 0.15)",
          borderRadius: "12px",
          padding: "1.5rem",
          marginBottom: "3rem",
        }}
      >
        <h4
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1rem",
            color: "#e07a5f",
            marginBottom: "0.75rem",
          }}
        >
          Aviso Legal
        </h4>
        <div style={{ fontSize: "0.75rem", color: "#8a9e93", lineHeight: 1.8 }}>
          <p style={{ marginBottom: "0.6rem" }}>
            <strong style={{ color: "#e07a5f" }}>
              Este documento es exclusivamente informativo y educativo.
            </strong>{" "}
            La metodología descrita genera ejercicios matemáticos especulativos que NO constituyen
            predicciones de mercado, asesoría financiera, recomendación de inversión ni oferta de valores.
          </p>
          <p style={{ marginBottom: "0.6rem" }}>
            Los rendimientos pasados y los fundamentales actuales no garantizan resultados futuros.
            Toda inversión conlleva riesgo de pérdida parcial o total del capital.
          </p>
          <p>
            Los Álamos Capital SpA NO se encuentra regulada por la CMF de Chile ni acepta capital de terceros.
            Consulte con un asesor financiero acreditado antes de tomar decisiones de inversión.
          </p>
        </div>
      </section>
    </div>
  );
}

// ─── Reusable sub-components ─────────────────────────────────────────────────

function Section({ id, number, title, children }: { id: string; number: number; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ marginBottom: "2.5rem" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "1rem" }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: "#a78bfa",
            background: "rgba(167, 139, 250, 0.1)",
            border: "1px solid rgba(167, 139, 250, 0.2)",
            borderRadius: "6px",
            padding: "0.2rem 0.5rem",
            flexShrink: 0,
          }}
        >
          {String(number).padStart(2, "0")}
        </span>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.4rem",
            color: "#e8efe6",
            fontWeight: 400,
          }}
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1.25rem", paddingLeft: "0.5rem", borderLeft: "2px solid rgba(45, 106, 79, 0.2)" }}>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "#95d5b2", marginBottom: "0.5rem" }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "0.88rem", color: "#8a9e93", lineHeight: 1.7, marginBottom: "0.75rem" }}>
      {children}
    </p>
  );
}

function Strong({ children, color = "#95d5b2" }: { children: React.ReactNode; color?: string }) {
  return <strong style={{ color, fontWeight: 600 }}>{children}</strong>;
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li style={{ fontSize: "0.85rem", color: "#8a9e93", lineHeight: 1.7, marginBottom: "0.5rem" }}>
      {children}
    </li>
  );
}

function FormulaBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#0a0f0d",
        border: "1px solid rgba(45, 106, 79, 0.25)",
        borderRadius: "8px",
        padding: "0.75rem 1rem",
        fontFamily: "var(--font-mono)",
        fontSize: "0.8rem",
        color: "#95d5b2",
        marginBottom: "1rem",
        overflowX: "auto",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
}

function DataTable({ rows }: { rows: { dato: string; fuente: string; freq: string }[] }) {
  return (
    <div style={{ overflowX: "auto", marginBottom: "1rem" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(45, 106, 79, 0.3)" }}>
            <th style={{ padding: "0.5rem", textAlign: "left", color: "#5a6e63", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Dato</th>
            <th style={{ padding: "0.5rem", textAlign: "left", color: "#5a6e63", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Fuente</th>
            <th style={{ padding: "0.5rem", textAlign: "right", color: "#5a6e63", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Frecuencia</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.dato} style={{ borderBottom: "1px solid rgba(45, 106, 79, 0.1)" }}>
              <td style={{ padding: "0.5rem", color: "#e8efe6", fontWeight: 500 }}>{row.dato}</td>
              <td style={{ padding: "0.5rem", color: "#8a9e93", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>{row.fuente}</td>
              <td style={{ padding: "0.5rem", textAlign: "right" }}>
                <span style={{
                  fontSize: "0.65rem", padding: "0.1rem 0.4rem", borderRadius: "100px",
                  background: row.freq === "Semanal" ? "rgba(82, 183, 136, 0.15)" : "rgba(90, 110, 99, 0.15)",
                  color: row.freq === "Semanal" ? "#52b788" : "#8a9e93",
                  border: `1px solid ${row.freq === "Semanal" ? "rgba(82, 183, 136, 0.3)" : "rgba(90, 110, 99, 0.3)"}`,
                }}>
                  {row.freq}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ScenarioCard({ name, color, formula, description }: { name: string; color: string; formula: string; description: string }) {
  return (
    <div style={{
      background: "#111a16", border: `1px solid ${color}33`, borderRadius: "12px",
      padding: "1.25rem", borderLeft: `3px solid ${color}`,
    }}>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color, marginBottom: "0.35rem" }}>{name}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color, marginBottom: "0.75rem", opacity: 0.8 }}>{formula}</div>
      <p style={{ fontSize: "0.82rem", color: "#8a9e93", lineHeight: 1.6 }}>{description}</p>
    </div>
  );
}
