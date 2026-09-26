import { msg } from "@lingui/core/macro";

export const favoritesMessages = {
  screenTitle: msg({
    id: "favorites.screenTitle",
    comment: "Spoken ScreenFrame title for the Favorites tab",
    message: "Favorites",
  }),
  heading: msg({
    id: "favorites.heading",
    comment: "Visible display title on the Favorites screen",
    message: "Favorites",
  }),
  summary: msg({
    id: "favorites.summary",
    comment:
      "Line below the Favorites title. {count} is the number of favorite activities. Favorites stay on the device and open without a network connection",
    message: "{count, plural, one {# activity} other {# activities}} · Available offline",
  }),
  summaryAccessibilityLabel: msg({
    id: "favorites.summaryAccessibilityLabel",
    comment:
      "Spoken version of the Favorites summary line. {count} is the number of favorite activities",
    message: "{count, plural, one {# activity} other {# activities}}, available offline",
  }),
  emptyTitle: msg({
    id: "favorites.emptyTitle",
    comment: "Title when the user has no favorite activities",
    message: "No favorite activities",
  }),
  emptyBody: msg({
    id: "favorites.emptyBody",
    comment: "Body when the favorites list is empty",
    message: "Save an activity from Explore to find it here later.",
  }),
  emptyAction: msg({
    id: "favorites.emptyAction",
    comment: "Button that opens the Explore tab from an empty Favorites list",
    message: "Browse activities",
  }),
  emptyAnnounce: msg({
    id: "favorites.emptyAnnounce",
    comment: "Screen reader announcement for an empty Favorites list",
    message: "No favorite activities.",
  }),
  loadedAnnounce: msg({
    id: "favorites.loadedAnnounce",
    comment: "Screen reader announcement when favorite activities are shown",
    message: "Favorite activities loaded.",
  }),
} as const;
