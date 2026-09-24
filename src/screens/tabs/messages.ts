import { msg } from "@lingui/core/macro";

/** Shared tab bar labels for Explore and Favorites. */
export const tabMessages = {
  explore: msg({
    id: "tabs.explore",
    comment: "Native tab label for the discovery catalog",
    message: "Explore",
  }),
  favorites: msg({
    id: "tabs.favorites",
    comment: "Native tab label for favorite activities",
    message: "Favorites",
  }),
} as const;
