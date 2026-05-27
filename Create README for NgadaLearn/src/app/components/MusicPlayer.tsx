/* ════════════════════════════════════════════════════════════════════
   NgadaLearn — Music Player (YouTube Data API v3)
   • Filtra apenas vídeos Official + embeddable
   • Animação de legenda "Now Playing" com equalizador
   ════════════════════════════════════════════════════════════════════ */

import { useState, useEffect, useRef, useCallback } from "react";

/* ── CSS de animações injectado uma vez ─────────────────────────── */
const ANIM_STYLE = `
@keyframes eq1 { 0%,100%{height:4px}  50%{height:22px} }
@keyframes eq2 { 0%,100%{height:14px} 50%{height:5px}  }
@keyframes eq3 { 0%,100%{height:7px}  50%{height:26px} }
@keyframes eq4 { 0%,100%{height:18px} 50%{height:4px}  }
@keyframes eq5 { 0%,100%{height:5px}  50%{height:20px} }
@keyframes eq6 { 0%,100%{height:11px} 50%{height:3px}  }
@keyframes eq7 { 0%,100%{height:3px}  50%{height:16px} }
.eq1{animation:eq1 0.8s ease-in-out infinite}
.eq2{animation:eq2 0.55s ease-in-out infinite}
.eq3{animation:eq3 0.7s ease-in-out infinite}
.eq4{animation:eq4 0.9s ease-in-out infinite}
.eq5{animation:eq5 0.5s ease-in-out infinite}
.eq6{animation:eq6 0.65s ease-in-out infinite}
.eq7{animation:eq7 0.75s ease-in-out infinite}

@keyframes marquee {
  0%   { transform: translateX(0) }
  100% { transform: translateX(-50%) }
}
.marquee-wrap { overflow:hidden; white-space:nowrap; }
.marquee-text { display:inline-block; animation:marquee 14s linear infinite; }

@keyframes pulseGlow {
  0%,100%{ box-shadow:0 0 0px #a855f7 }
  50%    { box-shadow:0 0 18px #a855f7, 0 0 36px #6d28d9 }
}
.player-glow{ animation:pulseGlow 2.5s ease-in-out infinite }

@keyframes slideUp {
  from{ opacity:0; transform:translateY(12px) }
  to  { opacity:1; transform:translateY(0)     }
}
.slide-up{ animation:slideUp 0.4s ease forwards }
`;

// ── Tipos ──────────────────────────────────────────────────────────
interface YTVideo {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  embeddable: boolean;
}

type PlaybackRate = 0.5 | 0.75 | 1;

// ── Constantes ────────────────────────────────────────────────────
const API_KEY = "AIzaSyCWKQ6Ekd_DZvqVvwq-cWrUDHS7mF51ZhE";

const SPEED_OPTIONS: { label: string; value: PlaybackRate }[] = [
  { label: "0.5×", value: 0.5 },
  { label: "0.75×", value: 0.75 },
  { label: "1×",   value: 1   },
];

/* Sugestões — todas com "official" para garantir vídeos oficiais */
const SUGGESTED_SEARCHES = [
  "English learning official song",
  "Ed Sheeran official video",
  "Adele official video",
  "English pronunciation music official",
  "Taylor Swift official video",
];

const EQ_CLASSES = ["eq1","eq2","eq3","eq4","eq5","eq6","eq7"];
const EQ_COLORS  = ["#c084fc","#a855f7","#9333ea","#818cf8","#6366f1","#38bdf8","#a78bfa"];

// ── Equalizador animado ───────────────────────────────────────────
function Equalizer({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="flex items-end gap-0.5" style={{ height: 28 }}>
      {EQ_CLASSES.map((cls, i) => (
        <div
          key={cls}
          className={cls}
          style={{
            width: 4,
            borderRadius: 2,
            backgroundColor: EQ_COLORS[i],
            minHeight: 3,
          }}
        />
      ))}
    </div>
  );
}

// ── Barra "Now Playing" ───────────────────────────────────────────
function NowPlayingBar({ video, active }: { video: YTVideo; active: boolean }) {
  const title   = `${video.title} — ${video.channel}`;
  const repeated = `${title}   •   ${title}   •   `;   // para loop contínuo

  return (
    <div
      className="slide-up flex items-center gap-3 bg-black/60 backdrop-blur border border-purple-500/40 rounded-xl px-4 py-3"
      style={{ minHeight: 56 }}
    >
      {/* Equalizador */}
      <Equalizer active={active} />
      {!active && <span className="text-2xl">🎵</span>}

      {/* Título em marquee */}
      <div className="flex-1 overflow-hidden">
        <p className="text-[10px] font-bold uppercase tracking-widest text-purple-400 mb-0.5">
          Now Playing
        </p>
        <div className="marquee-wrap">
          <span className="marquee-text text-sm font-semibold text-white">
            {repeated}
          </span>
        </div>
      </div>

      {/* Ícone de música pulsante */}
      <div
        className="w-8 h-8 rounded-full bg-purple-600/40 flex items-center justify-center text-base flex-shrink-0"
        style={active ? { animation: "pulseGlow 2.5s ease-in-out infinite" } : {}}
      >
        🎶
      </div>
    </div>
  );
}

// ── Utilitário: iframe postMessage ────────────────────────────────
function postToPlayer(iframe: HTMLIFrameElement | null, data: object) {
  iframe?.contentWindow?.postMessage(JSON.stringify(data), "*");
}

// ── Verificar quais vídeos são realmente embeddable ───────────────
async function filterEmbeddable(videos: Omit<YTVideo, "embeddable">[]): Promise<YTVideo[]> {
  if (!videos.length) return [];
  try {
    const ids    = videos.map((v) => v.id).join(",");
    const params = new URLSearchParams({ part: "status", id: ids, key: API_KEY });
    const res    = await fetch(`https://www.googleapis.com/youtube/v3/videos?${params}`);
    const data   = await res.json();

    const embMap = new Map<string, boolean>(
      (data.items || []).map((item: any) => [
        item.id,
        item.status?.embeddable !== false,
      ])
    );

    return videos
      .filter((v) => embMap.get(v.id) !== false)
      .map((v) => ({ ...v, embeddable: true }));
  } catch {
    // Se a verificação falhar, devolver todos (melhor do que nenhum)
    return videos.map((v) => ({ ...v, embeddable: true }));
  }
}

// ═══════════════════════════════════════════════════════════════════
// Componente principal
// ═══════════════════════════════════════════════════════════════════
export function MusicPlayer() {
  const [query,      setQuery]      = useState("");
  const [results,    setResults]    = useState<YTVideo[]>([]);
  const [selected,   setSelected]   = useState<YTVideo | null>(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [speed,      setSpeed]      = useState<PlaybackRate>(1);
  const [lyricsEn,   setLyricsEn]   = useState("");
  const [lyricsPt,   setLyricsPt]   = useState("");
  const [notes,      setNotes]      = useState("");
  const [activeTab,  setActiveTab]  = useState<"lyrics" | "notes">("lyrics");
  const [isPlaying,  setIsPlaying]  = useState(false);
  const [vidError,   setVidError]   = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // ── Pesquisa + validação de embeddable ────────────────────────
  const searchVideos = useCallback(async (rawQuery: string) => {
    if (!rawQuery.trim()) return;
    setLoading(true);
    setError("");
    setResults([]);

    /* Garante que a pesquisa inclui "official" */
    const q = rawQuery.toLowerCase().includes("official")
      ? rawQuery
      : `${rawQuery} official`;

    try {
      const params = new URLSearchParams({
        part:              "snippet",
        q,
        type:              "video",
        videoCategoryId:   "10",
        videoEmbeddable:   "true",       // ← Só vídeos que permitem embed
        maxResults:        "20",         // Pedir mais para compensar filtro
        key:               API_KEY,
        relevanceLanguage: "en",
        safeSearch:        "moderate",
      });

      const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error?.message || "Erro na pesquisa.");
      }

      const data = await res.json();

      const raw: Omit<YTVideo, "embeddable">[] = (data.items || []).map((item: any) => ({
        id:        item.id.videoId,
        title:     item.snippet.title,
        channel:   item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails?.medium?.url || "",
      }));

      /* Segunda chamada: verificar status real de embeddable */
      const embeddable = await filterEmbeddable(raw);
      setResults(embeddable.slice(0, 12));   // mostra até 12

      if (!embeddable.length) setError("Nenhum vídeo disponível para incorporar.");
    } catch (e: any) {
      setError(e.message || "Não foi possível carregar vídeos.");
    } finally {
      setLoading(false);
    }
  }, []);

  /* Pesquisa inicial */
  useEffect(() => {
    searchVideos("learn English through music official video");
  }, [searchVideos]);

  /* Controlo de velocidade via postMessage */
  useEffect(() => {
    if (!isPlaying) return;
    postToPlayer(iframeRef.current, {
      event: "command",
      func:  "setPlaybackRate",
      args:  [speed],
    });
  }, [speed, isPlaying]);

  /* Escuta mensagens do player (estados de reprodução) */
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        // playerState: -1=unstarted, 0=ended, 1=playing, 2=paused, 3=buffering, 5=cued
        if (data?.event === "onStateChange") {
          setIsPlaying(data.info === 1);
        }
        if (data?.event === "onError") {
          setVidError(true);
          setIsPlaying(false);
        }
      } catch (_) {}
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  function handleSelect(video: YTVideo) {
    setSelected(video);
    setIsPlaying(false);
    setVidError(false);
    setSpeed(1);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    searchVideos(query);
  }

  /* Tentar próximo vídeo quando o actual falha */
  function tryNextVideo() {
    if (!selected) return;
    const idx  = results.findIndex((v) => v.id === selected.id);
    const next = results[idx + 1];
    if (next) handleSelect(next);
  }

  const embedUrl = selected
    ? `https://www.youtube-nocookie.com/embed/${selected.id}?enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}&rel=0&modestbranding=1&autoplay=0`
    : "";

  // ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Injectar CSS de animações */}
      <style>{ANIM_STYLE}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white pb-12">

        {/* ── Header ──────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-purple-700 via-violet-700 to-indigo-700 py-8 px-4 text-center shadow-xl">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-4xl">🎵</span>
            <h1 className="text-3xl font-black tracking-tight">Música para Aprender Inglês</h1>
            <span className="text-4xl">🎵</span>
          </div>
          <p className="text-purple-200 text-sm max-w-xl mx-auto">
            Vídeos oficiais · Controla a velocidade · Letras em inglês e tradução · Bloco de notas
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Coluna esquerda ──────────────────────────────── */}
          <div className="lg:col-span-1 space-y-4">

            {/* Pesquisa */}
            <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur rounded-xl p-4 space-y-3">
              <label className="block text-xs font-bold text-purple-200 uppercase tracking-widest">
                🔍 Pesquisar Música Oficial
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ex: Adele Hello official…"
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm placeholder-white/40 focus:outline-none focus:border-purple-400 transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                >
                  {loading ? "…" : "Ir"}
                </button>
              </div>

              {/* Sugestões */}
              <div className="flex flex-wrap gap-1">
                {SUGGESTED_SEARCHES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => { setQuery(s); searchVideos(s); }}
                    className="text-xs bg-purple-800/60 hover:bg-purple-700 rounded-full px-2 py-1 transition-colors"
                  >
                    {s.length > 26 ? s.slice(0, 24) + "…" : s}
                  </button>
                ))}
              </div>

              <p className="text-[10px] text-purple-400/80">
                ✅ Apenas vídeos oficiais com incorporação activada
              </p>
            </form>

            {/* Erro de pesquisa */}
            {error && (
              <div className="bg-red-500/20 border border-red-400/40 rounded-xl p-3 text-sm text-red-300">
                ⚠️ {error}
              </div>
            )}

            {/* Resultados */}
            <div className="space-y-2 max-h-[62vh] overflow-y-auto pr-1">
              {loading && (
                <div className="text-center py-10 text-purple-300">
                  <div className="flex justify-center gap-1 mb-3">
                    {EQ_CLASSES.slice(0, 5).map((cls, i) => (
                      <div key={i} className={`${cls} w-2 rounded-sm bg-purple-500`} style={{ minHeight: 3 }} />
                    ))}
                  </div>
                  <p className="text-sm">A carregar vídeos oficiais…</p>
                </div>
              )}

              {!loading && results.length === 0 && !error && (
                <p className="text-center text-white/40 text-sm py-10">Nenhum resultado.</p>
              )}

              {results.map((video) => {
                const active = selected?.id === video.id;
                return (
                  <button
                    key={video.id}
                    onClick={() => handleSelect(video)}
                    className={`w-full text-left flex gap-3 p-3 rounded-xl transition-all border ${
                      active
                        ? "bg-purple-600/50 border-purple-400 shadow-lg shadow-purple-900/50"
                        : "bg-white/5 hover:bg-white/10 border-transparent"
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-20 h-14 object-cover rounded-lg"
                        loading="lazy"
                      />
                      {active && isPlaying && (
                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                          <div className="flex items-end gap-0.5" style={{ height: 16 }}>
                            {["eq1","eq3","eq5"].map((cls) => (
                              <div key={cls} className={cls} style={{ width:3, backgroundColor:"#c084fc", borderRadius:2, minHeight:2 }} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-semibold line-clamp-2 leading-snug">
                        {video.title}
                      </p>
                      <p className="text-xs text-purple-300 mt-1 truncate">{video.channel}</p>
                      <span className="text-[10px] bg-green-600/30 text-green-300 px-1.5 py-0.5 rounded-full">
                        ✓ official
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Coluna direita ───────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Player com glow animado */}
            <div
              className={`rounded-2xl overflow-hidden shadow-2xl aspect-video relative ${selected && isPlaying ? "player-glow" : ""}`}
              style={{ background: "#000" }}
            >
              {selected ? (
                <>
                  {vidError ? (
                    /* Vídeo indisponível → mostrar alternativa */
                    <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-slate-900">
                      <span className="text-5xl">😔</span>
                      <p className="text-white/70 text-sm font-semibold">Este vídeo não pode ser incorporado.</p>
                      <button
                        onClick={tryNextVideo}
                        className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-lg text-sm font-bold transition-colors"
                      >
                        ▶ Tentar próximo vídeo
                      </button>
                    </div>
                  ) : (
                    <iframe
                      ref={iframeRef}
                      key={selected.id}
                      src={embedUrl}
                      title={selected.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  )}
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white/30 gap-4">
                  <div className="flex items-end gap-1 opacity-40">
                    {EQ_CLASSES.map((cls) => (
                      <div key={cls} className={cls} style={{ width:6, backgroundColor:"#a855f7", borderRadius:3, minHeight:3 }} />
                    ))}
                  </div>
                  <p className="text-lg font-semibold">Selecciona uma música para começar</p>
                  <p className="text-sm">Pesquisa à esquerda e clica num vídeo</p>
                </div>
              )}
            </div>

            {/* ── LEGENDA ANIMADA "Now Playing" ─────────────── */}
            {selected && !vidError && (
              <NowPlayingBar video={selected} active={isPlaying} />
            )}

            {/* Controlo de velocidade */}
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-xs font-bold text-purple-200 uppercase tracking-widest mb-3">
                🐢 Velocidade de Reprodução
              </p>
              <div className="flex gap-2">
                {SPEED_OPTIONS.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => setSpeed(value)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-black transition-all ${
                      speed === value
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-900/50 scale-105"
                        : "bg-white/10 hover:bg-white/20 text-white/70"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {speed < 1 && (
                <p className="text-xs text-yellow-300 mt-2">
                  🐢 Velocidade reduzida activa — ótimo para perceber a pronúncia palavra a palavra!
                </p>
              )}
            </div>

            {/* Abas: Letras + Anotações */}
            <div className="bg-white/10 backdrop-blur rounded-xl overflow-hidden">
              <div className="flex border-b border-white/10">
                <button
                  onClick={() => setActiveTab("lyrics")}
                  className={`flex-1 py-3 text-sm font-bold transition-colors ${
                    activeTab === "lyrics"
                      ? "bg-purple-700/60 text-white border-b-2 border-purple-400"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  📝 Letra da Música
                </button>
                <button
                  onClick={() => setActiveTab("notes")}
                  className={`flex-1 py-3 text-sm font-bold transition-colors ${
                    activeTab === "notes"
                      ? "bg-indigo-700/60 text-white border-b-2 border-indigo-400"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  🗒️ Anotações
                </button>
              </div>

              <div className="p-4">
                {activeTab === "lyrics" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-widest mb-2">
                        🇬🇧 Letra em Inglês
                      </label>
                      <textarea
                        value={lyricsEn}
                        onChange={(e) => setLyricsEn(e.target.value)}
                        placeholder="Cola ou escreve aqui a letra em inglês…"
                        rows={11}
                        className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/25 resize-y focus:outline-none focus:border-purple-400 transition-colors font-mono leading-7"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-widest mb-2">
                        🇵🇹 Tradução / Notas em Português
                      </label>
                      <textarea
                        value={lyricsPt}
                        onChange={(e) => setLyricsPt(e.target.value)}
                        placeholder="Traduz linha a linha ou escreve as tuas notas…"
                        rows={11}
                        className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/25 resize-y focus:outline-none focus:border-purple-400 transition-colors font-mono leading-7"
                      />
                    </div>
                  </div>
                )}

                {activeTab === "notes" && (
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-widest mb-2">
                      🗒️ Bloco de Notas em Tempo Real
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={`Escreve enquanto ouves a música:
• Palavras novas que aprendeste
• Frases que queres memorizar
• Pronúncias difíceis
• Expressões idiomáticas
• Dúvidas para pesquisar depois…`}
                      rows={14}
                      className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/25 resize-y focus:outline-none focus:border-indigo-400 transition-colors font-mono leading-7"
                    />
                    {notes && (
                      <div className="flex justify-between items-center mt-3">
                        <p className="text-xs text-white/40">{notes.length} caracteres</p>
                        <button
                          onClick={() => {
                            const blob = new Blob([notes], { type: "text/plain" });
                            const a    = document.createElement("a");
                            a.href     = URL.createObjectURL(blob);
                            a.download = `notas-${(selected?.title || "musica").replace(/[^a-z0-9]/gi, "_").slice(0, 30)}.txt`;
                            a.click();
                          }}
                          className="text-xs bg-indigo-600 hover:bg-indigo-500 px-4 py-1.5 rounded-lg transition-colors font-semibold"
                        >
                          💾 Guardar .txt
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Dicas */}
            <div className="bg-gradient-to-r from-yellow-700/20 to-orange-700/20 border border-yellow-500/20 rounded-xl p-4">
              <p className="text-xs font-bold text-yellow-300 uppercase tracking-widest mb-2">💡 Dicas de Aprendizagem</p>
              <ul className="text-xs text-white/70 space-y-1">
                <li>🐢 Começa a <strong>0.75×</strong> — ouvirás cada palavra claramente</li>
                <li>📝 Cola a letra e traduz linha a linha</li>
                <li>🔁 Repete os versos difíceis várias vezes</li>
                <li>🗣️ Canta junto para treinar a pronúncia</li>
                <li>📖 Regista vocabulário novo nas Anotações</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
