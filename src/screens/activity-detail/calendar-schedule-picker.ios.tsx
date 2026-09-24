import { useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import DateTimePicker from "@expo/ui/community/datetime-picker";
import { useLingui } from "@lingui/react/macro";

import { applyCalendarDate, applyCalendarTime } from "@/calendar/add-to-calendar";
import { DEFAULT_EVENT_START_DELAY_MINUTES, MILLISECONDS_PER_MINUTE } from "@/calendar/constants";
import { A11yFocusTrap } from "@/components/a11y-focus-trap";
import { A11yPressable } from "@/components/a11y-pressable";
import { MIN_TOUCH_TARGET } from "@/components/constants";
import { formatDate } from "@/i18n";
import { CalendarScheduleTrigger } from "@/screens/activity-detail/calendar-schedule-trigger";
import type { CalendarSchedulePickerProps } from "@/screens/activity-detail/calendar-schedule-picker.types";
import { activityDetailMessages } from "@/screens/activity-detail/messages";
import { radii, spacing, typography, useAppTheme } from "@/theme";

function createInitialDraft(value: Date | null): Date {
  return (
    value ?? new Date(Date.now() + DEFAULT_EVENT_START_DELAY_MINUTES * MILLISECONDS_PER_MINUTE)
  );
}

/** iOS schedule sheet with native inline date and time pickers. */
export function CalendarSchedulePicker({ onChange, value }: CalendarSchedulePickerProps) {
  const { i18n, t } = useLingui();
  const theme = useAppTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState(() => createInitialDraft(value));
  const formattedValue = value
    ? formatDate(value, { dateStyle: "medium", timeStyle: "short" })
    : t(activityDetailMessages.calendarScheduleMissing);
  const triggerLabel = i18n._({
    ...activityDetailMessages.calendarScheduleAccessibility,
    values: { value: formattedValue },
  });

  function openPicker() {
    setDraft(createInitialDraft(value));
    setIsOpen(true);
  }

  function confirmPicker() {
    onChange(draft);
    setIsOpen(false);
  }

  return (
    <>
      <CalendarScheduleTrigger
        accessibilityHint={t(activityDetailMessages.calendarScheduleHint)}
        accessibilityLabel={triggerLabel}
        label={t(activityDetailMessages.calendarScheduleLabel)}
        onPress={openPicker}
        value={formattedValue}
      />
      <Modal
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
        presentationStyle="pageSheet"
        visible={isOpen}
      >
        <A11yFocusTrap>
          <ScrollView
            contentContainerStyle={[styles.sheet, { backgroundColor: theme.colors.background }]}
            contentInsetAdjustmentBehavior="automatic"
          >
            <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.text }]}>
              {t(activityDetailMessages.calendarScheduleSheetTitle)}
            </Text>
            <View style={styles.pickerGroup}>
              <Text style={[styles.pickerLabel, { color: theme.colors.textSecondary }]}>
                {t(activityDetailMessages.calendarDateLabel)}
              </Text>
              <DateTimePicker
                accentColor={theme.colors.accent}
                display="inline"
                minimumDate={new Date()}
                mode="date"
                onValueChange={(_event, nextDate) => {
                  setDraft((current) => applyCalendarDate(current, nextDate));
                }}
                testID="calendar-date-picker"
                value={draft}
              />
            </View>
            <View style={styles.pickerGroup}>
              <Text style={[styles.pickerLabel, { color: theme.colors.textSecondary }]}>
                {t(activityDetailMessages.calendarTimeLabel)}
              </Text>
              <DateTimePicker
                accentColor={theme.colors.accent}
                display="spinner"
                mode="time"
                onValueChange={(_event, nextTime) => {
                  setDraft((current) => applyCalendarTime(current, nextTime));
                }}
                testID="calendar-time-picker"
                value={draft}
              />
            </View>
            <View style={styles.actions}>
              <A11yPressable
                accessibilityLabel={t(activityDetailMessages.calendarCancel)}
                accessibilityRole="button"
                onPress={() => setIsOpen(false)}
                style={[styles.secondaryAction, { borderColor: theme.colors.border }]}
                testID="calendar-schedule-cancel"
              >
                <Text style={[styles.secondaryLabel, { color: theme.colors.text }]}>
                  {t(activityDetailMessages.calendarCancel)}
                </Text>
              </A11yPressable>
              <A11yPressable
                accessibilityLabel={t(activityDetailMessages.calendarConfirmSchedule)}
                accessibilityRole="button"
                onPress={confirmPicker}
                style={[styles.primaryAction, { backgroundColor: theme.colors.accent }]}
                testID="calendar-schedule-confirm"
              >
                <Text style={[styles.primaryLabel, { color: theme.colors.onAccent }]}>
                  {t(activityDetailMessages.calendarConfirmSchedule)}
                </Text>
              </A11yPressable>
            </View>
          </ScrollView>
        </A11yFocusTrap>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.space12,
  },
  pickerGroup: {
    gap: spacing.space8,
  },
  pickerLabel: {
    ...typography.label,
    textAlign: "left",
  },
  primaryAction: {
    alignItems: "center",
    borderCurve: "continuous",
    borderRadius: radii.medium,
    flex: 1,
    justifyContent: "center",
    minHeight: MIN_TOUCH_TARGET,
    minWidth: 140,
    paddingHorizontal: spacing.space20,
  },
  primaryLabel: {
    ...typography.label,
    textAlign: "center",
  },
  secondaryAction: {
    alignItems: "center",
    borderCurve: "continuous",
    borderRadius: radii.medium,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    justifyContent: "center",
    minHeight: MIN_TOUCH_TARGET,
    minWidth: 120,
    paddingHorizontal: spacing.space20,
  },
  secondaryLabel: {
    ...typography.label,
    textAlign: "center",
  },
  sheet: {
    flexGrow: 1,
    gap: spacing.space24,
    padding: spacing.space24,
  },
  title: {
    ...typography.title,
    textAlign: "left",
  },
});
