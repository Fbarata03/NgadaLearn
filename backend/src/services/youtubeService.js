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
  if (!apiKey) throw new Error("YOUTUBE_API_KEY não configurada.");
  const fullUrl = `${url}&key=${apiKey}`;
  const res = await fetch(fullUrl, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const reason = body?.error?.errors?.[0]?.reason || "";
    if (reason === "quotaExceeded" || res.status === 403) throw new Error("QUOTA_EXCEEDED");
    throw new Error(`YouTube API ${res.status}: ${body?.error?.message || res.statusText}`);
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

module.exports = { searchVideos, getVideoDetails, getStatus };
