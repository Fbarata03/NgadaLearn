/* ════════════════════════════════════════════════════════════════════
   NgadaLearn — Rotas de Autenticação (Neon PostgreSQL)
   POST /api/auth/register
   POST /api/auth/login
   GET  /api/auth/me
   POST /api/auth/change-password
   ════════════════════════════════════════════════════════════════════ */

const router  = require("express").Router();
const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const crypto = require("crypto");
const {
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
} = require("../utils/dataStore");
const { authenticate } = require("../middleware/authMiddleware");
const { sendPasswordReset } = require("../utils/email");

/* In-memory store: token → { userId, expires } */
const resetTokens = new Map();

// ── Gerar token JWT ───────────────────────────────────────────────
function generateToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

// ── Remover campo sensível ────────────────────────────────────────
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

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Nome, email e password são obrigatórios." });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "A password deve ter pelo menos 6 caracteres." });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "Este email já está registado." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const newUser = await createUser({
      id:              uuidv4(),
      name:            name.trim(),
      email:           email.toLowerCase().trim(),
      passwordHash,
      role:            "student",
      plan:            "none",
      accessExpiresAt: null,
      createdAt:       new Date().toISOString(),
      updatedAt:       new Date().toISOString(),
    });

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

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    await updateUser(user.id, { lastLoginAt: new Date().toISOString() });

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

    const userWithHash = await findUserById(req.user.id);
    const match = await bcrypt.compare(currentPassword, userWithHash.passwordHash);
    if (!match) {
      return res.status(401).json({ error: "Password actual incorrecta." });
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await updateUser(req.user.id, { passwordHash: newHash });

    res.json({ message: "Password alterada com sucesso!" });
  } catch (err) {
    console.error("Erro ao alterar password:", err);
    res.status(500).json({ error: "Erro ao alterar password." });
  }
});

// ════════════════════════════════════════════════════════════════════
// POST /api/auth/forgot-password
// ════════════════════════════════════════════════════════════════════
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const MSG = "Se este email estiver registado, receberá as instruções em breve.";

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Informe um email válido." });
    }

    const user = await findUserByEmail(email);
    if (!user) return res.json({ message: MSG });

    /* Gerar token seguro */
    const token   = crypto.randomBytes(32).toString("hex");
    const expires = Date.now() + 60 * 60 * 1000; // 1 hora
    resetTokens.set(token, { userId: user.id, expires });

    const base     = process.env.FRONTEND_URL || "https://ngadalearn.pt";
    const resetUrl = `${base}/reset-password?token=${token}`;

    /* Tentar enviar email */
    let emailSent = false;
    try {
      emailSent = await sendPasswordReset({ to: user.email, name: user.name, resetUrl });
    } catch (emailErr) {
      console.warn("Erro ao enviar email de reset:", emailErr.message);
    }

    console.log(`[reset] URL para ${email}: ${resetUrl}`);

    /* Se o email não foi enviado, devolve o link directamente na resposta */
    if (!emailSent) {
      return res.json({
        message: "Não foi possível enviar o email. Use o link abaixo para redefinir a sua senha:",
        resetUrl,
      });
    }

    res.json({ message: MSG });
  } catch (err) {
    console.error("Erro em forgot-password:", err);
    res.status(500).json({ error: "Erro ao processar pedido." });
  }
});

// ════════════════════════════════════════════════════════════════════
// POST /api/auth/reset-password
// ════════════════════════════════════════════════════════════════════
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token e nova senha são obrigatórios." });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: "A senha deve ter pelo menos 6 caracteres." });
    }

    const data = resetTokens.get(token);
    if (!data || data.expires < Date.now()) {
      resetTokens.delete(token);
      return res.status(400).json({ error: "Link expirado ou inválido. Solicite um novo." });
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await updateUser(data.userId, { passwordHash: newHash });
    resetTokens.delete(token);

    res.json({ message: "Senha redefinida com sucesso! Já pode entrar." });
  } catch (err) {
    console.error("Erro em reset-password:", err);
    res.status(500).json({ error: "Erro ao redefinir senha." });
  }
});

module.exports = router;
