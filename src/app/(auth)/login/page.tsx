"use client";

import { useState } from "react";
import Link from "next/link";
import { loginWithEmail, loginWithGoogle } from "@/actions/auth/action-login";
import { mergeGuestCart } from "@/actions/cart/action-merge";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleEmailLogin(formData: FormData) {
    setLoading(true);
    setError(null);

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
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">ပြန်လည်ကြိုဆိုပါတယ်</h1>
        <p className="auth-subtitle">အကောင့်ဝင်ရောက်ပြီး ဝယ်ယူမှုစတင်ပါ</p>

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
          Google ဖြင့်ဝင်ရောက်ရန်
        </button>

        <div className="auth-divider">သို့မဟုတ်</div>

        <form action={handleEmailLogin} className="auth-form">
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

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              အီးမေးလ်
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="form-input"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              စကားဝှက်
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="form-input"
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            id="btn-email-login"
          >
            {loading ? <span className="spinner" /> : null}
            {loading ? "ဝင်ရောက်နေသည်..." : "ဝင်ရောက်ရန်"}
          </button>
        </form>

        <div className="auth-footer">
          အကောင့်မရှိသေးဘူးလား? <Link href="/register">အကောင့်ဖန်တီးရန်</Link>
        </div>
      </div>
    </div>
  );
}
