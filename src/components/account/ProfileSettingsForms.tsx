"use client";

import { useActionState } from "react";
import {
  updateProfile,
  updatePaymentMethod,
} from "@/actions/account/action-profile";

export function ProfileSettingsForms({
  profile,
}: {
  profile: {
    full_name?: string | null;
    phone_number?: string | null;
    address?: string | null;
    preferred_payment_method?: string | null;
  } | null;
}) {
  const [profileState, profileAction] = useActionState(updateProfile, null);
  const [paymentState, paymentAction] = useActionState(
    updatePaymentMethod,
    null,
  );

  return (
    <>
      <div className="card" style={{ marginBottom: "var(--space-xl)" }}>
        <div className="card-header">
          <h2 style={{ fontSize: "var(--font-size-lg)", fontWeight: 600 }}>
            ကိုယ်ရေးအချက်အလက် (Profile Details)
          </h2>
        </div>
        <div className="card-body">
          {profileState?.error && (
            <div
              className="badge badge-danger"
              style={{
                marginBottom: "1rem",
                width: "100%",
                display: "block",
                padding: "10px",
              }}
            >
              {profileState.error}
            </div>
          )}
          {profileState?.success && (
            <div
              className="badge badge-success"
              style={{
                marginBottom: "1rem",
                width: "100%",
                display: "block",
                padding: "10px",
              }}
            >
              Profile updated successfully!
            </div>
          )}
          <form
            action={profileAction}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-md)",
            }}
          >
            <div className="form-group">
              <label className="form-label" htmlFor="full_name">
                အမည် (Full Name)
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                className="form-input"
                defaultValue={profile?.full_name || ""}
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone_number">
                ဖုန်းနံပါတ် (Phone Number)
              </label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                className="form-input"
                defaultValue={profile?.phone_number || ""}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="address">
                လိပ်စာ (Address)
              </label>
              <textarea
                id="address"
                name="address"
                className="form-input"
                rows={3}
                defaultValue={profile?.address || ""}
                placeholder="Enter your full address"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ alignSelf: "flex-start" }}
            >
              သိမ်းဆည်းမည် (Save Profile)
            </button>
          </form>
        </div>
      </div>

      <div
        className="card"
        id="payment"
        style={{ marginBottom: "var(--space-xl)" }}
      >
        <div className="card-header">
          <h2 style={{ fontSize: "var(--font-size-lg)", fontWeight: 600 }}>
            ငွေပေးချေမှုစနစ် (Payment Method)
          </h2>
        </div>
        <div className="card-body">
          {paymentState?.error && (
            <div
              className="badge badge-danger"
              style={{
                marginBottom: "1rem",
                width: "100%",
                display: "block",
                padding: "10px",
              }}
            >
              {paymentState.error}
            </div>
          )}
          {paymentState?.success && (
            <div
              className="badge badge-success"
              style={{
                marginBottom: "1rem",
                width: "100%",
                display: "block",
                padding: "10px",
              }}
            >
              Payment method updated successfully!
            </div>
          )}
          <form
            action={paymentAction}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-md)",
            }}
          >
            <label
              className="flex items-center gap-sm"
              style={{ cursor: "pointer" }}
            >
              <input
                type="radio"
                name="payment_method"
                value="cod"
                defaultChecked={
                  profile?.preferred_payment_method === "cod" ||
                  !profile?.preferred_payment_method
                }
              />
              Cash on Delivery (ပစ္စည်းရောက်မှ ငွေချေမည်)
            </label>
            <label
              className="flex items-center gap-sm"
              style={{ cursor: "pointer" }}
            >
              <input
                type="radio"
                name="payment_method"
                value="mobile_banking"
                defaultChecked={
                  profile?.preferred_payment_method === "mobile_banking"
                }
              />
              KBZ Pay / Wave Pay ဖြင့် ငွေလွှဲမည် (Mobile Banking)
            </label>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ alignSelf: "flex-start", marginTop: "var(--space-sm)" }}
            >
              သိမ်းဆည်းမည် (Save Payment Method)
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
