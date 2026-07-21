import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ThemeToggle } from "@/components/theme-toggle";
import { CartIcon } from "@/components/layout/CartIcon";
import { Search } from "lucide-react";
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
    <header className="header" id="main-header">
      <div
        className="header-inner"
        style={{
          maxWidth: "var(--container-max)",
          margin: "0 auto",
          padding: "var(--space-sm) var(--container-padding)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "2rem",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="header-logo"
          id="logo-link"
          style={{
            color: "var(--color-primary)",
            fontSize: "var(--font-size-2xl)",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              background: "var(--color-primary)",
              color: "#fff",
              borderRadius: "8px",
              padding: "4px",
            }}
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          Yoe Yar Zay
        </Link>

        {/* Minimal Search Bar */}
        <div
          className="header-search-container"
          style={{ flex: 1, maxWidth: "500px", position: "relative" }}
        >
          <form
            action="/products"
            method="GET"
            style={{
              display: "flex",
              width: "100%",
              background: "var(--color-bg-secondary)",
              borderRadius: "var(--radius-full)",
              padding: "4px 8px",
            }}
          >
            <input
              type="search"
              name="search"
              aria-label={t("searchPlaceholder")}
              placeholder={t("searchPlaceholder")}
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                outline: "none",
                padding: "0.5rem 1rem",
                fontSize: "var(--font-size-sm)",
                color: "var(--color-text)",
              }}
            />
            <button
              type="submit"
              aria-label="Search"
              style={{
                background: "transparent",
                border: "none",
                padding: "0 0.75rem",
                cursor: "pointer",
                color: "var(--color-text-secondary)",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Search size={18} />
            </button>
          </form>
        </div>

        {/* Actions (Theme, Lang, User, Cart) */}
        <div
          className="header-actions"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            color: "var(--color-text)",
            fontSize: "var(--font-size-sm)",
            fontWeight: 500,
          }}
        >
          <div
            className="header-settings-group"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <ThemeToggle />
            <LanguageSwitcher />
            <CurrencySwitcher />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {!user ? (
              <>
                <Link
                  href="/login"
                  style={{ color: "var(--color-text)", textDecoration: "none" }}
                >
                  {t("login")}
                </Link>
                <Link
                  href="/register"
                  style={{
                    background: "var(--color-primary)",
                    color: "#fff",
                    padding: "0.5rem 1rem",
                    borderRadius: "var(--radius-full)",
                    textDecoration: "none",
                  }}
                >
                  {t("signUp")}
                </Link>
              </>
            ) : (
              <ProfileDropdown
                userEmail={user.email || ""}
                fullName={fullName}
              />
            )}
          </div>

          <div
            style={{
              color: "var(--color-text)",
              display: "flex",
              alignItems: "center",
            }}
          >
            <CartIcon />
          </div>
        </div>
      </div>
    </header>
  );
}
