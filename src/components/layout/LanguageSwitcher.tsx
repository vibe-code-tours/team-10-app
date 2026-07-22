"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import Image from "next/image";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "my" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={
        locale === "en"
          ? "Switch language to Myanmar"
          : "Switch language to English"
      }
      style={{
        background: "var(--color-surface)",
        color: "var(--color-text)",
        border: "1px solid var(--color-border)",
        borderRadius: "20px",
        padding: "4px 10px",
        cursor: "pointer",
        fontSize: "12px",
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        transition: "all 0.2s ease",
        outline: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--color-primary)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--color-border)";
      }}
    >
      {locale === "en" ? (
        <>
          <Image
            src="https://flagcdn.com/w40/gb.png"
            width={18}
            height={13}
            alt="UK Flag"
            style={{ borderRadius: "2px", objectFit: "cover" }}
          />
          <span>EN</span>
        </>
      ) : (
        <>
          <Image
            src="https://flagcdn.com/w40/mm.png"
            width={18}
            height={13}
            alt="Myanmar Flag"
            style={{ borderRadius: "2px", objectFit: "cover" }}
          />
          <span>MY</span>
        </>
      )}
    </button>
  );
}
