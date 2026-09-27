import { createElement } from "react";
import { Pressable, Text } from "react-native";
import { Atlas, Shader } from "@shopify/react-native-skia";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import { ParticleDissolve } from "@/components/particle-dissolve";
import { PARTICLE_DISSOLVE_GRAVITY_Y } from "@/components/particle-dissolve/constants";

describe("ParticleDissolve", () => {
  beforeEach(() => {
    jest.mocked(Atlas).mockClear();
    jest.mocked(Shader).mockClear();
  });

  it("renders the captured card through one GPU shader", async () => {
    const onComplete = jest.fn();

    await render(
      createElement(ParticleDissolve, {
        children: (startDissolve) =>
          createElement(
            Pressable,
            { onPress: startDissolve, testID: "remove-card" },
            createElement(Text, null, "Card"),
          ),
        onDissolveComplete: onComplete,
      }),
    );

    await fireEvent(screen.getByTestId("particle-dissolve"), "layout", {
      nativeEvent: { layout: { height: 480, width: 354, x: 0, y: 0 } },
    });
    await fireEvent.press(screen.getByTestId("remove-card"));

    await waitFor(() => {
      expect(screen.getByTestId("particle-dissolve-canvas")).toBeOnTheScreen();
    });
    expect(Shader).toHaveBeenCalledTimes(1);
    expect(Atlas).not.toHaveBeenCalled();
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("moves the dissolve toward the top edge", () => {
    expect(PARTICLE_DISSOLVE_GRAVITY_Y).toBeLessThan(0);
  });
});
