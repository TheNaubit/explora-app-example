import type { AndroidSymbol, SFSymbol } from "expo-symbols";

import type { ErrorKey } from "@/i18n/error-keys";

type RecoverySymbol = {
  android: AndroidSymbol;
  ios: SFSymbol;
  web: AndroidSymbol;
};

const defaultSymbol: RecoverySymbol = {
  android: "priority_high",
  ios: "exclamationmark",
  web: "priority_high",
};

const symbolsByErrorKey: Partial<Record<ErrorKey, RecoverySymbol>> = {
  "errors.networkOffline": { android: "wifi_off", ios: "wifi.slash", web: "wifi_off" },
  "errors.networkTimeout": {
    android: "schedule",
    ios: "clock.badge.exclamationmark",
    web: "schedule",
  },
  "errors.refreshFailed": {
    android: "sync_problem",
    ios: "exclamationmark.arrow.triangle.2.circlepath",
    web: "sync_problem",
  },
  "errors.validationFailed": { android: "report", ios: "exclamationmark.triangle", web: "report" },
};

/** Return the platform symbol that names the cause of a failure. */
export function getRecoverySymbol(errorKey?: ErrorKey): RecoverySymbol {
  if (errorKey === undefined) return defaultSymbol;
  return symbolsByErrorKey[errorKey] ?? defaultSymbol;
}
