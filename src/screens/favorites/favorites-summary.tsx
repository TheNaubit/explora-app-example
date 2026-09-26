import { StyleSheet, Text, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { useLingui } from "@lingui/react/macro";

import { A11y } from "@/a11y";
import { favoritesMessages } from "@/screens/favorites/messages";
import { spacing, typography, useAppTheme } from "@/theme";

/** Visual size of the offline symbol next to the summary text. */
const SUMMARY_ICON_SIZE = 14;

type FavoritesSummaryProps = {
  count: number;
};

/** One quiet line that states the favorite count and that favorites work offline. */
export function FavoritesSummary({ count }: FavoritesSummaryProps) {
  const { i18n } = useLingui();
  const theme = useAppTheme();
  const summary = i18n._({ ...favoritesMessages.summary, values: { count } });
  const spokenSummary = i18n._({
    ...favoritesMessages.summaryAccessibilityLabel,
    values: { count },
  });

  return (
    <A11y.View
      accessibilityLabel={spokenSummary}
      accessibilityRole="text"
      accessible
      focusable={false}
      style={styles.row}
      testID="favorites-summary"
    >
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <SymbolView
          name={{ ios: "arrow.down.circle.fill", android: "download_done", web: "download_done" }}
          size={SUMMARY_ICON_SIZE}
          tintColor={theme.colors.accent}
        />
      </View>
      <Text style={[styles.text, { color: theme.colors.textSecondary }]}>{summary}</Text>
    </A11y.View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.space8,
    marginHorizontal: spacing.space24,
  },
  text: {
    ...typography.caption,
    flexShrink: 1,
    fontVariant: ["tabular-nums"],
    textAlign: "left",
  },
});
