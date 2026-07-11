import { createClient } from "@/lib/supabase/server";

/**
 * Verifies the current session belongs to an authenticated admin, checking
 * the server-authoritative `public.users.role` column (not the client-editable
 * auth `user_metadata`). Throws if unauthenticated or not an admin.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Forbidden: Admin access required");
  }

  return user;
}
