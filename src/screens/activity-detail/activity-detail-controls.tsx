import { StyleSheet, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { router } from "expo-router";

import { A11yPressable } from "@/components/a11y-pressable";
import { MIN_TOUCH_TARGET, PRESS_SCALE } from "@/components/constants";
import { FavoriteButton } from "@/components/favorite-button";
import { HeroControlSurface } from "@/screens/activity-detail/hero-control-surface";
import { ACTIVITY_DETAIL_HERO_ICON_SIZE } from "@/screens/activity-detail/constants";
import type { Activity } from "@/schemas/activity";
import { spacing, useAppTheme } from "@/theme";

type ActivityDetailControlsProps = {
  activity?: Activity;
  backLabel: string;
  safeAreaTop: number;
  showBack?: boolean;
};

/** Back and favorite controls above the hero image. */
export function ActivityDetailControls({
  activity,
  backLabel,
  safeAreaTop,
  showBack = true,
}: ActivityDetailControlsProps) {
  const theme = useAppTheme();

  return (
    <View
      pointerEvents="box-none"
      style={[styles.row, !showBack ? styles.rowEnd : null, { top: safeAreaTop + spacing.space8 }]}
    >
      {showBack ? (
        <HeroControlSurface>
          <A11yPressable
            accessibilityLabel={backLabel}
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => router.back()}
            style={(state) => [
              styles.button,
              { transform: [{ scale: state.pressed ? PRESS_SCALE : 1 }] },
            ]}
            testID="activity-detail-back"
          >
            <SymbolView
              name={{ ios: "chevron.backward", android: "arrow_back", web: "arrow_back" }}
              size={ACTIVITY_DETAIL_HERO_ICON_SIZE}
              tintColor={theme.colors.text}
            />
          </A11yPressable>
        </HeroControlSurface>
      ) : null}
      {activity ? (
        <HeroControlSurface>
          <FavoriteButton activity={activity} testID="activity-detail-favorite" />
        </HeroControlSurface>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    height: MIN_TOUCH_TARGET,
    justifyContent: "center",
    width: MIN_TOUCH_TARGET,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    left: spacing.space16,
    position: "absolute",
    right: spacing.space16,
    zIndex: 2,
  },
  rowEnd: {
    justifyContent: "flex-end",
  },
});
