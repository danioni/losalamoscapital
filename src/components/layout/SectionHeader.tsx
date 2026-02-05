"use client";

import { HTMLAttributes, forwardRef } from "react";

interface SectionHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
}

export const SectionHeader = forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ title, subtitle, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: "2rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid rgba(45, 106, 79, 0.2)",
          ...style,
        }}
        {...props}
      >
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.6rem",
            fontWeight: 400,
            color: "#e8efe6",
          }}
        >
          {title}
        </h3>
        {subtitle && (
          <span
            style={{
              fontSize: "0.8rem",
              color: "#5a6e63",
              fontWeight: 500,
            }}
          >
            {subtitle}
          </span>
        )}
      </div>
    );
  }
);

SectionHeader.displayName = "SectionHeader";
