import { announce } from "react-native-a11y";

/**
 * Announce a short status for loading, empty, error, or success.
 * Call after the UI state change. Keep the message one sentence.
 * Swallows announce failures so missing native links do not crash the UI.
 */
export function announceStatus(message: string): void {
  try {
    void Promise.resolve(announce(message)).catch(() => {
      // Native announce failed or the module is not linked yet.
    });
  } catch {
    // Linking proxy can throw synchronously before a development build exists.
  }
}
