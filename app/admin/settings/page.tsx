"use client";

import { useEffect, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateSettings } from "@/lib/actions/settings";
import type { Setting } from "@/types/database";

const FIELDS: Array<{ key: string; label: string; type?: string; group: string }> = [
  { key: "site_name", label: "Site Name", group: "General" },
  { key: "site_description", label: "Site Description", group: "General" },
  { key: "contact_email", label: "Contact Email", type: "email", group: "General" },
  { key: "logo_url", label: "Logo URL", type: "url", group: "General" },
  { key: "favicon_url", label: "Favicon URL", type: "url", group: "General" },
  { key: "twitter_url", label: "Twitter / X URL", type: "url", group: "Social Links" },
  { key: "instagram_url", label: "Instagram URL", type: "url", group: "Social Links" },
  { key: "facebook_url", label: "Facebook URL", type: "url", group: "Social Links" },
  { key: "adsense_client_id", label: "AdSense Client ID (ok before approval)", group: "Monetization & Analytics" },
  { key: "adsense_slot_id", label: "AdSense Slot ID (add after approval)", group: "Monetization & Analytics" },
  { key: "grow_id", label: "Grow by Mediavine Site ID (for Journey)", group: "Monetization & Analytics" },
  { key: "analytics_id", label: "Google Analytics ID (GA4)", group: "Monetization & Analytics" },
  { key: "google_site_verification", label: "Google Search Console Verification Code", group: "Monetization & Analytics" },
];

export default function SettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    createClient()
      .from("settings")
      .select("*")
      .then(({ data }) => {
        const map: Record<string, string> = {};
        (data as Setting[] | null)?.forEach((s) => {
          map[s.key] = s.value;
        });
        setValues(map);
        setLoading(false);
      });
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaved(false);
    setSaveError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await updateSettings(formData);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch (err) {
        setSaveError(
          err instanceof Error ? err.message : "Failed to save settings.",
        );
      }
    });
  }

  if (loading) {
    return <div className="h-96 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/50" />;
  }

  const groups = [...new Set(FIELDS.map((f) => f.group))];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {saveError && (
        <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400 ring-1 ring-red-500/20">
          {saveError}
        </div>
      )}

      {saved && (
        <div className="rounded-lg bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400 ring-1 ring-emerald-500/20">
          Settings saved successfully.
        </div>
      )}

      {groups.map((group) => (
        <div key={group} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white">{group}</h3>
          {FIELDS.filter((f) => f.group === group).map((field) => (
            <div key={field.key}>
              <label
                htmlFor={field.key}
                className="block text-xs font-medium text-zinc-400"
              >
                {field.label}
              </label>
              <input
                id={field.key}
                name={field.key}
                type={field.type ?? "text"}
                defaultValue={values[field.key] ?? ""}
                placeholder={
                  field.key === "analytics_id"
                    ? "G-XXXXXXXXXX"
                    : field.key === "google_site_verification"
                      ? "google-site-verification=..."
                      : field.key === "adsense_client_id"
                        ? "ca-pub-XXXXXXXXXXXXXXXX"
                        : field.key === "adsense_slot_id"
                          ? "1234567890"
                          : field.key === "contact_email"
                            ? "contact@trendsmix.online"
                            : field.key === "grow_id"
                              ? "u-XXXXXXXXXXXXXXXXXXXX"
                              : undefined
                }
                className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-orange-500"
              />
              {field.key === "analytics_id" && (
                <p className="mt-1 text-xs text-zinc-500">
                  GA4 Measurement ID from{" "}
                  <a
                    href="https://analytics.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-400 hover:underline"
                  >
                    Google Analytics
                  </a>
                  . Tracks all public pages automatically.
                </p>
              )}
            </div>
          ))}
        </div>
      ))}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-400 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save Settings"}
      </button>
    </form>
  );
}
