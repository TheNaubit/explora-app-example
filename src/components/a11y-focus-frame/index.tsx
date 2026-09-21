import type { ComponentProps } from "react";

import { A11y } from "@/a11y";

type A11yFocusFrameProps = ComponentProps<typeof A11y.FocusFrame>;

/**
 * Focus frame helper for regions that need keyboard and screen-reader bounds.
 * Prefer `A11yFocusTrap` for modal dialogs. Use this when the library guide asks for a frame.
 */
export function A11yFocusFrame({ ...rest }: A11yFocusFrameProps) {
  return <A11y.FocusFrame {...rest} />;
}
