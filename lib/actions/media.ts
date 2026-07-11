"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "./helpers";

export async function deleteMedia(id: string, url: string) {
  const { supabase } = await requireAdmin();

  const pathMatch = url.match(/\/storage\/v1\/object\/public\/media\/(.+)$/);
  if (pathMatch?.[1]) {
    await supabase.storage.from("media").remove([pathMatch[1]]);
  }

  const { error } = await supabase.from("media").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/media");
}
