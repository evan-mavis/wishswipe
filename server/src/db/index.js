import { Pool } from "pg";
import { DATABASE_URL } from "../config/env.js";

const pool = new Pool({
  connectionString: DATABASE_URL,
});

export default pool;
