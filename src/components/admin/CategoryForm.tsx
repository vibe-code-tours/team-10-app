"use client";

import { useState, useTransition } from "react";
import {
  createCategory,
  updateCategory,
} from "@/actions/admin/action-categories";
import { Link } from "@/i18n/routing";

type Category = {
  id?: string;
  name: string;
  slug: string;
};

export default function CategoryForm({ category }: { category?: Category }) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(category?.name || "");
  const [slug, setSlug] = useState(category?.slug || "");
  const [errorMsg, setErrorMsg] = useState("");

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // remove invalid chars
      .replace(/\s+/g, "-") // replace spaces with hyphens
      .replace(/-+/g, "-") // collapse multiple hyphens
      .trim();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!category?.id) {
      setSlug(slugify(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    const formData = new FormData();
    formData.set("name", name);
    formData.set("slug", slug);

    startTransition(async () => {
      try {
        if (category?.id) {
          await updateCategory(category.id, formData);
        } else {
          await createCategory(formData);
        }
      } catch (error) {
        setErrorMsg(
          error instanceof Error ? error.message : "Failed to save category.",
        );
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card card-body"
      style={{ maxWidth: "600px" }}
    >
      {errorMsg && (
        <div
          className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm border border-red-200"
          style={{
            color: "var(--color-danger)",
            background: "rgba(197,48,48,0.06)",
            borderColor: "rgba(197,48,48,0.12)",
            padding: "0.75rem",
            borderRadius: "var(--radius-md)",
            marginBottom: "1rem",
          }}
        >
          {errorMsg}
        </div>
      )}

      <div
        className="form-group mb-md"
        style={{ marginBottom: "var(--space-md)" }}
      >
        <label
          className="form-label"
          htmlFor="name"
          style={{
            display: "block",
            marginBottom: "var(--space-xs)",
            fontWeight: 500,
          }}
        >
          Category Name
        </label>
        <input
          type="text"
          className="form-input"
          id="name"
          value={name}
          onChange={handleNameChange}
          required
          minLength={2}
          placeholder="e.g. Computers"
        />
      </div>

      <div
        className="form-group mb-md"
        style={{ marginBottom: "var(--space-md)" }}
      >
        <label
          className="form-label"
          htmlFor="slug"
          style={{
            display: "block",
            marginBottom: "var(--space-xs)",
            fontWeight: 500,
          }}
        >
          Slug (URL identifier)
        </label>
        <input
          type="text"
          className="form-input"
          id="slug"
          value={slug}
          onChange={(e) => setSlug(slugify(e.target.value))}
          required
          minLength={2}
          placeholder="e.g. computers"
        />
        <span
          style={{
            fontSize: "11px",
            color: "var(--color-text-tertiary)",
            marginTop: "4px",
            display: "block",
          }}
        >
          Slugs should contain only lowercase letters, numbers, and hyphens.
        </span>
      </div>

      <div
        style={{
          display: "flex",
          gap: "var(--space-sm)",
          marginTop: "var(--space-lg)",
        }}
      >
        <button type="submit" className="btn btn-primary" disabled={isPending}>
          {isPending ? "Saving..." : "Save Category"}
        </button>
        <Link href="/admin/categories" className="btn btn-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
}
