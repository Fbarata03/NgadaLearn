/* ════════════════════════════════════════════════════════════════════
   NgadaLearn — Music Player
   iTunes search · YouTube IFrame API · Karaoke + Quiz interativo
   ════════════════════════════════════════════════════════════════════ */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router";
import {
  Mic2, BookOpen, Music2, ChevronLeft, Search, List, Play,
  CheckCircle2, XCircle, SkipForward, ChevronRight, Layers,
  Star, Zap, Trophy, BookMarked, Sprout, AlignLeft,
} from "lucide-react";

declare global {
  interface Window { YT: any; onYouTubeIframeAPIReady?: () => void; }
}

/* ── CSS ─────────────────────────────────────────────────────────── */
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
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pop{0%{transform:scale(1)}50%{transform:scale(1.22)}100%{transform:scale(1)}}
@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes correctFlash{0%{background:#1DB954}60%{background:#22c55e}100%{background:transparent}}

.sp-track:hover:not(.sp-track-active){background:rgba(255,255,255,.06);}
.sp-track-active{background:rgba(29,185,84,.1)!important;border-left:2px solid #1DB954!important;}
.quiz-correct{animation:correctFlash .6s ease forwards}
.quiz-wrong{animation:shake .4s ease}
.fade-up{animation:fadeUp .3s ease forwards}
`;

/* ── Tipos ────────────────────────────────────────────────────────── */
interface Track { id:string; title:string; artist:string; thumbnail:string; albumName?:string; }
type Difficulty = "normal"|"hard"|"learned";
interface LyricLine { id:number; en:string; pt:string; difficulty:Difficulty; }
type LearnMode = "karaoke"|"quiz";

interface LevelConfig {
  id:number; name:string; cefr:string; description:string;
  emoji:string; accent:string; bg:string;
  query:string; suggested:string[]; tips:string[];
}

/* ── Constantes ───────────────────────────────────────────────────── */
const BACKEND   = import.meta.env.VITE_API_URL || "https://ngadalearn-api.onrender.com";
const EQ_CLS    = ["eq1","eq2","eq3","eq4","eq5"];

/* ── Níveis de aprendizagem ──────────────────────────────────────── */
const LEVEL_ICONS = [Sprout, BookMarked, Layers, Zap, Trophy];

const LEVELS: LevelConfig[] = [
  {
    id:1, name:"Iniciante", cefr:"A1",
    description:"Palavras do dia-a-dia, ritmo lento, melodia simples",
    emoji:"🌱", accent:"#4ade80",
    bg:"linear-gradient(135deg,rgba(5,46,22,.95),rgba(20,83,45,.95))",
    query:"Ed Sheeran Perfect official",
    suggested:["Ed Sheeran","Passenger","The Beatles"],
    tips:["Repete cada linha em voz alta","Foca nas palavras que reconheces","Usa o modo Karaoke"],
  },
  {
    id:2, name:"Elementar", cefr:"A2",
    description:"Frases curtas, temas emocionais, vocabulário comum",
    emoji:"📖", accent:"#60a5fa",
    bg:"linear-gradient(135deg,rgba(12,74,110,.95),rgba(3,105,161,.95))",
    query:"Adele Someone Like You official",
    suggested:["Adele","Taylor Swift","Dua Lipa"],
    tips:["Identifica expressões do quotidiano","Tenta cantar sem ver a letra","Usa o modo Quiz para testar"],
  },
  {
    id:3, name:"Intermédio", cefr:"B1",
    description:"Vocabulário variado, metáforas, expressões idiomáticas",
    emoji:"🎯", accent:"#a78bfa",
    bg:"linear-gradient(135deg,rgba(76,29,149,.95),rgba(109,40,217,.95))",
    query:"Coldplay Fix You official",
    suggested:["Coldplay","John Mayer","OneRepublic"],
    tips:["Analisa o significado das metáforas","Escreve as letras que ouviste","Pratica o ritmo da fala"],
  },
  {
    id:4, name:"Avançado", cefr:"B2",
    description:"Linguagem rica, coloquialismos, ritmo mais rápido",
    emoji:"⚡", accent:"#fb923c",
    bg:"linear-gradient(135deg,rgba(124,45,18,.95),rgba(194,65,12,.95))",
    query:"Linkin Park In The End official",
    suggested:["Linkin Park","Queen","Imagine Dragons"],
    tips:["Estuda o contexto cultural das expressões","Entende sem pausar o vídeo","Canta no tempo real da música"],
  },
  {
    id:5, name:"Fluente", cefr:"C1+",
    description:"Slang, pronúncia nativa, velocidade real, rap e jazz",
    emoji:"🏆", accent:"#fbbf24",
    bg:"linear-gradient(135deg,rgba(133,77,14,.95),rgba(202,138,4,.95))",
    query:"Eminem Lose Yourself official",
    suggested:["Eminem","Kendrick Lamar","Frank Sinatra"],
    tips:["Tenta entender sem legendas","Canta na velocidade original","Explica o significado em inglês"],
  },
];
const SKIP_WORDS = new Set(["the","a","an","in","on","at","to","for","of","and","or","but","is","are","was","were","i","you","he","she","it","we","they","my","your","his","her","our","their","this","that","with","from","not","have","has","had","be","been","will","would","can","could","do","does","did","get","got","just","like","im","its","so","as","up","out","no","me","him","us","them","when","what","how","if","oh","yeah","dont","cant","wont","ill"]);

/* ── Utilitários ──────────────────────────────────────────────────── */
function parseLyrics(en:string, pt:string): LyricLine[] {
  const enL=en.split("\n"), ptL=pt.split("\n");
  return Array.from({length:Math.max(enL.length,ptL.length)},(_,i)=>({
    id:i, en:(enL[i]??"").trim(), pt:(ptL[i]??"").trim(), difficulty:"normal" as Difficulty,
  })).filter(l=>l.en||l.pt);
}

function pickQuizWord(line:string):{word:string;idx:number}|null {
  const words = line.split(" ");
  const candidates = words
    .map((w,i)=>({word:w.replace(/[^a-zA-Z']/g,""),idx:i}))
    .filter(({word})=>word.length>=4 && !SKIP_WORDS.has(word.toLowerCase()));
  if (!candidates.length) return null;
  return candidates[Math.floor(Math.random()*candidates.length)];
}

/* ── Equalizador ──────────────────────────────────────────────────── */
function Equalizer({active,size=16}:{active:boolean;size?:number}) {
  if (!active) return null;
  return (
    <div className="flex items-end gap-px" style={{height:size}}>
      {EQ_CLS.map((c,i)=>(
        <div key={c} className={c} style={{width:2,borderRadius:1,minHeight:2,
          backgroundColor:["#1DB954","#22c55e","#16a34a","#1DB954","#22c55e"][i]}}/>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   QUIZ LINE — linha com palavra em falta
   ════════════════════════════════════════════════════════════════════ */
interface QuizLineProps {
  line: string; quizWord:{word:string;idx:number}|null;
  input:string; onInput:(v:string)=>void; onSubmit:()=>void;
  status:"idle"|"correct"|"wrong"; answer:string;
}
function QuizLine({line,quizWord,input,onInput,onSubmit,status,answer}:QuizLineProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(()=>{ inputRef.current?.focus(); },[quizWord]);

  if (!quizWord) {
    return (
      <p style={{textAlign:"center",fontSize:"clamp(1.1rem,2.5vw,1.5rem)",fontWeight:800,
        color:"#fff",padding:"0 24px",lineHeight:1.4}}>{line}</p>
    );
  }

  const words = line.split(" ");
  return (
    <div style={{textAlign:"center",padding:"0 16px",lineHeight:1.8}}>
      {words.map((w,i)=>{
        if (i!==quizWord.idx) return (
          <span key={i} style={{fontSize:"clamp(1rem,2.2vw,1.35rem)",fontWeight:700,
            color:"rgba(255,255,255,.85)",marginRight:".3em"}}>{w}</span>
        );
        if (status==="correct") return (
          <span key={i} className="quiz-correct"
            style={{fontSize:"clamp(1rem,2.2vw,1.35rem)",fontWeight:900,color:"#1DB954",
              marginRight:".3em",display:"inline-block",padding:"0 4px",borderRadius:6,
              background:"rgba(29,185,84,.15)"}}>
            {quizWord.word}
          </span>
        );
        if (status==="wrong") return (
          <span key={i} className="quiz-wrong"
            style={{display:"inline-block",marginRight:".3em",textAlign:"center"}}>
            <input disabled value={input}
              style={{width:`${Math.max(quizWord.word.length*14,60)}px`,textAlign:"center",
                background:"rgba(239,68,68,.2)",border:"2px solid #ef4444",borderRadius:8,
                color:"#fca5a5",fontSize:"1rem",fontWeight:700,outline:"none",padding:"2px 6px"}}/>
          </span>
        );
        return (
          <span key={i} style={{display:"inline-block",marginRight:".3em",verticalAlign:"middle"}}>
            <input ref={inputRef} value={input} onChange={e=>onInput(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter")onSubmit();}}
              placeholder={"_".repeat(Math.min(quizWord.word.length,8))}
              style={{width:`${Math.max(quizWord.word.length*14,70)}px`,textAlign:"center",
                background:"rgba(29,185,84,.08)",border:"2px solid rgba(29,185,84,.5)",
                borderRadius:50,color:"#fff",fontSize:"1rem",fontWeight:700,outline:"none",
                padding:"4px 12px",fontFamily:"inherit",transition:"border-color .2s"}}
              onFocus={e=>e.target.style.borderColor="#1DB954"}
              onBlur={e=>e.target.style.borderColor="rgba(29,185,84,.5)"}
            />
          </span>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   LYRICS RISER — karaoke
   ════════════════════════════════════════════════════════════════════ */
const LINE_H = 56;
function LyricsRiser({lines,active,isPlaying,onNext,onPrev}:{
  lines:{en:string;pt?:string}[]; active:number; isPlaying:boolean;
  onNext?:()=>void; onPrev?:()=>void;
}) {
  const [transl, setTransl] = useState<string|null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [wrapH, setWrapH] = useState(320);

  useEffect(()=>{
    const el=wrapRef.current; if (!el) return;
    const ro=new ResizeObserver(es=>setWrapH(es[0].contentRect.height));
    ro.observe(el); return ()=>ro.disconnect();
  },[]);

  if (!lines.length) return null;
  const PROG=2,BADGE=30,NAV=(onNext||onPrev)?44:0,HINT=(lines.some(l=>l.pt)&&!transl)?16:0,TRANSL=transl?50:0;
  const clipH=Math.max(LINE_H*3,wrapH-PROG-BADGE-NAV-HINT-TRANSL);
  const padV=Math.max(0,(clipH-LINE_H)/2);

  return (
    <div ref={wrapRef} style={{height:"100%",display:"flex",flexDirection:"column",
      background:"rgba(0,0,0,.3)",borderRadius:20,overflow:"hidden",
      border:"1px solid rgba(255,255,255,.07)",backdropFilter:"blur(12px)",
      boxShadow:"0 8px 32px rgba(0,0,0,.4)"}}>
      <div style={{height:PROG,background:"rgba(29,185,84,.15)",flexShrink:0}}>
        <div style={{height:"100%",background:"#1DB954",transition:"width .3s ease",
          width:`${Math.round(((active+1)/lines.length)*100)}%`}}/>
      </div>
      <div style={{height:BADGE,display:"flex",alignItems:"center",padding:"0 14px",flexShrink:0}}>
        <span style={{fontSize:9,letterSpacing:".12em",color:"#1DB954",fontWeight:700}}>
          {isPlaying?"▶ AUTO":"✦ KARAOKE"}
        </span>
        <div style={{flex:1}}/>
        <span style={{fontSize:10,fontFamily:"monospace",color:"rgba(255,255,255,.2)"}}>
          {active+1}/{lines.length}
        </span>
      </div>
      <div style={{height:clipH,overflow:"hidden",position:"relative",flexShrink:0}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:clipH*.3,zIndex:10,pointerEvents:"none",
          background:"linear-gradient(to bottom,rgba(0,0,0,.6),transparent)"}}/>
        <div style={{position:"absolute",left:0,top:"50%",transform:"translateY(-50%)",
          width:3,height:LINE_H,background:"#1DB954",borderRadius:2,zIndex:15,pointerEvents:"none"}}/>
        <div style={{transform:`translateY(${-active*LINE_H}px)`,transition:"transform .5s cubic-bezier(.4,0,.2,1)",
          paddingTop:padV,paddingBottom:padV}}>
          {lines.map((line,i)=>{
            const dist=Math.abs(i-active),isAct=i===active;
            const opacity=dist===0?1:dist===1?.38:dist===2?.18:.07;
            return (
              <div key={i} onClick={()=>line.pt?setTransl(transl===line.pt?null:(line.pt??null)):undefined}
                style={{height:LINE_H,display:"flex",alignItems:"center",justifyContent:"center",
                  padding:"0 32px",opacity,transform:`scale(${dist===0?1:dist===1?.92:.84})`,
                  transition:"all .4s",cursor:line.pt?"pointer":"default"}}>
                <p style={{textAlign:"center",margin:0,lineHeight:1.3,
                  fontSize:isAct?"clamp(1.2rem,2.8vw,1.6rem)":"clamp(.8rem,1.8vw,1rem)",
                  fontWeight:isAct?900:400,
                  ...(isAct?{
                    background:"linear-gradient(90deg,#fff 0%,#d1fae5 40%,#fff 70%,#d1fae5 100%)",
                    backgroundSize:"300% 100%",
                    animation:isPlaying?"shimmer 4s linear infinite":"none",
                    WebkitBackgroundClip:"text",backgroundClip:"text",color:"transparent",
                  }:{color:"rgba(255,255,255,.35)"}),
                }}>{line.en||"♪"}</p>
              </div>
            );
          })}
        </div>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:clipH*.28,zIndex:10,pointerEvents:"none",
          background:"linear-gradient(to top,rgba(0,0,0,.6),transparent)"}}/>
      </div>
      {transl && (
        <div style={{flexShrink:0,height:TRANSL,background:"rgba(29,185,84,.9)",
          padding:"0 14px",display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:13,flexShrink:0}}>🇵🇹</span>
          <p style={{flex:1,margin:0,fontSize:"clamp(.82rem,1.6vw,.92rem)",fontWeight:600,
            color:"#000",fontStyle:"italic",lineHeight:1.3}}>{transl}</p>
          <button onClick={()=>setTransl(null)}
            style={{background:"rgba(0,0,0,.2)",border:"none",borderRadius:"50%",width:22,height:22,
              color:"#000",cursor:"pointer",fontSize:12,fontWeight:700,flexShrink:0}}>✕</button>
        </div>
      )}
      {HINT>0&&(
        <p style={{flexShrink:0,height:HINT,display:"flex",alignItems:"center",
          justifyContent:"center",fontSize:10,color:"rgba(255,255,255,.2)",margin:0}}>
          Clica numa linha para ver a tradução 🇵🇹
        </p>
      )}
      {(onPrev||onNext)&&(
        <div style={{flexShrink:0,height:NAV,display:"flex",alignItems:"center",
          justifyContent:"space-between",padding:"0 14px",borderTop:"1px solid rgba(255,255,255,.05)"}}>
          <button onClick={onPrev} disabled={active===0}
            style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",
              borderRadius:50,padding:"6px 18px",fontSize:12,fontWeight:700,color:"#fff",
              opacity:active===0?.3:1,cursor:active===0?"not-allowed":"pointer",
              boxShadow:active===0?"none":"0 2px 8px rgba(0,0,0,.3)"}}>← Ant.</button>
          <button onClick={onNext} disabled={active>=lines.length-1}
            style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",
              borderRadius:50,padding:"6px 18px",fontSize:12,fontWeight:700,color:"#fff",
              opacity:active>=lines.length-1?.3:1,cursor:active>=lines.length-1?"not-allowed":"pointer",
              boxShadow:active>=lines.length-1?"none":"0 2px 8px rgba(0,0,0,.3)"}}>Próx. →</button>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   LEVEL SELECT — ecrã de seleção de nível
   ════════════════════════════════════════════════════════════════════ */
function LevelSelect({onSelect}:{onSelect:(l:LevelConfig)=>void}) {
  const [hov, setHov] = useState<number|null>(null);
  return (
    <div style={{flex:1,overflow:"auto",padding:"0 16px 24px",
      display:"flex",flexDirection:"column",gap:0}}>

      {/* Título */}
      <div style={{textAlign:"center",padding:"28px 0 20px"}}>
        <div style={{fontSize:40,marginBottom:8}}>🎵</div>
        <h2 style={{margin:0,fontSize:"clamp(1.2rem,3vw,1.7rem)",fontWeight:900,
          letterSpacing:"-.5px"}}>
          Aprende Inglês com Música
        </h2>
        <p style={{margin:"8px 0 0",fontSize:13,color:"rgba(255,255,255,.45)"}}>
          Escolhe o teu nível para começar
        </p>
      </div>

      {/* Cards de nível */}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {LEVELS.map((lv,i)=>{
          const LvIcon = LEVEL_ICONS[i];
          return (
          <button key={lv.id} onClick={()=>onSelect(lv)}
            onMouseEnter={()=>setHov(lv.id)} onMouseLeave={()=>setHov(null)}
            style={{
              background:hov===lv.id?lv.bg.replace(".95","1"):lv.bg,
              border:`1.5px solid ${lv.accent}35`,
              borderRadius:20,padding:"14px 18px",cursor:"pointer",
              textAlign:"left",color:"#fff",fontFamily:"inherit",
              display:"flex",alignItems:"center",gap:14,
              boxShadow:hov===lv.id
                ?`0 10px 36px ${lv.accent}35, 0 0 0 1px ${lv.accent}50`
                :"0 4px 16px rgba(0,0,0,.3)",
              transform:hov===lv.id?"translateY(-2px) scale(1.01)":"none",
              transition:"all .22s cubic-bezier(.34,1.56,.64,1)",
            }}>
            {/* Ícone SVG + CEFR */}
            <div style={{flexShrink:0,display:"flex",flexDirection:"column",
              alignItems:"center",gap:4,width:44}}>
              <div style={{width:40,height:40,borderRadius:12,
                background:`${lv.accent}20`,border:`1.5px solid ${lv.accent}40`,
                display:"flex",alignItems:"center",justifyContent:"center",
                boxShadow:`0 2px 12px ${lv.accent}25`}}>
                <LvIcon size={20} color={lv.accent} strokeWidth={2}/>
              </div>
              <span style={{fontSize:9,fontWeight:900,letterSpacing:".08em",
                color:lv.accent,background:`${lv.accent}18`,
                borderRadius:50,padding:"1px 7px"}}>{lv.cefr}</span>
            </div>

            {/* Info */}
            <div style={{flex:1,minWidth:0}}>
              <p style={{margin:0,fontSize:15,fontWeight:900,letterSpacing:"-.2px"}}>
                {lv.name}
              </p>
              <p style={{margin:"3px 0 0",fontSize:11,color:"rgba(255,255,255,.5)",
                lineHeight:1.4}}>{lv.description}</p>
              <div style={{display:"flex",gap:5,marginTop:6,flexWrap:"wrap"}}>
                {lv.tips.slice(0,2).map((t,ti)=>(
                  <span key={ti} style={{fontSize:9,fontWeight:600,
                    color:lv.accent,background:`${lv.accent}15`,
                    borderRadius:50,padding:"2px 8px",border:`1px solid ${lv.accent}25`}}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Seta Lucide */}
            <ChevronRight size={18} color={lv.accent} strokeWidth={2.5}
              style={{flexShrink:0,opacity:hov===lv.id?1:.5,transition:"opacity .2s"}}/>
          </button>
          );
        })}
      </div>

      <p style={{textAlign:"center",fontSize:11,color:"rgba(255,255,255,.2)",
        marginTop:16,lineHeight:1.5}}>
        Podes mudar de nível a qualquer momento
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   TRACK LIST — fora do MusicPlayer (evita re-mount ao digitar)
   ════════════════════════════════════════════════════════════════════ */
interface TrackListProps {
  query:string; setQuery:(q:string)=>void; loading:boolean; error:string;
  results:Track[]; selected:Track|null; isPlaying:boolean;
  searchTracks:(q:string)=>void; selectTrack:(t:Track)=>void;
  autoSelectRef:React.MutableRefObject<boolean>;
  suggested?:string[];
}
function TrackList({query,setQuery,loading,error,results,selected,isPlaying,searchTracks,selectTrack,autoSelectRef,suggested=["Ed Sheeran","Adele","Taylor Swift","Coldplay"]}:TrackListProps) {
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {/* Pesquisa */}
      <div style={{padding:"12px 10px 8px",flexShrink:0}}>
        <form onSubmit={e=>{e.preventDefault();searchTracks(query);}} style={{display:"flex",gap:8,marginBottom:8}}>
          <div style={{flex:1,position:"relative"}}>
            <Search size={14} strokeWidth={2.5} color="rgba(255,255,255,.45)"
              style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Pesquisar músicas…"
              style={{width:"100%",background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.1)",
                borderRadius:50,padding:"9px 12px 9px 34px",fontSize:13,color:"#fff",outline:"none",
                fontFamily:"inherit",boxSizing:"border-box",transition:"border-color .2s"}}
              onFocus={e=>e.target.style.borderColor="#1DB954"}
              onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.1)"}
            />
          </div>
          <button type="submit" disabled={loading}
            style={{background:"linear-gradient(135deg,#1DB954,#16a34a)",border:"none",borderRadius:20,
              padding:"0 16px",color:"#000",fontWeight:800,fontSize:13,cursor:"pointer",flexShrink:0,
              opacity:loading?.6:1,boxShadow:"0 2px 12px rgba(29,185,84,.35)",
              transition:"all .2s"}}>
            {loading?"…":"Ir"}
          </button>
        </form>
        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
          {suggested.map(s=>(
            <button key={s} onClick={()=>{setQuery(s);autoSelectRef.current=true;searchTracks(s);}}
              style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.08)",
                borderRadius:20,padding:"4px 11px",fontSize:11,color:"rgba(255,255,255,.65)",
                cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.12)";e.currentTarget.style.color="#fff";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.06)";e.currentTarget.style.color="rgba(255,255,255,.65)";}}>
              {s}
            </button>
          ))}
        </div>
      </div>
      {error&&(
        <div style={{margin:"0 10px 8px",padding:"8px 12px",background:"rgba(220,38,38,.12)",
          border:"1px solid rgba(220,38,38,.25)",borderRadius:8,fontSize:12,color:"#fca5a5"}}>
          ⚠️ {error}
        </div>
      )}
      <div style={{flex:1,overflowY:"auto",padding:"0 6px 8px"}}>
        {loading&&(
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",
            justifyContent:"center",padding:"32px 0",gap:10}}>
            <div style={{display:"flex",alignItems:"flex-end",gap:2}}>
              {EQ_CLS.map(c=><div key={c} className={c} style={{width:5,borderRadius:2,backgroundColor:"#1DB954",minHeight:3}}/>)}
            </div>
            <span style={{fontSize:12,color:"rgba(255,255,255,.35)"}}>A carregar…</span>
          </div>
        )}
        {results.map((track,idx)=>{
          const isSel=selected?.id===track.id;
          return (
            <button key={track.id} onClick={()=>selectTrack(track)}
              className={`sp-track${isSel?" sp-track-active":""}`}
              style={{width:"100%",background:"transparent",border:"none",borderLeft:"2px solid transparent",
                borderRadius:6,display:"flex",alignItems:"center",gap:10,padding:"7px 6px",
                cursor:"pointer",textAlign:"left",color:"#fff",fontFamily:"inherit",transition:"all .15s"}}>
              <div style={{width:18,textAlign:"center",flexShrink:0}}>
                {isSel&&isPlaying
                  ? <Equalizer active size={14}/>
                  : <span style={{fontSize:12,color:isSel?"#1DB954":"rgba(255,255,255,.35)",fontWeight:isSel?700:400}}>{idx+1}</span>}
              </div>
              {track.thumbnail
                ? <img src={track.thumbnail} alt="" style={{width:38,height:38,borderRadius:4,objectFit:"cover",flexShrink:0,boxShadow:"0 2px 8px rgba(0,0,0,.4)"}}/>
                : <div style={{width:38,height:38,borderRadius:4,background:"rgba(255,255,255,.06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>🎵</div>}
              <div style={{flex:1,minWidth:0}}>
                <p style={{margin:0,fontSize:12,fontWeight:600,color:isSel?"#1DB954":"#fff",
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{track.title}</p>
                <p style={{margin:"1px 0 0",fontSize:10,color:"rgba(255,255,255,.4)",
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  {track.artist}{track.albumName?" · "+track.albumName:""}
                </p>
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

  /* Modo de aprendizagem */
  const [learnMode, setLearnMode] = useState<LearnMode>("karaoke");
  const [quizWord,  setQuizWord]  = useState<{word:string;idx:number}|null>(null);
  const [quizInput, setQuizInput] = useState("");
  const [quizStatus, setQuizStatus] = useState<"idle"|"correct"|"wrong">("idle");
  const [score,  setScore]  = useState(0);
  const [misses, setMisses] = useState(0);

  const [selectedLevel, setSelectedLevel] = useState<LevelConfig|null>(null);
  const [mobileTab, setMobileTab] = useState<"list"|"player">("player");
  const [isMobile,  setIsMobile]  = useState(()=>window.innerWidth<1024);
  useEffect(()=>{
    const h=()=>setIsMobile(window.innerWidth<1024);
    window.addEventListener("resize",h); return ()=>window.removeEventListener("resize",h);
  },[]);
  const autoSelectRef  = useRef(true);
  const autoAdvRef     = useRef<ReturnType<typeof setInterval>|null>(null);
  const ytPlayerRef    = useRef<any>(null);
  const quizTimer      = useRef<ReturnType<typeof setTimeout>|null>(null);
  const syncTimerRef   = useRef<ReturnType<typeof setInterval>|null>(null);
  const linesRef       = useRef<LyricLine[]>([]);
  const activeLineRef  = useRef(0);

  /* Parse letras */
  useEffect(()=>{
    if (rawEn||rawPt){setLines(parseLyrics(rawEn,rawPt));setActiveLine(0);}
    else setLines([]);
  },[rawEn,rawPt]);

  /* Manter refs sempre atualizados (acessíveis nos callbacks do YT) */
  useEffect(()=>{ linesRef.current=lines; },[lines]);
  useEffect(()=>{ activeLineRef.current=activeLine; },[activeLine]);

  /* Sincronização com YouTube via getCurrentTime() */
  useEffect(()=>{
    if (syncTimerRef.current) clearInterval(syncTimerRef.current);
    if (!isPlaying||!lines.length||learnMode==="quiz") return;

    syncTimerRef.current=setInterval(()=>{
      try{
        const player=ytPlayerRef.current;
        if (!player?.getDuration||!player?.getCurrentTime) return;
        const duration=player.getDuration();
        const current=player.getCurrentTime();
        if (!duration||duration<=0) return;

        /* Calcular linha activa com base no tempo proporcional */
        const totalLines=linesRef.current.length;
        const estimated=Math.floor((current/duration)*totalLines);
        const clamped=Math.max(0,Math.min(estimated,totalLines-1));

        if (clamped!==activeLineRef.current){
          setActiveLine(clamped);
        }
      }catch{ /* player ainda não pronto */ }
    },500);

    return ()=>{if(syncTimerRef.current)clearInterval(syncTimerRef.current);};
  },[isPlaying,lines.length,learnMode]);

  /* Auto-avanço fallback (quando sem YouTube activo) */
  useEffect(()=>{
    if (autoAdvRef.current) clearInterval(autoAdvRef.current);
  },[isPlaying,lines.length,learnMode]);

  /* Palavra do Quiz quando muda a linha */
  useEffect(()=>{
    if (learnMode!=="quiz"||!lines.length) return;
    const line = lines[activeLine];
    if (!line) return;
    setQuizWord(pickQuizWord(line.en));
    setQuizInput(""); setQuizStatus("idle");
  },[activeLine,learnMode,lines]);

  /* Iniciar quiz ao entrar no modo */
  useEffect(()=>{
    if (learnMode==="quiz"&&lines.length){
      const line=lines[activeLine];
      setQuizWord(line?pickQuizWord(line.en):null);
      setQuizInput(""); setQuizStatus("idle");
      if (autoAdvRef.current) clearInterval(autoAdvRef.current);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[learnMode]);

  useEffect(()=>()=>{
    if(autoAdvRef.current)clearInterval(autoAdvRef.current);
    if(syncTimerRef.current)clearInterval(syncTimerRef.current);
    if(quizTimer.current)clearTimeout(quizTimer.current);
  },[]);

  /* YouTube IFrame API */
  useEffect(()=>{
    if (document.getElementById("yt-api-script")) return;
    const tag=document.createElement("script");
    tag.id="yt-api-script"; tag.src="https://www.youtube.com/iframe_api"; tag.async=true;
    document.head.appendChild(tag);
  },[]);

  useEffect(()=>{
    if (!ytVideoId) return;
    function buildPlayer(){
      if (ytPlayerRef.current){try{ytPlayerRef.current.destroy();}catch{}ytPlayerRef.current=null;}
      const c=document.getElementById("yt-player-root");
      if (!c) return;
      c.innerHTML="";
      const div=document.createElement("div"); div.id="yt-player-div"; c.appendChild(div);
      ytPlayerRef.current=new window.YT.Player("yt-player-div",{
        videoId:ytVideoId,width:"100%",height:"100%",
        playerVars:{rel:0,modestbranding:1,playsinline:1,autoplay:0},
        events:{onStateChange:(e:any)=>setIsPlaying(e.data===1)},
      });
    }
    if (window.YT?.Player) buildPlayer();
    else{const p=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{p?.();buildPlayer();};}
    return()=>{if(ytPlayerRef.current){try{ytPlayerRef.current.destroy();}catch{}ytPlayerRef.current=null;}setIsPlaying(false);};
  },[ytVideoId]);

  /* Buscar YouTube quando muda música */
  useEffect(()=>{
    if (!selected){setYtVideoId(null);return;}
    let cancelled=false;
    (async()=>{
      try{
        const q=`${selected.title} ${selected.artist} official audio`;
        const r=await fetch(`${BACKEND}/api/youtube/search?q=${encodeURIComponent(q)}&max=1`);
        if (!r.ok||cancelled) return;
        const d=await r.json();
        const vid=d.videos?.[0]?.id;
        if (vid&&!cancelled) setYtVideoId(vid);
      }catch{}
    })();
    return()=>{cancelled=true;};
  },[selected?.id]);

  /* Verifica se uma música tem letras disponíveis (timeout 3s) */
  async function checkHasLyrics(title:string,artist:string):Promise<boolean>{
    try{
      const ctrl=new AbortController();
      const t=setTimeout(()=>ctrl.abort(),3000);
      const r=await fetch(
        `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`,
        {signal:ctrl.signal}
      );
      clearTimeout(t);
      const d=await r.json();
      return !!(d.lyrics&&d.lyrics.length>50);
    }catch{return false;}
  }

  const searchTracks=useCallback(async(raw:string)=>{
    if (!raw.trim()) return;
    setLoading(true); setError(""); setResults([]);
    try{
      const res=await fetch(`${BACKEND}/api/spotify/search?q=${encodeURIComponent(raw)}`);
      if (!res.ok) throw new Error("Erro ao pesquisar músicas");
      const data=await res.json();
      const all:Track[]=(data.tracks?.items||[]).map((t:any)=>({
        id:String(t.id),
        title:t.name,
        artist:t.artists.map((a:any)=>a.name).join(", "),
        thumbnail:[t.album?.images?.[0]?.url,t.album?.images?.[1]?.url].find((u:string)=>u&&u.trim()!="")||"",
        albumName:t.album?.name||"",
      })).slice(0,15);

      /* Filtrar só músicas com letras disponíveis */
      const checks=await Promise.all(all.map(t=>checkHasLyrics(t.title,t.artist)));
      const top=all.filter((_,i)=>checks[i]).slice(0,10);

      setResults(top);
      if (!top.length) setError("Nenhuma música encontrada com letras disponíveis.");
      else if (autoSelectRef.current&&top[0]){selectTrack(top[0]);autoSelectRef.current=false;}
    }catch(e:unknown){setError(e instanceof Error?e.message:"Erro na pesquisa.");}
    finally{setLoading(false);}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(()=>{
    if (selectedLevel) searchTracks(selectedLevel.query);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[selectedLevel]);

  async function fetchLyrics(title:string,artist:string){
    setLyricsLoading(true); setRawEn(""); setRawPt("");
    try{
      const r=await fetch(`${BACKEND}/api/lyrics/search?artist=${encodeURIComponent(artist)}&title=${encodeURIComponent(title)}`);
      if (r.ok){const d=await r.json();if(d.en){setRawEn(d.en);if(d.pt)setRawPt(d.pt);setLyricsLoading(false);return;}}
    }catch{}
    try{
      const r=await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);
      const d=await r.json();
      if (d.lyrics) setRawEn(d.lyrics.replace(/\r\n/g,"\n").trim());
    }catch{}
    setLyricsLoading(false);
  }

  function selectTrack(track:Track){
    setSelected(track); setIsPlaying(false); setYtVideoId(null);
    setRawEn(""); setRawPt(""); setLines([]); setActiveLine(0);
    setScore(0); setMisses(0); setQuizInput(""); setQuizStatus("idle"); setQuizWord(null);
    fetchLyrics(track.title,track.artist);
    setMobileTab("player");
  }

  /* ── Lógica do Quiz ────────────────────────────────────────────── */
  function submitQuiz(){
    if (!quizWord||quizStatus!=="idle") return;
    const correct = quizInput.trim().toLowerCase()===quizWord.word.toLowerCase();
    setQuizStatus(correct?"correct":"wrong");
    if (correct) setScore(s=>s+1); else setMisses(m=>m+1);
    if (quizTimer.current) clearTimeout(quizTimer.current);
    quizTimer.current=setTimeout(()=>{
      setActiveLine(p=>p<lines.length-1?p+1:p);
      setQuizInput(""); setQuizStatus("idle");
    }, correct?800:1400);
  }

  /* ═══════════════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════════════ */
  return (
    <>
      <style>{ANIM_STYLE}</style>
      <div style={{display:"flex",flexDirection:"column",height:"100dvh",
        background:"linear-gradient(160deg,#07060f 0%,#180a38 45%,#0d0520 100%)",
        color:"#fff",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
        paddingBottom:"env(safe-area-inset-bottom)"}}>

        {/* ── Header ── */}
        <div style={{flexShrink:0,paddingTop:"env(safe-area-inset-top)",
          background:"rgba(0,0,0,.85)",backdropFilter:"blur(24px)",
          borderBottom:"1px solid rgba(255,255,255,.06)"}}>
          <div style={{height:52,display:"flex",alignItems:"center",padding:"0 10px",gap:8}}>

            {/* ← Voltar */}
            <Link to="/lessons" style={{
              display:"flex",alignItems:"center",justifyContent:"center",
              width:38,height:38,borderRadius:"50%",flexShrink:0,
              color:"rgba(255,255,255,.8)",textDecoration:"none",
              background:"rgba(255,255,255,.09)",border:"1px solid rgba(255,255,255,.12)",
              boxShadow:"0 2px 10px rgba(0,0,0,.4)"}}>
              <ChevronLeft size={18} strokeWidth={2.5}/>
            </Link>

            {/* Título */}
            <div style={{flex:1,display:"flex",alignItems:"center",gap:6,
              justifyContent:isMobile?"flex-start":"center"}}>
              <div style={{width:28,height:28,borderRadius:8,
                background:"linear-gradient(135deg,#1DB954,#16a34a)",
                display:"flex",alignItems:"center",justifyContent:"center",
                boxShadow:"0 2px 10px rgba(29,185,84,.4)",flexShrink:0}}>
                <Music2 size={14} color="#000" strokeWidth={2.5}/>
              </div>
              <span style={{fontSize:isMobile?13:14,fontWeight:900,letterSpacing:"-.3px",
                whiteSpace:"nowrap"}}>Música · Inglês</span>
              {selectedLevel&&(
                <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:50,
                  background:`${selectedLevel.accent}20`,color:selectedLevel.accent,
                  border:`1px solid ${selectedLevel.accent}40`,whiteSpace:"nowrap"}}>
                  {selectedLevel.cefr}
                </span>
              )}
            </div>

            {/* Tabs mobile */}
            {isMobile && selectedLevel && (
              <div style={{flexShrink:0,display:"flex",gap:2,
                background:"rgba(255,255,255,.06)",borderRadius:50,padding:3,
                border:"1px solid rgba(255,255,255,.1)",
                boxShadow:"0 2px 10px rgba(0,0,0,.3)"}}>
                {([
                  {tab:"list" as const, Icon:AlignLeft},
                  {tab:"player" as const, Icon:Play},
                ]).map(({tab,Icon})=>(
                  <button key={tab} onClick={()=>setMobileTab(tab)}
                    style={{
                      background:mobileTab===tab?"linear-gradient(135deg,#1DB954,#16a34a)":"transparent",
                      border:"none",borderRadius:50,width:34,height:34,
                      color:mobileTab===tab?"#000":"rgba(255,255,255,.5)",
                      cursor:"pointer",transition:"all .2s",
                      boxShadow:mobileTab===tab?"0 2px 8px rgba(29,185,84,.4)":"none",
                      display:"flex",alignItems:"center",justifyContent:"center",
                    }}>
                    <Icon size={14} strokeWidth={2.5}/>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Layout ── */}
        <div style={{flex:1,overflow:"hidden",display:"flex",maxWidth:1400,margin:"0 auto",width:"100%"}}>

          {/* Sidebar — Level Select OU Track List */}
          <div className={mobileTab==="list"?"flex":"hidden lg:flex"}
            style={{width:selectedLevel?272:"min(100%,420px)",minWidth:selectedLevel?272:280,
              flexDirection:"column",
              background:"rgba(0,0,0,.4)",backdropFilter:"blur(12px)",
              borderRight:"1px solid rgba(255,255,255,.05)",overflow:"hidden",
              boxShadow:"2px 0 20px rgba(0,0,0,.3)",
              ...((!selectedLevel&&!isMobile)?{margin:"0 auto"}:{})}}>

            {selectedLevel ? (
              /* ── Track List com cabeçalho de nível ── */
              <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
                {/* Cabeçalho do nível */}
                <div style={{flexShrink:0,padding:"10px 12px 6px",
                  background:selectedLevel.bg,
                  borderBottom:"1px solid rgba(255,255,255,.06)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:22}}>{selectedLevel.emoji}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <p style={{margin:0,fontSize:13,fontWeight:900}}>
                        {selectedLevel.name}
                        <span style={{marginLeft:6,fontSize:10,fontWeight:700,
                          color:selectedLevel.accent,background:`${selectedLevel.accent}20`,
                          borderRadius:50,padding:"1px 7px"}}>{selectedLevel.cefr}</span>
                      </p>
                      <p style={{margin:"1px 0 0",fontSize:10,color:"rgba(255,255,255,.5)",
                        overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                        {selectedLevel.description}
                      </p>
                    </div>
                    <button onClick={()=>{setSelectedLevel(null);setResults([]);setSelected(null);}}
                      style={{background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.15)",
                        borderRadius:50,padding:"4px 10px",fontSize:10,fontWeight:700,
                        color:"rgba(255,255,255,.7)",cursor:"pointer",fontFamily:"inherit",
                        flexShrink:0,whiteSpace:"nowrap"}}>
                      ← Níveis
                    </button>
                  </div>
                </div>
                <TrackList query={query} setQuery={setQuery} loading={loading} error={error}
                  results={results} selected={selected} isPlaying={isPlaying}
                  searchTracks={searchTracks} selectTrack={selectTrack} autoSelectRef={autoSelectRef}
                  suggested={selectedLevel.suggested}/>
              </div>
            ) : (
              /* ── Level Select ── */
              <LevelSelect onSelect={lv=>{
                setSelectedLevel(lv);
                autoSelectRef.current=true;
                setMobileTab("list");
              }}/>
            )}
          </div>

          {/* Área principal — só mostra se tiver nível selecionado */}
          <div className={selectedLevel&&mobileTab==="player"?"flex":selectedLevel?"hidden lg:flex":"hidden lg:flex"}
            style={{flex:1,flexDirection:"column",overflow:"hidden",minWidth:0}}>

            {selected ? (
              <>
                {/* ── Now Playing — compacto em mobile, grande em desktop ── */}
                <div style={{flexShrink:0,display:"flex",alignItems:"center",gap:10,
                  padding:isMobile?"8px 12px":"12px 16px 10px",
                  background:"linear-gradient(180deg,rgba(0,0,0,.45) 0%,transparent 100%)"}}>
                  {/* Capa */}
                  <div style={{position:"relative",flexShrink:0}}>
                    {selected.thumbnail
                      ? <img src={selected.thumbnail} alt=""
                          style={{width:isMobile?48:72,height:isMobile?48:72,
                            borderRadius:6,objectFit:"cover",display:"block",
                            boxShadow:"0 4px 20px rgba(0,0,0,.7)"}}/>
                      : <div style={{width:isMobile?48:72,height:isMobile?48:72,borderRadius:6,
                          background:"#1a1a2e",display:"flex",alignItems:"center",
                          justifyContent:"center",fontSize:isMobile?22:28}}>🎵</div>}
                    {isPlaying&&(
                      <div style={{position:"absolute",inset:0,borderRadius:6,
                        background:"rgba(0,0,0,.4)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <Equalizer active size={14}/>
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{margin:0,fontSize:isMobile?13:15,fontWeight:900,
                      overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{selected.title}</p>
                    <p style={{margin:"2px 0 0",fontSize:isMobile?11:12,color:"#1DB954",fontWeight:600,
                      overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{selected.artist}</p>
                    {!isMobile&&selected.albumName&&(
                      <p style={{margin:"1px 0 0",fontSize:10,color:"rgba(255,255,255,.3)",
                        overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{selected.albumName}</p>
                    )}
                  </div>
                  {/* Modo de aprendizagem */}
                  <div style={{flexShrink:0,display:"flex",gap:3,
                    background:"rgba(0,0,0,.35)",borderRadius:50,padding:4,
                    border:"1px solid rgba(255,255,255,.08)",
                    boxShadow:"inset 0 1px 3px rgba(0,0,0,.4)"}}>
                    {([
                      {m:"karaoke" as LearnMode, Icon:Mic2,   label:"Karaoke", grad:"linear-gradient(135deg,#1DB954,#16a34a)", glow:"rgba(29,185,84,.4)"},
                      {m:"quiz"    as LearnMode, Icon:BookOpen, label:"Quiz",   grad:"linear-gradient(135deg,#7c3aed,#6d28d9)", glow:"rgba(124,58,237,.4)"},
                    ]).map(({m,Icon,label,grad,glow})=>{
                      const act=learnMode===m;
                      return (
                        <button key={m} onClick={()=>setLearnMode(m)}
                          style={{background:act?grad:"transparent",
                            border:"none",borderRadius:50,
                            padding:isMobile?"6px 10px":"6px 14px",
                            display:"flex",alignItems:"center",gap:5,
                            fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit",
                            color:act?"#fff":"rgba(255,255,255,.4)",
                            boxShadow:act?`0 3px 12px ${glow}`:"none",
                            transition:"all .22s"}}>
                          <Icon size={13} strokeWidth={2.5}/>
                          {!isMobile&&<span>{label}</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ── YouTube player ── */}
                <div style={{flexShrink:0,margin:isMobile?"0 10px 8px":"0 16px 10px",
                  borderRadius:18,overflow:"hidden",background:"#000",
                  boxShadow:"0 8px 32px rgba(0,0,0,.8)",
                  height:isMobile?140:undefined,
                  aspectRatio:isMobile?undefined:"16/9",
                  maxHeight:isMobile?140:"min(28vh,200px)"}}>
                  {ytVideoId
                    ? <div id="yt-player-root" style={{width:"100%",height:"100%"}}/>
                    : <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",
                        justifyContent:"center",gap:8,background:"#0a0a0a"}}>
                        <div style={{width:12,height:12,border:"2px solid rgba(255,255,255,.1)",
                          borderTopColor:"#1DB954",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>
                        <span style={{fontSize:11,color:"rgba(255,255,255,.2)"}}>A procurar…</span>
                      </div>}
                </div>

                {/* Quiz score — só mostra em desktop (mobile fica no quiz area) */}
                {!isMobile&&learnMode==="quiz"&&lines.length>0&&(
                  <div style={{flexShrink:0,margin:"0 16px 8px",display:"flex",alignItems:"center",
                    gap:10,padding:"7px 14px",
                    background:"rgba(124,58,237,.1)",border:"1px solid rgba(124,58,237,.2)",
                    borderRadius:10}}>
                    <span style={{fontSize:12,fontWeight:700,color:"#a78bfa"}}>📝 Quiz</span>
                    <div style={{flex:1}}/>
                    <span style={{fontSize:12,color:"#4ade80",fontWeight:700,display:"flex",alignItems:"center",gap:3}}>
                      <CheckCircle2 size={12} strokeWidth={2.5}/> {score}
                    </span>
                    <span style={{fontSize:11,color:"rgba(255,255,255,.2)"}}>|</span>
                    <span style={{fontSize:12,color:"#f87171",fontWeight:700,display:"flex",alignItems:"center",gap:3}}>
                      <XCircle size={12} strokeWidth={2.5}/> {misses}
                    </span>
                  </div>
                )}

                {/* Letras / Quiz */}
                <div style={{flex:1,minHeight:0,padding:"0 16px 14px"}}>
                  {lyricsLoading?(
                    <div style={{height:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                      <div style={{width:14,height:14,border:"2px solid rgba(255,255,255,.1)",
                        borderTopColor:"#1DB954",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>
                      <span style={{fontSize:13,color:"rgba(255,255,255,.3)"}}>A carregar letras…</span>
                    </div>
                  ):lines.length>0?(
                    learnMode==="quiz"?(
                      /* ── Modo Quiz ── */
                      <div style={{height:"100%",display:"flex",flexDirection:"column",
                        background:"rgba(0,0,0,.3)",backdropFilter:"blur(10px)",
                        borderRadius:12,border:"1px solid rgba(124,58,237,.2)",overflow:"hidden"}}>
                        {/* Barra de progresso */}
                        <div style={{height:2,background:"rgba(124,58,237,.15)",flexShrink:0}}>
                          <div style={{height:"100%",background:"linear-gradient(90deg,#7c3aed,#a78bfa)",
                            width:`${Math.round(((activeLine+1)/lines.length)*100)}%`,transition:"width .3s"}}/>
                        </div>

                        {/* Linhas anteriores (contexto) */}
                        <div style={{flex:1,display:"flex",flexDirection:"column",
                          alignItems:"center",justifyContent:"center",gap:12,padding:"16px 20px"}}>
                          {activeLine>0&&(
                            <p style={{margin:0,fontSize:12,color:"rgba(255,255,255,.2)",
                              fontStyle:"italic",textAlign:"center"}}>{lines[activeLine-1]?.en}</p>
                          )}

                          {/* Linha activa com input */}
                          <div className={quizStatus==="correct"?"quiz-correct":quizStatus==="wrong"?"quiz-wrong":""}>
                            <QuizLine
                              line={lines[activeLine]?.en||""}
                              quizWord={quizWord}
                              input={quizInput}
                              onInput={setQuizInput}
                              onSubmit={submitQuiz}
                              status={quizStatus}
                              answer={quizWord?.word||""}
                            />
                          </div>

                          {/* Tradução PT */}
                          {lines[activeLine]?.pt&&(
                            <p style={{margin:0,fontSize:11,color:"rgba(255,255,255,.25)",
                              fontStyle:"italic",textAlign:"center"}}>🇵🇹 {lines[activeLine].pt}</p>
                          )}

                          {/* Botões */}
                          <div style={{display:"flex",gap:8,marginTop:4}}>
                            <button onClick={submitQuiz} disabled={!quizInput.trim()||quizStatus!=="idle"}
                              style={{background:"linear-gradient(135deg,#7c3aed,#6d28d9)",
                                border:"none",borderRadius:50,padding:"9px 22px",fontSize:13,
                                fontWeight:800,color:"#fff",cursor:"pointer",fontFamily:"inherit",
                                opacity:(!quizInput.trim()||quizStatus!=="idle")?.4:1,
                                boxShadow:"0 4px 14px rgba(124,58,237,.4)",transition:"all .2s",
                                display:"flex",alignItems:"center",gap:6}}>
                              <CheckCircle2 size={15} strokeWidth={2.5}/>
                              Confirmar
                            </button>
                            <button onClick={()=>{setActiveLine(p=>Math.min(lines.length-1,p+1));setQuizInput("");setQuizStatus("idle");}}
                              style={{background:"rgba(255,255,255,.06)",
                                border:"1px solid rgba(255,255,255,.1)",
                                borderRadius:50,padding:"9px 16px",fontSize:12,
                                fontWeight:600,color:"rgba(255,255,255,.55)",
                                cursor:"pointer",fontFamily:"inherit",transition:"all .2s",
                                display:"flex",alignItems:"center",gap:5}}>
                              <SkipForward size={13} strokeWidth={2.5}/>
                              Saltar
                            </button>
                          </div>

                          {/* Dica após errar */}
                          {quizStatus==="wrong"&&quizWord&&(
                            <div className="fade-up" style={{display:"flex",alignItems:"center",
                              gap:6,background:"rgba(239,68,68,.12)",borderRadius:12,
                              padding:"8px 14px",border:"1px solid rgba(239,68,68,.2)"}}>
                              <XCircle size={14} color="#f87171" strokeWidth={2.5}/>
                              <p style={{margin:0,fontSize:12,color:"#fca5a5"}}>
                                A palavra era: <strong style={{color:"#fff"}}>{quizWord.word}</strong>
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Próxima linha (preview) */}
                        {activeLine<lines.length-1&&(
                          <p style={{margin:0,padding:"10px 20px",textAlign:"center",
                            fontSize:11,color:"rgba(255,255,255,.15)",fontStyle:"italic",
                            borderTop:"1px solid rgba(255,255,255,.04)"}}>
                            A seguir: {lines[activeLine+1]?.en}
                          </p>
                        )}
                      </div>
                    ):(
                      /* ── Modo Karaoke ── */
                      <LyricsRiser lines={lines.map(l=>({en:l.en,pt:l.pt||undefined}))}
                        active={activeLine} isPlaying={isPlaying}
                        onNext={()=>setActiveLine(p=>Math.min(lines.length-1,p+1))}
                        onPrev={()=>setActiveLine(p=>Math.max(0,p-1))}/>
                    )
                  ):(
                    <div style={{height:"100%",display:"flex",flexDirection:"column",
                      alignItems:"center",justifyContent:"center",gap:10,color:"rgba(255,255,255,.18)"}}>
                      <span style={{fontSize:42}}>🎤</span>
                      <span style={{fontSize:13}}>Letras não encontradas para esta música</span>
                    </div>
                  )}
                </div>
              </>
            ):(
              <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",
                justifyContent:"center",gap:14,color:"rgba(255,255,255,.12)"}}>
                <svg width={56} height={56} viewBox="0 0 24 24" fill="rgba(29,185,84,.2)">
                  <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3z"/>
                </svg>
                <p style={{margin:0,fontSize:14,fontWeight:600}}>Seleciona uma música para começar</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
