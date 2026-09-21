import { Text, StyleSheet } from "react-native";

import { ScreenFrame } from "@/components/screen-frame";
import { SUPPLIED_ACTIVITIES } from "@/data/activities";
import { colors, spacing, typography } from "@/theme";

/** Discovery entry screen. The thin route `src/app/index` renders this screen. */
export function Home() {
  const catalogSummary = `Catalog ready: ${SUPPLIED_ACTIVITIES.length} supplied activities`;

  return (
    <ScreenFrame title="Explora home" contentStyle={styles.content}>
      <Text style={styles.title} accessibilityRole="header">
        Explora
      </Text>
      <Text style={styles.subtitle}>Discover activities and save favorites for later.</Text>
      <Text style={styles.meta}>{catalogSummary}</Text>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: colors.background,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  meta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.sm,
  },
});
