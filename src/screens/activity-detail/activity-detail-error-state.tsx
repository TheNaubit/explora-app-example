import { ScrollView, StyleSheet } from "react-native";

import { RecoveryState } from "@/components/recovery-state";
import { spacing } from "@/theme";

type ActivityDetailErrorStateProps = {
  body: string;
  onRetry: () => void;
  retryLabel: string;
  title: string;
  topInset: number;
};

/** Show a full-screen recovery state when Activity Detail cannot load. */
export function ActivityDetailErrorState({
  body,
  onRetry,
  retryLabel,
  title,
  topInset,
}: ActivityDetailErrorStateProps) {
  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: topInset + spacing.space48, paddingTop: topInset + spacing.space48 },
      ]}
      contentInsetAdjustmentBehavior="never"
      testID="activity-detail-error-scroll"
    >
      <RecoveryState
        actionLabel={retryLabel}
        actionTestID="activity-detail-error-retry"
        body={body}
        onAction={onRetry}
        testID="activity-detail-error"
        title={title}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.space32,
  },
});
