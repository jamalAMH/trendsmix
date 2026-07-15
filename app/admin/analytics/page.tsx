"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import StatsCard from "@/components/admin/StatsCard";
import {
  aggregatePeriod,
  getDateRange,
  todayIso,
  type PeriodPreset,
  type PeriodTraffic,
} from "@/lib/analytics";
import {
  getAnalyticsSummary,
  getLiveVisitors,
  type AnalyticsSummary,
  type LiveVisitorsResult,
} from "@/lib/actions/analytics";

const PERIOD_OPTIONS: Array<{ id: PeriodPreset; label: string }> = [
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "7d", label: "7 Days" },
  { id: "15d", label: "15 Days" },
  { id: "30d", label: "30 Days" },
  { id: "custom", label: "Custom" },
];

function BarRow({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3 text-sm">
        <span className="truncate text-zinc-300">{label}</span>
        <span className="shrink-0 font-medium text-white">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-orange-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function PeriodTrafficDetail({ period }: { period: PeriodTraffic }) {
  const maxSource = period.sources[0]?.views ?? 1;
  const maxCountry = period.countries[0]?.views ?? 1;
  const maxPage = period.pages[0]?.views ?? 1;

  if (period.views === 0) {
    return (
      <p className="text-sm text-zinc-500">No traffic recorded for this period.</p>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div>
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
          Traffic Sources
        </h3>
        <div className="space-y-3">
          {period.sources.map((item) => (
            <BarRow
              key={item.source}
              label={item.source}
              value={item.views}
              max={maxSource}
            />
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
          Countries
        </h3>
        <div className="space-y-3">
          {period.countries.map((item) => (
            <BarRow
              key={item.country}
              label={item.label}
              value={item.views}
              max={maxCountry}
            />
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
          Top Pages
        </h3>
        <div className="space-y-3">
          {period.pages.map((item) => (
            <BarRow
              key={item.path}
              label={item.label}
              value={item.views}
              max={maxPage}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function timeAgo(iso: string): string {
  const sec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (sec < 10) return "just now";
  if (sec < 60) return `${sec}s ago`;
  return `${Math.floor(sec / 60)}m ago`;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [live, setLive] = useState<LiveVisitorsResult>({ count: 0, visitors: [] });
  const [preset, setPreset] = useState<PeriodPreset>("today");
  const [customStart, setCustomStart] = useState(todayIso());
  const [customEnd, setCustomEnd] = useState(todayIso());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, startTransition] = useTransition();

  const period = useMemo(() => {
    if (!data) return null;
    const range = getDateRange(preset, customStart, customEnd);
    return aggregatePeriod(data.records, range.start, range.end);
  }, [data, preset, customStart, customEnd]);

  function load() {
    setError(null);
    startTransition(async () => {
      try {
        const summary = await getAnalyticsSummary();
        setData(summary);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    });
  }

  function loadLive() {
    getLiveVisitors()
      .then(setLive)
      .catch(() => setLive({ count: 0, visitors: [] }));
  }

  useEffect(() => {
    load();
    loadLive();
    const interval = setInterval(loadLive, 10_000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-20 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/50" />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/50"
            />
          ))}
        </div>
        <div className="h-80 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/50" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
        <p className="text-sm text-red-400">{error}</p>
        <p className="mt-2 text-xs text-zinc-500">
          Run the page_views SQL migration in Supabase if this table does not exist yet.
        </p>
        <button
          type="button"
          onClick={load}
          className="mt-4 rounded-lg bg-zinc-800 px-4 py-2 text-sm text-white hover:bg-zinc-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data || !period) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-400">
          Traffic overview — where visitors come from and how many pages they view.
        </p>
        <button
          type="button"
          onClick={load}
          disabled={pending}
          className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 disabled:opacity-50"
        >
          {pending ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-5">
        <div>
          <h2 className="text-sm font-semibold text-white">Select Period</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Choose a time range — all stats update automatically
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setPreset(option.id)}
              className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                preset === option.id
                  ? "bg-orange-500 text-white"
                  : "border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {preset === "custom" && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <label className="text-xs text-zinc-500">From</label>
            <input
              type="date"
              value={customStart}
              min={data.minDate}
              max={data.maxDate}
              onChange={(e) => setCustomStart(e.target.value)}
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs text-white"
            />
            <label className="text-xs text-zinc-500">To</label>
            <input
              type="date"
              value={customEnd}
              min={data.minDate}
              max={data.maxDate}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs text-white"
            />
          </div>
        )}

        <p className="mt-4 text-sm text-orange-300">
          {period.label} — {period.views} views, {period.visitors} visitors
        </p>
      </div>

      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white">
                {live.count} Live {live.count === 1 ? "Visitor" : "Visitors"}
              </h2>
              <p className="text-xs text-zinc-500">
                Online right now — updates every 10s
              </p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            LIVE
          </span>
        </div>

        {live.visitors.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">
            No one on the site right now.
          </p>
        ) : (
          <div className="mt-4 divide-y divide-zinc-800/50 rounded-lg border border-zinc-800/50">
            {live.visitors.map((v) => (
              <div
                key={v.sessionId}
                className="flex flex-wrap items-center justify-between gap-2 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-200">
                    {v.label}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {v.countryLabel} &middot; {v.source}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-emerald-400">
                  {timeAgo(v.lastSeen)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatsCard
          label="Views"
          value={period.views}
          sub={period.label}
        />
        <StatsCard
          label="Visitors"
          value={period.visitors}
          sub="Unique sessions"
        />
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h2 className="text-sm font-semibold text-white">{period.label}</h2>
        <p className="mt-1 text-xs text-zinc-500">
          {period.start === period.end
            ? period.start
            : `${period.start} to ${period.end}`}
        </p>
        <div className="mt-5">
          <PeriodTrafficDetail period={period} />
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
        <p className="text-xs text-zinc-500">
          Tip: For advanced analytics (demographics, real-time, etc.), add your{" "}
          <strong className="text-zinc-400">Google Analytics ID</strong> in{" "}
          <a href="/admin/settings" className="text-orange-400 hover:underline">
            Settings
          </a>{" "}
          and use Google Analytics dashboard alongside this page.
        </p>
      </div>
    </div>
  );
}
