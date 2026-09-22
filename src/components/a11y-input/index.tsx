import { useState, type ComponentProps } from "react";

import { A11y, DEFAULT_KEYBOARD_FOCUS_STYLE } from "@/a11y";

type A11yInputProps = Omit<ComponentProps<typeof A11y.Input>, "focusStyle" | "containerFocusStyle">;
type InputStyle = NonNullable<ComponentProps<typeof A11y.Input>["style"]>;

/**
 * Project text field with keyboard focus support.
 * Prefer this over raw `TextInput` for search and forms.
 * Applies the focus ring through managed style. Does not accept deprecated `focusStyle`.
 */
export function A11yInput({ style, onFocusChange, ...rest }: A11yInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <A11y.Input
      {...rest}
      onFocusChange={(isFocused) => {
        setFocused(isFocused);
        onFocusChange?.(isFocused);
      }}
      style={[style, focused ? (DEFAULT_KEYBOARD_FOCUS_STYLE as InputStyle) : null]}
    />
  );
}
