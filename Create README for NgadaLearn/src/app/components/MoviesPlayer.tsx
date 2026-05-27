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

@keyframes subIn{
  0%{opacity:0;transform:translateY(22px) scale(.94);filter:blur(6px)}
  60%{opacity:1;filter:blur(0)}
  100%{transform:translateY(0) scale(1)}
}
@keyframes subShimmer{0%{background-position:0% 50%}100%{background-position:300% 50%}}
.sub-in{animation:subIn .48s cubic-bezier(.34,1.56,.64,1) both}
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

/* ── Legendas pré-carregadas para filmes curados ──────────────── */
const MOVIE_SUBTITLES: Record<string, string> = {
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
   CINEMA SUBTITLE DISPLAY — Legenda de filme animada profissional
   ════════════════════════════════════════════════════════════════════ */
function CinemaSubDisplay({ lines, active, isPlaying }: {
  lines: string[]; active: number; isPlaying: boolean;
}) {
  if (!lines.length) return null;
  const prev = lines[active - 1];
  const curr = lines[active];
  const next = lines[active + 1];
  if (!curr) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-2xl" style={{
      background: "linear-gradient(135deg,rgba(12,5,2,.97) 0%,rgba(50,20,2,.97) 50%,rgba(20,8,2,.97) 100%)",
      border: "1px solid rgba(245,158,11,.35)",
      boxShadow: "0 0 40px rgba(180,83,9,.15), inset 0 0 60px rgba(180,83,9,.04)",
    }}>
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
        <span style={{fontSize:10,color:"rgba(245,158,11,.4)",letterSpacing:"0.08em"}}>✦ LEGENDA</span>
      </div>

      {/* Linha anterior */}
      {prev && (
        <p style={{textAlign:"center",padding:"0 24px 4px",fontSize:12,color:"rgba(255,255,255,.2)",
          fontStyle:"italic",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",position:"relative",zIndex:10}}>
          {prev}
        </p>
      )}

      {/* Linha activa */}
      <div key={`ms-${active}`} className="sub-in"
        style={{textAlign:"center",padding:`${prev?"4px":"14px"} 20px ${next?"4px":"14px"}`,position:"relative",zIndex:10}}>
        <p style={{
          fontSize:"clamp(1.05rem,2.8vw,1.55rem)",
          fontWeight:800,
          color:"#fff",
          lineHeight:1.35,
          letterSpacing:"0.02em",
          textShadow:"0 2px 30px rgba(0,0,0,.9), 0 0 50px rgba(245,158,11,.25)",
        }}>
          {curr}
        </p>
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
  const [speed,     setSpeed]     = useState<PlaybackRate>(1);
  const [ccOn,      setCcOn]      = useState(true);
  const ytPlayer       = useRef<any>(null);
  const speedRef       = useRef<PlaybackRate>(1);
  const resultsRef     = useRef<MovieClip[]>([]);
  const selectedRef    = useRef<MovieClip|null>(null);   // sempre atual — evita stale closures
  const errorTimeout   = useRef<ReturnType<typeof setTimeout>|null>(null);
  const skipTimeoutRef = useRef<ReturnType<typeof setTimeout>|null>(null);

  /* Vocabulário + Frases + Notas */
  const [vocabWord,   setVocabWord]   = useState("");
  const [vocabTrans,  setVocabTrans]  = useState("");
  const [savedVocab,  setSavedVocab]  = useState<SavedPhrase[]>([]);
  const [phraseEn,    setPhraseEn]    = useState("");
  const [phrasePt,    setPhrasePt]    = useState("");
  const [savedPhrases,setSavedPhrases] = useState<SavedPhrase[]>([]);
  const [notes,       setNotes]       = useState("");
  const [tab,         setTab]         = useState<"vocab"|"phrases"|"notes"|"subs">("vocab");
  const nextId = useRef(0);

  /* Legendas manuais animadas */
  const [subRaw,    setSubRaw]    = useState("");
  const [subLines,  setSubLines]  = useState<string[]>([]);
  const [activeSub, setActiveSub] = useState(0);

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
          cc_load_policy: ccOn ? 1 : 0,
          cc_lang_pref:   "en",
          hl:             "en",
          origin:         window.location.origin,
        },
        events: {
          onReady: (e:any) => {
            e.target.setPlaybackRate(speedRef.current);

            /* Timeout de segurança: se o vídeo não começar em 12s, avança */
            if (errorTimeout.current) clearTimeout(errorTimeout.current);
            errorTimeout.current = setTimeout(() => {
              const state = ytPlayer.current?.getPlayerState?.() ?? -1;
              /* -1=unstarted  0=ended  2=paused  3=buffering  5=cued */
              if (state === -1 || state === 5) {
                skipToNextClip();
              }
            }, 12000);
          },
          onStateChange: (e:any) => {
            setIsPlaying(e.data === 1);
            if (e.data === 1) {
              e.target.setPlaybackRate(speedRef.current);
              /* Limpar timeout: está a reproduzir com sucesso */
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

  /* ── Cleanup ─────────────────────────────────────────────────── */
  useEffect(() => () => {
    try { ytPlayer.current?.destroy(); } catch(_) {}
    if (errorTimeout.current)   clearTimeout(errorTimeout.current);
    if (skipTimeoutRef.current) clearTimeout(skipTimeoutRef.current);
  }, []);

  /* ── Velocidade ──────────────────────────────────────────────── */
  useEffect(() => {
    speedRef.current = speed;
    try { ytPlayer.current?.setPlaybackRate(speed); } catch(_) {}
  }, [speed]);

  /* ── Parse de legendas quando o texto muda ────────────────────── */
  useEffect(() => {
    const ls = subRaw.split("\n").map(l => l.trim()).filter(Boolean);
    setSubLines(ls);
    setActiveSub(0);
  }, [subRaw]);

  /* ── Navegação ← → por teclado para legendas ───────────────────── */
  useEffect(() => {
    if (!subLines.length) return;
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "TEXTAREA" || tag === "INPUT") return;
      if (e.key === "ArrowRight") setActiveSub(p => Math.min(subLines.length - 1, p + 1));
      if (e.key === "ArrowLeft")  setActiveSub(p => Math.max(0, p - 1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [subLines.length]);

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
        videoSyndicated:   "true",        // pode ser reproduzido fora do YT
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

  function tryNext() { skipToNextClip(); }

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
                    onClick={()=>{
                      setQuery(m.label);
                      searchClips(m.query);
                      /* Pré-carregar legendas icónicas se existirem */
                      const subs = MOVIE_SUBTITLES[m.label];
                      if (subs) {
                        setSubRaw(subs);
                        setActiveSub(0);
                        setTab("subs");
                      }
                    }}
                    className="w-full text-left flex items-center gap-2.5 p-2.5 rounded-lg bg-white/5 hover:bg-amber-600/20 border border-transparent hover:border-amber-500/30 transition-all">
                    <span className="text-lg flex-shrink-0">{m.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">{m.label}</p>
                      <p className="text-[10px] text-white/40 truncate">{m.tip}</p>
                    </div>
                    <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${DIFF_COLOR[m.diff]}`}>
                        {m.diff === "Iniciante" ? "A1" : m.diff === "Intermediário" ? "B1" : "C1"}
                      </span>
                      {MOVIE_SUBTITLES[m.label] && (
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 py-0.5 rounded font-bold">
                          📺 CC
                        </span>
                      )}
                    </div>
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

            {/* ✨ Legenda Animada Cinema */}
            {subLines.length > 0 && (
              <CinemaSubDisplay lines={subLines} active={activeSub} isPlaying={isPlaying} />
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
                  { id:"phrases", icon:"💬", label:"Frases" },
                  { id:"notes",   icon:"🗒️", label:"Notas" },
                  { id:"subs",    icon:"📺", label:"Legendas" },
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

                {/* ── Legendas Animadas ── */}
                {tab==="subs" && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block mb-1">
                        📋 Cola as legendas — uma frase por linha
                      </label>
                      <textarea value={subRaw} onChange={e=>setSubRaw(e.target.value)}
                        placeholder={"Life is like a box of chocolates.\nYou never know what you're gonna get.\nRun, Forrest, run!\n…"}
                        rows={7}
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/25 resize-y focus:outline-none focus:border-amber-400 font-mono leading-7 transition-colors" />
                      {subRaw && (
                        <p className="text-[10px] text-amber-400/60 mt-1">
                          ✓ {subLines.length} linhas carregadas
                        </p>
                      )}
                    </div>

                    {subLines.length > 0 && (
                      <>
                        <div className="flex items-center gap-2">
                          <button onClick={()=>setActiveSub(p=>Math.max(0,p-1))}
                            disabled={activeSub===0}
                            className="bg-white/10 hover:bg-white/20 disabled:opacity-30 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                            ← Anterior
                          </button>
                          <div className="flex-1 text-center text-xs text-amber-400/60 font-mono">
                            {activeSub+1} / {subLines.length}
                          </div>
                          <button onClick={()=>setActiveSub(p=>Math.min(subLines.length-1,p+1))}
                            disabled={activeSub>=subLines.length-1}
                            className="bg-white/10 hover:bg-white/20 disabled:opacity-30 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                            Próxima →
                          </button>
                        </div>
                        <button onClick={()=>{setSubRaw("");setSubLines([]);setActiveSub(0);}}
                          className="w-full py-1.5 bg-red-500/15 hover:bg-red-500/25 text-red-300 rounded-lg text-xs font-semibold transition-colors">
                          🗑️ Limpar Legendas
                        </button>
                        <p className="text-[11px] text-white/35 text-center">
                          💡 A legenda animada aparece acima · Use ← → ou as teclas do teclado
                        </p>
                      </>
                    )}

                    {!subRaw && (
                      <div className="text-center py-4">
                        <p className="text-xs text-white/40 mb-2">Como usar:</p>
                        <div className="space-y-1 text-[11px] text-white/30 text-left">
                          <p>1️⃣ Cola as legendas do filme (uma frase por linha)</p>
                          <p>2️⃣ A legenda animada aparece em cima do player</p>
                          <p>3️⃣ Navega com os botões ← → ou as teclas do teclado</p>
                        </div>
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
