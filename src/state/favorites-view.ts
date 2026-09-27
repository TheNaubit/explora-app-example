type FavoritesFocus = {
  activityId: string | null;
  index: number;
};

const initialFocus: FavoritesFocus = {
  activityId: null,
  index: 0,
};

let favoritesFocus = { ...initialFocus };

/** Store the focused favorite for this app session. */
export function setFavoritesFocusedActivity(activityIds: readonly string[], index: number): void {
  const boundedIndex = Math.max(0, Math.min(index, Math.max(0, activityIds.length - 1)));
  favoritesFocus = {
    activityId: activityIds[boundedIndex] ?? null,
    index: boundedIndex,
  };
}

/** Restore the same favorite, or use its nearest remaining position. */
export function getFavoritesFocusedIndex(activityIds: readonly string[]): number {
  if (activityIds.length === 0) return 0;

  const preservedIndex =
    favoritesFocus.activityId === null ? -1 : activityIds.indexOf(favoritesFocus.activityId);
  if (preservedIndex >= 0) return preservedIndex;

  return Math.min(favoritesFocus.index, activityIds.length - 1);
}

/** Clear the session-only Favorites position. */
export function resetFavoritesView(): void {
  favoritesFocus = { ...initialFocus };
}
