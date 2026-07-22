"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/auth-helpers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const RateSchema = z.object({
  category: z.string().nullable(),
  rate: z.coerce.number().min(0).max(100),
});

export async function upsertCommissionRate(
  _prev: { error?: string; success?: boolean },
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Forbidden" };
  }

  const { user } = await requireAdmin();
  const supabase = await createClient();

  const categoryRaw = formData.get("category") as string;
  const parsed = RateSchema.safeParse({
    category:
      categoryRaw === "" || categoryRaw === "global" ? null : categoryRaw,
    rate: formData.get("rate"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase
    .from("commission_settings")
    .upsert(
      {
        category: parsed.data.category,
        rate: parsed.data.rate,
        updated_by: user.id,
      },
      { onConflict: "category" },
    );

  if (error) {
    console.error("upsertCommissionRate:", error);
    return { error: "Failed to save commission rate." };
  }

  revalidatePath("/admin/settings/commission");
  return { success: true };
}

export async function deleteCommissionRate(
  id: string,
): Promise<{ error?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Forbidden" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("commission_settings")
    .delete()
    .eq("id", id)
    .not("category", "is", null); // Protect global default from deletion

  if (error) {
    console.error("deleteCommissionRate:", error);
    return { error: "Failed to delete." };
  }

  revalidatePath("/admin/settings/commission");
  return {};
}
