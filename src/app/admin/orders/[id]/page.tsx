import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import { format } from "date-fns";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (!order) notFound();

  const { data: items } = await supabase
    .from("order_items")
    .select(
      `
      id, quantity, price,
      product:products ( title, image_url )
    `,
    )
    .eq("order_id", id);

  return (
    <div>
      <div
        className="flex items-center gap-md"
        style={{ marginBottom: "var(--space-xl)" }}
      >
        <Link href="/admin/orders" className="btn btn-ghost btn-sm">
          ← Back
        </Link>
        <h1 style={{ fontSize: "var(--font-size-2xl)", fontWeight: 600 }}>
          Order Details
        </h1>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: "var(--space-xl)",
          alignItems: "start",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-lg)",
          }}
        >
          <div className="card">
            <div className="card-header">
              <h2 style={{ fontSize: "var(--font-size-lg)", fontWeight: 500 }}>
                Ordered Items
              </h2>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {items?.map((item: any) => (
                <div
                  key={item.id}
                  className="flex gap-md"
                  style={{
                    padding: "var(--space-md)",
                    borderBottom: "1px solid var(--color-border-light)",
                  }}
                >
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "var(--radius-sm)",
                      overflow: "hidden",
                      background: "var(--color-bg-secondary)",
                    }}
                  >
                    {item.product?.image_url && (
                      <img
                        src={item.product.image_url}
                        alt={item.product?.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 500,
                        marginBottom: "var(--space-xs)",
                      }}
                    >
                      {item.product?.title || "Unknown Product"}
                    </div>
                    <div
                      className="text-secondary"
                      style={{ fontSize: "var(--font-size-sm)" }}
                    >
                      ${Number(item.price).toFixed(2)} x {item.quantity}
                    </div>
                  </div>
                  <div style={{ fontWeight: 600 }}>
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
              <div
                style={{
                  padding: "var(--space-md)",
                  textAlign: "right",
                  fontWeight: 600,
                  fontSize: "var(--font-size-lg)",
                }}
              >
                Total: ${Number(order.total_amount).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-lg)",
          }}
        >
          <div className="card">
            <div className="card-header">
              <h3
                style={{ fontSize: "var(--font-size-base)", fontWeight: 500 }}
              >
                Status
              </h3>
            </div>
            <div className="card-body">
              <OrderStatusSelect
                orderId={order.id}
                currentStatus={order.status}
              />
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3
                style={{ fontSize: "var(--font-size-base)", fontWeight: 500 }}
              >
                Customer Details
              </h3>
            </div>
            <div
              className="card-body"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-md)",
                fontSize: "var(--font-size-sm)",
              }}
            >
              <div>
                <div className="text-secondary" style={{ marginBottom: "2px" }}>
                  Name
                </div>
                <div style={{ fontWeight: 500 }}>{order.customer_name}</div>
              </div>
              <div>
                <div className="text-secondary" style={{ marginBottom: "2px" }}>
                  Phone
                </div>
                <div style={{ fontWeight: 500 }}>{order.customer_phone}</div>
              </div>
              <div>
                <div className="text-secondary" style={{ marginBottom: "2px" }}>
                  Address
                </div>
                <div style={{ fontWeight: 500 }}>{order.customer_address}</div>
              </div>
              <div>
                <div className="text-secondary" style={{ marginBottom: "2px" }}>
                  Date
                </div>
                <div style={{ fontWeight: 500 }}>
                  {format(new Date(order.created_at), "PPP p")}
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3
                style={{ fontSize: "var(--font-size-base)", fontWeight: 500 }}
              >
                Payment Info
              </h3>
            </div>
            <div
              className="card-body"
              style={{ fontSize: "var(--font-size-sm)" }}
            >
              <div>
                <div className="text-secondary" style={{ marginBottom: "2px" }}>
                  Method
                </div>
                <div style={{ fontWeight: 500, textTransform: "capitalize" }}>
                  {order.payment_method === "cod"
                    ? "Cash on Delivery"
                    : "Mobile Banking"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
