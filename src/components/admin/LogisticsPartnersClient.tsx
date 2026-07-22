"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  LogisticsPartner,
  createLogisticsPartner,
  updateLogisticsPartner,
  toggleLogisticsPartnerActive,
  deleteLogisticsPartner,
} from "@/actions/admin/action-logistics-partners";
import {
  Truck,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Crown,
  Package,
  Plane,
  Globe,
  Navigation,
  Shield,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";

const INITIAL_DEFAULT_PARTNERS: LogisticsPartner[] = [
  {
    id: "default-ninja-van",
    name: "Ninja Van",
    badge_color: "#dc2626",
    icon_type: "emoji",
    icon_value: "🥷",
    tracking_url_template: "https://www.ninjavan.co/en-mm/tracking?id={tracking_id}",
    description: "Myanmar Nationwide Express Delivery",
    is_active: true,
    sort_order: 1,
  },
  {
    id: "default-royal-express",
    name: "Royal Express",
    badge_color: "#1e3a8a",
    icon_type: "lucide_icon",
    icon_value: "Crown",
    tracking_url_template: "https://royalexpress.com.mm/track/{tracking_id}",
    description: "Premium Express Courier & Cargo",
    is_active: true,
    sort_order: 2,
  },
  {
    id: "default-kmd-express",
    name: "K-MD Express",
    badge_color: "#059669",
    icon_type: "lucide_icon",
    icon_value: "Package",
    tracking_url_template: "https://kmdexpress.com/track/{tracking_id}",
    description: "Fast & Reliable Regional Logistics",
    is_active: true,
    sort_order: 3,
  },
];

const PRESET_PROVIDERS = [
  { name: "Ninja Van", color: "#dc2626", icon: "🥷", type: "emoji" },
  { name: "Royal Express", color: "#1e3a8a", icon: "Crown", type: "lucide_icon" },
  { name: "K-MD Express", color: "#059669", icon: "Package", type: "lucide_icon" },
  { name: "SpeedX Express", color: "#d97706", icon: "Truck", type: "lucide_icon" },
  { name: "Britium Express", color: "#7c3aed", icon: "Globe", type: "lucide_icon" },
  { name: "Myanmar Post", color: "#b91c1c", icon: "📮", type: "emoji" },
  { name: "DHL Express", color: "#ca8a04", icon: "Plane", type: "lucide_icon" },
  { name: "FedEx Cargo", color: "#4c1d95", icon: "Navigation", type: "lucide_icon" },
];

const PRESET_COLORS = [
  "#dc2626", // Red
  "#1e3a8a", // Navy Blue
  "#059669", // Emerald Green
  "#d97706", // Amber
  "#7c3aed", // Purple
  "#0284c7", // Sky Blue
  "#b91c1c", // Dark Red
  "#4c1d95", // Indigo
  "#0f172a", // Dark Slate
];

export default function LogisticsPartnersClient({
  initialPartners,
}: {
  initialPartners: LogisticsPartner[];
}) {
  const [partners, setPartners] = useState<LogisticsPartner[]>(() => {
    if (initialPartners && initialPartners.length > 0) return initialPartners;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("yoeyarzay_logistics_partners_v1");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {
          console.error("Failed to parse saved logistics partners:", e);
        }
      }
    }
    return INITIAL_DEFAULT_PARTNERS;
  });
  const [dbNotice, setDbNotice] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<LogisticsPartner | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [badgeColor, setBadgeColor] = useState("#0284c7");
  const [iconType, setIconType] = useState<"emoji" | "lucide_icon" | "image">("emoji");
  const [iconValue, setIconValue] = useState("🚚");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  // Copy SQL script state
  const [copiedSql, setCopiedSql] = useState(false);

  // Sync to localStorage when partners change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("yoeyarzay_logistics_partners_v1", JSON.stringify(partners));
    }
  }, [partners]);

  // Open Modal for Create
  const handleOpenCreateModal = () => {
    setEditingPartner(null);
    setName("");
    setBadgeColor("#0284c7");
    setIconType("emoji");
    setIconValue("🚚");
    setTrackingUrl("");
    setDescription("");
    setIsActive(true);
    setSortOrder(partners.length + 1);
    setFormError(null);
    setFormSuccess(null);
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (partner: LogisticsPartner) => {
    setEditingPartner(partner);
    setName(partner.name);
    setBadgeColor(partner.badge_color || "#0284c7");
    setIconType((partner.icon_type as "emoji" | "lucide_icon" | "image") || "emoji");
    setIconValue(partner.icon_value || "🚚");
    setTrackingUrl(partner.tracking_url_template || "");
    setDescription(partner.description || "");
    setIsActive(partner.is_active);
    setSortOrder(partner.sort_order || 0);
    setFormError(null);
    setFormSuccess(null);
    setIsModalOpen(true);
  };

  // Handle Preset Provider Selection
  const handleSelectPreset = (preset: typeof PRESET_PROVIDERS[0]) => {
    setName(preset.name);
    setBadgeColor(preset.color);
    setIconType(preset.type as "emoji" | "lucide_icon" | "image");
    setIconValue(preset.icon);
  };

  // Handle File Upload from Device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setFormError("Uploaded image size exceeds 2MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setIconType("image");
        setIconValue(event.target.result as string);
        setFormError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Partner (Create or Update)
  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError("Partner Name is required.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("badge_color", badgeColor);
    formData.append("icon_type", iconType);
    formData.append("icon_value", iconValue);
    formData.append("tracking_url_template", trackingUrl);
    formData.append("description", description);
    formData.append("is_active", isActive ? "true" : "false");
    formData.append("sort_order", sortOrder.toString());

    let res;
    if (editingPartner && !editingPartner.id.startsWith("default-")) {
      res = await updateLogisticsPartner(editingPartner.id, formData);
    } else {
      res = await createLogisticsPartner(formData);
    }

    if (res?.error) {
      console.warn("Database save notice:", res.error);
      if (res.error.includes("missing on Supabase")) {
        setDbNotice(res.error);
      }
    }

    // Local state & localStorage fallback update
    let updatedList: LogisticsPartner[] = [];
    if (editingPartner) {
      updatedList = partners.map((p) =>
        p.id === editingPartner.id
          ? {
              ...p,
              name,
              badge_color: badgeColor,
              icon_type: iconType,
              icon_value: iconValue,
              tracking_url_template: trackingUrl,
              description,
              is_active: isActive,
              sort_order: sortOrder,
              updated_at: new Date().toISOString(),
            }
          : p
      );
    } else {
      const newPartner: LogisticsPartner = {
        id: `local-logistics-${Date.now()}`,
        name,
        badge_color: badgeColor,
        icon_type: iconType,
        icon_value: iconValue,
        tracking_url_template: trackingUrl,
        description,
        is_active: isActive,
        sort_order: sortOrder,
        created_at: new Date().toISOString(),
      };
      updatedList = [...partners, newPartner];
    }

    setPartners(updatedList);
    if (typeof window !== "undefined") {
      localStorage.setItem("yoeyarzay_logistics_partners_v1", JSON.stringify(updatedList));
    }

    setIsSubmitting(false);
    setFormSuccess("Logistics partner saved successfully!");
    setTimeout(() => {
      setIsModalOpen(false);
      setFormSuccess(null);
    }, 800);
  };

  // Toggle Active Status
  const handleToggleActive = async (partner: LogisticsPartner) => {
    const newStatus = !partner.is_active;
    const updated = partners.map((p) => (p.id === partner.id ? { ...p, is_active: newStatus } : p));
    setPartners(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("yoeyarzay_logistics_partners_v1", JSON.stringify(updated));
    }

    if (!partner.id.startsWith("default-") && !partner.id.startsWith("local-")) {
      await toggleLogisticsPartnerActive(partner.id, newStatus);
    }
  };

  // Delete Partner
  const handleDelete = async (partner: LogisticsPartner) => {
    if (!confirm(`Are you sure you want to delete "${partner.name}"?`)) return;

    const updated = partners.filter((p) => p.id !== partner.id);
    setPartners(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("yoeyarzay_logistics_partners_v1", JSON.stringify(updated));
    }

    if (!partner.id.startsWith("default-") && !partner.id.startsWith("local-")) {
      await deleteLogisticsPartner(partner.id);
    }
  };

  // Render Badge Icon
  const renderBadgeIcon = (partner: LogisticsPartner) => {
    if (partner.icon_type === "image" && partner.icon_value) {
      return (
        <Image
          src={partner.icon_value}
          alt={partner.name}
          width={16}
          height={16}
          unoptimized
          style={{ objectFit: "contain", borderRadius: "2px" }}
        />
      );
    }
    if (partner.icon_type === "lucide_icon") {
      if (partner.icon_value === "Crown") return <Crown size={12} style={{ color: "#fbbf24" }} />;
      if (partner.icon_value === "Package") return <Package size={12} />;
      if (partner.icon_value === "Truck") return <Truck size={12} />;
      if (partner.icon_value === "Plane") return <Plane size={12} />;
      if (partner.icon_value === "Globe") return <Globe size={12} />;
      if (partner.icon_value === "Navigation") return <Navigation size={12} />;
    }
    return <span style={{ fontSize: "13px" }}>{partner.icon_value || "🚚"}</span>;
  };

  const sqlMigrationCode = `-- Copy and run in Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.logistics_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  badge_color TEXT DEFAULT '#0284c7',
  icon_type TEXT DEFAULT 'emoji',
  icon_value TEXT DEFAULT '🚚',
  tracking_url_template TEXT,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.logistics_partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view active" ON public.logistics_partners FOR SELECT USING (true);
CREATE POLICY "Admin manage" ON public.logistics_partners FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sqlMigrationCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* DB Migration Notice Banner */}
      {dbNotice && (
        <div
          style={{
            background: "#fffbebf5",
            border: "1px solid #fcd34d",
            borderRadius: "12px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            boxShadow: "0 2px 8px rgba(245,158,11,0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Shield size={20} style={{ color: "#d97706" }} />
              <strong style={{ fontSize: "14px", color: "#92400e" }}>
                Notice: Database table `logistics_partners` needs to be created on Supabase
              </strong>
            </div>
            <button
              onClick={copySqlToClipboard}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "#d97706",
                color: "#ffffff",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                marginLeft: "auto",
              }}
            >
              {copiedSql ? <Check size={14} /> : <Copy size={14} />}
              {copiedSql ? "Copied SQL!" : "Copy SQL Script"}
            </button>
          </div>
          <p style={{ fontSize: "12.5px", color: "#b45309", margin: 0, lineHeight: 1.4 }}>
            Changes are temporarily saved in local state & browser storage so you can manage logistics partners seamlessly! To persist permanently in Supabase, execute the SQL script in your Supabase SQL Editor.
          </p>
        </div>
      )}

      {/* Page Header Strip */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          background: "var(--color-surface)",
          padding: "20px 24px",
          borderRadius: "16px",
          border: "1px solid var(--color-border)",
          boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
              }}
            >
              <Truck size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: "20px", fontWeight: 800, color: "var(--color-text)", margin: 0 }}>
                Logistics Partners
              </h1>
              <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", margin: "2px 0 0 0" }}>
                စီမံခန့်ခွဲသူ ပို့ဆောင်ရေး မိတ်ဖက်များ ပြင်ဆင်ခြင်း နှင့် Footer စင်းခ်လုပ်ခြင်း
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenCreateModal}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            color: "#ffffff",
            padding: "10px 18px",
            borderRadius: "10px",
            fontWeight: 700,
            fontSize: "13.5px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          <Plus size={18} />
          <span>+ Add New Logistics Partner</span>
        </button>
      </div>

      {/* Live Footer Preview Box */}
      <div
        style={{
          background: "var(--color-surface)",
          padding: "18px 24px",
          borderRadius: "14px",
          border: "1px solid var(--color-border-light)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <span style={{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px", color: "#64748b" }}>
            Website Footer Live Sync Preview
          </span>
          <span style={{ fontSize: "10px", background: "rgba(16, 185, 129, 0.12)", color: "#10b981", padding: "2px 8px", borderRadius: "10px", fontWeight: 800 }}>
            Synchronized
          </span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
          {partners
            .filter((p) => p.is_active)
            .map((partner) => (
              <div
                key={partner.id}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  background: partner.badge_color || "#0284c7",
                  color: "#ffffff",
                  padding: "5px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 800,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                }}
              >
                {renderBadgeIcon(partner)}
                <span>{partner.name}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Logistics Partners Grid Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "18px" }}>
        {partners.map((partner) => (
          <div
            key={partner.id}
            style={{
              background: "var(--color-surface)",
              borderRadius: "14px",
              border: `1px solid ${partner.is_active ? "var(--color-border)" : "rgba(239, 68, 68, 0.3)"}`,
              padding: "18px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              position: "relative",
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              opacity: partner.is_active ? 1 : 0.7,
            }}
          >
            {/* Header / Badge */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: partner.badge_color || "#0284c7",
                  color: "#ffffff",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 800,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                }}
              >
                {renderBadgeIcon(partner)}
                <span>{partner.name}</span>
              </div>

              {/* Active Toggle Switch */}
              <button
                onClick={() => handleToggleActive(partner)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  background: partner.is_active ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.12)",
                  color: partner.is_active ? "#10b981" : "#ef4444",
                  border: `1px solid ${partner.is_active ? "rgba(16, 185, 129, 0.25)" : "rgba(239, 68, 68, 0.25)"}`,
                  padding: "4px 10px",
                  borderRadius: "20px",
                  fontSize: "11.5px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {partner.is_active ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                <span>{partner.is_active ? "Active" : "Inactive"}</span>
              </button>
            </div>

            {/* Description & Tracking */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12.5px", color: "var(--color-text-secondary)" }}>
              {partner.description && <div>{partner.description}</div>}
              {partner.tracking_url_template ? (
                <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#0284c7", wordBreak: "break-all" }}>
                  <ExternalLink size={12} />
                  <span style={{ fontSize: "11.5px", fontFamily: "monospace" }}>{partner.tracking_url_template}</span>
                </div>
              ) : (
                <div style={{ fontSize: "11.5px", color: "#94a3b8" }}>No tracking URL configured</div>
              )}
            </div>

            {/* Actions Row */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
                borderTop: "1px solid var(--color-border-light)",
                paddingTop: "12px",
                marginTop: "auto",
              }}
            >
              <button
                onClick={() => handleOpenEditModal(partner)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  background: "var(--color-surface-hover)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                  padding: "5px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <Edit2 size={13} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(partner)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  background: "rgba(239, 68, 68, 0.08)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  color: "#ef4444",
                  padding: "5px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <Trash2 size={13} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Dialog for Add / Edit */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "16px",
          }}
        >
          <div
            style={{
              background: "var(--color-surface)",
              borderRadius: "16px",
              border: "1px solid var(--color-border)",
              maxWidth: "520px",
              width: "100%",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "18px 24px",
                borderBottom: "1px solid var(--color-border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "var(--color-surface-hover)",
              }}
            >
              <h3 style={{ fontSize: "16px", fontWeight: 800, margin: 0, color: "var(--color-text)" }}>
                {editingPartner ? "Edit Logistics Partner" : "Add New Logistics Partner"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "var(--color-text-secondary)" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePartner} style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              {formError && (
                <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#ef4444", padding: "10px 14px", borderRadius: "8px", fontSize: "12.5px" }}>
                  {formError}
                </div>
              )}
              {formSuccess && (
                <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#10b981", padding: "10px 14px", borderRadius: "8px", fontSize: "12.5px" }}>
                  {formSuccess}
                </div>
              )}

              {/* Quick Presets */}
              {!editingPartner && (
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-text-secondary)", marginBottom: "6px", display: "block" }}>
                    Quick Select Preset Provider:
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {PRESET_PROVIDERS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        style={{
                          background: preset.color,
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "6px",
                          padding: "4px 8px",
                          fontSize: "11px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Partner Name */}
              <div>
                <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--color-text)", marginBottom: "4px", display: "block" }}>
                  Partner Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ninja Van, Royal Express"
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--color-border)",
                    background: "var(--color-surface)",
                    color: "var(--color-text)",
                    fontSize: "13px",
                  }}
                  required
                />
              </div>

              {/* Badge Color Picker */}
              <div>
                <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--color-text)", marginBottom: "4px", display: "block" }}>
                  Badge Brand Color *
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input
                    type="color"
                    value={badgeColor}
                    onChange={(e) => setBadgeColor(e.target.value)}
                    style={{ width: "42px", height: "36px", border: "none", borderRadius: "6px", cursor: "pointer", background: "none" }}
                  />
                  <input
                    type="text"
                    value={badgeColor}
                    onChange={(e) => setBadgeColor(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid var(--color-border)",
                      background: "var(--color-surface)",
                      color: "var(--color-text)",
                      fontSize: "13px",
                      fontFamily: "monospace",
                    }}
                  />
                  <div style={{ display: "flex", gap: "4px" }}>
                    {PRESET_COLORS.map((c) => (
                      <div
                        key={c}
                        onClick={() => setBadgeColor(c)}
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "4px",
                          background: c,
                          cursor: "pointer",
                          border: badgeColor === c ? "2px solid #ffffff" : "1px solid rgba(0,0,0,0.1)",
                          boxShadow: badgeColor === c ? "0 0 0 2px #2563eb" : "none",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Icon Type & Upload */}
              <div>
                <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--color-text)", marginBottom: "4px", display: "block" }}>
                  Icon / Logo
                </label>
                <div style={{ display: "flex", gap: "12px", marginBottom: "8px" }}>
                  <label style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}>
                    <input type="radio" name="icon_type" checked={iconType === "emoji"} onChange={() => setIconType("emoji")} />
                    <span>Emoji / Symbol</span>
                  </label>
                  <label style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}>
                    <input type="radio" name="icon_type" checked={iconType === "lucide_icon"} onChange={() => setIconType("lucide_icon")} />
                    <span>Lucide Vector Icon</span>
                  </label>
                  <label style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}>
                    <input type="radio" name="icon_type" checked={iconType === "image"} onChange={() => setIconType("image")} />
                    <span>Upload Device Image</span>
                  </label>
                </div>

                {iconType === "emoji" && (
                  <input
                    type="text"
                    value={iconValue}
                    onChange={(e) => setIconValue(e.target.value)}
                    placeholder="e.g. 🥷, 🚚, 📦"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid var(--color-border)",
                      background: "var(--color-surface)",
                      color: "var(--color-text)",
                      fontSize: "14px",
                    }}
                  />
                )}

                {iconType === "lucide_icon" && (
                  <select
                    value={iconValue}
                    onChange={(e) => setIconValue(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid var(--color-border)",
                      background: "var(--color-surface)",
                      color: "var(--color-text)",
                      fontSize: "13px",
                    }}
                  >
                    <option value="Truck">Truck (🚚)</option>
                    <option value="Package">Package (📦)</option>
                    <option value="Crown">Crown (👑)</option>
                    <option value="Plane">Plane (✈️)</option>
                    <option value="Globe">Globe (🌐)</option>
                    <option value="Navigation">Navigation (🧭)</option>
                  </select>
                )}

                {iconType === "image" && (
                  <div>
                    <input type="file" accept="image/*" onChange={handleFileUpload} style={{ fontSize: "12px" }} />
                    {iconValue && iconValue.startsWith("data:image/") && (
                      <div style={{ marginTop: "6px" }}>
                        <Image src={iconValue} alt="Preview" width={28} height={28} unoptimized style={{ objectFit: "contain", borderRadius: "4px" }} />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Tracking URL Template */}
              <div>
                <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--color-text)", marginBottom: "4px", display: "block" }}>
                  Tracking URL Template (Optional)
                </label>
                <input
                  type="text"
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  placeholder="e.g. https://ninjavan.co/track/{tracking_id}"
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--color-border)",
                    background: "var(--color-surface)",
                    color: "var(--color-text)",
                    fontSize: "12.5px",
                    fontFamily: "monospace",
                  }}
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--color-text)", marginBottom: "4px", display: "block" }}>
                  Description / Service Coverage
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Myanmar Nationwide Door-to-Door Delivery"
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--color-border)",
                    background: "var(--color-surface)",
                    color: "var(--color-text)",
                    fontSize: "13px",
                  }}
                />
              </div>

              {/* Active Checkbox */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input type="checkbox" id="isActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                <label htmlFor="isActive" style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-text)", cursor: "pointer" }}>
                  Enable Logistics Partner on Website Footer
                </label>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: "9px 16px",
                    borderRadius: "8px",
                    background: "var(--color-surface-hover)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text)",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: "9px 20px",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                    border: "none",
                    color: "#ffffff",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: isSubmitting ? "wait" : "pointer",
                    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
                  }}
                >
                  {isSubmitting ? "Saving..." : editingPartner ? "Update Partner" : "Create Partner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
