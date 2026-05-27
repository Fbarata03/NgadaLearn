/* ════════════════════════════════════════════════════════════════════
   NgadaLearn — Rota de pagamentos Stripe
   ════════════════════════════════════════════════════════════════════ */

const express = require("express");
const router  = express.Router();
const Stripe  = require("stripe");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

/* Preços em cêntimos (USD) */
const PLAN_PRICES = {
  monthly:  500,   // US$ 5
  lifetime: 2000,  // US$ 20
};

/* ── POST /api/payments/create-intent ── */
router.post("/create-intent", async (req, res) => {
  try {
    const { plan, email } = req.body;

    if (!PLAN_PRICES[plan]) {
      return res.status(400).json({ error: "Plano inválido." });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount:   PLAN_PRICES[plan],
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: { plan },
      receipt_email: email, // O Stripe enviará um comprovativo/fatura automaticamente para o cliente!
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe error:", err.message);
    res.status(500).json({ error: "Erro ao criar pagamento." });
  }
});

module.exports = router;
