"use client";

import type { LucideIcon } from "lucide-react";

interface Props {
  id: string;
  name: string;
  type?: string;
  label: string;
  placeholder?: string;
  value: string;
  error?: string;
  autoComplete?: string;
  icon: LucideIcon;
  onChange: (value: string) => void;
  onBlur: () => void;
}

export function FormInput({
  id,
  name,
  type = "text",
  label,
  placeholder,
  value,
  error,
  autoComplete,
  icon: Icon,
  onChange,
  onBlur,
}: Props) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <div className="input-icon-wrap">
        <Icon size={16} className="input-icon" />
        <input
          type={type}
          name={name}
          id={id}
          className={`form-input input-with-icon${error ? " error" : ""}`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          autoComplete={autoComplete}
        />
      </div>
      {error && <div className="form-error">{error}</div>}
    </div>
  );
}
