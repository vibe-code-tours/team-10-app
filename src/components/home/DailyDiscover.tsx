"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Star, TrendingUp } from "lucide-react";
import Image from "next/image";

type Product = {
  id: string;
  title: string;
  price: number;
  image_url: string;
  category: string;
};

interface Props {
  products: Product[];
  soldText: string;
}

export function DailyDiscover({ products, soldText }: Props) {
  const [visibleCount, setVisibleCount] = useState(24);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("for-you");
  const observerRef = useRef<HTMLDivElement>(null);

  // Pure, deterministic stats generation to prevent hydration mismatches
  const getProductStats = (product: Product) => {
    const priceHash = Math.round(product.price * 100);
    const titleHash = product.title.length;
    const sales = ((priceHash * 13 + titleHash * 7) % 450) + 12;
    const rating = (4.5 + ((priceHash * 7 + titleHash) % 6) * 0.1).toFixed(1);
    return { sales, rating };
  };

  useEffect(() => {
    if (visibleCount >= products.length) return;

    let timeoutId: NodeJS.Timeout;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          setIsLoading(true);

          // Simulated 600ms network latency for premium e-commerce feel
          timeoutId = setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + 18, products.length));
            setIsLoading(false);
          }, 600);
        }
      },
      { rootMargin: "200px" },
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [products.length, isLoading, visibleCount]);

  const displayedProducts = products.slice(0, visibleCount);

  return (
    <div className="container" style={{ marginTop: "24px" }}>
      <div
        style={{
          background: "var(--color-surface)",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
          overflow: "hidden",
        }}
      >
        {/* Tab Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--color-border-light)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "var(--color-text)",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <TrendingUp size={20} style={{ color: "var(--color-primary)" }} />
            Daily Discover (နေ့စဉ်အသစ်များ)
          </h2>
          <div style={{ display: "flex", gap: "8px" }}>
            <span
              className={`discover-tab ${activeTab === "for-you" ? "active" : ""}`}
              onClick={() => setActiveTab("for-you")}
              style={{
                fontSize: "13px",
                fontWeight: 600,
                padding: "6px 12px",
                borderRadius: "20px",
                cursor: "pointer",
              }}
            >
              သင့်အတွက်
            </span>
            <span
              className={`discover-tab ${activeTab === "trending" ? "active" : ""}`}
              onClick={() => setActiveTab("trending")}
              style={{
                fontSize: "13px",
                fontWeight: 500,
                padding: "6px 12px",
                borderRadius: "20px",
                cursor: "pointer",
                color: "var(--color-text-secondary)",
              }}
            >
              အရောင်းရဆုံး
            </span>
          </div>
        </div>

        {/* Product Grid */}
        {products && products.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
              gap: "12px",
              padding: "20px 24px",
            }}
          >
            {displayedProducts.map((product) => {
              const { sales, rating } = getProductStats(product);

              return (
                <Link
                  key={`discover-${product.id}`}
                  href={`/products/${product.id}`}
                  className="discover-product-card"
                  style={{
                    background: "var(--color-surface)",
                    display: "flex",
                    flexDirection: "column",
                    textDecoration: "none",
                    color: "inherit",
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: "1px solid var(--color-border-light)",
                    transition: "all var(--transition-base)",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      paddingBottom: "100%",
                      background: "var(--color-bg-secondary)",
                    }}
                  >
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 250px"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "2rem",
                          color: "#ccc",
                        }}
                      >
                        ☐
                      </div>
                    )}

                    {/* Category Badge overlay on image */}
                    {product.category && (
                      <div
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          background: "rgba(0, 0, 0, 0.65)",
                          color: "#fff",
                          fontSize: "9px",
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: "4px",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        {product.category}
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      padding: "12px",
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 400,
                        color: "var(--color-text)",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        lineHeight: "16px",
                        height: "32px",
                      }}
                    >
                      {product.title}
                    </div>

                    {/* Rating & Sold count */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "11px",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          color: "#fbbf24",
                          gap: "1px",
                        }}
                      >
                        <Star size={10} fill="#fbbf24" stroke="none" />
                        <span
                          style={{
                            fontWeight: 600,
                            color: "var(--color-text)",
                          }}
                        >
                          {rating}
                        </span>
                      </div>
                      <span>|</span>
                      <span>
                        {sales} {soldText}
                      </span>
                    </div>

                    {/* Price */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: "auto",
                        paddingTop: "4px",
                      }}
                    >
                      <div
                        style={{
                          color: "var(--color-primary)",
                          fontSize: "17px",
                          fontWeight: 700,
                        }}
                      >
                        <span style={{ fontSize: "12px", fontWeight: 600 }}>
                          $
                        </span>
                        {Number(product.price).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "var(--color-text-tertiary)",
            }}
          >
            No products found
          </div>
        )}

        {/* Loading Spinner & Observer Trigger */}
        {visibleCount < products.length && (
          <div
            ref={observerRef}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "24px 0",
              width: "100%",
            }}
          >
            {isLoading ? (
              <div
                className="shopee-spinner"
                style={{
                  width: "28px",
                  height: "28px",
                  border: "3px solid var(--color-primary-ghost)",
                  borderTop: "3px solid var(--color-primary)",
                  borderRadius: "50%",
                  animation: "spin 0.6s linear infinite",
                }}
              />
            ) : (
              <div style={{ height: "20px" }} />
            )}
          </div>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `,
        }}
      />
    </div>
  );
}
