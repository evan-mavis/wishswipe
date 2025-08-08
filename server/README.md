# wishswipe server

node.js + express + typescript api for wishswipe.

## requirements

- node 20+
- postgresql 14+
- redis 6+

## setup

```sh
cd server
npm install
```

create a `.env` in `server/` (examples):

```
PORT=3000
DATABASE_URL=postgres://user:pass@localhost:5432/wishswipe
REDIS_URL=redis://localhost:6379

# firebase admin
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# ebay api
EBAY_BASE_URL=https://api.ebay.com
EBAY_CLIENT_ID=...
EBAY_CLIENT_SECRET=...
```

## development

```sh
npm run dev
```

starts express with nodemon on `http://localhost:${PORT:-3000}`.

## build & start (production)

```sh
npm run build
npm run start
```

## project structure

```
src/
  controllers/       # request handlers for routes
  services/          # business logic and external api calls
  db/
    repositories/    # data access layer
    migrations/      # database schema changes
  routes/            # express route definitions
  middleware/        # auth and other middleware
  types/             # shared typescript interfaces
  utils/             # logger, redis client, utilities
  config/            # firebase and other configurations
```

## scripts

- `dev`: start server with nodemon
- `build`: compile typescript to `dist/`
- `start`: run compiled server
- `migrate:create`: create a new migration
- `migrate:up`: run pending migrations
- `migrate:down`: revert last migration

## database migrations

powered by [node-pg-migrate]. files live in `src/db/migrations/`.

```sh
npm run migrate:create name=add_table
npm run migrate:up
npm run migrate:down
```

## routes

- `GET /` health check `{ status: "ok" }`
- public auth routes under `/login`
- authenticated app routes under `/wishswipe/**` (protected by firebase auth middleware)

## background jobs

using bullmq + redis.

- `search-session-reset`: hourly at minute 0
- `expired-items-check`:
  - production: scheduled daily at 02:00 with a repeatable job
  - development: an immediate one-off is enqueued on startup

## debugging

- use vscode `Debug Server` launch or run `npm run dev` and attach manually.
- logs are emitted via winston (see `src/utils/logger.ts`).

## troubleshooting

- db/redis connection issues: verify `DATABASE_URL` and `REDIS_URL`.
- ebay api errors: ensure `EBAY_CLIENT_ID/SECRET` and `EBAY_BASE_URL`.
- auth failures: validate firebase admin creds in `.env`.
