"use client";

import { useEffect, useState, useTransition, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { deleteMedia } from "@/lib/actions/media";
import type { Media } from "@/types/database";

export default function MediaPage() {
  const [items, setItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const [copied, setCopied] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    createClient()
      .from("media")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (cancelled) return;
        setItems((data as Media[]) ?? []);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    for (const file of Array.from(files)) {
      const form = new FormData();
      form.append("file", file);
      await fetch("/api/upload", { method: "POST", body: form });
    }
    setUploading(false);
    const { data } = await createClient()
      .from("media")
      .select("*")
      .order("created_at", { ascending: false });
    setItems((data as Media[]) ?? []);
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleDelete(item: Media) {
    if (!confirm(`Delete "${item.name}"?`)) return;
    startTransition(async () => {
      await deleteMedia(item.id, item.url);
      setItems((prev) => prev.filter((m) => m.id !== item.id));
    });
  }

  function handleCopy(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 1500);
  }

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-square animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/50" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-400">
          <span>{uploading ? "Uploading…" : "+ Upload"}</span>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="sr-only"
            disabled={uploading}
            aria-label="Upload media files"
          />
        </label>
        <span className="text-sm text-zinc-500">
          {items.length} file{items.length !== 1 ? "s" : ""}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-5 py-12 text-center">
          <p className="text-sm text-zinc-500">
            No media files yet. Upload your first image.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50"
            >
              <div className="relative aspect-video bg-zinc-800">
                {item.type.startsWith("image/") ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={item.url}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                    {item.type}
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="truncate text-xs font-medium text-zinc-300">
                  {item.name}
                </p>
                <p className="text-xs text-zinc-500">
                  {(item.size / 1024).toFixed(1)} KB
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(item.url)}
                    className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-700"
                  >
                    {copied === item.url ? "Copied!" : "Copy URL"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    disabled={pending}
                    className="rounded bg-red-500/10 px-2 py-1 text-xs text-red-400 hover:bg-red-500/20"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
