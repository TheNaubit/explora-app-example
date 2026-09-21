/**
 * Shared design tokens for StyleSheet usage.
 * Keep `StyleSheet.create` at the bottom of each component file.
 *
 * Light and dark palettes are required (see AGENTS.md). Extend with a dark set and
 * select via the system color scheme — do not ship UI that only works in one mode.
 */
export const colors = {
  background: "#FFFFFF",
  backgroundMuted: "#F2F2F7",
  text: "#111111",
  textSecondary: "#6B6B6B",
  border: "#E5E5EA",
  tint: "#208AEF",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const typography = {
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    lineHeight: 34,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    lineHeight: 22,
  },
  caption: {
    fontSize: 13,
    fontWeight: "400" as const,
    lineHeight: 18,
  },
} as const;
