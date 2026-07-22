export function placeholderImageUrl(
  seed: string,
  width = 1200,
  height = 675,
): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
}

export function isBrokenExternalImage(url: string | null | undefined): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return (
    lower.includes("fbcdn.net") ||
    lower.includes("facebook.com") ||
    lower.includes("fb.com")
  );
}

export function isHostedImage(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.includes("supabase.co") || url.includes("picsum.photos");
}
