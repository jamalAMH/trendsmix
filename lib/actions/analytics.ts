"use server";

import { requireAdmin } from "./helpers";
import type { AnalyticsRecord } from "@/lib/analytics";

export interface AnalyticsSummary {
  records: AnalyticsRecord[];
  minDate: string;
  maxDate: string;
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

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const { supabase } = await requireAdmin();

  const monthStart = startOfDaysAgo(30);
  const { data: rows, error } = await supabase
    .from("page_views")
    .select("path, source, country, session_id, created_at")
    .gte("created_at", monthStart)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const records: AnalyticsRecord[] = (rows ?? []).map((row) => ({
    date: (row.created_at as string).slice(0, 10),
    path: row.path as string,
    source: row.source as string,
    country: (row.country as string) || "Unknown",
    sessionId: (row.session_id as string | null) ?? null,
  }));

  const today = new Date().toISOString().slice(0, 10);
  const minDate = startOfDaysAgo(29).slice(0, 10);

  return {
    records,
    minDate,
    maxDate: today,
  };
}

export async function getLiveVisitors(): Promise<LiveVisitorsResult> {
  const { supabase } = await requireAdmin();
  const { formatPathLabel, formatCountryName } = await import("@/lib/analytics");

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
