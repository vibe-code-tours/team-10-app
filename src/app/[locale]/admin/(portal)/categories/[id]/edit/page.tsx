import CategoryForm from "@/components/admin/CategoryForm";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!category) {
    notFound();
  }

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
        <h1 className="admin-page-title">Edit Category</h1>
      </div>

      <CategoryForm category={category} />
    </div>
  );
}
