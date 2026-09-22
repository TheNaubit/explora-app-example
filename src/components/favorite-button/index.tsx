import { StyleSheet } from "react-native";
import { SymbolView } from "expo-symbols";

import { announceStatus, buildFavoriteToggleLabel } from "@/a11y";
import { A11yPressable } from "@/components/a11y-pressable";
import { MIN_TOUCH_TARGET } from "@/components/constants";
import { addFavorite, removeFavorite, useIsFavorite } from "@/hooks/use-favorites";
import type { Activity } from "@/schemas/activity";
import { useAppTheme } from "@/theme";

type FavoriteButtonProps = {
  activity: Activity;
  testID?: string;
};

/**
 * Save or remove an activity favorite. Keeps a 44-point target.
 */
export function FavoriteButton({ activity, testID }: FavoriteButtonProps) {
  const theme = useAppTheme();
  const favorited = useIsFavorite(activity.id);
  const label = buildFavoriteToggleLabel(activity.title, favorited);

  function handlePress() {
    if (favorited) {
      removeFavorite(activity.id);
      announceStatus(buildFavoriteToggleLabel(activity.title, false));
      return;
    }

    addFavorite(activity);
    announceStatus(buildFavoriteToggleLabel(activity.title, true));
  }

  return (
    <A11yPressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ selected: favorited }}
      hitSlop={8}
      onPress={handlePress}
      style={styles.button}
      testID={testID ?? `favorite-button-${activity.id}`}
    >
      <SymbolView
        name={{
          ios: favorited ? "heart.fill" : "heart",
          android: favorited ? "favorite" : "favorite_border",
          web: favorited ? "favorite" : "favorite_border",
        }}
        size={22}
        tintColor={favorited ? theme.colors.accent : theme.colors.textSecondary}
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
