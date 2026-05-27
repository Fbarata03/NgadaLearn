/* ════════════════════════════════════════════════════════════════════
   NgadaLearn — Backend API
   Express + JWT + bcrypt + Neon PostgreSQL
   ════════════════════════════════════════════════════════════════════ */

require("dotenv").config();
const express = require("express");
const cors    = require("cors");

const authRoutes  = require("./routes/auth");
const userRoutes  = require("./routes/users");
const { initDB }  = require("./utils/dataStore");
const { seed }    = require("./scripts/seed");

const app  = express();
const PORT = process.env.PORT || 3001;

// ── CORS — permite localhost em dev + GitHub Pages em produção ────
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:4173",
  "https://fbarata03.github.io",
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origem não permitida — ${origin}`));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Log de pedidos (só em desenvolvimento) ────────────────────────
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
    status:    "ok",
    service:   "NgadaLearn API",
    version:   "2.0.0",
    db:        "Neon PostgreSQL",
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

// ── Arranque: inicializar BD → seed admin → iniciar servidor ──────
async function start() {
  try {
    await initDB();          // criar tabelas se não existirem
    await seed();            // garantir admin
    app.listen(PORT, () => {
      console.log(`\n🚀 NgadaLearn API em http://localhost:${PORT}`);
      console.log(`   Health: http://localhost:${PORT}/api/health`);
      console.log(`   BD:     Neon PostgreSQL`);
      console.log(`   Env:    ${process.env.NODE_ENV || "development"}\n`);
    });
  } catch (err) {
    console.error("❌ Falha ao iniciar servidor:", err);
    process.exit(1);
  }
}

start();
