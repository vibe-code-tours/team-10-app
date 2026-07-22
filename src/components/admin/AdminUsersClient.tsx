"use client";

import { useState, useTransition, useMemo } from "react";
import {
  Users,
  Store,
  ShoppingBag,
  ShieldCheck,
  Search,
  X,
  Mail,
  Trash2,
  UserCheck,
  Calendar,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ArrowRightLeft,
} from "lucide-react";
import CreateUserForm from "./CreateUserForm";
import { deleteUser, updateUserRole } from "@/actions/admin/action-users";

export interface PlatformUser {
  id: string;
  email: string;
  full_name: string | null;
  shop_name: string | null;
  role: string;
  created_at: string;
}

interface AdminUsersClientProps {
  initialUsers: PlatformUser[];
}

function getUserAvatarGradient(name: string) {
  const gradients = [
    "linear-gradient(135deg, #2563eb, #1d4ed8)", // Blue
    "linear-gradient(135deg, #7c3aed, #6d28d9)", // Purple
    "linear-gradient(135deg, #059669, #047857)", // Emerald
    "linear-gradient(135deg, #d97706, #b45309)", // Amber
    "linear-gradient(135deg, #0891b2, #0e7490)", // Cyan
    "linear-gradient(135deg, #e11d48, #be123c)", // Rose
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}

const ITEMS_PER_PAGE = 10;

export default function AdminUsersClient({ initialUsers }: AdminUsersClientProps) {
  const [activeTab, setActiveTab] = useState<"all" | "sellers" | "buyers" | "admins">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [feedbackMsg, setFeedbackMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Stats Breakdown
  const admins = useMemo(() => initialUsers.filter((u) => u.role === "admin"), [initialUsers]);
  const sellers = useMemo(() => initialUsers.filter((u) => u.role === "seller"), [initialUsers]);
  const buyers = useMemo(
    () => initialUsers.filter((u) => u.role === "buyer" || !u.role),
    [initialUsers]
  );

  const handleTabChange = (tab: "all" | "sellers" | "buyers" | "admins") => {
    setActiveTab(tab);
    setRoleFilter("all");
    setCurrentPage(1);
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  const filteredUsers = useMemo(() => {
    let result = initialUsers;

    // Tab Filter
    if (activeTab === "sellers") {
      result = result.filter((u) => u.role === "seller");
    } else if (activeTab === "buyers") {
      result = result.filter((u) => u.role === "buyer" || !u.role);
    } else if (activeTab === "admins") {
      result = result.filter((u) => u.role === "admin");
    }

    // Role Dropdown Filter
    if (roleFilter !== "all") {
      result = result.filter((u) => u.role === roleFilter);
    }

    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          (u.full_name && u.full_name.toLowerCase().includes(q)) ||
          (u.email && u.email.toLowerCase().includes(q)) ||
          (u.shop_name && u.shop_name.toLowerCase().includes(q)) ||
          (u.role && u.role.toLowerCase().includes(q))
      );
    }
    return result;
  }, [initialUsers, activeTab, roleFilter, searchQuery]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE) || 1;

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const handleToggleRole = (user: PlatformUser) => {
    const newRole = user.role === "seller" ? "buyer" : "seller";
    setProcessingId(user.id);
    setFeedbackMsg(null);

    startTransition(async () => {
      try {
        await updateUserRole(user.id, newRole, user.shop_name ?? undefined);
        setFeedbackMsg({
          type: "success",
          text: `Role for "${user.full_name || user.email}" successfully changed to ${newRole.toUpperCase()}.`,
        });
      } catch {
        setFeedbackMsg({ type: "error", text: "Failed to update user role." });
      } finally {
        setProcessingId(null);
      }
    });
  };

  const handleDelete = (user: PlatformUser) => {
    if (
      !confirm(
        `Are you sure you want to delete user "${user.full_name || user.email}"? This action is permanent.`
      )
    ) {
      return;
    }

    setProcessingId(user.id);
    setFeedbackMsg(null);

    startTransition(async () => {
      try {
        await deleteUser(user.id);
        setFeedbackMsg({
          type: "success",
          text: `User "${user.full_name || user.email}" deleted successfully.`,
        });
      } catch {
        setFeedbackMsg({ type: "error", text: "Failed to delete user." });
      } finally {
        setProcessingId(null);
      }
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
      {/* Toast Feedback Notification Banner */}
      {feedbackMsg && (
        <div
          style={{
            padding: "10px 16px",
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
            boxShadow: "var(--shadow-sm)",
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

      {/* Modern Professional KPI Metric Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "var(--space-sm)",
        }}
      >
        {/* Total Users Card */}
        <div
          className="admin-card"
          style={{
            padding: "12px 16px",
            background: "var(--color-surface)",
            borderLeft: "4px solid var(--color-primary)",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            boxShadow: "var(--shadow-xs)",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "var(--radius-md)",
              background: "var(--color-primary-ghost)",
              color: "var(--color-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Users size={20} />
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "var(--color-text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Total Users
            </div>
            <div style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--color-text)", lineHeight: 1.1, marginTop: "2px" }}>
              {initialUsers.length}
            </div>
          </div>
        </div>

        {/* Active Sellers Card */}
        <div
          className="admin-card"
          style={{
            padding: "12px 16px",
            background: "var(--color-surface)",
            borderLeft: "4px solid var(--color-success)",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            boxShadow: "var(--shadow-xs)",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "var(--radius-md)",
              background: "rgba(45, 125, 70, 0.1)",
              color: "var(--color-success)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Store size={20} />
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "var(--color-text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Active Sellers
            </div>
            <div style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--color-text)", lineHeight: 1.1, marginTop: "2px" }}>
              {sellers.length}
            </div>
          </div>
        </div>

        {/* Buyers Card */}
        <div
          className="admin-card"
          style={{
            padding: "12px 16px",
            background: "var(--color-surface)",
            borderLeft: "4px solid #3b82f6",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            boxShadow: "var(--shadow-xs)",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "var(--radius-md)",
              background: "rgba(59, 130, 246, 0.1)",
              color: "#3b82f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ShoppingBag size={20} />
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "var(--color-text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Buyers
            </div>
            <div style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--color-text)", lineHeight: 1.1, marginTop: "2px" }}>
              {buyers.length}
            </div>
          </div>
        </div>

        {/* Admins Card */}
        <div
          className="admin-card"
          style={{
            padding: "12px 16px",
            background: "var(--color-surface)",
            borderLeft: "4px solid var(--color-danger)",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            boxShadow: "var(--shadow-xs)",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "var(--radius-md)",
              background: "rgba(197, 48, 48, 0.1)",
              color: "var(--color-danger)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={20} />
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "var(--color-text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Administrators
            </div>
            <div style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--color-danger)", lineHeight: 1.1, marginTop: "2px" }}>
              {admins.length}
            </div>
          </div>
        </div>
      </div>

      {/* Create User Collapsible Form */}
      <CreateUserForm />

      {/* Toolbar: Segmented Tabs, Filter & Search */}
      <div
        className="admin-card"
        style={{
          padding: "10px 14px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--space-sm)",
          background: "var(--color-surface)",
        }}
      >
        {/* Segmented Nav Tabs */}
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
            onClick={() => handleTabChange("all")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "var(--radius-sm)",
              fontSize: "12px",
              fontWeight: activeTab === "all" ? 600 : 500,
              background: activeTab === "all" ? "var(--color-surface)" : "transparent",
              color: activeTab === "all" ? "var(--color-primary)" : "var(--color-text-secondary)",
              boxShadow: activeTab === "all" ? "var(--shadow-xs)" : "none",
              transition: "all var(--transition-fast)",
            }}
          >
            <Users size={14} />
            <span>All Accounts</span>
            <span className={`badge ${activeTab === "all" ? "badge-primary" : "badge-neutral"}`} style={{ fontSize: "10px", padding: "1px 6px" }}>
              {initialUsers.length}
            </span>
          </button>

          <button
            onClick={() => handleTabChange("sellers")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "var(--radius-sm)",
              fontSize: "12px",
              fontWeight: activeTab === "sellers" ? 600 : 500,
              background: activeTab === "sellers" ? "var(--color-surface)" : "transparent",
              color: activeTab === "sellers" ? "var(--color-success)" : "var(--color-text-secondary)",
              boxShadow: activeTab === "sellers" ? "var(--shadow-xs)" : "none",
              transition: "all var(--transition-fast)",
            }}
          >
            <Store size={14} />
            <span>Sellers</span>
            <span className="badge badge-success" style={{ fontSize: "10px", padding: "1px 6px" }}>
              {sellers.length}
            </span>
          </button>

          <button
            onClick={() => handleTabChange("buyers")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "var(--radius-sm)",
              fontSize: "12px",
              fontWeight: activeTab === "buyers" ? 600 : 500,
              background: activeTab === "buyers" ? "var(--color-surface)" : "transparent",
              color: activeTab === "buyers" ? "#3b82f6" : "var(--color-text-secondary)",
              boxShadow: activeTab === "buyers" ? "var(--shadow-xs)" : "none",
              transition: "all var(--transition-fast)",
            }}
          >
            <ShoppingBag size={14} />
            <span>Buyers</span>
            <span className="badge badge-neutral" style={{ fontSize: "10px", padding: "1px 6px" }}>
              {buyers.length}
            </span>
          </button>

          <button
            onClick={() => handleTabChange("admins")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "var(--radius-sm)",
              fontSize: "12px",
              fontWeight: activeTab === "admins" ? 600 : 500,
              background: activeTab === "admins" ? "var(--color-surface)" : "transparent",
              color: activeTab === "admins" ? "var(--color-danger)" : "var(--color-text-secondary)",
              boxShadow: activeTab === "admins" ? "var(--shadow-xs)" : "none",
              transition: "all var(--transition-fast)",
            }}
          >
            <ShieldCheck size={14} />
            <span>Admins</span>
            <span className="badge badge-danger" style={{ fontSize: "10px", padding: "1px 6px" }}>
              {admins.length}
            </span>
          </button>
        </div>

        {/* Filter Controls: Role Dropdown & Search Box */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Role Filter Select */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="form-input"
            style={{
              fontSize: "12px",
              height: "34px",
              padding: "0 10px",
              minWidth: "120px",
            }}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="seller">Seller</option>
            <option value="buyer">Buyer</option>
          </select>

          {/* Search Box */}
          <div style={{ position: "relative", minWidth: "240px" }}>
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
              placeholder="Search user, email, shop..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              style={{
                paddingLeft: "30px",
                paddingRight: searchQuery ? "28px" : "10px",
                fontSize: "12px",
                height: "34px",
                width: "100%",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange("")}
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

      {/* Main Professional Data Table */}
      <div className="admin-card" style={{ overflow: "hidden" }}>
        <div
          style={{
            padding: "10px 16px",
            borderBottom: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--color-surface)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600, fontSize: "13.5px" }}>
            <UserCheck size={16} style={{ color: "var(--color-primary)" }} />
            User Account Directory ({filteredUsers.length})
          </div>
          <span className="badge badge-neutral" style={{ fontSize: "11px", padding: "2px 8px" }}>
            10 users per page
          </span>
        </div>

        {paginatedUsers.length > 0 ? (
          <>
            <div className="table-responsive">
              <table className="admin-table" style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
                <thead>
                  <tr style={{ background: "var(--color-surface-hover)" }}>
                    <th style={{ padding: "10px 14px", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      User Profile &amp; Contact
                    </th>
                    <th style={{ padding: "10px 14px", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Shop Brand Name
                    </th>
                    <th style={{ padding: "10px 14px", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Platform Role
                    </th>
                    <th style={{ padding: "10px 14px", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Date Registered
                    </th>
                    <th style={{ padding: "10px 14px", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "right" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((u) => {
                    const userName = u.full_name || u.shop_name || "User Account";
                    const initialLetter = userName.charAt(0).toUpperCase();
                    const avatarGradient = getUserAvatarGradient(userName);
                    const isUserProcessing = processingId === u.id && isPending;

                    return (
                      <tr key={u.id} className="table-row-hover">
                        {/* User & Contact */}
                        <td style={{ padding: "12px 14px", verticalAlign: "middle" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div
                              style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                background: avatarGradient,
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                                fontSize: "15px",
                                flexShrink: 0,
                                boxShadow: "0 2px 5px rgba(0,0,0,0.12)",
                              }}
                            >
                              {initialLetter}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: "14px", color: "var(--color-text)", lineHeight: 1.2 }}>
                                {u.full_name || "—"}
                              </div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "var(--color-text-secondary)",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  marginTop: "2px",
                                }}
                              >
                                <Mail size={12} style={{ color: "var(--color-text-tertiary)" }} />
                                {u.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Shop Name */}
                        <td style={{ padding: "12px 14px", verticalAlign: "middle" }}>
                          {u.shop_name && u.shop_name !== "—" ? (
                            <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontWeight: 600, fontSize: "13px", color: "var(--color-text)" }}>
                              <Store size={14} style={{ color: "var(--color-primary)" }} />
                              {u.shop_name}
                            </div>
                          ) : (
                            <span style={{ fontSize: "12px", color: "var(--color-text-tertiary)" }}>—</span>
                          )}
                        </td>

                        {/* Role Badge */}
                        <td style={{ padding: "12px 14px", verticalAlign: "middle" }}>
                          <span
                            className={`badge ${
                              u.role === "admin"
                                ? "badge-danger"
                                : u.role === "seller"
                                ? "badge-success"
                                : "badge-neutral"
                            }`}
                            style={{ fontSize: "11px", padding: "3px 9px", textTransform: "capitalize" }}
                          >
                            {u.role === "admin" && <ShieldCheck size={11} style={{ marginRight: "3px" }} />}
                            {u.role === "seller" && <Store size={11} style={{ marginRight: "3px" }} />}
                            {u.role || "buyer"}
                          </span>
                        </td>

                        {/* Joined Date */}
                        <td style={{ padding: "12px 14px", verticalAlign: "middle", fontSize: "12.5px", color: "var(--color-text-secondary)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                            <Calendar size={13} style={{ color: "var(--color-text-tertiary)" }} />
                            {new Date(u.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: "12px 14px", verticalAlign: "middle", textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: "6px", justifyContent: "flex-end", alignItems: "center" }}>
                            {u.role !== "admin" && (
                              <button
                                onClick={() => handleToggleRole(u)}
                                disabled={isUserProcessing}
                                className="btn btn-secondary btn-sm"
                                style={{
                                  fontSize: "11.5px",
                                  padding: "4px 10px",
                                  height: "28px",
                                  minWidth: "84px",
                                  justifyContent: "center",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px",
                                }}
                              >
                                <ArrowRightLeft size={11} />
                                {isUserProcessing
                                  ? "..."
                                  : u.role === "seller"
                                  ? "To Buyer"
                                  : "To Seller"}
                              </button>
                            )}

                            {u.role !== "admin" && (
                              <button
                                onClick={() => handleDelete(u)}
                                disabled={isUserProcessing}
                                className="btn btn-danger btn-sm"
                                title="Delete User Account"
                                style={{
                                  padding: "4px 8px",
                                  height: "28px",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div
              style={{
                padding: "10px 16px",
                borderTop: "1px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "var(--space-sm)",
                fontSize: "12px",
                color: "var(--color-text-secondary)",
                background: "var(--color-surface)",
              }}
            >
              <div>
                Showing <strong>{(currentPage - 1) * ITEMS_PER_PAGE + 1}</strong> to{" "}
                <strong>{Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)}</strong> of{" "}
                <strong>{filteredUsers.length}</strong> users
              </div>

              {totalPages > 1 && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="btn btn-secondary btn-sm"
                    style={{
                      padding: "4px 10px",
                      fontSize: "12px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      height: "28px",
                      opacity: currentPage === 1 ? 0.5 : 1,
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    }}
                  >
                    <ChevronLeft size={14} /> Previous
                  </button>

                  <div style={{ display: "flex", gap: "4px" }}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        style={{
                          padding: "3px 8px",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "12px",
                          fontWeight: currentPage === page ? 700 : 400,
                          background: currentPage === page ? "var(--color-primary)" : "var(--color-bg-secondary)",
                          color: currentPage === page ? "#fff" : "var(--color-text)",
                          border: "none",
                          cursor: "pointer",
                          minWidth: "26px",
                          height: "26px",
                        }}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="btn btn-secondary btn-sm"
                    style={{
                      padding: "4px 10px",
                      fontSize: "12px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      height: "28px",
                      opacity: currentPage === totalPages ? 0.5 : 1,
                      cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                    }}
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div
            style={{
              padding: "50px 24px",
              textAlign: "center",
              color: "var(--color-text-secondary)",
            }}
          >
            <Users
              size={40}
              style={{ marginBottom: "12px", color: "var(--color-border)", margin: "0 auto 12px" }}
            />
            <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--color-text)" }}>
              No matching user accounts found
            </h3>
            <p style={{ fontSize: "13px", marginTop: "4px" }}>
              Try adjusting your search criteria or role filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
