import pool from "../index.js";
import { DbUser, CreateUserRequest } from "../../types/user.js";

// transform database row (snake_case) to typescript interface (camelCase)
function transformDbRowToUser(row: any): DbUser {
  return {
    id: row.id,
    firebaseUid: row.firebase_uid,
    email: row.email,
    displayName: row.display_name,
    photoUrl: row.photo_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastLogin: row.last_login,
  };
}

export async function findByFirebaseUid(
  firebase_uid: string
): Promise<DbUser | null> {
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE firebase_uid = $1",
    [firebase_uid]
  );
  return rows[0] ? transformDbRowToUser(rows[0]) : null;
}

export async function createUser(data: CreateUserRequest): Promise<DbUser> {
  const { firebaseUid, email, displayName, photoUrl } = data;
  const { rows } = await pool.query(
    `INSERT INTO users (firebase_uid, email, display_name, photo_url, last_login)
     VALUES ($1, $2, $3, $4, now()) RETURNING *;`,
    [firebaseUid, email, displayName || null, photoUrl || null]
  );
  return transformDbRowToUser(rows[0]);
}

export async function updateLastLogin(id: string): Promise<DbUser> {
  const { rows } = await pool.query(
    `UPDATE users SET last_login = now(), updated_at = now() WHERE id = $1 RETURNING *;`,
    [id]
  );
  return transformDbRowToUser(rows[0]);
}
