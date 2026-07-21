import React from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  showScore?: boolean;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 16,
  showScore = false,
}: StarRatingProps) {
  const roundedRating = Math.round(rating * 10) / 10;

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
      <div style={{ display: "flex", gap: "2px", color: "#FACC15" }}>
        {[...Array(maxRating)].map((_, i) => (
          <Star
            key={i}
            size={size}
            fill={i < Math.floor(rating) ? "#FACC15" : "none"}
            stroke={i < Math.floor(rating) ? "none" : "#e5e7eb"}
          />
        ))}
      </div>
      {showScore && (
        <span
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "var(--color-text)",
            marginLeft: "2px",
          }}
        >
          {roundedRating}
        </span>
      )}
    </div>
  );
}
