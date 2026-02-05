import { CSSProperties } from "react";

export function Logo({ style, className }: { style?: CSSProperties; className?: string }) {
  return (
    <svg
      style={style}
      className={className}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 4 C14 10, 8 14, 8 22 C8 28, 12 32, 18 32 C24 32, 28 28, 28 22 C28 14, 22 10, 18 4Z"
        fill="none"
        stroke="#2d6a4f"
        strokeWidth="1.5"
      />
      <path
        d="M18 8 C15 13, 11 16, 11 22 C11 26, 14 29, 18 29 C22 29, 25 26, 25 22 C25 16, 21 13, 18 8Z"
        fill="rgba(45,106,79,0.2)"
        stroke="#40916c"
        strokeWidth="1"
      />
      <line
        x1="18"
        y1="14"
        x2="18"
        y2="28"
        stroke="#52b788"
        strokeWidth="1"
        opacity="0.6"
      />
      <line
        x1="14"
        y1="20"
        x2="18"
        y2="16"
        stroke="#52b788"
        strokeWidth="0.8"
        opacity="0.4"
      />
      <line
        x1="22"
        y1="21"
        x2="18"
        y2="17"
        stroke="#52b788"
        strokeWidth="0.8"
        opacity="0.4"
      />
    </svg>
  );
}
