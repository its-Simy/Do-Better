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
