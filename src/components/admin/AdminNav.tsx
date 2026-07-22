"use client";

import { Link, usePathname } from "@/i18n/routing";
import {
  Package,
  ClipboardList,
  LogOut,
  LayoutDashboard,
  FolderTree,
  Store,
  DollarSign,
  Settings,
  Users,
  CreditCard,
  Truck,
  Image as ImageIcon,
} from "lucide-react";
import { signOut } from "@/actions/auth/action-signout";
import { useTranslations } from "next-intl";

export default function AdminNav({
  userRole,
}: {
  userRole?: "admin" | "seller";
}) {
  const pathname = usePathname();
  const t = useTranslations("Admin.nav");

  const isDashboardActive = pathname === "/admin";
  const isProductsActive = pathname.startsWith("/admin/products");
  const isOrdersActive = pathname.startsWith("/admin/orders");
  const isCategoriesActive = pathname.startsWith("/admin/categories");
  const isShopsActive = pathname.startsWith("/admin/shops");
  const isPayoutsActive = pathname.startsWith("/admin/payouts");
  const isPaymentsActive = pathname.startsWith("/admin/payments");
  const isLogisticsActive = pathname.startsWith("/admin/logistics");
  const isSettingsActive = pathname.startsWith("/admin/settings");
  const isUsersActive = pathname.startsWith("/admin/users");

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
      {userRole !== "seller" && (
        <>
          <Link
            href="/admin/categories"
            className={`admin-nav-link ${isCategoriesActive ? "active" : ""}`}
          >
            <FolderTree size={18} />
            <span>{t("categories")}</span>
          </Link>
          <Link
            href="/admin/shops"
            className={`admin-nav-link ${isShopsActive ? "active" : ""}`}
          >
            <Store size={18} />
            <span>{t("brandShops") || "Brand Shops"}</span>
          </Link>
        </>
      )}
      <Link
        href="/admin/orders"
        className={`admin-nav-link ${isOrdersActive ? "active" : ""}`}
      >
        <ClipboardList size={18} />
        <span>{t("orders")}</span>
      </Link>
      {userRole !== "seller" && (
        <>
          <Link
            href="/admin/users"
            className={`admin-nav-link ${isUsersActive ? "active" : ""}`}
          >
            <Users size={18} />
            <span>Users</span>
          </Link>
          <Link
            href="/admin/payouts"
            className={`admin-nav-link ${isPayoutsActive ? "active" : ""}`}
          >
            <DollarSign size={18} />
            <span>Payouts</span>
          </Link>
          <Link
            href="/admin/payments"
            className={`admin-nav-link ${isPaymentsActive ? "active" : ""}`}
          >
            <CreditCard size={18} />
            <span>Payments</span>
          </Link>
          <Link
            href="/admin/logistics"
            className={`admin-nav-link ${isLogisticsActive ? "active" : ""}`}
          >
            <Truck size={18} />
            <span>Logistics</span>
          </Link>
          <Link
            href="/admin/banners"
            className={`admin-nav-link ${pathname.startsWith("/admin/banners") ? "active" : ""}`}
          >
            <ImageIcon size={18} />
            <span>Hero Banners</span>
          </Link>
          <Link
            href="/admin/settings/commission"
            className={`admin-nav-link ${isSettingsActive ? "active" : ""}`}
          >
            <Settings size={18} />
            <span>Commission</span>
          </Link>
        </>
      )}

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
