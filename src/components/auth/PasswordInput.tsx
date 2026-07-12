"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

interface Props {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  value: string;
  error?: string;
  autoComplete?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  strength?: { score: number; label: string } | null;
}

export function PasswordInput({
  id,
  name,
  label,
  placeholder,
  value,
  error,
  autoComplete,
  onChange,
  onBlur,
  strength,
}: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="form-group">
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <div className="input-icon-wrap">
        <Lock size={16} className="input-icon" />
        <input
          type={visible ? "text" : "password"}
          name={name}
          id={id}
          className={`form-input input-with-icon${error ? " error" : ""}`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          className="input-trailing-btn"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {strength && value.length > 0 && (
        <div className="password-strength">
          <div className="password-strength-bars">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`password-strength-bar ${i < strength.score ? `level-${strength.score}` : ""}`}
              />
            ))}
          </div>
          <span className="password-strength-label">{strength.label}</span>
        </div>
      )}
      {error && <div className="form-error">{error}</div>}
    </div>
  );
}
