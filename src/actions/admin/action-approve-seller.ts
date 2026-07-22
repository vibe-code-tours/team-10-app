"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/auth-helpers";
import { revalidatePath } from "next/cache";

export async function approveSeller(
  applicationId: string,
  userId: string,
  shopName: string,
): Promise<{ error?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Forbidden" };
  }

  const adminClient = await createAdminClient();

  // Set role + shop_name on users (bypass lock_user_role trigger via service role)
  const { error: userErr } = await adminClient
    .from("users")
    .update({ role: "seller", shop_name: shopName })
    .eq("id", userId)
    .neq("role", "admin");

  if (userErr) {
    console.error("approveSeller users update:", userErr);
    return { error: "Failed to update user role." };
  }

  // Mark application approved
  const { error: appErr } = await adminClient
    .from("seller_applications")
    .update({ status: "approved", rejection_reason: null })
    .eq("id", applicationId);

  if (appErr) {
    console.error("approveSeller application update:", appErr);
    return { error: "Failed to update application status." };
  }

  revalidatePath("/admin/shops");
  return {};
}

export async function rejectSeller(
  applicationId: string,
  reason: string,
): Promise<{ error?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Forbidden" };
  }

  const adminClient = await createAdminClient();

  const { error } = await adminClient
    .from("seller_applications")
    .update({ status: "rejected", rejection_reason: reason })
    .eq("id", applicationId);

  if (error) {
    console.error("rejectSeller:", error);
    return { error: "Failed to reject application." };
  }

  revalidatePath("/admin/shops");
  return {};
}
