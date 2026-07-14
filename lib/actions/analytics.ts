"use server";

import { requireAdmin } from "./helpers";
import { formatPathLabel, formatCountryName } from "@/lib/analytics";

export interface AnalyticsSummary {
  todayViews: number;
  weekViews: number;
  monthViews: number;
  todayVisitors: number;
  weekVisitors: number;
  topSources: Array<{ source: string; views: number }>;
  topCountries: Array<{ country: string; label: string; views: number }>;
  topPages: Array<{ path: string; label: string; views: number }>;
  dailyViews: Array<{ date: string; views: number }>;
}

function startOfDaysAgo(days: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function countUniqueSessions(
  rows: Array<{ session_id: string | null }>,
): number {
  const ids = new Set(
    rows.map((r) => r.session_id).filter((id): id is string => !!id),
  );
  return ids.size;
}

function aggregateCounts<T extends string>(
  items: T[],
): Array<{ key: T; count: number }> {
  const map = new Map<T, number>();
  for (const item of items) {
    map.set(item, (map.get(item) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const { supabase } = await requireAdmin();

  const monthStart = startOfDaysAgo(30);
  const { data: rows, error } = await supabase
    .from("page_views")
    .select("path, source, country, session_id, created_at")
    .gte("created_at", monthStart)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const views = rows ?? [];
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const weekStart = new Date(startOfDaysAgo(7));

  const todayRows = views.filter(
    (v) => new Date(v.created_at) >= todayStart,
  );
  const weekRows = views.filter((v) => new Date(v.created_at) >= weekStart);

  const sourceAgg = aggregateCounts(views.map((v) => v.source as string));
  const countryAgg = aggregateCounts(
    views.map((v) => (v.country as string) || "Unknown"),
  );
  const pageAgg = aggregateCounts(views.map((v) => v.path as string));

  const dailyMap = new Map<string, number>();
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dailyMap.set(d.toISOString().slice(0, 10), 0);
  }
  for (const v of views) {
    const day = v.created_at.slice(0, 10);
    if (dailyMap.has(day)) {
      dailyMap.set(day, (dailyMap.get(day) ?? 0) + 1);
    }
  }

  return {
    todayViews: todayRows.length,
    weekViews: weekRows.length,
    monthViews: views.length,
    todayVisitors: countUniqueSessions(todayRows),
    weekVisitors: countUniqueSessions(weekRows),
    topSources: sourceAgg.slice(0, 8).map((s) => ({
      source: s.key,
      views: s.count,
    })),
    topCountries: countryAgg.slice(0, 8).map((c) => ({
      country: c.key,
      label: formatCountryName(c.key),
      views: c.count,
    })),
    topPages: pageAgg.slice(0, 8).map((p) => ({
      path: p.key,
      label: formatPathLabel(p.key),
      views: p.count,
    })),
    dailyViews: [...dailyMap.entries()].map(([date, views]) => ({ date, views })),
  };
}
