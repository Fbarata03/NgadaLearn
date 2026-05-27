/* ════════════════════════════════════════════════════════════════════
   NgadaLearn — Music Player (YouTube Data API v3)
   Aulas de Música para Aprender Inglês
   ════════════════════════════════════════════════════════════════════ */

import { useState, useEffect, useRef, useCallback } from "react";

// ── Tipos ──────────────────────────────────────────────────────────
interface YTVideo {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  duration?: string;
}

type PlaybackRate = 0.5 | 0.75 | 1;

// ── Constantes ────────────────────────────────────────────────────
const API_KEY = "AIzaSyCWKQ6Ekd_DZvqVvwq-cWrUDHS7mF51ZhE";

const SPEED_OPTIONS: { label: string; value: PlaybackRate }[] = [
  { label: "0.5×", value: 0.5 },
  { label: "0.75×", value: 0.75 },
  { label: "1×", value: 1 },
];

const SUGGESTED_SEARCHES = [
  "English learning songs for beginners",
  "English pronunciation music",
  "Learn English through songs",
  "English pop songs with lyrics",
  "English songs for ESL students",
];

// ── Utilitário: iframe postMessage ────────────────────────────────
function postToPlayer(iframe: HTMLIFrameElement | null, data: object) {
  iframe?.contentWindow?.postMessage(JSON.stringify(data), "*");
}

// ── Componente principal ──────────────────────────────────────────
export function MusicPlayer() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<YTVideo[]>([]);
  const [selected, setSelected] = useState<YTVideo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [speed, setSpeed] = useState<PlaybackRate>(1);
  const [lyricsEn, setLyricsEn] = useState("");
  const [lyricsPt, setLyricsPt] = useState("");
  const [notes, setNotes] = useState("");
  const [activeTab, setActiveTab] = useState<"lyrics" | "notes">("lyrics");
  const [playerReady, setPlayerReady] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // ── Pesquisa na API do YouTube ─────────────────────────────────
  const searchVideos = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const params = new URLSearchParams({
        part: "snippet",
        q: searchQuery,
        type: "video",
        videoCategoryId: "10",
        maxResults: "12",
        key: API_KEY,
        relevanceLanguage: "en",
        safeSearch: "moderate",
      });

      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?${params}`
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error?.message || "Erro na pesquisa.");
      }

      const data = await res.json();

      const videos: YTVideo[] = (data.items || []).map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails?.medium?.url || "",
      }));

      setResults(videos);
    } catch (e: any) {
      setError(e.message || "Não foi possível carregar vídeos.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Pesquisa inicial ao entrar ─────────────────────────────────
  useEffect(() => {
    searchVideos("learn English through music official video");
  }, [searchVideos]);

  // ── Controlo de velocidade via postMessage ─────────────────────
  useEffect(() => {
    if (!playerReady) return;
    postToPlayer(iframeRef.current, {
      event: "command",
      func: "setPlaybackRate",
      args: [speed],
    });
  }, [speed, playerReady]);

  // ── Escuta mensagens do player ─────────────────────────────────
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      try {
        const data =
          typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data?.event === "onReady") setPlayerReady(true);
      } catch (_) {}
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  // ── Seleccionar vídeo ─────────────────────────────────────────
  function handleSelect(video: YTVideo) {
    setSelected(video);
    setPlayerReady(false);
    setSpeed(1);
  }

  // ── Submit do formulário de pesquisa ──────────────────────────
  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    searchVideos(query);
  }

  // ── URL do embed ──────────────────────────────────────────────
  const embedUrl = selected
    ? `https://www.youtube-nocookie.com/embed/${selected.id}?enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}&rel=0&modestbranding=1`
    : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white pb-12">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-700 py-8 px-4 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-4xl">🎵</span>
          <h1 className="text-3xl font-bold tracking-tight">
            Música para Aprender Inglês
          </h1>
          <span className="text-4xl">🎵</span>
        </div>
        <p className="text-purple-200 text-sm max-w-xl mx-auto">
          Aprende inglês ouvindo música! Controla a velocidade, lê as letras e
          faz as tuas anotações enquanto ouves.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Coluna esquerda: pesquisa + resultados ──────────── */}
        <div className="lg:col-span-1 space-y-4">
          {/* Barra de pesquisa */}
          <form
            onSubmit={handleSearch}
            className="bg-white/10 backdrop-blur rounded-xl p-4 space-y-3"
          >
            <label className="block text-sm font-semibold text-purple-200 uppercase tracking-wide">
              🔍 Pesquisar Música
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex: Ed Sheeran Perfect lyrics…"
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm placeholder-white/40 focus:outline-none focus:border-purple-400"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                {loading ? "…" : "Ir"}
              </button>
            </div>

            {/* Sugestões rápidas */}
            <div className="flex flex-wrap gap-1">
              {SUGGESTED_SEARCHES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setQuery(s);
                    searchVideos(s);
                  }}
                  className="text-xs bg-purple-800/60 hover:bg-purple-700 rounded-full px-2 py-1 transition-colors"
                >
                  {s.length > 28 ? s.slice(0, 25) + "…" : s}
                </button>
              ))}
            </div>
          </form>

          {/* Erro */}
          {error && (
            <div className="bg-red-500/20 border border-red-400/40 rounded-xl p-3 text-sm text-red-300">
              ⚠️ {error}
            </div>
          )}

          {/* Lista de resultados */}
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
            {loading && (
              <div className="text-center py-8 text-purple-300">
                <div className="animate-spin text-3xl mb-2">⏳</div>
                <p className="text-sm">A carregar vídeos…</p>
              </div>
            )}
            {!loading && results.length === 0 && !error && (
              <p className="text-center text-white/40 text-sm py-8">
                Nenhum resultado encontrado.
              </p>
            )}
            {results.map((video) => (
              <button
                key={video.id}
                onClick={() => handleSelect(video)}
                className={`w-full text-left flex gap-3 p-3 rounded-xl transition-all ${
                  selected?.id === video.id
                    ? "bg-purple-600/60 border border-purple-400"
                    : "bg-white/5 hover:bg-white/10 border border-transparent"
                }`}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-20 h-14 object-cover rounded-lg flex-shrink-0"
                  loading="lazy"
                />
                <div className="overflow-hidden">
                  <p className="text-sm font-medium line-clamp-2 leading-snug">
                    {video.title}
                  </p>
                  <p className="text-xs text-purple-300 mt-1 truncate">
                    {video.channel}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Coluna direita: player + ferramentas ────────────── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Player */}
          <div className="bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video relative">
            {selected ? (
              <iframe
                ref={iframeRef}
                key={selected.id}
                src={embedUrl}
                title={selected.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                onLoad={() => {
                  // Aguarda o player estar pronto via postMessage
                  setTimeout(() => setPlayerReady(true), 2000);
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white/30 gap-4">
                <span className="text-6xl">🎶</span>
                <p className="text-lg font-medium">
                  Selecciona uma música para começar
                </p>
                <p className="text-sm">
                  Pesquisa e clica num vídeo da lista à esquerda
                </p>
              </div>
            )}
          </div>

          {/* Controlo de velocidade */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <p className="text-xs font-semibold text-purple-200 uppercase tracking-wide mb-3">
              🐢 Velocidade de Reprodução
            </p>
            <div className="flex gap-2">
              {SPEED_OPTIONS.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setSpeed(value)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                    speed === value
                      ? "bg-purple-600 text-white shadow-lg scale-105"
                      : "bg-white/10 hover:bg-white/20 text-white/70"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {speed !== 1 && (
              <p className="text-xs text-yellow-300 mt-2">
                ⚡ Dica: velocidade reduzida ajuda a entender a pronúncia!
                Atenção: o controlo de velocidade via API pode requerer que o
                vídeo esteja a reproduzir.
              </p>
            )}
          </div>

          {/* Abas: Letras + Anotações */}
          <div className="bg-white/10 backdrop-blur rounded-xl overflow-hidden">
            {/* Tab bar */}
            <div className="flex border-b border-white/10">
              <button
                onClick={() => setActiveTab("lyrics")}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                  activeTab === "lyrics"
                    ? "bg-purple-700/60 text-white"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                📝 Letras
              </button>
              <button
                onClick={() => setActiveTab("notes")}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                  activeTab === "notes"
                    ? "bg-indigo-700/60 text-white"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                🗒️ Anotações
              </button>
            </div>

            {/* Conteúdo das abas */}
            <div className="p-4">
              {activeTab === "lyrics" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Letra em inglês */}
                  <div>
                    <label className="block text-xs font-semibold text-purple-300 uppercase tracking-wide mb-2">
                      🇬🇧 Letra em Inglês
                    </label>
                    <textarea
                      value={lyricsEn}
                      onChange={(e) => setLyricsEn(e.target.value)}
                      placeholder="Cola aqui a letra da música em inglês…"
                      rows={10}
                      className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-white/30 resize-y focus:outline-none focus:border-purple-400 font-mono leading-relaxed"
                    />
                  </div>

                  {/* Tradução / notas em português */}
                  <div>
                    <label className="block text-xs font-semibold text-purple-300 uppercase tracking-wide mb-2">
                      🇵🇹 Tradução / Notas em Português
                    </label>
                    <textarea
                      value={lyricsPt}
                      onChange={(e) => setLyricsPt(e.target.value)}
                      placeholder="Escreve aqui a tradução ou as tuas notas em português…"
                      rows={10}
                      className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-white/30 resize-y focus:outline-none focus:border-purple-400 font-mono leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {activeTab === "notes" && (
                <div>
                  <label className="block text-xs font-semibold text-indigo-300 uppercase tracking-wide mb-2">
                    🗒️ Bloco de Anotações em Tempo Real
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={`Usa este espaço para escrever enquanto ouves a música:
• Palavras novas que aprendeste
• Frases que queres memorizar
• Pronúncias difíceis
• Expressões idiomáticas encontradas
• Questões para pesquisar depois…`}
                    rows={14}
                    className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-white/30 resize-y focus:outline-none focus:border-indigo-400 font-mono leading-relaxed"
                  />
                  {notes && (
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-white/40">
                        {notes.length} caracteres
                      </p>
                      <button
                        onClick={() => {
                          const blob = new Blob([notes], {
                            type: "text/plain",
                          });
                          const a = document.createElement("a");
                          a.href = URL.createObjectURL(blob);
                          a.download = `notas-${selected?.title?.replace(/[^a-z0-9]/gi, "_").slice(0, 30) || "musica"}.txt`;
                          a.click();
                        }}
                        className="text-xs bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-lg transition-colors"
                      >
                        💾 Guardar como .txt
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Dicas de aprendizagem */}
          <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/20 rounded-xl p-4">
            <p className="text-xs font-semibold text-yellow-300 uppercase tracking-wide mb-2">
              💡 Dicas para Aprender com Música
            </p>
            <ul className="text-xs text-white/70 space-y-1 list-none">
              <li>🐢 Começa a <strong>0.75×</strong> para ouvir cada palavra claramente</li>
              <li>📝 Copia a letra e sublinha as expressões que não conheces</li>
              <li>🔁 Repete as partes difíceis várias vezes</li>
              <li>🗣️ Canta junto com a música para melhorar a pronúncia</li>
              <li>📖 Procura o significado de palavras novas no teu bloco de notas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
