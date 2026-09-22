import { useEffect, type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { useLingui } from "@lingui/react/macro";
import { msg } from "@lingui/core/macro";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

import { announceStatus } from "@/a11y";
import { A11yPressable } from "@/components/a11y-pressable";
import { MIN_TOUCH_TARGET } from "@/components/constants";
import { resolveErrorMessage } from "@/i18n";
import { isApiError } from "@/query/errors";
import { radii, spacing, typography, useAppTheme } from "@/theme";

type QueryErrorBoundaryProps = {
  children: ReactNode;
  /** Optional extra reset work (for example invalidate list queries). */
  onReset?: () => void;
};

const retryLabel = msg({
  id: "queryError.retry",
  comment: "Button label to retry a failed first catalog or detail load",
  message: "Try again",
});

const errorTitle = msg({
  id: "queryError.title",
  comment: "Heading shown when a Suspense query first load fails",
  message: "Could not load",
});

function QueryErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const { t } = useLingui();
  const theme = useAppTheme();
  const errorKey = isApiError(error) ? error.errorKey : "errors.unknown";
  const body = t(resolveErrorMessage(errorKey));
  const title = t(errorTitle);
  const retry = t(retryLabel);

  useEffect(() => {
    announceStatus(body);
  }, [body]);

  return (
    <View
      style={[styles.root, { backgroundColor: theme.colors.dangerSurface }]}
      accessibilityRole="alert"
      testID="query-error-boundary"
    >
      <Text style={[styles.title, { color: theme.colors.danger }]} accessibilityRole="header">
        {title}
      </Text>
      <Text style={[styles.body, { color: theme.colors.text }]}>{body}</Text>
      <A11yPressable
        accessibilityRole="button"
        accessibilityLabel={retry}
        onPress={resetErrorBoundary}
        style={[styles.retry, { backgroundColor: theme.colors.accent }]}
        testID="query-error-retry"
      >
        <Text style={[styles.retryLabel, { color: theme.colors.onAccent }]}>{retry}</Text>
      </A11yPressable>
    </View>
  );
}

/**
 * Shared Error Boundary for Suspense Query first-load failures.
 * Resolves `ApiError.errorKey` with Lingui. Retry resets the Query error boundary.
 */
export function QueryErrorBoundary({ children, onReset }: QueryErrorBoundaryProps) {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      FallbackComponent={QueryErrorFallback}
      onReset={() => {
        reset();
        onReset?.();
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  body: {
    ...typography.body,
    marginBottom: spacing.space16,
    textAlign: "left",
  },
  retry: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: radii.medium,
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: "center",
    paddingHorizontal: spacing.space16,
    paddingVertical: spacing.space12,
  },
  retryLabel: {
    ...typography.label,
    textAlign: "left",
  },
  root: {
    borderRadius: radii.large,
    marginHorizontal: spacing.space24,
    marginTop: spacing.space16,
    padding: spacing.space16,
  },
  title: {
    ...typography.headline,
    marginBottom: spacing.space8,
    textAlign: "left",
  },
});
