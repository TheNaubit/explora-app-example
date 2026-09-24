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
        ExpoNativeToast?: ExpoNativeToastModule;
      }
    | undefined;
}

const nativeModule =
  Platform.OS === "android"
    ? globalThis.expoV2?.ExpoNativeToast
    : requireOptionalNativeModule<ExpoNativeToastModule>("ExpoNativeToast");

export function show(options: NativeToastOptions): void {
  nativeModule?.show(options);
}

export function isAvailable(): boolean {
  return nativeModule != null;
}

export function dismiss(): void {
  nativeModule?.dismiss();
}

export function addActionListener(listener: (event: NativeToastActionEvent) => void): Subscription {
  return nativeModule?.addListener("action", listener) ?? { remove() {} };
}

export default nativeModule;
