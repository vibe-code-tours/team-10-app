# Supabase Auth Custom Registration Email Template Guide

This document outlines how to configure the custom branded email verification template for **Yoe Yar Zay** in the Supabase Dashboard.

---

## 1. Overview

The default Supabase registration verification email includes generic unbranded text ("powered by Supabase ⚡️"). We replace it with an official, branded HTML email template featuring Yoe Yar Zay styling, clear onboarding copy, and a responsive verification CTA button.

---

## 2. Supabase Dashboard Configuration

Follow these steps to update the verification email in Supabase:

1. Log in to the [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project: **Yoe Yar Zay (`rnrxbetdkosopdptkzqz`)**.
3. Navigate to **Authentication** → **Email Templates** in the sidebar menu.
4. Select the **Confirm signup** template tab.

### Settings to Update:

- **Subject**:

  ```text
  Welcome to Yoe Yar Zay! Confirm your email
  ```

- **Sender Name**:

  ```text
  Yoe Yar Zay
  ```

- **Sender Email**:

  ```text
  noreply@yoeyarzay.com
  ```

- **Body (HTML)**:
  Copy the complete contents of [`supabase/templates/confirm_signup.html`](../supabase/templates/confirm_signup.html) and paste it into the HTML editor in the Supabase Dashboard.

5. Click **Save** at the bottom of the page.

---

## 3. Local & Programmatic Email Verification

In addition to Supabase Auth's automated email dispatch, the codebase provides programmatic email helpers in `src/lib/email/send.ts`:

```typescript
import { sendVerificationEmail } from "@/lib/email/send";

// Send branded verification email via Resend
await sendVerificationEmail(
  user.email,
  confirmationUrl,
  user.user_metadata?.full_name,
);
```

---

## 4. Testing & Verification

1. Go to `/register` on the store frontend.
2. Sign up with a new email address.
3. Check the inbox for the confirmation email.
4. Verify that:
   - Subject matches: **"Welcome to Yoe Yar Zay! Confirm your email"**
   - Header shows **🛍️ Yoe Yar Zay** branding.
   - Button correctly redirects to the email verification callback endpoint (`/auth/callback`).
   - Footer contains official Yoe Yar Zay copyright & support info without generic "powered by Supabase" text.
