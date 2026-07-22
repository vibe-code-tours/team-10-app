"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useCurrency, CURRENCIES, CurrencyCode } from "./CurrencyProvider";
import { ChevronDown } from "lucide-react";

const FLAG_MAP: Record<CurrencyCode, string> = {
  USD: "us",
  MMK: "mm",
  EUR: "eu",
  GBP: "gb",
  THB: "th",
};

export default function CurrencySwitcher() {
  const { currency, setCurrency, currencyConfig } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      ref={dropdownRef}
      style={{ position: "relative", display: "inline-block" }}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select currency"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "var(--color-surface, #fff)",
          color: "var(--color-text, #111827)",
          border: "1px solid var(--color-border, #d1d5db)",
          borderRadius: "20px",
          padding: "4px 10px",
          cursor: "pointer",
          fontSize: "12px",
          fontWeight: 600,
          transition: "all 0.2s ease",
          outline: "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--color-primary, #007bff)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--color-border, #d1d5db)";
        }}
      >
        <Image
          src={`https://flagcdn.com/w20/${FLAG_MAP[currencyConfig.code]}.png`}
          width={20}
          height={15}
          unoptimized
          alt={currencyConfig.code}
          style={{ borderRadius: "2px", objectFit: "cover", flexShrink: 0 }}
        />
        <span>{currencyConfig.label}</span>
        <ChevronDown
          size={14}
          style={{
            transform: isOpen ? "rotate(180deg)" : "none",
            transition: "transform var(--transition-base)",
            marginLeft: "2px",
          }}
        />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            right: 0,
            width: "max-content",
            minWidth: "100%",
            backgroundColor: "var(--color-surface, #fff)",
            border: "1px solid var(--color-border, #e5e7eb)",
            borderRadius: "12px",
            boxShadow: "var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1))",
            padding: "4px",
            margin: 0,
            listStyle: "none",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          {Object.values(CURRENCIES).map((c) => (
            <li
              key={c.code}
              role="option"
              aria-selected={currency === c.code}
              onClick={() => {
                setCurrency(c.code as CurrencyCode);
                setIsOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 12px",
                cursor: "pointer",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: currency === c.code ? 600 : 500,
                color: "var(--color-text)",
                backgroundColor:
                  currency === c.code
                    ? "var(--color-bg-secondary, #f0f2f5)"
                    : "transparent",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                if (currency !== c.code) {
                  e.currentTarget.style.backgroundColor =
                    "var(--color-surface-hover, #f9fafb)";
                }
              }}
              onMouseLeave={(e) => {
                if (currency !== c.code) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              <Image
                src={`https://flagcdn.com/w20/${FLAG_MAP[c.code as CurrencyCode]}.png`}
                width={20}
                height={15}
                unoptimized
                alt={c.code}
                style={{
                  borderRadius: "2px",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
              {c.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
