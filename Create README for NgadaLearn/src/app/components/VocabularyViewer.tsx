import { useState, useMemo } from "react";
import { Link } from "react-router";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { VOCABULARY } from "../data/vocabularyData";
import { Volume2, Search, ArrowLeft } from "lucide-react";

type TabId = "adjectives" | "adverbs" | "irregular" | "regular" | "idioms";

const TABS: { id: TabId; label: string; icon: string; count: number; color: string }[] = [
  { id: "adjectives", label: "Adjectivos", icon: "🎨", count: VOCABULARY.adjectives.words.length, color: "bg-violet-600" },
  { id: "adverbs", label: "Advérbios", icon: "⚡", count: VOCABULARY.adverbs.words.length, color: "bg-amber-500" },
  { id: "irregular", label: "Verbos Irregulares", icon: "⚙️", count: VOCABULARY.irregularVerbs.length, color: "bg-red-600" },
  { id: "regular", label: "Verbos Regulares", icon: "📋", count: VOCABULARY.regularVerbs.words.length, color: "bg-emerald-600" },
  { id: "idioms", label: "Expressões", icon: "💬", count: VOCABULARY.idioms.length, color: "bg-rose-500" },
];

function speak(text: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-GB";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

/* ── Lista de palavras (adjectivos / advérbios / verbos regulares) ── */
function WordList({ words, search, accentColor }: {
  words: { en: string; pt: string; example?: string; examplePt?: string }[];
  search: string;
  accentColor: string;
}) {
  const filtered = useMemo(() => {
    if (!search) return words;
    const q = search.toLowerCase();
    return words.filter((w) => w.en.toLowerCase().includes(q) || w.pt.toLowerCase().includes(q));
  }, [words, search]);

  if (filtered.length === 0) {
    return <p className="text-center text-gray-400 py-10">Nenhuma palavra encontrada.</p>;
  }

  return (
    <div className="space-y-2">
      {filtered.map((word, i) => (
        <Card key={i} className="p-4 border hover:shadow-sm transition-shadow">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-gray-900">{word.en}</span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-600 text-sm">{word.pt}</span>
              </div>
              {word.example && (
                <div className="mt-2 pl-3 border-l-2 border-gray-200">
                  <p className="text-xs text-gray-700 italic">{word.example}</p>
                  {word.examplePt && <p className="text-xs text-gray-400 mt-0.5">{word.examplePt}</p>}
                </div>
              )}
            </div>
            <button
              onClick={() => speak(word.en)}
              className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 transition-colors group"
              title="Ouvir"
            >
              <Volume2 className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ── Tabela de verbos irregulares ── */
function IrregularVerbsTable({ search }: { search: string }) {
  const filtered = useMemo(() => {
    if (!search) return VOCABULARY.irregularVerbs;
    const q = search.toLowerCase();
    return VOCABULARY.irregularVerbs.filter(
      (v) =>
        v.base.toLowerCase().includes(q) ||
        v.past.toLowerCase().includes(q) ||
        v.participle.toLowerCase().includes(q) ||
        v.pt.toLowerCase().includes(q)
    );
  }, [search]);

  if (filtered.length === 0) {
    return <p className="text-center text-gray-400 py-10">Nenhum verbo encontrado.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-red-600 text-white">
            <th className="text-left px-4 py-3 font-bold">Infinitivo</th>
            <th className="text-left px-4 py-3 font-bold">Passado (Past)</th>
            <th className="text-left px-4 py-3 font-bold">Particípio</th>
            <th className="text-left px-4 py-3 font-bold">Português</th>
            <th className="px-2 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((verb, i) => (
            <tr key={i} className={`border-t ${i % 2 === 0 ? "bg-white" : "bg-red-50"} hover:bg-red-100 transition-colors`}>
              <td className="px-4 py-3 font-bold text-gray-900">{verb.base}</td>
              <td className="px-4 py-3 text-red-700 font-semibold">{verb.past}</td>
              <td className="px-4 py-3 text-orange-700 font-semibold">{verb.participle}</td>
              <td className="px-4 py-3 text-gray-500">{verb.pt}</td>
              <td className="px-2 py-3">
                <button
                  onClick={() => speak(`${verb.base}, ${verb.past}, ${verb.participle}`)}
                  className="p-1.5 rounded-lg hover:bg-white transition-colors group"
                  title="Ouvir as três formas"
                >
                  <Volume2 className="w-3.5 h-3.5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Lista de expressões idiomáticas ── */
function IdiomsList({ search }: { search: string }) {
  const filtered = useMemo(() => {
    if (!search) return VOCABULARY.idioms;
    const q = search.toLowerCase();
    return VOCABULARY.idioms.filter(
      (id) =>
        id.expression.toLowerCase().includes(q) ||
        id.meaning.toLowerCase().includes(q) ||
        id.example.toLowerCase().includes(q)
    );
  }, [search]);

  if (filtered.length === 0) {
    return <p className="text-center text-gray-400 py-10">Nenhuma expressão encontrada.</p>;
  }

  return (
    <div className="space-y-3">
      {filtered.map((idiom, i) => (
        <Card key={i} className="p-4 border hover:shadow-sm transition-shadow">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 flex-wrap mb-1">
                <span className="font-black text-gray-900 text-base">"{idiom.expression}"</span>
              </div>
              <p className="text-sm text-rose-700 font-semibold mb-2">↳ {idiom.meaning}</p>
              <div className="pl-3 border-l-2 border-rose-200">
                <p className="text-xs text-gray-700 italic">{idiom.example}</p>
                <p className="text-xs text-gray-400 mt-0.5">{idiom.examplePt}</p>
              </div>
            </div>
            <button
              onClick={() => speak(idiom.expression)}
              className="flex-shrink-0 p-2 rounded-lg hover:bg-rose-50 transition-colors group mt-0.5"
              title="Ouvir expressão"
            >
              <Volume2 className="w-4 h-4 text-gray-400 group-hover:text-rose-600 transition-colors" />
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ══════════════════════════════
   COMPONENTE PRINCIPAL
   ══════════════════════════════ */
export function VocabularyViewer() {
  const [tab, setTab] = useState<TabId>("adjectives");
  const [search, setSearch] = useState("");

  const activeTab = TABS.find((t) => t.id === tab)!;
  const totalWords =
    VOCABULARY.adjectives.words.length +
    VOCABULARY.adverbs.words.length +
    VOCABULARY.irregularVerbs.length +
    VOCABULARY.regularVerbs.words.length +
    VOCABULARY.idioms.length;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
          <Link to="/lessons" className="hover:text-rose-600 flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Lições
          </Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">Vocabulário</span>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-black text-gray-900 mb-1">Vocabulário Essencial</h1>
          <p className="text-gray-600">{totalWords} entradas · Adjectivos, advérbios, verbos e expressões</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-6">
          {TABS.map((t) => (
            <Card key={t.id} className={`p-3 text-center border-0 ${t.color} text-white cursor-pointer hover:opacity-90 transition-opacity`} onClick={() => setTab(t.id)}>
              <p className="text-xl font-black">{t.count}</p>
              <p className="text-xs text-white/80">{t.label}</p>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setSearch(""); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                tab === t.id
                  ? `${t.color} text-white shadow-md`
                  : "bg-white border text-gray-600 hover:border-rose-300"
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Descrição do tab activo */}
        <div className="mb-4 px-1">
          <p className="text-sm text-gray-500">
            {tab === "adjectives" && "60 adjectivos comuns com tradução e exemplo de uso."}
            {tab === "adverbs" && "40 advérbios essenciais para descrever acções e qualidades."}
            {tab === "irregular" && "50 verbos irregulares com infinitivo, passado e particípio."}
            {tab === "regular" && "30 verbos regulares do dia a dia com exemplos."}
            {tab === "idioms" && "25 expressões idiomáticas comuns com significado e exemplo."}
          </p>
        </div>

        {/* Pesquisa */}
        <div className="relative mb-5">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder={`Pesquisar em ${activeTab.label.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>

        {/* Conteúdo */}
        {tab === "adjectives" && (
          <WordList words={VOCABULARY.adjectives.words} search={search} accentColor="violet" />
        )}
        {tab === "adverbs" && (
          <WordList words={VOCABULARY.adverbs.words} search={search} accentColor="amber" />
        )}
        {tab === "irregular" && (
          <IrregularVerbsTable search={search} />
        )}
        {tab === "regular" && (
          <WordList words={VOCABULARY.regularVerbs.words} search={search} accentColor="emerald" />
        )}
        {tab === "idioms" && (
          <IdiomsList search={search} />
        )}

      </div>
    </div>
  );
}
