# Design Notes

This file records implementation and design decisions for the Do Better app.

## Running The App

The actual Vite app lives in `Do-Better/`, but the workspace root also has a
small `package.json` wrapper. That means either of these work:

```bash
npm run dev
```

from `/Users/simon/Desktop/Projects/do_better`, or:

```bash
npm run dev
```

from `/Users/simon/Desktop/Projects/do_better/Do-Better`.

The root script delegates to the app with:

```bash
npm --prefix Do-Better run dev
```

Vite is also configured to default to:

```text
http://127.0.0.1:5173/
```

This keeps the dev URL predictable and avoids confusion between the workspace
folder and the nested Vite app folder.

## Import Structure

The Claude design-system source was converted from CDN/global loading into ES
module imports. Shared components are exported from `src/components/index.js`,
so screens can import primitives from a single barrel:

```js
import { Button, Card, TaskItem, Icon } from '../components';
```

This keeps screen files focused on layout and behavior instead of long relative
import lists.

## Styling

`src/styles.css` is the app-level style entry point. It imports token files from
`src/tokens/`, where colors, typography, spacing, effects, fonts, and base
styles are kept separate.

`vite.config.js` pins PostCSS to this project with `css: { postcss: {} }`. This
prevents Vite from walking up the directory tree and accidentally picking up an
unrelated PostCSS config from a parent folder.

Screen-level styles live in `src/screens/styles/`, with one CSS file per routed
page:

```text
TasksScreen.css
GoalsScreen.css
SleepScreen.css
InsightsScreen.css
```

Stable page layout, spacing, typography, and local screen elements should move
into those files. Keep inline styles only for values that come from runtime data,
such as chart bar heights, dynamic colors, or per-item accent values.

## Theme State

The app keeps theme state in `src/App.jsx` and applies it through `data-theme`
on the top-level wrapper. Components consume theme values through CSS custom
properties, so dark mode does not require prop-drilling theme values through the
component tree.

Hover glow is a fixed part of the interface, not a user setting. `App` always
sets `data-hover-highlight="on"`, which lets hoverable components use the shared
highlight effect without adding another sidebar preference.

## Shared State: Settings and Lists

Two app-level providers live in `src/state/` and wrap everything inside `App`:

- `SettingsContext` — user preferences, persisted to localStorage under
  `do-better:settings`. Defaults are merged over saved values per section
  (`general` / `lists` / `goals` / `sleep`), so adding a new setting never
  breaks an existing save. `updateSetting(section, key, value)` is the only
  write path; "Reset all settings" restores defaults.
- `ListsContext` — the lists themselves plus every mutation (toggle, collapse,
  reorder, cross-list moves, color, delete, add). Deliberately in-memory:
  reloading restores the demo data. Because lists live at the app level, the
  Lists page, Settings → Your lists, the create flow, and the sidebar badge
  all see the same data, and arrangement survives navigation.

## Settings Page Structure

Settings is split into three sections behind a `Segmented` sub-nav: General
(profile, appearance, time format, week start, notifications, reset), Lists
(behavior toggles + per-list colors), and Goals & Sleep (widget options for
those two pages). Every option is a `SettingRow`: label + one-line description
on the left, control on the right.

## Moving Items Between Lists

Items move between lists interchangeably, three ways: drag a row onto another
list's row, drag it anywhere onto the other list's card (lands at the end), or
pick a destination from the row's ⋯ menu. Rules, implemented in
`moveTaskAcrossLists` (`src/pages/Lists/utils/reorder.js`):

- A parent task always brings its subtasks along.
- A childless task dropped onto a parent or one of its children joins that
  parent; otherwise it arrives top-level. A subtask moved to another list
  therefore becomes a normal item there unless dropped into a sublist.
- Top-level arrivals land *after* the block they were dropped on — never in
  the middle of another parent's children.

"Auto-delete empty lists" (a Lists setting, off by default) removes the source
list when its last item is moved out — that is the only trigger; checking off
items never deletes anything.

## List Colors

Lists store a color id (`sprout` / `honey` / `dusk` / `ember`), resolved
through `LIST_COLORS` (`src/pages/Lists/data/listColors.js`) to `--list-*`
tokens in `colors.css`. The set is fixed across light and dark mode so a list
never changes identity between themes, and it was chosen to pass the
CVD-separation and contrast checks of the dataviz palette validator on both
surfaces (honey-600 rides the dark-mode lightness band's edge; acceptable
because the color always appears beside the list's name). Status colors are
never offered as list colors.

## Chart Variants (Goals & Sleep widgets)

The Goals check-in widget and the Sleep chart render one dataset in the form
chosen in Settings — heatmap / bars / line for goals activity (weekly active
days, 0–7, past year) and bars / line / heatmap for sleep (bars and line show
the current week; the heatmap widens to four weeks). Chart idiom shared by all
variants: one semantic hue per page (`--goal`, `--sleep`) with color-mix
intensity ramps, thin marks, a recessive baseline, dashed goal line, native
hover tooltips on every mark, and a Less→More legend or a plain-text caption
naming the scale. The sleep goal's text label lives in the chart header as a
legend key (dash swatch + "goal Xh"), never floating inside the plot, so no
data point can overlap it for any input; only the dashed line itself sits in
the plotting area. Values and labels always use text tokens, not series colors
(the white on-bar numbers on the sleep bars are the one pre-existing
exception). "Week starts on" (General) reorders day labels in the heatmaps and
weekly charts.
