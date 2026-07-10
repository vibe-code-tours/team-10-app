"use server";

import { createClient } from "@/lib/supabase/server";

export type CheckoutResult = {
  error?: string;
  success?: boolean;
  orderId?: string;
};

export async function createOrder(
  customerDetails: {
    customer_name: string;
    customer_phone: string;
    customer_address: string;
    payment_method: string;
  },
  items: Array<{ id: string; quantity: number; price: number }>,
  totalAmount: number,
): Promise<CheckoutResult> {
  try {
    const supabase = await createClient();

    // Get current user if logged in
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 1. Create the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user?.id || null,
        customer_name: customerDetails.customer_name,
        customer_phone: customerDetails.customer_phone,
        customer_address: customerDetails.customer_address,
        payment_method: customerDetails.payment_method,
        total_amount: totalAmount,
        status: "pending",
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Order error:", orderError);
      return { error: "Failed to create order." };
    }

    // 2. Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Items error:", itemsError);
      return { error: "Failed to save order items." };
    }

    return { success: true, orderId: order.id };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}
