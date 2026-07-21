"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { registerWithEmail } from "@/actions/auth/action-register";
import { loginWithGoogle } from "@/actions/auth/action-login";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { FormInput } from "@/components/auth/FormInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { useFormValidation } from "@/hooks/useFormValidation";
import { registerSchema } from "@/lib/validations/auth";
import { getPasswordStrength } from "@/lib/password-strength";

export default function RegisterPage() {
  const t = useTranslations("Register");
  const tAuth = useTranslations("Auth");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { values, errors, handleChange, handleBlur, validateAll } =
    useFormValidation(registerSchema, {
      full_name: "",
      email: "",
      password: "",
      confirm_password: "",
    });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validateAll()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const result = await registerWithEmail(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    if (result.success) {
      setSuccess(result.message ?? t("checkEmail"));
      setLoading(false);
    }
  }

  const strength = getPasswordStrength(values.password);

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
      <h1 className="auth-title">{t("title")}</h1>
      <p className="auth-subtitle">{t("subtitle")}</p>

      <button
        type="button"
        className="btn btn-google btn-full"
        onClick={handleGoogleLogin}
        disabled={loading || !!success}
        id="btn-google-register"
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
        {t("continueWithGoogle")}
      </button>

      <div className="auth-divider">{tAuth("or")}</div>

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

        {success && (
          <div
            style={{
              textAlign: "center",
              padding: "0.75rem",
              background: "rgba(45,125,70,0.06)",
              color: "var(--color-success)",
              borderRadius: "var(--radius-sm)",
              fontSize: "var(--font-size-sm)",
            }}
          >
            ✓ {success}
          </div>
        )}

        <FormInput
          id="full_name"
          name="full_name"
          label={t("fullName")}
          placeholder={t("namePlaceholder")}
          value={values.full_name}
          error={errors.full_name}
          autoComplete="name"
          icon={User}
          onChange={(v) => handleChange("full_name", v)}
          onBlur={() => handleBlur("full_name")}
        />

        <FormInput
          id="register-email"
          name="email"
          type="email"
          label={t("email")}
          placeholder={t("emailPlaceholder")}
          value={values.email}
          error={errors.email}
          autoComplete="email"
          icon={Mail}
          onChange={(v) => handleChange("email", v)}
          onBlur={() => handleBlur("email")}
        />

        <PasswordInput
          id="register-password"
          name="password"
          label={t("password")}
          placeholder={t("passwordPlaceholder")}
          value={values.password}
          error={errors.password}
          autoComplete="new-password"
          onChange={(v) => handleChange("password", v)}
          onBlur={() => handleBlur("password")}
          strength={strength}
        />

        <PasswordInput
          id="confirm_password"
          name="confirm_password"
          label={t("confirmPassword")}
          placeholder={t("passwordPlaceholder")}
          value={values.confirm_password}
          error={errors.confirm_password}
          autoComplete="new-password"
          onChange={(v) => handleChange("confirm_password", v)}
          onBlur={() => handleBlur("confirm_password")}
        />

        <button
          type="submit"
          className="btn btn-primary btn-full"
          disabled={loading || !!success}
          id="btn-register"
        >
          {loading ? <span className="spinner" /> : null}
          {loading ? t("creating") : t("createBtn")}
        </button>
      </form>

      <div className="auth-footer">
        {t("haveAccount")} <Link href="/login">{t("loginLink")}</Link>
      </div>
    </AuthLayout>
  );
}
