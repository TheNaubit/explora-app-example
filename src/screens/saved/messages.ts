import { msg } from "@lingui/core/macro";

export const savedMessages = {
  screenTitle: msg({
    id: "saved.screenTitle",
    comment: "Spoken ScreenFrame title for the Saved favorites tab",
    message: "Saved",
  }),
  heading: msg({
    id: "saved.heading",
    comment: "Visible display title on the Saved screen",
    message: "Saved",
  }),
  offlineHint: msg({
    id: "saved.offlineHint",
    comment: "Explains that saved activity details stay available offline",
    message: "Saved details stay available offline.",
  }),
  emptyTitle: msg({
    id: "saved.emptyTitle",
    comment: "Title when the user has no favorite activities",
    message: "No saved activities",
  }),
  emptyBody: msg({
    id: "saved.emptyBody",
    comment: "Body when the favorites list is empty",
    message: "Save an activity from Explore to find it here later.",
  }),
  emptyAction: msg({
    id: "saved.emptyAction",
    comment: "Button that opens the Explore tab from an empty Saved list",
    message: "Browse activities",
  }),
  emptyAnnounce: msg({
    id: "saved.emptyAnnounce",
    comment: "Screen reader announcement for an empty Saved list",
    message: "No saved activities.",
  }),
  loadedAnnounce: msg({
    id: "saved.loadedAnnounce",
    comment: "Screen reader announcement when Saved favorites are shown",
    message: "Saved activities loaded.",
  }),
} as const;
