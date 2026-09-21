import type { ComponentProps } from "react";

import { A11y } from "@/a11y";
import { A11yPressable } from "@/components/a11y-pressable";

type A11yCardProps = Omit<ComponentProps<typeof A11y.Card>, "focusStyle">;

/**
 * Activity-style card. Keeps the card action and inner controls accessible.
 * Use for discovery and favorites list rows that open detail and have actions.
 * Focus styling comes from `A11yPressable` via the `style` callback API.
 */
export function A11yCard({ style, PressableComponent = A11yPressable, ...rest }: A11yCardProps) {
  return <A11y.Card {...rest} style={style} PressableComponent={PressableComponent} />;
}
