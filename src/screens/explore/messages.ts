import { msg } from "@lingui/core/macro";

/**
 * Explore screen copy.
 * Keep message descriptors here. Do not define `msg()` blocks in the screen body file.
 */
export const exploreMessages = {
  screenTitle: msg({
    id: "explore.screenTitle",
    comment: "Spoken screen title for the Explore discovery screen",
    message: "Explore",
  }),
  heading: msg({
    id: "explore.heading",
    comment: "Visible display title on the Explore screen",
    message: "Explore",
  }),
  searchPlaceholder: msg({
    id: "explore.searchPlaceholder",
    comment: "Placeholder in the Explore header search bar",
    message: "Search by title",
  }),
  loadingAnnounce: msg({
    id: "explore.loadingAnnounce",
    comment: "Screen reader status while the catalog first load is pending",
    message: "Loading activities.",
  }),
  loadedAnnounce: msg({
    id: "explore.loadedAnnounce",
    comment: "Screen reader status when the catalog list finished loading with results",
    message: "Activities loaded.",
  }),
  loadErrorTitle: msg({
    id: "explore.loadErrorTitle",
    comment: "Heading when the first activity catalog request fails",
    message: "Could not load activities",
  }),
  loadErrorRetry: msg({
    id: "explore.loadErrorRetry",
    comment: "Button that retries the first activity catalog request",
    message: "Try again",
  }),
  emptyAnnounce: msg({
    id: "explore.emptyAnnounce",
    comment: "Screen reader status when search or filters return no activities",
    message: "No activities match your search.",
  }),
  emptyTitle: msg({
    id: "explore.emptyTitle",
    comment: "Empty state heading when filters return no activities",
    message: "No matching activities",
  }),
  emptyBody: msg({
    id: "explore.emptyBody",
    comment: "Empty state body when filters return no activities",
    message: "Try a different search or clear your filters.",
  }),
  emptyAction: msg({
    id: "explore.emptyAction",
    comment: "Empty state action that clears search and category filters",
    message: "Clear filters",
  }),
  browseEmptyAnnounce: msg({
    id: "explore.browseEmptyAnnounce",
    comment: "Screen reader status when the unfiltered activity catalog is empty",
    message: "No activities are available.",
  }),
  browseEmptyTitle: msg({
    id: "explore.browseEmptyTitle",
    comment: "Empty state heading when the activity catalog has no items",
    message: "No activities available",
  }),
  browseEmptyBody: msg({
    id: "explore.browseEmptyBody",
    comment: "Empty state body when the activity catalog has no items",
    message: "Refresh the catalog to try again.",
  }),
  browseEmptyAction: msg({
    id: "explore.browseEmptyAction",
    comment: "Button that refreshes an empty activity catalog",
    message: "Refresh",
  }),
  refreshAction: msg({
    id: "explore.refreshAction",
    comment: "Accessible name for the Explore pull-to-refresh control",
    message: "Refresh activities",
  }),
  refreshFailedTitle: msg({
    id: "explore.refreshFailedTitle",
    comment: "Native toast title when catalog refresh fails",
    message: "Refresh failed",
  }),
  nextPageFailedTitle: msg({
    id: "explore.nextPageFailedTitle",
    comment: "Inline banner title when loading the next catalog page fails",
    message: "Could not load more",
  }),
  bannerRetry: msg({
    id: "explore.bannerRetry",
    comment: "Retry label on Explore inline error banners",
    message: "Retry",
  }),
  refreshSuccessAnnounce: msg({
    id: "explore.refreshSuccessAnnounce",
    comment: "Screen reader status after a successful catalog refresh",
    message: "Catalog refreshed. One activity added.",
  }),
} as const;
