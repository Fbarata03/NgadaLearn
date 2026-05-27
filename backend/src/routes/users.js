/* ════════════════════════════════════════════════════════════════════
   NgadaLearn — Rotas de Gestão de Utilizadores (Admin)
   GET    /api/users          — listar todos (admin)
   GET    /api/users/:id      — detalhe (admin)
   PATCH  /api/users/:id      — actualizar (admin)
   DELETE /api/users/:id      — apagar (admin)
   POST   /api/users/:id/access — conceder/revogar acesso (admin)
   ════════════════════════════════════════════════════════════════════ */

const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const {
  readUsers,
  findUserById,
  findUserByEmail,
  createUser,
  updateUser,
  deleteUser,
} = require("../utils/dataStore");
const { authenticate, requireAdmin } = require("../middleware/authMiddleware");

// Todas as rotas desta secção requerem auth + admin
router.use(authenticate, requireAdmin);

// Remover campos sensíveis
function safeUser(u) {
  const { passwordHash, ...rest } = u;
  return rest;
}

// ════════════════════════════════════════════════════════════════════
// GET /api/users
// ════════════════════════════════════════════════════════════════════
router.get("/", (_req, res) => {
  const users = readUsers().map(safeUser);
  res.json({ users, total: users.length });
});

// ════════════════════════════════════════════════════════════════════
// POST /api/users  — criar utilizador manualmente (admin)
// ════════════════════════════════════════════════════════════════════
router.post("/", async (req, res) => {
  try {
    const { name, email, password, role, accessDays } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Nome, email e password são obrigatórios." });
    }

    if (findUserByEmail(email)) {
      return res.status(409).json({ error: "Email já registado." });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    let accessExpiresAt = null;
    if (accessDays && Number(accessDays) > 0) {
      const d = new Date();
      d.setDate(d.getDate() + Number(accessDays));
      accessExpiresAt = d.toISOString();
    }

    const newUser = {
      id:              uuidv4(),
      name:            name.trim(),
      email:           email.toLowerCase().trim(),
      passwordHash,
      role:            role === "admin" ? "admin" : "student",
      accessExpiresAt,
      createdAt:       new Date().toISOString(),
      updatedAt:       new Date().toISOString(),
    };

    createUser(newUser);
    res.status(201).json({ message: "Utilizador criado.", user: safeUser(newUser) });
  } catch (err) {
    console.error("Erro ao criar utilizador:", err);
    res.status(500).json({ error: "Erro ao criar utilizador." });
  }
});

// ════════════════════════════════════════════════════════════════════
// GET /api/users/:id
// ════════════════════════════════════════════════════════════════════
router.get("/:id", (req, res) => {
  const user = findUserById(req.params.id);
  if (!user) return res.status(404).json({ error: "Utilizador não encontrado." });
  res.json({ user: safeUser(user) });
});

// ════════════════════════════════════════════════════════════════════
// PATCH /api/users/:id  — actualizar nome, role
// ════════════════════════════════════════════════════════════════════
router.patch("/:id", (req, res) => {
  const { name, role } = req.body;
  const updates = {};

  if (name) updates.name = name.trim();
  if (role && ["admin", "student"].includes(role)) updates.role = role;

  const updated = updateUser(req.params.id, updates);
  if (!updated) return res.status(404).json({ error: "Utilizador não encontrado." });

  res.json({ message: "Utilizador actualizado.", user: safeUser(updated) });
});

// ════════════════════════════════════════════════════════════════════
// DELETE /api/users/:id
// ════════════════════════════════════════════════════════════════════
router.delete("/:id", (req, res) => {
  // Não permitir apagar a si próprio
  if (req.params.id === req.user.id) {
    return res.status(400).json({ error: "Não podes apagar a tua própria conta aqui." });
  }

  const ok = deleteUser(req.params.id);
  if (!ok) return res.status(404).json({ error: "Utilizador não encontrado." });

  res.json({ message: "Utilizador apagado." });
});

// ════════════════════════════════════════════════════════════════════
// POST /api/users/:id/access — conceder/revogar acesso
// Body: { days: number }  (0 = revogar)
// ════════════════════════════════════════════════════════════════════
router.post("/:id/access", (req, res) => {
  const user = findUserById(req.params.id);
  if (!user) return res.status(404).json({ error: "Utilizador não encontrado." });

  const days = Number(req.body.days);

  let accessExpiresAt = null;
  if (!isNaN(days) && days > 0) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    accessExpiresAt = d.toISOString();
  }

  const updated = updateUser(req.params.id, { accessExpiresAt });
  res.json({
    message: days > 0
      ? `Acesso concedido por ${days} dias.`
      : "Acesso revogado.",
    user: safeUser(updated),
  });
});

module.exports = router;
