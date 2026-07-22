import { createAdminClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Store, MapPin, Package, ArrowRight, ShieldCheck } from "lucide-react";

export const revalidate = 60;

// Vibrant gradient helper for shop cards
function getShopGradient(name: string) {
  const gradients = [
    "linear-gradient(135deg, #2563eb, #1d4ed8)", // Blue
    "linear-gradient(135deg, #7c3aed, #6d28d9)", // Purple
    "linear-gradient(135deg, #059669, #047857)", // Emerald
    "linear-gradient(135deg, #d97706, #b45309)", // Amber
    "linear-gradient(135deg, #0891b2, #0e7490)", // Cyan
    "linear-gradient(135deg, #e11d48, #be123c)", // Rose
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}

export default async function ShopsIndexPage() {
  const supabase = createAdminClient();

  const { data: sellers } = await supabase
    .from("users")
    .select("id, full_name, shop_name, address, created_at, products(count)")
    .eq("role", "seller")
    .order("created_at", { ascending: false });

  return (
    <div className="container section" style={{ padding: "var(--space-xl) var(--container-padding)" }}>
      {/* Header Banner */}
      <div
        style={{
          marginBottom: "var(--space-2xl)",
          padding: "var(--space-2xl) var(--space-xl)",
          borderRadius: "var(--radius-xl)",
          background: "linear-gradient(135deg, var(--color-surface), var(--color-bg-secondary))",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-sm)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "var(--space-lg)",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "var(--font-size-xs)",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "var(--color-primary)",
              marginBottom: "8px",
            }}
          >
            <Store size={16} /> Official Brand Partners
          </div>
          <h1 className="section-title" style={{ fontSize: "var(--font-size-3xl)", margin: 0 }}>
            Discover Verified Shops
          </h1>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "var(--font-size-base)",
              marginTop: "6px",
              maxWidth: "540px",
            }}
          >
            Explore authentic Myanmar artisanal products, local craft shops, and direct brand storefronts on Yoe Yar Zay.
          </p>
        </div>

        <div
          style={{
            background: "var(--color-surface)",
            padding: "var(--space-md) var(--space-lg)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-border)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "var(--font-size-3xl)", fontWeight: 800, color: "var(--color-primary)" }}>
            {sellers?.length ?? 0}
          </div>
          <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-tertiary)", textTransform: "uppercase", fontWeight: 600 }}>
            Verified Sellers
          </div>
        </div>
      </div>

      {/* Grid of Sellers */}
      {sellers && sellers.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "var(--space-xl)",
          }}
        >
          {sellers.map((seller) => {
            const productCount = (seller.products as { count: number }[])?.[0]?.count ?? 0;
            const shopName = seller.shop_name || seller.full_name || "Official Seller";
            const initial = shopName.charAt(0).toUpperCase();
            const gradient = getShopGradient(shopName);
            const shopSlug = (seller.shop_name || seller.full_name || "")
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)+/g, "") || seller.id;

            return (
              <Link
                key={seller.id}
                href={`/shops/${shopSlug}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="product-card"
                  style={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-xl)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    transition: "all var(--transition-base)",
                    cursor: "pointer",
                  }}
                >
                  {/* Decorative Gradient Header */}
                  <div
                    style={{
                      height: "72px",
                      background: gradient,
                      position: "relative",
                    }}
                  />

                  {/* Body Content */}
                  <div
                    style={{
                      padding: "0 var(--space-lg) var(--space-lg)",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      marginTop: "-32px",
                    }}
                  >
                    {/* Avatar Icon */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        marginBottom: "var(--space-md)",
                      }}
                    >
                      <div
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "16px",
                          background: "var(--color-surface)",
                          padding: "4px",
                          boxShadow: "var(--shadow-md)",
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "12px",
                            background: gradient,
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: "24px",
                          }}
                        >
                          {initial}
                        </div>
                      </div>

                      <span
                        className="badge badge-success"
                        style={{
                          fontSize: "11px",
                          padding: "3px 8px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "3px",
                        }}
                      >
                        <ShieldCheck size={12} /> Verified
                      </span>
                    </div>

                    {/* Shop Name & Owner */}
                    <div style={{ flex: 1 }}>
                      <h2
                        style={{
                          fontWeight: 700,
                          fontSize: "var(--font-size-xl)",
                          color: "var(--color-text)",
                          marginBottom: "4px",
                          lineHeight: 1.3,
                        }}
                      >
                        {shopName}
                      </h2>
                      {seller.shop_name && seller.full_name && (
                        <div
                          style={{
                            fontSize: "var(--font-size-sm)",
                            color: "var(--color-text-secondary)",
                            marginBottom: "12px",
                          }}
                        >
                          Owner: {seller.full_name}
                        </div>
                      )}

                      {seller.address && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "var(--font-size-xs)",
                            color: "var(--color-text-tertiary)",
                            marginBottom: "12px",
                          }}
                        >
                          <MapPin size={13} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {seller.address}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Footer Row */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingTop: "var(--space-md)",
                        borderTop: "1px solid var(--color-border-light)",
                        marginTop: "var(--space-md)",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          fontSize: "var(--font-size-xs)",
                          fontWeight: 600,
                          color: "var(--color-text-secondary)",
                        }}
                      >
                        <Package size={14} style={{ color: "var(--color-primary)" }} /> {productCount} products
                      </span>
                      <span
                        style={{
                          color: "var(--color-primary)",
                          fontSize: "var(--font-size-sm)",
                          fontWeight: 600,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        Visit Store <ArrowRight size={14} />
                      </span>
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
            padding: "80px 24px",
            textAlign: "center",
            color: "var(--color-text-secondary)",
            background: "var(--color-surface)",
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--color-border)",
          }}
        >
          <Store
            size={56}
            style={{ marginBottom: "16px", color: "var(--color-border)", margin: "0 auto 16px" }}
          />
          <h3 style={{ fontSize: "var(--font-size-xl)", fontWeight: 700, color: "var(--color-text)" }}>
            No registered shops yet
          </h3>
          <p style={{ marginTop: "6px" }}>Be the first seller to launch a shop on Yoe Yar Zay.</p>
          <Link
            href="/settings"
            className="btn btn-primary"
            style={{ marginTop: "var(--space-lg)" }}
          >
            Apply to Become a Seller
          </Link>
        </div>
      )}
    </div>
  );
}
