"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type CurrencyCode = "USD" | "MMK" | "EUR" | "GBP" | "THB";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  flag: string;
  rate: number; // relative to USD (USD = 1)
  position: "before" | "after";
  space: boolean;
  decimals: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: "USD",
    symbol: "$",
    label: "USD ($)",
    flag: "🇺🇸",
    rate: 1.0,
    position: "before",
    space: false,
    decimals: 2,
  },
  MMK: {
    code: "MMK",
    symbol: "Ks",
    label: "MMK (Ks)",
    flag: "🇲🇲",
    rate: 3500.0,
    position: "after",
    space: true,
    decimals: 0,
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    label: "EUR (€)",
    flag: "🇪🇺",
    rate: 0.92,
    position: "before",
    space: false,
    decimals: 2,
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    label: "GBP (£)",
    flag: "🇬🇧",
    rate: 0.78,
    position: "before",
    space: false,
    decimals: 2,
  },
  THB: {
    code: "THB",
    symbol: "฿",
    label: "THB (฿)",
    flag: "🇹🇭",
    rate: 36.5,
    position: "before",
    space: false,
    decimals: 0,
  },
};

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  currencyConfig: CurrencyConfig;
  formatPrice: (amountInUSD: number) => string;
  convertPrice: (amountInUSD: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined,
);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD");

  useEffect(() => {
    const savedCurrency = localStorage.getItem(
      "yoeyarzay_currency",
    ) as CurrencyCode | null;
    if (savedCurrency && CURRENCIES[savedCurrency]) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrencyState(savedCurrency);
    }
  }, []);

  const setCurrency = (newCurrency: CurrencyCode) => {
    if (CURRENCIES[newCurrency]) {
      setCurrencyState(newCurrency);
      localStorage.setItem("yoeyarzay_currency", newCurrency);
    }
  };

  const config = CURRENCIES[currency] || CURRENCIES.USD;

  const convertPrice = (amountInUSD: number): number => {
    const numericAmount = Number(amountInUSD) || 0;
    return numericAmount * config.rate;
  };

  const formatPrice = (amountInUSD: number): string => {
    const converted = convertPrice(amountInUSD);
    const formattedNum =
      config.decimals === 0
        ? Math.round(converted).toLocaleString()
        : converted.toLocaleString(undefined, {
            minimumFractionDigits: config.decimals,
            maximumFractionDigits: config.decimals,
          });

    if (config.position === "before") {
      return `${config.symbol}${config.space ? " " : ""}${formattedNum}`;
    } else {
      return `${formattedNum}${config.space ? " " : ""}${config.symbol}`;
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        currencyConfig: config,
        formatPrice,
        convertPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
