import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import Animated, { Keyframe, Easing } from "react-native-reanimated";

import classes from "./animated-icon.module.css";
const DURATION = 300;

export function AnimatedSplashOverlay() {
  return null;
}

const keyframe = new Keyframe({
  0: {
    transform: [{ scale: 0 }],
  },
  60: {
    transform: [{ scale: 1.2 }],
    easing: Easing.elastic(1.2),
  },
  100: {
    transform: [{ scale: 1 }],
    easing: Easing.elastic(1.2),
  },
});

const logoKeyframe = new Keyframe({
  0: {
    opacity: 0,
  },
  60: {
    transform: [{ scale: 1.2 }],
    opacity: 0,
    easing: Easing.elastic(1.2),
  },
  100: {
    transform: [{ scale: 1 }],
    opacity: 1,
    easing: Easing.elastic(1.2),
  },
});

const glowKeyframe = new Keyframe({
  0: {
    transform: [{ rotateZ: "-180deg" }, { scale: 0.8 }],
    opacity: 0,
  },
  [DURATION / 1000]: {
    transform: [{ rotateZ: "0deg" }, { scale: 1 }],
    opacity: 1,
    easing: Easing.elastic(0.7),
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

      <Animated.View style={styles.background} entering={keyframe.duration(DURATION)}>
        <div className={classes.expoLogoBackground} />
      </Animated.View>

      <Animated.View style={styles.imageContainer} entering={logoKeyframe.duration(DURATION)}>
        <Image style={styles.image} source={require("@/assets/images/expo-logo.png")} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
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
  },
  image: {
    height: 71,
    position: "absolute",
    width: 76,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
