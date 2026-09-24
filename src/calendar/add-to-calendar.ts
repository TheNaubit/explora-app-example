import { MILLISECONDS_PER_MINUTE } from "@/calendar/constants";
import { activitySchema } from "@/schemas/activity";

export type CalendarEventDraft = {
  endDate: Date;
  location: string;
  notes: string;
  startDate: Date;
  title: string;
};

type CalendarEventValidationFailure = {
  ok: false;
  reason: "invalid-activity" | "invalid-duration" | "missing-date" | "past-date";
};

type CalendarEventValidationResult =
  | CalendarEventValidationFailure
  | { ok: true; value: CalendarEventDraft };

export type CalendarPermissionResult = {
  canAskAgain: boolean;
  status: "denied" | "granted" | "undetermined";
};

export type CalendarFormResult = {
  action: "canceled" | "deleted" | "done" | "saved";
  id: string | null;
};

export type CalendarNativeAdapter = {
  platform: "android" | "ios" | "web";
  presentEventForm: (event: CalendarEventDraft) => Promise<CalendarFormResult>;
  requestWriteOnlyPermission: () => Promise<CalendarPermissionResult>;
};

export type AddToCalendarResult =
  | CalendarEventValidationFailure["reason"]
  | "canceled"
  | "duplicate"
  | "native-error"
  | "permission-blocked"
  | "permission-denied"
  | "saved"
  | "submitted"
  | "unavailable";

/** Apply a selected day and keep the existing local start time. */
export function applyCalendarDate(current: Date, selectedDay: Date): Date {
  return new Date(
    selectedDay.getFullYear(),
    selectedDay.getMonth(),
    selectedDay.getDate(),
    current.getHours(),
    current.getMinutes(),
    0,
    0,
  );
}

/** Apply a selected local time and keep the existing calendar day. */
export function applyCalendarTime(current: Date, selectedTime: Date): Date {
  return new Date(
    current.getFullYear(),
    current.getMonth(),
    current.getDate(),
    selectedTime.getHours(),
    selectedTime.getMinutes(),
    0,
    0,
  );
}

/** Validate local activity data and create the system calendar draft. */
export function buildCalendarEventDraft(
  activityInput: unknown,
  startDate: Date | null,
  now: Date,
): CalendarEventValidationResult {
  const activityResult = activitySchema.safeParse(activityInput);

  if (!activityResult.success) {
    const durationResult = activitySchema.shape.durationMinutes.safeParse(
      (activityInput as { durationMinutes?: unknown } | null)?.durationMinutes,
    );

    return {
      ok: false,
      reason: durationResult.success ? "invalid-activity" : "invalid-duration",
    };
  }

  if (startDate === null || !Number.isFinite(startDate.getTime())) {
    return { ok: false, reason: "missing-date" };
  }

  if (startDate.getTime() <= now.getTime()) {
    return { ok: false, reason: "past-date" };
  }

  const endDate = new Date(
    startDate.getTime() + activityResult.data.durationMinutes * MILLISECONDS_PER_MINUTE,
  );

  if (!Number.isFinite(endDate.getTime())) {
    return { ok: false, reason: "invalid-duration" };
  }

  return {
    ok: true,
    value: {
      endDate,
      location: activityResult.data.location,
      notes: activityResult.data.description,
      startDate,
      title: activityResult.data.title,
    },
  };
}

/** Coordinate one permission request and native calendar form at a time. */
export class AddToCalendarCoordinator {
  private isActive = false;

  constructor(private readonly adapter: CalendarNativeAdapter) {}

  async submit(activity: unknown, startDate: Date | null, now = new Date()) {
    if (this.isActive) {
      return { status: "duplicate" as const };
    }

    const draftResult = buildCalendarEventDraft(activity, startDate, now);
    if (!draftResult.ok) {
      return { status: draftResult.reason };
    }

    if (this.adapter.platform === "web") {
      return { status: "unavailable" as const };
    }

    this.isActive = true;

    try {
      if (this.adapter.platform === "ios") {
        const permission = await this.adapter.requestWriteOnlyPermission();
        if (permission.status !== "granted") {
          return {
            status: permission.canAskAgain
              ? ("permission-denied" as const)
              : ("permission-blocked" as const),
          };
        }
      }

      const formResult = await this.adapter.presentEventForm(draftResult.value);

      if (this.adapter.platform === "android") {
        return { status: "submitted" as const };
      }

      if (formResult.action === "canceled") {
        return { status: "canceled" as const };
      }

      if (formResult.action === "saved") {
        return { status: "saved" as const };
      }

      return { status: "native-error" as const };
    } catch {
      return { status: "native-error" as const };
    } finally {
      this.isActive = false;
    }
  }
}
