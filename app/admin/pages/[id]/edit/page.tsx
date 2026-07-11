"use client";

import { useEffect, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { updatePage } from "@/lib/actions/pages";
import TipTapEditor from "@/components/admin/TipTapEditor";
import type { Page } from "@/types/database";

export default function EditPagePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [page, setPage] = useState<Page | null>(null);
  const [content, setContent] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    createClient()
      .from("pages")
      .select("*")
      .eq("id", params.id)
      .single()
      .then(({ data }) => {
        if (data) {
          const p = data as Page;
          setPage(p);
          setContent(p.content);
        }
        setLoading(false);
      });
  }, [params.id]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaved(false);
    const formData = new FormData(e.currentTarget);
    formData.set("content", content);

    startTransition(async () => {
      try {
        await updatePage(params.id, formData);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update page");
      }
    });
  }

  if (loading) {
    return <div className="h-96 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/50" />;
  }

  if (!page) {
    return <p className="text-sm text-zinc-500">Page not found.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400 ring-1 ring-red-500/20">
          {error}
        </div>
      )}
      {saved && (
        <div className="rounded-lg bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400 ring-1 ring-emerald-500/20">
          Page saved successfully.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-zinc-300">
              Title
            </label>
            <input
              id="title"
              name="title"
              required
              defaultValue={page.title}
              className="mt-1.5 block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <p className="text-xs text-zinc-500">
              Path: <span className="font-mono text-zinc-400">/{page.slug}</span>
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-300">
              Content
            </label>
            <TipTapEditor content={page.content} onChange={setContent} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-4">
            <h3 className="text-sm font-semibold text-white">SEO</h3>
            <div>
              <label htmlFor="meta_title" className="block text-xs font-medium text-zinc-400">
                Meta title
              </label>
              <input
                id="meta_title"
                name="meta_title"
                defaultValue={page.meta_title ?? ""}
                className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label htmlFor="meta_description" className="block text-xs font-medium text-zinc-400">
                Meta description
              </label>
              <textarea
                id="meta_description"
                name="meta_description"
                rows={2}
                defaultValue={page.meta_description ?? ""}
                className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-400 disabled:opacity-50"
          >
            {pending ? "Saving…" : "Save Page"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin/pages")}
            className="w-full rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:border-zinc-600 hover:text-white"
          >
            Back to Pages
          </button>
        </div>
      </div>
    </form>
  );
}
