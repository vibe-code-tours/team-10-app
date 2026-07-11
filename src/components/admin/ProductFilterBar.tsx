"use client";

import { useRouter, usePathname, Link } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, X, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProductFilterBarProps {
  categories: string[];
}

export default function ProductFilterBar({ categories }: ProductFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("Admin.products");

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [stock, setStock] = useState(searchParams.get("stock") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");


  const updateFilters = (updates: { search?: string; category?: string; stock?: string; sort?: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Process search
    if (updates.search !== undefined) {
      if (updates.search) params.set("search", updates.search);
      else params.delete("search");
    }
    
    // Process category
    if (updates.category !== undefined) {
      if (updates.category) params.set("category", updates.category);
      else params.delete("category");
    }

    // Process stock
    if (updates.stock !== undefined) {
      if (updates.stock) params.set("stock", updates.stock);
      else params.delete("stock");
    }

    // Process sort
    if (updates.sort !== undefined) {
      if (updates.sort && updates.sort !== "newest") params.set("sort", updates.sort);
      else params.delete("sort");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search });
  };

  const handleClear = () => {
    setSearch("");
    setCategory("");
    setStock("");
    setSort("newest");
    router.push(pathname);
  };

  const hasActiveFilters = 
    searchParams.get("search") || 
    searchParams.get("category") || 
    searchParams.get("stock") || 
    (searchParams.get("sort") && searchParams.get("sort") !== "newest");

  return (
    <div className="admin-filter-bar">
      {/* Select Box Grid */}
      <div className="admin-filter-selects">
        {/* Category Dropdown */}
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            updateFilters({ category: e.target.value });
          }}
          className="form-input"
        >
          <option value="">{t("filters.allCategories")}</option>
          {categories.map((cat) => (
            <option key={cat} value={cat} style={{ textTransform: "capitalize" }}>
              {cat}
            </option>
          ))}
        </select>

        {/* Stock Filter Dropdown */}
        <select
          value={stock}
          onChange={(e) => {
            setStock(e.target.value);
            updateFilters({ stock: e.target.value });
          }}
          className="form-input"
        >
          <option value="">{t("filters.allStock")}</option>
          <option value="in_stock">{t("filters.inStock")}</option>
          <option value="low_stock">{t("filters.lowStock")}</option>
          <option value="out_of_stock">{t("filters.outOfStock")}</option>
        </select>

        {/* Sort Filter Dropdown */}
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            updateFilters({ sort: e.target.value });
          }}
          className="form-input"
        >
          <option value="newest">{t("filters.sort.newest")}</option>
          <option value="price_asc">{t("filters.sort.priceAsc")}</option>
          <option value="price_desc">{t("filters.sort.priceDesc")}</option>
          <option value="stock_asc">{t("filters.sort.stockAsc")}</option>
          <option value="stock_desc">{t("filters.sort.stockDesc")}</option>
        </select>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="admin-filter-search">
        <span className="admin-filter-search-icon">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder={t("filters.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input"
          style={{ paddingLeft: "2.5rem" }}
        />
      </form>

      {/* Actions (Clear Filters & Add Product) */}
      <div style={{ display: "flex", gap: "var(--space-sm)", marginLeft: "auto", justifyContent: "flex-end" }} className="admin-filter-actions">
        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="btn btn-secondary flex items-center justify-center gap-xs"
            style={{ width: "auto" }}
          >
            <X size={16} /> {t("filters.clear")}
          </button>
        )}
        <Link
          href="/admin/products/new"
          className="btn btn-primary"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}
        >
          <Plus size={18} /> {t("addProduct")}
        </Link>
      </div>
    </div>
  );
}
