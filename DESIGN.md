# Explora design system

This file is the canonical design contract for Explora. Read it before you change any screen or interactive component.

The contract follows the root `AGENTS.md` rules. Accessibility, internationalization, and full data-state coverage remain mandatory.

## Product character

Explora feels calm, capable, and curious. It helps people find an activity without adding pressure or visual noise.

Use editorial photography to create interest. Use the interface to create trust.

## Reference images

- [Core journey concept](./docs/design/references/explora-core-journey-concept.png)
- [Data states concept](./docs/design/references/explora-data-states-concept.png)
- [Claymorphic icon style](./docs/design/references/claymorphic-icons-style.jpeg)

Use these images for direction. Do not copy their pixels without checking this contract.

The journey images show content hierarchy, photography style, and general density. They do not show the complete dark theme or Liquid Glass behavior.

The claymorphic board is the **canonical style for friendly 3D icons and empty-state illustrations**.

## Target devices

- Use iPhone 18 Pro as the primary design viewport: 402 × 874 points.
- Support Android phones with the same hierarchy and semantic tokens.
- Respect safe areas, the Dynamic Island, and the home indicator.
- Keep every interactive target at least 44 × 44 points.
- Test layouts with large text. Do not fix important content to a single height.

## Theme tokens

The implementation source is [`src/theme.ts`](./src/theme.ts). Keep this file and the TypeScript tokens synchronized.

### Colors

Use one forest-green accent. Use warm neutrals in both themes.

| Role              | Light                    | Dark                  | Use                                     |
| ----------------- | ------------------------ | --------------------- | --------------------------------------- |
| Background        | `#F7F4EC`                | `#101411`             | Main screen background                  |
| Background clear  | `rgba(247, 244, 236, 0)` | `rgba(16, 20, 17, 0)` | Image-to-screen fades                   |
| Surface           | `#FFFDF8`                | `#171C18`             | Cards, inputs, and grouped content      |
| Secondary surface | `#EEEAE1`                | `#202620`             | Selected regions and quiet controls     |
| Elevated surface  | `#FFFFFF`                | `#262D27`             | Floating non-glass surfaces             |
| Primary text      | `#1C211D`                | `#F5F2EA`             | Titles and body text                    |
| Secondary text    | `#616860`                | `#B8BDB6`             | Supporting and metadata text            |
| Border            | `#D9D7CE`                | `#343C35`             | Input and card boundaries               |
| Accent            | `#2F6D50`                | `#70B58D`             | Primary action, active state, and focus |
| Accent pressed    | `#245940`                | `#5B9D77`             | Press feedback                          |
| On accent         | `#FFFFFF`                | `#07140C`             | Content on the accent                   |
| Warning           | `#9A650A`                | `#E7B760`             | Non-blocking warning                    |
| Danger            | `#B23B32`                | `#F18A80`             | Error and destructive action            |
| Danger surface    | `#FCECEA`                | `#3A211F`             | Inline error background                 |
| Skeleton          | `#DEDAD0`                | `#2A312B`             | Loading placeholders                    |

Do not add another accent hue. Photography can contain natural color, but interface chrome stays within these tokens.

### Typography

Use the platform system font. Let Dynamic Type scale all journey text.

| Role        | Size | Line | Weight | Use                              |
| ----------- | ---: | ---: | -----: | -------------------------------- |
| Display     |   34 |   41 |    700 | One large screen title           |
| Title       |   28 |   34 |    700 | Detail title and major section   |
| Headline    |   20 |   25 |    600 | Card title and state heading     |
| Body        |   17 |   24 |    400 | Descriptions and supporting copy |
| Body strong |   17 |   24 |    600 | Important body content           |
| Label       |   15 |   20 |    600 | Buttons, chips, and navigation   |
| Caption     |   13 |   18 |    400 | Supporting metadata              |
| Meta        |   12 |   16 |    500 | Compact status and duration      |

Use one display size per screen. Use weight before color to create hierarchy.

### Spacing

Use the 4-point scale: `4`, `8`, `12`, `16`, `20`, `24`, `32`, `40`, and `48`.

- Use `16` for standard component padding.
- Use `24` for screen gutters on regular phones.
- Use `8` or `12` between related elements.
- Use `24` or `32` between sections.

### Shape

| Token       | Value | Use                                  |
| ----------- | ----: | ------------------------------------ |
| Small       |    10 | Compact status banners               |
| Medium      |    14 | Inputs and small controls            |
| Large       |    18 | Activity cards                       |
| Extra large |    24 | Sheets and major grouped surfaces    |
| Full        |   999 | Chips and circular action containers |

Use continuous corners. Do not introduce a new radius for one component.

### Elevation

- **None:** Default content and list rows.
- **Raised:** Activity cards over the background.
- **Floating:** Tab bars, floating controls, and status banners.
- **Modal:** Sheets and blocking surfaces.

Use one elevation reason per surface. Do not use shadows as decoration.

## Liquid Glass and materials

Liquid Glass is functional chrome. It is not the page background or a card decoration.

Activity card text sits inside the lower part of the cover image.
Crossfade that region from the sharp cover into a blurred copy of the same cover.
Place a dark translucent scrim above the blur, so text contrast does not depend on the photo.
Do not use a pale band or a hard image-to-body seam.
This image treatment is not Liquid Glass. Do not add `GlassView` or `BlurView` to the card surface.

Use native `GlassView` only when both Liquid Glass availability checks succeed. This requires iOS 26 or later.

Use Liquid Glass for:

- The floating bottom tab bar via Expo Router **NativeTabs** (system Liquid Glass on iOS 26+).
- Hero-image back, share, and favorite controls.
- Compact floating review controls when a temporary launcher is necessary.
- A floating toolbar that remains above scrolling content.

Do not build a custom `GlassTabBar` when NativeTabs already provides the system tab bar.
On Android, NativeTabs uses Material bottom navigation.

Do not use Liquid Glass for:

- Activity cards.
- Search results.
- Error, empty, or loading content.
- Large text regions.
- Glass placed on another glass surface.

Use a semantic elevated surface when Liquid Glass is unavailable. Android can use `BlurView` for floating chrome on supported devices.

Use a solid elevated surface when reduced transparency is active. Keep the same size, spacing, and hierarchy in every fallback.

Do not animate `GlassView` opacity. Use its glass animation configuration when the material must enter or exit.

## Photography

- Use natural light and realistic locations.
- Use warm color grading and subtle texture.
- Show the activity, not a posed advertisement.
- Keep people secondary to the activity.
- Use a consistent crop ratio within each list.
- Provide an accessible text alternative through the activity content.

Do not add ratings, prices, or availability data that the dataset does not contain.

## Claymorphic icons and illustrations

Explora uses a friendly **3D claymorphism** icon style (Airbnb-like clay / soft plastic icons). This is mandatory for empty states, category cues, and other marketing-style illustrations.

### Style rules

1. Soft matte clay or soft-plastic material. No glossy chrome.
2. Chunky rounded forms. No sharp corners.
3. Isometric or 3/4 view looking slightly down.
4. Soft diffused lighting from the top-front.
5. Gentle drop shadow under the object.
6. Muted premium palette that fits Explora tokens (cream, forest green, soft mustard, brick red, sky blue).
7. One clear subject per asset. No text on the illustration.
8. Prefer a transparent or clean white background for app assets.

### When to use

| Use                                                       | Prefer                                                             |
| --------------------------------------------------------- | ------------------------------------------------------------------ |
| Empty, not-found, and friendly status illustrations       | Claymorphic PNG under `assets/illustrations/`                      |
| Category media placeholders when the dataset has no photo | Matching category clay icon, or a seeded cover photo with BlurHash |
| Compact chrome (search, clear, favorite, tab, toolbar)    | Platform symbols (`expo-symbols`)                                  |

Do not use emoji as interface icons. Do not invent a second illustration style.

### App icon

The app icon uses one trail pin mark. The pin combines a location marker, a winding path, and a discovery spark.

- Use forest green for the pin.
- Use warm cream for the path and default background.
- Use soft mustard for the discovery spark.
- Keep the silhouette clear at small sizes.
- Keep the material matte. Do not add glossy glass or chrome effects.

The editable iOS source is [`assets/expo.icon`](./assets/expo.icon). It contains two Icon Composer groups.
The first group contains the trail and spark. The second group contains the clay pin and shadow.

The cross-platform vector sources are in [`assets/app-icon`](./assets/app-icon). Android uses separate foreground, background, and monochrome images.
The initial generated concept is stored at [`docs/design/references/explora-app-icon-concept.png`](./docs/design/references/explora-app-icon-concept.png).

### How to generate new assets

1. Read this section and open the style reference board.
2. Generate with GPT Image (Codex `image_gen` / Codex CLI `gpt-image-2`, or the project image tool). Pass the style reference as an input image.
3. Save finals under [`assets/illustrations/`](./assets/illustrations/). Keep the style board at [`docs/design/references/claymorphic-icons-style.jpeg`](./docs/design/references/claymorphic-icons-style.jpeg).
4. Wire assets through `expo-image`. Mark decorative images as hidden from the screen reader when the nearby title already explains the state.

### Shipped illustration set

| File                                                          | Purpose                                                    |
| ------------------------------------------------------------- | ---------------------------------------------------------- |
| `assets/illustrations/style-reference-claymorphic-icons.jpeg` | Canonical Airbnb clay style board for GPT Image generation |
| `docs/design/references/claymorphic-icons-style.jpeg`         | Same board, linked from this contract                      |
| `assets/illustrations/empty-search.png`                       | Explore empty search / filter result                       |
| `assets/illustrations/empty-favorites.png`                    | Favorites empty collection                                 |
| `assets/illustrations/category-outdoors.png`                  | Outdoors category cue                                      |
| `assets/illustrations/category-culture.png`                   | Culture category cue                                       |
| `assets/illustrations/category-workshops.png`                 | Workshops category cue                                     |
| `assets/illustrations/category-leisure.png`                   | Leisure category cue                                       |
| `assets/illustrations/chip-all.png`                           | Compact All filter cue                                     |
| `assets/illustrations/chip-outdoors.png`                      | Compact Outdoors filter cue                                |
| `assets/illustrations/chip-culture.png`                       | Compact Culture filter cue                                 |
| `assets/illustrations/chip-workshops.png`                     | Compact Workshops filter cue                               |
| `assets/illustrations/chip-leisure.png`                       | Compact Leisure filter cue                                 |

## Component kit

| Component                  | Purpose                                        | Anatomy                                              | States                                               | Limits and rejected use                                                                                                                   |
| -------------------------- | ---------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `ScreenFrame`              | Define the safe screen region                  | Screen announcement and content region               | Light, dark, focused return                          | Use on every screen                                                                                                                       |
| `SearchField`              | Explore title search                           | Symbol, centered single-line input, clear action     | Idle, focused, typed, disabled                       | Use in the iOS and web Explore header. Android uses `Stack.SearchBar`                                                                     |
| `CategoryChip`             | One category filter control                    | Clay icon, label, and glass material                 | Default, pressed, lightly tinted selected, focused   | `A11yPressable` required for labels and selected state                                                                                    |
| `CategoryChipRow`          | Category filter row                            | All plus catalog categories and edge fades           | All, multiple selected, start, middle, end           | All is exclusive; category selections combine with OR                                                                                     |
| `ActivityCategoryBadge`    | Identify a detail category                     | Clay icon, label, and filter-chip material           | Light, dark, glass, solid fallback                   | Static text; do not expose button semantics                                                                                               |
| `ActivityCard`             | Open an activity                               | Photo, image-derived body, title, metadata, favorite | Default, pressed, focused, unfocused, saved, offline | Do not nest another card or put Liquid Glass on its surface                                                                               |
| `FavoriteButton`           | Save or remove an activity                     | Heart symbol and 44-point target                     | Unsaved, saved, pressed, focused                     | Give it one clear spoken action                                                                                                           |
| `PrimaryButton`            | Commit the main action                         | Label and optional leading symbol                    | Default, pressed, focused, busy, disabled            | Use one primary action per screen                                                                                                         |
| `IconButton`               | Run a compact action                           | System symbol and 44-point target                    | Default, pressed, focused, disabled                  | Use glass only above imagery or scrolling                                                                                                 |
| `NativeTabs` (Expo Router) | Move between Explore, Favorites, and Dev Tools | System tab bar                                       | Light, dark, minimize on scroll                      | Use `expo-router/native-tabs`                                                                                                             |
| `InlineStatusBanner`       | Explain an actionable failure                  | Tonal panel, compact symbol, title, body, and retry  | Error, pressed, focused                              | Keep it flat, with no border. Use it when the failure blocks the current action, for example a calendar error. Never pair it with a toast |
| `ActivityCardSkeleton`     | Reserve the activity card shape                | Full cover, favorite target, and lower copy blocks   | Loading pulse, reduced motion                        | Match the full-image card. Do not use a full-screen spinner                                                                               |
| `EmptyState`               | Explain a resolved empty result                | Illustration, title, body, and action                | Search empty, favorites empty, not-found             | Give one next action. Enters with a short fade and rise                                                                                   |
| `RecoveryState`            | Explain an important failure                   | Cause symbol, title, body, and one retry action      | Offline, timeout, invalid data, unknown              | The symbol names the cause. Enters with a short fade and rise                                                                             |
| `ActivityFactList`         | Show activity facts on Activity Detail         | Grouped surface, symbol tile, value, and label       | Light, dark, large text                              | One spoken label per row. Not focusable with a hardware keyboard                                                                          |
| `DetailCompactBar`         | Keep the title visible after the hero scrolls  | Solid background, hairline, and one-line title       | Hidden at rest, visible after the hero leaves        | Decorative copy of the title. Hidden from the screen reader                                                                               |
| `FavoritesSummary`         | State the favorite count and offline access    | Offline symbol and one caption line                  | Shown only when favorites exist                      | Use a Lingui plural for the count                                                                                                         |
| `DevTools`                 | Reproduce assessment states                    | Grouped settings, feedback previews, and reset       | Normal, slow, offline, timeout, invalid, not-found   | Keep device offline testing separate                                                                                                      |

Use `A11yPressable`, `A11yInput`, and `A11yCard` inside these components. Use SF Symbols on iOS and Material Symbols on Android.

## Screen composition rules

### Explore

- Put one display title at the top.
- Keep search and category filters in the Explore header.
- Use one vertical activity list.
- Use a focused, snapping card carousel on native devices.
- Keep adjacent cards visible as navigation cues.
- Use the standard list for reduced motion and large text.
- Keep the favorite action visible on every activity card.
- Keep category text in the metadata row. Do not add a second category pill inside the card.
- Keep content visible while a refresh is in progress.
- Use a white compact header title with a dark shadow when content scrolls below it.

- Put category filters below the search field.
- Allow multiple categories. Treat All as an exclusive reset.

### Activity detail

- Push the detail screen from Explore or Favorites.
- Use one edge-to-edge square hero image when an image exists. Cap it at 440 points.
- Stretch the hero when the user pulls down. Keep its top edge on the screen top and its bottom edge still.
- Do not add parallax. The copy must not slide over the blended hero edge.
- Fade in the solid compact bar with the activity title after the hero leaves the screen.
- Crossfade the lower hero from the sharp image into a blurred copy.
- Fade the blurred copy into the screen background. Do not leave a hard seam.
- Put glass controls above the hero image on supported iOS devices.
- Show an illustrated category badge, title, description, location, and duration in that order.
- Show location and duration as grouped fact rows. Each row has a symbol tile, a value, and a label.
- Show Add to Calendar as one row with a symbol tile, a title, and a supporting line. Align its tile with the fact tiles. Do not add a chevron, because the action starts a task.
- Keep one primary save action.
- Preserve the previous search, filter, and scroll position on back.

### Favorites

- Use the same activity card component as Explore.
- Use the same focused card carousel and collapsing header behavior as Explore.
- Keep Favorites focused on the personal collection.
- Do not show search or category filters.
- Do not show discovery refresh or pagination controls.
- Show a composed empty state when no favorites exist.
- Show the favorite count and offline access below the title when favorites exist.
- Center the empty-state composition and use artwork with a transparent background.
- Do not add folders, sorting, or collection management.

### Data states

- Loading uses card-shaped skeletons.
- Empty search keeps the current query and filters visible.
- Not-found explains that the activity link is invalid or unavailable.
- Refresh failure keeps stale content visible.
- Temporary failures use one native error toast when content stays usable.
- Important failures use one inline recovery surface with one clear action.
- The recovery symbol names the cause: no connection, timeout, invalid data, or a neutral alert.
- Every retry action reads "Try again".
- Keep inline recovery compact. Use a danger tint and a direct accent retry action when the failure blocks the current action.
- A next-page failure does not block anything, so it uses no alarm color. End the list with a compact footer directly below the last card. Put a neutral cause symbol, the title, and a tonal "Try again" pill in one row. Put the cause text below. Keep it short enough to fit fully between the last card and the tab bar, and move it with the cards when the header collapses.
- Do not style inline recovery as an elevated alert card.
- Routine success and cancellation stay silent.
- A confirmed calendar save is the only success toast.

## Dev Tools

The assessment requires reproducible success, slow, and failure states. Provide an obvious control surface in the assessment app.

- Add a **Dev Tools** native tab with a tools icon.
- Use an iOS-style grouped settings screen.
- Include first catalog modes for Normal, Slow, Empty, Offline, Timeout, and Invalid data.
- Include the same activity detail modes and Not found.
- Include the same later-page modes.
- Include refresh modes for Success, Slow, Offline, and Timeout.
- Include previews for transient error, actionable error, and calendar success feedback.
- Show the current catalog and favorite counts.
- Clear request cache automatically when a mode changes.
- Keep a manual request-cache action for repeated checks.
- Include a request-mode reset action.
- Include `Reset local data` as a destructive action with confirmation.
- Keep actual device offline testing separate from simulated request modes.
- Keep selected modes in memory until the app restarts or the reviewer resets them.

Changing a mode does not silently reset favorites or generated activities.

## Motion and feedback

- Use native navigation transitions.
- Show press feedback on touch-down.
- Use `0.97` scale for buttons and image cards. Use a highlight for list rows.
- Keep frequent feedback between 100 and 150 milliseconds.
- Use a strong ease-out for timed entrances. Keep them below 300 milliseconds.
- Empty and recovery states enter over 260 milliseconds: fade, 8-point rise, and scale from 0.98. Reduced motion keeps only the fade.
- Use critically damped springs for direct manipulation.
- Add haptics only for save, remove, refresh outcomes, errors, and a new settled Explore card.
- Keep the Android Snackbar surface neutral. Use a leading semantic symbol and tint for each outcome.
- Keep the outcome in the snackbar text. Do not use symbol tint as the only meaning.
- Dissolve a card into sampled particles when the user removes it from Favorites.
- Keep visible dust near 1.1 seconds. Reflow the list over 800 milliseconds.
- Animate the list to the replacement card. Do not use an instant offset correction.
- Keep the replacement card selected throughout the list handoff.
- Run the reflow transition only after a removal starts. Place cards at once on first display, on a return to the tab, and after a text size change.
- Use one batched Skia canvas. Do not create one React Native view for each particle.
- Use `react-native-pulsar` only. Route system outcomes through `@/haptics/feedback`.
- Use the realtime composer only for documented custom feedback. Do not use `expo-haptics`.
- Replace spatial motion with a short cross-fade when reduced motion is active.

Do not animate recycled list rows on entry. Do not move content only for decoration.

## Accessibility and localization

- Support VoiceOver, TalkBack, keyboard navigation, and large text.
- Keep spoken order equal to the visual task order.
- Do not put important text inside photography.
- Use semantic colors. Do not rely on color alone.
- Let labels grow. Do not clip primary actions at large text sizes.
- Cap the expanded display title at 1.5 times the base size, like native large titles. Keep one-word titles on one line. The title still scales.
- Route every user-facing string through Lingui.
- Mirror directional layout for RTL. Keep non-directional symbols unchanged.

## Design budgets

- Use one accent hue.
- Use one primary action per screen.
- Use one display title per screen.
- Use no more than one floating toolbar.
- Use no more than one glass layer in the same visual region.
- Use no nested cards.
- Use no decorative gradients. A short sharp-to-blur fade is allowed for card text contrast.
- Use no emoji as interface icons.

## Required design process

1. Read this file and the relevant wiki page.
2. Study relevant Appllama screens before you invent a new pattern.
3. Load the required Emil, Apple, and Expo skills from `AGENTS.md`.
4. Build with tokens from `src/theme.ts`.
5. Verify light mode, dark mode, and reduced transparency.
6. Verify loading, empty, not-found, error, and content states.
7. Verify large text, keyboard use, and screen-reader access.
8. Record the full journey and inspect motion frame by frame.

## Missing references

- The concept boards do not show dark mode.
- The concept boards do not show Liquid Glass.
- The concept boards do not show the Dev Tools assessment screen.

Treat these as missing visual references. Follow this contract until verified runtime captures replace them.
