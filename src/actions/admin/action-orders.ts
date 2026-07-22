"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdminOrSeller } from "@/lib/supabase/auth-helpers";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    await requireAdminOrSeller();
    const supabase = await createClient();

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      console.error("Update Order Status Error:", error);
      return { error: "Failed to update order status." };
    }

    revalidatePath(`/admin/orders`);
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
  } catch (err: unknown) {
    console.error("updateOrderStatus error:", err);
    return { error: "Failed to update order status." };
  }
}

export async function updateOrderItemStatus(itemId: string, newStatus: string) {
  try {
    await requireAdminOrSeller();
    const supabase = await createClient();

    const { error } = await supabase
      .from("order_items")
      .update({ fulfillment_status: newStatus })
      .eq("id", itemId);

    if (error) {
      console.error("Update Order Item Status Error:", error);
      return { error: "Failed to update order item status." };
    }

    revalidatePath(`/admin/orders`);
    return { success: true };
  } catch (err: unknown) {
    console.error("updateOrderItemStatus error:", err);
    return { error: "Failed to update order item status." };
  }
}
