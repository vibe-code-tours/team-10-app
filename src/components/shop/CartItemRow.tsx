/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { updateCartItem, removeFromCart } from "@/actions/cart/action-cart";
import { useRouter } from "next/navigation";

interface Props {
  item: {
    id: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      slug: string;
      price: number;
      stock_quantity: number;
      images: Array<{ url: string; sort_order: number }>;
    };
  };
}

export default function CartItemRow({ item }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const product = item.product;
  const firstImage = product?.images?.sort(
    (a: { sort_order: number }, b: { sort_order: number }) =>
      a.sort_order - b.sort_order,
  )[0];

  async function handleQuantityChange(newQty: number) {
    setLoading(true);
    const formData = new FormData();
    formData.set("cart_item_id", item.id);
    formData.set("quantity", String(newQty));
    await updateCartItem(formData);
    router.refresh();
    setLoading(false);
  }

  async function handleRemove() {
    setLoading(true);
    await removeFromCart(item.id);
    router.refresh();
    setLoading(false);
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-md)",
        padding: "var(--space-md) var(--space-lg)",
        borderBottom: "1px solid var(--color-border-light)",
        opacity: loading ? 0.5 : 1,
        transition: "opacity var(--transition-fast)",
      }}
      id={`cart-item-${item.id}`}
    >
      {/* Image */}
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
          background: "var(--color-bg)",
          flexShrink: 0,
        }}
      >
        {firstImage ? (
          <img
            src={firstImage.url}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
            }}
          >
            📦
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: "var(--font-size-sm)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {product.name}
        </div>
        <div
          style={{
            color: "var(--color-primary)",
            fontWeight: 600,
            fontSize: "var(--font-size-sm)",
            marginTop: "2px",
          }}
        >
          {Number(product.price).toLocaleString()} Ks
        </div>
      </div>

      {/* Quantity */}
      <div
        className="flex items-center"
        style={{
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-sm)",
          overflow: "hidden",
        }}
      >
        <button
          type="button"
          onClick={() => handleQuantityChange(Math.max(1, item.quantity - 1))}
          className="btn btn-ghost"
          style={{
            padding: "0.25rem 0.5rem",
            borderRadius: 0,
            fontSize: "var(--font-size-sm)",
          }}
          disabled={loading || item.quantity <= 1}
        >
          −
        </button>
        <span
          style={{
            padding: "0.25rem 0.5rem",
            fontSize: "var(--font-size-sm)",
            fontWeight: 600,
            minWidth: "2rem",
            textAlign: "center",
          }}
        >
          {item.quantity}
        </span>
        <button
          type="button"
          onClick={() =>
            handleQuantityChange(
              Math.min(product.stock_quantity, item.quantity + 1),
            )
          }
          className="btn btn-ghost"
          style={{
            padding: "0.25rem 0.5rem",
            borderRadius: 0,
            fontSize: "var(--font-size-sm)",
          }}
          disabled={loading || item.quantity >= product.stock_quantity}
        >
          +
        </button>
      </div>

      {/* Subtotal */}
      <div
        style={{
          fontWeight: 700,
          minWidth: "80px",
          textAlign: "right",
          fontSize: "var(--font-size-sm)",
        }}
      >
        {(Number(product.price) * item.quantity).toLocaleString()} Ks
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={handleRemove}
        className="btn btn-ghost"
        style={{ padding: "0.25rem", color: "var(--color-text-tertiary)" }}
        disabled={loading}
        aria-label="Remove item"
      >
        ✕
      </button>
    </div>
  );
}
