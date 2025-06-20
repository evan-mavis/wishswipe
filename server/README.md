# Debugging the Server (Node.js/Express)

To debug the server API in VS Code:

1. **Open the Run and Debug Panel**

   - In VS Code, go to the Run and Debug panel (left sidebar or `Cmd+Shift+D`).

2. **Start the Debugger**
   - Select `Debug Server` from the configuration dropdown.
   - Click the green play button to start debugging.
   - This will automatically start the server using Nodemon with debugging enabled.

**Full Stack Debugging:**

- You can debug both client and server at the same time by selecting the `Debug Full Stack` configuration in the Run and Debug panel.
- **Important:** Make sure to run the Chrome Debug task first, so the client is configured correctly for debugging.

**Tip:**

- Make sure you have installed all dependencies (`npm install`) in the `server` directory before debugging.

## Database Migrations

This project uses [node-pg-migrate](https://github.com/salsita/node-pg-migrate) for managing PostgreSQL database migrations.

### How to Run Migrations

1. **Ensure your environment variables are set** (especially `DATABASE_URL` in your `.env` file).
2. **Install dependencies** (if you haven't already):
   ```sh
   npm install
   ```
3. **Create a new migration:**
   ```sh
   npm run migrate:create name=your_migration_name
   ```
   This will create a new migration file in `src/db/migrations/`.
4. **Run all pending migrations:**
   ```sh
   npm run migrate:up
   ```
5. **Revert the last migration:**
   ```sh
   npm run migrate:down
   ```

All migration scripts are located in `src/db/migrations/`.
