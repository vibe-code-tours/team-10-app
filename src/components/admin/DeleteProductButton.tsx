"use client";

import { deleteProduct } from "@/actions/admin/action-products";
import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface DeleteProductButtonProps {
  id: string;
  title: string;
}

export default function DeleteProductButton({
  id,
  title,
}: DeleteProductButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    setError(null);
    startTransition(async () => {
      try {
        await deleteProduct(id);
        setIsOpen(false);
      } catch (err) {
        setError(
          "Failed to delete product: " +
            (err instanceof Error ? err.message : "Unknown error"),
        );
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
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

      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        title="Delete Product"
        message={
          <>
            Are you sure you want to delete &quot;<strong>{title}</strong>
            &quot;?
            <br />
            ဤကုန်ပစ္စည်းကို ဖျက်ရန် သေချာပါသလား?
          </>
        }
        confirmText="Delete"
        cancelText="Cancel"
        isPending={isPending}
        error={error}
      />
    </>
  );
}
