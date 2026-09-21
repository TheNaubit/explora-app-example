import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { A11y } from "@/a11y";

type ScreenFrameProps = {
  /** Spoken title when the screen mounts (VoiceOver / TalkBack). */
  title: string;
  children: ReactNode;
  /** Style for the outer screen container. */
  style?: StyleProp<ViewStyle>;
  /** Style for the inner content region. */
  contentStyle?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * Shared screen shell. Announces the screen title on mount.
 * Pass `contentStyle` for layout of the screen body (padding, centering).
 * `A11y.ScreenChange` runs on mount. Re-announce when a kept-alive screen returns to focus.
 */
export function ScreenFrame({ title, children, style, contentStyle, testID }: ScreenFrameProps) {
  return (
    <View style={[styles.root, style]} testID={testID}>
      <A11y.ScreenChange title={title} />
      <A11y.View focusable={false} a11yUIContainer="group" style={[styles.content, contentStyle]}>
        {children}
      </A11y.View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  root: {
    flex: 1,
  },
});
