"use client";

import { deleteProduct } from "@/actions/admin/action-products";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";

interface DeleteProductButtonProps {
  id: string;
  title: string;
}

export default function DeleteProductButton({
  id,
  title,
}: DeleteProductButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    const confirmed = confirm(
      `Are you sure you want to delete "${title}"?\nဤကုန်ပစ္စည်းကို ဖျက်ရန် သေချာပါသလား?`,
    );
    if (confirmed) {
      startTransition(async () => {
        try {
          await deleteProduct(id);
        } catch (error) {
          alert(
            "Failed to delete product: " +
              (error instanceof Error ? error.message : "Unknown error"),
          );
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="btn btn-sm btn-danger"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0.4rem",
        borderRadius: "var(--radius-md)",
      }}
      title="Delete Product"
    >
      <Trash2 size={16} />
    </button>
  );
}
