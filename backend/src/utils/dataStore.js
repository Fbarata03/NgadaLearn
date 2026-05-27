/* ════════════════════════════════════════════════════════════════════
   NgadaLearn — Persistência de dados em ficheiro JSON
   (sem base de dados — ideal para deploy simples)
   ════════════════════════════════════════════════════════════════════ */

const fs   = require("fs");
const path = require("path");

const DATA_DIR   = path.join(__dirname, "..", "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

// ── Garante que a pasta data/ existe ─────────────────────────────
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log("📁 Pasta data/ criada.");
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), "utf8");
    console.log("📄 Ficheiro users.json criado.");
  }
}

// ── Ler todos os utilizadores ─────────────────────────────────────
function readUsers() {
  try {
    const raw = fs.readFileSync(USERS_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// ── Guardar todos os utilizadores ────────────────────────────────
function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

// ── Encontrar utilizador por email ────────────────────────────────
function findUserByEmail(email) {
  return readUsers().find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  ) || null;
}

// ── Encontrar utilizador por ID ───────────────────────────────────
function findUserById(id) {
  return readUsers().find((u) => u.id === id) || null;
}

// ── Criar utilizador ──────────────────────────────────────────────
function createUser(userData) {
  const users = readUsers();
  users.push(userData);
  writeUsers(users);
  return userData;
}

// ── Actualizar utilizador ─────────────────────────────────────────
function updateUser(id, updates) {
  const users = readUsers();
  const idx   = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...updates, updatedAt: new Date().toISOString() };
  writeUsers(users);
  return users[idx];
}

// ── Apagar utilizador ─────────────────────────────────────────────
function deleteUser(id) {
  const users   = readUsers();
  const filtered = users.filter((u) => u.id !== id);
  if (filtered.length === users.length) return false;
  writeUsers(filtered);
  return true;
}

module.exports = {
  ensureDataDir,
  readUsers,
  writeUsers,
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  deleteUser,
};
