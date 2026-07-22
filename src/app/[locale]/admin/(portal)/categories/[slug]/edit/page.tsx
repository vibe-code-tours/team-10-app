import CategoryForm from "@/components/admin/CategoryForm";
import { createClient } from "@/lib/supabase/server";
import { getCategoryImageMap } from "@/lib/category-image-store";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const identifier = resolvedParams.slug;
  const supabase = await createClient();
  const categoryMap = await getCategoryImageMap();

  // Try finding by slug first, then fallback to id
  let { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", identifier)
    .maybeSingle();

  if (!category) {
    const { data: catById } = await supabase
      .from("categories")
      .select("*")
      .eq("id", identifier)
      .maybeSingle();
    category = catById;
  }

  if (!category) {
    notFound();
  }

  const slugKey = (category.slug || category.name || "").toLowerCase();
  const categoryWithImage = {
    ...category,
    image_url: category.image_url || categoryMap[slugKey] || null,
  };

  return (
    <div>
      <div className="mb-6" style={{ marginBottom: "var(--space-lg)" }}>
        <Link
          href="/admin/categories"
          className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] text-sm font-medium mb-4 inline-block"
          style={{
            textDecoration: "none",
            display: "inline-block",
            marginBottom: "var(--space-md)",
          }}
        >
          &larr; Back to Categories
        </Link>
        <h1 className="admin-page-title">Edit Category: {category.name}</h1>
      </div>

      <CategoryForm category={categoryWithImage} />
    </div>
  );
}
