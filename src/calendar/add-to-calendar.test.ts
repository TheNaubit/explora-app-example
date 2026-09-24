import { SUPPLIED_ACTIVITIES } from "@/data/activities";
import {
  AddToCalendarCoordinator,
  applyCalendarDate,
  applyCalendarTime,
  buildCalendarEventDraft,
  type CalendarNativeAdapter,
} from "@/calendar/add-to-calendar";

const NOW = new Date("2026-09-24T10:00:00.000Z");
const FUTURE_START = new Date("2026-09-25T14:30:00.000Z");
const activity = SUPPLIED_ACTIVITIES[0];

function createAdapter(
  overrides: Partial<CalendarNativeAdapter> = {},
): jest.Mocked<CalendarNativeAdapter> {
  return {
    platform: "ios",
    presentEventForm: jest.fn(async () => ({ action: "saved", id: "event-1" })),
    requestWriteOnlyPermission: jest.fn(async () => ({ status: "granted", canAskAgain: true })),
    ...overrides,
  } as jest.Mocked<CalendarNativeAdapter>;
}

describe("buildCalendarEventDraft", () => {
  it("builds valid future event data from the activity", () => {
    const result = buildCalendarEventDraft(activity, FUTURE_START, NOW);

    expect(result).toEqual({
      ok: true,
      value: {
        title: activity.title,
        location: activity.location,
        notes: activity.description,
        startDate: FUTURE_START,
        endDate: new Date(FUTURE_START.getTime() + activity.durationMinutes * 60_000),
      },
    });
  });

  it("calculates the end time from the activity duration", () => {
    const result = buildCalendarEventDraft({ ...activity, durationMinutes: 95 }, FUTURE_START, NOW);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.endDate.toISOString()).toBe("2026-09-25T16:05:00.000Z");
    }
  });

  it.each([
    ["missing date", null, activity, "missing-date"],
    ["past date", new Date("2026-09-24T09:59:59.000Z"), activity, "past-date"],
    ["equal date", NOW, activity, "past-date"],
    ["invalid duration", FUTURE_START, { ...activity, durationMinutes: 0 }, "invalid-duration"],
    ["malformed activity", FUTURE_START, { ...activity, title: "" }, "invalid-activity"],
  ])("rejects %s", (_name, startDate, candidate, expectedReason) => {
    expect(buildCalendarEventDraft(candidate, startDate, NOW)).toEqual({
      ok: false,
      reason: expectedReason,
    });
  });
});

describe("calendar date and time selection", () => {
  it("changes the day without changing the selected start time", () => {
    const current = new Date(2026, 8, 25, 14, 30, 0, 0);
    const selectedDay = new Date(2026, 9, 4, 0, 0, 0, 0);

    expect(applyCalendarDate(current, selectedDay)).toEqual(new Date(2026, 9, 4, 14, 30, 0, 0));
  });

  it("changes the time without changing the selected day", () => {
    const current = new Date(2026, 8, 25, 14, 30, 0, 0);
    const selectedTime = new Date(2026, 8, 25, 18, 45, 23, 400);

    expect(applyCalendarTime(current, selectedTime)).toEqual(new Date(2026, 8, 25, 18, 45, 0, 0));
  });
});

describe("AddToCalendarCoordinator", () => {
  it("returns permission denial without opening the native form", async () => {
    const adapter = createAdapter({
      requestWriteOnlyPermission: jest.fn(async () => ({
        status: "denied" as const,
        canAskAgain: true,
      })),
    });
    const coordinator = new AddToCalendarCoordinator(adapter);

    await expect(coordinator.submit(activity, FUTURE_START, NOW)).resolves.toEqual({
      status: "permission-denied",
    });
    expect(adapter.requestWriteOnlyPermission).toHaveBeenCalledTimes(1);
    expect(adapter.presentEventForm).not.toHaveBeenCalled();
  });

  it("distinguishes permanent permission denial", async () => {
    const adapter = createAdapter({
      requestWriteOnlyPermission: jest.fn(async () => ({
        status: "denied" as const,
        canAskAgain: false,
      })),
    });
    const coordinator = new AddToCalendarCoordinator(adapter);

    await expect(coordinator.submit(activity, FUTURE_START, NOW)).resolves.toEqual({
      status: "permission-blocked",
    });
    expect(adapter.presentEventForm).not.toHaveBeenCalled();
  });

  it("reports cancellation from the native event form", async () => {
    const adapter = createAdapter({
      presentEventForm: jest.fn(async () => ({ action: "canceled" as const, id: null })),
    });
    const coordinator = new AddToCalendarCoordinator(adapter);

    await expect(coordinator.submit(activity, FUTURE_START, NOW)).resolves.toEqual({
      status: "canceled",
    });
  });

  it("prevents a duplicate submission while the native form is active", async () => {
    let resolveForm: ((result: { action: "saved"; id: string }) => void) | undefined;
    const pendingForm = new Promise<{ action: "saved"; id: string }>((resolve) => {
      resolveForm = resolve;
    });
    const adapter = createAdapter({
      presentEventForm: jest.fn(() => pendingForm),
    });
    const coordinator = new AddToCalendarCoordinator(adapter);

    const firstSubmission = coordinator.submit(activity, FUTURE_START, NOW);
    await Promise.resolve();

    await expect(coordinator.submit(activity, FUTURE_START, NOW)).resolves.toEqual({
      status: "duplicate",
    });
    expect(adapter.presentEventForm).toHaveBeenCalledTimes(1);

    resolveForm?.({ action: "saved", id: "event-1" });
    await expect(firstSubmission).resolves.toEqual({ status: "saved" });
  });

  it("returns a stable error result for unexpected native failures", async () => {
    const adapter = createAdapter({
      presentEventForm: jest.fn(async () => {
        throw new Error("Native calendar failed");
      }),
    });
    const coordinator = new AddToCalendarCoordinator(adapter);

    await expect(coordinator.submit(activity, FUTURE_START, NOW)).resolves.toEqual({
      status: "native-error",
    });
  });

  it("uses the Android system form without requesting calendar permission", async () => {
    const adapter = createAdapter({ platform: "android" });
    const coordinator = new AddToCalendarCoordinator(adapter);

    await expect(coordinator.submit(activity, FUTURE_START, NOW)).resolves.toEqual({
      status: "submitted",
    });
    expect(adapter.requestWriteOnlyPermission).not.toHaveBeenCalled();
    expect(adapter.presentEventForm).toHaveBeenCalledTimes(1);
  });
});
