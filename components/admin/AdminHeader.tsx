"use client";

import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const TITLE_MAP: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/analytics": "Analytics",
  "/admin/control": "Control Center",
  "/admin/posts": "Posts",
  "/admin/posts/new": "New Post",
  "/admin/categories": "Categories",
  "/admin/pages": "Pages",
  "/admin/media": "Media Library",
  "/admin/settings": "Settings",
  "/admin/users": "Users",
};

interface AdminHeaderProps {
  email: string;
  role: string;
}

export default function AdminHeader({ email, role }: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const title =
    TITLE_MAP[pathname] ??
    (pathname.includes("/edit") ? "Edit" : pathname.split("/").pop() ?? "Admin");

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-900/30 px-6">
      <div className="flex items-center gap-3 pl-10 lg:pl-0">
        <h1 className="text-lg font-semibold text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-zinc-200">{email}</p>
          <p className="text-xs capitalize text-zinc-500">{role}</p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
