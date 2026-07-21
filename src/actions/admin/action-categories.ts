"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/auth-helpers";
import { setCategoryImage } from "@/lib/category-image-store";
import { revalidatePath } from "next/cache";
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
  image_url: z.string().nullable().optional(),
});

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const adminSupabase = createAdminClient();

  let imageUrl: string | null = (formData.get("image_url") as string) || null;
  const imageFile = formData.get("category_image") as File | null;

  if (imageFile && imageFile.size > 0 && imageFile.name !== "undefined") {
    try {
      const ext = imageFile.name.split(".").pop() || "png";
      const filePath = `cat_${Date.now()}_${Math.floor(Math.random() * 1000)}.${ext}`;
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      const { error: uploadErr } = await adminSupabase.storage
        .from("category-images")
        .upload(filePath, buffer, {
          contentType: imageFile.type || "image/png",
          upsert: true,
        });

      if (!uploadErr) {
        const { data: publicUrlData } = adminSupabase.storage
          .from("category-images")
          .getPublicUrl(filePath);
        imageUrl = publicUrlData.publicUrl;
      }
    } catch (e) {
      console.warn("Error uploading category image:", e);
    }
  }

  const rawData = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    image_url: imageUrl,
  };

  const validatedData = CategorySchema.parse(rawData);

  // Store in category image map
  await setCategoryImage(validatedData.slug, imageUrl);

  let { error } = await adminSupabase.from("categories").insert(validatedData);

  // Fallback if image_url column does not exist on Supabase DB schema cache
  if (error && (error.code === "PGRST204" || error.message?.includes("image_url"))) {
    console.warn("image_url column missing in DB schema cache. Inserting name and slug only...");
    const fallbackData = { name: validatedData.name, slug: validatedData.slug };
    const { error: fallbackErr } = await adminSupabase.from("categories").insert(fallbackData);
    error = fallbackErr;
  }

  if (error) {
    console.error("Error creating category:", error);
    throw new Error(`Failed to create category: ${error.message}`);
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  await requireAdmin();
  const adminSupabase = createAdminClient();

  let imageUrl: string | null = (formData.get("image_url") as string) || null;
  const removeImage = formData.get("remove_image") === "true";

  if (removeImage) {
    imageUrl = null;
  }

  const imageFile = formData.get("category_image") as File | null;

  if (imageFile && imageFile.size > 0 && imageFile.name !== "undefined") {
    try {
      const ext = imageFile.name.split(".").pop() || "png";
      const filePath = `cat_${Date.now()}_${Math.floor(Math.random() * 1000)}.${ext}`;
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      const { error: uploadErr } = await adminSupabase.storage
        .from("category-images")
        .upload(filePath, buffer, {
          contentType: imageFile.type || "image/png",
          upsert: true,
        });

      if (!uploadErr) {
        const { data: publicUrlData } = adminSupabase.storage
          .from("category-images")
          .getPublicUrl(filePath);
        imageUrl = publicUrlData.publicUrl;
      }
    } catch (e) {
      console.warn("Error uploading category image:", e);
    }
  }

  const rawData = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    image_url: imageUrl,
  };

  const validatedData = CategorySchema.parse(rawData);

  // Update in persistent category image map
  await setCategoryImage(validatedData.slug, imageUrl);

  let { error } = await adminSupabase
    .from("categories")
    .update(validatedData)
    .eq("id", id);

  // Fallback if image_url column does not exist on Supabase DB schema cache
  if (error && (error.code === "PGRST204" || error.message?.includes("image_url"))) {
    console.warn("image_url column missing in DB schema cache. Updating name and slug only...");
    const fallbackData = { name: validatedData.name, slug: validatedData.slug };
    const { error: fallbackErr } = await adminSupabase
      .from("categories")
      .update(fallbackData)
      .eq("id", id);
    error = fallbackErr;
  }

  if (error) {
    console.error("Error updating category:", error);
    throw new Error(`Failed to update category: ${error.message}`);
  }

  revalidatePath("/admin/categories");
  revalidatePath(`/admin/categories/${validatedData.slug}/edit`);
  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  return { success: true };
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  const adminSupabase = createAdminClient();

  const { data: category } = await adminSupabase
    .from("categories")
    .select("slug")
    .eq("id", id)
    .single();

  if (category?.slug) {
    await setCategoryImage(category.slug, null);
  }

  const { error } = await adminSupabase.from("categories").delete().eq("id", id);

  if (error) {
    console.error("Error deleting category:", error);
    throw new Error(`Failed to delete category: ${error.message}`);
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  return { success: true };
}
