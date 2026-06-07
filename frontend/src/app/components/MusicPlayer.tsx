/* ════════════════════════════════════════════════════════════════════
   NgadaLearn — Music Player  (Spotify + Lyrics API)
   Legenda interactiva: karaoke estiloso, auto-avanço, tradução PT
   ════════════════════════════════════════════════════════════════════ */

import {
  useState, useEffect, useRef, useCallback,
} from "react";
import { Link } from "react-router";

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

@keyframes shimmerText{0%{background-position:0% 50%}100%{background-position:300% 50%}}

@keyframes wordPop{0%{transform:scale(1)}50%{transform:scale(1.18)}100%{transform:scale(1)}}
.word-pop{animation:wordPop .2s ease}

@keyframes cinemaIn{
  0%{opacity:0;transform:translateY(24px) scale(.93);filter:blur(7px)}
  60%{opacity:1;filter:blur(0)}
  100%{transform:translateY(0) scale(1)}
}
.cinema-in{animation:cinemaIn .52s cubic-bezier(.34,1.56,.64,1) both}

@keyframes spin{to{transform:rotate(360deg)}}
`;

/* ── Tipos ────────────────────────────────────────────────────────── */
interface Track {
  id: string; title: string; artist: string; thumbnail: string;
  previewUrl: string | null; albumName: string;
}
type Difficulty = "normal" | "hard" | "learned";

interface LyricLine {
  id: number;
  en: string;
  pt: string;
  difficulty: Difficulty;
}

/* ── Constantes ───────────────────────────────────────────────────── */
const BACKEND = import.meta.env.VITE_API_URL || "https://ngadalearn-api.onrender.com";
const EQ_CLS  = ["eq1","eq2","eq3","eq4","eq5","eq6","eq7"];
const EQ_COL  = ["#c084fc","#a855f7","#9333ea","#818cf8","#6366f1","#38bdf8","#a78bfa"];

const SUGGESTED = [
  "Ed Sheeran",
  "Adele",
  "Taylor Swift",
  "Coldplay",
  "The Beatles",
];

/* ── Utilitários ──────────────────────────────────────────────────── */
function parseLyrics(en: string, pt: string): LyricLine[] {
  const enL = en.split("\n");
  const ptL = pt.split("\n");
  const max = Math.max(enL.length, ptL.length);
  return Array.from({length: max}, (_, i) => ({
    id: i,
    en: (enL[i] ?? "").trim(),
    pt: (ptL[i] ?? "").trim(),
    difficulty: "normal" as Difficulty,
  })).filter(l => l.en || l.pt);
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

/* ── Barra "Now Playing" ──────────────────────────────────────────── */
function NowPlayingBar({track, isPlaying, activeLyric}:
  {track: Track; isPlaying: boolean; activeLyric: string}) {
  const text = activeLyric
    ? `${activeLyric}   •   ${activeLyric}   •   `
    : `${track.title} — ${track.artist}   •   ${track.title} — ${track.artist}   •   `;
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
   LYRICS RISER — letras a subir com efeito karaoke
   ════════════════════════════════════════════════════════════════════ */
const LINE_H = 58;

function LyricsRiser({ lines, active, isPlaying, onNext, onPrev }: {
  lines: { en: string; pt?: string }[]; active: number; isPlaying: boolean;
  onNext?: () => void; onPrev?: () => void;
}) {
  const [transl, setTransl]   = useState<string | null>(null);
  const wrapRef               = useRef<HTMLDivElement>(null);
  const [wrapH, setWrapH]     = useState(320);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(es => setWrapH(es[0].contentRect.height));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (!lines.length) return null;

  const PROG  = 3;
  const BADGE = 28;
  const NAV   = (onNext || onPrev) ? 46 : 0;
  const HINT  = (lines.some(l => l.pt) && !transl) ? 18 : 0;
  const TRANSL = transl ? 54 : 0;
  const clipH  = Math.max(LINE_H * 3, wrapH - PROG - BADGE - NAV - HINT - TRANSL);
  const padV   = Math.max(0, (clipH - LINE_H) / 2);
  const ty     = -active * LINE_H;

  return (
    <div ref={wrapRef} style={{
      height: "100%", position: "relative",
      background: "linear-gradient(160deg,rgba(8,2,30,.99) 0%,rgba(32,8,70,.99) 50%,rgba(12,4,40,.99) 100%)",
      border: "1px solid rgba(168,85,247,.25)", borderRadius: 20,
      overflow: "hidden", display: "flex", flexDirection: "column",
    }}>
      {/* Progresso */}
      <div style={{height:PROG,background:"rgba(168,85,247,.1)",flexShrink:0}}>
        <div style={{
          height:"100%",
          width:`${Math.max(0,Math.round(((active+1)/lines.length)*100))}%`,
          background:"linear-gradient(90deg,#a855f7,#7c3aed)",
          transition:"width .25s ease",borderRadius:2,
        }}/>
      </div>

      {/* Badge */}
      <div style={{height:BADGE,display:"flex",alignItems:"center",paddingLeft:16,paddingRight:16,flexShrink:0}}>
        <span style={{fontSize:9,color:"rgba(168,85,247,.4)",letterSpacing:".1em"}}>
          {isPlaying ? "▶ AUTO" : "✦ KARAOKE"}
        </span>
        <div style={{flex:1}}/>
        <span style={{fontSize:10,fontFamily:"monospace",color:"rgba(168,85,247,.3)"}}>
          {active+1}/{lines.length}
        </span>
      </div>

      {/* Container deslizante */}
      <div style={{height:clipH,overflow:"hidden",position:"relative",flexShrink:0}}>
        {/* Fade topo */}
        <div style={{position:"absolute",top:0,left:0,right:0,zIndex:10,pointerEvents:"none",
          height:clipH*0.32,
          background:"linear-gradient(to bottom,rgba(8,2,30,1) 0%,rgba(8,2,30,.7) 60%,transparent 100%)"}}/>
        {/* Barra activa lateral */}
        <div style={{position:"absolute",left:0,top:"50%",transform:"translateY(-50%)",width:3,height:LINE_H,
          background:"linear-gradient(to bottom,transparent,#a855f7,transparent)",borderRadius:2,zIndex:15,pointerEvents:"none"}}/>

        <div style={{
          transform:`translateY(${ty}px)`,
          transition:"transform .5s cubic-bezier(.4,0,.2,1)",
          paddingTop:padV, paddingBottom:padV,
        }}>
          {lines.map((line, i) => {
            const dist  = Math.abs(i - active);
            const isAct = i === active;
            const opacity = dist===0?1:dist===1?.42:dist===2?.22:dist===3?.1:.05;
            const scale   = dist===0?1:dist===1?.93:.85;
            const hasPt   = !!line.pt;
            return (
              <div key={i}
                onClick={() => hasPt ? setTransl(transl === line.pt ? null : (line.pt ?? null)) : undefined}
                style={{
                  height:LINE_H,display:"flex",alignItems:"center",
                  justifyContent:"center",padding:"0 28px",
                  opacity,transform:`scale(${scale})`,
                  transition:"opacity .5s ease, transform .5s ease",
                  cursor:hasPt?"pointer":"default",
                }}>
                <p style={{
                  textAlign:"center",lineHeight:1.3,margin:0,
                  fontSize:isAct?"clamp(1.25rem,3.2vw,1.75rem)":"clamp(.85rem,2.2vw,1.08rem)",
                  fontWeight:isAct?900:400,
                  fontStyle:dist>=2?"italic":"normal",
                  ...(isAct ? {
                    background:"linear-gradient(90deg,#f0abfc,#c084fc,#818cf8,#c084fc,#f0abfc)",
                    backgroundSize:"300% 100%",
                    animation:isPlaying?"shimmerText 3s linear infinite":"none",
                    WebkitBackgroundClip:"text",
                    backgroundClip:"text",
                    color:"transparent",
                    textShadow:"none",
                  } : {
                    color:"rgba(255,255,255,.55)",
                  }),
                }}>{line.en || "♪"}</p>
              </div>
            );
          })}
        </div>

        {/* Fade base */}
        <div style={{position:"absolute",bottom:0,left:0,right:0,zIndex:10,pointerEvents:"none",
          height:clipH*0.28,
          background:"linear-gradient(to top,rgba(8,2,30,1) 0%,rgba(8,2,30,.65) 60%,transparent 100%)"}}/>
      </div>

      {/* Tradução PT */}
      {transl && (
        <div style={{
          flexShrink:0,height:TRANSL,
          background:"rgba(109,40,217,.9)",backdropFilter:"blur(8px)",
          borderTop:"1px solid rgba(168,85,247,.4)",
          padding:"0 16px",display:"flex",alignItems:"center",gap:10,
        }}>
          <span style={{fontSize:15,flexShrink:0}}>🇵🇹</span>
          <p style={{flex:1,margin:0,fontSize:"clamp(.85rem,2vw,1rem)",fontWeight:600,
            color:"#e9d5ff",fontStyle:"italic",lineHeight:1.3}}>{transl}</p>
          <button onClick={()=>setTransl(null)}
            style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,
              width:24,height:24,color:"#c4b5fd",cursor:"pointer",fontSize:13,fontWeight:700,flexShrink:0}}>
            ✕
          </button>
        </div>
      )}

      {/* Dica de clique */}
      {HINT > 0 && (
        <p style={{flexShrink:0,height:HINT,display:"flex",alignItems:"center",
          justifyContent:"center",fontSize:10,color:"rgba(168,85,247,.3)",margin:0}}>
          Clica numa linha para ver a tradução 🇵🇹
        </p>
      )}

      {/* Navegação ← → */}
      {(onPrev || onNext) && (
        <div style={{
          flexShrink:0,height:NAV,
          display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"0 18px",borderTop:"1px solid rgba(168,85,247,.1)",
        }}>
          <button onClick={onPrev} disabled={active===0} style={{
            background:"rgba(255,255,255,.07)",border:"1px solid rgba(168,85,247,.2)",
            borderRadius:10,padding:"5px 20px",fontSize:13,fontWeight:700,touchAction:"manipulation",
            color:active===0?"rgba(255,255,255,.15)":"rgba(196,181,253,.9)",
            cursor:active===0?"not-allowed":"pointer",
          }}>← Ant.</button>
          <button onClick={onNext} disabled={active>=lines.length-1} style={{
            background:"rgba(255,255,255,.07)",border:"1px solid rgba(168,85,247,.2)",
            borderRadius:10,padding:"5px 20px",fontSize:13,fontWeight:700,touchAction:"manipulation",
            color:active>=lines.length-1?"rgba(255,255,255,.15)":"rgba(196,181,253,.9)",
            cursor:active>=lines.length-1?"not-allowed":"pointer",
          }}>Próx. →</button>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ════════════════════════════════════════════════════════════════════ */
export function MusicPlayer() {
  /* Pesquisa */
  const [query,   setQuery]   = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  /* Player */
  const [selected,  setSelected]  = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const autoSelectRef = useRef(true);

  /* Letras */
  const [rawEn, setRawEn] = useState("");
  const [rawPt, setRawPt] = useState("");
  const [lines, setLines] = useState<LyricLine[]>([]);
  const [activeLine, setActiveLine] = useState(0);
  const [lyricsLoading, setLyricsLoading] = useState(false);

  /* Auto-avanço de letras */
  const autoAdvRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Mobile drawer */
  const [mobileListOpen, setMobileListOpen] = useState(false);

  /* ── Parse de letras ──────────────────────────────────────────── */
  useEffect(() => {
    if (rawEn || rawPt) {
      setLines(parseLyrics(rawEn, rawPt));
      setActiveLine(0);
    } else {
      setLines([]);
    }
  }, [rawEn, rawPt]);

  /* ── Auto-avanço (4 s por linha enquanto isPlaying) ──────────── */
  useEffect(() => {
    if (autoAdvRef.current) clearInterval(autoAdvRef.current);
    if (!isPlaying || !lines.length) return;
    autoAdvRef.current = setInterval(() => {
      setActiveLine(p => p >= lines.length - 1 ? p : p + 1);
    }, 4000);
    return () => { if (autoAdvRef.current) clearInterval(autoAdvRef.current); };
  }, [isPlaying, lines.length]);

  /* ── Cleanup ─────────────────────────────────────────────────── */
  useEffect(() => () => {
    if (autoAdvRef.current) clearInterval(autoAdvRef.current);
  }, []);

  /* ── Pesquisa Spotify ────────────────────────────────────────── */
  const searchTracks = useCallback(async (raw: string) => {
    if (!raw.trim()) return;
    setLoading(true); setError(""); setResults([]);
    try {
      const res  = await fetch(`${BACKEND}/api/spotify/search?q=${encodeURIComponent(raw)}`);
      if (!res.ok) throw new Error("Erro ao pesquisar no Spotify");
      const data = await res.json();
      const tracks: Track[] = (data.tracks?.items || []).map((t: any) => ({
        id:         t.id,
        title:      t.name,
        artist:     t.artists.map((a: any) => a.name).join(", "),
        thumbnail:  t.album?.images?.[1]?.url || t.album?.images?.[0]?.url || "",
        previewUrl: t.preview_url ?? null,
        albumName:  t.album?.name || "",
      }));
      const top = tracks.slice(0, 12);
      setResults(top);
      if (!top.length) setError("Nenhuma música encontrada no Spotify.");
      else if (autoSelectRef.current && top[0]) {
        selectTrack(top[0]);
        autoSelectRef.current = false;
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro na pesquisa.");
    } finally { setLoading(false); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Pesquisa inicial */
  useEffect(() => { searchTracks("Ed Sheeran official"); }, [searchTracks]);

  /* ── Buscar letras (backend → lyrics.ovh) ───────────────────── */
  async function fetchLyrics(title: string, artist: string) {
    setLyricsLoading(true);
    setRawEn(""); setRawPt("");

    try {
      const r = await fetch(
        `${BACKEND}/api/lyrics/search?artist=${encodeURIComponent(artist)}&title=${encodeURIComponent(title)}`
      );
      if (r.ok) {
        const d = await r.json();
        if (d.en) {
          setRawEn(d.en);
          if (d.pt) setRawPt(d.pt);
          setLyricsLoading(false);
          return;
        }
      }
    } catch { /* silencioso */ }

    try {
      const r = await fetch(
        `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`
      );
      const d = await r.json();
      if (d.lyrics) setRawEn(d.lyrics.replace(/\r\n/g, "\n").trim());
    } catch { /* silencioso */ }

    setLyricsLoading(false);
  }

  /* ── Selecionar música ───────────────────────────────────────── */
  function selectTrack(track: Track) {
    setSelected(track);
    setIsPlaying(false);
    setRawEn(""); setRawPt("");
    setLines([]); setActiveLine(0);
    fetchLyrics(track.title, track.artist);
  }

  function activeLyricText() {
    return lines[activeLine]?.en || "";
  }

  /* ── Lista de músicas ────────────────────────────────────────── */
  const MusicList = () => (
    <div className="flex flex-col gap-2 h-full">
      <form onSubmit={e=>{e.preventDefault();searchTracks(query);}}
        className="flex-shrink-0 bg-white/10 backdrop-blur rounded-2xl p-3 space-y-2.5">
        <label className="block text-[11px] font-bold text-purple-300 uppercase tracking-widest">
          🔍 Pesquisar no Spotify
        </label>
        <div className="flex gap-2">
          <input value={query} onChange={e=>setQuery(e.target.value)}
            placeholder="Adele, Ed Sheeran…"
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-sm
              placeholder-white/35 focus:outline-none focus:border-purple-400 transition-colors" />
          <button type="submit" disabled={loading}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 px-4 min-h-[44px] rounded-xl text-sm font-bold transition-colors">
            {loading ? "…" : "Ir"}
          </button>
        </div>
        <div className="flex flex-wrap gap-1">
          {SUGGESTED.map(s => (
            <button key={s} type="button"
              onClick={()=>{setQuery(s);autoSelectRef.current=true;searchTracks(s);}}
              className="text-[11px] bg-white/8 hover:bg-purple-700/50 border border-white/10 rounded-full px-2.5 py-1 transition-colors">
              {s}
            </button>
          ))}
        </div>
      </form>

      {error && (
        <div className="flex-shrink-0 bg-red-500/15 border border-red-400/30 rounded-xl p-3 text-xs text-red-300">
          ⚠️ {error}
        </div>
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
        {results.map((track, idx) => {
          const active = selected?.id === track.id;
          const lvl = idx < 4 ? "Iniciante" : idx < 8 ? "Intermédio" : "Avançado";
          const lvlStyle = lvl === "Iniciante"
            ? {background:"rgba(34,197,94,.18)",color:"#4ade80",border:"1px solid rgba(34,197,94,.3)"}
            : lvl === "Intermédio"
            ? {background:"rgba(234,179,8,.18)",color:"#facc15",border:"1px solid rgba(234,179,8,.3)"}
            : {background:"rgba(239,68,68,.18)",color:"#f87171",border:"1px solid rgba(239,68,68,.3)"};
          return (
            <button key={track.id} onClick={()=>selectTrack(track)}
              className={`w-full text-left flex gap-3 p-3 rounded-xl transition-all border ${
                active
                  ? "bg-purple-600/40 border-purple-400/60 shadow-lg shadow-purple-900/40"
                  : "bg-white/4 hover:bg-white/8 border-transparent hover:border-white/10"
              }`}
              style={{touchAction:"manipulation"}}>
              <div className="relative flex-shrink-0">
                {track.thumbnail ? (
                  <img src={track.thumbnail} alt=""
                    className="w-16 h-16 object-cover rounded-lg" loading="lazy" />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-purple-900/40 flex items-center justify-center text-2xl">🎵</div>
                )}
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
                <p className="text-xs font-semibold line-clamp-2 leading-snug text-white">{track.title}</p>
                <p className="text-[11px] text-purple-300/80 mt-0.5 truncate">{track.artist}</p>
                <p className="text-[10px] text-white/30 mt-0.5 truncate">{track.albumName}</p>
                <span style={{...lvlStyle,fontSize:9,fontWeight:700,borderRadius:99,
                  padding:"1px 7px",display:"inline-block",marginTop:3}}>{lvl}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  /* ══════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════ */
  return (
    <>
      <style>{ANIM_STYLE}</style>

      {/* Drawer mobile — lista de músicas */}
      {mobileListOpen && (
        <div style={{position:"fixed",inset:0,zIndex:100,background:"rgba(0,0,0,.75)",backdropFilter:"blur(6px)"}}
          onClick={()=>setMobileListOpen(false)}>
          <div style={{position:"absolute",bottom:0,left:0,right:0,
            background:"linear-gradient(160deg,#0c0520,#1a0840)",
            borderRadius:"20px 20px 0 0",
            padding:"16px 16px calc(16px + env(safe-area-inset-bottom))",
            maxHeight:"78dvh",display:"flex",flexDirection:"column",gap:12}}
            onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <p style={{fontWeight:800,color:"#fff",fontSize:16,margin:0}}>🎵 Músicas</p>
              <button onClick={()=>setMobileListOpen(false)}
                style={{background:"rgba(255,255,255,.12)",border:"none",borderRadius:10,
                  padding:"6px 14px",color:"rgba(255,255,255,.8)",cursor:"pointer",fontSize:13,fontWeight:700}}>
                ✕ Fechar
              </button>
            </div>
            <div style={{flex:1,overflow:"hidden"}}>
              <MusicList />
            </div>
          </div>
        </div>
      )}

      {/* Root */}
      <div className="flex flex-col text-white"
        style={{height:"100dvh",overflow:"hidden",
          background:"linear-gradient(160deg,#07060f 0%,#180a38 45%,#0d0520 100%)",
          paddingBottom:"env(safe-area-inset-bottom)"}}>

        {/* ── Header ── */}
        <div style={{flexShrink:0,height:52,paddingTop:"env(safe-area-inset-top)",
          background:"rgba(0,0,0,.35)",backdropFilter:"blur(20px)",
          borderBottom:"1px solid rgba(168,85,247,.15)"}}>
          <div style={{maxWidth:1400,margin:"0 auto",height:"100%",position:"relative",
            display:"flex",alignItems:"center",justifyContent:"center",padding:"0 16px"}}>
            <Link to="/lessons" style={{position:"absolute",left:16,display:"flex",alignItems:"center",
              gap:6,color:"rgba(196,181,253,.8)",textDecoration:"none",fontSize:14,fontWeight:600}}
              className="hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
              </svg>
              <span className="hidden sm:inline">Voltar</span>
            </Link>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:18}}>🎵</span>
              <h1 style={{fontSize:15,fontWeight:900,margin:0,letterSpacing:"-.3px"}}>Música · Inglês</h1>
            </div>
            <button className="lg:hidden" onClick={()=>setMobileListOpen(true)}
              style={{position:"absolute",right:12,background:"rgba(168,85,247,.2)",
                border:"1px solid rgba(168,85,247,.3)",borderRadius:10,
                padding:"6px 12px",color:"#c4b5fd",fontSize:12,fontWeight:700,cursor:"pointer",touchAction:"manipulation"}}>
              🎵 Lista
            </button>
          </div>
        </div>

        {/* ── Main grid ── */}
        <div style={{flex:1,overflow:"hidden",display:"grid",
          gridTemplateColumns:"minmax(0,1fr)",maxWidth:1400,margin:"0 auto",width:"100%",padding:"10px 12px 8px"}}>
          <style>{`@media(min-width:1024px){.music-grid{grid-template-columns:320px 1fr!important;}}`}</style>
          <div className="music-grid" style={{display:"grid",gridTemplateColumns:"1fr",gap:12,height:"100%",overflow:"hidden"}}>

            {/* Lista (desktop esquerda) */}
            <div className="hidden lg:flex flex-col" style={{overflow:"hidden",gap:8}}>
              <MusicList />
            </div>

            {/* Coluna principal */}
            <div style={{display:"flex",flexDirection:"column",gap:10,overflow:"hidden",minWidth:0}}>

              {/* Spotify Embed */}
              <div style={{flexShrink:0}}>
                {selected ? (
                  <div style={{borderRadius:16,overflow:"hidden",boxShadow:"0 0 30px rgba(109,40,217,.2)"}}>
                    <iframe
                      key={selected.id}
                      src={`https://open.spotify.com/embed/track/${selected.id}?utm_source=generator&theme=0`}
                      width="100%"
                      height="152"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      style={{border:0,display:"block"}}
                    />
                  </div>
                ) : (
                  <div style={{
                    height:152,borderRadius:16,
                    background:"rgba(168,85,247,.06)",
                    border:"1px solid rgba(168,85,247,.15)",
                    display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                    gap:10,color:"rgba(168,85,247,.25)",
                  }}>
                    <div style={{display:"flex",alignItems:"flex-end",gap:3,opacity:.4}}>
                      {EQ_CLS.map(cls=><div key={cls} className={cls} style={{width:7,backgroundColor:"#a855f7",borderRadius:3,minHeight:3}}/>)}
                    </div>
                    <p style={{fontSize:14,fontWeight:600,margin:0}}>Escolhe uma música</p>
                  </div>
                )}
              </div>

              {/* Controlo de letras + Now Playing */}
              {selected && (
                <div style={{flexShrink:0,display:"flex",flexDirection:"column",gap:8}}>
                  <NowPlayingBar track={selected} isPlaying={isPlaying} activeLyric={activeLyricText()}/>

                  {/* Botão toggle letras */}
                  {lines.length > 0 && (
                    <button
                      onClick={() => setIsPlaying(p => !p)}
                      style={{
                        width:"100%",padding:"10px 0",borderRadius:14,fontWeight:800,fontSize:14,
                        border:"1px solid rgba(168,85,247,.4)",cursor:"pointer",touchAction:"manipulation",
                        transition:"all .2s",
                        background: isPlaying
                          ? "rgba(124,58,237,.35)"
                          : "linear-gradient(90deg,rgba(124,58,237,.6),rgba(79,70,229,.6))",
                        color: isPlaying ? "#c4b5fd" : "#fff",
                      }}>
                      {isPlaying ? "⏸ Pausar letras" : "▶ Iniciar letras (auto-avanço)"}
                    </button>
                  )}
                </div>
              )}

              {/* LyricsRiser — preenche o espaço restante */}
              <div style={{flex:1,minHeight:0,overflow:"hidden"}}>
                {lyricsLoading && selected ? (
                  <div style={{height:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                    <div style={{width:14,height:14,border:"2px solid rgba(168,85,247,.4)",
                      borderTopColor:"#a855f7",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>
                    <span style={{fontSize:12,color:"rgba(168,85,247,.5)"}}>A carregar letras…</span>
                  </div>
                ) : lines.length > 0 ? (
                  <LyricsRiser
                    lines={lines.map(l=>({en:l.en,pt:l.pt||undefined}))}
                    active={activeLine}
                    isPlaying={isPlaying}
                    onNext={()=>setActiveLine(p=>Math.min(lines.length-1,p+1))}
                    onPrev={()=>setActiveLine(p=>Math.max(0,p-1))}
                  />
                ) : selected ? (
                  <div style={{height:"100%",display:"flex",alignItems:"center",justifyContent:"center",
                    flexDirection:"column",gap:10,color:"rgba(168,85,247,.25)"}}>
                    <span style={{fontSize:40}}>🎤</span>
                    <span style={{fontSize:13}}>Letras não encontradas para esta música</span>
                  </div>
                ) : (
                  <div style={{height:"100%",display:"flex",alignItems:"center",justifyContent:"center",
                    flexDirection:"column",gap:10,color:"rgba(168,85,247,.2)"}}>
                    <span style={{fontSize:40}}>🎵</span>
                    <span style={{fontSize:13}}>Seleciona uma música para ver as letras</span>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
