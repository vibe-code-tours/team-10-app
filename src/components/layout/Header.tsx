import { Link } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";
import { ThemeToggle } from "@/components/theme-toggle";
import { CartIcon } from "@/components/layout/CartIcon";
import { Search, Store, Sparkles, ShoppingBag } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import CurrencySwitcher from "@/components/currency/CurrencySwitcher";
import { getTranslations } from "next-intl/server";
import ProfileDropdown from "@/components/layout/ProfileDropdown";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const t = await getTranslations("Header");

  let fullName = "User";

  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("full_name, shop_name")
      .eq("id", user.id)
      .maybeSingle();

    fullName =
      profile?.full_name ||
      profile?.shop_name ||
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "User";
  }

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: "var(--color-surface)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      {/* 1. Top Utility & Preferences Strip */}
      <div
        style={{
          background: "var(--color-bg-secondary)",
          borderBottom: "1px solid var(--color-border-light)",
          fontSize: "12px",
          color: "var(--color-text-secondary)",
        }}
      >
        <div
          style={{
            maxWidth: "var(--container-max)",
            margin: "0 auto",
            padding: "6px var(--container-padding)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          {/* Left Announcement Message */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 500 }}>
            <span
              style={{
                background: "rgba(37, 99, 235, 0.1)",
                color: "var(--color-primary)",
                padding: "2px 8px",
                borderRadius: "10px",
                fontSize: "11px",
                fontWeight: 700,
              }}
            >
              PROMO
            </span>
            <span>
              🇲🇲 Authentic Myanmar Heritage Marketplace | Free shipping on orders over 50,000 MMK
            </span>
          </div>

          {/* Right Utility Group (Language, Currency, Theme, Seller Centre) */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link
              href="/seller/apply"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                color: "var(--color-text-secondary)",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "12px",
                marginRight: "4px",
              }}
            >
              <Store size={14} style={{ color: "var(--color-primary)" }} />
              <span>{t("sellerCentre") || "Seller Centre"}</span>
            </Link>

            <div style={{ height: "14px", width: "1px", background: "var(--color-border)" }} />

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <LanguageSwitcher />
              <CurrencySwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Header Bar (Logo, Search, User & Cart) */}
      <div
        style={{
          maxWidth: "var(--container-max)",
          margin: "0 auto",
          padding: "10px var(--container-padding)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.5rem",
        }}
      >
        {/* Brand Logo */}
        <Link
          href="/"
          style={{
            color: "var(--color-primary)",
            fontSize: "22px",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            letterSpacing: "-0.5px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, var(--color-primary) 0%, #1d4ed8 100%)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 10px rgba(37, 99, 235, 0.3)",
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <span>Yoe Yar Zay</span>
        </Link>

        {/* Prominent Search Bar */}
        <div style={{ flex: 1, maxWidth: "560px", position: "relative" }}>
          <form
            action="/products"
            method="GET"
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              background: "var(--color-bg-secondary)",
              borderRadius: "24px",
              padding: "4px 6px 4px 16px",
              border: "1.5px solid var(--color-border)",
              transition: "all 0.2s ease",
            }}
          >
            <input
              type="search"
              name="search"
              aria-label={t("searchPlaceholder")}
              placeholder={t("searchPlaceholder") || "Search products, traditional crafts..."}
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                outline: "none",
                fontSize: "13.5px",
                color: "var(--color-text)",
                padding: "6px 0",
              }}
            />
            <button
              type="submit"
              aria-label="Search"
              style={{
                background: "var(--color-primary)",
                color: "#ffffff",
                border: "none",
                borderRadius: "20px",
                padding: "7px 16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                fontWeight: 600,
                boxShadow: "0 2px 6px rgba(37, 99, 235, 0.25)",
              }}
            >
              <Search size={15} />
              <span>Search</span>
            </button>
          </form>
        </div>

        {/* User Account & Cart Section */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexShrink: 0 }}>
          {!user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Link
                href="/login"
                style={{
                  color: "var(--color-text)",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "13.5px",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  transition: "background 0.2s",
                }}
              >
                {t("login")}
              </Link>
              <Link
                href="/register"
                style={{
                  background: "var(--color-primary)",
                  color: "#ffffff",
                  padding: "7px 18px",
                  borderRadius: "20px",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "13.5px",
                  boxShadow: "0 3px 8px rgba(37, 99, 235, 0.25)",
                }}
              >
                {t("signUp")}
              </Link>
            </div>
          ) : (
            <ProfileDropdown userEmail={user.email || ""} fullName={fullName} />
          )}

          <div style={{ height: "24px", width: "1px", background: "var(--color-border)" }} />

          {/* Cart Icon */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <CartIcon />
          </div>
        </div>
      </div>

      {/* 3. Category Quick Navigation Bar */}
      <div
        style={{
          borderTop: "1px solid var(--color-border-light)",
          background: "var(--color-surface)",
          fontSize: "13px",
          fontWeight: 600,
        }}
      >
        <div
          style={{
            maxWidth: "var(--container-max)",
            margin: "0 auto",
            padding: "6px var(--container-padding)",
            display: "flex",
            alignItems: "center",
            gap: "24px",
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          <Link
            href="/products"
            style={{
              color: "var(--color-text)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              whiteSpace: "nowrap",
              padding: "4px 0",
            }}
          >
            <ShoppingBag size={15} style={{ color: "var(--color-primary)" }} />
            <span>All Products</span>
          </Link>

          <Link
            href="/products?category=crafts"
            style={{
              color: "var(--color-text-secondary)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              whiteSpace: "nowrap",
              padding: "4px 0",
            }}
          >
            <span>🇲🇲 Traditional Crafts</span>
          </Link>

          <Link
            href="/products?category=fashion"
            style={{
              color: "var(--color-text-secondary)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              whiteSpace: "nowrap",
              padding: "4px 0",
            }}
          >
            <span>👗 Fashion & Apparel</span>
          </Link>

          <Link
            href="/products?category=beauty"
            style={{
              color: "var(--color-text-secondary)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              whiteSpace: "nowrap",
              padding: "4px 0",
            }}
          >
            <span>💄 Beauty & Care</span>
          </Link>

          <Link
            href="/shops"
            style={{
              color: "var(--color-text-secondary)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              whiteSpace: "nowrap",
              padding: "4px 0",
            }}
          >
            <Store size={14} />
            <span>Brand Shops</span>
          </Link>

          <Link
            href="/#daily-discover"
            style={{
              color: "#dc2626",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              whiteSpace: "nowrap",
              padding: "4px 0",
              fontWeight: 700,
              marginLeft: "auto",
            }}
          >
            <Sparkles size={14} />
            <span>Daily Discover Deals</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
