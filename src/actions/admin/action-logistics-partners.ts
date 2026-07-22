"use server";

import { requireAdmin } from "@/lib/supabase/auth-helpers";
import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type LogisticsPartner = {
  id: string;
  name: string;
  badge_color?: string | null;
  icon_type?: "emoji" | "lucide_icon" | "image" | string | null;
  icon_value?: string | null;
  tracking_url_template?: string | null;
  description?: string | null;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

/**
 * Fetch all logistics partners (Admin view)
 */
export async function getLogisticsPartners(): Promise<LogisticsPartner[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("logistics_partners")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching logistics partners:", error);
      return [];
    }

    return (data || []) as LogisticsPartner[];
  } catch (err) {
    console.error("Failed to fetch logistics partners:", err);
    return [];
  }
}

/**
 * Create a new Logistics Partner
 */
export async function createLogisticsPartner(formData: FormData) {
  try {
    await requireAdmin();

    const name = formData.get("name") as string;
    const badge_color = (formData.get("badge_color") as string) || "#0284c7";
    const icon_type = (formData.get("icon_type") as string) || "emoji";
    const icon_value = (formData.get("icon_value") as string) || "🚚";
    const tracking_url_template = (formData.get("tracking_url_template") as string) || null;
    const description = (formData.get("description") as string) || null;
    const is_active = formData.get("is_active") === "true";
    const sort_order = parseInt((formData.get("sort_order") as string) || "0", 10);

    if (!name) {
      return { error: "Partner name is required." };
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from("logistics_partners").insert({
      name,
      badge_color,
      icon_type,
      icon_value,
      tracking_url_template,
      description,
      is_active,
      sort_order,
    });

    if (error) {
      console.error("Failed to create logistics partner:", error);
      if (error.code === "PGRST205" || error.message?.includes("logistics_partners")) {
        return {
          error:
            "Database table 'logistics_partners' is missing on Supabase. Please copy the SQL migration script from the top banner and run it in your Supabase SQL Editor.",
        };
      }
      return { error: `Database Error: ${error.message}` };
    }

    revalidatePath("/admin/logistics");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unauthorized or server error";
    return { error: message };
  }
}

/**
 * Update an existing Logistics Partner
 */
export async function updateLogisticsPartner(id: string, formData: FormData) {
  try {
    await requireAdmin();

    if (!id) return { error: "Logistics Partner ID is required" };

    const name = formData.get("name") as string;
    const badge_color = (formData.get("badge_color") as string) || "#0284c7";
    const icon_type = (formData.get("icon_type") as string) || "emoji";
    const icon_value = (formData.get("icon_value") as string) || "🚚";
    const tracking_url_template = (formData.get("tracking_url_template") as string) || null;
    const description = (formData.get("description") as string) || null;
    const is_active = formData.get("is_active") === "true";
    const sort_order = parseInt((formData.get("sort_order") as string) || "0", 10);

    if (!name) {
      return { error: "Partner name is required." };
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("logistics_partners")
      .update({
        name,
        badge_color,
        icon_type,
        icon_value,
        tracking_url_template,
        description,
        is_active,
        sort_order,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Failed to update logistics partner:", error);
      if (error.code === "PGRST205" || error.message?.includes("logistics_partners")) {
        return {
          error:
            "Database table 'logistics_partners' is missing on Supabase. Please copy the SQL migration script from the top banner and run it in your Supabase SQL Editor.",
        };
      }
      return { error: `Database Error: ${error.message}` };
    }

    revalidatePath("/admin/logistics");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unauthorized or server error";
    return { error: message };
  }
}

/**
 * Fast Toggle Logistics Partner Active/Inactive status
 */
export async function toggleLogisticsPartnerActive(id: string, is_active: boolean) {
  try {
    await requireAdmin();

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("logistics_partners")
      .update({ is_active, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("Failed to toggle logistics partner status:", error);
      return { error: `Database Error: ${error.message}` };
    }

    revalidatePath("/admin/logistics");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unauthorized error";
    return { error: message };
  }
}

/**
 * Delete a Logistics Partner
 */
export async function deleteLogisticsPartner(id: string) {
  try {
    await requireAdmin();

    const supabase = createAdminClient();
    const { error } = await supabase.from("logistics_partners").delete().eq("id", id);

    if (error) {
      console.error("Failed to delete logistics partner:", error);
      return { error: `Database Error: ${error.message}` };
    }

    revalidatePath("/admin/logistics");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unauthorized error";
    return { error: message };
  }
}
