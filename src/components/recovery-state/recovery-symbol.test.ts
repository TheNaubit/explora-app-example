import { getRecoverySymbol } from "@/components/recovery-state/recovery-symbol";

describe("getRecoverySymbol", () => {
  it("names an offline failure with a no-connection symbol", () => {
    expect(getRecoverySymbol("errors.networkOffline").ios).toBe("wifi.slash");
    expect(getRecoverySymbol("errors.networkOffline").android).toBe("wifi_off");
  });

  it("names a timeout and invalid data with their own symbols", () => {
    expect(getRecoverySymbol("errors.networkTimeout").ios).toBe("clock.badge.exclamationmark");
    expect(getRecoverySymbol("errors.validationFailed").ios).toBe("exclamationmark.triangle");
  });

  it("falls back to a neutral alert symbol for unknown causes", () => {
    expect(getRecoverySymbol("errors.unknown").ios).toBe("exclamationmark");
    expect(getRecoverySymbol(undefined).ios).toBe("exclamationmark");
  });
});
