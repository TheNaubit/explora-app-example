import type { QueryClient } from "@tanstack/react-query";

import {
  getCatalogSize,
  resetCatalog,
  setCatalogMode,
  type CatalogMode,
} from "@/mocks/catalog-store";
import { getReviewModeState, setReviewModeState } from "@/mocks/review-mode";
import type { ReviewModeState } from "@/schemas/review-mode";
import { resetDiscoveryFilters, resetDiscoveryScrollOffsets } from "@/state/discovery";
import { clearFavorites, listFavoriteIds } from "@/state/favorites";

export type ReviewModeKey = keyof ReviewModeState;

/** Update one request mode and retain the other mode values. */
export function updateReviewMode<Key extends ReviewModeKey>(
  key: Key,
  value: ReviewModeState[Key],
): ReviewModeState {
  return setReviewModeState({ ...getReviewModeState(), [key]: value });
}

/** Reset request results and refetch active screens without changing local user data. */
export function clearRequestCache(queryClient: QueryClient): void {
  void queryClient.resetQueries();
}

/** Select a reproducible catalog dataset without changing favorites or filters. */
export function updateCatalogMode(
  queryClient: QueryClient,
  catalogMode: CatalogMode,
): { catalogCount: number; catalogMode: CatalogMode } {
  setCatalogMode(catalogMode);
  clearRequestCache(queryClient);

  return { catalogCount: getCatalogSize(), catalogMode };
}

/** Reset local product data and request state to a reproducible baseline. */
export function resetLocalData(queryClient: QueryClient): {
  catalogCount: number;
  favoriteCount: number;
} {
  resetCatalog();
  clearFavorites();
  resetDiscoveryFilters();
  resetDiscoveryScrollOffsets();
  queryClient.clear();

  return {
    catalogCount: getCatalogSize(),
    favoriteCount: listFavoriteIds().length,
  };
}
