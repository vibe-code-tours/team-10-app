"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCart } from "@/components/cart/CartProvider";
import Price from "@/components/currency/Price";
import { useEffect, useState } from "react";

export default function CartPage() {
  const t = useTranslations("Cart");
  const { items, updateQuantity, removeFromCart, totalItems, totalPrice } =
    useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <div className="container section" id="cart-page">
      <h1 className="section-title" style={{ marginBottom: "var(--space-xl)" }}>
        {t("title")}
      </h1>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-title">{t("empty")}</div>
          <div className="empty-state-desc">{t("startShopping")}</div>
          <Link
            href="/products"
            className="btn btn-primary"
            id="btn-start-shopping"
          >
            {t("viewProducts")}
          </Link>
        </div>
      ) : (
        <div
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
                <div className="flex items-center gap-sm">
                  <span style={{ fontWeight: 500 }}>{t("itemsToOrder")}</span>
                  <span className="badge badge-neutral">
                    {totalItems} {t("items")}
                  </span>
                </div>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                {items.map((item) => (
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
                        position: "relative",
                        width: "80px",
                        height: "80px",
                        flexShrink: 0,
                        borderRadius: "var(--radius-sm)",
                        overflow: "hidden",
                        background: "var(--color-bg-secondary)",
                      }}
                    >
                      {item.image_url && (
                        <Image
                          src={item.image_url}
                          alt={item.title}
                          fill
                          sizes="80px"
                          style={{
                            objectFit: "cover",
                          }}
                        />
                      )}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Link
                        href={`/products/${item.id}`}
                        style={{
                          fontWeight: 500,
                          color: "var(--color-text)",
                          textDecoration: "none",
                          marginBottom: "var(--space-xs)",
                        }}
                      >
                        {item.title}
                      </Link>
                      <div
                        style={{
                          fontWeight: 600,
                          color: "var(--color-primary)",
                        }}
                      >
                        <Price amount={item.price} />
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                      }}
                    >
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-secondary hover:text-danger"
                        style={{
                          fontSize: "var(--font-size-sm)",
                          padding: "4px",
                        }}
                      >
                        {t("remove")}
                      </button>
                      <div
                        className="flex items-center"
                        style={{
                          border: "1px solid var(--color-border)",
                          borderRadius: "var(--radius-sm)",
                          overflow: "hidden",
                        }}
                      >
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="btn btn-ghost"
                          style={{ padding: "0.25rem 0.5rem", borderRadius: 0 }}
                        >
                          −
                        </button>
                        <span
                          style={{
                            padding: "0.25rem 0.75rem",
                            fontSize: "var(--font-size-sm)",
                            fontWeight: 500,
                          }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="btn btn-ghost"
                          style={{ padding: "0.25rem 0.5rem", borderRadius: 0 }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
                <div className="flex justify-between">
                  <span className="text-secondary">
                    {t("itemsCount", { count: totalItems })}
                  </span>
                  <span className="font-bold">
                    <Price amount={totalPrice} />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">{t("shipping")}</span>
                  <span
                    className="text-secondary"
                    style={{ fontSize: "var(--font-size-sm)" }}
                  >
                    {t("free")}
                  </span>
                </div>
                <div
                  style={{
                    height: "1px",
                    background: "var(--color-border)",
                    margin: "var(--space-sm) 0",
                  }}
                />
                <div className="flex justify-between">
                  <span style={{ fontWeight: 600 }}>{t("total")}</span>
                  <span style={{ fontWeight: 600 }}>
                    <Price amount={totalPrice} />
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="btn btn-primary btn-full"
                id="btn-checkout"
              >
                {t("goToCheckout")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
