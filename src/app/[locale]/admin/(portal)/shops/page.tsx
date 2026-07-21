import { createAdminClient, createAuthAdminClient } from "@/lib/supabase/server";
import AdminShopsClient, {
  ActiveSeller,
  SellerApplication,
} from "@/components/admin/AdminShopsClient";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function AdminShopsPage() {
  const supabase = createAdminClient();
  const authAdmin = createAuthAdminClient();

  const [{ data: applications }, { data: activeSellersRaw }, authResult] =
    await Promise.all([
      supabase
        .from("seller_applications")
        .select("*, users(full_name)")
        .order("created_at", { ascending: false }),
      supabase
        .from("users")
        .select(
          "id, full_name, phone_number, shop_name, created_at, products(count)"
        )
        .eq("role", "seller")
        .order("created_at", { ascending: false }),
      authAdmin.auth.admin.listUsers({ perPage: 1000 }).catch(() => ({
        data: { users: [] },
      })),
    ]);

  const authUsers = authResult?.data?.users ?? [];
  const emailMap = new Map(
    authUsers.map((u) => [u.id, u.email ?? "—"])
  );

  const activeSellers: ActiveSeller[] = (activeSellersRaw ?? []).map((s) => ({
    id: s.id,
    full_name: s.full_name,
    email: emailMap.get(s.id) ?? "—",
    phone_number: s.phone_number,
    shop_name: s.shop_name,
    shop_slug: s.shop_name
      ? s.shop_name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      : s.id,
    created_at: s.created_at,
    productCount: Array.isArray(s.products) ? (s.products[0]?.count ?? 0) : 0,
  }));

  const pendingApplications: SellerApplication[] = (applications ?? [])
    .filter((a) => a.status === "pending")
    .map((a) => ({
      ...a,
      email: emailMap.get(a.user_id) ?? "—",
    }));

  const rejectedApplications: SellerApplication[] = (applications ?? [])
    .filter((a) => a.status === "rejected")
    .map((a) => ({
      ...a,
      email: emailMap.get(a.user_id) ?? "—",
    }));

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
          <h1 className="admin-title">Shop &amp; Seller Management</h1>
          <p className="admin-description">
            Review seller applications, verify business credentials, and manage active shop storefronts.
          </p>
        </div>
      </div>

      {/* Main Interactive Client UI */}
      <AdminShopsClient
        activeSellers={activeSellers}
        pendingApplications={pendingApplications}
        rejectedApplications={rejectedApplications}
      />
    </div>
  );
}
