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
  {
    tmdbId:14160, title:"Up", year:2009, type:"movie", level:1,
    genre:"Animação", poster:"/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg",
    why:"Vocabulário de aventura e emoção, narração muito clara",
    words:[
      {word:"adventure",   meaning:"aventura"},
      {word:"balloon",     meaning:"balão"},
      {word:"promise",     meaning:"promessa"},
      {word:"grumpy",      meaning:"rabugento"},
      {word:"wilderness",  meaning:"natureza selvagem"},
    ],
    challenge:{phrase:"Thanks for the ___",blank:"adventure",answer:"adventure"},
  },
  {
    tmdbId:10681, title:"WALL-E", year:2008, type:"movie", level:1,
    genre:"Animação", poster:"/hbhFnRzzg6ZDmm8YAmxBnQpQIPh.jpg",
    why:"Muito pouco diálogo — ideal para vocabulário de ação e sons",
    words:[
      {word:"directive",   meaning:"diretiva / missão"},
      {word:"trash",       meaning:"lixo"},
      {word:"spaceship",   meaning:"nave espacial"},
      {word:"human",       meaning:"humano"},
      {word:"hold",        meaning:"segurar"},
    ],
    challenge:{phrase:"E-___!",blank:"va",answer:"va"},
  },
  {
    tmdbId:9806, title:"The Incredibles", year:2004, type:"movie", level:1,
    genre:"Animação", poster:"/2LqaLgk4Z226KkgPJuiOQ58XL4x.jpg",
    why:"Vocabulário de super-heróis e família, inglês americano claro",
    words:[
      {word:"superhero",   meaning:"super-herói"},
      {word:"villain",     meaning:"vilão"},
      {word:"undercover",  meaning:"disfarçado / secreto"},
      {word:"incredible",  meaning:"incrível"},
      {word:"secret",      meaning:"segredo"},
    ],
    challenge:{phrase:"When everyone's super, no one ___",blank:"will be",answer:"will be"},
  },
  {
    tmdbId:808, title:"Shrek", year:2001, type:"movie", level:1,
    genre:"Animação", poster:"/iB64vpL3dIObOtMZgX3RqdVdQDc.jpg",
    why:"Humor e vocabulário de contos de fadas, inglês britânico acessível",
    words:[
      {word:"ogre",        meaning:"ogre / monstro"},
      {word:"swamp",       meaning:"pântano"},
      {word:"layers",      meaning:"camadas"},
      {word:"donkey",      meaning:"burro"},
      {word:"rescue",      meaning:"resgatar"},
    ],
    challenge:{phrase:"Ogres are like onions — they have ___",blank:"layers",answer:"layers"},
  },
  {
    tmdbId:2062, title:"Ratatouille", year:2007, type:"movie", level:1,
    genre:"Animação", poster:"/npHNjldbeTHdKKw28bJKs7lzqzj.jpg",
    why:"Vocabulário culinário e francês, inglês muito claro",
    words:[
      {word:"chef",        meaning:"chefe de cozinha"},
      {word:"recipe",      meaning:"receita"},
      {word:"disguise",    meaning:"disfarce"},
      {word:"critic",      meaning:"crítico"},
      {word:"flavor",      meaning:"sabor"},
    ],
    challenge:{phrase:"Anyone can ___",blank:"cook",answer:"cook"},
  },
  {
    tmdbId:812, title:"Aladdin", year:1992, type:"movie", level:1,
    genre:"Animação", poster:"/vi5on8bFTQdfBWRzf6CO5bHgqg5.jpg",
    why:"Vocabulário árabe simplificado, canções e frases claras",
    words:[
      {word:"genie",       meaning:"génio / ser mágico"},
      {word:"palace",      meaning:"palácio"},
      {word:"diamond",     meaning:"diamante"},
      {word:"disguise",    meaning:"disfarce"},
      {word:"wish",        meaning:"desejo"},
    ],
    challenge:{phrase:"Do you trust me?  — ___ of course",blank:"Yes",answer:"Yes"},
  },
  {
    tmdbId:10674, title:"Mulan", year:1998, type:"movie", level:1,
    genre:"Animação", poster:"/57exfFsiMrSb6DF5KJIOtDzFcRv.jpg",
    why:"Vocabulário de coragem e família, inglês simples e claro",
    words:[
      {word:"honor",       meaning:"honra"},
      {word:"warrior",     meaning:"guerreiro"},
      {word:"disguise",    meaning:"disfarce"},
      {word:"reflection",  meaning:"reflexo"},
      {word:"ancestor",    meaning:"antepassado"},
    ],
    challenge:{phrase:"The greatest gift and honour is having you for a ___",blank:"daughter",answer:"daughter"},
  },
  {
    tmdbId:9487, title:"A Bug's Life", year:1998, type:"movie", level:1,
    genre:"Animação", poster:"/gA9wnpBcibHdQGMQy4BQSUA2Ber.jpg",
    why:"Vocabulário de insetos, amizade e coragem, muito simples",
    words:[
      {word:"ant",         meaning:"formiga"},
      {word:"grasshopper", meaning:"gafanhoto"},
      {word:"colony",      meaning:"colónia"},
      {word:"harvest",     meaning:"colheita"},
      {word:"bully",       meaning:"valentão"},
    ],
    challenge:{phrase:"You're bigger than that — you just have to ___",blank:"believe it",answer:"believe it"},
  },
  {
    tmdbId:277834, title:"Moana", year:2016, type:"movie", level:1,
    genre:"Animação", poster:"/4caIDIcInZdKcTTlRMSWTBpDpvz.jpg",
    why:"Vocabulário do oceano e autodescoberta, inglês muito claro",
    words:[
      {word:"ocean",       meaning:"oceano"},
      {word:"voyage",      meaning:"viagem / travessia"},
      {word:"island",      meaning:"ilha"},
      {word:"chosen",      meaning:"escolhido"},
      {word:"legend",      meaning:"lenda"},
    ],
    challenge:{phrase:"I am Moana of ___ Nui",blank:"Motunui",answer:"Motunui"},
  },
  {
    tmdbId:62177, title:"Brave", year:2012, type:"movie", level:1,
    genre:"Animação", poster:"/wj5sgoTdoELaqAEHbHNhwkgSEAx.jpg",
    why:"Sotaque escocês suave, vocabulário de família e coragem",
    words:[
      {word:"fate",        meaning:"destino / sorte"},
      {word:"brave",       meaning:"corajoso"},
      {word:"curse",       meaning:"maldição"},
      {word:"arrow",       meaning:"flecha"},
      {word:"clan",        meaning:"clã / família"},
    ],
    challenge:{phrase:"Our fate lives within us, you only have to be ___",blank:"brave enough to see it",answer:"brave enough to see it"},
  },
  {
    tmdbId:12429, title:"Happy Feet", year:2006, type:"movie", level:1,
    genre:"Animação", poster:"/7UKYwhXCrEb9vBrdVeaEXaAf6j4.jpg",
    why:"Vocabulário de animais e dança, inglês americano simples",
    words:[
      {word:"penguin",     meaning:"pinguim"},
      {word:"heart song",  meaning:"canção do coração"},
      {word:"tap dance",   meaning:"dança de sapateado"},
      {word:"different",   meaning:"diferente"},
      {word:"belong",      meaning:"pertencer"},
    ],
    challenge:{phrase:"The heart sings what the ___ can't say",blank:"mouth",answer:"mouth"},
  },
  {
    tmdbId:408, title:"Snow White and the Seven Dwarfs", year:1937, type:"movie", level:1,
    genre:"Animação", poster:"/qJdfHSbMsDgIHVuSFuYlSSXbkVA.jpg",
    why:"O primeiro filme de animação — vocabulário de contos de fadas muito simples",
    words:[
      {word:"dwarf",       meaning:"anão"},
      {word:"poison",      meaning:"veneno"},
      {word:"mirror",      meaning:"espelho"},
      {word:"wicked",      meaning:"malvado"},
      {word:"fairest",     meaning:"mais bela"},
    ],
    challenge:{phrase:"Mirror, mirror on the wall — who's the fairest of them ___?",blank:"all",answer:"all"},
  },
  {
    tmdbId:10886, title:"Bambi", year:1942, type:"movie", level:1,
    genre:"Animação", poster:"/f7RMF4OjBjGjVQkuYNLLuHHwdne.jpg",
    why:"Vocabulário da floresta e das estações, inglês muito simples e emotivo",
    words:[
      {word:"fawn",        meaning:"corça (filhote)"},
      {word:"meadow",      meaning:"prado"},
      {word:"hunter",      meaning:"caçador"},
      {word:"spring",      meaning:"primavera"},
      {word:"thumper",     meaning:"Tambor (coelho)"},
    ],
    challenge:{phrase:"If you can't say something nice, don't say nothing at ___",blank:"all",answer:"all"},
  },
  {
    tmdbId:425, title:"Ice Age", year:2002, type:"movie", level:1,
    genre:"Animação", poster:"/gLhHHZUzeseRXShoDyBWEMDmxWl.jpg",
    why:"Humor e vocabulário de sobrevivência, animais pré-históricos",
    words:[
      {word:"mammoth",     meaning:"mamute"},
      {word:"acorn",       meaning:"bolota"},
      {word:"migrate",     meaning:"migrar"},
      {word:"herd",        meaning:"manada"},
      {word:"glacier",     meaning:"glaciar"},
    ],
    challenge:{phrase:"Sid, if I were you, I'd run. ___ running",blank:"Start",answer:"Start"},
  },
  /* ── A1 — SÉRIES ── */
  {tmdbId:456,title:"The Simpsons",year:1989,type:"series",level:1,genre:"Comédia",poster:"/zTxHf9iIOCqRbxvl8W5QYKrsMLq.jpg",why:"Inglês americano familiar clássico, humor acessível",words:[{word:"doughnut",meaning:"donut"},{word:"couch",meaning:"sofá"},{word:"nuclear",meaning:"nuclear"},{word:"principal",meaning:"diretor escolar"},{word:"church",meaning:"igreja"}],challenge:{phrase:"D'oh! — ___!",blank:"D'oh",answer:"D'oh"},season:1,episode:1},
  {tmdbId:2778,title:"The Fresh Prince of Bel-Air",year:1990,type:"series",level:1,genre:"Comédia",poster:"/f9KBnOSLI3d6E9jOvBJiuNJdODm.jpg",why:"Inglês americano descontraído, rap e comédia acessível",words:[{word:"mansion",meaning:"mansão"},{word:"butler",meaning:"mordomo"},{word:"neighborhood",meaning:"bairro"},{word:"scholarship",meaning:"bolsa de estudo"},{word:"cousin",meaning:"primo"}],challenge:{phrase:"Now this is a story all about how my life got flipped, turned ___",blank:"upside down",answer:"upside down"},season:1,episode:1},
  {tmdbId:4556,title:"Full House",year:1987,type:"series",level:1,genre:"Comédia",poster:"/s9kGFNk5o7kkSXNAEqm2XTpALJv.jpg",why:"Inglês americano familiar simples e positivo",words:[{word:"how rude",meaning:"que falta de educação"},{word:"have mercy",meaning:"misericórdia"},{word:"hug",meaning:"abraço"},{word:"basement",meaning:"cave"},{word:"triplets",meaning:"trigémeos"}],challenge:{phrase:"Have ___!",blank:"mercy",answer:"mercy"},season:1,episode:1},
  {tmdbId:1712,title:"That '70s Show",year:1998,type:"series",level:1,genre:"Comédia",poster:"/liGbqjJwLHMnFMNsP0k1QMTQKIV.jpg",why:"Inglês americano dos anos 70, gírias e humor de época",words:[{word:"groovy",meaning:"fixe / na moda (anos 70)"},{word:"basement",meaning:"cave"},{word:"circle",meaning:"círculo / grupo de amigos"},{word:"burn",meaning:"queimadela (insulto)"},{word:"foreigner",meaning:"estrangeiro"}],challenge:{phrase:"That was a ___ burn",blank:"good",answer:"good"},season:1,episode:1},
  {tmdbId:63247,title:"Gravity Falls",year:2012,type:"series",level:1,genre:"Animação",poster:"/gFMCC6aqS3BaxiBVaXU8lQBqtqP.jpg",why:"Inglês americano claro, vocabulário de mistério e aventura",words:[{word:"mystery",meaning:"mistério"},{word:"journal",meaning:"diário"},{word:"paranormal",meaning:"paranormal"},{word:"twins",meaning:"gémeos"},{word:"grunkle",meaning:"tio-avô (palavra inventada)"}],challenge:{phrase:"I'm Mabel, this is Dipper, we're ___ here",blank:"visiting",answer:"visiting"},season:1,episode:1},
  {tmdbId:2048,title:"Phineas and Ferb",year:2007,type:"series",level:1,genre:"Animação",poster:"/1l5f8mRCMl0SQ1NjmqxRzJivJYO.jpg",why:"Inglês americano criativo e positivo para aprender invenções",words:[{word:"stepbrother",meaning:"meio-irmão"},{word:"blueprint",meaning:"planta / projeto"},{word:"invent",meaning:"inventar"},{word:"platypus",meaning:"ornitorrinco"},{word:"bust",meaning:"apanhar em flagrante"}],challenge:{phrase:"Mom, Phineas and Ferb are making a ___!",blank:"rollercoaster",answer:"rollercoaster"},season:1,episode:1},
  {tmdbId:387,title:"SpongeBob SquarePants",year:1999,type:"series",level:1,genre:"Animação",poster:"/aFtcLFnLMM3c9AEVi8YVZKTQHTU.jpg",why:"Inglês americano humorístico com vocabulário marítimo",words:[{word:"bikini bottom",meaning:"Bikini Bottom (cidade)"},{word:"spatula",meaning:"espátula"},{word:"jellyfish",meaning:"alforreca"},{word:"krabby patty",meaning:"hamburger Krabby Patty"},{word:"boating school",meaning:"escola de condução de barco"}],challenge:{phrase:"Are you ready kids? ___ pants!",blank:"SpongeBob",answer:"SpongeBob"},season:1,episode:1},
  {tmdbId:15260,title:"Adventure Time",year:2010,type:"series",level:1,genre:"Animação",poster:"/sQsVoGYqEG0tT6Kj8Pv5C3DJnCv.jpg",why:"Inglês americano imaginativo, vocabulário de fantasia criativa",words:[{word:"mathematical",meaning:"matemático / fixe (gíria)"},{word:"algebraic",meaning:"algébrico / incrível"},{word:"candy kingdom",meaning:"reino dos doces"},{word:"princess",meaning:"princesa"},{word:"dungeon",meaning:"masmorra"}],challenge:{phrase:"Sucking at something is the first step to being sorta good at ___",blank:"something",answer:"something"},season:1,episode:1},
  {tmdbId:40075,title:"Regular Show",year:2010,type:"series",level:1,genre:"Animação",poster:"/5BSFNMk5gCpqKHmhzz1k9Ovvj9j.jpg",why:"Inglês americano coloquial e descontraído de trabalhadores",words:[{word:"slacking",meaning:"preguiça / vadiar"},{word:"park",meaning:"parque"},{word:"dude",meaning:"cara / gajo"},{word:"awesome",meaning:"incrível"},{word:"benson",meaning:"chefe (nome)"}],challenge:{phrase:"That's it! You're ___!",blank:"fired",answer:"fired"},season:1,episode:1},
  {tmdbId:1395,title:"DuckTales",year:1987,type:"series",level:1,genre:"Animação",poster:"/3sOoqtCJFBgjRRPXm6bGU73VKBr.jpg",why:"Inglês americano de aventura e negócios, muito acessível para crianças",words:[{word:"treasure",meaning:"tesouro"},{word:"adventure",meaning:"aventura"},{word:"moneybags",meaning:"pão de ló de dinheiro"},{word:"vault",meaning:"cofre"},{word:"duckburg",meaning:"Duckburg (cidade)"}],challenge:{phrase:"Tales of ___",blank:"derring-do",answer:"derring-do"},season:1,episode:1},
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
    tmdbId:601, title:"E.T. the Extra-Terrestrial", year:1982, type:"movie", level:2,
    genre:"Sci-Fi", poster:"/an0nD6uq6byfxXCfk6lQBzdL2zK.jpg",
    why:"Inglês americano de família, vocabulário simples e emocional",
    words:[
      {word:"extra-terrestrial",meaning:"extraterrestre"},
      {word:"phone home",  meaning:"ligar para casa"},
      {word:"government",  meaning:"governo"},
      {word:"bicycle",     meaning:"bicicleta"},
      {word:"glow",        meaning:"brilhar / luminescência"},
    ],
    challenge:{phrase:"E.T. phone ___",blank:"home",answer:"home"},
  },
  {
    tmdbId:10719, title:"Elf", year:2003, type:"movie", level:2,
    genre:"Comédia", poster:"/oQffRNjK8e19rF7xVYEN8ew0j7b.jpg",
    why:"Humor americano natalício, inglês muito acessível",
    words:[
      {word:"elf",         meaning:"elfo"},
      {word:"workshop",    meaning:"oficina"},
      {word:"candy",       meaning:"doces / rebucados"},
      {word:"cotton balls", meaning:"bolas de algodão"},
      {word:"ridiculous",  meaning:"ridículo"},
    ],
    challenge:{phrase:"The best way to spread Christmas cheer is singing loud for all to ___",blank:"hear",answer:"hear"},
  },
  {
    tmdbId:10364, title:"Matilda", year:1996, type:"movie", level:2,
    genre:"Fantasia", poster:"/3MWaVJK0Aa3NFQPSWTU0YS99VnK.jpg",
    why:"Inglês britânico claro, vocabulário escolar e literário",
    words:[
      {word:"telekinesis",  meaning:"telequinesia"},
      {word:"headmistress", meaning:"diretora (escola)"},
      {word:"genius",       meaning:"génio"},
      {word:"neglect",      meaning:"negligência / abandono"},
      {word:"library",      meaning:"biblioteca"},
    ],
    challenge:{phrase:"I'm big and you're small, and there's nothing you can ___",blank:"do about it",answer:"do about it"},
  },
  {
    tmdbId:621, title:"Grease", year:1978, type:"movie", level:2,
    genre:"Musical", poster:"/pE7bFCrqQ4JKaFBMQJdGkHjTIVm.jpg",
    why:"Musical americano dos anos 50, inglês coloquial e canções",
    words:[
      {word:"greaser",     meaning:"rockabilly / rebelde"},
      {word:"summer",      meaning:"verão"},
      {word:"prom",        meaning:"baile de finalistas"},
      {word:"T-Birds",     meaning:"gang T-Birds"},
      {word:"fender",      meaning:"guarda-lamas do carro"},
    ],
    challenge:{phrase:"You're the one that I ___",blank:"want",answer:"want"},
  },
  {
    tmdbId:1885, title:"The Karate Kid", year:1984, type:"movie", level:2,
    genre:"Drama", poster:"/acTQFHGE6FHCjENLkJhSxjQXFGT.jpg",
    why:"Inglês motivacional e de artes marciais, vocabulário de desporto",
    words:[
      {word:"karate",      meaning:"karaté"},
      {word:"dojo",        meaning:"escola de artes marciais"},
      {word:"balance",     meaning:"equilíbrio"},
      {word:"focus",       meaning:"foco / concentração"},
      {word:"tournament",  meaning:"torneio"},
    ],
    challenge:{phrase:"Wax on, wax ___",blank:"off",answer:"off"},
  },
  {
    tmdbId:9614, title:"Remember the Titans", year:2000, type:"movie", level:2,
    genre:"Drama", poster:"/4tE4x7GOL8kIfPxIq4FMPMFcyVy.jpg",
    why:"Inglês americano motivacional, vocabulário de desporto e igualdade",
    words:[
      {word:"attitude",    meaning:"atitude"},
      {word:"coach",       meaning:"treinador"},
      {word:"integrate",   meaning:"integrar / misturar"},
      {word:"prejudice",   meaning:"preconceito"},
      {word:"touchdown",   meaning:"touchdown (futebol americano)"},
    ],
    challenge:{phrase:"Attitude reflects ___",blank:"leadership",answer:"leadership"},
  },
  {
    tmdbId:578, title:"Big Fish", year:2003, type:"movie", level:2,
    genre:"Drama", poster:"/i2e8eFRtj3GrHf8oJvRuH0aG0FQ.jpg",
    why:"Inglês narrativo e poético, vocabulário de histórias e fantasia",
    words:[
      {word:"tale",        meaning:"conto / história"},
      {word:"legend",      meaning:"lenda"},
      {word:"exaggerate",  meaning:"exagerar"},
      {word:"myth",        meaning:"mito"},
      {word:"extraordinary",meaning:"extraordinário"},
    ],
    challenge:{phrase:"A man tells his stories so many times that he becomes the ___",blank:"stories",answer:"stories"},
  },
  {
    tmdbId:7544, title:"Jumanji", year:1995, type:"movie", level:2,
    genre:"Aventura", poster:"/vgpXmVaVyUL7GGiDeiK1mKEKzcX.jpg",
    why:"Inglês de aventura e fantasia, vocabulário de jogos e animais",
    words:[
      {word:"jungle",      meaning:"selva / jungla"},
      {word:"stampede",    meaning:"debandada de animais"},
      {word:"welcome",     meaning:"bem-vindo"},
      {word:"survive",     meaning:"sobreviver"},
      {word:"free",        meaning:"livre / libertar"},
    ],
    challenge:{phrase:"Jumanji! In the jungle you must wait until the dice read ___ or ___",blank:"five",answer:"five"},
  },
  {
    tmdbId:15121, title:"The Sound of Music", year:1965, type:"movie", level:2,
    genre:"Musical", poster:"/oXQT5P04cBDjS5hAHfAWdSiIgIB.jpg",
    why:"Inglês britânico musical clássico, vocabulário de música e natureza",
    words:[
      {word:"governess",   meaning:"aia / preceptora"},
      {word:"melody",      meaning:"melodia"},
      {word:"Alps",        meaning:"Alpes (montanhas)"},
      {word:"nun",         meaning:"freira"},
      {word:"captain",     meaning:"capitão"},
    ],
    challenge:{phrase:"The hills are alive with the sound of ___",blank:"music",answer:"music"},
  },
  /* ── A2 — SÉRIES ── */
  {tmdbId:1400,title:"Seinfeld",year:1989,type:"series",level:2,genre:"Comédia",poster:"/aCw8ONfyz3AhngVQa1E2Ss4KSUQ.jpg",why:"Humor americano sobre o dia-a-dia de Nova Iorque, muito expressivo",words:[{word:"soup",meaning:"sopa"},{word:"festivus",meaning:"Festivus (feriado inventado)"},{word:"yada yada",meaning:"blá blá blá"},{word:"regift",meaning:"oferecer prenda já recebida"},{word:"double-dip",meaning:"mergulhar duas vezes (gíria)"}],challenge:{phrase:"No soup for ___!",blank:"you",answer:"you"},season:1,episode:1},
  {tmdbId:31917,title:"Modern Family",year:2009,type:"series",level:2,genre:"Comédia",poster:"/kQ1Bh6kM3uL1TY7qHNLl00xGCB6.jpg",why:"Inglês americano familiar moderno, diversidade de personagens",words:[{word:"divorced",meaning:"divorciado"},{word:"stepfather",meaning:"padrasto"},{word:"adopted",meaning:"adotado"},{word:"mockumentary",meaning:"falso documentário"},{word:"awkward",meaning:"constrangedor"}],challenge:{phrase:"We are a ___ family",blank:"modern",answer:"modern"},season:1,episode:1},
  {tmdbId:48891,title:"Brooklyn Nine-Nine",year:2013,type:"series",level:2,genre:"Comédia",poster:"/hgRMSOt7a1b8qyQR68vUixJPang.jpg",why:"Inglês americano de esquadra, humor policial muito acessível",words:[{word:"precinct",meaning:"esquadra de polícia"},{word:"perp",meaning:"suspeito / criminoso"},{word:"detective",meaning:"detetive"},{word:"title",meaning:"título"},{word:"evidence",meaning:"prova / evidência"}],challenge:{phrase:"NINE NINE!",blank:"NINE",answer:"NINE"},season:1,episode:1},
  {tmdbId:8592,title:"Parks and Recreation",year:2009,type:"series",level:2,genre:"Comédia",poster:"/fC4LoB9nDUkFt6tTNnlJXkpylm5.jpg",why:"Inglês americano de administração pública, otimismo e motivação",words:[{word:"municipality",meaning:"município"},{word:"waffles",meaning:"waffles"},{word:"binders",meaning:"dossiers"},{word:"knope",meaning:"Knope (apelido da personagem)"},{word:"literally",meaning:"literalmente"}],challenge:{phrase:"___ is amazing",blank:"Leslie",answer:"Leslie"},season:1,episode:1},
  {tmdbId:43522,title:"New Girl",year:2011,type:"series",level:2,genre:"Comédia",poster:"/nGnKpE2u8TBvYGblexdV8pN9WPy.jpg",why:"Inglês americano contemporâneo de coabitação, muito natural",words:[{word:"loft",meaning:"loft / apartamento open space"},{word:"quirky",meaning:"excêntrico / original"},{word:"roommate",meaning:"colega de quarto"},{word:"dating",meaning:"namorar"},{word:"awkward",meaning:"constrangedor"}],challenge:{phrase:"___, girl!",blank:"New",answer:"New"},season:1,episode:1},
  {tmdbId:17128,title:"The Big Bang Theory",year:2007,type:"series",level:2,genre:"Comédia",poster:"/ooBGRQBdbGzBxSwkr69qsCKLkjw.jpg",why:"Inglês americano de cientistas, vocabulário técnico em contexto cómico",words:[{word:"bazinga",meaning:"bazinga (enganei-te)"},{word:"theoretical",meaning:"teórico"},{word:"physicist",meaning:"físico"},{word:"roommate",meaning:"colega de quarto"},{word:"comic book",meaning:"banda desenhada / comic"}],challenge:{phrase:"Knock knock knock... ___",blank:"Penny",answer:"Penny"},season:1,episode:1},
  {tmdbId:4246,title:"Gilmore Girls",year:2000,type:"series",level:2,genre:"Drama",poster:"/8InpGMCgMcCgSpCxajxYxJNNBl3.jpg",why:"Inglês americano rápido e cultural, muito referências à cultura pop",words:[{word:"coffee",meaning:"café"},{word:"diner",meaning:"restaurante / café americano"},{word:"Yale",meaning:"Universidade Yale"},{word:"pop culture",meaning:"cultura popular"},{word:"banter",meaning:"troca de palavras rápidas"}],challenge:{phrase:"You jump, I ___",blank:"jump",answer:"jump"},season:1,episode:1},
  {tmdbId:57243,title:"Doctor Who",year:2005,type:"series",level:2,genre:"Sci-Fi",poster:"/4edFyasCrkH4MKs6H4mHqlrxSsD.jpg",why:"Inglês britânico contemporâneo, vocabulário de ficção científica",words:[{word:"tardis",meaning:"TARDIS (nave do Doutor)"},{word:"sonic screwdriver",meaning:"chave de fendas sónica"},{word:"regeneration",meaning:"regeneração"},{word:"timelord",meaning:"Senhor do Tempo"},{word:"companion",meaning:"companheiro"}],challenge:{phrase:"Allons-y! — Onwards! Or simply... ___!",blank:"Let's go",answer:"Let's go"},season:1,episode:1},
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
    tmdbId:597, title:"Titanic", year:1997, type:"movie", level:3,
    genre:"Drama", poster:"/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
    why:"Inglês americano e britânico, vocabulário de romance e desastre",
    words:[
      {word:"vessel",      meaning:"embarcação / navio"},
      {word:"iceberg",     meaning:"iceberg"},
      {word:"steerage",    meaning:"terceira classe"},
      {word:"unsinkable",  meaning:"inafundável"},
      {word:"drift",       meaning:"derivar / flutuar"},
    ],
    challenge:{phrase:"I'm the king of the ___",blank:"world",answer:"world"},
  },
  {
    tmdbId:98, title:"Gladiator", year:2000, type:"movie", level:3,
    genre:"Acção", poster:"/6WBIzCgmDCYrqh64yDREGeDk9d3.jpg",
    why:"Inglês histórico dramático, discursos poderosos",
    words:[
      {word:"senate",      meaning:"senado"},
      {word:"emperor",     meaning:"imperador"},
      {word:"vengeance",   meaning:"vingança"},
      {word:"strength",    meaning:"força"},
      {word:"honor",       meaning:"honra"},
    ],
    challenge:{phrase:"Are you not ___?",blank:"entertained",answer:"entertained"},
  },
  {
    tmdbId:329, title:"Jurassic Park", year:1993, type:"movie", level:3,
    genre:"Sci-Fi", poster:"/9i3plLl89DHMz7mahksDaAo9QEm.jpg",
    why:"Vocabulário científico e de aventura, inglês britânico e americano",
    words:[
      {word:"fossil",      meaning:"fóssil"},
      {word:"DNA",         meaning:"ADN"},
      {word:"dinosaur",    meaning:"dinossauro"},
      {word:"extinct",     meaning:"extinto"},
      {word:"containment", meaning:"contenção"},
    ],
    challenge:{phrase:"Life finds a ___",blank:"way",answer:"way"},
  },
  {
    tmdbId:278, title:"The Shawshank Redemption", year:1994, type:"movie", level:3,
    genre:"Drama", poster:"/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    why:"Inglês americano profundo, vocabulário de prisão e esperança",
    words:[
      {word:"redemption",  meaning:"redenção / salvação"},
      {word:"parole",      meaning:"liberdade condicional"},
      {word:"warden",      meaning:"diretor de prisão"},
      {word:"corruption",  meaning:"corrupção"},
      {word:"freedom",     meaning:"liberdade"},
    ],
    challenge:{phrase:"Get busy living, or get busy ___",blank:"dying",answer:"dying"},
  },
  {
    tmdbId:857, title:"Saving Private Ryan", year:1998, type:"movie", level:3,
    genre:"Guerra", poster:"/uqx37cS8cpHg8U35f9U5IBlrCV3.jpg",
    why:"Inglês americano militar, vocabulário de guerra e camaradagem",
    words:[
      {word:"mission",     meaning:"missão"},
      {word:"sergeant",    meaning:"sargento"},
      {word:"infantry",    meaning:"infantaria"},
      {word:"sacrifice",   meaning:"sacrifício"},
      {word:"amphibious",  meaning:"anfíbio"},
    ],
    challenge:{phrase:"Earn ___",blank:"this",answer:"this"},
  },
  {
    tmdbId:828, title:"Catch Me If You Can", year:2002, type:"movie", level:3,
    genre:"Drama", poster:"/wkBNFfXcWHYfSMFj3pIxF5HFOFb.jpg",
    why:"Inglês americano rápido e charmoso, vocabulário de fraude",
    words:[
      {word:"impersonate",  meaning:"fazer-se passar por"},
      {word:"forger",       meaning:"falsificador"},
      {word:"FBI",          meaning:"FBI"},
      {word:"fugitive",     meaning:"fugitivo"},
      {word:"con artist",   meaning:"vigarista"},
    ],
    challenge:{phrase:"Two little mice fell in a bucket of cream. The first mouse quickly gave up and ___",blank:"drowned",answer:"drowned"},
  },
  {
    tmdbId:37165, title:"The Truman Show", year:1998, type:"movie", level:3,
    genre:"Drama", poster:"/vuza0WqY239yBXOadKlGwJsZJFE.jpg",
    why:"Inglês americano satírico, vocabulário de media e realidade",
    words:[
      {word:"broadcast",   meaning:"transmissão / emissão"},
      {word:"spontaneous", meaning:"espontâneo"},
      {word:"genuine",     meaning:"genuíno / autêntico"},
      {word:"scripted",    meaning:"com guião / combinado"},
      {word:"audience",    meaning:"audiência / público"},
    ],
    challenge:{phrase:"In case I don't see ya: good afternoon, good evening, and good ___",blank:"night",answer:"night"},
  },
  {
    tmdbId:607, title:"Men in Black", year:1997, type:"movie", level:3,
    genre:"Sci-Fi", poster:"/ifhwkD4xGGXAtUGaHSvZQwXHQoe.jpg",
    why:"Inglês americano de ação e comédia, vocabulário de ficção científica",
    words:[
      {word:"alien",       meaning:"alien / extraterrestre"},
      {word:"galaxy",      meaning:"galáxia"},
      {word:"neutralize",  meaning:"neutralizar"},
      {word:"classified",  meaning:"confidencial / secreto"},
      {word:"probe",       meaning:"sonda / investigar"},
    ],
    challenge:{phrase:"A person is smart. People are ___",blank:"dumb",answer:"dumb"},
  },
  {
    tmdbId:197, title:"Braveheart", year:1995, type:"movie", level:3,
    genre:"Histórico", poster:"/3me0q6skMFCOHYt0C3Uo6m4WQGP.jpg",
    why:"Inglês escocês histórico, discursos épicos sobre liberdade",
    words:[
      {word:"freedom",     meaning:"liberdade"},
      {word:"clan",        meaning:"clã"},
      {word:"rebellion",   meaning:"rebelião"},
      {word:"traitor",     meaning:"traidor"},
      {word:"noble",       meaning:"nobre"},
    ],
    challenge:{phrase:"They may take our lives, but they'll never take our ___",blank:"freedom",answer:"freedom"},
  },
  {
    tmdbId:568, title:"Apollo 13", year:1995, type:"movie", level:3,
    genre:"Drama", poster:"/aeOCODDiLTbMxvs7pnLVKjdJzMm.jpg",
    why:"Vocabulário técnico aeroespacial americano, frases icónicas",
    words:[
      {word:"oxygen",      meaning:"oxigênio"},
      {word:"abort",       meaning:"abortar / cancelar"},
      {word:"trajectory",  meaning:"trajetória"},
      {word:"lunar",       meaning:"lunar"},
      {word:"module",      meaning:"módulo"},
    ],
    challenge:{phrase:"Houston, we have a ___",blank:"problem",answer:"problem"},
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
  /* ── B1 — SÉRIES ── */
  {tmdbId:19885,title:"Sherlock",year:2010,type:"series",level:3,genre:"Crime",poster:"/7WTsnHkbA0FaG6R9twfFde0I9hl.jpg",why:"Inglês britânico sofisticado, vocabulário de investigação e dedução",words:[{word:"deduction",meaning:"dedução"},{word:"elementary",meaning:"elementar"},{word:"moriarty",meaning:"Moriarty (villain)"},{word:"forensic",meaning:"forense"},{word:"psychopath",meaning:"psicopata"}],challenge:{phrase:"Elementary, my dear ___",blank:"Watson",answer:"Watson"},season:1,episode:1},
  {tmdbId:1408,title:"House M.D.",year:2004,type:"series",level:3,genre:"Drama",poster:"/3GrRgt6CiLIUXzkpGQfR1HiMBam.jpg",why:"Vocabulário médico americano avançado, diagnóstico e sarcasmo",words:[{word:"lupus",meaning:"lúpus (doença)"},{word:"diagnosis",meaning:"diagnóstico"},{word:"symptoms",meaning:"sintomas"},{word:"vicodin",meaning:"Vicodin (analgésico)"},{word:"differential",meaning:"diagnóstico diferencial"}],challenge:{phrase:"It's never ___",blank:"lupus",answer:"lupus"},season:1,episode:1},
  {tmdbId:1416,title:"Grey's Anatomy",year:2005,type:"series",level:3,genre:"Drama",poster:"/aopmFGIZeO7GQDRRFwJcqFG4vYn.jpg",why:"Inglês médico americano, vocabulário de cirurgia e emoções",words:[{word:"intern",meaning:"interno / estagiário médico"},{word:"attending",meaning:"médico assistente"},{word:"chief",meaning:"chefe"},{word:"ferry boat",meaning:"barco ferry"},{word:"dark and twisty",meaning:"sombrio e tortuoso"}],challenge:{phrase:"It's a beautiful day to save ___",blank:"lives",answer:"lives"},season:1,episode:1},
  {tmdbId:40008,title:"Downton Abbey",year:2010,type:"series",level:3,genre:"Drama",poster:"/9mDHF0QMaNQgkJ0zRyW6H3JEsqz.jpg",why:"Inglês britânico aristocrático do século XX, vocabulário formal",words:[{word:"butler",meaning:"mordomo"},{word:"estate",meaning:"propriedade / herdade"},{word:"propriety",meaning:"decoro / conveniência"},{word:"heiress",meaning:"herdeira"},{word:"valet",meaning:"ajudante pessoal"}],challenge:{phrase:"Is there anything Downton can't ___?",blank:"survive",answer:"survive"},season:1,episode:1},
  {tmdbId:2309,title:"Arrested Development",year:2003,type:"series",level:3,genre:"Comédia",poster:"/mUYo0TXDvASXm9QFcNJ60E8VzGt.jpg",why:"Inglês americano denso de ironia e referências, ótimo para B1",words:[{word:"frozen banana",meaning:"banana congelada"},{word:"chicken dance",meaning:"dança da galinha"},{word:"buster",meaning:"Buster (personagem)"},{word:"mistake",meaning:"erro"},{word:"illusion",meaning:"ilusão"}],challenge:{phrase:"I've made a huge ___ ",blank:"mistake",answer:"mistake"},season:1,episode:1},
  {tmdbId:4607,title:"Lost",year:2004,type:"series",level:3,genre:"Sci-Fi",poster:"/og6S0aTZU6YUJAbqxeKjCa3kY1E.jpg",why:"Inglês americano dramático, vocabulário de sobrevivência e mistério",words:[{word:"survivor",meaning:"sobrevivente"},{word:"island",meaning:"ilha"},{word:"hatch",meaning:"escotilha / alçapão"},{word:"numbers",meaning:"os números"},{word:"smoke monster",meaning:"monstro de fumo"}],challenge:{phrase:"We have to go ___!",blank:"back",answer:"back"},season:1,episode:1},
  {tmdbId:1411,title:"24",year:2001,type:"series",level:3,genre:"Acção",poster:"/xFmBhyLUHFoKFADiTtfmLQBNqfF.jpg",why:"Inglês americano de ação e tensão, vocabulário de contra-terrorismo",words:[{word:"CTU",meaning:"Unidade Anti-Terrorismo"},{word:"protocol",meaning:"protocolo"},{word:"interrogate",meaning:"interrogar"},{word:"mole",meaning:"toupeira / agente duplo"},{word:"tick tock",meaning:"tique-taque (relógio)"}],challenge:{phrase:"The following takes place between ___ am and ___",blank:"12",answer:"12"},season:1,episode:1},
  {tmdbId:60735,title:"The Flash",year:2014,type:"series",level:3,genre:"Acção",poster:"/lJA2RCMfsWoskqlQhXPSLFQGXEJ.jpg",why:"Inglês americano de super-heróis, vocabulário científico simplificado",words:[{word:"particle accelerator",meaning:"acelerador de partículas"},{word:"metahuman",meaning:"meta-humano"},{word:"speedster",meaning:"velocista"},{word:"timeline",meaning:"linha do tempo"},{word:"villain",meaning:"vilão"}],challenge:{phrase:"Run, Barry, ___!",blank:"run",answer:"run"},season:1,episode:1},
  {tmdbId:1412,title:"Prison Break",year:2005,type:"series",level:3,genre:"Acção",poster:"/y7KtXtaGIHBZLm5fVFfB7jtZ4bL.jpg",why:"Inglês americano de ação e estratégia, vocabulário de prisão e fuga",words:[{word:"blueprint",meaning:"planta / projeto"},{word:"tattoo",meaning:"tatuagem"},{word:"cell",meaning:"cela"},{word:"warden",meaning:"diretor de prisão"},{word:"conspiracy",meaning:"conspiração"}],challenge:{phrase:"I'm getting my brother out of ___",blank:"prison",answer:"prison"},season:1,episode:1},
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
    tmdbId:550, title:"Fight Club", year:1999, type:"movie", level:4,
    genre:"Drama", poster:"/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    why:"Inglês americano anárquico, vocabulário de psicologia e identidade",
    words:[
      {word:"alter ego",   meaning:"alter ego / segunda identidade"},
      {word:"insomnia",    meaning:"insônia"},
      {word:"anarchy",     meaning:"anarquia"},
      {word:"consumerism", meaning:"consumismo"},
      {word:"subconscious",meaning:"subconsciente"},
    ],
    challenge:{phrase:"The first rule of Fight Club is: you do not talk about ___",blank:"Fight Club",answer:"Fight Club"},
  },
  {
    tmdbId:244786, title:"Whiplash", year:2014, type:"movie", level:4,
    genre:"Drama", poster:"/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
    why:"Inglês americano intenso, vocabulário de música clássica e obsessão",
    words:[
      {word:"tempo",       meaning:"tempo / ritmo"},
      {word:"rushing",     meaning:"apressado / a correr"},
      {word:"dragging",    meaning:"a arrastar / lento"},
      {word:"prodigy",     meaning:"prodígio"},
      {word:"conductor",   meaning:"maestro / condutor"},
    ],
    challenge:{phrase:"Are you rushing or are you ___?",blank:"dragging",answer:"dragging"},
  },
  {
    tmdbId:106646, title:"The Wolf of Wall Street", year:2013, type:"movie", level:4,
    genre:"Drama", poster:"/34m2tygAYBGqA9MXKhRDtzYd4MR.jpg",
    why:"Inglês americano de negócios e excessos, vocabulário financeiro",
    words:[
      {word:"broker",      meaning:"corretor financeiro"},
      {word:"commission",  meaning:"comissão"},
      {word:"fraud",       meaning:"fraude"},
      {word:"SEC",         meaning:"Comissão de Valores Mobiliários"},
      {word:"yacht",       meaning:"iate"},
    ],
    challenge:{phrase:"Sell me this ___",blank:"pen",answer:"pen"},
  },
  {
    tmdbId:286217, title:"The Martian", year:2015, type:"movie", level:4,
    genre:"Sci-Fi", poster:"/5BHuvQ6p9kfc091Z8RiFNhCwL4b.jpg",
    why:"Inglês científico humorístico, vocabulário de Marte e sobrevivência",
    words:[
      {word:"sol",         meaning:"dia em Marte"},
      {word:"botanist",    meaning:"botanista"},
      {word:"trajectory",  meaning:"trajetória"},
      {word:"evacuation",  meaning:"evacuação"},
      {word:"calorie",     meaning:"caloria"},
    ],
    challenge:{phrase:"I'm going to have to science the ___ out of this",blank:"shit",answer:"shit"},
  },
  {
    tmdbId:152601, title:"Her", year:2013, type:"movie", level:4,
    genre:"Sci-Fi", poster:"/ePm4yCOTsqRpbmFMOW9Q1a4LWkP.jpg",
    why:"Inglês americano introspetivo, vocabulário de tecnologia e emoção",
    words:[
      {word:"operating system",meaning:"sistema operativo"},
      {word:"intuition",   meaning:"intuição"},
      {word:"evolve",      meaning:"evoluir"},
      {word:"yearning",    meaning:"anseio / saudade"},
      {word:"mortality",   meaning:"mortalidade"},
    ],
    challenge:{phrase:"The past is just a story we tell ___",blank:"ourselves",answer:"ourselves"},
  },
  {
    tmdbId:264660, title:"Ex Machina", year:2014, type:"movie", level:4,
    genre:"Sci-Fi", poster:"/btdCGhkNpjRkSKsaBbfOLLhFBDP.jpg",
    why:"Inglês britânico filosófico, vocabulário de inteligência artificial",
    words:[
      {word:"consciousness",meaning:"consciência"},
      {word:"synthetic",   meaning:"sintético"},
      {word:"Turing test",  meaning:"teste de Turing"},
      {word:"manipulate",  meaning:"manipular"},
      {word:"sentient",    meaning:"senciente / com sentimento"},
    ],
    challenge:{phrase:"One day the AIs are going to look back on us the same way we look back on ___",blank:"fossil skeletons",answer:"fossil skeletons"},
  },
  {
    tmdbId:76341, title:"Mad Max: Fury Road", year:2015, type:"movie", level:4,
    genre:"Acção", poster:"/kqjL17yufvn9OVLyXYpvtyrFfak.jpg",
    why:"Inglês pós-apocalíptico, pouco diálogo mas muito vocabulário expressivo",
    words:[
      {word:"witness",     meaning:"testemunha"},
      {word:"chrome",      meaning:"crómio / spray de tinta"},
      {word:"fury",        meaning:"fúria"},
      {word:"imperator",   meaning:"imperatriz / líder"},
      {word:"citadel",     meaning:"cidadela"},
    ],
    challenge:{phrase:"What a lovely day! What a ___!",blank:"lovely day",answer:"lovely day"},
  },
  {
    tmdbId:210577, title:"Gone Girl", year:2014, type:"movie", level:4,
    genre:"Thriller", poster:"/3qRBfSFMfJKoW1XMDi4s4ygP0n0.jpg",
    why:"Inglês americano de thriller, vocabulário psicológico e media",
    words:[
      {word:"alibi",       meaning:"álibi"},
      {word:"suspect",     meaning:"suspeito"},
      {word:"manipulate",  meaning:"manipular"},
      {word:"obsession",   meaning:"obsessão"},
      {word:"narrative",   meaning:"narrativa"},
    ],
    challenge:{phrase:"I'm the ___ girl",blank:"cool",answer:"cool"},
  },
  {
    tmdbId:419430, title:"Get Out", year:2017, type:"movie", level:4,
    genre:"Horror", poster:"/tfrYFQXDxALMRZ6b1sBSAJrMsmd.jpg",
    why:"Inglês americano contemporâneo, vocabulário de raça e manipulação",
    words:[
      {word:"sunken place", meaning:"lugar afundado (metáfora de controlo)"},
      {word:"hypnosis",    meaning:"hipnose"},
      {word:"coagulate",   meaning:"coagular"},
      {word:"suburban",    meaning:"suburbano"},
      {word:"token",       meaning:"símbolo / representante"},
    ],
    challenge:{phrase:"Get ___!",blank:"out",answer:"out"},
  },
  /* ── B2 — SÉRIES ── */
  {tmdbId:60059,title:"Better Call Saul",year:2015,type:"series",level:4,genre:"Drama",poster:"/fC2DDImCX4a87Kv6yQJ3gFADxfj.jpg",why:"Inglês americano de advogado e crime, vocabulário jurídico avançado",words:[{word:"attorney",meaning:"advogado"},{word:"legitimate",meaning:"legítimo"},{word:"cartel",meaning:"cartel"},{word:"constitution",meaning:"constituição"},{word:"ethics",meaning:"ética"}],challenge:{phrase:"It's all good, ___!",blank:"man",answer:"man"},season:1,episode:1},
  {tmdbId:69478,title:"Ozark",year:2017,type:"series",level:4,genre:"Crime",poster:"/pEsLVpNQ3oaGKereMTFDuZPKK01.jpg",why:"Inglês americano do Midwest, vocabulário de crime financeiro e pressão",words:[{word:"laundering",meaning:"lavagem (de dinheiro)"},{word:"cartel",meaning:"cartel"},{word:"leverage",meaning:"alavancagem / influência"},{word:"compliance",meaning:"conformidade / obediência"},{word:"liquidate",meaning:"liquidar"}],challenge:{phrase:"Every day above ground is a ___ day",blank:"good",answer:"good"},season:1,episode:1},
  {tmdbId:63351,title:"Narcos",year:2015,type:"series",level:4,genre:"Crime",poster:"/rTmal9fDbwh5F0waol2hq35U4ah.jpg",why:"Inglês americano com espanhol, vocabulário de narcotráfico",words:[{word:"cartel",meaning:"cartel"},{word:"shipment",meaning:"carregamento / envio"},{word:"DEA",meaning:"Agência de Combate às Drogas"},{word:"plata o plomo",meaning:"prata ou chumbo (dinheiro ou morte)"},{word:"kingpin",meaning:"líder / chefe do crime"}],challenge:{phrase:"Plata o ___",blank:"plomo",answer:"plomo"},season:1,episode:1},
  {tmdbId:60574,title:"Peaky Blinders",year:2013,type:"series",level:4,genre:"Crime",poster:"/vUUqzWa2LnHIVqkaKVn3nyfVnBL.jpg",why:"Inglês britânico de Birmingham (Brummie), vocabulário de gangues anos 20",words:[{word:"razor",meaning:"lâmina de barbear"},{word:"garrison",meaning:"guarnição / quartel"},{word:"razor blade",meaning:"gilette"},{word:"blinder",meaning:"cegão / excelente (gíria Brummie)"},{word:"shelby",meaning:"Shelby (família)"}],challenge:{phrase:"By order of the Peaky ___",blank:"Blinders",answer:"Blinders"},season:1,episode:1},
  {tmdbId:42009,title:"Black Mirror",year:2011,type:"series",level:4,genre:"Sci-Fi",poster:"/7PRddO7z7mcPi21nZTCMGShAyy1.jpg",why:"Inglês britânico futurista, cada episódio é autónomo — ideal para aprender",words:[{word:"technology",meaning:"tecnologia"},{word:"dystopia",meaning:"distopia"},{word:"algorithm",meaning:"algoritmo"},{word:"implant",meaning:"implante"},{word:"nostalgia",meaning:"nostalgia"}],challenge:{phrase:"What if technology allowed you to ___?",blank:"remember everything",answer:"remember everything"},season:1,episode:1},
  {tmdbId:65494,title:"The Crown",year:2016,type:"series",level:4,genre:"Drama",poster:"/1M876KPjulVwppEpldhdc8V4o68.jpg",why:"Inglês britânico real formal, vocabulário da monarquia",words:[{word:"sovereignty",meaning:"soberania"},{word:"coronation",meaning:"coroação"},{word:"parliament",meaning:"parlamento"},{word:"abdicate",meaning:"abdicar"},{word:"protocol",meaning:"protocolo"}],challenge:{phrase:"Above all else, we must ___ the institution",blank:"protect",answer:"protect"},season:1,episode:1},
  {tmdbId:60862,title:"Fargo",year:2014,type:"series",level:4,genre:"Crime",poster:"/6iFPsLWBfBXiGtXGEBUQLsBRNzJ.jpg",why:"Inglês do Minnesota com sotaque nórdico, vocabulário de crime rural",words:[{word:"dontcha know",meaning:"sabes? (gíria Minnesota)"},{word:"sheriff",meaning:"xerife"},{word:"blizzard",meaning:"tempestade de neve"},{word:"ya betcha",meaning:"podes crer (gíria)"},{word:"cabin",meaning:"cabana"}],challenge:{phrase:"Oh ya, you betcha — absolutely! Ooh ___",blank:"geez",answer:"geez"},season:1,episode:1},
  {
    tmdbId:46648, title:"True Detective", year:2014, type:"series", level:4,
    genre:"Crime", poster:"/vXeHQMdm20TsMXs3u6Cdi6EHG5T.jpg",
    why:"Inglês americano filosófico profundo, vocabulário de investigação",
    words:[
      {word:"detective",   meaning:"detetive"},
      {word:"nihilism",    meaning:"niilismo"},
      {word:"suspect",     meaning:"suspeito"},
      {word:"ritual",      meaning:"ritual"},
      {word:"conspiracy",  meaning:"conspiração"},
    ],
    challenge:{phrase:"Time is a flat ___",blank:"circle",answer:"circle"},
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
  /* ── C1+ — SÉRIES ── */
  {tmdbId:1398,title:"The Sopranos",year:1999,type:"series",level:5,genre:"Crime",poster:"/57vVjteucIF3bGnZj6PmaoJRScw.jpg",why:"Inglês americano de Nova Jersey, vocabulário de máfia do mais elevado nível",words:[{word:"capo",meaning:"capo (chefe de grupo mafioso)"},{word:"Cosa Nostra",meaning:"Coisa Nossa (máfia italiana)"},{word:"shrink",meaning:"psicanalista (gíria)"},{word:"omerta",meaning:"lei do silêncio"},{word:"whack",meaning:"matar (calão mafioso)"}],challenge:{phrase:"You know who I am? I'm Tony ___",blank:"Soprano",answer:"Soprano"},season:1,episode:1},
  {tmdbId:1920,title:"Twin Peaks",year:1990,type:"series",level:5,genre:"Mistério",poster:"/wnGT2FbEKKxFyFBSIEX0bAtG68v.jpg",why:"Inglês americano surreal e filosófico, diálogos únicos de Lynch",words:[{word:"wrapped in plastic",meaning:"envolto em plástico"},{word:"damn fine coffee",meaning:"café excelente"},{word:"red room",meaning:"sala vermelha"},{word:"the lodges",meaning:"os alojamentos"},{word:"log",meaning:"tronco"}],challenge:{phrase:"She's dead. Wrapped in ___",blank:"plastic",answer:"plastic"},season:1,episode:1},
  {tmdbId:62560,title:"Atlanta",year:2016,type:"series",level:5,genre:"Comédia",poster:"/fofjqmgGCKBj4tbkVQzRFkHSrGM.jpg",why:"Inglês americano da Atlanta com AAVE, slang de hip-hop e cultura negra",words:[{word:"trap",meaning:"trap (tipo de hip-hop / armadilha)"},{word:"finesse",meaning:"destreza / enganar com habilidade"},{word:"lit",meaning:"incrível / animado (gíria)"},{word:"bag",meaning:"dinheiro / saco"},{word:"clout",meaning:"influência / fama"}],challenge:{phrase:"Paper ___",blank:"Boi",answer:"Boi"},season:1,episode:1},
  {tmdbId:67070,title:"Fleabag",year:2016,type:"series",level:5,genre:"Comédia",poster:"/2kU4gQp6D7h48a7bEzpEJFoUE9c.jpg",why:"Inglês britânico contemporâneo muito inteligente, breaking the fourth wall",words:[{word:"break the fourth wall",meaning:"quebrar a quarta parede"},{word:"guinea pig",meaning:"cobaia"},{word:"funeral",meaning:"funeral"},{word:"embarrassment",meaning:"vergonha / embaraço"},{word:"obsession",meaning:"obsessão"}],challenge:{phrase:"This is a love ___",blank:"story",answer:"story"},season:1,episode:1},
  {tmdbId:46952,title:"The Americans",year:2013,type:"series",level:5,genre:"Espionagem",poster:"/l5RrKa1qOhEHmWG8F5aSe5fKJiW.jpg",why:"Inglês americano de agentes soviéticos, vocabulário de espionagem",words:[{word:"KGB",meaning:"KGB (serviço secreto soviético)"},{word:"asset",meaning:"ativo / agente"},{word:"handler",meaning:"controlador de agentes"},{word:"dead drop",meaning:"ponto morto (espionagem)"},{word:"counterintelligence",meaning:"contra-espionagem"}],challenge:{phrase:"We're not the ___ here",blank:"bad guys",answer:"bad guys"},season:1,episode:1},
  {tmdbId:87108,title:"Chernobyl",year:2019,type:"series",level:5,genre:"Drama",poster:"/hlLXt2tOPy1e7ddi9IOkSMqECyQ.jpg",why:"Inglês britânico com sotaques variados, vocabulário nuclear e político",words:[{word:"reactor",meaning:"reator"},{word:"radiation",meaning:"radiação"},{word:"dosimeter",meaning:"dosímetro"},{word:"deception",meaning:"engano"},{word:"graphite",meaning:"grafite"}],challenge:{phrase:"Every lie we tell incurs a debt to the ___",blank:"truth",answer:"truth"},season:1,episode:1},
  {tmdbId:1104,title:"Mad Men",year:2007,type:"series",level:5,genre:"Drama",poster:"/7v8iCNEYaLcdT2hWvzAn5Q8mkXS.jpg",why:"Inglês americano dos anos 60, vocabulário de publicidade e identidade",words:[{word:"advertising",meaning:"publicidade"},{word:"copywriter",meaning:"redator publicitário"},{word:"account",meaning:"conta / cliente"},{word:"pitch",meaning:"apresentação de proposta"},{word:"identity",meaning:"identidade"}],challenge:{phrase:"The best things in life are ___ things",blank:"free",answer:"free"},season:1,episode:1},
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
    tmdbId:240, title:"The Godfather Part II", year:1974, type:"movie", level:5,
    genre:"Drama", poster:"/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg",
    why:"Inglês italiano-americano complexo, narrativa dual e vocabulário de poder",
    words:[
      {word:"senator",     meaning:"senador"},
      {word:"inheritance", meaning:"herança"},
      {word:"ruthless",    meaning:"implacável / brutal"},
      {word:"legitimate",  meaning:"legítimo"},
      {word:"regime",      meaning:"regime"},
    ],
    challenge:{phrase:"Keep your friends close, but your enemies ___",blank:"closer",answer:"closer"},
  },
  {
    tmdbId:103, title:"Taxi Driver", year:1976, type:"movie", level:5,
    genre:"Drama", poster:"/ekstpH614fwDX8DUln1a2Opz0N8.jpg",
    why:"Inglês americano de Nova Iorque, monólogo interior complexo",
    words:[
      {word:"vigilante",   meaning:"vigilante"},
      {word:"scum",        meaning:"escória"},
      {word:"loneliness",  meaning:"solidão"},
      {word:"alienation",  meaning:"alienação"},
      {word:"delusion",    meaning:"ilusão / delírio"},
    ],
    challenge:{phrase:"You talkin' to ___?",blank:"me",answer:"me"},
  },
  {
    tmdbId:6977, title:"No Country for Old Men", year:2007, type:"movie", level:5,
    genre:"Thriller", poster:"/2vNaEnFlhPFaOUcZl3PfUNd1UCX.jpg",
    why:"Inglês americano do Texas, vocabulário de filosofia e fatalidade",
    words:[
      {word:"bounty",      meaning:"recompensa"},
      {word:"providence",  meaning:"providência / destino"},
      {word:"inevitable",  meaning:"inevitável"},
      {word:"mortality",   meaning:"mortalidade"},
      {word:"ruthless",    meaning:"implacável"},
    ],
    challenge:{phrase:"What's the most you ever lost on a coin ___?",blank:"toss",answer:"toss"},
  },
  {
    tmdbId:329865, title:"Arrival", year:2016, type:"movie", level:5,
    genre:"Sci-Fi", poster:"/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg",
    why:"Inglês linguístico e filosófico muito avançado, conceitos de tempo e linguagem",
    words:[
      {word:"heptapod",    meaning:"heptápode (alien de 7 membros)"},
      {word:"non-linear",  meaning:"não-linear"},
      {word:"linguistics", meaning:"linguística"},
      {word:"amnesia",     meaning:"amnésia"},
      {word:"perceive",    meaning:"perceber / aperceber"},
    ],
    challenge:{phrase:"Language is the foundation of ___",blank:"civilization",answer:"civilization"},
  },
  {
    tmdbId:38414, title:"Black Swan", year:2010, type:"movie", level:5,
    genre:"Drama", poster:"/wedl3csSQd5rz3h3oMoQJsEXKNK.jpg",
    why:"Inglês americano psicológico intenso, vocabulário de ballet e obsessão",
    words:[
      {word:"perfection",  meaning:"perfeição"},
      {word:"paranoia",    meaning:"paranoia"},
      {word:"hallucination",meaning:"alucinação"},
      {word:"rival",       meaning:"rival"},
      {word:"transformation",meaning:"transformação"},
    ],
    challenge:{phrase:"I felt it. Perfect. I was ___ and vile and beautiful",blank:"perfect",answer:"perfect"},
  },
  {
    tmdbId:11324, title:"Shutter Island", year:2010, type:"movie", level:5,
    genre:"Thriller", poster:"/lt8N1fhAMeLIZBEDpRfWB4XoKUg.jpg",
    why:"Inglês americano psicológico, vocabulário de psiquiatria e ilusão",
    words:[
      {word:"asylum",      meaning:"asilo / manicómio"},
      {word:"psychiatric",  meaning:"psiquiátrico"},
      {word:"conspiracy",   meaning:"conspiração"},
      {word:"hallucinate",  meaning:"alucinar"},
      {word:"delusion",     meaning:"delírio"},
    ],
    challenge:{phrase:"Which would be worse — to live as a monster, or to die as a good ___?",blank:"man",answer:"man"},
  },
  {
    tmdbId:335984, title:"Blade Runner 2049", year:2017, type:"movie", level:5,
    genre:"Sci-Fi", poster:"/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
    why:"Inglês filosófico futurista, vocabulário de inteligência artificial",
    words:[
      {word:"replicant",   meaning:"replicante / androide"},
      {word:"obedience",   meaning:"obediência"},
      {word:"memory",      meaning:"memória"},
      {word:"baseline",    meaning:"linha de base"},
      {word:"empathy",     meaning:"empatia"},
    ],
    challenge:{phrase:"All the best memories are someone ___'s",blank:"else",answer:"else"},
  },
  {
    tmdbId:1438, title:"The Wire", year:2002, type:"series", level:5,
    genre:"Crime", poster:"/4lbclFySvugI51fwsyxBTOm4DqK.jpg",
    why:"Inglês de Baltimore muito autêntico, calão e vocabulário de crime",
    words:[
      {word:"package",     meaning:"droga / produto"},
      {word:"corner",      meaning:"esquina / território"},
      {word:"surveillance",meaning:"vigilância"},
      {word:"stash",       meaning:"esconderijo"},
      {word:"the game",    meaning:"o mundo do crime"},
    ],
    challenge:{phrase:"All in the ___",blank:"game",answer:"game"},
    season:1, episode:1,
  },
  {
    tmdbId:63247, title:"Westworld", year:2016, type:"series", level:5,
    genre:"Sci-Fi", poster:"/gX8SYlnL9ZznkWcbNnEbNoUB7xS.jpg",
    why:"Inglês filosófico avançado sobre consciência e realidade",
    words:[
      {word:"consciousness",meaning:"consciência"},
      {word:"narrative",   meaning:"narrativa / enredo"},
      {word:"reverie",     meaning:"devaneio / memória latente"},
      {word:"host",        meaning:"anfitrião / androide"},
      {word:"maze",        meaning:"labirinto"},
    ],
    challenge:{phrase:"These violent delights have violent ___",blank:"ends",answer:"ends"},
    season:1, episode:1,
  },
  {
    tmdbId:28, title:"Apocalypse Now", year:1979, type:"movie", level:5,
    genre:"Guerra", poster:"/gQB8Y5RCMkv2zwzFHbUJX3kAhvA.jpg",
    why:"Inglês americano intenso sobre guerra e loucura, vocabulário literário",
    words:[
      {word:"horror",      meaning:"horror"},
      {word:"mission",     meaning:"missão"},
      {word:"napalm",      meaning:"napalm"},
      {word:"insanity",    meaning:"insanidade"},
      {word:"colonel",     meaning:"coronel"},
    ],
    challenge:{phrase:"I love the smell of napalm in the ___",blank:"morning",answer:"morning"},
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
