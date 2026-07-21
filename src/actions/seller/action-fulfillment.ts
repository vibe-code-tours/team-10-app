"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdminOrSeller } from "@/lib/supabase/auth-helpers";
import { revalidatePath } from "next/cache";

const VALID_STATUSES = ["pending", "shipped", "delivered"] as const;
type FulfillmentStatus = (typeof VALID_STATUSES)[number];

export async function updateFulfillmentStatus(
  orderItemId: string,
  status: FulfillmentStatus,
): Promise<{ error?: string }> {
  if (!VALID_STATUSES.includes(status)) {
    return { error: "Invalid status" };
  }

  const { user } = await requireAdminOrSeller();
  const supabase = await createClient();

  // Verify ownership before update (RLS also enforces, but explicit check gives better error)
  const { data: item } = await supabase
    .from("order_items")
    .select("seller_id")
    .eq("id", orderItemId)
    .single();

  if (!item) return { error: "Order item not found" };

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && item.seller_id !== user.id) {
    return { error: "Forbidden" };
  }

  const { error } = await supabase
    .from("order_items")
    .update({ fulfillment_status: status })
    .eq("id", orderItemId);

  if (error) {
    console.error("updateFulfillmentStatus:", error);
    return { error: "Failed to update status" };
  }

  revalidatePath("/seller/orders");
  revalidatePath("/admin/orders");
  return {};
}
