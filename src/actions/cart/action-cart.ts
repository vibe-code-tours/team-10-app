"use server";

import { createClient } from "@/lib/supabase/server";
import { cartItemSchema, updateCartSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export type CartResult = {
  error?: string;
  success?: boolean;
};

export async function addToCart(formData: FormData): Promise<CartResult> {
  const raw = {
    product_id: formData.get("product_id") as string,
    quantity: Number(formData.get("quantity") ?? 1),
  };

  const parsed = cartItemSchema.safeParse(raw);
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

  const { data: product } = await supabase
    .from("products")
    .select("id, stock_quantity, status")
    .eq("id", parsed.data.product_id)
    .eq("status", "active")
    .single();

  if (!product) {
    return { error: "ပစ္စည်းရှာမတွေ့ပါ" };
  }

  if (product.stock_quantity < parsed.data.quantity) {
    return {
      error: `လက်ကျန်မလုံလောက်ပါ (${product.stock_quantity} ခုသာကျန်ပါသည်)`,
    };
  }

  const { data: existing } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("user_id", user.id)
    .eq("product_id", parsed.data.product_id)
    .single();

  if (existing) {
    const newQty = existing.quantity + parsed.data.quantity;
    if (newQty > product.stock_quantity) {
      return {
        error: `လက်ကျန်မလုံလောက်ပါ (${product.stock_quantity} ခုသာကျန်ပါသည်)`,
      };
    }

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: newQty })
      .eq("id", existing.id);

    if (error) return { error: "ခြင်းတောင်းထဲထည့်၍မရပါ" };
  } else {
    const { error } = await supabase.from("cart_items").insert({
      user_id: user.id,
      product_id: parsed.data.product_id,
      quantity: parsed.data.quantity,
    });

    if (error) return { error: "ခြင်းတောင်းထဲထည့်၍မရပါ" };
  }

  revalidatePath("/cart");
  return { success: true };
}

export async function updateCartItem(formData: FormData): Promise<CartResult> {
  const raw = {
    cart_item_id: formData.get("cart_item_id") as string,
    quantity: Number(formData.get("quantity")),
  };

  const parsed = updateCartSchema.safeParse(raw);
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

  const { error } = await supabase
    .from("cart_items")
    .update({ quantity: parsed.data.quantity })
    .eq("id", parsed.data.cart_item_id)
    .eq("user_id", user.id);

  if (error) return { error: "ခြင်းတောင်းပြင်ဆင်၍မရပါ" };

  revalidatePath("/cart");
  return { success: true };
}

export async function removeFromCart(cartItemId: string): Promise<CartResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "LOGIN_REQUIRED" };
  }

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", cartItemId)
    .eq("user_id", user.id);

  if (error) return { error: "ခြင်းတောင်းမှဖယ်ရှား၍မရပါ" };

  revalidatePath("/cart");
  return { success: true };
}

export async function getCartItems() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("cart_items")
    .select(
      `
      id,
      quantity,
      created_at,
      product:products (
        id,
        name,
        slug,
        price,
        stock_quantity,
        status,
        store:stores (
          id,
          name,
          slug
        ),
        images:product_images (
          url,
          sort_order
        )
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getCartCount(): Promise<number> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return 0;

  const { count } = await supabase
    .from("cart_items")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  return count ?? 0;
}
