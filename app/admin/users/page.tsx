"use client";

import { useEffect, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateUserRole } from "@/lib/actions/users";
import type { Profile } from "@/types/database";

export default function UsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    createClient()
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setUsers((data as Profile[]) ?? []);
        setLoading(false);
      });
  }, []);

  function handleRoleChange(userId: string, role: "admin" | "editor") {
    startTransition(async () => {
      await updateUserRole(userId, role);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role } : u)),
      );
    });
  }

  if (loading) {
    return <div className="h-64 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/50" />;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-400">
        Manage admin and editor accounts. Create new users via Supabase Auth
        dashboard.
      </p>

      {users.length === 0 ? (
        <p className="text-center text-sm text-zinc-500">No users found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/50">
          <table className="w-full text-left text-sm" role="table" aria-label="User accounts">
            <thead className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-5 py-3">Email</th>
                <th className="hidden px-5 py-3 sm:table-cell">Name</th>
                <th className="px-5 py-3">Role</th>
                <th className="hidden px-5 py-3 md:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-800/20">
                  <td className="px-5 py-3 font-medium text-zinc-200">
                    {user.email}
                  </td>
                  <td className="hidden px-5 py-3 text-zinc-400 sm:table-cell">
                    {user.full_name || "—"}
                  </td>
                  <td className="px-5 py-3">
                    <label className="sr-only" htmlFor={`role-${user.id}`}>
                      Role for {user.email}
                    </label>
                    <select
                      id={`role-${user.id}`}
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(
                          user.id,
                          e.target.value as "admin" | "editor",
                        )
                      }
                      disabled={pending}
                      className="rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-white outline-none focus:border-orange-500"
                    >
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                    </select>
                  </td>
                  <td className="hidden px-5 py-3 text-xs text-zinc-500 md:table-cell">
                    {new Date(user.created_at).toLocaleDateString()}
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
