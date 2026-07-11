"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { deletePost, togglePostStatus, togglePostFeatured } from "@/lib/actions/posts";
import type { PostWithRelations } from "@/types/database";

export default function PostsPage() {
  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [loading, setLoading] = useState(true);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    createClient()
      .from("posts")
      .select("*, categories(*), profiles(*)")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error("Failed to fetch posts:", error.message);
        }
        setPosts((data as PostWithRelations[]) ?? []);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const filtered = posts.filter((p) => {
    const matchesSearch =
      search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    startTransition(async () => {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    });
  }

  function handleToggleStatus(id: string) {
    startTransition(async () => {
      await togglePostStatus(id);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, status: p.status === "published" ? "draft" : "published" }
            : p,
        ),
      );
    });
  }

  function handleToggleFeatured(id: string) {
    startTransition(async () => {
      await togglePostFeatured(id);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, featured: !p.featured } : p,
        ),
      );
    });
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg border border-zinc-800 bg-zinc-900/50" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-3">
          <input
            type="text"
            placeholder="Search posts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xs rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-orange-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-orange-500"
          >
            <option value="all">All status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-400"
        >
          + New Post
        </Link>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-5 py-12 text-center">
          <p className="text-sm text-zinc-500">No posts found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/50">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-5 py-3">Title</th>
                <th className="hidden px-5 py-3 sm:table-cell">Category</th>
                <th className="px-5 py-3">Status</th>
                <th className="hidden px-5 py-3 md:table-cell">Featured</th>
                <th className="hidden px-5 py-3 lg:table-cell">Date</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filtered.map((post) => (
                <tr key={post.id} className="transition-colors hover:bg-zinc-800/20">
                  <td className="max-w-[200px] px-5 py-3">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="truncate font-medium text-zinc-200 hover:text-orange-400"
                    >
                      {post.title}
                    </Link>
                    <p className="truncate text-xs text-zinc-500">/{post.slug}</p>
                  </td>
                  <td className="hidden px-5 py-3 text-zinc-400 sm:table-cell">
                    {post.categories?.name ?? "—"}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(post.id)}
                      disabled={pending}
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        post.status === "published"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-zinc-700/50 text-zinc-400"
                      }`}
                    >
                      {post.status}
                    </button>
                  </td>
                  <td className="hidden px-5 py-3 md:table-cell">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(post.id)}
                      disabled={pending}
                      className="text-lg"
                      title={post.featured ? "Remove from featured" : "Mark as featured"}
                    >
                      {post.featured ? "★" : "☆"}
                    </button>
                  </td>
                  <td className="hidden px-5 py-3 text-xs text-zinc-500 lg:table-cell">
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="rounded bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300 hover:bg-zinc-700"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(post.id, post.title)}
                        disabled={pending}
                        className="rounded bg-red-500/10 px-2.5 py-1 text-xs text-red-400 hover:bg-red-500/20"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
