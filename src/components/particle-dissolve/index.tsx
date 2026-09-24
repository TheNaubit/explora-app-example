import {
  type Component,
  type ComponentRef,
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { type LayoutChangeEvent, Platform, StyleSheet, View } from "react-native";
import {
  Atlas,
  Canvas,
  FilterMode,
  makeImageFromView,
  MipmapMode,
  rect,
  type SkImage,
  useColorBuffer,
  useRSXformBuffer,
} from "@shopify/react-native-skia";
import {
  cancelAnimation,
  Easing,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import {
  PARTICLE_DISSOLVE_DURATION_MS,
  PARTICLE_DISSOLVE_CANVAS_PADDING,
  PARTICLE_DISSOLVE_GRAVITY_Y,
  PARTICLE_DISSOLVE_SCALE_LOSS,
  PARTICLE_DISSOLVE_TRAVEL_X,
  PARTICLE_DISSOLVE_TRAVEL_Y,
} from "@/components/particle-dissolve/constants";
import { getParticleProgress, particleRandom } from "@/components/particle-dissolve/particle-math";
import { getParticleGrid } from "@/components/particle-dissolve/particle-grid";

type ParticleDissolveProps = {
  children: (startDissolve: () => boolean) => ReactNode;
  onDissolveComplete: () => void;
  testID?: string;
};

type DissolveCanvasProps = {
  height: number;
  image: SkImage;
  onComplete: () => void;
  width: number;
};

type MeasuredSize = {
  height: number;
  width: number;
};

/** Snapshot one view and dissolve it through a single batched Skia atlas. */
export function ParticleDissolve({
  children,
  onDissolveComplete,
  testID = "particle-dissolve",
}: ParticleDissolveProps) {
  const reduceMotion = useReducedMotion();
  const viewRef = useRef<ComponentRef<typeof View>>(null);
  const pendingRef = useRef(false);
  const completedRef = useRef(false);
  const [measuredSize, setMeasuredSize] = useState<MeasuredSize | null>(null);
  const [snapshot, setSnapshot] = useState<SkImage | null>(null);

  const completeRemoval = useCallback(() => {
    if (completedRef.current) return;

    completedRef.current = true;
    onDissolveComplete();
  }, [onDissolveComplete]);

  const startDissolve = useCallback(() => {
    if (pendingRef.current || completedRef.current) return false;

    pendingRef.current = true;
    if (reduceMotion || Platform.OS === "web" || !viewRef.current || !measuredSize) {
      completeRemoval();
      return true;
    }

    void makeImageFromView(viewRef as unknown as RefObject<Component<unknown, unknown> | null>)
      .then((image) => {
        setSnapshot(image);
      })
      .catch(() => {
        completeRemoval();
      });

    return true;
  }, [completeRemoval, measuredSize, reduceMotion]);

  function handleLayout(event: LayoutChangeEvent) {
    const { height, width } = event.nativeEvent.layout;
    setMeasuredSize({ height, width });
  }

  return (
    <View
      collapsable={false}
      onLayout={handleLayout}
      ref={viewRef}
      style={styles.container}
      testID={testID}
    >
      <View
        accessibilityElementsHidden={snapshot !== null}
        importantForAccessibility={snapshot === null ? "auto" : "no-hide-descendants"}
        pointerEvents={snapshot === null ? "auto" : "none"}
        style={snapshot === null ? null : styles.hidden}
      >
        {children(startDissolve)}
      </View>
      {snapshot && measuredSize ? (
        <DissolveCanvas
          height={measuredSize.height}
          image={snapshot}
          onComplete={completeRemoval}
          width={measuredSize.width}
        />
      ) : null}
    </View>
  );
}

function DissolveCanvas({ height, image, onComplete, width }: DissolveCanvasProps) {
  const progress = useSharedValue(0);
  const imageWidth = image.width();
  const imageHeight = image.height();
  const platform = Platform.OS === "android" || Platform.OS === "ios" ? Platform.OS : "other";
  const { columnCount, particleCount, rowCount } = getParticleGrid(width, height, platform);
  const tileWidthPixels = imageWidth / columnCount;
  const tileHeightPixels = imageHeight / rowCount;
  const tileWidth = width / columnCount;
  const tileHeight = height / rowCount;
  const snapshotScale = width / imageWidth;

  const sprites = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, index) => {
        const column = index % columnCount;
        const row = Math.floor(index / columnCount);
        return rect(
          column * tileWidthPixels,
          row * tileHeightPixels,
          tileWidthPixels,
          tileHeightPixels,
        );
      }),
    [columnCount, particleCount, tileHeightPixels, tileWidthPixels],
  );

  const transforms = useRSXformBuffer(particleCount, (transform, index) => {
    "worklet";
    const column = index % columnCount;
    const row = Math.floor(index / columnCount);
    const localProgress = getParticleProgress(progress.get(), index, column, columnCount);
    const easedProgress = 1 - (1 - localProgress) * (1 - localProgress);
    const randomX = particleRandom(index, 2) - 0.35;
    const randomY = particleRandom(index, 3) - 0.65;
    const travelX = randomX * PARTICLE_DISSOLVE_TRAVEL_X * easedProgress;
    const travelY =
      randomY * PARTICLE_DISSOLVE_TRAVEL_Y * easedProgress +
      PARTICLE_DISSOLVE_GRAVITY_Y * easedProgress * easedProgress;
    const scale = (1 - localProgress * PARTICLE_DISSOLVE_SCALE_LOSS) * snapshotScale;

    transform.set(
      scale,
      0,
      PARTICLE_DISSOLVE_CANVAS_PADDING + column * tileWidth + travelX,
      PARTICLE_DISSOLVE_CANVAS_PADDING + row * tileHeight + travelY,
    );
  });

  const colors = useColorBuffer(particleCount, (color, index) => {
    "worklet";
    const column = index % columnCount;
    const localProgress = getParticleProgress(progress.get(), index, column, columnCount);
    color[0] = 1;
    color[1] = 1;
    color[2] = 1;
    color[3] = 1 - localProgress;
  });

  useEffect(() => {
    progress.set(
      withTiming(
        1,
        {
          duration: PARTICLE_DISSOLVE_DURATION_MS,
          easing: Easing.linear,
        },
        (finished) => {
          "worklet";
          if (finished) scheduleOnRN(onComplete);
        },
      ),
    );

    return () => cancelAnimation(progress);
  }, [onComplete, progress]);

  return (
    <Canvas
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={styles.canvas}
      testID="particle-dissolve-canvas"
    >
      <Atlas
        colorBlendMode="modulate"
        colors={colors}
        image={image}
        sampling={{ filter: FilterMode.Linear, mipmap: MipmapMode.None }}
        sprites={sprites}
        transforms={transforms}
      />
    </Canvas>
  );
}

const styles = StyleSheet.create({
  canvas: {
    bottom: -PARTICLE_DISSOLVE_CANVAS_PADDING,
    left: -PARTICLE_DISSOLVE_CANVAS_PADDING,
    position: "absolute",
    right: -PARTICLE_DISSOLVE_CANVAS_PADDING,
    top: -PARTICLE_DISSOLVE_CANVAS_PADDING,
  },
  container: {
    position: "relative",
  },
  hidden: {
    opacity: 0,
  },
});
