import { StyleSheet, Text, View } from "react-native";
import { type AndroidSymbol, type SFSymbol, SymbolView } from "expo-symbols";

import { A11y } from "@/a11y";
import {
  ACTIVITY_DETAIL_FACT_ICON_FRAME,
  ACTIVITY_DETAIL_FACT_ICON_SIZE,
} from "@/screens/activity-detail/constants";
import { radii, spacing, typography, useAppTheme } from "@/theme";

export type ActivityFact = {
  /** Localized spoken text for the full row. */
  accessibilityLabel: string;
  id: string;
  label: string;
  symbol: { android: AndroidSymbol; ios: SFSymbol; web: AndroidSymbol };
  value: string;
};

type ActivityFactListProps = {
  facts: readonly ActivityFact[];
};

/** Grouped activity facts. Each row has one symbol, one value, and one label. */
export function ActivityFactList({ facts }: ActivityFactListProps) {
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.group,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
      testID="activity-detail-facts"
    >
      {facts.map((fact, index) => (
        <View key={fact.id}>
          {index > 0 ? (
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          ) : null}
          <ActivityFactRow fact={fact} />
        </View>
      ))}
    </View>
  );
}

function ActivityFactRow({ fact }: { fact: ActivityFact }) {
  const theme = useAppTheme();

  return (
    <A11y.View
      accessibilityLabel={fact.accessibilityLabel}
      accessibilityRole="text"
      accessible
      focusable={false}
      style={styles.row}
      testID={`activity-detail-fact-${fact.id}`}
    >
      <View style={[styles.iconFrame, { backgroundColor: theme.colors.surfaceSecondary }]}>
        <SymbolView
          name={fact.symbol}
          size={ACTIVITY_DETAIL_FACT_ICON_SIZE}
          tintColor={theme.colors.accent}
        />
      </View>
      <View style={styles.copy}>
        <Text selectable style={[styles.value, { color: theme.colors.text }]}>
          {fact.value}
        </Text>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{fact.label}</Text>
      </View>
    </A11y.View>
  );
}

const styles = StyleSheet.create({
  copy: {
    flex: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginStart: spacing.space16 + ACTIVITY_DETAIL_FACT_ICON_FRAME + spacing.space12,
  },
  group: {
    borderCurve: "continuous",
    borderRadius: radii.large,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  iconFrame: {
    alignItems: "center",
    borderCurve: "continuous",
    borderRadius: radii.small,
    height: ACTIVITY_DETAIL_FACT_ICON_FRAME,
    justifyContent: "center",
    width: ACTIVITY_DETAIL_FACT_ICON_FRAME,
  },
  label: {
    ...typography.caption,
    textAlign: "left",
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.space12,
    paddingHorizontal: spacing.space16,
    paddingVertical: spacing.space12,
  },
  value: {
    ...typography.bodyStrong,
    textAlign: "left",
  },
});
