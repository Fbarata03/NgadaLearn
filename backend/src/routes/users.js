/* ════════════════════════════════════════════════════════════════════
   NgadaLearn — Rotas de Gestão de Utilizadores (Admin) — Neon
   GET    /api/users          — listar todos (admin)
   POST   /api/users          — criar utilizador (admin)
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

// Todas as rotas requerem auth + admin
router.use(authenticate, requireAdmin);

function safeUser(u) {
  const { passwordHash, ...rest } = u;
  return rest;
}

// ════════════════════════════════════════════════════════════════════
// GET /api/users
// ════════════════════════════════════════════════════════════════════
router.get("/", async (_req, res) => {
  try {
    const users = (await readUsers()).map(safeUser);
    res.json({ users, total: users.length });
  } catch (err) {
    console.error("Erro ao listar utilizadores:", err);
    res.status(500).json({ error: "Erro ao listar utilizadores." });
  }
});

// ════════════════════════════════════════════════════════════════════
// POST /api/users  — criar utilizador manualmente
// ════════════════════════════════════════════════════════════════════
router.post("/", async (req, res) => {
  try {
    const { name, email, password, role, accessDays, plan } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Nome, email e password são obrigatórios." });
    }
    if (await findUserByEmail(email)) {
      return res.status(409).json({ error: "Email já registado." });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    let accessExpiresAt = null;
    if (accessDays && Number(accessDays) > 0) {
      const d = new Date();
      d.setDate(d.getDate() + Number(accessDays));
      accessExpiresAt = d.toISOString();
    }

    const newUser = await createUser({
      id:              uuidv4(),
      name:            name.trim(),
      email:           email.toLowerCase().trim(),
      passwordHash,
      role:            role === "admin" ? "admin" : "student",
      plan:            plan || "none",
      accessExpiresAt,
      createdAt:       new Date().toISOString(),
      updatedAt:       new Date().toISOString(),
    });

    res.status(201).json({ message: "Utilizador criado.", user: safeUser(newUser) });
  } catch (err) {
    console.error("Erro ao criar utilizador:", err);
    res.status(500).json({ error: "Erro ao criar utilizador." });
  }
});

// ════════════════════════════════════════════════════════════════════
// GET /api/users/:id
// ════════════════════════════════════════════════════════════════════
router.get("/:id", async (req, res) => {
  try {
    const user = await findUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "Utilizador não encontrado." });
    res.json({ user: safeUser(user) });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar utilizador." });
  }
});

// ════════════════════════════════════════════════════════════════════
// PATCH /api/users/:id
// ════════════════════════════════════════════════════════════════════
router.patch("/:id", async (req, res) => {
  try {
    const { name, role } = req.body;
    const updates = {};
    if (name) updates.name = name.trim();
    if (role && ["admin", "student"].includes(role)) updates.role = role;

    const updated = await updateUser(req.params.id, updates);
    if (!updated) return res.status(404).json({ error: "Utilizador não encontrado." });

    res.json({ message: "Utilizador actualizado.", user: safeUser(updated) });
  } catch (err) {
    res.status(500).json({ error: "Erro ao actualizar utilizador." });
  }
});

// ════════════════════════════════════════════════════════════════════
// DELETE /api/users/:id
// ════════════════════════════════════════════════════════════════════
router.delete("/:id", async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: "Não podes apagar a tua própria conta aqui." });
    }
    const ok = await deleteUser(req.params.id);
    if (!ok) return res.status(404).json({ error: "Utilizador não encontrado." });
    res.json({ message: "Utilizador apagado." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao apagar utilizador." });
  }
});

// ════════════════════════════════════════════════════════════════════
// POST /api/users/:id/access — conceder/revogar acesso
// Body: { days: number, plan: string }  (days=0 → revogar)
// ════════════════════════════════════════════════════════════════════
router.post("/:id/access", async (req, res) => {
  try {
    const user = await findUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "Utilizador não encontrado." });

    const days = Number(req.body.days);
    const plan = req.body.plan || (days > 0 ? "monthly" : "none");

    let accessExpiresAt = null;
    if (!isNaN(days) && days > 0) {
      const d = new Date();
      d.setDate(d.getDate() + days);
      accessExpiresAt = d.toISOString();
    }

    const updated = await updateUser(req.params.id, { accessExpiresAt, plan });
    res.json({
      message: days > 0
        ? `Acesso concedido por ${days} dias (plano: ${plan}).`
        : "Acesso revogado.",
      user: safeUser(updated),
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao gerir acesso." });
  }
});

module.exports = router;
