"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import {
  User,
  CreditCard,
  Store,
  LogOut,
  Shield,
  Phone,
  Mail,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { ProfileSettingsForms } from "./ProfileSettingsForms";
import { SellerApplicationForm } from "./SellerApplicationForm";
import { signOut } from "@/actions/auth/action-signout";

interface SettingsClientWrapperProps {
  user: {
    id: string;
    email?: string | null;
  };
  profile: {
    full_name?: string | null;
    phone_number?: string | null;
    address?: string | null;
    preferred_payment_method?: string | null;
    role?: string | null;
    created_at?: string | null;
    shop_name?: string | null;
  } | null;
  application: any;
}

function getAvatarGradient(name: string) {
  const gradients = [
    "linear-gradient(135deg, #2563eb, #1d4ed8)",
    "linear-gradient(135deg, #7c3aed, #6d28d9)",
    "linear-gradient(135deg, #059669, #047857)",
    "linear-gradient(135deg, #d97706, #b45309)",
    "linear-gradient(135deg, #0891b2, #0e7490)",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}

export function SettingsClientWrapper({
  user,
  profile,
  application,
}: SettingsClientWrapperProps) {
  const locale = useLocale();
  const isMM = locale === "my";

  const [activeTab, setActiveTab] = useState<"all" | "profile" | "payment" | "seller" | "security">("all");

  const userName = profile?.full_name || profile?.shop_name || user.email || "Account User";
  const initialLetter = userName.charAt(0).toUpperCase();
  const avatarGradient = getAvatarGradient(userName);
  const userRole = profile?.role || "buyer";

  return (
    <div className="container section" style={{ maxWidth: "1000px", padding: "var(--space-xl) var(--container-padding)" }}>
      {/* Top Header & Breadcrumb */}
      <div style={{ marginBottom: "var(--space-xl)" }}>
        <Link
          href="/account"
          style={{
            color: "var(--color-text-tertiary)",
            textDecoration: "none",
            fontSize: "12.5px",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            marginBottom: "8px",
            fontWeight: 500,
          }}
        >
          <ArrowLeft size={14} /> {isMM ? "အကောင့်သို့ ပြန်သွားရန်" : "Back to Account Directory"}
        </Link>

        {/* User Banner Header Card */}
        <div
          className="admin-card"
          style={{
            padding: "16px 20px",
            background: "var(--color-surface)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            boxShadow: "var(--shadow-xs)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                background: avatarGradient,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "22px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
                flexShrink: 0,
              }}
            >
              {initialLetter}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h1 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-text)", margin: 0, lineHeight: 1.2 }}>
                  {profile?.full_name || (isMM ? "အကောင့် ဆက်တင်များ" : "Account Profile Settings")}
                </h1>
                <span
                  className={`badge ${
                    userRole === "admin"
                      ? "badge-danger"
                      : userRole === "seller"
                      ? "badge-success"
                      : "badge-neutral"
                  }`}
                  style={{ fontSize: "10.5px", padding: "2px 7px", textTransform: "uppercase" }}
                >
                  {userRole}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px", fontSize: "12px", color: "var(--color-text-secondary)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Mail size={12} style={{ color: "var(--color-text-tertiary)" }} />
                  {user.email}
                </span>
                {profile?.phone_number && (
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Phone size={12} style={{ color: "var(--color-text-tertiary)" }} />
                    {profile.phone_number}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {profile?.role === "seller" && (
              <Link
                href="/admin"
                className="btn btn-secondary btn-sm"
                style={{ fontSize: "12px", padding: "6px 12px", display: "inline-flex", alignItems: "center", gap: "4px" }}
              >
                <Store size={14} /> {isMM ? "ဆိုင်ခွဲ ပေါ်တယ်" : "Merchant Portal"}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Settings Two-Column Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "230px 1fr",
          gap: "var(--space-xl)",
          alignItems: "start",
        }}
        className="settings-responsive-grid"
      >
        {/* Navigation Sidebar */}
        <div
          className="admin-card"
          style={{
            padding: "8px",
            background: "var(--color-surface)",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            position: "sticky",
            top: "calc(var(--header-height) + 16px)",
          }}
        >
          <button
            onClick={() => setActiveTab("all")}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 12px",
              borderRadius: "var(--radius-md)",
              border: "none",
              background: activeTab === "all" ? "var(--color-primary-ghost)" : "transparent",
              color: activeTab === "all" ? "var(--color-primary)" : "var(--color-text)",
              fontWeight: activeTab === "all" ? 600 : 500,
              fontSize: "13px",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <User size={16} /> {isMM ? "ဆက်တင် အားလုံး" : "All Settings"}
            </span>
            <ChevronRight size={14} style={{ opacity: activeTab === "all" ? 1 : 0.4 }} />
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 12px",
              borderRadius: "var(--radius-md)",
              border: "none",
              background: activeTab === "profile" ? "var(--color-primary-ghost)" : "transparent",
              color: activeTab === "profile" ? "var(--color-primary)" : "var(--color-text)",
              fontWeight: activeTab === "profile" ? 600 : 500,
              fontSize: "13px",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <User size={16} /> {isMM ? "ကိုယ်ရေးအချက်အလက်" : "Personal Info"}
            </span>
            <ChevronRight size={14} style={{ opacity: activeTab === "profile" ? 1 : 0.4 }} />
          </button>

          <button
            onClick={() => setActiveTab("payment")}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 12px",
              borderRadius: "var(--radius-md)",
              border: "none",
              background: activeTab === "payment" ? "var(--color-primary-ghost)" : "transparent",
              color: activeTab === "payment" ? "var(--color-primary)" : "var(--color-text)",
              fontWeight: activeTab === "payment" ? 600 : 500,
              fontSize: "13px",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <CreditCard size={16} /> {isMM ? "ငွေပေးချေမှုစနစ်" : "Payment Preferences"}
            </span>
            <ChevronRight size={14} style={{ opacity: activeTab === "payment" ? 1 : 0.4 }} />
          </button>

          <button
            onClick={() => setActiveTab("seller")}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 12px",
              borderRadius: "var(--radius-md)",
              border: "none",
              background: activeTab === "seller" ? "var(--color-primary-ghost)" : "transparent",
              color: activeTab === "seller" ? "var(--color-primary)" : "var(--color-text)",
              fontWeight: activeTab === "seller" ? 600 : 500,
              fontSize: "13px",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Store size={16} /> {isMM ? "အရောင်းဆိုင် စင်တာ" : "Seller Center"}
            </span>
            <ChevronRight size={14} style={{ opacity: activeTab === "seller" ? 1 : 0.4 }} />
          </button>

          <button
            onClick={() => setActiveTab("security")}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 12px",
              borderRadius: "var(--radius-md)",
              border: "none",
              background: activeTab === "security" ? "rgba(197, 48, 48, 0.1)" : "transparent",
              color: activeTab === "security" ? "var(--color-danger)" : "var(--color-text)",
              fontWeight: activeTab === "security" ? 600 : 500,
              fontSize: "13px",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Shield size={16} /> {isMM ? "လုံခြုံရေးနှင့် ထွက်ရန်" : "Security & Logout"}
            </span>
            <ChevronRight size={14} style={{ opacity: activeTab === "security" ? 1 : 0.4 }} />
          </button>
        </div>

        {/* Settings Content Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
          {/* Profile & Payment Forms */}
          {(activeTab === "all" || activeTab === "profile" || activeTab === "payment") && (
            <ProfileSettingsForms profile={profile} activeTab={activeTab} />
          )}

          {/* Become a Seller Application */}
          {(activeTab === "all" || activeTab === "seller") && (
            <SellerApplicationForm application={application} />
          )}

          {/* Security & Logout Card */}
          {(activeTab === "all" || activeTab === "security") && (
            <div
              className="admin-card"
              style={{
                padding: "18px 20px",
                borderLeft: "4px solid var(--color-danger)",
                background: "var(--color-surface)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: "rgba(197, 48, 48, 0.1)",
                      color: "var(--color-danger)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <LogOut size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-text)", margin: 0 }}>
                      {isMM ? "အကောင့် လုံခြုံရေးနှင့် စက်မှ ထွက်ရန်" : "Account Security & Session Logout"}
                    </h3>
                    <p style={{ fontSize: "12px", color: "var(--color-text-secondary)", margin: "2px 0 0 0" }}>
                      {isMM
                        ? "Yoe Yar Zay ၏ လက်ရှိ Browser Session မှ လုံခြုံစွာ ထွက်ခွာပါ။"
                        : "Safely terminate your current active browser session on Yoe Yar Zay."}
                    </p>
                  </div>
                </div>

                <form action={signOut}>
                  <button
                    type="submit"
                    className="btn btn-danger btn-sm"
                    style={{
                      fontSize: "12px",
                      padding: "6px 14px",
                      height: "32px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <LogOut size={14} /> {isMM ? "အကောင့်မှ ထွက်ရန်" : "Log Out Account"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .settings-responsive-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
