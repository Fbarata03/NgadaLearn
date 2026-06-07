/* ════════════════════════════════════════════════════════════════════
   NgadaLearn — Music Search proxy (Last.fm)
   Usa a Last.fm API gratuita — não requer Premium
   ════════════════════════════════════════════════════════════════════ */

const express = require("express");
const router  = express.Router();

const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
const LASTFM_BASE    = "https://ws.audioscrobbler.com/2.0/";

/* ── GET /api/spotify/search?q=<query> ───────────────────────────── */
router.get("/search", async (req, res) => {
     const q = (req.query.q || "").trim();
     if (!q) return res.status(400).json({ error: "Parâmetro ?q obrigatório" });

             if (!LASTFM_API_KEY) {
                    return res.status(500).json({ error: "LASTFM_API_KEY não configurada" });
             }

             try {
                    const url =
                             `${LASTFM_BASE}?method=track.search` +
                             `&track=${encodeURIComponent(q)}` +
                             `&api_key=${LASTFM_API_KEY}` +
                             `&format=json` +
                             `&limit=15`;

       const r = await fetch(url);
                    if (!r.ok) throw new Error(`Last.fm API devolveu ${r.status}`);

       const data = await r.json();
                    const matches = data?.results?.trackmatches?.track || [];

       /* Normaliza para o mesmo formato que o frontend espera do Spotify */
       const tracks = matches.map((t) => ({
                id: t.mbid || `${t.artist}-${t.name}`,
                name: t.name,
                artists: [{ name: t.artist }],
                album: {
                           name: "",
                           images: t.image
                             ? t.image.map((img) => ({ url: img["#text"], height: null, width: null }))
                                        : [],
                },
                preview_url: null,
                external_urls: { spotify: t.url },
                duration_ms: 0,
       }));

       /* Devolve no mesmo envelope que o Spotify: { tracks: { items: [...] } } */
       res.json({ tracks: { items: tracks } });
             } catch (err) {
                    console.error("[lastfm] search error:", err.message);
                    res.status(500).json({ error: err.message });
             }
});

module.exports = router;
