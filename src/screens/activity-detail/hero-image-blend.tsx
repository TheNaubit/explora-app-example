import type { ComponentProps, ComponentType, ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";

import {
  ACTIVITY_DETAIL_HERO_BLUR_MASK_FULL,
  ACTIVITY_DETAIL_HERO_BLUR_MASK_MID,
  ACTIVITY_DETAIL_HERO_BLUR_MASK_START,
  ACTIVITY_DETAIL_HERO_BLUR_RADIUS,
  ACTIVITY_DETAIL_HERO_SURFACE_FADE_START,
} from "@/screens/activity-detail/constants";
import { useAppTheme } from "@/theme";

type MaskedViewProps = ComponentProps<typeof View> & {
  androidRenderingMode?: "hardware" | "software";
  maskElement: ReactElement;
};

type HeroImageBlendProps = {
  uri: string;
};

// The package type still references React 18 component internals.
const CrossPlatformMaskedView = MaskedView as unknown as ComponentType<MaskedViewProps>;

/** Blend the sharp detail hero into the screen surface with one masked blurred copy. */
export function HeroImageBlend({ uri }: HeroImageBlendProps) {
  const theme = useAppTheme();

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={styles.layer}
      testID="activity-detail-hero-blend"
    >
      <CrossPlatformMaskedView
        maskElement={
          <LinearGradient
            colors={["transparent", "transparent", "rgba(0, 0, 0, 0.56)", "black"]}
            locations={[
              0,
              ACTIVITY_DETAIL_HERO_BLUR_MASK_START,
              ACTIVITY_DETAIL_HERO_BLUR_MASK_MID,
              ACTIVITY_DETAIL_HERO_BLUR_MASK_FULL,
            ]}
            style={styles.layer}
          />
        }
        style={styles.layer}
        testID="activity-detail-hero-blur"
      >
        <Image
          blurRadius={ACTIVITY_DETAIL_HERO_BLUR_RADIUS}
          contentFit="cover"
          priority="low"
          recyclingKey={`${uri}-detail-blur`}
          source={{ uri }}
          style={styles.layer}
        />
      </CrossPlatformMaskedView>
      <LinearGradient
        colors={[theme.colors.backgroundTransparent, theme.colors.background]}
        locations={[ACTIVITY_DETAIL_HERO_SURFACE_FADE_START, 1]}
        style={styles.layer}
        testID="activity-detail-hero-surface-fade"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
});
