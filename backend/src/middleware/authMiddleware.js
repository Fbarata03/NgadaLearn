/* ════════════════════════════════════════════════════════════════════
   NgadaLearn — Middleware de Autenticação JWT
   ════════════════════════════════════════════════════════════════════ */

const jwt = require("jsonwebtoken");
const { findUserById } = require("../utils/dataStore");

// ── Verificar token JWT ───────────────────────────────────────────
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token de acesso em falta." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user    = findUserById(payload.id);

    if (!user) {
      return res.status(401).json({ error: "Utilizador não encontrado." });
    }

    // Anexar utilizador ao request (sem a password)
    const { passwordHash, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expirado. Faz login novamente." });
    }
    return res.status(401).json({ error: "Token inválido." });
  }
}

// ── Apenas administradores ────────────────────────────────────────
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Acesso restrito a administradores." });
  }
  next();
}

// ── Acesso activo (subscrição paga) ───────────────────────────────
function requireActiveAccess(req, res, next) {
  const user = req.user;
  if (!user) return res.status(401).json({ error: "Não autenticado." });

  const isAdmin  = user.role === "admin";
  const hasAccess = user.accessExpiresAt && new Date(user.accessExpiresAt) > new Date();

  if (!isAdmin && !hasAccess) {
    return res.status(403).json({ error: "Subscrição expirada ou inactiva." });
  }
  next();
}

module.exports = { authenticate, requireAdmin, requireActiveAccess };
