"use client";

import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, style, ...props }, ref) => {
    return (
      <input
        ref={ref}
        style={{
          width: "100%",
          padding: "0.625rem 0.75rem",
          background: "#0a0f0d",
          border: `1px solid ${error ? "rgba(224, 122, 95, 0.5)" : "rgba(45, 106, 79, 0.2)"}`,
          borderRadius: "8px",
          color: "#e8efe6",
          fontFamily: "var(--font-body)",
          fontSize: "0.9rem",
          transition: "border-color 0.2s, box-shadow 0.2s",
          outline: "none",
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = error ? "#e07a5f" : "#40916c";
          e.currentTarget.style.boxShadow = `0 0 0 2px ${error ? "rgba(224, 122, 95, 0.2)" : "rgba(82, 183, 136, 0.2)"}`;
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error
            ? "rgba(224, 122, 95, 0.5)"
            : "rgba(45, 106, 79, 0.2)";
          e.currentTarget.style.boxShadow = "none";
          props.onBlur?.(e);
        }}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
