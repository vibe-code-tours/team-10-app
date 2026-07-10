import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SortDropdown from "@/components/shop/SortDropdown";

interface Props {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
    sort?: string;
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

  // Fetch unique categories dynamically from products
  const { data: allProducts } = await supabase
    .from("products")
    .select("category");
  const uniqueCategories = Array.from(
    new Set(allProducts?.map((p) => p.category).filter(Boolean)),
  ) as string[];

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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "180px 1fr",
          gap: "var(--space-xl)",
        }}
      >
        <aside>
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
            {params.sort && (
              <input type="hidden" name="sort" value={params.sort} />
            )}
          </form>

          <h3
            style={{
              fontSize: "var(--font-size-xs)",
              fontWeight: 500,
              color: "var(--color-text-tertiary)",
              marginBottom: "var(--space-sm)",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            အမျိုးအစား
          </h3>
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-xs)",
            }}
          >
            <li>
              <Link
                href={`/products${params.sort ? `?sort=${params.sort}` : ""}`}
                style={{
                  fontSize: "var(--font-size-sm)",
                  fontWeight: !params.category ? 600 : 400,
                  color: !params.category
                    ? "var(--color-text)"
                    : "var(--color-text-secondary)",
                }}
              >
                အားလုံး
              </Link>
            </li>
            {uniqueCategories.map((cat) => (
              <li key={cat}>
                <Link
                  href={`/products?category=${cat}${params.sort ? `&sort=${params.sort}` : ""}`}
                  style={{
                    textTransform: "capitalize",
                    fontSize: "var(--font-size-sm)",
                    fontWeight: params.category === cat ? 600 : 400,
                    color:
                      params.category === cat
                        ? "var(--color-text)"
                        : "var(--color-text-secondary)",
                  }}
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div>
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
                      </div>
                      <div className="product-card-body">
                        <div
                          className="product-card-name"
                          style={{ marginBottom: "var(--space-xs)" }}
                        >
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
                      href={`/products?page=${page - 1}${params.category ? `&category=${params.category}` : ""}${params.search ? `&search=${params.search}` : ""}${params.sort ? `&sort=${params.sort}` : ""}`}
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
                      href={`/products?page=${page + 1}${params.category ? `&category=${params.category}` : ""}${params.search ? `&search=${params.search}` : ""}${params.sort ? `&sort=${params.sort}` : ""}`}
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
