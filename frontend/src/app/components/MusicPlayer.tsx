/* ════════════════════════════════════════════════════════════════════
   NgadaLearn — Music Player  (Spotify-style UI)
   Last.fm search · YouTube audio · Karaoke lyrics
   ════════════════════════════════════════════════════════════════════ */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router";

/* ── CSS global ──────────────────────────────────────────────────── */
const ANIM_STYLE = `
@keyframes eq1{0%,100%{height:4px}50%{height:18px}}
@keyframes eq2{0%,100%{height:12px}50%{height:4px}}
@keyframes eq3{0%,100%{height:6px}50%{height:22px}}
@keyframes eq4{0%,100%{height:16px}50%{height:3px}}
@keyframes eq5{0%,100%{height:4px}50%{height:16px}}
.eq1{animation:eq1 .8s ease-in-out infinite}
.eq2{animation:eq2 .55s ease-in-out infinite}
.eq3{animation:eq3 .7s ease-in-out infinite}
.eq4{animation:eq4 .9s ease-in-out infinite}
.eq5{animation:eq5 .5s ease-in-out infinite}

@keyframes shimmer{0%{background-position:0% 50%}100%{background-position:300% 50%}}
@keyframes slideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}

.sp-track-active{background:#282828!important;}
.sp-track:hover{background:#282828;}
`;

/* ── Tipos ────────────────────────────────────────────────────────── */
interface Track {
  id: string; title: string; artist: string;
  thumbnail: string; lastfmUrl?: string;
}
type Difficulty = "normal" | "hard" | "learned";
interface LyricLine { id: number; en: string; pt: string; difficulty: Difficulty; }

/* ── Constantes ───────────────────────────────────────────────────── */
const BACKEND  = import.meta.env.VITE_API_URL || "https://ngadalearn-api.onrender.com";
const EQ_CLS   = ["eq1","eq2","eq3","eq4","eq5"];
const SUGGESTED = ["Ed Sheeran","Adele","Taylor Swift","Coldplay"];

/* ── Utilitários ──────────────────────────────────────────────────── */
function parseLyrics(en: string, pt: string): LyricLine[] {
  const enL = en.split("\n"), ptL = pt.split("\n");
  return Array.from({length: Math.max(enL.length, ptL.length)}, (_, i) => ({
    id: i, en: (enL[i]??"").trim(), pt: (ptL[i]??"").trim(), difficulty:"normal" as Difficulty,
  })).filter(l => l.en || l.pt);
}

/* ── Equalizador ──────────────────────────────────────────────────── */
function Equalizer({active}: {active:boolean}) {
  if (!active) return <span style={{fontSize:16,opacity:.5}}>♪</span>;
  return (
    <div className="flex items-end gap-px" style={{height:16}}>
      {EQ_CLS.map((c,i)=>(
        <div key={c} className={c} style={{width:3,borderRadius:2,minHeight:3,
          backgroundColor:["#1DB954","#1ed760","#17a348","#1DB954","#22c55e"][i]}} />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   LYRICS RISER — karaoke estiloso
   ════════════════════════════════════════════════════════════════════ */
const LINE_H = 56;

function LyricsRiser({ lines, active, isPlaying, onNext, onPrev }: {
  lines: {en:string; pt?:string}[]; active: number; isPlaying: boolean;
  onNext?: ()=>void; onPrev?: ()=>void;
}) {
  const [transl, setTransl] = useState<string|null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [wrapH, setWrapH] = useState(340);

  useEffect(() => {
    const el = wrapRef.current; if (!el) return;
    const ro = new ResizeObserver(es => setWrapH(es[0].contentRect.height));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (!lines.length) return null;

  const PROG = 2, BADGE = 32, NAV = (onNext||onPrev)?48:0, HINT = (lines.some(l=>l.pt)&&!transl)?18:0, TRANSL = transl?52:0;
  const clipH = Math.max(LINE_H*3, wrapH - PROG - BADGE - NAV - HINT - TRANSL);
  const padV  = Math.max(0, (clipH - LINE_H) / 2);

  return (
    <div ref={wrapRef} style={{height:"100%",display:"flex",flexDirection:"column",
      background:"rgba(8,2,30,.95)",borderRadius:12,overflow:"hidden",
      border:"1px solid rgba(255,255,255,.06)"}}>

      {/* Progresso */}
      <div style={{height:PROG,background:"#282828",flexShrink:0}}>
        <div style={{height:"100%",
          width:`${Math.round(((active+1)/lines.length)*100)}%`,
          background:"#1DB954",transition:"width .3s ease"}} />
      </div>

      {/* Badge */}
      <div style={{height:BADGE,display:"flex",alignItems:"center",padding:"0 16px",
        flexShrink:0,borderBottom:"1px solid rgba(255,255,255,.05)"}}>
        <span style={{fontSize:9,letterSpacing:".12em",color:"#1DB954",fontWeight:700}}>
          {isPlaying ? "▶ AUTO" : "✦ LETRA"}
        </span>
        <div style={{flex:1}}/>
        <span style={{fontSize:10,fontFamily:"monospace",color:"rgba(255,255,255,.25)"}}>
          {active+1} / {lines.length}
        </span>
      </div>

      {/* Slider */}
      <div style={{height:clipH,overflow:"hidden",position:"relative",flexShrink:0}}>
        <div style={{position:"absolute",top:0,left:0,right:0,zIndex:10,pointerEvents:"none",
          height:clipH*.3,background:"linear-gradient(to bottom,#121212,transparent)"}}/>
        <div style={{position:"absolute",left:0,top:"50%",transform:"translateY(-50%)",
          width:3,height:LINE_H,background:"#1DB954",borderRadius:2,zIndex:15,pointerEvents:"none"}}/>
        <div style={{transform:`translateY(${-active*LINE_H}px)`,
          transition:"transform .5s cubic-bezier(.4,0,.2,1)",paddingTop:padV,paddingBottom:padV}}>
          {lines.map((line,i)=>{
            const dist = Math.abs(i-active), isAct = i===active;
            const opacity = dist===0?1:dist===1?.38:dist===2?.18:.07;
            const scale   = dist===0?1:dist===1?.92:.84;
            return (
              <div key={i} onClick={()=>line.pt?setTransl(transl===line.pt?null:(line.pt??null)):undefined}
                style={{height:LINE_H,display:"flex",alignItems:"center",justifyContent:"center",
                  padding:"0 32px",opacity,transform:`scale(${scale})`,
                  transition:"opacity .4s,transform .4s",cursor:line.pt?"pointer":"default"}}>
                <p style={{textAlign:"center",margin:0,lineHeight:1.3,
                  fontSize:isAct?"clamp(1.2rem,3vw,1.65rem)":"clamp(.8rem,2vw,1rem)",
                  fontWeight:isAct?900:400,
                  ...(isAct?{
                    background:"linear-gradient(90deg,#fff 0%,#e2e2e2 40%,#fff 70%,#e2e2e2 100%)",
                    backgroundSize:"300% 100%",
                    animation:isPlaying?"shimmer 4s linear infinite":"none",
                    WebkitBackgroundClip:"text",backgroundClip:"text",color:"transparent",
                  }:{color:"rgba(255,255,255,.38)"}),
                }}>{line.en||"♪"}</p>
              </div>
            );
          })}
        </div>
        <div style={{position:"absolute",bottom:0,left:0,right:0,zIndex:10,pointerEvents:"none",
          height:clipH*.28,background:"linear-gradient(to top,#121212,transparent)"}}/>
      </div>

      {/* Tradução PT */}
      {transl && (
        <div style={{flexShrink:0,height:TRANSL,background:"#1DB954",
          padding:"0 16px",display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:14,flexShrink:0}}>🇵🇹</span>
          <p style={{flex:1,margin:0,fontSize:"clamp(.82rem,1.8vw,.95rem)",fontWeight:600,
            color:"#000",fontStyle:"italic",lineHeight:1.3}}>{transl}</p>
          <button onClick={()=>setTransl(null)}
            style={{background:"rgba(0,0,0,.2)",border:"none",borderRadius:50,
              width:22,height:22,color:"#000",cursor:"pointer",fontSize:12,fontWeight:700,flexShrink:0}}>✕</button>
        </div>
      )}

      {HINT>0 && (
        <p style={{flexShrink:0,height:HINT,display:"flex",alignItems:"center",
          justifyContent:"center",fontSize:10,color:"rgba(255,255,255,.2)",margin:0}}>
          Clica para ver tradução 🇵🇹
        </p>
      )}

      {/* Navegação */}
      {(onPrev||onNext) && (
        <div style={{flexShrink:0,height:NAV,display:"flex",alignItems:"center",
          justifyContent:"space-between",padding:"0 16px",
          borderTop:"1px solid rgba(255,255,255,.05)"}}>
          <button onClick={onPrev} disabled={active===0} style={{
            background:"transparent",border:"1px solid rgba(255,255,255,.12)",borderRadius:20,
            padding:"5px 18px",fontSize:12,fontWeight:700,touchAction:"manipulation",color:"#fff",
            opacity:active===0?.25:1,cursor:active===0?"not-allowed":"pointer"}}>← Ant.</button>
          <button onClick={onNext} disabled={active>=lines.length-1} style={{
            background:"transparent",border:"1px solid rgba(255,255,255,.12)",borderRadius:20,
            padding:"5px 18px",fontSize:12,fontWeight:700,touchAction:"manipulation",color:"#fff",
            opacity:active>=lines.length-1?.25:1,cursor:active>=lines.length-1?"not-allowed":"pointer"}}>Próx. →</button>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   TRACK LIST — fora do MusicPlayer para não perder foco ao digitar
   ════════════════════════════════════════════════════════════════════ */
interface TrackListProps {
  query: string; setQuery: (q:string)=>void;
  loading: boolean; error: string;
  results: Track[]; selected: Track|null; isPlaying: boolean;
  searchTracks: (q:string)=>void;
  selectTrack: (t:Track)=>void;
  autoSelectRef: React.MutableRefObject<boolean>;
}

function TrackList({ query, setQuery, loading, error, results, selected,
  isPlaying, searchTracks, selectTrack, autoSelectRef }: TrackListProps) {
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {/* Search */}
      <div style={{padding:"12px 12px 8px",flexShrink:0}}>
        <form onSubmit={e=>{e.preventDefault();searchTracks(query);}}
          style={{display:"flex",gap:8,marginBottom:8}}>
          <div style={{flex:1,position:"relative"}}>
            <svg style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",
              opacity:.5,pointerEvents:"none"}} width={14} height={14} fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              value={query}
              onChange={e=>setQuery(e.target.value)}
              placeholder="O que queres ouvir?"
              style={{width:"100%",background:"#3E3E3E",border:"none",borderRadius:20,
                padding:"9px 12px 9px 32px",fontSize:13,color:"#fff",outline:"none",
                fontFamily:"inherit",boxSizing:"border-box"}}
            />
          </div>
          <button type="submit" disabled={loading}
            style={{background:"#1DB954",border:"none",borderRadius:20,padding:"0 16px",
              color:"#000",fontWeight:800,fontSize:13,cursor:"pointer",flexShrink:0,
              opacity:loading?.6:1,transition:"opacity .2s"}}>
            {loading?"…":"Ir"}
          </button>
        </form>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {SUGGESTED.map(s=>(
            <button key={s} type="button"
              onClick={()=>{setQuery(s);autoSelectRef.current=true;searchTracks(s);}}
              style={{background:"rgba(255,255,255,.08)",border:"none",borderRadius:20,padding:"5px 12px",
                fontSize:11,color:"rgba(255,255,255,.7)",cursor:"pointer",fontFamily:"inherit"}}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div style={{margin:"0 12px 8px",padding:"8px 12px",background:"rgba(220,38,38,.15)",
          border:"1px solid rgba(220,38,38,.3)",borderRadius:8,fontSize:12,color:"#fca5a5"}}>
          ⚠️ {error}
        </div>
      )}

      <div style={{flex:1,overflowY:"auto",padding:"0 8px 8px"}}>
        {loading && (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",
            justifyContent:"center",padding:"32px 0",gap:12}}>
            <div style={{display:"flex",alignItems:"flex-end",gap:2}}>
              {EQ_CLS.map(c=><div key={c} className={c} style={{width:5,borderRadius:2,
                backgroundColor:"#1DB954",minHeight:3}}/>)}
            </div>
            <span style={{fontSize:12,color:"rgba(255,255,255,.4)"}}>A carregar…</span>
          </div>
        )}
        {results.map((track,idx)=>{
          const isSel = selected?.id===track.id;
          return (
            <button key={track.id} onClick={()=>selectTrack(track)}
              className={`sp-track${isSel?" sp-track-active":""}`}
              style={{width:"100%",background:"transparent",border:"none",borderRadius:6,
                display:"flex",alignItems:"center",gap:12,padding:"8px 8px",cursor:"pointer",
                textAlign:"left",color:"#fff",fontFamily:"inherit",transition:"background .15s"}}>
              <div style={{width:20,textAlign:"center",flexShrink:0}}>
                {isSel&&isPlaying
                  ? <Equalizer active={true}/>
                  : <span style={{fontSize:13,color:isSel?"#1DB954":"rgba(255,255,255,.4)",fontWeight:isSel?700:400}}>{idx+1}</span>}
              </div>
              {track.thumbnail
                ? <img src={track.thumbnail} alt="" style={{width:40,height:40,borderRadius:4,objectFit:"cover",flexShrink:0}}/>
                : <div style={{width:40,height:40,borderRadius:4,background:"rgba(255,255,255,.06)",
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🎵</div>}
              <div style={{flex:1,minWidth:0}}>
                <p style={{margin:0,fontSize:13,fontWeight:500,color:isSel?"#1DB954":"#fff",
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{track.title}</p>
                <p style={{margin:"2px 0 0",fontSize:11,color:"rgba(255,255,255,.45)",
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{track.artist}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ════════════════════════════════════════════════════════════════════ */
export function MusicPlayer() {
  const [query,   setQuery]   = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [selected,  setSelected]  = useState<Track|null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ytVideoId, setYtVideoId] = useState<string|null>(null);
  const [rawEn, setRawEn] = useState("");
  const [rawPt, setRawPt] = useState("");
  const [lines, setLines] = useState<LyricLine[]>([]);
  const [activeLine, setActiveLine] = useState(0);
  const [lyricsLoading, setLyricsLoading] = useState(false);
  const [mobileTab, setMobileTab] = useState<"list"|"player">("player");
  const autoSelectRef = useRef(true);
  const autoAdvRef    = useRef<ReturnType<typeof setInterval>|null>(null);

  useEffect(() => {
    if (rawEn||rawPt) { setLines(parseLyrics(rawEn,rawPt)); setActiveLine(0); }
    else setLines([]);
  }, [rawEn, rawPt]);

  useEffect(() => {
    if (autoAdvRef.current) clearInterval(autoAdvRef.current);
    if (!isPlaying||!lines.length) return;
    autoAdvRef.current = setInterval(()=>setActiveLine(p=>p>=lines.length-1?p:p+1), 4000);
    return ()=>{ if (autoAdvRef.current) clearInterval(autoAdvRef.current); };
  }, [isPlaying, lines.length]);

  useEffect(() => ()=>{ if (autoAdvRef.current) clearInterval(autoAdvRef.current); }, []);

  /* Buscar vídeo YouTube */
  useEffect(() => {
    if (!selected) { setYtVideoId(null); return; }
    let cancelled = false;
    (async () => {
      try {
        const q = `${selected.title} ${selected.artist} official audio`;
        const r = await fetch(`${BACKEND}/api/youtube/search?q=${encodeURIComponent(q)}&max=1`);
        if (!r.ok||cancelled) return;
        const d = await r.json();
        const vid = d.videos?.[0]?.id;
        if (vid&&!cancelled) setYtVideoId(vid);
      } catch {}
    })();
    return ()=>{ cancelled=true; };
  }, [selected?.id]);

  const searchTracks = useCallback(async (raw: string) => {
    if (!raw.trim()) return;
    setLoading(true); setError(""); setResults([]);
    try {
      const res  = await fetch(`${BACKEND}/api/spotify/search?q=${encodeURIComponent(raw)}`);
      if (!res.ok) throw new Error("Erro ao pesquisar músicas");
      const data = await res.json();
      const tracks: Track[] = (data.tracks?.items||[]).map((t: any) => ({
        id:        t.id,
        title:     t.name,
        artist:    t.artists.map((a: any)=>a.name).join(", "),
        thumbnail: [t.album?.images?.[2]?.url,t.album?.images?.[3]?.url,t.album?.images?.[1]?.url,t.album?.images?.[0]?.url].find(u=>u&&u.trim()!="")||"",
        lastfmUrl: t.external_urls?.spotify||"",
      }));
      const top = tracks.slice(0,12);
      setResults(top);
      if (!top.length) setError("Nenhuma música encontrada.");
      else if (autoSelectRef.current&&top[0]) { selectTrack(top[0]); autoSelectRef.current=false; }
    } catch (e: unknown) { setError(e instanceof Error?e.message:"Erro na pesquisa."); }
    finally { setLoading(false); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(()=>{ searchTracks("Ed Sheeran official"); },[searchTracks]);

  async function fetchLyrics(title: string, artist: string) {
    setLyricsLoading(true); setRawEn(""); setRawPt("");
    try {
      const r = await fetch(`${BACKEND}/api/lyrics/search?artist=${encodeURIComponent(artist)}&title=${encodeURIComponent(title)}`);
      if (r.ok) { const d=await r.json(); if (d.en){setRawEn(d.en);if(d.pt)setRawPt(d.pt);setLyricsLoading(false);return;} }
    } catch {}
    try {
      const r = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);
      const d = await r.json();
      if (d.lyrics) setRawEn(d.lyrics.replace(/\r\n/g,"\n").trim());
    } catch {}
    setLyricsLoading(false);
  }

  function selectTrack(track: Track) {
    setSelected(track); setIsPlaying(false); setYtVideoId(null);
    setRawEn(""); setRawPt(""); setLines([]); setActiveLine(0);
    fetchLyrics(track.title, track.artist);
    setMobileTab("player");
  }

  /* ══════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════ */
  return (
    <>
      <style>{ANIM_STYLE}</style>

      <div style={{display:"flex",flexDirection:"column",height:"100dvh",
        background:"linear-gradient(160deg,#07060f 0%,#180a38 45%,#0d0520 100%)",color:"#fff",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
        paddingBottom:"env(safe-area-inset-bottom)"}}>

        {/* ── Header ── */}
        <div style={{flexShrink:0,height:56,paddingTop:"env(safe-area-inset-top)",
          background:"rgba(0,0,0,.85)",backdropFilter:"blur(20px)",
          borderBottom:"1px solid rgba(255,255,255,.06)",
          display:"flex",alignItems:"center",padding:"0 20px",gap:16,position:"relative"}}>
          <Link to="/lessons" style={{display:"flex",alignItems:"center",gap:6,
            color:"rgba(255,255,255,.7)",textDecoration:"none",fontSize:13,fontWeight:600,
            background:"rgba(255,255,255,.08)",borderRadius:20,padding:"6px 14px",flexShrink:0}}
            className="hover:text-white transition-colors">
            <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
            <span className="hidden sm:inline">Voltar</span>
          </Link>
          <div style={{position:"absolute",left:"50%",transform:"translateX(-50%)",
            display:"flex",alignItems:"center",gap:8}}>
            <svg width={20} height={20} viewBox="0 0 24 24" fill="#1DB954">
              <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3z"/>
            </svg>
            <h1 style={{margin:0,fontSize:15,fontWeight:900,letterSpacing:"-.2px"}}>Música · Inglês</h1>
          </div>
          {/* Mobile tab toggle */}
          <div className="lg:hidden" style={{marginLeft:"auto",display:"flex",gap:4}}>
            {(["list","player"] as const).map(tab=>(
              <button key={tab} onClick={()=>setMobileTab(tab)}
                style={{background:mobileTab===tab?"#1DB954":"rgba(255,255,255,.08)",
                  border:"none",borderRadius:20,padding:"6px 14px",fontSize:11,fontWeight:700,
                  color:mobileTab===tab?"#000":"rgba(255,255,255,.7)",cursor:"pointer",
                  fontFamily:"inherit"}}>
                {tab==="list"?"🎵 Lista":"▶ Player"}
              </button>
            ))}
          </div>
        </div>

        {/* ── Layout principal ── */}
        <div style={{flex:1,overflow:"hidden",display:"flex",maxWidth:1400,
          margin:"0 auto",width:"100%"}}>

          {/* Sidebar esquerda — lista (desktop sempre visível, mobile só no tab "list") */}
          <div className={mobileTab==="list"?"flex":"hidden lg:flex"}
            style={{width:280,minWidth:280,flexDirection:"column",
              background:"rgba(0,0,0,.35)",backdropFilter:"blur(10px)",borderRight:"1px solid rgba(168,85,247,.12)",overflow:"hidden"}}>
            <TrackList query={query} setQuery={setQuery} loading={loading} error={error}
              results={results} selected={selected} isPlaying={isPlaying}
              searchTracks={searchTracks} selectTrack={selectTrack} autoSelectRef={autoSelectRef} />
          </div>

          {/* Área principal — player + letras */}
          <div className={mobileTab==="player"?"flex":"hidden lg:flex"}
            style={{flex:1,flexDirection:"column",overflow:"hidden",
              background:"transparent"}}>

            {selected ? (
              <>
                {/* Info da música seleccionada */}
                <div style={{flexShrink:0,display:"flex",alignItems:"center",
                  gap:16,padding:"16px 20px 12px",
                  background:"linear-gradient(180deg,rgba(29,185,84,.08) 0%,transparent 100%)"}}>
                  {selected.thumbnail
                    ? <img src={selected.thumbnail} alt=""
                        style={{width:64,height:64,borderRadius:8,objectFit:"cover",
                          flexShrink:0,boxShadow:"0 8px 24px rgba(0,0,0,.5)"}}/>
                    : <div style={{width:64,height:64,borderRadius:8,background:"#282828",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize:28,flexShrink:0}}>🎵</div>}
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{margin:0,fontSize:"clamp(1rem,2.5vw,1.4rem)",fontWeight:900,
                      overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{selected.title}</p>
                    <p style={{margin:"4px 0 0",fontSize:13,color:"rgba(255,255,255,.6)",
                      overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{selected.artist}</p>
                    {selected.lastfmUrl && (
                      <a href={selected.lastfmUrl} target="_blank" rel="noopener noreferrer"
                        style={{display:"inline-flex",alignItems:"center",gap:4,marginTop:8,
                          fontSize:11,color:"#1DB954",textDecoration:"none",fontWeight:600}}>
                        <svg width={12} height={12} viewBox="0 0 24 24" fill="#1DB954"><path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3z"/></svg>
                        Last.fm
                      </a>
                    )}
                  </div>
                  <Equalizer active={isPlaying} />
                </div>

                {/* YouTube player */}
                <div style={{flexShrink:0,margin:"0 20px 12px",borderRadius:10,overflow:"hidden",
                  background:"#000",boxShadow:"0 4px 24px rgba(0,0,0,.6)"}}>
                  {ytVideoId ? (
                    <iframe key={ytVideoId}
                      src={`https://www.youtube-nocookie.com/embed/${ytVideoId}?autoplay=0&rel=0&modestbranding=1&playsinline=1`}
                      width="100%" height="180"
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen style={{border:0,display:"block"}}
                      title="player" />
                  ) : (
                    <div style={{height:52,display:"flex",alignItems:"center",
                      justifyContent:"center",gap:8,background:"#181818"}}>
                      <div style={{width:14,height:14,border:"2px solid rgba(255,255,255,.15)",
                        borderTopColor:"#1DB954",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>
                      <span style={{fontSize:12,color:"rgba(255,255,255,.35)"}}>A procurar vídeo…</span>
                    </div>
                  )}
                </div>

                {/* Botão toggle letras */}
                {lines.length>0 && (
                  <div style={{flexShrink:0,padding:"0 20px 10px"}}>
                    <button onClick={()=>setIsPlaying(p=>!p)}
                      style={{width:"100%",padding:"10px 0",borderRadius:30,fontWeight:800,
                        fontSize:13,border:"none",cursor:"pointer",fontFamily:"inherit",
                        transition:"all .2s",
                        background:isPlaying?"rgba(29,185,84,.15)":"#1DB954",
                        color:isPlaying?"#1DB954":"#000",
                        outline:isPlaying?"1px solid rgba(29,185,84,.4)":"none"}}>
                      {isPlaying?"⏸  Pausar letras":"▶  Iniciar letras (auto-avanço)"}
                    </button>
                  </div>
                )}

                {/* Letras karaoke */}
                <div style={{flex:1,minHeight:0,padding:"0 20px 16px"}}>
                  {lyricsLoading ? (
                    <div style={{height:"100%",display:"flex",alignItems:"center",
                      justifyContent:"center",gap:8}}>
                      <div style={{width:14,height:14,border:"2px solid rgba(255,255,255,.1)",
                        borderTopColor:"#1DB954",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>
                      <span style={{fontSize:13,color:"rgba(255,255,255,.3)"}}>A carregar letras…</span>
                    </div>
                  ) : lines.length>0 ? (
                    <LyricsRiser lines={lines.map(l=>({en:l.en,pt:l.pt||undefined}))}
                      active={activeLine} isPlaying={isPlaying}
                      onNext={()=>setActiveLine(p=>Math.min(lines.length-1,p+1))}
                      onPrev={()=>setActiveLine(p=>Math.max(0,p-1))} />
                  ) : (
                    <div style={{height:"100%",display:"flex",flexDirection:"column",
                      alignItems:"center",justifyContent:"center",gap:12,
                      color:"rgba(255,255,255,.2)"}}>
                      <span style={{fontSize:48}}>🎤</span>
                      <span style={{fontSize:13}}>Letras não encontradas para esta música</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",
                justifyContent:"center",gap:16,color:"rgba(255,255,255,.15)"}}>
                <svg width={64} height={64} viewBox="0 0 24 24" fill="rgba(255,255,255,.1)">
                  <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3z"/>
                </svg>
                <p style={{margin:0,fontSize:15,fontWeight:600}}>Seleciona uma música</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
