import { useState, useMemo } from "react";
import { Link } from "react-router";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { PHRASE_CATEGORIES, TOTAL_PHRASES, type PhraseCategory } from "../data/phrasesData";
import { Volume2, Search, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";

function speak(text: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-GB";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

/* ── Card de Categoria ── */
function CategoryCard({
  category,
  isActive,
  onToggle,
  searchQuery,
}: {
  category: PhraseCategory;
  isActive: boolean;
  onToggle: () => void;
  searchQuery: string;
}) {
  const filteredPhrases = useMemo(() => {
    if (!searchQuery) return category.phrases;
    const q = searchQuery.toLowerCase();
    return category.phrases.filter(
      (p) => p.en.toLowerCase().includes(q) || p.pt.toLowerCase().includes(q)
    );
  }, [category.phrases, searchQuery]);

  if (searchQuery && filteredPhrases.length === 0) return null;

  return (
    <Card className="overflow-hidden border shadow-sm">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${category.color} flex items-center justify-center text-xl flex-shrink-0`}>
            {category.icon}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{category.title}</p>
            <p className="text-xs text-gray-500">{category.titlePt} · {filteredPhrases.length} frases</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
            {filteredPhrases.length}
          </span>
          {isActive ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {(isActive || searchQuery) && (
        <div className="border-t bg-white divide-y divide-gray-50">
          {filteredPhrases.map((phrase, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{phrase.en}</p>
                <p className="text-xs text-gray-500 mt-0.5">{phrase.pt}</p>
              </div>
              <button
                onClick={() => speak(phrase.en)}
                className="flex-shrink-0 p-2 rounded-lg hover:bg-indigo-50 transition-colors group"
                title="Ouvir frase"
              >
                <Volume2 className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

/* ══════════════════════════════
   COMPONENTE PRINCIPAL
   ══════════════════════════════ */
export function PhrasesViewer() {
  const [activeCategory, setActiveCategory] = useState<string | null>("greetings");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");

  const isSearching = search.trim().length > 0;

  const toggleCategory = (id: string) => {
    setActiveCategory((prev) => (prev === id ? null : id));
  };

  const filteredCategories = useMemo(() => {
    if (activeTab === "all") return PHRASE_CATEGORIES;
    return PHRASE_CATEGORIES.filter((c) => c.id === activeTab);
  }, [activeTab]);

  const totalVisible = useMemo(() => {
    if (!isSearching) return TOTAL_PHRASES;
    const q = search.toLowerCase();
    return PHRASE_CATEGORIES.reduce((sum, cat) => {
      return sum + cat.phrases.filter((p) => p.en.toLowerCase().includes(q) || p.pt.toLowerCase().includes(q)).length;
    }, 0);
  }, [search, isSearching]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-3xl">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
          <Link to="/lessons" className="hover:text-pink-600 flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Lições
          </Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">Frases Essenciais</span>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-black text-gray-900 mb-1">Frases Essenciais</h1>
          <p className="text-gray-600">{TOTAL_PHRASES} frases · 7 categorias · Do quotidiano ao profissional</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <Card className="p-3 text-center border-0 bg-pink-600 text-white">
            <p className="text-xl font-black">{TOTAL_PHRASES}</p>
            <p className="text-xs text-pink-200">Frases</p>
          </Card>
          <Card className="p-3 text-center border-0 bg-pink-500 text-white">
            <p className="text-xl font-black">{PHRASE_CATEGORIES.length}</p>
            <p className="text-xs text-pink-100">Categorias</p>
          </Card>
          <Card className="p-3 text-center border-0 bg-pink-400 text-white col-span-2">
            <p className="text-xl font-black">🔊</p>
            <p className="text-xs text-white">TTS em todas as frases</p>
          </Card>
        </div>

        {/* Tabs de categoria */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === "all" ? "bg-pink-600 text-white shadow" : "bg-white border text-gray-600 hover:border-pink-300"}`}
          >
            Todas
          </button>
          {PHRASE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveTab(cat.id);
                setActiveCategory(cat.id);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === cat.id ? "bg-pink-600 text-white shadow" : "bg-white border text-gray-600 hover:border-pink-300"}`}
            >
              <span>{cat.icon}</span>
              {cat.titlePt}
            </button>
          ))}
        </div>

        {/* Pesquisa */}
        <div className="relative mb-5">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Pesquisar frase em inglês ou português..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white"
          />
          {isSearching && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              {totalVisible} resultado{totalVisible !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Lista de categorias */}
        <div className="space-y-3">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              isActive={activeCategory === category.id}
              onToggle={() => toggleCategory(category.id)}
              searchQuery={isSearching ? search : ""}
            />
          ))}
        </div>

        {isSearching && totalVisible === 0 && (
          <p className="text-center text-gray-400 py-12">Nenhuma frase encontrada para "{search}".</p>
        )}

      </div>
    </div>
  );
}
