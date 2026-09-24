import * as Calendar from "expo-calendar";
import * as LegacyCalendar from "expo-calendar/legacy";

import type { CalendarNativeAdapter } from "@/calendar/add-to-calendar";

function getCalendarPlatform(): CalendarNativeAdapter["platform"] {
  if (process.env.EXPO_OS === "ios" || process.env.EXPO_OS === "android") {
    return process.env.EXPO_OS;
  }

  return "web";
}

/** Expo Calendar adapter with write-only iOS access and Android system UI. */
export const nativeCalendarAdapter: CalendarNativeAdapter = {
  platform: getCalendarPlatform(),
  async requestWriteOnlyPermission() {
    const response = await Calendar.requestCalendarPermissions(true);

    return {
      canAskAgain: response.canAskAgain,
      status: response.status,
    };
  },
  async presentEventForm(event) {
    const isAvailable = await LegacyCalendar.isAvailableAsync();
    if (!isAvailable) {
      throw new Error("Calendar is unavailable");
    }

    if (process.env.EXPO_OS === "ios") {
      const defaultCalendar = Calendar.getDefaultCalendarSync();
      return defaultCalendar.addEventWithForm(event);
    }

    if (process.env.EXPO_OS === "android") {
      return LegacyCalendar.createEventInCalendarAsync(event, {
        startNewActivityTask: false,
      });
    }

    throw new Error("Calendar is unavailable");
  },
};
