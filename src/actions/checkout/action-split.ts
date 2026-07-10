"use server";

import { createClient } from "@/lib/supabase/server";
import { checkoutSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export type SplitOrderResult = {
  error?: string;
  order_ids?: string[];
  order_numbers?: string[];
};

export async function splitAndCreateOrders(
  formData: FormData,
): Promise<SplitOrderResult> {
  const raw = {
    address_id: formData.get("address_id") as string,
    notes: formData.get("notes") as string | undefined,
  };

  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "LOGIN_REQUIRED" };
  }

  const { data: cartItems, error: cartError } = await supabase
    .from("cart_items")
    .select(
      `
      id,
      quantity,
      product:products (
        id,
        name,
        price,
        stock_quantity,
        store_id
      )
    `,
    )
    .eq("user_id", user.id);

  if (cartError || !cartItems || cartItems.length === 0) {
    return { error: "ခြင်းတောင်းထဲတွင် ပစ္စည်းမရှိပါ" };
  }

  const grouped = cartItems.reduce(
    (acc, item) => {
      const product = item.product as unknown as {
        id: string;
        name: string;
        price: number;
        store_id: string;
      } | null;
      if (!product) return acc;

      const storeId = product.store_id as string;
      if (!acc[storeId]) {
        acc[storeId] = [];
      }

      acc[storeId].push({
        product_id: product.id,
        product_name: product.name,
        unit_price: product.price,
        quantity: item.quantity,
      });

      return acc;
    },
    {} as Record<
      string,
      Array<{
        product_id: string;
        product_name: string;
        unit_price: number;
        quantity: number;
      }>
    >,
  );

  const orderIds: string[] = [];
  const orderNumbers: string[] = [];
  const errors: string[] = [];

  for (const [storeId, items] of Object.entries(grouped)) {
    const { data, error } = await supabase.rpc("create_order_atomic", {
      p_buyer_id: user.id,
      p_store_id: storeId,
      p_address_id: parsed.data.address_id,
      p_items: JSON.stringify(items),
    });

    if (error) {
      errors.push(error.message);
      continue;
    }

    if (data) {
      orderIds.push(data as string);
    }
  }

  if (errors.length > 0 && orderIds.length === 0) {
    return { error: errors[0] };
  }

  await supabase.from("cart_items").delete().eq("user_id", user.id);

  if (orderIds.length > 0) {
    const { data: orders } = await supabase
      .from("orders")
      .select("order_number")
      .in("id", orderIds);

    if (orders) {
      orderNumbers.push(...orders.map((o) => o.order_number));
    }
  }

  revalidatePath("/cart");
  revalidatePath("/account/orders");

  return {
    order_ids: orderIds,
    order_numbers: orderNumbers,
  };
}
