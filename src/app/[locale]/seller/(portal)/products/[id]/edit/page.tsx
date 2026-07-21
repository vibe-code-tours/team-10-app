import ProductForm from "@/components/admin/ProductForm";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { notFound, redirect } from "next/navigation";

export default async function SellerEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("seller_id", user.id) // sellers can only edit own products
    .single();

  if (!product) notFound();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name", { ascending: true });

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/seller/products"
          className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] text-sm font-medium mb-4 inline-block"
        >
          &larr; Back to My Products
        </Link>
        <h1 className="text-2xl font-bold">Edit Product</h1>
      </div>
      <ProductForm
        product={product}
        categories={categories || []}
        returnUrl="/seller/products"
      />
    </div>
  );
}
