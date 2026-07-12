"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/actions/checkout/action-checkout";
import { useCart } from "@/components/cart/CartProvider";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { QrCode } from "lucide-react";

export default function CheckoutPage() {
  const t = useTranslations("Checkout");
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    customer_address: "",
    payment_method: "cod", // Cash on delivery
  });

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="container section">
        <div className="empty-state">
          <div className="empty-state-title">{t("emptyCart")}</div>
          <Link
            href="/products"
            className="btn btn-primary"
            style={{ marginTop: "1rem" }}
          >
            {t("viewProducts")}
          </Link>
        </div>
      </div>
    );
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await createOrder(form, items, totalPrice);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    clearCart();
    // Redirect to a simple success page or home with a success query param
    router.push(`/?success=true&order_id=${result.orderId}`);
  }

  return (
    <div className="container section" id="checkout-page">
      <h1 className="section-title" style={{ marginBottom: "var(--space-xl)" }}>
        {t("title")}
      </h1>

      {error && (
        <div
          style={{
            padding: "var(--space-md)",
            background: "var(--color-danger-light)",
            color: "var(--color-danger)",
            borderRadius: "var(--radius-md)",
            marginBottom: "var(--space-lg)",
            fontSize: "var(--font-size-sm)",
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleCheckout}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
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
              <h2
                style={{ fontSize: "var(--font-size-base)", fontWeight: 500 }}
              >
                {t("shippingAddress")}
              </h2>
            </div>
            <div
              className="card-body"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-md)",
              }}
            >
              <div className="form-group">
                <label className="form-label">{t("fullName")}</label>
                <input
                  required
                  type="text"
                  className="form-input"
                  value={form.customer_name}
                  onChange={(e) =>
                    setForm({ ...form, customer_name: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t("phone")}</label>
                <input
                  required
                  type="tel"
                  className="form-input"
                  value={form.customer_phone}
                  onChange={(e) =>
                    setForm({ ...form, customer_phone: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t("fullAddress")}</label>
                <textarea
                  required
                  className="form-input"
                  rows={3}
                  value={form.customer_address}
                  onChange={(e) =>
                    setForm({ ...form, customer_address: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2
                style={{ fontSize: "var(--font-size-base)", fontWeight: 500 }}
              >
                {t("paymentMethod")}
              </h2>
            </div>
            <div className="card-body">
              <label
                className="flex items-center gap-sm"
                style={{ marginBottom: "1rem", cursor: "pointer" }}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={form.payment_method === "cod"}
                  onChange={(e) =>
                    setForm({ ...form, payment_method: e.target.value })
                  }
                  style={{ accentColor: "var(--color-text)" }}
                />
                <span>{t("cod")}</span>
              </label>
              <label
                className="flex items-center gap-sm"
                style={{ cursor: "pointer" }}
              >
                <input
                  type="radio"
                  name="payment"
                  value="mobile_banking"
                  checked={form.payment_method === "mobile_banking"}
                  onChange={(e) =>
                    setForm({ ...form, payment_method: e.target.value })
                  }
                  style={{ accentColor: "var(--color-text)" }}
                />
                <span>{t("mobileBanking")}</span>
              </label>

              {form.payment_method === "mobile_banking" && (
                <div
                  style={{
                    marginTop: "var(--space-lg)",
                    padding: "var(--space-lg)",
                    background: "var(--color-bg-secondary)",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    gap: "var(--space-sm)",
                  }}
                >
                  <div
                    style={{
                      width: "160px",
                      height: "160px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-md)",
                    }}
                  >
                    <QrCode
                      size={100}
                      strokeWidth={1}
                      style={{ color: "var(--color-text)" }}
                    />
                  </div>
                  <div style={{ fontWeight: 500 }}>{t("scanToPay")}</div>
                  <div
                    className="text-secondary"
                    style={{ fontSize: "var(--font-size-sm)" }}
                  >
                    {t("scanInstructions", {
                      amount: `$${totalPrice.toFixed(2)}`,
                    })}
                  </div>
                  <div
                    className="text-secondary"
                    style={{
                      fontSize: "var(--font-size-xs)",
                      fontStyle: "italic",
                    }}
                  >
                    {t("qrPlaceholderNote")}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className="card"
          style={{
            position: "sticky",
            top: "calc(var(--header-height) + var(--space-lg))",
          }}
        >
          <div className="card-body">
            <h3
              style={{
                fontSize: "var(--font-size-base)",
                fontWeight: 500,
                marginBottom: "var(--space-lg)",
              }}
            >
              {t("orderSummary")}
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-sm)",
                marginBottom: "var(--space-lg)",
              }}
            >
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between"
                  style={{ fontSize: "var(--font-size-sm)" }}
                >
                  <span className="text-secondary">
                    {item.title} x {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div
                style={{
                  height: "1px",
                  background: "var(--color-border)",
                  margin: "var(--space-sm) 0",
                }}
              />
              <div className="flex justify-between">
                <span style={{ fontWeight: 600 }}>{t("totalAmount")}</span>
                <span
                  style={{ fontWeight: 600, color: "var(--color-primary)" }}
                >
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
              id="btn-place-order"
            >
              {loading ? <span className="spinner" /> : null}
              {loading ? t("placingOrder") : t("placeOrder")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
