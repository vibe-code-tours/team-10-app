import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Plus, Edit } from "lucide-react";
import DeleteCategoryButton from "@/components/admin/DeleteCategoryButton";
import { getTranslations } from "next-intl/server";

import { getCategoryImageMap, resolveCategoryImage } from "@/lib/category-image-store";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const t = await getTranslations("Admin.categories");
  const categoryMap = await getCategoryImageMap();

  // Fetch categories from database
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-md)",
      }}
    >
      {/* Page Header */}
      <div className="admin-header" style={{ justifyContent: "flex-end" }}>
        <Link
          href="/admin/categories/new"
          className="btn btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <Plus size={18} /> {t("addCategory")}
        </Link>
      </div>

      {/* Table Section */}
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: "70px" }}>IMAGE</th>
              <th>{t("table.name")}</th>
              <th>{t("table.slug")}</th>
              <th>{t("table.dateCreated")}</th>
              <th className="text-right" style={{ width: "120px" }}>
                {t("table.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {!categories || categories.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center p-8 text-secondary"
                  style={{ padding: "3rem" }}
                >
                  {t("table.noCategories")}
                </td>
              </tr>
            ) : (
              categories.map((category) => {
                const displayImg = resolveCategoryImage(category, categoryMap);

                return (
                  <tr key={category.id} className="table-row-hover">
                    <td>
                      <Image
                        src={displayImg}
                        alt={category.name}
                        width={40}
                        height={40}
                        style={{
                          borderRadius: "8px",
                          objectFit: "cover",
                          border: "1px solid var(--color-border)",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
                        }}
                      />
                    </td>
                  <td
                    className="font-bold"
                    style={{ color: "var(--color-text)" }}
                  >
                    <span>{category.name}</span>
                  </td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        background: "var(--color-bg-secondary)",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      {category.slug}
                    </span>
                  </td>
                  <td style={{ color: "var(--color-text-secondary)" }}>
                    {category.created_at
                      ? new Date(category.created_at).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    <div className="flex justify-end gap-sm">
                      <Link
                        href={`/admin/categories/${category.slug || category.id}/edit`}
                        className="btn btn-sm btn-secondary"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "0.4rem",
                          borderRadius: "var(--radius-md)",
                        }}
                        title="Edit Category"
                      >
                        <Edit size={16} />
                      </Link>
                      <DeleteCategoryButton
                        id={category.id}
                        name={category.name}
                      />
                    </div>
                  </td>
                </tr>
              );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
