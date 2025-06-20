import pool from "../index.js";

export async function findByFirebaseUid(firebase_uid: string) {
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE firebase_uid = $1",
    [firebase_uid]
  );
  return rows[0] || null;
}

export async function createUser(data: {
  firebase_uid: string;
  email: string;
  display_name?: string;
  photo_url?: string;
}) {
  const { firebase_uid, email, display_name, photo_url } = data;
  const { rows } = await pool.query(
    `INSERT INTO users (firebase_uid, email, display_name, photo_url, last_login)
     VALUES ($1, $2, $3, $4, now()) RETURNING *;`,
    [firebase_uid, email, display_name || null, photo_url || null]
  );
  return rows[0];
}

export async function updateLastLogin(id: string) {
  const { rows } = await pool.query(
    `UPDATE users SET last_login = now(), updated_at = now() WHERE id = $1 RETURNING *;`,
    [id]
  );
  return rows[0];
}
