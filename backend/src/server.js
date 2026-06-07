/* ════════════════════════════════════════════════════════════════════
   NgadaLearn — Backend API
   Express + JWT + bcrypt + Neon PostgreSQL
   ════════════════════════════════════════════════════════════════════ */

require("dotenv").config();
const express   = require("express");
const cors      = require("cors");
const helmet    = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes    = require("./routes/auth");
const userRoutes    = require("./routes/users");
const paymentRoutes = require("./routes/payments");
const youtubeRoutes = require("./routes/youtube");
const spotifyRoutes = require("./routes/spotify");
const lyricsRoutes  = require("./routes/lyrics");
const deepgramRoutes = require("./routes/deepgram");
const contactRoutes  = require("./routes/contact");
const { initDB }    = require("./utils/dataStore");
const { seed }      = require("./scripts/seed");

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Segurança — cabeçalhos HTTP ───────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc:  ["'self'"],
      scriptSrc:   ["'self'"],
      styleSrc:    ["'self'", "'unsafe-inline'"],
      imgSrc:      ["'self'", "data:", "https:"],
      connectSrc:  ["'self'"],
      frameSrc:    ["'none'"],
      objectSrc:   ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge:            31536000,   // 1 ano
    includeSubDomains: true,
    preload:           true,
  },
  referrerPolicy:      { policy: "strict-origin-when-cross-origin" },
  noSniff:             true,
  xssFilter:           true,
  frameguard:          { action: "deny" },
}));

// ── Impedir fugas de informação de versão ──────────────────────────
app.disable("x-powered-by");

// ── CORS ──────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:4173",
  "https://fbarata03.github.io",
  "https://www.ngadalearn.pt",
  "https://ngadalearn.pt",
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

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ── Rate Limiting ─────────────────────────────────────────────────
// Login/register: 10 tentativas por 15 min por IP
const authLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             10,
  message:         { error: "Demasiadas tentativas. Tente novamente em 15 minutos." },
  standardHeaders: true,
  legacyHeaders:   false,
  skipSuccessfulRequests: false,
});

// Forgot/reset password: apenas 5 tentativas por hora (previne enumeração de emails)
const passwordResetLimiter = rateLimit({
  windowMs:        60 * 60 * 1000,
  max:             5,
  message:         { error: "Demasiados pedidos de reset. Tente novamente em 1 hora." },
  standardHeaders: true,
  legacyHeaders:   false,
});

const paymentLimiter = rateLimit({
  windowMs:        60 * 60 * 1000,
  max:             15,
  message:         { error: "Limite de operações de pagamento atingido. Tente mais tarde." },
  standardHeaders: true,
  legacyHeaders:   false,
});

// Rate limiter global: 200 req/min por IP (proteção geral contra DoS)
const globalLimiter = rateLimit({
  windowMs:        60 * 1000,
  max:             200,
  message:         { error: "Demasiados pedidos. Abranda um pouco." },
  standardHeaders: true,
  legacyHeaders:   false,
});
app.use(globalLimiter);

// ── Log de pedidos (só em desenvolvimento) ────────────────────────
if (process.env.NODE_ENV !== "production") {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ── Rotas da API ──────────────────────────────────────────────────
app.use("/api/auth/forgot-password", passwordResetLimiter);
app.use("/api/auth/reset-password",  passwordResetLimiter);
app.use("/api/auth",     authLimiter,    authRoutes);
app.use("/api/users",    userRoutes);
app.use("/api/payments", paymentLimiter, paymentRoutes);
app.use("/api/youtube",  youtubeRoutes);
app.use("/api/spotify",  spotifyRoutes);
app.use("/api/lyrics",   lyricsRoutes);
app.use("/api",         deepgramRoutes);
app.use("/api/contact", contactRoutes);

// ── Health check ──────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({
    status:    "ok",
    service:   "NgadaLearn API",
    version:   "3.0.0",
    db:        "Neon PostgreSQL",
    timestamp: new Date().toISOString(),
  });
});

// ── Stripe diagnostics ────────────────────────────────────────────
app.get("/api/stripe-status", async (_req, res) => {
  const key = process.env.STRIPE_SECRET_KEY || "";
  if (!key) return res.json({ ok: false, error: "STRIPE_SECRET_KEY não definida" });

  const Stripe = require("stripe");
  const stripe = Stripe(key);
  try {
    await stripe.paymentMethods.list({ limit: 1 });
    res.json({ ok: true, mode: key.startsWith("sk_live_") ? "LIVE" : "TEST" });
  } catch (err) {
    res.json({ ok: false, mode: key.startsWith("sk_live_") ? "LIVE" : "TEST", error: err.message });
  }
});

// ── 404 ───────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Rota não encontrada." });
});

// ── Error handler ─────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("Erro interno:", err.message);
  res.status(500).json({ error: "Erro interno do servidor." });
});

// ── Keep-alive: auto-ping a cada 14 min para o Render não dormir ──
function startKeepAlive(baseUrl) {
  const https = require("https");
  const http  = require("http");

  const INTERVAL_MS = 14 * 60 * 1000; // 14 minutos

  setInterval(() => {
    const url = `${baseUrl}/api/health`;
    const mod = url.startsWith("https") ? https : http;

    const req = mod.get(url, (res) => {
      console.log(`[keep-alive] ping ${url} → ${res.statusCode}`);
    });

    req.on("error", (err) => {
      console.warn(`[keep-alive] ping falhou: ${err.message}`);
    });

    req.setTimeout(10000, () => {
      console.warn("[keep-alive] ping timeout");
      req.destroy();
    });
  }, INTERVAL_MS);

  console.log(`   Keep-alive: ping a cada 14 min → ${baseUrl}/api/health`);
}

// ── Arranque: inicializar BD → seed admin → iniciar servidor ──────
async function start() {
  try {
    await initDB();          // criar tabelas se não existirem
    await seed();            // garantir admin
    app.listen(PORT, () => {
      console.log(`\n🚀 NgadaLearn API em http://localhost:${PORT}`);
      console.log(`   Health: http://localhost:${PORT}/api/health`);
      console.log(`   BD:     Neon PostgreSQL`);
      console.log(`   Env:    ${process.env.NODE_ENV || "development"}`);

      // Activar keep-alive só no Render (RENDER_EXTERNAL_URL é definido automaticamente)
      const renderUrl = process.env.RENDER_EXTERNAL_URL;
      if (renderUrl) {
        startKeepAlive(renderUrl);
      }
      console.log("");
    });
  } catch (err) {
    console.error("❌ Falha ao iniciar servidor:", err);
    process.exit(1);
  }
}

start();
