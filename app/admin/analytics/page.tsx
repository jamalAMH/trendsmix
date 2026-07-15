"use client";

import { useEffect, useState, useTransition } from "react";
import StatsCard from "@/components/admin/StatsCard";
import {
  getAnalyticsSummary,
  getLiveVisitors,
  type AnalyticsSummary,
  type DailyTraffic,
  type LiveVisitorsResult,
} from "@/lib/actions/analytics";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

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

function formatDayLabel(date: string): string {
  const d = new Date(date + "T12:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = new Date(d);
  day.setHours(0, 0, 0, 0);
  const diff = Math.round((today.getTime() - day.getTime()) / 86400000);

  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";

  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function DayTrafficDetail({ day }: { day: DailyTraffic }) {
  const maxSource = day.sources[0]?.views ?? 1;
  const maxCountry = day.countries[0]?.views ?? 1;
  const maxPage = day.pages[0]?.views ?? 1;

  if (day.views === 0) {
    return (
      <p className="text-sm text-zinc-500">No traffic recorded for this day.</p>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div>
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
          Mnin jay trafik
        </h3>
        <div className="space-y-3">
          {day.sources.map((item) => (
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
          Blads
        </h3>
        <div className="space-y-3">
          {day.countries.map((item) => (
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
          {day.pages.map((item) => (
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
  const [selectedDate, setSelectedDate] = useState(todayIso());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, startTransition] = useTransition();

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
        <div className="h-14 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/50" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
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

  if (!data) return null;

  const selectedDay =
    data.dailyTraffic.find((d) => d.date === selectedDate) ?? {
      date: selectedDate,
      views: 0,
      visitors: 0,
      sources: [],
      countries: [],
      pages: [],
    };

  const minDate = data.dailyTraffic.at(-1)?.date ?? selectedDate;
  const maxDate = data.dailyTraffic[0]?.date ?? selectedDate;
  const maxDaily = Math.max(...data.dailyViews.map((d) => d.views), 1);

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
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Choisir nhar</h2>
            <p className="mt-1 text-xs text-zinc-500">
              Khayar nhar bach tchouf analytics dyalo
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedDate(todayIso())}
              className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                selectedDate === todayIso()
                  ? "bg-orange-500 text-white"
                  : "border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => {
                const d = new Date();
                d.setDate(d.getDate() - 1);
                setSelectedDate(d.toISOString().slice(0, 10));
              }}
              className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
            >
              Yesterday
            </button>
            <input
              type="date"
              value={selectedDate}
              min={minDate}
              max={maxDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs text-white"
            />
          </div>
        </div>
        <p className="mt-3 text-sm text-orange-300">
          {formatDayLabel(selectedDate)} — {selectedDay.views} views,{" "}
          {selectedDay.visitors} visitors
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
                Nas li online daba — updated every 10s
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Views"
          value={selectedDay.views}
          sub={formatDayLabel(selectedDate)}
        />
        <StatsCard
          label="Visitors"
          value={selectedDay.visitors}
          sub="Unique sessions"
        />
        <StatsCard
          label="Views (7 days)"
          value={data.weekViews}
          sub="Last week total"
        />
        <StatsCard
          label="Views (30 days)"
          value={data.monthViews}
          sub="Last month total"
        />
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h2 className="mb-1 text-sm font-semibold text-white">Last 7 Days</h2>
        <p className="mb-4 text-xs text-zinc-500">Click a day to view its analytics</p>
        <div className="grid gap-3 sm:grid-cols-7">
          {data.dailyViews.map((day) => (
            <button
              key={day.date}
              type="button"
              onClick={() => setSelectedDate(day.date)}
              className={`rounded-lg p-2 text-center transition-colors ${
                selectedDate === day.date
                  ? "bg-orange-500/10 ring-1 ring-orange-500/40"
                  : "hover:bg-zinc-800/50"
              }`}
            >
              <div className="mx-auto flex h-24 w-full max-w-[48px] items-end justify-center rounded-lg bg-zinc-950/50 px-1">
                <div
                  className="w-full rounded-t bg-orange-500/80"
                  style={{
                    height: `${Math.max(8, Math.round((day.views / maxDaily) * 100))}%`,
                  }}
                />
              </div>
              <p className="mt-2 text-xs font-medium text-white">{day.views}</p>
              <p className="text-[10px] text-zinc-500">
                {new Date(day.date + "T12:00:00").toLocaleDateString(undefined, {
                  weekday: "short",
                })}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h2 className="text-sm font-semibold text-white">
          {formatDayLabel(selectedDate)}
        </h2>
        <p className="mt-1 text-xs text-zinc-500">{selectedDate}</p>
        <div className="mt-5">
          <DayTrafficDetail day={selectedDay} />
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
