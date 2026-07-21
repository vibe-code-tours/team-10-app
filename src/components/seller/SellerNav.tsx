"use client";

import { Link, usePathname } from "@/i18n/routing";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  DollarSign,
  LogOut,
} from "lucide-react";
import { signOut } from "@/actions/auth/action-signout";
import { useTranslations } from "next-intl";

export default function SellerNav() {
  const pathname = usePathname();
  const t = useTranslations("Seller.dashboard");

  return (
    <nav
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        height: "100%",
      }}
    >
      <Link
        href="/seller"
        className={`admin-nav-link ${pathname === "/seller" ? "active" : ""}`}
      >
        <LayoutDashboard size={18} />
        <span>{t("title")}</span>
      </Link>
      <Link
        href="/seller/products"
        className={`admin-nav-link ${pathname.startsWith("/seller/products") ? "active" : ""}`}
      >
        <Package size={18} />
        <span>{t("products")}</span>
      </Link>
      <Link
        href="/seller/orders"
        className={`admin-nav-link ${pathname.startsWith("/seller/orders") ? "active" : ""}`}
      >
        <ClipboardList size={18} />
        <span>{t("orders")}</span>
      </Link>
      <Link
        href="/seller/earnings"
        className={`admin-nav-link ${pathname.startsWith("/seller/earnings") ? "active" : ""}`}
      >
        <DollarSign size={18} />
        <span>{t("earnings")}</span>
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
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-danger-light)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <LogOut size={18} />
          <span>ထွက်ရန်</span>
        </button>
      </form>
    </nav>
  );
}
