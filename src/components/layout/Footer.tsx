"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getPaymentAccounts, type PaymentAccount } from "@/actions/admin/action-payment-accounts";
import { getLogisticsPartners, type LogisticsPartner } from "@/actions/admin/action-logistics-partners";
import { usePathname } from "@/i18n/routing";
import { useLocale } from "next-intl";
import {
  CreditCard,
  ShieldCheck,
  Mail,
  MapPin,
  Phone,
  Truck,
  Headphones,
  CheckCircle2,
  Send,
  Store,
  Sparkles,
  Crown,
  Package,
  QrCode,
} from "lucide-react";

// --- Payment Logo Components ---

const VisaLogo = () => (
  <div
    style={{
      background: "#1434CB",
      borderRadius: "6px",
      padding: "4px 8px",
      display: "inline-flex",
      alignItems: "center",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    }}
  >
    <svg width="34" height="14" viewBox="0 0 36 12" fill="none">
      <path
        d="M13.5 11.5L15.3 1H17.8L16 11.5H13.5ZM23.4 1.2C22.9 1 22 0.8 20.9 0.8C18.2 0.8 16.3 2.2 16.3 4.2C16.3 5.7 17.6 6.5 18.6 7C19.7 7.5 20 7.9 20 8.3C20 9 19.2 9.3 18.4 9.3C17.1 9.3 16.4 9 15.8 8.7L15.3 10.8C16 11.1 17.2 11.4 18.5 11.4C21.4 11.4 23.2 10 23.2 7.9C23.2 5.7 20.2 5.4 20.2 4.4C20.2 4.1 20.6 3.7 21.4 3.7C22.1 3.7 22.9 3.8 23.5 4.1L24.1 1.9L23.4 1.2ZM28.6 1H26.7C26.1 1 25.6 1.2 25.4 1.7L21.7 11.5H24.3L24.8 10H28L28.3 11.5H30.6L28.6 1ZM25.5 8L26.6 4.8L27.2 8H25.5ZM12.1 1L9.6 8.1L9.3 6.7C8.8 4.9 7.2 2.9 5.3 1.9L7.6 11.5H10.2L14.7 1H12.1Z"
        fill="white"
      />
    </svg>
  </div>
);

const MastercardLogo = () => (
  <div
    style={{
      background: "#0A0A0A",
      borderRadius: "6px",
      padding: "4px 8px",
      display: "inline-flex",
      alignItems: "center",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    }}
  >
    <svg width="28" height="16" viewBox="0 0 36 24" fill="none">
      <circle cx="13" cy="12" r="9" fill="#EB001B" />
      <circle cx="23" cy="12" r="9" fill="#F79E1B" />
      <path
        d="M18 5A8.98 8.98 0 0014.5 12A8.98 8.98 0 0018 19A8.98 8.98 0 0021.5 12A8.98 8.98 0 0018 5Z"
        fill="#FF5F00"
      />
    </svg>
  </div>
);

const JCBLogo = () => (
  <div
    style={{
      background: "#00377B",
      borderRadius: "6px",
      padding: "3px 8px",
      display: "inline-flex",
      alignItems: "center",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    }}
  >
    <span
      style={{
        color: "#ffffff",
        fontSize: "11px",
        fontWeight: 900,
        fontFamily: "sans-serif",
        letterSpacing: "0.5px",
      }}
    >
      JCB
    </span>
  </div>
);

const KBZPayLogo = () => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      background: "#00478f",
      color: "#ffffff",
      padding: "4px 9px",
      borderRadius: "6px",
      fontSize: "11px",
      fontWeight: 800,
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      letterSpacing: "0.2px",
    }}
  >
    <span
      style={{
        background: "#ed1c24",
        color: "#fff",
        padding: "0 3px",
        borderRadius: "3px",
        fontSize: "9.5px",
        fontWeight: 900,
      }}
    >
      KBZ
    </span>
    <span>Pay</span>
  </div>
);

const WavePayLogo = () => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      background: "#ffdd00",
      color: "#003b73",
      padding: "4px 9px",
      borderRadius: "6px",
      fontSize: "11px",
      fontWeight: 800,
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    }}
  >
    <svg width="11" height="11" viewBox="0 0 24 24" fill="#003b73">
      <path d="M12 2L2 22h20L12 2zm0 4l6.5 13h-13L12 6z" />
    </svg>
    <span>WavePay</span>
  </div>
);

const CODLogo = () => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      color: "var(--color-text)",
      padding: "4px 9px",
      borderRadius: "6px",
      fontSize: "11px",
      fontWeight: 700,
      boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
    }}
  >
    <span style={{ fontSize: "12px" }}>💵</span>
    <span>COD</span>
  </div>
);

// --- Official App Store Badges ---

const AppleStoreBadge = () => (
  <a
    href="https://apple.com/app-store"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      background: "linear-gradient(180deg, #1f2937 0%, #0f172a 100%)",
      color: "#ffffff",
      padding: "6px 12px",
      borderRadius: "9px",
      textDecoration: "none",
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      border: "1px solid rgba(255, 255, 255, 0.15)",
      width: "100%",
      maxWidth: "145px",
      boxSizing: "border-box",
      boxShadow: "0 3px 10px rgba(0, 0, 0, 0.25)",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
      e.currentTarget.style.borderColor = "#3b82f6";
      e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.35), 0 0 10px rgba(59, 130, 246, 0.3)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0) scale(1)";
      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
      e.currentTarget.style.boxShadow = "0 3px 10px rgba(0, 0, 0, 0.25)";
    }}
  >
    <svg width="18" height="22" viewBox="0 0 384 512" fill="#ffffff" style={{ flexShrink: 0 }}>
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.6 26.4 2.1 52.1-14.6 69.5-34z" />
    </svg>
    <div style={{ display: "flex", flexDirection: "column", textAlign: "left", lineHeight: 1.15, minWidth: 0 }}>
      <span style={{ fontSize: "8px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.4px", fontWeight: 700, whiteSpace: "nowrap" }}>
        Download on the
      </span>
      <span style={{ fontSize: "12.5px", fontWeight: 800, fontFamily: "sans-serif", letterSpacing: "-0.2px", color: "#ffffff", whiteSpace: "nowrap" }}>
        App Store
      </span>
    </div>
  </a>
);

const GooglePlayBadge = () => (
  <a
    href="https://play.google.com"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      background: "linear-gradient(180deg, #1f2937 0%, #0f172a 100%)",
      color: "#ffffff",
      padding: "6px 12px",
      borderRadius: "9px",
      textDecoration: "none",
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      border: "1px solid rgba(255, 255, 255, 0.15)",
      width: "100%",
      maxWidth: "145px",
      boxSizing: "border-box",
      boxShadow: "0 3px 10px rgba(0, 0, 0, 0.25)",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
      e.currentTarget.style.borderColor = "#3b82f6";
      e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.35), 0 0 10px rgba(59, 130, 246, 0.3)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0) scale(1)";
      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
      e.currentTarget.style.boxShadow = "0 3px 10px rgba(0, 0, 0, 0.25)";
    }}
  >
    <svg width="18" height="20" viewBox="0 0 512 512" style={{ flexShrink: 0 }}>
      <path
        fill="#41A5EE"
        d="M325.8 256.7L100.9 481.6c-4.4 4.4-10.4 6.9-16.7 6.9-13.1 0-23.7-10.6-23.7-23.7V47.2c0-13.1 10.6-23.7 23.7-23.7 6.3 0 12.3 2.5 16.7 6.9l224.9 226.3z"
      />
      <path
        fill="#FFD400"
        d="M410.7 213.2l-68.8-39.7-33.1 33.2 33.1 33.2 68.8-39.7c7.8-4.5 12.5-12.7 12.5-21.7s-4.7-17.2-12.5-21.7z"
      />
      <path
        fill="#F34336"
        d="M100.9 23.5l241 241-33.1 33.2L84.2 72.9c-2.4-2.4-3.8-5.7-3.8-9.1 0-7.3 5.9-13.3 13.3-13.3 2.6 0 5.1.7 7.2 3z"
      />
      <path
        fill="#4CAF50"
        d="M341.9 247.5L100.9 488.5c-2.1 2.3-4.6 3-7.2 3-7.4 0-13.3-6-13.3-13.3 0-3.4 1.4-6.7 3.8-9.1l224.6-224.8 33.1 33.2z"
      />
    </svg>
    <div style={{ display: "flex", flexDirection: "column", textAlign: "left", lineHeight: 1.15, minWidth: 0 }}>
      <span style={{ fontSize: "8px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.4px", fontWeight: 700, whiteSpace: "nowrap" }}>
        GET IT ON
      </span>
      <span style={{ fontSize: "12.5px", fontWeight: 800, fontFamily: "sans-serif", letterSpacing: "-0.2px", color: "#ffffff", whiteSpace: "nowrap" }}>
        Google Play
      </span>
    </div>
  </a>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const locale = useLocale();
  const isMM = locale === "my";

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [paymentAccounts, setPaymentAccounts] = useState<PaymentAccount[]>([]);
  const [logisticsPartners, setLogisticsPartners] = useState<LogisticsPartner[]>([]);

  useEffect(() => {
    async function loadAccountsAndLogistics() {
      // Payment accounts
      try {
        const data = await getPaymentAccounts();
        if (data && data.length > 0) {
          const activeOnly = data.filter((a) => a.is_active);
          setPaymentAccounts(activeOnly);
        } else if (typeof window !== "undefined") {
          const saved = localStorage.getItem("yoeyarzay_payment_accounts_v1");
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setPaymentAccounts(parsed.filter((a: PaymentAccount) => a.is_active));
            }
          }
        }
      } catch (err) {
        console.error("Failed to load footer payment accounts:", err);
      }

      // Logistics partners
      try {
        const dataLogistics = await getLogisticsPartners();
        if (dataLogistics && dataLogistics.length > 0) {
          const activeOnly = dataLogistics.filter((l) => l.is_active);
          setLogisticsPartners(activeOnly);
        } else if (typeof window !== "undefined") {
          const savedLogistics = localStorage.getItem("yoeyarzay_logistics_partners_v1");
          if (savedLogistics) {
            const parsed = JSON.parse(savedLogistics);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setLogisticsPartners(parsed.filter((l: LogisticsPartner) => l.is_active));
            }
          }
        }
      } catch (err) {
        console.error("Failed to load footer logistics partners:", err);
      }
    }
    loadAccountsAndLogistics();
  }, []);

  const isAdminPage =
    pathname.startsWith("/en/admin") ||
    pathname.startsWith("/my/admin") ||
    pathname.startsWith("/admin");

  if (isAdminPage) {
    return (
      <footer
        style={{
          padding: "16px 0",
          borderTop: "1px solid var(--color-border-light)",
          background: "var(--color-surface)",
        }}
      >
        <div
          className="container"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "var(--color-text-secondary)",
              fontWeight: 500,
            }}
          >
            © {currentYear} Yoe Yar Zay Multi-Vendor Platform. All rights reserved.
          </div>
        </div>
      </footer>
    );
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer
      style={{
        background: "var(--color-bg-secondary)",
        paddingTop: "48px",
        borderTop: "1px solid var(--color-border)",
        color: "var(--color-text)",
        fontSize: "14px",
      }}
    >
      <div className="container">
        {/* 1. Newsletter Banner */}
        <div
          style={{
            background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            borderRadius: "16px",
            padding: "32px 36px",
            marginBottom: "48px",
            color: "#ffffff",
            boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.25)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-20px",
              right: "-20px",
              width: "160px",
              height: "160px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(37,99,235,0.25) 0%, rgba(0,0,0,0) 70%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "24px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div style={{ maxWidth: "520px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  color: "#60a5fa",
                  background: "rgba(96, 165, 250, 0.12)",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  marginBottom: "10px",
                  border: "1px solid rgba(96, 165, 250, 0.2)",
                }}
              >
                <Sparkles size={13} />
                <span>{isMM ? "အထူးကမ်းလှမ်းချက်များ" : "Exclusive Updates"}</span>
              </div>
              <h3
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  margin: "0 0 6px 0",
                  color: "#ffffff",
                  lineHeight: 1.3,
                }}
              >
                {isMM
                  ? "Yoe Yar Zay သတင်းလွှာကို ရယူပြီး အထူးလျှော့ဈေးများ ရယူပါ"
                  : "Join Yoe Yar Zay Community for Special Deals"}
              </h3>
              <p
                style={{
                  fontSize: "13.5px",
                  color: "#94a3b8",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {isMM
                  ? "ပထမဆုံး ဝယ်ယူမှုအတွက် 10% Off Discount Coupon နှင့် Promo Code များကို အီးမေးလ်မှတစ်ဆင့် ပေးပို့ပေးပါသည်။"
                  : "Subscribe to receive instant 10% discount codes, flash deal alerts & exclusive offers."}
              </p>
            </div>

            <div style={{ flex: "1 1 320px", maxWidth: "420px" }}>
              {subscribed ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    background: "rgba(16, 185, 129, 0.15)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    padding: "12px 18px",
                    borderRadius: "12px",
                    color: "#34d399",
                    fontSize: "13.5px",
                    fontWeight: 600,
                  }}
                >
                  <CheckCircle2 size={20} />
                  <span>
                    {isMM
                      ? "ကျေးဇူးတင်ပါသည်။ သတင်းလွှာ စာရင်းသွင်းမှု အောင်မြင်ပါသည်။"
                      : "Thank you for subscribing! Check your email for deals."}
                  </span>
                </div>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  style={{
                    display: "flex",
                    gap: "8px",
                    background: "rgba(255, 255, 255, 0.08)",
                    padding: "6px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                  }}
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      isMM
                        ? "သင့် အီးမေးလ် လိပ်စာ ရိုက်ထည့်ပါ..."
                        : "Enter your email address..."
                    }
                    style={{
                      flex: 1,
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      padding: "8px 14px",
                      color: "#ffffff",
                      fontSize: "13.5px",
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: "var(--color-primary)",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "10px 20px",
                      fontSize: "13.5px",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.2s ease",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#1d4ed8";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "var(--color-primary)";
                    }}
                  >
                    <span>{isMM ? "ရယူမည်" : "Subscribe"}</span>
                    <Send size={14} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* 2. Trust & Feature Pillars */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            paddingBottom: "40px",
            borderBottom: "1px solid var(--color-border-light)",
            marginBottom: "44px",
          }}
        >
          <div
            style={{
              background: "var(--color-surface)",
              padding: "20px",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              border: "1px solid var(--color-border-light)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            }}
          >
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "12px",
                background: "var(--color-primary-ghost)",
                color: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4
                style={{
                  margin: "0 0 2px",
                  fontSize: "14.5px",
                  fontWeight: 700,
                  color: "var(--color-text)",
                }}
              >
                {isMM ? "၁၀၀% စစ်မှန်သော ပစ္စည်းများ" : "100% Authentic Brands"}
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  color: "var(--color-text-secondary)",
                }}
              >
                {isMM ? "စစ်ဆေးပြီးသော ဆိုင်များမှ တိုက်ရိုက်" : "Guaranteed quality & original products"}
              </p>
            </div>
          </div>

          <div
            style={{
              background: "var(--color-surface)",
              padding: "20px",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              border: "1px solid var(--color-border-light)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            }}
          >
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "12px",
                background: "rgba(16, 185, 129, 0.1)",
                color: "#10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Truck size={24} />
            </div>
            <div>
              <h4
                style={{
                  margin: "0 0 2px",
                  fontSize: "14.5px",
                  fontWeight: 700,
                  color: "var(--color-text)",
                }}
              >
                {isMM ? "မြန်မာတစ်နိုင်ငံလုံး ပို့ဆောင်မှု" : "Islandwide Fast Delivery"}
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  color: "var(--color-text-secondary)",
                }}
              >
                {isMM ? "စိတ်ချရသော အမြန်ပို့ဆောင်ရေး" : "Fast & safe delivery across Myanmar"}
              </p>
            </div>
          </div>

          <div
            style={{
              background: "var(--color-surface)",
              padding: "20px",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              border: "1px solid var(--color-border-light)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            }}
          >
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "12px",
                background: "rgba(245, 158, 11, 0.1)",
                color: "#f59e0b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <CreditCard size={24} />
            </div>
            <div>
              <h4
                style={{
                  margin: "0 0 2px",
                  fontSize: "14.5px",
                  fontWeight: 700,
                  color: "var(--color-text)",
                }}
              >
                {isMM ? "လုံခြုံသော ငွေပေးချေမှု" : "Secure Payment System"}
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  color: "var(--color-text-secondary)",
                }}
              >
                {isMM ? "KBZPay, WavePay, Visa, COD" : "Pay via KBZPay, WavePay & Cards"}
              </p>
            </div>
          </div>

          <div
            style={{
              background: "var(--color-surface)",
              padding: "20px",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              border: "1px solid var(--color-border-light)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            }}
          >
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "12px",
                background: "rgba(139, 92, 246, 0.1)",
                color: "#8b5cf6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Headphones size={24} />
            </div>
            <div>
              <h4
                style={{
                  margin: "0 0 2px",
                  fontSize: "14.5px",
                  fontWeight: 700,
                  color: "var(--color-text)",
                }}
              >
                {isMM ? "၂၄ နာရီ ကူညီဆောင်ရွက်ပေးမှု" : "24/7 Dedicated Support"}
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  color: "var(--color-text-secondary)",
                }}
              >
                {isMM ? "ဖုန်းနှင့် စာဖြင့် အချိန်မရွေး မေးမြန်းပါ" : "Always here to assist your shopping"}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Main 4-Column Footer Content */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: "36px",
            paddingBottom: "44px",
            borderBottom: "1px solid var(--color-border-light)",
          }}
        >
          {/* Column 1: Brand Info & Contact */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "14px",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: "var(--color-primary)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "16px",
                }}
              >
                <Store size={18} />
              </div>
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "var(--color-text)",
                  letterSpacing: "-0.3px",
                }}
              >
                Yoe Yar Zay
              </span>
            </div>
            <p
              style={{
                fontSize: "13px",
                color: "var(--color-text-secondary)",
                lineHeight: 1.6,
                marginBottom: "20px",
              }}
            >
              {isMM
                ? "မြန်မာနိုင်ငံတစ်ဝှမ်းရှိ အရည်အသွေးမြင့် ဆိုင်ခွဲများနှင့် ဝယ်ယူသူများကို ချိတ်ဆက်ပေးသော ယုံကြည်စိတ်ချရဆုံး Multi-Vendor E-Commerce Platform။"
                : "Myanmar's trusted multi-vendor marketplace connecting authentic local sellers with buyers nationwide."}
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                fontSize: "12.5px",
                color: "var(--color-text-secondary)",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <MapPin size={14} style={{ color: "var(--color-primary)" }} />
                <span>Yangon, Myanmar</span>
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Phone size={14} style={{ color: "var(--color-primary)" }} />
                <span>+95 9 123 456 789</span>
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Mail size={14} style={{ color: "var(--color-primary)" }} />
                <span>support@yoeyarzay.com</span>
              </span>
            </div>
          </div>

          {/* Column 2: Customer Care */}
          <div>
            <h3
              style={{
                fontSize: "13.5px",
                fontWeight: 700,
                marginBottom: "18px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                color: "var(--color-text)",
              }}
            >
              {isMM ? "သုံးစွဲသူ ဝန်ဆောင်မှု" : "Customer Service"}
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <li>
                <Link href="/help" className="footer-link-modern">
                  {isMM ? "ကူညီရေး စင်တာ" : "Help Centre"}
                </Link>
              </li>
              <li>
                <Link href="/how-to-buy" className="footer-link-modern">
                  {isMM ? "ဝယ်ယူနည်း လမ်းညွှန်" : "How to Buy"}
                </Link>
              </li>
              <li>
                <Link href="/payment-methods" className="footer-link-modern">
                  {isMM ? "ငွေပေးချေမှု နည်းလမ်းများ" : "Payment Methods"}
                </Link>
              </li>
              <li>
                <Link href="/returns" className="footer-link-modern">
                  {isMM ? "ပစ္စည်းပြန်အပ်ခြင်း နှင့် ငွေပြန်အမ်းခြင်း" : "Return & Refund Policy"}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="footer-link-modern">
                  {isMM ? "ဆက်သွယ်ရန်" : "Contact Us"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: About & Marketplace */}
          <div>
            <h3
              style={{
                fontSize: "13.5px",
                fontWeight: 700,
                marginBottom: "18px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                color: "var(--color-text)",
              }}
            >
              {isMM ? "ဈေးကွက် နှင့် ဆိုင်ခွဲများ" : "Marketplace & Shops"}
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <li>
                <Link href="/about" className="footer-link-modern">
                  {isMM ? "Yoe Yar Zay အကြောင်း" : "About Yoe Yar Zay"}
                </Link>
              </li>
              <li>
                <Link href="/shops" className="footer-link-modern">
                  {isMM ? "ဆိုင်ခွဲများ အားလုံး ကြည့်ရန်" : "Browse All Shops"}
                </Link>
              </li>
              <li>
                <Link href="/account/settings" className="footer-link-modern">
                  {isMM ? "အရောင်းဆိုင် ဖွင့်လှစ်ရန်" : "Become a Seller"}
                </Link>
              </li>
              <li>
                <Link href="/seller" className="footer-link-modern">
                  {isMM ? "အရောင်းဆိုင် ပေါ်တယ်" : "Seller Portal"}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="footer-link-modern">
                  {isMM ? "လုံခြုံရေး မူဝါဒ" : "Privacy Policy"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Payment Badges & Mobile App */}
          <div>
            <h3
              style={{
                fontSize: "13.5px",
                fontWeight: 700,
                marginBottom: "14px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                color: "var(--color-text)",
              }}
            >
              {isMM ? "ငွေပေးချေမှု နည်းလမ်းများ" : "Payment Methods"}
            </h3>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "6px 8px",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              {paymentAccounts.length > 0 ? (
                paymentAccounts.map((acc) => {
                  const isImageIcon =
                    acc.icon?.startsWith("data:image/") ||
                    acc.icon?.startsWith("http://") ||
                    acc.icon?.startsWith("https://") ||
                    acc.icon?.startsWith("/");

                  return (
                    <div
                      key={acc.id}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        background: "var(--color-surface)",
                        border: "1px solid var(--color-border)",
                        padding: "4px 9px",
                        borderRadius: "6px",
                        fontSize: "11.5px",
                        fontWeight: 700,
                        color: "var(--color-text)",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                        whiteSpace: "nowrap",
                        boxSizing: "border-box",
                      }}
                      title={`${acc.provider} (${acc.account_name})`}
                    >
                      {isImageIcon && acc.icon ? (
                        <Image
                          src={acc.icon}
                          alt={acc.provider}
                          width={16}
                          height={16}
                          unoptimized
                          style={{ objectFit: "contain", borderRadius: "3px" }}
                        />
                      ) : (
                        <span style={{ fontSize: "13px" }}>{acc.icon || "💳"}</span>
                      )}
                      <span>{acc.provider}</span>
                    </div>
                  );
                })
              ) : (
                <>
                  <KBZPayLogo />
                  <WavePayLogo />
                  <VisaLogo />
                  <MastercardLogo />
                  <JCBLogo />
                  <CODLogo />
                </>
              )}
            </div>

            <h3
              style={{
                fontSize: "13.5px",
                fontWeight: 700,
                marginBottom: "14px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                color: "var(--color-text)",
              }}
            >
              {isMM ? "ပို့ဆောင်ရေး မိတ်ဖက်များ" : "Logistics Partners"}
            </h3>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              {logisticsPartners.length > 0 ? (
                logisticsPartners.map((partner) => {
                  const isImageIcon =
                    partner.icon_type === "image" ||
                    partner.icon_value?.startsWith("data:image/") ||
                    partner.icon_value?.startsWith("http://") ||
                    partner.icon_value?.startsWith("https://") ||
                    partner.icon_value?.startsWith("/");

                  return (
                    <div
                      key={partner.id}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        background: partner.badge_color || "#0284c7",
                        color: "#ffffff",
                        padding: "4px 9px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: 800,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        whiteSpace: "nowrap",
                      }}
                      title={partner.description || partner.name}
                    >
                      {isImageIcon && partner.icon_value ? (
                        <Image
                          src={partner.icon_value}
                          alt={partner.name}
                          width={14}
                          height={14}
                          unoptimized
                          style={{ objectFit: "contain", borderRadius: "2px" }}
                        />
                      ) : partner.icon_type === "lucide_icon" ? (
                        partner.icon_value === "Crown" ? (
                          <Crown size={12} style={{ color: "#fbbf24" }} />
                        ) : partner.icon_value === "Package" ? (
                          <Package size={12} />
                        ) : (
                          <Truck size={12} />
                        )
                      ) : (
                        <span style={{ fontSize: "12px" }}>{partner.icon_value || "🚚"}</span>
                      )}
                      <span>{partner.name}</span>
                    </div>
                  );
                })
              ) : (
                <>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      background: "#dc2626",
                      color: "#ffffff",
                      padding: "4px 9px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 800,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                  >
                    <span>Ninja Van</span>
                  </div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      background: "#1e3a8a",
                      color: "#ffffff",
                      padding: "4px 9px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 800,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Crown size={12} style={{ color: "#fbbf24" }} />
                    <span>Royal Express</span>
                  </div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      background: "#059669",
                      color: "#ffffff",
                      padding: "4px 9px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 800,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Package size={12} />
                    <span>K-MD Express</span>
                  </div>
                </>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
              <h3
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  color: "var(--color-text)",
                  margin: 0,
                }}
              >
                {isMM ? "မိုဘိုင်းလ် အက်ပ် ဒေါင်းလုဒ်" : "Mobile App Experience"}
              </h3>
              <span
                style={{
                  background: "rgba(16, 185, 129, 0.12)",
                  color: "#10b981",
                  fontSize: "9.5px",
                  fontWeight: 800,
                  padding: "2px 7px",
                  borderRadius: "12px",
                  border: "1px solid rgba(16, 185, 129, 0.25)",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                iOS & Android
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gridTemplateRows: "repeat(2, auto)",
                gap: "8px 10px",
                alignItems: "center",
                background: "var(--color-surface)",
                padding: "10px 12px",
                borderRadius: "12px",
                border: "1px solid var(--color-border-light)",
                boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
                maxWidth: "260px",
                boxSizing: "border-box",
                overflow: "hidden",
              }}
            >
              {/* Column 1 (Spans 2 Rows): QR Code Card */}
              <div
                style={{
                  gridRow: "span 2",
                  width: "66px",
                  height: "82px",
                  background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                  borderRadius: "8px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 3px 8px rgba(15,23,42,0.2)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  flexShrink: 0,
                  padding: "4px",
                }}
              >
                <div style={{ background: "#ffffff", padding: "4px", borderRadius: "5px", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>
                  <QrCode size={34} style={{ color: "#0f172a" }} />
                </div>
                <span
                  style={{
                    fontSize: "7.5px",
                    fontWeight: 800,
                    color: "#94a3b8",
                    marginTop: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.3px",
                  }}
                >
                  Scan QR
                </span>
              </div>

              {/* Column 2 - Row 1: App Store Badge */}
              <div style={{ gridColumn: 2, gridRow: 1, minWidth: 0 }}>
                <AppleStoreBadge />
              </div>

              {/* Column 2 - Row 2: Google Play Badge */}
              <div style={{ gridColumn: 2, gridRow: 2, minWidth: 0 }}>
                <GooglePlayBadge />
              </div>
            </div>
          </div>
        </div>

        {/* 4. Bottom Bar */}
        <div
          style={{
            padding: "24px 0",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            fontSize: "12.5px",
            color: "var(--color-text-secondary)",
          }}
        >
          <div>
            © {currentYear} <strong>Yoe Yar Zay</strong> Multi-Vendor Platform. Built with pride for Myanmar 🇲🇲
          </div>
          <div style={{ display: "flex", gap: "18px", flexWrap: "wrap" }}>
            <Link href="/privacy" className="footer-link-modern">
              {isMM ? "မူဝါဒများ" : "Privacy Policy"}
            </Link>
            <span>•</span>
            <Link href="/terms" className="footer-link-modern">
              {isMM ? "စည်းမျဉ်းများ" : "Terms of Service"}
            </Link>
            <span>•</span>
            <Link href="/contact" className="footer-link-modern">
              {isMM ? "အကူအညီ" : "Security & Support"}
            </Link>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .footer-link-modern {
          color: var(--color-text-secondary);
          text-decoration: none;
          font-size: 13px;
          transition: all 0.2s ease;
          display: inline-block;
        }
        .footer-link-modern:hover {
          color: var(--color-primary);
          transform: translateX(3px);
        }
      `,
        }}
      />
    </footer>
  );
}
