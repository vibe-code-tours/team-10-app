import React from "react";
import { getHeroBanners } from "@/actions/admin/action-hero-banners";
import { HeroBannersClient } from "@/components/admin/HeroBannersClient";

export const metadata = {
  title: "Hero Banners Management | Yoe Yar Zay Admin",
  description: "Manage homepage hero section banners and promo cards",
};

export default async function AdminHeroBannersPage() {
  const initialBanners = await getHeroBanners();

  return <HeroBannersClient initialBanners={initialBanners} />;
}
