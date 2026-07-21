"use client";

import { useState, useTransition } from "react";
import { Link } from "@/i18n/routing";
import { Edit, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import DeleteProductButton from "./DeleteProductButton";
import { deleteProducts } from "@/actions/admin/action-products";

export default function ProductTableClient({
  products,
  currentQueryString,
}: {
  products: any[];
  currentQueryString: string;
}) {
  const t = useTranslations("Admin.products");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, startTransition] = useTransition();

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(products.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const handleBulkDelete = () => {
    if (
      confirm(`Are you sure you want to delete ${selectedIds.length} products?`)
    ) {
      startTransition(async () => {
        try {
          await deleteProducts(selectedIds);
          setSelectedIds([]);
        } catch (error) {
          alert("Failed to delete products");
        }
      });
    }
  };

  return (
    <div className="table-wrapper">
      {selectedIds.length > 0 && (
        <div
          style={{
            padding: "var(--space-md)",
            background: "var(--color-danger-light)",
            borderBottom: "1px solid var(--color-danger)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ color: "var(--color-danger)", fontWeight: "bold" }}>
            {selectedIds.length} products selected
          </span>
          <button
            className="btn btn-danger btn-sm flex items-center"
            onClick={handleBulkDelete}
            disabled={isDeleting}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <Trash2 size={16} />
            {isDeleting ? "Deleting..." : "Delete Selected"}
          </button>
        </div>
      )}
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: "40px", textAlign: "center" }}>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={
                  products.length > 0 && selectedIds.length === products.length
                }
                style={{ cursor: "pointer" }}
              />
            </th>
            <th style={{ width: "80px" }}>{t("table.image")}</th>
            <th>{t("table.product")}</th>
            <th>{t("table.category")}</th>
            <th>{t("table.price")}</th>
            <th>{t("table.stock")}</th>
            <th className="text-right" style={{ width: "120px" }}>
              {t("table.actions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {!products || products.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="text-center p-8 text-secondary"
                style={{ padding: "3rem" }}
              >
                {t("table.noProducts")}
              </td>
            </tr>
          ) : (
            products.map((product) => {
              let stockBadgeClass = "badge-success";
              let stockStatusText = t("table.statusInStock");

              if (product.stock === 0) {
                stockBadgeClass = "badge-danger";
                stockStatusText = t("table.statusOutOfStock");
              } else if (product.stock < 10) {
                stockBadgeClass = "badge-warning";
                stockStatusText = t("table.statusLowStock");
              }

              return (
                <tr key={product.id} className="table-row-hover">
                  <td style={{ textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(product.id)}
                      onChange={(e) =>
                        handleSelect(product.id, e.target.checked)
                      }
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                  <td>
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.title || "Product image"}
                        className="table-img"
                      />
                    ) : (
                      <div className="table-img-placeholder">ပုံမရှိပါ</div>
                    )}
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <span
                        className="font-bold"
                        style={{
                          fontSize: "var(--font-size-base)",
                          color: "var(--color-text)",
                        }}
                      >
                        {product.title}
                      </span>
                      {product.brand && (
                        <span
                          style={{
                            fontSize: "var(--font-size-xs)",
                            color: "var(--color-text-secondary)",
                          }}
                        >
                          Brand: {product.brand}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        background: "var(--color-bg-secondary)",
                        color: "var(--color-text-secondary)",
                        textTransform: "capitalize",
                      }}
                    >
                      {product.category}
                    </span>
                  </td>
                  <td
                    className="font-bold"
                    style={{ color: "var(--color-primary)" }}
                  >
                    ${product.price.toFixed(2)}
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        alignItems: "flex-start",
                      }}
                    >
                      <span className={`badge ${stockBadgeClass}`}>
                        {product.stock} {t("table.pcs")}
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          color: "var(--color-text-tertiary)",
                        }}
                      >
                        {stockStatusText}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex justify-end gap-sm">
                      <Link
                        href={`/admin/products/${product.id}/edit${currentQueryString}`}
                        className="btn btn-sm btn-secondary"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "0.4rem",
                          borderRadius: "var(--radius-md)",
                        }}
                        title="Edit Product"
                      >
                        <Edit size={16} />
                      </Link>
                      <DeleteProductButton
                        id={product.id}
                        title={product.title}
                      />
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
