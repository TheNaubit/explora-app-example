import { msg } from "@lingui/core/macro";

/** Shared tab bar labels for Explore and Saved. */
export const tabMessages = {
  explore: msg({
    id: "tabs.explore",
    comment: "Native tab label for the discovery catalog",
    message: "Explore",
  }),
  saved: msg({
    id: "tabs.saved",
    comment: "Native tab label for saved favorite activities",
    message: "Saved",
  }),
} as const;
