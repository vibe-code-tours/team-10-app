import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Link } from "@/i18n/routing";
import { Edit, Plus } from "lucide-react";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import { getProducts, getCategories } from "@/services/product.service";
import ProductFilterBar from "@/components/admin/ProductFilterBar";

interface Props {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: string;
    page?: string;
  }>;
}

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function SellerProductsPage({ searchParams }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const limit = 10;

  const dbCategories = await getCategories(supabase);
  const categories = dbCategories.map((c) => c.slug);

  // Seller sees only own products
  const offset = (page - 1) * limit;
  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("seller_id", user.id);

  if (params.search) query = query.ilike("title", `%${params.search}%`);
  if (params.category) query = query.eq("category", params.category);
  if (params.sort === "price_asc")
    query = query.order("price", { ascending: true });
  else if (params.sort === "price_desc")
    query = query.order("price", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  query = query.range(offset, offset + limit - 1);
  const { data: products, count } = await query;

  const totalPages = Math.ceil((count ?? 0) / limit) || 1;

  const getPageLink = (p: number) => {
    const sp = new URLSearchParams();
    if (params.search) sp.set("search", params.search);
    if (params.category) sp.set("category", params.category);
    if (params.sort) sp.set("sort", params.sort);
    sp.set("page", String(p));
    return `/seller/products?${sp.toString()}`;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-md)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1 className="admin-title">My Products</h1>
          <p className="admin-description">
            {count ?? 0} products in your shop
          </p>
        </div>
        <Link href="/seller/products/new" className="btn btn-primary">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <ProductFilterBar
        key={JSON.stringify(params)}
        categories={categories}
        brands={[]}
        baseUrl="/seller/products"
      />

      <div className="admin-card">
        {products && products.length > 0 ? (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{product.title}</div>
                    </td>
                    <td>
                      <span
                        className="badge badge-neutral"
                        style={{ textTransform: "capitalize" }}
                      >
                        {product.category}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      ${Number(product.price).toFixed(2)}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          product.stock === 0
                            ? "badge-danger"
                            : product.stock < 10
                              ? "badge-warning"
                              : "badge-success"
                        }`}
                      >
                        {product.stock} pcs
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <Link
                          href={`/seller/products/${product.id}/edit`}
                          className="btn btn-sm btn-secondary"
                        >
                          <Edit size={14} />
                        </Link>
                        <DeleteProductButton
                          id={product.id}
                          title={product.title}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div
            style={{
              padding: "48px 24px",
              textAlign: "center",
              color: "var(--color-text-secondary)",
            }}
          >
            <p>
              No products yet.{" "}
              <Link
                href="/seller/products/new"
                className="btn btn-primary btn-sm"
              >
                Add your first product
              </Link>
            </p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          {page > 1 && (
            <Link
              href={getPageLink(page - 1)}
              className="btn btn-secondary btn-sm"
            >
              ← Prev
            </Link>
          )}
          <span
            style={{
              padding: "6px 12px",
              fontSize: "13px",
              color: "var(--color-text-secondary)",
            }}
          >
            Page {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={getPageLink(page + 1)}
              className="btn btn-secondary btn-sm"
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
