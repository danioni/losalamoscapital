"use client";

import { HTMLAttributes, forwardRef } from "react";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  default: {
    background: "rgba(138, 158, 147, 0.15)",
    color: "#8a9e93",
    borderColor: "rgba(138, 158, 147, 0.3)",
  },
  success: {
    background: "rgba(82, 183, 136, 0.15)",
    color: "#52b788",
    borderColor: "rgba(82, 183, 136, 0.3)",
  },
  warning: {
    background: "rgba(212, 163, 115, 0.15)",
    color: "#d4a373",
    borderColor: "rgba(212, 163, 115, 0.3)",
  },
  danger: {
    background: "rgba(224, 122, 95, 0.15)",
    color: "#e07a5f",
    borderColor: "rgba(224, 122, 95, 0.3)",
  },
  info: {
    background: "rgba(100, 149, 237, 0.15)",
    color: "#6495ed",
    borderColor: "rgba(100, 149, 237, 0.3)",
  },
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", style, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "0.25rem 0.625rem",
          fontSize: "0.7rem",
          fontWeight: 600,
          fontFamily: "var(--font-mono)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          borderRadius: "6px",
          border: "1px solid",
          ...variantStyles[variant],
          ...style,
        }}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
