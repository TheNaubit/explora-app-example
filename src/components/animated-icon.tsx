import { Image } from "expo-image";
import * as SplashScreen from "expo-splash-screen";
import { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, { Easing, Keyframe } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { BrandColors } from "@/constants/theme";

const INITIAL_SCALE_FACTOR = Dimensions.get("screen").height / 90;
const DURATION = 600;
const ICON_GRADIENT = `linear-gradient(180deg, ${BrandColors.iconGradientStart}, ${BrandColors.iconGradientEnd})`;

export function AnimatedSplashOverlay() {
  const [animate, setAnimate] = useState(false);
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const splashKeyframe = new Keyframe({
    0: {
      transform: [{ scale: 1 }],
      opacity: 1,
    },
    20: {
      opacity: 1,
    },
    70: {
      opacity: 0,
      easing: Easing.elastic(0.7),
    },
    100: {
      opacity: 0,
      transform: [{ scale: 1 }],
      easing: Easing.elastic(0.7),
    },
  });

  const image = <Image style={styles.image} source={require("@/assets/images/expo-logo.png")} />;

  return animate ? (
    <Animated.View
      entering={splashKeyframe.duration(DURATION).withCallback((finished) => {
        "worklet";
        if (finished) {
          scheduleOnRN(setVisible, false);
        }
      })}
      style={styles.splashOverlay}
    >
      {image}
    </Animated.View>
  ) : (
    <View
      onLayout={() => {
        void SplashScreen.hideAsync()
          .finally(() => {
            setAnimate(true);
          })
          .catch(() => {});
      }}
      style={styles.splashOverlay}
    >
      {image}
    </View>
  );
}

const keyframe = new Keyframe({
  0: {
    transform: [{ scale: INITIAL_SCALE_FACTOR }],
  },
  100: {
    transform: [{ scale: 1 }],
    easing: Easing.elastic(0.7),
  },
});

const logoKeyframe = new Keyframe({
  0: {
    transform: [{ scale: 1.3 }],
    opacity: 0,
  },
  40: {
    transform: [{ scale: 1.3 }],
    opacity: 0,
    easing: Easing.elastic(0.7),
  },
  100: {
    opacity: 1,
    transform: [{ scale: 1 }],
    easing: Easing.elastic(0.7),
  },
});

const glowKeyframe = new Keyframe({
  0: {
    transform: [{ rotateZ: "0deg" }],
  },
  100: {
    transform: [{ rotateZ: "7200deg" }],
  },
});

export function AnimatedIcon() {
  return (
    <View style={styles.iconContainer}>
      <Animated.View entering={glowKeyframe.duration(60 * 1000 * 4)} style={styles.glow}>
        <Image style={styles.glow} source={require("@/assets/images/logo-glow.png")} />
      </Animated.View>

      <Animated.View entering={keyframe.duration(DURATION)} style={styles.background} />
      <Animated.View style={styles.imageContainer} entering={logoKeyframe.duration(DURATION)}>
        <Image style={styles.image} source={require("@/assets/images/expo-logo.png")} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    borderRadius: 40,
    experimental_backgroundImage: ICON_GRADIENT,
    height: 128,
    position: "absolute",
    width: 128,
  },
  glow: {
    height: 201,
    position: "absolute",
    width: 201,
  },
  iconContainer: {
    alignItems: "center",
    height: 128,
    justifyContent: "center",
    width: 128,
    zIndex: 100,
  },
  image: {
    height: 71,
    width: 76,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  splashOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    backgroundColor: BrandColors.splashBackground,
    justifyContent: "center",
    zIndex: 1000,
  },
});
