import { plural } from "@lingui/core/macro";
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react/macro";
import { Text, StyleSheet } from "react-native";

import { ScreenFrame } from "@/components/screen-frame";
import { SUPPLIED_ACTIVITIES } from "@/data/activities";
import { colors, spacing, typography } from "@/theme";

const screenTitle = msg({
  id: "home.screenTitle",
  comment: "Spoken screen title for the home / discovery entry screen",
  message: "Explora home",
});

/** Discovery entry screen. The thin route `src/app/index` renders this screen. */
export function Home() {
  const { t } = useLingui();
  const count = SUPPLIED_ACTIVITIES.length;
  const catalogSummary = t({
    id: "home.catalogSummary",
    comment: "Home meta line: how many supplied catalog activities are loaded",
    message: plural(count, {
      one: "Catalog ready: # supplied activity",
      other: "Catalog ready: # supplied activities",
    }),
  });

  return (
    <ScreenFrame title={t(screenTitle)} contentStyle={styles.content}>
      <Text style={styles.title} accessibilityRole="header">
        {t({
          id: "home.brand",
          comment: "Product name shown as the home screen heading",
          message: "Explora",
        })}
      </Text>
      <Text style={styles.subtitle}>
        {t({
          id: "home.subtitle",
          comment: "Home supporting line under the product name",
          message: "Discover activities and save favorites for later.",
        })}
      </Text>
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
