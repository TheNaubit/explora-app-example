import { Text, View, StyleSheet } from "react-native";

import { SUPPLIED_ACTIVITIES } from "@/data/activities";
import { colors, spacing, typography } from "@/theme";

export function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityRole="header">
        Explora
      </Text>
      <Text style={styles.subtitle}>Discover activities and save favorites for later.</Text>
      <Text style={styles.meta}>
        Catalog ready: {SUPPLIED_ACTIVITIES.length} supplied activities
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
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
