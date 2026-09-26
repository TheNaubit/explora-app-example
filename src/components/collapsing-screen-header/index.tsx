import type { ReactNode } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { ScrollEdgeEffect } from "@bsky.app/expo-scroll-edge-effect";
import { BlurView } from "expo-blur";
import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import {
  COLLAPSING_HEADER_BLUR_INTENSITY,
  COLLAPSING_HEADER_COMPACT_HEIGHT,
  COLLAPSING_HEADER_DISTANCE,
  COLLAPSING_HEADER_TITLE_MAX_FONT_SCALE,
  COLLAPSING_HEADER_TRANSLATION,
} from "@/components/collapsing-screen-header/constants";
import { primitiveColors, spacing, typography, useAppTheme } from "@/theme";

type CollapsingScreenHeaderProps = {
  bodyHeight: number;
  children?: ReactNode;
  persistentContent?: ReactNode;
  safeAreaTop: number;
  scrollOffset: SharedValue<number>;
  title: string;
  translation?: number;
};

function iosMajorVersion(): number {
  const version = Platform.Version;
  return typeof version === "string" ? Number.parseInt(version, 10) : version;
}

const HAS_NATIVE_SOFT_EDGE = Platform.OS === "ios" && iosMajorVersion() >= 26;

/** Shared iOS header that collapses into a compact centered title. */
export function CollapsingScreenHeader({
  bodyHeight,
  children,
  persistentContent,
  safeAreaTop,
  scrollOffset,
  title,
  translation = COLLAPSING_HEADER_TRANSLATION,
}: CollapsingScreenHeaderProps) {
  const theme = useAppTheme();
  const height = safeAreaTop + bodyHeight;

  const panelStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      scrollOffset.get(),
      [0, COLLAPSING_HEADER_DISTANCE],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return { transform: [{ translateY: -translation * progress }] };
  });

  const expandedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollOffset.get(),
      [0, COLLAPSING_HEADER_DISTANCE * 0.72],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  }));

  const compactTitleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollOffset.get(),
      [COLLAPSING_HEADER_DISTANCE * 0.46, COLLAPSING_HEADER_DISTANCE],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <View pointerEvents="box-none" style={[styles.root, { height }]}>
      <ScrollEdgeEffect edge="top" effect="soft" pointerEvents="box-none" style={styles.effect}>
        <Animated.View pointerEvents="box-none" style={[styles.panel, { height }, panelStyle]}>
          {HAS_NATIVE_SOFT_EDGE ? null : (
            <BlurView
              intensity={COLLAPSING_HEADER_BLUR_INTENSITY}
              pointerEvents="none"
              style={StyleSheet.absoluteFill}
              tint="systemUltraThinMaterial"
            />
          )}
          <View pointerEvents="box-none" style={[styles.content, { paddingTop: safeAreaTop }]}>
            <Animated.View style={expandedStyle}>
              <Text
                accessibilityRole="header"
                maxFontSizeMultiplier={COLLAPSING_HEADER_TITLE_MAX_FONT_SCALE}
                style={[styles.heading, { color: theme.colors.text }]}
              >
                {title}
              </Text>
              {children}
            </Animated.View>
            {persistentContent}
          </View>
        </Animated.View>
        <Animated.Text
          accessibilityElementsHidden
          importantForAccessibility="no"
          pointerEvents="none"
          style={[
            styles.compactTitle,
            { color: primitiveColors.white, top: safeAreaTop },
            compactTitleStyle,
          ]}
        >
          {title}
        </Animated.Text>
      </ScrollEdgeEffect>
    </View>
  );
}

const styles = StyleSheet.create({
  compactTitle: {
    ...typography.bodyStrong,
    height: COLLAPSING_HEADER_COMPACT_HEIGHT,
    left: spacing.space48,
    lineHeight: COLLAPSING_HEADER_COMPACT_HEIGHT,
    position: "absolute",
    right: spacing.space48,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.55)",
    textShadowOffset: { height: 0, width: 0 },
    textShadowRadius: 3,
  },
  content: { flex: 1, paddingTop: spacing.space8 },
  effect: { flex: 1 },
  heading: {
    ...typography.display,
    marginBottom: spacing.space8,
    marginHorizontal: spacing.space24,
    marginTop: spacing.space8,
    textAlign: "left",
  },
  panel: { left: 0, position: "absolute", right: 0, top: 0 },
  root: {
    left: 0,
    overflow: "hidden",
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 3,
  },
});
