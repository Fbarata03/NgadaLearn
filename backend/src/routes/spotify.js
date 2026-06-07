/* ════════════════════════════════════════════════════════════════════
   NgadaLearn — Spotify Search proxy
   Usa Client Credentials flow (sem conta de utilizador necessária)
   ════════════════════════════════════════════════════════════════════ */

const express = require("express");
const router  = express.Router();

/* Token em cache — renova automaticamente antes de expirar */
let _token   = null;
let _expires = 0;

async function getToken() {
  if (_token && Date.now() < _expires) return _token;

  const cid = process.env.SPOTIFY_CLIENT_ID;
  const sec = process.env.SPOTIFY_CLIENT_SECRET;
  if (!cid || !sec) throw new Error("SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET não configurados");

  const creds = Buffer.from(`${cid}:${sec}`).toString("base64");
  const res   = await fetch("https://accounts.spotify.com/api/token", {
    method:  "POST",
    headers: {
      Authorization:  `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Spotify token falhou (${res.status}): ${txt}`);
  }

  const d  = await res.json();
  _token   = d.access_token;
  _expires = Date.now() + (d.expires_in - 60) * 1000; // renova 1 min antes
  return _token;
}

/* ── GET /api/spotify/search?q=<query> ───────────────────────────── */
router.get("/search", async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) return res.status(400).json({ error: "Parâmetro ?q obrigatório" });

  try {
    const token = await getToken();
    const r = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=15&market=PT`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!r.ok) throw new Error(`Spotify API devolveu ${r.status}`);
    res.json(await r.json());
  } catch (err) {
    console.error("[spotify] search error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
