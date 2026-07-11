/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SortDropdown from "@/components/shop/SortDropdown";

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
  const offset = (page - 1) * perPage;

  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .range(offset, offset + perPage - 1);

  if (params.search) {
    query = query.ilike("title", `%${params.search}%`);
  }

  if (params.category) {
    query = query.eq("category", params.category);
  }

  if (params.brand) {
    query = query.eq("brand", params.brand);
  }

  // Apply sorting
  if (params.sort === "price_asc") {
    query = query.order("price", { ascending: true });
  } else if (params.sort === "price_desc") {
    query = query.order("price", { ascending: false });
  } else {
    // Default to newest
    query = query.order("created_at", { ascending: false });
  }

  const { data: products, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / perPage);

  // Fetch dynamic categories list from categories database table
  const { data: dbCategories } = await supabase
    .from("categories")
    .select("name, slug")
    .order("name", { ascending: true });

  // Fetch product category counts
  const { data: allProducts } = await supabase
    .from("products")
    .select("category");

  const categoryCounts: Record<string, number> = {};
  let totalCount = 0;

  if (allProducts) {
    allProducts.forEach((p) => {
      if (p.category) {
        categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
        totalCount++;
      }
    });
  }

  // Fetch unique brands and counts dynamically for the selected category
  const brandCounts: Record<string, number> = {};
  let totalBrandCount = 0;

  if (params.category) {
    const { data: brandProducts } = await supabase
      .from("products")
      .select("brand")
      .eq("category", params.category);

    if (brandProducts) {
      brandProducts.forEach((p) => {
        if (p.brand) {
          brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
          totalBrandCount++;
        }
      });
    }
  }

  const uniqueBrands = Object.keys(brandCounts).sort();

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
        <aside className="products-sidebar">
          <form
            action="/products"
            method="GET"
            style={{ marginBottom: "var(--space-lg)" }}
          >
            <input
              type="search"
              name="search"
              className="form-input"
              placeholder="ရှာဖွေရန်..."
              defaultValue={params.search ?? ""}
              id="search-input"
              style={{ width: "100%" }}
            />
            {params.category && (
              <input type="hidden" name="category" value={params.category} />
            )}
            {params.brand && (
              <input type="hidden" name="brand" value={params.brand} />
            )}
            {params.sort && (
              <input type="hidden" name="sort" value={params.sort} />
            )}
          </form>

          <h3 className="products-sidebar-title">
            အမျိုးအစား
          </h3>
          <ul className="category-filter-list">
            <li className="category-filter-item">
              <Link
                href={`/products${params.sort ? `?sort=${params.sort}` : ""}`}
                className={`category-filter-link ${!params.category ? "active" : ""}`}
              >
                အားလုံး ({totalCount})
              </Link>
            </li>
            {dbCategories?.map((cat) => (
              <li key={cat.slug} className="category-filter-item">
                <Link
                  href={`/products?category=${cat.slug}${params.sort ? `&sort=${params.sort}` : ""}`}
                  className={`category-filter-link ${params.category === cat.slug ? "active" : ""}`}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <span style={{ textTransform: "capitalize" }}>{cat.name}</span>
                  <span style={{ fontSize: "var(--font-size-xs)", opacity: 0.7, marginLeft: "var(--space-xs)" }}>
                    ({categoryCounts[cat.slug] || 0})
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div>
          {uniqueBrands.length > 0 && (
            <div className="brand-filters">
              <div className="brand-filters-title">
                {params.category === "computer" ? "Computer Brands" : params.category === "mobile" ? "Mobile Brands" : "Brands"} (Brand ဖြင့် စစ်ထုတ်ရန်)
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
                {products.map((product) => {
                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="product-card"
                      id={`product-${product.id}`}
                    >
                      <div className="product-card-image">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.title}
                            loading="lazy"
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
                        <div className="product-card-name">
                          {product.title}
                        </div>
                        <div className="product-card-price">
                          ${Number(product.price).toFixed(2)}
                        </div>
                      </div>
                    </Link>
                  );
                })}
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
