"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "newest";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (newSort === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", newSort);
    }

    // Reset to page 1 when sorting changes
    params.delete("page");

    router.push(`/products?${params.toString()}`);
  };

  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}
    >
      <label
        htmlFor="sort-select"
        style={{
          fontSize: "var(--font-size-sm)",
          color: "var(--color-text-secondary)",
          whiteSpace: "nowrap",
        }}
      >
        စီစဉ်ရန်:
      </label>
      <select
        id="sort-select"
        value={currentSort}
        onChange={handleChange}
        className="form-input"
        style={{
          padding: "0.4rem 2rem 0.4rem 0.8rem",
          fontSize: "var(--font-size-sm)",
        }}
      >
        <option value="newest">အသစ်ထွက်</option>
        <option value="price_asc">ဈေးနှုန်း အနည်းဆုံး</option>
        <option value="price_desc">ဈေးနှုန်း အများဆုံး</option>
      </select>
    </div>
  );
}
