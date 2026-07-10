import { ReactNode } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2 className="admin-sidebar-title">Admin Panel</h2>
        <nav className="admin-nav">
          <Link href="/admin/products" className="admin-nav-link">
            Products
          </Link>
          <Link href="/admin/orders" className="admin-nav-link">
            Orders
          </Link>
        </nav>
      </aside>

      <main className="admin-main">
        <div className="admin-container">{children}</div>
      </main>
    </div>
  );
}
