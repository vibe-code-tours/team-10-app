"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { isRateLimited } from "@/lib/rate-limit";

export async function submitReview(formData: FormData) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "You must be logged in to leave a review." };
    }

    if (isRateLimited(`review:${user.id}`, 3, 60_000)) {
      return {
        error:
          "You're submitting reviews too quickly. Please wait a moment and try again.",
      };
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
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}
