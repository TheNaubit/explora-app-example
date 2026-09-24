import { StyleSheet, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";

import { ActivityCard } from "@/components/activity-card";
import {
  ACTIVITY_CARD_INACTIVE_BLUR_OPACITY,
  ACTIVITY_CARD_INACTIVE_BLUR_RADIUS,
  ACTIVITY_CARD_INACTIVE_OPACITY,
  ACTIVITY_CARD_INACTIVE_SCALE,
} from "@/components/activity-card-carousel/constants";
import { COLLAPSING_HEADER_DISTANCE } from "@/components/collapsing-screen-header/constants";
import type { Activity } from "@/schemas/activity";

type ActivityCardCarouselItemProps = {
  activity: Activity;
  favoriteRemovalEffect?: "particle-dissolve";
  followsCollapsingHeader: boolean;
  headerTranslation: number;
  index: number;
  itemExtent: number;
  mediaHeight: number;
  scrollOffset: SharedValue<number>;
};

/** One focused card in the shared Explore and Saved carousel. */
export function ActivityCardCarouselItem({
  activity,
  favoriteRemovalEffect,
  followsCollapsingHeader,
  headerTranslation,
  index,
  itemExtent,
  mediaHeight,
  scrollOffset,
}: ActivityCardCarouselItemProps) {
  const cardStyle = useAnimatedStyle(() => {
    const snapOffset = index * itemExtent;
    const inputRange = [snapOffset - itemExtent, snapOffset, snapOffset + itemExtent];

    return {
      opacity: interpolate(
        scrollOffset.get(),
        inputRange,
        [ACTIVITY_CARD_INACTIVE_OPACITY, 1, ACTIVITY_CARD_INACTIVE_OPACITY],
        Extrapolation.CLAMP,
      ),
      transform: [
        {
          translateY: followsCollapsingHeader
            ? interpolate(
                scrollOffset.get(),
                [0, COLLAPSING_HEADER_DISTANCE],
                [0, -headerTranslation],
                Extrapolation.CLAMP,
              )
            : 0,
        },
        {
          scale: interpolate(
            scrollOffset.get(),
            inputRange,
            [ACTIVITY_CARD_INACTIVE_SCALE, 1, ACTIVITY_CARD_INACTIVE_SCALE],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  const imageBlurOpacity = useDerivedValue(() => {
    const snapOffset = index * itemExtent;
    const inputRange = [snapOffset - itemExtent, snapOffset, snapOffset + itemExtent];

    return interpolate(
      scrollOffset.get(),
      inputRange,
      [ACTIVITY_CARD_INACTIVE_BLUR_OPACITY, 0, ACTIVITY_CARD_INACTIVE_BLUR_OPACITY],
      Extrapolation.CLAMP,
    );
  });

  return (
    <View style={[styles.item, { height: itemExtent }]}>
      <Animated.View style={cardStyle}>
        <ActivityCard
          activity={activity}
          favoriteRemovalEffect={favoriteRemovalEffect}
          imageBlurOpacity={imageBlurOpacity}
          imageBlurRadius={ACTIVITY_CARD_INACTIVE_BLUR_RADIUS}
          mediaHeight={mediaHeight}
          variant="carousel"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    justifyContent: "center",
  },
});
