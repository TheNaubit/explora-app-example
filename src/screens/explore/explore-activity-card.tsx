import { StyleSheet, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import { ActivityCard } from "@/components/activity-card";
import {
  EXPLORE_CARD_INACTIVE_OPACITY,
  EXPLORE_CARD_INACTIVE_SCALE,
  IOS_EXPLORE_HEADER_COLLAPSE_DISTANCE,
  IOS_EXPLORE_HEADER_TRANSLATION,
} from "@/screens/explore/constants";
import type { Activity } from "@/schemas/activity";

type ExploreActivityCardProps = {
  activity: Activity;
  index: number;
  itemExtent: number;
  mediaHeight: number;
  scrollOffset: SharedValue<number>;
  followsCollapsingHeader: boolean;
};

/**
 * One scroll-linked Explore card.
 * The focused card grows at the snap point. Adjacent cards stay visible as spatial cues.
 */
export function ExploreActivityCard({
  activity,
  index,
  itemExtent,
  mediaHeight,
  scrollOffset,
  followsCollapsingHeader,
}: ExploreActivityCardProps) {
  const cardStyle = useAnimatedStyle(() => {
    const snapOffset = index * itemExtent;
    const inputRange = [snapOffset - itemExtent, snapOffset, snapOffset + itemExtent];

    return {
      opacity: interpolate(
        scrollOffset.get(),
        inputRange,
        [EXPLORE_CARD_INACTIVE_OPACITY, 1, EXPLORE_CARD_INACTIVE_OPACITY],
        Extrapolation.CLAMP,
      ),
      transform: [
        {
          translateY: followsCollapsingHeader
            ? interpolate(
                scrollOffset.get(),
                [0, IOS_EXPLORE_HEADER_COLLAPSE_DISTANCE],
                [0, -IOS_EXPLORE_HEADER_TRANSLATION],
                Extrapolation.CLAMP,
              )
            : 0,
        },
        {
          scale: interpolate(
            scrollOffset.get(),
            inputRange,
            [EXPLORE_CARD_INACTIVE_SCALE, 1, EXPLORE_CARD_INACTIVE_SCALE],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  return (
    <View style={[styles.item, { height: itemExtent }]}>
      <Animated.View style={cardStyle}>
        <ActivityCard activity={activity} mediaHeight={mediaHeight} variant="carousel" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    justifyContent: "center",
  },
});
