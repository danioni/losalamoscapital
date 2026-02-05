/**
 * Los Álamos Capital - Design System Colors
 * Sistema centralizado de colores para toda la aplicación
 */

export const colors = {
  // Backgrounds
  bg: {
    deep: "#0a0f0d",
    card: "#111a16",
    cardHover: "#162320",
  },

  // Borders
  border: {
    default: "rgba(45, 106, 79, 0.2)",
    hover: "rgba(45, 106, 79, 0.4)",
  },

  // Green palette (primary)
  green: {
    primary: "#2d6a4f",
    light: "#40916c",
    bright: "#52b788",
    pale: "#95d5b2",
    glow: "rgba(82, 183, 136, 0.15)",
  },

  // Accent colors
  gold: {
    default: "#d4a373",
    light: "#e6c9a8",
  },

  red: {
    default: "#e07a5f",
  },

  // Text
  text: {
    primary: "#e8efe6",
    secondary: "#8a9e93",
    muted: "#5a6e63",
  },
} as const;

// Semantic color mappings for components
export const semanticColors = {
  success: {
    bg: "rgba(82, 183, 136, 0.15)",
    text: colors.green.bright,
    border: "rgba(82, 183, 136, 0.3)",
  },
  warning: {
    bg: "rgba(212, 163, 115, 0.15)",
    text: colors.gold.default,
    border: "rgba(212, 163, 115, 0.3)",
  },
  danger: {
    bg: "rgba(224, 122, 95, 0.15)",
    text: colors.red.default,
    border: "rgba(224, 122, 95, 0.3)",
  },
  info: {
    bg: "rgba(100, 149, 237, 0.15)",
    text: "#6495ed",
    border: "rgba(100, 149, 237, 0.3)",
  },
  neutral: {
    bg: "rgba(138, 158, 147, 0.15)",
    text: colors.text.secondary,
    border: "rgba(138, 158, 147, 0.3)",
  },
} as const;

// Component-specific styles
export const componentStyles = {
  input: {
    background: colors.bg.deep,
    border: colors.border.default,
    borderFocus: colors.green.light,
    borderError: "rgba(224, 122, 95, 0.5)",
    text: colors.text.primary,
    placeholder: colors.text.muted,
  },
  button: {
    primary: {
      background: colors.green.primary,
      backgroundHover: colors.green.light,
      text: colors.text.primary,
    },
    secondary: {
      background: colors.green.glow,
      text: colors.green.bright,
      border: "rgba(45, 106, 79, 0.3)",
    },
  },
  card: {
    background: colors.bg.card,
    backgroundHover: colors.bg.cardHover,
    border: colors.border.default,
    borderHover: colors.border.hover,
  },
} as const;
