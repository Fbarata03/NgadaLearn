/* ════════════════════════════════════════════════════════════════════
   NgadaLearn — Movies Player
   Cenas de filmes reais · YT IFrame API · CC automático
   Filtro contra reacções/paródias · Velocidade · Vocabulário
   ════════════════════════════════════════════════════════════════════ */

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ── Declaração do namespace YT ──────────────────────────────────── */
declare global {
  interface Window { YT: any; onYouTubeIframeAPIReady?: () => void; }
}

/* ── CSS animações ───────────────────────────────────────────────── */
const ANIM = `
@keyframes meq1{0%,100%{height:4px}  50%{height:20px}}
@keyframes meq2{0%,100%{height:12px} 50%{height:4px}}
@keyframes meq3{0%,100%{height:6px}  50%{height:24px}}
@keyframes meq4{0%,100%{height:16px} 50%{height:3px}}
@keyframes meq5{0%,100%{height:4px}  50%{height:18px}}
.meq1{animation:meq1 .9s ease-in-out infinite}
.meq2{animation:meq2 .6s ease-in-out infinite}
.meq3{animation:meq3 .75s ease-in-out infinite}
.meq4{animation:meq4 .85s ease-in-out infinite}
.meq5{animation:meq5 .5s ease-in-out infinite}

@keyframes mmarquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
.mmarquee-wrap{overflow:hidden;white-space:nowrap}
.mmarquee-text{display:inline-block;animation:mmarquee 18s linear infinite}

@keyframes mglow{0%,100%{box-shadow:0 0 0 #f59e0b}50%{box-shadow:0 0 22px #f59e0b,0 0 44px #b45309}}
.movie-glow{animation:mglow 2.8s ease-in-out infinite}

@keyframes mslide{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.mslide{animation:mslide .35s ease forwards}

@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
.shimmer{
  background:linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.10) 50%,rgba(255,255,255,.04) 75%);
  background-size:200% 100%;
  animation:shimmer 2s infinite;
}
`;

/* ── Tipos ───────────────────────────────────────────────────────── */
interface MovieClip {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  isOfficial: boolean;
}

interface SavedPhrase {
  id: number;
  en: string;
  pt: string;
}

type PlaybackRate = 0.5 | 0.75 | 1;
type Difficulty   = "Iniciante" | "Intermediário" | "Avançado";

/* ── Palavras-chave a excluir (client-side) ──────────────────────── */
const BAD_WORDS = [
  "reaction","react","reacts","reacting",
  "parody","spoof","meme","funny version",
  "explained","explanation","analysis","analyzed",
  "review","ranked","every time","ruined",
  "but it's","but with","trailer","teaser",
  "behind the scenes","making of","bloopers","fails",
  "fan made","animation vs","versus","commentary",
];

/* ── Canais/termos oficiais (reforço positivo) ───────────────────── */
const OFFICIAL_SIGNALS = [
  "official","movies","pictures","studios","entertainment",
  "disney","marvel","warner","universal","sony","paramount",
  "mgm","lionsgate","hbo","netflix","amazon","apple",
  "20th century","dreamworks","pixar","columbia",
  "miramax","criterion","a24",
];

/* ── Sugestões curadas de filmes ─────────────────────────────────── */
const CURATED: {
  icon:string; label:string; query:string;
  genre:string; diff:Difficulty; tip:string;
}[] = [
  { icon:"🍫", label:"Forrest Gump",             query:"Forrest Gump official movie clip",          genre:"Drama",    diff:"Iniciante",     tip:"Inglês americano simples e claro" },
  { icon:"🌟", label:"The Pursuit of Happyness",  query:"Pursuit of Happyness official clip scene",  genre:"Drama",    diff:"Iniciante",     tip:"Diálogo emocional muito acessível" },
  { icon:"🦁", label:"The Lion King",             query:"Lion King official clip Disney",            genre:"Animação", diff:"Iniciante",     tip:"Perfeito para vocabulário base" },
  { icon:"📚", label:"Dead Poets Society",        query:"Dead Poets Society official clip",          genre:"Drama",    diff:"Intermediário", tip:"Vocabulário literário e eloquente" },
  { icon:"🦇", label:"The Dark Knight",           query:"Dark Knight official movie clip scene",     genre:"Acção",    diff:"Intermediário", tip:"Inglês urbano e tenso" },
  { icon:"💊", label:"The Matrix",                query:"Matrix official movie clip scene",          genre:"Sci-Fi",   diff:"Intermediário", tip:"Diálogos filosóficos marcantes" },
  { icon:"🧮", label:"Good Will Hunting",         query:"Good Will Hunting official clip scene",     genre:"Drama",    diff:"Avançado",      tip:"Inglês de Boston, rápido e inteligente" },
  { icon:"💻", label:"The Social Network",        query:"Social Network official movie clip",        genre:"Drama",    diff:"Avançado",      tip:"Inglês rápido e técnico" },
  { icon:"🌀", label:"Inception",                 query:"Inception official clip scene",             genre:"Sci-Fi",   diff:"Avançado",      tip:"Vocabulário complexo e denso" },
  { icon:"🚀", label:"Interstellar",              query:"Interstellar official clip scene",          genre:"Sci-Fi",   diff:"Avançado",      tip:"Linguagem científica e emocional" },
  { icon:"⚖️", label:"Erin Brockovich",           query:"Erin Brockovich official clip scene",       genre:"Drama",    diff:"Intermediário", tip:"Inglês legal americano do dia a dia" },
  { icon:"🏆", label:"A Few Good Men",            query:"A Few Good Men official clip scene",        genre:"Drama",    diff:"Avançado",      tip:"Discurso jurídico poderoso" },
];

const GENRES = ["Todos","Drama","Acção","Sci-Fi","Animação"];

const SPEED_OPT: {label:string;value:PlaybackRate;color:string;tip:string}[] = [
  { label:"0.5×", value:0.5,  color:"bg-red-600",    tip:"Muito lento — cada sílaba clara" },
  { label:"0.75×",value:0.75, color:"bg-yellow-600", tip:"Lento — bom equilíbrio" },
  { label:"1×",   value:1,    color:"bg-green-600",  tip:"Velocidade original" },
];

const DIFF_COLOR: Record<Difficulty,string> = {
  "Iniciante":     "bg-green-500/20 text-green-300 border-green-500/30",
  "Intermediário": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  "Avançado":      "bg-red-500/20 text-red-300 border-red-500/30",
};

const API_KEY = "AIzaSyCWKQ6Ekd_DZvqVvwq-cWrUDHS7mF51ZhE";
const EQ_CLS  = ["meq1","meq2","meq3","meq4","meq5"];
const EQ_COL  = ["#fbbf24","#f59e0b","#d97706","#fcd34d","#fef08a"];

/* ── Utilitários ─────────────────────────────────────────────────── */
function isBadTitle(title: string): boolean {
  const t = title.toLowerCase();
  return BAD_WORDS.some(w => t.includes(w));
}
function isOfficialChannel(ch: string): boolean {
  const c = ch.toLowerCase();
  return OFFICIAL_SIGNALS.some(s => c.includes(s));
}
async function checkEmbeddable(ids: string[]): Promise<Set<string>> {
  try {
    const params = new URLSearchParams({ part:"status", id:ids.join(","), key:API_KEY });
    const res    = await fetch(`https://www.googleapis.com/youtube/v3/videos?${params}`);
    const data   = await res.json();
    return new Set<string>(
      (data.items||[]).filter((i:any) => i.status?.embeddable !== false).map((i:any) => i.id)
    );
  } catch { return new Set(ids); }
}

/* ── Mini equalizador ────────────────────────────────────────────── */
function MovieEQ({active}:{active:boolean}) {
  if (!active) return <span className="text-xl">🎬</span>;
  return (
    <div className="flex items-end gap-0.5" style={{height:26}}>
      {EQ_CLS.map((cls,i) => (
        <div key={cls} className={cls} style={{width:3,borderRadius:2,backgroundColor:EQ_COL[i],minHeight:3}} />
      ))}
    </div>
  );
}

/* ── Barra Now Playing ───────────────────────────────────────────── */
function NowPlayingBar({clip,isPlaying,ccOn}:{clip:MovieClip;isPlaying:boolean;ccOn:boolean}) {
  const text = `${clip.title} — ${clip.channel}   •   ${clip.title} — ${clip.channel}   •   `;
  return (
    <div className="mslide flex items-center gap-3 bg-black/60 backdrop-blur border border-amber-500/30 rounded-xl px-4 py-3">
      <MovieEQ active={isPlaying} />
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
            {isPlaying ? "▶ A reproduzir" : "⏸ Parado"}
          </p>
          {ccOn && (
            <span className="text-[10px] bg-blue-500/30 text-blue-300 border border-blue-400/30 px-1.5 py-0.5 rounded font-bold">
              CC ON
            </span>
          )}
          {clip.isOfficial && (
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">
              ✓ Oficial
            </span>
          )}
        </div>
        <div className="mmarquee-wrap">
          <span className="mmarquee-text text-sm font-semibold text-white">{text}</span>
        </div>
      </div>
      <div className={`w-8 h-8 rounded-full bg-amber-600/30 flex items-center justify-center text-base flex-shrink-0 ${isPlaying ? "movie-glow" : ""}`}>
        🎞️
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ════════════════════════════════════════════════════════════════════ */
export function MoviesPlayer() {
  /* Pesquisa */
  const [query,     setQuery]     = useState("");
  const [results,   setResults]   = useState<MovieClip[]>([]);
  const [loading,   setLoading]   = useState(false);
  const [searchErr, setSearchErr] = useState("");
  const [genreFilter, setGenreFilter] = useState("Todos");

  /* Player */
  const [selected,  setSelected]  = useState<MovieClip|null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [vidError,  setVidError]  = useState(false);
  const [speed,     setSpeed]     = useState<PlaybackRate>(1);
  const [ccOn,      setCcOn]      = useState(true);
  const ytPlayer   = useRef<any>(null);
  const speedRef   = useRef<PlaybackRate>(1);

  /* Vocabulário + Frases + Notas */
  const [vocabWord,   setVocabWord]   = useState("");
  const [vocabTrans,  setVocabTrans]  = useState("");
  const [savedVocab,  setSavedVocab]  = useState<SavedPhrase[]>([]);
  const [phraseEn,    setPhraseEn]    = useState("");
  const [phrasePt,    setPhrasePt]    = useState("");
  const [savedPhrases,setSavedPhrases] = useState<SavedPhrase[]>([]);
  const [notes,       setNotes]       = useState("");
  const [tab,         setTab]         = useState<"vocab"|"phrases"|"notes">("vocab");
  const nextId = useRef(0);

  /* ── Carregar YT API ─────────────────────────────────────────── */
  useEffect(() => {
    if (document.getElementById("yt-api-script-mv")) return;
    const s = document.createElement("script");
    s.id  = "yt-api-script-mv";
    s.src = "https://www.youtube.com/iframe_api";
    s.async = true;
    document.head.appendChild(s);
  }, []);

  /* ── Criar player quando o vídeo muda ───────────────────────── */
  useEffect(() => {
    if (!selected) return;

    function buildPlayer() {
      if (ytPlayer.current) {
        try { ytPlayer.current.destroy(); } catch(_) {}
        ytPlayer.current = null;
      }
      const root = document.getElementById("mv-player-root");
      if (!root) return;
      root.innerHTML = "";
      const div = document.createElement("div");
      div.id = "mv-player-div";
      root.appendChild(div);

      ytPlayer.current = new window.YT.Player("mv-player-div", {
        videoId:    selected!.id,
        width:      "100%",
        height:     "100%",
        playerVars: {
          rel:          0,
          modestbranding: 1,
          playsinline:  1,
          autoplay:     0,
          cc_load_policy: ccOn ? 1 : 0,   // CC automático em inglês
          cc_lang_pref:  "en",
          hl:            "en",
        },
        events: {
          onReady: (e:any) => {
            e.target.setPlaybackRate(speedRef.current);
          },
          onStateChange: (e:any) => {
            setIsPlaying(e.data === 1);
            if (e.data === 1) e.target.setPlaybackRate(speedRef.current);
          },
          onError: () => { setVidError(true); setIsPlaying(false); },
        },
      });
    }

    if (window.YT?.Player) {
      buildPlayer();
    } else {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { prev?.(); buildPlayer(); };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);

  /* ── Cleanup ─────────────────────────────────────────────────── */
  useEffect(() => () => {
    try { ytPlayer.current?.destroy(); } catch(_) {}
  }, []);

  /* ── Velocidade ──────────────────────────────────────────────── */
  useEffect(() => {
    speedRef.current = speed;
    try { ytPlayer.current?.setPlaybackRate(speed); } catch(_) {}
  }, [speed]);

  /* ── Pesquisa ────────────────────────────────────────────────── */
  const searchClips = useCallback(async (raw: string) => {
    if (!raw.trim()) return;
    setLoading(true); setSearchErr(""); setResults([]);

    /* Construir query robusta: força "official clip" ou "scene" */
    const base = raw.toLowerCase();
    const q = base.includes("clip") || base.includes("scene") || base.includes("official")
      ? raw
      : `${raw} official movie clip scene`;

    try {
      const params = new URLSearchParams({
        part:              "snippet",
        q,
        type:              "video",
        videoCategoryId:   "1",           // Film & Animation
        videoEmbeddable:   "true",
        videoDuration:     "short",       // < 4 min — cenas, não filmes inteiros
        maxResults:        "25",
        key:               API_KEY,
        relevanceLanguage: "en",
        safeSearch:        "moderate",
        order:             "relevance",
      });

      const res  = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`);
      if (!res.ok) { const e = await res.json(); throw new Error(e?.error?.message); }
      const data = await res.json();

      /* Mapear resultados */
      const raw2: MovieClip[] = (data.items||[])
        .filter((i:any) => !!i.id?.videoId)
        .map((i:any) => ({
          id:         i.id.videoId,
          title:      i.snippet.title,
          channel:    i.snippet.channelTitle,
          thumbnail:  i.snippet.thumbnails?.medium?.url || "",
          isOfficial: isOfficialChannel(i.snippet.channelTitle),
        }));

      /* Filtro client-side: excluir títulos de reacções/paródias */
      const filtered = raw2.filter(v => !isBadTitle(v.title));

      /* Verificar embeddable */
      const ok = await checkEmbeddable(filtered.map(v => v.id));
      const embeddable = filtered.filter(v => ok.has(v.id));

      /* Priorizar canais oficiais */
      const sorted = [
        ...embeddable.filter(v => v.isOfficial),
        ...embeddable.filter(v => !v.isOfficial),
      ];

      setResults(sorted.slice(0, 12));
      if (!sorted.length) setSearchErr("Nenhuma cena encontrada. Tenta outro título.");
    } catch(e:any) {
      setSearchErr(e.message || "Erro na pesquisa.");
    } finally { setLoading(false); }
  }, []);

  /* Pesquisa inicial */
  useEffect(() => { searchClips("official movie scene english"); }, [searchClips]);

  /* ── Guardar vocabulário ─────────────────────────────────────── */
  function saveVocab() {
    if (!vocabWord.trim()) return;
    setSavedVocab(p => [...p, { id: nextId.current++, en: vocabWord.trim(), pt: vocabTrans.trim() }]);
    setVocabWord(""); setVocabTrans("");
  }

  /* ── Guardar frase ───────────────────────────────────────────── */
  function savePhrase() {
    if (!phraseEn.trim()) return;
    setSavedPhrases(p => [...p, { id: nextId.current++, en: phraseEn.trim(), pt: phrasePt.trim() }]);
    setPhraseEn(""); setPhrasePt("");
  }

  /* ── Exportar vocabulário ────────────────────────────────────── */
  function exportVocab() {
    const lines = savedVocab.map(v => `${v.en}${v.pt ? " → " + v.pt : ""}`).join("\n");
    const a     = document.createElement("a");
    a.href      = URL.createObjectURL(new Blob([lines], { type:"text/plain" }));
    a.download  = `vocabulario-${(selected?.title||"filme").replace(/[^a-z0-9]/gi,"_").slice(0,25)}.txt`;
    a.click();
  }

  /* Filtra por género (curadas) */
  const filteredCurated = useMemo(() =>
    genreFilter === "Todos"
      ? CURATED
      : CURATED.filter(m => m.genre === genreFilter),
  [genreFilter]);

  function tryNext() {
    if (!selected) return;
    const idx  = results.findIndex(v => v.id === selected.id);
    const next = results[idx+1];
    if (next) { setSelected(next); setIsPlaying(false); setVidError(false); }
  }

  /* ════════════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════════════ */
  return (
    <>
      <style>{ANIM}</style>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-amber-950/20 to-slate-950 text-white pb-14">

        {/* Header */}
        <div className="bg-gradient-to-r from-amber-800 via-orange-800 to-amber-900 py-7 px-4 text-center shadow-xl">
          <div className="flex items-center justify-center gap-3 mb-1">
            <span className="text-4xl">🎬</span>
            <h1 className="text-3xl font-black tracking-tight">Filmes para Aprender Inglês</h1>
            <span className="text-4xl">🎬</span>
          </div>
          <p className="text-amber-200 text-xs max-w-xl mx-auto">
            Cenas de filmes reais · Legendas automáticas · Velocidade ajustável · Treino de vocabulário
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── COLUNA ESQUERDA ──────────────────────────────────── */}
          <div className="lg:col-span-1 space-y-4">

            {/* Pesquisa */}
            <form onSubmit={e=>{e.preventDefault();searchClips(query);}}
              className="bg-white/8 backdrop-blur rounded-xl p-4 space-y-3 border border-amber-500/10">
              <label className="block text-xs font-bold text-amber-300 uppercase tracking-widest">
                🔍 Pesquisar Cenas de Filmes
              </label>
              <div className="flex gap-2">
                <input value={query} onChange={e=>setQuery(e.target.value)}
                  placeholder="Ex: Forrest Gump, Inception…"
                  className="flex-1 bg-white/10 border border-white/15 rounded-lg px-3 py-2 text-sm placeholder-white/35 focus:outline-none focus:border-amber-400 transition-colors" />
                <button type="submit" disabled={loading}
                  className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                  {loading ? "…" : "Ir"}
                </button>
              </div>
              <p className="text-[10px] text-amber-400/70">
                ✅ Filtro automático: exclui reacções, paródias e análises
              </p>
            </form>

            {/* Sugestões curadas */}
            <div className="bg-white/8 backdrop-blur rounded-xl p-4 border border-amber-500/10">
              <p className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-3">
                🎞️ Filmes Recomendados
              </p>

              {/* Filtro género */}
              <div className="flex flex-wrap gap-1 mb-3">
                {GENRES.map(g => (
                  <button key={g} onClick={()=>setGenreFilter(g)}
                    className={`text-xs px-2 py-1 rounded-full transition-colors font-semibold ${
                      genreFilter===g
                        ? "bg-amber-600 text-white"
                        : "bg-white/10 text-white/60 hover:text-white"
                    }`}>
                    {g}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {filteredCurated.map(m => (
                  <button key={m.label}
                    onClick={()=>{ setQuery(m.label); searchClips(m.query); }}
                    className="w-full text-left flex items-center gap-2.5 p-2.5 rounded-lg bg-white/5 hover:bg-amber-600/20 border border-transparent hover:border-amber-500/30 transition-all">
                    <span className="text-lg flex-shrink-0">{m.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">{m.label}</p>
                      <p className="text-[10px] text-white/40 truncate">{m.tip}</p>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${DIFF_COLOR[m.diff]} flex-shrink-0`}>
                      {m.diff === "Iniciante" ? "A1" : m.diff === "Intermediário" ? "B1" : "C1"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Resultados */}
            {searchErr && (
              <div className="bg-red-500/15 border border-red-400/30 rounded-xl p-3 text-xs text-red-300">
                ⚠️ {searchErr}
              </div>
            )}

            <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-1">
              {loading && (
                <div className="text-center py-8">
                  <div className="flex justify-center gap-1 mb-3">
                    {EQ_CLS.map((cls,i) => (
                      <div key={i} className={cls} style={{width:7,backgroundColor:EQ_COL[i],borderRadius:3,minHeight:3}} />
                    ))}
                  </div>
                  <p className="text-xs text-amber-300">A filtrar cenas de filmes…</p>
                </div>
              )}

              {!loading && results.map(clip => {
                const active = selected?.id === clip.id;
                return (
                  <button key={clip.id} onClick={()=>{ setSelected(clip); setIsPlaying(false); setVidError(false); }}
                    className={`w-full text-left flex gap-3 p-3 rounded-xl transition-all border ${
                      active
                        ? "bg-amber-600/40 border-amber-400 shadow-lg shadow-amber-900/40"
                        : "bg-white/5 hover:bg-white/10 border-transparent hover:border-amber-500/20"
                    }`}>
                    <div className="relative flex-shrink-0">
                      <img src={clip.thumbnail} alt={clip.title}
                        className="w-20 h-14 object-cover rounded-lg" loading="lazy" />
                      {active && isPlaying && (
                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                          <div className="flex items-end gap-0.5" style={{height:14}}>
                            {["meq1","meq3","meq5"].map(cls => (
                              <div key={cls} className={cls} style={{width:3,backgroundColor:"#fbbf24",borderRadius:2,minHeight:2}} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-semibold line-clamp-2 leading-snug">{clip.title}</p>
                      <p className="text-xs text-amber-300/70 mt-0.5 truncate">{clip.channel}</p>
                      <div className="flex gap-1 mt-1">
                        {clip.isOfficial && (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-full">✓ Oficial</span>
                        )}
                        <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded-full">CC</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── COLUNA DIREITA ────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Player */}
            <div className={`rounded-2xl overflow-hidden shadow-2xl aspect-video bg-black relative ${isPlaying ? "movie-glow" : ""}`}>
              <div id="mv-player-root" className="w-full h-full"
                style={{display: selected && !vidError ? "block" : "none"}} />

              {selected && vidError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-900">
                  <span className="text-5xl">😔</span>
                  <p className="text-sm text-white/70 font-semibold">Este vídeo não pode ser incorporado.</p>
                  <button onClick={tryNext}
                    className="bg-amber-600 hover:bg-amber-500 px-5 py-2 rounded-lg text-sm font-bold transition-colors">
                    ▶ Tentar próxima cena
                  </button>
                </div>
              )}

              {!selected && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/25 gap-4">
                  <div className="flex items-end gap-1 opacity-30">
                    {EQ_CLS.map((cls,i) => (
                      <div key={i} className={cls} style={{width:8,backgroundColor:EQ_COL[i],borderRadius:3,minHeight:3}} />
                    ))}
                  </div>
                  <p className="text-xl font-bold">Selecciona uma cena de filme</p>
                  <p className="text-sm">Pesquisa ou escolhe um filme recomendado</p>
                </div>
              )}
            </div>

            {/* Now Playing */}
            {selected && !vidError && (
              <NowPlayingBar clip={selected} isPlaying={isPlaying} ccOn={ccOn} />
            )}

            {/* CC + Velocidade */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

              {/* Legendas CC */}
              <div className="bg-white/8 backdrop-blur rounded-xl p-4 border border-amber-500/10">
                <p className="text-xs font-bold text-amber-200 uppercase tracking-widest mb-3">
                  💬 Legendas (Closed Captions)
                </p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/70">
                    {ccOn ? "Legendas em inglês activas" : "Legendas desactivadas"}
                  </span>
                  <button
                    onClick={() => {
                      const next = !ccOn;
                      setCcOn(next);
                      /* Recarregar player com novo cc_load_policy */
                      if (selected) {
                        const cur = selected;
                        setSelected(null);
                        setTimeout(() => setSelected(cur), 100);
                      }
                    }}
                    className={`relative w-12 h-6 rounded-full transition-colors ${ccOn ? "bg-blue-600" : "bg-white/20"}`}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${ccOn ? "translate-x-6" : "translate-x-0.5"}`} />
                  </button>
                </div>
                <p className="text-[11px] text-white/40">
                  {ccOn
                    ? "🔵 O YouTube exibirá legendas em inglês automaticamente (se disponíveis)"
                    : "○ Sem legendas — reativa para treino de compreensão"}
                </p>
              </div>

              {/* Velocidade */}
              <div className="bg-white/8 backdrop-blur rounded-xl p-4 border border-amber-500/10">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-amber-200 uppercase tracking-widest">
                    🐢 Velocidade
                  </p>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                    speed===0.5  ? "bg-red-500/30 text-red-300"    :
                    speed===0.75 ? "bg-yellow-500/30 text-yellow-300" :
                                   "bg-green-500/30 text-green-300"
                  }`}>
                    {speed===0.5?"Muito lento":speed===0.75?"Lento":"Normal"}
                  </span>
                </div>
                <div className="flex gap-2">
                  {SPEED_OPT.map(({label,value,color}) => (
                    <button key={value} onClick={()=>setSpeed(value)}
                      className={`flex-1 py-2 rounded-lg text-sm font-black transition-all ${
                        speed===value
                          ? `${color} text-white shadow-lg scale-105`
                          : "bg-white/10 hover:bg-white/20 text-white/70"
                      }`}>
                      {label}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-white/40 mt-2 text-center">
                  {SPEED_OPT.find(s=>s.value===speed)?.tip}
                </p>
              </div>
            </div>

            {/* Vocabulário + Frases + Notas */}
            <div className="bg-white/8 backdrop-blur rounded-xl overflow-hidden border border-amber-500/10">

              {/* Tabs */}
              <div className="flex border-b border-white/10">
                {([
                  { id:"vocab",   icon:"📖", label:"Vocabulário" },
                  { id:"phrases", icon:"💬", label:"Frases Memoráveis" },
                  { id:"notes",   icon:"🗒️", label:"Anotações" },
                ] as const).map(t => (
                  <button key={t.id} onClick={()=>setTab(t.id)}
                    className={`flex-1 py-3 text-xs font-bold transition-colors ${
                      tab===t.id
                        ? "bg-amber-700/50 text-white border-b-2 border-amber-400"
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    }`}>
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>

              <div className="p-4">

                {/* ── Vocabulário ── */}
                {tab==="vocab" && (
                  <div className="space-y-3">
                    <p className="text-xs text-white/50">
                      Guarda palavras que não conheces enquanto vês a cena.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block mb-1">
                          Palavra (EN)
                        </label>
                        <input value={vocabWord} onChange={e=>setVocabWord(e.target.value)}
                          onKeyDown={e=>e.key==="Enter"&&saveVocab()}
                          placeholder="Ex: tremendous"
                          className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-400 transition-colors" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block mb-1">
                          Tradução (PT)
                        </label>
                        <input value={vocabTrans} onChange={e=>setVocabTrans(e.target.value)}
                          onKeyDown={e=>e.key==="Enter"&&saveVocab()}
                          placeholder="Ex: tremendo"
                          className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-400 transition-colors" />
                      </div>
                    </div>
                    <button onClick={saveVocab} disabled={!vocabWord.trim()}
                      className="w-full py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 rounded-lg text-sm font-bold transition-colors">
                      + Guardar Palavra
                    </button>

                    {savedVocab.length > 0 && (
                      <>
                        <div className="space-y-1.5 max-h-40 overflow-y-auto">
                          {savedVocab.map(v => (
                            <div key={v.id} className="mslide flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                              <span className="text-sm font-bold text-amber-300">{v.en}</span>
                              {v.pt && <><span className="text-white/30">→</span><span className="text-sm text-white/70">{v.pt}</span></>}
                              <button onClick={()=>setSavedVocab(p=>p.filter(x=>x.id!==v.id))}
                                className="ml-auto text-white/30 hover:text-red-400 text-xs transition-colors">✕</button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={exportVocab}
                            className="flex-1 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold transition-colors">
                            💾 Exportar .txt
                          </button>
                          <button onClick={()=>setSavedVocab([])}
                            className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-xs font-semibold transition-colors">
                            🗑️ Limpar
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* ── Frases Memoráveis ── */}
                {tab==="phrases" && (
                  <div className="space-y-3">
                    <p className="text-xs text-white/50">
                      Guarda falas icónicas ou frases úteis da cena.
                    </p>
                    <div>
                      <label className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block mb-1">
                        🇬🇧 Fala em inglês
                      </label>
                      <textarea value={phraseEn} onChange={e=>setPhraseEn(e.target.value)}
                        placeholder='"Life is like a box of chocolates…"'
                        rows={2}
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-400 transition-colors resize-none font-mono" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block mb-1">
                        🇵🇹 Tradução (opcional)
                      </label>
                      <textarea value={phrasePt} onChange={e=>setPhrasePt(e.target.value)}
                        placeholder='"A vida é como uma caixa de chocolates…"'
                        rows={2}
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-400 transition-colors resize-none font-mono" />
                    </div>
                    <button onClick={savePhrase} disabled={!phraseEn.trim()}
                      className="w-full py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 rounded-lg text-sm font-bold transition-colors">
                      💬 Guardar Frase
                    </button>

                    {savedPhrases.length > 0 && (
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {savedPhrases.map(p => (
                          <div key={p.id} className="mslide bg-white/5 rounded-lg px-3 py-2 relative">
                            <p className="text-sm font-semibold text-amber-200 italic">"{p.en}"</p>
                            {p.pt && <p className="text-xs text-white/50 mt-0.5 italic">"{p.pt}"</p>}
                            <button onClick={()=>setSavedPhrases(prev=>prev.filter(x=>x.id!==p.id))}
                              className="absolute top-2 right-2 text-white/25 hover:text-red-400 text-xs transition-colors">✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── Anotações ── */}
                {tab==="notes" && (
                  <div>
                    <label className="text-xs font-bold text-amber-300 uppercase tracking-widest block mb-2">
                      🗒️ Bloco de Anotações
                    </label>
                    <textarea value={notes} onChange={e=>setNotes(e.target.value)}
                      placeholder={`Escreve enquanto vês a cena:\n• Sotaque ou pronúncia notada\n• Expressões idiomáticas\n• Contexto cultural\n• Dúvidas para pesquisar…`}
                      rows={10}
                      className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/25 resize-y focus:outline-none focus:border-amber-400 font-mono leading-7 transition-colors" />
                    {notes && (
                      <div className="flex justify-between mt-2">
                        <span className="text-xs text-white/35">{notes.length} caracteres</span>
                        <button onClick={()=>{
                          const a = document.createElement("a");
                          a.href = URL.createObjectURL(new Blob([notes],{type:"text/plain"}));
                          a.download = `notas-${(selected?.title||"filme").replace(/[^a-z0-9]/gi,"_").slice(0,25)}.txt`;
                          a.click();
                        }} className="text-xs bg-amber-600 hover:bg-amber-500 px-3 py-1 rounded-lg font-semibold transition-colors">
                          💾 Guardar .txt
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Dicas */}
            <div className="bg-gradient-to-r from-amber-700/15 to-orange-700/15 border border-amber-500/15 rounded-xl p-4">
              <p className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-2">
                💡 Como aprender com filmes
              </p>
              <ul className="text-xs text-white/65 space-y-1">
                <li>1️⃣ Vê a cena <strong>uma vez sem parar</strong> para perceber o contexto</li>
                <li>2️⃣ Ativa as <strong>legendas em inglês</strong> (CC ON) e vê novamente a <strong>0.75×</strong></li>
                <li>3️⃣ Para em palavras desconhecidas e guarda-as no <strong>Vocabulário</strong></li>
                <li>4️⃣ Repete as falas em voz alta para treinar <strong>pronúncia e entoação</strong></li>
                <li>5️⃣ Guarda as frases mais memoráveis para rever depois</li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
