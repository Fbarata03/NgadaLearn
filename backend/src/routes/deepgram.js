/* ════════════════════════════════════════════════════════════════════
NgadaLearn — Deepgram Routes
STT (Speech-to-Text), TTS (Text-to-Speech) e Conversation (AI Tutor)
════════════════════════════════════════════════════════════════════ */

const router = require("express").Router();
const Anthropic = require("@anthropic-ai/sdk");

const DG_KEY = process.env.DEEPGRAM_KEY;
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── 1. STT: áudio → texto ──────────────────────────────────────────
router.post("/transcribe", async (req, res) => {
    try {
          const response = await fetch(
                  "https://api.deepgram.com/v1/listen?model=nova-2&language=en-US&punctuate=true&smart_format=true",
            {
                      method: "POST",
                      headers: {
                                  Authorization: `Token ${DG_KEY}`,
                                  "Content-Type": req.headers["content-type"] || "audio/webm",
                      },
                                body: req,
                      duplex: "half",
            }
                );
          const data = await response.json();
          const transcript =
                  data?.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";
          res.json({ transcript });
    } catch (err) {
          console.error("[deepgram/transcribe]", err.message);
          res.status(500).json({ error: "Transcription failed" });
    }
});

// ── 2. TTS: texto → áudio mp3 ──────────────────────────────────────
router.post("/speak", async (req, res) => {
    const { text } = req.body;
        const voice = req.query.voice || "aura-asteria-en";
    try {
          const response = await fetch(
                  `https://api.deepgram.com/v1/speak?model=${voice}&encoding=mp3`,
            {
                      method: "POST",
                      headers: {
                                  Authorization: `Token ${DG_KEY}`,
                                  "Content-Type": "application/json",
                      },
                                body: JSON.stringify({ text }),
            }
                );
          res.set("Content-Type", "audio/mp3");
          const { Readable } = require("stream");
          Readable.fromWeb(response.body).pipe(res);
    } catch (err) {
          console.error("[deepgram/speak]", err.message);
          res.status(500).json({ error: "TTS failed" });
    }
});

// ── 3. Chat: mensagem → resposta do tutor (Claude) ─────────────────
router.post("/conversation", async (req, res) => {
    const { systemPrompt, history, userMessage } = req.body;
        try {
          const reply = await anthropic.messages.create({
                  model: "claude-haiku-4-5",
                  max_tokens: 150,
                  system: systemPrompt || "You are a helpful English language tutor.",
                  messages: [
                    {
                                role: "user",
                                content: `${history ? history + "\n" : ""}Student: ${userMessage}`,
                    },
                          ],
          });
          res.json({ response: reply.content[0].text });
    } catch (err) {
          console.error("[deepgram/conversation]", err.message);
          res.status(500).json({ error: "Conversation failed" });
    }
});

module.exports = router;
