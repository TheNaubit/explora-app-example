jest.mock("expo-localization", () => ({
  getLocales: jest.fn(),
}));

import { getLocales } from "expo-localization";

import { readDeviceTextDirection } from "@/i18n/device-direction";

describe("readDeviceTextDirection", () => {
  it("uses device textDirection when present", () => {
    jest.mocked(getLocales).mockReturnValue([
      {
        languageTag: "ar-SA",
        languageCode: "ar",
        textDirection: "rtl",
      },
    ] as never);

    expect(readDeviceTextDirection()).toBe("rtl");
  });

  it("falls back to the language tag when textDirection is missing", () => {
    jest.mocked(getLocales).mockReturnValue([
      {
        languageTag: "he-IL",
        languageCode: "he",
        textDirection: null,
      },
    ] as never);

    expect(readDeviceTextDirection()).toBe("rtl");
  });
});
