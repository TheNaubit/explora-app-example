/**
 * Hermes may miss some `Intl` APIs that Lingui and ICU formatting need.
 * Import `/polyfill-force` so low-end devices do not pay for feature detection.
 * See https://lingui.dev/tutorials/react-native
 */
import "@formatjs/intl-locale/polyfill-force";
import "@formatjs/intl-pluralrules/polyfill-force";
import "@formatjs/intl-pluralrules/locale-data/en";
