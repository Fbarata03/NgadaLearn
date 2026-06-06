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
    cache.delete(cache.keys().next().value);
  }
  cache.set(key, { data, expiresAt: Date.now() + ttl });
}

/* ── Quota tracking (reset diário) ───────────────────────────────── */
let quotaUsed    = 0;
let quotaResetAt = nextMidnightPT();

const QUOTA_DAILY_LIMIT = 9000;
const QUOTA_COSTS = { search: 100, videos: 1 };

function nextMidnightPT() {
  const now = new Date();
  const ptOffset = 8 * 60;
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
      params.set("videoCaption", "closedCaption");
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
   VIDEO DETAILS
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
   TRANSCRIPT — 3 estratégias em cascata
   0: youtube-transcript (funciona quando IP não bloqueado)
   1: InnerTube player API (JSON puro, menos bloqueado)
   2: Timed Text API directa
   ════════════════════════════════════════════════════════════════════ */
const { YoutubeTranscript } = require("youtube-transcript");

const TRANSCRIPT_TTL  = 6 * 60 * 60 * 1000;
const TRANSCRIPT_FAIL = 15 * 60 * 1000;

const YT_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

function cleanText(raw) {
  return (raw || "")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, " ").trim();
}

function eventsToSegments(events) {
  return (events || [])
    .filter(ev => ev.segs?.length)
    .map(ev => ({
      start: (ev.tStartMs  || 0) / 1000,
      dur:   Math.max((ev.dDurationMs || 2000) / 1000, 0.3),
      text:  ev.segs.map(s => (s.utf8 || "").replace(/\n/g, " ")).join("").replace(/\s+/g, " ").trim(),
    }))
    .filter(s => s.text);
}

async function tryYoutubeTranscript(videoId) {
  try {
    let raw;
    try { raw = await YoutubeTranscript.fetchTranscript(videoId, { lang: "en" }); }
    catch { raw = await YoutubeTranscript.fetchTranscript(videoId); }
    if (!raw?.length) return null;
    const segs = raw
      .map(i => ({ start: i.offset / 1000, dur: Math.max(i.duration / 1000, 0.3), text: cleanText(i.text) }))
      .filter(s => s.text);
    return segs.length >= 3 ? segs : null;
  } catch { return null; }
}

async function tryInnerTube(videoId) {
  try {
    const res = await fetch(
      "https://www.youtube.com/youtubei/v1/player?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-YouTube-Client-Name": "1",
          "X-YouTube-Client-Version": "2.20240101.00.00",
          "User-Agent": YT_UA,
          "Accept-Language": "en-US,en;q=0.9",
        },
        body: JSON.stringify({
          context: { client: { clientName: "WEB", clientVersion: "2.20240101.00.00", hl: "en", gl: "US" } },
          videoId,
          racyCheckOk: false, contentCheckOk: false,
        }),
        signal: AbortSignal.timeout(10000),
      }
    );
    if (!res.ok) return null;
    const data = await res.json().catch(() => null);
    const tracks = data?.captions?.playerCaptionsTracklistRenderer?.captionTracks || [];
    const track = tracks.find(t => t.languageCode === "en") ||
                  tracks.find(t => t.languageCode?.startsWith("en")) || tracks[0];
    if (!track?.baseUrl) return null;
    const cr = await fetch(
      decodeURIComponent(track.baseUrl) + "&fmt=json3",
      { headers: { "User-Agent": YT_UA }, signal: AbortSignal.timeout(8000) }
    );
    if (!cr.ok) return null;
    const cd = await cr.json().catch(() => null);
    const segs = eventsToSegments(cd?.events);
    return segs.length >= 3 ? segs : null;
  } catch { return null; }
}

async function tryTimedText(videoId) {
  for (const suffix of ["&lang=en", "&lang=en&kind=asr", "&lang=en-US"]) {
    try {
      const r = await fetch(
        `https://www.youtube.com/api/timedtext?v=${videoId}${suffix}&fmt=json3`,
        { headers: { "User-Agent": YT_UA }, signal: AbortSignal.timeout(6000) }
      );
      if (!r.ok) continue;
      const d = await r.json().catch(() => null);
      const segs = eventsToSegments(d?.events);
      if (segs.length >= 3) return segs;
    } catch { /* próximo */ }
  }
  return null;
}

async function fetchTranscript(videoId) {
  const cacheKey = `transcript:${videoId}`;
  const cached   = cacheGet(cacheKey);
  if (cached !== null) return { data: cached, fromCache: true };

  const segments =
    await tryYoutubeTranscript(videoId) ||
    await tryInnerTube(videoId)         ||
    await tryTimedText(videoId)         ||
    [];

  cacheSet(cacheKey, segments, segments.length ? TRANSCRIPT_TTL : TRANSCRIPT_FAIL);
  if (!segments.length) console.info(`[transcript] ${videoId}: sem legendas`);
  return { data: segments, fromCache: false };
}

module.exports = { searchVideos, getVideoDetails, getStatus, fetchTranscript };
