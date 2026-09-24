import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";

import { MIN_TOUCH_TARGET } from "@/components/constants";
import { radii, useAppTheme } from "@/theme";

type HeroControlSurfaceProps = {
  children: ReactNode;
};

/** Liquid Glass hero chrome with a solid cross-platform fallback. */
export function HeroControlSurface({ children }: HeroControlSurfaceProps) {
  const theme = useAppTheme();
  const canUseLiquidGlass = process.env.EXPO_OS === "ios" && isLiquidGlassAvailable();

  if (canUseLiquidGlass) {
    return (
      <GlassView glassEffectStyle="regular" isInteractive style={styles.surface}>
        {children}
      </GlassView>
    );
  }

  return (
    <View
      style={[
        styles.surface,
        {
          backgroundColor: theme.materials.glassFallback,
          borderColor: theme.materials.glassBorder,
          boxShadow: theme.elevation.floating,
        },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  surface: {
    alignItems: "center",
    borderCurve: "continuous",
    borderRadius: radii.full,
    borderWidth: StyleSheet.hairlineWidth,
    height: MIN_TOUCH_TARGET,
    justifyContent: "center",
    overflow: "hidden",
    width: MIN_TOUCH_TARGET,
  },
});
