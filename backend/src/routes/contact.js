/* ════════════════════════════════════════════════════════════════════
   NgadaLearn — Rotas de Contacto / Suporte
   POST /api/contact          — enviar mensagem (público)
   GET  /api/contact          — listar mensagens (admin)
   POST /api/contact/:id/reply — responder (admin)
   DELETE /api/contact/:id    — apagar (admin)
════════════════════════════════════════════════════════════════════ */

const express = require("express");
const { verifyToken, requireAdmin } = require("../middleware/auth");
const {
  createContactMessage,
  getContactMessages,
  replyContactMessage,
  deleteContactMessage,
} = require("../utils/dataStore");

const router = express.Router();

/* ── Enviar mensagem (público, sem login) ── */
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name?.trim())    return res.status(400).json({ error: "Nome obrigatório." });
    if (!email?.includes("@")) return res.status(400).json({ error: "Email inválido." });
    if (!subject?.trim()) return res.status(400).json({ error: "Assunto obrigatório." });
    if (!message?.trim()) return res.status(400).json({ error: "Mensagem obrigatória." });
    if (message.trim().length < 10) return res.status(400).json({ error: "Mensagem demasiado curta." });

    const msg = await createContactMessage({ name, email, subject, message });
    res.status(201).json({ success: true, id: msg.id });
  } catch (err) {
    console.error("Erro ao guardar mensagem de contacto:", err);
    res.status(500).json({ error: "Erro interno. Tenta novamente." });
  }
});

/* ── Listar mensagens — só admin ── */
router.get("/", verifyToken, requireAdmin, async (req, res) => {
  try {
    const messages = await getContactMessages();
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ error: "Erro ao carregar mensagens." });
  }
});

/* ── Responder mensagem — só admin ── */
router.post("/:id/reply", verifyToken, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { reply } = req.body;
    if (!reply?.trim()) return res.status(400).json({ error: "Resposta não pode estar vazia." });

    const updated = await replyContactMessage(id, reply);
    if (!updated) return res.status(404).json({ error: "Mensagem não encontrada." });
    res.json({ success: true, message: updated });
  } catch (err) {
    res.status(500).json({ error: "Erro ao guardar resposta." });
  }
});

/* ── Apagar mensagem — só admin ── */
router.delete("/:id", verifyToken, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const ok = await deleteContactMessage(id);
    if (!ok) return res.status(404).json({ error: "Mensagem não encontrada." });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Erro ao apagar mensagem." });
  }
});

module.exports = router;
