"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { submitReview } from "@/actions/shop/action-review";
import Link from "next/link";
import { Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  productId: string;
}

export default function ReviewForm({ productId }: Props) {
  const t = useTranslations("Reviews");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setIsLoggedIn(!!user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (isLoggedIn === null) {
    return (
      <div
        style={{
          padding: "var(--space-xl)",
          background: "var(--color-surface)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--color-border-light)",
          minHeight: "140px",
        }}
      />
    );
  }

  if (!isLoggedIn) {
    return (
      <div
        style={{
          padding: "var(--space-xl)",
          background: "var(--color-surface)",
          borderRadius: "var(--radius-md)",
          textAlign: "center",
          border: "1px solid var(--color-border-light)",
        }}
      >
        <h3
          style={{
            fontSize: "var(--font-size-base)",
            marginBottom: "var(--space-md)",
            fontWeight: 500,
          }}
        >
          {t("writeReview")}
        </h3>
        <p
          style={{
            color: "var(--color-text-secondary)",
            marginBottom: "var(--space-lg)",
            fontSize: "var(--font-size-sm)",
          }}
        >
          {t("loginRequired")}
        </p>
        <Link href="/login" className="btn btn-primary">
          {t("loginBtn")}
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div
        style={{
          padding: "var(--space-xl)",
          background: "var(--color-surface)",
          borderRadius: "var(--radius-md)",
          textAlign: "center",
          border: "1px solid var(--color-border-light)",
        }}
      >
        <h3
          style={{
            fontSize: "var(--font-size-base)",
            marginBottom: "var(--space-sm)",
            color: "var(--color-primary)",
            fontWeight: 500,
          }}
        >
          {t("thankYou")}
        </h3>
        <p
          style={{
            color: "var(--color-text-secondary)",
            fontSize: "var(--font-size-sm)",
          }}
        >
          {t("submitted")}
        </p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("productId", productId);
    formData.append("rating", rating.toString());

    const result = await submitReview(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  }

  return (
    <div
      style={{
        padding: "var(--space-lg)",
        background: "var(--color-surface)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--color-border-light)",
      }}
    >
      <h3
        style={{
          fontSize: "var(--font-size-base)",
          marginBottom: "var(--space-lg)",
          fontWeight: 600,
        }}
      >
        {t("writeReview")}
      </h3>

      {error && (
        <div
          style={{
            padding: "var(--space-sm)",
            background: "var(--color-danger-light)",
            color: "var(--color-danger)",
            borderRadius: "var(--radius-sm)",
            marginBottom: "var(--space-md)",
            fontSize: "var(--font-size-sm)",
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-md)",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontSize: "var(--font-size-sm)",
              color: "var(--color-text-secondary)",
              marginBottom: "var(--space-xs)",
            }}
          >
            {t("rating")}
          </label>
          <div style={{ display: "flex", gap: "4px" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  color:
                    star <= (hoverRating || rating)
                      ? "#FACC15"
                      : "var(--color-border)",
                  transition: "color 0.2s",
                }}
              >
                <Star
                  fill={
                    star <= (hoverRating || rating) ? "currentColor" : "none"
                  }
                  size={28}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="comment"
            style={{
              display: "block",
              fontSize: "var(--font-size-sm)",
              color: "var(--color-text-secondary)",
              marginBottom: "var(--space-xs)",
            }}
          >
            {t("commentLabel")}
          </label>
          <textarea
            id="comment"
            name="comment"
            className="form-input"
            rows={4}
            placeholder={t("commentPlaceholder")}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ alignSelf: "flex-start" }}
        >
          {loading ? <span className="spinner" /> : null}
          {loading ? t("submitting") : t("submitBtn")}
        </button>
      </form>
    </div>
  );
}
