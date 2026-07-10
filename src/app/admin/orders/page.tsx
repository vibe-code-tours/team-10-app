import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: "var(--space-xl)" }}
      >
        <h1 style={{ fontSize: "var(--font-size-2xl)", fontWeight: 600 }}>
          Orders
        </h1>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              fontSize: "var(--font-size-sm)",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "var(--color-bg-secondary)",
                  borderBottom: "1px solid var(--color-border-light)",
                }}
              >
                <th
                  style={{
                    padding: "var(--space-md)",
                    fontWeight: 500,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Order ID
                </th>
                <th
                  style={{
                    padding: "var(--space-md)",
                    fontWeight: 500,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Customer
                </th>
                <th
                  style={{
                    padding: "var(--space-md)",
                    fontWeight: 500,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Total
                </th>
                <th
                  style={{
                    padding: "var(--space-md)",
                    fontWeight: 500,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Date
                </th>
                <th
                  style={{
                    padding: "var(--space-md)",
                    fontWeight: 500,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: "var(--space-md)",
                    fontWeight: 500,
                    color: "var(--color-text-secondary)",
                    textAlign: "right",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders?.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: "var(--space-xl)",
                      textAlign: "center",
                      color: "var(--color-text-tertiary)",
                    }}
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders?.map((order) => (
                  <tr
                    key={order.id}
                    style={{
                      borderBottom: "1px solid var(--color-border-light)",
                    }}
                  >
                    <td
                      style={{
                        padding: "var(--space-md)",
                        fontFamily: "monospace",
                      }}
                    >
                      {order.id.split("-")[0]}
                    </td>
                    <td style={{ padding: "var(--space-md)" }}>
                      <div style={{ fontWeight: 500 }}>
                        {order.customer_name}
                      </div>
                      <div
                        style={{
                          fontSize: "var(--font-size-xs)",
                          color: "var(--color-text-tertiary)",
                        }}
                      >
                        {order.customer_phone}
                      </div>
                    </td>
                    <td style={{ padding: "var(--space-md)", fontWeight: 600 }}>
                      ${Number(order.total_amount).toFixed(2)}
                    </td>
                    <td
                      style={{
                        padding: "var(--space-md)",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      {formatDistanceToNow(new Date(order.created_at), {
                        addSuffix: true,
                      })}
                    </td>
                    <td style={{ padding: "var(--space-md)" }}>
                      <span
                        className={`badge ${
                          order.status === "delivered"
                            ? "badge-success"
                            : order.status === "cancelled"
                              ? "badge-danger"
                              : order.status === "shipped"
                                ? "badge-primary"
                                : "badge-neutral"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td
                      style={{ padding: "var(--space-md)", textAlign: "right" }}
                    >
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="btn btn-sm btn-secondary"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
