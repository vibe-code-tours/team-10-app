"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/auth-helpers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const CategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must only contain lowercase letters, numbers, and hyphens",
    ),
});

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const rawData = {
    name: formData.get("name"),
    slug: formData.get("slug"),
  };

  const validatedData = CategorySchema.parse(rawData);

  const { error } = await supabase.from("categories").insert(validatedData);

  if (error) {
    console.error("Error creating category:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/categories");
}

export async function updateCategory(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const rawData = {
    name: formData.get("name"),
    slug: formData.get("slug"),
  };

  const validatedData = CategorySchema.parse(rawData);

  const { error } = await supabase
    .from("categories")
    .update(validatedData)
    .eq("id", id);

  if (error) {
    console.error("Error updating category:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/categories");
  revalidatePath(`/admin/categories/${id}/edit`);
  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    console.error("Error deleting category:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/products");
}
