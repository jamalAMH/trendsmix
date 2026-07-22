"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import StatsCard from "@/components/admin/StatsCard";
import {
  bulkClearFeatured,
  bulkDeleteDrafts,
  bulkPublishDrafts,
  bulkUnpublishAll,
  revalidateSite,
  updateControlSettings,
} from "@/lib/actions/control";
import { fixBrokenPostImages } from "@/lib/actions/images";
import { isValidGa4Id } from "@/lib/google-analytics";
import type { Setting } from "@/types/database";

interface ControlStats {
  totalPosts: number;
  published: number;
  drafts: number;
  featured: number;
  categories: number;
  pages: number;
  media: number;
  users: number;
}

interface SystemStatus {
  supabaseConfigured: boolean;
  siteUrl: string;
  n8nEnvConfigured: boolean;
  imageStorageConfigured: boolean;
  visitorIp: string;
  visitorCountry: string;
}

interface ControlCenterProps {
  systemStatus: SystemStatus;
  isAdmin: boolean;
}

const QUICK_LINKS = [
  { href: "/admin/posts/new", label: "New Post", desc: "Create a story" },
  { href: "/admin/posts", label: "Posts", desc: "Manage all stories" },
  { href: "/admin/categories", label: "Categories", desc: "Edit genres" },
  { href: "/admin/pages", label: "Pages", desc: "Legal & static pages" },
  { href: "/admin/media", label: "Media", desc: "Upload images" },
  { href: "/admin/settings", label: "Settings", desc: "Site branding & SEO" },
  { href: "/admin/users", label: "Users", desc: "Roles & access" },
  { href: "/", label: "View Site", desc: "Open public site" },
] as const;

const EXTERNAL_LINKS = [
  { href: "/sitemap.xml", label: "Sitemap" },
  { href: "/feed.xml", label: "RSS Feed" },
  { href: "/robots.txt", label: "Robots.txt" },
] as const;

function Toggle({
  id,
  name,
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: {
  id: string;
  name: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
      <div>
        <label htmlFor={id} className="text-sm font-medium text-white">
          {label}
        </label>
        <p className="mt-1 text-xs text-zinc-500">{description}</p>
      </div>
      <div className="flex shrink-0 items-center">
        <input type="hidden" name={name} value={checked ? "true" : "false"} />
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => onChange(!checked)}
          className={`relative h-6 w-11 rounded-full transition-colors disabled:opacity-50 ${
            checked ? "bg-orange-500" : "bg-zinc-700"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
              checked ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

export default function ControlCenter({
  systemStatus,
  isAdmin,
}: ControlCenterProps) {
  const [stats, setStats] = useState<ControlStats>({
    totalPosts: 0,
    published: 0,
    drafts: 0,
    featured: 0,
    categories: 0,
    pages: 0,
    media: 0,
    users: 0,
  });
  const [settings, setSettings] = useState({
    maintenance_mode: false,
    geo_block_africa: true,
    geo_allowed_ips: "",
    n8n_enabled: true,
    n8n_api_key: "",
    analytics_id: "",
  });
  const [loading, setLoading] = useState(true);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const [postsRes, catsRes, pagesRes, mediaRes, usersRes, settingsRes] =
        await Promise.all([
          supabase.from("posts").select("status, featured"),
          supabase.from("categories").select("id"),
          supabase.from("pages").select("id"),
          supabase.from("media").select("id"),
          supabase.from("profiles").select("id"),
          supabase.from("settings").select("*"),
        ]);

      const posts = postsRes.data ?? [];
      setStats({
        totalPosts: posts.length,
        published: posts.filter((p) => p.status === "published").length,
        drafts: posts.filter((p) => p.status === "draft").length,
        featured: posts.filter((p) => p.featured).length,
        categories: catsRes.data?.length ?? 0,
        pages: pagesRes.data?.length ?? 0,
        media: mediaRes.data?.length ?? 0,
        users: usersRes.data?.length ?? 0,
      });

      const map: Record<string, string> = {};
      (settingsRes.data as Setting[] | null)?.forEach((s) => {
        map[s.key] = s.value;
      });

      setSettings({
        maintenance_mode: map.maintenance_mode === "true",
        geo_block_africa: map.geo_block_africa !== "false",
        geo_allowed_ips: map.geo_allowed_ips ?? "",
        n8n_enabled: map.n8n_enabled !== "false",
        n8n_api_key: map.n8n_api_key ?? "",
        analytics_id: map.analytics_id ?? "",
      });
      setLoading(false);
    }

    load();
  }, []);

  function showMessage(text: string) {
    setError(null);
    setMessage(text);
    setTimeout(() => setMessage(null), 3000);
  }

  function showError(text: string) {
    setMessage(null);
    setError(text);
  }

  function handleSaveSettings(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isAdmin) {
      showError("Admin role required. Ask an admin to upgrade your account.");
      return;
    }

    setSaved(false);
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateControlSettings(formData);
      if (!result.ok) {
        showError(result.error);
        return;
      }
      setSaved(true);
      showMessage("Control settings saved.");
      setTimeout(() => setSaved(false), 2000);
    });
  }

  function runAction(
    label: string,
    action: () => Promise<{ ok: true } | { ok: false; error: string }>,
    confirmText?: string,
  ) {
    if (!isAdmin) {
      showError("Admin role required. Ask an admin to upgrade your account.");
      return;
    }
    if (confirmText && !confirm(confirmText)) return;

    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        showError(result.error);
        return;
      }

      showMessage(label);

      const supabase = createClient();
      const { data: posts } = await supabase
        .from("posts")
        .select("status, featured");
      const list = posts ?? [];
      setStats((prev) => ({
        ...prev,
        totalPosts: list.length,
        published: list.filter((p) => p.status === "published").length,
        drafts: list.filter((p) => p.status === "draft").length,
        featured: list.filter((p) => p.featured).length,
      }));
    });
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/50"
            />
          ))}
        </div>
        <div className="h-96 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/50" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {!isAdmin && (
        <div className="rounded-lg bg-amber-500/10 px-4 py-3 text-sm text-amber-300 ring-1 ring-amber-500/20">
          Your account is <strong>editor</strong>, not <strong>admin</strong>.
          Control Center actions are read-only until an admin upgrades your role
          in Supabase or Users.
        </div>
      )}

      {message && (
        <div className="rounded-lg bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400 ring-1 ring-emerald-500/20">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400 ring-1 ring-red-500/20">
          {error}
        </div>
      )}

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Overview
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard label="Total Posts" value={stats.totalPosts} />
          <StatsCard label="Published" value={stats.published} sub="Live on site" />
          <StatsCard label="Drafts" value={stats.drafts} sub="Unpublished" />
          <StatsCard label="Featured" value={stats.featured} sub="Homepage picks" />
          <StatsCard label="Categories" value={stats.categories} />
          <StatsCard label="Pages" value={stats.pages} />
          <StatsCard label="Media Files" value={stats.media} />
          <StatsCard label="Users" value={stats.users} />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Quick Access
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition-colors hover:border-orange-500/30 hover:bg-zinc-900"
            >
              <p className="text-sm font-semibold text-white group-hover:text-orange-400">
                {link.label}
              </p>
              <p className="mt-1 text-xs text-zinc-500">{link.desc}</p>
            </Link>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {EXTERNAL_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-zinc-700 hover:text-white"
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={handleSaveSettings} className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Site Controls
          </h2>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-4">
            {saved && (
              <div className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
                Settings saved.
              </div>
            )}

            <Toggle
              id="maintenance_mode"
              name="maintenance_mode"
              label="Maintenance Mode"
              description="Hide the public site from visitors. Admin stays accessible."
              checked={settings.maintenance_mode}
              disabled={!isAdmin}
              onChange={(checked) =>
                setSettings((s) => ({ ...s, maintenance_mode: checked }))
              }
            />

            <Toggle
              id="geo_block_africa"
              name="geo_block_africa"
              label="Block Africa (geo)"
              description="Block all African countries including Morocco. Only whitelisted IPs can access."
              checked={settings.geo_block_africa}
              disabled={!isAdmin}
              onChange={(checked) =>
                setSettings((s) => ({ ...s, geo_block_africa: checked }))
              }
            />

            <div>
              <label
                htmlFor="geo_allowed_ips"
                className="block text-xs font-medium text-zinc-400"
              >
                Allowed IPs (Morocco bypass)
              </label>
              <input
                id="geo_allowed_ips"
                name="geo_allowed_ips"
                type="text"
                value={settings.geo_allowed_ips}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, geo_allowed_ips: e.target.value }))
                }
                disabled={!isAdmin}
                placeholder="e.g. 41.143.12.34"
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-600 disabled:opacity-50"
              />
              <p className="mt-1 text-xs text-zinc-500">
                Your IP now:{" "}
                <strong className="text-zinc-300">
                  {systemStatus.visitorIp || "Unknown"}
                </strong>
                {systemStatus.visitorCountry
                  ? ` (${systemStatus.visitorCountry})`
                  : ""}
                . Add it here so you can access from Morocco.
              </p>
            </div>

            <Toggle
              id="n8n_enabled"
              name="n8n_enabled"
              label="n8n Auto-Publish"
              description="Allow automated posts via /api/posts from n8n."
              checked={settings.n8n_enabled}
              disabled={!isAdmin}
              onChange={(checked) =>
                setSettings((s) => ({ ...s, n8n_enabled: checked }))
              }
            />

            <div>
              <label
                htmlFor="n8n_api_key"
                className="block text-xs font-medium text-zinc-400"
              >
                n8n API Key (Supabase)
              </label>
              <input
                id="n8n_api_key"
                name="n8n_api_key"
                type="password"
                value={settings.n8n_api_key}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, n8n_api_key: e.target.value }))
                }
                disabled={!isAdmin}
                placeholder="Must match N8N_API_KEY in .env.local"
                className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-orange-500"
              />
              <p className="mt-1 text-xs text-zinc-600">
                Also set N8N_API_KEY in your server environment (.env.local /
                Vercel).
              </p>
            </div>

            <button
              type="submit"
              disabled={pending || !isAdmin}
              className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-400 disabled:opacity-50"
            >
              {pending ? "Saving…" : "Save Controls"}
            </button>
          </div>
        </form>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Bulk Actions
          </h2>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-3">
            <button
              type="button"
              disabled={pending || !isAdmin}
              onClick={() =>
                runAction(
                  "Broken images replaced with hosted photos.",
                  fixBrokenPostImages,
                  "Replace all broken Facebook image links with permanent hosted images? This may take a few minutes.",
                )
              }
              className="w-full rounded-lg border border-orange-500/20 bg-orange-500/10 px-4 py-2.5 text-left text-sm text-orange-400 transition-colors hover:bg-orange-500/20 disabled:opacity-40"
            >
              Fix broken post images
            </button>

            <button
              type="button"
              disabled={pending || !isAdmin || stats.drafts === 0}
              onClick={() =>
                runAction(
                  "All drafts published.",
                  bulkPublishDrafts,
                  `Publish all ${stats.drafts} draft(s)?`,
                )
              }
              className="w-full rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-left text-sm text-emerald-400 transition-colors hover:bg-emerald-500/20 disabled:opacity-40"
            >
              Publish all drafts ({stats.drafts})
            </button>

            <button
              type="button"
              disabled={pending || !isAdmin || stats.published === 0}
              onClick={() =>
                runAction(
                  "All posts unpublished.",
                  bulkUnpublishAll,
                  `Unpublish all ${stats.published} post(s)? They will become drafts.`,
                )
              }
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-left text-sm text-zinc-300 transition-colors hover:bg-zinc-800 disabled:opacity-40"
            >
              Unpublish all posts ({stats.published})
            </button>

            <button
              type="button"
              disabled={pending || !isAdmin || stats.featured === 0}
              onClick={() =>
                runAction(
                  "Featured flags cleared.",
                  bulkClearFeatured,
                  `Remove featured status from ${stats.featured} post(s)?`,
                )
              }
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-left text-sm text-zinc-300 transition-colors hover:bg-zinc-800 disabled:opacity-40"
            >
              Clear all featured ({stats.featured})
            </button>

            <button
              type="button"
              disabled={pending || !isAdmin}
              onClick={() => runAction("Site cache refreshed.", revalidateSite)}
              className="w-full rounded-lg border border-orange-500/20 bg-orange-500/10 px-4 py-2.5 text-left text-sm text-orange-400 transition-colors hover:bg-orange-500/20 disabled:opacity-40"
            >
              Refresh site cache
            </button>
          </div>

          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
            <h3 className="text-sm font-semibold text-red-400">Danger Zone</h3>
            <p className="mt-1 text-xs text-zinc-500">
              Destructive actions cannot be undone.
            </p>
            <button
              type="button"
              disabled={pending || !isAdmin || stats.drafts === 0}
              onClick={() =>
                runAction(
                  "All drafts deleted.",
                  bulkDeleteDrafts,
                  `Permanently delete all ${stats.drafts} draft(s)? This cannot be undone.`,
                )
              }
              className="mt-3 w-full rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-40"
            >
              Delete all drafts ({stats.drafts})
            </button>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">
          System Status
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <StatusItem
            label="Supabase"
            ok={systemStatus.supabaseConfigured}
            detail="Database connection"
          />
          <StatusItem
            label="Site URL"
            ok={!!systemStatus.siteUrl}
            detail={systemStatus.siteUrl || "Not set (uses default)"}
          />
          <StatusItem
            label="Maintenance"
            ok={!settings.maintenance_mode}
            detail={
              settings.maintenance_mode ? "Site is in maintenance" : "Site is live"
            }
          />
          <StatusItem
            label="Geo Block (Africa)"
            ok={!settings.geo_block_africa}
            detail={
              settings.geo_block_africa
                ? "Africa blocked — whitelist your IP"
                : "Africa access allowed"
            }
          />
          <StatusItem
            label="Image Storage (Supabase)"
            ok={systemStatus.imageStorageConfigured}
            detail={
              systemStatus.imageStorageConfigured
                ? "External images saved permanently"
                : "Deploy mirror-image function on Supabase"
            }
          />
          <StatusItem
            label="Google Analytics (GA4)"
            ok={isValidGa4Id(settings.analytics_id)}
            detail={
              settings.analytics_id
                ? settings.analytics_id
                : "Add G- ID in Settings"
            }
          />
          <StatusItem
            label="n8n Integration"
            ok={settings.n8n_enabled}
            detail={
              settings.n8n_enabled ? "Auto-publish enabled" : "Auto-publish disabled"
            }
          />
          <StatusItem
            label="n8n API Key (DB)"
            ok={settings.n8n_api_key.length > 0}
            detail={
              settings.n8n_api_key ? "Key configured in Supabase" : "Not set in DB"
            }
          />
          <StatusItem
            label="n8n API Key (Server)"
            ok={systemStatus.n8nEnvConfigured}
            detail={
              systemStatus.n8nEnvConfigured
                ? "Configured in environment"
                : "Not set in .env.local / Vercel"
            }
          />
        </div>
      </section>
    </div>
  );
}

function StatusItem({
  label,
  ok,
  detail,
}: {
  label: string;
  ok: boolean;
  detail: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <span
        className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${
          ok ? "bg-emerald-400" : "bg-amber-400"
        }`}
        aria-hidden
      />
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-zinc-500">{detail}</p>
      </div>
    </div>
  );
}
