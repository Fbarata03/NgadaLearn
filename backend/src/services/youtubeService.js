/* ════════════════════════════════════════════════════════════════════
   NgadaLearn — YouTube Data API v3 Service
   Cache em memória + deduplicação + quota tracking + fallback
   ════════════════════════════════════════════════════════════════════ */

const BASE_URL = "https://www.googleapis.com/youtube/v3";

/* ── Cache em memória (LRU simples via Map) ──────────────────────── */
const cache = new Map();
const MAX_CACHE_SIZE = 2000;

const TTL = {
  search:  60 * 60 * 1000,        // 1 hora
  videos:  24 * 60 * 60 * 1000,   // 24 horas
};

function cacheGet(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { cache.delete(key); return null; }
  return entry.data;
}

function cacheSet(key, data, ttl) {
  if (cache.size >= MAX_CACHE_SIZE) {
    // Evict oldest entry
    cache.delete(cache.keys().next().value);
  }
  cache.set(key, { data, expiresAt: Date.now() + ttl });
}

/* ── Quota tracking (reset diário) ───────────────────────────────── */
let quotaUsed    = 0;
let quotaResetAt = nextMidnightPT();

const QUOTA_DAILY_LIMIT = 9000; // deixa 1000 de margem
const QUOTA_COSTS = { search: 100, videos: 1 };

function nextMidnightPT() {
  // YouTube quota reset às 00:00 PT (UTC-8)
  const now = new Date();
  const ptOffset = 8 * 60; // minutos
  const ptNow = new Date(now.getTime() - ptOffset * 60_000);
  const midnight = new Date(ptNow);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime() + ptOffset * 60_000;
}

function resetQuotaIfNeeded() {
  if (Date.now() >= quotaResetAt) {
    quotaUsed    = 0;
    quotaResetAt = nextMidnightPT();
  }
}

function hasQuota(cost) {
  resetQuotaIfNeeded();
  return quotaUsed + cost <= QUOTA_DAILY_LIMIT;
}

function spendQuota(cost) {
  resetQuotaIfNeeded();
  quotaUsed += cost;
}

/* ── Deduplicação de pedidos em voo ─────────────────────────────── */
const inFlight = new Map();

async function withDedup(key, fetcher) {
  const cached = cacheGet(key);
  if (cached) return { data: cached, fromCache: true };

  if (inFlight.has(key)) return inFlight.get(key);

  const promise = fetcher()
    .then(data => { inFlight.delete(key); return { data, fromCache: false }; })
    .catch(err  => { inFlight.delete(key); throw err; });

  inFlight.set(key, promise);
  return promise;
}

/* ── API wrapper com fallback ────────────────────────────────────── */
async function apiFetch(url) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YOUTUBE_API_KEY_MISSING");
  const fullUrl = `${url}&key=${apiKey}`;
  const res = await fetch(fullUrl, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const reason = body?.error?.errors?.[0]?.reason || "";
    const msg    = body?.error?.message || res.statusText;
    console.error(`[YouTube API] status=${res.status} reason=${reason} msg=${msg}`);
    if (reason === "quotaExceeded") throw new Error("QUOTA_EXCEEDED");
    if (reason === "accessNotConfigured") throw new Error("API_NOT_ENABLED");
    if (reason === "keyInvalid")          throw new Error("API_KEY_INVALID");
    if (res.status === 403)               throw new Error("QUOTA_EXCEEDED");
    throw new Error(`YouTube API ${res.status}: ${msg}`);
  }
  return res.json();
}

/* ════════════════════════════════════════════════════════════════════
   SEARCH
   cost: 100 unidades por chamada
   ════════════════════════════════════════════════════════════════════ */
async function searchVideos({ q, type = "music", maxResults = 12 }) {
  const cacheKey = `search:${type}:${q}:${maxResults}`;

  return withDedup(cacheKey, async () => {
    if (!hasQuota(QUOTA_COSTS.search)) throw new Error("QUOTA_EXCEEDED");

    const categoryId = type === "music" ? "10" : "1";
    const params = new URLSearchParams({
      part:              "snippet",
      q,
      type:              "video",
      videoCategoryId:   categoryId,
      videoEmbeddable:   "true",
      videoSyndicated:   "true",
      maxResults:        String(Math.min(maxResults, 25)),
      relevanceLanguage: "en",
      safeSearch:        "moderate",
    });
    if (type === "movies") {
      params.set("videoDuration", "short");
      params.set("order", "relevance");
    }

    const data = await apiFetch(`${BASE_URL}/search?${params}`);
    spendQuota(QUOTA_COSTS.search);

    const videos = (data.items || [])
      .filter(i => i.id?.videoId)
      .map(i => ({
        id:        i.id.videoId,
        title:     i.snippet.title,
        channel:   i.snippet.channelTitle,
        thumbnail: i.snippet.thumbnails?.medium?.url || i.snippet.thumbnails?.default?.url || "",
      }));

    cacheSet(cacheKey, videos, TTL.search);
    return videos;
  });
}

/* ════════════════════════════════════════════════════════════════════
   VIDEO DETAILS (status + snippet)
   cost: 1 unidade por vídeo
   ════════════════════════════════════════════════════════════════════ */
async function getVideoDetails(ids) {
  const idList    = (Array.isArray(ids) ? ids : ids.split(",")).filter(Boolean).slice(0, 50);
  const cacheKey  = `videos:${idList.slice().sort().join(",")}`;

  return withDedup(cacheKey, async () => {
    if (!hasQuota(QUOTA_COSTS.videos * idList.length)) throw new Error("QUOTA_EXCEEDED");

    const params = new URLSearchParams({
      part:   "status,snippet",
      id:     idList.join(","),
      fields: "items(id,status/embeddable,snippet/defaultAudioLanguage,snippet/defaultLanguage)",
    });

    const data = await apiFetch(`${BASE_URL}/videos?${params}`);
    spendQuota(QUOTA_COSTS.videos * idList.length);

    const items = data.items || [];
    cacheSet(cacheKey, items, TTL.videos);
    return items;
  });
}

/* ── Estado da quota e cache ─────────────────────────────────────── */
function getStatus() {
  resetQuotaIfNeeded();
  return {
    quota: {
      used:      quotaUsed,
      limit:     QUOTA_DAILY_LIMIT,
      remaining: QUOTA_DAILY_LIMIT - quotaUsed,
      resetAt:   new Date(quotaResetAt).toISOString(),
      healthy:   quotaUsed < QUOTA_DAILY_LIMIT * 0.8,
    },
    cache: {
      size:    cache.size,
      maxSize: MAX_CACHE_SIZE,
      pending: inFlight.size,
    },
  };
}

/* ════════════════════════════════════════════════════════════════════
   TRANSCRIPT  — legendas temporizadas
   Estratégia 1: YouTube Timed Text API (rápida)
   Estratégia 2: Extrair captionTracks da página do vídeo (mais fiável)
   ════════════════════════════════════════════════════════════════════ */
const TRANSCRIPT_TTL  = 6 * 60 * 60 * 1000;  // 6 horas (sucesso)
const TRANSCRIPT_FAIL = 30 * 60 * 1000;       // 30 min  (falha)

const YT_HEADERS = {
  "Accept-Language": "en-US,en;q=0.9",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
};

/* Converte events do formato json3 em segmentos */
function eventsToSegments(events) {
  const segments = [];
  for (const ev of (events || [])) {
    if (!ev.segs?.length) continue;
    const text = ev.segs
      .map(s => (s.utf8 || "").replace(/\n/g, " "))
      .join("")
      .replace(/\s+/g, " ")
      .trim();
    if (!text) continue;
    segments.push({
      start: (ev.tStartMs  || 0)    / 1000,
      dur:   Math.max((ev.dDurationMs || 2000) / 1000, 0.3),
      text,
    });
  }
  return segments;
}

/* Estratégia 1 — Timed Text API directa */
async function tryTimedText(videoId) {
  const urls = [
    `https://www.youtube.com/api/timedtext?v=${videoId}&lang=en&fmt=json3`,
    `https://www.youtube.com/api/timedtext?v=${videoId}&lang=en&kind=asr&fmt=json3`,
    `https://www.youtube.com/api/timedtext?v=${videoId}&lang=en-US&fmt=json3`,
    `https://www.youtube.com/api/timedtext?v=${videoId}&lang=en-GB&fmt=json3`,
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(6000), headers: YT_HEADERS });
      if (!res.ok) continue;
      const data = await res.json().catch(() => null);
      if (!data?.events?.length) continue;
      const segs = eventsToSegments(data.events);
      if (segs.length >= 3) return segs;
    } catch { /* próximo */ }
  }
  return null;
}

/* Estratégia 2 — Extrair captionTracks da página do vídeo */
async function tryPageCaption(videoId) {
  try {
    const res = await fetch(
      `https://www.youtube.com/watch?v=${videoId}&hl=en`,
      { signal: AbortSignal.timeout(12000), headers: YT_HEADERS }
    );
    if (!res.ok) return null;

    const html = await res.text();

    /* Localizar o array captionTracks dentro do HTML */
    const ctIdx = html.indexOf('"captionTracks"');
    if (ctIdx === -1) return null;

    const arrayStart = html.indexOf("[", ctIdx);
    if (arrayStart === -1) return null;

    /* Extrair o array contando parênteses */
    let depth = 0, arrayEnd = arrayStart;
    for (let i = arrayStart; i < Math.min(html.length, arrayStart + 60000); i++) {
      const c = html[i];
      if (c === "[" || c === "{") depth++;
      else if (c === "]" || c === "}") { depth--; if (depth === 0) { arrayEnd = i + 1; break; } }
    }

    const captionTracks = JSON.parse(html.slice(arrayStart, arrayEnd));

    /* Preferir track em inglês; fallback para o primeiro disponível */
    const track = captionTracks.find(t =>
      t.languageCode === "en" || t.languageCode === "en-US" ||
      t.vssId?.includes(".en") || t.vssId?.startsWith("a.en")
    ) || captionTracks[0];

    if (!track?.baseUrl) return null;

    /* Buscar o conteúdo da legenda em formato json3 */
    const captionRes = await fetch(
      decodeURI(track.baseUrl) + "&fmt=json3",
      { signal: AbortSignal.timeout(8000), headers: YT_HEADERS }
    );
    if (!captionRes.ok) return null;

    const captionData = await captionRes.json().catch(() => null);
    if (!captionData?.events?.length) return null;

    const segs = eventsToSegments(captionData.events);
    return segs.length >= 3 ? segs : null;
  } catch (err) {
    console.warn(`[transcript/page] ${videoId}: ${err.message}`);
    return null;
  }
}

async function fetchTranscript(videoId) {
  const cacheKey = `transcript:${videoId}`;
  const cached   = cacheGet(cacheKey);
  if (cached !== null) return { data: cached, fromCache: true };

  /* Tenta estratégia 1 (rápida) */
  let segments = await tryTimedText(videoId);

  /* Fallback: estratégia 2 (mais fiável para filmes) */
  if (!segments) {
    segments = await tryPageCaption(videoId);
  }

  if (segments) {
    cacheSet(cacheKey, segments, TRANSCRIPT_TTL);
    return { data: segments, fromCache: false };
  }

  cacheSet(cacheKey, [], TRANSCRIPT_FAIL);
  return { data: [], fromCache: false };
}

module.exports = { searchVideos, getVideoDetails, getStatus, fetchTranscript };
