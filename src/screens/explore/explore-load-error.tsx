import type { Ref } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { type SharedValue, useAnimatedScrollHandler } from "react-native-reanimated";

import { RecoveryState } from "@/components/recovery-state";
import { ExploreHeader } from "@/screens/explore/explore-header";
import { spacing, useAppTheme } from "@/theme";

type ExploreLoadErrorProps = {
  body: string;
  filtersInOverlay: boolean;
  headerHeight: number;
  onRetry: () => void;
  retryLabel: string;
  scrollOffset?: SharedValue<number>;
  scrollRef?: Ref<unknown>;
  title: string;
};

/** Show a recoverable first-load failure without a render exception. */
export function ExploreLoadError({
  body,
  filtersInOverlay,
  headerHeight,
  onRetry,
  retryLabel,
  scrollOffset,
  scrollRef,
  title,
}: ExploreLoadErrorProps) {
  const theme = useAppTheme();
  const onScroll = useAnimatedScrollHandler((event) => {
    if (scrollOffset === undefined) return;
    const normalizedOffset = event.contentOffset.y + (event.contentInset?.top ?? 0);
    scrollOffset.set(Math.max(0, normalizedOffset));
  });

  return (
    <Animated.ScrollView
      ref={scrollRef as never}
      contentContainerStyle={[styles.scrollContent, { paddingTop: headerHeight + spacing.space8 }]}
      contentInsetAdjustmentBehavior={filtersInOverlay ? "never" : "automatic"}
      onScroll={onScroll}
      scrollEventThrottle={16}
      style={{ backgroundColor: theme.colors.background }}
      testID="explore-load-error-scroll"
    >
      {filtersInOverlay ? null : <ExploreHeader />}
      <View style={styles.recovery}>
        <RecoveryState
          actionLabel={retryLabel}
          actionTestID="explore-load-error-retry"
          body={body}
          onAction={onRetry}
          testID="explore-load-error"
          title={title}
        />
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  recovery: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: spacing.space48,
    paddingHorizontal: spacing.space24,
    paddingVertical: spacing.space32,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
