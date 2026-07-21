/* eslint-disable @next/next/no-img-element */
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { Edit } from "lucide-react";
import ProductFilterBar from "@/components/admin/ProductFilterBar";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import ProductTableClient from "@/components/admin/ProductTableClient";
import ProductStats from "@/components/admin/ProductStats";
import { getTranslations } from "next-intl/server";
import {
  getAdminProductStats,
  getProducts,
  getCategories,
  getBrandCounts,
} from "@/services/product.service";

interface Props {
  searchParams: Promise<{
    search?: string;
    category?: string;
    brand?: string;
    stock?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createClient();
  const t = await getTranslations("Admin.products");

  const page = Number(params.page ?? 1);
  const limit = 10;

  // 1. Fetch lightweight statistics from all products
  const stats = await getAdminProductStats(supabase);

  // Fetch categories from database categories table
  const dbCategories = await getCategories(supabase);
  const categories = dbCategories.map((c) => c.slug);

  // Fetch unique brands for the current category
  const { uniqueBrands } = await getBrandCounts(supabase, params.category);

  // 2. Fetch filtered products list
  const { data: products, count } = await getProducts(supabase, {
    search: params.search,
    category: params.category,
    brand: params.brand,
    stock: params.stock,
    sort: params.sort,
    page,
    limit,
  });

  const totalPages = Math.ceil((count ?? 0) / limit) || 1;

  // Helper to construct pagination links
  const getPageLink = (pageNum: number) => {
    const newParams = new URLSearchParams();
    if (params.search) newParams.set("search", params.search);
    if (params.category) newParams.set("category", params.category);
    if (params.brand) newParams.set("brand", params.brand);
    if (params.stock) newParams.set("stock", params.stock);
    if (params.sort && params.sort !== "newest")
      newParams.set("sort", params.sort);
    newParams.set("page", String(pageNum));
    return `/admin/products?${newParams.toString()}`;
  };

  const currentQueryString = getPageLink(page).replace("/admin/products", "");

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-md)",
      }}
    >
      {/* Statistics Cards */}
      <ProductStats {...stats} />

      {/* Filter and Search Bar */}
      <ProductFilterBar
        key={JSON.stringify(params)}
        categories={categories}
        brands={uniqueBrands}
      />

      {/* Table Section */}
      <ProductTableClient
        products={products || []}
        currentQueryString={currentQueryString}
      />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "var(--space-md)",
            background: "var(--color-surface)",
            padding: "var(--space-md)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {page > 1 ? (
            <Link
              href={getPageLink(page - 1)}
              className="btn btn-secondary btn-sm"
            >
              &larr; {t("pagination.previous")}
            </Link>
          ) : (
            <button
              className="btn btn-secondary btn-sm"
              disabled
              style={{ opacity: 0.5, cursor: "not-allowed" }}
            >
              &larr; {t("pagination.previous")}
            </button>
          )}

          <div
            style={{
              display: "flex",
              gap: "var(--space-xs)",
              alignItems: "center",
            }}
          >
            {getPageNumbers().map((p, i) =>
              p === "..." ? (
                <span
                  key={`ellipsis-${i}`}
                  style={{
                    color: "var(--color-text-secondary)",
                    padding: "0 8px",
                  }}
                >
                  ...
                </span>
              ) : (
                <Link
                  key={`page-${p}`}
                  href={getPageLink(p as number)}
                  className={`btn btn-sm ${page === p ? "btn-primary" : "btn-ghost"}`}
                  style={{
                    minWidth: "32px",
                    display: "flex",
                    justifyContent: "center",
                    fontWeight: page === p ? 600 : 400,
                  }}
                >
                  {p}
                </Link>
              ),
            )}
          </div>

          {page < totalPages ? (
            <Link
              href={getPageLink(page + 1)}
              className="btn btn-secondary btn-sm"
            >
              {t("pagination.next")} &rarr;
            </Link>
          ) : (
            <button
              className="btn btn-secondary btn-sm"
              disabled
              style={{ opacity: 0.5, cursor: "not-allowed" }}
            >
              {t("pagination.next")} &rarr;
            </button>
          )}
        </div>
      )}
    </div>
  );
}
