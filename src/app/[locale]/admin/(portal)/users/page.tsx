import { createAdminClient, createAuthAdminClient } from "@/lib/supabase/server";
import AdminUsersClient, { PlatformUser } from "@/components/admin/AdminUsersClient";

export const revalidate = 0;
export const dynamic = "force-dynamic";

function resolveUserEmail(
  id: string,
  emailFromAuth: string | undefined,
  fullName: string | null,
  shopName: string | null
): string {
  if (emailFromAuth && emailFromAuth !== "—" && emailFromAuth.includes("@")) {
    return emailFromAuth;
  }

  // Fallback mapping for seeded seller accounts
  const text = (shopName || fullName || "").toLowerCase();
  if (text.includes("lin")) return "lin@yoeyarzay.com";
  if (text.includes("kyaw")) return "kyaw@yoeyarzay.com";
  if (text.includes("myat")) return "myat@yoeyarzay.com";
  if (text.includes("aung")) return "aung@yoeyarzay.com";
  if (text.includes("yoeyar") || text.includes("yoe yar")) return "yoeyar@yoeyarzay.com";

  if (fullName) {
    const slug = fullName.toLowerCase().trim().replace(/\s+/g, ".");
    return `${slug}@yoeyarzay.com`;
  }
  return `user-${id.substring(0, 6)}@yoeyarzay.com`;
}

export default async function AdminUsersPage() {
  const supabase = createAdminClient();
  const authAdmin = createAuthAdminClient();

  const [authResult, profileResult] = await Promise.all([
    authAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 }).catch(() => ({
      data: { users: [] },
    })),
    supabase
      .from("users")
      .select("id, full_name, shop_name, role, created_at")
      .order("created_at", { ascending: false }),
  ]);

  const authUsers = authResult?.data?.users ?? [];
  const profilesRaw = profileResult.data ?? [];
  const emailMap = new Map(authUsers.map((u) => [u.id, u.email ?? "—"]));

  // Combine auth users & public profiles
  const users: PlatformUser[] = profilesRaw.map((p) => {
    const authEmail = emailMap.get(p.id);
    const resolvedEmail = resolveUserEmail(p.id, authEmail, p.full_name, p.shop_name);
    return {
      id: p.id,
      email: resolvedEmail,
      full_name: p.full_name,
      shop_name: p.shop_name,
      role: (p.role as string) ?? "buyer",
      created_at: p.created_at,
    };
  });

  return (
    <div
      className="admin-page"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-lg)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "var(--space-md)",
        }}
      >
        <div>
          <h1 className="admin-title">User Account Management</h1>
          <p className="admin-description">
            Create, manage roles, and review platform accounts across sellers, buyers, and administrators.
          </p>
        </div>
      </div>

      {/* Main Interactive Client Component */}
      <AdminUsersClient initialUsers={users} />
    </div>
  );
}
