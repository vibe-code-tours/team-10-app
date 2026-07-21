"use client";

import { deleteCategory } from "@/actions/admin/action-categories";
import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface DeleteCategoryButtonProps {
  id: string;
  name: string;
}

export default function DeleteCategoryButton({
  id,
  name,
}: DeleteCategoryButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    setError(null);
    startTransition(async () => {
      try {
        await deleteCategory(id);
        setIsOpen(false);
      } catch (err) {
        setError(
          "Failed to delete category: " +
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
        title="Delete Category"
      >
        <Trash2 size={16} />
      </button>

      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        title="Delete Category"
        message={
          <>
            Are you sure you want to delete the category &quot;
            <strong>{name}</strong>&quot;?
            <br />
            ဤအမျိုးအစားကို ဖျက်ရန် သေချာပါသလား?
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
