"use client";

import { useEffect, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateSettings } from "@/lib/actions/settings";
import type { Setting } from "@/types/database";

const FIELDS: Array<{ key: string; label: string; type?: string; group: string }> = [
  { key: "site_name", label: "Site Name", group: "General" },
  { key: "site_description", label: "Site Description", group: "General" },
  { key: "logo_url", label: "Logo URL", type: "url", group: "General" },
  { key: "favicon_url", label: "Favicon URL", type: "url", group: "General" },
  { key: "twitter_url", label: "Twitter / X URL", type: "url", group: "Social Links" },
  { key: "instagram_url", label: "Instagram URL", type: "url", group: "Social Links" },
  { key: "facebook_url", label: "Facebook URL", type: "url", group: "Social Links" },
  { key: "adsense_client_id", label: "AdSense Client ID", group: "Monetization & Analytics" },
  { key: "adsense_slot_id", label: "AdSense Slot ID", group: "Monetization & Analytics" },
  { key: "analytics_id", label: "Google Analytics ID", group: "Monetization & Analytics" },
  { key: "google_site_verification", label: "Google Search Console Verification", group: "Monetization & Analytics" },
];

export default function SettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

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
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      await updateSettings(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  if (loading) {
    return <div className="h-96 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/50" />;
  }

  const groups = [...new Set(FIELDS.map((f) => f.group))];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
                className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-orange-500"
              />
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
