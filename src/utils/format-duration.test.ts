import { i18n } from "@lingui/core";

import { formatDuration } from "@/utils/format-duration";

describe("formatDuration", () => {
  beforeAll(() => {
    i18n.loadAndActivate({ locale: "en", messages: {} });
  });

  it.each([
    [15, "15 min"],
    [60, "1 hr"],
    [90, "1 hr 30 min"],
    [120, "2 hr"],
  ])("formats %i minutes as %s", (minutes, expected) => {
    expect(formatDuration(minutes)).toBe(expected);
  });
});
