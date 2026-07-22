import { createClient } from "@/lib/supabase/server";
import { getAllCommissionRates } from "@/services/commission.service";
import {
  upsertCommissionRate,
  deleteCommissionRate,
} from "@/actions/admin/action-commission";
import { getCategories } from "@/services/product.service";
import { Percent, Trash2 } from "lucide-react";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function CommissionSettingsPage() {
  const supabase = await createClient();
  const [rates, dbCategories] = await Promise.all([
    getAllCommissionRates(supabase),
    getCategories(supabase),
  ]);

  // Categories not yet having a specific rate
  const ratedCategories = new Set(
    rates.filter((r) => r.category).map((r) => r.category),
  );
  const availableCategories = dbCategories.filter(
    (c) => !ratedCategories.has(c.slug),
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-lg)",
      }}
    >
      <div>
        <h1 className="admin-title">Commission Settings</h1>
        <p className="admin-description">
          Set platform commission rates per category. Falls back to global
          default if no category rate set.
        </p>
      </div>

      {/* Current Rates */}
      <div className="admin-card">
        <div
          style={{
            padding: "var(--space-md) var(--space-lg)",
            borderBottom: "1px solid var(--color-border)",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Percent size={18} style={{ color: "var(--color-primary)" }} />
          Current Rates
        </div>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Rate (%)</th>
                <th>Last Updated</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {rates.map((r) => (
                <tr key={r.id}>
                  <td>
                    <span style={{ fontWeight: r.category ? 400 : 700 }}>
                      {r.category ?? "🌐 Global Default"}
                    </span>
                  </td>
                  <td>
                    <form
                      action={async (fd: FormData) => {
                        "use server";
                        await upsertCommissionRate({}, fd);
                      }}
                      style={{
                        display: "flex",
                        gap: "6px",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="hidden"
                        name="category"
                        value={r.category ?? "global"}
                      />
                      <input
                        name="rate"
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        defaultValue={r.rate}
                        className="form-input"
                        style={{
                          width: "80px",
                          padding: "4px 8px",
                          fontSize: "13px",
                        }}
                        required
                      />
                      <button type="submit" className="btn btn-sm btn-primary">
                        Save
                      </button>
                    </form>
                  </td>
                  <td
                    style={{
                      fontSize: "12px",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {new Date(r.updated_at).toLocaleDateString()}
                  </td>
                  <td>—</td>
                  <td>
                    {r.category && (
                      <form
                        action={async () => {
                          "use server";
                          await deleteCommissionRate(r.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="btn btn-sm btn-danger"
                          style={{ padding: "4px 8px" }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Category Rate */}
      {availableCategories.length > 0 && (
        <div className="admin-card">
          <div
            style={{
              padding: "var(--space-md) var(--space-lg)",
              borderBottom: "1px solid var(--color-border)",
              fontWeight: 600,
            }}
          >
            Add Category Rate
          </div>
          <div style={{ padding: "var(--space-lg)" }}>
            <form
              action={async (fd: FormData) => {
                "use server";
                await upsertCommissionRate({}, fd);
              }}
              style={{
                display: "flex",
                gap: "var(--space-md)",
                alignItems: "flex-end",
                flexWrap: "wrap",
              }}
            >
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Category</label>
                <select name="category" className="form-input" required>
                  <option value="">Select category...</option>
                  {availableCategories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Rate (%)</label>
                <input
                  name="rate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="5.00"
                  className="form-input"
                  style={{ width: "100px" }}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Add Rate
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
