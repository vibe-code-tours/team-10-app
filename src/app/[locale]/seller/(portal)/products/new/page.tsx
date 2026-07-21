import ProductForm from "@/components/admin/ProductForm";
import { Link } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";

export default async function SellerNewProductPage() {
  const supabase = await createClient();
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
        <h1 className="text-2xl font-bold">Add New Product</h1>
      </div>
      <ProductForm categories={categories || []} returnUrl="/seller/products" />
    </div>
  );
}
