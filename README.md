<div align="center">

<img src="public/wishswipe-logo.png" alt="WishSwipe logo" width="96" />

### WishSwipe

WishSwipe is a swipe-first discovery app for eBay finds. Search once, move through listings quickly, and save the good ones into organized wishlists.

</div>

## Overview

WishSwipe turns eBay browsing into a fast, card-based workflow: swipe right to save an item, swipe left to dismiss it, and keep exploring without repeatedly seeing the same listings. The app was migrated from a separate React/Vite client and Express API into a single Next.js App Router application with authenticated routes, server-side eBay calls, Drizzle/Postgres persistence, and Redis-backed API caching.

### Features

- **Swipe discovery**: card-based eBay browsing with left/right item decisions
- **Smart search sessions**: search/filter combinations are hashed so pagination can resume where a user left off
- **Seen-item filtering**: interactions are stored in a 14-day rolling history to reduce duplicate listings
- **Wishlists**: create, edit, reorder, and save items into a default favorites list or custom lists
- **User preferences**: default search term, condition, category, and price range settings
- **Insights**: charts for swipe counts, prices, categories, search terms, and wishlist conditions
- **Status maintenance**: authenticated maintenance endpoints refresh stale wishlist item availability
- **Interaction batching**: swipe decisions are batched before being written to the API
- **Theme support**: light and dark modes with a shared app shell
- **Google auth**: Better Auth handles sessions and creates a default wishlist for each new user

### Tech Stack

- **UI**: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, shadcn/Radix UI, Lucide, Framer Motion, Recharts
- **Data**: Drizzle ORM, PostgreSQL, Zod validation
- **Auth**: Better Auth with Google OAuth
- **Caching**: Upstash Redis for eBay token and search-result caching
- **Integrations**: eBay Browse API, Vercel Analytics
- **Infra**: Vercel, pnpm

### App Routes

- `/login`: Google OAuth sign-in
- `/swipe`: swipe-based item discovery
- `/wishlists`: wishlist and saved item management
- `/insights`: swipe and wishlist analytics
- `/settings`: default search and filter preferences
- `/feedback`: GitHub issue CTA

### API Routes

- `GET /api/explore`: fetch eBay listings for the current search session
- `POST /api/interactions/batch`: record swipe decisions and save right-swiped items
- `GET /api/wishlists`: read wishlists for the current user
- `GET /api/wishlists/options`: read lightweight wishlist options for selectors
- `POST /api/maintenance/refresh`: refresh stale wishlist item availability
- `POST /api/maintenance/reset-sessions`: reset old search sessions for the current user
- `/api/auth/[...all]`: Better Auth route handler

### Local Development

Prerequisites:

- Node.js 22+
- pnpm 10+
- PostgreSQL
- Upstash Redis
- Google OAuth credentials
- eBay developer credentials

Copy the environment template and fill in the required values:

```sh
cp .env.example .env
```

Generate a Better Auth secret with:

```sh
openssl rand -base64 32
```

Install dependencies, run migrations, and start the app:

```sh
pnpm install
pnpm db:migrate
pnpm dev
```

The app runs at `http://localhost:3000`.

### Environment

Required variables:

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `EBAY_BASE_URL`
- `EBAY_CLIENT_ID`
- `EBAY_CLIENT_SECRET`

Maintenance tuning:

- `WISHLIST_STALE_HOURS`: how old a wishlist item can be before refresh, default `24`
- `WISHLIST_REFRESH_LIMIT`: maximum wishlist items refreshed per maintenance call, default `60`

### Project Structure

The old `client/` and `server/` apps now live together in the Next.js project:

```txt
src/app          App Router pages, layouts, route handlers, and server actions
src/components   Shared UI, app shell, listings, wishlists, insights, and form components
src/constants    Search categories and condition options
src/db           Drizzle client and PostgreSQL schema
src/hooks        Client-side auth, theme, mobile, and navigation hooks
src/lib          Auth clients, cache helpers, IDs, image utilities, and shared helpers
src/server       Server-only business logic for eBay, auth, history, sessions, and wishlists
src/services     Browser-side service helpers that call the app API
src/types        Shared TypeScript types for listings, eBay, analytics, themes, and wishlists
drizzle          Generated database migrations
public           Logo and favicon assets
```

### Scripts

- `pnpm dev`: start the Next.js dev server
- `pnpm build`: create a production build
- `pnpm start`: run the production server
- `pnpm lint`: lint the repo
- `pnpm typecheck`: run TypeScript without emitting files
- `pnpm db:generate`: generate Drizzle migrations
- `pnpm db:migrate`: apply Drizzle migrations

### Migration Notes

- The former Vite client and Express server have been consolidated into one Next.js app.
- Firebase auth was replaced with Better Auth and Google OAuth.
- Express routes were replaced with Next.js route handlers under `src/app/api`.
- Server-side business logic now lives in `src/server`, while browser API callers live in `src/services`.
- The current schema starts fresh with Drizzle-managed PostgreSQL tables for auth, wishlists, search sessions, preferences, and interaction history.

### Dark Mode

<img width="1322" height="961" alt="WishSwipe dark mode screenshot" src="https://github.com/user-attachments/assets/eb556be7-86b6-4c2a-8078-410bf1cdb96a" />

### Light Mode

<img width="1237" height="958" alt="WishSwipe light mode screenshot" src="https://github.com/user-attachments/assets/f6ac8247-9944-4832-a461-e59d66db5a0b" />
