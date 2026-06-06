# WishSwipe

WishSwipe is a swipe-first Next.js app for discovering eBay listings and saving the good ones into wishlists.

## Stack

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS 4, shadcn/Radix UI, Recharts, Framer Motion
- Better Auth with Google OAuth
- Drizzle ORM and PostgreSQL
- Upstash Redis for eBay token/result caching
- eBay Browse API

## Routes

- `/login` - Google OAuth sign-in
- `/swipe` - swipe-based item discovery
- `/wishlists` - manage wishlists and saved items
- `/insights` - swipe and wishlist analytics
- `/settings` - default search/filter preferences
- `/feedback` - GitHub issue CTA

## Environment

Copy `.env.example` to `.env` and fill in the values:

```sh
cp .env.example .env
```

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

Generate a Better Auth secret with:

```sh
openssl rand -base64 32
```

## Development

```sh
pnpm install
pnpm db:migrate
pnpm dev
```

The app runs at `http://localhost:3000`.

## Scripts

- `pnpm dev` - start the Next dev server
- `pnpm build` - production build
- `pnpm start` - run the production server
- `pnpm lint` - lint the repo
- `pnpm typecheck` - TypeScript check
- `pnpm db:generate` - generate Drizzle migrations
- `pnpm db:migrate` - apply Drizzle migrations

## Notes

- This migration intentionally starts from a fresh database schema.
- Firebase, Express, Vite, and node-pg-migrate have been removed.
- Better Auth creates users via Google OAuth and the app creates a default favorite wishlist for each new user.
- Search sessions and item history preserve the previous behavior: recently seen items are filtered for 14 days, and eBay pagination resumes per search/filter combination.
