const express  = require("express");
const router   = express.Router();
const Stripe   = require("stripe");
const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const { sendReceipt } = require("../utils/email");
const { findUserByEmail, createUser, updateUser } = require("../utils/dataStore");
const { authenticate } = require("../middleware/authMiddleware");

const PLAN_PRICES  = { monthly: 500,    lifetime: 2000   };
const PLAN_AMOUNTS = { monthly: "5,00", lifetime: "20,00" };

function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
}

function safeUser(user) {
  const { passwordHash, ...rest } = user;
  return rest;
}

/* ── POST /api/payments/create-intent ─────────────────────────── */
router.post("/create-intent", async (req, res) => {
  try {
    const { plan, email } = req.body;
    if (!PLAN_PRICES[plan]) {
      return res.status(400).json({ error: "Plano inválido." });
    }
    const intent = await stripe.paymentIntents.create({
      amount:   PLAN_PRICES[plan],
      currency: "usd",
      payment_method_types: ["card"],
      metadata: { plan },
      receipt_email: email || undefined,
    });
    res.json({ clientSecret: intent.client_secret });
  } catch (err) {
    console.error("Stripe create-intent:", err.message);
    res.status(500).json({ error: "Erro ao iniciar pagamento." });
  }
});

/* ── POST /api/payments/confirm ───────────────────────────────── */
/* Chamado após confirmCardPayment bem-sucedido (novo utilizador)  */
router.post("/confirm", async (req, res) => {
  try {
    const { paymentIntentId, name, email, password, plan } = req.body;

    if (!paymentIntentId || !email || !plan) {
      return res.status(400).json({ error: "Dados incompletos." });
    }

    /* Verificar pagamento no Stripe */
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (intent.status !== "succeeded") {
      return res.status(402).json({ error: "Pagamento não confirmado pelo Stripe." });
    }

    const accessExpiresAt = plan === "monthly"
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      : null;

    /* Criar ou actualizar utilizador na BD */
    let user = await findUserByEmail(email);

    if (!user) {
      if (!name || !password) {
        return res.status(400).json({ error: "Nome e senha são obrigatórios para novo registo." });
      }
      const passwordHash = await bcrypt.hash(password, 12);
      user = await createUser({
        id:              uuidv4(),
        name:            name.trim(),
        email:           email.toLowerCase().trim(),
        passwordHash,
        role:            "student",
        plan,
        accessExpiresAt,
        createdAt:       new Date().toISOString(),
        updatedAt:       new Date().toISOString(),
      });
    } else {
      user = await updateUser(user.id, { plan, accessExpiresAt });
    }

    if (!user) {
      return res.status(500).json({ error: "Erro ao criar conta. Tente novamente." });
    }

    const token = generateToken(user.id);

    /* Enviar recibo por email (sem bloquear a resposta) */
    sendReceipt({
      to:               email,
      name:             user.name,
      plan,
      amount:           PLAN_AMOUNTS[plan],
      paymentIntentId,
    }).catch((err) => console.error("Erro ao enviar recibo:", err.message));

    res.json({
      message: "Pagamento confirmado e acesso activado!",
      token,
      user:    safeUser(user),
    });
  } catch (err) {
    console.error("Erro em /confirm:", err);
    res.status(500).json({ error: "Erro ao confirmar pagamento." });
  }
});

/* ── POST /api/payments/renew ─────────────────────────────────── */
/* Renovação mensal — utilizador já autenticado                    */
router.post("/renew", authenticate, async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: "paymentIntentId é obrigatório." });
    }

    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (intent.status !== "succeeded") {
      return res.status(402).json({ error: "Pagamento não confirmado pelo Stripe." });
    }

    const accessExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const user = await updateUser(req.user.id, { plan: "monthly", accessExpiresAt });
    if (!user) return res.status(404).json({ error: "Utilizador não encontrado." });

    const token = generateToken(user.id);

    sendReceipt({
      to:               user.email,
      name:             user.name,
      plan:             "monthly",
      amount:           "5,00",
      paymentIntentId,
    }).catch((err) => console.error("Erro ao enviar email renovação:", err.message));

    res.json({
      message: "Plano renovado com sucesso!",
      token,
      user:    safeUser(user),
    });
  } catch (err) {
    console.error("Erro em /renew:", err);
    res.status(500).json({ error: "Erro ao renovar plano." });
  }
});

module.exports = router;
