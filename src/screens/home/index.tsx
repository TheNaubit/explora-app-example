import { plural } from "@lingui/core/macro";
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react/macro";
import { Text, StyleSheet } from "react-native";

import { ScreenFrame } from "@/components/screen-frame";
import { SUPPLIED_ACTIVITIES } from "@/data/activities";
import { spacing, typography, useAppTheme } from "@/theme";

const screenTitle = msg({
  id: "home.screenTitle",
  comment: "Spoken screen title for the home / discovery entry screen",
  message: "Explora home",
});

/** Discovery entry screen. The thin route `src/app/index` renders this screen. */
export function Home() {
  const { t } = useLingui();
  const theme = useAppTheme();
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
    <ScreenFrame
      title={t(screenTitle)}
      contentStyle={[styles.content, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.title, { color: theme.colors.text }]} accessibilityRole="header">
        {t({
          id: "home.brand",
          comment: "Product name shown as the home screen heading",
          message: "Explora",
        })}
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        {t({
          id: "home.subtitle",
          comment: "Home supporting line under the product name",
          message: "Discover activities and save favorites for later.",
        })}
      </Text>
      <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>{catalogSummary}</Text>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: "center",
    paddingHorizontal: spacing.space24,
  },
  meta: {
    ...typography.caption,
  },
  subtitle: {
    ...typography.body,
    marginBottom: spacing.space16,
  },
  title: {
    ...typography.title,
    marginBottom: spacing.space8,
  },
});
