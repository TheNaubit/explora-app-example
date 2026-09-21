This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

## Linting and formatting

- After making code changes, run `npx oxlint --fix`, then run `npx oxfmt`.
- Before finishing, run `npx oxlint --deny-warnings --format=agent`.

## Best practices
- For local state and offline usage (local-first), we use Legends State v3 with `react-native-mmkv`. You can find its docs at https://legendapp.com/open-source/state/v3/intro/introduction/ & https://legendapp.com/open-source/state/v3/sync/persist-sync/#mmkv-rn
- For lists, we use Legends List, you can check its docs at https://legendapp.com/open-source/list/v3/react-native/getting-started/ & https://legendapp.com/open-source/list/v3/react-native/keyboard-and-animated/
- For handling the keyboard, we use `react-native-keyboard-controller`. We must always use at least version `1.21.7` since Legends List component `KeyboardAwareLegendList` requires at least that version.
- For haptics, we use `react-native-pulsar` since it allows us to customize a lot the haptic patterns. Never use other libs like `expo-haptics`.
- For animations we use `react-native-reanimated` v4.
- When we want custom animated graphics, we use Lottie with the lib `lottie-react-native`. We always try to use dotLottie files but we can rely in other formats if not available.
- For icons in the app, we always use native ones, using the Expo lib `expo-symbols`, which exposes SF Symbols in iOS and Material Symbols in Android: https://docs.expo.dev/versions/latest/sdk/symbols/
- When we need to use native UI toolkits, we use `expo-ui` (https://docs.expo.dev/versions/latest/sdk/ui/universal/), with the universal components so they work both in iOS and Android. It also has many drop-in replacements (https://docs.expo.dev/versions/latest/sdk/ui/drop-in-replacements/) so we don't need third-party libs for many things like bottom sheets, masked views...
- While in this app requeriments is to build a demo without having to use APIs, servers and so on, we want to build it like if it were a production app, so we build do "network requests" but mocking the API response. And for doing those API requests, we will use https://tanstack.com/query/latest/docs/framework/react/react-native. For the online status management, we use `expo-network`. In Legends State, there is also a plugin for React Query that can be useful for us: https://legendapp.com/open-source/state/v3/sync/tanstack-query/
- We have also available `expo-glass-effect` so we can have glass effect in iOS 26+ (which is important to make the app feel native).
- For blur, we have `expo-blur`.
- For images and assets, we will use `expo-image` and `expo-asset`.
- Since this is a demo app we will share, we will use Node with `npm`. No `yarn`, no `pnpm` and not `bun`, easier to share and run for others.
- Always use project-scoped Emil skills (animate, animate-expo, animation-vocabulary, apple-design, emil-design-eng, find-animation-opportunities, improve-animations, mobile-native, review-animations, write-swift ) whe designing the app and creating animations and microinteractions. Specially when building the "iOS part", use the `apple-design` one to we follow the `HIG` guidelines. But in every platform, all the skills it has are pretty useful for high quality premium interfaces.
- We must follow a TDD-oriented way of coding: Use Jest for unit testing and use Maestro (https://docs.maestro.dev/) for E2E tests.