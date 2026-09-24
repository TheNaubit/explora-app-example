import { StyleSheet } from "react-native";
import { SymbolView } from "expo-symbols";

import { announceStatus, buildFavoriteToggleLabel } from "@/a11y";
import { A11yPressable } from "@/components/a11y-pressable";
import { MIN_TOUCH_TARGET, PRESS_SCALE } from "@/components/constants";
import { hapticFavoriteRemoved, hapticFavoriteSaved } from "@/haptics/feedback";
import { addFavorite, removeFavorite, useIsFavorite } from "@/hooks/use-favorites";
import type { Activity } from "@/schemas/activity";
import { radii, useAppTheme } from "@/theme";

type FavoriteButtonProps = {
  activity: Activity;
  /** Optional removal owner for a screen-specific transition. Return false when no action starts. */
  onRemove?: () => boolean | void;
  /** `plain` sits in text rows. `overlay` sits on cover photos. */
  variant?: "plain" | "overlay";
  testID?: string;
};

/**
 * Save or remove an activity favorite. Keeps a 44-point target.
 * Press scale confirms the tap. Pulsar marks save and remove outcomes.
 */
export function FavoriteButton({
  activity,
  onRemove,
  variant = "plain",
  testID,
}: FavoriteButtonProps) {
  const theme = useAppTheme();
  const favorited = useIsFavorite(activity.id);
  const label = buildFavoriteToggleLabel(activity.title, favorited);
  const overlay = variant === "overlay";

  function handlePress() {
    if (favorited) {
      if (onRemove && onRemove() === false) return;

      if (!onRemove) {
        removeFavorite(activity.id);
        announceStatus(buildFavoriteToggleLabel(activity.title, false));
      }
      hapticFavoriteRemoved();
      return;
    }

    addFavorite(activity);
    hapticFavoriteSaved();
    announceStatus(buildFavoriteToggleLabel(activity.title, true));
  }

  const iconColor = favorited
    ? theme.colors.accent
    : overlay
      ? theme.colors.text
      : theme.colors.textSecondary;

  return (
    <A11yPressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ selected: favorited }}
      hitSlop={8}
      onPress={handlePress}
      style={(state) => [
        styles.button,
        overlay
          ? {
              backgroundColor: theme.colors.surfaceElevated,
              borderRadius: radii.full,
            }
          : null,
        {
          opacity: state.pressed ? 0.9 : 1,
          transform: [{ scale: state.pressed ? PRESS_SCALE : 1 }],
        },
      ]}
      testID={testID ?? `favorite-button-${activity.id}`}
    >
      <SymbolView
        name={{
          ios: favorited ? "heart.fill" : "heart",
          android: favorited ? "favorite" : "favorite_border",
          web: favorited ? "favorite" : "favorite_border",
        }}
        size={22}
        tintColor={iconColor}
      />
    </A11yPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    height: MIN_TOUCH_TARGET,
    justifyContent: "center",
    width: MIN_TOUCH_TARGET,
  },
});
