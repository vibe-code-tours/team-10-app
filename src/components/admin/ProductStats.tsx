import { Package, AlertTriangle, TrendingDown, Layers } from "lucide-react";
import { getTranslations } from "next-intl/server";

interface Props {
  totalProducts: number;
  outOfStock: number;
  lowStock: number;
  totalStockSum: number;
}

export default async function ProductStats({
  totalProducts,
  outOfStock,
  lowStock,
  totalStockSum,
}: Props) {
  const t = await getTranslations("Admin.products");

  return (
    <div className="admin-stats-grid">
      <div className="admin-stat-card">
        <div className="admin-stat-info">
          <span className="admin-stat-label">{t("stats.totalProducts")}</span>
          <span className="admin-stat-value">{totalProducts}</span>
        </div>
        <div className="admin-stat-icon primary">
          <Package size={22} />
        </div>
      </div>

      <div className="admin-stat-card">
        <div className="admin-stat-info">
          <span className="admin-stat-label">{t("stats.outOfStock")}</span>
          <span
            className="admin-stat-value"
            style={{
              color: outOfStock > 0 ? "var(--color-danger)" : "inherit",
            }}
          >
            {outOfStock}
          </span>
        </div>
        <div className="admin-stat-icon danger">
          <AlertTriangle size={22} />
        </div>
      </div>

      <div className="admin-stat-card">
        <div className="admin-stat-info">
          <span className="admin-stat-label">{t("stats.lowStock")}</span>
          <span
            className="admin-stat-value"
            style={{ color: lowStock > 0 ? "var(--color-warning)" : "inherit" }}
          >
            {lowStock}
          </span>
        </div>
        <div className="admin-stat-icon warning">
          <TrendingDown size={22} />
        </div>
      </div>

      <div className="admin-stat-card">
        <div className="admin-stat-info">
          <span className="admin-stat-label">{t("stats.totalInventory")}</span>
          <span className="admin-stat-value">{totalStockSum}</span>
        </div>
        <div className="admin-stat-icon success">
          <Layers size={22} />
        </div>
      </div>
    </div>
  );
}
