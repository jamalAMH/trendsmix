"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import StatsCard from "@/components/admin/StatsCard";
import type { PostWithRelations } from "@/types/database";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    categories: 0,
  });
  const [recentPosts, setRecentPosts] = useState<PostWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const [postsRes, catsRes, recentRes] = await Promise.all([
        supabase.from("posts").select("status"),
        supabase.from("categories").select("id"),
        supabase
          .from("posts")
          .select("*, categories(*), profiles(*)")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      const posts = postsRes.data ?? [];
      setStats({
        total: posts.length,
        published: posts.filter((p) => p.status === "published").length,
        drafts: posts.filter((p) => p.status === "draft").length,
        categories: catsRes.data?.length ?? 0,
      });
      setRecentPosts((recentRes.data as PostWithRelations[]) ?? []);
      setLoading(false);
    }

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
        <div className="h-64 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/50" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Total Posts" value={stats.total} />
        <StatsCard label="Published" value={stats.published} sub="Live on site" />
        <StatsCard label="Drafts" value={stats.drafts} sub="Unpublished" />
        <StatsCard label="Categories" value={stats.categories} />
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <h2 className="text-sm font-semibold text-white">Recent Posts</h2>
          <Link
            href="/admin/posts"
            className="text-xs font-medium text-orange-400 hover:text-orange-300"
          >
            View all
          </Link>
        </div>

        {recentPosts.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-zinc-500">
            No posts yet.{" "}
            <Link href="/admin/posts/new" className="text-orange-400 hover:underline">
              Create your first post
            </Link>
          </p>
        ) : (
          <div className="divide-y divide-zinc-800/50">
            {recentPosts.map((post) => (
              <Link
                key={post.id}
                href={`/admin/posts/${post.id}/edit`}
                className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-zinc-800/30"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-200">
                    {post.title}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {post.categories?.name ?? "Uncategorized"} &middot;{" "}
                    {post.profiles?.full_name || post.profiles?.email || "Unknown"}
                  </p>
                </div>
                <span
                  className={`ml-4 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    post.status === "published"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-zinc-700/50 text-zinc-400"
                  }`}
                >
                  {post.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
