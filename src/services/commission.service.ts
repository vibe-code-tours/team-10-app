import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Returns commission rate for a given category.
 * Falls back to global default (category IS NULL) if no category-specific rate exists.
 */
export async function getCommissionRate(
  supabase: SupabaseClient,
  category?: string,
): Promise<number> {
  if (category) {
    const { data } = await supabase
      .from("commission_settings")
      .select("rate")
      .eq("category", category)
      .single();
    if (data) return Number(data.rate);
  }

  // Global default
  const { data: global } = await supabase
    .from("commission_settings")
    .select("rate")
    .is("category", null)
    .single();

  return global ? Number(global.rate) : 5;
}

/**
 * Returns all commission settings (admin use).
 */
export async function getAllCommissionRates(supabase: SupabaseClient) {
  const { data } = await supabase
    .from("commission_settings")
    .select("*")
    .order("category", { ascending: true, nullsFirst: true });
  return data ?? [];
}
