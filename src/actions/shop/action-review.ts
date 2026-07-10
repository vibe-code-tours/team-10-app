"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitReview(formData: FormData) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "You must be logged in to leave a review." };
    }

    const productId = formData.get("productId") as string;
    const rating = Number(formData.get("rating"));
    const comment = formData.get("comment") as string;

    if (!productId || rating < 1 || rating > 5) {
      return { error: "Invalid review data." };
    }

    const { error } = await supabase.from("product_reviews").insert({
      product_id: productId,
      user_id: user.id,
      rating,
      comment,
    });

    if (error) {
      console.error(error);
      return {
        error:
          "Failed to submit review. You may have already reviewed this product.",
      };
    }

    revalidatePath(`/products/${productId}`);
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}
