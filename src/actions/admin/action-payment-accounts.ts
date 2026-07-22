"use server";

import { requireAdmin } from "@/lib/supabase/auth-helpers";
import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type PaymentAccount = {
  id: string;
  provider: string;
  icon?: string | null;
  account_name: string;
  account_number: string;
  qr_code_url?: string | null;
  instructions?: string | null;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

/**
 * Fetch all payment accounts (Admin view)
 */
export async function getPaymentAccounts(): Promise<PaymentAccount[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("payment_accounts")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching payment accounts:", error);
      return [];
    }

    return (data || []) as PaymentAccount[];
  } catch (err) {
    console.error("Failed to fetch payment accounts:", err);
    return [];
  }
}

/**
 * Create a new Payment Account
 */
export async function createPaymentAccount(formData: FormData) {
  try {
    await requireAdmin();

    const provider = formData.get("provider") as string;
    const icon = (formData.get("icon") as string) || null;
    const account_name = formData.get("account_name") as string;
    const account_number = formData.get("account_number") as string;
    const qr_code_url = (formData.get("qr_code_url") as string) || null;
    const instructions = (formData.get("instructions") as string) || null;
    const is_active = formData.get("is_active") === "true";
    const sort_order = parseInt((formData.get("sort_order") as string) || "0", 10);

    if (!provider || !account_name || !account_number) {
      return { error: "Provider, Account Name, and Account Number are required." };
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from("payment_accounts").insert({
      provider,
      icon,
      account_name,
      account_number,
      qr_code_url,
      instructions,
      is_active,
      sort_order,
    });

    if (error) {
      console.error("Failed to create payment account:", error);
      if (error.code === "PGRST205" || error.message?.includes("payment_accounts")) {
        return {
          error:
            "Database table 'payment_accounts' is missing on Supabase. Please copy the SQL migration script from the top banner and run it in your Supabase SQL Editor.",
        };
      }
      return { error: `Database Error: ${error.message}` };
    }

    revalidatePath("/admin/settings/payments");
    revalidatePath("/admin/payments");
    revalidatePath("/checkout");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unauthorized or server error";
    return { error: message };
  }
}

/**
 * Update an existing Payment Account
 */
export async function updatePaymentAccount(id: string, formData: FormData) {
  try {
    await requireAdmin();

    if (!id) return { error: "Payment Account ID is required" };

    const provider = formData.get("provider") as string;
    const icon = (formData.get("icon") as string) || null;
    const account_name = formData.get("account_name") as string;
    const account_number = formData.get("account_number") as string;
    const qr_code_url = (formData.get("qr_code_url") as string) || null;
    const instructions = (formData.get("instructions") as string) || null;
    const is_active = formData.get("is_active") === "true";
    const sort_order = parseInt((formData.get("sort_order") as string) || "0", 10);

    if (!provider || !account_name || !account_number) {
      return { error: "Provider, Account Name, and Account Number are required." };
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("payment_accounts")
      .update({
        provider,
        icon,
        account_name,
        account_number,
        qr_code_url,
        instructions,
        is_active,
        sort_order,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Failed to update payment account:", error);
      if (error.code === "PGRST205" || error.message?.includes("payment_accounts")) {
        return {
          error:
            "Database table 'payment_accounts' is missing on Supabase. Please copy the SQL migration script from the top banner and run it in your Supabase SQL Editor.",
        };
      }
      return { error: `Database Error: ${error.message}` };
    }

    revalidatePath("/admin/settings/payments");
    revalidatePath("/admin/payments");
    revalidatePath("/checkout");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unauthorized or server error";
    return { error: message };
  }
}

/**
 * Fast Toggle Payment Account Active/Inactive status
 */
export async function togglePaymentAccountActive(id: string, is_active: boolean) {
  try {
    await requireAdmin();

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("payment_accounts")
      .update({ is_active, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("Failed to toggle payment account status:", error);
      return { error: `Database Error: ${error.message}` };
    }

    revalidatePath("/admin/settings/payments");
    revalidatePath("/admin/payments");
    revalidatePath("/checkout");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unauthorized error";
    return { error: message };
  }
}

/**
 * Delete a Payment Account
 */
export async function deletePaymentAccount(id: string) {
  try {
    await requireAdmin();

    const supabase = createAdminClient();
    const { error } = await supabase.from("payment_accounts").delete().eq("id", id);

    if (error) {
      console.error("Failed to delete payment account:", error);
      return { error: `Database Error: ${error.message}` };
    }

    revalidatePath("/admin/settings/payments");
    revalidatePath("/admin/payments");
    revalidatePath("/checkout");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unauthorized error";
    return { error: message };
  }
}
