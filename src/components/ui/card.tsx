"use client";

import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hoverable = false, style, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          background: "#111a16",
          border: "1px solid rgba(45, 106, 79, 0.2)",
          borderRadius: "12px",
          transition: hoverable ? "all 0.3s ease" : undefined,
          ...style,
        }}
        onMouseEnter={(e) => {
          if (hoverable) {
            e.currentTarget.style.background = "#162320";
            e.currentTarget.style.borderColor = "rgba(45, 106, 79, 0.4)";
          }
          props.onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          if (hoverable) {
            e.currentTarget.style.background = "#111a16";
            e.currentTarget.style.borderColor = "rgba(45, 106, 79, 0.2)";
          }
          props.onMouseLeave?.(e);
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ style, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid rgba(45, 106, 79, 0.15)",
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ style, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          padding: "1.5rem",
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = "CardContent";

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ style, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          padding: "1rem 1.5rem",
          borderTop: "1px solid rgba(45, 106, 79, 0.15)",
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = "CardFooter";
