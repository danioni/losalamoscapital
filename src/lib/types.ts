// ═══ Database Types for Los Álamos Capital ═══

export interface PortfolioSnapshot {
  id: string;
  date: string;
  total_value_usd: number;
  nav_per_share: number;
  benchmark_value: number;
  notes: string | null;
  created_at: string;
}

export interface Position {
  id: string;
  ticker: string;
  name: string;
  asset_class: AssetClass;
  geography: Geography;
  quantity: number;
  avg_cost_usd: number;
  current_price_usd: number;
  market_value_usd: number;
  weight_pct: number;
  unrealized_pnl_usd: number;
  unrealized_pnl_pct: number;
  last_updated: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  date: string;
  ticker: string;
  type: TransactionType;
  quantity: number;
  price_usd: number;
  total_usd: number;
  commission_usd: number;
  notes: string | null;
  created_at: string;
}

export interface Decision {
  id: string;
  date: string;
  title: string;
  description: string;
  type: DecisionType;
  is_public: boolean;
  created_at: string;
}

export interface FundMetrics {
  id: string;
  date: string;
  total_return_pct: number;
  cagr_pct: number;
  alpha_vs_sp500_pct: number;
  max_drawdown_pct: number;
  sharpe_ratio: number | null;
  inception_date: string;
  aum_usd: number;
  created_at: string;
}

export interface SiteConfig {
  id: string;
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
}

// ═══ Enums ═══

export type AssetClass =
  | "acciones_usa"
  | "crypto"
  | "etf"
  | "efectivo"
  | "renta_fija"
  | "otro";

export type Geography = "usa" | "global" | "chile" | "europa" | "asia";

export type TransactionType =
  | "buy"
  | "sell"
  | "dividend"
  | "deposit"
  | "withdrawal";

export type DecisionType = "buy" | "sell" | "rebalance" | "hold";

// ═══ API Response Types ═══

export interface FundData {
  metrics: FundMetrics | null;
  snapshots: PortfolioSnapshot[];
  positions: Position[];
  decisions: Decision[];
  lastUpdated: string;
}

// ═══ Allocation Types ═══

export interface AllocationItem {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface AllocationData {
  byAssetClass: AllocationItem[];
  byGeography: AllocationItem[];
}

// ═══ Chart Types ═══

export interface ChartDataPoint {
  date: string;
  label: string;
  fund: number;
  benchmark: number;
}

// ═══ Helper Maps ═══

export const assetClassLabels: Record<AssetClass, string> = {
  acciones_usa: "Acciones USA",
  crypto: "Crypto",
  etf: "ETFs",
  efectivo: "Efectivo",
  renta_fija: "Renta Fija",
  otro: "Otro",
};

export const geographyLabels: Record<Geography, string> = {
  usa: "Estados Unidos",
  global: "Global",
  chile: "Chile",
  europa: "Europa",
  asia: "Asia",
};

export const transactionTypeLabels: Record<TransactionType, string> = {
  buy: "Compra",
  sell: "Venta",
  dividend: "Dividendo",
  deposit: "Depósito",
  withdrawal: "Retiro",
};

export const decisionTypeLabels: Record<DecisionType, string> = {
  buy: "Compra",
  sell: "Venta",
  rebalance: "Rebalanceo",
  hold: "Hold",
};

// ═══ Color Maps ═══

export const assetClassColors: Record<AssetClass, string> = {
  acciones_usa: "#52b788",
  crypto: "#40916c",
  etf: "#2d6a4f",
  efectivo: "#d4a373",
  renta_fija: "#95d5b2",
  otro: "#5a6e63",
};

export const geographyColors: Record<Geography, string> = {
  usa: "#52b788",
  global: "#40916c",
  chile: "#d4a373",
  europa: "#2d6a4f",
  asia: "#95d5b2",
};
