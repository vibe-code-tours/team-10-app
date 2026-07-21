# Resolving Email Confirmation Link Expiration & Access Denied (Issue #29)

This guide documents the root causes and configuration steps required to ensure email confirmation links validate smoothly without throwing `otp_expired` or `access_denied` errors.

---

## 1. Root Causes Addressed

1. **Missing OTP Token Hash Handling**:
   Supabase email links send `token_hash` and `type` (e.g., `type=signup` or `type=email`). Previously, the `/auth/callback` endpoint only checked for OAuth PKCE `code`, causing OTP links to fall through to `auth_callback_error`.

2. **Redirect URL Mismatch**:
   If Supabase Dashboard's **Site URL** or **Redirect URLs** omit `/auth/callback`, Supabase redirects expired/invalid tokens to `http://localhost:3000/#error=access_denied&error_code=otp_expired` directly instead of passing through server-side validation.

3. **Client-Side Hash & Query Error Recovery**:
   Client auth pages (`/login`) now parse both query string errors (`?error=otp_expired`) and hash fragment parameters (`#error=access_denied`) to display clear error notices.

---

## 2. Supabase Dashboard URL Configuration

To ensure email links route correctly in both local development and production environments:

1. Open the [Supabase Dashboard](https://supabase.com/dashboard).
2. Select project **Yoe Yar Zay (`rnrxbetdkosopdptkzqz`)**.
3. Go to **Authentication** → **URL Configuration**.

### Configure Settings:

- **Site URL**:

  ```text
  http://localhost:3000
  ```

- **Redirect URLs** (Add all of the following):
  ```text
  http://localhost:3000/auth/callback
  http://localhost:3000/en/auth/callback
  http://localhost:3000/my/auth/callback
  https://yoeyarzay.vercel.app/auth/callback
  ```

4. Under **Authentication** → **Email Templates** → **Confirm signup**:
   Ensure the confirmation button URL uses `{{ .ConfirmationURL }}` or `{{ .RedirectTo }}`:

   ```html
   <a href="{{ .ConfirmationURL }}">Verify Email Address</a>
   ```

5. Click **Save**.

---

## 3. Architecture & Code Flow

```text
[User clicks email link]
          │
          ▼
GET /auth/callback?token_hash=xxx&type=signup
          │
          ├── Has token_hash & type? ──► supabase.auth.verifyOtp({ token_hash, type })
          │                                  │
          │                                  ├── Success ──► Upsert public.users & redirect to /
          │                                  └── Failure ──► Redirect to /login?error=otp_expired
          │
          ├── Has code? ──────────────► supabase.auth.exchangeCodeForSession(code)
          │                                  │
          │                                  ├── Success ──► Upsert public.users & redirect to /
          │                                  └── Failure ──► Redirect to /login?error=auth_callback_error
          │
          └── Has error_code? ────────► Redirect to /login?error=<error_code>
```
