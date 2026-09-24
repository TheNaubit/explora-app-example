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
} as const;
