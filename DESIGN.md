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

- Use iPhone 17 Pro as the primary design viewport: 393 × 852 points.
- Support Android phones with the same hierarchy and semantic tokens.
- Respect safe areas, the Dynamic Island, and the home indicator.
- Keep every interactive target at least 44 × 44 points.
- Test layouts with large text. Do not fix important content to a single height.

## Theme tokens

The implementation source is [`src/theme.ts`](./src/theme.ts). Keep this file and the TypeScript tokens synchronized.

### Colors

Use one forest-green accent. Use warm neutrals in both themes.

| Role              | Light     | Dark      | Use                                     |
| ----------------- | --------- | --------- | --------------------------------------- |
| Background        | `#F7F4EC` | `#101411` | Main screen background                  |
| Surface           | `#FFFDF8` | `#171C18` | Cards, inputs, and grouped content      |
| Secondary surface | `#EEEAE1` | `#202620` | Selected regions and quiet controls     |
| Elevated surface  | `#FFFFFF` | `#262D27` | Floating non-glass surfaces             |
| Primary text      | `#1C211D` | `#F5F2EA` | Titles and body text                    |
| Secondary text    | `#616860` | `#B8BDB6` | Supporting and metadata text            |
| Border            | `#D9D7CE` | `#343C35` | Input and card boundaries               |
| Accent            | `#2F6D50` | `#70B58D` | Primary action, active state, and focus |
| Accent pressed    | `#245940` | `#5B9D77` | Press feedback                          |
| On accent         | `#FFFFFF` | `#07140C` | Content on the accent                   |
| Warning           | `#9A650A` | `#E7B760` | Non-blocking warning                    |
| Danger            | `#B23B32` | `#F18A80` | Error and destructive action            |
| Danger surface    | `#FCECEA` | `#3A211F` | Inline error background                 |
| Skeleton          | `#DEDAD0` | `#2A312B` | Loading placeholders                    |

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

Use native `GlassView` only when both Liquid Glass availability checks succeed. This requires iOS 26 or later.

Use Liquid Glass for:

- The floating bottom tab bar via Expo Router **NativeTabs** (system Liquid Glass on iOS 26+).
- Hero-image back, share, and favorite controls.
- The compact Review Controls launcher.
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

| Use                                                       | Prefer                                        |
| --------------------------------------------------------- | --------------------------------------------- |
| Empty, not-found, and friendly status illustrations       | Claymorphic PNG under `assets/illustrations/` |
| Category media placeholders when the dataset has no photo | Matching category clay icon                   |
| Compact chrome (search, clear, favorite, tab, toolbar)    | Platform symbols (`expo-symbols`)             |

Do not use emoji as interface icons. Do not invent a second illustration style.

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
| `assets/illustrations/category-outdoors.png`                  | Outdoors category cue                                      |
| `assets/illustrations/category-culture.png`                   | Culture category cue                                       |
| `assets/illustrations/category-workshops.png`                 | Workshops category cue                                     |
| `assets/illustrations/category-leisure.png`                   | Leisure category cue                                       |

## Component kit

| Component                  | Purpose                         | Anatomy                                      | States                                    | Limits and rejected use                                                                      |
| -------------------------- | ------------------------------- | -------------------------------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------- |
| `ScreenFrame`              | Define the safe screen region   | Screen announcement and content region       | Light, dark, focused return               | Use on every screen                                                                          |
| `SearchField`              | Search activity titles          | Search symbol, input, and clear action       | Idle, focused, typed, disabled            | Do not place inside a card                                                                   |
| `CategoryChip`             | One category filter control     | Text label and selected fill                 | Default, pressed, selected, focused       | Prefer inside `CategoryChipRow`                                                              |
| `CategoryChipRow`          | Category filter row             | All plus catalog categories                  | Default                                   | Owns selection wiring; uses `CategoryChip`                                                   |
| `ActivityCard`             | Open an activity                | Photo, title, location, duration, favorite   | Default, pressed, focused, saved, offline | Do not nest another card                                                                     |
| `FavoriteButton`           | Save or remove an activity      | Heart symbol and 44-point target             | Unsaved, saved, pressed, focused          | Give it one clear spoken action                                                              |
| `PrimaryButton`            | Commit the main action          | Label and optional leading symbol            | Default, pressed, focused, busy, disabled | Use one primary action per screen                                                            |
| `IconButton`               | Run a compact action            | System symbol and 44-point target            | Default, pressed, focused, disabled       | Use glass only above imagery or scrolling                                                    |
| `NativeTabs` (Expo Router) | Move between Explore and Saved  | System tab bar (Liquid Glass on iOS 26+)     | Light, dark, minimize on scroll           | Use `expo-router/unstable-native-tabs`. Do not add a custom glass tab bar or a center action |
| `InlineStatusBanner`       | Explain refresh status          | Status symbol, title, body, and retry action | Success, warning, error                   | Keep stale content visible below it                                                          |
| `ActivityCardSkeleton`     | Reserve the activity card shape | Image block and three text blocks            | Loading pulse, reduced motion             | Do not use a full-screen spinner                                                             |
| `EmptyState`               | Explain a resolved empty result | Illustration, title, body, and action        | Search empty, favorites empty, not-found  | Give one next action                                                                         |
| `ReviewControlsSheet`      | Reproduce assessment states     | Mode groups, status summary, and reset       | Normal, slow, fail, offline, busy         | Include only in review builds                                                                |

Use `A11yPressable`, `A11yInput`, and `A11yCard` inside these components. Use SF Symbols on iOS and Material Symbols on Android.

## Screen composition rules

### Explore

- Put one display title at the top.
- Keep search before filters.
- Allow five category chips because this row is a selector.
- Use one vertical activity list.
- Keep the favorite action visible on every activity card.
- Keep content visible while a refresh is in progress.

### Activity detail

- Push the detail screen from Explore or Saved.
- Use one edge-to-edge hero image when an image exists.
- Put glass controls above the hero image on supported iOS devices.
- Show category, title, description, location, and duration in that order.
- Keep one primary save action.
- Preserve the previous search, filter, and scroll position on back.

### Saved

- Use the same activity card component as Explore.
- State that saved details are available offline.
- Show a composed empty state when no favorites exist.
- Do not add folders, sorting, or collection management.

### Data states

- Loading uses card-shaped skeletons.
- Empty search keeps the current query and filters visible.
- Not-found explains that the activity link is invalid or unavailable.
- Refresh failure keeps stale content visible.
- Every recovery state has one clear next action.

## Review Controls

The assessment requires reproducible success, slow, and failure states. Provide an obvious control surface in review builds.

- Add a sliders icon to the Explore navigation bar.
- Give it the spoken label `Open review controls`.
- Open `ReviewControlsSheet` as a native form sheet.
- Include **Initial load:** Normal, Slow, Fail.
- Include **Refresh:** Success, Slow, Fail.
- Show the current catalog count.
- Include `Reset local data` as a destructive action with confirmation.
- Keep actual device offline testing separate from simulated request modes.
- Persist the chosen mode only when this helps a reviewer repeat a scenario.
- Exclude the launcher and sheet from store builds.

Changing a mode does not silently reset favorites or generated activities.

## Motion and feedback

- Use native navigation transitions.
- Show press feedback on touch-down.
- Use `0.97` scale for buttons and image cards. Use a highlight for list rows.
- Keep frequent feedback between 100 and 150 milliseconds.
- Use a strong ease-out for timed entrances. Keep them below 300 milliseconds.
- Use critically damped springs for direct manipulation.
- Add haptics only for save, remove, successful refresh, and error outcomes.
- Replace spatial motion with a short cross-fade when reduced motion is active.

Do not animate recycled list rows on entry. Do not move content only for decoration.

## Accessibility and localization

- Support VoiceOver, TalkBack, keyboard navigation, and large text.
- Keep spoken order equal to the visual task order.
- Do not put important text inside photography.
- Use semantic colors. Do not rely on color alone.
- Let labels grow. Do not clip primary actions at large text sizes.
- Route every user-facing string through Lingui.
- Mirror directional layout for RTL. Keep non-directional symbols unchanged.

## Design budgets

- Use one accent hue.
- Use one primary action per screen.
- Use one display title per screen.
- Use no more than one floating toolbar.
- Use no more than one glass layer in the same visual region.
- Use no nested cards.
- Use no decorative gradients.
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
- The concept boards do not show `ReviewControlsSheet`.

Treat these as missing visual references. Follow this contract until verified runtime captures replace them.
