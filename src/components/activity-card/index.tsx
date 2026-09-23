import type { ComponentProps } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLingui } from "@lingui/react/macro";

import { buildActivityAccessibilityLabel } from "@/a11y";
import { A11yCard } from "@/components/a11y-card";
import { A11yPressable } from "@/components/a11y-pressable";
import {
  ACTIVITY_CARD_BACKDROP_BLUR_RADIUS,
  ACTIVITY_CARD_BLUR_MEDIUM_FRAME_HEIGHT,
  ACTIVITY_CARD_BLUR_MEDIUM_IMAGE_HEIGHT,
  ACTIVITY_CARD_BLUR_MEDIUM_OPACITY,
  ACTIVITY_CARD_BLUR_SOFT_FRAME_HEIGHT,
  ACTIVITY_CARD_BLUR_SOFT_IMAGE_HEIGHT,
  ACTIVITY_CARD_BLUR_SOFT_OPACITY,
  ACTIVITY_CARD_BLUR_STRONG_FRAME_HEIGHT,
  ACTIVITY_CARD_BLUR_STRONG_IMAGE_HEIGHT,
  ACTIVITY_CARD_LARGE_TEXT_SCALE,
  ACTIVITY_CARD_MEDIA_HEIGHT,
  ACTIVITY_CARD_SCRIM_START,
  ACTIVITY_COVER_FADE_MS,
  PRESS_SCALE,
} from "@/components/constants";
import { FavoriteButton } from "@/components/favorite-button";
import { categoryMessages } from "@/i18n/category-labels";
import { getActivityCoverImage } from "@/data/activity-image";
import type { Activity } from "@/schemas/activity";
import { formatDuration } from "@/utils/format-duration";
import { primitiveColors, radii, spacing, typography, useAppTheme } from "@/theme";

type ActivityCardProps = {
  activity: Activity;
  /** Optional Explore-only media height for the focused vertical card layout. */
  mediaHeight?: number;
  onPress?: () => void;
  testID?: string;
  /** Removes list spacing when a parent owns the carousel step. */
  variant?: "list" | "carousel";
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
 * The cover continues behind the body through progressive static blur layers.
 */
export function ActivityCard({
  activity,
  mediaHeight,
  onPress,
  testID,
  variant = "list",
}: ActivityCardProps) {
  const { t } = useLingui();
  const { fontScale: measuredFontScale } = useWindowDimensions();
  const theme = useAppTheme();
  const label = buildActivityAccessibilityLabel(activity);
  const duration = formatDuration(activity.durationMinutes);
  const categoryLabel = t(categoryMessages[activity.category]);
  const interactive = typeof onPress === "function";
  const cover = getActivityCoverImage(activity);
  const resolvedMediaHeight = mediaHeight ?? ACTIVITY_CARD_MEDIA_HEIGHT;
  const usesLargeText = (measuredFontScale ?? 1) > ACTIVITY_CARD_LARGE_TEXT_SCALE;

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
        variant === "carousel" ? styles.carouselCard : null,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          boxShadow: theme.elevation.raised,
        },
      ]}
      testID={testID ?? `activity-card-${activity.id}`}
    >
      <View pointerEvents="none" style={styles.cardImageLayer}>
        <Image
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          contentFit="cover"
          placeholder={{ blurhash: cover.blurhash }}
          placeholderContentFit="cover"
          recyclingKey={`${activity.id}-cover`}
          source={{ uri: cover.uri }}
          style={styles.cardImage}
          transition={ACTIVITY_COVER_FADE_MS}
        />
      </View>
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        pointerEvents="none"
        style={styles.cardImageLayer}
        testID={`activity-card-image-blend-${activity.id}`}
      >
        <View style={[styles.blurSoftFrame, { height: ACTIVITY_CARD_BLUR_SOFT_FRAME_HEIGHT }]}>
          <Image
            blurRadius={ACTIVITY_CARD_BACKDROP_BLUR_RADIUS / 4}
            contentFit="cover"
            priority="low"
            recyclingKey={`${activity.id}-blur-soft`}
            source={{ uri: cover.uri }}
            style={[
              styles.blurImage,
              {
                height: ACTIVITY_CARD_BLUR_SOFT_IMAGE_HEIGHT,
                opacity: ACTIVITY_CARD_BLUR_SOFT_OPACITY,
              },
            ]}
          />
        </View>
        <View style={[styles.blurMediumFrame, { height: ACTIVITY_CARD_BLUR_MEDIUM_FRAME_HEIGHT }]}>
          <Image
            blurRadius={ACTIVITY_CARD_BACKDROP_BLUR_RADIUS / 2}
            contentFit="cover"
            priority="low"
            recyclingKey={`${activity.id}-blur-medium`}
            source={{ uri: cover.uri }}
            style={[
              styles.blurImage,
              {
                height: ACTIVITY_CARD_BLUR_MEDIUM_IMAGE_HEIGHT,
                opacity: ACTIVITY_CARD_BLUR_MEDIUM_OPACITY,
              },
            ]}
          />
        </View>
        <View style={[styles.blurStrongFrame, { height: ACTIVITY_CARD_BLUR_STRONG_FRAME_HEIGHT }]}>
          <Image
            blurRadius={ACTIVITY_CARD_BACKDROP_BLUR_RADIUS}
            contentFit="cover"
            priority="low"
            recyclingKey={`${activity.id}-blur-strong`}
            source={{ uri: cover.uri }}
            style={[styles.blurImage, { height: ACTIVITY_CARD_BLUR_STRONG_IMAGE_HEIGHT }]}
          />
        </View>
      </View>
      <LinearGradient
        colors={["transparent", "transparent", "rgba(8, 12, 10, 0.86)"]}
        locations={[0, ACTIVITY_CARD_SCRIM_START, 1]}
        pointerEvents="none"
        style={styles.imageScrim}
      />
      <View
        style={[styles.media, { height: resolvedMediaHeight }]}
        testID={`activity-card-image-${activity.id}`}
      >
        <View style={styles.favorite}>
          <FavoriteButton activity={activity} variant="overlay" />
        </View>
      </View>
      <View style={styles.body}>
        <Text
          style={[styles.title, styles.onImageText]}
          numberOfLines={usesLargeText ? undefined : 2}
        >
          {activity.title}
        </Text>
        <View style={[styles.metaRow, usesLargeText ? styles.metaRowLargeText : null]}>
          <Text
            style={[styles.category, styles.onImageCategory]}
            testID={`activity-card-category-${activity.id}`}
          >
            {categoryLabel}
          </Text>
          <Text
            style={[styles.meta, styles.onImageMeta]}
            numberOfLines={usesLargeText ? undefined : 1}
          >
            {usesLargeText ? null : " · "}
            {activity.location}
            {" · "}
            {duration}
          </Text>
        </View>
      </View>
    </A11yCard>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: spacing.space16,
  },
  blurImage: {
    bottom: 0,
    left: 0,
    position: "absolute",
    width: "100%",
  },
  blurMediumFrame: {
    bottom: 0,
    left: 0,
    overflow: "hidden",
    position: "absolute",
    right: 0,
  },
  blurSoftFrame: {
    bottom: 0,
    left: 0,
    overflow: "hidden",
    position: "absolute",
    right: 0,
  },
  blurStrongFrame: {
    bottom: 0,
    left: 0,
    overflow: "hidden",
    position: "absolute",
    right: 0,
  },
  cardImage: {
    height: "100%",
    width: "100%",
  },
  cardImageLayer: {
    ...StyleSheet.absoluteFill,
  },
  card: {
    borderCurve: "continuous",
    borderRadius: radii.large,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: spacing.space12,
    overflow: "hidden",
  },
  carouselCard: {
    marginBottom: 0,
  },
  category: {
    ...typography.meta,
    flexShrink: 0,
    fontWeight: "600",
    textAlign: "left",
  },
  favorite: {
    position: "absolute",
    right: spacing.space8,
    top: spacing.space8,
  },
  imageScrim: {
    ...StyleSheet.absoluteFill,
  },
  media: {
    height: ACTIVITY_CARD_MEDIA_HEIGHT,
    overflow: "hidden",
    width: "100%",
  },
  meta: {
    ...typography.caption,
    flexShrink: 1,
    textAlign: "left",
  },
  metaRow: {
    alignItems: "baseline",
    flexDirection: "row",
    marginTop: spacing.space4,
    minWidth: 0,
  },
  metaRowLargeText: {
    alignItems: "flex-start",
    flexDirection: "column",
  },
  onImageCategory: {
    color: primitiveColors.forest300,
  },
  onImageMeta: {
    color: "rgba(255, 255, 255, 0.78)",
  },
  onImageText: {
    color: primitiveColors.white,
  },
  title: {
    ...typography.headline,
    textAlign: "left",
  },
});
