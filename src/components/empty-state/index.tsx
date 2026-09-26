import { StyleSheet, Text, View } from "react-native";
import { Image, type ImageSource } from "expo-image";
import Animated from "react-native-reanimated";

import { A11yPressable } from "@/components/a11y-pressable";
import { MIN_TOUCH_TARGET } from "@/components/constants";
import { useStateEntrance } from "@/hooks/use-state-entrance";
import { radii, spacing, typography, useAppTheme } from "@/theme";

type EmptyStateProps = {
  title: string;
  body: string;
  actionLabel: string;
  onAction: () => void;
  /** Decorative claymorphic illustration. Hidden from the screen reader. */
  illustration?: ImageSource;
  presentation?: "leading" | "centered";
  testID?: string;
};

/**
 * Designed empty result. Show after a query succeeds with zero items.
 * Always include one recovery action.
 */
export function EmptyState({
  title,
  body,
  actionLabel,
  onAction,
  illustration,
  presentation = "leading",
  testID,
}: EmptyStateProps) {
  const theme = useAppTheme();
  const isCentered = presentation === "centered";
  const entranceStyle = useStateEntrance();

  return (
    <Animated.View
      style={[styles.root, isCentered ? styles.centeredRoot : undefined, entranceStyle]}
      testID={testID ?? "empty-state"}
    >
      {illustration && isCentered ? (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={[
            styles.centeredIllustrationFrame,
            { backgroundColor: theme.colors.surfaceSecondary },
          ]}
        >
          <Image
            source={illustration}
            style={styles.centeredIllustration}
            contentFit="contain"
            testID="empty-state-illustration"
          />
        </View>
      ) : illustration ? (
        <Image
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          source={illustration}
          style={styles.illustration}
          contentFit="contain"
          testID="empty-state-illustration"
        />
      ) : null}
      <Text
        style={[
          styles.title,
          isCentered ? styles.centeredText : undefined,
          { color: theme.colors.text },
        ]}
        accessibilityRole="header"
      >
        {title}
      </Text>
      <Text
        style={[
          styles.body,
          isCentered ? styles.centeredBody : undefined,
          isCentered ? styles.centeredText : undefined,
          { color: theme.colors.textSecondary },
        ]}
      >
        {body}
      </Text>
      <A11yPressable
        accessibilityRole="button"
        accessibilityLabel={actionLabel}
        onPress={onAction}
        style={({ pressed }) => [
          styles.action,
          isCentered ? styles.centeredAction : undefined,
          { backgroundColor: pressed ? theme.colors.accentPressed : theme.colors.accent },
          pressed ? styles.pressedAction : undefined,
        ]}
        testID="empty-state-action"
      >
        <Text
          style={[
            styles.actionLabel,
            isCentered ? styles.centeredText : undefined,
            { color: theme.colors.onAccent },
          ]}
        >
          {actionLabel}
        </Text>
      </A11yPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  action: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: radii.medium,
    justifyContent: "center",
    minHeight: MIN_TOUCH_TARGET,
    paddingHorizontal: spacing.space16,
    paddingVertical: spacing.space12,
  },
  actionLabel: {
    ...typography.label,
    textAlign: "left",
  },
  centeredAction: {
    alignSelf: "center",
    borderRadius: radii.full,
    paddingHorizontal: spacing.space24,
  },
  centeredBody: {
    marginBottom: spacing.space24,
    maxWidth: 300,
  },
  centeredIllustration: {
    height: 164,
    width: 164,
  },
  centeredIllustrationFrame: {
    alignItems: "center",
    borderRadius: radii.full,
    height: 184,
    justifyContent: "center",
    marginBottom: spacing.space24,
    width: 184,
  },
  centeredRoot: {
    alignItems: "center",
    alignSelf: "center",
    maxWidth: 360,
    width: "100%",
  },
  centeredText: {
    textAlign: "center",
  },
  body: {
    ...typography.body,
    marginBottom: spacing.space16,
    textAlign: "left",
  },
  illustration: {
    alignSelf: "center",
    height: 140,
    marginBottom: spacing.space16,
    width: 140,
  },
  root: {
    paddingHorizontal: spacing.space24,
    paddingVertical: spacing.space32,
  },
  pressedAction: {
    transform: [{ scale: 0.97 }],
  },
  title: {
    ...typography.headline,
    marginBottom: spacing.space8,
    textAlign: "left",
  },
});
