import { revalidatePath } from "next/cache";

export function revalidateStoryPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/stories");
  revalidatePath("/sitemap.xml");
  revalidatePath("/feed.xml");
  if (slug) revalidatePath(`/stories/${slug}`);
}
