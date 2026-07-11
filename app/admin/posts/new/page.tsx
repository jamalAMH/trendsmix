"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createPost } from "@/lib/actions/posts";
import TipTapEditor from "@/components/admin/TipTapEditor";
import type { Category } from "@/types/database";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function NewPostPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [autoSlug, setAutoSlug] = useState(true);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  useEffect(() => {
    createClient()
      .from("categories")
      .select("*")
      .order("name")
      .then(({ data }) => setCategories(data ?? []));
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    formData.set("content", content);
    formData.set("slug", slug);

    startTransition(async () => {
      try {
        await createPost(formData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create post");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400 ring-1 ring-red-500/20">
          {error}
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
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (autoSlug) setSlug(slugify(e.target.value));
              }}
              className="mt-1.5 block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-orange-500"
              placeholder="Post title"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-zinc-300">
              Slug
            </label>
            <div className="mt-1.5 flex">
              <span className="inline-flex items-center rounded-l-lg border border-r-0 border-zinc-700 bg-zinc-800 px-3 text-xs text-zinc-500">
                /stories/
              </span>
              <input
                id="slug"
                name="slug"
                required
                value={slug}
                onChange={(e) => {
                  setAutoSlug(false);
                  setSlug(e.target.value);
                }}
                className="block w-full rounded-r-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-zinc-300">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={2}
              className="mt-1.5 block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-orange-500"
              placeholder="Short description…"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-300">
              Content
            </label>
            <TipTapEditor content="" onChange={setContent} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-4">
            <h3 className="text-sm font-semibold text-white">Publish</h3>

            <div>
              <label htmlFor="status" className="block text-xs font-medium text-zinc-400">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-orange-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div>
              <label htmlFor="category_id" className="block text-xs font-medium text-zinc-400">
                Category
              </label>
              <select
                id="category_id"
                name="category_id"
                className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-orange-500"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input type="hidden" name="featured" value="false" />
              <label className="flex items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    const hidden = e.target.parentElement?.parentElement?.querySelector(
                      'input[name="featured"]',
                    ) as HTMLInputElement | null;
                    if (hidden) hidden.value = e.target.checked ? "true" : "false";
                  }}
                  className="h-4 w-4 rounded border-zinc-600 bg-zinc-900 text-orange-500 focus:ring-orange-500"
                />
                Featured post
              </label>
            </div>

            <div>
              <label htmlFor="read_time" className="block text-xs font-medium text-zinc-400">
                Reading time (min)
              </label>
              <input
                id="read_time"
                name="read_time"
                type="number"
                min={1}
                defaultValue={5}
                className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-4">
            <h3 className="text-sm font-semibold text-white">Featured Image</h3>
            <div>
              <label htmlFor="featured_image" className="block text-xs font-medium text-zinc-400">
                Image URL
              </label>
              <input
                id="featured_image"
                name="featured_image"
                type="url"
                className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-orange-500"
                placeholder="https://…"
              />
            </div>
            <div>
              <label htmlFor="featured_image_alt" className="block text-xs font-medium text-zinc-400">
                Alt text
              </label>
              <input
                id="featured_image_alt"
                name="featured_image_alt"
                className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-orange-500"
                placeholder="Describe the image…"
              />
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-4">
            <h3 className="text-sm font-semibold text-white">SEO</h3>
            <div>
              <label htmlFor="meta_title" className="block text-xs font-medium text-zinc-400">
                Meta title
              </label>
              <input
                id="meta_title"
                name="meta_title"
                className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-orange-500"
                placeholder="Custom meta title"
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
                className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-orange-500"
                placeholder="Custom meta description"
              />
            </div>
            <div>
              <label htmlFor="canonical_url" className="block text-xs font-medium text-zinc-400">
                Canonical URL
              </label>
              <input
                id="canonical_url"
                name="canonical_url"
                type="url"
                className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-orange-500"
                placeholder="https://…"
              />
            </div>
            <div>
              <label htmlFor="og_image" className="block text-xs font-medium text-zinc-400">
                OG image URL
              </label>
              <input
                id="og_image"
                name="og_image"
                type="url"
                className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-orange-500"
                placeholder="https://…"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-400 disabled:opacity-50"
          >
            {pending ? "Creating…" : "Create Post"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin/posts")}
            className="w-full rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:border-zinc-600 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
