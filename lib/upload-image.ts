/** Uploads an image to Supabase storage through /api/upload and returns its public URL. */
export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);

  let res: Response;
  try {
    res = await fetch("/api/upload", { method: "POST", body: form });
  } catch {
    throw new Error("Upload failed — check your connection and try again.");
  }

  const json = (await res.json().catch(() => ({}))) as {
    url?: string;
    error?: string;
  };

  if (!res.ok || !json.url) {
    throw new Error(json.error || `Upload failed (${res.status}).`);
  }
  return json.url;
}
