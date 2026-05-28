/* ════════════════════════════════════════════════════════════════════
   NgadaLearn — Camada de dados: Neon PostgreSQL via pg
   Substitui o antigo armazenamento em ficheiro JSON
   ════════════════════════════════════════════════════════════════════ */

const { Pool } = require("pg");

/* ── Pool de ligações ────────────────────────────────────────────── */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },   // obrigatório para Neon
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

pool.on("error", (err) => {
  console.error("Erro inesperado no pool PostgreSQL:", err);
});

/* ── Criar tabelas se não existirem ─────────────────────────────── */
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id                TEXT        PRIMARY KEY,
      name              TEXT        NOT NULL,
      email             TEXT        UNIQUE NOT NULL,
      password_hash     TEXT        NOT NULL,
      role              TEXT        NOT NULL DEFAULT 'student',
      plan              TEXT        NOT NULL DEFAULT 'none',
      access_expires_at TIMESTAMPTZ,
      last_login_at     TIMESTAMPTZ,
      created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS reset_tokens (
      token       TEXT        PRIMARY KEY,
      user_id     TEXT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at  TIMESTAMPTZ NOT NULL,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  console.log("✅ Tabelas users e reset_tokens verificadas/criadas na Neon.");
}

/* ── Converter linha da BD para o formato da aplicação ───────────── */
function rowToUser(row) {
  if (!row) return null;
  return {
    id:              row.id,
    name:            row.name,
    email:           row.email,
    passwordHash:    row.password_hash,
    role:            row.role,
    plan:            row.plan || "none",
    accessExpiresAt: row.access_expires_at ? new Date(row.access_expires_at).toISOString() : null,
    lastLoginAt:     row.last_login_at     ? new Date(row.last_login_at).toISOString()     : null,
    createdAt:       new Date(row.created_at).toISOString(),
    updatedAt:       new Date(row.updated_at).toISOString(),
  };
}

/* ── Ler todos os utilizadores ────────────────────────────────────── */
async function readUsers() {
  const { rows } = await pool.query(
    "SELECT * FROM users ORDER BY created_at DESC"
  );
  return rows.map(rowToUser);
}

/* ── Encontrar por email ─────────────────────────────────────────── */
async function findUserByEmail(email) {
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1",
    [email.trim()]
  );
  return rowToUser(rows[0] || null);
}

/* ── Encontrar por ID ────────────────────────────────────────────── */
async function findUserById(id) {
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE id = $1 LIMIT 1",
    [id]
  );
  return rowToUser(rows[0] || null);
}

/* ── Criar utilizador ────────────────────────────────────────────── */
async function createUser(user) {
  const { rows } = await pool.query(
    `INSERT INTO users
       (id, name, email, password_hash, role, plan, access_expires_at, created_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     ON CONFLICT (email) DO NOTHING
     RETURNING *`,
    [
      user.id,
      user.name,
      user.email.toLowerCase().trim(),
      user.passwordHash,
      user.role         || "student",
      user.plan         || "none",
      user.accessExpiresAt || null,
      user.createdAt    || new Date().toISOString(),
      user.updatedAt    || new Date().toISOString(),
    ]
  );
  return rowToUser(rows[0] || null);
}

/* ── Actualizar utilizador ───────────────────────────────────────── */
async function updateUser(id, updates) {
  const fields = [];
  const values = [];
  let   idx    = 1;

  const map = {
    name:            "name",
    passwordHash:    "password_hash",
    role:            "role",
    plan:            "plan",
    accessExpiresAt: "access_expires_at",
    lastLoginAt:     "last_login_at",
  };

  for (const [key, col] of Object.entries(map)) {
    if (updates[key] !== undefined) {
      fields.push(`${col} = $${idx++}`);
      values.push(updates[key]);
    }
  }

  fields.push(`updated_at = $${idx++}`);
  values.push(new Date().toISOString());
  values.push(id);   // WHERE id = $N

  const { rows } = await pool.query(
    `UPDATE users SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
    values
  );
  return rowToUser(rows[0] || null);
}

/* ── Apagar utilizador ───────────────────────────────────────────── */
async function deleteUser(id) {
  const { rowCount } = await pool.query(
    "DELETE FROM users WHERE id = $1",
    [id]
  );
  return rowCount > 0;
}

/* ── Reset tokens (persistentes na BD) ──────────────────────────── */
async function saveResetToken(token, userId, expiresMs) {
  await pool.query(
    `INSERT INTO reset_tokens (token, user_id, expires_at)
     VALUES ($1, $2, $3)
     ON CONFLICT (token) DO NOTHING`,
    [token, userId, new Date(expiresMs).toISOString()]
  );
}

async function getResetToken(token) {
  const { rows } = await pool.query(
    "SELECT user_id, expires_at FROM reset_tokens WHERE token = $1 LIMIT 1",
    [token]
  );
  return rows[0] || null;
}

async function deleteResetToken(token) {
  await pool.query("DELETE FROM reset_tokens WHERE token = $1", [token]);
}

module.exports = {
  pool,
  initDB,
  readUsers,
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  deleteUser,
  saveResetToken,
  getResetToken,
  deleteResetToken,
};
