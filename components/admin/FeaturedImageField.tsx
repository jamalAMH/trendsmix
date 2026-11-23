"use client";

import { useRef, useState } from "react";
import { uploadImage } from "@/lib/upload-image";

interface FeaturedImageFieldProps {
  defaultValue?: string;
}

/** Featured image input: upload from the computer or paste a URL, with a preview. */
export default function FeaturedImageField({
  defaultValue = "",
}: FeaturedImageFieldProps) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      setUrl(await uploadImage(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      {url ? (
        <div className="relative overflow-hidden rounded-lg border border-zinc-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="" className="h-40 w-full object-cover" />
          <button
            type="button"
            onClick={() => setUrl("")}
            className="absolute right-2 top-2 rounded-md bg-black/70 px-2 py-1 text-xs text-white hover:bg-black"
          >
            Remove
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFile(e.dataTransfer.files?.[0]);
          }}
          disabled={uploading}
          className="flex h-40 w-full flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-zinc-700 text-sm text-zinc-400 transition-colors hover:border-orange-500/60 hover:text-orange-400 disabled:opacity-60"
        >
          <span className="text-2xl">🖼️</span>
          {uploading ? "Uploading…" : "Click or drop an image to upload"}
          <span className="text-xs text-zinc-500">JPG, PNG, WebP, GIF — max 10 MB</span>
        </button>
      )}

      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {url && (
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          disabled={uploading}
          className="w-full rounded-lg border border-zinc-700 px-3 py-2 text-xs font-medium text-zinc-300 hover:border-orange-500/60 hover:text-orange-400 disabled:opacity-60"
        >
          {uploading ? "Uploading…" : "Replace image"}
        </button>
      )}

      <div>
        <label htmlFor="featured_image" className="block text-xs font-medium text-zinc-400">
          …or image URL
        </label>
        <input
          id="featured_image"
          name="featured_image"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-orange-500"
          placeholder="https://…"
        />
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
