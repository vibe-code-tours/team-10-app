"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdminOrSeller } from "@/lib/supabase/auth-helpers";
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
  const { user } = await requireAdminOrSeller();
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
    .insert({ ...validatedData, seller_id: user.id });

  if (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product. Please try again.");
  }

  const returnUrl = formData.get("returnUrl") as string | null;

  revalidatePath("/admin/products");
  revalidatePath("/products");

  if (returnUrl) {
    redirect(returnUrl);
  } else {
    redirect("/admin/products");
  }
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdminOrSeller();
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

  const returnUrl = formData.get("returnUrl") as string | null;

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}/edit`);
  revalidatePath("/products");

  if (returnUrl) {
    redirect(returnUrl);
  } else {
    redirect("/admin/products");
  }
}

export async function deleteProduct(id: string) {
  await requireAdminOrSeller();
  const supabase = await createClient();

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product. Please try again.");
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function deleteProducts(ids: string[]) {
  await requireAdminOrSeller();
  const supabase = await createClient();

  const { error } = await supabase.from("products").delete().in("id", ids);

  if (error) {
    console.error("Error deleting products:", error);
    throw new Error("Failed to delete products. Please try again.");
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
}
