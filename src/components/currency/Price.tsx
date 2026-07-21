"use client";

import { useCurrency } from "./CurrencyProvider";

interface PriceProps {
  amount: number;
  className?: string;
  style?: React.CSSProperties;
}

export function Price({ amount, className, style }: PriceProps) {
  const { formatPrice } = useCurrency();
  return (
    <span className={className} style={style}>
      {formatPrice(amount)}
    </span>
  );
}

export default Price;
