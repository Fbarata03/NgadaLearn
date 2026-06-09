import { useState } from "react";
import { Link } from "react-router";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Input } from "./ui/input";
import { useProgress } from "../hooks/useProgress";
import {
  ASSIMIL_LESSONS, PIMSLEUR_LESSONS_LIST, LEITURAS_LIST,
  type Lesson, type LessonLevel,
} from "../data/lessonsData";
import { CONVERSATIONS } from "../data/conversationsData";
import { TEXTS } from "../data/textsData";
import { GRAMMAR_LESSONS } from "../data/grammarData";
import { PHRASE_CATEGORIES, TOTAL_PHRASES } from "../data/phrasesData";
import { VOCABULARY } from "../data/vocabularyData";
import {
  BookOpen, Headphones, Search, Play, CheckCircle2, Clock,
  ChevronDown, ChevronUp, MessageCircle, FileText,
  BookMarked, MessageSquare, List, Music, LayoutDashboard,
} from "lucide-react";

const TABS = [
  { id: "assimil",      label: "Assimil",      icon: BookOpen,       color: "bg-purple-600", desc: "146 lições · Método natural · Progressão gradual" },
  { id: "pimsleur",     label: "Pimsleur",     icon: Headphones,     color: "bg-blue-600",   desc: "30 lições de áudio · Fala e compreensão oral" },
  { id: "leituras",     label: "Leituras",     icon: BookOpen,       color: "bg-green-600",  desc: "18 leituras em áudio · Vocabulário em contexto" },
  { id: "conversacoes", label: "Conversações", icon: MessageCircle,  color: "bg-orange-500", desc: "30 diálogos reais · Inglês do dia a dia com áudio TTS" },
  { id: "textos",       label: "Textos",       icon: FileText,       color: "bg-teal-600",   desc: "14 textos com tradução · Do iniciante ao avançado" },
  { id: "gramatica",    label: "Gramática",    icon: BookMarked,     color: "bg-indigo-600", desc: "10 lições de gramática · Do básico ao avançado" },
  { id: "frases",       label: "Frases",       icon: MessageSquare,  color: "bg-pink-500",   desc: `${TOTAL_PHRASES}+ frases do dia a dia · 17 categorias` },
  { id: "vocabulario",  label: "Vocabulário",  icon: List,           color: "bg-rose-600",   desc: "Adjectivos, verbos, expressões idiomáticas" },
  { id: "musica",       label: "Música",       icon: Music,          color: "bg-violet-600", desc: "Aprende inglês através de música · YouTube · Controlo de velocidade" },
] as const;

type TabId = "assimil" | "pimsleur" | "leituras" | "conversacoes" | "textos" | "gramatica" | "frases" | "vocabulario" | "musica";

const LEVEL_COLOR: Record<LessonLevel, string> = {
  "Iniciante":     "bg-green-100 text-green-700",
  "Intermediário": "bg-blue-100 text-blue-700",
  "Avançado":      "bg-purple-100 text-purple-700",
};

const LEVEL_COLOR_CONV: Record<"Iniciante" | "Intermediário" | "Avançado", string> = {
  "Iniciante":     "bg-green-100 text-green-700",
  "Intermediário": "bg-blue-100 text-blue-700",
  "Avançado":      "bg-purple-100 text-purple-700",
};

const LESSONS_MAP = { assimil: ASSIMIL_LESSONS, pimsleur: PIMSLEUR_LESSONS_LIST, leituras: LEITURAS_LIST };

/* ── Grupo de unidade (Assimil) ── */
function UnitGroup({ unit, lessons, search }: { unit: number; lessons: Lesson[]; search: string }) {
  const [open, setOpen] = useState(unit <= 3);
  const { isCompleted } = useProgress();

  const filtered = search
    ? lessons.filter(l => l.title.toLowerCase().includes(search) || l.subtitle.toLowerCase().includes(search))
    : lessons;

  if (filtered.length === 0) return null;

  const completedCount = filtered.filter(l => isCompleted(l.id)).length;
  const firstLesson = filtered[0];

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl border shadow-sm hover:shadow-md transition-all text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-xs font-bold text-purple-700">
            {unit}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{firstLesson.subtitle}</p>
            <p className="text-xs text-gray-500">
              {filtered.length} lições · {completedCount}/{filtered.length} concluídas
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {completedCount > 0 && (
            <div className="flex items-center gap-1.5">
              <Progress value={(completedCount / filtered.length) * 100} className="w-16 h-1.5" />
              <span className="text-xs text-gray-500">{Math.round((completedCount / filtered.length) * 100)}%</span>
            </div>
          )}
          {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {open && (
        <div className="mt-2 space-y-2 pl-2">
          {filtered.map((lesson) => {
            const done = isCompleted(lesson.id);
            return (
              <Link key={lesson.id} to={`/lessons/${lesson.id}`}>
                <div className="flex items-center gap-4 p-4 bg-white border rounded-xl hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${done ? "bg-green-100" : "bg-purple-50 group-hover:bg-purple-100"}`}>
                    {done
                      ? <CheckCircle2 className="w-5 h-5 text-green-600" />
                      : <Play className="w-5 h-5 text-purple-600" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span className="font-bold text-gray-900 text-sm">{lesson.title}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${LEVEL_COLOR[lesson.level]}`}>
                        {lesson.level}
                      </span>
                      {done && <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">✓ Feita</span>}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{lesson.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 flex-shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    {lesson.durationMin}min
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Lista simples (Pimsleur / Leituras) ── */
function FlatList({ lessons, search }: { lessons: Lesson[]; search: string }) {
  const { isCompleted } = useProgress();

  const filtered = search
    ? lessons.filter(l => l.title.toLowerCase().includes(search) || l.subtitle.toLowerCase().includes(search))
    : lessons;

  if (filtered.length === 0) {
    return <p className="text-center text-gray-400 py-10">Nenhuma lição encontrada.</p>;
  }

  return (
    <div className="space-y-2">
      {filtered.map((lesson) => {
        const done = isCompleted(lesson.id);
        return (
          <Link key={lesson.id} to={`/lessons/${lesson.id}`}>
            <div className="flex items-center gap-4 p-4 bg-white border rounded-xl hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-sm ${done ? "bg-green-100 text-green-600" : "bg-purple-50 text-purple-700 group-hover:bg-purple-100"}`}>
                {done ? <CheckCircle2 className="w-6 h-6" /> : lesson.number}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <span className="font-bold text-gray-900 text-sm">{lesson.title}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${LEVEL_COLOR[lesson.level]}`}>
                    {lesson.level}
                  </span>
                  {done && <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">✓ Feita</span>}
                </div>
                <p className="text-xs text-gray-500 truncate">{lesson.subtitle}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 flex-shrink-0">
                <Clock className="w-3.5 h-3.5" />
                {lesson.durationMin}min
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

/* ── Lista de Textos ── */
function TextsList({ search }: { search: string }) {
  const filtered = search
    ? TEXTS.filter(
        t =>
          t.title.toLowerCase().includes(search) ||
          t.titlePt.toLowerCase().includes(search) ||
          t.topic.toLowerCase().includes(search) ||
          t.level.toLowerCase().includes(search)
      )
    : TEXTS;

  const LEVEL_STYLE: Record<string, string> = {
    "Iniciante":     "bg-green-100 text-green-700",
    "Intermediário": "bg-blue-100 text-blue-700",
    "Avançado":      "bg-purple-100 text-purple-700",
  };

  if (filtered.length === 0) {
    return <p className="text-center text-gray-400 py-10">Nenhum texto encontrado.</p>;
  }

  return (
    <div className="space-y-2">
      {filtered.map((t) => (
        <Link key={t.id} to={`/texts/${t.id}`}>
          <div className="flex items-center gap-4 p-4 bg-white border rounded-xl hover:border-teal-300 hover:shadow-md transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-sm bg-teal-50 text-teal-600 group-hover:bg-teal-100">
              {t.number}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <span className="font-bold text-gray-900 text-sm">{t.title}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${LEVEL_STYLE[t.level]}`}>
                  {t.level}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">
                  {t.topic}
                </span>
              </div>
              <p className="text-xs text-gray-500 truncate">{t.titlePt}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 flex-shrink-0">
              <FileText className="w-3.5 h-3.5" />
              {t.paragraphs.length} §
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ── Lista de Conversações ── */
function ConversationsList({ search }: { search: string }) {
  const filtered = search
    ? CONVERSATIONS.filter(
        c =>
          c.title.toLowerCase().includes(search) ||
          c.titlePt.toLowerCase().includes(search) ||
          c.topic.toLowerCase().includes(search)
      )
    : CONVERSATIONS;

  if (filtered.length === 0) {
    return <p className="text-center text-gray-400 py-10">Nenhuma conversa encontrada.</p>;
  }

  return (
    <div className="space-y-2">
      {filtered.map((conv) => (
        <Link key={conv.id} to={`/conversations/${conv.id}`}>
          <div className="flex items-center gap-4 p-4 bg-white border rounded-xl hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-sm bg-orange-50 text-orange-600 group-hover:bg-orange-100">
              {conv.number}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <span className="font-bold text-gray-900 text-sm">{conv.title}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${LEVEL_COLOR_CONV[conv.level]}`}>
                  {conv.level}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                  {conv.topic}
                </span>
              </div>
              <p className="text-xs text-gray-500 truncate">{conv.titlePt}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 flex-shrink-0">
              <MessageCircle className="w-3.5 h-3.5" />
              {conv.lines.length} linhas
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ── Lista de Gramática ── */
function GrammarList({ search }: { search: string }) {
  const LEVEL_STYLE: Record<string, string> = {
    "Iniciante":     "bg-green-100 text-green-700",
    "Intermediário": "bg-blue-100 text-blue-700",
    "Avançado":      "bg-purple-100 text-purple-700",
  };

  const filtered = search
    ? GRAMMAR_LESSONS.filter(
        g =>
          g.title.toLowerCase().includes(search) ||
          g.titlePt.toLowerCase().includes(search) ||
          g.topic.toLowerCase().includes(search)
      )
    : GRAMMAR_LESSONS;

  if (filtered.length === 0) {
    return <p className="text-center text-gray-400 py-10">Nenhuma lição encontrada.</p>;
  }

  return (
    <div className="space-y-2">
      {filtered.map((g) => (
        <Link key={g.id} to={`/grammar/${g.id}`}>
          <div className="flex items-center gap-4 p-4 bg-white border rounded-xl hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl bg-indigo-50 group-hover:bg-indigo-100">
              {g.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <span className="font-bold text-gray-900 text-sm">{g.title}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${LEVEL_STYLE[g.level]}`}>
                  {g.level}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                  {g.topic}
                </span>
              </div>
              <p className="text-xs text-gray-500 truncate">{g.titlePt}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 flex-shrink-0">
              <BookMarked className="w-3.5 h-3.5" />
              {g.rules.length} regras
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ── Lista de Frases por Categoria ── */
function PhrasesCategoryList({ search }: { search: string }) {
  const filtered = search
    ? PHRASE_CATEGORIES.filter(
        c =>
          c.title.toLowerCase().includes(search) ||
          c.titlePt.toLowerCase().includes(search)
      )
    : PHRASE_CATEGORIES;

  if (filtered.length === 0) {
    return <p className="text-center text-gray-400 py-10">Nenhuma categoria encontrada.</p>;
  }

  return (
    <div className="space-y-2">
      {filtered.map((cat) => (
        <Link key={cat.id} to="/phrases">
          <div className="flex items-center gap-4 p-4 bg-white border rounded-xl hover:border-pink-300 hover:shadow-md transition-all cursor-pointer group">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl ${cat.color}`}>
              {cat.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <span className="font-bold text-gray-900 text-sm">{cat.title}</span>
              </div>
              <p className="text-xs text-gray-500 truncate">{cat.titlePt}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 flex-shrink-0">
              <MessageSquare className="w-3.5 h-3.5" />
              {cat.phrases.length} frases
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ── Lista de Vocabulário ── */
function VocabList({ search }: { search: string }) {
  const totalWords =
    VOCABULARY.adjectives.words.length +
    VOCABULARY.adverbs.words.length +
    VOCABULARY.irregularVerbs.length +
    VOCABULARY.regularVerbs.words.length +
    VOCABULARY.idioms.length;

  const sections = [
    { id: "adjectives", title: VOCABULARY.adjectives.title, titlePt: VOCABULARY.adjectives.titlePt, icon: VOCABULARY.adjectives.icon, color: VOCABULARY.adjectives.color, count: VOCABULARY.adjectives.words.length },
    { id: "adverbs", title: VOCABULARY.adverbs.title, titlePt: VOCABULARY.adverbs.titlePt, icon: VOCABULARY.adverbs.icon, color: VOCABULARY.adverbs.color, count: VOCABULARY.adverbs.words.length },
    { id: "irregular", title: "Verbos Irregulares", titlePt: "Irregular Verbs", icon: "⚙️", color: "bg-red-600", count: VOCABULARY.irregularVerbs.length },
    { id: "regular", title: VOCABULARY.regularVerbs.title, titlePt: VOCABULARY.regularVerbs.titlePt, icon: VOCABULARY.regularVerbs.icon, color: VOCABULARY.regularVerbs.color, count: VOCABULARY.regularVerbs.words.length },
    { id: "idioms", title: "Expressões Idiomáticas", titlePt: "Idioms", icon: "💬", color: "bg-rose-500", count: VOCABULARY.idioms.length },
  ];

  const filtered = search
    ? sections.filter(s => s.title.toLowerCase().includes(search) || s.titlePt.toLowerCase().includes(search))
    : sections;

  if (filtered.length === 0) {
    return <p className="text-center text-gray-400 py-10">Nenhuma secção encontrada.</p>;
  }

  return (
    <div className="space-y-2">
      {/* Card de destaque total */}
      {!search && (
        <Link to="/vocabulary">
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-rose-600 to-rose-700 rounded-xl hover:from-rose-700 hover:to-rose-800 transition-all cursor-pointer mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white font-black text-lg">
              {totalWords}
            </div>
            <div>
              <p className="font-black text-white">Ver Todo o Vocabulário</p>
              <p className="text-rose-200 text-xs">{totalWords} entradas · 5 categorias</p>
            </div>
          </div>
        </Link>
      )}
      {filtered.map((section) => (
        <Link key={section.id} to="/vocabulary">
          <div className="flex items-center gap-4 p-4 bg-white border rounded-xl hover:border-rose-300 hover:shadow-md transition-all cursor-pointer group">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl ${section.color} text-white`}>
              {section.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <span className="font-bold text-gray-900 text-sm">{section.title}</span>
              </div>
              <p className="text-xs text-gray-500 truncate">{section.titlePt}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 flex-shrink-0">
              <List className="w-3.5 h-3.5" />
              {section.count} entradas
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ══════════════════════════════
   PÁGINA PRINCIPAL
   ══════════════════════════════ */
export function Lessons() {
  const [tab, setTab] = useState<TabId>("assimil");
  const [search, setSearch] = useState("");
  const { totalCompleted, totalMinutes, isCompleted } = useProgress();
  const [onboardingDismissed, setOnboardingDismissed] = useState(
    () => localStorage.getItem("ngada_onboarding_done") === "1"
  );
  function dismissOnboarding() {
    localStorage.setItem("ngada_onboarding_done", "1");
    setOnboardingDismissed(true);
  }

  const lessons = (tab !== "conversacoes" && tab !== "textos" && tab !== "gramatica" && tab !== "frases" && tab !== "vocabulario" && tab !== "musica")
    ? LESSONS_MAP[tab as "assimil" | "pimsleur" | "leituras"]
    : [];

  /* Navega para um tab e faz scroll suave até ele */
  function goToTab(id: TabId) {
    setTab(id);
    setSearch("");
    setTimeout(() => {
      document.getElementById("lessons-tabs")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  }
  const units = tab === "assimil" ? [...new Set(ASSIMIL_LESSONS.map(l => l.unit))].sort((a, b) => a - b) : [];
  const q = search.toLowerCase();

  const vocabTotal =
    VOCABULARY.adjectives.words.length +
    VOCABULARY.adverbs.words.length +
    VOCABULARY.irregularVerbs.length +
    VOCABULARY.regularVerbs.words.length +
    VOCABULARY.idioms.length;

  const totalAll =
    ASSIMIL_LESSONS.length +
    PIMSLEUR_LESSONS_LIST.length +
    LEITURAS_LIST.length +
    CONVERSATIONS.length +
    TEXTS.length +
    GRAMMAR_LESSONS.length +
    TOTAL_PHRASES +
    vocabTotal;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-5xl">

        {/* Banner onboarding — apenas para novos utilizadores */}
        {totalCompleted === 0 && !onboardingDismissed && (
          <div className="mb-5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-lg">
            <div className="text-3xl flex-shrink-0">👋</div>
            <div className="flex-1">
              <p className="font-black text-base sm:text-lg leading-tight">Bem-vindo ao NgadaLearn!</p>
              <p className="text-purple-200 text-sm mt-0.5">
                Começa pelo <strong className="text-white">Módulo 1 — Fundamentos</strong>. É o melhor ponto de partida para iniciantes.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => { goToTab("assimil"); dismissOnboarding(); }}
                className="bg-white text-purple-700 font-bold text-sm px-4 py-2 rounded-xl hover:bg-purple-50 transition-colors whitespace-nowrap"
              >
                Começar aqui →
              </button>
              <button
                onClick={dismissOnboarding}
                aria-label="Fechar aviso"
                className="text-purple-300 hover:text-white transition-colors p-1"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 transition-colors mb-3 min-h-[44px] -ml-1 px-1">
            <LayoutDashboard className="w-4 h-4" />
            Meu Progresso
          </Link>
          <h1 className="text-3xl font-black text-gray-900 mb-1">O teu Plano de Estudos</h1>
          <p className="text-gray-600">
            {totalAll} conteúdos disponíveis · {totalCompleted} concluídos · {totalMinutes} min estudados
          </p>
        </div>

        {/* ── Cards com imagem — linha 1 ── */}
        {(() => {
          const doneA = ASSIMIL_LESSONS.filter(l => isCompleted(l.id)).length;
          const doneP = PIMSLEUR_LESSONS_LIST.filter(l => isCompleted(l.id)).length;
          const doneL = LEITURAS_LIST.filter(l => isCompleted(l.id)).length;
          return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          {[
            { id: "assimil",      count: ASSIMIL_LESSONS.length,      done: doneA, label: "Assimil",      sub: "Método natural",  img: "photo-1481627834876-b7833e8f5570", grad: "from-purple-950/95 via-purple-700/50", ring: "ring-purple-300" },
            { id: "pimsleur",     count: PIMSLEUR_LESSONS_LIST.length, done: doneP, label: "Pimsleur",    sub: "Áudio & fala",    img: "photo-1505740420928-5e560c06d30e", grad: "from-blue-950/95 via-blue-700/50",   ring: "ring-blue-300"   },
            { id: "leituras",     count: LEITURAS_LIST.length,         done: doneL, label: "Leituras",    sub: "Vocabulário",     img: "photo-1456513080510-7bf3a84b82f8", grad: "from-green-950/95 via-green-700/50", ring: "ring-green-300"  },
            { id: "conversacoes", count: CONVERSATIONS.length,         done: null,  label: "Conversações",sub: "Diálogos reais",  img: "photo-1521737604893-d14cc237f11d", grad: "from-orange-950/95 via-orange-700/50",ring: "ring-orange-300" },
          ].map(c => (
            <button key={c.id} onClick={() => goToTab(c.id as TabId)}
              className={`relative overflow-hidden rounded-2xl shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl aspect-[4/3] ${tab===c.id?"ring-4 "+c.ring+" scale-[1.03]":""}`}>
              <img src={`https://images.unsplash.com/${c.img}?auto=format&fit=crop&w=400&q=70`}
                alt={c.label} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              <div className={`absolute inset-0 bg-gradient-to-t ${c.grad} to-transparent`} />
              <div className="absolute inset-0 flex flex-col justify-end p-3 text-left">
                <p className="text-2xl sm:text-3xl font-black text-white drop-shadow-lg leading-none">{c.count}</p>
                <p className="text-sm font-bold text-white/90 mt-0.5">{c.label}</p>
                <p className="text-[11px] text-white/60 hidden sm:block">{c.sub}</p>
                {c.done !== null && (
                  <div className="mt-1.5">
                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white/80 rounded-full transition-all" style={{ width: `${Math.round((c.done/c.count)*100)}%` }} />
                    </div>
                    <p className="text-[10px] text-white/55 mt-0.5">{c.done}/{c.count} concluídas</p>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
          );
        })()}

        {/* ── Cards com imagem — linha 2 ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { id: "textos",      count: TEXTS.length,        label: "Textos",      sub: "Com tradução",     img: "photo-1455390582262-044cdead277a", grad: "from-teal-950/95 via-teal-700/50",   ring: "ring-teal-300"   },
            { id: "gramatica",   count: GRAMMAR_LESSONS.length,label: "Gramática", sub: "Do básico ao avançado", img: "photo-1503676260728-1c00da094a0b", grad: "from-indigo-950/95 via-indigo-700/50",ring: "ring-indigo-300" },
            { id: "frases",      count: TOTAL_PHRASES,       label: "Frases",      sub: "17 categorias",    img: "photo-1499750310107-5fef28a66643", grad: "from-pink-950/95 via-pink-700/50",   ring: "ring-pink-300"   },
            { id: "vocabulario", count: vocabTotal,           label: "Vocabulário", sub: "5 categorias",     img: "photo-1434030216411-0b793f4b4173", grad: "from-rose-950/95 via-rose-700/50",   ring: "ring-rose-300"   },
          ].map(c => (
            <button key={c.id} onClick={() => goToTab(c.id as TabId)}
              className={`relative overflow-hidden rounded-2xl shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl aspect-[4/3] ${tab===c.id?"ring-4 "+c.ring+" scale-[1.03]":""}`}>
              <img src={`https://images.unsplash.com/${c.img}?auto=format&fit=crop&w=400&q=70`}
                alt={c.label} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              <div className={`absolute inset-0 bg-gradient-to-t ${c.grad} to-transparent`} />
              <div className="absolute inset-0 flex flex-col justify-end p-3 text-left">
                <p className="text-2xl sm:text-3xl font-black text-white drop-shadow-lg leading-none">{c.count}</p>
                <p className="text-sm font-bold text-white/90 mt-0.5">{c.label}</p>
                <p className="text-[11px] text-white/60 hidden sm:block">{c.sub}</p>
              </div>
            </button>
          ))}
        </div>

        {/* ── Cards Música + Netflix ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Link to="/netflix">
            <div className="relative overflow-hidden rounded-2xl shadow-xl cursor-pointer h-36 sm:h-44 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
              <img src="https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=800&q=75"
                alt="Netflix do Inglês" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-r from-red-950/95 via-red-900/75 to-red-700/30" />
              <div className="absolute inset-0 flex items-center px-6 gap-4">
                <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 border border-white/20">🎬</div>
                <div className="flex-1">
                  <p className="font-black text-xl sm:text-2xl text-white">Netflix do Inglês</p>
                  <p className="text-red-200 text-xs sm:text-sm mt-1 leading-relaxed">6 canais curados · BBC · Lucy · TV Series · VOA</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className="text-[10px] bg-white/15 text-white px-2 py-0.5 rounded-full">🟢 A1 ao C1</span>
                    <span className="text-[10px] bg-white/15 text-white px-2 py-0.5 rounded-full">📺 Player integrado</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
          <Link to="/music">
            <div className={`relative overflow-hidden rounded-2xl shadow-xl cursor-pointer h-36 sm:h-44 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${tab==="musica"?"ring-4 ring-violet-300":""}`}>
              <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=75"
                alt="Música" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-r from-violet-950/95 via-violet-800/75 to-violet-700/30" />
              <div className="absolute inset-0 flex items-center px-6 gap-4">
                <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 border border-white/20">🎵</div>
                <div className="flex-1">
                  <p className="font-black text-xl sm:text-2xl text-white">Aulas de Música</p>
                  <p className="text-violet-200 text-xs sm:text-sm mt-1 leading-relaxed">YouTube · Velocidade ajustável · Letras + Traduções PT</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className="text-[10px] bg-white/15 text-white px-2 py-0.5 rounded-full">🐢 0.5× / 0.75× / 1×</span>
                    <span className="text-[10px] bg-white/15 text-white px-2 py-0.5 rounded-full">📝 CC ao vivo</span>
                  </div>
                </div>
                <Music className="w-8 h-8 text-white/30 flex-shrink-0" />
              </div>
            </div>
          </Link>
        </div> {/* fim grid */}

        {/* Tabs */}
        <div id="lessons-tabs" className="flex gap-2 mb-5 overflow-x-auto pb-1.5 flex-nowrap scrollbar-hide overscroll-x-contain -mx-1 px-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setSearch(""); }}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex-shrink-0 ${
                tab === t.id
                  ? `${t.color} text-white shadow-md`
                  : "bg-white border text-gray-600 hover:border-purple-300"
              }`}
            >
              <t.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{t.label}</span>
              <span className="sm:hidden">{t.label.split(" ")[0]}</span>
            </button>
          ))}
        </div>

        {/* Descrição do método */}
        <div className="mb-4 px-1">
          <p className="text-sm text-gray-500">{TABS.find(t => t.id === tab)?.desc}</p>
        </div>

        {/* Pesquisa (apenas quando não é Música) */}
        {tab !== "musica" && (
          <div className="relative mb-5">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder={
                tab === "conversacoes" ? "Pesquisar conversa..." :
                tab === "gramatica" ? "Pesquisar tópico de gramática..." :
                tab === "frases" ? "Pesquisar categoria..." :
                tab === "vocabulario" ? "Pesquisar secção..." :
                "Pesquisar lição..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white text-base"
            />
          </div>
        )}

        {/* Lista */}
        {tab === "musica" ? (
          <Link to="/music">
            <div className="bg-gradient-to-br from-violet-600 to-purple-800 rounded-2xl p-8 text-white text-center hover:from-violet-700 hover:to-purple-900 transition-all shadow-xl cursor-pointer">
              <div className="text-7xl mb-4">🎵</div>
              <h2 className="text-2xl font-black mb-2">Abrir Player de Música</h2>
              <p className="text-violet-200 text-sm mb-6 max-w-md mx-auto">
                Pesquisa músicas em inglês no YouTube, controla a velocidade de reprodução,
                lê as letras e faz as tuas anotações enquanto ouves.
              </p>
              <div className="flex justify-center gap-4 flex-wrap text-sm mb-6">
                <span className="bg-white/20 px-3 py-1.5 rounded-full">🐢 Velocidade 0.5× / 0.75× / 1×</span>
                <span className="bg-white/20 px-3 py-1.5 rounded-full">📝 Área de Letras</span>
                <span className="bg-white/20 px-3 py-1.5 rounded-full">🗒️ Bloco de Notas</span>
                <span className="bg-white/20 px-3 py-1.5 rounded-full">🔍 Pesquisa YouTube</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-white text-violet-700 font-black px-8 py-3 rounded-xl text-base hover:bg-violet-100 transition-colors">
                <Music className="w-5 h-5" />
                Ir para o Player de Música
              </div>
            </div>
          </Link>
        ) : tab === "assimil" ? (
          <div>
            {units.map((unit) => (
              <UnitGroup
                key={unit}
                unit={unit}
                lessons={ASSIMIL_LESSONS.filter(l => l.unit === unit)}
                search={q}
              />
            ))}
          </div>
        ) : tab === "conversacoes" ? (
          <ConversationsList search={q} />
        ) : tab === "textos" ? (
          <TextsList search={q} />
        ) : tab === "gramatica" ? (
          <GrammarList search={q} />
        ) : tab === "frases" ? (
          <PhrasesCategoryList search={q} />
        ) : tab === "vocabulario" ? (
          <VocabList search={q} />
        ) : (
          <FlatList lessons={lessons} search={q} />
        )}
      </div>
    </div>
  );
}
