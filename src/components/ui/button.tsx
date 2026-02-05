"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: "#2d6a4f",
    color: "#e8efe6",
    border: "1px solid #2d6a4f",
  },
  secondary: {
    background: "rgba(82, 183, 136, 0.15)",
    color: "#52b788",
    border: "1px solid rgba(45, 106, 79, 0.3)",
  },
  outline: {
    background: "transparent",
    color: "#8a9e93",
    border: "1px solid rgba(45, 106, 79, 0.3)",
  },
  ghost: {
    background: "transparent",
    color: "#8a9e93",
    border: "1px solid transparent",
  },
  danger: {
    background: "rgba(224, 122, 95, 0.15)",
    color: "#e07a5f",
    border: "1px solid rgba(224, 122, 95, 0.3)",
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: {
    padding: "0.375rem 0.75rem",
    fontSize: "0.8rem",
  },
  md: {
    padding: "0.625rem 1.25rem",
    fontSize: "0.875rem",
  },
  lg: {
    padding: "0.875rem 1.75rem",
    fontSize: "1rem",
  },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyle: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      fontFamily: "var(--font-body)",
      fontWeight: 500,
      borderRadius: "8px",
      cursor: disabled || isLoading ? "not-allowed" : "pointer",
      opacity: disabled || isLoading ? 0.6 : 1,
      transition: "all 0.2s ease",
      ...variantStyles[variant],
      ...sizeStyles[size],
      ...style,
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        style={baseStyle}
        {...props}
      >
        {isLoading && (
          <span
            style={{
              width: "1em",
              height: "1em",
              border: "2px solid currentColor",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 0.6s linear infinite",
            }}
          />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
