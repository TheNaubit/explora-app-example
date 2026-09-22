import type { ComponentProps } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { useLingui } from "@lingui/react/macro";

import { buildActivityAccessibilityLabel } from "@/a11y";
import { A11yCard } from "@/components/a11y-card";
import { A11yPressable } from "@/components/a11y-pressable";
import {
  ACTIVITY_CARD_MEDIA_HEIGHT,
  ACTIVITY_COVER_FADE_MS,
  PRESS_SCALE,
} from "@/components/constants";
import { FavoriteButton } from "@/components/favorite-button";
import { categoryMessages } from "@/i18n/category-labels";
import { getActivityCoverImage } from "@/data/activity-image";
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
 * Cover photo fills the media block. BlurHash shows first, then the photo fades in.
 */
export function ActivityCard({ activity, onPress, testID }: ActivityCardProps) {
  const { t } = useLingui();
  const theme = useAppTheme();
  const label = buildActivityAccessibilityLabel(activity);
  const duration = formatDuration(activity.durationMinutes);
  const categoryLabel = t(categoryMessages[activity.category]);
  const interactive = typeof onPress === "function";
  const cover = getActivityCoverImage(activity);

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
      <View style={styles.media} testID={`activity-card-image-${activity.id}`}>
        <Image
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          source={{ uri: cover.uri }}
          placeholder={{ blurhash: cover.blurhash }}
          placeholderContentFit="cover"
          contentFit="cover"
          transition={ACTIVITY_COVER_FADE_MS}
          recyclingKey={activity.id}
          style={styles.mediaImage}
        />
        <View
          style={[styles.categoryBadge, { backgroundColor: theme.colors.surfaceElevated }]}
          pointerEvents="none"
        >
          <Text style={[styles.category, { color: theme.colors.accent }]}>{categoryLabel}</Text>
        </View>
        <View style={styles.favorite}>
          <FavoriteButton activity={activity} variant="overlay" />
        </View>
      </View>
      <View style={styles.body}>
        <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={2}>
          {activity.title}
        </Text>
        <Text style={[styles.meta, { color: theme.colors.textSecondary }]} numberOfLines={1}>
          {activity.location}
          {" · "}
          {duration}
        </Text>
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
  categoryBadge: {
    borderRadius: radii.full,
    bottom: spacing.space12,
    left: spacing.space12,
    paddingHorizontal: spacing.space8,
    paddingVertical: spacing.space4,
    position: "absolute",
  },
  favorite: {
    position: "absolute",
    right: spacing.space8,
    top: spacing.space8,
  },
  media: {
    backgroundColor: "#DEDAD0",
    height: ACTIVITY_CARD_MEDIA_HEIGHT,
    overflow: "hidden",
    width: "100%",
  },
  mediaImage: {
    ...StyleSheet.absoluteFill,
  },
  meta: {
    ...typography.caption,
    marginTop: spacing.space4,
    textAlign: "left",
  },
  title: {
    ...typography.headline,
    textAlign: "left",
  },
});
