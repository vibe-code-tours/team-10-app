"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { submitReview } from "@/actions/shop/action-review";
import Link from "next/link";
import { Star, Send, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  productId: string;
}

export default function ReviewForm({ productId }: Props) {
  const t = useTranslations("Reviews");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const ratingLabels: Record<number, string> = {
    1: "1 / 5 — Poor",
    2: "2 / 5 — Fair",
    3: "3 / 5 — Good",
    4: "4 / 5 — Very Good",
    5: "5 / 5 — Excellent",
  };

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
          borderRadius: "var(--radius-lg)",
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
          borderRadius: "var(--radius-lg)",
          textAlign: "center",
          border: "1px solid var(--color-border-light)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
        }}
      >
        <h3
          style={{
            fontSize: "var(--font-size-base)",
            marginBottom: "var(--space-xs)",
            fontWeight: 600,
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
        <Link
          href="/login"
          className="btn btn-primary"
          style={{ padding: "0.625rem 1.5rem" }}
        >
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
          borderRadius: "var(--radius-lg)",
          textAlign: "center",
          border: "1px solid var(--color-border-light)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "12px",
          }}
        >
          <CheckCircle2 size={36} style={{ color: "var(--color-success)" }} />
        </div>
        <h3
          style={{
            fontSize: "var(--font-size-lg)",
            marginBottom: "var(--space-xs)",
            color: "var(--color-text)",
            fontWeight: 600,
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

  const activeRating = hoverRating || rating;

  return (
    <div
      style={{
        padding: "24px",
        background: "var(--color-surface)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--color-border-light)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <h3
        style={{
          fontSize: "17px",
          marginBottom: "16px",
          fontWeight: 600,
          color: "var(--color-text)",
        }}
      >
        {t("writeReview")}
      </h3>

      {error && (
        <div
          style={{
            padding: "10px 14px",
            background: "var(--color-danger-light)",
            color: "var(--color-danger)",
            borderRadius: "var(--radius-md)",
            marginBottom: "16px",
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
          gap: "16px",
          width: "100%",
        }}
      >
        {/* Rating Section */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "var(--font-size-sm)",
              fontWeight: 500,
              color: "var(--color-text-secondary)",
              marginBottom: "8px",
            }}
          >
            {t("rating")}
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
                    padding: "2px",
                    color:
                      star <= activeRating ? "#FACC15" : "var(--color-border)",
                    transition: "transform 0.15s ease, color 0.15s ease",
                    transform: star <= activeRating ? "scale(1.1)" : "scale(1)",
                  }}
                  aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                >
                  <Star
                    fill={star <= activeRating ? "currentColor" : "none"}
                    size={26}
                  />
                </button>
              ))}
            </div>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--color-text-secondary)",
              }}
            >
              {ratingLabels[activeRating]}
            </span>
          </div>
        </div>

        {/* Comment Section */}
        <div style={{ width: "100%" }}>
          <label
            htmlFor="comment"
            style={{
              display: "block",
              fontSize: "var(--font-size-sm)",
              fontWeight: 500,
              color: "var(--color-text-secondary)",
              marginBottom: "8px",
            }}
          >
            {t("commentLabel")}
          </label>
          <textarea
            id="comment"
            name="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="form-input"
            rows={4}
            placeholder={t("commentPlaceholder")}
            style={{
              width: "100%",
              minHeight: "110px",
              resize: "vertical",
              fontSize: "14px",
              lineHeight: "1.5",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{
            alignSelf: "flex-start",
            padding: "10px 24px",
            borderRadius: "8px",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {loading ? <span className="spinner" /> : <Send size={16} />}
          {loading ? t("submitting") : t("submitBtn")}
        </button>
      </form>
    </div>
  );
}
