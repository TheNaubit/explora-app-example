import { StyleSheet } from "react-native";
import { render, screen } from "@testing-library/react-native";
import { useSharedValue } from "react-native-reanimated";

import { CollapsingScreenHeader } from "@/components/collapsing-screen-header";
import { COLLAPSING_HEADER_DISTANCE } from "@/components/collapsing-screen-header/constants";
import { primitiveColors } from "@/theme";

function TestHeader() {
  const scrollOffset = useSharedValue(COLLAPSING_HEADER_DISTANCE);

  return (
    <CollapsingScreenHeader
      bodyHeight={76}
      safeAreaTop={47}
      scrollOffset={scrollOffset}
      title="Saved"
    />
  );
}

describe("CollapsingScreenHeader", () => {
  it("uses a high-contrast compact title over scrolling content", async () => {
    await render(<TestHeader />);

    const titles = screen.getAllByText("Saved", { includeHiddenElements: true });
    const compactStyle = StyleSheet.flatten(titles[1].props.style);

    expect(compactStyle.color).toBe(primitiveColors.white);
  });
});
