module.exports = {
  migrationFolder: "src/db/migrations",
  direction: "up",
  logFileName: "node-pg-migrate.log",
  databaseUrl: process.env.DATABASE_URL,
};
