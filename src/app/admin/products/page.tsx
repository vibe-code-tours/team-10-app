import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { deleteProduct } from "@/actions/admin/action-products";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-page-title">Products</h1>
          <p className="admin-page-desc">Manage your store inventory.</p>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary">
          + Add Product
        </Link>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!products || products.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-8 text-secondary">
                  No products found. Add some to get started.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td>
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="table-img"
                      />
                    ) : (
                      <div className="table-img-placeholder">No Img</div>
                    )}
                  </td>
                  <td className="font-bold">{product.title}</td>
                  <td style={{ textTransform: "capitalize" }}>
                    {product.category}
                  </td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>
                    <span
                      className={`badge ${product.stock > 0 ? "badge-success" : "badge-danger"}`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    <div className="flex justify-end gap-sm">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="btn btn-sm btn-secondary"
                      >
                        Edit
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          await deleteProduct(product.id);
                        }}
                      >
                        <button type="submit" className="btn btn-sm btn-danger">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
