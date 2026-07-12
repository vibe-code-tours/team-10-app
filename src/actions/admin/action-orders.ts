"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/auth-helpers";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    await requireAdmin();
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
