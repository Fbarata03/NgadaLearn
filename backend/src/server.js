/* ════════════════════════════════════════════════════════════════════
   NgadaLearn — Backend API
   Express + JWT + bcrypt
   ════════════════════════════════════════════════════════════════════ */

require("dotenv").config();
const express  = require("express");
const cors     = require("cors");
const path     = require("path");

const authRoutes  = require("./routes/auth");
const userRoutes  = require("./routes/users");
const { ensureDataDir } = require("./utils/dataStore");

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Middleware global ─────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Log de pedidos (desenvolvimento) ─────────────────────────────
if (process.env.NODE_ENV !== "production") {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ── Rotas da API ──────────────────────────────────────────────────
app.use("/api/auth",  authRoutes);
app.use("/api/users", userRoutes);

// ── Health check ──────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "NgadaLearn API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ── 404 ───────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Rota não encontrada." });
});

// ── Error handler ─────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("Erro interno:", err);
  res.status(500).json({ error: "Erro interno do servidor." });
});

// ── Iniciar servidor ──────────────────────────────────────────────
ensureDataDir();
app.listen(PORT, () => {
  console.log(`\n🚀 NgadaLearn API a correr em http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   Ambiente: ${process.env.NODE_ENV || "development"}\n`);
});
