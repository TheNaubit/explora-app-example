type WritableCalendarCandidate = {
  allowsModifications: boolean;
  isPrimary?: boolean;
  isVisible?: boolean;
};

/** Select the best writable Android calendar for a new activity event. */
export function selectWritableCalendar<T extends WritableCalendarCandidate>(
  calendars: T[],
): T | null {
  const writableCalendars = calendars.filter((calendar) => calendar.allowsModifications);

  return (
    writableCalendars.find((calendar) => calendar.isPrimary && calendar.isVisible) ??
    writableCalendars.find((calendar) => calendar.isPrimary) ??
    writableCalendars.find((calendar) => calendar.isVisible) ??
    writableCalendars[0] ??
    null
  );
}
