import {
  Header,
  Hero,
  StatsGrid,
  PerformanceChart,
  PortfolioAllocation,
  DecisionsLog,
  Methodology,
  Disclaimer,
  Footer,
} from "@/components/public";
import { createClient } from "@/lib/supabase/server";
import { calculateAllocations, snapshotsToChartData } from "@/lib/calculations";
import {
  FundMetrics,
  PortfolioSnapshot,
  Position,
  Decision,
  AllocationData,
  ChartDataPoint,
} from "@/lib/types";

// Force dynamic rendering because we use cookies for Supabase
export const dynamic = "force-dynamic";

// Mock data for when database is empty
const mockMetrics: FundMetrics = {
  id: "mock",
  date: new Date().toISOString().split("T")[0],
  total_return_pct: 0,
  cagr_pct: 0,
  alpha_vs_sp500_pct: 0,
  max_drawdown_pct: 0,
  sharpe_ratio: null,
  inception_date: new Date().toISOString().split("T")[0],
  aum_usd: 0,
  created_at: new Date().toISOString(),
};

const mockChartData: ChartDataPoint[] = [
  { date: "2024-01", label: "Inicio", fund: 1000, benchmark: 1000 },
  { date: "2024-02", label: "Mes 1", fund: 1000, benchmark: 1000 },
  { date: "2024-03", label: "Mes 2", fund: 1000, benchmark: 1000 },
  { date: "2024-04", label: "Mes 3", fund: 1000, benchmark: 1000 },
  { date: "2024-05", label: "Mes 4", fund: 1000, benchmark: 1000 },
  { date: "2024-06", label: "Mes 5", fund: 1000, benchmark: 1000 },
];

const mockAllocation: AllocationData = {
  byAssetClass: [
    { name: "Acciones USA", value: 45000, percentage: 45, color: "#52b788" },
    { name: "Crypto", value: 25000, percentage: 25, color: "#40916c" },
    { name: "ETFs", value: 15000, percentage: 15, color: "#2d6a4f" },
    { name: "Efectivo", value: 15000, percentage: 15, color: "#d4a373" },
  ],
  byGeography: [
    { name: "Estados Unidos", value: 60000, percentage: 60, color: "#52b788" },
    { name: "Global", value: 25000, percentage: 25, color: "#40916c" },
    { name: "Chile", value: 15000, percentage: 15, color: "#d4a373" },
  ],
};

async function getFundData() {
  try {
    const supabase = await createClient();

    // Fetch all data in parallel
    const [metricsRes, snapshotsRes, positionsRes, decisionsRes] =
      await Promise.all([
        supabase
          .from("fund_metrics")
          .select("*")
          .order("date", { ascending: false })
          .limit(1)
          .single(),
        supabase
          .from("portfolio_snapshots")
          .select("*")
          .order("date", { ascending: true }),
        supabase.from("positions").select("*").order("weight_pct", { ascending: false }),
        supabase
          .from("decisions")
          .select("*")
          .eq("is_public", true)
          .order("date", { ascending: false })
          .limit(10),
      ]);

    const metrics = metricsRes.data as FundMetrics | null;
    const snapshots = (snapshotsRes.data || []) as PortfolioSnapshot[];
    const positions = (positionsRes.data || []) as Position[];
    const decisions = (decisionsRes.data || []) as Decision[];

    // Calculate derived data
    const chartData =
      snapshots.length > 0 ? snapshotsToChartData(snapshots) : mockChartData;
    const allocation =
      positions.length > 0 ? calculateAllocations(positions) : mockAllocation;

    // Get last updated date
    const lastUpdated =
      snapshots.length > 0
        ? snapshots[snapshots.length - 1].date
        : new Date().toISOString().split("T")[0];

    return {
      metrics: metrics || mockMetrics,
      chartData,
      allocation,
      decisions,
      lastUpdated,
    };
  } catch (error) {
    console.error("Error fetching fund data:", error);
    // Return mock data if database is not available
    return {
      metrics: mockMetrics,
      chartData: mockChartData,
      allocation: mockAllocation,
      decisions: [],
      lastUpdated: new Date().toISOString().split("T")[0],
    };
  }
}

export default async function Home() {
  const { metrics, chartData, allocation, decisions, lastUpdated } =
    await getFundData();

  return (
    <>
      <Header />
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 2rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Hero />
        <StatsGrid metrics={metrics} />
        <PerformanceChart data={chartData} lastUpdated={lastUpdated} />
        <PortfolioAllocation data={allocation} />
        <DecisionsLog decisions={decisions} />
        <Methodology />
        <Disclaimer />
      </div>
      <Footer lastUpdated={lastUpdated} />
    </>
  );
}
