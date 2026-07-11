"use client";

import { deleteCategory } from "@/actions/admin/action-categories";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";

interface DeleteCategoryButtonProps {
  id: string;
  name: string;
}

export default function DeleteCategoryButton({ id, name }: DeleteCategoryButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    const confirmed = confirm(`Are you sure you want to delete the category "${name}"?\nဤအမျိုးအစားကို ဖျက်ရန် သေချာပါသလား?`);
    if (confirmed) {
      startTransition(async () => {
        try {
          await deleteCategory(id);
        } catch (error) {
          alert("Failed to delete category: " + (error instanceof Error ? error.message : "Unknown error"));
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
        borderRadius: "var(--radius-md)"
      }}
      title="Delete Category"
    >
      <Trash2 size={16} />
    </button>
  );
}
