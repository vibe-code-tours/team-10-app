"use client";

import { useState, useTransition, useMemo } from "react";
import { Link } from "@/i18n/routing";
import {
  Store,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  Search,
  ExternalLink,
  Phone,
  MapPin,
  FileText,
  AlertCircle,
  User,
  ShieldCheck,
  Check,
  X,
  Building2,
  Calendar,
  LayoutGrid,
  List,
  Mail,
  ArrowUpRight,
} from "lucide-react";
import {
  approveSeller,
  rejectSeller,
} from "@/actions/admin/action-approve-seller";

export interface ActiveSeller {
  id: string;
  full_name: string | null;
  email: string;
  phone_number: string | null;
  shop_name: string | null;
  shop_slug?: string | null;
  created_at: string;
  productCount: number;
}

export interface SellerApplication {
  id: string;
  user_id: string;
  shop_name: string;
  owner_name: string;
  phone: string;
  nrc: string;
  business_license: string;
  address: string;
  status: "pending" | "approved" | "rejected";
  rejection_reason?: string | null;
  created_at: string;
  email: string;
  nrc_document_url?: string | null;
  license_document_url?: string | null;
}

interface AdminShopsClientProps {
  activeSellers: ActiveSeller[];
  pendingApplications: SellerApplication[];
  rejectedApplications: SellerApplication[];
}

function getAvatarGradient(name: string) {
  const gradients = [
    "linear-gradient(135deg, #2563eb, #1d4ed8)",
    "linear-gradient(135deg, #7c3aed, #6d28d9)",
    "linear-gradient(135deg, #059669, #047857)",
    "linear-gradient(135deg, #d97706, #b45309)",
    "linear-gradient(135deg, #0891b2, #0e7490)",
    "linear-gradient(135deg, #e11d48, #be123c)",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}

export default function AdminShopsClient({
  activeSellers,
  pendingApplications,
  rejectedApplications,
}: AdminShopsClientProps) {
  const [activeTab, setActiveTab] = useState<"active" | "pending" | "rejected">(
    pendingApplications.length > 0 ? "pending" : "active"
  );
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [rejectingAppId, setRejectingAppId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [feedbackMsg, setFeedbackMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const totalProducts = useMemo(() => {
    return activeSellers.reduce((sum, s) => sum + s.productCount, 0);
  }, [activeSellers]);

  const filteredActiveSellers = useMemo(() => {
    if (!searchQuery.trim()) return activeSellers;
    const q = searchQuery.toLowerCase();
    return activeSellers.filter(
      (s) =>
        (s.shop_name && s.shop_name.toLowerCase().includes(q)) ||
        (s.full_name && s.full_name.toLowerCase().includes(q)) ||
        (s.email && s.email.toLowerCase().includes(q)) ||
        (s.phone_number && s.phone_number.toLowerCase().includes(q))
    );
  }, [activeSellers, searchQuery]);

  const filteredPendingApps = useMemo(() => {
    if (!searchQuery.trim()) return pendingApplications;
    const q = searchQuery.toLowerCase();
    return pendingApplications.filter(
      (app) =>
        app.shop_name.toLowerCase().includes(q) ||
        app.owner_name.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q) ||
        app.phone.toLowerCase().includes(q) ||
        app.nrc.toLowerCase().includes(q) ||
        app.business_license.toLowerCase().includes(q)
    );
  }, [pendingApplications, searchQuery]);

  const filteredRejectedApps = useMemo(() => {
    if (!searchQuery.trim()) return rejectedApplications;
    const q = searchQuery.toLowerCase();
    return rejectedApplications.filter(
      (app) =>
        app.shop_name.toLowerCase().includes(q) ||
        app.owner_name.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q) ||
        app.phone.toLowerCase().includes(q)
    );
  }, [rejectedApplications, searchQuery]);

  const handleApprove = (app: SellerApplication) => {
    setProcessingId(app.id);
    setFeedbackMsg(null);
    startTransition(async () => {
      const res = await approveSeller(app.id, app.user_id, app.shop_name);
      setProcessingId(null);
      if (res?.error) {
        setFeedbackMsg({ type: "error", text: res.error });
      } else {
        setFeedbackMsg({
          type: "success",
          text: `Approved "${app.shop_name}".`,
        });
      }
    });
  };

  const handleRejectSubmit = (appId: string) => {
    if (!rejectReason.trim()) return;
    setProcessingId(appId);
    setFeedbackMsg(null);
    startTransition(async () => {
      const res = await rejectSeller(appId, rejectReason.trim());
      setProcessingId(null);
      setRejectingAppId(null);
      setRejectReason("");
      if (res?.error) {
        setFeedbackMsg({ type: "error", text: res.error });
      } else {
        setFeedbackMsg({
          type: "success",
          text: "Application rejected.",
        });
      }
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
      {/* Toast Feedback */}
      {feedbackMsg && (
        <div
          style={{
            padding: "8px 14px",
            borderRadius: "var(--radius-md)",
            background:
              feedbackMsg.type === "success"
                ? "rgba(45, 125, 70, 0.12)"
                : "rgba(197, 48, 48, 0.12)",
            border: `1px solid ${
              feedbackMsg.type === "success"
                ? "var(--color-success)"
                : "var(--color-danger)"
            }`,
            color:
              feedbackMsg.type === "success"
                ? "var(--color-success)"
                : "var(--color-danger)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontWeight: 500,
            fontSize: "13px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {feedbackMsg.type === "success" ? (
              <CheckCircle size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMsg(null)}
            style={{ color: "inherit", opacity: 0.7, padding: "2px" }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Sleek Compact KPI Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "var(--space-sm)",
        }}
      >
        {/* Active Shops */}
        <div
          className="admin-card"
          style={{
            padding: "10px 14px",
            background: "var(--color-surface)",
            borderLeft: "3px solid var(--color-primary)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "var(--radius-md)",
              background: "var(--color-primary-ghost)",
              color: "var(--color-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Store size={18} />
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "var(--color-text-secondary)", fontWeight: 600, textTransform: "uppercase" }}>
              Active Shops
            </div>
            <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-text)", lineHeight: 1.1 }}>
              {activeSellers.length}
            </div>
          </div>
        </div>

        {/* Pending Review */}
        <div
          className="admin-card"
          style={{
            padding: "10px 14px",
            background: "var(--color-surface)",
            borderLeft: "3px solid var(--color-warning)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "var(--radius-md)",
              background: "rgba(181, 133, 11, 0.1)",
              color: "var(--color-warning)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Clock size={18} />
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "var(--color-text-secondary)", fontWeight: 600, textTransform: "uppercase" }}>
              Pending Review
            </div>
            <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-warning)", lineHeight: 1.1 }}>
              {pendingApplications.length}
            </div>
          </div>
        </div>

        {/* Listed Products */}
        <div
          className="admin-card"
          style={{
            padding: "10px 14px",
            background: "var(--color-surface)",
            borderLeft: "3px solid var(--color-success)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "var(--radius-md)",
              background: "rgba(45, 125, 70, 0.1)",
              color: "var(--color-success)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Package size={18} />
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "var(--color-text-secondary)", fontWeight: 600, textTransform: "uppercase" }}>
              Listed Products
            </div>
            <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-text)", lineHeight: 1.1 }}>
              {totalProducts}
            </div>
          </div>
        </div>

        {/* Rejected Records */}
        <div
          className="admin-card"
          style={{
            padding: "10px 14px",
            background: "var(--color-surface)",
            borderLeft: "3px solid var(--color-text-tertiary)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "var(--radius-md)",
              background: "var(--color-bg-secondary)",
              color: "var(--color-text-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <XCircle size={18} />
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "var(--color-text-secondary)", fontWeight: 600, textTransform: "uppercase" }}>
              Rejected Records
            </div>
            <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-text)", lineHeight: 1.1 }}>
              {rejectedApplications.length}
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div
        className="admin-card"
        style={{
          padding: "8px 12px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--space-sm)",
        }}
      >
        {/* Nav Tabs */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            background: "var(--color-bg-secondary)",
            padding: "3px",
            borderRadius: "var(--radius-md)",
          }}
        >
          <button
            onClick={() => setActiveTab("active")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 12px",
              borderRadius: "var(--radius-sm)",
              fontSize: "12px",
              fontWeight: activeTab === "active" ? 600 : 500,
              background: activeTab === "active" ? "var(--color-surface)" : "transparent",
              color: activeTab === "active" ? "var(--color-primary)" : "var(--color-text-secondary)",
              boxShadow: activeTab === "active" ? "var(--shadow-xs)" : "none",
            }}
          >
            <Store size={14} />
            <span>Active Sellers</span>
            <span className={`badge ${activeTab === "active" ? "badge-primary" : "badge-neutral"}`} style={{ fontSize: "10px", padding: "1px 5px" }}>
              {activeSellers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("pending")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 12px",
              borderRadius: "var(--radius-sm)",
              fontSize: "12px",
              fontWeight: activeTab === "pending" ? 600 : 500,
              background: activeTab === "pending" ? "var(--color-surface)" : "transparent",
              color: activeTab === "pending" ? "var(--color-warning)" : "var(--color-text-secondary)",
              boxShadow: activeTab === "pending" ? "var(--shadow-xs)" : "none",
            }}
          >
            <Clock size={14} />
            <span>Pending Review</span>
            <span className={`badge ${pendingApplications.length > 0 ? "badge-warning" : "badge-neutral"}`} style={{ fontSize: "10px", padding: "1px 5px" }}>
              {pendingApplications.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("rejected")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 12px",
              borderRadius: "var(--radius-sm)",
              fontSize: "12px",
              fontWeight: activeTab === "rejected" ? 600 : 500,
              background: activeTab === "rejected" ? "var(--color-surface)" : "transparent",
              color: activeTab === "rejected" ? "var(--color-text)" : "var(--color-text-secondary)",
              boxShadow: activeTab === "rejected" ? "var(--shadow-xs)" : "none",
            }}
          >
            <XCircle size={14} />
            <span>Rejected</span>
            <span className="badge badge-neutral" style={{ fontSize: "10px", padding: "1px 5px" }}>
              {rejectedApplications.length}
            </span>
          </button>
        </div>

        {/* View Switch & Search */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {activeTab === "active" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "2px",
                background: "var(--color-bg-secondary)",
                padding: "2px",
                borderRadius: "var(--radius-md)",
              }}
            >
              <button
                onClick={() => setViewMode("table")}
                title="Table View"
                style={{
                  padding: "5px 8px",
                  borderRadius: "var(--radius-sm)",
                  background: viewMode === "table" ? "var(--color-surface)" : "transparent",
                  color: viewMode === "table" ? "var(--color-primary)" : "var(--color-text-secondary)",
                  boxShadow: viewMode === "table" ? "var(--shadow-xs)" : "none",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <List size={14} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                title="Grid View"
                style={{
                  padding: "5px 8px",
                  borderRadius: "var(--radius-sm)",
                  background: viewMode === "grid" ? "var(--color-surface)" : "transparent",
                  color: viewMode === "grid" ? "var(--color-primary)" : "var(--color-text-secondary)",
                  boxShadow: viewMode === "grid" ? "var(--shadow-xs)" : "none",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <LayoutGrid size={14} />
              </button>
            </div>
          )}

          <div style={{ position: "relative", minWidth: "220px" }}>
            <Search
              size={14}
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--color-text-tertiary)",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              className="form-input"
              placeholder="Search shops, owners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                paddingLeft: "30px",
                paddingRight: searchQuery ? "28px" : "10px",
                fontSize: "12px",
                height: "32px",
                width: "100%",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--color-text-tertiary)",
                  cursor: "pointer",
                  padding: "2px",
                }}
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      {activeTab === "active" && (
        <div className="admin-card">
          <div
            style={{
              padding: "8px 14px",
              borderBottom: "1px solid var(--color-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600, fontSize: "13px" }}>
              <ShieldCheck size={16} style={{ color: "var(--color-primary)" }} />
              Active Verified Sellers ({filteredActiveSellers.length})
            </div>
          </div>

          {filteredActiveSellers.length > 0 ? (
            viewMode === "table" ? (
              <div className="table-responsive">
                <table className="admin-table" style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
                  <thead>
                    <tr>
                      <th style={{ padding: "8px 12px", fontSize: "11px" }}>Shop &amp; Brand</th>
                      <th style={{ padding: "8px 12px", fontSize: "11px" }}>Owner Details</th>
                      <th style={{ padding: "8px 12px", fontSize: "11px" }}>Email &amp; Phone</th>
                      <th style={{ padding: "8px 12px", fontSize: "11px", textAlign: "center" }}>Products</th>
                      <th style={{ padding: "8px 12px", fontSize: "11px" }}>Joined</th>
                      <th style={{ padding: "8px 12px", fontSize: "11px", textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredActiveSellers.map((seller) => {
                      const shopTitle = seller.shop_name || seller.full_name || "Untitled Shop";
                      const initialLetter = shopTitle.charAt(0).toUpperCase();
                      const avatarGradient = getAvatarGradient(shopTitle);
                      const displayEmail =
                        seller.email && seller.email !== "—"
                          ? seller.email
                          : `${(seller.full_name || "seller").toLowerCase().replace(/\s+/g, "")}@yoeyarzay.com`;

                      return (
                        <tr key={seller.id} className="table-row-hover">
                          {/* Shop Name */}
                          <td style={{ padding: "10px 12px", verticalAlign: "middle" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <div
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "10px",
                                  background: avatarGradient,
                                  color: "#fff",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontWeight: 700,
                                  fontSize: "15px",
                                  flexShrink: 0,
                                }}
                              >
                                {initialLetter}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, fontSize: "13.5px", color: "var(--color-text)", lineHeight: 1.2 }}>
                                  {shopTitle}
                                </div>
                                <Link
                                  href={`/shops/${seller.shop_slug || seller.id}`}
                                  target="_blank"
                                  style={{
                                    fontSize: "11px",
                                    color: "var(--color-primary)",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "2px",
                                    marginTop: "2px",
                                  }}
                                >
                                  Storefront <ArrowUpRight size={11} />
                                </Link>
                              </div>
                            </div>
                          </td>

                          {/* Owner */}
                          <td style={{ padding: "10px 12px", verticalAlign: "middle" }}>
                            <div style={{ fontWeight: 600, fontSize: "13px", color: "var(--color-text)" }}>
                              {seller.full_name || "—"}
                            </div>
                            <div style={{ marginTop: "2px" }}>
                              <span className="badge badge-success" style={{ fontSize: "10px", padding: "1px 6px" }}>
                                Verified
                              </span>
                            </div>
                          </td>

                          {/* Email & Phone */}
                          <td style={{ padding: "10px 12px", verticalAlign: "middle" }}>
                            <div style={{ fontSize: "12px", color: "var(--color-text)", display: "flex", alignItems: "center", gap: "4px" }}>
                              <Mail size={11} style={{ color: "var(--color-text-tertiary)" }} />
                              {displayEmail}
                            </div>
                            <div style={{ fontSize: "11px", color: "var(--color-text-secondary)", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                              <Phone size={11} style={{ color: "var(--color-text-tertiary)" }} />
                              {seller.phone_number || "No phone listed"}
                            </div>
                          </td>

                          {/* Products */}
                          <td style={{ padding: "10px 12px", verticalAlign: "middle", textAlign: "center" }}>
                            <Link href={`/admin/products?seller=${seller.id}`} style={{ textDecoration: "none" }}>
                              <span
                                className="badge badge-primary"
                                style={{ fontSize: "11px", padding: "3px 8px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "3px" }}
                              >
                                <Package size={11} />
                                {seller.productCount} pcs
                              </span>
                            </Link>
                          </td>

                          {/* Joined */}
                          <td style={{ padding: "10px 12px", verticalAlign: "middle", fontSize: "12px", color: "var(--color-text-secondary)" }}>
                            {new Date(seller.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>

                          {/* Actions */}
                          <td style={{ padding: "10px 12px", verticalAlign: "middle", textAlign: "right" }}>
                            <div style={{ display: "inline-flex", gap: "6px", justifyContent: "flex-end" }}>
                              <Link
                                href={`/shops/${seller.shop_slug || seller.id}`}
                                target="_blank"
                                className="btn btn-secondary btn-sm"
                                style={{ display: "inline-flex", alignItems: "center", gap: "3px", padding: "4px 8px", height: "26px", fontSize: "11px" }}
                              >
                                Storefront <ExternalLink size={11} />
                              </Link>
                              <Link
                                href={`/admin/products?seller=${seller.id}`}
                                className="btn btn-outline btn-sm"
                                style={{ display: "inline-flex", alignItems: "center", gap: "3px", padding: "4px 8px", height: "26px", fontSize: "11px" }}
                              >
                                Products
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div
                style={{
                  padding: "var(--space-md)",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                  gap: "var(--space-md)",
                }}
              >
                {filteredActiveSellers.map((seller) => {
                  const shopTitle = seller.shop_name || seller.full_name || "Untitled Shop";
                  const initialLetter = shopTitle.charAt(0).toUpperCase();
                  const avatarGradient = getAvatarGradient(shopTitle);
                  const displayEmail =
                    seller.email && seller.email !== "—"
                      ? seller.email
                      : `${(seller.full_name || "seller").toLowerCase().replace(/\s+/g, "")}@yoeyarzay.com`;

                  return (
                    <div
                      key={seller.id}
                      style={{
                        border: "1px solid var(--color-border)",
                        borderRadius: "var(--radius-md)",
                        background: "var(--color-surface)",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div style={{ height: "48px", background: avatarGradient }} />
                      <div style={{ padding: "0 var(--space-md) var(--space-md)", flex: 1, marginTop: "-20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                          <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: avatarGradient, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "18px", border: "2px solid #fff" }}>
                            {initialLetter}
                          </div>
                          <span className="badge badge-success" style={{ fontSize: "10px", padding: "1px 6px" }}>
                            Verified
                          </span>
                        </div>
                        <div style={{ marginTop: "8px" }}>
                          <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-text)", lineHeight: 1.2 }}>
                            {shopTitle}
                          </h3>
                          <p style={{ fontSize: "12px", color: "var(--color-text-secondary)", marginTop: "2px" }}>
                            Owner: <strong>{seller.full_name || "—"}</strong>
                          </p>
                        </div>
                        <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "4px", fontSize: "11px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--color-text-secondary)" }}>
                            <Mail size={11} /> {displayEmail}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--color-primary)", fontWeight: 600 }}>
                            <Package size={11} /> {seller.productCount} active products
                          </div>
                        </div>
                        <div style={{ marginTop: "12px", paddingTop: "8px", borderTop: "1px solid var(--color-border-light)", display: "flex", gap: "6px" }}>
                          <Link href={`/shops/${seller.shop_slug || seller.id}`} target="_blank" className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: "center", fontSize: "11px", height: "26px" }}>
                            Storefront <ExternalLink size={10} />
                          </Link>
                          <Link href={`/admin/products?seller=${seller.id}`} className="btn btn-outline btn-sm" style={{ flex: 1, justifyContent: "center", fontSize: "11px", height: "26px" }}>
                            Products
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--color-text-secondary)" }}>
              <Store size={36} style={{ marginBottom: "12px", color: "var(--color-border)", margin: "0 auto 12px" }} />
              <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-text)" }}>No active sellers</h3>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PENDING */}
      {activeTab === "pending" && (
        <div className="admin-card">
          <div style={{ padding: "8px 14px", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--color-warning)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600, fontSize: "13px" }}>
              <Clock size={16} /> Pending Applications ({filteredPendingApps.length})
            </div>
          </div>
          {filteredPendingApps.length > 0 ? (
            <div style={{ padding: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              {filteredPendingApps.map((app) => (
                <div key={app.id} style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", background: "var(--color-bg)", padding: "14px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <h3 style={{ fontSize: "15px", fontWeight: 700, margin: 0, color: "var(--color-text)" }}>{app.shop_name}</h3>
                        <span className="badge badge-warning" style={{ fontSize: "10.5px", padding: "1px 6px" }}>Pending Audit</span>
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--color-text-secondary)", marginTop: "4px" }}>
                        Owner: <strong>{app.owner_name}</strong> • Email: <strong>{app.email}</strong> • Phone: <strong>{app.phone}</strong>
                      </div>
                      <div style={{ fontSize: "11.5px", color: "var(--color-text-tertiary)", marginTop: "2px" }}>
                        NRC: {app.nrc} • Business License: {app.business_license} • Address: {app.address}
                      </div>

                      {/* Verification Document Badges */}
                      {(app.nrc_document_url || app.license_document_url) && (
                        <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                          {app.nrc_document_url && (
                            <a
                              href={app.nrc_document_url}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: "11px", padding: "3px 8px", height: "26px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                            >
                              🪪 View NRC Document <ExternalLink size={11} />
                            </a>
                          )}
                          {app.license_document_url && (
                            <a
                              href={app.license_document_url}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: "11px", padding: "3px 8px", height: "26px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                            >
                              📜 View License Document <ExternalLink size={11} />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--color-text-secondary)" }}>
              <CheckCircle size={36} style={{ marginBottom: "12px", color: "var(--color-success)", margin: "0 auto 12px" }} />
              <h3 style={{ fontSize: "14px", fontWeight: 600 }}>No pending seller applications</h3>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: REJECTED */}
      {activeTab === "rejected" && (
        <div className="admin-card">
          <div style={{ padding: "8px 14px", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600, fontSize: "13px" }}>
              <XCircle size={16} /> Rejected Records ({filteredRejectedApps.length})
            </div>
          </div>
          {filteredRejectedApps.length > 0 ? (
            <div className="table-responsive">
              <table className="admin-table" style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
                <thead>
                  <tr>
                    <th style={{ padding: "8px 12px", fontSize: "11px" }}>Shop Name</th>
                    <th style={{ padding: "8px 12px", fontSize: "11px" }}>Applicant</th>
                    <th style={{ padding: "8px 12px", fontSize: "11px" }}>Reason</th>
                    <th style={{ padding: "8px 12px", fontSize: "11px" }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRejectedApps.map((app) => (
                    <tr key={app.id}>
                      <td style={{ padding: "10px 12px", fontWeight: 600, fontSize: "13px" }}>{app.shop_name}</td>
                      <td style={{ padding: "10px 12px", fontSize: "12px" }}>{app.owner_name}</td>
                      <td style={{ padding: "10px 12px", fontSize: "12px", color: "var(--color-danger)" }}>{app.rejection_reason || "No reason"}</td>
                      <td style={{ padding: "10px 12px", fontSize: "12px", color: "var(--color-text-secondary)" }}>{new Date(app.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--color-text-secondary)" }}>
              <XCircle size={36} style={{ marginBottom: "12px", color: "var(--color-border)", margin: "0 auto 12px" }} />
              <h3 style={{ fontSize: "14px", fontWeight: 600 }}>No rejected applications</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
