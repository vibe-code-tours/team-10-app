import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { DollarSign, ShoppingBag, Clock, CheckCircle, Eye, ArrowRight } from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const t = await getTranslations("Admin.dashboard");

  // Fetch all orders to compute stats
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  // Calculate metrics
  const totalOrders = orders?.length || 0;
  const nonCancelledOrders = orders?.filter((o) => o.status !== "cancelled") || [];
  const totalSales = nonCancelledOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  
  const pendingOrders = orders?.filter((o) => o.status === "pending").length || 0;
  const confirmedOrders = orders?.filter((o) => o.status === "confirmed").length || 0;
  const shippedOrders = orders?.filter((o) => o.status === "shipped").length || 0;
  const deliveredOrders = orders?.filter((o) => o.status === "delivered").length || 0;
  const cancelledOrders = orders?.filter((o) => o.status === "cancelled").length || 0;

  // Recent 5 orders
  const recentOrders = orders?.slice(0, 5) || [];

  // Distribution helper
  const getPercent = (count: number) => {
    if (!totalOrders) return 0;
    return Math.round((count / totalOrders) * 100);
  };

  const statusCategories = [
    { key: "pending", label: t("pendingOrders"), count: pendingOrders, color: "var(--color-warning)", fill: "var(--color-warning)" },
    { key: "confirmed", label: "Confirmed (အတည်ပြုပြီး)", count: confirmedOrders, color: "#3b82f6", fill: "#3b82f6" },
    { key: "shipped", label: "Shipped (ပို့ဆောင်ဆဲ)", count: shippedOrders, color: "#a855f7", fill: "#a855f7" },
    { key: "delivered", label: t("deliveredOrders"), count: deliveredOrders, color: "var(--color-success)", fill: "var(--color-success)" },
    { key: "cancelled", label: "Cancelled (ပယ်ဖျက်ပြီး)", count: cancelledOrders, color: "var(--color-danger)", fill: "var(--color-danger)" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
      {/* Overview Stat Cards */}
      <div className="admin-stats-grid">
        {/* Card 1: Total Revenue */}
        <div className="admin-stat-card">
          <div className="admin-stat-info">
            <span className="admin-stat-label">{t("totalSales")}</span>
            <span className="admin-stat-value">${totalSales.toFixed(2)}</span>
          </div>
          <div className="admin-stat-icon success">
            <DollarSign size={22} />
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="admin-stat-card">
          <div className="admin-stat-info">
            <span className="admin-stat-label">{t("totalOrders")}</span>
            <span className="admin-stat-value">{totalOrders}</span>
          </div>
          <div className="admin-stat-icon primary">
            <ShoppingBag size={22} />
          </div>
        </div>

        {/* Card 3: Pending Orders */}
        <div className="admin-stat-card">
          <div className="admin-stat-info">
            <span className="admin-stat-label">{t("pendingOrders")}</span>
            <span className="admin-stat-value" style={{ color: pendingOrders > 0 ? "var(--color-warning)" : "inherit" }}>
              {pendingOrders}
            </span>
          </div>
          <div className="admin-stat-icon warning">
            <Clock size={22} />
          </div>
        </div>

        {/* Card 4: Delivered Orders */}
        <div className="admin-stat-card">
          <div className="admin-stat-info">
            <span className="admin-stat-label">{t("deliveredOrders")}</span>
            <span className="admin-stat-value" style={{ color: "var(--color-success)" }}>
              {deliveredOrders}
            </span>
          </div>
          <div className="admin-stat-icon success" style={{ background: "rgba(45, 125, 70, 0.1)", color: "var(--color-success)" }}>
            <CheckCircle size={22} />
          </div>
        </div>
      </div>

      {/* Main Grid: Charts & Recent Orders */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-lg)" }}>
        {/* Responsive Grid for Desktop */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--space-lg)" }}>
          
          {/* Order Status Distribution Card */}
          <div className="card" style={{ padding: "var(--space-lg)" }}>
            <h2 style={{ fontSize: "var(--font-size-lg)", fontWeight: 600, marginBottom: "var(--space-md)", color: "var(--color-text)" }}>
              {t("orderDistribution")}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              {statusCategories.map((status) => {
                const percent = getPercent(status.count);
                return (
                  <div key={status.key} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 500 }}>
                      <span style={{ color: "var(--color-text-secondary)" }}>{status.label}</span>
                      <span style={{ fontWeight: 600, color: "var(--color-text)" }}>
                        {status.count} ({percent}%)
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div style={{ width: "100%", height: "8px", background: "var(--color-bg)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${percent}%`,
                          height: "100%",
                          background: status.fill,
                          borderRadius: "var(--radius-full)",
                          transition: "width 0.4s ease",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Orders Card */}
          <div className="card" style={{ padding: "var(--space-lg)", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)" }}>
              <h2 style={{ fontSize: "var(--font-size-lg)", fontWeight: 600, color: "var(--color-text)" }}>
                {t("recentOrders")}
              </h2>
              <Link href="/admin/orders" style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "4px", color: "var(--color-primary)", textDecoration: "none", fontWeight: 600 }}>
                {t("viewAll")} <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{ overflowX: "auto", flex: 1 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--font-size-sm)" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--color-border)", textAlign: "left" }}>
                    <th style={{ padding: "8px", color: "var(--color-text-secondary)", fontWeight: 500 }}>{t("orderId")}</th>
                    <th style={{ padding: "8px", color: "var(--color-text-secondary)", fontWeight: 500 }}>{t("customer")}</th>
                    <th style={{ padding: "8px", color: "var(--color-text-secondary)", fontWeight: 500 }}>{t("total")}</th>
                    <th style={{ padding: "8px", color: "var(--color-text-secondary)", fontWeight: 500 }}>{t("status")}</th>
                    <th style={{ padding: "8px", textAlign: "right" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-tertiary)" }}>
                        {t("noOrders")}
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order.id} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                        <td style={{ padding: "10px 8px", fontFamily: "monospace", color: "var(--color-text)" }}>
                          {order.order_number || order.id.split("-")[0]}
                        </td>
                        <td style={{ padding: "10px 8px" }}>
                          <div style={{ fontWeight: 500, color: "var(--color-text)" }}>{order.customer_name}</div>
                          <div style={{ fontSize: "10px", color: "var(--color-text-tertiary)" }}>{order.customer_phone}</div>
                        </td>
                        <td style={{ padding: "10px 8px", fontWeight: 600, color: "var(--color-primary)" }}>
                          ${Number(order.total).toFixed(2)}
                        </td>
                        <td style={{ padding: "10px 8px" }}>
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
                            style={{ fontSize: "11px", padding: "2px 6px" }}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td style={{ padding: "10px 8px", textAlign: "right" }}>
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="btn btn-sm btn-secondary"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "4px",
                            }}
                            title={t("view")}
                          >
                            <Eye size={14} />
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
      </div>
    </div>
  );
}
