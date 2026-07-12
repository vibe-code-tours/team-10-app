import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SortDropdown from "@/components/shop/SortDropdown";
import ProductSidebar from "@/components/shop/ProductSidebar";
import Image from "next/image";
import {
  getProducts,
  getCategories,
  getCategoryCounts,
  getBrandCounts,
} from "@/services/product.service";

interface Props {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
    sort?: string;
    brand?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createClient();

  const page = Number(params.page ?? 1);
  const perPage = 12;

  // 1. Fetch filtered products
  const { data: products, count } = await getProducts(supabase, {
    search: params.search,
    category: params.category,
    brand: params.brand,
    sort: params.sort,
    page,
    limit: perPage,
  });

  const totalPages = Math.ceil((count ?? 0) / perPage);

  // 2. Fetch sidebar data
  const [
    dbCategories,
    { counts: categoryCounts, total: totalCount },
    { counts: brandCounts, total: totalBrandCount, uniqueBrands },
  ] = await Promise.all([
    getCategories(supabase),
    getCategoryCounts(supabase),
    getBrandCounts(supabase, params.category),
  ]);

  return (
    <div className="container section" id="products-page">
      <div className="section-header">
        <h1 className="section-title" style={{ textTransform: "capitalize" }}>
          {params.search
            ? `"${params.search}" ရှာဖွေမှု`
            : params.category
              ? `${params.category}`
              : "ပစ္စည်းအားလုံး"}
        </h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-md)",
          }}
        >
          <span
            className="text-secondary"
            style={{ fontSize: "var(--font-size-sm)" }}
          >
            {count ?? 0} ခု
          </span>
          <SortDropdown />
        </div>
      </div>

      <div className="products-layout-container">
        <ProductSidebar
          search={params.search}
          category={params.category}
          brand={params.brand}
          sort={params.sort}
          categories={dbCategories}
          categoryCounts={categoryCounts}
          totalCount={totalCount}
        />

        <div>
          {uniqueBrands.length > 0 && (
            <div className="brand-filters">
              <div className="brand-filters-title">
                {params.category === "computer"
                  ? "Computer Brands"
                  : params.category === "mobile"
                    ? "Mobile Brands"
                    : "Brands"}{" "}
                (Brand ဖြင့် စစ်ထုတ်ရန်)
              </div>
              <div className="brand-chips-container">
                <Link
                  href={`/products?category=${params.category}${params.sort ? `&sort=${params.sort}` : ""}`}
                  className={`brand-chip ${!params.brand ? "active" : ""}`}
                >
                  အားလုံး ({totalBrandCount})
                </Link>
                {uniqueBrands.map((b) => (
                  <Link
                    key={b}
                    href={`/products?category=${params.category}&brand=${b}${params.sort ? `&sort=${params.sort}` : ""}`}
                    className={`brand-chip ${params.brand === b ? "active" : ""}`}
                  >
                    {b} ({brandCounts[b]})
                  </Link>
                ))}
              </div>
            </div>
          )}

          {products && products.length > 0 ? (
            <>
              <div className="product-grid">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="product-card"
                    id={`product-${product.id}`}
                  >
                    <div
                      className="product-card-image"
                      style={{ position: "relative" }}
                    >
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "var(--color-bg-secondary)",
                            fontSize: "2rem",
                            color: "var(--color-text-tertiary)",
                          }}
                        >
                          ☐
                        </div>
                      )}
                      {product.category && (
                        <span className="product-card-category-badge">
                          {product.category}
                        </span>
                      )}
                    </div>
                    <div className="product-card-body">
                      <div className="product-card-name">{product.title}</div>
                      <div className="product-card-price">
                        ${Number(product.price).toFixed(2)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div
                  className="flex items-center justify-between"
                  style={{
                    marginTop: "var(--space-xl)",
                    gap: "var(--space-md)",
                  }}
                >
                  {page > 1 ? (
                    <Link
                      href={`/products?page=${page - 1}${params.category ? `&category=${params.category}` : ""}${params.search ? `&search=${params.search}` : ""}${params.sort ? `&sort=${params.sort}` : ""}${params.brand ? `&brand=${params.brand}` : ""}`}
                      className="btn btn-secondary btn-sm"
                    >
                      ← ယခင်
                    </Link>
                  ) : (
                    <div />
                  )}
                  <span
                    className="text-secondary"
                    style={{ fontSize: "var(--font-size-sm)" }}
                  >
                    စာမျက်နှာ {page} / {totalPages}
                  </span>
                  {page < totalPages ? (
                    <Link
                      href={`/products?page=${page + 1}${params.category ? `&category=${params.category}` : ""}${params.search ? `&search=${params.search}` : ""}${params.sort ? `&sort=${params.sort}` : ""}${params.brand ? `&brand=${params.brand}` : ""}`}
                      className="btn btn-secondary btn-sm"
                    >
                      နောက် →
                    </Link>
                  ) : (
                    <div />
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-state-title">ပစ္စည်းရှာမတွေ့ပါ</div>
              <div className="empty-state-desc">ရှာဖွေမှုကိုပြောင်းကြည့်ပါ</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
