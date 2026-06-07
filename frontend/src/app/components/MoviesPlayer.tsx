/* ════════════════════════════════════════════════════════════════════
   NgadaLearn — Movies & Series Player
   MegaEmbed API (nhdapi.com) · TMDB IDs · Catálogo curado por nível
   Interação: vocabulário, notas, quiz de frase
   ════════════════════════════════════════════════════════════════════ */

import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import {
  ChevronLeft, ChevronRight, Film, Tv, BookOpen, Pencil,
  Volume2, Star, Play, Layers, Zap, Trophy, BookMarked, Sprout,
  Check, X, RotateCcw, ExternalLink, Lightbulb, ListChecks,
} from "lucide-react";

/* ── CSS ─────────────────────────────────────────────────────────── */
const ANIM = `
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes shimCard{0%,100%{opacity:1}50%{opacity:.7}}
.fade-up{animation:fadeUp .3s ease forwards}
.card-hover:hover{transform:translateY(-4px) scale(1.02);transition:all .22s cubic-bezier(.34,1.56,.64,1)!important}
`;

/* ── Tipos ────────────────────────────────────────────────────────── */
type ContentType = "movie" | "series";
type LevelNum    = 1 | 2 | 3 | 4 | 5;

interface Content {
  tmdbId:    number;
  title:     string;
  year:      number;
  type:      ContentType;
  level:     LevelNum;
  genre:     string;
  why:       string;
  poster:    string;  // path relativo ao tmdb
  words:     {word:string; meaning:string}[];
  challenge: {phrase:string; blank:string; answer:string};
  season?:   number;
  episode?:  number;
}

interface LevelCfg {
  id:LevelNum; name:string; cefr:string; description:string;
  accent:string; bg:string; Icon: React.ElementType;
}

/* ── Configuração de Níveis ──────────────────────────────────────── */
const LEVEL_CFG: LevelCfg[] = [
  {id:1,name:"Iniciante",   cefr:"A1",  Icon:Sprout,    accent:"#4ade80",
   bg:"linear-gradient(135deg,rgba(5,46,22,.95),rgba(20,83,45,.95))",
   description:"Inglês simples, ritmo lento, vocabulário básico"},
  {id:2,name:"Elementar",   cefr:"A2",  Icon:BookMarked, accent:"#60a5fa",
   bg:"linear-gradient(135deg,rgba(12,74,110,.95),rgba(3,105,161,.95))",
   description:"Frases curtas, temas do quotidiano, pronúncia clara"},
  {id:3,name:"Intermédio",  cefr:"B1",  Icon:Layers,    accent:"#a78bfa",
   bg:"linear-gradient(135deg,rgba(76,29,149,.95),rgba(109,40,217,.95))",
   description:"Vocabulário variado, expressões idiomáticas"},
  {id:4,name:"Avançado",    cefr:"B2",  Icon:Zap,        accent:"#fb923c",
   bg:"linear-gradient(135deg,rgba(124,45,18,.95),rgba(194,65,12,.95))",
   description:"Ritmo rápido, gírias, linguagem técnica"},
  {id:5,name:"Fluente",     cefr:"C1+", Icon:Trophy,     accent:"#fbbf24",
   bg:"linear-gradient(135deg,rgba(133,77,14,.95),rgba(202,138,4,.95))",
   description:"Inglês nativo, complexidade total"},
];

/* ── Catálogo curado de filmes e séries ──────────────────────────── */
const CATALOG: Content[] = [
  /* ── A1 ── */
  {
    tmdbId:12, title:"Finding Nemo", year:2003, type:"movie", level:1,
    genre:"Animação", poster:"/eHuGQ10FUzK1mdOY69wF5pGgEf5.jpg",
    why:"Vocabulário oceânico simples, fala clara e devagar",
    words:[
      {word:"clownfish",   meaning:"peixe-palhaço"},
      {word:"current",     meaning:"corrente (de água)"},
      {word:"beyond",      meaning:"para além de"},
      {word:"afraid",      meaning:"com medo"},
      {word:"adventure",   meaning:"aventura"},
    ],
    challenge:{phrase:"Just keep ___, just keep swimming",blank:"swimming",answer:"swimming"},
  },
  {
    tmdbId:862, title:"Toy Story", year:1995, type:"movie", level:1,
    genre:"Animação", poster:"/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg",
    why:"Inglês americano claro, frases curtas e repetitivas",
    words:[
      {word:"infinity",    meaning:"infinito"},
      {word:"jealous",     meaning:"com ciúmes"},
      {word:"pretend",     meaning:"fingir"},
      {word:"mission",     meaning:"missão"},
      {word:"rescue",      meaning:"resgatar"},
    ],
    challenge:{phrase:"To infinity and ___",blank:"beyond",answer:"beyond"},
  },
  {
    tmdbId:8587, title:"The Lion King", year:1994, type:"movie", level:1,
    genre:"Animação", poster:"/sIGtuAIuIIBqOdQyLKGj9F6Q7gg.jpg",
    why:"Diálogo musical, vocabulário de natureza e família",
    words:[
      {word:"kingdom",     meaning:"reino"},
      {word:"pride",       meaning:"orgulho / manada"},
      {word:"destiny",     meaning:"destino"},
      {word:"remember",    meaning:"lembrar"},
      {word:"worthy",      meaning:"digno"},
    ],
    challenge:{phrase:"Hakuna ___, it means no worries",blank:"Matata",answer:"Matata"},
  },
  {
    tmdbId:771, title:"Home Alone", year:1990, type:"movie", level:1,
    genre:"Comédia", poster:"/onTSipSTHNPGMBdkBFJHFblrGkm.jpg",
    why:"Inglês americano simples e engraçado, vocabulário doméstico",
    words:[
      {word:"burglar",     meaning:"ladrão / assaltante"},
      {word:"trap",        meaning:"armadilha"},
      {word:"basement",    meaning:"cave / rés-do-chão"},
      {word:"pizza",       meaning:"pizza"},
      {word:"cheese",      meaning:"queijo"},
    ],
    challenge:{phrase:"Keep the change, ya filthy ___",blank:"animal",answer:"animal"},
  },
  {
    tmdbId:10193, title:"Toy Story 3", year:2010, type:"movie", level:1,
    genre:"Animação", poster:"/AbbXmaGLgtBDtaEMxnQFBYhxMi2.jpg",
    why:"Vocabulário de amizade e crescimento, frases simples",
    words:[
      {word:"daycare",     meaning:"jardim de infância"},
      {word:"donate",      meaning:"doar"},
      {word:"escape",      meaning:"escapar / fuga"},
      {word:"friendship",  meaning:"amizade"},
      {word:"together",    meaning:"juntos"},
    ],
    challenge:{phrase:"You've got a friend in ___",blank:"me",answer:"me"},
  },
  {
    tmdbId:585, title:"Monsters, Inc.", year:2001, type:"movie", level:1,
    genre:"Animação", poster:"/sgheSKxZkttIe8ONtUGFEKPu4bT.jpg",
    why:"Vocabulário de trabalho e amizade, Inglês claro e divertido",
    words:[
      {word:"monster",     meaning:"monstro"},
      {word:"scream",      meaning:"grito / gritar"},
      {word:"factory",     meaning:"fábrica"},
      {word:"laugh",       meaning:"rir / gargalhada"},
      {word:"banish",      meaning:"banir / expulsar"},
    ],
    challenge:{phrase:"We ___ them laugh",blank:"make",answer:"make"},
  },
  {
    tmdbId:920, title:"Cars", year:2006, type:"movie", level:1,
    genre:"Animação", poster:"/o3IIeKKLWEDMRfBtDoBf7gzuDHe.jpg",
    why:"Vocabulário de corridas, amizade e trabalho em equipa",
    words:[
      {word:"race",        meaning:"corrida"},
      {word:"champion",    meaning:"campeão"},
      {word:"pit stop",    meaning:"paragem nos boxes"},
      {word:"shortcut",    meaning:"atalho"},
      {word:"victory",     meaning:"vitória"},
    ],
    challenge:{phrase:"Ka-___!",blank:"chow",answer:"chow"},
  },
  /* ── A2 ── */
  {
    tmdbId:13, title:"Forrest Gump", year:1994, type:"movie", level:2,
    genre:"Drama", poster:"/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    why:"Narração americana simples, ritmo calmo e vocabulário acessível",
    words:[
      {word:"stupid",       meaning:"estúpido / tolo"},
      {word:"shrimp",       meaning:"camarão"},
      {word:"lieutenant",   meaning:"tenente"},
      {word:"grateful",     meaning:"grato"},
      {word:"destiny",      meaning:"destino"},
    ],
    challenge:{phrase:"Life is like a box of ___",blank:"chocolates",answer:"chocolates"},
  },
  {
    tmdbId:1402, title:"The Pursuit of Happyness", year:2006, type:"movie", level:2,
    genre:"Drama", poster:"/2a3QvH7sMBWRnzqRRPGkRpvNpY5.jpg",
    why:"Inglês emocional e motivacional, muito acessível",
    words:[
      {word:"happiness",    meaning:"felicidade"},
      {word:"internship",   meaning:"estágio"},
      {word:"struggle",     meaning:"luta / dificuldade"},
      {word:"determined",   meaning:"determinado"},
      {word:"opportunity",  meaning:"oportunidade"},
    ],
    challenge:{phrase:"Don't ever let somebody tell you you can't do ___",blank:"something",answer:"something"},
  },
  {
    tmdbId:434, title:"Cast Away", year:2000, type:"movie", level:2,
    genre:"Drama", poster:"/xmbU4JTUm4JFlxNxBLaEyfBbdg6.jpg",
    why:"Quase sem diálogo — ideal para focar em inglês básico quando fala",
    words:[
      {word:"survive",     meaning:"sobreviver"},
      {word:"island",      meaning:"ilha"},
      {word:"rescue",      meaning:"resgate"},
      {word:"lonely",      meaning:"solitário"},
      {word:"package",     meaning:"encomenda / pacote"},
    ],
    challenge:{phrase:"Wilson! I'm sorry, ___!",blank:"Wilson",answer:"Wilson"},
  },
  {
    tmdbId:9593, title:"The Green Mile", year:1999, type:"movie", level:2,
    genre:"Drama", poster:"/velWPhVi4vLLZFxdh8UvChGG2I6.jpg",
    why:"Inglês americano do Sul, discurso lento e claro",
    words:[
      {word:"miracle",     meaning:"milagre"},
      {word:"innocent",    meaning:"inocente"},
      {word:"guard",       meaning:"guarda"},
      {word:"death row",   meaning:"corredor da morte"},
      {word:"exhausted",   meaning:"exausto"},
    ],
    challenge:{phrase:"I'm tired, boss. Mostly I'm tired of people being ___",blank:"ugly",answer:"ugly"},
  },
  {
    tmdbId:671, title:"Harry Potter and the Sorcerer's Stone", year:2001, type:"movie", level:2,
    genre:"Fantasia", poster:"/wuMc08IPKEatf9rnMNXvIDxqP4W.jpg",
    why:"Britânico claro, vocabulário mágico, ideal para A2",
    words:[
      {word:"wizard",      meaning:"feiticeiro"},
      {word:"spell",       meaning:"feitiço / soletrar"},
      {word:"muggle",      meaning:"não-mágico"},
      {word:"forbidden",   meaning:"proibido"},
      {word:"wand",        meaning:"varinha"},
    ],
    challenge:{phrase:"You're a ___, Harry",blank:"wizard",answer:"wizard"},
  },
  {
    tmdbId:1668, title:"Friends", year:1994, type:"series", level:2,
    genre:"Comédia", poster:"/f496cm9enuEsZkSPzCwnTESEK5s.jpg",
    why:"Inglês americano do dia-a-dia, expressões coloquiais fundamentais",
    words:[
      {word:"apartment",    meaning:"apartamento"},
      {word:"sarcastic",    meaning:"sarcástico"},
      {word:"awkward",      meaning:"constrangedor"},
      {word:"dating",       meaning:"namorar / sair com"},
      {word:"break up",     meaning:"separar"},
    ],
    challenge:{phrase:"We were on a ___",blank:"break",answer:"break"},
    season:1, episode:1,
  },
  {
    tmdbId:1100, title:"How I Met Your Mother", year:2005, type:"series", level:2,
    genre:"Comédia", poster:"/b34jPzmB0wZy7EjUZoleXOl2RRI.jpg",
    why:"Inglês urbano americano, histórias e narrativa acessível",
    words:[
      {word:"legendary",   meaning:"lendário"},
      {word:"suit up",     meaning:"colocar o fato"},
      {word:"ted talk",    meaning:"palestra do Ted"},
      {word:"slap bet",    meaning:"aposta de bofetada"},
      {word:"narrator",    meaning:"narrador"},
    ],
    challenge:{phrase:"It's going to be ___",blank:"legendary",answer:"legendary"},
    season:1, episode:1,
  },
  /* ── B1 ── */
  {
    tmdbId:207, title:"Dead Poets Society", year:1989, type:"movie", level:3,
    genre:"Drama", poster:"/ztVe0LZROA9SNX7jGMiJMZBWHFj.jpg",
    why:"Vocabulário literário, discursos motivacionais em inglês clássico",
    words:[
      {word:"seize",        meaning:"aproveitar / agarrar"},
      {word:"carpe diem",   meaning:"aproveita o dia"},
      {word:"conformity",   meaning:"conformidade"},
      {word:"passion",      meaning:"paixão"},
      {word:"verse",        meaning:"verso (poesia)"},
    ],
    challenge:{phrase:"___ the day, make your lives extraordinary",blank:"Seize",answer:"Seize"},
  },
  {
    tmdbId:155, title:"The Dark Knight", year:2008, type:"movie", level:3,
    genre:"Acção", poster:"/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    why:"Inglês urbano e intenso, vocabulário de crime e caos",
    words:[
      {word:"chaos",        meaning:"caos"},
      {word:"scheme",       meaning:"plano / esquema"},
      {word:"anarchist",    meaning:"anarquista"},
      {word:"terrify",      meaning:"aterrorizar"},
      {word:"corrupt",      meaning:"corrompido"},
    ],
    challenge:{phrase:"Why so ___?",blank:"serious",answer:"serious"},
  },
  {
    tmdbId:603, title:"The Matrix", year:1999, type:"movie", level:3,
    genre:"Sci-Fi", poster:"/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    why:"Inglês filosófico e técnico, diálogos icónicos",
    words:[
      {word:"simulation",  meaning:"simulação"},
      {word:"construct",   meaning:"construção / conceito"},
      {word:"pill",        meaning:"pílula / comprimido"},
      {word:"reality",     meaning:"realidade"},
      {word:"choice",      meaning:"escolha"},
    ],
    challenge:{phrase:"There is no ___",blank:"spoon",answer:"spoon"},
  },
  {
    tmdbId:1726, title:"Iron Man", year:2008, type:"movie", level:3,
    genre:"Acção", poster:"/78lPtwv72eTNqFW9COBF8l34ykC.jpg",
    why:"Inglês técnico e humorístico, vocabulário de engenharia",
    words:[
      {word:"genius",      meaning:"génio"},
      {word:"billionaire", meaning:"milionário"},
      {word:"armor",       meaning:"armadura"},
      {word:"arc reactor", meaning:"reator de arco"},
      {word:"prototype",   meaning:"protótipo"},
    ],
    challenge:{phrase:"I am ___",blank:"Iron Man",answer:"Iron Man"},
  },
  {
    tmdbId:453, title:"A Beautiful Mind", year:2001, type:"movie", level:3,
    genre:"Drama", poster:"/zwzWCmH72OSC9NA0ipoqynmMToy.jpg",
    why:"Vocabulário matemático e psicológico, inglês académico",
    words:[
      {word:"equation",    meaning:"equação"},
      {word:"delusion",    meaning:"ilusão / delírio"},
      {word:"hallucination",meaning:"alucinação"},
      {word:"paranoia",    meaning:"paranoia"},
      {word:"breakthrough",meaning:"avanço / descoberta"},
    ],
    challenge:{phrase:"Find a truly original idea. It is the only way I will ever ___",blank:"distinguish myself",answer:"distinguish myself"},
  },
  {
    tmdbId:68718, title:"Django Unchained", year:2012, type:"movie", level:3,
    genre:"Western", poster:"/2oZklIzUbvZXXzIFzv7Hi68d6xf.jpg",
    why:"Inglês americano do século XIX, linguagem expressiva",
    words:[
      {word:"bounty",      meaning:"recompensa"},
      {word:"plantation",  meaning:"fazenda / plantação"},
      {word:"freedom",     meaning:"liberdade"},
      {word:"sheriff",     meaning:"xerife"},
      {word:"saloon",      meaning:"saloon / taberna"},
    ],
    challenge:{phrase:"D-J-A-N-G-O. The D is ___",blank:"silent",answer:"silent"},
  },
  {
    tmdbId:2316, title:"The Office", year:2005, type:"series", level:3,
    genre:"Comédia", poster:"/7DJKHzAi83BmQrWLrYYOqcoKfhR.jpg",
    why:"Humor de escritório americano, expressões do trabalho",
    words:[
      {word:"conference",   meaning:"conferência / reunião"},
      {word:"awkward",      meaning:"constrangedor"},
      {word:"prank",        meaning:"partida / brincadeira"},
      {word:"redundant",    meaning:"redundante / dispensável"},
      {word:"acknowledge",  meaning:"reconhecer"},
    ],
    challenge:{phrase:"That's what ___ said",blank:"she",answer:"she"},
    season:1, episode:1,
  },
  /* ── B2 ── */
  {
    tmdbId:37799, title:"The Social Network", year:2010, type:"movie", level:4,
    genre:"Drama", poster:"/n0ybibhJtQ5icDqTp8eRytcIHso.jpg",
    why:"Inglês rápido e técnico, diálogos de negócios e tecnologia",
    words:[
      {word:"algorithm",    meaning:"algoritmo"},
      {word:"exclusive",    meaning:"exclusivo"},
      {word:"deposition",   meaning:"depoimento legal"},
      {word:"billion",      meaning:"mil milhões"},
      {word:"venture",      meaning:"empreendimento / risco"},
    ],
    challenge:{phrase:"A million dollars isn't cool. You know what's cool? A ___ dollars",blank:"billion",answer:"billion"},
  },
  {
    tmdbId:489, title:"Good Will Hunting", year:1997, type:"movie", level:4,
    genre:"Drama", poster:"/bABCql57wKWTKiO5PCFdZGm0CYJ.jpg",
    why:"Inglês de Boston, diálogos emocionais profundos e inteligentes",
    words:[
      {word:"therapist",    meaning:"terapeuta"},
      {word:"prodigy",      meaning:"prodígio"},
      {word:"obligation",   meaning:"obrigação"},
      {word:"brilliant",    meaning:"brilhante"},
      {word:"potential",    meaning:"potencial"},
    ],
    challenge:{phrase:"It's not your ___",blank:"fault",answer:"fault"},
  },
  {
    tmdbId:77338, title:"The Imitation Game", year:2014, type:"movie", level:4,
    genre:"Drama", poster:"/zSqJ1qFq8NXFfi7JeIYMlzyR0dx.jpg",
    why:"Inglês britânico técnico, vocabulário de lógica e matemática",
    words:[
      {word:"cipher",      meaning:"cifra / código"},
      {word:"decrypt",     meaning:"decifrar"},
      {word:"enigma",      meaning:"enigma"},
      {word:"peculiar",    meaning:"peculiar / estranho"},
      {word:"algorithm",   meaning:"algoritmo"},
    ],
    challenge:{phrase:"Sometimes it is the people no one imagines anything of who do the things that no one can ___",blank:"imagine",answer:"imagine"},
  },
  {
    tmdbId:118340, title:"Guardians of the Galaxy", year:2014, type:"movie", level:4,
    genre:"Acção", poster:"/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg",
    why:"Inglês americano informal com humor e gírias",
    words:[
      {word:"outlaw",      meaning:"fora da lei"},
      {word:"galaxy",      meaning:"galáxia"},
      {word:"notorious",   meaning:"notório / famoso"},
      {word:"orb",         meaning:"orbe / esfera"},
      {word:"raccoon",     meaning:"guaxinim"},
    ],
    challenge:{phrase:"I am ___",blank:"Groot",answer:"Groot"},
  },
  {
    tmdbId:680, title:"Pulp Fiction", year:1994, type:"movie", level:4,
    genre:"Drama", poster:"/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    why:"Inglês americano não-linear, diálogos intensos e vocabulário de rua",
    words:[
      {word:"briefcase",   meaning:"mala de executivo"},
      {word:"royale",      meaning:"real / luxuoso"},
      {word:"overdose",    meaning:"overdose"},
      {word:"adrenaline",  meaning:"adrenalina"},
      {word:"quarter pounder",meaning:"hambúrguer de quartel de libra"},
    ],
    challenge:{phrase:"Say ___ again. I dare you.",blank:"what",answer:"what"},
  },
  {
    tmdbId:66732, title:"Stranger Things", year:2016, type:"series", level:4,
    genre:"Sci-Fi", poster:"/x2LSRK2Cm7MZhjluni1msVJ3wDh.jpg",
    why:"Inglês americano dos anos 80, vocabulário de aventura e mistério",
    words:[
      {word:"demogorgon",  meaning:"demogorgon (criatura)"},
      {word:"upside down", meaning:"mundo invertido"},
      {word:"psychic",     meaning:"psíquico / telecinético"},
      {word:"supernatural",meaning:"sobrenatural"},
      {word:"laboratory",  meaning:"laboratório"},
    ],
    challenge:{phrase:"___ is pretty fun",blank:"Eleven",answer:"Eleven"},
    season:1, episode:1,
  },
  {
    tmdbId:1396, title:"Breaking Bad", year:2008, type:"series", level:4,
    genre:"Drama", poster:"/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    why:"Inglês americano complexo, personagens com vocabulário variado",
    words:[
      {word:"meth",         meaning:"metanfetamina"},
      {word:"territory",    meaning:"território"},
      {word:"chemistry",    meaning:"química"},
      {word:"empire",       meaning:"império"},
      {word:"consequence",  meaning:"consequência"},
    ],
    challenge:{phrase:"I am the one who ___",blank:"knocks",answer:"knocks"},
    season:1, episode:1,
  },
  /* ── C1+ ── */
  {
    tmdbId:49026, title:"The Dark Knight Rises", year:2012, type:"movie", level:5,
    genre:"Acção", poster:"/pGhRnOwqaTJGUBbLDcfKnPc6GEo.jpg",
    why:"Inglês político e filosófico complexo, discursos elaborados",
    words:[
      {word:"uprising",    meaning:"revolta / levantamento"},
      {word:"reckoning",   meaning:"ajuste de contas / destino"},
      {word:"resilience",  meaning:"resiliência"},
      {word:"oppression",  meaning:"opressão"},
      {word:"legacy",      meaning:"legado"},
    ],
    challenge:{phrase:"A hero can be anyone. Even a man doing something as simple and reassuring as putting a coat around a little ___'s shoulders",blank:"boy",answer:"boy"},
  },
  {
    tmdbId:62, title:"2001: A Space Odyssey", year:1968, type:"movie", level:5,
    genre:"Sci-Fi", poster:"/ve72VxNqjIX9Q3QMuqRKjS0yrbm.jpg",
    why:"Inglês clássico e filosófico, vocabulário científico do mais elevado nível",
    words:[
      {word:"monolith",    meaning:"monólito"},
      {word:"consciousness",meaning:"consciência"},
      {word:"evolution",   meaning:"evolução"},
      {word:"artificial",  meaning:"artificial"},
      {word:"malfunction", meaning:"avaria / mau funcionamento"},
    ],
    challenge:{phrase:"I'm sorry Dave, I'm afraid I can't do ___",blank:"that",answer:"that"},
  },
  {
    tmdbId:238, title:"The Godfather", year:1972, type:"movie", level:5,
    genre:"Drama", poster:"/3bhkrj58Vtu7enYsLe1rjPU4PaE.jpg",
    why:"Inglês italiano-americano, expressões de poder e mafia",
    words:[
      {word:"offer",       meaning:"oferta / proposta"},
      {word:"consigliere", meaning:"conselheiro"},
      {word:"vendetta",    meaning:"vingança"},
      {word:"loyalty",     meaning:"lealdade"},
      {word:"omertà",      meaning:"lei do silêncio"},
    ],
    challenge:{phrase:"I'm gonna make him an offer he can't ___",blank:"refuse",answer:"refuse"},
  },
  {
    tmdbId:424, title:"Schindler's List", year:1993, type:"movie", level:5,
    genre:"Drama", poster:"/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
    why:"Inglês histórico formal, vocabulário da Segunda Guerra Mundial",
    words:[
      {word:"factory",     meaning:"fábrica"},
      {word:"enamelware",  meaning:"louça esmaltada"},
      {word:"persecution", meaning:"perseguição"},
      {word:"compassion",  meaning:"compaixão"},
      {word:"salvation",   meaning:"salvação"},
    ],
    challenge:{phrase:"Whoever saves one life, saves the ___",blank:"world entire",answer:"world entire"},
  },
  {
    tmdbId:1399, title:"Game of Thrones", year:2011, type:"series", level:5,
    genre:"Fantasia", poster:"/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg",
    why:"Inglês medieval formal, vocabulário político e de guerra",
    words:[
      {word:"throne",      meaning:"trono"},
      {word:"realm",       meaning:"reino"},
      {word:"siege",       meaning:"cerco / assédio"},
      {word:"oath",        meaning:"juramento"},
      {word:"bastard",     meaning:"bastardo"},
    ],
    challenge:{phrase:"When you play the game of thrones, you win or you ___",blank:"die",answer:"die"},
    season:1, episode:1,
  },
  {
    tmdbId:27205, title:"Inception", year:2010, type:"movie", level:5,
    genre:"Sci-Fi", poster:"/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    why:"Vocabulário filosófico denso, conceitos complexos em inglês",
    words:[
      {word:"subconscious",  meaning:"subconsciente"},
      {word:"inception",     meaning:"implantação de ideia"},
      {word:"limbo",         meaning:"limbo / estado indefinido"},
      {word:"perception",    meaning:"percepção"},
      {word:"paradox",       meaning:"paradoxo"},
    ],
    challenge:{phrase:"You're waiting for a ___",blank:"train",answer:"train"},
  },
  {
    tmdbId:157336, title:"Interstellar", year:2014, type:"movie", level:5,
    genre:"Sci-Fi", poster:"/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    why:"Inglês científico e emocional de alto nível",
    words:[
      {word:"relativity",   meaning:"relatividade"},
      {word:"wormhole",     meaning:"buraco de minhoca"},
      {word:"gravitational",meaning:"gravitacional"},
      {word:"dimension",    meaning:"dimensão"},
      {word:"tesseract",    meaning:"hipercubo 4D"},
    ],
    challenge:{phrase:"Do not go gentle into that good ___",blank:"night",answer:"night"},
  },
];

const TMDB_IMG = "https://image.tmdb.org/t/p/w342";
const EMBED_MOVIE  = (id:number) => `https://nhdapi.com/embed/movie/${id}`;
const EMBED_SERIES = (id:number, s:number, e:number) => `https://nhdapi.com/embed/tv/${id}/${s}/${e}`;

/* ════════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ════════════════════════════════════════════════════════════════════ */
export function MoviesPlayer() {
  const [selectedLevel,   setSelectedLevel]   = useState<LevelCfg|null>(null);
  const [selectedContent, setSelectedContent] = useState<Content|null>(null);
  const [tab,             setTab]             = useState<"movie"|"series">("movie");
  const [isMobile,        setIsMobile]        = useState(()=>window.innerWidth<1024);
  const [panelTab,        setPanelTab]        = useState<"words"|"notes"|"quiz">("words");
  const [note,            setNote]            = useState("");
  const [quizInput,       setQuizInput]       = useState("");
  const [quizStatus,      setQuizStatus]      = useState<"idle"|"correct"|"wrong">("idle");
  const [knownWords,      setKnownWords]      = useState<Set<string>>(new Set());
  const [posterErrors,    setPosterErrors]    = useState<Set<number>>(new Set());

  useEffect(()=>{
    const h=()=>setIsMobile(window.innerWidth<1024);
    window.addEventListener("resize",h); return ()=>window.removeEventListener("resize",h);
  },[]);

  const filtered = CATALOG.filter(c=>
    selectedLevel ? c.level===selectedLevel.id && c.type===tab : false
  );

  const embedSrc = selectedContent
    ? selectedContent.type==="movie"
      ? EMBED_MOVIE(selectedContent.tmdbId)
      : EMBED_SERIES(selectedContent.tmdbId, selectedContent.season??1, selectedContent.episode??1)
    : "";

  function submitQuiz(){
    if (!selectedContent||quizStatus!=="idle"||!quizInput.trim()) return;
    const ok = quizInput.trim().toLowerCase()===selectedContent.challenge.answer.toLowerCase();
    setQuizStatus(ok?"correct":"wrong");
    setTimeout(()=>{setQuizStatus("idle");if(ok)setQuizInput("");},1500);
  }

  const levelColor = selectedLevel?.accent || "#a855f7";

  /* ══════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════ */
  return (
    <>
      <style>{ANIM}</style>
      <div style={{display:"flex",flexDirection:"column",height:"100dvh",
        background:"linear-gradient(160deg,#070614 0%,#130825 45%,#0a0415 100%)",
        color:"#fff",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
        paddingBottom:"env(safe-area-inset-bottom)"}}>

        {/* ── Header ── */}
        <div style={{flexShrink:0,paddingTop:"env(safe-area-inset-top)",
          background:"rgba(0,0,0,.8)",backdropFilter:"blur(24px)",
          borderBottom:"1px solid rgba(255,255,255,.06)"}}>
          <div style={{height:52,display:"flex",alignItems:"center",padding:"0 12px",gap:10}}>
            <Link to="/lessons" style={{display:"flex",alignItems:"center",justifyContent:"center",
              width:38,height:38,borderRadius:"50%",flexShrink:0,
              color:"rgba(255,255,255,.8)",textDecoration:"none",
              background:"rgba(255,255,255,.09)",border:"1px solid rgba(255,255,255,.12)",
              boxShadow:"0 2px 10px rgba(0,0,0,.4)"}}>
              <ChevronLeft size={18} strokeWidth={2.5}/>
            </Link>

            <div style={{flex:1,display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:28,height:28,borderRadius:8,
                background:"linear-gradient(135deg,#a855f7,#7c3aed)",
                display:"flex",alignItems:"center",justifyContent:"center",
                boxShadow:"0 2px 10px rgba(168,85,247,.4)",flexShrink:0}}>
                <Film size={14} color="#fff" strokeWidth={2.5}/>
              </div>
              <span style={{fontSize:isMobile?13:14,fontWeight:900,letterSpacing:"-.3px"}}>
                Filmes · Inglês
              </span>
              {selectedLevel&&(
                <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:50,
                  background:`${selectedLevel.accent}20`,color:selectedLevel.accent,
                  border:`1px solid ${selectedLevel.accent}40`}}>
                  {selectedLevel.cefr}
                </span>
              )}
            </div>

            {selectedLevel&&selectedContent&&(
              <button onClick={()=>setSelectedContent(null)}
                style={{background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.12)",
                  borderRadius:50,padding:"5px 12px",fontSize:11,fontWeight:700,
                  color:"rgba(255,255,255,.7)",cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>
                ← Catálogo
              </button>
            )}
            {selectedLevel&&!selectedContent&&(
              <button onClick={()=>setSelectedLevel(null)}
                style={{background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.12)",
                  borderRadius:50,padding:"5px 12px",fontSize:11,fontWeight:700,
                  color:"rgba(255,255,255,.7)",cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>
                ← Níveis
              </button>
            )}
          </div>
        </div>

        {/* ── Conteúdo ── */}
        <div style={{flex:1,overflow:"auto"}}>

          {/* ── Selecção de Nível ── */}
          {!selectedLevel && (
            <div style={{maxWidth:600,margin:"0 auto",padding:"20px 16px 32px"}}>
              <div style={{textAlign:"center",marginBottom:24}}>
                <div style={{fontSize:48,marginBottom:10}}>🎬</div>
                <h2 style={{margin:0,fontSize:"clamp(1.2rem,3vw,1.6rem)",fontWeight:900}}>
                  Aprende Inglês com Filmes
                </h2>
                <p style={{margin:"8px 0 0",fontSize:13,color:"rgba(255,255,255,.4)"}}>
                  Filmes e séries reais com legendas em inglês
                </p>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {LEVEL_CFG.map(lv=>{
                  const count = CATALOG.filter(c=>c.level===lv.id).length;
                  return (
                    <button key={lv.id} className="card-hover"
                      onClick={()=>{setSelectedLevel(lv);setSelectedContent(null);}}
                      style={{background:lv.bg,border:`1.5px solid ${lv.accent}35`,
                        borderRadius:20,padding:"14px 18px",cursor:"pointer",textAlign:"left",
                        color:"#fff",fontFamily:"inherit",display:"flex",alignItems:"center",gap:14,
                        boxShadow:"0 4px 16px rgba(0,0,0,.35)",transition:"all .22s"}}>
                      <div style={{width:44,height:44,borderRadius:12,
                        background:`${lv.accent}20`,border:`1.5px solid ${lv.accent}40`,
                        display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
                        boxShadow:`0 2px 12px ${lv.accent}25`}}>
                        <lv.Icon size={20} color={lv.accent} strokeWidth={2}/>
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <p style={{margin:0,fontSize:15,fontWeight:900}}>
                          {lv.name}
                          <span style={{marginLeft:8,fontSize:10,fontWeight:700,
                            color:lv.accent,background:`${lv.accent}18`,
                            borderRadius:50,padding:"1px 7px"}}>{lv.cefr}</span>
                        </p>
                        <p style={{margin:"3px 0 0",fontSize:11,color:"rgba(255,255,255,.5)"}}>{lv.description}</p>
                        <p style={{margin:"4px 0 0",fontSize:10,color:lv.accent}}>
                          {count} títulos disponíveis
                        </p>
                      </div>
                      <ChevronRight size={18} color={lv.accent} strokeWidth={2.5} style={{flexShrink:0,opacity:.6}}/>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Catálogo do nível ── */}
          {selectedLevel && !selectedContent && (
            <div style={{maxWidth:900,margin:"0 auto",padding:"16px"}}>

              {/* Tabs Filmes / Séries */}
              <div style={{display:"flex",gap:4,marginBottom:16,
                background:"rgba(255,255,255,.06)",borderRadius:50,padding:4,
                width:"fit-content",border:"1px solid rgba(255,255,255,.1)"}}>
                {([
                  {t:"movie"  as const, Icon:Film,  label:"Filmes"},
                  {t:"series" as const, Icon:Tv,    label:"Séries"},
                ]).map(({t,Icon,label})=>(
                  <button key={t} onClick={()=>setTab(t)}
                    style={{background:tab===t?`linear-gradient(135deg,${levelColor}cc,${levelColor}88)`:"transparent",
                      border:"none",borderRadius:50,padding:"7px 18px",
                      display:"flex",alignItems:"center",gap:6,
                      fontSize:12,fontWeight:700,color:tab===t?"#fff":"rgba(255,255,255,.45)",
                      cursor:"pointer",fontFamily:"inherit",
                      boxShadow:tab===t?"0 2px 10px rgba(0,0,0,.3)":"none",transition:"all .2s"}}>
                    <Icon size={13} strokeWidth={2.5}/>{label}
                  </button>
                ))}
              </div>

              {filtered.length===0 ? (
                <div style={{textAlign:"center",padding:"48px 0",color:"rgba(255,255,255,.25)"}}>
                  <Tv size={48} style={{marginBottom:12,opacity:.4}}/>
                  <p style={{margin:0,fontSize:14}}>
                    Sem {tab==="movie"?"filmes":"séries"} para este nível ainda.
                  </p>
                </div>
              ) : (
                <div style={{display:"grid",
                  gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",
                  gap:14}}>
                  {filtered.map(c=>(
                    <button key={c.tmdbId} className="card-hover"
                      onClick={()=>setSelectedContent(c)}
                      style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",
                        borderRadius:16,overflow:"hidden",cursor:"pointer",
                        textAlign:"left",color:"#fff",fontFamily:"inherit",padding:0,
                        boxShadow:"0 4px 16px rgba(0,0,0,.3)",transition:"all .22s"}}>
                      {/* Poster */}
                      <div style={{position:"relative",paddingTop:"150%",background:"#1a0a30"}}>
                        {!posterErrors.has(c.tmdbId) ? (
                          <img src={`${TMDB_IMG}${c.poster}`} alt={c.title}
                            onError={()=>setPosterErrors(s=>new Set([...s,c.tmdbId]))}
                            style={{position:"absolute",inset:0,width:"100%",height:"100%",
                              objectFit:"cover",display:"block"}}/>
                        ) : (
                          <div style={{position:"absolute",inset:0,display:"flex",
                            flexDirection:"column",alignItems:"center",justifyContent:"center",
                            gap:8,opacity:.4}}>
                            <Film size={32} color={levelColor}/>
                            <span style={{fontSize:11,color:levelColor,textAlign:"center",
                              padding:"0 8px"}}>{c.title}</span>
                          </div>
                        )}
                        {/* Badge tipo */}
                        <div style={{position:"absolute",top:6,left:6,
                          background:"rgba(0,0,0,.75)",borderRadius:50,
                          padding:"2px 8px",fontSize:9,fontWeight:700,
                          display:"flex",alignItems:"center",gap:3,backdropFilter:"blur(6px)"}}>
                          {c.type==="series"?<Tv size={9}/>:<Film size={9}/>}
                          {c.type==="series"?"Série":"Filme"}
                        </div>
                        {/* Overlay play */}
                        <div style={{position:"absolute",inset:0,
                          background:"linear-gradient(to top,rgba(0,0,0,.9) 0%,transparent 60%)",
                          display:"flex",alignItems:"flex-end",padding:8}}>
                          <div style={{width:32,height:32,borderRadius:"50%",
                            background:levelColor,display:"flex",alignItems:"center",
                            justifyContent:"center",boxShadow:`0 2px 10px ${levelColor}60`}}>
                            <Play size={14} color="#000" strokeWidth={3} fill="#000"/>
                          </div>
                        </div>
                      </div>
                      {/* Info */}
                      <div style={{padding:"10px 10px 12px"}}>
                        <p style={{margin:0,fontSize:12,fontWeight:800,
                          overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                          {c.title}
                        </p>
                        <p style={{margin:"3px 0 0",fontSize:10,color:"rgba(255,255,255,.4)"}}>
                          {c.year} · {c.genre}
                        </p>
                        <p style={{margin:"5px 0 0",fontSize:9,color:levelColor,
                          lineHeight:1.4,overflow:"hidden",
                          display:"-webkit-box",WebkitLineClamp:2,
                          WebkitBoxOrient:"vertical" as any}}>
                          {c.why}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Player ── */}
          {selectedLevel && selectedContent && (
            <div style={{display:"flex",flexDirection:isMobile?"column":"row",
              height:isMobile?"auto":"calc(100dvh - 52px - env(safe-area-inset-top))",
              overflow:isMobile?"auto":"hidden"}}>

              {/* Coluna do player */}
              <div style={{flex:isMobile?undefined:1,display:"flex",flexDirection:"column",
                minWidth:0,overflow:"hidden"}}>

                {/* Embed iframe */}
                <div style={{flexShrink:0,aspectRatio:"16/9",background:"#000",
                  maxHeight:isMobile?"56vw":"60vh"}}>
                  <iframe key={selectedContent.tmdbId}
                    src={embedSrc}
                    width="100%" height="100%"
                    allowFullScreen allow="autoplay; encrypted-media; picture-in-picture"
                    style={{border:0,display:"block"}}
                    title={selectedContent.title}
                  />
                </div>

                {/* Info do filme */}
                <div style={{flexShrink:0,padding:"12px 16px",
                  background:"linear-gradient(180deg,rgba(0,0,0,.6) 0%,transparent 100%)",
                  display:"flex",alignItems:"center",gap:12}}>
                  {/* Poster pequeno */}
                  <img src={`${TMDB_IMG}${selectedContent.poster}`} alt=""
                    style={{width:42,height:62,borderRadius:6,objectFit:"cover",
                      flexShrink:0,boxShadow:"0 4px 14px rgba(0,0,0,.6)"}}
                    onError={e=>(e.currentTarget.style.display="none")}/>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{margin:0,fontSize:isMobile?14:16,fontWeight:900,
                      overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {selectedContent.title}
                    </p>
                    <p style={{margin:"2px 0 0",fontSize:11,color:levelColor,fontWeight:600}}>
                      {selectedContent.year} · {selectedContent.genre}
                      {selectedContent.type==="series"&&` · T${selectedContent.season}E${selectedContent.episode}`}
                    </p>
                    <p style={{margin:"4px 0 0",fontSize:11,color:"rgba(255,255,255,.45)",
                      lineHeight:1.4,
                      overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      💡 {selectedContent.why}
                    </p>
                  </div>
                  <div style={{flexShrink:0,textAlign:"right"}}>
                    <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:50,
                      background:`${levelColor}20`,color:levelColor,
                      border:`1px solid ${levelColor}40`}}>
                      {LEVEL_CFG[selectedContent.level-1]?.cefr}
                    </span>
                  </div>
                </div>
              </div>

              {/* Painel de aprendizagem */}
              <div style={{width:isMobile?"100%":320,flexShrink:0,
                display:"flex",flexDirection:"column",
                background:"rgba(0,0,0,.45)",backdropFilter:"blur(16px)",
                borderLeft:isMobile?"none":"1px solid rgba(255,255,255,.06)",
                borderTop:isMobile?"1px solid rgba(255,255,255,.06)":"none",
                overflow:"hidden"}}>

                {/* Tabs do painel */}
                <div style={{flexShrink:0,display:"flex",
                  borderBottom:"1px solid rgba(255,255,255,.06)"}}>
                  {([
                    {t:"words" as const, Icon:BookOpen,    label:"Vocabulário"},
                    {t:"notes" as const, Icon:Pencil,      label:"Notas"},
                    {t:"quiz"  as const, Icon:ListChecks,  label:"Desafio"},
                  ]).map(({t,Icon,label})=>(
                    <button key={t} onClick={()=>setPanelTab(t)}
                      style={{flex:1,background:"transparent",border:"none",
                        borderBottom:panelTab===t?`2px solid ${levelColor}`:"2px solid transparent",
                        padding:"10px 4px",cursor:"pointer",fontFamily:"inherit",
                        display:"flex",alignItems:"center",justifyContent:"center",gap:5,
                        fontSize:11,fontWeight:700,
                        color:panelTab===t?"#fff":"rgba(255,255,255,.4)",
                        transition:"all .2s"}}>
                      <Icon size={13} strokeWidth={2.5}/>{!isMobile&&label}
                      {isMobile&&<span style={{fontSize:9}}>{label}</span>}
                    </button>
                  ))}
                </div>

                {/* Conteúdo do painel */}
                <div style={{flex:1,overflow:"auto",padding:14}}>

                  {/* ── Vocabulário ── */}
                  {panelTab==="words" && (
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      <p style={{margin:"0 0 10px",fontSize:11,color:"rgba(255,255,255,.4)"}}>
                        Palavras-chave de <strong style={{color:"#fff"}}>{selectedContent.title}</strong>
                      </p>
                      {selectedContent.words.map((w,i)=>{
                        const known=knownWords.has(w.word);
                        return (
                          <div key={i} style={{
                            background:known?"rgba(29,185,84,.08)":"rgba(255,255,255,.04)",
                            border:`1px solid ${known?"rgba(29,185,84,.2)":"rgba(255,255,255,.07)"}`,
                            borderRadius:12,padding:"10px 12px",
                            display:"flex",alignItems:"center",gap:10,
                            transition:"all .2s"}}>
                            <div style={{flex:1,minWidth:0}}>
                              <p style={{margin:0,fontSize:13,fontWeight:800,
                                color:known?"#4ade80":"#fff"}}>{w.word}</p>
                              <p style={{margin:"2px 0 0",fontSize:11,
                                color:"rgba(255,255,255,.4)"}}>{w.meaning}</p>
                            </div>
                            <button onClick={()=>setKnownWords(s=>{
                              const n=new Set(s);
                              known?n.delete(w.word):n.add(w.word); return n;
                            })} style={{flexShrink:0,width:28,height:28,borderRadius:"50%",
                              background:known?"rgba(29,185,84,.2)":"rgba(255,255,255,.06)",
                              border:`1px solid ${known?"rgba(29,185,84,.4)":"rgba(255,255,255,.1)"}`,
                              cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
                              transition:"all .2s"}}>
                              {known
                                ?<Check size={13} color="#4ade80" strokeWidth={2.5}/>
                                :<Volume2 size={12} color="rgba(255,255,255,.4)" strokeWidth={2}/>}
                            </button>
                          </div>
                        );
                      })}
                      {knownWords.size>0&&(
                        <p style={{margin:"6px 0 0",fontSize:10,color:"#4ade80",textAlign:"center"}}>
                          ✓ {knownWords.size} palavra{knownWords.size!==1?"s":""} aprendida{knownWords.size!==1?"s":""}!
                        </p>
                      )}
                    </div>
                  )}

                  {/* ── Notas ── */}
                  {panelTab==="notes" && (
                    <div style={{display:"flex",flexDirection:"column",gap:10}}>
                      <p style={{margin:"0 0 6px",fontSize:11,color:"rgba(255,255,255,.4)"}}>
                        Escreve frases que ouviste ou palavras novas:
                      </p>
                      <textarea value={note} onChange={e=>setNote(e.target.value)}
                        placeholder={"Ex: \"Life is like a box of chocolates\" — significa que a vida é imprevisível…"}
                        style={{width:"100%",minHeight:180,background:"rgba(255,255,255,.05)",
                          border:"1px solid rgba(255,255,255,.1)",borderRadius:12,
                          padding:"10px 12px",fontSize:12,color:"#fff",
                          outline:"none",fontFamily:"inherit",resize:"vertical",
                          lineHeight:1.5,boxSizing:"border-box"}}
                        onFocus={e=>e.target.style.borderColor=levelColor}
                        onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.1)"}
                      />
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <span style={{fontSize:10,color:"rgba(255,255,255,.25)"}}>
                          {note.length} caracteres
                        </span>
                        {note&&(
                          <button onClick={()=>setNote("")}
                            style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.2)",
                              borderRadius:50,padding:"4px 10px",fontSize:10,fontWeight:600,
                              color:"#f87171",cursor:"pointer",fontFamily:"inherit",
                              display:"flex",alignItems:"center",gap:4}}>
                            <RotateCcw size={10} strokeWidth={2.5}/>Limpar
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ── Quiz / Desafio ── */}
                  {panelTab==="quiz" && (
                    <div style={{display:"flex",flexDirection:"column",gap:12}}>
                      <div style={{background:`${levelColor}10`,border:`1px solid ${levelColor}25`,
                        borderRadius:12,padding:"12px 14px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                          <Lightbulb size={14} color={levelColor} strokeWidth={2.5}/>
                          <span style={{fontSize:11,fontWeight:700,color:levelColor}}>Desafio da Cena</span>
                        </div>
                        <p style={{margin:0,fontSize:12,color:"rgba(255,255,255,.6)",lineHeight:1.5}}>
                          Completa a frase famosa de{" "}
                          <strong style={{color:"#fff"}}>{selectedContent.title}</strong>:
                        </p>
                      </div>

                      {/* Frase com lacuna */}
                      <div style={{background:"rgba(0,0,0,.3)",borderRadius:12,padding:"14px",
                        fontSize:14,fontWeight:700,lineHeight:2,textAlign:"center",
                        border:"1px solid rgba(255,255,255,.08)"}}>
                        {selectedContent.challenge.phrase.replace(
                          selectedContent.challenge.blank,
                          "______"
                        )}
                      </div>

                      {/* Input */}
                      <div style={{display:"flex",gap:8}}>
                        <input value={quizInput}
                          onChange={e=>setQuizInput(e.target.value)}
                          onKeyDown={e=>{if(e.key==="Enter")submitQuiz();}}
                          placeholder="A tua resposta…"
                          disabled={quizStatus!=="idle"}
                          style={{flex:1,background:"rgba(255,255,255,.06)",
                            border:`2px solid ${quizStatus==="correct"?"#4ade80":quizStatus==="wrong"?"#f87171":"rgba(255,255,255,.1)"}`,
                            borderRadius:50,padding:"8px 14px",fontSize:13,color:"#fff",
                            outline:"none",fontFamily:"inherit",transition:"border-color .2s"}}
                          onFocus={e=>{ if(quizStatus==="idle") e.target.style.borderColor=levelColor; }}
                          onBlur={e=>{ if(quizStatus==="idle") e.target.style.borderColor="rgba(255,255,255,.1)"; }}
                        />
                        <button onClick={submitQuiz}
                          disabled={!quizInput.trim()||quizStatus!=="idle"}
                          style={{background:`linear-gradient(135deg,${levelColor},${levelColor}88)`,
                            border:"none",borderRadius:50,padding:"0 16px",
                            fontSize:13,fontWeight:800,color:"#000",cursor:"pointer",
                            opacity:(!quizInput.trim()||quizStatus!=="idle")?.4:1,
                            boxShadow:`0 3px 12px ${levelColor}40`,flexShrink:0}}>
                          OK
                        </button>
                      </div>

                      {/* Feedback */}
                      {quizStatus==="correct"&&(
                        <div className="fade-up" style={{display:"flex",alignItems:"center",gap:8,
                          background:"rgba(29,185,84,.12)",border:"1px solid rgba(29,185,84,.25)",
                          borderRadius:12,padding:"10px 14px"}}>
                          <Check size={16} color="#4ade80" strokeWidth={2.5}/>
                          <p style={{margin:0,fontSize:12,color:"#4ade80",fontWeight:700}}>
                            Correto! 🎉 Excelente!
                          </p>
                        </div>
                      )}
                      {quizStatus==="wrong"&&(
                        <div className="fade-up" style={{display:"flex",alignItems:"center",gap:8,
                          background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.2)",
                          borderRadius:12,padding:"10px 14px"}}>
                          <X size={16} color="#f87171" strokeWidth={2.5}/>
                          <p style={{margin:0,fontSize:12,color:"#fca5a5"}}>
                            A resposta é: <strong style={{color:"#fff"}}>
                              {selectedContent.challenge.answer}
                            </strong>
                          </p>
                        </div>
                      )}

                      <div style={{marginTop:4,padding:"10px 14px",
                        background:"rgba(255,255,255,.03)",borderRadius:12,
                        border:"1px solid rgba(255,255,255,.06)"}}>
                        <p style={{margin:"0 0 4px",fontSize:10,fontWeight:700,
                          color:"rgba(255,255,255,.3)",letterSpacing:".06em"}}>DICA DE APRENDIZAGEM</p>
                        <p style={{margin:0,fontSize:11,color:"rgba(255,255,255,.5)",lineHeight:1.5}}>
                          {LEVEL_CFG[selectedContent.level-1]?.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
