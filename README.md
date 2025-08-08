# 🛍️WishSwipe🛍️

**Overview:**  
**WishSwipe** is a swipe-based web application that integrates with **eBay listings** to provide a playful, intuitive way to discover and save items. It mimics a dating-app style interface: swipe right to save to a wishlist, swipe left to dismiss.

### Features

- **swipe-first discovery**: fast, card-based browsing of ebay items
- **wishlists**: create, edit, reorder, move items between lists
- **status awareness**: background job checks item availability (e.g., Not Found, Listing Ended, Out of Stock, Limited Stock, In Stock, Unknown Status) and surfaces a status badge in the ui
- **insights**: basic analytics on swipes, prices, categories, conditions
- **auth**: firebase-based authentication, protected server routes

### Tech stack

- **client**: react 19, vite 6, typescript, tailwind css 4, radix ui, recharts, framer-motion, lucide
- **server**: node.js, express 5, typescript, postgresql (pg), redis (ioredis), bullmq, winston, node-pg-migrate
- **integrations**: ebay browse api, firebase admin

### Monorepo

- **client** (frontend app): `client/` → see [client/README.md](client/README.md)
- **server** (api + jobs): `server/` → see [server/README.md](server/README.md)

### Getting started (quick)

- **prereqs**: node 20+, postgresql 14+, redis 6+
- **server**: configure `server/.env` (db, redis, firebase, ebay) and run `npm run dev`
- **client**: run `npm run dev` (proxies api to `http://localhost:3000`)

For detailed setup, scripts, and environment variables, see the subproject READMEs:

- frontend: [client/README.md](client/README.md)
- backend: [server/README.md](server/README.md)

### Troubleshooting

- **import casing**: paths must match file names exactly (e.g., `actionToolbar` not `ActionToolbar`)
- **auth popup blocked**: prefer redirect auth flow or set `Cross-Origin-Opener-Policy: same-origin-allow-popups` on auth routes
- **background jobs**: in prod, expired-item checks are scheduled daily; in dev, an immediate run is enqueued on startup
