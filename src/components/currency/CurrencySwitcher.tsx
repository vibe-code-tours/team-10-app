"use client";

import { useCurrency, CURRENCIES, CurrencyCode } from "./CurrencyProvider";

export default function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();

  return (
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
      aria-label="Select currency"
      id="currency-switcher"
      style={{
        background: "var(--color-bg-secondary, #f0f2f5)",
        color: "var(--color-text, #111827)",
        border: "1px solid var(--color-border, #d1d5db)",
        borderRadius: "20px",
        padding: "5px 10px",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: 600,
        outline: "none",
        transition: "all 0.2s ease",
      }}
    >
      {Object.values(CURRENCIES).map((c) => (
        <option key={c.code} value={c.code}>
          {c.label}
        </option>
      ))}
    </select>
  );
}
