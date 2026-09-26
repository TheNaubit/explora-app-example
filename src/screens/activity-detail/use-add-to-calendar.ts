import { useRef, useState } from "react";

import { AddToCalendarCoordinator, type AddToCalendarResult } from "@/calendar/add-to-calendar";
import { nativeCalendarAdapter } from "@/calendar/native-calendar";
import type { Activity } from "@/schemas/activity";

type AddToCalendarState = {
  isActive: boolean;
  result: AddToCalendarResult | null;
  submit: (startDate: Date) => Promise<AddToCalendarResult>;
};

/** Manage one Add to Calendar operation for the current Activity Detail screen. */
export function useAddToCalendar(activity: Activity): AddToCalendarState {
  const coordinator = useRef(new AddToCalendarCoordinator(nativeCalendarAdapter));
  const [isActive, setIsActive] = useState(false);
  const [result, setResult] = useState<AddToCalendarResult | null>(null);

  async function submit(startDate: Date): Promise<AddToCalendarResult> {
    setResult(null);
    setIsActive(true);
    let shouldClearActive = true;

    try {
      const nextResult = await coordinator.current.submit(activity, startDate);
      setResult(nextResult.status);

      if (nextResult.status === "duplicate") {
        shouldClearActive = false;
      }

      return nextResult.status;
    } finally {
      if (shouldClearActive) {
        setIsActive(false);
      }
    }
  }

  return { isActive, result, submit };
}
