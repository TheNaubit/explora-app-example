import { useEffect, useMemo, useState } from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { useLingui } from "@lingui/react/macro";

import { announceStatus } from "@/a11y";
import type { AddToCalendarResult } from "@/calendar/add-to-calendar";
import { A11yPressable } from "@/components/a11y-pressable";
import { MIN_TOUCH_TARGET, PRESS_SCALE } from "@/components/constants";
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
  const [startDate, setStartDate] = useState<Date | null>(null);
  const { isActive, result, submit } = useAddToCalendar(activity, startDate);
  const statusCopy = useMemo(() => getStatusCopy(result, t), [result, t]);

  useEffect(() => {
    if (result === null) return;

    if (result === "duplicate") {
      announceStatus(t(activityDetailMessages.calendarDuplicate));
      return;
    }

    if (statusCopy) {
      announceStatus(`${statusCopy.title}. ${statusCopy.body}`);
    }
  }, [result, statusCopy, t]);

  async function handleSubmit() {
    await submit();
  }

  return (
    <View style={[styles.root, { borderColor: theme.colors.border }]}>
      <View style={styles.headingRow}>
        <View style={[styles.icon, { backgroundColor: theme.colors.surfaceSecondary }]}>
          <SymbolView
            name={{ ios: "calendar.badge.plus", android: "event", web: "event" }}
            size={24}
            tintColor={theme.colors.accent}
          />
        </View>
        <View style={styles.headingCopy}>
          <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.text }]}>
            {t(activityDetailMessages.calendarTitle)}
          </Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary }]}>
            {t(activityDetailMessages.calendarBody)}
          </Text>
        </View>
      </View>

      <CalendarSchedulePicker onChange={setStartDate} value={startDate} />

      {statusCopy && result !== "duplicate" ? (
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
                ? () => {
                    void handleSubmit();
                  }
                : undefined
          }
          title={statusCopy.title}
        />
      ) : null}

      <A11yPressable
        accessibilityHint={t(activityDetailMessages.calendarAddHint)}
        accessibilityLabel={
          isActive ? t(activityDetailMessages.calendarBusy) : t(activityDetailMessages.calendarAdd)
        }
        accessibilityRole="button"
        accessibilityState={{ busy: isActive, disabled: isActive }}
        disabled={isActive}
        onPress={() => {
          void handleSubmit();
        }}
        style={(state) => [
          styles.addButton,
          {
            backgroundColor: theme.colors.accent,
            opacity: isActive ? 0.64 : 1,
            transform: [{ scale: state.pressed ? PRESS_SCALE : 1 }],
          },
        ]}
        testID="add-to-calendar-button"
      >
        <Text style={[styles.addLabel, { color: theme.colors.onAccent }]}>
          {isActive
            ? t(activityDetailMessages.calendarBusy)
            : t(activityDetailMessages.calendarAdd)}
        </Text>
      </A11yPressable>
    </View>
  );
}

type Translate = ReturnType<typeof useLingui>["t"];

function getStatusCopy(result: AddToCalendarResult | null, t: Translate): StatusCopy | null {
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
      return {
        body: t(activityDetailMessages.calendarCanceledBody),
        isError: false,
        title: t(activityDetailMessages.calendarCanceledTitle),
      };
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
    borderCurve: "continuous",
    borderRadius: radii.medium,
    justifyContent: "center",
    minHeight: MIN_TOUCH_TARGET,
    paddingHorizontal: spacing.space20,
    paddingVertical: spacing.space12,
  },
  addLabel: {
    ...typography.bodyStrong,
    textAlign: "center",
  },
  body: {
    ...typography.body,
    textAlign: "left",
  },
  headingCopy: {
    flex: 1,
    gap: spacing.space8,
  },
  headingRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.space12,
  },
  icon: {
    alignItems: "center",
    borderRadius: radii.full,
    height: MIN_TOUCH_TARGET,
    justifyContent: "center",
    width: MIN_TOUCH_TARGET,
  },
  root: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: spacing.space16,
    paddingVertical: spacing.space24,
  },
  title: {
    ...typography.headline,
    textAlign: "left",
  },
});
