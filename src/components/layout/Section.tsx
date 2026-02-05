"use client";

import { HTMLAttributes, forwardRef } from "react";

type SectionPadding = "none" | "sm" | "md" | "lg" | "xl";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  padding?: SectionPadding;
}

const paddingValues: Record<SectionPadding, string> = {
  none: "0",
  sm: "1.5rem 0",
  md: "3rem 0",
  lg: "4rem 0",
  xl: "6rem 0",
};

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ padding = "md", style, children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        style={{
          padding: paddingValues[padding],
          ...style,
        }}
        {...props}
      >
        {children}
      </section>
    );
  }
);

Section.displayName = "Section";
