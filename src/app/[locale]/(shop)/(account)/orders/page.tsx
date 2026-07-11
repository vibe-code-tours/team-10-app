import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = { title: "မှာယူမှုများ (Order History)" };

const statusMap: Record<string, { label: string; class: string }> = {
  pending: { label: "စောင့်ဆိုင်းဆဲ", class: "badge-warning" },
  confirmed: { label: "အတည်ပြုပြီး", class: "badge-primary" },
  shipped: { label: "ပို့ဆောင်နေဆဲ", class: "badge-primary" },
  delivered: { label: "ရောက်ရှိပြီး", class: "badge-success" },
  cancelled: { label: "ပယ်ဖျက်ပြီး", class: "badge-danger" },
};

export default async function OrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch orders linked to this user_id
  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      `
      id, total_amount, status, created_at, payment_method,
      items:order_items ( id, quantity, price, product:products ( title ) )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  return (
    <div className="container section" id="orders-page">
      <div className="section-header">
        <h1 className="section-title">မှာယူမှုများ (Order History)</h1>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-title">မှာယူမှုမရှိသေးပါ</div>
          <div className="empty-state-desc">ပစ္စည်းများဝယ်ယူပြီး မှာယူပါ</div>
          <Link href="/products" className="btn btn-primary">
            ပစ္စည်းများကြည့်ရန်
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-lg)",
          }}
        >
          {orders.map(
            (order: {
              id: string;
              created_at: string;
              total_amount: number;
              status: string;
              payment_method: string;
              items?: {
                id: string;
                quantity: number;
                price: number;
                product?: { title: string } | { title: string }[];
              }[];
            }) => {
              const status = statusMap[order.status] ?? statusMap.pending;

              return (
                <div key={order.id} className="card" id={`order-${order.id}`}>
                  <div
                    className="card-header"
                    style={{ paddingBottom: "var(--space-sm)" }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span
                          style={{
                            fontWeight: 600,
                            fontSize: "var(--font-size-sm)",
                            color: "var(--color-text-secondary)",
                          }}
                        >
                          Order ID: {order.id.slice(0, 8)}...
                        </span>
                        <div
                          className="text-secondary"
                          style={{
                            fontSize: "var(--font-size-xs)",
                            marginTop: "4px",
                          }}
                        >
                          {new Date(order.created_at).toLocaleDateString(
                            "my-MM",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </div>
                      </div>
                      <div className="flex gap-sm">
                        <span className={`badge ${status.class}`}>
                          {status.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="card-body" style={{ padding: "0" }}>
                    {order.items?.map((item) => {
                      const productInfo = Array.isArray(item.product)
                        ? item.product[0]
                        : item.product;
                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between"
                          style={{
                            padding: "var(--space-md) var(--space-lg)",
                            borderBottom: "1px solid var(--color-border-light)",
                            fontSize: "var(--font-size-sm)",
                          }}
                        >
                          <span>
                            {productInfo?.title || "Unknown Product"}
                            <span
                              style={{
                                color: "var(--color-text-tertiary)",
                                marginLeft: "var(--space-sm)",
                              }}
                            >
                              x {item.quantity}
                            </span>
                          </span>
                          <span className="font-bold">
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div
                    className="card-footer"
                    style={{ background: "var(--color-surface-hover)" }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span
                          style={{
                            fontSize: "var(--font-size-sm)",
                            color: "var(--color-text-secondary)",
                          }}
                        >
                          ငွေပေးချေမှု -{" "}
                          {order.payment_method === "cod"
                            ? "Cash on Delivery"
                            : "Mobile Banking"}
                        </span>
                      </div>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: "var(--font-size-md)",
                          color: "var(--color-primary)",
                        }}
                      >
                        Total: ${Number(order.total_amount).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            },
          )}
        </div>
      )}
    </div>
  );
}
