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

export default function ProductForm({ product }: { product?: Product }) {
  const [isPending, startTransition] = useTransition();
  const [inputType, setInputType] = useState<"url" | "file">("url");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
      className="card card-body"
      style={{ maxWidth: "800px" }}
    >
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm border border-red-200">
          {errorMsg}
        </div>
      )}

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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "var(--space-md)",
          marginBottom: "var(--space-md)",
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
            defaultValue={product?.category || "electronics"}
            required
          >
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="accessories">Accessories</option>
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

      <div className="form-group mb-md">
        <div className="flex items-center justify-between mb-2">
          <label className="form-label mb-0">Product Image</label>
          <div className="flex gap-2 text-sm bg-[var(--color-surface-hover)] p-1 rounded-md">
            <button
              type="button"
              className={`px-3 py-1 rounded-sm ${inputType === "url" ? "bg-[var(--color-surface)] shadow-sm font-medium" : "text-secondary"}`}
              onClick={() => setInputType("url")}
            >
              Paste URL
            </button>
            <button
              type="button"
              className={`px-3 py-1 rounded-sm ${inputType === "file" ? "bg-[var(--color-surface)] shadow-sm font-medium" : "text-secondary"}`}
              onClick={() => setInputType("file")}
            >
              Upload File
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
          />
        ) : (
          <div className="border-2 border-dashed border-[var(--color-border-light)] p-6 rounded-md text-center">
            <input
              type="file"
              id="image_file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <label
              htmlFor="image_file"
              className="btn btn-secondary cursor-pointer inline-block mb-2"
            >
              Select Image
            </label>
            <p className="text-sm text-secondary">
              {file ? file.name : "or drag and drop a file here"}
            </p>
          </div>
        )}
      </div>

      <div className="form-group mb-lg">
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

      <div
        className="flex justify-end gap-sm"
        style={{
          paddingTop: "var(--space-lg)",
          borderTop: "1px solid var(--color-border-light)",
        }}
      >
        <Link href="/admin/products" className="btn btn-ghost">
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
