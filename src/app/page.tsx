/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

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

  // Get unique categories
  const categories = Object.keys(productsByCategory).sort();

  return (
    <>
      <section className="hero" id="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="gradient-text">ShopMM</span> မှ လိုချင်တာရှာပါ
            </h1>
            <p className="hero-subtitle">
              ဆိုင်ပေါင်းစုံမှ ပစ္စည်းများကို ခြင်းတောင်းတစ်ခုတည်းဖြင့်
              စုဝယ်ပြီး လုံခြုံစွာမှာယူနိုင်ပါသည်။
            </p>
            <div className="hero-actions">
              <Link
                href="/products"
                className="btn btn-primary btn-lg"
                id="cta-browse"
              >
                ပစ္စည်းများကြည့်ရန် →
              </Link>
              <Link
                href="/register"
                className="btn btn-secondary btn-lg"
                id="cta-register"
              >
                အကောင့်ဖန်တီးရန်
              </Link>
            </div>
          </div>
        </div>
      </section>

      {categories.map((category) => (
        <section
          key={category}
          className="section"
          style={{ borderTop: "1px solid var(--color-border-light)" }}
        >
          <div className="container">
            <div className="section-header">
              <h2
                className="section-title"
                style={{ textTransform: "capitalize" }}
              >
                {category}
              </h2>
              <Link
                href={`/products?category=${category}`}
                className="btn btn-ghost btn-sm"
              >
                အားလုံးကြည့်ရန် →
              </Link>
            </div>

            <div className="product-grid">
              {productsByCategory[category].slice(0, 8).map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="product-card"
                  id={`product-${product.id}`}
                >
                  <div className="product-card-image">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.title}
                        loading="lazy"
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
                          color: "var(--color-text-tertiary)",
                          fontSize: "2rem",
                        }}
                      >
                        ☐
                      </div>
                    )}
                  </div>
                  <div className="product-card-body">
                    <div
                      className="product-card-name"
                      style={{ marginBottom: "var(--space-xs)" }}
                    >
                      {product.title}
                    </div>
                    <div className="product-card-price">
                      ${Number(product.price).toFixed(2)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      {(!categories || categories.length === 0) && (
        <section className="section">
          <div className="container">
            <div className="empty-state">
              <div className="empty-state-title">
                ပစ္စည်းများ မကြာမီရောက်လာပါမည်
              </div>
              <div className="empty-state-desc">
                Admin Dashboard မှ Product များကို ထည့်သွင်းပေးပါ
              </div>
            </div>
          </div>
        </section>
      )}

      <section
        className="section"
        style={{ borderTop: "1px solid var(--color-border-light)" }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "var(--space-xl)",
              textAlign: "center",
            }}
          >
            <div style={{ padding: "var(--space-lg)" }}>
              <h3
                style={{
                  fontSize: "var(--font-size-base)",
                  fontWeight: 500,
                  marginBottom: "var(--space-xs)",
                }}
              >
                လုံခြုံသောငွေပေးချေမှု
              </h3>
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "var(--font-size-sm)",
                }}
              >
                ငွေလွှဲပြေစာအတည်ပြုစနစ်ဖြင့် ယုံကြည်စိတ်ချရ
              </p>
            </div>
            <div style={{ padding: "var(--space-lg)" }}>
              <h3
                style={{
                  fontSize: "var(--font-size-base)",
                  fontWeight: 500,
                  marginBottom: "var(--space-xs)",
                }}
              >
                မြန်ဆန်သောပို့ဆောင်မှု
              </h3>
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "var(--font-size-sm)",
                }}
              >
                ဆိုင်တစ်ခုချင်းစီ၏ ပို့ဆောင်ရေးဖြင့် အမြန်ရောက်ရှိ
              </p>
            </div>
            <div style={{ padding: "var(--space-lg)" }}>
              <h3
                style={{
                  fontSize: "var(--font-size-base)",
                  fontWeight: 500,
                  marginBottom: "var(--space-xs)",
                }}
              >
                ဆိုင်ပေါင်းစုံ
              </h3>
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "var(--font-size-sm)",
                }}
              >
                ဆိုင်အမျိုးမျိုးမှ ပစ္စည်းများကို တစ်နေရာတည်းတွင်ဝယ်ယူ
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
