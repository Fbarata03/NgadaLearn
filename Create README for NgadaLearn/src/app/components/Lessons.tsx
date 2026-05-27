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
import {
  BookOpen, Headphones, Search, Play, CheckCircle2, Clock,
  ChevronDown, ChevronUp, MessageCircle, FileText,
} from "lucide-react";

const TABS = [
  { id: "assimil",       label: "Assimil",       icon: BookOpen,        color: "bg-purple-600", desc: "146 lições · Método natural · Progressão gradual" },
  { id: "pimsleur",      label: "Pimsleur",      icon: Headphones,      color: "bg-blue-600",   desc: "30 lições de áudio · Fala e compreensão oral" },
  { id: "leituras",      label: "Leituras",      icon: BookOpen,        color: "bg-green-600",  desc: "18 leituras em áudio · Vocabulário em contexto" },
  { id: "conversacoes",  label: "Conversações",  icon: MessageCircle,   color: "bg-orange-500", desc: "30 diálogos reais · Inglês do dia a dia com áudio TTS" },
  { id: "textos",        label: "Textos",        icon: FileText,        color: "bg-teal-600",   desc: "14 textos com tradução · Do iniciante ao avançado" },
] as const;

type TabId = "assimil" | "pimsleur" | "leituras" | "conversacoes" | "textos";

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

/* ══════════════════════════════
   PÁGINA PRINCIPAL
   ══════════════════════════════ */
export function Lessons() {
  const [tab, setTab] = useState<TabId>("assimil");
  const [search, setSearch] = useState("");
  const { totalCompleted, totalMinutes } = useProgress();

  const lessons = (tab !== "conversacoes" && tab !== "textos")
    ? LESSONS_MAP[tab as "assimil" | "pimsleur" | "leituras"]
    : [];
  const units = tab === "assimil" ? [...new Set(ASSIMIL_LESSONS.map(l => l.unit))].sort((a, b) => a - b) : [];
  const q = search.toLowerCase();

  const totalAll = ASSIMIL_LESSONS.length + PIMSLEUR_LESSONS_LIST.length + LEITURAS_LIST.length + CONVERSATIONS.length + TEXTS.length;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-5xl">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-black text-gray-900 mb-1">Seu Plano de Estudos</h1>
          <p className="text-gray-600">
            {totalAll} aulas disponíveis · {totalCompleted} concluídas · {totalMinutes} min estudados
          </p>
        </div>

        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <Card className="p-4 bg-purple-600 text-white border-0 rounded-xl text-center">
            <p className="text-2xl font-black">{ASSIMIL_LESSONS.length}</p>
            <p className="text-xs text-purple-200">Assimil</p>
          </Card>
          <Card className="p-4 bg-blue-600 text-white border-0 rounded-xl text-center">
            <p className="text-2xl font-black">{PIMSLEUR_LESSONS_LIST.length}</p>
            <p className="text-xs text-blue-200">Pimsleur</p>
          </Card>
          <Card className="p-4 bg-green-600 text-white border-0 rounded-xl text-center">
            <p className="text-2xl font-black">{LEITURAS_LIST.length}</p>
            <p className="text-xs text-green-200">Leituras</p>
          </Card>
          <Card className="p-4 bg-orange-500 text-white border-0 rounded-xl text-center">
            <p className="text-2xl font-black">{CONVERSATIONS.length}</p>
            <p className="text-xs text-orange-100">Conversações</p>
          </Card>
          <Card className="p-4 bg-teal-600 text-white border-0 rounded-xl text-center">
            <p className="text-2xl font-black">{TEXTS.length}</p>
            <p className="text-xs text-teal-100">Textos</p>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                tab === t.id
                  ? `${t.color} text-white shadow-md`
                  : "bg-white border text-gray-600 hover:border-purple-300"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Descrição do método */}
        <div className="mb-4 px-1">
          <p className="text-sm text-gray-500">{TABS.find(t => t.id === tab)?.desc}</p>
        </div>

        {/* Pesquisa */}
        <div className="relative mb-5">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder={tab === "conversacoes" ? "Pesquisar conversa..." : "Pesquisar lição..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>

        {/* Lista */}
        {tab === "assimil" ? (
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
        ) : (
          <FlatList lessons={lessons} search={q} />
        )}
      </div>
    </div>
  );
}
