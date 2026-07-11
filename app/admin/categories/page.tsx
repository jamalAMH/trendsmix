"use client";

import { useEffect, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/actions/categories";
import type { Category } from "@/types/database";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<(Category & { post_count: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const supabase = createClient();
    const { data: cats } = await supabase
      .from("categories")
      .select("*, posts(id)")
      .order("name");

    setCategories(
      (cats ?? []).map((c: Record<string, unknown>) => ({
        ...(c as unknown as Category),
        post_count: Array.isArray(c.posts) ? c.posts.length : 0,
      })),
    );
    setLoading(false);
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({ name: "", slug: "", description: "" });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData();
    formData.set("name", form.name);
    formData.set("slug", form.slug || slugify(form.name));
    formData.set("description", form.description);

    startTransition(async () => {
      if (editingId) {
        await updateCategory(editingId, formData);
      } else {
        await createCategory(formData);
      }
      cancelEdit();
      await loadCategories();
    });
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`Delete category "${name}"?`)) return;
    startTransition(async () => {
      await deleteCategory(id);
      await loadCategories();
    });
  }

  if (loading) {
    return <div className="h-64 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/50" />;
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label htmlFor="cat-name" className="block text-xs font-medium text-zinc-400">
            Name
          </label>
          <input
            id="cat-name"
            required
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                name: e.target.value,
                slug: editingId ? prev.slug : slugify(e.target.value),
              }))
            }
            className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-orange-500"
            placeholder="Category name"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="cat-slug" className="block text-xs font-medium text-zinc-400">
            Slug
          </label>
          <input
            id="cat-slug"
            required
            value={form.slug}
            onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
            className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-orange-500"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="cat-desc" className="block text-xs font-medium text-zinc-400">
            Description
          </label>
          <input
            id="cat-desc"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-orange-500"
            placeholder="Optional"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-400 disabled:opacity-50"
          >
            {editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {categories.length === 0 ? (
        <p className="text-center text-sm text-zinc-500">No categories yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/50">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Slug</th>
                <th className="px-5 py-3">Posts</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-zinc-800/20">
                  <td className="px-5 py-3 font-medium text-zinc-200">{cat.name}</td>
                  <td className="px-5 py-3 text-zinc-400">{cat.slug}</td>
                  <td className="px-5 py-3 text-zinc-400">{cat.post_count}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(cat)}
                        className="rounded bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300 hover:bg-zinc-700"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat.id, cat.name)}
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
