import { Link } from "@/i18n/routing";

interface Category {
  slug: string;
  name: string;
}

interface Props {
  search?: string;
  category?: string;
  brand?: string;
  sort?: string;
  categories: Category[];
  categoryCounts: Record<string, number>;
  totalCount: number;
}

export default function ProductSidebar({
  search,
  category,
  brand,
  sort,
  categories,
  categoryCounts,
  totalCount,
}: Props) {
  return (
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
          defaultValue={search ?? ""}
          id="search-input"
          style={{ width: "100%" }}
        />
        {category && <input type="hidden" name="category" value={category} />}
        {brand && <input type="hidden" name="brand" value={brand} />}
        {sort && <input type="hidden" name="sort" value={sort} />}
      </form>

      <h3 className="products-sidebar-title">အမျိုးအစား</h3>
      <ul className="category-filter-list">
        <li className="category-filter-item">
          <Link
            href={`/products${sort ? `?sort=${sort}` : ""}`}
            className={`category-filter-link ${!category ? "active" : ""}`}
          >
            အားလုံး ({totalCount})
          </Link>
        </li>
        {categories.map((cat) => (
          <li key={cat.slug} className="category-filter-item">
            <Link
              href={`/products?category=${cat.slug}${sort ? `&sort=${sort}` : ""}`}
              className={`category-filter-link ${category === cat.slug ? "active" : ""}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ textTransform: "capitalize" }}>{cat.name}</span>
              <span
                style={{
                  fontSize: "var(--font-size-xs)",
                  opacity: 0.7,
                  marginLeft: "var(--space-xs)",
                }}
              >
                ({categoryCounts[cat.slug] || 0})
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
