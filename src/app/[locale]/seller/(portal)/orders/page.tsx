import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { updateFulfillmentStatus } from "@/actions/seller/action-fulfillment";
import { formatDistanceToNow } from "date-fns";

export const revalidate = 0;
export const dynamic = "force-dynamic";

const STATUS_OPTIONS = ["pending", "shipped", "delivered"] as const;

export default async function SellerOrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  type OrderInfo = {
    id: string;
    customer_name: string;
    customer_phone: string;
    customer_address: string;
    created_at: string;
    status: string;
  };
  type ProductInfo = { title: string };
  type OrderItem = {
    id: string;
    quantity: number;
    price: number;
    fulfillment_status: string;
    product_id: string;
    orders: OrderInfo | OrderInfo[] | null;
    products: ProductInfo | ProductInfo[] | null;
  };

  const { data: rawItems } = await supabase
    .from("order_items")
    .select(
      "id, quantity, price, fulfillment_status, product_id, orders(id, customer_name, customer_phone, customer_address, created_at, status), products(title)",
    )
    .eq("seller_id", user.id)
    .order("id", { ascending: false });

  const items = (rawItems as OrderItem[] | null) ?? [];

  const getOrder = (item: OrderItem): OrderInfo | null => {
    if (!item.orders) return null;
    return Array.isArray(item.orders) ? (item.orders[0] ?? null) : item.orders;
  };
  const getProduct = (item: OrderItem): ProductInfo | null => {
    if (!item.products) return null;
    return Array.isArray(item.products)
      ? (item.products[0] ?? null)
      : item.products;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-md)",
      }}
    >
      <div>
        <h1 className="admin-title">My Orders</h1>
        <p className="admin-description">
          {items?.length ?? 0} order items assigned to your shop
        </p>
      </div>

      <div className="admin-card">
        {items && items.length > 0 ? (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Customer</th>
                  <th>Qty</th>
                  <th>Amount</th>
                  <th>Order Status</th>
                  <th>Fulfillment</th>
                  <th>Date</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const order = getOrder(item);
                  const product = getProduct(item);

                  return (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 500, maxWidth: "160px" }}>
                        {product?.title ?? "—"}
                      </td>

                      <td>
                        <div style={{ fontWeight: 500 }}>
                          {order?.customer_name ?? "—"}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "var(--color-text-tertiary)",
                          }}
                        >
                          {order?.customer_phone}
                        </div>
                      </td>
                      <td>{item.quantity}</td>
                      <td style={{ fontWeight: 600 }}>
                        $
                        {(Number(item.price) * Number(item.quantity)).toFixed(
                          2,
                        )}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            order?.status === "delivered"
                              ? "badge-success"
                              : order?.status === "shipped"
                                ? "badge-primary"
                                : order?.status === "cancelled"
                                  ? "badge-danger"
                                  : "badge-neutral"
                          }`}
                        >
                          {order?.status ?? "—"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            item.fulfillment_status === "delivered"
                              ? "badge-success"
                              : item.fulfillment_status === "shipped"
                                ? "badge-primary"
                                : "badge-neutral"
                          }`}
                        >
                          {item.fulfillment_status}
                        </span>
                      </td>
                      <td
                        style={{
                          fontSize: "12px",
                          color: "var(--color-text-secondary)",
                        }}
                      >
                        {order?.created_at
                          ? formatDistanceToNow(new Date(order.created_at), {
                              addSuffix: true,
                            })
                          : "—"}
                      </td>
                      <td>
                        <form>
                          <select
                            name="status"
                            defaultValue={item.fulfillment_status}
                            className="form-input"
                            style={{ fontSize: "12px", padding: "4px 8px" }}
                            onChange={async () => {}}
                          />
                          {/* Server action via inline form per status */}
                          <div
                            style={{
                              display: "flex",
                              gap: "4px",
                              marginTop: "4px",
                              flexWrap: "wrap",
                            }}
                          >
                            {STATUS_OPTIONS.filter(
                              (s) => s !== item.fulfillment_status,
                            ).map((s) => (
                              <form
                                key={s}
                                action={async () => {
                                  "use server";
                                  await updateFulfillmentStatus(item.id, s);
                                }}
                              >
                                <button
                                  type="submit"
                                  className={`btn btn-sm ${
                                    s === "delivered"
                                      ? "btn-primary"
                                      : s === "shipped"
                                        ? "btn-secondary"
                                        : "btn-ghost"
                                  }`}
                                  style={{
                                    fontSize: "11px",
                                    padding: "3px 8px",
                                  }}
                                >
                                  → {s}
                                </button>
                              </form>
                            ))}
                          </div>
                        </form>
                      </td>
                    </tr>
                  );
                })}
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
            No orders yet.
          </div>
        )}
      </div>
    </div>
  );
}
