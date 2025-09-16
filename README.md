# 🛍️WishSwipe🛍️

**Overview:**  
**WishSwipe** is a swipe-based web application that integrates with **eBay listings** to provide a playful, intuitive way to discover and save items. It mimics a dating-app style interface: swipe right to save to a wishlist, swipe left to dismiss.

### Features

- **swipe-first discovery**: fast, card-based browsing of ebay items
- **smart search sessions**: prevents duplicate items using hash-based session tracking and user interaction history
- **wishlists**: create, edit, reorder, move items between lists
- **user preferences**: set default search terms, item condition, category, and price range for personalized browsing
- **status awareness**: user-triggered maintenance updates item availability (e.g., Not Found, Listing Ended, Out of Stock, Limited Stock, In Stock, Unknown Status) and surfaces a status badge in the ui
- **insights**: basic analytics on swipes, prices, categories, conditions
- **auth**: firebase-based authentication, protected server routes

### Tech stack

- **client**: react 19, vite 6, typescript, tailwind css 4, shadcn, radix ui, recharts, framer-motion, lucide
- **server**: node.js, express 5, typescript, postgresql (pg), redis (ioredis), winston, node-pg-migrate
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

### Smart Search Sessions

**WishSwipe** ensures users never (hopefully lol) see the same items twice through a session management system:

**How it works:**

1. **unique session creation**: each search combination (query, condition, category, price range) generates a SHA-256 hash that identifies a unique session
2. **pagination tracking**: sessions maintain current page number and total items seen, automatically advancing through eBay's paginated results
3. **interaction filtering**: all user interactions (swipes, saves) are stored in a 14-day rolling history that filters out previously seen items
4. **intelligent pagination**: when background fetches return few unseen items (<10), the system automatically advances pages to find fresh content
5. **session persistence**: sessions persist across app visits, picking up where users left off in their search journey

**Background maintenance:**

- **maintenance endpoints**: the client triggers debounced, authenticated calls to keep data fresh while allowing the API to sleep when idle:
  - `POST /wishswipe/maintenance/refresh`: incrementally refreshes a bounded set of stale wishlist items for the current user (defaults via `WISHLIST_STALE_HOURS`, `WISHLIST_REFRESH_LIMIT`)
  - `POST /wishswipe/maintenance/reset-sessions`: resets old search sessions for the current user (triggered on login and explore entry)
- **14-day interaction window**: user interaction history only blocks items seen in the last 14 days, allowing items to reappear after sufficient time

This approach balances content freshness with computational efficiency, providing a seamless (hopefully lol) browsing experience without duplicates.

### Troubleshooting

- **import casing**: paths must match file names exactly (e.g., `actionToolbar` not `ActionToolbar`)
- **auth popup blocked**: prefer redirect auth flow or set `Cross-Origin-Opener-Policy: same-origin-allow-popups` on auth routes
- **maintenance endpoints**: data freshness is maintained via client-triggered calls (see above). To force a refresh manually:
  - `curl -X POST "$API_URL/wishswipe/maintenance/refresh" -H "Authorization: Bearer <token>"`
  - `curl -X POST "$API_URL/wishswipe/maintenance/reset-sessions" -H "Authorization: Bearer <token>"`
