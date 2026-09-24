import { Children, type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { radii, spacing, typography, useAppTheme } from "@/theme";

type DevToolsSectionProps = {
  title: string;
  children: ReactNode;
  footer?: string;
};

/** Grouped settings section with iOS-style inset rows. */
export function DevToolsSection({ title, children, footer }: DevToolsSectionProps) {
  const theme = useAppTheme();
  const rows = Children.toArray(children);

  return (
    <View style={styles.section}>
      <Text
        accessibilityRole="header"
        style={[styles.title, { color: theme.colors.textSecondary }]}
      >
        {title}
      </Text>
      <View style={[styles.group, { backgroundColor: theme.colors.surface }]}>
        {rows.map((row, index) => (
          <View key={index}>
            {index > 0 ? (
              <View style={[styles.separator, { backgroundColor: theme.colors.border }]} />
            ) : null}
            {row}
          </View>
        ))}
      </View>
      {footer ? (
        <Text style={[styles.footer, { color: theme.colors.textSecondary }]}>{footer}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    ...typography.caption,
    marginTop: spacing.space8,
    paddingHorizontal: spacing.space16,
    textAlign: "left",
  },
  group: {
    borderRadius: radii.medium,
    overflow: "hidden",
  },
  section: {
    gap: spacing.space8,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginStart: spacing.space16,
  },
  title: {
    ...typography.caption,
    paddingHorizontal: spacing.space16,
    textAlign: "left",
    textTransform: "uppercase",
  },
});
