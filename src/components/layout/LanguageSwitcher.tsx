"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";

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
      onClick={toggleLanguage}
      aria-label={
        locale === "en"
          ? "Switch language to Myanmar"
          : "Switch language to English"
      }
      style={{
        background: "var(--color-primary, #007bff)",
        color: "white",
        border: "none",
        borderRadius: "20px",
        padding: "6px 14px",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: 600,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        transition: "all 0.2s ease",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {locale === "en" ? (
          <>
            <img src="https://flagcdn.com/w20/gb.png" srcSet="https://flagcdn.com/w40/gb.png 2x" width="20" height="15" alt="UK Flag" style={{ borderRadius: "2px" }} /> EN
          </>
        ) : (
          <>
            <img src="https://flagcdn.com/w20/mm.png" srcSet="https://flagcdn.com/w40/mm.png 2x" width="20" height="15" alt="Myanmar Flag" style={{ borderRadius: "2px" }} /> MM
          </>
        )}
      </span>
    </button>
  );
}
