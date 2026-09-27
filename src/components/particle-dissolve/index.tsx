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
  Canvas,
  Fill,
  FilterMode,
  ImageShader,
  makeImageFromView,
  MipmapMode,
  rect,
  Shader,
  type SkImage,
} from "@shopify/react-native-skia";
import {
  cancelAnimation,
  Easing,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import {
  PARTICLE_DISSOLVE_DURATION_MS,
  PARTICLE_DISSOLVE_CANVAS_PADDING,
  PARTICLE_DISSOLVE_GRAVITY_Y,
  PARTICLE_DISSOLVE_MAX_LIFETIME,
  PARTICLE_DISSOLVE_MIN_LIFETIME,
  PARTICLE_DISSOLVE_PARTICLE_SIZE,
  PARTICLE_DISSOLVE_RANDOM_STAGGER,
  PARTICLE_DISSOLVE_SCALE_LOSS,
  PARTICLE_DISSOLVE_TRAVEL_X,
  PARTICLE_DISSOLVE_TRAVEL_Y,
  PARTICLE_DISSOLVE_WAVE_SPAN,
} from "@/components/particle-dissolve/constants";
import { PARTICLE_DISSOLVE_SHADER } from "@/components/particle-dissolve/particle-shader";

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
  const imageRect = useMemo(
    () => rect(PARTICLE_DISSOLVE_CANVAS_PADDING, PARTICLE_DISSOLVE_CANVAS_PADDING, width, height),
    [height, width],
  );
  const uniforms = useDerivedValue(() => ({
    gravity: PARTICLE_DISSOLVE_GRAVITY_Y,
    maxLifetime: PARTICLE_DISSOLVE_MAX_LIFETIME,
    minLifetime: PARTICLE_DISSOLVE_MIN_LIFETIME,
    origin: [PARTICLE_DISSOLVE_CANVAS_PADDING, PARTICLE_DISSOLVE_CANVAS_PADDING],
    particleSize: PARTICLE_DISSOLVE_PARTICLE_SIZE,
    progress: progress.get(),
    randomStagger: PARTICLE_DISSOLVE_RANDOM_STAGGER,
    scaleLoss: PARTICLE_DISSOLVE_SCALE_LOSS,
    size: [width, height],
    travel: [PARTICLE_DISSOLVE_TRAVEL_X, PARTICLE_DISSOLVE_TRAVEL_Y],
    waveSpan: PARTICLE_DISSOLVE_WAVE_SPAN,
  }));

  useEffect(() => {
    if (!PARTICLE_DISSOLVE_SHADER) {
      onComplete();
      return;
    }

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

  if (!PARTICLE_DISSOLVE_SHADER) return null;

  return (
    <Canvas
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={styles.canvas}
      testID="particle-dissolve-canvas"
    >
      <Fill>
        <Shader source={PARTICLE_DISSOLVE_SHADER} uniforms={uniforms}>
          <ImageShader
            fit="fill"
            image={image}
            rect={imageRect}
            sampling={{ filter: FilterMode.Linear, mipmap: MipmapMode.None }}
            tx="decal"
            ty="decal"
          />
        </Shader>
      </Fill>
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
