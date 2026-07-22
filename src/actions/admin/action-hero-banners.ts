"use server";

import { requireAdmin } from "@/lib/supabase/auth-helpers";
import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type HeroBanner = {
  id: string;
  banner_type: "main_slider" | "side_top" | "side_bottom" | string;
  title: string;
  subtitle?: string | null;
  badge?: string | null;
  image_url: string;
  target_link?: string | null;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

/**
 * Fetch all hero banners
 */
export async function getHeroBanners(): Promise<HeroBanner[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("hero_banners")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching hero banners:", error);
      return [];
    }

    return (data || []) as HeroBanner[];
  } catch (err) {
    console.error("Failed to fetch hero banners:", err);
    return [];
  }
}

/**
 * Create a new hero banner (Admin)
 */
export async function createHeroBanner(payload: {
  banner_type: string;
  title: string;
  subtitle?: string;
  badge?: string;
  image_url: string;
  target_link?: string;
  is_active?: boolean;
  sort_order?: number;
}): Promise<{ success: boolean; data?: HeroBanner; error?: string }> {
  try {
    await requireAdmin();
    const supabase = createAdminClient();

    const newBanner = {
      banner_type: payload.banner_type || "main_slider",
      title: payload.title.trim(),
      subtitle: payload.subtitle?.trim() || "",
      badge: payload.badge?.trim() || "",
      image_url: payload.image_url.trim(),
      target_link: payload.target_link?.trim() || "/en/categories",
      is_active: payload.is_active ?? true,
      sort_order: payload.sort_order ?? 0,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("hero_banners")
      .insert([newBanner])
      .select()
      .single();

    if (error) {
      console.error("Error creating hero banner:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/[locale]", "page");
    revalidatePath("/[locale]/admin/banners", "page");

    return { success: true, data: data as HeroBanner };
  } catch (err: unknown) {
    console.error("Failed to create hero banner:", err);
    return { success: false, error: (err as Error).message || "Failed to create hero banner" };
  }
}

/**
 * Update an existing hero banner (Admin)
 */
export async function updateHeroBanner(
  id: string,
  payload: {
    banner_type?: string;
    title?: string;
    subtitle?: string;
    badge?: string;
    image_url?: string;
    target_link?: string;
    is_active?: boolean;
    sort_order?: number;
  }
): Promise<{ success: boolean; data?: HeroBanner; error?: string }> {
  try {
    await requireAdmin();
    const supabase = createAdminClient();

    const updateData: Record<string, string | number | boolean> = {
      updated_at: new Date().toISOString(),
    };

    if (payload.banner_type !== undefined) updateData.banner_type = payload.banner_type;
    if (payload.title !== undefined) updateData.title = payload.title.trim();
    if (payload.subtitle !== undefined) updateData.subtitle = payload.subtitle.trim();
    if (payload.badge !== undefined) updateData.badge = payload.badge.trim();
    if (payload.image_url !== undefined) updateData.image_url = payload.image_url.trim();
    if (payload.target_link !== undefined) updateData.target_link = payload.target_link.trim();
    if (payload.is_active !== undefined) updateData.is_active = payload.is_active;
    if (payload.sort_order !== undefined) updateData.sort_order = payload.sort_order;

    const { data, error } = await supabase
      .from("hero_banners")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating hero banner:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/[locale]", "page");
    revalidatePath("/[locale]/admin/banners", "page");

    return { success: true, data: data as HeroBanner };
  } catch (err: unknown) {
    console.error("Failed to update hero banner:", err);
    return { success: false, error: (err as Error).message || "Failed to update hero banner" };
  }
}

/**
 * Toggle hero banner active status (Admin)
 */
export async function toggleHeroBannerActive(
  id: string,
  is_active: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
    const supabase = createAdminClient();

    const { error } = await supabase
      .from("hero_banners")
      .update({ is_active, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("Error toggling hero banner active status:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/[locale]", "page");
    revalidatePath("/[locale]/admin/banners", "page");

    return { success: true };
  } catch (err: unknown) {
    console.error("Failed to toggle hero banner active status:", err);
    return { success: false, error: (err as Error).message || "Failed to toggle active status" };
  }
}

/**
 * Delete a hero banner (Admin)
 */
export async function deleteHeroBanner(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
    const supabase = createAdminClient();

    const { error } = await supabase.from("hero_banners").delete().eq("id", id);

    if (error) {
      console.error("Error deleting hero banner:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/[locale]", "page");
    revalidatePath("/[locale]/admin/banners", "page");

    return { success: true };
  } catch (err: unknown) {
    console.error("Failed to delete hero banner:", err);
    return { success: false, error: (err as Error).message || "Failed to delete banner" };
  }
}
