import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { HeroSlider } from "@/components/home/HeroSlider";
import { Flame, Clock, Sparkles, ChevronRight } from "lucide-react";
import { DailyDiscover } from "@/components/home/DailyDiscover";

export default async function HomePage() {
  const supabase = await createClient();
  const t = await getTranslations("HomePage");

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  // Group products by category
  const productsByCategory: Record<
    string,
    {
      id: string;
      title: string;
      price: number;
      image_url: string;
      category: string;
    }[]
  > = {};

  if (products) {
    products.forEach((product) => {
      const category = product.category || "uncategorized";
      if (!productsByCategory[category]) {
        productsByCategory[category] = [];
      }
      productsByCategory[category].push(product);
    });
  }

  const categories = Object.keys(productsByCategory).sort();

  const categoryImages: Record<string, string> = {
    beauty: "https://loremflickr.com/200/200/cosmetics?lock=1",
    books: "https://loremflickr.com/200/200/books?lock=1",
    clothing: "https://loremflickr.com/200/200/clothing?lock=1",
    computer: "https://loremflickr.com/200/200/laptop?lock=1",
    electronics: "https://loremflickr.com/200/200/electronics?lock=1",
    furniture: "https://loremflickr.com/200/200/furniture?lock=1",
    gaming: "https://loremflickr.com/200/200/gaming?lock=1",
    groceries: "https://loremflickr.com/200/200/groceries?lock=1",
    health: "https://loremflickr.com/200/200/health?lock=1",
    "home-decoration": "https://loremflickr.com/200/200/homedecor?lock=1",
    mobile: "https://loremflickr.com/200/200/mobilephone?lock=1",
    music: "https://loremflickr.com/200/200/music?lock=1",
    shoes: "https://loremflickr.com/200/200/shoes?lock=1",
    tools: "https://loremflickr.com/200/200/tools?lock=1",
    toys: "https://loremflickr.com/200/200/toys?lock=1",
    watches: "https://loremflickr.com/200/200/watches?lock=1",
  };

  const quickLinks = [
    { label: t("quickLinks.new_user_zone"), icon: "🎁" },
    { label: t("quickLinks.free_shipping"), icon: "🚚" },
    { label: t("quickLinks.daily_50"), icon: "🏷️" },
    { label: t("quickLinks.football"), icon: "⚽" },
    { label: t("quickLinks.shopee_choice"), icon: "⭐" },
    { label: t("quickLinks.get_ready"), icon: "👗" },
    { label: t("quickLinks.supermarket"), icon: "🛒" },
    { label: t("quickLinks.global"), icon: "🌍" },
    { label: t("quickLinks.cod"), icon: "💵" },
    { label: t("quickLinks.collection_point"), icon: "🏪" },
  ];

  return (
    <div
      style={{
        background: "var(--color-bg)",
        minHeight: "100vh",
        paddingBottom: "60px",
      }}
    >
      <h1 className="sr-only">Yoe Yar Zay Online Shop</h1>

      {/* Banner Section */}
      <div className="container" style={{ paddingTop: "20px" }}>
        <HeroSlider />
      </div>

      {/* Quick Links */}
      <div className="container" style={{ marginTop: "24px" }}>
        <div
          style={{
            background: "var(--color-surface)",
            borderRadius: "12px",
            padding: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "16px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
            flexWrap: "wrap",
          }}
        >
          {quickLinks.map((link, i) => (
            <div
              key={i}
              className="quick-link-item"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "80px",
                textAlign: "center",
                gap: "8px",
                cursor: "pointer",
                transition: "transform var(--transition-fast)",
              }}
            >
              <div
                className="quick-link-icon-wrapper"
                style={{
                  width: "48px",
                  height: "48px",
                  background: "var(--color-primary-ghost)",
                  color: "var(--color-primary)",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  transition: "all var(--transition-fast)",
                }}
              >
                {link.icon}
              </div>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  lineHeight: "1.3",
                  color: "var(--color-text-secondary)",
                }}
              >
                {link.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="container" style={{ marginTop: "24px" }}>
        <div
          style={{
            background: "var(--color-surface)",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid var(--color-border-light)",
              color: "var(--color-text)",
              fontWeight: 600,
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Sparkles size={18} style={{ color: "var(--color-primary)" }} />
            {t("categories")}
          </div>
          <div
            className="categories-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
              borderLeft: "1px solid var(--color-border-light)",
            }}
          >
            {categories.map((category) => (
              <Link
                href={`/products?category=${category}`}
                key={category}
                className="category-tile"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20px 12px",
                  borderRight: "1px solid var(--color-border-light)",
                  borderBottom: "1px solid var(--color-border-light)",
                  textAlign: "center",
                  cursor: "pointer",
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "64px",
                    height: "64px",
                    marginBottom: "12px",
                    background: "var(--color-bg-secondary)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    overflow: "hidden",
                    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
                  }}
                >
                  {categoryImages[category.toLowerCase()] ? (
                    <Image
                      src={categoryImages[category.toLowerCase()]}
                      alt={category}
                      fill
                      sizes="64px"
                      style={{ objectFit: "cover" }}
                    />
                  ) : productsByCategory[category]?.[0]?.image_url ? (
                    <Image
                      src={productsByCategory[category][0].image_url}
                      alt={category}
                      fill
                      sizes="64px"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    "📦"
                  )}
                </div>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--color-text)",
                    textTransform: "capitalize",
                    lineHeight: "1.2",
                  }}
                >
                  {category}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Flash Sale Section */}
      {products && products.length > 0 && (
        <div className="container" style={{ marginTop: "24px" }}>
          <div
            style={{
              background: "var(--color-surface)",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              overflow: "hidden",
            }}
          >
            {/* Flash Sale Header */}
            <div
              style={{
                padding: "16px 24px",
                background: "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)",
                color: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <Flame
                    size={20}
                    fill="#fff"
                    style={{ animation: "pulse 1.5s infinite" }}
                  />
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: 700,
                      letterSpacing: "1px",
                    }}
                  >
                    FLASH SALE
                  </span>
                </div>
                {/* Countdown Timer */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginLeft: "12px",
                    fontSize: "14px",
                  }}
                >
                  <Clock size={16} />
                  <div style={{ display: "flex", gap: "4px", fontWeight: 600 }}>
                    <span
                      style={{
                        background: "#111",
                        padding: "2px 6px",
                        borderRadius: "4px",
                      }}
                    >
                      02
                    </span>
                    :
                    <span
                      style={{
                        background: "#111",
                        padding: "2px 6px",
                        borderRadius: "4px",
                      }}
                    >
                      45
                    </span>
                    :
                    <span
                      style={{
                        background: "#111",
                        padding: "2px 6px",
                        borderRadius: "4px",
                      }}
                    >
                      12
                    </span>
                  </div>
                </div>
              </div>
              <Link
                href="/products"
                style={{
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 500,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {t("viewMore") || "View more"} <ChevronRight size={16} />
              </Link>
            </div>

            {/* Flash Sale Product Row (Horizontal Scroll) */}
            <div
              style={{
                display: "flex",
                overflowX: "auto",
                padding: "20px 24px",
                gap: "16px",
                scrollBehavior: "smooth",
              }}
              className="hide-scrollbar"
            >
              {products.slice(0, 6).map((product) => {
                const originalPrice = product.price * 1.25; // mock 20% discount
                const mockSoldPercentage = 40 + (product.title.length % 41); // 40-80% sold deterministically

                return (
                  <Link
                    key={`flash-${product.id}`}
                    href={`/products/${product.id}`}
                    className="flash-sale-card"
                    style={{
                      flex: "0 0 160px",
                      background: "var(--color-surface)",
                      display: "flex",
                      flexDirection: "column",
                      textDecoration: "none",
                      color: "inherit",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: "1px solid var(--color-border-light)",
                      position: "relative",
                    }}
                  >
                    {/* Discount Badge */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        background: "#fee2e2",
                        color: "#ef4444",
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "2px 6px",
                        borderBottomLeftRadius: "8px",
                        zIndex: 2,
                      }}
                    >
                      -20%
                    </div>

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
                    </div>

                    <div
                      style={{
                        padding: "10px",
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                        gap: "6px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--color-text)",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          lineHeight: "14px",
                          height: "28px",
                        }}
                      >
                        {product.title}
                      </div>

                      <div style={{ marginTop: "auto" }}>
                        {/* Prices */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "baseline",
                            gap: "4px",
                          }}
                        >
                          <span
                            style={{
                              color: "#ef4444",
                              fontSize: "16px",
                              fontWeight: 700,
                            }}
                          >
                            <span style={{ fontSize: "11px" }}>$</span>
                            {Number(product.price).toFixed(2)}
                          </span>
                        </div>
                        <div
                          style={{
                            color: "var(--color-text-tertiary)",
                            fontSize: "11px",
                            textDecoration: "line-through",
                          }}
                        >
                          ${originalPrice.toFixed(2)}
                        </div>

                        {/* Progress Bar */}
                        <div style={{ marginTop: "8px" }}>
                          <div
                            style={{
                              height: "12px",
                              background: "#fee2e2",
                              borderRadius: "6px",
                              position: "relative",
                              overflow: "hidden",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <div
                              style={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                bottom: 0,
                                background:
                                  "linear-gradient(90deg, #ef4444 0%, #f97316 100%)",
                                width: `${mockSoldPercentage}%`,
                              }}
                            />
                            <span
                              style={{
                                position: "relative",
                                fontSize: "8px",
                                fontWeight: 700,
                                color:
                                  mockSoldPercentage > 50 ? "#fff" : "#ef4444",
                                zIndex: 1,
                              }}
                            >
                              ရောင်းပြီး {mockSoldPercentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Featured Highlight Panels */}
      {["computer", "mobile"].map((category) => {
        const catProducts = productsByCategory[category];
        if (!catProducts || catProducts.length === 0) return null;

        return (
          <div
            key={`section-${category}`}
            className="container"
            style={{ marginTop: "24px" }}
          >
            <div
              style={{
                background: "var(--color-surface)",
                borderRadius: "12px 12px 0 0",
                padding: "16px 24px",
                borderBottom: "1px solid var(--color-border-light)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "var(--color-primary)",
                  textTransform: "capitalize",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Sparkles size={16} />
                {category === "computer"
                  ? "Computers (ကွန်ပျူတာများ)"
                  : "Mobiles (ဖုန်းများ)"}
              </h2>
              <Link
                href={`/products?category=${category}`}
                style={{
                  fontSize: "13px",
                  color: "var(--color-text-secondary)",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {t("viewMore") || "View more"} <ChevronRight size={14} />
              </Link>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
                gap: "10px",
                background: "var(--color-surface)",
                padding: "20px 24px",
                borderRadius: "0 0 12px 12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              }}
            >
              {catProducts.slice(0, 5).map((product) => (
                <Link
                  key={`featured-prod-${product.id}`}
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
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 200px"
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
                  </div>
                  <div
                    style={{
                      padding: "10px",
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                      gap: "6px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--color-text)",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        lineHeight: "14px",
                        height: "28px",
                      }}
                    >
                      {product.title}
                    </div>
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
                          fontSize: "15px",
                          fontWeight: 700,
                        }}
                      >
                        <span style={{ fontSize: "11px" }}>$</span>
                        {Number(product.price).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              {/* View More Card */}
              <Link
                href={`/products?category=${category}`}
                className="discover-product-card"
                style={{
                  background: "var(--color-surface)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  color: "var(--color-primary)",
                  border: "1px solid var(--color-border-light)",
                  borderRadius: "8px",
                  minHeight: "180px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    border: "2px solid var(--color-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    marginBottom: "10px",
                  }}
                >
                  ➜
                </div>
                <div style={{ fontWeight: 600, fontSize: "13px" }}>
                  {t("viewMore") || "View more"}
                </div>
              </Link>
            </div>
          </div>
        );
      })}

      {/* Daily Discover Section */}
      <DailyDiscover products={products || []} soldText={t("sold") || "sold"} />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .quick-link-item:hover .quick-link-icon-wrapper {
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
          background: var(--color-primary) !important;
          color: #fff !important;
        }
        .category-tile {
          transition: all var(--transition-base);
        }
        .category-tile:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
          transform: translateY(-2px);
          z-index: 1;
          background: var(--color-surface);
        }
        .category-tile:hover img {
          transform: scale(1.05);
        }
        .category-tile img {
          transition: transform var(--transition-base);
        }
        .flash-sale-card {
          transition: all var(--transition-base);
        }
        .flash-sale-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.12);
          border-color: var(--color-primary) !important;
        }
        .discover-tab {
          transition: all var(--transition-fast);
        }
        .discover-tab.active {
          background: var(--color-primary-ghost);
          color: var(--color-primary) !important;
        }
        .discover-tab:hover:not(.active) {
          background: var(--color-bg-secondary);
        }
        .discover-product-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.05);
          border-color: var(--color-primary) !important;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      `,
        }}
      />
    </div>
  );
}
