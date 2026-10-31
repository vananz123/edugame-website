"use server";

import { redirect } from "next/navigation";
import { getServerClient } from "@/lib/supabase/server";

export type LoginState = { error?: string } | undefined;

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) {
    return { error: "Please enter email and password." };
  }

  const supabase = await getServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: "Invalid email or password." };
  }
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  const supabase = await getServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}