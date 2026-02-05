import {
  Position,
  PortfolioSnapshot,
  AllocationData,
  AllocationItem,
  ChartDataPoint,
  assetClassLabels,
  geographyLabels,
  assetClassColors,
  geographyColors,
  AssetClass,
  Geography,
} from "./types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Calculate allocation data from positions
export function calculateAllocations(positions: Position[]): AllocationData {
  const totalValue = positions.reduce((sum, p) => sum + p.market_value_usd, 0);

  // Group by asset class
  const byAssetClassMap = new Map<AssetClass, number>();
  positions.forEach((p) => {
    const current = byAssetClassMap.get(p.asset_class) || 0;
    byAssetClassMap.set(p.asset_class, current + p.market_value_usd);
  });

  const byAssetClass: AllocationItem[] = Array.from(byAssetClassMap.entries())
    .map(([assetClass, value]) => ({
      name: assetClassLabels[assetClass],
      value,
      percentage: totalValue > 0 ? (value / totalValue) * 100 : 0,
      color: assetClassColors[assetClass],
    }))
    .sort((a, b) => b.percentage - a.percentage);

  // Group by geography
  const byGeographyMap = new Map<Geography, number>();
  positions.forEach((p) => {
    const current = byGeographyMap.get(p.geography) || 0;
    byGeographyMap.set(p.geography, current + p.market_value_usd);
  });

  const byGeography: AllocationItem[] = Array.from(byGeographyMap.entries())
    .map(([geography, value]) => ({
      name: geographyLabels[geography],
      value,
      percentage: totalValue > 0 ? (value / totalValue) * 100 : 0,
      color: geographyColors[geography],
    }))
    .sort((a, b) => b.percentage - a.percentage);

  return { byAssetClass, byGeography };
}

// Transform snapshots to chart data
export function snapshotsToChartData(
  snapshots: PortfolioSnapshot[]
): ChartDataPoint[] {
  return snapshots
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((snapshot) => ({
      date: snapshot.date,
      label: format(new Date(snapshot.date), "MMM yyyy", { locale: es }),
      fund: snapshot.nav_per_share,
      benchmark: snapshot.benchmark_value,
    }));
}

// Calculate CAGR (Compound Annual Growth Rate)
export function calculateCAGR(
  startValue: number,
  endValue: number,
  years: number
): number {
  if (startValue <= 0 || years <= 0) return 0;
  return (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
}

// Calculate total return percentage
export function calculateTotalReturn(
  startValue: number,
  endValue: number
): number {
  if (startValue <= 0) return 0;
  return ((endValue - startValue) / startValue) * 100;
}

// Calculate max drawdown from a series of values
export function calculateMaxDrawdown(values: number[]): number {
  if (values.length < 2) return 0;

  let maxDrawdown = 0;
  let peak = values[0];

  for (const value of values) {
    if (value > peak) {
      peak = value;
    }
    const drawdown = ((peak - value) / peak) * 100;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }

  return maxDrawdown;
}

// Calculate years between two dates
export function yearsBetween(startDate: Date, endDate: Date): number {
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays / 365.25;
}
