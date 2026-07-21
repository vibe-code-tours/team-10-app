import type { Metadata } from "next";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CartProvider } from "@/components/cart/CartProvider";
import { CurrencyProvider } from "@/components/currency/CurrencyProvider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

export const metadata: Metadata = {
  title: {
    default: "Yoe Yar Zay",
    template: "%s | Yoe Yar Zay",
  },
  description: "Yoe Yar Zay E-commerce",
  keywords: ["myanmar", "online shop", "e-commerce", "shopping"],
};

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const { locale } = params;
  const { children } = props;

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="data-theme"
            defaultTheme="system"
            enableSystem
          >
            <CurrencyProvider>
              <CartProvider>{children}</CartProvider>
            </CurrencyProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
