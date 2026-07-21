import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Package, ClipboardList, DollarSign, Clock } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function SellerDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const t = await getTranslations("Seller.dashboard");

  // Stats: own products
  const { count: totalProducts } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("seller_id", user.id);

  // Stats: own order_items joined to orders
  type OrderRef = { created_at: string; customer_name: string; status: string };
  type MyItem = {
    quantity: number;
    price: number;
    fulfillment_status: string;
    orders: OrderRef | OrderRef[] | null;
  };

  const { data: myItemsRaw } = await supabase
    .from("order_items")
    .select(
      "quantity, price, fulfillment_status, orders(created_at, customer_name, status)",
    )
    .eq("seller_id", user.id);

  const myItems = (myItemsRaw as MyItem[] | null) ?? [];

  const getOrder = (item: MyItem): OrderRef | null => {
    if (!item.orders) return null;
    return Array.isArray(item.orders) ? (item.orders[0] ?? null) : item.orders;
  };

  const totalOrders = myItems.length;
  const grossRevenue = myItems.reduce(
    (sum, i) => sum + Number(i.price) * Number(i.quantity),
    0,
  );
  const pendingOrders = myItems.filter(
    (i) => i.fulfillment_status === "pending",
  ).length;

  const recentItems = [...myItems]
    .sort((a, b) => {
      const aDate = getOrder(a)?.created_at ?? "";
      const bDate = getOrder(b)?.created_at ?? "";
      return bDate.localeCompare(aDate);
    })
    .slice(0, 5);

  const stats = [
    {
      label: t("totalProducts"),
      value: totalProducts ?? 0,
      icon: Package,
      color: "var(--color-primary)",
    },
    {
      label: t("totalOrders"),
      value: totalOrders,
      icon: ClipboardList,
      color: "var(--color-info, #3b82f6)",
    },
    {
      label: t("totalRevenue"),
      value: `$${grossRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "var(--color-success, #22c55e)",
    },
    {
      label: t("pendingOrders"),
      value: pendingOrders,
      icon: Clock,
      color: "var(--color-warning, #f59e0b)",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-lg)",
      }}
    >
      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "var(--space-md)",
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            className="admin-card"
            style={{ padding: "var(--space-md)" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: `${s.color}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: s.color,
                  flexShrink: 0,
                }}
              >
                <s.icon size={20} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: "var(--font-size-xs)",
                    color: "var(--color-text-secondary)",
                    marginBottom: "2px",
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "var(--color-text)",
                  }}
                >
                  {s.value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="admin-card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "var(--space-md) var(--space-lg)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <span style={{ fontWeight: 600 }}>{t("recentOrders")}</span>
          <Link href="/seller/orders" className="btn btn-sm btn-ghost">
            View All →
          </Link>
        </div>
        {recentItems.length === 0 ? (
          <div
            style={{
              padding: "var(--space-xl)",
              textAlign: "center",
              color: "var(--color-text-tertiary)",
            }}
          >
            No orders yet.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Qty</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentItems.map((item, i) => {
                  const order = getOrder(item);
                  return (
                    <tr key={i}>
                      {(() => {
                        const o = getOrder(item);
                        return (
                          <>
                            <td style={{ fontWeight: 500 }}>
                              {o?.customer_name ?? "—"}
                            </td>
                            <td>{item.quantity}</td>
                            <td style={{ fontWeight: 600 }}>
                              $
                              {(
                                Number(item.price) * Number(item.quantity)
                              ).toFixed(2)}
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
                              {o?.created_at
                                ? formatDistanceToNow(new Date(o.created_at), {
                                    addSuffix: true,
                                  })
                                : "—"}
                            </td>
                          </>
                        );
                      })()}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
