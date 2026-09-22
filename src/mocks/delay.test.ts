import { delay, MOCK_DELAY_MS } from "@/mocks/delay";
import { MOCK_DELAY_NORMAL_MS, MOCK_DELAY_SLOW_MS } from "@/mocks/constants";

describe("mock delay", () => {
  it("exposes named normal and slow durations", () => {
    expect(MOCK_DELAY_MS.normal).toBe(MOCK_DELAY_NORMAL_MS);
    expect(MOCK_DELAY_MS.slow).toBe(MOCK_DELAY_SLOW_MS);
  });

  it("resolves after the requested delay", async () => {
    jest.useFakeTimers();

    const pending = delay(25);
    jest.advanceTimersByTime(25);
    await expect(pending).resolves.toBeUndefined();

    jest.useRealTimers();
  });
});
