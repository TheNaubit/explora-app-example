import { useState } from "react";
import DateTimePicker from "@expo/ui/community/datetime-picker";
import { useLingui } from "@lingui/react/macro";

import { applyCalendarDate, applyCalendarTime } from "@/calendar/add-to-calendar";
import { DEFAULT_EVENT_START_DELAY_MINUTES, MILLISECONDS_PER_MINUTE } from "@/calendar/constants";
import { formatDate } from "@/i18n";
import { CalendarScheduleTrigger } from "@/screens/activity-detail/calendar-schedule-trigger";
import type { CalendarSchedulePickerProps } from "@/screens/activity-detail/calendar-schedule-picker.types";
import { activityDetailMessages } from "@/screens/activity-detail/messages";

type PickerStep = "date" | "time" | null;

function createInitialDraft(value: Date | null): Date {
  return (
    value ?? new Date(Date.now() + DEFAULT_EVENT_START_DELAY_MINUTES * MILLISECONDS_PER_MINUTE)
  );
}

/** Android schedule flow with native Material date and time dialogs. */
export function CalendarSchedulePicker({ onChange, value }: CalendarSchedulePickerProps) {
  const { i18n, t } = useLingui();
  const [draft, setDraft] = useState(() => createInitialDraft(value));
  const [step, setStep] = useState<PickerStep>(null);
  const formattedValue = value
    ? formatDate(value, { dateStyle: "medium", timeStyle: "short" })
    : t(activityDetailMessages.calendarScheduleMissing);
  const triggerLabel = i18n._({
    ...activityDetailMessages.calendarScheduleAccessibility,
    values: { value: formattedValue },
  });

  function openPicker() {
    setDraft(createInitialDraft(value));
    setStep("date");
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
      {step === "date" ? (
        <DateTimePicker
          minimumDate={new Date()}
          mode="date"
          negativeButton={{ label: t(activityDetailMessages.calendarCancel) }}
          onDismiss={() => setStep(null)}
          onValueChange={(_event, nextDate) => {
            setDraft((current) => applyCalendarDate(current, nextDate));
            setStep("time");
          }}
          positiveButton={{ label: t(activityDetailMessages.calendarNext) }}
          testID="calendar-date-picker"
          value={draft}
        />
      ) : null}
      {step === "time" ? (
        <DateTimePicker
          mode="time"
          negativeButton={{ label: t(activityDetailMessages.calendarCancel) }}
          onDismiss={() => setStep(null)}
          onValueChange={(_event, nextTime) => {
            const scheduledValue = applyCalendarTime(draft, nextTime);
            setDraft(scheduledValue);
            setStep(null);
            onChange(scheduledValue);
          }}
          positiveButton={{ label: t(activityDetailMessages.calendarDone) }}
          testID="calendar-time-picker"
          value={draft}
        />
      ) : null}
    </>
  );
}
