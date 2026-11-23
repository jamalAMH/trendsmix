"use client";

import { useState } from "react";

interface PostLinkBoxProps {
  slug: string;
  status: string;
  justCreated?: boolean;
}

/** Shows the public link of a post with Copy / Open buttons. */
export default function PostLinkBox({ slug, status, justCreated }: PostLinkBoxProps) {
  const [copied, setCopied] = useState(false);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url = `${origin}/stories/${slug}`;
  const published = status === "published";

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Fallback for browsers that block the clipboard API.
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className={`rounded-xl border p-4 ${
        justCreated
          ? "border-emerald-500/40 bg-emerald-500/10"
          : "border-zinc-800 bg-zinc-900/50"
      }`}
    >
      {justCreated && (
        <p className="mb-2 text-sm font-semibold text-emerald-400">
          ✅ Post created! Here is its link:
        </p>
      )}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          readOnly
          value={url}
          onFocus={(e) => e.currentTarget.select()}
          className="min-w-0 flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-xs text-white outline-none"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={copy}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-400"
          >
            {copied ? "Copied ✓" : "Copy link"}
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-orange-500/60 hover:text-orange-400"
          >
            Open ↗
          </a>
        </div>
      </div>
      {!published && (
        <p className="mt-2 text-xs text-amber-400">
          This post is a <strong>draft</strong> — the link will only work after you set
          Status to “Published” and save.
        </p>
      )}
    </div>
  );
}
