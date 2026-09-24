import { useCallback, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLingui } from "@lingui/react/macro";
import { useFocusEffect } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

import { announceStatus } from "@/a11y";
import { ScreenFrame } from "@/components/screen-frame";
import { useFavoriteIds } from "@/hooks/use-favorites";
import { getCatalogSize } from "@/mocks/catalog-store";
import { getReviewModeState, resetReviewModeState } from "@/mocks/review-mode";
import { DevToolsActionRow } from "@/screens/dev-tools/dev-tools-action-row";
import {
  clearRequestCache,
  resetLocalData,
  updateReviewMode,
  type ReviewModeKey,
} from "@/screens/dev-tools/dev-tools-actions";
import {
  DevToolsModeSection,
  type ReviewModeOption,
} from "@/screens/dev-tools/dev-tools-mode-section";
import { DevToolsSection } from "@/screens/dev-tools/dev-tools-section";
import { DevToolsValueRow } from "@/screens/dev-tools/dev-tools-value-row";
import { devToolsMessages } from "@/screens/dev-tools/messages";
import type { ReviewModeState } from "@/schemas/review-mode";
import { formatNumber } from "@/i18n/format";
import { spacing, typography, useAppTheme } from "@/theme";

const LOAD_OPTIONS = ["normal", "slow", "fail"] as const;
const REFRESH_OPTIONS = ["success", "slow", "fail"] as const;

/** Assessment controls in an iOS-style grouped settings screen. */
export function DevTools() {
  const { i18n, t } = useLingui();
  const theme = useAppTheme();
  const queryClient = useQueryClient();
  const favoriteIds = useFavoriteIds();
  const [catalogCount, setCatalogCount] = useState(getCatalogSize);
  const [modes, setModes] = useState(getReviewModeState);

  useFocusEffect(
    useCallback(() => {
      setCatalogCount(getCatalogSize());
      setModes(getReviewModeState());
    }, []),
  );

  function handleModeChange<Key extends ReviewModeKey>(
    key: Key,
    value: ReviewModeState[Key],
    setting: string,
  ) {
    const next = updateReviewMode(key, value);
    const option = t(
      value === "success"
        ? devToolsMessages.success
        : value === "normal"
          ? devToolsMessages.normal
          : value === "slow"
            ? devToolsMessages.slow
            : devToolsMessages.fail,
    );
    setModes(next);
    announceStatus(i18n._({ ...devToolsMessages.modeChanged, values: { option, setting } }));
  }

  function handleClearRequestCache() {
    clearRequestCache(queryClient);
    announceStatus(t(devToolsMessages.requestCacheCleared));
  }

  function handleResetModes() {
    setModes(resetReviewModeState());
    announceStatus(t(devToolsMessages.requestModesReset));
  }

  function handleConfirmedLocalReset() {
    const result = resetLocalData(queryClient);
    setCatalogCount(result.catalogCount);
    announceStatus(t(devToolsMessages.localDataReset));
  }

  function handleResetLocalData() {
    Alert.alert(t(devToolsMessages.confirmResetTitle), t(devToolsMessages.confirmResetBody), [
      { style: "cancel", text: t(devToolsMessages.cancel) },
      {
        onPress: handleConfirmedLocalReset,
        style: "destructive",
        text: t(devToolsMessages.reset),
      },
    ]);
  }

  const initialLoadTitle = t(devToolsMessages.initialLoad);
  const laterPageLoadTitle = t(devToolsMessages.laterPageLoad);
  const refreshTitle = t(devToolsMessages.refresh);
  const catalogActivitiesLabel = t(devToolsMessages.catalogActivities);
  const favoritesLabel = t(devToolsMessages.favorites);
  const formattedCatalogCount = formatNumber(catalogCount);
  const formattedFavoriteCount = formatNumber(favoriteIds.length);

  return (
    <ScreenFrame
      padHorizontal={false}
      padTop={false}
      style={{ backgroundColor: theme.colors.background }}
      testID="dev-tools-screen"
      title={t(devToolsMessages.title)}
    >
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.introduction, { color: theme.colors.textSecondary }]}>
          {t(devToolsMessages.introduction)}
        </Text>

        <View style={styles.sections}>
          <DevToolsModeSection
            help={t(devToolsMessages.initialLoadHelp)}
            onChange={(value) =>
              handleModeChange(
                "initialLoad",
                value as ReviewModeState["initialLoad"],
                initialLoadTitle,
              )
            }
            options={LOAD_OPTIONS}
            selected={modes.initialLoad}
            testIDPrefix="initial-load"
            title={initialLoadTitle}
          />
          <DevToolsModeSection
            help={t(devToolsMessages.laterPageLoadHelp)}
            onChange={(value) =>
              handleModeChange("pageLoad", value as ReviewModeState["pageLoad"], laterPageLoadTitle)
            }
            options={LOAD_OPTIONS}
            selected={modes.pageLoad}
            testIDPrefix="page-load"
            title={laterPageLoadTitle}
          />
          <DevToolsModeSection
            help={t(devToolsMessages.refreshHelp)}
            onChange={(value: ReviewModeOption) =>
              handleModeChange("refresh", value as ReviewModeState["refresh"], refreshTitle)
            }
            options={REFRESH_OPTIONS}
            selected={modes.refresh}
            testIDPrefix="refresh"
            title={refreshTitle}
          />

          <DevToolsSection
            title={t(devToolsMessages.requestModes)}
            footer={`${t(devToolsMessages.lifecycleHelp)} ${t(devToolsMessages.offlineHelp)}`}
          >
            <DevToolsActionRow
              hint={t(devToolsMessages.clearRequestCacheHint)}
              label={t(devToolsMessages.clearRequestCache)}
              onPress={handleClearRequestCache}
              testID="dev-tools-clear-cache"
            />
            <DevToolsActionRow
              hint={t(devToolsMessages.resetModesHint)}
              label={t(devToolsMessages.resetModes)}
              onPress={handleResetModes}
              testID="dev-tools-reset-modes"
            />
          </DevToolsSection>

          <DevToolsSection title={t(devToolsMessages.localData)}>
            <DevToolsValueRow
              accessibilityLabel={i18n._({
                ...devToolsMessages.valueAccessibilityLabel,
                values: { label: catalogActivitiesLabel, value: formattedCatalogCount },
              })}
              label={catalogActivitiesLabel}
              testID="dev-tools-catalog-count"
              value={formattedCatalogCount}
            />
            <DevToolsValueRow
              accessibilityLabel={i18n._({
                ...devToolsMessages.valueAccessibilityLabel,
                values: { label: favoritesLabel, value: formattedFavoriteCount },
              })}
              label={favoritesLabel}
              testID="dev-tools-favorite-count"
              value={formattedFavoriteCount}
            />
          </DevToolsSection>

          <DevToolsSection title={t(devToolsMessages.actions)}>
            <DevToolsActionRow
              destructive
              hint={t(devToolsMessages.resetLocalDataHint)}
              label={t(devToolsMessages.resetLocalData)}
              onPress={handleResetLocalData}
              testID="dev-tools-reset-local-data"
            />
          </DevToolsSection>
        </View>
      </ScrollView>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.space48,
    paddingHorizontal: spacing.space20,
    paddingTop: spacing.space16,
  },
  introduction: {
    ...typography.body,
    marginBottom: spacing.space24,
    paddingHorizontal: spacing.space4,
    textAlign: "left",
  },
  sections: {
    gap: spacing.space24,
  },
});
