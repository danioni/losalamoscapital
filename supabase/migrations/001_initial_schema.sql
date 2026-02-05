-- ═══════════════════════════════════════════════════════════════════════════
-- Los Álamos Capital - Database Schema
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ═══ PORTFOLIO SNAPSHOTS ═══
-- Snapshots periódicos del valor del portafolio para graficar rendimiento
CREATE TABLE portfolio_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE UNIQUE NOT NULL,
    total_value_usd NUMERIC(15, 2) NOT NULL,
    nav_per_share NUMERIC(12, 4) NOT NULL DEFAULT 1000,
    benchmark_value NUMERIC(15, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for date queries
CREATE INDEX idx_portfolio_snapshots_date ON portfolio_snapshots(date DESC);

-- ═══ POSITIONS ═══
-- Posiciones actuales del portafolio
CREATE TABLE positions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticker TEXT NOT NULL,
    name TEXT NOT NULL,
    asset_class TEXT NOT NULL CHECK (asset_class IN ('acciones_usa', 'crypto', 'etf', 'efectivo', 'renta_fija', 'otro')),
    geography TEXT NOT NULL CHECK (geography IN ('usa', 'global', 'chile', 'europa', 'asia')),
    quantity NUMERIC(18, 8) NOT NULL DEFAULT 0,
    avg_cost_usd NUMERIC(15, 4) NOT NULL DEFAULT 0,
    current_price_usd NUMERIC(15, 4) NOT NULL DEFAULT 0,
    market_value_usd NUMERIC(15, 2) GENERATED ALWAYS AS (quantity * current_price_usd) STORED,
    weight_pct NUMERIC(5, 2) NOT NULL DEFAULT 0,
    unrealized_pnl_usd NUMERIC(15, 2) GENERATED ALWAYS AS ((current_price_usd - avg_cost_usd) * quantity) STORED,
    unrealized_pnl_pct NUMERIC(8, 4) GENERATED ALWAYS AS (
        CASE WHEN avg_cost_usd > 0
        THEN ((current_price_usd - avg_cost_usd) / avg_cost_usd) * 100
        ELSE 0 END
    ) STORED,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(ticker)
);

-- Index for ticker lookups
CREATE INDEX idx_positions_ticker ON positions(ticker);
CREATE INDEX idx_positions_asset_class ON positions(asset_class);

-- ═══ TRANSACTIONS ═══
-- Registro de cada operación de compra/venta
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    ticker TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('buy', 'sell', 'dividend', 'deposit', 'withdrawal')),
    quantity NUMERIC(18, 8) NOT NULL,
    price_usd NUMERIC(15, 4) NOT NULL,
    total_usd NUMERIC(15, 2) GENERATED ALWAYS AS (quantity * price_usd) STORED,
    commission_usd NUMERIC(10, 2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for date and ticker queries
CREATE INDEX idx_transactions_date ON transactions(date DESC);
CREATE INDEX idx_transactions_ticker ON transactions(ticker);

-- ═══ DECISIONS ═══
-- Registro público de decisiones de inversión
CREATE TABLE decisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('buy', 'sell', 'rebalance', 'hold')),
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for public decisions
CREATE INDEX idx_decisions_date ON decisions(date DESC);
CREATE INDEX idx_decisions_public ON decisions(is_public) WHERE is_public = TRUE;

-- ═══ FUND METRICS ═══
-- Métricas calculadas del fondo
CREATE TABLE fund_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE UNIQUE NOT NULL,
    total_return_pct NUMERIC(8, 4) NOT NULL DEFAULT 0,
    cagr_pct NUMERIC(8, 4) NOT NULL DEFAULT 0,
    alpha_vs_sp500_pct NUMERIC(8, 4) NOT NULL DEFAULT 0,
    max_drawdown_pct NUMERIC(8, 4) NOT NULL DEFAULT 0,
    sharpe_ratio NUMERIC(6, 4),
    inception_date DATE NOT NULL,
    aum_usd NUMERIC(15, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for latest metrics
CREATE INDEX idx_fund_metrics_date ON fund_metrics(date DESC);

-- ═══ SITE CONFIG ═══
-- Configuración del sitio (textos editables, última actualización, etc.)
CREATE TABLE site_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE portfolio_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE fund_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- ═══ PORTFOLIO SNAPSHOTS POLICIES ═══
-- Public read access
CREATE POLICY "portfolio_snapshots_public_read" ON portfolio_snapshots
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Admin write access (authenticated users only)
CREATE POLICY "portfolio_snapshots_admin_insert" ON portfolio_snapshots
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "portfolio_snapshots_admin_update" ON portfolio_snapshots
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "portfolio_snapshots_admin_delete" ON portfolio_snapshots
    FOR DELETE
    TO authenticated
    USING (true);

-- ═══ POSITIONS POLICIES ═══
-- Public read access
CREATE POLICY "positions_public_read" ON positions
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Admin write access
CREATE POLICY "positions_admin_insert" ON positions
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "positions_admin_update" ON positions
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "positions_admin_delete" ON positions
    FOR DELETE
    TO authenticated
    USING (true);

-- ═══ TRANSACTIONS POLICIES ═══
-- NO public read access for transactions (sensitive data)
CREATE POLICY "transactions_admin_select" ON transactions
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "transactions_admin_insert" ON transactions
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "transactions_admin_update" ON transactions
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "transactions_admin_delete" ON transactions
    FOR DELETE
    TO authenticated
    USING (true);

-- ═══ DECISIONS POLICIES ═══
-- Public read access ONLY for public decisions
CREATE POLICY "decisions_public_read" ON decisions
    FOR SELECT
    TO anon
    USING (is_public = true);

-- Authenticated users can read all decisions
CREATE POLICY "decisions_admin_read" ON decisions
    FOR SELECT
    TO authenticated
    USING (true);

-- Admin write access
CREATE POLICY "decisions_admin_insert" ON decisions
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "decisions_admin_update" ON decisions
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "decisions_admin_delete" ON decisions
    FOR DELETE
    TO authenticated
    USING (true);

-- ═══ FUND METRICS POLICIES ═══
-- Public read access
CREATE POLICY "fund_metrics_public_read" ON fund_metrics
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Admin write access
CREATE POLICY "fund_metrics_admin_insert" ON fund_metrics
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "fund_metrics_admin_update" ON fund_metrics
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "fund_metrics_admin_delete" ON fund_metrics
    FOR DELETE
    TO authenticated
    USING (true);

-- ═══ SITE CONFIG POLICIES ═══
-- Public read access
CREATE POLICY "site_config_public_read" ON site_config
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Admin write access
CREATE POLICY "site_config_admin_insert" ON site_config
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "site_config_admin_update" ON site_config
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "site_config_admin_delete" ON site_config
    FOR DELETE
    TO authenticated
    USING (true);

-- ═══════════════════════════════════════════════════════════════════════════
-- HELPER FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════════════

-- Function to update position weights
CREATE OR REPLACE FUNCTION update_position_weights()
RETURNS TRIGGER AS $$
DECLARE
    total_value NUMERIC;
BEGIN
    SELECT SUM(market_value_usd) INTO total_value FROM positions;

    IF total_value > 0 THEN
        UPDATE positions
        SET weight_pct = (market_value_usd / total_value) * 100,
            last_updated = NOW();
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update weights when positions change
CREATE TRIGGER trigger_update_weights
AFTER INSERT OR UPDATE OR DELETE ON positions
FOR EACH STATEMENT
EXECUTE FUNCTION update_position_weights();

-- ═══════════════════════════════════════════════════════════════════════════
-- INITIAL DATA
-- ═══════════════════════════════════════════════════════════════════════════

-- Insert default site configuration
INSERT INTO site_config (key, value) VALUES
    ('last_update', '{"date": null, "by": null}'::jsonb),
    ('methodology', '{
        "philosophy": {
            "title": "Inversión con convicción",
            "description": "Concentración en las mejores ideas. Portafolio compacto con posiciones de alta convicción respaldadas por análisis fundamental riguroso. Preferimos conocer profundamente pocos activos que diversificar sin criterio."
        },
        "risk_management": {
            "title": "Preservar para crecer",
            "description": "Reglas claras de sizing por posición. Nunca más del 25% en un solo activo. Stop-losses definidos antes de cada entrada. El objetivo es maximizar el retorno ajustado por riesgo, no el retorno absoluto."
        },
        "transparency": {
            "title": "Todo público, todo auditable",
            "description": "Cada decisión se documenta con tesis, precio de entrada, y criterios de salida. Los resultados se publican sin filtro — las pérdidas se reportan con la misma prominencia que las ganancias."
        }
    }'::jsonb),
    ('disclaimer', '{
        "text": "Los Álamos Capital es un track record de inversiones familiares publicado con fines informativos y de transparencia. Este sitio no constituye asesoría financiera, recomendación de inversión, ni oferta de valores. Rendimientos pasados no garantizan resultados futuros. Toda inversión conlleva riesgo de pérdida parcial o total del capital invertido. Antes de tomar decisiones de inversión, consulte con un asesor financiero calificado. Los Álamos SpA no se encuentra regulada por la Comisión para el Mercado Financiero (CMF) de Chile."
    }'::jsonb);
