import { msg } from "@lingui/core/macro";

/** Shared native tab bar labels. */
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
  devTools: msg({
    id: "tabs.devTools",
    comment: "Native tab label for assessment and developer controls",
    message: "Dev Tools",
  }),
} as const;
