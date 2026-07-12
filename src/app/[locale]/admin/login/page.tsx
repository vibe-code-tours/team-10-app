"use client";

import { useState } from "react";
import { loginWithEmail } from "@/actions/auth/action-login";
import { useTranslations } from "next-intl";
import { Shield, Eye, EyeOff } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const t = useTranslations("Auth");

  async function handleEmailLogin(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = await loginWithEmail(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
  }

  return (
    <div className="admin-login-layout">
      {/* Left Side: Branding & Description */}
      <div className="admin-login-brand">
        <div className="brand-content">
          <div className="brand-logo-wrapper">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                background: "#fff",
                color: "var(--color-primary)",
                borderRadius: "12px",
                padding: "6px",
              }}
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <h1>Yoe Yar Zay</h1>
          <h2>E-commerce Admin Portal</h2>
          <p>
            Manage your store&apos;s products, categories, user orders, and
            monitor overall performance through a unified, high-density
            dashboard.
          </p>
          <div className="brand-footer">
            &copy; {new Date().getFullYear()} Yoe Yar Zay Online Shop. All
            rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="admin-login-form-container">
        <div className="theme-toggle-wrapper">
          <ThemeToggle />
        </div>

        <div className="form-wrapper">
          <div className="form-header">
            <div className="shield-icon">
              <Shield size={28} />
            </div>
            <h2>Admin Access</h2>
            <p>Please sign in to your administrator account.</p>
          </div>

          <form action={handleEmailLogin} className="login-form">
            <input type="hidden" name="redirect" value="/admin" />

            {error && <div className="error-message">{error}</div>}

            <div className="input-group">
              <label htmlFor="email">{t("email")}</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="admin@yoeyarzay.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">{t("password")}</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? <span className="spinner" /> : null}
              {loading ? "Authenticating..." : "Sign in to Admin"}
            </button>
          </form>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .admin-login-layout {
          display: flex;
          min-height: 100vh;
          width: 100%;
        }

        /* Left Side */
        .admin-login-brand {
          flex: 1;
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 4rem;
          position: relative;
          overflow: hidden;
        }
        
        .admin-login-brand::before {
          content: "";
          position: absolute;
          top: -10%;
          right: -10%;
          width: 50%;
          height: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
          border-radius: 50%;
        }
        
        .admin-login-brand::after {
          content: "";
          position: absolute;
          bottom: -15%;
          left: -10%;
          width: 60%;
          height: 60%;
          background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%);
          border-radius: 50%;
        }

        .brand-content {
          max-width: 500px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        .brand-logo-wrapper {
          margin-bottom: 2rem;
          display: inline-flex;
        }

        .brand-content h1 {
          font-size: 3.5rem;
          font-weight: 800;
          margin: 0 0 0.5rem 0;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .brand-content h2 {
          font-size: 1.5rem;
          font-weight: 500;
          margin: 0 0 1.5rem 0;
          color: rgba(255, 255, 255, 0.9);
        }

        .brand-content p {
          font-size: 1.125rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 3rem;
        }

        .brand-footer {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.6);
          margin-top: 4rem;
        }

        /* Right Side */
        .admin-login-form-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: var(--color-bg);
          position: relative;
          padding: 2rem;
        }

        .theme-toggle-wrapper {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
        }

        .form-wrapper {
          width: 100%;
          max-width: 440px;
          background: var(--color-surface);
          padding: 3rem;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl, 0 20px 40px rgba(0,0,0,0.08));
          border: 1px solid var(--color-border-light);
        }

        .form-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .shield-icon {
          width: 56px;
          height: 56px;
          background: var(--color-primary-ghost);
          color: var(--color-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem auto;
        }

        .form-header h2 {
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          color: var(--color-text);
        }

        .form-header p {
          color: var(--color-text-secondary);
          margin: 0;
          font-size: 0.95rem;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .error-message {
          text-align: center;
          padding: 0.75rem;
          background: var(--color-danger-light);
          color: var(--color-danger);
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          font-weight: 500;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-group label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-text);
        }

        .input-group input {
          width: 100%;
          padding: 0.875rem 1rem;
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          color: var(--color-text);
          outline: none;
          transition: var(--transition-fast);
          font-size: 1rem;
        }

        .input-group input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px var(--color-primary-ghost);
        }

        .password-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .password-input-wrapper input {
          padding-right: 2.75rem;
        }

        .password-toggle-btn {
          position: absolute;
          right: 0.75rem;
          background: transparent;
          border: none;
          color: var(--color-text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.25rem;
          transition: color 0.2s ease;
        }

        .password-toggle-btn:hover {
          color: var(--color-primary);
        }

        .submit-btn {
          width: 100%;
          margin-top: 1rem;
          padding: 0.875rem;
          background: var(--color-primary);
          color: #fff;
          border: none;
          border-radius: var(--radius-md);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }

        .submit-btn:hover:not(:disabled) {
          background: var(--color-primary-dark);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 900px) {
          .admin-login-layout {
            flex-direction: column;
          }

          .admin-login-brand {
            padding: 3rem 2rem;
            text-align: center;
            flex: none;
          }

          .brand-logo-wrapper {
            margin: 0 auto 1.5rem auto;
          }

          .brand-footer {
            margin-top: 2rem;
          }
          
          .admin-login-form-container {
            padding: 2rem 1rem;
          }

          .form-wrapper {
            padding: 2rem;
            box-shadow: none;
            border: none;
            background: transparent;
          }
        }
      `,
        }}
      />
    </div>
  );
}
