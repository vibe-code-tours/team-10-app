"use client";

import { useState, useTransition } from "react";
import { createProduct, updateProduct } from "@/actions/admin/action-products";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Product = {
  id?: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
};

type CategoryOption = {
  id: string;
  name: string;
  slug: string;
};

export default function ProductForm({
  product,
  categories = [],
  returnUrl = "/admin/products",
}: {
  product?: Product;
  categories?: CategoryOption[];
  returnUrl?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [inputType, setInputType] = useState<"url" | "file">("url");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    product?.image_url || null,
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    const formData = new FormData(e.currentTarget);

    let finalImageUrl = formData.get("image_url") as string;

    if (inputType === "file" && file) {
      setUploading(true);
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, { upsert: true });

      if (error) {
        console.error("Upload error:", error);
        setErrorMsg(
          "Failed to upload image. Please check your storage bucket policies.",
        );
        setUploading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("product-images").getPublicUrl(filePath);

      finalImageUrl = publicUrl;
      formData.set("image_url", finalImageUrl);
      setUploading(false);
    }

    startTransition(() => {
      if (product?.id) {
        updateProduct(product.id, formData);
      } else {
        createProduct(formData);
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-lg"
      style={{ maxWidth: "1000px", margin: "0 auto", width: "100%" }}
    >
      {errorMsg && (
        <div
          style={{
            padding: "1rem",
            background: "var(--color-danger-light)",
            color: "var(--color-danger)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-danger)",
          }}
        >
          {errorMsg}
        </div>
      )}

      <input type="hidden" name="returnUrl" value={returnUrl} />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-lg)",
          alignItems: "flex-start",
        }}
      >
        {/* Left Column */}
        <div
          style={{
            flex: "2 1 400px",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-lg)",
          }}
        >
          {/* Basic Information */}
          <div className="card card-body">
            <h3
              style={{
                fontSize: "var(--font-size-lg)",
                fontWeight: 600,
                marginBottom: "var(--space-md)",
                paddingBottom: "var(--space-sm)",
                borderBottom: "1px solid var(--color-border-light)",
              }}
            >
              Basic Information
            </h3>
            <div className="form-group mb-md">
              <label className="form-label" htmlFor="title">
                Title
              </label>
              <input
                className="form-input"
                id="title"
                name="title"
                defaultValue={product?.title}
                required
                minLength={3}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="description">
                Description
              </label>
              <textarea
                className="form-input"
                style={{ minHeight: "120px" }}
                id="description"
                name="description"
                defaultValue={product?.description}
              />
            </div>
          </div>

          {/* Organization & Inventory */}
          <div className="card card-body">
            <h3
              style={{
                fontSize: "var(--font-size-lg)",
                fontWeight: 600,
                marginBottom: "var(--space-md)",
                paddingBottom: "var(--space-sm)",
                borderBottom: "1px solid var(--color-border-light)",
              }}
            >
              Organization & Inventory
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "var(--space-lg)",
              }}
            >
              <div className="form-group">
                <label className="form-label" htmlFor="category">
                  Category
                </label>
                <select
                  className="form-input"
                  id="category"
                  name="category"
                  defaultValue={product?.category || ""}
                  required
                >
                  <option value="" disabled>
                    Select a Category...
                  </option>
                  {categories.map((cat) => (
                    <option
                      key={cat.id}
                      value={cat.slug}
                      style={{ textTransform: "capitalize" }}
                    >
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="price">
                  Price ($)
                </label>
                <input
                  className="form-input"
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={product?.price}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="stock">
                  Stock
                </label>
                <input
                  className="form-input"
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  defaultValue={product?.stock ?? 1}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div
          style={{
            flex: "1 1 300px",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-lg)",
          }}
        >
          {/* Media */}
          <div className="card card-body">
            <h3
              style={{
                fontSize: "var(--font-size-lg)",
                fontWeight: 600,
                marginBottom: "var(--space-md)",
                paddingBottom: "var(--space-sm)",
                borderBottom: "1px solid var(--color-border-light)",
              }}
            >
              Media
            </h3>
            <div className="form-group">
              <div className="flex items-center justify-between mb-sm">
                <label className="form-label mb-0">Product Image</label>
                <div
                  style={{
                    display: "flex",
                    gap: "4px",
                    background: "var(--color-surface-hover)",
                    padding: "4px",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <button
                    type="button"
                    style={{
                      padding: "4px 12px",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "var(--font-size-xs)",
                      fontWeight: inputType === "url" ? 600 : 400,
                      background:
                        inputType === "url"
                          ? "var(--color-surface)"
                          : "transparent",
                      boxShadow:
                        inputType === "url" ? "var(--shadow-sm)" : "none",
                      color:
                        inputType === "url"
                          ? "var(--color-text)"
                          : "var(--color-text-secondary)",
                    }}
                    onClick={() => setInputType("url")}
                  >
                    URL
                  </button>
                  <button
                    type="button"
                    style={{
                      padding: "4px 12px",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "var(--font-size-xs)",
                      fontWeight: inputType === "file" ? 600 : 400,
                      background:
                        inputType === "file"
                          ? "var(--color-surface)"
                          : "transparent",
                      boxShadow:
                        inputType === "file" ? "var(--shadow-sm)" : "none",
                      color:
                        inputType === "file"
                          ? "var(--color-text)"
                          : "var(--color-text-secondary)",
                    }}
                    onClick={() => setInputType("file")}
                  >
                    File
                  </button>
                </div>
              </div>

              {inputType === "url" ? (
                <input
                  className="form-input"
                  id="image_url"
                  name="image_url"
                  type="url"
                  defaultValue={product?.image_url}
                  placeholder="https://example.com/image.jpg"
                  onChange={(e) => setPreviewUrl(e.target.value)}
                />
              ) : (
                <div
                  style={{
                    border: "2px dashed var(--color-border-light)",
                    padding: "var(--space-md)",
                    borderRadius: "var(--radius-md)",
                    textAlign: "center",
                    background: "var(--color-surface-hover)",
                  }}
                >
                  <input
                    type="file"
                    id="image_file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0] || null;
                      setFile(selectedFile);
                      if (selectedFile) {
                        setPreviewUrl(URL.createObjectURL(selectedFile));
                      }
                    }}
                  />
                  <label
                    htmlFor="image_file"
                    className="btn btn-secondary mb-sm"
                    style={{
                      cursor: "pointer",
                      padding: "0.4rem 0.8rem",
                      fontSize: "var(--font-size-xs)",
                    }}
                  >
                    Select Image
                  </label>
                  <p className="text-secondary" style={{ fontSize: "11px" }}>
                    {file ? file.name : "or drop here"}
                  </p>
                </div>
              )}

              {previewUrl && (
                <div
                  style={{
                    marginTop: "var(--space-md)",
                    border: "1px solid var(--color-border-light)",
                    borderRadius: "var(--radius-md)",
                    padding: "var(--space-sm)",
                    background: "var(--color-surface-hover)",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{
                      width: "100%",
                      maxWidth: "200px",
                      height: "180px",
                      objectFit: "contain",
                      borderRadius: "var(--radius-sm)",
                      background: "var(--color-surface)",
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="%23ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <input type="hidden" name="returnUrl" value={returnUrl} />
      <div className="flex justify-between items-center mt-sm mb-lg">
        <Link href={returnUrl} className="btn btn-ghost">
          Cancel
        </Link>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isPending || uploading}
        >
          {uploading
            ? "Uploading Image..."
            : isPending
              ? "Saving..."
              : product?.id
                ? "Update Product"
                : "Create Product"}
        </button>
      </div>
    </form>
  );
}
