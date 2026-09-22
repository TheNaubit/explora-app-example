import {
  getDirection,
  localeDisplayName,
  resolveLocale,
  resolveTextDirection,
  sourceLocale,
} from "@/i18n/locales";

describe("i18n locales helpers", () => {
  it("resolves supported and unsupported language codes", () => {
    expect(resolveLocale("en")).toBe("en");
    expect(resolveLocale("en-US")).toBe("en");
    expect(resolveLocale("fr")).toBe(sourceLocale);
    expect(resolveLocale(null)).toBe(sourceLocale);
  });

  it("resolves text direction from device fields", () => {
    expect(resolveTextDirection("rtl", "en-US")).toBe("rtl");
    expect(resolveTextDirection("ltr", "ar-SA")).toBe("ltr");
    expect(resolveTextDirection(null, "he-IL")).toBe(getDirection("he-IL"));
    expect(resolveTextDirection(undefined, "en-US")).toBe("ltr");
  });

  it("returns a display name for a locale", () => {
    expect(localeDisplayName("en")).toEqual(expect.any(String));
  });
});
