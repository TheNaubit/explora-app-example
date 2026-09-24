import type { ComponentProps, ComponentType, ReactElement } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { Image } from "expo-image";
import { Link, type Href } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useLingui } from "@lingui/react/macro";
import MaskedView from "@react-native-masked-view/masked-view";
import Animated, { type SharedValue, useAnimatedStyle } from "react-native-reanimated";

import { announceStatus, buildActivityAccessibilityLabel, buildFavoriteToggleLabel } from "@/a11y";
import { A11yCard } from "@/components/a11y-card";
import { A11yPressable } from "@/components/a11y-pressable";
import {
  ACTIVITY_CARD_BACKDROP_BLUR_RADIUS,
  ACTIVITY_CARD_BLUR_MASK_FULL,
  ACTIVITY_CARD_BLUR_MASK_MID,
  ACTIVITY_CARD_BLUR_MASK_START,
  ACTIVITY_CARD_LARGE_TEXT_SCALE,
  ACTIVITY_CARD_MEDIA_HEIGHT,
  ACTIVITY_CARD_SCRIM_START,
  ACTIVITY_COVER_FADE_MS,
  PRESS_SCALE,
} from "@/components/constants";
import { FavoriteButton } from "@/components/favorite-button";
import { ParticleDissolve } from "@/components/particle-dissolve";
import { categoryMessages } from "@/i18n/category-labels";
import { removeFavorite } from "@/hooks/use-favorites";
import { getActivityCoverImage } from "@/data/activity-image";
import type { Activity } from "@/schemas/activity";
import { formatDuration } from "@/utils/format-duration";
import { primitiveColors, radii, spacing, typography, useAppTheme } from "@/theme";

type ActivityCardProps = {
  activity: Activity;
  /** Detail route used by the card press and the iOS zoom transition. */
  detailHref?: Href;
  /** Saved-only removal treatment. Other favorite buttons update immediately. */
  favoriteRemovalEffect?: "particle-dissolve";
  /** Optional scroll-linked opacity for the static image blur layer. */
  imageBlurOpacity?: SharedValue<number>;
  /** Optional static image blur used by a parent-owned focus transition. */
  imageBlurRadius?: number;
  /** Optional Explore-only media height for the focused vertical card layout. */
  mediaHeight?: number;
  onPress?: () => void;
  testID?: string;
  /** Removes list spacing when a parent owns the carousel step. */
  variant?: "list" | "carousel";
};

type PressableProps = ComponentProps<typeof A11yPressable>;

type MaskedViewProps = ComponentProps<typeof View> & {
  androidRenderingMode?: "hardware" | "software";
  maskElement: ReactElement;
};

// The package type still references React 18 component internals.
const CrossPlatformMaskedView = MaskedView as unknown as ComponentType<MaskedViewProps>;

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
 * The cover continues behind the body through one alpha-masked blur layer.
 */
export function ActivityCard({
  activity,
  detailHref,
  favoriteRemovalEffect,
  imageBlurOpacity,
  imageBlurRadius,
  mediaHeight,
  onPress,
  testID,
  variant = "list",
}: ActivityCardProps) {
  if (favoriteRemovalEffect === "particle-dissolve") {
    return (
      <ParticleDissolve
        onDissolveComplete={() => {
          removeFavorite(activity.id);
          announceStatus(buildFavoriteToggleLabel(activity.title, false));
        }}
        testID={`activity-card-dissolve-${activity.id}`}
      >
        {(startDissolve) => (
          <ActivityCardSurface
            activity={activity}
            detailHref={detailHref}
            imageBlurOpacity={imageBlurOpacity}
            imageBlurRadius={imageBlurRadius}
            mediaHeight={mediaHeight}
            onFavoriteRemove={startDissolve}
            onPress={onPress}
            testID={testID}
            variant={variant}
          />
        )}
      </ParticleDissolve>
    );
  }

  return (
    <ActivityCardSurface
      activity={activity}
      detailHref={detailHref}
      imageBlurOpacity={imageBlurOpacity}
      imageBlurRadius={imageBlurRadius}
      mediaHeight={mediaHeight}
      onPress={onPress}
      testID={testID}
      variant={variant}
    />
  );
}

type ActivityCardSurfaceProps = Omit<ActivityCardProps, "favoriteRemovalEffect"> & {
  onFavoriteRemove?: () => boolean | void;
};

function ActivityCardSurface({
  activity,
  detailHref,
  imageBlurOpacity,
  imageBlurRadius,
  mediaHeight,
  onFavoriteRemove,
  onPress,
  testID,
  variant = "list",
}: ActivityCardSurfaceProps) {
  const { t } = useLingui();
  const { fontScale: measuredFontScale } = useWindowDimensions();
  const theme = useAppTheme();
  const label = buildActivityAccessibilityLabel(activity);
  const duration = formatDuration(activity.durationMinutes);
  const categoryLabel = t(categoryMessages[activity.category]);
  const interactive = typeof onPress === "function" || detailHref !== undefined;
  const cover = getActivityCoverImage(activity);
  const resolvedMediaHeight = mediaHeight ?? ACTIVITY_CARD_MEDIA_HEIGHT;
  const usesLargeText = (measuredFontScale ?? 1) > ACTIVITY_CARD_LARGE_TEXT_SCALE;
  const surfaceStyle = StyleSheet.flatten([
    styles.card,
    variant === "carousel" ? styles.carouselCard : null,
    {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      boxShadow: theme.elevation.raised,
    },
  ]);
  const imageBlurStyle = useAnimatedStyle(() => ({
    opacity: imageBlurOpacity?.get() ?? 0,
  }));

  const sharpImage = (
    <View collapsable={false} pointerEvents="none" style={styles.cardImageLayer}>
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
  );

  const surface = (
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
      style={surfaceStyle}
      testID={testID ?? `activity-card-${activity.id}`}
    >
      {detailHref ? <Link.AppleZoom>{sharpImage}</Link.AppleZoom> : sharpImage}
      {imageBlurRadius !== undefined && imageBlurOpacity !== undefined ? (
        <Animated.View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          pointerEvents="none"
          style={[styles.cardImageLayer, imageBlurStyle]}
          testID={`activity-card-focus-blur-${activity.id}`}
        >
          <Image
            blurRadius={imageBlurRadius}
            contentFit="cover"
            priority="low"
            recyclingKey={`${activity.id}-focus-blur`}
            source={{ uri: cover.uri }}
            style={styles.cardImage}
          />
        </Animated.View>
      ) : null}
      <CrossPlatformMaskedView
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        maskElement={
          <LinearGradient
            colors={["transparent", "transparent", "rgba(0, 0, 0, 0.5)", "black"]}
            locations={[
              0,
              ACTIVITY_CARD_BLUR_MASK_START,
              ACTIVITY_CARD_BLUR_MASK_MID,
              ACTIVITY_CARD_BLUR_MASK_FULL,
            ]}
            style={styles.cardImage}
          />
        }
        pointerEvents="none"
        style={styles.cardImageLayer}
        testID={`activity-card-image-blend-${activity.id}`}
      >
        <Image
          blurRadius={ACTIVITY_CARD_BACKDROP_BLUR_RADIUS}
          contentFit="cover"
          priority="low"
          recyclingKey={`${activity.id}-blur`}
          source={{ uri: cover.uri }}
          style={styles.cardImage}
        />
      </CrossPlatformMaskedView>
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
          <FavoriteButton activity={activity} onRemove={onFavoriteRemove} variant="overlay" />
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

  if (detailHref) {
    return (
      <Link href={detailHref} asChild>
        {surface}
      </Link>
    );
  }

  return surface;
}

const styles = StyleSheet.create({
  body: {
    padding: spacing.space16,
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
