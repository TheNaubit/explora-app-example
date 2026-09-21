/**
 * Format duration for list and detail text (`45 min`, `1 hr`, `1 hr 30 min`).
 * Input is whole minutes from the activity schema.
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return hours === 1 ? "1 hr" : `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
}
