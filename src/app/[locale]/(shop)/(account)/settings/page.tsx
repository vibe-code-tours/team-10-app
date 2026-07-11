import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  updateProfile,
  updatePaymentMethod,
} from "@/actions/account/action-profile";
import { signOut } from "@/actions/auth/action-signout";
import Link from "next/link";

export const metadata = { title: "Settings - User Profile" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="container section" id="settings-page">
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ marginBottom: "var(--space-xl)" }}>
          <Link
            href="/account"
            style={{
              color: "var(--color-text-tertiary)",
              textDecoration: "none",
              fontSize: "var(--font-size-sm)",
            }}
          >
            ← အကောင့်သို့ ပြန်သွားရန် (Back to Account)
          </Link>
          <h1
            className="section-title"
            style={{ marginTop: "var(--space-sm)" }}
          >
            Settings (ဆက်တင်)
          </h1>
        </div>

        {/* Profile Details Form */}
        <div className="card" style={{ marginBottom: "var(--space-xl)" }}>
          <div className="card-header">
            <h2 style={{ fontSize: "var(--font-size-lg)", fontWeight: 600 }}>
              ကိုယ်ရေးအချက်အလက် (Profile Details)
            </h2>
          </div>
          <div className="card-body">
            <form
              action={updateProfile}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-md)",
              }}
            >
              <div className="form-group">
                <label className="form-label" htmlFor="full_name">
                  အမည် (Full Name)
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  className="form-input"
                  defaultValue={profile?.full_name || ""}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="phone_number">
                  ဖုန်းနံပါတ် (Phone Number)
                </label>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  className="form-input"
                  defaultValue={profile?.phone_number || ""}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="address">
                  လိပ်စာ (Address)
                </label>
                <textarea
                  id="address"
                  name="address"
                  className="form-input"
                  rows={3}
                  defaultValue={profile?.address || ""}
                  placeholder="Enter your full address"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ alignSelf: "flex-start" }}
              >
                သိမ်းဆည်းမည် (Save Profile)
              </button>
            </form>
          </div>
        </div>

        {/* Payment Preferences Form */}
        <div className="card" id="payment" style={{ marginBottom: "var(--space-xl)" }}>
          <div className="card-header">
            <h2 style={{ fontSize: "var(--font-size-lg)", fontWeight: 600 }}>
              ငွေပေးချေမှုစနစ် (Payment Method)
            </h2>
          </div>
          <div className="card-body">
            <form
              action={updatePaymentMethod}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-md)",
              }}
            >
              <label
                className="flex items-center gap-sm"
                style={{ cursor: "pointer" }}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="cod"
                  defaultChecked={
                    profile?.preferred_payment_method === "cod" ||
                    !profile?.preferred_payment_method
                  }
                  style={{ accentColor: "var(--color-text)" }}
                />
                <span>ပစ္စည်းရောက်မှ ငွေချေမည် (Cash on Delivery)</span>
              </label>

              <label
                className="flex items-center gap-sm"
                style={{ cursor: "pointer" }}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="mobile_banking"
                  defaultChecked={
                    profile?.preferred_payment_method === "mobile_banking"
                  }
                  style={{ accentColor: "var(--color-text)" }}
                />
                <span>
                  KBZ Pay / Wave Pay ဖြင့် ငွေလွှဲမည် (Mobile Banking)
                </span>
              </label>

              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  alignSelf: "flex-start",
                  marginTop: "var(--space-sm)",
                }}
              >
                ပြောင်းလဲမည် (Change Payment Method)
              </button>
            </form>
          </div>
        </div>

        {/* Logout Section */}
        <div
          className="card"
          style={{
            border: "1px solid var(--color-danger)",
            background: "var(--color-danger-light)",
          }}
        >
          <div
            className="card-body"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 600,
                  color: "var(--color-danger)",
                  marginBottom: "4px",
                }}
              >
                အကောင့်မှ ထွက်ရန် (Logout)
              </div>
              <div
                style={{
                  fontSize: "var(--font-size-sm)",
                  color: "var(--color-danger)",
                }}
              >
                သင်၏ အကောင့်မှ လုံခြုံစွာ ထွက်ခွာပါ။
              </div>
            </div>
            <form action={signOut}>
              <button type="submit" className="btn btn-danger">
                ထွက်ရန်
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
