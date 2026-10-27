import pool from './pool.js';

// --- users ---
export async function getUserByUsername(username) {
  const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [
    username,
  ]);
  return rows[0];
}

export async function getUserById(id) {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0];
}

export async function createUser({
  firstName,
  lastName,
  username,
  hashedPassword,
}) {
  const { rows } = await pool.query(
    `INSERT INTO users (first_name, last_name, username, password)
     VALUES ($1, $2, $3, $4) RETURNING id`,
    [firstName, lastName, username, hashedPassword],
  );
  return rows[0];
}

export async function setMember(userId) {
  await pool.query('UPDATE users SET is_member = TRUE WHERE id = $1', [userId]);
}

export async function setAdmin(userId) {
  // admins are always members too
  await pool.query(
    'UPDATE users SET is_member = TRUE, is_admin = TRUE WHERE id = $1',
    [userId],
  );
}

// --- messages ---
export async function getAllMessages() {
  const { rows } = await pool.query(
    `SELECT m.id, m.title, m.text, m.created_at,
            u.username, u.first_name, u.last_name
     FROM messages m
     JOIN users u ON u.id = m.user_id
     ORDER BY m.created_at DESC`,
  );
  return rows;
}

export async function createMessage({ title, text, userId }) {
  await pool.query(
    'INSERT INTO messages (title, text, user_id) VALUES ($1, $2, $3)',
    [title, text, userId],
  );
}

export async function deleteMessage(id) {
  await pool.query('DELETE FROM messages WHERE id = $1', [id]);
}
