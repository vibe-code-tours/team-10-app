"use client";

import { useState, useTransition, useRef } from "react";
import {
  createCategory,
  updateCategory,
} from "@/actions/admin/action-categories";
import { useRouter, Link } from "@/i18n/routing";
import { UploadCloud, Image as ImageIcon, Trash2, X, FileImage } from "lucide-react";

type Category = {
  id?: string;
  name: string;
  slug: string;
  image_url?: string | null;
};

export default function CategoryForm({ category }: { category?: Category }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(category?.name || "");
  const [slug, setSlug] = useState(category?.slug || "");
  const [imageUrl, setImageUrl] = useState<string>(category?.image_url || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isImageRemoved, setIsImageRemoved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      setFilePreview(null);
      return;
    }
    setSelectedFile(file);
    setIsImageRemoved(false);
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setFilePreview(url);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setImageUrl("");
    setIsImageRemoved(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    const formData = new FormData();
    formData.set("name", name);
    formData.set("slug", slug);
    formData.set("image_url", imageUrl);
    formData.set("remove_image", isImageRemoved ? "true" : "false");

    if (selectedFile) {
      formData.set("category_image", selectedFile);
    }

    startTransition(async () => {
      try {
        let res;
        if (category?.id) {
          res = await updateCategory(category.id, formData);
        } else {
          res = await createCategory(formData);
        }
        if (res?.success) {
          router.push("/admin/categories");
          router.refresh();
        }
      } catch (error) {
        setErrorMsg(
          error instanceof Error ? error.message : "Failed to save category.",
        );
      }
    });
  };

  const activeImage = filePreview || (!isImageRemoved ? imageUrl : "");

  return (
    <form
      onSubmit={handleSubmit}
      className="card card-body"
      style={{ maxWidth: "600px" }}
      encType="multipart/form-data"
    >
      {errorMsg && (
        <div
          style={{
            color: "var(--color-danger)",
            background: "rgba(197,48,48,0.06)",
            borderColor: "rgba(197,48,48,0.12)",
            padding: "0.75rem",
            borderRadius: "var(--radius-md)",
            marginBottom: "1rem",
            fontSize: "13px",
          }}
        >
          {errorMsg}
        </div>
      )}

      {/* Category Name */}
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
            fontWeight: 600,
            fontSize: "13px",
          }}
        >
          Category Name *
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
          style={{ fontSize: "13px", height: "36px" }}
        />
      </div>

      {/* Slug */}
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
            fontWeight: 600,
            fontSize: "13px",
          }}
        >
          Slug (URL identifier) *
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
          style={{ fontSize: "13px", height: "36px" }}
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

      {/* Category Image Uploader */}
      <div
        className="form-group mb-md"
        style={{ marginBottom: "var(--space-md)" }}
      >
        <label
          className="form-label"
          style={{
            display: "block",
            marginBottom: "var(--space-xs)",
            fontWeight: 600,
            fontSize: "13px",
          }}
        >
          Category Thumbnail Image
        </label>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileSelect(e.target.files[0]);
            }
          }}
          style={{ display: "none" }}
        />

        {activeImage ? (
          /* Active Image Preview with Remove Button */
          <div
            style={{
              padding: "12px",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              background: "var(--color-surface)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <img
                src={activeImage}
                alt="Category Preview"
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "8px",
                  objectFit: "cover",
                  border: "1px solid var(--color-border)",
                }}
              />
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-text)" }}>
                  {selectedFile ? selectedFile.name : "Category Image Attached"}
                </div>
                <div style={{ fontSize: "11px", color: "var(--color-text-secondary)", marginTop: "2px" }}>
                  Displayed on Homepage grid &amp; category listings
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemoveImage}
              className="btn btn-secondary btn-sm"
              style={{
                color: "var(--color-danger)",
                fontSize: "12px",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "6px 12px",
              }}
            >
              <Trash2 size={14} /> Remove Image
            </button>
          </div>
        ) : (
          /* Dropzone Upload Box */
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: "2px dashed var(--color-border)",
              borderRadius: "var(--radius-md)",
              background: "var(--color-bg)",
              padding: "20px 16px",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "var(--color-primary-ghost)",
                color: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <UploadCloud size={20} />
            </div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-text)" }}>
                Click to upload category image, or drag &amp; drop
              </div>
              <div style={{ fontSize: "11px", color: "var(--color-text-secondary)", marginTop: "2px" }}>
                Supports PNG, JPG, WEBP, SVG (Max file size: 5MB)
              </div>
            </div>
          </div>
        )}

        {/* Optional Image URL Input */}
        <div style={{ marginTop: "10px" }}>
          <label style={{ fontSize: "11.5px", color: "var(--color-text-secondary)", display: "block", marginBottom: "4px" }}>
            Or paste direct image URL (Optional):
          </label>
          <input
            type="url"
            className="form-input"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setIsImageRemoved(false);
            }}
            placeholder="https://example.com/category-thumb.jpg"
            style={{ fontSize: "12px", height: "32px" }}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "var(--space-sm)",
          marginTop: "var(--space-lg)",
        }}
      >
        <button type="submit" className="btn btn-primary" disabled={isPending}>
          {isPending ? "Saving Category..." : "Save Category"}
        </button>
        <Link href="/admin/categories" className="btn btn-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
}
