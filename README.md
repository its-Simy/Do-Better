# Do Better

A calm, friendly self-improvement companion that unites **todos, goals, habits, and
sleep** into one encouraging place. This is a production Vite + React implementation of
the [Do Better Design System](https://claude.ai/design/p/9d36069f-7065-49df-af2f-82ecfa7c0421).

## Run

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build into dist/
npm run preview  # preview the production build
```

Open the dev URL Vite prints (default http://localhost:5173).

## Layout

```
src/
  app/                  app entry, App component, route registry
  layout/               reusable app chrome: sidebar shell + topbar
  components/           shared frontend primitives + barrel index.js
    ui/                 Button, Card, Badge, forms, progress, habit row, etc.
    icons/              Lucide icon set (inlined paths) → <Icon name="…" />
  pages/                route-level product features
    Lists/              list page, list/task components, mock data, reorder utils
    Goals/              goals page + CSS
    Sleep/              sleep page + CSS
    Insights/           insights page + CSS
  styles/               global style entry + CSS token files
    tokens/             colors, typography, spacing, effects, fonts, base
assets/
  logos/                logo SVGs (mark + wordmarks)
```

Import components from the barrel:

```js
import { Button, Card, Icon } from '../components';
```

## Theming

`App` wraps everything in an element carrying `data-theme` (`light` | `dark`) and
`data-hover-highlight="on"`. Dark mode remains user-toggleable from the sidebar;
the signature hover glow is always enabled.

## Screen CSS

Each routed page imports its own CSS file from its `src/pages/*/` folder. Stable
layout, spacing, and typography belong in those files. Inline styles should be
reserved for values that are data-driven at render time, such as dynamic chart
heights, progress colors, and per-list accent colors.

## Notes

This is a faithful, click-through implementation. List and task reordering are wired
locally in React state; persistence and the AI model are not yet wired to a backend.
