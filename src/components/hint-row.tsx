import type { ReactNode } from "react";
import { View, StyleSheet } from "react-native";

import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

import { Spacing } from "@/constants/theme";

type HintRowProps = {
  title?: string;
  hint?: ReactNode;
};

export function HintRow({ title = "Try editing", hint = "app/index.tsx" }: HintRowProps) {
  return (
    <View style={styles.stepRow}>
      <ThemedText type="small">{title}</ThemedText>
      <ThemedView type="backgroundSelected" style={styles.codeSnippet}>
        <ThemedText themeColor="textSecondary">{hint}</ThemedText>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  codeSnippet: {
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
  stepRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
