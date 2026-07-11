"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "./helpers";

export async function updateUserRole(userId: string, role: "admin" | "editor") {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/users");
}

export async function deleteUser(userId: string) {
  const { supabase, userId: callerId } = await requireAdmin();

  if (callerId === userId) {
    throw new Error("Cannot delete your own account");
  }

  const { error } = await supabase.from("profiles").delete().eq("id", userId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/users");
}
