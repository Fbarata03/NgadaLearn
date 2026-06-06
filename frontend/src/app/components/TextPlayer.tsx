import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { TEXTS } from "../data/textsData";
import {
  ChevronLeft, ChevronRight, Volume2, VolumeX, BookOpen,
  Lightbulb, CheckCircle2, HelpCircle, Trophy, RotateCcw,
} from "lucide-react";

/* ── TTS ── */
function speak(text: string) {
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = "en-US";
  utt.rate = 0.88;
  const voices = window.speechSynthesis.getVoices();
  const v = voices.find(
    v => v.lang.startsWith("en") &&
      (v.name.includes("Google") || v.name.includes("Microsoft") || v.name.includes("Samantha"))
  );
  if (v) utt.voice = v;
  window.speechSynthesis.speak(utt);
}

const LEVEL_STYLE: Record<string, string> = {
  "Iniciante":     "bg-green-100 text-green-700",
  "Intermediário": "bg-blue-100 text-blue-700",
  "Avançado":      "bg-purple-100 text-purple-700",
};

export function TextPlayer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const text = TEXTS.find(t => t.id === id);

  const [paraIdx, setParaIdx]         = useState(0);
  const [showPt, setShowPt]           = useState<Set<number>>(new Set());
  const [autoRead, setAutoRead]       = useState(false);
  const [done, setDone]               = useState(false);
  const [showVocab, setShowVocab]     = useState(false);
  const [quizIdx, setQuizIdx]         = useState(0);
  const [quizDone, setQuizDone]       = useState<Set<number>>(new Set());
  const [showAnswer, setShowAnswer]   = useState(false);
  const [mode, setMode]               = useState<"read" | "quiz">("read");

  useEffect(() => {
    window.speechSynthesis.getVoices();
  }, []);

  useEffect(() => {
    if (autoRead && text && paraIdx < text.paragraphs.length) {
      speak(text.paragraphs[paraIdx].en);
    }
  }, [paraIdx, autoRead, text]);

  if (!text) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Texto não encontrado.</p>
          <Link to="/lessons"><Button>Voltar</Button></Link>
        </div>
      </div>
    );
  }

  const totalParas = text.paragraphs.length;
  const pct = Math.round((paraIdx / totalParas) * 100);
  const nextText = TEXTS.find(t => t.number === text.number + 1);

  function revealPt(i: number) {
    setShowPt(prev => new Set([...prev, i]));
  }

  function handleNext() {
    if (paraIdx < totalParas - 1) {
      setParaIdx(n => n + 1);
    } else {
      window.speechSynthesis.cancel();
      setDone(true);
    }
  }

  function handlePrev() {
    if (paraIdx > 0) setParaIdx(n => n - 1);
  }

  function handleRestart() {
    setParaIdx(0);
    setShowPt(new Set());
    setDone(false);
    setMode("read");
    setQuizIdx(0);
    setQuizDone(new Set());
    setShowAnswer(false);
  }

  /* ── COMPLETION ── */
  if (done && mode === "read") {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📖</div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Texto Concluído!</h2>
            <p className="text-gray-600 mb-6">Leste o texto <strong>"{text.title}"</strong></p>

            {/* Vocabulário */}
            <Card className="p-5 mb-5 text-left">
              <button
                onClick={() => setShowVocab(!showVocab)}
                className="w-full flex items-center justify-between"
              >
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  Vocabulário ({text.vocabulary.length} palavras)
                </h3>
                <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${showVocab ? "rotate-90" : ""}`} />
              </button>
              {showVocab && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {text.vocabulary.map((v, i) => (
                    <div key={i} className="p-2.5 bg-purple-50 rounded-lg">
                      <p className="text-sm font-bold text-purple-800">{v.word}</p>
                      <p className="text-xs text-gray-600">{v.meaning}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Dica */}
            <Card className="p-4 mb-5 bg-yellow-50 border-yellow-200 text-left">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">{text.tip}</p>
              </div>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {text.comprehensionQ && text.comprehensionQ.length > 0 && (
                <Button
                  onClick={() => { setMode("quiz"); setDone(false); }}
                  className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
                >
                  <HelpCircle className="w-4 h-4" />
                  Fazer Quiz
                </Button>
              )}
              <Button variant="outline" onClick={handleRestart} className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Reler
              </Button>
              {nextText && (
                <Link to={`/texts/${nextText.id}`}>
                  <Button variant="outline" className="flex items-center gap-2">
                    Próximo Texto
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── QUIZ ── */
  if (mode === "quiz" && text.comprehensionQ) {
    const q = text.comprehensionQ[quizIdx];
    const allDone = quizDone.size === text.comprehensionQ.length;

    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <button onClick={() => navigate("/lessons")} className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-purple-700 transition-colors mb-4 min-h-[44px]">
            <ChevronLeft className="w-5 h-5" /> Lições
          </button>

          {allDone ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-black mb-2">Quiz Completo!</h2>
              <p className="text-gray-600 mb-6">Respondeste {text.comprehensionQ.length} pergunta{text.comprehensionQ.length > 1 ? "s" : ""}.</p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={handleRestart}>Recomeçar</Button>
                {nextText && (
                  <Link to={`/texts/${nextText.id}`}>
                    <Button className="bg-purple-600 hover:bg-purple-700">Próximo Texto →</Button>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <Card className="p-6">
              <p className="text-xs text-purple-600 font-bold mb-4">
                PERGUNTA {quizIdx + 1} de {text.comprehensionQ.length}
              </p>
              <div className="p-4 bg-purple-50 rounded-xl mb-5">
                <p className="font-bold text-gray-900">{q.question}</p>
              </div>
              {showAnswer ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl mb-5">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-green-800 mb-1">Resposta:</p>
                      <p className="text-sm text-gray-800">{q.answer}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => setShowAnswer(true)}
                  variant="outline"
                  className="w-full mb-5"
                >
                  Ver Resposta
                </Button>
              )}
              {showAnswer && (
                <Button
                  onClick={() => {
                    setQuizDone(prev => new Set([...prev, quizIdx]));
                    if (quizIdx < (text.comprehensionQ?.length ?? 0) - 1) {
                      setQuizIdx(n => n + 1);
                      setShowAnswer(false);
                    }
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Próxima Pergunta →
                </Button>
              )}
            </Card>
          )}
        </div>
      </div>
    );
  }

  /* ── LEITURA ── */
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 max-w-3xl">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => navigate("/lessons")}
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-4 h-4" /> Lições
            </button>
            <div className="text-center flex-1 min-w-0">
              <p className="text-xs text-purple-600 font-bold">
                Texto {text.number} de {TEXTS.length}
              </p>
              <p className="font-bold text-gray-900 text-sm truncate">{text.title}</p>
            </div>
            <button
              onClick={() => setAutoRead(v => !v)}
              className={`p-2 rounded-lg transition-colors ${autoRead ? "bg-purple-100 text-purple-600" : "text-gray-400 hover:bg-gray-100"}`}
            >
              {autoRead ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
          {/* Progresso */}
          <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-600 rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-5">
          <span className={`px-3 py-1 text-xs font-bold rounded-full ${LEVEL_STYLE[text.level]}`}>{text.level}</span>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">{text.topic}</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">{totalParas} parágrafos</span>
        </div>

        {/* Parágrafo actual */}
        <Card className="p-6 mb-4 shadow-sm">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs text-purple-600 font-bold">
              Parágrafo {paraIdx + 1} de {totalParas}
            </span>
            <button
              onClick={() => speak(text.paragraphs[paraIdx].en)}
              className="flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-800"
            >
              <Volume2 className="w-3.5 h-3.5" /> Ouvir
            </button>
          </div>
          <p className="text-base leading-relaxed text-gray-900 font-medium mb-3">
            {text.paragraphs[paraIdx].en}
          </p>
          {showPt.has(paraIdx) ? (
            <p className="text-sm leading-relaxed text-gray-500 border-t pt-3">
              {text.paragraphs[paraIdx].pt}
            </p>
          ) : (
            <button
              onClick={() => revealPt(paraIdx)}
              className="text-xs text-purple-600 underline hover:text-purple-800"
            >
              Ver tradução em português
            </button>
          )}
        </Card>

        {/* Navegação */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="outline" onClick={handlePrev} disabled={paraIdx === 0} className="flex-1">
            <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
          </Button>
          <Button
            onClick={handleNext}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            {paraIdx === totalParas - 1 ? (
              <><Trophy className="w-4 h-4 mr-1" /> Concluir</>
            ) : (
              <>Próximo <ChevronRight className="w-4 h-4 ml-1" /></>
            )}
          </Button>
        </div>

        {/* Todos os parágrafos (modo resumo) */}
        <Card className="p-5 mb-4">
          <h3 className="font-bold text-gray-900 text-sm mb-3">Visão geral do texto</h3>
          <div className="space-y-3">
            {text.paragraphs.map((p, i) => (
              <div
                key={i}
                onClick={() => setParaIdx(i)}
                className={`p-3 rounded-lg cursor-pointer transition-all text-sm ${
                  i === paraIdx
                    ? "bg-purple-100 border border-purple-300"
                    : i < paraIdx
                    ? "bg-green-50 border border-green-200"
                    : "bg-gray-50 border border-gray-200 opacity-60"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {i < paraIdx ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                  ) : (
                    <div className={`w-3.5 h-3.5 rounded-full flex-shrink-0 ${i === paraIdx ? "bg-purple-600" : "bg-gray-300"}`} />
                  )}
                  <span className="text-xs font-bold text-gray-500">§{i + 1}</span>
                </div>
                <p className="text-gray-700 line-clamp-2 text-xs leading-relaxed">{p.en}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Vocabulário */}
        <Card className="p-5 mb-4">
          <button
            onClick={() => setShowVocab(!showVocab)}
            className="w-full flex items-center justify-between"
          >
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-600" />
              Vocabulário ({text.vocabulary.length} palavras)
            </h3>
            <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${showVocab ? "rotate-90" : ""}`} />
          </button>
          {showVocab && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {text.vocabulary.map((v, i) => (
                <div key={i} className="p-2.5 bg-purple-50 rounded-lg flex items-start gap-2">
                  <button
                    onClick={() => speak(v.word)}
                    className="mt-0.5 flex-shrink-0 text-purple-500 hover:text-purple-700"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <div>
                    <p className="text-sm font-bold text-purple-800">{v.word}</p>
                    <p className="text-xs text-gray-600">{v.meaning}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Dica */}
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-yellow-800 mb-0.5">Dica Gramatical</p>
              <p className="text-xs text-gray-700">{text.tip}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
