import { useLingui } from "@lingui/react/macro";

import { formatDate } from "@/i18n";
import { CalendarScheduleTrigger } from "@/screens/activity-detail/calendar-schedule-trigger";
import type { CalendarSchedulePickerProps } from "@/screens/activity-detail/calendar-schedule-picker.types";
import { activityDetailMessages } from "@/screens/activity-detail/messages";

/** Web fallback. Native calendar scheduling is unavailable on web. */
export function CalendarSchedulePicker({ value }: CalendarSchedulePickerProps) {
  const { t } = useLingui();

  return (
    <CalendarScheduleTrigger
      accessibilityHint={t(activityDetailMessages.calendarUnavailableBody)}
      accessibilityLabel={t(activityDetailMessages.calendarUnavailableBody)}
      disabled
      label={t(activityDetailMessages.calendarScheduleLabel)}
      value={
        value
          ? formatDate(value, { dateStyle: "medium", timeStyle: "short" })
          : t(activityDetailMessages.calendarScheduleMissing)
      }
    />
  );
}
