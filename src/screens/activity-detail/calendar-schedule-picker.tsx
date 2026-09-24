import type { CalendarSchedulePickerProps } from "@/screens/activity-detail/calendar-schedule-picker.types";

/** Web fallback. Native calendar scheduling is unavailable on web. */
export function CalendarSchedulePicker({ trigger }: CalendarSchedulePickerProps) {
  return trigger;
}
