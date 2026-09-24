import { msg } from "@lingui/core/macro";

export const activityDetailMessages = {
  screenTitle: msg({
    id: "activityDetail.screenTitle",
    comment: "Spoken title for the Activity Detail screen",
    message: "Activity details",
  }),
  back: msg({
    id: "activityDetail.back",
    comment: "Button above the activity hero that returns to the previous screen",
    message: "Back",
  }),
  duration: msg({
    id: "activityDetail.duration",
    comment: "Label for the activity duration value",
    message: "Duration",
  }),
  location: msg({
    id: "activityDetail.location",
    comment: "Label for the activity location value",
    message: "Location",
  }),
  unavailableTitle: msg({
    id: "activityDetail.unavailableTitle",
    comment: "Heading when an activity id does not exist",
    message: "Activity unavailable",
  }),
  unavailableBody: msg({
    id: "activityDetail.unavailableBody",
    message: "This activity link is invalid or the activity is no longer available.",
  }),
  unavailableAction: msg({
    id: "activityDetail.unavailableAction",
    comment: "Button on the Activity Detail not-found state",
    message: "Go back",
  }),
  savedFallbackTitle: msg({
    id: "activityDetail.savedFallbackTitle",
    comment: "Heading when saved activity data appears after a detail refetch fails",
    message: "Showing saved details",
  }),
  savedFallbackBody: msg({
    id: "activityDetail.savedFallbackBody",
    message: "Current details could not load. This saved copy remains available offline.",
  }),
  retry: msg({
    id: "activityDetail.retry",
    comment: "Button that retries loading current activity details",
    message: "Try again",
  }),
  loadedAnnounce: msg({
    id: "activityDetail.loadedAnnounce",
    comment: "Screen reader status after Activity Detail loads",
    message: "Activity details loaded for {title}.",
  }),
  notFoundAnnounce: msg({
    id: "activityDetail.notFoundAnnounce",
    comment: "Screen reader status when an activity id does not exist",
    message: "Activity was not found.",
  }),
  loadingAnnounce: msg({
    id: "activityDetail.loadingAnnounce",
    comment: "Screen reader status while Activity Detail loads",
    message: "Loading activity details.",
  }),
  calendarTitle: msg({
    id: "activityDetail.calendar.title",
    comment: "Heading for the calendar planning section on Activity Detail",
    message: "Plan this activity",
  }),
  calendarBody: msg({
    id: "activityDetail.calendar.body",
    message: "Choose a future start time. Explora sets the end time from the activity duration.",
  }),
  calendarScheduleLabel: msg({
    id: "activityDetail.calendar.scheduleLabel",
    comment: "Label above the selected calendar date and time",
    message: "Date and start time",
  }),
  calendarScheduleMissing: msg({
    id: "activityDetail.calendar.scheduleMissing",
    comment: "Placeholder before the user chooses an activity date and time",
    message: "Choose a date and time",
  }),
  calendarScheduleAccessibility: msg({
    id: "activityDetail.calendar.scheduleAccessibility",
    comment: "Screen reader label for the activity date and time control",
    message: "Choose date and start time. Current value: {value}.",
  }),
  calendarScheduleHint: msg({
    id: "activityDetail.calendar.scheduleHint",
    comment: "Screen reader hint for the activity date and time control",
    message: "Opens the native date and time controls.",
  }),
  calendarScheduleSheetTitle: msg({
    id: "activityDetail.calendar.scheduleSheetTitle",
    comment: "Heading in the iOS activity schedule sheet",
    message: "Choose date and time",
  }),
  calendarDateLabel: msg({
    id: "activityDetail.calendar.dateLabel",
    comment: "Label above the native calendar date picker",
    message: "Date",
  }),
  calendarTimeLabel: msg({
    id: "activityDetail.calendar.timeLabel",
    comment: "Label above the native calendar start time picker",
    message: "Start time",
  }),
  calendarCancel: msg({
    id: "activityDetail.calendar.cancel",
    comment: "Button that closes the schedule picker without changing the schedule",
    message: "Cancel",
  }),
  calendarConfirmSchedule: msg({
    id: "activityDetail.calendar.confirmSchedule",
    comment: "Button that confirms the selected activity date and time",
    message: "Use this time",
  }),
  calendarNext: msg({
    id: "activityDetail.calendar.next",
    comment: "Android date dialog button that opens the time dialog",
    message: "Next",
  }),
  calendarDone: msg({
    id: "activityDetail.calendar.done",
    comment: "Android time dialog button that confirms the schedule",
    message: "Done",
  }),
  calendarAdd: msg({
    id: "activityDetail.calendar.add",
    comment: "Button that opens the system calendar event form",
    message: "Add to Calendar",
  }),
  calendarAddHint: msg({
    id: "activityDetail.calendar.addHint",
    comment: "Screen reader hint for the Add to Calendar button",
    message: "Opens the system event form with this activity pre-filled.",
  }),
  calendarBusy: msg({
    id: "activityDetail.calendar.busy",
    comment: "Button label while calendar permission or the event form is active",
    message: "Opening Calendar…",
  }),
  calendarSavedTitle: msg({
    id: "activityDetail.calendar.savedTitle",
    comment: "Heading after the user saves the event on iOS",
    message: "Added to Calendar",
  }),
  calendarSavedBody: msg({
    id: "activityDetail.calendar.savedBody",
    message: "The system calendar saved this activity.",
  }),
  calendarSubmittedTitle: msg({
    id: "activityDetail.calendar.submittedTitle",
    comment: "Heading after the Android calendar form closes",
    message: "Calendar form closed",
  }),
  calendarSubmittedBody: msg({
    id: "activityDetail.calendar.submittedBody",
    message: "Android does not report whether the event was saved or canceled.",
  }),
  calendarCanceledTitle: msg({
    id: "activityDetail.calendar.canceledTitle",
    comment: "Heading after the user cancels the iOS calendar event form",
    message: "Event not added",
  }),
  calendarCanceledBody: msg({
    id: "activityDetail.calendar.canceledBody",
    message: "You canceled the system calendar form. No event was added.",
  }),
  calendarPermissionDeniedTitle: msg({
    id: "activityDetail.calendar.permissionDeniedTitle",
    comment: "Heading after a calendar permission denial that can be requested again",
    message: "Calendar access denied",
  }),
  calendarPermissionDeniedBody: msg({
    id: "activityDetail.calendar.permissionDeniedBody",
    message: "Allow calendar access when asked, then try again.",
  }),
  calendarPermissionBlockedTitle: msg({
    id: "activityDetail.calendar.permissionBlockedTitle",
    comment: "Heading when calendar permission must be changed in system Settings",
    message: "Calendar access is off",
  }),
  calendarPermissionBlockedBody: msg({
    id: "activityDetail.calendar.permissionBlockedBody",
    message: "Open Settings and allow Explora to add calendar events.",
  }),
  calendarOpenSettings: msg({
    id: "activityDetail.calendar.openSettings",
    comment: "Button that opens system Settings for calendar permission",
    message: "Open Settings",
  }),
  calendarTryAgain: msg({
    id: "activityDetail.calendar.tryAgain",
    comment: "Button that retries the Add to Calendar operation",
    message: "Try again",
  }),
  calendarMissingTitle: msg({
    id: "activityDetail.calendar.missingTitle",
    comment: "Validation heading when no activity date is selected",
    message: "Choose a date and time",
  }),
  calendarMissingBody: msg({
    id: "activityDetail.calendar.missingBody",
    message: "Select a future date and start time before you open Calendar.",
  }),
  calendarPastTitle: msg({
    id: "activityDetail.calendar.pastTitle",
    comment: "Validation heading when the selected activity time is not in the future",
    message: "Choose a future time",
  }),
  calendarPastBody: msg({
    id: "activityDetail.calendar.pastBody",
    message: "The activity start time must be later than the current time.",
  }),
  calendarInvalidTitle: msg({
    id: "activityDetail.calendar.invalidTitle",
    comment: "Heading when local activity data cannot create a valid calendar event",
    message: "Activity data is invalid",
  }),
  calendarInvalidBody: msg({
    id: "activityDetail.calendar.invalidBody",
    message: "Explora cannot create an event from this activity data.",
  }),
  calendarErrorTitle: msg({
    id: "activityDetail.calendar.errorTitle",
    comment: "Heading when the native calendar operation fails unexpectedly",
    message: "Calendar could not open",
  }),
  calendarErrorBody: msg({
    id: "activityDetail.calendar.errorBody",
    message: "The system calendar returned an unexpected error. Try again.",
  }),
  calendarUnavailableTitle: msg({
    id: "activityDetail.calendar.unavailableTitle",
    comment: "Heading when the native calendar feature is unavailable",
    message: "Calendar is unavailable",
  }),
  calendarUnavailableBody: msg({
    id: "activityDetail.calendar.unavailableBody",
    message: "Add to Calendar is available only in the native iOS and Android app.",
  }),
  calendarDuplicate: msg({
    id: "activityDetail.calendar.duplicate",
    comment: "Screen reader status when a second calendar submission is blocked",
    message: "A calendar operation is already active.",
  }),
} as const;
