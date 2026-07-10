"use client";

import { useState } from "react";
import { submitReview } from "@/actions/shop/action-review";
import Link from "next/link";
import { Star } from "lucide-react";

interface Props {
  productId: string;
  isLoggedIn: boolean;
}

export default function ReviewForm({ productId, isLoggedIn }: Props) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
          Review ရေးရန်
        </h3>
        <p
          style={{
            color: "var(--color-text-secondary)",
            marginBottom: "var(--space-lg)",
            fontSize: "var(--font-size-sm)",
          }}
        >
          မှတ်ချက်ရေးရန်နှင့် အဆင့်သတ်မှတ်ရန် အကောင့်ဝင်ဖို့ လိုအပ်ပါတယ်။
        </p>
        <Link href="/login" className="btn btn-primary">
          အကောင့်ဝင်မည်
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
          ကျေးဇူးတင်ပါတယ်!
        </h3>
        <p
          style={{
            color: "var(--color-text-secondary)",
            fontSize: "var(--font-size-sm)",
          }}
        >
          သင့်ရဲ့ မှတ်ချက်ကို အောင်မြင်စွာ မှတ်တမ်းတင်ပြီးပါပြီ။
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
        Review ရေးရန်
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
            အဆင့်သတ်မှတ်ချက် (Rating)
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
            မှတ်ချက် (ရွေးချယ်နိုင်သည်)
          </label>
          <textarea
            id="comment"
            name="comment"
            className="form-input"
            rows={4}
            placeholder="ဒီပစ္စည်းအကြောင်း သင်ဘယ်လိုထင်လဲ..."
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ alignSelf: "flex-start" }}
        >
          {loading ? <span className="spinner" /> : null}
          {loading ? "ပို့ဆောင်နေသည်..." : "Review တင်မည်"}
        </button>
      </form>
    </div>
  );
}
