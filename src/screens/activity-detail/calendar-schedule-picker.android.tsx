import { useEffect, useState } from "react";
import DateTimePicker from "@expo/ui/community/datetime-picker";
import { useLingui } from "@lingui/react/macro";

import { applyCalendarDate, applyCalendarTime } from "@/calendar/add-to-calendar";
import { DEFAULT_EVENT_START_DELAY_MINUTES, MILLISECONDS_PER_MINUTE } from "@/calendar/constants";
import type { CalendarSchedulePickerProps } from "@/screens/activity-detail/calendar-schedule-picker.types";
import { activityDetailMessages } from "@/screens/activity-detail/messages";

type PickerStep = "date" | "time" | null;

function createInitialDraft(): Date {
  return new Date(Date.now() + DEFAULT_EVENT_START_DELAY_MINUTES * MILLISECONDS_PER_MINUTE);
}

/** Android schedule flow with the platform date and time dialogs. */
export function CalendarSchedulePicker({
  isOpen,
  onCancel,
  onConfirm,
  trigger,
}: CalendarSchedulePickerProps) {
  const { t } = useLingui();
  const [draft, setDraft] = useState(createInitialDraft);
  const [step, setStep] = useState<PickerStep>(null);

  useEffect(() => {
    if (isOpen) {
      setDraft(createInitialDraft());
      setStep("date");
    } else {
      setStep(null);
    }
  }, [isOpen]);

  function cancelPicker() {
    setStep(null);
    onCancel();
  }

  return (
    <>
      {trigger}
      {step === "date" ? (
        <DateTimePicker
          minimumDate={new Date()}
          mode="date"
          negativeButton={{ label: t(activityDetailMessages.calendarCancel) }}
          onDismiss={cancelPicker}
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
          onDismiss={cancelPicker}
          onValueChange={(_event, nextTime) => {
            const scheduledValue = applyCalendarTime(draft, nextTime);
            setStep(null);
            onCancel();
            onConfirm(scheduledValue);
          }}
          positiveButton={{ label: t(activityDetailMessages.calendarDone) }}
          testID="calendar-time-picker"
          value={draft}
        />
      ) : null}
    </>
  );
}
