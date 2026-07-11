import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950 p-8">
        <div className="max-w-md text-center">
          <h1 className="mb-4 text-2xl font-bold text-white">
            Supabase Not Configured
          </h1>
          <p className="text-zinc-400">
            Copy <code className="text-orange-400">.env.example</code> to{" "}
            <code className="text-orange-400">.env.local</code> and add your
            Supabase credentials, then restart the dev server.
          </p>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950">
        {children}
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden bg-zinc-950">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader
          email={user.email ?? ""}
          role={profile?.role ?? "editor"}
        />
        <main className="flex-1 overflow-y-auto bg-zinc-950 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
