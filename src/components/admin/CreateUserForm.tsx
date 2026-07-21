"use client";

import { useActionState, useState } from "react";
import { createUser, type UserFormState } from "@/actions/admin/action-users";
import { UserPlus, ChevronDown, ChevronUp, CheckCircle, AlertCircle, Sparkles } from "lucide-react";

export default function CreateUserForm() {
  const [state, formAction, isPending] = useActionState<
    UserFormState,
    FormData
  >(createUser, {});
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<"seller" | "buyer">("seller");

  return (
    <div
      className="admin-card"
      style={{
        overflow: "hidden",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-xs)",
        transition: "all var(--transition-fast)",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          background: open ? "var(--color-surface-hover)" : "var(--color-surface)",
          border: "none",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: "14px",
          color: "var(--color-text)",
          transition: "background var(--transition-fast)",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              background: "var(--color-primary-ghost)",
              color: "var(--color-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <UserPlus size={16} />
          </div>
          <span>Create New User Account</span>
          <span className="badge badge-primary" style={{ fontSize: "10px", padding: "1px 6px" }}>
            Admin Action
          </span>
        </span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {open && (
        <div
          style={{
            padding: "16px",
            borderTop: "1px solid var(--color-border)",
            background: "var(--color-surface)",
          }}
        >
          {state.success && (
            <div
              style={{
                padding: "8px 12px",
                background: "rgba(45, 125, 70, 0.12)",
                border: "1px solid var(--color-success)",
                borderRadius: "var(--radius-md)",
                marginBottom: "12px",
                color: "var(--color-success)",
                fontWeight: 600,
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <CheckCircle size={16} /> User created successfully!
            </div>
          )}

          {state.error && (
            <div
              style={{
                padding: "8px 12px",
                background: "rgba(197, 48, 48, 0.12)",
                border: "1px solid var(--color-danger)",
                color: "var(--color-danger)",
                borderRadius: "var(--radius-md)",
                marginBottom: "12px",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <AlertCircle size={16} /> {state.error}
            </div>
          )}

          <form action={formAction}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "12px",
                marginBottom: "14px",
              }}
            >
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="full_name" style={{ fontSize: "12px", fontWeight: 600 }}>
                  Full Name *
                </label>
                <input
                  className="form-input"
                  id="full_name"
                  name="full_name"
                  required
                  placeholder="e.g. Daw Aye Aye"
                  style={{ fontSize: "13px", height: "36px" }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="email" style={{ fontSize: "12px", fontWeight: 600 }}>
                  Email Address *
                </label>
                <input
                  className="form-input"
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="user@yoeyarzay.com"
                  style={{ fontSize: "13px", height: "36px" }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="password" style={{ fontSize: "12px", fontWeight: 600 }}>
                  Account Password *
                </label>
                <input
                  className="form-input"
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  placeholder="min 8 characters"
                  style={{ fontSize: "13px", height: "36px" }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="role" style={{ fontSize: "12px", fontWeight: 600 }}>
                  Initial Account Role *
                </label>
                <select
                  className="form-input"
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as "seller" | "buyer")}
                  style={{ fontSize: "13px", height: "36px" }}
                >
                  <option value="seller">Seller (Merchant)</option>
                  <option value="buyer">Buyer (Customer)</option>
                </select>
              </div>

              {role === "seller" && (
                <div className="form-group" style={{ marginBottom: 0, gridColumn: "1 / -1" }}>
                  <label className="form-label" htmlFor="shop_name" style={{ fontSize: "12px", fontWeight: 600 }}>
                    Brand / Shop Name *
                  </label>
                  <input
                    className="form-input"
                    id="shop_name"
                    name="shop_name"
                    required={role === "seller"}
                    placeholder="e.g. Mandalay Traditional Crafts"
                    style={{ fontSize: "13px", height: "36px" }}
                  />
                </div>
              )}

              {role === "buyer" && <input type="hidden" name="shop_name" value="—" />}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setOpen(false)}
                style={{ fontSize: "12px", height: "32px", padding: "0 14px" }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={isPending}
                style={{ fontSize: "12px", height: "32px", padding: "0 16px", display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <Sparkles size={14} />
                {isPending ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
