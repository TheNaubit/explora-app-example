import { useCallback, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useLingui } from "@lingui/react/macro";
import { useFocusEffect } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

import { announceStatus } from "@/a11y";
import { ScreenFrame } from "@/components/screen-frame";
import { useFavoriteIds } from "@/hooks/use-favorites";
import { getCatalogMode, getCatalogSize, type CatalogMode } from "@/mocks/catalog-store";
import { getReviewModeState, resetReviewModeState } from "@/mocks/review-mode";
import { DevToolsActionRow } from "@/screens/dev-tools/dev-tools-action-row";
import { DevToolsCatalogModeSection } from "@/screens/dev-tools/dev-tools-catalog-mode-section";
import { DevToolsFeedbackSection } from "@/screens/dev-tools/dev-tools-feedback-section";
import {
  clearRequestCache,
  resetLocalData,
  updateCatalogMode,
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

const LOAD_OPTIONS = ["normal", "slow", "fail", "timeout", "invalid-data"] as const;
const INITIAL_LOAD_OPTIONS = [
  "normal",
  "slow",
  "empty",
  "fail",
  "timeout",
  "invalid-data",
] as const;
const DETAIL_OPTIONS = [...LOAD_OPTIONS, "not-found"] as const;
const REFRESH_OPTIONS = ["success", "slow", "fail", "timeout"] as const;

/** Assessment controls in an iOS-style grouped settings screen. */
export function DevTools() {
  const { i18n, t } = useLingui();
  const theme = useAppTheme();
  const queryClient = useQueryClient();
  const favoriteIds = useFavoriteIds();
  const [catalogCount, setCatalogCount] = useState(getCatalogSize);
  const [catalogMode, setCatalogModeState] = useState(getCatalogMode);
  const [modes, setModes] = useState(getReviewModeState);

  useFocusEffect(
    useCallback(() => {
      setCatalogCount(getCatalogSize());
      setCatalogModeState(getCatalogMode());
      setModes(getReviewModeState());
    }, []),
  );

  function handleModeChange<Key extends ReviewModeKey>(
    key: Key,
    value: ReviewModeState[Key],
    setting: string,
  ) {
    const next = updateReviewMode(key, value);
    clearRequestCache(queryClient);
    const option = t(
      value === "success"
        ? devToolsMessages.success
        : value === "normal"
          ? devToolsMessages.normal
          : value === "slow"
            ? devToolsMessages.slow
            : value === "empty"
              ? devToolsMessages.empty
              : value === "timeout"
                ? devToolsMessages.timeout
                : value === "invalid-data"
                  ? devToolsMessages.invalidData
                  : value === "not-found"
                    ? devToolsMessages.notFound
                    : devToolsMessages.fail,
    );
    setModes(next);
    announceStatus(i18n._({ ...devToolsMessages.modeChanged, values: { option, setting } }));
  }

  function handleClearRequestCache() {
    clearRequestCache(queryClient);
    announceStatus(t(devToolsMessages.requestCacheCleared));
  }

  function handleCatalogModeChange(nextMode: CatalogMode) {
    const result = updateCatalogMode(queryClient, nextMode);
    const setting = t(devToolsMessages.catalogDataset);
    const option = t(
      nextMode === "supplied"
        ? devToolsMessages.suppliedCatalog
        : devToolsMessages.performanceCatalog,
    );

    setCatalogCount(result.catalogCount);
    setCatalogModeState(result.catalogMode);
    announceStatus(i18n._({ ...devToolsMessages.modeChanged, values: { option, setting } }));
  }

  function handleResetModes() {
    setModes(resetReviewModeState());
    announceStatus(t(devToolsMessages.requestModesReset));
  }

  function handleConfirmedLocalReset() {
    const result = resetLocalData(queryClient);
    setCatalogCount(result.catalogCount);
    setCatalogModeState(getCatalogMode());
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
  const detailLoadTitle = t(devToolsMessages.detailLoad);
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
      scrollable
      scrollContentStyle={styles.content}
      scrollViewProps={{ keyboardShouldPersistTaps: "handled" }}
      style={{ backgroundColor: theme.colors.background }}
      testID="dev-tools-screen"
      title={t(devToolsMessages.title)}
    >
      <Text style={[styles.introduction, { color: theme.colors.textSecondary }]}>
        {t(devToolsMessages.introduction)}
      </Text>

      <View style={styles.sections}>
        <DevToolsCatalogModeSection onChange={handleCatalogModeChange} selected={catalogMode} />
        <DevToolsModeSection
          help={t(devToolsMessages.initialLoadHelp)}
          onChange={(value) =>
            handleModeChange(
              "initialLoad",
              value as ReviewModeState["initialLoad"],
              initialLoadTitle,
            )
          }
          options={INITIAL_LOAD_OPTIONS}
          selected={modes.initialLoad}
          testIDPrefix="initial-load"
          title={initialLoadTitle}
        />
        <DevToolsModeSection
          help={t(devToolsMessages.detailLoadHelp)}
          onChange={(value) =>
            handleModeChange("detailLoad", value as ReviewModeState["detailLoad"], detailLoadTitle)
          }
          options={DETAIL_OPTIONS}
          selected={modes.detailLoad}
          testIDPrefix="detail-load"
          title={detailLoadTitle}
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

        <DevToolsFeedbackSection />

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
