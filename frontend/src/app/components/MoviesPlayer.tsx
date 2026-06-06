/* ════════════════════════════════════════════════════════════════════
   NgadaLearn — Movies Player
   Cenas de filmes reais · YT IFrame API · CC automático
   Filtro contra reacções/paródias · Velocidade · Vocabulário
   ════════════════════════════════════════════════════════════════════ */

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link } from "react-router";

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

@keyframes subIn{
  0%{opacity:0;transform:translateY(22px) scale(.94);filter:blur(6px)}
  60%{opacity:1;filter:blur(0)}
  100%{transform:translateY(0) scale(1)}
}
@keyframes subShimmer{0%{background-position:0% 50%}100%{background-position:300% 50%}}
.sub-in{animation:subIn .48s cubic-bezier(.34,1.56,.64,1) both}

@keyframes livePulse{0%,100%{opacity:1}50%{opacity:.45}}
.live-badge{animation:livePulse 1.4s ease-in-out infinite}
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

interface TimedSub {
  start: number;
  dur:   number;
  text:  string;
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

/* ── (legendas estáticas removidas — usar CC automático em tempo real) ── */
const _UNUSED = {
  "Forrest Gump": [
    "My mama always said life was like a box of chocolates.",
    "You never know what you're gonna get.",
    "Stupid is as stupid does.",
    "I'm not a smart man, but I know what love is.",
    "Run, Forrest, run!",
    "I just felt like running.",
    "Mama always had a way of explaining things so I could understand them.",
    "Lieutenant Dan, ice cream!",
    "Have you accepted Jesus Christ as your personal savior?",
    "Life is like a box of chocolates, Forrest.",
    "Now you wouldn't believe me if I told you, but I could run like the wind blows.",
    "From that day on, if I was going somewhere, I was running!",
  ].join("\n"),

  "The Pursuit of Happyness": [
    "Don't ever let somebody tell you you can't do something.",
    "Not even me. You got a dream, you gotta protect it.",
    "People can't do something themselves, they wanna tell you you can't do it.",
    "You want something, go get it. Period.",
    "This part of my life, this little part, is called happiness.",
    "The world is your oyster. It's up to you to find the pearls.",
    "You got a dream... You gotta protect it.",
    "I am the man who will catch the 49ers' game.",
    "It was right then that I started thinking about Thomas Jefferson.",
    "The pursuit of happyness.",
    "Hey, I'm a self-made man. I had to work for everything I got.",
    "I'm happy. Don't mess up my happiness.",
  ].join("\n"),

  "The Lion King": [
    "Remember who you are.",
    "You are my son, and the one true king.",
    "Everything the light touches is our kingdom.",
    "A king's time as ruler rises and falls like the sun.",
    "One day, Simba, the sun will set on my time here.",
    "And will rise with you as the new king.",
    "I'm only brave when I have to be.",
    "Oh yes, the past can hurt.",
    "But the way I see it, you can either run from it or learn from it.",
    "Hakuna Matata! It means no worries for the rest of your days.",
    "Oh yes, the past can hurt. But the way I see it...",
    "You can either run from it or... learn from it.",
  ].join("\n"),

  "Dead Poets Society": [
    "O Captain! My Captain!",
    "Carpe diem. Seize the day, boys.",
    "Make your lives extraordinary.",
    "We are food for worms, lads.",
    "Believe it or not, each and every one of us in this room is one day going to stop breathing.",
    "No matter what anybody tells you, words and ideas can change the world.",
    "That you are here — that life exists and identity,",
    "That the powerful play goes on, and you may contribute a verse.",
    "What will your verse be?",
    "Now, I didn't hear a word Keating said, but I certainly was moved.",
    "Boys, you must strive to find your own voice.",
    "Because the longer you wait to begin, the less likely you are to find it at all.",
  ].join("\n"),

  "The Dark Knight": [
    "Why so serious?",
    "Some men just want to watch the world burn.",
    "You either die a hero or you live long enough to see yourself become the villain.",
    "Why so serious? Let's put a smile on that face!",
    "I'm an agent of chaos.",
    "Madness, as you know, is like gravity. All it takes is a little push.",
    "Because he's not the hero Gotham deserves, but the one it needs right now.",
    "He's the Dark Knight.",
    "You see, I'm a man of simple tastes.",
    "I enjoy dynamite, and gunpowder, and gasoline!",
    "Do you want to know why I use a knife?",
    "Guns are too quick. You can't savor all the little emotions.",
  ].join("\n"),

  "The Matrix": [
    "What is the Matrix?",
    "You take the blue pill, the story ends.",
    "You wake up in your bed and believe whatever you want to believe.",
    "You take the red pill, you stay in Wonderland,",
    "And I show you how deep the rabbit hole goes.",
    "I know kung fu.",
    "There is no spoon.",
    "The Matrix is everywhere. It is all around us.",
    "It is the world that has been pulled over your eyes to blind you from the truth.",
    "You've been living in a dream world, Neo.",
    "This is the world as it exists today.",
    "Welcome to the desert of the real.",
  ].join("\n"),

  "Good Will Hunting": [
    "It's not your fault.",
    "It's not your fault, Will.",
    "It's not your fault.",
    "You're not perfect, and let me save you the suspense: this girl you've met isn't perfect either.",
    "But the question is whether or not you're perfect for each other.",
    "You're an orphan right? Do you think I know what it's like?",
    "Personally, I don't know what it's like to have a father who's an alcoholic.",
    "I don't know what that's like.",
    "You're a genius, Will. No one denies that.",
    "But you're just a kid and you don't have the faintest idea what you're talking about.",
    "Real loss is only possible when you love something more than you love yourself.",
    "I think you know how to write it down. Write it down.",
  ].join("\n"),

  "The Social Network": [
    "A million dollars isn't cool. You know what's cool?",
    "A billion dollars.",
    "You're not an asshole, Mark. You're just trying so hard to be.",
    "I'm CEO, bitch.",
    "Drop the 'The'. Just 'Facebook'. It's cleaner.",
    "We lived on farms, then we lived in cities,",
    "And now we're gonna live on the internet.",
    "We don't know what it can be, we don't know what it will be.",
    "We know that it's cool.",
    "If you guys were the inventors of Facebook, you'd have invented Facebook.",
    "You better lawyer up, asshole.",
    "Because I'm not coming back for 30%, I'm coming back for everything.",
  ].join("\n"),

  "Inception": [
    "You mustn't be afraid to dream a little bigger, darling.",
    "We need to go deeper.",
    "Your mind is the scene of the crime.",
    "What is the most resilient parasite?",
    "A bacteria? A virus?",
    "An idea. A single idea from the human mind can build cities.",
    "An idea can transform the world and rewrite all the rules.",
    "Which is why I have to steal it.",
    "Dreams feel real while we're in them.",
    "It's only when we wake up that we realize something was actually strange.",
    "I can't imagine you with kids.",
    "Do you want to take a leap of faith?",
  ].join("\n"),

  "Interstellar": [
    "We've always defined ourselves by the ability to overcome the impossible.",
    "Do not go gentle into that good night.",
    "Old age should burn and rave at close of day.",
    "Rage, rage against the dying of the light.",
    "Love is the one thing that transcends time and space.",
    "Maybe it means something more — some evidence, some artifact.",
    "Love is the one thing we're capable of perceiving that transcends time and space.",
    "We're not meant to save the world. We're meant to leave it.",
    "Murph! You have to tell me what I did!",
    "It's not possible.",
    "No. It's necessary.",
    "Once you're a parent, you're the ghost of your children's future.",
  ].join("\n"),

  "Erin Brockovich": [
    "That's the thing about the truth. It's never what it is, it's what it represents.",
    "I don't need pity, I need a paycheck.",
    "You think you're the first person to try this?",
    "Those people don't dream about being on boats.",
    "Not only do I have a letter that says you knew,",
    "But I have documentation that proves it.",
    "I don't need a lawyer to make me feel smart.",
    "I've got $700 and a beat-up Hyundai.",
    "You know, this might mean nothing to you.",
    "But to those 634 plaintiffs...",
    "You are their only hope.",
    "$333 million, split between 634 plaintiffs.",
  ].join("\n"),

  "A Few Good Men": [
    "You can't handle the truth!",
    "Son, we live in a world that has walls,",
    "And those walls have to be guarded by men with guns.",
    "Who's gonna do it? You? You, Lieutenant Weinberg?",
    "I have a greater responsibility than you could possibly fathom.",
    "You weep for Santiago and curse the Marines.",
    "You have that luxury.",
    "You don't want the truth because deep down in places",
    "You don't talk about at parties,",
    "You want me on that wall. You need me on that wall.",
    "We use words like honor, code, loyalty.",
    "You ordered the Code Red!",
  ].join("\n"),
};

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

const BACKEND = import.meta.env.VITE_API_URL || "https://ngadalearn-api.onrender.com";
const EQ_CLS  = ["meq1","meq2","meq3","meq4","meq5"];
const EQ_COL  = ["#fbbf24","#f59e0b","#d97706","#fcd34d","#fef08a"];

/* ── Utilitários ─────────────────────────────────────────────────── */
function htmlDecode(str: string): string {
  return str
    .replace(/&#39;/g, "'").replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

function isBadTitle(title: string): boolean {
  const t = title.toLowerCase();
  return BAD_WORDS.some(w => t.includes(w));
}
function isOfficialChannel(ch: string): boolean {
  const c = ch.toLowerCase();
  return OFFICIAL_SIGNALS.some(s => c.includes(s));
}
async function checkEmbeddable(ids: string[]): Promise<Set<string>> {
  if (!ids.length) return new Set();
  try {
    const res  = await fetch(`${BACKEND}/api/youtube/videos?ids=${ids.join(",")}`);
    const data = await res.json();
    return new Set<string>(
      (data.items || []).filter((i: any) => i.status?.embeddable !== false).map((i: any) => i.id)
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
  const safeTitle = htmlDecode(clip.title);
  const safeChan  = htmlDecode(clip.channel);
  const text = `${safeTitle} — ${safeChan}   •   ${safeTitle} — ${safeChan}   •   `;
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
   WORD POPUP — clique numa palavra para ouvir e guardar no vocabulário
   ════════════════════════════════════════════════════════════════════ */
function WordPopup({ word, pos, onClose }: {
  word: string;
  pos: { x: number; y: number };
  onClose: () => void;
}) {
  const speak = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(word);
    u.lang = "en-US"; u.rate = 0.8;
    const pref = window.speechSynthesis.getVoices().find(
      v => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Samantha"))
    );
    if (pref) u.voice = pref;
    window.speechSynthesis.speak(u);
  };

  useEffect(() => { speak(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const left = Math.min(pos.x - 68, (typeof window !== "undefined" ? window.innerWidth : 800) - 148);
  const top  = Math.max(pos.y - 90, 8);

  return (
    <div
      style={{ position: "fixed", left, top, zIndex: 9999 }}
      className="bg-gray-950 border border-amber-500/60 rounded-xl p-3 shadow-2xl w-36"
      onClick={e => e.stopPropagation()}
    >
      <button onClick={onClose} className="absolute top-1 right-1.5 text-white/30 hover:text-white/80 text-xs transition-colors leading-none">✕</button>
      <p className="font-black text-amber-300 text-base text-center mb-2">{word}</p>
      <button
        onClick={speak}
        className="w-full py-1.5 bg-blue-600/50 hover:bg-blue-600 rounded-lg text-xs font-bold text-white transition-colors"
      >
        🔊 Ouvir
      </button>
      <p className="text-[9px] text-white/25 text-center mt-1.5">Clica fora para fechar</p>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SUBTITLE RISER — legendas a subir, tema âmbar (filmes)
   ════════════════════════════════════════════════════════════════════ */
const SL_H    = 60;
const SL_SLOTS = 7;
const SL_CTR   = 3;

function SubtitleRiser({ lines, active, isPlaying, onWordClick }: {
  lines: string[]; active: number; isPlaying: boolean;
  onWordClick?: (word: string, e: React.MouseEvent) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [wrapH, setWrapH] = useState(320);

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
  const HINT  = onWordClick ? 20 : 0;
  const clipH = Math.max(SL_H * 3, wrapH - PROG - BADGE - HINT);
  const padV  = Math.max(0, (clipH - SL_H) / 2);
  const ty    = -active * SL_H;

  function renderWords(text: string) {
    if (!onWordClick) return <>{text}</>;
    return (
      <>
        {text.split(/(\s+)/).map((part, i) =>
          /^\s+$/.test(part) ? <span key={i}> </span> : (
            <button key={i} onClick={e => {
              const clean = part.replace(/[^a-zA-Z'-]/g,"").toLowerCase();
              if (clean.length > 1) onWordClick(clean, e);
            }} style={{
              background:"none",border:"none",cursor:"pointer",font:"inherit",
              color:"inherit",padding:"0 1px",borderRadius:3,display:"inline",
            }}
            className="hover:text-amber-400 hover:underline underline-offset-2 transition-colors">
              {part}
            </button>
          )
        )}
      </>
    );
  }

  return (
    <div ref={wrapRef} style={{
      height:"100%",position:"relative",
      background:"linear-gradient(160deg,rgba(8,3,0,.99) 0%,rgba(38,15,2,.99) 50%,rgba(15,5,0,.99) 100%)",
      border:"1px solid rgba(245,158,11,.22)",borderRadius:20,overflow:"hidden",
      display:"flex",flexDirection:"column",
    }}>
      {/* Progresso */}
      <div style={{height:PROG,background:"rgba(245,158,11,.1)",flexShrink:0}}>
        <div style={{height:"100%",width:`${Math.max(0,Math.round(((active+1)/lines.length)*100))}%`,
          background:"linear-gradient(90deg,#f59e0b,#d97706)",transition:"width .25s ease",borderRadius:2}}/>
      </div>

      {/* Badge */}
      <div style={{height:BADGE,display:"flex",alignItems:"center",padding:"0 16px",flexShrink:0}}>
        <span className="live-badge" style={{fontSize:9,fontWeight:700,letterSpacing:".1em",
          background:"rgba(34,197,94,.12)",color:"#4ade80",border:"1px solid rgba(34,197,94,.3)",borderRadius:99,padding:"2px 8px"}}>● CC AO VIVO</span>
        <div style={{flex:1}}/>
        <span style={{fontSize:10,fontFamily:"monospace",color:"rgba(245,158,11,.3)"}}>{active+1}/{lines.length}</span>
      </div>

      {/* Clip window */}
      <div style={{height:clipH,overflow:"hidden",position:"relative",flexShrink:0}}>
        <div style={{position:"absolute",top:0,left:0,right:0,zIndex:10,pointerEvents:"none",
          height:clipH*0.32,background:"linear-gradient(to bottom,rgba(8,3,0,1) 0%,rgba(8,3,0,.7) 60%,transparent 100%)"}}/>
        <div style={{
          transform:`translateY(${ty}px)`,transition:"transform .5s cubic-bezier(.4,0,.2,1)",
          paddingTop:padV,paddingBottom:padV,
        }}>
          {lines.map((line, i) => {
            const dist  = Math.abs(i - active);
            const isAct = i === active;
            const opacity = dist===0?1:dist===1?.42:dist===2?.2:.06;
            const scale   = dist===0?1:dist===1?.93:.85;
            return (
              <div key={i} style={{height:SL_H,display:"flex",alignItems:"center",
                justifyContent:"center",padding:"0 28px",
                opacity,transform:`scale(${scale})`,transition:"opacity .45s ease, transform .45s ease"}}>
                <p style={{textAlign:"center",lineHeight:1.3,margin:0,
                  fontSize:isAct?"clamp(1.25rem,3.2vw,1.7rem)":"clamp(.82rem,2vw,1.05rem)",
                  fontWeight:isAct?900:400,fontStyle:dist>=2?"italic":"normal",
                  ...(isAct ? {
                    background:"linear-gradient(90deg,#fef3c7,#f59e0b,#fcd34d,#f59e0b,#fef3c7)",
                    backgroundSize:"300% 100%",
                    animation:isPlaying?"subShimmer 3s linear infinite":"none",
                    WebkitBackgroundClip:"text",
                    backgroundClip:"text",
                    color:"transparent",
                    textShadow:"none",
                  } : {
                    color:"rgba(255,255,255,.48)",
                  })}}>
                  {isAct ? renderWords(line) : line || "·"}
                </p>
              </div>
            );
          })}
        </div>
        <div style={{position:"absolute",bottom:0,left:0,right:0,zIndex:10,pointerEvents:"none",
          height:clipH*0.28,background:"linear-gradient(to top,rgba(8,3,0,1) 0%,rgba(8,3,0,.65) 60%,transparent 100%)"}}/>
      </div>

      {/* Dica de clique */}
      {HINT>0&&(
        <p style={{flexShrink:0,height:HINT,display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:10,color:"rgba(245,158,11,.25)",margin:0}}>Clica numa palavra para ouvir 🔊</p>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   CINEMA SUBTITLE DISPLAY — Legenda de filme animada profissional
   Suporta palavras clicáveis e modo tempo-real (isLive)
   ════════════════════════════════════════════════════════════════════ */
function CinemaSubDisplay({ lines, active, isPlaying, onWordClick, isLive }: {
  lines: string[]; active: number; isPlaying: boolean;
  onWordClick?: (word: string, e: React.MouseEvent) => void;
  isLive?: boolean;
}) {
  if (!lines.length) return null;
  const prev = lines[active - 1];
  const curr = lines[active];
  const next = lines[active + 1];
  if (!curr) return null;

  function renderWords(text: string, interactive = false) {
    if (!interactive || !onWordClick) return <>{text}</>;
    return (
      <>
        {text.split(/(\s+)/).map((part, i) =>
          /^\s+$/.test(part) ? <span key={i}> </span> : (
            <button
              key={i}
              onClick={e => {
                const clean = part.replace(/[^a-zA-Z'-]/g, "").toLowerCase();
                if (clean.length > 1) onWordClick(clean, e);
              }}
              style={{ background:"none", border:"none", cursor:"pointer", font:"inherit",
                       color:"inherit", padding:"0 1px", borderRadius:3, display:"inline" }}
              className="hover:text-amber-400 hover:underline underline-offset-2 transition-colors"
            >
              {part}
            </button>
          )
        )}
      </>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-2xl" style={{
      background: "linear-gradient(135deg,rgba(12,5,2,.97) 0%,rgba(50,20,2,.97) 50%,rgba(20,8,2,.97) 100%)",
      border: "1px solid rgba(245,158,11,.35)",
      boxShadow: "0 0 40px rgba(180,83,9,.15), inset 0 0 60px rgba(180,83,9,.04)",
    }}>
      {/* Barra de progresso */}
      <div style={{height:3,background:"rgba(245,158,11,.1)",borderRadius:"2px 2px 0 0"}}>
        <div style={{
          height:"100%",
          width:`${Math.round(((active+1)/lines.length)*100)}%`,
          background:"linear-gradient(90deg,#f59e0b,#d97706)",
          borderRadius:2,
          transition:"width 0.2s ease",
        }} />
      </div>
      {/* Orb de fundo */}
      <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
        <div style={{position:"absolute",top:"15%",left:"10%",width:110,height:110,borderRadius:"50%",
          background:"rgba(245,158,11,.12)",filter:"blur(38px)",animation:"mglow 4.5s ease-in-out infinite"}} />
        <div style={{position:"absolute",bottom:"15%",right:"10%",width:80,height:80,borderRadius:"50%",
          background:"rgba(234,88,12,.09)",filter:"blur(30px)",animation:"mglow 5.5s 1s ease-in-out infinite"}} />
      </div>

      {/* Barra de topo */}
      <div className="flex items-center gap-3 px-5 pt-3 pb-1 relative z-10">
        {isPlaying ? (
          <div className="flex items-end gap-0.5" style={{height:14}}>
            {["meq1","meq3","meq5"].map(cls=>(
              <div key={cls} className={cls} style={{width:2,borderRadius:2,backgroundColor:"#fbbf24",minHeight:2}} />
            ))}
          </div>
        ) : <span style={{fontSize:13}}>📺</span>}
        <span style={{fontSize:10,letterSpacing:"0.12em",fontFamily:"monospace",color:"rgba(245,158,11,.5)"}}>
          {active+1} / {lines.length}
        </span>
        <div style={{flex:1,height:1,background:"linear-gradient(90deg,transparent,rgba(245,158,11,.25),transparent)"}} />
        {isLive ? (
          <span className="live-badge" style={{
            fontSize:9, fontWeight:700, letterSpacing:"0.1em",
            background:"rgba(34,197,94,.15)", color:"#4ade80",
            border:"1px solid rgba(34,197,94,.4)", borderRadius:99,
            padding:"2px 8px",
          }}>
            ● AO VIVO
          </span>
        ) : (
          <span style={{fontSize:10,color:"rgba(245,158,11,.4)",letterSpacing:"0.08em"}}>✦ CC</span>
        )}
      </div>

      {/* Linha anterior */}
      {prev && (
        <p style={{textAlign:"center",padding:"0 24px 4px",fontSize:12,color:"rgba(255,255,255,.2)",
          fontStyle:"italic",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",position:"relative",zIndex:10}}>
          {prev}
        </p>
      )}

      {/* Linha activa — palavras clicáveis */}
      <div key={`ms-${active}`} className="sub-in"
        style={{textAlign:"center",padding:`${prev?"4px":"14px"} 20px ${next?"2px":"14px"}`,position:"relative",zIndex:10}}>
        <p style={{
          fontSize:"clamp(1.05rem,2.8vw,1.55rem)",
          fontWeight:800,
          color:"#fff",
          lineHeight:1.35,
          letterSpacing:"0.02em",
          textShadow:"0 2px 30px rgba(0,0,0,.9), 0 0 50px rgba(245,158,11,.25)",
        }}>
          {renderWords(curr, true)}
        </p>
        {onWordClick && (
          <p style={{fontSize:9,color:"rgba(255,255,255,.2)",marginTop:4}}>
            Clica numa palavra para ouvir e guardar
          </p>
        )}
      </div>

      {/* Próxima linha */}
      {next && (
        <p style={{textAlign:"center",padding:"4px 24px 12px",fontSize:12,color:"rgba(255,255,255,.2)",
          fontStyle:"italic",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",position:"relative",zIndex:10}}>
          {next}
        </p>
      )}
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
  const ytPlayer       = useRef<any>(null);
  const resultsRef     = useRef<MovieClip[]>([]);
  const selectedRef    = useRef<MovieClip|null>(null);
  const errorTimeout   = useRef<ReturnType<typeof setTimeout>|null>(null);
  const skipTimeoutRef = useRef<ReturnType<typeof setTimeout>|null>(null);

  /* Legendas temporizadas (tempo real) */
  const [transcript,   setTranscript]   = useState<TimedSub[]>([]);
  const [transLoading, setTransLoading] = useState(false);
  const [liveSubIdx,   setLiveSubIdx]   = useState(-1);
  const liveSubIdxRef  = useRef(-1);
  const liveTimerRef       = useRef<ReturnType<typeof setInterval> | null>(null);
  const transcriptLoadedRef = useRef(false); // evita sobrescrever depois de carregado

  /* Linhas do transcript memoizadas — evita recriar o array em cada render */
  const transcriptLines = useMemo(() => transcript.map(s => s.text), [transcript]);

  const autoSelectRef = useRef(false);

  /* Popup de palavra clicada */
  const [wordPopup, setWordPopup] = useState<{ word: string; x: number; y: number } | null>(null);

  /* ── Sync selectedRef (sempre atual para callbacks do YT) ───── */
  useEffect(() => { selectedRef.current = selected; }, [selected]);

  /* ── Helper: avançar para o próximo clip ou mostrar erro ─────── */
  const skipToNextClip = useCallback(() => {
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
          rel:            0,
          modestbranding: 1,
          playsinline:    1,
          autoplay:       0,
          cc_load_policy: 1,   // força o YT a carregar as captions
          cc_lang_pref:   "en",
          origin:         window.location.origin,
        },
        events: {
          onReady: (e:any) => {
            if (errorTimeout.current) clearTimeout(errorTimeout.current);
            errorTimeout.current = setTimeout(() => {
              const state = ytPlayer.current?.getPlayerState?.() ?? -1;
              if (state === -1 || state === 5) skipToNextClip();
            }, 12000);

            function parseEv(events: any[]): TimedSub[] {
              return (events || [])
                .filter((ev:any) => ev.segs?.length)
                .map((ev:any) => ({
                  start: (ev.tStartMs || 0) / 1000,
                  dur:   Math.max((ev.dDurationMs || 2000) / 1000, 0.3),
                  text:  ev.segs.map((s:any) => (s.utf8||"").replace(/\n/g," "))
                           .join("").replace(/\s+/g," ").trim(),
                }))
                .filter((s:any) => s.text);
            }

            /* Polling: tenta obter captionTracks de getPlayerResponse() */
            let attempts = 0;
            const poll = setInterval(async () => {
              if (transcriptLoadedRef.current) { clearInterval(poll); return; }
              attempts++;
              if (attempts > 12) { clearInterval(poll); setTransLoading(false); return; }

              try { e.target.setOption("captions", "track", {}); } catch { /* */ }

              const resp = e.target.getPlayerResponse?.();
              const tracks: any[] = resp?.captions?.playerCaptionsTracklistRenderer?.captionTracks || [];
              const track = tracks.find((t:any) => t.languageCode === "en") ||
                            tracks.find((t:any) => t.languageCode?.startsWith("en")) ||
                            tracks[0];
              if (!track?.baseUrl) return; // ainda não disponível — próxima iteração

              clearInterval(poll);

              /* 1. Fetch directo do browser (URLs assinadas do YT permitem CORS) */
              try {
                const r = await fetch(decodeURIComponent(track.baseUrl) + "&fmt=json3");
                if (r.ok) {
                  const d = await r.json();
                  const segs = parseEv(d.events);
                  if (segs.length >= 3) {
                    transcriptLoadedRef.current = true;
                    setTranscript(segs); setTransLoading(false); return;
                  }
                }
              } catch { /* CORS — tenta proxy */ }

              /* 2. Proxy no backend */
              try {
                const r = await fetch(
                  `${BACKEND}/api/youtube/caption-proxy?url=${encodeURIComponent(track.baseUrl)}`
                );
                if (r.ok) {
                  const d = await r.json();
                  const segs = parseEv(d.events);
                  if (segs.length >= 3) {
                    transcriptLoadedRef.current = true;
                    setTranscript(segs); setTransLoading(false);
                  }
                }
              } catch { /* */ }
            }, 500);
          },
          onStateChange: (e:any) => {
            setIsPlaying(e.data === 1);
            if (e.data === 1) {
              if (errorTimeout.current) { clearTimeout(errorTimeout.current); errorTimeout.current = null; }
            }
            /* Estado -1 (unstarted) após breve carregamento = vídeo bloqueado */
            if (e.data === -1) {
              if (skipTimeoutRef.current) clearTimeout(skipTimeoutRef.current);
              skipTimeoutRef.current = setTimeout(() => {
                const st = ytPlayer.current?.getPlayerState?.() ?? -1;
                if (st === -1) skipToNextClip();
              }, 4000);
            } else {
              if (skipTimeoutRef.current) { clearTimeout(skipTimeoutRef.current); skipTimeoutRef.current = null; }
            }
          },
          onError: () => {
            /* Qualquer erro do YT API → avançar silenciosamente */
            skipToNextClip();
          },
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

  /* ── Sync resultsRef (para onError não fechar sobre estado stale) */
  useEffect(() => { resultsRef.current = results; }, [results]);

  /* ── Buscar legendas temporizadas quando o vídeo muda ───────────── */
  useEffect(() => {
    if (!selected) {
      setTranscript([]); setLiveSubIdx(-1);
      liveSubIdxRef.current = -1; transcriptLoadedRef.current = false; return;
    }
    setTranscript([]); setLiveSubIdx(-1);
    liveSubIdxRef.current = -1; transcriptLoadedRef.current = false;
    setTransLoading(true);
    fetch(`${BACKEND}/api/youtube/transcript/${selected.id}`)
      .then(r => r.json())
      .then(d => {
        const segs = d.segments || [];
        if (segs.length) {
          transcriptLoadedRef.current = true;
          setTranscript(segs); setTransLoading(false);
        }
        /* senão mantém transLoading=true — o fallback do browser trata */
      })
      .catch(() => setTransLoading(false));
  }, [selected?.id]);

  /* ── Polling de tempo: sync legendas em tempo real ──────────────── */
  useEffect(() => {
    if (liveTimerRef.current) clearInterval(liveTimerRef.current);
    if (!isPlaying || !transcript.length) return;

    liveTimerRef.current = setInterval(() => {
      try {
        const t = ytPlayer.current?.getCurrentTime?.() ?? 0;
        // Pesquisa binária: último segmento com start <= t
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

  /* ── Cleanup ─────────────────────────────────────────────────── */
  useEffect(() => () => {
    try { ytPlayer.current?.destroy(); } catch(_) {}
    if (errorTimeout.current)   clearTimeout(errorTimeout.current);
    if (skipTimeoutRef.current) clearTimeout(skipTimeoutRef.current);
  }, []);


  /* ── Pesquisa ────────────────────────────────────────────────── */
  const searchClips = useCallback(async (raw: string) => {
    if (!raw.trim()) return;
    setLoading(true); setSearchErr(""); setResults([]);

    try {
      const params = new URLSearchParams({ q: raw, type: "movies", max: "25" });
      const res  = await fetch(`${BACKEND}/api/youtube/search?${params}`);
      const data = await res.json();

      if (data.quotaExceeded) {
        setSearchErr("Quota do YouTube temporariamente esgotada. Tente novamente mais tarde.");
        return;
      }

      const raw2: MovieClip[] = (data.videos || []).map((v: any) => ({
        id:         v.id,
        title:      v.title,
        channel:    v.channel,
        thumbnail:  v.thumbnail,
        isOfficial: isOfficialChannel(v.channel),
      }));

      const filtered  = raw2.filter(v => !isBadTitle(v.title));
      const ok        = await checkEmbeddable(filtered.map(v => v.id));
      const embeddable = filtered.filter(v => ok.has(v.id));

      const sorted = [
        ...embeddable.filter(v => v.isOfficial),
        ...embeddable.filter(v => !v.isOfficial),
      ];

      const top = sorted.slice(0, 12);
      setResults(top);
      if (!top.length) setSearchErr("Nenhuma cena encontrada. Tenta outro título.");
      else if (autoSelectRef.current && top[0]) {
        setSelected(top[0]); setVidError(false); autoSelectRef.current = false;
      }
    } catch (e: unknown) {
      setSearchErr(e instanceof Error ? e.message : "Erro na pesquisa.");
    } finally { setLoading(false); }
  }, []);

  /* Pesquisa inicial */
  useEffect(() => { searchClips("official movie scene english"); }, [searchClips]);

  /* Filtra por género (curadas) */
  const filteredCurated = useMemo(() =>
    genreFilter === "Todos"
      ? CURATED
      : CURATED.filter(m => m.genre === genreFilter),
  [genreFilter]);

  function tryNext() { skipToNextClip(); }
  const [mobileListOpen, setMobileListOpen] = useState(false);

  /* ════════════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════════════ */

  /* Lista de filmes — reutilizada desktop+mobile */
  const MovieList = () => (
    <div className="flex flex-col gap-2 h-full">
      <form onSubmit={e=>{e.preventDefault();searchClips(query);}}
        className="flex-shrink-0 bg-white/8 backdrop-blur rounded-2xl p-3 space-y-2.5 border border-amber-500/10">
        <label className="block text-[11px] font-bold text-amber-300 uppercase tracking-widest">🔍 Pesquisar</label>
        <div className="flex gap-2">
          <input value={query} onChange={e=>setQuery(e.target.value)}
            placeholder="Forrest Gump, Matrix…"
            className="flex-1 bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-sm placeholder-white/35 focus:outline-none focus:border-amber-400 transition-colors" />
          <button type="submit" disabled={loading} style={{touchAction:'manipulation'}}
            className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 px-4 min-h-[44px] rounded-xl text-sm font-bold transition-colors">
            {loading?"…":"Ir"}
          </button>
        </div>
        <p className="text-[10px] text-amber-400/60">✅ Filtra reacções, paródias e análises automaticamente</p>
      </form>

      {/* Filmes recomendados */}
      <div className="flex-shrink-0 bg-white/8 backdrop-blur rounded-2xl p-3 border border-amber-500/10">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-bold text-amber-300 uppercase tracking-widest">🎞️ Recomendados</p>
          <div className="flex gap-1 overflow-x-auto overscroll-x-contain">
            {GENRES.map(g=>(
              <button key={g} onClick={()=>setGenreFilter(g)} style={{touchAction:'manipulation'}}
                className={`text-[10px] px-2.5 py-1 min-h-[30px] rounded-full transition-colors font-semibold flex-shrink-0 ${
                  genreFilter===g?"bg-amber-600 text-white":"bg-white/10 text-white/55 hover:text-white"
                }`}>{g}</button>
            ))}
          </div>
        </div>
        <div className="space-y-1 max-h-40 overflow-y-auto overscroll-contain pr-1">
          {filteredCurated.map(m=>(
            <button key={m.label}
              onClick={()=>{setQuery(m.label);autoSelectRef.current=true;searchClips(m.query);}}
              style={{touchAction:'manipulation'}}
              className="w-full text-left flex items-center gap-2 p-2 rounded-xl bg-white/4 hover:bg-amber-600/20 border border-transparent hover:border-amber-500/25 transition-all">
              <span className="text-base flex-shrink-0">{m.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate">{m.label}</p>
                <p className="text-[10px] text-white/40 truncate">{m.tip}</p>
              </div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded border flex-shrink-0 ${DIFF_COLOR[m.diff]}`}>
                {m.diff==="Iniciante"?"A1":m.diff==="Intermediário"?"B1":"C1"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {searchErr && (
        <div className="flex-shrink-0 bg-red-500/15 border border-red-400/30 rounded-xl p-2 text-xs text-red-300">⚠️ {searchErr}</div>
      )}

      <div className="flex-1 overflow-y-auto overscroll-contain space-y-1.5 pr-1">
        {loading && (
          <div className="flex flex-col items-center py-8 gap-3">
            <div className="flex items-end gap-1">
              {EQ_CLS.map((cls,i)=>(
                <div key={i} className={cls} style={{width:6,backgroundColor:EQ_COL[i],borderRadius:3,minHeight:3}} />
              ))}
            </div>
            <p className="text-xs text-amber-300">A filtrar…</p>
          </div>
        )}
        {!loading && results.map(clip=>{
          const active=selected?.id===clip.id;
          return (
            <button key={clip.id}
              onClick={()=>{setSelected(clip);setIsPlaying(false);setVidError(false);}}
              style={{touchAction:'manipulation'}}
              className={`w-full text-left flex gap-3 p-3 rounded-xl transition-all border ${
                active
                  ? "bg-amber-600/35 border-amber-400/60 shadow-lg shadow-amber-900/30"
                  : "bg-white/4 hover:bg-white/8 border-transparent hover:border-amber-500/20"
              }`}>
              <div className="relative flex-shrink-0">
                <img src={clip.thumbnail} alt=""
                  className="w-16 h-11 object-cover rounded-lg" loading="lazy" />
                {active&&isPlaying&&(
                  <div className="absolute inset-0 bg-black/55 rounded-lg flex items-center justify-center">
                    <div className="flex items-end gap-0.5" style={{height:12}}>
                      {["meq1","meq3","meq5"].map(cls=>(
                        <div key={cls} className={cls} style={{width:2,backgroundColor:"#fbbf24",borderRadius:2,minHeight:2}} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-xs font-semibold line-clamp-2 leading-snug text-white">
                  {clip.title.replace(/&#39;/g,"'").replace(/&amp;/g,"&").replace(/&quot;/g,'"')}
                </p>
                <p className="text-[11px] text-amber-300/70 mt-1 truncate">
                  {clip.channel.replace(/&#39;/g,"'").replace(/&amp;/g,"&")}
                </p>
                {clip.isOfficial&&(
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-full mt-0.5 inline-block">✓ Oficial</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <style>{ANIM}</style>

      {/* Popup de palavra */}
      {wordPopup && (
        <>
          <div className="fixed inset-0 z-[9998]" onClick={()=>setWordPopup(null)} />
          <WordPopup
            word={wordPopup.word}
            pos={{x:wordPopup.x,y:wordPopup.y}}
            onClose={()=>setWordPopup(null)}
          />
        </>
      )}

      {/* Drawer mobile — lista de filmes */}
      {mobileListOpen && (
        <div style={{position:"fixed",inset:0,zIndex:100,background:"rgba(0,0,0,.75)",backdropFilter:"blur(6px)"}}
          onClick={()=>setMobileListOpen(false)}>
          <div style={{position:"absolute",bottom:0,left:0,right:0,
            background:"linear-gradient(160deg,#1a0800,#2d1200)",
            borderRadius:"20px 20px 0 0",
            padding:"16px 16px calc(16px + env(safe-area-inset-bottom))",
            maxHeight:"78dvh",display:"flex",flexDirection:"column",gap:12}}
            onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <p style={{fontWeight:800,color:"#fff",fontSize:16,margin:0}}>🎬 Filmes</p>
              <button onClick={()=>setMobileListOpen(false)}
                style={{background:"rgba(245,158,11,.2)",border:"1px solid rgba(245,158,11,.3)",borderRadius:10,
                  padding:"6px 14px",color:"#fcd34d",cursor:"pointer",fontSize:13,fontWeight:700}}>
                ✕ Fechar
              </button>
            </div>
            <div style={{flex:1,overflow:"hidden"}}>
              <MovieList />
            </div>
          </div>
        </div>
      )}

      {/* Root — sem scroll */}
      <div className="flex flex-col text-white"
        style={{height:"100dvh",overflow:"hidden",
          background:"linear-gradient(160deg,#0a0500 0%,#1c0a00 45%,#080300 100%)",
          paddingBottom:"env(safe-area-inset-bottom)"}}>

        {/* Header */}
        <div style={{flexShrink:0,height:52,paddingTop:"env(safe-area-inset-top)",
          background:"rgba(0,0,0,.4)",backdropFilter:"blur(20px)",
          borderBottom:"1px solid rgba(245,158,11,.15)"}}>
          <div style={{maxWidth:1400,margin:"0 auto",height:"100%",position:"relative",
            display:"flex",alignItems:"center",justifyContent:"center",padding:"0 16px"}}>
            <Link to="/lessons" style={{position:"absolute",left:16,display:"flex",alignItems:"center",
              gap:6,color:"rgba(253,230,138,.7)",textDecoration:"none",fontSize:14,fontWeight:600}}
              className="hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
              </svg>
              <span className="hidden sm:inline">Voltar</span>
            </Link>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:18}}>🎬</span>
              <h1 style={{fontSize:15,fontWeight:900,margin:0,letterSpacing:"-.3px"}}>Filmes · Inglês</h1>
            </div>
            <button className="lg:hidden" onClick={()=>setMobileListOpen(true)}
              style={{position:"absolute",right:12,background:"rgba(245,158,11,.2)",
                border:"1px solid rgba(245,158,11,.3)",borderRadius:10,
                padding:"6px 12px",color:"#fcd34d",fontSize:12,fontWeight:700,cursor:"pointer"}}>
              🎬 Lista
            </button>
          </div>
        </div>

        {/* Main grid */}
        <div style={{flex:1,overflow:"hidden",maxWidth:1400,margin:"0 auto",width:"100%",padding:"10px 12px 8px"}}>
          <style>{`@media(min-width:1024px){.movie-grid{grid-template-columns:320px 1fr!important;}}`}</style>
          <div className="movie-grid" style={{display:"grid",gridTemplateColumns:"1fr",gap:12,height:"100%",overflow:"hidden"}}>

            {/* Lista (desktop esquerda) */}
            <div className="hidden lg:flex flex-col" style={{overflow:"hidden",gap:8}}>
              <MovieList />
            </div>

            {/* Coluna principal */}
            <div style={{display:"flex",flexDirection:"column",gap:10,overflow:"hidden",minWidth:0}}>

              {/* Player */}
              <div className={`flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl bg-black relative ${isPlaying?"movie-glow":""}`}
                style={{aspectRatio:"16/9",maxHeight:"min(42vh,480px)"}}>
                <div id="mv-player-root" className="w-full h-full"
                  style={{display:selected&&!vidError?"block":"none"}}/>

                {selected&&vidError&&(
                  <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,background:"#100500"}}>
                    <span style={{fontSize:48}}>😔</span>
                    <p style={{color:"rgba(255,255,255,.6)",fontSize:14,fontWeight:600,margin:0}}>Vídeo não disponível.</p>
                    <button onClick={tryNext} style={{touchAction:"manipulation",background:"#d97706",border:"none",borderRadius:14,padding:"12px 24px",color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer"}}>▶ Próxima cena</button>
                  </div>
                )}

                {!selected&&(
                  <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,color:"rgba(255,255,255,.2)"}}>
                    <div style={{display:"flex",alignItems:"flex-end",gap:3,opacity:.35}}>
                      {EQ_CLS.map((cls,i)=><div key={i} className={cls} style={{width:7,backgroundColor:EQ_COL[i],borderRadius:3,minHeight:3}}/>)}
                    </div>
                    <p style={{fontSize:15,fontWeight:600,margin:0}}>Escolhe uma cena</p>
                  </div>
                )}
              </div>

              {/* Now Playing */}
              {selected&&!vidError&&(
                <div style={{flexShrink:0}}>
                  <NowPlayingBar clip={selected} isPlaying={isPlaying} ccOn={true}/>
                </div>
              )}

              {/* SubtitleRiser — preenche todo o espaço restante */}
              <div style={{flex:1,minHeight:0,overflow:"hidden"}}>
                {transcript.length>0 ? (
                  <SubtitleRiser
                    lines={transcriptLines}
                    active={liveSubIdx >= 0 ? liveSubIdx : 0}
                    isPlaying={isPlaying}
                    onWordClick={(word,e)=>setWordPopup({word,x:e.clientX,y:e.clientY})}
                  />
                ) : (
                  /* Box estiloso sempre visível — spinner dentro quando loading */
                  <div style={{
                    height:"100%",
                    background:"linear-gradient(160deg,rgba(8,3,0,.99) 0%,rgba(38,15,2,.99) 50%,rgba(15,5,0,.99) 100%)",
                    border:"1px solid rgba(245,158,11,.22)",
                    borderRadius:20,
                    overflow:"hidden",
                    display:"flex",flexDirection:"column",
                    alignItems:"center",justifyContent:"center",gap:14,
                  }}>
                    {transLoading && selected ? (
                      <>
                        <div style={{display:"flex",alignItems:"flex-end",gap:3}}>
                          {EQ_CLS.map((cls,i)=>(
                            <div key={i} className={cls} style={{width:5,backgroundColor:EQ_COL[i],borderRadius:3,minHeight:3}} />
                          ))}
                        </div>
                        <span style={{fontSize:12,color:"rgba(245,158,11,.55)",fontWeight:600}}>A carregar legenda…</span>
                      </>
                    ) : selected ? (
                      <>
                        <span style={{fontSize:38,opacity:.35}}>🎬</span>
                        <span style={{fontSize:13,color:"rgba(245,158,11,.35)",textAlign:"center",padding:"0 24px"}}>
                          Legenda indisponível para este clip
                        </span>
                      </>
                    ) : (
                      <>
                        <span style={{fontSize:38,opacity:.25}}>🎬</span>
                        <span style={{fontSize:13,color:"rgba(245,158,11,.22)",textAlign:"center",padding:"0 24px"}}>
                          Escolhe uma cena para ver a legenda
                        </span>
                      </>
                    )}
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
