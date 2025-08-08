# wishswipe client

react + vite + typescript app for wishswipe.

## requirements

- node 20+
- pnpm or npm

## setup

```sh
cd client
npm install
```

## development

```sh
npm run dev
```

starts vite on `http://localhost:5173` and proxies api to `http://localhost:3000`.

## build

```sh
npm run build
```

outputs production assets to `dist/`.

## preview

```sh
npm run preview
```

serves the built `dist/` locally.

## environment variables

vite reads variables prefixed with `VITE_` from `.env` files. common values:

- `VITE_API_BASE` (optional; axios instance may default to proxy)

## project structure

```
src/
  components/        # ui and feature components
  hooks/             # shared hooks
  pages/             # route-level pages
  services/          # api calls
  types/             # shared types
  lib/               # utilities (debounce, image helpers, etc.)
```

## interaction batching

**WishSwipe** optimizes network efficiency through intelligent batching of user swipe interactions:

**batching strategy:**

- **queue-based**: swipe interactions are collected in an in-memory queue rather than sent immediately
- **dual triggers**: queue flushes when either 10 interactions accumulate OR after 3 seconds of inactivity
- **error recovery**: failed requests automatically re-queue interactions and retry after 10 seconds
- **singleton service**: `userInteractionService` maintains a single queue across the entire app

**flush triggers:**

- **automatic**: every 10 swipes or 3-second timeout
- **navigation**: hook ensures pending interactions flush when switching between pages
- **visibility changes**: page hidden/beforeunload events trigger immediate flush
- **manual**: `forceFlush()` method for explicit saves

**performance benefits:**

- reduces server requests by ~90% compared to individual swipe calls
- maintains responsiveness with 3-second maximum delay
- preserves user data integrity even during network failures or navigation

this approach balances real-time data persistence with efficient network usage.

## scripts

- `dev`: start vite dev server
- `build`: typecheck and bundle
- `preview`: serve built app
- `lint`: run eslint

## debugging

- vs code: use the provided launch to attach to a chrome instance started with remote debugging.
- or start chrome manually:
  ```sh
  /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-debug http://localhost:5173
  ```

## conventions

- comments start with lowercase and are concise.
- use functional, typed react components.
- avoid unused code and props; run `npm run lint` regularly.

## troubleshooting

- casing matters: import paths must match file names (e.g. `actionToolbar` not `ActionToolbar`).
- firebase auth popup blocked by coop: prefer redirect flow or set `Cross-Origin-Opener-Policy: same-origin-allow-popups` on auth routes.
