import type { ErrorKey } from "@/i18n/error-keys";

/** Inline status banner state for Explore refresh and next-page failures. */
export type ExploreBannerState = {
  kind: "nextPage";
  errorKey: ErrorKey;
} | null;

/** Catalog mode owned by the Explore or Search native tab. */
export type DiscoveryMode = "browse" | "search";
