"use client";

import { Link } from "@/i18n/routing";
import { SearchX, Home, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-bg, #f4f6f8)",
        padding: "2rem",
        textAlign: "center"
      }}
    >
      <div 
        style={{
          width: "120px",
          height: "120px",
          background: "var(--color-primary-ghost, rgba(66, 133, 244, 0.1))",
          color: "var(--color-primary, #4285F4)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "2rem"
        }}
      >
        <SearchX size={56} strokeWidth={1.5} />
      </div>

      <h1 
        style={{
          fontSize: "5rem",
          fontWeight: 800,
          margin: "0 0 1rem 0",
          color: "var(--color-text, #111827)",
          lineHeight: 1,
          letterSpacing: "-0.02em"
        }}
      >
        404
      </h1>

      <h2 
        style={{
          fontSize: "1.75rem",
          fontWeight: 600,
          margin: "0 0 1rem 0",
          color: "var(--color-text-secondary, #4B5563)"
        }}
      >
        Page Not Found
      </h2>

      <p 
        style={{
          maxWidth: "450px",
          color: "var(--color-text-tertiary, #6B7280)",
          lineHeight: 1.6,
          marginBottom: "2.5rem",
          fontSize: "1.1rem"
        }}
      >
        We&apos;re sorry, but the page you were looking for doesn&apos;t exist, has been moved, or you don&apos;t have permission to view it.
      </p>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={() => router.back()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "0.875rem 1.5rem",
            background: "transparent",
            color: "var(--color-text, #111827)",
            border: "1px solid var(--color-border, #E5E7EB)",
            borderRadius: "0.5rem",
            fontSize: "1rem",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "var(--color-surface, #FFFFFF)";
            e.currentTarget.style.borderColor = "var(--color-text-secondary, #4B5563)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "var(--color-border, #E5E7EB)";
          }}
        >
          <ArrowLeft size={18} />
          Go Back
        </button>

        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "0.875rem 1.5rem",
            background: "var(--color-primary, #4285F4)",
            color: "#fff",
            border: "none",
            borderRadius: "0.5rem",
            fontSize: "1rem",
            fontWeight: 500,
            textDecoration: "none",
            transition: "background-color 0.2s ease"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "var(--color-primary-dark, #3367D6)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "var(--color-primary, #4285F4)";
          }}
        >
          <Home size={18} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
