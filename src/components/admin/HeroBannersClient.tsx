"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  HeroBanner,
  getHeroBanners,
  createHeroBanner,
  updateHeroBanner,
  toggleHeroBannerActive,
  deleteHeroBanner,
} from "@/actions/admin/action-hero-banners";
import {
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Upload,
  Copy,
  Check,
  Shield,
  Sparkles,
  Tag,
  Truck,
  ExternalLink,
  SlidersHorizontal,
  Eye,
} from "lucide-react";

const INITIAL_FALLBACK_BANNERS: HeroBanner[] = [
  {
    id: "fallback-main-1",
    banner_type: "main_slider",
    title: "မြန်မာ့ရိုးရာ လက်မှုနှင့် အထည်အလိပ် ပွဲတော်",
    subtitle: "Authentic Myanmar Artisanal Collection",
    badge: "Seasonal Offer",
    image_url: "/images/banners/handloom_craft.png",
    target_link: "/en/categories",
    is_active: true,
    sort_order: 1,
  },
  {
    id: "fallback-main-2",
    banner_type: "main_slider",
    title: "သဘာဝ အလှကုန် နှင့် ယွန်းထည် ပစ္စည်းများ",
    subtitle: "Pure Natural Beauty & Lacquerware",
    badge: "Best Seller",
    image_url: "/images/banners/beauty_lacquerware.png",
    target_link: "/en/categories",
    is_active: true,
    sort_order: 2,
  },
  {
    id: "fallback-main-3",
    banner_type: "main_slider",
    title: "ခေတ်မီ မြန်မာ့ရိုးရာ ဝတ်စုံများ",
    subtitle: "Modern Traditional Wear & Accessories",
    badge: "New Arrival",
    image_url: "/images/banners/traditional_wear.png",
    target_link: "/en/categories",
    is_active: true,
    sort_order: 3,
  },
  {
    id: "fallback-side-top",
    banner_type: "side_top",
    title: "အထူးလျှော့စျေး ဘောက်ချာများ",
    subtitle: "Daily Coupon 30% OFF",
    badge: "30% OFF",
    image_url: "/images/banners/special_vouchers.png",
    target_link: "/en/daily-discover",
    is_active: true,
    sort_order: 1,
  },
  {
    id: "fallback-side-bottom",
    banner_type: "side_bottom",
    title: "တစ်နိုင်ငံလုံး အခမဲ့ ပို့ဆောင်ခြင်း",
    subtitle: "Free Shipping Nationwide",
    badge: "Free Shipping",
    image_url: "/images/banners/free_shipping.png",
    target_link: "/en/daily-discover",
    is_active: true,
    sort_order: 2,
  },
];

const PRESET_IMAGES = [
  { name: "Handloom & Craft", url: "/images/banners/handloom_craft.png" },
  { name: "Beauty & Lacquer", url: "/images/banners/beauty_lacquerware.png" },
  { name: "Fashion Wear", url: "/images/banners/traditional_wear.png" },
  { name: "Shopping Vouchers", url: "/images/banners/special_vouchers.png" },
  { name: "Free Delivery", url: "/images/banners/free_shipping.png" },
];

export function HeroBannersClient({ initialBanners }: { initialBanners: HeroBanner[] }) {
  const [banners, setBanners] = useState<HeroBanner[]>(
    initialBanners.length > 0 ? initialBanners : INITIAL_FALLBACK_BANNERS
  );
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "main_slider" | "side_banners">("all");
  const [isDbConnected, setIsDbConnected] = useState(initialBanners.length > 0);
  const [copiedSql, setCopiedSql] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);

  // Form State
  const [bannerType, setBannerType] = useState<"main_slider" | "side_top" | "side_bottom">("main_slider");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [badge, setBadge] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [targetLink, setTargetLink] = useState("/en/categories");
  const [sortOrder, setSortOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);

  // Image Upload Source
  const [imageInputMode, setImageInputMode] = useState<"url" | "file">("url");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Feedback State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Load banners & Sync LocalStorage fallback
  useEffect(() => {
    async function loadData() {
      if (initialBanners.length > 0) {
        setBanners(initialBanners);
        setIsDbConnected(true);
      } else {
        const dbData = await getHeroBanners();
        if (dbData.length > 0) {
          setBanners(dbData);
          setIsDbConnected(true);
        } else {
          const localData = typeof window !== "undefined" ? localStorage.getItem("yoeyarzay_hero_banners_v1") : null;
          if (localData && !localData.includes("unsplash.com")) {
            try {
              setBanners(JSON.parse(localData));
            } catch {
              setBanners(INITIAL_FALLBACK_BANNERS);
            }
          } else {
            setBanners(INITIAL_FALLBACK_BANNERS);
            if (typeof window !== "undefined") {
              localStorage.setItem("yoeyarzay_hero_banners_v1", JSON.stringify(INITIAL_FALLBACK_BANNERS));
            }
          }
        }
      }
    }
    loadData();
  }, [initialBanners]);

  const openAddModal = () => {
    setEditingBanner(null);
    setBannerType("main_slider");
    setTitle("");
    setSubtitle("");
    setBadge("Special Offer");
    setImageUrl("https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&h=600&fit=crop");
    setTargetLink("/en/categories");
    setSortOrder(banners.length + 1);
    setIsActive(true);
    setImageInputMode("url");
    setFormError("");
    setFormSuccess("");
    setIsModalOpen(true);
  };

  const openEditModal = (banner: HeroBanner) => {
    setEditingBanner(banner);
    setBannerType(banner.banner_type as any);
    setTitle(banner.title);
    setSubtitle(banner.subtitle || "");
    setBadge(banner.badge || "");
    setImageUrl(banner.image_url);
    setTargetLink(banner.target_link || "/en/categories");
    setSortOrder(banner.sort_order);
    setIsActive(banner.is_active);
    setImageInputMode("url");
    setFormError("");
    setFormSuccess("");
    setIsModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setFormError("File size exceeds 3MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64 = uploadEvent.target?.result as string;
      setImageUrl(base64);
      setFormError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      setFormError("Title and Banner Image are required.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");
    setFormSuccess("");

    if (editingBanner) {
      const res = await updateHeroBanner(editingBanner.id, {
        banner_type: bannerType,
        title,
        subtitle,
        badge,
        image_url: imageUrl,
        target_link: targetLink,
        sort_order: sortOrder,
        is_active: isActive,
      });

      let updatedList: HeroBanner[] = [];
      if (res.success && res.data) {
        updatedList = banners.map((b) => (b.id === editingBanner.id ? res.data! : b));
      } else {
        updatedList = banners.map((b) =>
          b.id === editingBanner.id
            ? {
                ...b,
                banner_type: bannerType,
                title,
                subtitle,
                badge,
                image_url: imageUrl,
                target_link: targetLink,
                sort_order: sortOrder,
                is_active: isActive,
              }
            : b
        );
      }

      setBanners(updatedList);
      if (typeof window !== "undefined") {
        localStorage.setItem("yoeyarzay_hero_banners_v1", JSON.stringify(updatedList));
      }
    } else {
      const res = await createHeroBanner({
        banner_type: bannerType,
        title,
        subtitle,
        badge,
        image_url: imageUrl,
        target_link: targetLink,
        sort_order: sortOrder,
        is_active: isActive,
      });

      let updatedList: HeroBanner[] = [];
      if (res.success && res.data) {
        updatedList = [...banners, res.data];
      } else {
        const newBanner: HeroBanner = {
          id: `local-${Date.now()}`,
          banner_type: bannerType,
          title,
          subtitle,
          badge,
          image_url: imageUrl,
          target_link: targetLink,
          sort_order: sortOrder,
          is_active: isActive,
          created_at: new Date().toISOString(),
        };
        updatedList = [...banners, newBanner];
      }

      setBanners(updatedList);
      if (typeof window !== "undefined") {
        localStorage.setItem("yoeyarzay_hero_banners_v1", JSON.stringify(updatedList));
      }
    }

    setIsSubmitting(false);
    setFormSuccess("Hero Banner saved successfully!");
    setTimeout(() => {
      setIsModalOpen(false);
    }, 600);
  };

  const handleToggleActive = async (banner: HeroBanner) => {
    const updatedStatus = !banner.is_active;
    const updatedList = banners.map((b) => (b.id === banner.id ? { ...b, is_active: updatedStatus } : b));
    setBanners(updatedList);

    if (typeof window !== "undefined") {
      localStorage.setItem("yoeyarzay_hero_banners_v1", JSON.stringify(updatedList));
    }

    await toggleHeroBannerActive(banner.id, updatedStatus);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hero banner?")) return;

    const updatedList = banners.filter((b) => b.id !== id);
    setBanners(updatedList);

    if (typeof window !== "undefined") {
      localStorage.setItem("yoeyarzay_hero_banners_v1", JSON.stringify(updatedList));
    }

    await deleteHeroBanner(id);
  };

  const copySqlToClipboard = () => {
    const sql = `-- Create hero_banners table SQL Script
CREATE TABLE IF NOT EXISTS public.hero_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  banner_type TEXT NOT NULL DEFAULT 'main_slider',
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  badge TEXT DEFAULT '',
  image_url TEXT NOT NULL,
  target_link TEXT DEFAULT '/en/categories',
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read hero_banners" ON public.hero_banners FOR SELECT USING (true);
CREATE POLICY "Authenticated admin full access hero_banners" ON public.hero_banners FOR ALL TO authenticated USING (true) WITH CHECK (true);`;

    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const filteredBanners = banners.filter((b) => {
    if (activeTab === "main_slider") return b.banner_type === "main_slider";
    if (activeTab === "side_banners") return b.banner_type === "side_top" || b.banner_type === "side_bottom";
    return true;
  });

  const mainSliderBanners = banners.filter((b) => b.is_active && b.banner_type === "main_slider");
  const sideTopBanner = banners.find((b) => b.is_active && b.banner_type === "side_top");
  const sideBottomBanner = banners.find((b) => b.is_active && b.banner_type === "side_bottom");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Notice Banner if DB missing */}
      {!isDbConnected && (
        <div
          style={{
            background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
            border: "1px solid #fde68a",
            borderRadius: "12px",
            padding: "14px 18px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            boxShadow: "0 2px 8px rgba(245,158,11,0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Shield size={20} style={{ color: "#d97706" }} />
              <strong style={{ fontSize: "14px", color: "#92400e" }}>
                Notice: Database table `hero_banners` can be created on Supabase
              </strong>
            </div>
            <button
              onClick={copySqlToClipboard}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "#d97706",
                color: "#ffffff",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {copiedSql ? <Check size={14} /> : <Copy size={14} />}
              {copiedSql ? "Copied SQL!" : "Copy SQL Script"}
            </button>
          </div>
          <p style={{ fontSize: "12.5px", color: "#b45309", margin: 0, lineHeight: 1.4 }}>
            Hero Banners are live with instant localStorage backup sync! Run the SQL script in Supabase SQL Editor whenever you wish to persist permanently in remote DB.
          </p>
        </div>
      )}

      {/* Page Header Strip */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          background: "var(--color-surface)",
          padding: "20px 24px",
          borderRadius: "16px",
          border: "1px solid var(--color-border)",
          boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
              }}
            >
              <ImageIcon size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: "20px", fontWeight: 800, color: "var(--color-text)", margin: 0 }}>
                Hero Banners
              </h1>
              <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", margin: "2px 0 0 0" }}>
                ပင်မစာမျက်နှာ Hero Section Banners များအား စီမံခန့်ခွဲခြင်း နှင့် Dynamic Sync ပြုလုပ်ခြင်း
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openAddModal}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            color: "#ffffff",
            border: "none",
            padding: "10px 18px",
            borderRadius: "10px",
            fontSize: "13.5px",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(37,99,235,0.25)",
          }}
        >
          <Plus size={16} />
          <span>+ Add New Hero Banner</span>
        </button>
      </div>

      {/* Website Live Preview Box */}
      <div
        style={{
          background: "var(--color-surface)",
          borderRadius: "16px",
          border: "1px solid var(--color-border)",
          padding: "20px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Eye size={16} style={{ color: "#0284c7" }} />
            <span style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--color-text)" }}>
              Website Hero Live Preview
            </span>
          </div>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#10b981", background: "#ecfdf5", padding: "3px 8px", borderRadius: "10px" }}>
            ● Dynamic Synchronized
          </span>
        </div>

        {/* Live Grid Preview */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2.1fr 1fr",
            gap: "10px",
            height: "180px",
            borderRadius: "10px",
            overflow: "hidden",
            background: "#f8fafc",
            padding: "8px",
            border: "1px solid #e2e8f0",
          }}
        >
          {/* Left Preview Slide */}
          <div style={{ position: "relative", borderRadius: "8px", overflow: "hidden", background: "#0f172a" }}>
            {mainSliderBanners.length > 0 ? (
              <>
                <Image
                  src={mainSliderBanners[0].image_url}
                  alt={mainSliderBanners[0].title}
                  fill
                  style={{ objectFit: "cover", opacity: 0.85 }}
                />
                <div style={{ position: "absolute", inset: 0, padding: "12px", display: "flex", flexDirection: "column", justifyContent: "flex-end", color: "#fff", background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}>
                  <span style={{ fontSize: "10px", fontWeight: 700, background: "rgba(255,255,255,0.2)", padding: "2px 6px", borderRadius: "8px", width: "fit-content" }}>
                    {mainSliderBanners[0].badge || "Active Slide"}
                  </span>
                  <div style={{ fontSize: "13px", fontWeight: 800, marginTop: "4px" }}>{mainSliderBanners[0].title}</div>
                </div>
              </>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#94a3b8", fontSize: "12px" }}>
                No active main slides
              </div>
            )}
          </div>

          {/* Right Preview Banners */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {/* Top Side Banner */}
            <div style={{ position: "relative", flex: 1, borderRadius: "8px", overflow: "hidden", background: "#1e293b" }}>
              {sideTopBanner ? (
                <>
                  <Image src={sideTopBanner.image_url} alt={sideTopBanner.title} fill style={{ objectFit: "cover", opacity: 0.85 }} />
                  <div style={{ position: "absolute", inset: 0, padding: "8px 10px", display: "flex", flexDirection: "column", justifyContent: "center", color: "#fff", background: "linear-gradient(90deg, rgba(0,0,0,0.8), transparent)" }}>
                    <span style={{ fontSize: "9px", fontWeight: 700, background: "#ef4444", padding: "1px 5px", borderRadius: "6px", width: "fit-content" }}>
                      {sideTopBanner.badge || "Top Side"}
                    </span>
                    <div style={{ fontSize: "11px", fontWeight: 700, marginTop: "2px" }}>{sideTopBanner.title}</div>
                  </div>
                </>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#94a3b8", fontSize: "11px" }}>
                  No top side banner
                </div>
              )}
            </div>

            {/* Bottom Side Banner */}
            <div style={{ position: "relative", flex: 1, borderRadius: "8px", overflow: "hidden", background: "#1e293b" }}>
              {sideBottomBanner ? (
                <>
                  <Image src={sideBottomBanner.image_url} alt={sideBottomBanner.title} fill style={{ objectFit: "cover", opacity: 0.85 }} />
                  <div style={{ position: "absolute", inset: 0, padding: "8px 10px", display: "flex", flexDirection: "column", justifyContent: "center", color: "#fff", background: "linear-gradient(90deg, rgba(0,0,0,0.8), transparent)" }}>
                    <span style={{ fontSize: "9px", fontWeight: 700, background: "#10b981", padding: "1px 5px", borderRadius: "6px", width: "fit-content" }}>
                      {sideBottomBanner.badge || "Bottom Side"}
                    </span>
                    <div style={{ fontSize: "11px", fontWeight: 700, marginTop: "2px" }}>{sideBottomBanner.title}</div>
                  </div>
                </>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#94a3b8", fontSize: "11px" }}>
                  No bottom side banner
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Filter Bar */}
      <div style={{ display: "flex", gap: "10px", borderBottom: "1px solid var(--color-border)", paddingBottom: "12px" }}>
        <button
          onClick={() => setActiveTab("all")}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            border: "none",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
            background: activeTab === "all" ? "var(--color-primary)" : "var(--color-surface)",
            color: activeTab === "all" ? "#ffffff" : "var(--color-text-secondary)",
          }}
        >
          All Banners ({banners.length})
        </button>
        <button
          onClick={() => setActiveTab("main_slider")}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            border: "none",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
            background: activeTab === "main_slider" ? "var(--color-primary)" : "var(--color-surface)",
            color: activeTab === "main_slider" ? "#ffffff" : "var(--color-text-secondary)",
          }}
        >
          Main Slider Slides ({banners.filter((b) => b.banner_type === "main_slider").length})
        </button>
        <button
          onClick={() => setActiveTab("side_banners")}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            border: "none",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
            background: activeTab === "side_banners" ? "var(--color-primary)" : "var(--color-surface)",
            color: activeTab === "side_banners" ? "#ffffff" : "var(--color-text-secondary)",
          }}
        >
          Side Promo Cards ({banners.filter((b) => b.banner_type === "side_top" || b.banner_type === "side_bottom").length})
        </button>
      </div>

      {/* Banners Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
        {filteredBanners.map((banner) => (
          <div
            key={banner.id}
            style={{
              background: "var(--color-surface)",
              borderRadius: "14px",
              border: "1px solid var(--color-border)",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Image Preview Box */}
            <div style={{ position: "relative", width: "100%", height: "150px", background: "#0f172a" }}>
              <Image src={banner.image_url} alt={banner.title} fill style={{ objectFit: "cover" }} />

              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  background:
                    banner.banner_type === "main_slider"
                      ? "rgba(37,99,235,0.9)"
                      : banner.banner_type === "side_top"
                      ? "rgba(239,68,68,0.9)"
                      : "rgba(16,185,129,0.9)",
                  color: "#ffffff",
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "3px 8px",
                  borderRadius: "6px",
                  textTransform: "uppercase",
                }}
              >
                {banner.banner_type === "main_slider"
                  ? "Main Slider"
                  : banner.banner_type === "side_top"
                  ? "Top Side Card"
                  : "Bottom Side Card"}
              </div>

              {/* Status Badge */}
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: banner.is_active ? "rgba(16,185,129,0.9)" : "rgba(100,116,139,0.9)",
                  color: "#ffffff",
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "3px 8px",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {banner.is_active ? <CheckCircle size={12} /> : <XCircle size={12} />}
                <span>{banner.is_active ? "Active" : "Disabled"}</span>
              </div>
            </div>

            {/* Banner Details */}
            <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                {banner.badge && (
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "var(--color-primary)",
                      background: "var(--color-primary-ghost)",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      marginBottom: "6px",
                      display: "inline-block",
                    }}
                  >
                    {banner.badge}
                  </span>
                )}
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--color-text)", margin: "0 0 4px 0" }}>
                  {banner.title}
                </h3>
                {banner.subtitle && (
                  <p style={{ fontSize: "12.5px", color: "var(--color-text-secondary)", margin: "0 0 8px 0" }}>
                    {banner.subtitle}
                  </p>
                )}
                <div style={{ fontSize: "11.5px", color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <ExternalLink size={12} />
                  <span style={{ fontFamily: "monospace" }}>{banner.target_link}</span>
                </div>
              </div>

              {/* Actions Footer */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "16px",
                  paddingTop: "12px",
                  borderTop: "1px solid var(--color-border-light)",
                }}
              >
                <button
                  onClick={() => handleToggleActive(banner)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: banner.is_active ? "#10b981" : "#64748b",
                    cursor: "pointer",
                  }}
                >
                  {banner.is_active ? "● Active" : "○ Inactive"}
                </button>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => openEditModal(banner)}
                    style={{
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-text)",
                      padding: "5px 10px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Edit2 size={13} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    style={{
                      background: "#fef2f2",
                      border: "1px solid #fecaca",
                      color: "#ef4444",
                      padding: "5px 10px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add / Edit Banner */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "var(--color-surface)",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "560px",
              padding: "24px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              border: "1px solid var(--color-border)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 800, color: "var(--color-text)", margin: 0 }}>
                {editingBanner ? "Edit Hero Banner" : "Add New Hero Banner"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "var(--color-text-secondary)" }}
              >
                ✕
              </button>
            </div>

            {formError && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "10px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px" }}>
                {formError}
              </div>
            )}
            {formSuccess && (
              <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#059669", padding: "10px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px" }}>
                {formSuccess}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Banner Placement Type */}
              <div>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-text)", display: "block", marginBottom: "6px" }}>
                  Banner Position / Type
                </label>
                <select
                  value={bannerType}
                  onChange={(e: any) => setBannerType(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--color-border)",
                    fontSize: "13.5px",
                    background: "var(--color-surface)",
                    color: "var(--color-text)",
                  }}
                >
                  <option value="main_slider">Main Slider Slide (Left ~68% width)</option>
                  <option value="side_top">Side Promo Banner - Top Row (Right ~32% width)</option>
                  <option value="side_bottom">Side Promo Banner - Bottom Row (Right ~32% width)</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-text)", display: "block", marginBottom: "6px" }}>
                  Banner Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. မြန်မာ့ရိုးရာ လက်မှုနှင့် အထည်အလိပ် ပွဲတော်"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--color-border)",
                    fontSize: "13.5px",
                    background: "var(--color-surface)",
                    color: "var(--color-text)",
                  }}
                />
              </div>

              {/* Subtitle & Badge */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-text)", display: "block", marginBottom: "6px" }}>
                    Subtitle
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Authentic Myanmar Collection"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid var(--color-border)",
                      fontSize: "13.5px",
                      background: "var(--color-surface)",
                      color: "var(--color-text)",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-text)", display: "block", marginBottom: "6px" }}>
                    Badge Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 30% OFF / Free Shipping"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid var(--color-border)",
                      fontSize: "13.5px",
                      background: "var(--color-surface)",
                      color: "var(--color-text)",
                    }}
                  />
                </div>
              </div>

              {/* Image Input Section */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-text)" }}>Banner Image *</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      type="button"
                      onClick={() => setImageInputMode("url")}
                      style={{
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontSize: "11.5px",
                        fontWeight: 600,
                        border: "none",
                        cursor: "pointer",
                        background: imageInputMode === "url" ? "var(--color-primary)" : "var(--color-surface-hover)",
                        color: imageInputMode === "url" ? "#ffffff" : "var(--color-text-secondary)",
                      }}
                    >
                      Image URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode("file")}
                      style={{
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontSize: "11.5px",
                        fontWeight: 600,
                        border: "none",
                        cursor: "pointer",
                        background: imageInputMode === "file" ? "var(--color-primary)" : "var(--color-surface-hover)",
                        color: imageInputMode === "file" ? "#ffffff" : "var(--color-text-secondary)",
                      }}
                    >
                      Upload File
                    </button>
                  </div>
                </div>

                {imageInputMode === "url" ? (
                  <input
                    type="text"
                    placeholder="Paste image URL https://..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid var(--color-border)",
                      fontSize: "13.5px",
                      background: "var(--color-surface)",
                      color: "var(--color-text)",
                    }}
                  />
                ) : (
                  <div>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "2px dashed var(--color-border)",
                        borderRadius: "8px",
                        background: "var(--color-surface-hover)",
                        color: "var(--color-text)",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                    >
                      <Upload size={16} />
                      <span>Choose Image File from Device</span>
                    </button>
                  </div>
                )}

                {/* Preset Quick Picks */}
                <div style={{ marginTop: "10px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-text-secondary)", display: "block", marginBottom: "4px" }}>
                    Quick Preset Images:
                  </span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImageUrl(preset.url)}
                        style={{
                          padding: "3px 8px",
                          borderRadius: "4px",
                          border: "1px solid var(--color-border)",
                          background: imageUrl === preset.url ? "var(--color-primary-ghost)" : "var(--color-surface)",
                          color: imageUrl === preset.url ? "var(--color-primary)" : "var(--color-text-secondary)",
                          fontSize: "11px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image Live Preview */}
                {imageUrl && (
                  <div style={{ position: "relative", width: "100%", height: "120px", marginTop: "10px", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--color-border)" }}>
                    <Image src={imageUrl} alt="Preview" fill style={{ objectFit: "cover" }} />
                  </div>
                )}
              </div>

              {/* Target Link & Sort Order */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-text)", display: "block", marginBottom: "6px" }}>
                    Target Link / URL
                  </label>
                  <input
                    type="text"
                    value={targetLink}
                    onChange={(e) => setTargetLink(e.target.value)}
                    placeholder="/en/categories"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid var(--color-border)",
                      fontSize: "13.5px",
                      background: "var(--color-surface)",
                      color: "var(--color-text)",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-text)", display: "block", marginBottom: "6px" }}>
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(parseInt(e.target.value) || 1)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid var(--color-border)",
                      fontSize: "13.5px",
                      background: "var(--color-surface)",
                      color: "var(--color-text)",
                    }}
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "8px",
                    border: "1px solid var(--color-border)",
                    background: "var(--color-surface)",
                    color: "var(--color-text)",
                    fontSize: "13.5px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "8px",
                    border: "none",
                    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                    color: "#ffffff",
                    fontSize: "13.5px",
                    fontWeight: 700,
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 12px rgba(37,99,235,0.25)",
                  }}
                >
                  {isSubmitting ? "Saving..." : editingBanner ? "Update Banner" : "Create Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
