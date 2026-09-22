import type { ComponentProps } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { useLingui } from "@lingui/react/macro";

import { buildActivityAccessibilityLabel } from "@/a11y";
import { A11yCard } from "@/components/a11y-card";
import { A11yPressable } from "@/components/a11y-pressable";
import { ACTIVITY_CARD_MEDIA_HEIGHT, PRESS_SCALE } from "@/components/constants";
import { FavoriteButton } from "@/components/favorite-button";
import { categoryMessages } from "@/i18n/category-labels";
import { getCategoryIllustration } from "@/illustrations";
import type { Activity } from "@/schemas/activity";
import { formatDuration } from "@/utils/format-duration";
import { radii, spacing, typography, useAppTheme } from "@/theme";

type ActivityCardProps = {
  activity: Activity;
  onPress?: () => void;
  testID?: string;
};

type PressableProps = ComponentProps<typeof A11yPressable>;

/**
 * Card surface with press scale when the row is interactive.
 */
function ActivityCardPressable({ style, ...rest }: PressableProps) {
  return (
    <A11yPressable
      {...rest}
      style={(state) => [
        typeof style === "function" ? style(state) : style,
        {
          opacity: state.pressed ? 0.94 : 1,
          transform: [{ scale: state.pressed ? PRESS_SCALE : 1 }],
        },
      ]}
    />
  );
}

/**
 * Explore / Saved activity row.
 * The dataset has no image URLs, so the media block uses a claymorphic category icon.
 * Detail navigation is optional until the Detail screen ships.
 */
export function ActivityCard({ activity, onPress, testID }: ActivityCardProps) {
  const { t } = useLingui();
  const theme = useAppTheme();
  const label = buildActivityAccessibilityLabel(activity);
  const duration = formatDuration(activity.durationMinutes);
  const categoryLabel = t(categoryMessages[activity.category]);
  const interactive = typeof onPress === "function";

  return (
    <A11yCard
      accessibility={{
        accessibilityLabel: label,
        accessibilityRole: "button",
      }}
      onPress={onPress}
      pressableProps={{
        disabled: !interactive,
        focusable: interactive,
      }}
      PressableComponent={interactive ? ActivityCardPressable : A11yPressable}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
      testID={testID ?? `activity-card-${activity.id}`}
    >
      <View style={[styles.media, { backgroundColor: theme.colors.surfaceSecondary }]}>
        <Image
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          source={getCategoryIllustration(activity.category)}
          style={styles.mediaImage}
          contentFit="contain"
        />
        <Text style={[styles.category, { color: theme.colors.accent }]}>{categoryLabel}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={2}>
            {activity.title}
          </Text>
          <FavoriteButton activity={activity} />
        </View>
        <Text style={[styles.meta, { color: theme.colors.textSecondary }]} numberOfLines={1}>
          {activity.location}
        </Text>
        <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>{duration}</Text>
      </View>
    </A11yCard>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: spacing.space16,
  },
  card: {
    borderRadius: radii.large,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: spacing.space12,
    overflow: "hidden",
  },
  category: {
    ...typography.meta,
    textAlign: "left",
  },
  media: {
    alignItems: "center",
    height: ACTIVITY_CARD_MEDIA_HEIGHT,
    justifyContent: "center",
    paddingBottom: spacing.space12,
    paddingHorizontal: spacing.space16,
  },
  mediaImage: {
    flex: 1,
    marginBottom: spacing.space4,
    width: "55%",
  },
  meta: {
    ...typography.caption,
    marginTop: spacing.space4,
    textAlign: "left",
  },
  title: {
    ...typography.headline,
    flex: 1,
    marginEnd: spacing.space8,
    textAlign: "left",
  },
  titleRow: {
    alignItems: "flex-start",
    flexDirection: "row",
  },
});
