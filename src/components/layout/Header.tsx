import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ThemeToggle } from "@/components/theme-toggle";
import { CartIcon } from "@/components/layout/CartIcon";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="header" id="main-header">
      <div className="header-inner">
        <Link href="/" className="header-logo" id="logo-link">
          ShopMM
        </Link>

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2xl)",
          }}
        >
          <ul className="header-nav">
            <li>
              <Link href="/products" id="nav-products">
                ပစ္စည်းများ
              </Link>
            </li>
            <li>
              <Link href="/products?category=new" id="nav-new">
                အသစ်ရောက်
              </Link>
            </li>
          </ul>

          <form
            action="/products"
            method="GET"
            style={{ display: "flex", alignItems: "center" }}
          >
            <input
              type="search"
              name="search"
              placeholder="ရှာဖွေရန်..."
              style={{
                padding: "0.4rem 0.8rem",
                borderRadius: "var(--radius-full)",
                border: "1px solid var(--color-border)",
                background: "var(--color-surface)",
                color: "var(--color-text)",
                fontSize: "var(--font-size-sm)",
                width: "200px",
                outline: "none",
              }}
            />
          </form>
        </nav>

        <div className="header-actions">
          <ThemeToggle />
          <CartIcon />

          {user ? (
            <div className="flex items-center gap-sm">
              <Link
                href="/account/orders"
                className="btn btn-ghost btn-sm"
                id="nav-orders"
              >
                အော်ဒါ
              </Link>
              <Link
                href="/account"
                className="btn btn-primary btn-sm"
                id="nav-account"
              >
                {user.user_metadata?.full_name?.split(" ")[0] || "အကောင့်"}
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="btn btn-primary btn-sm"
              id="nav-login"
            >
              ဝင်ရောက်ရန်
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
