"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Truck, Tag, ChevronRight } from "lucide-react";
import { getHeroBanners, HeroBanner } from "@/actions/admin/action-hero-banners";

const DEFAULT_MAIN_BANNERS = [
  {
    id: "def-main-1",
    src: "/images/banners/handloom_craft.png",
    title: "မြန်မာ့ရိုးရာ လက်မှုနှင့် အထည်အလိပ် ပွဲတော်",
    subtitle: "Authentic Myanmar Artisanal Collection",
    badge: "Seasonal Offer",
    link: "/en/categories",
  },
  {
    id: "def-main-2",
    src: "/images/banners/beauty_lacquerware.png",
    title: "သဘာဝ အလှကုန် နှင့် ယွန်းထည် ပစ္စည်းများ",
    subtitle: "Pure Natural Beauty & Lacquerware",
    badge: "Best Seller",
    link: "/en/categories",
  },
  {
    id: "def-main-3",
    src: "/images/banners/traditional_wear.png",
    title: "ခေတ်မီ မြန်မာ့ရိုးရာ ဝတ်စုံများ",
    subtitle: "Modern Traditional Wear & Accessories",
    badge: "New Arrival",
    link: "/en/categories",
  },
];

const DEFAULT_SIDE_TOP = {
  id: "top-voucher",
  src: "/images/banners/special_vouchers.png",
  title: "အထူးလျှော့စျေး ဘောက်ချာများ",
  subtitle: "Daily Coupon 30% OFF",
  badgeText: "30% OFF",
  badgeBg: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
  icon: Tag,
  link: "/en/daily-discover",
};

const DEFAULT_SIDE_BOTTOM = {
  id: "bottom-shipping",
  src: "/images/banners/free_shipping.png",
  title: "တစ်နိုင်ငံလုံး အခမဲ့ ပို့ဆောင်ခြင်း",
  subtitle: "Free Shipping Nationwide",
  badgeText: "Free Shipping",
  badgeBg: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  icon: Truck,
  link: "/en/daily-discover",
};

export function HeroSlider() {
  const [mainBanners, setMainBanners] = useState(DEFAULT_MAIN_BANNERS);
  const [sideTop, setSideTop] = useState(DEFAULT_SIDE_TOP);
  const [sideBottom, setSideBottom] = useState(DEFAULT_SIDE_BOTTOM);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Fetch dynamic banners from DB / localStorage
  useEffect(() => {
    async function fetchBanners() {
      try {
        let allBanners: HeroBanner[] = [];
        const dbData = await getHeroBanners();
        if (dbData.length > 0) {
          allBanners = dbData;
        } else {
          const localData = typeof window !== "undefined" ? localStorage.getItem("yoeyarzay_hero_banners_v1") : null;
          if (localData && !localData.includes("unsplash.com")) {
            allBanners = JSON.parse(localData);
          }
        }

        if (allBanners.length > 0) {
          const activeMains = allBanners
            .filter((b) => b.is_active && b.banner_type === "main_slider")
            .map((b) => ({
              id: b.id,
              src: b.image_url,
              title: b.title,
              subtitle: b.subtitle || "",
              badge: b.badge || "Special",
              link: b.target_link || "/en/categories",
            }));

          if (activeMains.length > 0) {
            setMainBanners(activeMains);
          }

          const activeTop = allBanners.find((b) => b.is_active && b.banner_type === "side_top");
          if (activeTop) {
            setSideTop({
              id: activeTop.id,
              src: activeTop.image_url,
              title: activeTop.title,
              subtitle: activeTop.subtitle || "Special Deal",
              badgeText: activeTop.badge || "Hot",
              badgeBg: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              icon: Tag,
              link: activeTop.target_link || "/en/daily-discover",
            });
          }

          const activeBottom = allBanners.find((b) => b.is_active && b.banner_type === "side_bottom");
          if (activeBottom) {
            setSideBottom({
              id: activeBottom.id,
              src: activeBottom.image_url,
              title: activeBottom.title,
              subtitle: activeBottom.subtitle || "Fast Delivery",
              badgeText: activeBottom.badge || "Free",
              badgeBg: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              icon: Truck,
              link: activeBottom.target_link || "/en/daily-discover",
            });
          }
        }
      } catch (err) {
        console.error("Error loading hero banners:", err);
      }
    }

    fetchBanners();
  }, []);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    Promise.resolve().then(() => {
      if (emblaApi) onSelect();
    });

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const sideCards = [sideTop, sideBottom];

  return (
    <div className="yoeyarzay-hero-grid">
      <style>{`
        .yoeyarzay-hero-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
          box-sizing: border-box;
        }

        .yoeyarzay-hero-slider-wrap {
          position: relative;
          width: 100%;
          height: 230px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
        }

        .yoeyarzay-hero-viewport {
          overflow: hidden;
          width: 100%;
          height: 100%;
        }

        .yoeyarzay-hero-side-wrap {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }

        .yoeyarzay-hero-side-card {
          position: relative;
          width: 100%;
          height: 135px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: block;
          text-decoration: none;
        }

        .yoeyarzay-hero-side-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
        }

        @media (min-width: 768px) {
          .yoeyarzay-hero-grid {
            display: grid;
            grid-template-columns: calc(68% - 6px) calc(32% - 6px);
            gap: 12px;
            align-items: stretch;
          }

          .yoeyarzay-hero-slider-wrap {
            height: 350px;
          }

          .yoeyarzay-hero-side-wrap {
            height: 350px;
            justify-content: space-between;
          }

          .yoeyarzay-hero-side-card {
            height: calc(50% - 6px);
          }
        }
      `}</style>

      {/* Main Carousel Slider (Left Column ~68% width on Desktop) */}
      <div className="yoeyarzay-hero-slider-wrap">
        {/* Embla Carousel Viewport */}
        <div className="yoeyarzay-hero-viewport" ref={emblaRef}>
          <div style={{ display: "flex", touchAction: "pan-y", height: "100%" }}>
            {mainBanners.map((banner, index) => (
              <div
                key={banner.id || index}
                style={{
                  flex: "0 0 100%",
                  minWidth: 0,
                  position: "relative",
                  height: "100%",
                }}
              >
                <Image
                  src={banner.src}
                  alt={banner.title}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 68vw"
                  style={{
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                {/* Overlay Gradient & Promotional Text */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.2) 60%, transparent 100%)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: "20px 24px",
                    color: "#ffffff",
                  }}
                >
                  {banner.badge && (
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "rgba(255, 255, 255, 0.2)",
                        backdropFilter: "blur(8px)",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: 700,
                        width: "fit-content",
                        marginBottom: "8px",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                      }}
                    >
                      <Sparkles size={13} style={{ color: "#f59e0b" }} />
                      <span>{banner.badge}</span>
                    </div>
                  )}

                  <h2
                    style={{
                      fontSize: "20px",
                      fontWeight: 800,
                      margin: "0 0 4px 0",
                      lineHeight: 1.25,
                      textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                    }}
                  >
                    {banner.title}
                  </h2>

                  {banner.subtitle && (
                    <p
                      style={{
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.9)",
                        margin: 0,
                        fontWeight: 500,
                      }}
                    >
                      {banner.subtitle}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Pagination Indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            right: "20px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            zIndex: 2,
            background: "rgba(0, 0, 0, 0.35)",
            backdropFilter: "blur(6px)",
            padding: "5px 10px",
            borderRadius: "20px",
          }}
        >
          {mainBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              style={{
                width: selectedIndex === index ? "20px" : "7px",
                height: "7px",
                borderRadius: "4px",
                background:
                  selectedIndex === index ? "#ffffff" : "rgba(255, 255, 255, 0.5)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>

      {/* Right Column: 2 Stacked Promo Banners (Row 1 & Row 2) */}
      <div className="yoeyarzay-hero-side-wrap">
        {sideCards.map((card) => {
          const IconComp = card.icon;
          return (
            <Link
              key={card.id}
              href={card.link}
              className="yoeyarzay-hero-side-card"
            >
              <Image
                src={card.src}
                alt={card.title}
                fill
                sizes="(max-width: 768px) 100vw, 32vw"
                style={{
                  objectFit: "cover",
                  display: "block",
                }}
              />

              {/* Card Gradient Overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(90deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.4) 65%, transparent 100%)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "16px 20px",
                  color: "#ffffff",
                }}
              >
                {/* Floating Badge */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    background: card.badgeBg,
                    color: "#ffffff",
                    padding: "3px 9px",
                    borderRadius: "14px",
                    fontSize: "11px",
                    fontWeight: 700,
                    width: "fit-content",
                    marginBottom: "6px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  }}
                >
                  <IconComp size={12} />
                  <span>{card.badgeText}</span>
                </div>

                <h3
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    margin: "0 0 2px 0",
                    lineHeight: 1.3,
                    color: "#ffffff",
                  }}
                >
                  {card.title}
                </h3>

                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "rgba(255,255,255,0.85)",
                      fontWeight: 500,
                    }}
                  >
                    {card.subtitle}
                  </span>
                  <ChevronRight size={13} style={{ color: "rgba(255,255,255,0.85)" }} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
