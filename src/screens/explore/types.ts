/** Inline status banner state for Explore refresh and next-page failures. */
export type ExploreBannerState = {
  kind: "refresh" | "nextPage";
  errorKey: string;
} | null;

/** Catalog mode owned by the Explore or Search native tab. */
export type DiscoveryMode = "browse" | "search";
