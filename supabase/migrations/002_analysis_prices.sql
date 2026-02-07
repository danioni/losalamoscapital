-- ═══════════════════════════════════════════════════════════════════════════
-- Analysis Prices — Precios actualizados semanalmente via cron
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE analysis_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticker TEXT NOT NULL,
    current_price NUMERIC(15, 4) NOT NULL,
    current_price_label TEXT NOT NULL DEFAULT '',
    market_cap_value NUMERIC(20, 0) NOT NULL DEFAULT 0,
    market_cap_label TEXT NOT NULL DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(ticker)
);

-- Index for ticker lookups
CREATE INDEX idx_analysis_prices_ticker ON analysis_prices(ticker);

-- ═══ RLS ═══
ALTER TABLE analysis_prices ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "analysis_prices_public_read" ON analysis_prices
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Service role can write (used by cron job)
-- Note: service_role bypasses RLS by default in Supabase
