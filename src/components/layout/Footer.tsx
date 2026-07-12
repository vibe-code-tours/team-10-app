"use client";

import Link from "next/link";
import { usePathname } from "@/i18n/routing";
import {
  CreditCard,
  Wallet,
  Smartphone,
  ShieldCheck,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  const isAdminPage =
    pathname.startsWith("/en/admin") ||
    pathname.startsWith("/my/admin") ||
    pathname.startsWith("/admin");

  if (isAdminPage) {
    return (
      <footer
        style={{
          padding: "16px 0",
          borderTop: "1px solid var(--color-border-light)",
          background: "var(--color-surface)",
        }}
      >
        <div
          className="container"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "var(--color-text-secondary)",
              fontWeight: 500,
            }}
          >
            © {currentYear} Yoe Yar Zay. All rights reserved.
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer
      style={{
        background: "#f5f5f5",
        paddingTop: "60px",
        borderTop: "1px solid #e5e7eb",
        color: "var(--color-text)",
        fontSize: "14px",
      }}
    >
      <div className="container">
        {/* Top Section: Features */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            paddingBottom: "40px",
            borderBottom: "1px solid #e5e7eb",
            marginBottom: "40px",
            gap: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flex: "1 1 200px",
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: "12px",
                borderRadius: "50%",
                color: "var(--color-primary)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <ShieldCheck size={28} />
            </div>
            <div>
              <h4
                style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: 700 }}
              >
                100% Authentic
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  color: "var(--color-text-secondary)",
                }}
              >
                Guaranteed authentic products
              </p>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flex: "1 1 200px",
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: "12px",
                borderRadius: "50%",
                color: "var(--color-primary)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <CreditCard size={28} />
            </div>
            <div>
              <h4
                style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: 700 }}
              >
                Safe Payment
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  color: "var(--color-text-secondary)",
                }}
              >
                100% secure payment
              </p>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flex: "1 1 200px",
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: "12px",
                borderRadius: "50%",
                color: "var(--color-primary)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <Wallet size={28} />
            </div>
            <div>
              <h4
                style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: 700 }}
              >
                Return Policy
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  color: "var(--color-text-secondary)",
                }}
              >
                15 days return policy
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "40px",
            paddingBottom: "40px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          {/* Column 1: Customer Service */}
          <div>
            <h3
              style={{
                fontSize: "14px",
                fontWeight: 700,
                marginBottom: "20px",
                textTransform: "uppercase",
                color: "#111",
              }}
            >
              Customer Service
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <li>
                <Link href="/help" className="footer-link">
                  Help Centre
                </Link>
              </li>
              <li>
                <Link href="/how-to-buy" className="footer-link">
                  How to Buy
                </Link>
              </li>
              <li>
                <Link href="/payment-methods" className="footer-link">
                  Payment Methods
                </Link>
              </li>
              <li>
                <Link href="/returns" className="footer-link">
                  Return & Refund
                </Link>
              </li>
              <li>
                <Link href="/contact" className="footer-link">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: About Us */}
          <div>
            <h3
              style={{
                fontSize: "14px",
                fontWeight: 700,
                marginBottom: "20px",
                textTransform: "uppercase",
                color: "#111",
              }}
            >
              About Yoe Yar Zay
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <li>
                <Link href="/about" className="footer-link">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="footer-link">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="footer-link">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/seller-centre" className="footer-link">
                  Seller Centre
                </Link>
              </li>
              <li>
                <Link href="/flash-deals" className="footer-link">
                  Flash Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Payment & Logistics */}
          <div>
            <h3
              style={{
                fontSize: "14px",
                fontWeight: 700,
                marginBottom: "20px",
                textTransform: "uppercase",
                color: "#111",
              }}
            >
              Payment
            </h3>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginBottom: "24px",
              }}
            >
              <div className="payment-badge">VISA</div>
              <div className="payment-badge">Mastercard</div>
              <div className="payment-badge">JCB</div>
              <div className="payment-badge">KBZPay</div>
              <div className="payment-badge">WavePay</div>
            </div>

            <h3
              style={{
                fontSize: "14px",
                fontWeight: 700,
                marginBottom: "20px",
                textTransform: "uppercase",
                color: "#111",
              }}
            >
              Logistics
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <div className="payment-badge">Ninja Van</div>
              <div className="payment-badge">Royal Express</div>
              <div className="payment-badge">K-MD</div>
            </div>
          </div>

          {/* Column 4: Contact & Social */}
          <div>
            <h3
              style={{
                fontSize: "14px",
                fontWeight: 700,
                marginBottom: "20px",
                textTransform: "uppercase",
                color: "#111",
              }}
            >
              Follow Us
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                marginBottom: "32px",
              }}
            >
              <Link href="https://facebook.com" className="social-link">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>{" "}
                Facebook
              </Link>
              <Link href="https://instagram.com" className="social-link">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>{" "}
                Instagram
              </Link>
              <Link href="https://twitter.com" className="social-link">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>{" "}
                Twitter
              </Link>
              <Link href="https://linkedin.com" className="social-link">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>{" "}
                LinkedIn
              </Link>
            </div>

            <h3
              style={{
                fontSize: "14px",
                fontWeight: 700,
                marginBottom: "20px",
                textTransform: "uppercase",
                color: "#111",
              }}
            >
              Download App
            </h3>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              {/* QR Code Placeholder */}
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Smartphone size={32} color="var(--color-primary)" />
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <div className="app-store-btn">App Store</div>
                <div className="app-store-btn">Google Play</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            padding: "24px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            color: "var(--color-text-secondary)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "24px",
              flexWrap: "wrap",
              justifyContent: "center",
              fontSize: "13px",
            }}
          >
            <span>
              <MapPin
                size={14}
                style={{
                  display: "inline",
                  verticalAlign: "middle",
                  marginRight: "4px",
                }}
              />{" "}
              Yangon, Myanmar
            </span>
            <span>
              <Phone
                size={14}
                style={{
                  display: "inline",
                  verticalAlign: "middle",
                  marginRight: "4px",
                }}
              />{" "}
              +95 9 123 456 789
            </span>
            <span>
              <Mail
                size={14}
                style={{
                  display: "inline",
                  verticalAlign: "middle",
                  marginRight: "4px",
                }}
              />{" "}
              support@yoeyarzay.com
            </span>
          </div>
          <div style={{ fontSize: "13px" }}>
            © {currentYear} Yoe Yar Zay. All rights reserved.
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .footer-link {
          color: var(--color-text-secondary);
          text-decoration: none;
          font-size: 13px;
          transition: color 0.2s;
        }
        .footer-link:hover {
          color: var(--color-primary);
        }
        .social-link {
          display: flex;
          alignItems: center;
          gap: 8px;
          color: var(--color-text-secondary);
          text-decoration: none;
          font-size: 13px;
          transition: color 0.2s;
        }
        .social-link:hover {
          color: var(--color-primary);
        }
        .payment-badge {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          padding: 6px 10px;
          font-size: 11px;
          font-weight: 600;
          color: #4b5563;
          box-shadow: 0 1px 2px rgba(0,0,0,0.02);
        }
        .app-store-btn {
          background: #111;
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 4px;
          text-align: center;
          cursor: pointer;
          min-width: 100px;
          transition: background 0.2s;
        }
        .app-store-btn:hover {
          background: #333;
        }
      `,
        }}
      />
    </footer>
  );
}
