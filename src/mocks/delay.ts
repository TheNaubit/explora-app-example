import { MOCK_DELAY_NORMAL_MS, MOCK_DELAY_SLOW_MS } from "@/mocks/constants";

/** Delay durations for mock network behavior (milliseconds). */
export const MOCK_DELAY_MS = {
  normal: MOCK_DELAY_NORMAL_MS,
  slow: MOCK_DELAY_SLOW_MS,
} as const;

/** Wait for the given number of milliseconds. */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
