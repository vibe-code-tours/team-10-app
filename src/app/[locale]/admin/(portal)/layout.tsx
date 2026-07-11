import { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Shield } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";
import { getTranslations } from "next-intl/server";
import { ThemeToggle } from "@/components/theme-toggle";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import ProfileDropdown from "@/components/layout/ProfileDropdown";
import { Link } from "@/i18n/routing";
import AdminHeaderTitle from "@/components/admin/AdminHeaderTitle";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  if (user?.user_metadata?.role !== "admin") {
    notFound();
  }

  const t = await getTranslations("Admin");

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar" style={{ padding: 0 }}>
        {/* Brand Logo Container */}
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
              fontSize: "20px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ background: "var(--color-primary)", color: "#fff", borderRadius: "6px", padding: "3px" }}>
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span>Yoe Yar Zay</span>
          </Link>
        </div>

        {/* Sidebar Inner Content (Title & Nav) */}
        <div style={{ padding: "0 var(--space-lg) var(--space-lg) var(--space-lg)" }}>
          <h2 className="admin-sidebar-title" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-secondary)", marginBottom: "var(--space-md)", display: "flex", alignItems: "center", gap: "6px" }}>
            <Shield size={14} />
            <span>{t("panel")}</span>
          </h2>
          <AdminNav />
        </div>
      </aside>

      <div className="admin-main-wrapper" style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header
          className="admin-top-header"
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
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
            <AdminHeaderTitle />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <ThemeToggle />
            <LanguageSwitcher />
            <ProfileDropdown
              userEmail={user.email || ""}
              fullName={user.user_metadata?.full_name || "Admin"}
            />
          </div>
        </header>

        <main className="admin-main">
          <div className="admin-container">{children}</div>
        </main>
      </div>
    </div>
  );
}
