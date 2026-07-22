"use client";

import { useActionState, useState, useRef } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import {
  submitSellerApplication,
  type ApplicationState,
} from "@/actions/auth/action-become-seller";
import {
  Store,
  Clock,
  CheckCircle,
  XCircle,
  UploadCloud,
  FileText,
  File,
  X,
  Sparkles,
  Building,
  User,
  Phone,
  MapPin,
  ExternalLink,
} from "lucide-react";

type ApplicationStatus = {
  status: "pending" | "approved" | "rejected";
  rejection_reason?: string | null;
  shop_name?: string | null;
  created_at?: string;
  nrc_document_url?: string | null;
  license_document_url?: string | null;
} | null;

interface DragDropUploaderProps {
  label: string;
  name: string;
  acceptedTypes?: string;
  required?: boolean;
}

function DragDropUploader({ label, name, acceptedTypes = "image/*,application/pdf", required = false }: DragDropUploaderProps) {
  const locale = useLocale();
  const isMM = locale === "my";

  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }
    setSelectedFile(file);
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileChange(file);
      if (fileInputRef.current) {
        const dt = new DataTransfer();
        dt.items.add(file);
        fileInputRef.current.files = dt.files;
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="form-group" style={{ marginBottom: 0, gridColumn: "1 / -1" }}>
      <label className="form-label" style={{ fontSize: "12px", fontWeight: 600 }}>
        {label} {required && "*"}
      </label>

      {/* Hidden File Input */}
      <input
        type="file"
        name={name}
        ref={fileInputRef}
        accept={acceptedTypes}
        required={required && !selectedFile}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileChange(e.target.files[0]);
          }
        }}
        style={{ display: "none" }}
      />

      {/* Drag & Drop Dropzone Box */}
      {!selectedFile ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${dragOver ? "var(--color-primary)" : "var(--color-border)"}`,
            borderRadius: "var(--radius-md)",
            background: dragOver ? "var(--color-primary-ghost)" : "var(--color-surface)",
            padding: "20px 16px",
            textAlign: "center",
            cursor: "pointer",
            transition: "all var(--transition-fast)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "var(--color-primary-ghost)",
              color: "var(--color-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <UploadCloud size={20} />
          </div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-text)" }}>
              {isMM
                ? "ဖိုင်အား ဤနေရာသို့ Drag & drop ဆွဲထည့်ပါ သို့မဟုတ် "
                : "Drag & drop document file here, or "}
              <span style={{ color: "var(--color-primary)" }}>{isMM ? "နှိပ်၍ ရွေးချယ်ပါ" : "browse"}</span>
            </div>
            <div style={{ fontSize: "11px", color: "var(--color-text-secondary)", marginTop: "2px" }}>
              {isMM
                ? "လက်ခံသည့် ဖိုင်အမျိုးအစားများ - JPG, PNG, WEBP, PDF (အများဆုံး 10MB)"
                : "Supports JPG, PNG, WEBP, PDF (Max file size: 10MB)"}
            </div>
          </div>
        </div>
      ) : (
        /* Selected File Card Preview */
        <div
          style={{
            border: "1px solid var(--color-primary)",
            borderRadius: "var(--radius-md)",
            background: "var(--color-surface)",
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Document preview"
                width={44}
                height={44}
                unoptimized
                style={{
                  borderRadius: "6px",
                  objectFit: "cover",
                  border: "1px solid var(--color-border)",
                  flexShrink: 0,
                }}
              />
            ) : (
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "6px",
                  background: "var(--color-primary-ghost)",
                  color: "var(--color-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <File size={22} />
              </div>
            )}
            <div style={{ overflow: "hidden" }}>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--color-text)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {selectedFile.name}
              </div>
              <div style={{ fontSize: "11px", color: "var(--color-text-secondary)", marginTop: "1px" }}>
                {formatFileSize(selectedFile.size)} • {selectedFile.type || "Document"}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleFileChange(null)}
            className="btn btn-secondary btn-sm"
            style={{ padding: "4px 8px", height: "28px", color: "var(--color-danger)" }}
            title="Remove File"
          >
            <X size={14} /> {isMM ? "ဖယ်ရှားမည်" : "Remove"}
          </button>
        </div>
      )}
    </div>
  );
}

export function SellerApplicationForm({
  application,
}: {
  application: ApplicationStatus;
}) {
  const locale = useLocale();
  const isMM = locale === "my";

  const [state, formAction, isPending] = useActionState<
    ApplicationState,
    FormData
  >(submitSellerApplication, {});

  // Already approved
  if (application?.status === "approved") {
    return (
      <div
        className="admin-card"
        style={{
          padding: "18px 20px",
          borderLeft: "4px solid var(--color-success)",
          background: "var(--color-surface)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              background: "rgba(45, 125, 70, 0.1)",
              color: "var(--color-success)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <CheckCircle size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "15px", color: "var(--color-text)" }}>
              {isMM
                ? "ဆိုင်ဖွင့်ခွင့် အတည်ပြုပြီးပါပြီ (Verified Merchant Seller Status Active)"
                : "Verified Merchant Seller Status Active"}
            </div>
            <div style={{ fontSize: "12.5px", color: "var(--color-text-secondary)", marginTop: "2px" }}>
              <strong>{application.shop_name}</strong> — {isMM
                ? "Yoe Yar Zay တွင် အတည်ပြုပြီး ဆိုင်တစ်ဆိုင် ဖြစ်ပါသည်။"
                : "You are a verified merchant on Yoe Yar Zay."}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pending
  if (application?.status === "pending" && !state.success) {
    return (
      <div
        className="admin-card"
        style={{
          padding: "18px 20px",
          borderLeft: "4px solid #d97706",
          background: "var(--color-surface)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              background: "rgba(217, 119, 6, 0.1)",
              color: "#d97706",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "15px", color: "var(--color-text)" }}>
              {isMM ? "လျှောက်လွှာ စစ်ဆေးနေဆဲ (Application Under Review)" : "Application Under Review"}
            </div>
            <div style={{ fontSize: "12.5px", color: "var(--color-text-secondary)", marginTop: "2px" }}>
              <strong>{application.shop_name}</strong> — {isMM ? "အဒ်မင် စစ်ဆေးနေဆဲဖြစ်ပါသည်။" : "Admin review is currently in progress."}
            </div>
            {(application.nrc_document_url || application.license_document_url) && (
              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                {application.nrc_document_url && (
                  <a
                    href={application.nrc_document_url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: "11px", padding: "2px 8px", height: "24px", display: "inline-flex", alignItems: "center", gap: "3px" }}
                  >
                    🪪 {isMM ? "မှတ်ပုံတင် ဖိုင် ကြည့်မည်" : "View NRC File"} <ExternalLink size={10} />
                  </a>
                )}
                {application.license_document_url && (
                  <a
                    href={application.license_document_url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: "11px", padding: "2px 8px", height: "24px", display: "inline-flex", alignItems: "center", gap: "3px" }}
                  >
                    📜 {isMM ? "လိုင်စင် ဖိုင် ကြည့်မည်" : "View License File"} <ExternalLink size={10} />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Form (New Application or Resubmission)
  return (
    <div className="admin-card" style={{ padding: "18px 20px" }}>
      <div
        style={{
          paddingBottom: "12px",
          marginBottom: "16px",
          borderBottom: "1px solid var(--color-border)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <div
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "6px",
            background: "var(--color-primary-ghost)",
            color: "var(--color-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Store size={16} />
        </div>
        <div>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "var(--color-text)", margin: 0 }}>
            {isMM ? "အရောင်းဆိုင် ဖွင့်ရန် လျှောက်ထားပါ" : "Register as a Verified Merchant Seller"}
          </h2>
          <p style={{ fontSize: "12px", color: "var(--color-text-secondary)", margin: 0 }}>
            {isMM
              ? "Yoe Yar Zay တွင် သင့်ဆိုင်ခွဲ ဖွင့်လှစ်ပြီး အထောက်အထားများ ပူးတွဲ တင်သွင်းပါ။"
              : "Open your brand storefront on Yoe Yar Zay and attach identity verification documents."}
          </p>
        </div>
      </div>

      {/* Rejected notice */}
      {application?.status === "rejected" && (
        <div
          style={{
            padding: "10px 14px",
            background: "rgba(197, 48, 48, 0.12)",
            border: "1px solid var(--color-danger)",
            borderRadius: "var(--radius-md)",
            marginBottom: "14px",
            display: "flex",
            gap: "10px",
            alignItems: "flex-start",
          }}
        >
          <XCircle size={18} style={{ color: "var(--color-danger)", flexShrink: 0, marginTop: "1px" }} />
          <div>
            <div style={{ fontWeight: 700, color: "var(--color-danger)", fontSize: "13px" }}>
              {isMM ? "လျှောက်လွှာ ပယ်ချခံရသည် (Application Rejected)" : "Application Rejected"}
            </div>
            {application.rejection_reason && (
              <div style={{ fontSize: "12px", color: "var(--color-danger)", marginTop: "2px" }}>
                {isMM ? `အကြောင်းရင်း: ${application.rejection_reason}` : `Reason: ${application.rejection_reason}`}
              </div>
            )}
            <div style={{ fontSize: "11.5px", color: "var(--color-text-secondary)", marginTop: "4px" }}>
              {isMM ? "အချက်အလက် ပြင်ဆင်ပြီး ထပ်မံ လျှောက်ထားနိုင်ပါသည်။" : "Please update your details below and resubmit for verification."}
            </div>
          </div>
        </div>
      )}

      {/* Success notice */}
      {state.success && (
        <div
          style={{
            padding: "10px 14px",
            background: "rgba(45, 125, 70, 0.12)",
            border: "1px solid var(--color-success)",
            borderRadius: "var(--radius-md)",
            marginBottom: "14px",
            color: "var(--color-success)",
            fontWeight: 600,
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <CheckCircle size={16} /> {isMM ? "လျှောက်လွှာ တင်ပြီးပါပြီ။ Admin မှ စစ်ဆေးပါမည်။" : "Application submitted successfully! Admin will review your merchant credentials."}
        </div>
      )}

      {/* Error */}
      {state.error && (
        <div
          style={{
            padding: "10px 14px",
            background: "rgba(197, 48, 48, 0.12)",
            border: "1px solid var(--color-danger)",
            color: "var(--color-danger)",
            borderRadius: "var(--radius-md)",
            marginBottom: "14px",
            fontSize: "12.5px",
          }}
        >
          {state.error}
        </div>
      )}

      {!state.success && (
        <form action={formAction} encType="multipart/form-data">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "14px",
            }}
          >
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="shop_name" style={{ fontSize: "12px", fontWeight: 600 }}>
                {isMM ? "ဆိုင်အမည်" : "Brand / Shop Name"} *
              </label>
              <div style={{ position: "relative" }}>
                <Building size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)" }} />
                <input
                  className="form-input"
                  id="shop_name"
                  name="shop_name"
                  defaultValue={application?.shop_name ?? ""}
                  required
                  placeholder={isMM ? "ဥပမာ - Mandalay Craft Shop" : "e.g. Mandalay Craft Shop"}
                  style={{ paddingLeft: "32px", fontSize: "13px", height: "36px" }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="owner_name" style={{ fontSize: "12px", fontWeight: 600 }}>
                {isMM ? "ပိုင်ရှင်အမည်" : "Owner Full Name"} *
              </label>
              <div style={{ position: "relative" }}>
                <User size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)" }} />
                <input
                  className="form-input"
                  id="owner_name"
                  name="owner_name"
                  required
                  placeholder={isMM ? "ဥပမာ - ဦးမောင်မောင်" : "e.g. U Mg Mg"}
                  style={{ paddingLeft: "32px", fontSize: "13px", height: "36px" }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="phone" style={{ fontSize: "12px", fontWeight: 600 }}>
                {isMM ? "ဖုန်းနံပါတ်" : "Contact Phone"} *
              </label>
              <div style={{ position: "relative" }}>
                <Phone size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)" }} />
                <input
                  className="form-input"
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="09-xxxxxxxxx"
                  style={{ paddingLeft: "32px", fontSize: "13px", height: "36px" }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="nrc" style={{ fontSize: "12px", fontWeight: 600 }}>
                {isMM ? "မှတ်ပုံတင် အမှတ်" : "NRC Card Number"} *
              </label>
              <div style={{ position: "relative" }}>
                <FileText size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)" }} />
                <input
                  className="form-input"
                  id="nrc"
                  name="nrc"
                  required
                  placeholder="12/OKHANA(N)xxxxxx"
                  style={{ paddingLeft: "32px", fontSize: "13px", height: "36px" }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="business_license" style={{ fontSize: "12px", fontWeight: 600 }}>
                {isMM ? "လုပ်ငန်းလိုင်စင် အမှတ်" : "Business License No."} *
              </label>
              <div style={{ position: "relative" }}>
                <FileText size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)" }} />
                <input
                  className="form-input"
                  id="business_license"
                  name="business_license"
                  required
                  placeholder="License REG-xxxx"
                  style={{ paddingLeft: "32px", fontSize: "13px", height: "36px" }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0, gridColumn: "1 / -1" }}>
              <label className="form-label" htmlFor="address" style={{ fontSize: "12px", fontWeight: 600 }}>
                {isMM ? "ဆိုင်နေရာလိပ်စာ" : "Business Address"} *
              </label>
              <div style={{ position: "relative" }}>
                <MapPin size={14} style={{ position: "absolute", left: "10px", top: "12px", color: "var(--color-text-tertiary)" }} />
                <textarea
                  className="form-input"
                  id="address"
                  name="address"
                  required
                  placeholder={isMM ? "လမ်း၊ မြို့နယ်၊ မြို့" : "Street, Township, City, State/Region"}
                  style={{ paddingLeft: "32px", fontSize: "13px", minHeight: "64px" }}
                />
              </div>
            </div>

            {/* Drag & Drop Document Uploaders */}
            <DragDropUploader
              label={isMM ? "မှတ်ပုံတင် အထောက်အထား ဖိုင် (NRC Document Photo / PDF Upload)" : "NRC Document Photo / PDF Upload"}
              name="nrc_document"
              required={false}
            />

            <DragDropUploader
              label={isMM ? "လုပ်ငန်းလိုင်စင် အထောက်အထား ဖိုင် (Business License Photo / PDF Upload)" : "Business License Photo / PDF Upload"}
              name="license_document"
              required={false}
            />
          </div>

          <div
            style={{
              marginTop: "18px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isPending}
              style={{ fontSize: "12px", height: "36px", padding: "0 20px", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Sparkles size={14} />
              {isPending
                ? isMM ? "တင်နေသည်..." : "Uploading Documents..."
                : isMM ? "လျှောက်ထားမည်" : "Submit Merchant Application"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
