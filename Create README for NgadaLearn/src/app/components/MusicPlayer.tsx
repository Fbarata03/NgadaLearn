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
    <div ref={containerRef} className="space-y-1 max-h-[40vh] lg:max-h-[52vh] overflow-y-auto pr-1 py-1">
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

  /* Notas */
  const [notes, setNotes] = useState("");

  /* Tab principal */
  const [tab, setTab] = useState<"lyrics"|"notes">("lyrics");

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
  return (
    <>
      <style>{ANIM_STYLE}</style>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white pb-12">

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-800 via-violet-700 to-indigo-800 py-4 sm:py-7 px-4 shadow-xl">
          <div className="relative flex items-center justify-center">
            <Link to="/lessons" className="absolute left-0 flex items-center gap-1.5 text-purple-200 hover:text-white transition-colors py-2 px-1 -ml-1 min-h-[44px]">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
              <span className="text-sm font-semibold">Conteúdo</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3 mb-1">
              <span className="text-2xl sm:text-4xl">🎵</span>
              <h1 className="text-lg sm:text-3xl font-black tracking-tight">Música para Aprender Inglês</h1>
              <span className="text-2xl sm:text-4xl">🎵</span>
            </div>
          </div>
          <p className="text-purple-200 text-xs max-w-xl mx-auto text-center mt-1">
            Vídeos oficiais · Legenda interactiva linha a linha · Destaque de palavras · Karaoke automático
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── Coluna Esquerda: pesquisa ─────────────────────────── */}
          <div className="lg:col-span-1 space-y-4 order-2 lg:order-1">
            <form onSubmit={e=>{e.preventDefault();searchVideos(query);}}
              className="bg-white/10 backdrop-blur rounded-xl p-4 space-y-3">
              <label className="block text-xs font-bold text-purple-200 uppercase tracking-widest">
                🔍 Pesquisar Música Oficial
              </label>
              <div className="flex gap-2">
                <input value={query} onChange={e=>setQuery(e.target.value)}
                  placeholder="Ex: Adele Hello official…"
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm placeholder-white/40 focus:outline-none focus:border-purple-400 transition-colors" />
                <button type="submit" disabled={loading}
                  className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                  {loading ? "…" : "Ir"}
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {SUGGESTED.map(s => (
                  <button key={s} type="button"
                    onClick={() => {setQuery(s); searchVideos(s);}}
                    className="text-xs bg-purple-800/60 hover:bg-purple-700 rounded-full px-2 py-1 transition-colors">
                    {s.length>24 ? s.slice(0,22)+"…" : s}
                  </button>
                ))}
              </div>
            </form>

            {error && (
              <div className="bg-red-500/20 border border-red-400/40 rounded-xl p-3 text-sm text-red-300">
                ⚠️ {error}
              </div>
            )}

            <div className="space-y-2 max-h-[40vh] lg:max-h-[62vh] overflow-y-auto pr-1">
              {loading && (
                <div className="text-center py-10">
                  <div className="flex justify-center gap-1 mb-3">
                    {EQ_CLS.slice(0,5).map((cls,i) => (
                      <div key={i} className={cls} style={{width:6,backgroundColor:EQ_COL[i],borderRadius:3,minHeight:3}} />
                    ))}
                  </div>
                  <p className="text-sm text-purple-300">A carregar…</p>
                </div>
              )}
              {results.map(video => {
                const active = selected?.id === video.id;
                return (
                  <button key={video.id} onClick={() => selectVideo(video)}
                    className={`w-full text-left flex gap-3 p-3 rounded-xl transition-all border ${
                      active
                        ? "bg-purple-600/50 border-purple-400 shadow-lg shadow-purple-900/50"
                        : "bg-white/5 hover:bg-white/10 border-transparent"
                    }`}>
                    <div className="relative flex-shrink-0">
                      <img src={video.thumbnail} alt={video.title}
                        className="w-20 h-14 object-cover rounded-lg" loading="lazy" />
                      {active && isPlaying && (
                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                          <div className="flex items-end gap-0.5" style={{height:14}}>
                            {["eq1","eq3","eq5"].map(cls => (
                              <div key={cls} className={cls} style={{width:3,backgroundColor:"#c084fc",borderRadius:2,minHeight:2}} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-semibold line-clamp-2 leading-snug">{video.title}</p>
                      <p className="text-xs text-purple-300 mt-1 truncate">{video.channel}</p>
                      <span className="text-[10px] bg-green-600/30 text-green-300 px-1.5 py-0.5 rounded-full">✓ official</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Coluna Direita: player + legenda ──────────────────── */}
          <div className="lg:col-span-2 space-y-4 order-1 lg:order-2">

            {/* Player — gerido pela YouTube IFrame API */}
            <div className={`rounded-2xl overflow-hidden shadow-2xl aspect-video relative bg-black ${isPlaying ? "player-glow" : ""}`}>
              {/* Contentor onde o YT.Player injeta o iframe */}
              <div
                id="yt-player-root"
                className="w-full h-full"
                style={{ display: selected && !vidError ? "block" : "none" }}
              />

              {/* Erro de embed */}
              {selected && vidError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-900">
                  <span className="text-5xl">😔</span>
                  <p className="text-white/70 text-sm font-semibold">Este vídeo não pode ser incorporado.</p>
                  <button onClick={tryNextVideo}
                    className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-lg text-sm font-bold transition-colors">
                    ▶ Tentar próximo vídeo
                  </button>
                </div>
              )}

              {/* Estado inicial */}
              {!selected && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/30 gap-4">
                  <div className="flex items-end gap-1 opacity-40">
                    {EQ_CLS.map(cls => (
                      <div key={cls} className={cls} style={{width:7,backgroundColor:"#a855f7",borderRadius:3,minHeight:3}} />
                    ))}
                  </div>
                  <p className="text-lg font-semibold">Selecciona uma música para começar</p>
                </div>
              )}
            </div>

            {/* Now Playing bar com legenda activa */}
            {selected && !vidError && (
              <NowPlayingBar
                video={selected}
                isPlaying={isPlaying}
                activeLyric={activeLyricText()}
              />
            )}

            {/* ✨ CC automático em tempo real (quando transcript disponível) */}
            {transcript.length > 0 && (
              <CinemaTranscript
                lines={transcriptLines}
                active={liveSubIdx}
                isPlaying={isPlaying}
              />
            )}
            {transLoading && selected && !transcript.length && (
              <div className="flex items-center gap-2 text-xs text-purple-400/50 justify-center py-1">
                <div className="w-3 h-3 border border-purple-400/40 border-t-purple-400 rounded-full animate-spin" />
                A carregar legendas automáticas…
              </div>
            )}

            {/* ✨ Legenda Animada Cinema (letra manual) */}
            {lines.length > 0 && (
              <CinemaLyricDisplay
                lines={lines}
                activeLine={activeLine}
                isPlaying={isPlaying}
              />
            )}

            {/* Velocidade */}
            <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-3 flex items-center gap-3">
              <p className="text-xs font-bold text-purple-200 uppercase tracking-widest flex-shrink-0">🐢 Velocidade</p>
              <div className="flex gap-1.5 flex-1">
                {SPEED_OPTIONS.map(({label,value}) => (
                  <button
                    key={value}
                    onClick={() => setSpeed(value)}
                    className={`flex-1 py-2 rounded-lg text-sm font-black transition-all ${
                      speed === value
                        ? value === 0.5  ? "bg-red-600 text-white shadow-md scale-105"
                        : value === 0.75 ? "bg-yellow-600 text-white shadow-md scale-105"
                        :                  "bg-green-600 text-white shadow-md scale-105"
                        : "bg-white/10 hover:bg-white/20 text-white/70"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <span className={`text-[11px] font-bold flex-shrink-0 hidden sm:block ${
                speed === 0.5  ? "text-red-300"    :
                speed === 0.75 ? "text-yellow-300" : "text-green-300"
              }`}>
                {speed === 0.5 ? "Muito lento" : speed === 0.75 ? "Lento" : "Normal"}
              </span>
            </div>

            {/* ── SECÇÃO PRINCIPAL: LETRAS / NOTAS ─────────────────── */}
            <div className="bg-white/10 backdrop-blur rounded-xl overflow-hidden">

              {/* Tabs */}
              <div className="flex border-b border-white/10">
                <button onClick={()=>setTab("lyrics")}
                  className={`flex-1 py-3 text-sm font-bold transition-colors ${
                    tab==="lyrics"
                      ? "bg-purple-700/60 text-white border-b-2 border-purple-400"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}>
                  🎤 Legenda
                </button>
                <button onClick={()=>setTab("notes")}
                  className={`flex-1 py-3 text-sm font-bold transition-colors ${
                    tab==="notes"
                      ? "bg-indigo-700/60 text-white border-b-2 border-indigo-400"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}>
                  🗒️ Anotações
                </button>
              </div>

              {/* ── Aba LETRAS ────────────────────────────────────── */}
              {tab==="lyrics" && (
                <div>
                  {/* Sub-tabs: Editar / Ver */}
                  <div className="flex gap-2 px-4 pt-3 pb-2 border-b border-white/5">
                    <button onClick={()=>setLyricsMode("edit")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        lyricsMode==="edit"
                          ? "bg-purple-600 text-white"
                          : "bg-white/10 text-white/60 hover:text-white"
                      }`}>
                      ✏️ Editar Letra
                    </button>
                    <button onClick={()=>setLyricsMode("view")}
                      disabled={!lines.length}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-40 ${
                        lyricsMode==="view"
                          ? "bg-violet-600 text-white"
                          : "bg-white/10 text-white/60 hover:text-white"
                      }`}>
                      🎤 Legenda Interactiva {lines.length>0 && `(${lines.length} linhas)`}
                    </button>

                    {/* Estatísticas rápidas */}
                    {wordCount > 0 && (
                      <span className="ml-auto text-xs text-yellow-300 bg-yellow-500/10 px-2 py-1.5 rounded-lg">
                        🟡 {wordCount} palavra{wordCount!==1?"s":""} marcada{wordCount!==1?"s":""}
                      </span>
                    )}
                  </div>

                  {/* MODO EDIÇÃO */}
                  {lyricsMode==="edit" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4">

                      {/* ── Buscar letra automaticamente ── */}
                      {selected && (
                        <div className="md:col-span-2 flex flex-wrap items-center gap-2 p-3 bg-purple-900/30 border border-purple-500/20 rounded-xl">
                          <button
                            onClick={() => { setLyricsFetchMsg(""); fetchAutoLyrics(selected.title, selected.channel); }}
                            disabled={fetchingLyrics}
                            className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 disabled:opacity-50 px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-lg">
                            {fetchingLyrics ? "⏳ A buscar no Letras.mus.br…" : "✨ Buscar Letra + Tradução PT"}
                          </button>
                          {lyricsFetchMsg && (
                            <span className={`text-xs font-semibold ${lyricsFetchMsg.startsWith("✅") ? "text-green-300" : "text-red-300"}`}>
                              {lyricsFetchMsg}
                            </span>
                          )}
                          {!lyricsFetchMsg && !fetchingLyrics && (
                            <span className="text-xs text-white/35">
                              Letras.mus.br · formato "Artista - Música" · preenche EN + PT automaticamente
                            </span>
                          )}
                        </div>
                      )}

                      <div>
                        <label className="text-xs font-bold text-purple-300 uppercase tracking-widest block mb-2">
                          🇬🇧 Letra em Inglês
                        </label>
                        <textarea value={rawEn} onChange={e=>setRawEn(e.target.value)}
                          placeholder={"Cole a letra em inglês aqui,\numa linha por verso…"}
                          rows={11}
                          className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/25 resize-y focus:outline-none focus:border-purple-400 font-mono leading-7 transition-colors" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-purple-300 uppercase tracking-widest block mb-2">
                          🇵🇹 Tradução linha a linha (opcional)
                        </label>
                        <textarea value={rawPt} onChange={e=>setRawPt(e.target.value)}
                          placeholder={"Traduz cada verso aqui\n(uma linha por verso)…"}
                          rows={11}
                          className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/25 resize-y focus:outline-none focus:border-purple-400 font-mono leading-7 transition-colors" />
                      </div>
                      {rawEn && (
                        <div className="md:col-span-2 flex justify-end">
                          <button onClick={()=>setLyricsMode("view")}
                            className="bg-violet-600 hover:bg-violet-500 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                            ▶ Ver Legenda Interactiva →
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* MODO LEGENDA INTERACTIVA */}
                  {lyricsMode==="view" && (
                    <div className="p-4">
                      {/* Controlos karaoke */}
                      <div className="flex flex-wrap items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        {/* Prev / Next */}
                        <button onClick={()=>setActiveLine(p=>Math.max(0,p-1))}
                          disabled={activeLine===0}
                          className="bg-white/10 hover:bg-white/20 disabled:opacity-30 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                          ← Anterior
                        </button>
                        <button onClick={()=>setActiveLine(p=>Math.min(lines.length-1,p+1))}
                          disabled={activeLine>=lines.length-1}
                          className="bg-white/10 hover:bg-white/20 disabled:opacity-30 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                          Próxima →
                        </button>

                        {/* Auto */}
                        <button onClick={()=>setAutoMode(p=>!p)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            autoMode
                              ? "bg-green-600 text-white shadow-lg shadow-green-900/50"
                              : "bg-white/10 text-white/70 hover:text-white"
                          }`}>
                          {autoMode ? "⏸ Parar Auto" : "▶ Auto Karaoke"}
                        </button>

                        {/* Delay do auto */}
                        <div className="flex gap-1">
                          {AUTO_DELAYS.map(d => (
                            <button key={d.value} onClick={()=>setAutoDelay(d.value)}
                              className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                                autoDelay===d.value
                                  ? "bg-purple-600 text-white"
                                  : "bg-white/10 text-white/50 hover:text-white"
                              }`}>
                              {d.label}
                            </button>
                          ))}
                        </div>

                        {/* Linha actual */}
                        <span className="ml-auto text-xs text-white/40 font-mono">
                          {activeLine+1}/{lines.length}
                        </span>

                        {/* Reset */}
                        <button onClick={()=>{setActiveLine(0);setAutoMode(false);}}
                          className="text-xs text-white/40 hover:text-white transition-colors px-2">
                          ↺ Reset
                        </button>
                      </div>

                      {/* Legenda linha a linha */}
                      <InteractiveLyrics
                        lines={lines}
                        activeLine={activeLine}
                        onLineClick={setActiveLine}
                        onWordClick={handleWordClick}
                        onDifficultyChange={handleDifficultyChange}
                      />

                      {/* Legenda da legenda 😄 */}
                      <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-white/10 text-[11px] text-white/40">
                        <span>🟡 Palavra marcada (clica para destacar)</span>
                        <span>⭐ Difícil</span>
                        <span>✅ Aprendi</span>
                        <span>○ Normal</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Aba NOTAS ─────────────────────────────────────── */}
              {tab==="notes" && (
                <div className="p-4">
                  <label className="text-xs font-bold text-indigo-300 uppercase tracking-widest block mb-2">
                    🗒️ Bloco de Notas em Tempo Real
                  </label>
                  <textarea value={notes} onChange={e=>setNotes(e.target.value)}
                    placeholder={`Escreve enquanto ouves:\n• Palavras novas\n• Frases para memorizar\n• Pronúncias difíceis\n• Expressões idiomáticas…`}
                    rows={14}
                    className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/25 resize-y focus:outline-none focus:border-indigo-400 font-mono leading-7 transition-colors" />
                  {notes && (
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-white/40">{notes.length} caracteres</span>
                      <button onClick={()=>{
                        const a = document.createElement("a");
                        a.href = URL.createObjectURL(new Blob([notes],{type:"text/plain"}));
                        a.download = `notas-${(selected?.title||"musica").replace(/[^a-z0-9]/gi,"_").slice(0,30)}.txt`;
                        a.click();
                      }} className="text-xs bg-indigo-600 hover:bg-indigo-500 px-4 py-1.5 rounded-lg font-semibold transition-colors">
                        💾 Guardar .txt
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Dicas */}
            <div className="bg-gradient-to-r from-yellow-700/20 to-orange-700/20 border border-yellow-500/20 rounded-xl p-4">
              <p className="text-xs font-bold text-yellow-300 uppercase tracking-widest mb-2">💡 Como usar a Legenda Interactiva</p>
              <ul className="text-xs text-white/70 space-y-1">
                <li>1️⃣ Cola a letra em inglês na aba "Editar Letra" (uma linha por verso)</li>
                <li>2️⃣ Clica em "Ver Legenda Interactiva"</li>
                <li>3️⃣ Clica em cada <strong>linha</strong> para activar — vai aparecer na barra "Now Playing"</li>
                <li>4️⃣ Clica em <strong>palavras individuais</strong> 🟡 para marcar vocabulário novo</li>
                <li>5️⃣ Usa <strong>Auto Karaoke</strong> para avançar automaticamente (3s / 5s / 8s / 12s)</li>
                <li>6️⃣ Marca cada linha com ⭐ (difícil) ou ✅ (aprendi)</li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
