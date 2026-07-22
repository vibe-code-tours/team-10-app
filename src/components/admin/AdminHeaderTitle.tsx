"use client";

import { usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function AdminHeaderTitle() {
  const pathname = usePathname();
  const t = useTranslations("Admin.nav");

  // Determine active title based on pathname
  let title = "Yoe Yar Zay Portal";

  if (pathname === "/admin") {
    title = t("dashboard");
  } else if (pathname.startsWith("/admin/products")) {
    title = t("products");
  } else if (pathname.startsWith("/admin/categories")) {
    title = t("categories");
  } else if (pathname.startsWith("/admin/orders")) {
    title = t("orders");
  } else if (pathname.startsWith("/admin/users")) {
    title = "User Management";
  } else if (pathname.startsWith("/admin/shops")) {
    title = "Seller Management";
  } else if (pathname.startsWith("/admin/payouts")) {
    title = "Seller Payouts";
  } else if (pathname.startsWith("/admin/payments")) {
    title = "Payment Accounts";
  } else if (pathname.startsWith("/admin/logistics")) {
    title = "Logistics Partners";
  } else if (pathname.startsWith("/admin/banners")) {
    title = "Hero Banners";
  } else if (pathname.startsWith("/admin/settings/commission")) {
    title = "Commission Settings";
  }

  return (
    <span
      style={{
        fontWeight: 600,
        fontSize: "16px",
        color: "var(--color-text)",
        transition: "all 0.2s",
      }}
    >
      {title}
    </span>
  );
}
