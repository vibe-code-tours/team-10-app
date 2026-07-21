"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCart } from "@/components/cart/CartProvider";

interface Props {
  product: {
    id: string;
    title?: string;
    name?: string;
    price: number;
    image_url: string;
    stock: number;
  };
}

export default function AddToCartButton({ product }: Props) {
  const t = useTranslations("AddToCart");
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const maxQuantity = product.stock;

  function handleAddToCart() {
    setLoading(true);
    const title = product.title || product.name || "";
    addToCart({ ...product, title }, quantity);
    setMessage({ type: "success", text: t("added") });
    setLoading(false);
    setTimeout(() => setMessage(null), 3000);
  }

  return (
    <div>
      <div
        className="flex items-center gap-md"
        style={{ marginBottom: "var(--space-md)" }}
      >
        <div
          className="flex items-center"
          style={{
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
          }}
        >
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="btn btn-ghost"
            style={{ padding: "0.5rem 0.75rem", borderRadius: 0 }}
            id="btn-qty-minus"
          >
            −
          </button>
          <span
            style={{
              padding: "0.5rem 1rem",
              fontWeight: 500,
              minWidth: "3rem",
              textAlign: "center",
            }}
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
            className="btn btn-ghost"
            style={{ padding: "0.5rem 0.75rem", borderRadius: 0 }}
            id="btn-qty-plus"
          >
            +
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        className="btn btn-primary btn-lg btn-full"
        disabled={loading}
        id="btn-add-to-cart"
      >
        {loading ? <span className="spinner" /> : null}
        {loading ? t("adding") : t("addToCart")}
      </button>

      {message && (
        <div
          style={{
            marginTop: "var(--space-md)",
            padding: "var(--space-sm) var(--space-md)",
            borderRadius: "var(--radius-sm)",
            fontSize: "var(--font-size-sm)",
            textAlign: "center",
            background:
              message.type === "success"
                ? "rgba(45,125,70,0.06)"
                : "var(--color-danger-light)",
            color:
              message.type === "success"
                ? "var(--color-success)"
                : "var(--color-danger)",
          }}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
