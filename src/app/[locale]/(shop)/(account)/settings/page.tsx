import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import { signOut } from "@/actions/auth/action-signout";
import Link from "next/link";
import { ProfileSettingsForms } from "@/components/account/ProfileSettingsForms";

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
        <ProfileSettingsForms profile={profile} />

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
              <button type="submit" className="btn btn-danger" aria-label="Logout">
                ထွက်ရန်
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
