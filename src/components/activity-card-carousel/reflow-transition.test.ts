import type { LayoutAnimationsValues, SharedValue } from "react-native-reanimated";

import { createGatedReflowTransition } from "@/components/activity-card-carousel/reflow-transition";

function fakeFlag(value: number): SharedValue<number> {
  return { get: () => value } as unknown as SharedValue<number>;
}

const values = {
  currentHeight: 400,
  currentOriginX: 24,
  currentOriginY: 900,
  currentWidth: 354,
  targetHeight: 400,
  targetOriginX: 24,
  targetOriginY: 120,
  targetWidth: 354,
} as LayoutAnimationsValues;

describe("createGatedReflowTransition", () => {
  it("places a card at its target at once when no removal is in progress", () => {
    const result = createGatedReflowTransition(fakeFlag(0))(values);

    expect(result.initialValues.originY).toBe(values.targetOriginY);
    expect(result.animations).toEqual({});
  });

  it("starts from the current position and animates to the target during a removal", () => {
    const result = createGatedReflowTransition(fakeFlag(1))(values);

    expect(result.initialValues.originY).toBe(values.currentOriginY);
    expect(result.animations.originY).toBe(values.targetOriginY);
  });
});
