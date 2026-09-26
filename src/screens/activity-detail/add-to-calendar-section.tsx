import { useMemo, useRef, useState } from "react";
import { Linking, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SymbolView } from "expo-symbols";
import { useLingui } from "@lingui/react/macro";

import type { AddToCalendarResult } from "@/calendar/add-to-calendar";
import { A11yPressable } from "@/components/a11y-pressable";
import { MIN_TOUCH_TARGET, PRESS_SCALE } from "@/components/constants";
import { resolveFeedbackPresentation } from "@/feedback/feedback-policy";
import { showNativeToast } from "@/native-toast";
import { CalendarSchedulePicker } from "@/screens/activity-detail/calendar-schedule-picker";
import { CalendarStatusBanner } from "@/screens/activity-detail/calendar-status-banner";
import {
  ACTIVITY_DETAIL_FACT_ICON_FRAME,
  ACTIVITY_DETAIL_FACT_ICON_SIZE,
} from "@/screens/activity-detail/constants";
import { activityDetailMessages } from "@/screens/activity-detail/messages";
import { useAddToCalendar } from "@/screens/activity-detail/use-add-to-calendar";
import type { Activity } from "@/schemas/activity";
import { radii, spacing, typography, useAppTheme } from "@/theme";

type AddToCalendarSectionProps = {
  activity: Activity;
};

type StatusCopy = {
  actionLabel?: string;
  body: string;
  title: string;
};

/** Local activity scheduling UI that hands the final event to the system calendar form. */
export function AddToCalendarSection({ activity }: AddToCalendarSectionProps) {
  const { t } = useLingui();
  const theme = useAppTheme();
  const { width: viewportWidth } = useWindowDimensions();
  const calendarActionWidth = Math.max(MIN_TOUCH_TARGET, viewportWidth - spacing.space48);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const lastStartDate = useRef<Date | null>(null);
  const { isActive, result, submit } = useAddToCalendar(activity);
  const statusCopy = useMemo(() => getCalendarStatusCopy(result, t), [result, t]);

  async function submitSchedule(startDate: Date) {
    const nextResult = await submit(startDate);
    showCalendarFeedback(nextResult, t);
  }

  async function handleScheduleConfirm(startDate: Date) {
    lastStartDate.current = startDate;
    await submitSchedule(startDate);
  }

  function retryLastSchedule() {
    const startDate = lastStartDate.current;
    if (startDate) {
      void submitSchedule(startDate);
    } else {
      setIsPickerOpen(true);
    }
  }

  return (
    <View style={styles.root}>
      <CalendarSchedulePicker
        isOpen={isPickerOpen}
        onCancel={() => setIsPickerOpen(false)}
        onConfirm={(startDate) => {
          void handleScheduleConfirm(startDate);
        }}
        trigger={
          <A11yPressable
            accessibilityHint={t(activityDetailMessages.calendarAddHint)}
            accessibilityLabel={
              isActive
                ? t(activityDetailMessages.calendarBusy)
                : t(activityDetailMessages.calendarAdd)
            }
            accessibilityRole="button"
            accessibilityState={{ busy: isActive, disabled: isActive }}
            disabled={isActive}
            onPress={() => setIsPickerOpen(true)}
            style={(state) => [
              styles.addButton,
              {
                backgroundColor: state.pressed
                  ? theme.colors.surfaceSecondary
                  : theme.colors.surface,
                borderColor: theme.colors.border,
                opacity: isActive ? 0.64 : 1,
                transform: [{ scale: state.pressed ? PRESS_SCALE : 1 }],
                width: calendarActionWidth,
              },
            ]}
            testID="add-to-calendar-button"
          >
            <View style={[styles.icon, { backgroundColor: theme.colors.surfaceSecondary }]}>
              <SymbolView
                name={{ ios: "calendar.badge.plus", android: "event", web: "event" }}
                size={ACTIVITY_DETAIL_FACT_ICON_SIZE}
                tintColor={theme.colors.accent}
              />
            </View>
            <View style={styles.addCopy}>
              <Text style={[styles.addLabel, { color: theme.colors.text }]}>
                {isActive
                  ? t(activityDetailMessages.calendarBusy)
                  : t(activityDetailMessages.calendarAdd)}
              </Text>
              <Text style={[styles.addSubtitle, { color: theme.colors.textSecondary }]}>
                {t(activityDetailMessages.calendarAddSubtitle)}
              </Text>
            </View>
          </A11yPressable>
        }
      />

      {statusCopy && shouldShowCalendarRecovery(result) ? (
        <CalendarStatusBanner
          actionLabel={statusCopy.actionLabel}
          body={statusCopy.body}
          onAction={
            result === "permission-blocked"
              ? () => {
                  void Linking.openSettings();
                }
              : statusCopy.actionLabel
                ? retryLastSchedule
                : undefined
          }
          title={statusCopy.title}
        />
      ) : null}
    </View>
  );
}

export function getCalendarFeedbackPresentation(result: AddToCalendarResult) {
  if (result === "saved") {
    return resolveFeedbackPresentation({ kind: "success", source: "calendar" });
  }

  if (result === "canceled") {
    return resolveFeedbackPresentation({ kind: "canceled" });
  }

  if (result === "duplicate") {
    return resolveFeedbackPresentation({ kind: "no-change" });
  }

  return resolveFeedbackPresentation({ kind: "error", recovery: "actionable" });
}

export function shouldShowCalendarRecovery(result: AddToCalendarResult | null): boolean {
  return result !== null && getCalendarFeedbackPresentation(result) === "inline";
}

type Translate = ReturnType<typeof useLingui>["t"];

export function showCalendarFeedback(result: AddToCalendarResult, t: Translate): void {
  const copy = getCalendarStatusCopy(result, t);
  if (copy && getCalendarFeedbackPresentation(result) === "toast") {
    showNativeToast({
      message: copy.body,
      title: copy.title,
      type: "success",
    });
  }
}

export function getCalendarStatusCopy(
  result: AddToCalendarResult | null,
  t: Translate,
): StatusCopy | null {
  switch (result) {
    case "saved":
      return {
        body: t(activityDetailMessages.calendarSavedBody),
        title: t(activityDetailMessages.calendarSavedTitle),
      };
    case "canceled":
      return null;
    case "permission-denied":
      return {
        actionLabel: t(activityDetailMessages.calendarTryAgain),
        body: t(activityDetailMessages.calendarPermissionDeniedBody),
        title: t(activityDetailMessages.calendarPermissionDeniedTitle),
      };
    case "permission-blocked":
      return {
        actionLabel: t(activityDetailMessages.calendarOpenSettings),
        body: t(activityDetailMessages.calendarPermissionBlockedBody),
        title: t(activityDetailMessages.calendarPermissionBlockedTitle),
      };
    case "missing-date":
      return {
        body: t(activityDetailMessages.calendarMissingBody),
        title: t(activityDetailMessages.calendarMissingTitle),
      };
    case "past-date":
      return {
        body: t(activityDetailMessages.calendarPastBody),
        title: t(activityDetailMessages.calendarPastTitle),
      };
    case "invalid-activity":
    case "invalid-duration":
      return {
        body: t(activityDetailMessages.calendarInvalidBody),
        title: t(activityDetailMessages.calendarInvalidTitle),
      };
    case "native-error":
      return {
        actionLabel: t(activityDetailMessages.calendarTryAgain),
        body: t(activityDetailMessages.calendarErrorBody),
        title: t(activityDetailMessages.calendarErrorTitle),
      };
    case "unavailable":
      return {
        body: t(activityDetailMessages.calendarUnavailableBody),
        title: t(activityDetailMessages.calendarUnavailableTitle),
      };
    case "duplicate":
    case null:
      return null;
  }
}

const styles = StyleSheet.create({
  addButton: {
    alignItems: "center",
    alignSelf: "stretch",
    borderCurve: "continuous",
    borderRadius: radii.large,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: spacing.space12,
    justifyContent: "center",
    minHeight: MIN_TOUCH_TARGET,
    paddingHorizontal: spacing.space16,
    paddingVertical: spacing.space12,
  },
  addCopy: {
    flex: 1,
  },
  addLabel: {
    ...typography.bodyStrong,
    textAlign: "left",
  },
  addSubtitle: {
    ...typography.caption,
    textAlign: "left",
  },
  icon: {
    alignItems: "center",
    borderCurve: "continuous",
    borderRadius: radii.small,
    height: ACTIVITY_DETAIL_FACT_ICON_FRAME,
    justifyContent: "center",
    width: ACTIVITY_DETAIL_FACT_ICON_FRAME,
  },
  root: {
    gap: spacing.space12,
    paddingVertical: spacing.space24,
  },
});
