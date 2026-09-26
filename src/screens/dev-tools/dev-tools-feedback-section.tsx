import { useState } from "react";
import { useLingui } from "@lingui/react/macro";

import { InlineStatusBanner } from "@/components/inline-status-banner";
import { resolveFeedbackPresentation } from "@/feedback/feedback-policy";
import { isNativeToastAvailable, showNativeToast } from "@/native-toast";
import { DevToolsActionRow } from "@/screens/dev-tools/dev-tools-action-row";
import { devToolsMessages } from "@/screens/dev-tools/messages";
import { DevToolsSection } from "@/screens/dev-tools/dev-tools-section";
import { DevToolsValueRow } from "@/screens/dev-tools/dev-tools-value-row";

/** Preview the three feedback surfaces allowed by the shared policy. */
export function DevToolsFeedbackSection() {
  const { i18n, t } = useLingui();
  const [showInlinePreview, setShowInlinePreview] = useState(false);
  const moduleStatus = t(
    isNativeToastAvailable()
      ? devToolsMessages.nativeFeedbackAvailable
      : devToolsMessages.nativeFeedbackUnavailable,
  );

  function showTransientError() {
    if (resolveFeedbackPresentation({ kind: "error", recovery: "transient" }) === "toast") {
      showNativeToast({
        message: t(devToolsMessages.transientErrorBody),
        title: t(devToolsMessages.transientErrorTitle),
        type: "error",
      });
    }
  }

  function showCalendarSuccess() {
    if (resolveFeedbackPresentation({ kind: "success", source: "calendar" }) === "toast") {
      showNativeToast({
        message: t(devToolsMessages.calendarSuccessBody),
        title: t(devToolsMessages.calendarSuccessTitle),
        type: "success",
      });
    }
  }

  return (
    <>
      <DevToolsSection
        footer={t(devToolsMessages.feedbackPolicyHelp)}
        title={t(devToolsMessages.feedbackPolicy)}
      >
        <DevToolsValueRow
          accessibilityLabel={i18n._({
            ...devToolsMessages.nativeFeedbackStatusLabel,
            values: { status: moduleStatus },
          })}
          label={t(devToolsMessages.nativeFeedbackModule)}
          testID="native-feedback-module-status"
          value={moduleStatus}
        />
        <DevToolsActionRow
          hint={t(devToolsMessages.transientErrorHint)}
          label={t(devToolsMessages.transientErrorAction)}
          onPress={showTransientError}
          testID="dev-tools-transient-error"
        />
        <DevToolsActionRow
          hint={t(devToolsMessages.actionableErrorHint)}
          label={t(devToolsMessages.actionableErrorAction)}
          onPress={() => setShowInlinePreview(true)}
          testID="dev-tools-actionable-error"
        />
        <DevToolsActionRow
          hint={t(devToolsMessages.calendarSuccessHint)}
          label={t(devToolsMessages.calendarSuccessAction)}
          onPress={showCalendarSuccess}
          testID="dev-tools-calendar-success"
        />
      </DevToolsSection>
      {showInlinePreview ? (
        <InlineStatusBanner
          actionLabel={t(devToolsMessages.inlinePreviewAction)}
          body={t(devToolsMessages.inlinePreviewBody)}
          inset={false}
          onAction={() => setShowInlinePreview(false)}
          testID="dev-tools-inline-recovery-preview"
          title={t(devToolsMessages.inlinePreviewTitle)}
        />
      ) : null}
    </>
  );
}
