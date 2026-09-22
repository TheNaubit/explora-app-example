import type { ComponentProps, ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { A11y } from "@/a11y";

type ViewStyleProp = ComponentProps<typeof View>["style"];

type ScreenFrameProps = {
  /** Spoken title when the screen mounts (VoiceOver / TalkBack). */
  title: string;
  children: ReactNode;
  /** Style for the outer screen container. */
  style?: ViewStyleProp;
  /** Style for the inner content region. */
  contentStyle?: ViewStyleProp;
  /**
   * When true, pad the top inset (status bar / Dynamic Island).
   * Default true. Set false when a native stack header owns the top inset.
   */
  padTop?: boolean;
  /**
   * When true, pad left and right safe insets.
   * Default true.
   */
  padHorizontal?: boolean;
  testID?: string;
};

/**
 * Shared screen shell. Announces the screen title on mount.
 * Applies safe-area padding so content clears the status bar and home indicator edges.
 * Renders `A11y.ScreenChange` after children so iOS can bind the first scroll view
 * to the large title and search bar.
 * Tab bars own the bottom inset, so this shell does not pad the bottom by default.
 */
export function ScreenFrame({
  title,
  children,
  style,
  contentStyle,
  padTop = true,
  padHorizontal = true,
  testID,
}: ScreenFrameProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.root,
        padTop ? { paddingTop: insets.top } : null,
        padHorizontal ? { paddingStart: insets.left, paddingEnd: insets.right } : null,
        style,
      ]}
      testID={testID}
    >
      <A11y.View focusable={false} a11yUIContainer="group" style={styles.content}>
        <View style={[styles.body, contentStyle]}>{children}</View>
      </A11y.View>
      <A11y.ScreenChange title={title} />
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  root: {
    flex: 1,
  },
});
