/**
 * Lofi Theme Design Tokens
 */

// Shadcn Semantic Tokens - Auto dark mode support
export const theme = {
  // Background colors
  bg: {
    base: "bg-background", // Main background
    card: "bg-card", // Card background
    muted: "bg-muted", // Muted background
    accent: "bg-accent", // Accent background
    primary: "bg-primary", // Primary brand color
    secondary: "bg-secondary", // Secondary background
  },

  // Text colors
  text: {
    base: "text-foreground", // Main text
    card: "text-card-foreground", // Text on card
    muted: "text-muted-foreground", // Muted text
    accent: "text-accent-foreground", // Text on accent
    primary: "text-primary", // Primary brand text
  },

  // Border colors
  border: {
    default: "border-border", // Default border
    input: "border-input", // Input border
  },

  // Common patterns
  patterns: {
    card: "bg-card text-card-foreground border border-border rounded-lg",
    input: "bg-background border-input",
    button: {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      outline:
        "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
    },
  },
} as const;

// Export flattened tokens for convenience
export const { bg, text, border, patterns } = theme;

// Helper function để combine class names
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
