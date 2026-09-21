/**
 * Canonical accessibility API for Explora.
 * Import from `@/a11y`. Do not import `react-native-a11y` in screens or features.
 * Rules: `docs/features/accessibility.md` and root `AGENTS.md`.
 */

export {
  A11y,
  A11yProvider,
  announce,
  cancel,
  cancelAll,
  ScreenReader,
  Keyboard,
  isKeyboardConnected,
  keyboardStatusListener,
  withKeyboardFocus,
  useIsKeyboardConnected,
  useIsKeyboardConnectedRef,
  useIsScreenReaderEnabled,
  useIsScreenReaderEnabledRef,
  isScreenReaderEnabled,
  screenReaderStatusListener,
} from "react-native-a11y";

export type {
  AnnounceOptions,
  AnnouncePriority,
  AnnounceStatus,
  AnnouncementResult,
  StatusCallback,
  A11yPaneTitleProps,
  A11yScreenChangeProps,
  A11yPaneType,
} from "react-native-a11y";

export {
  DEFAULT_KEYBOARD_FOCUS_STYLE,
  mergeFocusedStyle,
  type KeyboardInteractionState,
  type KeyboardInteractiveStyle,
} from "./focus-style";
export {
  buildActivityAccessibilityLabel,
  buildFavoriteToggleLabel,
  buildSearchFieldLabel,
} from "./activity-label";
export { announceStatus } from "./announce-status";
