### Folder Structure

/server
│
├── /src
│ ├── /controllers # Request handlers, business logic for each route
│ ├── /routes # Express route definitions
│ ├── /models # Database models (Prisma schema or Sequelize models)
│ ├── /services # Core app logic, external API calls, e.g. eBay API integration
│ ├── /middlewares # Express middleware (auth, logging, error handlers)
│ ├── /utils # Utility/helper functions
│ ├── /config # Configuration (db config, environment vars, etc.)
│ ├── /types # TypeScript type declarations and interfaces
│ ├── app.ts # Express app setup (middlewares, routes)
│ └── server.ts # Entry point to start the server
│
├── /prisma # Prisma-specific files (schema.prisma, migrations)
│
├── /tests # Tests (unit, integration)
│
├── .env # Environment variables
├── tsconfig.json # TypeScript config
├── package.json
└── README.md
