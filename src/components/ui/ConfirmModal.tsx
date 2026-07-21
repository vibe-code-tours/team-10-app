"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isPending?: boolean;
  error?: string | null;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isPending = false,
  error = null,
}: ConfirmModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="modal-backdrop"
        onClick={!isPending ? onClose : undefined}
      />
      <div className="modal">
        <div className="modal-header">
          <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>
            {title}
          </h3>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ padding: "0.25rem" }}
            onClick={onClose}
            disabled={isPending}
          >
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          <div style={{ margin: 0, color: "var(--color-text-secondary)" }}>
            {message}
          </div>
          {error && (
            <div
              style={{
                marginTop: "1rem",
                padding: "0.75rem",
                background: "var(--color-danger-light)",
                color: "var(--color-danger)",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.875rem",
              }}
            >
              {error}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            disabled={isPending}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isPending}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            {isPending ? <span className="spinner" /> : null}
            {confirmText}
          </button>
        </div>
      </div>
    </>
  );
}
