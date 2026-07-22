"use server";

import { createAdminClient, createAuthAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/auth-helpers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CreateUserSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  full_name: z.string().min(2, "Full name required"),
  shop_name: z.string().min(2, "Shop name required"),
  role: z.enum(["seller", "buyer"]).default("buyer"),
});

export type UserFormState = { error?: string; success?: boolean };

export async function createUser(
  _prev: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Forbidden" };
  }

  const parsed = CreateUserSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    full_name: formData.get("full_name"),
    shop_name: formData.get("shop_name"),
    role: formData.get("role") || "buyer",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const authAdmin = createAuthAdminClient();
  const adminClient = createAdminClient();

  const { data: authUser, error: authErr } =
    await authAdmin.auth.admin.createUser({
      email: parsed.data.email,
      password: parsed.data.password,
      email_confirm: true,
      user_metadata: { full_name: parsed.data.full_name },
    });

  if (authErr || !authUser.user) {
    console.error("createUser auth:", authErr);
    return { error: authErr?.message ?? "Failed to create auth user" };
  }

  // Upsert public.users — handles case where trigger didn't fire
  const { error: profileErr } = await adminClient
    .from("users")
    .upsert(
      {
        id: authUser.user.id,
        full_name: parsed.data.full_name,
        role: parsed.data.role,
        shop_name: parsed.data.role === "seller" ? parsed.data.shop_name : null,
      },
      { onConflict: "id" },
    );

  if (profileErr) {
    console.error("createUser profile:", profileErr);
    // Auth user created — try to clean up
    await authAdmin.auth.admin.deleteUser(authUser.user.id);
    return { error: "Failed to set user profile. User creation rolled back." };
  }

  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUser(userId: string): Promise<{ error?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Forbidden" };
  }

  const authAdmin = createAuthAdminClient();
  const adminClient = createAdminClient();

  // Prevent deleting admins
  const { data: profile } = await adminClient
    .from("users")
    .select("role")
    .eq("id", userId)
    .single();

  if (profile?.role === "admin") {
    return { error: "Cannot delete admin users." };
  }

  const { error } = await authAdmin.auth.admin.deleteUser(userId);
  if (error) {
    console.error("deleteUser:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/users");
  return {};
}

export async function updateUserRole(
  userId: string,
  role: "buyer" | "seller",
  shopName?: string,
): Promise<{ error?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Forbidden" };
  }

  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("users")
    .update({
      role,
      shop_name: role === "seller" ? (shopName ?? null) : null,
    })
    .eq("id", userId)
    .neq("role", "admin");

  if (error) {
    console.error("updateUserRole:", error);
    return { error: "Failed to update role." };
  }

  revalidatePath("/admin/users");
  return {};
}
