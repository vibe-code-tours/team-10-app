"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/actions/admin/action-orders";

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setLoading(true);

    await updateOrderStatus(orderId, newStatus);

    setLoading(false);
  }

  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}
    >
      <select
        value={status}
        onChange={handleChange}
        disabled={loading}
        className="form-input"
        style={{ padding: "0.5rem", width: "auto" }}
      >
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>
      {loading && (
        <span
          className="spinner"
          style={{ width: "16px", height: "16px", borderWidth: "2px" }}
        />
      )}
    </div>
  );
}
