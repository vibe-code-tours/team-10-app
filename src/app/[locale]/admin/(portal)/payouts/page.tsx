import { createAdminClient } from "@/lib/supabase/server";
import { markPayoutPaid } from "@/actions/admin/action-payouts";
import { getCommissionRate } from "@/services/commission.service";
import { DollarSign, CheckCircle } from "lucide-react";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function AdminPayoutsPage() {
  const supabase = await createAdminClient();

  // All sellers with their order items
  const { data: sellers } = await supabase
    .from("users")
    .select("id, full_name, shop_name, email")
    .eq("role", "seller")
    .order("full_name");

  // Compute earnings per seller
  const sellerEarnings = await Promise.all(
    (sellers ?? []).map(async (seller) => {
      const { data: items } = await supabase
        .from("order_items")
        .select("quantity, price, fulfillment_status, products(category)")
        .eq("seller_id", seller.id)
        .eq("fulfillment_status", "delivered");

      let gross = 0;
      let commission = 0;
      for (const item of items ?? []) {
        const line = Number(item.price) * Number(item.quantity);
        const cat = (item.products as { category?: string } | null)?.category;
        const rate = await getCommissionRate(supabase, cat);
        gross += line;
        commission += line * (rate / 100);
      }

      const { data: payouts } = await supabase
        .from("seller_payouts")
        .select("*")
        .eq("seller_id", seller.id)
        .order("created_at", { ascending: false });

      return {
        seller,
        gross,
        commission,
        net: gross - commission,
        payouts: payouts ?? [],
      };
    }),
  );

  // All pending payouts for quick overview
  const { data: allPayouts } = await supabase
    .from("seller_payouts")
    .select("*, users(full_name, shop_name)")
    .order("created_at", { ascending: false });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-lg)",
      }}
    >
      <div>
        <h1 className="admin-title">Seller Payouts</h1>
        <p className="admin-description">
          Track earnings and manage manual payouts to sellers.
        </p>
      </div>

      {/* Seller Earnings Summary */}
      <div className="admin-card">
        <div
          style={{
            padding: "var(--space-md) var(--space-lg)",
            borderBottom: "1px solid var(--color-border)",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <DollarSign size={18} style={{ color: "var(--color-primary)" }} />
          Earnings Summary (Delivered Orders)
        </div>
        {sellerEarnings.length > 0 ? (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Seller</th>
                  <th>Gross</th>
                  <th>Commission</th>
                  <th>Net Owed</th>
                  <th>Create Payout</th>
                </tr>
              </thead>
              <tbody>
                {sellerEarnings.map(({ seller, gross, commission, net }) => (
                  <tr key={seller.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>
                        {seller.shop_name || seller.full_name}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "var(--color-text-tertiary)",
                        }}
                      >
                        {seller.email}
                      </div>
                    </td>
                    <td style={{ fontWeight: 500 }}>${gross.toFixed(2)}</td>
                    <td style={{ color: "var(--color-danger)" }}>
                      -${commission.toFixed(2)}
                    </td>
                    <td
                      style={{
                        fontWeight: 700,
                        color: "var(--color-success, #22c55e)",
                      }}
                    >
                      ${net.toFixed(2)}
                    </td>
                    <td>
                      <form
                        action={async (fd: FormData) => {
                          "use server";
                          const { createPayout } =
                            await import("@/actions/admin/action-payouts");
                          await createPayout({}, fd);
                        }}
                      >
                        <input
                          type="hidden"
                          name="seller_id"
                          value={seller.id}
                        />
                        <input
                          type="hidden"
                          name="amount"
                          value={gross.toFixed(2)}
                        />
                        <input
                          type="hidden"
                          name="commission_deducted"
                          value={commission.toFixed(2)}
                        />
                        <input
                          type="hidden"
                          name="net_amount"
                          value={net.toFixed(2)}
                        />
                        <input
                          name="period_start"
                          type="date"
                          className="form-input"
                          style={{
                            fontSize: "12px",
                            padding: "4px",
                            width: "130px",
                          }}
                          required
                        />
                        <input
                          name="period_end"
                          type="date"
                          className="form-input"
                          style={{
                            fontSize: "12px",
                            padding: "4px",
                            width: "130px",
                            marginTop: "4px",
                          }}
                          required
                        />
                        <input
                          name="note"
                          type="text"
                          className="form-input"
                          placeholder="Note (optional)"
                          style={{
                            fontSize: "12px",
                            padding: "4px",
                            marginTop: "4px",
                          }}
                        />
                        <button
                          type="submit"
                          className="btn btn-sm btn-primary"
                          style={{ marginTop: "6px" }}
                        >
                          Create Payout
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div
            style={{
              padding: "32px",
              textAlign: "center",
              color: "var(--color-text-secondary)",
            }}
          >
            No sellers yet.
          </div>
        )}
      </div>

      {/* Payout Records */}
      <div className="admin-card">
        <div
          style={{
            padding: "var(--space-md) var(--space-lg)",
            borderBottom: "1px solid var(--color-border)",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <CheckCircle
            size={18}
            style={{ color: "var(--color-success, #22c55e)" }}
          />
          Payout Records
        </div>
        {allPayouts && allPayouts.length > 0 ? (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Seller</th>
                  <th>Period</th>
                  <th>Gross</th>
                  <th>Commission</th>
                  <th>Net</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {allPayouts.map((p) => {
                  const s = p.users as {
                    full_name?: string;
                    shop_name?: string;
                  } | null;
                  return (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 500 }}>
                        {s?.shop_name || s?.full_name || "—"}
                      </td>
                      <td style={{ fontSize: "12px" }}>
                        {p.period_start} → {p.period_end}
                      </td>
                      <td>${Number(p.amount).toFixed(2)}</td>
                      <td style={{ color: "var(--color-danger)" }}>
                        -${Number(p.commission_deducted).toFixed(2)}
                      </td>
                      <td style={{ fontWeight: 700 }}>
                        ${Number(p.net_amount).toFixed(2)}
                      </td>
                      <td>
                        <span
                          className={`badge ${p.status === "paid" ? "badge-success" : "badge-neutral"}`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td>
                        {p.status === "pending" && (
                          <form
                            action={async (fd: FormData) => {
                              "use server";
                              await markPayoutPaid(
                                p.id,
                                fd.get("note") as string,
                              );
                            }}
                          >
                            <input
                              name="note"
                              type="text"
                              className="form-input"
                              placeholder="Note"
                              style={{
                                fontSize: "12px",
                                padding: "4px",
                                marginBottom: "4px",
                              }}
                            />
                            <button
                              type="submit"
                              className="btn btn-sm btn-primary"
                            >
                              Mark Paid
                            </button>
                          </form>
                        )}
                        {p.status === "paid" && (
                          <span
                            style={{
                              fontSize: "12px",
                              color: "var(--color-text-tertiary)",
                            }}
                          >
                            {p.paid_at
                              ? new Date(p.paid_at).toLocaleDateString()
                              : "—"}
                          </span>
                        )}
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
              padding: "32px",
              textAlign: "center",
              color: "var(--color-text-secondary)",
            }}
          >
            No payout records yet.
          </div>
        )}
      </div>
    </div>
  );
}
