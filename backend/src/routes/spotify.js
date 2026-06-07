/* ════════════════════════════════════════════════════════════════════
   NgadaLearn — Music Search proxy (iTunes Search API)
   Gratuita, sem chave, devolve artwork em alta resolução
   ════════════════════════════════════════════════════════════════════ */

const express = require("express");
const router  = express.Router();

/* ── GET /api/spotify/search?q=<query> ───────────────────────────── */
router.get("/search", async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) return res.status(400).json({ error: "Parâmetro ?q obrigatório" });

  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&entity=song&limit=15&lang=en_us`;
    const r   = await fetch(url);
    if (!r.ok) throw new Error(`iTunes API devolveu ${r.status}`);

    const data = await r.json();

    /* Normaliza para o mesmo envelope que o frontend espera */
    const tracks = (data.results || []).map(t => ({
      id:          String(t.trackId),
      name:        t.trackName    || "",
      artists:     [{ name: t.artistName || "" }],
      album: {
        name:   t.collectionName || "",
        images: [
          /* 600×600 — alta resolução */
          { url: (t.artworkUrl100 || "").replace("100x100bb", "600x600bb") },
          /* 100×100 — fallback */
          { url: t.artworkUrl100 || "" },
        ].filter(i => i.url),
      },
      preview_url:   t.previewUrl     || null,
      external_urls: { spotify: t.trackViewUrl || "" },
      duration_ms:   t.trackTimeMillis || 0,
    }));

    res.json({ tracks: { items: tracks } });
  } catch (err) {
    console.error("[itunes] search error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
