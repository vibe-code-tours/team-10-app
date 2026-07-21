"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Star, TrendingUp, ShoppingBag, Flame, Sparkles } from "lucide-react";
import Image from "next/image";
import { Price } from "@/components/currency/Price";

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
  title: string;
  forYouText: string;
  trendingText: string;
  noProductsText: string;
}

export function DailyDiscover({
  products,
  soldText,
  title,
  forYouText,
  trendingText,
  noProductsText,
}: Props) {
  const [visibleCount, setVisibleCount] = useState(24);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("for-you");
  const observerRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  // Deterministic product stats & badges
  const getProductStats = (product: Product) => {
    const priceHash = Math.round(product.price * 100);
    const titleHash = product.title.length;
    const sales = ((priceHash * 13 + titleHash * 7) % 450) + 12;
    const rating = (4.5 + ((priceHash * 7 + titleHash) % 6) * 0.1).toFixed(1);
    
    // Deterministic promo badge
    const badgeType = ((priceHash + titleHash) % 4);
    let badgeText = null;
    let badgeColor = "var(--color-primary)";

    if (badgeType === 1) {
      badgeText = "HOT";
      badgeColor = "#ef4444";
    } else if (badgeType === 2) {
      badgeText = "BESTSELLER";
      badgeColor = "#f59e0b";
    } else if (badgeType === 3) {
      badgeText = "NEW";
      badgeColor = "#10b981";
    }

    return { sales, rating, badgeText, badgeColor };
  };

  useEffect(() => {
    if (visibleCount >= products.length) return;

    const el = observerRef.current;
    if (!el) return;

    let timeoutId: NodeJS.Timeout;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingRef.current) {
          isLoadingRef.current = true;
          setIsLoading(true);

          timeoutId = setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + 18, products.length));
            isLoadingRef.current = false;
            setIsLoading(false);
          }, 400);
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [products.length, visibleCount]);

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
            padding: "16px 24px",
            borderBottom: "1px solid var(--color-border-light)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <h2
            style={{
              fontSize: "17px",
              fontWeight: 700,
              color: "var(--color-text)",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <TrendingUp size={20} style={{ color: "var(--color-primary)" }} />
            {title}
          </h2>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              className={`discover-tab ${activeTab === "for-you" ? "active" : ""}`}
              onClick={() => setActiveTab("for-you")}
              style={{
                fontSize: "13px",
                fontWeight: activeTab === "for-you" ? 700 : 500,
                padding: "6px 14px",
                borderRadius: "20px",
                cursor: "pointer",
                border: "none",
                background: activeTab === "for-you" ? "var(--color-primary)" : "var(--color-bg-secondary)",
                color: activeTab === "for-you" ? "#fff" : "var(--color-text-secondary)",
                transition: "all 0.2s ease",
              }}
            >
              {forYouText}
            </button>
            <button
              className={`discover-tab ${activeTab === "trending" ? "active" : ""}`}
              onClick={() => setActiveTab("trending")}
              style={{
                fontSize: "13px",
                fontWeight: activeTab === "trending" ? 700 : 500,
                padding: "6px 14px",
                borderRadius: "20px",
                cursor: "pointer",
                border: "none",
                background: activeTab === "trending" ? "var(--color-primary)" : "var(--color-bg-secondary)",
                color: activeTab === "trending" ? "#fff" : "var(--color-text-secondary)",
                transition: "all 0.2s ease",
              }}
            >
              {trendingText}
            </button>
          </div>
        </div>

        {/* Responsive Product Grid */}
        {products && products.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: "12px",
              padding: "16px",
            }}
            className="home-product-responsive-grid"
          >
            {displayedProducts.map((product) => {
              const { sales, rating, badgeText, badgeColor } = getProductStats(product);

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
                    borderRadius: "10px",
                    overflow: "hidden",
                    border: "1px solid var(--color-border-light)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                    position: "relative",
                  }}
                >
                  {/* Thumbnail Wrapper */}
                  <div
                    style={{
                      position: "relative",
                      paddingBottom: "100%",
                      background: "var(--color-bg-secondary)",
                      overflow: "hidden",
                    }}
                  >
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
                        style={{ objectFit: "cover", transition: "transform 0.3s ease" }}
                        className="product-card-img"
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

                    {/* Promo Badge */}
                    {badgeText && (
                      <div
                        style={{
                          position: "absolute",
                          top: "8px",
                          left: "8px",
                          background: badgeColor,
                          color: "#fff",
                          fontSize: "9.5px",
                          fontWeight: 800,
                          padding: "2px 6px",
                          borderRadius: "4px",
                          letterSpacing: "0.04em",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                          zIndex: 2,
                        }}
                      >
                        {badgeText}
                      </div>
                    )}

                    {/* Category Badge overlay on image */}
                    {product.category && (
                      <div
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          background: "rgba(0, 0, 0, 0.6)",
                          color: "#fff",
                          fontSize: "9px",
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: "4px",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          backdropFilter: "blur(4px)",
                          zIndex: 2,
                        }}
                      >
                        {product.category}
                      </div>
                    )}

                    {/* Quick View Floating Cart Icon */}
                    <div
                      className="quick-cart-btn"
                      style={{
                        position: "absolute",
                        bottom: "8px",
                        right: "8px",
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "var(--color-primary)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                        transition: "all 0.2s ease",
                        zIndex: 3,
                      }}
                    >
                      <ShoppingBag size={15} />
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div
                    style={{
                      padding: "10px 12px",
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                      gap: "6px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12.5px",
                        fontWeight: 500,
                        color: "var(--color-text)",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        lineHeight: "17px",
                        height: "34px",
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
                        <Star size={11} fill="#fbbf24" stroke="none" />
                        <span
                          style={{
                            fontWeight: 600,
                            color: "var(--color-text)",
                            fontSize: "11.5px",
                          }}
                        >
                          {rating}
                        </span>
                      </div>
                      <span>•</span>
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
                        paddingTop: "2px",
                      }}
                    >
                      <div
                        style={{
                          color: "var(--color-primary)",
                          fontSize: "15.5px",
                          fontWeight: 700,
                        }}
                      >
                        <Price amount={product.price} />
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
            {noProductsText}
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
        .discover-product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
          border-color: var(--color-primary-ghost) !important;
        }
        .discover-product-card:hover .product-card-img {
          transform: scale(1.06);
        }
        .discover-product-card:hover .quick-cart-btn {
          transform: scale(1.1);
          background: var(--color-primary-dark);
        }
        @media (max-width: 480px) {
          .home-product-responsive-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 8px !important;
            padding: 10px !important;
          }
        }
      `,
        }}
      />
    </div>
  );
}
