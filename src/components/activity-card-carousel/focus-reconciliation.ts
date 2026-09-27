/** Keep the same activity focused, or select its nearest replacement after removal. */
export function getReconciledFocusIndex(
  previousIds: readonly string[],
  nextIds: readonly string[],
  focusedIndex: number,
): number {
  if (nextIds.length === 0) return 0;

  const boundedIndex = Math.max(0, Math.min(focusedIndex, previousIds.length - 1));
  const focusedId = previousIds[boundedIndex];
  const preservedIndex = focusedId === undefined ? -1 : nextIds.indexOf(focusedId);

  return preservedIndex >= 0 ? preservedIndex : Math.min(boundedIndex, nextIds.length - 1);
}

/** Build the native scroll command for the replacement card. */
export function getReconciledScrollParams(offset: number): {
  animated: false;
  offset: number;
} {
  return { animated: false, offset };
}
