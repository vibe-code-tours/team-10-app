import ProductForm from "@/components/admin/ProductForm";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  
  // Fetch product data
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!product) {
    notFound();
  }

  // Fetch all categories
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name", { ascending: true });

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] text-sm font-medium mb-4 inline-block"
        >
          &larr; Back to Products
        </Link>
        <h1 className="text-2xl font-bold">Edit Product</h1>
      </div>

      <ProductForm product={product} categories={categories || []} />
    </div>
  );
}
