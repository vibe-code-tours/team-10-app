"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/auth-helpers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const PayoutSchema = z.object({
  seller_id: z.string().uuid(),
  amount: z.coerce.number().min(0),
  commission_deducted: z.coerce.number().min(0),
  net_amount: z.coerce.number().min(0),
  period_start: z.string().min(1),
  period_end: z.string().min(1),
  note: z.string().optional(),
});

export async function createPayout(
  _prev: { error?: string; success?: boolean },
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Forbidden" };
  }

  const parsed = PayoutSchema.safeParse({
    seller_id: formData.get("seller_id"),
    amount: formData.get("amount"),
    commission_deducted: formData.get("commission_deducted"),
    net_amount: formData.get("net_amount"),
    period_start: formData.get("period_start"),
    period_end: formData.get("period_end"),
    note: formData.get("note"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const adminClient = await createAdminClient();
  const { error } = await adminClient.from("seller_payouts").insert({
    ...parsed.data,
    status: "pending",
  });

  if (error) {
    console.error("createPayout:", error);
    return { error: "Failed to create payout record." };
  }

  revalidatePath("/admin/payouts");
  return { success: true };
}

export async function markPayoutPaid(
  payoutId: string,
  note?: string,
): Promise<{ error?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Forbidden" };
  }

  const adminClient = await createAdminClient();
  const { error } = await adminClient
    .from("seller_payouts")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
      note: note ?? null,
    })
    .eq("id", payoutId);

  if (error) {
    console.error("markPayoutPaid:", error);
    return { error: "Failed to mark payout as paid." };
  }

  revalidatePath("/admin/payouts");
  return {};
}
