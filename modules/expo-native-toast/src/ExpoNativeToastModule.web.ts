import { registerWebModule, NativeModule } from "expo";

import type { NativeToastActionEvent, NativeToastOptions } from "./ExpoNativeToast.types";

// ExpoNativeToastModule is not available on the web platform.
class ExpoNativeToastModule extends NativeModule<{}> {
  dismiss(): void {
    return undefined;
  }
  show(_options: NativeToastOptions): void {
    return undefined;
  }
}

export function show(_options: NativeToastOptions): void {
  return undefined;
}
export function isAvailable(): boolean {
  return false;
}
export function dismiss(): void {
  return undefined;
}
export function addActionListener(_listener: (event: NativeToastActionEvent) => void) {
  return {
    remove() {
      return undefined;
    },
  };
}

export default registerWebModule(ExpoNativeToastModule, "ExpoNativeToast");
