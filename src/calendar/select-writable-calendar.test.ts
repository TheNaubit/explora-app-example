import { selectWritableCalendar } from "@/calendar/select-writable-calendar";

type TestCalendar = {
  allowsModifications: boolean;
  id: string;
  isPrimary?: boolean;
  isVisible?: boolean;
};

describe("selectWritableCalendar", () => {
  it("prefers a visible primary calendar that allows changes", () => {
    const calendars: TestCalendar[] = [
      { allowsModifications: true, id: "visible", isVisible: true },
      {
        allowsModifications: true,
        id: "primary",
        isPrimary: true,
        isVisible: true,
      },
    ];

    expect(selectWritableCalendar(calendars)?.id).toBe("primary");
  });

  it("ignores a read-only primary calendar", () => {
    const calendars: TestCalendar[] = [
      {
        allowsModifications: false,
        id: "readonly-primary",
        isPrimary: true,
        isVisible: true,
      },
      { allowsModifications: true, id: "writable", isVisible: true },
    ];

    expect(selectWritableCalendar(calendars)?.id).toBe("writable");
  });

  it("returns null when no calendar allows changes", () => {
    expect(selectWritableCalendar([{ allowsModifications: false, id: "readonly" }])).toBeNull();
  });
});
