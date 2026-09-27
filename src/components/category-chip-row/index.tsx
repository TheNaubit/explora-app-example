import type { ComponentProps } from "react";
import { I18nManager, Keyboard, type LayoutChangeEvent, StyleSheet, View } from "react-native";
import { useLingui } from "@lingui/react/macro";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { CategoryChip } from "@/components/category-chip";
import { DISCOVERY_CATEGORIES } from "@/components/category-chip-row/constants";
import { categoryChipRowMessages } from "@/components/category-chip-row/messages";
import { getCategoryChipIllustration } from "@/illustrations";
import { hapticFilterSelection } from "@/haptics/feedback";
import type { ActivityCategory } from "@/schemas/activity";
import { spacing, useAppTheme } from "@/theme";

const EDGE_FADE_WIDTH = spacing.space40;
const EDGE_REVEAL_DISTANCE = spacing.space8;
const EDGE_HIDDEN_OPACITY = 0;
const EDGE_VISIBLE_OPACITY = 1;
const EDGE_SOFT_ALPHA = "B8";
const EDGE_TRANSPARENT_ALPHA = "00";
const LEADING_EDGE_GRADIENT_LOCATIONS = [0, 0.35, 1] as const;
const TRAILING_EDGE_GRADIENT_LOCATIONS = [0, 0.65, 1] as const;

type CategoryChipRowProps = {
  selectedCategories: readonly ActivityCategory[];
  onToggle: (category: ActivityCategory | null) => void;
};

/**
 * Five illustrated filter chips: All plus the four catalog categories.
 * RN horizontal ScrollView keeps scroll offset across list header updates.
 * Chips use `A11yPressable` so labels, selected state, and keyboard focus stay correct.
 */
export function CategoryChipRow({ selectedCategories, onToggle }: CategoryChipRowProps) {
  const { t } = useLingui();
  const theme = useAppTheme();
  const scrollOffset = useSharedValue(0);
  const contentWidth = useSharedValue(0);
  const viewportWidth = useSharedValue(0);
  const softBackground = `${theme.colors.background}${EDGE_SOFT_ALPHA}`;
  const transparentBackground = `${theme.colors.background}${EDGE_TRANSPARENT_ALPHA}`;

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollOffset.set(Math.abs(event.contentOffset.x));
  });

  const leadingEdgeStyle = useAnimatedStyle(() => {
    const maximumOffset = Math.max(0, contentWidth.get() - viewportWidth.get());
    const normalizedOffset = Math.min(scrollOffset.get(), maximumOffset);
    const leadingOpacity = interpolate(
      normalizedOffset,
      [0, EDGE_REVEAL_DISTANCE],
      [EDGE_HIDDEN_OPACITY, EDGE_VISIBLE_OPACITY],
      Extrapolation.CLAMP,
    );
    const trailingOpacity = interpolate(
      maximumOffset - normalizedOffset,
      [0, EDGE_REVEAL_DISTANCE],
      [EDGE_HIDDEN_OPACITY, EDGE_VISIBLE_OPACITY],
      Extrapolation.CLAMP,
    );

    return { opacity: I18nManager.isRTL ? trailingOpacity : leadingOpacity };
  });

  const trailingEdgeStyle = useAnimatedStyle(() => {
    const maximumOffset = Math.max(0, contentWidth.get() - viewportWidth.get());
    const normalizedOffset = Math.min(scrollOffset.get(), maximumOffset);
    const leadingOpacity = interpolate(
      normalizedOffset,
      [0, EDGE_REVEAL_DISTANCE],
      [EDGE_HIDDEN_OPACITY, EDGE_VISIBLE_OPACITY],
      Extrapolation.CLAMP,
    );
    const trailingOpacity = interpolate(
      maximumOffset - normalizedOffset,
      [0, EDGE_REVEAL_DISTANCE],
      [EDGE_HIDDEN_OPACITY, EDGE_VISIBLE_OPACITY],
      Extrapolation.CLAMP,
    );

    return { opacity: I18nManager.isRTL ? leadingOpacity : trailingOpacity };
  });

  function handleLayout(event: LayoutChangeEvent) {
    viewportWidth.set(event.nativeEvent.layout.width);
  }

  function handleContentSizeChange(width: number) {
    contentWidth.set(width);
  }

  function handleSelect(category: ActivityCategory | null) {
    Keyboard.dismiss();
    if (category !== null || selectedCategories.length > 0) {
      hapticFilterSelection();
    }
    onToggle(category);
  }

  return (
    <View onLayout={handleLayout} style={styles.root} testID="category-chip-row">
      <Animated.ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={handleContentSizeChange}
        onScroll={onScroll}
        onScrollBeginDrag={Keyboard.dismiss}
        scrollEventThrottle={16}
        testID="category-chip-scroll"
      >
        <CategoryChip
          icon={getCategoryChipIllustration(null)}
          label={t(categoryChipRowMessages.all)}
          selected={selectedCategories.length === 0}
          onPress={() => handleSelect(null)}
          testID="category-chip-all"
        />
        {DISCOVERY_CATEGORIES.map((category) => (
          <CategoryChip
            key={category}
            icon={getCategoryChipIllustration(category)}
            label={t(categoryChipRowMessages[category])}
            selected={selectedCategories.includes(category)}
            onPress={() => handleSelect(category)}
            testID={`category-chip-${category.toLowerCase()}`}
          />
        ))}
      </Animated.ScrollView>
      <ChipRowEdge
        colors={[theme.colors.background, softBackground, transparentBackground]}
        locations={LEADING_EDGE_GRADIENT_LOCATIONS}
        style={[styles.edge, styles.edgeLeft, leadingEdgeStyle]}
        testID="category-chip-row-leading-edge"
      />
      <ChipRowEdge
        colors={[transparentBackground, softBackground, theme.colors.background]}
        locations={TRAILING_EDGE_GRADIENT_LOCATIONS}
        style={[styles.edge, styles.edgeRight, trailingEdgeStyle]}
        testID="category-chip-row-trailing-edge"
      />
    </View>
  );
}

type ChipRowEdgeProps = {
  colors: readonly [string, string, string];
  locations: readonly [number, number, number];
  style: ComponentProps<typeof Animated.View>["style"];
  testID: string;
};

function ChipRowEdge({ colors, locations, style, testID }: ChipRowEdgeProps) {
  return (
    <Animated.View pointerEvents="none" style={style} testID={testID}>
      <LinearGradient
        colors={colors}
        end={{ x: 1, y: 0.5 }}
        locations={locations}
        start={{ x: 0, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: spacing.space4,
  },
  root: {
    minHeight: 44,
    position: "relative",
    width: "100%",
  },
  edge: {
    bottom: 0,
    position: "absolute",
    top: 0,
    width: EDGE_FADE_WIDTH,
    zIndex: 1,
  },
  edgeLeft: {
    left: 0,
  },
  edgeRight: {
    right: 0,
  },
});
