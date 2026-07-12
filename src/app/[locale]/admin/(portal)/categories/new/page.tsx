import CategoryForm from "@/components/admin/CategoryForm";
import Link from "next/link";

export default function NewCategoryPage() {
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
        <h1 className="admin-page-title">Add New Category</h1>
      </div>

      <CategoryForm />
    </div>
  );
}
