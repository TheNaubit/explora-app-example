# Navigation

## Current behavior

- Root layout wraps Query, a11y, i18n, and Expo Router `ThemeProvider`.
- Primary navigation uses Expo Router **NativeTabs** (`expo-router/unstable-native-tabs` on SDK 57).
- Tabs: **Explore** (`/`) and **Saved** (`/saved`).
- iOS 26+: system Liquid Glass tab bar, `minimizeBehavior="onScrollDown"`.
- Android: Material bottom navigation with `tabBarRespectsIMEInsets`.
- Tint and label colors use `DynamicColorIOS` on iOS so Liquid Glass can adapt.

## Code map

| Concern        | Location                            |
| -------------- | ----------------------------------- |
| Providers      | `src/app/_layout.tsx`               |
| Native tab bar | `src/components/app-tabs/index.tsx` |
| Tab labels     | `src/screens/tabs/messages.ts`      |
| Explore route  | `src/app/index.tsx`                 |
| Saved route    | `src/app/saved.tsx`                 |

## Related

- [Discovery](./discovery.md)
- [Favorites + offline](./favorites-offline.md)
- Expo docs: https://docs.expo.dev/router/advanced/native-tabs/
