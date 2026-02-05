"use client";

import { HTMLAttributes, forwardRef } from "react";

type MaxWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  maxWidth?: MaxWidth;
}

const maxWidthValues: Record<MaxWidth, string> = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1200px",
  "2xl": "1400px",
  full: "100%",
};

export const PageContainer = forwardRef<HTMLDivElement, PageContainerProps>(
  ({ maxWidth = "xl", style, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          width: "100%",
          maxWidth: maxWidthValues[maxWidth],
          margin: "0 auto",
          padding: "0 2rem",
          position: "relative",
          zIndex: 1,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

PageContainer.displayName = "PageContainer";
