"use client";

import { useState } from "react";
import Link from "next/link";
import { registerWithEmail } from "@/actions/auth/action-register";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRegister(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const result = await registerWithEmail(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    if (result.success) {
      setSuccess(result.message ?? "အီးမေးလ်ကိုစစ်ဆေးပါ");
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">အကောင့်ဖန်တီးရန်</h1>
        <p className="auth-subtitle">
          အချက်အလက်များဖြည့်သွင်းပြီး အကောင့်ဖန်တီးပါ
        </p>

        <form action={handleRegister} className="auth-form">
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

          <div className="form-group">
            <label className="form-label" htmlFor="full_name">
              အမည်
            </label>
            <input
              type="text"
              name="full_name"
              id="full_name"
              className="form-input"
              placeholder="သင့်အမည်"
              required
              minLength={2}
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-email">
              အီးမေးလ်
            </label>
            <input
              type="email"
              name="email"
              id="register-email"
              className="form-input"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-password">
              စကားဝှက်
            </label>
            <input
              type="password"
              name="password"
              id="register-password"
              className="form-input"
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirm_password">
              စကားဝှက်ထပ်ရိုက်ပါ
            </label>
            <input
              type="password"
              name="confirm_password"
              id="confirm_password"
              className="form-input"
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading || !!success}
            id="btn-register"
          >
            {loading ? <span className="spinner" /> : null}
            {loading ? "ဖန်တီးနေသည်..." : "အကောင့်ဖန်တီးရန်"}
          </button>
        </form>

        <div className="auth-footer">
          အကောင့်ရှိပြီးသားလား? <Link href="/login">ဝင်ရောက်ရန်</Link>
        </div>
      </div>
    </div>
  );
}
