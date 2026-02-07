-- ═══════════════════════════════════════════════════════════════════════════
-- Add fundamental data columns to analysis_prices for forward projections
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE analysis_prices
    ADD COLUMN IF NOT EXISTS trailing_pe NUMERIC(10, 2),
    ADD COLUMN IF NOT EXISTS forward_pe NUMERIC(10, 2),
    ADD COLUMN IF NOT EXISTS dividend_yield NUMERIC(6, 4),
    ADD COLUMN IF NOT EXISTS revenue_growth NUMERIC(8, 4),
    ADD COLUMN IF NOT EXISTS eps_growth NUMERIC(8, 4),
    ADD COLUMN IF NOT EXISTS fifty_two_week_high NUMERIC(15, 4),
    ADD COLUMN IF NOT EXISTS fifty_two_week_low NUMERIC(15, 4);
