# Navigation

## Current behavior

- Root layout wraps Query, a11y, i18n, SafeAreaProvider, and Expo Router `ThemeProvider`.
- Primary navigation uses Expo Router **NativeTabs** (`expo-router/native-tabs` on SDK 58).
- Tabs: **Explore** (`/(explore)`) and **Saved** (`/(saved)`).
- Both tabs use one array-route stack layout.
- Both stacks push the shared `/activity/[id]` route.
- Activity Detail uses `Link.AppleZoom` and `Link.AppleZoomTarget`.
- iOS 18 and later use the native zoom transition.
- Android and older iOS versions use the standard stack transition.
- Search stays on the Explore route and does not select another tab.
- iOS and web show the search field in the Explore header.
- Android registers a stacked `Stack.SearchBar` in the Explore Stack.
- iOS 26+: system Liquid Glass tab bar, `minimizeBehavior="onScrollDown"`.
- Android: Material bottom navigation with `tabBarRespectsIMEInsets`.
- Tint and label colors use `DynamicColorIOS` on iOS so Liquid Glass can adapt.

## Code map

| Concern        | Location                                    |
| -------------- | ------------------------------------------- |
| Providers      | `src/app/_layout.tsx`                       |
| Native tab bar | `src/components/app-tabs/index.tsx`         |
| Tab labels     | `src/screens/tabs/messages.ts`              |
| Shared stacks  | `src/app/(explore,saved)/_layout.tsx`       |
| Tab index      | `src/app/(explore,saved)/index.tsx`         |
| Detail route   | `src/app/(explore,saved)/activity/[id].tsx` |

## Related

- [Discovery](./discovery.md)
- [Favorites + offline](./favorites-offline.md)
- [Activity detail](./activity-detail.md)
- Expo docs: https://docs.expo.dev/router/advanced/native-tabs/
- Expo zoom docs: https://docs.expo.dev/router/advanced/zoom-transition/
