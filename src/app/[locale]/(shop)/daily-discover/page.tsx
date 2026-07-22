import React from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { getTranslations } from "next-intl/server";
import { Flame, Tag, Truck, Gift } from "lucide-react";
import { DailyDiscover } from "@/components/home/DailyDiscover";
import { ValuePropsBar } from "@/components/home/ValuePropsBar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const isMm = locale === "my";
  return {
    title: isMm
      ? "နေ့စဉ် အထူးလျှော့စျေးများနှင့် ဘောက်ချာများ | Yoe Yar Zay"
      : "Daily Discover Deals & Vouchers | Yoe Yar Zay Marketplace",
    description: isMm
      ? "မြန်မာ့ရိုးရာ ထုတ်ကုန်များနှင့် ခေတ်မီ ပစ္စည်းများအတွက် နေ့စဉ် အထူးလျှော့စျေးနှင့် ဘောက်ချာများ"
      : "Discover daily deals, discount coupons, free shipping offers, and trending Myanmar products on Yoe Yar Zay Marketplace",
  };
}

export default async function DailyDiscoverPage({ params: { locale } }: { params: { locale: string } }) {
  const supabase = createPublicClient();
  const t = await getTranslations("HomePage");

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  const formattedProducts = (products || []).map((p) => ({
    id: p.id,
    title: p.title,
    price: Number(p.price) || 0,
    image_url: p.image_url || "/images/placeholder.jpg",
    category: p.category || "General",
  }));

  const isMm = locale === "my";

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingBottom: "60px",
        background: "var(--color-bg)",
      }}
    >
      {/* Hero Banner Header for Daily Discover */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#ffffff",
          padding: "36px 0 40px 0",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}
      >
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span
              style={{
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                color: "#ffffff",
                padding: "3px 10px",
                borderRadius: "14px",
                fontSize: "12px",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Flame size={14} />
              <span>{isMm ? "အထူး ပရိုမိုးရှင်း" : "Special Deals"}</span>
            </span>
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>
              {isMm ? "မလွတ်တမ်း ကြည့်ရှုပါ" : "Don't miss out on daily offers"}
            </span>
          </div>

          <h1
            style={{
              fontSize: "28px",
              fontWeight: 800,
              margin: "0 0 8px 0",
              color: "#ffffff",
              lineHeight: 1.2,
            }}
          >
            {isMm
              ? "နေ့စဉ် ရှာဖွေတွေ့ရှိနိုင်သော အထူးလျှော့စျေးနှင့် ဘောက်ချာများ"
              : "Daily Discover Deals & Exclusive Vouchers"}
          </h1>

          <p
            style={{
              fontSize: "14px",
              color: "rgba(255,255,255,0.85)",
              margin: "0 0 24px 0",
              maxWidth: "640px",
              lineHeight: 1.5,
            }}
          >
            {isMm
              ? "မြန်မာ့ရိုးရာ လက်မှုထည်၊ အထည်အလိပ်နှင့် ခေတ်မီ လူသုံးကုန် ပစ္စည်းများအတွက် သီးသန့် Discount Coupon များနှင့် အခမဲ့ ပို့ဆောင်ခ အစီအစဉ်များ"
              : "Explore handpicked artisanal crafts, traditional Myanmar textiles, and everyday essentials with limited-time coupons and nationwide free shipping offers."}
          </p>

          {/* Special Coupon Cards Strip */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "14px",
            }}
          >
            {/* Card 1 */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "12px",
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  flexShrink: 0,
                }}
              >
                <Tag size={20} />
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff" }}>
                  {isMm ? "၃၀% OFF ဘောက်ချာ" : "30% OFF Coupon"}
                </div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)", marginTop: "2px" }}>
                  {isMm ? "ပထမဆုံး ဝယ်ယူမှုအတွက်" : "On your first order code: YOE30"}
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "12px",
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  flexShrink: 0,
                }}
              >
                <Truck size={20} />
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff" }}>
                  {isMm ? "တစ်နိုင်ငံလုံး အခမဲ့ ပို့ဆောင်ခြင်း" : "Free Shipping Nationwide"}
                </div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)", marginTop: "2px" }}>
                  {isMm ? "၅၀,၀၀၀ ကျပ်အထက် ဝယ်ယူပါက" : "Orders above 50,000 MMK"}
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "12px",
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  flexShrink: 0,
                }}
              >
                <Gift size={20} />
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff" }}>
                  {isMm ? "လက်ဆောင် ဘောက်ချာများ" : "Exclusive Gift Vouchers"}
                </div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)", marginTop: "2px" }}>
                  {isMm ? "နေ့စဉ် သီးသန့် အထူးလျှော့စျေး" : "Updated daily for active shoppers"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Value Proposition Pillars Bar */}
      <ValuePropsBar />

      {/* Main Daily Discover Product Grid Component */}
      <div className="container" style={{ marginTop: "24px" }}>
        <DailyDiscover
          products={formattedProducts}
          soldText={t("sold")}
          title={t("dailyDiscover")}
          forYouText={t("forYou")}
          trendingText={t("trending")}
          noProductsText={t("noProducts")}
        />
      </div>
    </div>
  );
}
