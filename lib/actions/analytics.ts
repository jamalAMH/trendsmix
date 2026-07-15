"use server";

import { requireAdmin } from "./helpers";
import { formatPathLabel, formatCountryName } from "@/lib/analytics";

export interface DailyTraffic {
  date: string;
  views: number;
  visitors: number;
  sources: Array<{ source: string; views: number }>;
  countries: Array<{ country: string; label: string; views: number }>;
  pages: Array<{ path: string; label: string; views: number }>;
}

export interface AnalyticsSummary {
  todayViews: number;
  weekViews: number;
  monthViews: number;
  todayVisitors: number;
  weekVisitors: number;
  dailyViews: Array<{ date: string; views: number }>;
  dailyTraffic: DailyTraffic[];
}

export interface LiveVisitor {
  sessionId: string;
  path: string;
  label: string;
  country: string;
  countryLabel: string;
  source: string;
  lastSeen: string;
}

export interface LiveVisitorsResult {
  count: number;
  visitors: LiveVisitor[];
}

const LIVE_WINDOW_MS = 2 * 60 * 1000;

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

  const dailyDates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dailyDates.push(d.toISOString().slice(0, 10));
  }

  const dailyTraffic: DailyTraffic[] = dailyDates.map((date) => {
    const dayRows = views.filter((v) => v.created_at.slice(0, 10) === date);
    const sources = aggregateCounts(dayRows.map((v) => v.source as string))
      .slice(0, 5)
      .map((s) => ({ source: s.key, views: s.count }));
    const countries = aggregateCounts(
      dayRows.map((v) => (v.country as string) || "Unknown"),
    )
      .slice(0, 5)
      .map((c) => ({
        country: c.key,
        label: formatCountryName(c.key),
        views: c.count,
      }));
    const pages = aggregateCounts(dayRows.map((v) => v.path as string))
      .slice(0, 5)
      .map((p) => ({
        path: p.key,
        label: formatPathLabel(p.key),
        views: p.count,
      }));

    return {
      date,
      views: dayRows.length,
      visitors: countUniqueSessions(dayRows),
      sources,
      countries,
      pages,
    };
  });

  return {
    todayViews: todayRows.length,
    weekViews: weekRows.length,
    monthViews: views.length,
    todayVisitors: countUniqueSessions(todayRows),
    weekVisitors: countUniqueSessions(weekRows),
    dailyViews: dailyTraffic.map((d) => ({ date: d.date, views: d.views })),
    dailyTraffic: [...dailyTraffic].reverse(),
  };
}

export async function getLiveVisitors(): Promise<LiveVisitorsResult> {
  const { supabase } = await requireAdmin();

  const threshold = new Date(Date.now() - LIVE_WINDOW_MS).toISOString();
  const { data, error } = await supabase
    .from("active_sessions")
    .select("session_id, path, source, country, last_seen")
    .gte("last_seen", threshold)
    .order("last_seen", { ascending: false });

  if (error) throw new Error(error.message);

  const visitors = (data ?? []).map((row) => ({
    sessionId: row.session_id as string,
    path: row.path as string,
    label: formatPathLabel(row.path as string),
    country: (row.country as string) || "Unknown",
    countryLabel: formatCountryName((row.country as string) || "Unknown"),
    source: row.source as string,
    lastSeen: row.last_seen as string,
  }));

  return { count: visitors.length, visitors };
}
