import { useEffect, useMemo, useRef, useState } from "react";
import { Linking, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SymbolView } from "expo-symbols";
import { useLingui } from "@lingui/react/macro";

import type { AddToCalendarResult } from "@/calendar/add-to-calendar";
import { A11yPressable } from "@/components/a11y-pressable";
import { MIN_TOUCH_TARGET, PRESS_SCALE } from "@/components/constants";
import { showNativeToast, type NativeToastType } from "@/native-toast";
import { CalendarSchedulePicker } from "@/screens/activity-detail/calendar-schedule-picker";
import { CalendarStatusBanner } from "@/screens/activity-detail/calendar-status-banner";
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
  isError: boolean;
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

  useEffect(() => {
    if (result === null) return;

    if (result === "duplicate") {
      showNativeToast({
        title: t(activityDetailMessages.calendarDuplicate),
        type: "warning",
      });
      return;
    }

    if (statusCopy) {
      showNativeToast({
        message: statusCopy.body,
        title: statusCopy.title,
        type: getCalendarToastType(result),
      });
    }
  }, [result, statusCopy, t]);

  async function handleScheduleConfirm(startDate: Date) {
    lastStartDate.current = startDate;
    await submit(startDate);
  }

  function retryLastSchedule() {
    const startDate = lastStartDate.current;
    if (startDate) {
      void submit(startDate);
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
                backgroundColor: theme.colors.surfaceElevated,
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
                size={24}
                tintColor={theme.colors.accent}
              />
            </View>
            <Text style={[styles.addLabel, { color: theme.colors.text }]}>
              {isActive
                ? t(activityDetailMessages.calendarBusy)
                : t(activityDetailMessages.calendarAdd)}
            </Text>
          </A11yPressable>
        }
      />

      {statusCopy && shouldShowCalendarRecovery(result) ? (
        <CalendarStatusBanner
          actionLabel={statusCopy.actionLabel}
          body={statusCopy.body}
          isError={statusCopy.isError}
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

export function getCalendarToastType(result: AddToCalendarResult): NativeToastType {
  if (result === "saved") return "success";
  if (result === "submitted") return "info";
  if (result === "duplicate") return "warning";
  return "error";
}

export function shouldShowCalendarRecovery(result: AddToCalendarResult | null): boolean {
  return (
    result === "permission-denied" || result === "permission-blocked" || result === "native-error"
  );
}

type Translate = ReturnType<typeof useLingui>["t"];

export function getCalendarStatusCopy(
  result: AddToCalendarResult | null,
  t: Translate,
): StatusCopy | null {
  switch (result) {
    case "saved":
      return {
        body: t(activityDetailMessages.calendarSavedBody),
        isError: false,
        title: t(activityDetailMessages.calendarSavedTitle),
      };
    case "submitted":
      return {
        body: t(activityDetailMessages.calendarSubmittedBody),
        isError: false,
        title: t(activityDetailMessages.calendarSubmittedTitle),
      };
    case "canceled":
      return null;
    case "permission-denied":
      return {
        actionLabel: t(activityDetailMessages.calendarTryAgain),
        body: t(activityDetailMessages.calendarPermissionDeniedBody),
        isError: true,
        title: t(activityDetailMessages.calendarPermissionDeniedTitle),
      };
    case "permission-blocked":
      return {
        actionLabel: t(activityDetailMessages.calendarOpenSettings),
        body: t(activityDetailMessages.calendarPermissionBlockedBody),
        isError: true,
        title: t(activityDetailMessages.calendarPermissionBlockedTitle),
      };
    case "missing-date":
      return {
        body: t(activityDetailMessages.calendarMissingBody),
        isError: true,
        title: t(activityDetailMessages.calendarMissingTitle),
      };
    case "past-date":
      return {
        body: t(activityDetailMessages.calendarPastBody),
        isError: true,
        title: t(activityDetailMessages.calendarPastTitle),
      };
    case "invalid-activity":
    case "invalid-duration":
      return {
        body: t(activityDetailMessages.calendarInvalidBody),
        isError: true,
        title: t(activityDetailMessages.calendarInvalidTitle),
      };
    case "native-error":
      return {
        actionLabel: t(activityDetailMessages.calendarTryAgain),
        body: t(activityDetailMessages.calendarErrorBody),
        isError: true,
        title: t(activityDetailMessages.calendarErrorTitle),
      };
    case "unavailable":
      return {
        body: t(activityDetailMessages.calendarUnavailableBody),
        isError: true,
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
    borderRadius: radii.medium,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: spacing.space12,
    justifyContent: "center",
    minHeight: MIN_TOUCH_TARGET,
    paddingHorizontal: spacing.space16,
    paddingVertical: spacing.space12,
  },
  addLabel: {
    ...typography.bodyStrong,
    flex: 1,
    textAlign: "left",
  },
  icon: {
    alignItems: "center",
    borderRadius: radii.full,
    height: MIN_TOUCH_TARGET,
    justifyContent: "center",
    width: MIN_TOUCH_TARGET,
  },
  root: {
    gap: spacing.space12,
    paddingVertical: spacing.space24,
  },
});
