"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Page } from "@/types/database";

export default function PagesListPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    createClient()
      .from("pages")
      .select("*")
      .order("title")
      .then(({ data }) => {
        setPages((data as Page[]) ?? []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-lg border border-zinc-800 bg-zinc-900/50" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-400">
        Edit site pages content. These pages are pre-configured and cannot be
        deleted.
      </p>

      <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/50">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
            <tr>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Path</th>
              <th className="hidden px-5 py-3 sm:table-cell">Last updated</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {pages.map((page) => (
              <tr key={page.id} className="hover:bg-zinc-800/20">
                <td className="px-5 py-3 font-medium text-zinc-200">{page.title}</td>
                <td className="px-5 py-3 text-zinc-400">/{page.slug}</td>
                <td className="hidden px-5 py-3 text-xs text-zinc-500 sm:table-cell">
                  {new Date(page.updated_at).toLocaleDateString()}
                </td>
                <td className="px-5 py-3 text-right">
                  <Link
                    href={`/admin/pages/${page.id}/edit`}
                    className="rounded bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300 hover:bg-zinc-700"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
