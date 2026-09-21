import type { ComponentProps } from "react";

import { A11y, mergeFocusedStyle } from "@/a11y";

type A11yPressableProps = Omit<
  ComponentProps<typeof A11y.Pressable>,
  "focusStyle" | "containerFocusStyle"
>;

/**
 * Project pressable with keyboard focus and a default focus ring.
 * Prefer this over raw `Pressable` for primary actions.
 * Uses the `style` callback API. Does not accept deprecated `focusStyle`.
 */
export function A11yPressable({ style, ...rest }: A11yPressableProps) {
  return <A11y.Pressable {...rest} style={mergeFocusedStyle(style)} />;
}
