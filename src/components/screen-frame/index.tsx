import type { ComponentProps, ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { A11y } from "@/a11y";

type ViewStyleProp = ComponentProps<typeof View>["style"];
type ScrollViewProps = Omit<
  ComponentProps<typeof ScrollView>,
  "children" | "contentContainerStyle" | "contentInsetAdjustmentBehavior" | "style" | "testID"
>;

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
  /** Make the native scroll view the screen root for stack large-title behavior. */
  scrollable?: boolean;
  /** Props for the root scroll view when `scrollable` is true. */
  scrollViewProps?: ScrollViewProps;
  /** Content-container style for the root scroll view. */
  scrollContentStyle?: ComponentProps<typeof ScrollView>["contentContainerStyle"];
  testID?: string;
};

/**
 * Shared screen shell. Announces the screen title on mount.
 * Applies safe-area padding so content clears the status bar and home indicator edges.
 * Use `scrollable` when a native stack header must bind to the root scroll view.
 * Renders `A11y.ScreenChange` after the screen content.
 * Tab bars own the bottom inset, so this shell does not pad the bottom by default.
 */
export function ScreenFrame({
  title,
  children,
  style,
  contentStyle,
  padTop = true,
  padHorizontal = true,
  scrollable = false,
  scrollViewProps,
  scrollContentStyle,
  testID,
}: ScreenFrameProps) {
  const insets = useSafeAreaInsets();
  const horizontalInsetStyle = padHorizontal
    ? { paddingEnd: insets.right, paddingStart: insets.left }
    : null;
  const topInsetStyle = padTop ? { paddingTop: insets.top } : null;

  if (scrollable) {
    return (
      <ScrollView
        {...scrollViewProps}
        contentContainerStyle={[
          styles.scrollContainer,
          horizontalInsetStyle,
          topInsetStyle,
          scrollContentStyle,
        ]}
        contentInsetAdjustmentBehavior="automatic"
        style={[styles.root, style]}
        testID={testID}
      >
        <A11y.View focusable={false} a11yUIContainer="group" style={styles.scrollContent}>
          <View style={contentStyle}>{children}</View>
        </A11y.View>
        <A11y.ScreenChange title={title} />
      </ScrollView>
    );
  }

  return (
    <View style={[styles.root, horizontalInsetStyle, topInsetStyle, style]} testID={testID}>
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
    minHeight: 0,
  },
  content: {
    flex: 1,
    minHeight: 0,
  },
  root: {
    flex: 1,
    minHeight: 0,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: 0,
  },
});
