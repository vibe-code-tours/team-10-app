"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("You must be logged in to update your profile.");
      return;
    }

    const fullName = formData.get("full_name") as string;
    const phoneNumber = formData.get("phone_number") as string;
    const address = formData.get("address") as string;

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
      console.error(error);
      return;
    }

    revalidatePath("/account/settings");
    revalidatePath("/account");
  } catch (err: any) {
    console.error(err);
  }
}

export async function updatePaymentMethod(formData: FormData) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("You must be logged in to update your payment method.");
      return;
    }

    const paymentMethod = formData.get("payment_method") as string;

    const { error } = await supabase
      .from("users")
      .update({
        preferred_payment_method: paymentMethod,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      console.error(error);
      return;
    }

    revalidatePath("/account/settings");
  } catch (err: any) {
    console.error(err);
  }
}
