"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { loginWithEmail, loginWithGoogle } from "@/actions/auth/action-login";
import { mergeGuestCart } from "@/actions/cart/action-merge";
import { useTranslations } from "next-intl";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { FormInput } from "@/components/auth/FormInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { useFormValidation } from "@/hooks/useFormValidation";
import { loginSchema } from "@/lib/validations/auth";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("Auth");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const urlError = searchParams.get("error");
      const hash = window.location.hash;

      if (urlError === "otp_expired" || hash.includes("otp_expired")) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setError(
          "Email link has expired or is invalid. Please sign up again or request a new verification link.",
        );
      } else if (
        urlError === "auth_callback_error" ||
        hash.includes("access_denied")
      ) {
        setError(
          "Authentication failed or email link expired. Please try signing in.",
        );
      } else if (urlError) {
        setError(urlError);
      }
    }
  }, []);

  const { values, errors, handleChange, handleBlur, validateAll } =
    useFormValidation(loginSchema, { email: "", password: "" });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validateAll()) return;

    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await loginWithEmail(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    if (typeof window !== "undefined") {
      const guestCart = localStorage.getItem("guest_cart");
      if (guestCart) {
        await mergeGuestCart(guestCart);
        localStorage.removeItem("guest_cart");
      }
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    setError(null);
    const result = await loginWithGoogle();
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <h1 className="auth-title">{t("welcomeBack")}</h1>
      <p className="auth-subtitle">{t("loginToStart")}</p>

      <button
        type="button"
        className="btn btn-google btn-full"
        onClick={handleGoogleLogin}
        disabled={loading}
        id="btn-google-login"
      >
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        {t("loginWithGoogle")}
      </button>

      <div className="auth-divider">{t("or")}</div>

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        {error && (
          <div
            className="form-error"
            style={{
              textAlign: "center",
              padding: "0.5rem",
              background: "var(--color-danger-light)",
              borderRadius: "var(--radius-sm)",
            }}
          >
            {error}
          </div>
        )}

        <FormInput
          id="email"
          name="email"
          type="email"
          label={t("email")}
          placeholder="you@example.com"
          value={values.email}
          error={errors.email}
          autoComplete="email"
          icon={Mail}
          onChange={(v) => handleChange("email", v)}
          onBlur={() => handleBlur("email")}
        />

        <PasswordInput
          id="password"
          name="password"
          label={t("password")}
          placeholder="••••••••"
          value={values.password}
          error={errors.password}
          autoComplete="current-password"
          onChange={(v) => handleChange("password", v)}
          onBlur={() => handleBlur("password")}
        />

        <button
          type="submit"
          className="btn btn-primary btn-full"
          disabled={loading}
          id="btn-email-login"
        >
          {loading ? <span className="spinner" /> : null}
          {loading ? t("loggingIn") : t("loginBtn")}
        </button>
      </form>

      <div className="auth-footer">
        {t("noAccount")} <Link href="/register">{t("register")}</Link>
      </div>
    </AuthLayout>
  );
}
