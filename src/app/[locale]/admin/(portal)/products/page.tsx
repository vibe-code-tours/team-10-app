/* eslint-disable @next/next/no-img-element */
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { Package, AlertTriangle, TrendingDown, Layers, Edit } from "lucide-react";
import ProductFilterBar from "@/components/admin/ProductFilterBar";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import { getTranslations } from "next-intl/server";

interface Props {
  searchParams: Promise<{
    search?: string;
    category?: string;
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
  const offset = (page - 1) * limit;

  // 1. Fetch lightweight statistics from all products
  const { data: allStats } = await supabase
    .from("products")
    .select("price, stock");

  const totalProducts = allStats?.length || 0;
  const outOfStock = allStats?.filter((p) => p.stock === 0).length || 0;
  const lowStock = allStats?.filter((p) => p.stock > 0 && p.stock < 10).length || 0;
  const totalStockSum = allStats?.reduce((sum, p) => sum + (p.stock || 0), 0) || 0;
  
  // Fetch categories from database categories table
  const { data: categoriesData } = await supabase
    .from("categories")
    .select("slug")
    .order("name", { ascending: true });
  const categories = categoriesData?.map((c) => c.slug) || [];

  // 2. Fetch filtered products list with exact count and pagination range
  let query = supabase.from("products").select("*", { count: "exact" });

  if (params.search) {
    query = query.ilike("title", `%${params.search}%`);
  }

  if (params.category) {
    query = query.eq("category", params.category);
  }

  if (params.stock) {
    if (params.stock === "out_of_stock") {
      query = query.eq("stock", 0);
    } else if (params.stock === "low_stock") {
      query = query.gt("stock", 0).lt("stock", 10);
    } else if (params.stock === "in_stock") {
      query = query.gte("stock", 10);
    }
  }

  // Apply sorting
  if (params.sort === "price_asc") {
    query = query.order("price", { ascending: true });
  } else if (params.sort === "price_desc") {
    query = query.order("price", { ascending: false });
  } else if (params.sort === "stock_asc") {
    query = query.order("stock", { ascending: true });
  } else if (params.sort === "stock_desc") {
    query = query.order("stock", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  // Apply pagination range
  query = query.range(offset, offset + limit - 1);

  const { data: products, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / limit) || 1;

  // Helper to construct pagination links
  const getPageLink = (pageNum: number) => {
    const newParams = new URLSearchParams();
    if (params.search) newParams.set("search", params.search);
    if (params.category) newParams.set("category", params.category);
    if (params.stock) newParams.set("stock", params.stock);
    if (params.sort && params.sort !== "newest") newParams.set("sort", params.sort);
    newParams.set("page", String(pageNum));
    return `/admin/products?${newParams.toString()}`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
      {/* Statistics Cards */}
      <div className="admin-stats-grid">
        {/* Card 1: Total Products */}
        <div className="admin-stat-card">
          <div className="admin-stat-info">
            <span className="admin-stat-label">{t("stats.totalProducts")}</span>
            <span className="admin-stat-value">{totalProducts}</span>
          </div>
          <div className="admin-stat-icon primary">
            <Package size={22} />
          </div>
        </div>

        {/* Card 2: Out of Stock */}
        <div className="admin-stat-card">
          <div className="admin-stat-info">
            <span className="admin-stat-label">{t("stats.outOfStock")}</span>
            <span className="admin-stat-value" style={{ color: outOfStock > 0 ? "var(--color-danger)" : "inherit" }}>
              {outOfStock}
            </span>
          </div>
          <div className="admin-stat-icon danger">
            <AlertTriangle size={22} />
          </div>
        </div>

        {/* Card 3: Low Stock Warning */}
        <div className="admin-stat-card">
          <div className="admin-stat-info">
            <span className="admin-stat-label">{t("stats.lowStock")}</span>
            <span className="admin-stat-value" style={{ color: lowStock > 0 ? "var(--color-warning)" : "inherit" }}>
              {lowStock}
            </span>
          </div>
          <div className="admin-stat-icon warning">
            <TrendingDown size={22} />
          </div>
        </div>

        {/* Card 4: Total Inventory Items */}
        <div className="admin-stat-card">
          <div className="admin-stat-info">
            <span className="admin-stat-label">{t("stats.totalInventory")}</span>
            <span className="admin-stat-value">{totalStockSum}</span>
          </div>
          <div className="admin-stat-icon success">
            <Layers size={22} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <ProductFilterBar key={JSON.stringify(params)} categories={categories} />

      {/* Table Section */}
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: "80px" }}>{t("table.image")}</th>
              <th>{t("table.product")}</th>
              <th>{t("table.category")}</th>
              <th>{t("table.price")}</th>
              <th>{t("table.stock")}</th>
              <th className="text-right" style={{ width: "120px" }}>{t("table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {!products || products.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-8 text-secondary" style={{ padding: "3rem" }}>
                  {t("table.noProducts")}
                </td>
              </tr>
            ) : (
              products.map((product) => {
                let stockBadgeClass = "badge-success";
                let stockStatusText = t("table.statusInStock");
                
                if (product.stock === 0) {
                  stockBadgeClass = "badge-danger";
                  stockStatusText = t("table.statusOutOfStock");
                } else if (product.stock < 10) {
                  stockBadgeClass = "badge-warning";
                  stockStatusText = t("table.statusLowStock");
                }

                return (
                  <tr key={product.id} className="table-row-hover">
                    <td>
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.title}
                          className="table-img"
                        />
                      ) : (
                        <div className="table-img-placeholder">ပုံမရှိပါ</div>
                      )}
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span className="font-bold" style={{ fontSize: "var(--font-size-base)", color: "var(--color-text)" }}>
                          {product.title}
                        </span>
                        {product.brand && (
                          <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
                            Brand: {product.brand}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="badge" style={{ background: "var(--color-bg-secondary)", color: "var(--color-text-secondary)", textTransform: "capitalize" }}>
                        {product.category}
                      </span>
                    </td>
                    <td className="font-bold" style={{ color: "var(--color-primary)" }}>
                      ${product.price.toFixed(2)}
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-start" }}>
                        <span className={`badge ${stockBadgeClass}`}>
                          {product.stock} {t("table.pcs")}
                        </span>
                        <span style={{ fontSize: "10px", color: "var(--color-text-tertiary)" }}>
                          {stockStatusText}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex justify-end gap-sm">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="btn btn-sm btn-secondary"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0.4rem",
                            borderRadius: "var(--radius-md)"
                          }}
                          title="Edit Product"
                        >
                          <Edit size={16} />
                        </Link>
                        <DeleteProductButton id={product.id} title={product.title} />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "var(--space-md)", background: "var(--color-surface)", padding: "var(--space-md)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-sm)" }}>
          {page > 1 ? (
            <Link href={getPageLink(page - 1)} className="btn btn-secondary btn-sm">
              &larr; {t("pagination.previous")}
            </Link>
          ) : (
            <button className="btn btn-secondary btn-sm" disabled style={{ opacity: 0.5, cursor: "not-allowed" }}>
              &larr; {t("pagination.previous")}
            </button>
          )}

          <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)", fontWeight: 500 }}>
            {t("pagination.pageOf", { page, totalPages })}
          </span>

          {page < totalPages ? (
            <Link href={getPageLink(page + 1)} className="btn btn-secondary btn-sm">
              {t("pagination.next")} &rarr;
            </Link>
          ) : (
            <button className="btn btn-secondary btn-sm" disabled style={{ opacity: 0.5, cursor: "not-allowed" }}>
              {t("pagination.next")} &rarr;
            </button>
          )}
        </div>
      )}
    </div>
  );
}
