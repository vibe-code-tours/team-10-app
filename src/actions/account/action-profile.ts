"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ProfileSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters long"),
  phoneNumber: z.string().trim().optional().or(z.literal("")),
  address: z.string().trim().optional().or(z.literal("")),
});

const PaymentMethodSchema = z.object({
  paymentMethod: z.string().trim().min(1, "Payment method is required"),
});

export async function updateProfile(formData: FormData) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("You must be logged in to update your profile.");
      return { error: "You must be logged in to update your profile." };
    }

    const parsed = ProfileSchema.safeParse({
      fullName: formData.get("full_name"),
      phoneNumber: formData.get("phone_number"),
      address: formData.get("address"),
    });

    if (!parsed.success) {
      return { error: parsed.error.issues[0].message };
    }

    const { fullName, phoneNumber, address } = parsed.data;

    const { error } = await supabase
      .from("users")
      .update({
        full_name: fullName,
        phone_number: phoneNumber,
        address: address,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      console.error("Profile update error:", error);
      return { error: "Failed to update profile." };
    }

    revalidatePath("/account/settings");
    revalidatePath("/account");
  } catch (err: unknown) {
    console.error("Profile update exception:", err);
    return { error: "An unexpected error occurred while updating profile." };
  }
  return { success: true };
}

export async function updatePaymentMethod(formData: FormData) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("You must be logged in to update your payment method.");
      return { error: "You must be logged in to update your payment method." };
    }

    const parsed = PaymentMethodSchema.safeParse({
      paymentMethod: formData.get("payment_method"),
    });

    if (!parsed.success) {
      return { error: parsed.error.issues[0].message };
    }

    const { paymentMethod } = parsed.data;

    const { error } = await supabase
      .from("users")
      .update({
        preferred_payment_method: paymentMethod,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      console.error("Payment method update error:", error);
      return { error: "Failed to update payment method." };
    }

    revalidatePath("/account/settings");
  } catch (err: unknown) {
    console.error("Payment method update exception:", err);
    return {
      error: "An unexpected error occurred while updating payment method.",
    };
  }
  return { success: true };
}
