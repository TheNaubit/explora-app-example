import { NativeModule, requireOptionalNativeModule } from "expo";
import { Platform } from "react-native";

import type { NativeToastActionEvent, NativeToastOptions } from "./ExpoNativeToast.types";

type Subscription = { remove: () => void };

export declare class ExpoNativeToastModule extends NativeModule<{
  action: (event: NativeToastActionEvent) => void;
}> {
  dismiss(): void;
  show(options: NativeToastOptions): void;
}

declare global {
  var expoV2:
    | {
        modules?: {
          ExpoNativeToast?: ExpoNativeToastModule;
        };
      }
    | undefined;
}

const legacyNativeModule =
  Platform.OS === "android"
    ? null
    : requireOptionalNativeModule<ExpoNativeToastModule>("ExpoNativeToast");

function getNativeModule(): ExpoNativeToastModule | null {
  if (Platform.OS === "android") {
    return globalThis.expoV2?.modules?.ExpoNativeToast ?? null;
  }

  return legacyNativeModule;
}

export function show(options: NativeToastOptions): void {
  getNativeModule()?.show(options);
}

export function isAvailable(): boolean {
  return getNativeModule() != null;
}

export function dismiss(): void {
  getNativeModule()?.dismiss();
}

export function addActionListener(listener: (event: NativeToastActionEvent) => void): Subscription {
  return getNativeModule()?.addListener("action", listener) ?? { remove() {} };
}

export default legacyNativeModule;
