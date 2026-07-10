import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { CartProvider } from "@/components/cart/CartProvider";

export const metadata: Metadata = {
  title: {
    default: "ShopMM — မြန်မာ အွန်လိုင်းဈေးဝယ်",
    template: "%s | ShopMM",
  },
  description:
    "မြန်မာနိုင်ငံ၏ ယုံကြည်စိတ်ချရသော အွန်လိုင်းစျေးဝယ်စနစ်။ ဆိုင်ပေါင်းစုံမှ ပစ္စည်းများကို လုံခြုံစွာဝယ်ယူနိုင်ပါသည်။",
  keywords: ["myanmar", "online shop", "e-commerce", "shopping"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="my" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
        >
          <CartProvider>
            <Header />
            <main className="page-wrapper">{children}</main>
            <Footer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
