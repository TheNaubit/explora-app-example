import { useColorScheme } from "react-native";

export const primitiveColors = {
  cream50: "#FFFDF8",
  cream100: "#F7F4EC",
  cream200: "#EEEAE1",
  cream300: "#DEDAD0",
  forest300: "#70B58D",
  forest400: "#4F9F75",
  forest500: "#2F6D50",
  forest600: "#245940",
  ink900: "#1C211D",
  night950: "#101411",
  white: "#FFFFFF",
} as const;

export const lightElevation = {
  none: "none",
  raised: "0 2px 8px rgba(13, 20, 15, 0.08)",
  floating: "0 8px 24px rgba(13, 20, 15, 0.14)",
  modal: "0 16px 40px rgba(13, 20, 15, 0.20)",
} as const;

export const darkElevation = {
  none: "none",
  raised: "0 2px 10px rgba(0, 0, 0, 0.30)",
  floating: "0 8px 28px rgba(0, 0, 0, 0.42)",
  modal: "0 16px 44px rgba(0, 0, 0, 0.56)",
} as const;

export const lightTheme = {
  colorScheme: "light",
  colors: {
    background: primitiveColors.cream100,
    backgroundTransparent: "rgba(247, 244, 236, 0)",
    surface: primitiveColors.cream50,
    surfaceSecondary: primitiveColors.cream200,
    surfaceElevated: primitiveColors.white,
    text: primitiveColors.ink900,
    textSecondary: "#616860",
    border: "#D9D7CE",
    accent: primitiveColors.forest500,
    accentPressed: primitiveColors.forest600,
    onAccent: primitiveColors.white,
    success: primitiveColors.forest500,
    warning: "#9A650A",
    danger: "#B23B32",
    dangerSurface: "#FCECEA",
    skeleton: primitiveColors.cream300,
    scrim: "rgba(14, 18, 15, 0.36)",
  },
  materials: {
    glassTint: "rgba(247, 244, 236, 0.18)",
    glassFallback: "rgba(255, 253, 248, 0.94)",
    glassBorder: "rgba(255, 255, 255, 0.68)",
  },
  elevation: lightElevation,
} as const;

export const darkTheme = {
  colorScheme: "dark",
  colors: {
    background: primitiveColors.night950,
    backgroundTransparent: "rgba(16, 20, 17, 0)",
    surface: "#171C18",
    surfaceSecondary: "#202620",
    surfaceElevated: "#262D27",
    text: "#F5F2EA",
    textSecondary: "#B8BDB6",
    border: "#343C35",
    accent: primitiveColors.forest300,
    accentPressed: "#5B9D77",
    onAccent: "#07140C",
    success: primitiveColors.forest300,
    warning: "#E7B760",
    danger: "#F18A80",
    dangerSurface: "#3A211F",
    skeleton: "#2A312B",
    scrim: "rgba(0, 0, 0, 0.56)",
  },
  materials: {
    glassTint: "rgba(16, 20, 17, 0.28)",
    glassFallback: "rgba(23, 28, 24, 0.94)",
    glassBorder: "rgba(255, 255, 255, 0.12)",
  },
  elevation: darkElevation,
} as const;

export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const;

export type AppTheme = (typeof themes)[keyof typeof themes];

/** Return the Explora theme for the current system appearance. */
export function useAppTheme(): AppTheme {
  const colorScheme = useColorScheme();

  return colorScheme === "dark" ? darkTheme : lightTheme;
}

export const spacing = {
  space4: 4,
  space8: 8,
  space12: 12,
  space16: 16,
  space20: 20,
  space24: 24,
  space32: 32,
  space40: 40,
  space48: 48,
} as const;

export const radii = {
  small: 10,
  medium: 14,
  large: 18,
  extraLarge: 24,
  full: 999,
} as const;

export const typography = {
  display: {
    fontSize: 34,
    fontWeight: "700" as const,
    letterSpacing: -0.4,
    lineHeight: 41,
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    letterSpacing: -0.2,
    lineHeight: 34,
  },
  headline: {
    fontSize: 20,
    fontWeight: "600" as const,
    lineHeight: 25,
  },
  body: {
    fontSize: 17,
    fontWeight: "400" as const,
    lineHeight: 24,
  },
  bodyStrong: {
    fontSize: 17,
    fontWeight: "600" as const,
    lineHeight: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: "600" as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 13,
    fontWeight: "400" as const,
    lineHeight: 18,
  },
  meta: {
    fontSize: 12,
    fontWeight: "500" as const,
    letterSpacing: 0.1,
    lineHeight: 16,
  },
} as const;
