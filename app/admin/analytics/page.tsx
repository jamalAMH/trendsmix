"use client";

import { useEffect, useState, useTransition } from "react";
import StatsCard from "@/components/admin/StatsCard";
import { getAnalyticsSummary, type AnalyticsSummary } from "@/lib/actions/analytics";

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

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
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

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
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

  const maxSource = data.topSources[0]?.views ?? 1;
  const maxCountry = data.topCountries[0]?.views ?? 1;
  const maxPage = data.topPages[0]?.views ?? 1;
  const maxDaily = Math.max(...data.dailyViews.map((d) => d.views), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Views Today"
          value={data.todayViews}
          sub="Total page views"
        />
        <StatsCard
          label="Visitors Today"
          value={data.todayVisitors}
          sub="Unique sessions"
        />
        <StatsCard
          label="Views (7 days)"
          value={data.weekViews}
          sub="Last week"
        />
        <StatsCard
          label="Views (30 days)"
          value={data.monthViews}
          sub="Last month"
        />
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h2 className="mb-4 text-sm font-semibold text-white">Last 7 Days</h2>
        <div className="grid gap-3 sm:grid-cols-7">
          {data.dailyViews.map((day) => (
            <div key={day.date} className="text-center">
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
                {new Date(day.date).toLocaleDateString(undefined, {
                  weekday: "short",
                })}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">
            Traffic Sources
          </h2>
          <p className="mb-4 text-xs text-zinc-500">Mnin jay l-zouwar (Google, Facebook...)</p>
          {data.topSources.length === 0 ? (
            <p className="text-sm text-zinc-500">No traffic recorded yet.</p>
          ) : (
            <div className="space-y-4">
              {data.topSources.map((item) => (
                <BarRow
                  key={item.source}
                  label={item.source}
                  value={item.views}
                  max={maxSource}
                />
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">
            Countries
          </h2>
          <p className="mb-4 text-xs text-zinc-500">Mnin jay l-blads (Morocco, France, USA...)</p>
          {data.topCountries.length === 0 ? (
            <p className="text-sm text-zinc-500">No traffic recorded yet.</p>
          ) : (
            <div className="space-y-4">
              {data.topCountries.map((item) => (
                <BarRow
                  key={item.country}
                  label={item.label}
                  value={item.views}
                  max={maxCountry}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h2 className="mb-4 text-sm font-semibold text-white">Top Pages</h2>
        <p className="mb-4 text-xs text-zinc-500">Chno kaytchouf bzaf</p>
        {data.topPages.length === 0 ? (
          <p className="text-sm text-zinc-500">No traffic recorded yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {data.topPages.map((item) => (
              <BarRow
                key={item.path}
                label={item.label}
                value={item.views}
                max={maxPage}
              />
            ))}
          </div>
        )}
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
