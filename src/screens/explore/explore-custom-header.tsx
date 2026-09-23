import { Platform, StyleSheet, Text, View } from "react-native";
import { ScrollEdgeEffect } from "@bsky.app/expo-scroll-edge-effect";
import { useLingui } from "@lingui/react/macro";
import { useValue } from "@legendapp/state/react";
import { BlurView } from "expo-blur";
import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import { CategoryChipRow } from "@/components/category-chip-row";
import { SearchField } from "@/components/search-field";
import {
  IOS_EXPLORE_HEADER_BLUR_INTENSITY,
  IOS_EXPLORE_HEADER_BODY_HEIGHT,
  IOS_EXPLORE_HEADER_COLLAPSE_DISTANCE,
  IOS_EXPLORE_HEADER_TRANSLATION,
} from "@/screens/explore/constants";
import { exploreMessages } from "@/screens/explore/messages";
import { discovery$, setDiscoveryCategory, setDiscoverySearch } from "@/state/discovery";
import { spacing, typography, useAppTheme } from "@/theme";

type ExploreCustomHeaderProps = {
  safeAreaTop: number;
  scrollOffset: SharedValue<number>;
};

function iosMajorVersion(): number {
  const version = Platform.Version;
  return typeof version === "string" ? Number.parseInt(version, 10) : version;
}

const HAS_NATIVE_SOFT_EDGE = Platform.OS === "ios" && iosMajorVersion() >= 26;

/**
 * Custom iOS discovery header.
 * Title, search, material, and filters move as one scroll-linked surface.
 */
export function ExploreCustomHeader({ safeAreaTop, scrollOffset }: ExploreCustomHeaderProps) {
  const { t } = useLingui();
  const theme = useAppTheme();
  const category = useValue(discovery$.category);
  const searchQuery = useValue(discovery$.searchQuery);
  const height = safeAreaTop + IOS_EXPLORE_HEADER_BODY_HEIGHT;

  const panelStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      scrollOffset.get(),
      [0, IOS_EXPLORE_HEADER_COLLAPSE_DISTANCE],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ translateY: -IOS_EXPLORE_HEADER_TRANSLATION * progress }],
    };
  });

  const expandedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollOffset.get(),
      [0, IOS_EXPLORE_HEADER_COLLAPSE_DISTANCE * 0.72],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  }));

  const compactTitleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollOffset.get(),
      [IOS_EXPLORE_HEADER_COLLAPSE_DISTANCE * 0.46, IOS_EXPLORE_HEADER_COLLAPSE_DISTANCE],
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
              intensity={IOS_EXPLORE_HEADER_BLUR_INTENSITY}
              pointerEvents="none"
              style={StyleSheet.absoluteFill}
              tint="systemUltraThinMaterial"
            />
          )}
          <View pointerEvents="box-none" style={[styles.content, { paddingTop: safeAreaTop }]}>
            <Animated.View style={expandedStyle}>
              <Text
                accessibilityRole="header"
                style={[styles.heading, { color: theme.colors.text }]}
              >
                {t(exploreMessages.heading)}
              </Text>
              <SearchField initialValue={searchQuery} onDebouncedChange={setDiscoverySearch} />
            </Animated.View>
            <View style={styles.chips}>
              <CategoryChipRow selected={category} onSelect={setDiscoveryCategory} />
            </View>
          </View>
        </Animated.View>
        <Animated.Text
          accessibilityElementsHidden
          importantForAccessibility="no"
          pointerEvents="none"
          style={[
            styles.compactTitle,
            { color: theme.colors.text, top: safeAreaTop },
            compactTitleStyle,
          ]}
        >
          {t(exploreMessages.heading)}
        </Animated.Text>
      </ScrollEdgeEffect>
    </View>
  );
}

const styles = StyleSheet.create({
  chips: {
    paddingHorizontal: spacing.space24,
  },
  compactTitle: {
    ...typography.bodyStrong,
    height: 44,
    left: spacing.space48,
    lineHeight: 44,
    position: "absolute",
    right: spacing.space48,
    textAlign: "center",
  },
  content: {
    flex: 1,
    paddingTop: spacing.space8,
  },
  effect: {
    flex: 1,
  },
  heading: {
    ...typography.display,
    marginBottom: spacing.space8,
    marginHorizontal: spacing.space24,
    marginTop: spacing.space8,
    textAlign: "left",
  },
  panel: {
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  root: {
    left: 0,
    overflow: "hidden",
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 3,
  },
});
