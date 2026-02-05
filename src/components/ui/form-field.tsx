"use client";

import { ReactNode, useId } from "react";

interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

export function FormField({
  label,
  error,
  hint,
  required,
  children,
}: FormFieldProps) {
  const id = useId();

  return (
    <div style={{ marginBottom: "1rem" }}>
      <label
        htmlFor={id}
        style={{
          display: "block",
          marginBottom: "0.5rem",
          color: "#5a6e63",
          fontSize: "0.7rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        {label}
        {required && (
          <span style={{ color: "#e07a5f", marginLeft: "0.25rem" }}>*</span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p
          style={{
            marginTop: "0.375rem",
            fontSize: "0.75rem",
            color: "#5a6e63",
          }}
        >
          {hint}
        </p>
      )}
      {error && (
        <p
          style={{
            marginTop: "0.375rem",
            fontSize: "0.75rem",
            color: "#e07a5f",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
