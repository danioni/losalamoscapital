"use client";

import { HTMLAttributes, forwardRef } from "react";

type GridCols = 1 | 2 | 3 | 4 | 5 | 6;
type GridGap = "none" | "xs" | "sm" | "md" | "lg" | "xl";

interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: GridCols;
  gap?: GridGap;
}

const gapValues: Record<GridGap, string> = {
  none: "0",
  xs: "0.5rem",
  sm: "0.75rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
};

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ cols = 2, gap = "md", style, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: gapValues[gap],
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = "Grid";
