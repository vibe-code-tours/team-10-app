import Link from "next/link";
import Image from "next/image";
import { createPublicClient } from "@/lib/supabase/public";
import { getTranslations } from "next-intl/server";
import { HeroSlider } from "@/components/home/HeroSlider";
import { Flame, Clock, Sparkles, ChevronRight, Store } from "lucide-react";
import { DailyDiscover } from "@/components/home/DailyDiscover";
import { Price } from "@/components/currency/Price";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getCategoryImageMap, resolveCategoryImage } from "@/lib/category-image-store";
import { createAdminClient } from "@/lib/supabase/server";

function getHomepageShopGradient(name: string) {
  const gradients = [
    "linear-gradient(135deg, #2563eb, #1d4ed8)",
    "linear-gradient(135deg, #7c3aed, #6d28d9)",
    "linear-gradient(135deg, #059669, #047857)",
    "linear-gradient(135deg, #d97706, #b45309)",
    "linear-gradient(135deg, #0891b2, #0e7490)",
    "linear-gradient(135deg, #e11d48, #be123c)",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}

import { ValuePropsBar } from "@/components/home/ValuePropsBar";

export default async function HomePage() {
  const supabase = createPublicClient();
  const adminSupabase = createAdminClient();
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

  const categoryMap = await getCategoryImageMap();

  const { data: dbCategories } = await adminSupabase
    .from("categories")
    .select("id, name, slug, image_url")
    .order("name", { ascending: true });

  // Build dynamic categories list from database categories table
  const categoriesList: { name: string; slug: string; image_url: string; count: number }[] = [];
  const processedSlugs = new Set<string>();

  if (dbCategories && dbCategories.length > 0) {
    dbCategories.forEach((cat) => {
      const slugKey = (cat.slug || cat.name).toLowerCase();
      processedSlugs.add(slugKey);
      const count =
        productsByCategory[slugKey]?.length ||
        productsByCategory[cat.name.toLowerCase()]?.length ||
        0;

      const imageUrl = resolveCategoryImage(cat, categoryMap);

      categoriesList.push({
        name: cat.name,
        slug: cat.slug || slugKey,
        image_url: imageUrl,
        count,
      });
    });
  }

  // Fallback for any product categories not in dbCategories table
  Object.keys(productsByCategory).forEach((catKey) => {
    const slugKey = catKey.toLowerCase();
    if (!processedSlugs.has(slugKey)) {
      processedSlugs.add(slugKey);
      const count = productsByCategory[catKey]?.length || 0;
      const imageUrl = resolveCategoryImage({ name: catKey, slug: slugKey }, categoryMap);

      categoriesList.push({
        name: catKey.charAt(0).toUpperCase() + catKey.slice(1),
        slug: slugKey,
        image_url: imageUrl,
        count,
      });
    }
  });

  const { data: sellers } = await adminSupabase
    .from("users")
    .select("id, full_name, shop_name, created_at")
    .eq("role", "seller")
    .order("created_at", { ascending: false });

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

      {/* Value Proposition Trust Bar */}
      <ValuePropsBar />

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
              padding: "16px 24px",
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
            {categoriesList.map((catItem) => {
              return (
                <Link
                  href={`/products?category=${catItem.slug}`}
                  key={catItem.slug}
                  className="category-tile"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "18px 10px",
                    borderRight: "1px solid var(--color-border-light)",
                    borderBottom: "1px solid var(--color-border-light)",
                    textAlign: "center",
                    cursor: "pointer",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "60px",
                      height: "60px",
                      marginBottom: "10px",
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
                    <Image
                      src={catItem.image_url}
                      alt={catItem.name}
                      fill
                      sizes="60px"
                      style={{ objectFit: "cover", transition: "transform 0.3s ease" }}
                      className="category-tile-img"
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "var(--color-text)",
                      textTransform: "capitalize",
                      lineHeight: "1.2",
                    }}
                  >
                    {catItem.name}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--color-text-tertiary)",
                      marginTop: "2px",
                    }}
                  >
                    {catItem.count} items
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Brand Shops Section */}
      {sellers && sellers.length > 0 && (
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
                padding: "16px 24px",
                borderBottom: "1px solid var(--color-border-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  color: "var(--color-text)",
                  fontWeight: 600,
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Store size={18} style={{ color: "var(--color-primary)" }} />
                {t("brandShops") || "All Shops"}
              </div>
              <Link
                href="/shops"
                style={{
                  fontSize: "13px",
                  color: "var(--color-primary)",
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {t("viewMore") || "View All Shops"} <ChevronRight size={14} />
              </Link>
            </div>
            <div
              style={{
                display: "flex",
                overflowX: "auto",
                padding: "20px 24px",
                gap: "20px",
                scrollBehavior: "smooth",
              }}
              className="hide-scrollbar"
            >
              {sellers.map((seller) => {
                const shopTitle = seller.shop_name || seller.full_name || "Official Shop";
                const initialLetter = shopTitle.charAt(0).toUpperCase();
                const avatarGradient = getHomepageShopGradient(shopTitle);
                const shopSlug = (seller.shop_name || seller.full_name || "")
                  .toLowerCase()
                  .trim()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)+/g, "") || seller.id;

                return (
                  <Link
                    key={seller.id}
                    href={`/shops/${shopSlug}`}
                    style={{
                      flex: "0 0 130px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textDecoration: "none",
                      gap: "10px",
                      transition: "transform 0.2s ease",
                    }}
                    className="brand-shop-card"
                  >
                    <div
                      style={{
                        width: "72px",
                        height: "72px",
                        borderRadius: "50%",
                        background: avatarGradient,
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "26px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                        border: "3px solid #fff",
                      }}
                    >
                      {initialLetter}
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "var(--color-text)",
                          lineHeight: "1.2",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {shopTitle}
                      </div>
                      <div style={{ fontSize: "10.5px", color: "var(--color-success)", fontWeight: 600, marginTop: "2px" }}>
                        ✓ Verified
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

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
                background:
                  "linear-gradient(90deg, var(--color-primary-dark) 0%, var(--color-primary-light) 100%)",
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
              {products
                .filter((p) => p.category === "mobile")
                .slice(0, 6)
                .map((product) => {
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
                              <Price amount={product.price} />
                            </span>
                          </div>
                          <div
                            style={{
                              color: "var(--color-text-tertiary)",
                              fontSize: "11px",
                              textDecoration: "line-through",
                            }}
                          >
                            <Price amount={originalPrice} />
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
                                    mockSoldPercentage > 50
                                      ? "#fff"
                                      : "#ef4444",
                                  zIndex: 1,
                                }}
                              >
                                {t("soldPercent", {
                                  percent: mockSoldPercentage,
                                })}
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
                  ? t("computersLabel")
                  : t("mobilesLabel")}
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
              {catProducts.slice(0, 6).map((product) => (
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
                        <Price amount={product.price} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}

      {/* Daily Discover Section */}
      <DailyDiscover
        products={products || []}
        soldText={t("sold") || "sold"}
        title={t("dailyDiscover")}
        forYouText={t("forYou")}
        trendingText={t("trending")}
        noProductsText={t("noProductsFound")}
      />

      <style>{`
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
        .category-tile:hover .category-tile-img {
          transform: scale(1.1);
        }
        .brand-shop-card:hover {
          transform: translateY(-4px) !important;
        }
        .brand-shop-card:hover div {
          border-color: var(--color-primary) !important;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @media (max-width: 640px) {
          .categories-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 420px) {
          .categories-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}
