/* ════════════════════════════════════════════════════════════════════
   NgadaLearn — Music Player  (YouTube API v3)
   Legenda interactiva: karaoke, clique em palavras, marcadores, auto-avanço
   ════════════════════════════════════════════════════════════════════ */

import {
  useState, useEffect, useRef, useCallback, useMemo,
} from "react";
import { Link } from "react-router";

/* ── Tipos globais da YouTube IFrame API ─────────────────────────── */
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

/* ── Animações CSS globais ───────────────────────────────────────── */
const ANIM_STYLE = `
@keyframes eq1{0%,100%{height:4px} 50%{height:22px}}
@keyframes eq2{0%,100%{height:14px}50%{height:5px}}
@keyframes eq3{0%,100%{height:7px} 50%{height:26px}}
@keyframes eq4{0%,100%{height:18px}50%{height:4px}}
@keyframes eq5{0%,100%{height:5px} 50%{height:20px}}
@keyframes eq6{0%,100%{height:11px}50%{height:3px}}
@keyframes eq7{0%,100%{height:3px} 50%{height:16px}}
.eq1{animation:eq1 .8s ease-in-out infinite}
.eq2{animation:eq2 .55s ease-in-out infinite}
.eq3{animation:eq3 .7s ease-in-out infinite}
.eq4{animation:eq4 .9s ease-in-out infinite}
.eq5{animation:eq5 .5s ease-in-out infinite}
.eq6{animation:eq6 .65s ease-in-out infinite}
.eq7{animation:eq7 .75s ease-in-out infinite}

@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
.marquee-wrap{overflow:hidden;white-space:nowrap}
.marquee-text{display:inline-block;animation:marquee 16s linear infinite}

@keyframes pulseGlow{0%,100%{box-shadow:0 0 0 #a855f7}50%{box-shadow:0 0 20px #a855f7,0 0 40px #6d28d9}}
.player-glow{animation:pulseGlow 2.5s ease-in-out infinite}

@keyframes slideUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.slide-up{animation:slideUp .35s ease forwards}

@keyframes activeLine{0%{background-position:0% 50%}100%{background-position:100% 50%}}
.active-line-bg{
  background:linear-gradient(90deg,#7c3aed,#4f46e5,#7c3aed);
  background-size:200% 100%;
  animation:activeLine 2s linear infinite;
}

@keyframes wordPop{0%{transform:scale(1)}50%{transform:scale(1.18)}100%{transform:scale(1)}}
.word-pop{animation:wordPop .2s ease}

@keyframes flashBorder{0%,100%{border-color:rgba(168,85,247,.6)}50%{border-color:#c084fc}}
.flash-border{animation:flashBorder 1s ease-in-out infinite}

@keyframes cinemaIn{
  0%{opacity:0;transform:translateY(24px) scale(.93);filter:blur(7px)}
  60%{opacity:1;filter:blur(0)}
  100%{transform:translateY(0) scale(1)}
}
@keyframes shimmerText{0%{background-position:0% 50%}100%{background-position:300% 50%}}
@keyframes waveFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
.cinema-in{animation:cinemaIn .52s cubic-bezier(.34,1.56,.64,1) both}

@keyframes livePulse{0%,100%{opacity:1}50%{opacity:.45}}
.live-badge{animation:livePulse 1.4s ease-in-out infinite}
`;

/* ── Tipos ────────────────────────────────────────────────────────── */
interface YTVideo {
  id: string; title: string; channel: string; thumbnail: string;
}
type PlaybackRate = 0.5 | 0.75 | 1;
type Difficulty   = "normal" | "hard" | "learned";

interface LyricLine {
  id: number;
  en: string;
  pt: string;
  difficulty: Difficulty;
  highlighted: number[];   // índices de palavras marcadas
}

interface TimedSub {
  start: number;
  dur:   number;
  text:  string;
}

/* ── Constantes ───────────────────────────────────────────────────── */
const BACKEND = import.meta.env.VITE_API_URL || "https://ngadalearn-api.onrender.com";
const EQ_CLS  = ["eq1","eq2","eq3","eq4","eq5","eq6","eq7"];
const EQ_COL  = ["#c084fc","#a855f7","#9333ea","#818cf8","#6366f1","#38bdf8","#a78bfa"];

const SPEED_OPTIONS: {label:string; value:PlaybackRate}[] = [
  {label:"0.5×",value:0.5},{label:"0.75×",value:0.75},{label:"1×",value:1},
];
const AUTO_DELAYS = [
  {label:"3s",value:3},{label:"5s",value:5},{label:"8s",value:8},{label:"12s",value:12},
];
const SUGGESTED = [
  "Ed Sheeran official video",
  "Adele official video",
  "Taylor Swift official video",
  "English learning song official",
  "Coldplay official video",
];
const DIFF_META: Record<Difficulty,{label:string;color:string;icon:string}> = {
  normal:  {label:"Normal",  color:"bg-white/10 text-white/50", icon:""},
  hard:    {label:"Difícil", color:"bg-red-500/20 text-red-300", icon:"⭐"},
  learned: {label:"Aprendi", color:"bg-green-500/20 text-green-300", icon:"✅"},
};

/* ── Utilitários ──────────────────────────────────────────────────── */
function parseLyrics(en: string, pt: string): LyricLine[] {
  const enL = en.split("\n");
  const ptL = pt.split("\n");
  const max = Math.max(enL.length, ptL.length);
  return Array.from({length: max}, (_, i) => ({
    id: i,
    en: (enL[i] ?? "").trim(),
    pt: (ptL[i] ?? "").trim(),
    difficulty: "normal",
    highlighted: [],
  })).filter(l => l.en || l.pt);
}

/* Rejeita títulos com scripts não-latinos (coreano, japonês, árabe, cirílico, etc.) */
function isNonEnglish(text: string): boolean {
  return /[Ѐ-ӿ؀-ۿ一-鿿぀-ヿ가-힯฀-๿]/.test(text);
}

/* Filtra: apenas música embeddable (via backend proxy com cache) */
async function filterEnglishEmbeddable(videos: YTVideo[]): Promise<YTVideo[]> {
  if (!videos.length) return [];
  const latinOnly = videos.filter(v => !isNonEnglish(v.title) && !isNonEnglish(v.channel));
  if (!latinOnly.length) return [];
  try {
    const ids = latinOnly.map(v => v.id).join(",");
    const res = await fetch(`${BACKEND}/api/youtube/videos?ids=${ids}`);
    const data = await res.json();
    const apiMap = new Map<string, any>((data.items || []).map((i: any) => [i.id, i]));
    return latinOnly.filter(v => {
      const item = apiMap.get(v.id);
      if (!item) return true;
      if (item.status?.embeddable === false) return false;
      const lang = item.snippet?.defaultAudioLanguage || item.snippet?.defaultLanguage || "";
      if (lang && !lang.startsWith("en")) return false;
      return true;
    });
  } catch { return latinOnly; }
}

/* ── Equalizador ──────────────────────────────────────────────────── */
function Equalizer({active, size=28}: {active:boolean; size?:number}) {
  if (!active) return <span className="text-xl">🎵</span>;
  return (
    <div className="flex items-end gap-0.5" style={{height:size}}>
      {EQ_CLS.map((cls,i) => (
        <div key={cls} className={cls}
          style={{width:3,borderRadius:2,backgroundColor:EQ_COL[i],minHeight:3}} />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   LEGENDA INTERACTIVA
   ════════════════════════════════════════════════════════════════════ */
function InteractiveLyrics({
  lines, activeLine, onLineClick, onWordClick, onDifficultyChange,
}: {
  lines: LyricLine[];
  activeLine: number;
  onLineClick: (id: number) => void;
  onWordClick: (lineId: number, wordIdx: number) => void;
  onDifficultyChange: (lineId: number, diff: Difficulty) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef    = useRef<HTMLDivElement>(null);

  /* Scroll automático centrado DENTRO do painel (não rola a página) */
  useEffect(() => {
    const container = containerRef.current;
    const el        = activeRef.current;
    if (!container || !el) return;
    const top = el.offsetTop - container.offsetTop - container.clientHeight / 2 + el.clientHeight / 2;
    container.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, [activeLine]);

  if (!lines.length)
    return (
      <div className="flex flex-col items-center justify-center py-16 text-white/30 gap-3">
        <span className="text-4xl">🎤</span>
        <p className="text-sm">Cola a letra na aba "Editar" para activar a legenda interactiva</p>
      </div>
    );

  return (
    <div ref={containerRef} className="space-y-1 overflow-y-auto pr-1 py-1" style={{maxHeight:"clamp(220px, calc(100dvh - 480px), 580px)", minHeight:120}}>
      {lines.map((line) => {
        const isActive = line.id === activeLine;
        const meta     = DIFF_META[line.difficulty];
        const words    = line.en.split(" ");

        return (
          <div
            key={line.id}
            ref={isActive ? activeRef : undefined}
            className={`slide-up rounded-xl border transition-all duration-300 cursor-pointer
              ${isActive
                ? "border-purple-400/80 shadow-lg shadow-purple-900/40 flash-border"
                : "border-white/5 hover:border-white/20"
              }
              ${meta.color}
            `}
            onClick={() => onLineClick(line.id)}
            style={isActive ? {background:"rgba(109,40,217,0.25)"} : {background:"rgba(255,255,255,0.04)"}}
          >
            {/* Linha número + dificuldade */}
            <div className="flex items-center gap-2 px-3 pt-2 pb-1">
              <span className="text-[10px] text-white/30 w-5 flex-shrink-0 font-mono">
                {line.id + 1}
              </span>
              {isActive && (
                <div className="flex items-end gap-0.5 flex-shrink-0" style={{height:14}}>
                  {["eq1","eq3","eq5"].map((cls) => (
                    <div key={cls} className={cls}
                      style={{width:2,borderRadius:2,backgroundColor:"#c084fc",minHeight:2}} />
                  ))}
                </div>
              )}
              <div className="flex-1" />
              {/* Botões de dificuldade */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{opacity: isActive ? 1 : undefined}}>
                {(["hard","learned","normal"] as Difficulty[]).map(d => (
                  <button
                    key={d}
                    onClick={(e) => { e.stopPropagation(); onDifficultyChange(line.id, d); }}
                    title={DIFF_META[d].label}
                    className={`text-[11px] px-1.5 py-0.5 rounded-full transition-all
                      ${line.difficulty === d
                        ? "bg-white/20 text-white scale-110"
                        : "text-white/30 hover:text-white"
                      }`}
                  >
                    {d === "hard" ? "⭐" : d === "learned" ? "✅" : "○"}
                  </button>
                ))}
              </div>
            </div>

            {/* Texto EN — palavra a palavra */}
            <div className="px-3 pb-1 flex flex-wrap gap-1">
              {words.map((word, wi) => {
                const isHL = line.highlighted.includes(wi);
                return (
                  <button
                    key={wi}
                    onClick={(e) => { e.stopPropagation(); onWordClick(line.id, wi); }}
                    className={`text-sm leading-relaxed rounded px-0.5 transition-all word-pop
                      ${isActive ? "font-bold" : "font-medium"}
                      ${isHL
                        ? "bg-yellow-400/30 text-yellow-200 underline decoration-dotted"
                        : isActive
                          ? "text-white hover:bg-white/20"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    title={isHL ? "Clica para remover destaque" : "Clica para destacar"}
                  >
                    {word}
                  </button>
                );
              })}
            </div>

            {/* Tradução PT */}
            {line.pt && (
              <div className={`px-3 pb-2 text-xs leading-snug
                ${isActive ? "text-purple-200" : "text-white/40"}`}>
                {line.pt}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Decodifica entidades HTML (usada em componentes fora do MusicPlayer) */
function htmlDecode(s: string) {
  return s
    .replace(/&#39;/g, "'").replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

/* ── Barra "Now Playing" com a linha activa ───────────────────────── */
function NowPlayingBar({video, isPlaying, activeLyric}:
  {video: YTVideo; isPlaying: boolean; activeLyric: string}) {

  const safeTitle   = htmlDecode(video.title);
  const safeChannel = htmlDecode(video.channel);
  const text = activeLyric
    ? `${activeLyric}   •   ${activeLyric}   •   `
    : `${safeTitle} — ${safeChannel}   •   ${safeTitle} — ${safeChannel}   •   `;

  return (
    <div className="slide-up flex items-center gap-3 bg-black/60 backdrop-blur
      border border-purple-500/40 rounded-xl px-4 py-3">
      <Equalizer active={isPlaying} />
      <div className="flex-1 overflow-hidden">
        <p className="text-[10px] font-bold uppercase tracking-widest text-purple-400 mb-0.5">
          {activeLyric ? "🎤 Legenda Activa" : "♪ Now Playing"}
        </p>
        <div className="marquee-wrap">
          <span className="marquee-text text-sm font-semibold text-white">{text}</span>
        </div>
      </div>
      <div className={`w-8 h-8 rounded-full bg-purple-600/40 flex items-center justify-center text-base flex-shrink-0
        ${isPlaying ? "player-glow" : ""}`}>
        🎶
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   CINEMA LYRIC DISPLAY — Legenda animada profissional
   ════════════════════════════════════════════════════════════════════ */
function CinemaLyricDisplay({ lines, activeLine, isPlaying }: {
  lines: LyricLine[]; activeLine: number; isPlaying: boolean;
}) {
  if (!lines.length) return null;
  const prev = lines[activeLine - 1];
  const curr = lines[activeLine];
  const next = lines[activeLine + 1];
  if (!curr) return null;

  const words = curr.en.split(" ");

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-2xl" style={{
      background: "linear-gradient(135deg,rgba(12,4,45,.98) 0%,rgba(45,12,85,.98) 50%,rgba(20,5,60,.98) 100%)",
      border: "1px solid rgba(168,85,247,.4)",
      boxShadow: "0 0 40px rgba(109,40,217,.2), inset 0 0 60px rgba(109,40,217,.05)",
    }}>
      {/* Orbs de fundo */}
      <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
        <div style={{position:"absolute",top:"10%",left:"8%",width:120,height:120,borderRadius:"50%",
          background:"rgba(139,92,246,.14)",filter:"blur(40px)",animation:"pulseGlow 4s ease-in-out infinite"}} />
        <div style={{position:"absolute",bottom:"10%",right:"8%",width:90,height:90,borderRadius:"50%",
          background:"rgba(99,102,241,.11)",filter:"blur(32px)",animation:"pulseGlow 5s 1.5s ease-in-out infinite"}} />
      </div>

      {/* Barra de topo */}
      <div className="flex items-center gap-3 px-5 pt-3 pb-1 relative z-10">
        {isPlaying ? (
          <div className="flex items-end gap-0.5" style={{height:14}}>
            {["eq1","eq3","eq5"].map(cls=>(
              <div key={cls} className={cls} style={{width:2,borderRadius:2,backgroundColor:"#c084fc",minHeight:2}} />
            ))}
          </div>
        ) : <span style={{fontSize:13}}>🎤</span>}
        <span style={{fontSize:10,letterSpacing:"0.12em",fontFamily:"monospace",color:"rgba(168,85,247,.55)"}}>
          {activeLine+1} / {lines.length}
        </span>
        <div style={{flex:1,height:1,background:"linear-gradient(90deg,transparent,rgba(168,85,247,.3),transparent)"}} />
        {curr.difficulty==="hard"    && <span style={{fontSize:11}}>⭐ Difícil</span>}
        {curr.difficulty==="learned" && <span style={{fontSize:11}}>✅ Aprendi</span>}
        <span style={{fontSize:10,color:"rgba(168,85,247,.4)",letterSpacing:"0.08em"}}>✦ LEGENDA</span>
      </div>

      {/* Linha anterior — muito esbatida */}
      {prev && (
        <p style={{textAlign:"center",padding:"0 24px 4px",fontSize:13,color:"rgba(255,255,255,.18)",
          fontStyle:"italic",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",position:"relative",zIndex:10}}>
          {prev.en}
        </p>
      )}

      {/* Linha activa — destaque máximo */}
      <div key={`cl-${activeLine}`} className="cinema-in"
        style={{textAlign:"center",padding:`${prev?"4px":"14px"} 18px ${next?"4px":"14px"}`,position:"relative",zIndex:10}}>
        <p style={{fontSize:"clamp(1.1rem,3vw,1.7rem)",fontWeight:900,lineHeight:1.35,letterSpacing:"0.01em",
          textShadow:"0 0 35px rgba(168,85,247,.75)"}}>
          {words.map((w,wi) => {
            const isHL = curr.highlighted.includes(wi);
            return (
              <span key={wi} style={{
                display:"inline-block", marginRight:".3em",
                ...(isHL ? {
                  color:"#fde047",
                  textShadow:"0 0 14px #fde047, 0 0 30px #fbbf24",
                } : {
                  background:"linear-gradient(90deg,#e879f9 0%,#a855f7 30%,#818cf8 60%,#a855f7 80%,#e879f9 100%)",
                  backgroundSize:"300% 100%",
                  animation:"shimmerText 4s linear infinite",
                  WebkitBackgroundClip:"text",
                  backgroundClip:"text",
                  color:"transparent",
                }),
              }}>{w}</span>
            );
          })}
        </p>
        {curr.pt && (
          <p style={{fontSize:"clamp(.75rem,1.8vw,.92rem)",color:"rgba(196,181,253,.65)",
            fontStyle:"italic",marginTop:8,letterSpacing:"0.01em"}}>
            {curr.pt}
          </p>
        )}
      </div>

      {/* Próxima linha — muito esbatida */}
      {next && (
        <p style={{textAlign:"center",padding:"4px 24px 12px",fontSize:13,color:"rgba(255,255,255,.18)",
          fontStyle:"italic",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",position:"relative",zIndex:10}}>
          {next.en}
        </p>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   CINEMA TRANSCRIPT — CC automático em tempo real (música)
   ════════════════════════════════════════════════════════════════════ */
function CinemaTranscript({ lines, active, isPlaying }: {
  lines: string[]; active: number; isPlaying: boolean;
}) {
  if (!lines.length) return null;
  const idx  = Math.max(0, active);
  const curr = lines[idx];
  const next = lines[idx + 1];
  if (!curr) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-xl" style={{
      background: "linear-gradient(135deg,rgba(12,4,45,.97) 0%,rgba(45,12,85,.97) 50%,rgba(20,5,60,.97) 100%)",
      border: "1px solid rgba(168,85,247,.3)",
      boxShadow: "0 0 30px rgba(109,40,217,.12)",
    }}>
      {/* Barra de progresso */}
      <div style={{height:3,background:"rgba(168,85,247,.1)",borderRadius:"2px 2px 0 0"}}>
        <div style={{
          height:"100%",
          width:`${Math.round(((idx+1)/lines.length)*100)}%`,
          background:"linear-gradient(90deg,#a855f7,#7c3aed)",
          transition:"width 0.2s ease",
          borderRadius:2,
        }} />
      </div>

      <div className="flex items-center gap-3 px-4 pt-2 pb-1">
        {isPlaying ? (
          <div className="flex items-end gap-0.5" style={{height:12}}>
            {["eq1","eq3","eq5"].map(cls => (
              <div key={cls} className={cls} style={{width:2,borderRadius:2,backgroundColor:"#c084fc",minHeight:2}} />
            ))}
          </div>
        ) : <span style={{fontSize:12}}>🎤</span>}
        <span style={{fontSize:9,fontFamily:"monospace",color:"rgba(168,85,247,.5)",letterSpacing:"0.1em"}}>
          {idx+1} / {lines.length}
        </span>
        <div style={{flex:1,height:1,background:"linear-gradient(90deg,transparent,rgba(168,85,247,.2),transparent)"}} />
        <span className="live-badge" style={{
          fontSize:9, fontWeight:700, letterSpacing:"0.1em",
          background:"rgba(34,197,94,.12)", color:"#4ade80",
          border:"1px solid rgba(34,197,94,.3)", borderRadius:99,
          padding:"2px 8px",
        }}>● CC AO VIVO</span>
      </div>

      <div key={`ct-${idx}`} className="cinema-in" style={{
        textAlign:"center", padding:`4px 16px ${next ? "4px" : "12px"}`,
      }}>
        <p style={{
          fontSize:"clamp(.9rem,2.2vw,1.25rem)",
          fontWeight:800, lineHeight:1.35, letterSpacing:"0.01em",
          background:"linear-gradient(90deg,#e879f9 0%,#a855f7 40%,#818cf8 70%,#a855f7 90%,#e879f9 100%)",
          backgroundSize:"300% 100%",
          animation:"shimmerText 4s linear infinite",
          WebkitBackgroundClip:"text",
          backgroundClip:"text",
          color:"transparent",
        }}>
          {curr}
        </p>
      </div>

      {next && (
        <p style={{textAlign:"center",padding:"2px 20px 10px",fontSize:12,
          color:"rgba(255,255,255,.2)",fontStyle:"italic",
          overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
          {next}
        </p>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ════════════════════════════════════════════════════════════════════ */
export function MusicPlayer() {
  /* Pesquisa */
  const [query,    setQuery]    = useState("");
  const [results,  setResults]  = useState<YTVideo[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  /* Player */
  const [selected,  setSelected]  = useState<YTVideo|null>(null);
  const [speed,     setSpeed]     = useState<PlaybackRate>(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [vidError,  setVidError]  = useState(false);
  const ytPlayer       = useRef<any>(null);
  const speedRef       = useRef<PlaybackRate>(1);
  const resultsRef     = useRef<YTVideo[]>([]);   // sempre actualizado — acessível nos callbacks YT
  const selectedRef    = useRef<YTVideo|null>(null); // evita stale closures nos eventos YT
  const errorTimeout   = useRef<ReturnType<typeof setTimeout>|null>(null);
  const skipTimeoutRef = useRef<ReturnType<typeof setTimeout>|null>(null);

  /* Letras — raw text */
  const [rawEn, setRawEn] = useState("");
  const [rawPt, setRawPt] = useState("");

  /* Legenda interactiva */
  const [lines,       setLines]       = useState<LyricLine[]>([]);
  const [activeLine,  setActiveLine]  = useState(0);
  const [lyricsMode,  setLyricsMode]  = useState<"edit"|"view">("edit");
  const [autoMode,    setAutoMode]    = useState(false);
  const [autoDelay,   setAutoDelay]   = useState(5);
  const autoTimer = useRef<ReturnType<typeof setInterval>|null>(null);

  /* Tab principal — "lyrics" (letras) | "list" (lista de músicas no mobile) */
  const [tab, setTab] = useState<"lyrics"|"list">("lyrics");

  /* Auto-busca de letra */
  const [fetchingLyrics, setFetchingLyrics] = useState(false);
  const [lyricsFetchMsg, setLyricsFetchMsg] = useState("");

  /* Transcript em tempo real (CC automático) */
  const [transcript,    setTranscript]    = useState<TimedSub[]>([]);
  const [transLoading,  setTransLoading]  = useState(false);
  const [liveSubIdx,    setLiveSubIdx]    = useState(-1);
  const liveSubIdxRef  = useRef(-1);
  const liveTimerRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const transcriptLines = useMemo(() => transcript.map(s => s.text), [transcript]);

  /* ── Sync selectedRef (sempre atual para callbacks do YT) ────── */
  useEffect(() => { selectedRef.current = selected; }, [selected]);

  /* ── Helper: avançar para o próximo vídeo ou mostrar erro ─────── */
  const skipToNextVideo = useCallback(() => {
    if (errorTimeout.current)   { clearTimeout(errorTimeout.current);   errorTimeout.current   = null; }
    if (skipTimeoutRef.current) { clearTimeout(skipTimeoutRef.current); skipTimeoutRef.current = null; }
    const curId = selectedRef.current?.id;
    if (!curId) return;
    const list = resultsRef.current;
    const idx  = list.findIndex(v => v.id === curId);
    const nxt  = list[idx + 1];
    if (nxt) { setSelected(nxt); setIsPlaying(false); setVidError(false); }
    else     { setVidError(true); setIsPlaying(false); }
  }, []);

  /* ── Parse de letras quando muda o raw text ────────────────────── */
  useEffect(() => {
    if (rawEn || rawPt) {
      const parsed = parseLyrics(rawEn, rawPt);
      setLines(parsed);
      setActiveLine(0);
    } else {
      setLines([]);
    }
  }, [rawEn, rawPt]);

  /* ── Auto-avanço karaoke ────────────────────────────────────────── */
  useEffect(() => {
    if (autoTimer.current) clearInterval(autoTimer.current);
    if (!autoMode || !lines.length) return;
    autoTimer.current = setInterval(() => {
      setActiveLine(p => {
        if (p >= lines.length - 1) { setAutoMode(false); return p; }
        return p + 1;
      });
    }, autoDelay * 1000);
    return () => { if (autoTimer.current) clearInterval(autoTimer.current); };
  }, [autoMode, autoDelay, lines.length]);

  /* ── Pesquisa YouTube ────────────────────────────────────────────── */
  const searchVideos = useCallback(async (raw: string) => {
    if (!raw.trim()) return;
    setLoading(true); setError(""); setResults([]);
    try {
      const params = new URLSearchParams({ q: raw, type: "music", max: "20" });
      const res  = await fetch(`${BACKEND}/api/youtube/search?${params}`);
      const data = await res.json();
      if (data.quotaExceeded) {
        setError("Quota do YouTube temporariamente esgotada. Tente novamente mais tarde.");
        return;
      }
      const videos: YTVideo[] = data.videos || [];
      const filtered = await filterEnglishEmbeddable(videos);
      setResults(filtered.slice(0, 12));
      if (!filtered.length) setError("Nenhum vídeo incorporável encontrado.");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro na pesquisa.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { searchVideos("learn English through music official"); }, [searchVideos]);

  /* ── Carregar YouTube IFrame API (uma vez) ──────────────────────── */
  useEffect(() => {
    if (document.getElementById("yt-api-script")) return;
    const tag   = document.createElement("script");
    tag.id      = "yt-api-script";
    tag.src     = "https://www.youtube.com/iframe_api";
    tag.async   = true;
    document.head.appendChild(tag);
  }, []);

  /* ── Criar/recriar player quando o vídeo muda ───────────────────── */
  useEffect(() => {
    if (!selected) return;

    function buildPlayer() {
      /* Destruir player anterior se existir */
      if (ytPlayer.current) {
        try { ytPlayer.current.destroy(); } catch(_) {}
        ytPlayer.current = null;
      }

      /* Recriar o div alvo (o YT.Player substitui-o por um iframe) */
      const container = document.getElementById("yt-player-root");
      if (!container) return;
      container.innerHTML = "";
      const div = document.createElement("div");
      div.id = "yt-player-div";
      container.appendChild(div);

      ytPlayer.current = new window.YT.Player("yt-player-div", {
        videoId:    selected!.id,
        width:      "100%",
        height:     "100%",
        playerVars: {
          rel:            0,
          modestbranding: 1,
          playsinline:    1,
          autoplay:       0,
          origin:         window.location.origin,
        },
        events: {
          onReady: (e: any) => {
            e.target.setPlaybackRate(speedRef.current);
            /* Timeout de segurança: se o vídeo não começar em 12s, avança */
            if (errorTimeout.current) clearTimeout(errorTimeout.current);
            errorTimeout.current = setTimeout(() => {
              const state = ytPlayer.current?.getPlayerState?.() ?? -1;
              if (state === -1 || state === 5) skipToNextVideo();
            }, 12000);
          },
          onStateChange: (e: any) => {
            setIsPlaying(e.data === 1);
            if (e.data === 1) {
              e.target.setPlaybackRate(speedRef.current);
              /* Vídeo a tocar — limpar todos os timeouts de erro */
              if (errorTimeout.current)   { clearTimeout(errorTimeout.current);   errorTimeout.current   = null; }
              if (skipTimeoutRef.current) { clearTimeout(skipTimeoutRef.current); skipTimeoutRef.current = null; }
            }
            /* Estado -1 persistente = vídeo bloqueado */
            if (e.data === -1) {
              if (skipTimeoutRef.current) clearTimeout(skipTimeoutRef.current);
              skipTimeoutRef.current = setTimeout(() => {
                const st = ytPlayer.current?.getPlayerState?.() ?? -1;
                if (st === -1) skipToNextVideo();
              }, 4000);
            } else {
              if (skipTimeoutRef.current) { clearTimeout(skipTimeoutRef.current); skipTimeoutRef.current = null; }
            }
          },
          onError: () => {
            /* Qualquer erro YT API → avançar silenciosamente */
            skipToNextVideo();
          },
        },
      });
    }

    if (window.YT?.Player) {
      buildPlayer();
    } else {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        buildPlayer();
      };
    }

    return () => {
      /* Não destruir aqui — será destruído no próximo ciclo para evitar flickering */
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);

  /* ── Unmount: limpar player, timeouts e polling ─────────────────── */
  useEffect(() => {
    return () => {
      if (ytPlayer.current) { try { ytPlayer.current.destroy(); } catch(_) {} }
      if (errorTimeout.current)   clearTimeout(errorTimeout.current);
      if (skipTimeoutRef.current) clearTimeout(skipTimeoutRef.current);
      if (liveTimerRef.current)   clearInterval(liveTimerRef.current);
    };
  }, []);

  /* ── Sincronizar resultsRef com o estado ────────────────────────── */
  useEffect(() => { resultsRef.current = results; }, [results]);

  /* ── Buscar transcript quando o vídeo muda ──────────────────────── */
  useEffect(() => {
    if (!selected) {
      setTranscript([]); setLiveSubIdx(-1); liveSubIdxRef.current = -1;
      return;
    }
    setTranscript([]); setLiveSubIdx(-1); liveSubIdxRef.current = -1;
    setTransLoading(true);
    fetch(`${BACKEND}/api/youtube/transcript/${selected.id}`)
      .then(r => r.json())
      .then(d => { setTranscript(d.segments || []); })
      .catch(() => {})
      .finally(() => setTransLoading(false));
  }, [selected?.id]);

  /* ── Polling: sync CC em tempo real (100ms) ─────────────────────── */
  useEffect(() => {
    if (liveTimerRef.current) clearInterval(liveTimerRef.current);
    if (!isPlaying || !transcript.length) return;
    liveTimerRef.current = setInterval(() => {
      try {
        const t = ytPlayer.current?.getCurrentTime?.() ?? 0;
        let lo = 0, hi = transcript.length - 1, found = -1;
        while (lo <= hi) {
          const mid = (lo + hi) >> 1;
          if (transcript[mid].start <= t) { found = mid; lo = mid + 1; }
          else hi = mid - 1;
        }
        if (found !== liveSubIdxRef.current) {
          liveSubIdxRef.current = found;
          setLiveSubIdx(found);
        }
      } catch { /* player ainda não pronto */ }
    }, 100);
    return () => { if (liveTimerRef.current) clearInterval(liveTimerRef.current); };
  }, [isPlaying, transcript]);

  /* ── Velocidade — aplica imediatamente ao player ─────────────────── */
  useEffect(() => {
    speedRef.current = speed;
    try { ytPlayer.current?.setPlaybackRate(speed); } catch(_) {}
  }, [speed]);

  /* ── Limpa ruído de títulos do YouTube ─────────────────────────── */
  function cleanTitle(s: string) {
    return htmlDecode(s)
      .replace(/\([^)]*official[^)]*\)/gi, "")
      .replace(/\[[^\]]*official[^\]]*\]/gi, "")
      .replace(/official music video|official video|official audio|music video|lyric video/gi, "")
      .replace(/\([^)]*lyrics?[^)]*\)/gi, "")
      .replace(/\s+/g, " ").trim();
  }

  /* ── Extrai {artist, title} de várias convenções do YouTube ─────── */
  function parseArtistTitle(
    vTitle: string,
    vChannel?: string
  ): { artist: string; title: string } | null {
    const title   = cleanTitle(vTitle);
    const channel = vChannel ? htmlDecode(vChannel) : "";

    /* 1. "Artista - Música" ou "Artista — Música" no título */
    for (const sep of [" - ", " — ", " – "]) {
      const idx = title.indexOf(sep);
      if (idx > 0) {
        return { artist: title.slice(0, idx).trim(), title: title.slice(idx + sep.length).trim() };
      }
    }

    /* 2. Canal "Artista - Topic" (YouTube Music) → artista vem do canal */
    if (channel) {
      const topicMatch = channel.match(/^(.+?)\s*-\s*Topic$/i);
      if (topicMatch) {
        return { artist: topicMatch[1].trim(), title: title };
      }
      /* 3. Canal é só o nome do artista (sem "Topic") e título é a música */
      if (!channel.toLowerCase().includes("vevo") && title && !title.includes(" - ")) {
        const chan = channel.replace(/\s*VEVO\s*$/i, "").trim();
        if (chan) return { artist: chan, title };
      }
    }

    return null;
  }

  async function fetchAutoLyrics(vTitle: string, vChannel?: string) {
    const parsed = parseArtistTitle(vTitle, vChannel);
    if (!parsed) {
      setLyricsFetchMsg("❌ Artista não detectado. Cola manualmente ou renomeia no formato 'Artista - Música'.");
      return;
    }
    setFetchingLyrics(true);
    setLyricsFetchMsg("");
    const { artist, title } = parsed;

    try {
      /* ── 1ª tentativa: backend Letras.mus.br (EN + tradução PT) ── */
      try {
        const r1 = await fetch(
          `${BACKEND}/api/lyrics/search?artist=${encodeURIComponent(artist)}&title=${encodeURIComponent(title)}`
        );
        if (r1.ok) {
          const d = await r1.json();
          if (d.en) {
            setRawEn(d.en);
            if (d.pt) setRawPt(d.pt);
            setLyricsFetchMsg(
              `✅ "${title}" carregada do Letras.mus.br${d.pt ? " com tradução PT 🇵🇹" : ""}!`
            );
            setTimeout(() => { setLyricsMode("view"); setLyricsFetchMsg(""); }, 900);
            return;
          }
        }
      } catch { /* falha silenciosa — tenta fallback */ }

      /* ── 2ª tentativa: lyrics.ovh (só inglês) ─────────────────── */
      const r2   = await fetch(
        `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`
      );
      const data = await r2.json();
      if (data.lyrics) {
        setRawEn(data.lyrics.replace(/\r\n/g, "\n").trim());
        setLyricsFetchMsg(`✅ Letra de "${title}" carregada (sem tradução PT).`);
        setTimeout(() => { setLyricsMode("view"); setLyricsFetchMsg(""); }, 800);
      } else {
        setLyricsFetchMsg("❌ Letra não encontrada. Tenta com o nome exacto ou cola manualmente.");
      }
    } catch {
      setLyricsFetchMsg("❌ Erro de ligação. Cola manualmente abaixo.");
    } finally {
      setFetchingLyrics(false);
    }
  }

  /* ── Handlers ────────────────────────────────────────────────────── */
  function selectVideo(v: YTVideo) {
    setSelected(v); setIsPlaying(false); setVidError(false);
    /* Não resetar velocidade — mantém a preferência do utilizador */
  }
  function handleWordClick(lineId: number, wordIdx: number) {
    setLines(prev => prev.map(l => {
      if (l.id !== lineId) return l;
      const hl = l.highlighted.includes(wordIdx)
        ? l.highlighted.filter(i => i !== wordIdx)
        : [...l.highlighted, wordIdx];
      return {...l, highlighted: hl};
    }));
  }
  function handleDifficultyChange(lineId: number, diff: Difficulty) {
    setLines(prev => prev.map(l => l.id===lineId ? {...l, difficulty:diff} : l));
  }
  function activeLyricText() {
    const l = lines[activeLine];
    return l?.en || "";
  }
  function tryNextVideo() { skipToNextVideo(); }

  const wordCount = useMemo(
    () => lines.reduce((s,l) => s + l.highlighted.length, 0),
    [lines]
  );

  /* ══════════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════════ */

  /* Lista de músicas — reutilizada em desktop (esq) e tab mobile */
  const MusicList = () => (
    <div className="flex flex-col gap-2 h-full">
      <form onSubmit={e=>{e.preventDefault();searchVideos(query);}}
        className="flex-shrink-0 bg-white/10 backdrop-blur rounded-2xl p-3 space-y-2.5">
        <label className="block text-[11px] font-bold text-purple-300 uppercase tracking-widest">
          🔍 Pesquisar
        </label>
        <div className="flex gap-2">
          <input value={query} onChange={e=>setQuery(e.target.value)}
            placeholder="Adele, Ed Sheeran…"
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-sm placeholder-white/35 focus:outline-none focus:border-purple-400 transition-colors" />
          <button type="submit" disabled={loading}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 px-4 min-h-[44px] rounded-xl text-sm font-bold transition-colors">
            {loading ? "…" : "Ir"}
          </button>
        </div>
        <div className="flex flex-wrap gap-1">
          {SUGGESTED.map(s => (
            <button key={s} type="button"
              onClick={()=>{setQuery(s);searchVideos(s);}}
              className="text-[11px] bg-white/8 hover:bg-purple-700/50 border border-white/10 rounded-full px-2.5 py-1 transition-colors">
              {s.length>22 ? s.slice(0,20)+"…" : s}
            </button>
          ))}
        </div>
      </form>

      {error && (
        <div className="flex-shrink-0 bg-red-500/15 border border-red-400/30 rounded-xl p-3 text-xs text-red-300">⚠️ {error}</div>
      )}

      <div className="flex-1 overflow-y-auto space-y-1.5 overscroll-contain pr-1">
        {loading && (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <div className="flex items-end gap-1">
              {EQ_CLS.slice(0,5).map((cls,i) => (
                <div key={i} className={cls} style={{width:6,backgroundColor:EQ_COL[i],borderRadius:3,minHeight:3}} />
              ))}
            </div>
            <p className="text-xs text-purple-300">A carregar…</p>
          </div>
        )}
        {results.map(video => {
          const active = selected?.id === video.id;
          return (
            <button key={video.id} onClick={()=>selectVideo(video)}
              className={`w-full text-left flex gap-3 p-3 rounded-xl transition-all border ${
                active
                  ? "bg-purple-600/40 border-purple-400/60 shadow-lg shadow-purple-900/40"
                  : "bg-white/4 hover:bg-white/8 border-transparent hover:border-white/10"
              }`}
              style={{touchAction:'manipulation'}}>
              <div className="relative flex-shrink-0">
                <img src={video.thumbnail} alt=""
                  className="w-16 h-11 object-cover rounded-lg" loading="lazy" />
                {active && isPlaying && (
                  <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                    <div className="flex items-end gap-0.5" style={{height:12}}>
                      {["eq1","eq3","eq5"].map(cls=>(
                        <div key={cls} className={cls} style={{width:2,backgroundColor:"#c084fc",borderRadius:2,minHeight:2}} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-xs font-semibold line-clamp-2 leading-snug text-white">{htmlDecode(video.title)}</p>
                <p className="text-[11px] text-purple-300/80 mt-1 truncate">{htmlDecode(video.channel)}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <style>{ANIM_STYLE}</style>
      <div className="flex flex-col bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white"
        style={{minHeight:'100dvh', paddingBottom:'env(safe-area-inset-bottom)'}}>

        {/* Header */}
        <div className="flex-shrink-0 bg-gradient-to-r from-purple-800 via-violet-700 to-indigo-800 px-4 shadow-xl"
          style={{height:52, paddingTop:'env(safe-area-inset-top)'}}>
          <div className="max-w-7xl mx-auto h-full relative flex items-center justify-center">
            <Link to="/lessons"
              className="absolute left-0 flex items-center gap-1.5 text-purple-200 hover:text-white transition-colors px-2"
              style={{minHeight:44,minWidth:44,touchAction:'manipulation'}}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
              </svg>
              <span className="text-sm font-semibold hidden sm:inline">Voltar</span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-lg">🎵</span>
              <h1 className="text-sm sm:text-base font-black tracking-tight">Música · Inglês</h1>
            </div>
          </div>
        </div>

        {/* ── DESKTOP: grid lado a lado ── MOBILE: coluna única ── */}
        <div className="flex-1 max-w-7xl mx-auto w-full px-3 py-2 lg:grid lg:grid-cols-3 lg:gap-3 lg:overflow-hidden lg:min-h-0">

          {/* ══ Lista (desktop esquerda, mobile via tab) ══ */}
          <div className="hidden lg:flex lg:col-span-1 lg:flex-col lg:min-h-0 gap-2">
            <MusicList />
          </div>

          {/* ══ Conteúdo principal ══ */}
          <div className="lg:col-span-2 flex flex-col gap-2 lg:min-h-0 lg:overflow-y-auto">

            {/* Player */}
            <div className={`rounded-2xl overflow-hidden shadow-2xl aspect-video relative bg-black flex-shrink-0 ${isPlaying?"player-glow":""}`}>
              <div id="yt-player-root" className="w-full h-full"
                style={{display: selected&&!vidError ? "block":"none"}} />

              {selected && vidError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-900">
                  <span className="text-5xl">😔</span>
                  <p className="text-white/70 text-sm font-semibold">Vídeo não disponível.</p>
                  <button onClick={tryNextVideo} style={{touchAction:'manipulation'}}
                    className="bg-purple-600 hover:bg-purple-700 px-5 py-3 min-h-[44px] rounded-xl text-sm font-bold transition-colors">
                    ▶ Próximo vídeo
                  </button>
                </div>
              )}

              {!selected && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/25 gap-4">
                  <div className="flex items-end gap-1 opacity-40">
                    {EQ_CLS.map(cls=>(
                      <div key={cls} className={cls} style={{width:7,backgroundColor:"#a855f7",borderRadius:3,minHeight:3}} />
                    ))}
                  </div>
                  <p className="text-base font-semibold">Escolhe uma música</p>
                  <p className="text-xs text-white/20">Pesquisa ou selecciona da lista</p>
                </div>
              )}
            </div>

            {/* Now Playing */}
            {selected && !vidError && (
              <NowPlayingBar video={selected} isPlaying={isPlaying} activeLyric={activeLyricText()} />
            )}

            {/* CC em tempo real */}
            {transcript.length > 0 && (
              <CinemaTranscript lines={transcriptLines} active={liveSubIdx} isPlaying={isPlaying} />
            )}
            {transLoading && selected && !transcript.length && (
              <div className="flex items-center gap-2 text-xs text-purple-400/50 justify-center py-1 flex-shrink-0">
                <div className="w-3 h-3 border border-purple-400/40 border-t-purple-400 rounded-full animate-spin" />
                A carregar legendas em tempo real…
              </div>
            )}

            {/* Legenda da letra manual */}
            {lines.length > 0 && (
              <CinemaLyricDisplay lines={lines} activeLine={activeLine} isPlaying={isPlaying} />
            )}

            {/* Velocidade */}
            <div className="flex-shrink-0 bg-white/8 backdrop-blur rounded-2xl px-4 py-3 flex items-center gap-3 border border-white/8">
              <p className="text-[11px] font-bold text-purple-300 uppercase tracking-wider flex-shrink-0">Velocidade</p>
              <div className="flex gap-2 flex-1">
                {SPEED_OPTIONS.map(({label,value}) => (
                  <button key={value} onClick={()=>setSpeed(value)} style={{touchAction:'manipulation'}}
                    className={`flex-1 py-2.5 min-h-[44px] rounded-xl text-sm font-black transition-all ${
                      speed===value
                        ? value===0.5  ? "bg-red-600 text-white shadow-lg scale-105"
                        : value===0.75 ? "bg-yellow-600 text-white shadow-lg scale-105"
                        :                "bg-green-600 text-white shadow-lg scale-105"
                        : "bg-white/10 hover:bg-white/15 text-white/60"
                    }`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Tabs: 🎤 Letras | 🔍 Músicas (mobile only para lista) ── */}
            <div className="flex-shrink-0 flex rounded-2xl overflow-hidden border border-white/10">
              <button onClick={()=>setTab("lyrics")} style={{touchAction:'manipulation'}}
                className={`flex-1 py-3 min-h-[44px] text-sm font-bold transition-colors ${
                  tab==="lyrics"
                    ? "bg-purple-700/70 text-white"
                    : "bg-white/5 text-white/50 hover:text-white hover:bg-white/8"
                }`}>
                🎤 Letras
              </button>
              <div className="w-px bg-white/10" />
              <button onClick={()=>setTab("list")} style={{touchAction:'manipulation'}}
                className={`flex-1 py-3 min-h-[44px] text-sm font-bold transition-colors lg:hidden ${
                  tab==="list"
                    ? "bg-indigo-700/70 text-white"
                    : "bg-white/5 text-white/50 hover:text-white hover:bg-white/8"
                }`}>
                🔍 Músicas
              </button>
            </div>

            {/* ── Conteúdo das tabs ── */}
            <div className="flex-1 bg-white/8 backdrop-blur rounded-2xl overflow-hidden border border-white/8 flex flex-col" style={{minHeight:280}}>

              {/* Lista mobile */}
              {tab==="list" && (
                <div className="flex-1 p-3 overflow-hidden flex flex-col lg:hidden">
                  <MusicList />
                </div>
              )}

              {/* Letras */}
              {tab==="lyrics" && (
                <div className="flex flex-col flex-1 overflow-hidden">
                  {/* Sub-tabs */}
                  <div className="flex-shrink-0 flex gap-2 px-4 pt-3 pb-2 border-b border-white/8">
                    <button onClick={()=>setLyricsMode("edit")} style={{touchAction:'manipulation'}}
                      className={`px-4 py-2 min-h-[40px] rounded-xl text-xs font-bold transition-all ${
                        lyricsMode==="edit" ? "bg-purple-600 text-white" : "bg-white/10 text-white/55 hover:text-white"
                      }`}>
                      ✏️ Editar Letra
                    </button>
                    <button onClick={()=>setLyricsMode("view")} disabled={!lines.length} style={{touchAction:'manipulation'}}
                      className={`px-4 py-2 min-h-[40px] rounded-xl text-xs font-bold transition-all disabled:opacity-35 ${
                        lyricsMode==="view" ? "bg-violet-600 text-white" : "bg-white/10 text-white/55 hover:text-white"
                      }`}>
                      🎤 Interactiva {lines.length>0 && `(${lines.length})`}
                    </button>
                    {wordCount > 0 && (
                      <span className="ml-auto text-xs text-yellow-300 bg-yellow-500/10 px-2.5 py-2 rounded-xl self-center">
                        🟡 {wordCount}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto overscroll-contain pb-4">

                    {/* EDIÇÃO */}
                    {lyricsMode==="edit" && (
                      <div className="p-4 space-y-3">
                        {selected && (
                          <div className="flex flex-wrap items-center gap-2 p-3 bg-purple-900/30 border border-purple-500/20 rounded-xl">
                            <button
                              onClick={()=>{setLyricsFetchMsg("");fetchAutoLyrics(selected.title,selected.channel);}}
                              disabled={fetchingLyrics} style={{touchAction:'manipulation'}}
                              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 disabled:opacity-50 px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-lg min-h-[44px]">
                              {fetchingLyrics ? "⏳ A buscar…" : "✨ Buscar Letra + Tradução PT"}
                            </button>
                            {lyricsFetchMsg && (
                              <span className={`text-xs font-semibold ${lyricsFetchMsg.startsWith("✅")?"text-green-300":"text-red-300"}`}>
                                {lyricsFetchMsg}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-bold text-purple-300 uppercase tracking-widest block mb-2">🇬🇧 Inglês</label>
                            <textarea value={rawEn} onChange={e=>setRawEn(e.target.value)}
                              placeholder={"Cole a letra em inglês,\numa linha por verso…"}
                              rows={8}
                              className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/25 resize-none focus:outline-none focus:border-purple-400 font-mono leading-6 transition-colors" />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-purple-300 uppercase tracking-widest block mb-2">🇵🇹 Tradução (opcional)</label>
                            <textarea value={rawPt} onChange={e=>setRawPt(e.target.value)}
                              placeholder={"Traduz cada verso\n(uma linha por verso)…"}
                              rows={8}
                              className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/25 resize-none focus:outline-none focus:border-purple-400 font-mono leading-6 transition-colors" />
                          </div>
                        </div>
                        {rawEn && (
                          <button onClick={()=>setLyricsMode("view")} style={{touchAction:'manipulation'}}
                            className="w-full py-3 min-h-[44px] bg-violet-600 hover:bg-violet-500 rounded-xl text-sm font-bold transition-colors">
                            ▶ Ver Legenda Interactiva →
                          </button>
                        )}
                      </div>
                    )}

                    {/* MODO INTERACTIVO */}
                    {lyricsMode==="view" && (
                      <div className="p-3">
                        {/* Controlos karaoke */}
                        <div className="flex flex-wrap items-center gap-2 mb-3 pb-3 border-b border-white/8">
                          <button onClick={()=>setActiveLine(p=>Math.max(0,p-1))} disabled={activeLine===0}
                            style={{touchAction:'manipulation'}}
                            className="bg-white/10 hover:bg-white/20 disabled:opacity-30 px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-bold transition-colors">
                            ← Ant.
                          </button>
                          <button onClick={()=>setActiveLine(p=>Math.min(lines.length-1,p+1))} disabled={activeLine>=lines.length-1}
                            style={{touchAction:'manipulation'}}
                            className="bg-white/10 hover:bg-white/20 disabled:opacity-30 px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-bold transition-colors">
                            Próx. →
                          </button>
                          <button onClick={()=>setAutoMode(p=>!p)} style={{touchAction:'manipulation'}}
                            className={`px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-bold transition-all ${
                              autoMode ? "bg-green-600 text-white shadow-lg" : "bg-white/10 text-white/60 hover:text-white"
                            }`}>
                            {autoMode ? "⏸ Parar" : "▶ Auto"}
                          </button>
                          <div className="flex gap-1">
                            {AUTO_DELAYS.map(d=>(
                              <button key={d.value} onClick={()=>setAutoDelay(d.value)} style={{touchAction:'manipulation'}}
                                className={`px-2.5 py-2 min-h-[36px] rounded-lg text-[11px] font-bold transition-colors ${
                                  autoDelay===d.value ? "bg-purple-600 text-white" : "bg-white/10 text-white/45 hover:text-white"
                                }`}>
                                {d.label}
                              </button>
                            ))}
                          </div>
                          <span className="ml-auto text-xs text-white/35 font-mono">{activeLine+1}/{lines.length}</span>
                          <button onClick={()=>{setActiveLine(0);setAutoMode(false);}} style={{touchAction:'manipulation'}}
                            className="text-xs text-white/35 hover:text-white transition-colors px-2 py-1">
                            ↺
                          </button>
                        </div>
                        <InteractiveLyrics
                          lines={lines}
                          activeLine={activeLine}
                          onLineClick={setActiveLine}
                          onWordClick={handleWordClick}
                          onDifficultyChange={handleDifficultyChange}
                        />
                        <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-white/8 text-[10px] text-white/35">
                          <span>🟡 Marcar palavra</span>
                          <span>⭐ Difícil</span>
                          <span>✅ Aprendi</span>
                          <span>○ Normal</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>{/* fim conteúdo principal */}
        </div>{/* fim grid */}
      </div>{/* fim root */}
    </>
  );
}
