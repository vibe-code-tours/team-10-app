import Link from "next/link";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Price } from "@/components/currency/Price";
import { Store, MapPin, Phone } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/server";

interface Props {
  params: Promise<{
    locale: string;
    seller_id: string;
  }>;
}

export const revalidate = 60;

export default async function ShopPage({ params }: Props) {
  const { seller_id } = await params;
  const supabase = createAdminClient();
  const t = await getTranslations("Products");

  // 1. Fetch targeted seller details by id (UUID) or shop slug candidate
  const isUuid =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
      seller_id
    );

  let seller = null;

  if (isUuid) {
    const { data } = await supabase
      .from("users")
      .select(
        "id, full_name, shop_name, phone_number, address, role, created_at"
      )
      .eq("role", "seller")
      .eq("id", seller_id)
      .maybeSingle();
    seller = data;
  } else {
    const firstWord = seller_id.split("-")[0] || "";
    const { data: candidates } = await supabase
      .from("users")
      .select(
        "id, full_name, shop_name, phone_number, address, role, created_at"
      )
      .eq("role", "seller")
      .or(`shop_name.ilike.%${firstWord}%,full_name.ilike.%${firstWord}%`);

    seller =
      (candidates || []).find((s) => {
        const slug = (s.shop_name || s.full_name || "")
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
        return slug === seller_id;
      }) || null;
  }

  if (!seller || seller.role !== "seller") {
    return (
      <div className="container section text-center">
        <h2>Shop not found</h2>
        <Link href="/" className="btn btn-primary mt-4">
          Go Back Home
        </Link>
      </div>
    );
  }

  // 2. Fetch seller's products using seller.id
  const { data: products, count } = await supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("seller_id", seller.id)
    .order("created_at", { ascending: false });

  return (
    <div className="container section" id="shop-page">
      {/* Shop Header */}
      <div
        style={{
          background: "var(--color-surface)",
          borderRadius: "12px",
          padding: "32px",
          marginBottom: "32px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          display: "flex",
          gap: "24px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: "var(--color-primary-ghost)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "48px",
            color: "var(--color-primary)",
            flexShrink: 0,
          }}
        >
          <Store size={48} />
        </div>
        <div style={{ flex: 1 }}>
          <h1
            style={{
              margin: "0 0 6px 0",
              fontSize: "28px",
              color: "var(--color-text)",
            }}
          >
            {seller.shop_name || seller.full_name || "Unknown Shop"}
          </h1>
          {seller.shop_name && seller.full_name && (
            <div
              style={{
                fontSize: "14px",
                color: "var(--color-text-secondary)",
                marginBottom: "8px",
              }}
            >
              by {seller.full_name}
            </div>
          )}
          <div
            style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
              color: "var(--color-text-secondary)",
              fontSize: "14px",
            }}
          >
            {seller.address && (
              <span
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <MapPin size={16} /> {seller.address}
              </span>
            )}
            {seller.phone_number && (
              <span
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <Phone size={16} /> {seller.phone_number}
              </span>
            )}
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              🗓 Member since {new Date(seller.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="section-header">
        <h2 className="section-title">{t("allProducts")}</h2>
        <div className="text-secondary" style={{ fontSize: "14px" }}>
          {count ?? 0} items
        </div>
      </div>

      {/* Shop Products Grid */}
      <div style={{ width: "100%" }}>
        {products && products.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "var(--space-md)",
            }}
          >
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="product-card"
              >
                <div
                  className="product-card-image"
                  style={{ position: "relative" }}
                >
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "var(--color-bg-secondary)",
                        fontSize: "2rem",
                        color: "var(--color-text-tertiary)",
                      }}
                    >
                      ☐
                    </div>
                  )}
                  {product.category && (
                    <span className="product-card-category-badge">
                      {product.category}
                    </span>
                  )}
                </div>
                <div className="product-card-body">
                  <div className="product-card-name">{product.title}</div>
                  <div className="product-card-price">
                    <Price amount={product.price} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-title">No products found</div>
            <div className="empty-state-desc">
              This shop hasn&apos;t listed any products yet.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
