import { plural } from "@lingui/core/macro";

function formatMinuteUnit(value: number): string {
  return plural(value, {
    one: "# min",
    other: "# min",
  });
}

function formatHourUnit(value: number): string {
  return plural(value, {
    one: "# hr",
    other: "# hr",
  });
}

/**
 * Format duration for list and detail text.
 * Input is whole minutes from the activity schema.
 * Uses Lingui plurals so translators can adjust unit forms.
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return formatMinuteUnit(minutes);
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return formatHourUnit(hours);
  }

  return `${formatHourUnit(hours)} ${formatMinuteUnit(remainingMinutes)}`;
}
