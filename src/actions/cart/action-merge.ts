"use server";

import { createClient } from "@/lib/supabase/server";
import { guestCartSchema, type GuestCartInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export type MergeResult = {
  error?: string;
  merged?: number;
};

/**
 * Cart Merge Logic (Guest -> User)
 *
 * Called immediately after login/OAuth success.
 * Takes guest cart items from localStorage (passed as JSON string)
 * and upserts them into the authenticated user's cart_items table.
 *
 * If a product already exists in the user's cart, quantities are summed.
 */
export async function mergeGuestCart(
  guestCartJson: string,
): Promise<MergeResult> {
  // Parse and validate guest cart
  let guestItems: GuestCartInput;
  try {
    const raw = JSON.parse(guestCartJson);
    const parsed = guestCartSchema.safeParse(raw);
    if (!parsed.success) {
      return { error: "Invalid cart data" };
    }
    guestItems = parsed.data;
  } catch {
    return { error: "Invalid cart JSON" };
  }

  if (guestItems.length === 0) {
    return { merged: 0 };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  let mergedCount = 0;

  for (const item of guestItems) {
    // Verify product exists and is active
    const { data: product } = await supabase
      .from("products")
      .select("id, stock_quantity")
      .eq("id", item.product_id)
      .eq("status", "active")
      .single();

    if (!product) continue;

    // Check if already in cart
    const { data: existing } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq("product_id", item.product_id)
      .single();

    if (existing) {
      // Merge: sum quantities, cap at stock
      const newQty = Math.min(
        existing.quantity + item.quantity,
        product.stock_quantity,
      );

      await supabase
        .from("cart_items")
        .update({ quantity: newQty })
        .eq("id", existing.id);
    } else {
      // Insert new: cap at stock
      const qty = Math.min(item.quantity, product.stock_quantity);

      await supabase.from("cart_items").insert({
        user_id: user.id,
        product_id: item.product_id,
        quantity: qty,
      });
    }

    mergedCount++;
  }

  revalidatePath("/cart");
  return { merged: mergedCount };
}
