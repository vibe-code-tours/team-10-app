import { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Store } from "lucide-react";
import SellerNav from "@/components/seller/SellerNav";
import { ThemeToggle } from "@/components/theme-toggle";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import ProfileDropdown from "@/components/layout/ProfileDropdown";
import { Link } from "@/i18n/routing";

export default async function SellerLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("role, shop_name, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "seller" && profile?.role !== "admin") {
    redirect("/");
  }

  const shopName = profile?.shop_name || profile?.full_name || "My Shop";

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar" style={{ padding: 0 }}>
        {/* Brand */}
        <div
          style={{
            height: "56px",
            display: "flex",
            alignItems: "center",
            padding: "0 var(--space-lg)",
            borderBottom: "1px solid var(--color-border)",
            marginBottom: "var(--space-md)",
          }}
        >
          <Link
            href="/"
            style={{
              color: "var(--color-primary)",
              fontSize: "16px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                background: "var(--color-primary)",
                color: "#fff",
                borderRadius: "6px",
                padding: "4px",
                display: "flex",
              }}
            >
              <Store size={20} />
            </div>
            <span style={{ fontSize: "14px" }}>{shopName}</span>
          </Link>
        </div>

        <div
          style={{
            padding: "0 var(--space-lg) var(--space-lg) var(--space-lg)",
          }}
        >
          <h2
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--color-text-secondary)",
              marginBottom: "var(--space-md)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Store size={14} />
            <span>Seller Centre</span>
          </h2>
          <SellerNav />
        </div>
      </aside>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "var(--space-sm) var(--space-lg)",
            background: "var(--color-surface)",
            borderBottom: "1px solid var(--color-border)",
            minHeight: "56px",
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          <span
            style={{
              fontWeight: 600,
              fontSize: "16px",
              color: "var(--color-text)",
            }}
          >
            Seller Centre
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <ThemeToggle />
            <LanguageSwitcher />
            <ProfileDropdown userEmail={user.email || ""} fullName={shopName} />
          </div>
        </header>

        <main className="admin-main">
          <div className="admin-container">{children}</div>
        </main>
      </div>
    </div>
  );
}
