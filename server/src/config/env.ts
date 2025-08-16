import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// get the directory where this file is located
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// load .env from the server directory
dotenv.config({ path: join(__dirname, "..", "..", ".env") });

// export environment variables
export const DATABASE_URL = process.env.DATABASE_URL;
export const REDIS_URL = process.env.REDIS_URL;
export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || "development";
