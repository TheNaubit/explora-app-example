import type { QueryClient } from "@tanstack/react-query";

import { getCatalogSize, resetCatalog } from "@/mocks/catalog-store";
import { getReviewModeState, setReviewModeState } from "@/mocks/review-mode";
import type { ReviewModeState } from "@/schemas/review-mode";
import { resetDiscoveryFilters } from "@/state/discovery";
import { clearFavorites, listFavoriteIds } from "@/state/favorites";

export type ReviewModeKey = keyof ReviewModeState;

/** Update one request mode and retain the other mode values. */
export function updateReviewMode<Key extends ReviewModeKey>(
  key: Key,
  value: ReviewModeState[Key],
): ReviewModeState {
  return setReviewModeState({ ...getReviewModeState(), [key]: value });
}

/** Remove request results without changing favorites or generated activities. */
export function clearRequestCache(queryClient: QueryClient): void {
  queryClient.clear();
}

/** Reset local product data and request state to a reproducible baseline. */
export function resetLocalData(queryClient: QueryClient): {
  catalogCount: number;
  favoriteCount: number;
} {
  resetCatalog();
  clearFavorites();
  resetDiscoveryFilters();
  queryClient.clear();

  return {
    catalogCount: getCatalogSize(),
    favoriteCount: listFavoriteIds().length,
  };
}
