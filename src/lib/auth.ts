import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { getServerClient } from "@/lib/supabase/server";

export async function getSessionUser(): Promise<User | null> {
  const supabase = await getServerClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

// Bảo vệ phía server: chỉ admin (email trong admin_users, qua RPC is_admin) mới qua.
export async function requireAdmin(): Promise<User> {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const supabase = await getServerClient();
  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || !isAdmin) redirect("/admin/login");

  return user;
}