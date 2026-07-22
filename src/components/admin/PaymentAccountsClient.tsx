"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import {
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Copy,
  Check,
  Search,
  LayoutGrid,
  List,
  Smartphone,
  Banknote,
  Smile,
  Upload,
  Image as ImageIcon,
  QrCode,
  Sparkles,
} from "lucide-react";
import {
  type PaymentAccount,
  createPaymentAccount,
  updatePaymentAccount,
  togglePaymentAccountActive,
  deletePaymentAccount,
} from "@/actions/admin/action-payment-accounts";
import Image from "next/image";

const LOCAL_STORAGE_KEY = "yoeyarzay_payment_accounts_v1";

const PRESET_ICONS = [
  { icon: "📱", label: "Mobile Wallet" },
  { icon: "🟡", label: "Wave Yellow" },
  { icon: "💳", label: "Card" },
  { icon: "💵", label: "Cash" },
  { icon: "🏦", label: "Bank" },
  { icon: "🏛️", label: "Institution" },
  { icon: "⚡", label: "Instant" },
  { icon: "🔒", label: "Secure" },
  { icon: "🌐", label: "Global" },
  { icon: "⭐", label: "Premium" },
  { icon: "🪙", label: "Crypto" },
  { icon: "🏷️", label: "Custom" },
];

const PROVIDER_OPTIONS = [
  { label: "KBZPay (KPay)", value: "KBZPay", defaultIcon: "📱", bg: "#00478f", text: "#ffffff" },
  { label: "WavePay (Wave Money)", value: "WavePay", defaultIcon: "🟡", bg: "#ffdd00", text: "#003b73" },
  { label: "Visa Card", value: "Visa", defaultIcon: "💳", bg: "#1434cb", text: "#ffffff" },
  { label: "Mastercard", value: "Mastercard", defaultIcon: "💳", bg: "#eb001b", text: "#ffffff" },
  { label: "JCB Card", value: "JCB", defaultIcon: "💳", bg: "#00377b", text: "#ffffff" },
  { label: "Cash on Delivery (COD)", value: "COD", defaultIcon: "💵", bg: "#10b981", text: "#ffffff" },
  { label: "CBPay", value: "CBPay", defaultIcon: "🔴", bg: "#d97706", text: "#ffffff" },
  { label: "AYAPay", value: "AYAPay", defaultIcon: "🔴", bg: "#dc2626", text: "#ffffff" },
  { label: "KBZ Bank", value: "KBZ Bank", defaultIcon: "🏦", bg: "#1e3a8a", text: "#ffffff" },
  { label: "AYA Bank", value: "AYA Bank", defaultIcon: "🏦", bg: "#991b1b", text: "#ffffff" },
  { label: "Yoma Bank", value: "Yoma Bank", defaultIcon: "🏦", bg: "#047857", text: "#ffffff" },
  { label: "CB Bank", value: "CB Bank", defaultIcon: "🏦", bg: "#d97706", text: "#ffffff" },
  { label: "uabpay", value: "uabpay", defaultIcon: "📱", bg: "#9333ea", text: "#ffffff" },
  { label: "MytelPay", value: "MytelPay", defaultIcon: "📱", bg: "#ea580c", text: "#ffffff" },
  { label: "OnePay", value: "OnePay", defaultIcon: "📱", bg: "#0284c7", text: "#ffffff" },
  { label: "TrueMoney", value: "TrueMoney", defaultIcon: "📱", bg: "#eab308", text: "#000000" },
  { label: "PayPal", value: "PayPal", defaultIcon: "🌐", bg: "#003087", text: "#ffffff" },
  { label: "Crypto / USDT / Binance", value: "Crypto", defaultIcon: "🪙", bg: "#f59e0b", text: "#000000" },
  { label: "Other / Custom Provider", value: "Other", defaultIcon: "💳", bg: "#6b7280", text: "#ffffff" },
];

const DEFAULT_FOOTER_PAYMENT_ACCOUNTS: PaymentAccount[] = [
  {
    id: "default-kbzpay",
    provider: "KBZPay",
    icon: "📱",
    account_name: "Yoe Yar Zay Main Account",
    account_number: "09790123456",
    instructions: "KBZPay မိုဘိုင်းလ်အကောင့်သို့ ငွေလွှဲပြီးလျှင် ဖြတ်ပိုင်း ပြသပေးပါ။",
    is_active: true,
    sort_order: 1,
  },
  {
    id: "default-wavepay",
    provider: "WavePay",
    icon: "🟡",
    account_name: "Yoe Yar Zay Main Account",
    account_number: "09790123456",
    instructions: "WavePay မိုဘိုင်းလ်အကောင့်သို့ ငွေလွှဲပေးနိုင်ပါသည်။",
    is_active: true,
    sort_order: 2,
  },
  {
    id: "default-visa",
    provider: "Visa",
    icon: "💳",
    account_name: "Yoe Yar Zay Merchant Account",
    account_number: "4123-4567-8901-2345",
    instructions: "Visa Credit/Debit Card Direct Gateway Payment",
    is_active: true,
    sort_order: 3,
  },
  {
    id: "default-mastercard",
    provider: "Mastercard",
    icon: "💳",
    account_name: "Yoe Yar Zay Merchant Account",
    account_number: "5412-3456-7890-1234",
    instructions: "Mastercard Credit/Debit Card Gateway Payment",
    is_active: true,
    sort_order: 4,
  },
  {
    id: "default-jcb",
    provider: "JCB",
    icon: "💳",
    account_name: "Yoe Yar Zay Merchant Account",
    account_number: "3568-1234-5678-9012",
    instructions: "JCB International Card Gateway Payment",
    is_active: true,
    sort_order: 5,
  },
  {
    id: "default-cod",
    provider: "COD",
    icon: "💵",
    account_name: "Cash on Delivery",
    account_number: "N/A (Hand Delivery)",
    instructions: "ပစ္စည်းရောက်မှ အိမ်အရောက် ငွေချေစနစ် ဖြစ်ပါသည်။",
    is_active: true,
    sort_order: 6,
  },
];

export function PaymentAccountsClient({
  initialAccounts = [],
}: {
  initialAccounts: PaymentAccount[];
}) {
  const effectiveInitialAccounts =
    initialAccounts.length > 0 ? initialAccounts : DEFAULT_FOOTER_PAYMENT_ACCOUNTS;

  const [accounts, setAccounts] = useState<PaymentAccount[]>(effectiveInitialAccounts);
  const [isPending, startTransition] = useTransition();

  // Load from localStorage if DB initial is empty
  useEffect(() => {
    if (initialAccounts.length === 0 && typeof window !== "undefined") {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAccounts(parsed);
          }
        } catch (e) {
          console.error("Failed to load local payment accounts:", e);
        }
      }
    }
  }, [initialAccounts]);

  const updateAndPersist = (newAccounts: PaymentAccount[]) => {
    setAccounts(newAccounts);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newAccounts));
      } catch (e) {
        console.error("Failed to save payment accounts to localStorage:", e);
      }
    }
  };

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Copy notification & Toast state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<PaymentAccount | null>(null);

  const [provider, setProvider] = useState("KBZPay");
  const [customProvider, setCustomProvider] = useState("");
  const [iconMode, setIconMode] = useState<"preset" | "upload">("preset");
  const [selectedIcon, setSelectedIcon] = useState("📱");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [instructions, setInstructions] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(1);

  const [formError, setFormError] = useState("");
  const [copiedSql, setCopiedSql] = useState(false);

  const iconFileInputRef = useRef<HTMLInputElement>(null);
  const qrFileInputRef = useRef<HTMLInputElement>(null);

  // Filtered accounts list
  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch =
      acc.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.account_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.account_number.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? acc.is_active
        : !acc.is_active;

    return matchesSearch && matchesStatus;
  });

  const activeCount = accounts.filter((a) => a.is_active).length;
  const walletCount = accounts.filter((a) =>
    ["KBZPay", "WavePay", "CBPay", "AYAPay", "uabpay", "MytelPay", "OnePay", "TrueMoney"].includes(a.provider)
  ).length;
  const cardCount = accounts.filter((a) => ["Visa", "Mastercard", "JCB"].includes(a.provider)).length;

  const openAddModal = () => {
    setEditingAccount(null);
    setProvider("KBZPay");
    setCustomProvider("");
    setIconMode("preset");
    setSelectedIcon("📱");
    setAccountName("");
    setAccountNumber("");
    setQrCodeUrl("");
    setInstructions("");
    setIsActive(true);
    setSortOrder(accounts.length + 1);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (acc: PaymentAccount) => {
    setEditingAccount(acc);
    const isStandard = PROVIDER_OPTIONS.some((p) => p.value === acc.provider);
    if (isStandard) {
      setProvider(acc.provider);
      setCustomProvider("");
    } else {
      setProvider("Other");
      setCustomProvider(acc.provider);
    }
    const currentIcon = acc.icon || "💳";
    setSelectedIcon(currentIcon);
    if (
      currentIcon.startsWith("data:image/") ||
      currentIcon.startsWith("http://") ||
      currentIcon.startsWith("https://")
    ) {
      setIconMode("upload");
    } else {
      setIconMode("preset");
    }
    setAccountName(acc.account_name);
    setAccountNumber(acc.account_number);
    setQrCodeUrl(acc.qr_code_url || "");
    setInstructions(acc.instructions || "");
    setIsActive(acc.is_active);
    setSortOrder(acc.sort_order || 0);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleProviderChange = (newProvider: string) => {
    setProvider(newProvider);
    const found = PROVIDER_OPTIONS.find((p) => p.value === newProvider);
    if (found && iconMode === "preset") {
      setSelectedIcon(found.defaultIcon);
    }
  };

  const handleIconFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Please upload a valid image file (PNG, JPG, SVG, WebP).");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setFormError("Image file size should be less than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setSelectedIcon(evt.target.result as string);
        setFormError("");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleQrFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Please upload a valid QR Code image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setQrCodeUrl(evt.target.result as string);
        setFormError("");
      }
    };
    reader.readAsDataURL(file);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAccount(null);
  };

  const copyNumber = (id: string, num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const finalProvider = provider === "Other" ? customProvider : provider;

    if (!finalProvider.trim() || !accountName.trim() || !accountNumber.trim()) {
      setFormError("Provider, Account Name, and Account Number are required.");
      return;
    }

    const formData = new FormData();
    formData.append("provider", finalProvider);
    formData.append("icon", selectedIcon || "💳");
    formData.append("account_name", accountName);
    formData.append("account_number", accountNumber);
    formData.append("qr_code_url", qrCodeUrl);
    formData.append("instructions", instructions);
    formData.append("is_active", isActive ? "true" : "false");
    formData.append("sort_order", sortOrder.toString());

    // Construct updated account object
    const updatedAccount: PaymentAccount = {
      id: editingAccount ? editingAccount.id : `acc-${Date.now()}`,
      provider: finalProvider,
      icon: selectedIcon || "💳",
      account_name: accountName,
      account_number: accountNumber,
      qr_code_url: qrCodeUrl,
      instructions: instructions,
      is_active: isActive,
      sort_order: sortOrder,
    };

    let updatedList: PaymentAccount[];
    if (editingAccount) {
      updatedList = accounts.map((a) => (a.id === editingAccount.id ? updatedAccount : a));
      showToast(`Updated "${finalProvider}" payment account successfully!`);
    } else {
      updatedList = [updatedAccount, ...accounts];
      showToast(`Created new "${finalProvider}" payment account successfully!`);
    }

    // Persist immediately in local storage & memory state
    updateAndPersist(updatedList);
    closeModal();

    // Attempt DB sync in background
    startTransition(async () => {
      if (editingAccount && !editingAccount.id.startsWith("default-") && !editingAccount.id.startsWith("acc-")) {
        await updatePaymentAccount(editingAccount.id, formData);
      } else {
        await createPaymentAccount(formData);
      }
    });
  };

  const handleToggleActive = (id: string, currentActive: boolean) => {
    const updatedList = accounts.map((acc) =>
      acc.id === id ? { ...acc, is_active: !currentActive } : acc
    );
    updateAndPersist(updatedList);
    showToast(`Status updated to ${!currentActive ? "Active" : "Inactive"}`);

    if (!id.startsWith("default-") && !id.startsWith("acc-")) {
      startTransition(async () => {
        await togglePaymentAccountActive(id, !currentActive);
      });
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete payment account "${name}"?`)) {
      const updatedList = accounts.filter((acc) => acc.id !== id);
      updateAndPersist(updatedList);
      showToast(`Deleted payment account "${name}"`);

      if (!id.startsWith("default-") && !id.startsWith("acc-")) {
        startTransition(async () => {
          await deletePaymentAccount(id);
        });
      }
    }
  };

  const migrationSql = `-- Run on Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.payment_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  icon TEXT DEFAULT '💳',
  account_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  qr_code_url TEXT,
  instructions TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.payment_accounts (provider, icon, account_name, account_number, instructions, is_active, sort_order)
VALUES 
  ('KBZPay', '📱', 'Yoe Yar Zay Shop', '09790123456', 'KBZPay မိုဘိုင်းလ်အကောင့်သို့ ငွေလွှဲပြီးလျှင် ဖြတ်ပိုင်း ပြသပေးပါ။', true, 1),
  ('WavePay', '🟡', 'Yoe Yar Zay Shop', '09790123456', 'WavePay မိုဘိုင်းလ်အကောင့်သို့ ငွေလွှဲပေးနိုင်ပါသည်။', true, 2),
  ('Visa', '💳', 'Yoe Yar Zay Merchant', '4123-4567-8901-2345', 'Visa Credit/Debit Card Direct Gateway Payment', true, 3),
  ('Mastercard', '💳', 'Yoe Yar Zay Merchant', '5412-3456-7890-1234', 'Mastercard Credit/Debit Card Gateway Payment', true, 4),
  ('JCB', '💳', 'Yoe Yar Zay Merchant', '3568-1234-5678-9012', 'JCB International Card Gateway Payment', true, 5),
  ('COD', '💵', 'Cash on Delivery', 'N/A (Hand Delivery)', 'ပစ္စည်းရောက်မှ အိမ်အရောက် ငွေချေစနစ် ဖြစ်ပါသည်။', true, 6)
ON CONFLICT DO NOTHING;

ALTER TABLE public.payment_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view active payment_accounts" ON public.payment_accounts FOR SELECT USING (true);
CREATE POLICY "Admins manage payment_accounts" ON public.payment_accounts FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());`;

  const copySql = () => {
    navigator.clipboard.writeText(migrationSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const getProviderBadgeStyle = (prov: string, customIcon?: string | null) => {
    const found = PROVIDER_OPTIONS.find((p) => p.value === prov);
    const displayIcon = customIcon || (found ? found.defaultIcon : "💳");
    if (found) {
      return { bg: found.bg, color: found.text, label: found.label, icon: displayIcon };
    }
    return { bg: "#6b7280", color: "#ffffff", label: prov, icon: displayIcon };
  };

  const renderBadgeIcon = (iconStr?: string | null) => {
    if (!iconStr) return <span>💳</span>;
    const isImageIcon =
      iconStr.startsWith("data:image/") ||
      iconStr.startsWith("http://") ||
      iconStr.startsWith("https://") ||
      iconStr.startsWith("/");

    if (isImageIcon) {
      return (
        <Image
          src={iconStr}
          alt="Icon"
          width={20}
          height={20}
          unoptimized
          style={{ objectFit: "contain", borderRadius: "3px", flexShrink: 0 }}
        />
      );
    }
    return <span style={{ fontSize: "14px" }}>{iconStr}</span>;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%", position: "relative" }}>
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            background: "#10b981",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "10px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontWeight: 700,
            fontSize: "13.5px",
            animation: "fadeIn 0.2s ease-in-out",
          }}
        >
          <Sparkles size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Banner & Quick Actions */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
          background: "linear-gradient(135deg, var(--color-surface) 0%, var(--color-bg-secondary) 100%)",
          padding: "24px 28px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          border: "1px solid var(--color-border-light)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: "var(--color-primary)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 16px rgba(37, 99, 235, 0.3)",
              flexShrink: 0,
            }}
          >
            <CreditCard size={26} />
          </div>
          <div>
            <h1
              style={{
                fontSize: "22px",
                fontWeight: 800,
                color: "var(--color-text)",
                margin: "0 0 4px 0",
                letterSpacing: "-0.3px",
              }}
            >
              Payment Accounts Management
            </h1>
            <p
              style={{
                fontSize: "13.5px",
                color: "var(--color-text-secondary)",
                margin: 0,
                fontWeight: 500,
              }}
            >
              Configure and manage manual payment accounts, custom icons & device uploads (KBZPay, WavePay, Card Gateways, COD) for buyer checkout.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "11px 22px",
            fontSize: "14px",
            fontWeight: 700,
            borderRadius: "10px",
            cursor: "pointer",
            background: "var(--color-primary)",
            color: "#ffffff",
            border: "none",
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(37, 99, 235, 0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.25)";
          }}
        >
          <Plus size={18} />
          <span>+ Add New Payment Account (အကောင့်သစ်ထည့်မည်)</span>
        </button>
      </div>

      {/* 2. Top Overview Statistics Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "16px",
        }}
      >
        <div
          style={{
            background: "var(--color-surface)",
            padding: "20px 22px",
            borderRadius: "14px",
            border: "1px solid var(--color-border-light)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: "12.5px", color: "var(--color-text-secondary)", fontWeight: 600 }}>
              Total Gateways
            </div>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--color-text)", marginTop: "4px" }}>
              {accounts.length}
            </div>
          </div>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "var(--color-primary-ghost)",
              color: "var(--color-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CreditCard size={22} />
          </div>
        </div>

        <div
          style={{
            background: "var(--color-surface)",
            padding: "20px 22px",
            borderRadius: "14px",
            border: "1px solid var(--color-border-light)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: "12.5px", color: "var(--color-text-secondary)", fontWeight: 600 }}>
              Active Methods
            </div>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "#10b981", marginTop: "4px" }}>
              {activeCount}
            </div>
          </div>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "rgba(16, 185, 129, 0.1)",
              color: "#10b981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CheckCircle2 size={22} />
          </div>
        </div>

        <div
          style={{
            background: "var(--color-surface)",
            padding: "20px 22px",
            borderRadius: "14px",
            border: "1px solid var(--color-border-light)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: "12.5px", color: "var(--color-text-secondary)", fontWeight: 600 }}>
              Wallets & Cards
            </div>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "#3b82f6", marginTop: "4px" }}>
              {walletCount + cardCount}
            </div>
          </div>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "rgba(59, 130, 246, 0.1)",
              color: "#3b82f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Smartphone size={22} />
          </div>
        </div>

        <div
          style={{
            background: "var(--color-surface)",
            padding: "20px 22px",
            borderRadius: "14px",
            border: "1px solid var(--color-border-light)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: "12.5px", color: "var(--color-text-secondary)", fontWeight: 600 }}>
              Cash on Delivery
            </div>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "#f59e0b", marginTop: "4px" }}>
              1 Method
            </div>
          </div>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "rgba(245, 158, 11, 0.1)",
              color: "#f59e0b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Banknote size={22} />
          </div>
        </div>
      </div>

      {/* SQL Migration Alert Banner (if DB initial state) */}
      {initialAccounts.length === 0 && (
        <div
          style={{
            background: "rgba(245, 158, 11, 0.08)",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            borderRadius: "12px",
            padding: "16px 20px",
            color: "var(--color-text)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, color: "#d97706" }}>
              <AlertTriangle size={18} />
              <span>Supabase Database Migration Setup Required</span>
            </div>
            <button
              onClick={copySql}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                fontSize: "12px",
                background: "#d97706",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              {copiedSql ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedSql ? "Copied SQL Script" : "Copy SQL Script"}</span>
            </button>
          </div>
          <p style={{ fontSize: "12.5px", color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.5 }}>
            To save payment account updates permanently across devices to your Supabase database, copy and run the SQL migration script above in your Supabase SQL Editor.
          </p>
        </div>
      )}

      {/* 3. Toolbar (Search, Filter, View Mode Toggle) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px",
          background: "var(--color-surface)",
          padding: "14px 18px",
          borderRadius: "12px",
          border: "1px solid var(--color-border-light)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: "260px" }}>
          <div
            style={{
              position: "relative",
              flex: 1,
              maxWidth: "360px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "12px",
                color: "var(--color-text-tertiary)",
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search provider, name, account number..."
              style={{
                width: "100%",
                padding: "8px 12px 8px 36px",
                borderRadius: "8px",
                border: "1px solid var(--color-border)",
                background: "var(--color-bg-secondary)",
                color: "var(--color-text)",
                fontSize: "13px",
                outline: "none",
              }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid var(--color-border)",
              background: "var(--color-bg-secondary)",
              color: "var(--color-text)",
              fontSize: "13px",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>

        {/* View Mode Toggle Switch */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "var(--color-bg-secondary)", padding: "3px", borderRadius: "8px" }}>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "6px 12px",
              borderRadius: "6px",
              border: "none",
              background: viewMode === "grid" ? "var(--color-surface)" : "transparent",
              color: viewMode === "grid" ? "var(--color-primary)" : "var(--color-text-secondary)",
              fontWeight: viewMode === "grid" ? 700 : 500,
              fontSize: "12.5px",
              cursor: "pointer",
              boxShadow: viewMode === "grid" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            }}
          >
            <LayoutGrid size={15} />
            <span>Cards</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("table")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "6px 12px",
              borderRadius: "6px",
              border: "none",
              background: viewMode === "table" ? "var(--color-surface)" : "transparent",
              color: viewMode === "table" ? "var(--color-primary)" : "var(--color-text-secondary)",
              fontWeight: viewMode === "table" ? 700 : 500,
              fontSize: "12.5px",
              cursor: "pointer",
              boxShadow: viewMode === "table" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            }}
          >
            <List size={15} />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* 4. Payment Accounts Render */}
      {viewMode === "grid" ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredAccounts.length > 0 ? (
            filteredAccounts.map((acc) => {
              const badgeStyle = getProviderBadgeStyle(acc.provider, acc.icon);
              const isCopied = copiedId === acc.id;

              return (
                <div
                  key={acc.id}
                  style={{
                    background: "var(--color-surface)",
                    borderRadius: "14px",
                    border: "1px solid var(--color-border-light)",
                    padding: "20px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.07)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.03)";
                  }}
                >
                  <div>
                    {/* Top Row: Provider Badge + Active Status Toggle */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "16px",
                      }}
                    >
                      <div
                        style={{
                          background: badgeStyle.bg,
                          color: badgeStyle.color,
                          padding: "5px 12px",
                          borderRadius: "8px",
                          fontSize: "12.5px",
                          fontWeight: 800,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                        }}
                      >
                        {renderBadgeIcon(badgeStyle.icon)}
                        <span>{badgeStyle.label}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleActive(acc.id, acc.is_active)}
                        disabled={isPending}
                        style={{
                          background: acc.is_active
                            ? "rgba(16, 185, 129, 0.12)"
                            : "rgba(239, 68, 68, 0.12)",
                          color: acc.is_active ? "#10b981" : "#ef4444",
                          border: "none",
                          padding: "4px 10px",
                          borderRadius: "20px",
                          fontSize: "11.5px",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {acc.is_active ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                        <span>{acc.is_active ? "Active" : "Inactive"}</span>
                      </button>
                    </div>

                    {/* Account Name */}
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: 700,
                        color: "var(--color-text)",
                        marginBottom: "6px",
                      }}
                    >
                      {acc.account_name}
                    </div>

                    {/* Account Number with Copy Button */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "var(--color-bg-secondary)",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        marginBottom: "14px",
                        border: "1px solid var(--color-border-light)",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "monospace",
                          fontSize: "14px",
                          fontWeight: 800,
                          color: "var(--color-text)",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {acc.account_number}
                      </div>
                      <button
                        type="button"
                        onClick={() => copyNumber(acc.id, acc.account_number)}
                        style={{
                          background: isCopied ? "#10b981" : "var(--color-surface)",
                          color: isCopied ? "#ffffff" : "var(--color-text-secondary)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "6px",
                          padding: "4px 8px",
                          fontSize: "11px",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {isCopied ? <Check size={12} /> : <Copy size={12} />}
                        <span>{isCopied ? "Copied!" : "Copy"}</span>
                      </button>
                    </div>

                    {/* QR Code Preview if uploaded */}
                    {acc.qr_code_url && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          background: "var(--color-bg-secondary)",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          marginBottom: "12px",
                          border: "1px solid var(--color-border-light)",
                        }}
                      >
                        <Image
                          src={acc.qr_code_url}
                          alt="QR Code"
                          width={36}
                          height={36}
                          unoptimized
                          style={{ objectFit: "contain", borderRadius: "4px", background: "#ffffff", padding: "2px" }}
                        />
                        <div style={{ fontSize: "11.5px", color: "var(--color-text-secondary)", fontWeight: 600 }}>
                          QR Code Available
                        </div>
                      </div>
                    )}

                    {/* Instructions */}
                    {acc.instructions && (
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--color-text-secondary)",
                          lineHeight: 1.5,
                          marginBottom: "16px",
                          background: "rgba(0,0,0,0.02)",
                          padding: "8px 10px",
                          borderRadius: "6px",
                          borderLeft: "3px solid var(--color-primary)",
                        }}
                      >
                        {acc.instructions}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Row: Actions */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingTop: "14px",
                      borderTop: "1px solid var(--color-border-light)",
                      marginTop: "12px",
                    }}
                  >
                    <div style={{ fontSize: "11.5px", color: "var(--color-text-tertiary)", fontWeight: 600 }}>
                      Order #{acc.sort_order || 0}
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={() => openEditModal(acc)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "5px 12px",
                          fontSize: "12px",
                          fontWeight: 600,
                          borderRadius: "6px",
                          border: "1px solid var(--color-border)",
                          background: "var(--color-surface)",
                          color: "var(--color-text)",
                          cursor: "pointer",
                        }}
                      >
                        <Edit2 size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(acc.id, acc.account_name)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "5px 10px",
                          fontSize: "12px",
                          fontWeight: 600,
                          borderRadius: "6px",
                          border: "1px solid rgba(239,68,68,0.3)",
                          background: "rgba(239,68,68,0.06)",
                          color: "#ef4444",
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div
              style={{
                gridColumn: "1 / -1",
                padding: "48px",
                textAlign: "center",
                background: "var(--color-surface)",
                borderRadius: "14px",
                color: "var(--color-text-tertiary)",
              }}
            >
              No payment accounts matching search &quot;{searchQuery}&quot;.
            </div>
          )}
        </div>
      ) : (
        /* Table View */
        <div
          style={{
            background: "var(--color-surface)",
            borderRadius: "14px",
            overflow: "hidden",
            border: "1px solid var(--color-border-light)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
          }}
        >
          <div className="table-responsive">
            <table className="admin-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ width: "60px", padding: "14px 18px" }}>Order</th>
                  <th style={{ padding: "14px 18px" }}>Provider / Gateway</th>
                  <th style={{ padding: "14px 18px" }}>Account Name</th>
                  <th style={{ padding: "14px 18px" }}>Account Number</th>
                  <th style={{ padding: "14px 18px" }}>Status</th>
                  <th style={{ textAlign: "right", padding: "14px 18px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.length > 0 ? (
                  filteredAccounts.map((acc) => {
                    const badgeStyle = getProviderBadgeStyle(acc.provider, acc.icon);
                    const isCopied = copiedId === acc.id;

                    return (
                      <tr key={acc.id} className="table-row-hover">
                        <td style={{ padding: "14px 18px", fontWeight: 700, color: "var(--color-text-tertiary)" }}>
                          #{acc.sort_order || 0}
                        </td>
                        <td style={{ padding: "14px 18px" }}>
                          <span
                            style={{
                              background: badgeStyle.bg,
                              color: badgeStyle.color,
                              padding: "4px 10px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: 800,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            {renderBadgeIcon(badgeStyle.icon)}
                            <span>{badgeStyle.label}</span>
                          </span>
                        </td>
                        <td style={{ padding: "14px 18px", fontWeight: 700, color: "var(--color-text)" }}>
                          {acc.account_name}
                        </td>
                        <td style={{ padding: "14px 18px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontFamily: "monospace", fontSize: "14px", fontWeight: 800 }}>
                              {acc.account_number}
                            </span>
                            <button
                              type="button"
                              onClick={() => copyNumber(acc.id, acc.account_number)}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: isCopied ? "#10b981" : "var(--color-text-tertiary)",
                              }}
                              title="Copy account number"
                            >
                              {isCopied ? <Check size={14} /> : <Copy size={14} />}
                            </button>
                          </div>
                        </td>
                        <td style={{ padding: "14px 18px" }}>
                          <button
                            type="button"
                            onClick={() => handleToggleActive(acc.id, acc.is_active)}
                            disabled={isPending}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              fontSize: "12px",
                              fontWeight: 700,
                              padding: "3px 10px",
                              borderRadius: "14px",
                              color: acc.is_active ? "#10b981" : "#ef4444",
                              backgroundColor: acc.is_active
                                ? "rgba(16, 185, 129, 0.12)"
                                : "rgba(239, 68, 68, 0.12)",
                            }}
                          >
                            {acc.is_active ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                            <span>{acc.is_active ? "Active" : "Inactive"}</span>
                          </button>
                        </td>
                        <td style={{ textAlign: "right", padding: "14px 18px" }}>
                          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                            <button
                              type="button"
                              onClick={() => openEditModal(acc)}
                              style={{
                                padding: "5px 12px",
                                borderRadius: "6px",
                                border: "1px solid var(--color-border)",
                                background: "var(--color-surface)",
                                fontSize: "12px",
                                fontWeight: 600,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <Edit2 size={13} />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(acc.id, acc.account_name)}
                              style={{
                                padding: "5px 10px",
                                borderRadius: "6px",
                                border: "1px solid rgba(239,68,68,0.3)",
                                background: "rgba(239,68,68,0.06)",
                                color: "#ef4444",
                                fontSize: "12px",
                                fontWeight: 600,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "var(--color-text-tertiary)" }}>
                      No payment accounts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Add / Edit Modal Dialog with Device File Uploader */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
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
              padding: "32px",
              width: "100%",
              maxWidth: "540px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              border: "1px solid var(--color-border)",
            }}
          >
            <h2 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 20px 0", color: "var(--color-text)" }}>
              {editingAccount ? "Edit Payment Account" : "Add New Payment Account (အကောင့်သစ်ထည့်မည်)"}
            </h2>

            {formError && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "#ef4444",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  marginBottom: "18px",
                  fontWeight: 500,
                  lineHeight: 1.5,
                }}
              >
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label className="form-label" style={{ fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>
                  Payment Provider / Gateway * (ငွေပေးချေမှုစနစ် ရွေးချယ်ရန်)
                </label>
                <select
                  className="form-input"
                  value={provider}
                  onChange={(e) => handleProviderChange(e.target.value)}
                  style={{ width: "100%", height: "42px", borderRadius: "8px" }}
                >
                  {PROVIDER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.defaultIcon} {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {provider === "Other" && (
                <div>
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>
                    Custom Provider Name * (စိတ်ကြိုက် စနစ်အမည် ရိုက်ထည့်ပါ)
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={customProvider}
                    onChange={(e) => setCustomProvider(e.target.value)}
                    placeholder="e.g. AGD Pay, MytelPay, Citizens Pay..."
                    style={{ width: "100%", height: "42px", borderRadius: "8px" }}
                  />
                </div>
              )}

              {/* Icon Selection & Device File Upload Section */}
              <div>
                <label
                  className="form-label"
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    marginBottom: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Smile size={16} style={{ color: "var(--color-primary)" }} />
                  <span>Choose Payment Icon (Icon အိုင်ကွန် ရွေးချယ်ရန်)</span>
                </label>

                {/* Mode Selector Tabs (Preset vs Upload) */}
                <div
                  style={{
                    display: "flex",
                    gap: "4px",
                    background: "var(--color-bg-secondary)",
                    padding: "3px",
                    borderRadius: "8px",
                    marginBottom: "12px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setIconMode("preset")}
                    style={{
                      flex: 1,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: "none",
                      background: iconMode === "preset" ? "var(--color-surface)" : "transparent",
                      color: iconMode === "preset" ? "var(--color-primary)" : "var(--color-text-secondary)",
                      fontWeight: iconMode === "preset" ? 700 : 500,
                      fontSize: "12.5px",
                      cursor: "pointer",
                    }}
                  >
                    <Smile size={14} />
                    <span>Emoji Presets</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIconMode("upload")}
                    style={{
                      flex: 1,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: "none",
                      background: iconMode === "upload" ? "var(--color-surface)" : "transparent",
                      color: iconMode === "upload" ? "var(--color-primary)" : "var(--color-text-secondary)",
                      fontWeight: iconMode === "upload" ? 700 : 500,
                      fontSize: "12.5px",
                      cursor: "pointer",
                    }}
                  >
                    <Upload size={14} />
                    <span>Upload Image File</span>
                  </button>
                </div>

                {iconMode === "preset" ? (
                  <>
                    {/* Preset Icon Grid */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(6, 1fr)",
                        gap: "8px",
                        marginBottom: "10px",
                      }}
                    >
                      {PRESET_ICONS.map((p) => (
                        <button
                          key={p.icon}
                          type="button"
                          onClick={() => setSelectedIcon(p.icon)}
                          style={{
                            height: "40px",
                            fontSize: "18px",
                            borderRadius: "8px",
                            border:
                              selectedIcon === p.icon
                                ? "2px solid var(--color-primary)"
                                : "1px solid var(--color-border)",
                            background:
                              selectedIcon === p.icon
                                ? "var(--color-primary-ghost)"
                                : "var(--color-bg-secondary)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.15s ease",
                          }}
                          title={p.label}
                        >
                          {p.icon}
                        </button>
                      ))}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <input
                        type="text"
                        className="form-input"
                        value={selectedIcon}
                        onChange={(e) => setSelectedIcon(e.target.value)}
                        placeholder="Or type custom emoji / icon..."
                        style={{ flex: 1, height: "38px", borderRadius: "8px", fontSize: "14px" }}
                      />
                      <div
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "8px",
                          background: "var(--color-bg-secondary)",
                          border: "1px solid var(--color-border)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "20px",
                          flexShrink: 0,
                        }}
                      >
                        {renderBadgeIcon(selectedIcon)}
                      </div>
                    </div>
                  </>
                ) : (
                  /* Upload from Device File Input */
                  <div
                    style={{
                      border: "2px dashed var(--color-border)",
                      borderRadius: "10px",
                      padding: "20px",
                      textAlign: "center",
                      background: "var(--color-bg-secondary)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <input
                      ref={iconFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleIconFileUpload}
                      style={{ display: "none" }}
                    />

                    {selectedIcon &&
                    (selectedIcon.startsWith("data:image/") ||
                      selectedIcon.startsWith("http://") ||
                      selectedIcon.startsWith("https://")) ? (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                        <Image
                          src={selectedIcon}
                          alt="Icon Preview"
                          width={48}
                          height={48}
                          unoptimized
                          style={{
                            objectFit: "contain",
                            borderRadius: "8px",
                            border: "1px solid var(--color-border)",
                            background: "#ffffff",
                            padding: "4px",
                          }}
                        />
                        <span style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>
                          Device Icon Uploaded!
                        </span>
                      </div>
                    ) : (
                      <div style={{ color: "var(--color-text-tertiary)" }}>
                        <ImageIcon size={32} />
                        <div style={{ fontSize: "13px", fontWeight: 600, marginTop: "4px" }}>
                          Select an Icon image from device
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => iconFileInputRef.current?.click()}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 16px",
                        fontSize: "12.5px",
                        fontWeight: 700,
                        borderRadius: "6px",
                        border: "1px solid var(--color-primary)",
                        background: "var(--color-primary)",
                        color: "#ffffff",
                        cursor: "pointer",
                      }}
                    >
                      <Upload size={14} />
                      <span>{selectedIcon ? "Change Device Icon File" : "Choose File from Device"}</span>
                    </button>

                    <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)" }}>
                      Supports PNG, JPG, WebP, SVG (Max 2MB)
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="form-label" style={{ fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>
                  Account Owner Name * (အကောင့်ပိုင်ရှင်အမည်)
                </label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="e.g. U Kyaw Kyaw / Yoe Yar Zay Shop"
                  style={{ width: "100%", height: "42px", borderRadius: "8px" }}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>
                  Account / Phone / Card Number * (အကောင့်နံပါတ် / ဖုန်းနံပါတ်)
                </label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="e.g. 09790123456 or 4123-4567-8901-2345"
                  style={{ width: "100%", height: "42px", borderRadius: "8px", fontFamily: "monospace" }}
                />
              </div>

              {/* QR Code Upload Section */}
              <div>
                <label className="form-label" style={{ fontSize: "13px", fontWeight: 700, marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <QrCode size={16} style={{ color: "var(--color-primary)" }} />
                  <span>QR Code Image (QR Code ရုပ်ပုံ တင်ယူရန်)</span>
                </label>

                <input
                  ref={qrFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleQrFileUpload}
                  style={{ display: "none" }}
                />

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input
                    type="url"
                    className="form-input"
                    value={qrCodeUrl}
                    onChange={(e) => setQrCodeUrl(e.target.value)}
                    placeholder="https://example.com/qr-code.png or upload image..."
                    style={{ flex: 1, height: "40px", borderRadius: "8px" }}
                  />

                  <button
                    type="button"
                    onClick={() => qrFileInputRef.current?.click()}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 14px",
                      fontSize: "12px",
                      fontWeight: 700,
                      borderRadius: "8px",
                      border: "1px solid var(--color-border)",
                      background: "var(--color-bg-secondary)",
                      color: "var(--color-text)",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Upload size={14} />
                    <span>Upload QR Image</span>
                  </button>
                </div>

                {qrCodeUrl && (
                  <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Image
                      src={qrCodeUrl}
                      alt="QR Preview"
                      width={32}
                      height={32}
                      unoptimized
                      style={{ objectFit: "contain", borderRadius: "4px", background: "#ffffff", padding: "2px" }}
                    />
                    <span style={{ fontSize: "11.5px", color: "#10b981", fontWeight: 600 }}>
                      QR Code Ready!
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="form-label" style={{ fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>
                  Payment Notes / Guidelines (ညွှန်ကြားချက်)
                </label>
                <textarea
                  className="form-input"
                  rows={3}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. KBZPay မိုဘိုင်းလ်အကောင့်သို့ ငွေလွှဲပြီးပါက ဖြတ်ပိုင်း ပြသပေးပါ..."
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px" }}
                />
              </div>

              <div style={{ display: "flex", gap: "16px", alignItems: "center", background: "var(--color-bg-secondary)", padding: "12px 14px", borderRadius: "8px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <span>Active Status (ဝယ်ယူသူများအား ပြသမည်)</span>
                </label>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto" }}>
                  <label style={{ fontSize: "13px", fontWeight: 700 }}>Sort Order:</label>
                  <input
                    type="number"
                    min={0}
                    value={sortOrder}
                    onChange={(e) => setSortOrder(parseInt(e.target.value || "0", 10))}
                    style={{ width: "64px", height: "36px", padding: "4px 8px", borderRadius: "6px", border: "1px solid var(--color-border)", textAlign: "center" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn btn-secondary"
                  style={{ padding: "10px 20px", fontSize: "13.5px", borderRadius: "8px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn btn-primary"
                  style={{ padding: "10px 24px", fontSize: "13.5px", borderRadius: "8px", fontWeight: 700 }}
                >
                  {isPending ? "Saving..." : editingAccount ? "Update Account" : "Add Payment Account (အကောင့်ထည့်မည်)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
