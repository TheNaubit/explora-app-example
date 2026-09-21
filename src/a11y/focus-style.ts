import type { StyleProp, ViewStyle } from "react-native";

import { colors } from "@/theme";

/** Interaction state from `react-native-a11y` style callbacks. */
export type KeyboardInteractionState = {
  readonly focused: boolean;
  readonly pressed: boolean;
};

/** Style prop that may be static or a focus/press callback. */
export type KeyboardInteractiveStyle =
  | StyleProp<ViewStyle>
  | ((state: KeyboardInteractionState) => StyleProp<ViewStyle>);

/**
 * Default keyboard focus ring for pressables and inputs.
 * Apply through `mergeFocusedStyle` or a `style` / managed focus style.
 * Do not pass the deprecated `focusStyle` prop.
 */
export const DEFAULT_KEYBOARD_FOCUS_STYLE: ViewStyle = {
  borderColor: colors.tint,
  borderWidth: 2,
};

/**
 * Build a `style` callback that merges a base style with the default focus ring.
 * Prefer this over the deprecated `focusStyle` prop.
 */
export function mergeFocusedStyle(
  style?: KeyboardInteractiveStyle,
  focusedStyle: ViewStyle = DEFAULT_KEYBOARD_FOCUS_STYLE,
): (state: KeyboardInteractionState) => StyleProp<ViewStyle> {
  return (state) => [
    typeof style === "function" ? style(state) : style,
    state.focused ? focusedStyle : null,
  ];
}
