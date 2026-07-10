import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/actions/auth/action-signout";

export const metadata = { title: "အကောင့်" };

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="container section" id="account-page">
      <div style={{ maxWidth: "480px", margin: "0 auto" }}>
        <h1
          className="section-title"
          style={{ marginBottom: "var(--space-xl)" }}
        >
          အကောင့်
        </h1>

        <div className="card" style={{ marginBottom: "var(--space-lg)" }}>
          <div className="card-body">
            <div
              className="flex items-center gap-lg"
              style={{ marginBottom: "var(--space-lg)" }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "var(--radius-full)",
                  background: "var(--color-text)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-bg)",
                  fontSize: "var(--font-size-lg)",
                  fontWeight: 600,
                }}
              >
                {(
                  profile?.full_name?.[0] ??
                  user.email?.[0] ??
                  "?"
                ).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>
                  {profile?.full_name ?? "User"}
                </div>
                <div
                  className="text-secondary"
                  style={{ fontSize: "var(--font-size-sm)" }}
                >
                  {user.email}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--space-md)",
            marginBottom: "var(--space-lg)",
          }}
        >
          <Link
            href="/account/orders"
            className="card"
            style={{
              padding: "var(--space-lg)",
              textAlign: "center",
              textDecoration: "none",
              color: "var(--color-text)",
            }}
          >
            <div style={{ fontWeight: 500, fontSize: "var(--font-size-sm)" }}>
              မှာယူမှုများ
            </div>
          </Link>
          <Link
            href="/account/settings"
            className="card"
            style={{
              padding: "var(--space-lg)",
              textAlign: "center",
              textDecoration: "none",
              color: "var(--color-text)",
            }}
          >
            <div style={{ fontWeight: 500, fontSize: "var(--font-size-sm)" }}>
              Settings (ဆက်တင်)
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
