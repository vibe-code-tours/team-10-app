"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/auth-helpers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const ProductSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  stock: z.coerce.number().int().min(0, "Stock must be a positive integer"),
  category: z.string().min(2, "Category is required"),
  image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    category: formData.get("category"),
    image_url: formData.get("image_url"),
  };

  const validatedData = ProductSchema.parse(rawData);

  const { error } = await supabase.from("products").insert(validatedData);

  if (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product. Please try again.");
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    category: formData.get("category"),
    image_url: formData.get("image_url"),
  };

  const validatedData = ProductSchema.parse(rawData);

  const { error } = await supabase
    .from("products")
    .update(validatedData)
    .eq("id", id);

  if (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product. Please try again.");
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}/edit`);
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product. Please try again.");
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
}
