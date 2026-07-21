"use client";

import { useState, useRef, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { Settings, CreditCard, LogOut, ChevronDown } from "lucide-react";
import { signOut } from "@/actions/auth/action-signout";
import { useTranslations } from "next-intl";

interface ProfileDropdownProps {
  userEmail: string;
  fullName: string;
}

export default function ProfileDropdown({
  userEmail,
  fullName,
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Header");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="profile-dropdown-container"
      ref={dropdownRef}
      style={{ position: "relative" }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t("account")}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        style={{
          background: "transparent",
          border: "none",
          color: "var(--color-text)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "14px",
          fontWeight: 500,
          padding: "4px 8px",
          borderRadius: "var(--radius-md)",
          transition: "background var(--transition-fast)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--color-surface-hover)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
      >
        <div
          style={{
            width: "26px",
            height: "26px",
            borderRadius: "50%",
            backgroundColor: "var(--color-primary)",
            color: "var(--color-text-inverse)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {(fullName?.[0] || userEmail?.[0] || "?").toUpperCase()}
        </div>
        <span style={{ maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {fullName}
        </span>
        <ChevronDown
          size={14}
          style={{
            transform: isOpen ? "rotate(180deg)" : "none",
            transition: "transform var(--transition-base)",
          }}
        />
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: "200px",
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-lg)",
            padding: "6px",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          {/* User Info Header */}
          <div
            style={{
              padding: "8px 12px",
              borderBottom: "1px solid var(--color-border)",
              marginBottom: "4px",
            }}
          >
            <div
              style={{
                fontWeight: 600,
                fontSize: "13px",
                color: "var(--color-text)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {fullName}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "var(--color-text-secondary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {userEmail}
            </div>
          </div>

          {/* Links */}
          <Link
            href="/settings"
            onClick={() => setIsOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 12px",
              fontSize: "13px",
              color: "var(--color-text)",
              textDecoration: "none",
              borderRadius: "var(--radius-md)",
              transition: "background var(--transition-fast)",
            }}
            className="dropdown-link-hover"
          >
            <Settings size={15} />
            <span>{t("settings")}</span>
          </Link>

          <Link
            href="/settings#payment"
            onClick={() => setIsOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 12px",
              fontSize: "13px",
              color: "var(--color-text)",
              textDecoration: "none",
              borderRadius: "var(--radius-md)",
              transition: "background var(--transition-fast)",
            }}
            className="dropdown-link-hover"
          >
            <CreditCard size={15} />
            <span>{t("payment")}</span>
          </Link>

          <hr
            style={{
              border: 0,
              borderTop: "1px solid var(--color-border)",
              margin: "4px 0",
            }}
          />

          {/* Logout Action */}
          <form action={signOut} style={{ width: "100%" }}>
            <button
              type="submit"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                fontSize: "13px",
                color: "var(--color-danger)",
                background: "transparent",
                border: "none",
                textAlign: "left",
                cursor: "pointer",
                borderRadius: "var(--radius-md)",
                transition: "background var(--transition-fast)",
              }}
              className="dropdown-logout-hover"
            >
              <LogOut size={15} />
              <span>{t("logout")}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
