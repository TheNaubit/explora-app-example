import * as Calendar from "expo-calendar";
import * as LegacyCalendar from "expo-calendar/legacy";

import type { CalendarNativeAdapter } from "@/calendar/add-to-calendar";
import { selectWritableCalendar } from "@/calendar/select-writable-calendar";

function getCalendarPlatform(): CalendarNativeAdapter["platform"] {
  if (process.env.EXPO_OS === "ios" || process.env.EXPO_OS === "android") {
    return process.env.EXPO_OS;
  }

  return "web";
}

/** Expo Calendar adapter with an iOS form and confirmed Android event creation. */
export const nativeCalendarAdapter: CalendarNativeAdapter = {
  platform: getCalendarPlatform(),
  async requestPermission() {
    const response = await Calendar.requestCalendarPermissions(true);

    return {
      canAskAgain: response.canAskAgain,
      status: response.status,
    };
  },
  async addEvent(event) {
    const isAvailable = await LegacyCalendar.isAvailableAsync();
    if (!isAvailable) {
      throw new Error("Calendar is unavailable");
    }

    if (process.env.EXPO_OS === "ios") {
      const defaultCalendar = Calendar.getDefaultCalendarSync();
      return defaultCalendar.addEventWithForm(event);
    }

    if (process.env.EXPO_OS === "android") {
      const calendars = await Calendar.getCalendars(Calendar.EntityTypes.EVENT);
      const writableCalendar = selectWritableCalendar(calendars);
      if (!writableCalendar) {
        throw new Error("No writable calendar is available");
      }

      const savedEvent = await writableCalendar.createEvent(event);
      return { action: "saved", id: savedEvent.id };
    }

    throw new Error("Calendar is unavailable");
  },
};
