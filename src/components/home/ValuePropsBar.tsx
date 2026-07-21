"use client";

import { Truck, ShieldCheck, CreditCard, Headphones } from "lucide-react";
import { useTranslations } from "next-intl";

export function ValuePropsBar() {
  const t = useTranslations("HomePage");

  const propsList = [
    {
      icon: Truck,
      title: t("deliveryTitle"),
      subtitle: t("deliverySub"),
    },
    {
      icon: ShieldCheck,
      title: t("authenticTitle"),
      subtitle: t("authenticSub"),
    },
    {
      icon: CreditCard,
      title: t("paymentTitle"),
      subtitle: t("paymentSub"),
    },
    {
      icon: Headphones,
      title: t("supportTitle"),
      subtitle: t("supportSub"),
    },
  ];

  return (
    <div className="container" style={{ marginTop: "16px" }}>
      <div
        style={{
          background: "var(--color-surface)",
          borderRadius: "12px",
          border: "1px solid var(--color-border-light)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
          padding: "16px 20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        {propsList.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "6px 8px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "var(--color-primary-ghost)",
                  color: "var(--color-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <IconComponent size={20} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "var(--color-text)",
                    lineHeight: 1.2,
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--color-text-secondary)",
                    marginTop: "2px",
                  }}
                >
                  {item.subtitle}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
