import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { AuthenticatedAdmin } from "@/lib/types";

export async function getAuthenticatedAdmin(): Promise<AuthenticatedAdmin> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id || !user.email) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/login?error=unauthorized");
  }

  return {
    id: profile.id,
    email: profile.email,
    full_name: profile.full_name,
    role: "admin",
  };
}
