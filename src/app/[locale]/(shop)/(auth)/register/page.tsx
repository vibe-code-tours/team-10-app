"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { registerWithEmail } from "@/actions/auth/action-register";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { FormInput } from "@/components/auth/FormInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { useFormValidation } from "@/hooks/useFormValidation";
import { registerSchema } from "@/lib/validations/auth";
import { getPasswordStrength } from "@/lib/password-strength";

export default function RegisterPage() {
  const t = useTranslations("Register");
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

  return (
    <AuthLayout>
      <h1 className="auth-title">{t("title")}</h1>
      <p className="auth-subtitle">{t("subtitle")}</p>

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
