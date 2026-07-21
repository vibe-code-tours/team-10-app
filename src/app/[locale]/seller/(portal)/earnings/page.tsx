import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCommissionRate } from "@/services/commission.service";
import { DollarSign, TrendingDown, TrendingUp, Clock } from "lucide-react";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function SellerEarningsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const t = await getTranslations("Seller.earnings");

  // Fetch own delivered order items with product category for commission lookup
  const { data: items } = await supabase
    .from("order_items")
    .select("quantity, price, fulfillment_status, products(category)")
    .eq("seller_id", user.id)
    .eq("fulfillment_status", "delivered");

  // Compute gross + commission per item (category-specific rate)
  let grossRevenue = 0;
  let totalCommission = 0;

  for (const item of items ?? []) {
    const lineTotal = Number(item.price) * Number(item.quantity);
    const category = (item.products as { category?: string } | null)?.category;
    const rate = await getCommissionRate(supabase, category);
    grossRevenue += lineTotal;
    totalCommission += lineTotal * (rate / 100);
  }

  const netEarnings = grossRevenue - totalCommission;

  // Payout history
  const { data: payouts } = await supabase
    .from("seller_payouts")
    .select("*")
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false });

  const stats = [
    {
      label: t("gross"),
      value: `$${grossRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "var(--color-primary)",
    },
    {
      label: t("commission"),
      value: `$${totalCommission.toFixed(2)}`,
      icon: TrendingDown,
      color: "var(--color-danger)",
    },
    {
      label: t("net"),
      value: `$${netEarnings.toFixed(2)}`,
      icon: TrendingUp,
      color: "var(--color-success, #22c55e)",
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
      <div>
        <h1 className="admin-title">{t("title")}</h1>
        <p className="admin-description">Based on delivered orders only.</p>
      </div>

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
                <div style={{ fontSize: "22px", fontWeight: 700 }}>
                  {s.value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payout History */}
      <div className="admin-card">
        <div
          style={{
            padding: "var(--space-md) var(--space-lg)",
            borderBottom: "1px solid var(--color-border)",
            fontWeight: 600,
          }}
        >
          {t("payoutHistory")}
        </div>
        {payouts && payouts.length > 0 ? (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t("period")}</th>
                  <th>{t("gross")}</th>
                  <th>{t("commission")}</th>
                  <th>{t("net")}</th>
                  <th>{t("status")}</th>
                  <th>Paid At</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontSize: "13px" }}>
                      {p.period_start} → {p.period_end}
                    </td>
                    <td>${Number(p.amount).toFixed(2)}</td>
                    <td style={{ color: "var(--color-danger)" }}>
                      -${Number(p.commission_deducted).toFixed(2)}
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      ${Number(p.net_amount).toFixed(2)}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          p.status === "paid"
                            ? "badge-success"
                            : "badge-neutral"
                        }`}
                      >
                        {p.status === "paid" ? t("paid") : t("pending")}
                      </span>
                    </td>
                    <td style={{ fontSize: "12px" }}>
                      {p.paid_at
                        ? new Date(p.paid_at).toLocaleDateString()
                        : "—"}
                    </td>
                    <td
                      style={{
                        fontSize: "12px",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      {p.note || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div
            style={{
              padding: "32px 24px",
              textAlign: "center",
              color: "var(--color-text-secondary)",
            }}
          >
            <Clock
              size={32}
              style={{ marginBottom: "8px", color: "var(--color-border)" }}
            />
            <p>{t("noPayouts")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
