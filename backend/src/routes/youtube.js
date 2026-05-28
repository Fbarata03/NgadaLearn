/* ════════════════════════════════════════════════════════════════════
   NgadaLearn — Proxy YouTube API
   Expõe endpoints seguros sem expor a API key no frontend.
   Cache + rate limiting + fallback automático se quota excedida.
   ════════════════════════════════════════════════════════════════════ */

const router    = require("express").Router();
const rateLimit = require("express-rate-limit");
const { searchVideos, getVideoDetails, getStatus, fetchTranscript } = require("../services/youtubeService");

/* ── Rate limit específico para pesquisas YouTube ────────────────── */
const searchLimiter = rateLimit({
  windowMs:        60 * 1000,  // 1 minuto
  max:             8,          // 8 pesquisas/min por IP
  message:         { error: "Demasiadas pesquisas. Aguarde um momento.", videos: [] },
  standardHeaders: true,
  legacyHeaders:   false,
  skip:            (req) => req.query.fromCache === "true",
});

const detailsLimiter = rateLimit({
  windowMs:        60 * 1000,
  max:             30,         // 30 detalhes/min por IP
  message:         { error: "Limite atingido. Tente mais tarde.", items: [] },
  standardHeaders: true,
  legacyHeaders:   false,
});

/* ════════════════════════════════════════════════════════════════════
   GET /api/youtube/search
   ?q=...&type=music|movies&max=12
   ════════════════════════════════════════════════════════════════════ */
router.get("/search", searchLimiter, async (req, res) => {
  try {
    const q       = String(req.query.q || "").trim();
    const type    = ["music", "movies"].includes(req.query.type) ? req.query.type : "music";
    const max     = Math.min(parseInt(req.query.max) || 12, 25);

    if (q.length < 2) {
      return res.status(400).json({ error: "Pesquisa inválida.", videos: [] });
    }

    // Enriquecer a query com contexto
    const enriched = type === "music"
      ? (q.toLowerCase().includes("official") ? q : `${q} official english`)
      : `${q} scene english`;

    const result = await searchVideos({ q: enriched, type, maxResults: max });

    res.setHeader("X-Cache",      result.fromCache ? "HIT" : "MISS");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.json({ videos: result.data, fromCache: result.fromCache });

  } catch (err) {
    if (err.message === "QUOTA_EXCEEDED") {
      return res.status(200).json({
        videos:        [],
        fromCache:     false,
        quotaExceeded: true,
        message:       "Quota da YouTube API temporariamente esgotada. Tente mais tarde.",
      });
    }
    console.error("[YouTube /search]", err.message);
    res.status(500).json({ videos: [], error: "Erro ao pesquisar vídeos." });
  }
});

/* ════════════════════════════════════════════════════════════════════
   GET /api/youtube/videos
   ?ids=id1,id2,...
   ════════════════════════════════════════════════════════════════════ */
router.get("/videos", detailsLimiter, async (req, res) => {
  try {
    const ids = String(req.query.ids || "")
      .split(",")
      .map(s => s.trim())
      .filter(Boolean)
      .slice(0, 50);

    if (!ids.length) {
      return res.status(400).json({ error: "IDs em falta.", items: [] });
    }

    const result = await getVideoDetails(ids);

    res.setHeader("X-Cache",      result.fromCache ? "HIT" : "MISS");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.json({ items: result.data, fromCache: result.fromCache });

  } catch (err) {
    if (err.message === "QUOTA_EXCEEDED") {
      return res.status(200).json({
        items:         [],
        fromCache:     false,
        quotaExceeded: true,
      });
    }
    console.error("[YouTube /videos]", err.message);
    res.status(500).json({ items: [], error: "Erro ao obter detalhes." });
  }
});

/* ════════════════════════════════════════════════════════════════════
   GET /api/youtube/transcript/:videoId
   Legendas temporizadas (timed text) — sem custo de quota
   ════════════════════════════════════════════════════════════════════ */
router.get("/transcript/:videoId", detailsLimiter, async (req, res) => {
  const { videoId } = req.params;
  if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    return res.status(400).json({ error: "ID inválido.", segments: [] });
  }
  try {
    const result = await fetchTranscript(videoId);
    res.setHeader("Cache-Control",
      result.data.length ? "public, max-age=21600" : "public, max-age=1800");
    res.json({ segments: result.data, fromCache: result.fromCache });
  } catch (err) {
    console.error("[YouTube /transcript]", err.message);
    res.json({ segments: [] });
  }
});

/* ════════════════════════════════════════════════════════════════════
   GET /api/youtube/status  — monitorização de quota e cache
   ════════════════════════════════════════════════════════════════════ */
router.get("/status", (req, res) => {
  res.json(getStatus());
});

module.exports = router;
