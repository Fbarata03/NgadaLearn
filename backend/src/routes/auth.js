/* ════════════════════════════════════════════════════════════════════
   NgadaLearn — Rotas de Autenticação
   POST /api/auth/register
   POST /api/auth/login
   GET  /api/auth/me
   POST /api/auth/logout
   ════════════════════════════════════════════════════════════════════ */

const router  = require("express").Router();
const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const {
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
} = require("../utils/dataStore");
const { authenticate } = require("../middleware/authMiddleware");

// ── Utilitário: gerar token JWT ───────────────────────────────────
function generateToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

// ── Utilitário: limpar campos sensíveis ───────────────────────────
function safeUser(user) {
  const { passwordHash, ...rest } = user;
  return rest;
}

// ════════════════════════════════════════════════════════════════════
// POST /api/auth/register
// ════════════════════════════════════════════════════════════════════
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validações básicas
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Nome, email e password são obrigatórios." });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "A password deve ter pelo menos 6 caracteres." });
    }

    // Verificar se o email já existe
    const existing = findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "Este email já está registado." });
    }

    // Hash da password
    const passwordHash = await bcrypt.hash(password, 12);

    // Criar utilizador
    const newUser = {
      id:              uuidv4(),
      name:            name.trim(),
      email:           email.toLowerCase().trim(),
      passwordHash,
      role:            "student",
      accessExpiresAt: null,  // sem acesso até pagar
      createdAt:       new Date().toISOString(),
      updatedAt:       new Date().toISOString(),
    };

    createUser(newUser);

    const token = generateToken(newUser.id);

    res.status(201).json({
      message: "Conta criada com sucesso!",
      token,
      user: safeUser(newUser),
    });
  } catch (err) {
    console.error("Erro no registo:", err);
    res.status(500).json({ error: "Erro ao criar conta." });
  }
});

// ════════════════════════════════════════════════════════════════════
// POST /api/auth/login
// ════════════════════════════════════════════════════════════════════
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e password são obrigatórios." });
    }

    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    // Actualizar última sessão
    updateUser(user.id, { lastLoginAt: new Date().toISOString() });

    const token = generateToken(user.id);

    res.json({
      message: "Login efectuado com sucesso!",
      token,
      user: safeUser(user),
    });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ error: "Erro ao fazer login." });
  }
});

// ════════════════════════════════════════════════════════════════════
// GET /api/auth/me  (protegido)
// ════════════════════════════════════════════════════════════════════
router.get("/me", authenticate, (req, res) => {
  res.json({ user: req.user });
});

// ════════════════════════════════════════════════════════════════════
// POST /api/auth/change-password  (protegido)
// ════════════════════════════════════════════════════════════════════
router.post("/change-password", authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Password actual e nova são obrigatórias." });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: "A nova password deve ter pelo menos 6 caracteres." });
    }

    // Buscar utilizador com hash
    const { findUserById: fu } = require("../utils/dataStore");
    const userWithHash = fu(req.user.id);

    const match = await bcrypt.compare(currentPassword, userWithHash.passwordHash);
    if (!match) {
      return res.status(401).json({ error: "Password actual incorrecta." });
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    updateUser(req.user.id, { passwordHash: newHash });

    res.json({ message: "Password alterada com sucesso!" });
  } catch (err) {
    console.error("Erro ao alterar password:", err);
    res.status(500).json({ error: "Erro ao alterar password." });
  }
});

module.exports = router;
