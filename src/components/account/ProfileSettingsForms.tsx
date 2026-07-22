"use client";

import { useActionState } from "react";
import { useLocale } from "next-intl";
import {
  updateProfile,
  updatePaymentMethod,
} from "@/actions/account/action-profile";
import {
  User,
  Phone,
  MapPin,
  Save,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Banknote,
  Smartphone,
} from "lucide-react";

interface ProfileSettingsFormsProps {
  profile: {
    full_name?: string | null;
    phone_number?: string | null;
    address?: string | null;
    preferred_payment_method?: string | null;
  } | null;
  activeTab?: "profile" | "payment" | "seller" | "security";
}

export function ProfileSettingsForms({
  profile,
  activeTab = "profile",
}: ProfileSettingsFormsProps) {
  const locale = useLocale();
  const isMM = locale === "my";

  const [profileState, profileAction, isProfilePending] = useActionState(
    updateProfile,
    null
  );
  const [paymentState, paymentAction, isPaymentPending] = useActionState(
    updatePaymentMethod,
    null
  );

  const showProfile = activeTab === "profile";
  const showPayment = activeTab === "payment";

  return (
    <>
      {/* Personal Profile Details Card */}
      {showProfile && (
        <div className="admin-card" style={{ padding: "18px 20px" }}>
          <div
            style={{
              paddingBottom: "12px",
              marginBottom: "16px",
              borderBottom: "1px solid var(--color-border)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "6px",
                background: "var(--color-primary-ghost)",
                color: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <User size={16} />
            </div>
            <div>
              <h2 style={{ fontSize: "15px", fontWeight: 700, color: "var(--color-text)", margin: 0 }}>
                {isMM ? "ကိုယ်ရေးအချက်အလက်" : "Personal Profile Information"}
              </h2>
              <p style={{ fontSize: "12px", color: "var(--color-text-secondary)", margin: 0 }}>
                {isMM
                  ? "သင်၏ အမည်၊ ဖုန်းနံပါတ်နှင့် ပို့ဆောင်ရမည့် လိပ်စာကို ပြင်ဆင်ပါ။"
                  : "Update your full name, phone number, and delivery address."}
              </p>
            </div>
          </div>

          {profileState?.error && (
            <div
              style={{
                padding: "8px 12px",
                borderRadius: "var(--radius-md)",
                background: "rgba(197, 48, 48, 0.12)",
                border: "1px solid var(--color-danger)",
                color: "var(--color-danger)",
                fontSize: "12.5px",
                fontWeight: 500,
                marginBottom: "14px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <AlertCircle size={15} />
              {profileState.error}
            </div>
          )}

          {profileState?.success && (
            <div
              style={{
                padding: "8px 12px",
                borderRadius: "var(--radius-md)",
                background: "rgba(45, 125, 70, 0.12)",
                border: "1px solid var(--color-success)",
                color: "var(--color-success)",
                fontSize: "12.5px",
                fontWeight: 500,
                marginBottom: "14px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <CheckCircle size={15} />
              {isMM ? "အကောင့် အချက်အလက် သိမ်းဆည်းပြီးပါပြီ။" : "Profile updated successfully!"}
            </div>
          )}

          <form action={profileAction} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {/* Full Name */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="full_name" style={{ fontSize: "12px", fontWeight: 600 }}>
                {isMM ? "အမည်" : "Full Name"}
              </label>
              <div style={{ position: "relative" }}>
                <User
                  size={14}
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--color-text-tertiary)",
                  }}
                />
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  className="form-input"
                  defaultValue={profile?.full_name || ""}
                  placeholder={isMM ? "ဥပမာ - ဦးမောင်မောင်" : "e.g. U Mg Mg"}
                  style={{ paddingLeft: "32px", fontSize: "13px", height: "36px" }}
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="phone_number" style={{ fontSize: "12px", fontWeight: 600 }}>
                {isMM ? "ဖုန်းနံပါတ်" : "Phone Number"}
              </label>
              <div style={{ position: "relative" }}>
                <Phone
                  size={14}
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--color-text-tertiary)",
                  }}
                />
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  className="form-input"
                  defaultValue={profile?.phone_number || ""}
                  placeholder={isMM ? "ဥပမာ - 09-123456789" : "e.g. 09-123456789"}
                  style={{ paddingLeft: "32px", fontSize: "13px", height: "36px" }}
                />
              </div>
            </div>

            {/* Address */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="address" style={{ fontSize: "12px", fontWeight: 600 }}>
                {isMM ? "လိပ်စာ" : "Default Delivery Address"}
              </label>
              <div style={{ position: "relative" }}>
                <MapPin
                  size={14}
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "12px",
                    color: "var(--color-text-tertiary)",
                  }}
                />
                <textarea
                  id="address"
                  name="address"
                  className="form-input"
                  rows={3}
                  defaultValue={profile?.address || ""}
                  placeholder={isMM ? "လမ်း၊ မြို့နယ်၊ မြို့" : "Enter your full street address, township, city"}
                  style={{ paddingLeft: "32px", fontSize: "13px" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={isProfilePending}
                style={{ fontSize: "12px", height: "32px", padding: "0 16px", display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <Save size={14} />
                {isProfilePending
                  ? isMM ? "သိမ်းဆည်းနေသည်..." : "Saving..."
                  : isMM ? "သိမ်းဆည်းမည်" : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Payment Preference Card */}
      {showPayment && (
        <div className="admin-card" id="payment" style={{ padding: "18px 20px" }}>
          <div
            style={{
              paddingBottom: "12px",
              marginBottom: "16px",
              borderBottom: "1px solid var(--color-border)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "6px",
                background: "rgba(59, 130, 246, 0.1)",
                color: "#3b82f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CreditCard size={16} />
            </div>
            <div>
              <h2 style={{ fontSize: "15px", fontWeight: 700, color: "var(--color-text)", margin: 0 }}>
                {isMM ? "ငွေပေးချေမှုစနစ်" : "Payment Method Preferences"}
              </h2>
              <p style={{ fontSize: "12px", color: "var(--color-text-secondary)", margin: 0 }}>
                {isMM
                  ? "ဝယ်ယူချိန်တွင် အလိုအလျောက် သုံးစွဲမည့် ငွေချေနည်းလမ်းကို ရွေးချယ်ပါ။"
                  : "Select your default payment option for faster checkout."}
              </p>
            </div>
          </div>

          {paymentState?.error && (
            <div
              style={{
                padding: "8px 12px",
                borderRadius: "var(--radius-md)",
                background: "rgba(197, 48, 48, 0.12)",
                border: "1px solid var(--color-danger)",
                color: "var(--color-danger)",
                fontSize: "12.5px",
                fontWeight: 500,
                marginBottom: "14px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <AlertCircle size={15} />
              {paymentState.error}
            </div>
          )}

          {paymentState?.success && (
            <div
              style={{
                padding: "8px 12px",
                borderRadius: "var(--radius-md)",
                background: "rgba(45, 125, 70, 0.12)",
                border: "1px solid var(--color-success)",
                color: "var(--color-success)",
                fontSize: "12.5px",
                fontWeight: 500,
                marginBottom: "14px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <CheckCircle size={15} />
              {isMM ? "ငွေပေးချေမှုစနစ် ပြောင်းလဲပြီးပါပြီ။" : "Payment method preference updated!"}
            </div>
          )}

          <form action={paymentAction} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <label
              style={{
                padding: "12px 14px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
                background: "var(--color-surface)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
                transition: "all var(--transition-fast)",
              }}
            >
              <input
                type="radio"
                name="payment_method"
                value="cod"
                defaultChecked={
                  profile?.preferred_payment_method === "cod" ||
                  !profile?.preferred_payment_method
                }
              />
              <Banknote size={20} style={{ color: "var(--color-success)" }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: "13px", color: "var(--color-text)" }}>
                  {isMM ? "ပစ္စည်းရောက်မှ ငွေချေမည် (Cash on Delivery)" : "Cash on Delivery (COD)"}
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--color-text-secondary)" }}>
                  {isMM
                    ? "ပစ္စည်း အိမ်အရောက် ရောက်ရှိမှ ပို့ဆောင်သူထံ ငွေချေပါမည်။"
                    : "Pay cash upon package arrival at your delivery address."}
                </div>
              </div>
            </label>

            <label
              style={{
                padding: "12px 14px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
                background: "var(--color-surface)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
                transition: "all var(--transition-fast)",
              }}
            >
              <input
                type="radio"
                name="payment_method"
                value="mobile_banking"
                defaultChecked={
                  profile?.preferred_payment_method === "mobile_banking"
                }
              />
              <Smartphone size={20} style={{ color: "var(--color-primary)" }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: "13px", color: "var(--color-text)" }}>
                  {isMM ? "မိုဘိုင်း ဘဏ်စနစ် (KBZPay / WavePay)" : "KBZPay / WavePay Mobile Banking"}
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--color-text-secondary)" }}>
                  {isMM
                    ? "KBZPay သို့မဟုတ် WavePay App ဖြင့် တိုက်ရိုက် ငွေလွှဲမည်။"
                    : "Instant digital mobile transfer via KBZPay or WavePay app."}
                </div>
              </div>
            </label>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "6px" }}>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={isPaymentPending}
                style={{ fontSize: "12px", height: "32px", padding: "0 16px", display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <Save size={14} />
                {isPaymentPending
                  ? isMM ? "သိမ်းဆည်းနေသည်..." : "Saving..."
                  : isMM ? "သိမ်းဆည်းမည်" : "Save Payment Preference"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
