"use client";

import { HTMLAttributes, forwardRef } from "react";

type StackDirection = "vertical" | "horizontal";
type StackAlign = "start" | "center" | "end" | "stretch";
type StackJustify = "start" | "center" | "end" | "between" | "around";
type StackGap = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: StackDirection;
  align?: StackAlign;
  justify?: StackJustify;
  gap?: StackGap;
  wrap?: boolean;
}

const alignValues: Record<StackAlign, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
};

const justifyValues: Record<StackJustify, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  between: "space-between",
  around: "space-around",
};

const gapValues: Record<StackGap, string> = {
  none: "0",
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
};

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      direction = "vertical",
      align = "stretch",
      justify = "start",
      gap = "md",
      wrap = false,
      style,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        style={{
          display: "flex",
          flexDirection: direction === "vertical" ? "column" : "row",
          alignItems: alignValues[align],
          justifyContent: justifyValues[justify],
          gap: gapValues[gap],
          flexWrap: wrap ? "wrap" : "nowrap",
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Stack.displayName = "Stack";
