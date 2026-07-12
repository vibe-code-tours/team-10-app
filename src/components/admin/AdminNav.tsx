"use client";

import { Link, usePathname } from "@/i18n/routing";
import {
  Package,
  ClipboardList,
  LogOut,
  LayoutDashboard,
  FolderTree,
} from "lucide-react";
import { signOut } from "@/actions/auth/action-signout";
import { useTranslations } from "next-intl";

export default function AdminNav() {
  const pathname = usePathname();
  const t = useTranslations("Admin.nav");

  const isDashboardActive = pathname === "/admin";
  const isProductsActive = pathname.startsWith("/admin/products");
  const isOrdersActive = pathname.startsWith("/admin/orders");
  const isCategoriesActive = pathname.startsWith("/admin/categories");

  return (
    <nav
      className="admin-nav"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        height: "100%",
      }}
    >
      <Link
        href="/admin"
        className={`admin-nav-link ${isDashboardActive ? "active" : ""}`}
      >
        <LayoutDashboard size={18} />
        <span>{t("dashboard")}</span>
      </Link>
      <Link
        href="/admin/products"
        className={`admin-nav-link ${isProductsActive ? "active" : ""}`}
      >
        <Package size={18} />
        <span>{t("products")}</span>
      </Link>
      <Link
        href="/admin/categories"
        className={`admin-nav-link ${isCategoriesActive ? "active" : ""}`}
      >
        <FolderTree size={18} />
        <span>{t("categories")}</span>
      </Link>
      <Link
        href="/admin/orders"
        className={`admin-nav-link ${isOrdersActive ? "active" : ""}`}
      >
        <ClipboardList size={18} />
        <span>{t("orders")}</span>
      </Link>

      <form action={signOut} style={{ marginTop: "auto" }}>
        <button
          type="submit"
          className="admin-nav-link"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-sm)",
            padding: "var(--space-sm) var(--space-md)",
            borderRadius: "var(--radius-md)",
            fontWeight: 500,
            fontSize: "var(--font-size-sm)",
            color: "var(--color-danger)",
            background: "none",
            border: "none",
            textAlign: "left",
            cursor: "pointer",
            transition: "all var(--transition-fast)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-danger-light)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <LogOut size={18} />
          <span>{t("logout")}</span>
        </button>
      </form>
    </nav>
  );
}
