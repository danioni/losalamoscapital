import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();

  // Fetch all data in parallel
  const [metricsResult, snapshotsResult, positionsResult, decisionsResult] =
    await Promise.all([
      supabase
        .from("fund_metrics")
        .select("*")
        .order("date", { ascending: false })
        .limit(1),
      supabase
        .from("portfolio_snapshots")
        .select("*")
        .order("date", { ascending: true }),
      supabase
        .from("positions")
        .select("*")
        .order("weight_pct", { ascending: false }),
      supabase
        .from("decisions")
        .select("*")
        .eq("is_public", true)
        .order("date", { ascending: false })
        .limit(10),
    ]);

  const metrics = metricsResult.data?.[0] || null;
  const snapshots = snapshotsResult.data || [];
  const positions = positionsResult.data || [];
  const decisions = decisionsResult.data || [];

  // Calculate allocation by asset class
  type Position = {
    asset_class: string;
    geography: string;
    weight_pct: number;
    market_value_usd: number;
  };
  type AssetClassAllocation = { asset_class: string; weight_pct: number; market_value_usd: number };
  type GeoAllocation = { geography: string; weight_pct: number; market_value_usd: number };

  const allocationByClass = (positions as Position[]).reduce<AssetClassAllocation[]>(
    (acc, pos) => {
      const existing = acc.find((a) => a.asset_class === pos.asset_class);
      if (existing) {
        existing.weight_pct += pos.weight_pct || 0;
        existing.market_value_usd += pos.market_value_usd || 0;
      } else {
        acc.push({
          asset_class: pos.asset_class,
          weight_pct: pos.weight_pct || 0,
          market_value_usd: pos.market_value_usd || 0,
        });
      }
      return acc;
    },
    []
  );

  // Calculate allocation by geography
  const allocationByGeo = (positions as Position[]).reduce<GeoAllocation[]>(
    (acc, pos) => {
      const existing = acc.find((a) => a.geography === pos.geography);
      if (existing) {
        existing.weight_pct += pos.weight_pct || 0;
        existing.market_value_usd += pos.market_value_usd || 0;
      } else {
        acc.push({
          geography: pos.geography,
          weight_pct: pos.weight_pct || 0,
          market_value_usd: pos.market_value_usd || 0,
        });
      }
      return acc;
    },
    []
  );

  return NextResponse.json({
    metrics,
    snapshots,
    positions,
    decisions,
    allocation: {
      byClass: allocationByClass,
      byGeography: allocationByGeo,
    },
    lastUpdated: new Date().toISOString(),
  });
}
