import type { ComponentProps } from "react";

import { A11y } from "@/a11y";

type A11yFocusTrapProps = ComponentProps<typeof A11y.FocusTrap>;

/**
 * Confine screen-reader and keyboard focus inside a modal or overlay.
 * Mount while the overlay is visible. Unmount when it closes.
 */
export function A11yFocusTrap({ ...rest }: A11yFocusTrapProps) {
  return <A11y.FocusTrap {...rest} />;
}
