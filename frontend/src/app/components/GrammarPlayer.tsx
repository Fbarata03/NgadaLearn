import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Card } from "./ui/card";
import { GRAMMAR_LESSONS, getGrammarById } from "../data/grammarData";
import {
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Volume2, CheckCircle2, XCircle, BookOpen, ArrowLeft,
} from "lucide-react";

const LEVEL_COLOR: Record<string, string> = {
  "Iniciante":     "bg-green-100 text-green-700 border-green-200",
  "Intermediário": "bg-blue-100 text-blue-700 border-blue-200",
  "Avançado":      "bg-purple-100 text-purple-700 border-purple-200",
};

function speak(text: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-GB";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

/* ── Card de regra expansível ── */
function RuleCard({ rule, index }: { rule: { title: string; explanation: string; examples: { en: string; pt: string }[] }; index: number }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <Card className="overflow-hidden border shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black flex-shrink-0">
            {index + 1}
          </div>
          <span className="font-bold text-gray-900">{rule.title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
      </button>

      {open && (
        <div className="px-5 pb-5 border-t bg-white">
          <p className="text-sm text-gray-700 leading-relaxed my-4">{rule.explanation}</p>
          <div className="space-y-2">
            {rule.examples.map((ex, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-indigo-900 text-sm">{ex.en}</p>
                  <p className="text-xs text-indigo-600 mt-0.5">{ex.pt}</p>
                </div>
                <button
                  onClick={() => speak(ex.en)}
                  className="flex-shrink-0 p-1.5 rounded-lg bg-white hover:bg-indigo-100 transition-colors border border-indigo-200"
                  title="Ouvir em inglês"
                >
                  <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

/* ── Quiz ── */
function QuizSection({ quiz }: { quiz: { question: string; options: string[]; correct: number; explanation: string }[] }) {
  const [answers, setAnswers] = useState<(number | null)[]>(quiz.map(() => null));
  const [showAll, setShowAll] = useState(false);

  const score = answers.filter((a, i) => a === quiz[i].correct).length;
  const allAnswered = answers.every((a) => a !== null);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
        🧠 Quick Quiz
      </h2>
      <div className="space-y-5">
        {quiz.map((q, qi) => {
          const answered = answers[qi] !== null;
          const isCorrect = answers[qi] === q.correct;

          return (
            <Card key={qi} className={`p-5 border-2 transition-colors ${answered ? (isCorrect ? "border-green-300 bg-green-50" : "border-red-200 bg-red-50") : "border-gray-200"}`}>
              <p className="font-semibold text-gray-900 mb-3 text-sm">
                <span className="text-indigo-600 font-black mr-2">{qi + 1}.</span>
                {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  let btnClass = "w-full text-left px-4 py-2.5 rounded-lg text-sm border transition-all ";
                  if (!answered) {
                    btnClass += "bg-white hover:bg-indigo-50 hover:border-indigo-300 border-gray-200";
                  } else if (oi === q.correct) {
                    btnClass += "bg-green-100 border-green-400 text-green-800 font-semibold";
                  } else if (oi === answers[qi]) {
                    btnClass += "bg-red-100 border-red-300 text-red-700";
                  } else {
                    btnClass += "bg-gray-50 border-gray-100 text-gray-400";
                  }

                  return (
                    <button
                      key={oi}
                      disabled={answered}
                      onClick={() => {
                        const newAnswers = [...answers];
                        newAnswers[qi] = oi;
                        setAnswers(newAnswers);
                      }}
                      className={btnClass}
                    >
                      <span className="font-bold mr-2">{String.fromCharCode(65 + oi)}.</span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {answered && (
                <div className={`mt-3 flex items-start gap-2 text-xs p-2.5 rounded-lg ${isCorrect ? "bg-green-100" : "bg-red-100"}`}>
                  {isCorrect
                    ? <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    : <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  }
                  <span className={isCorrect ? "text-green-800" : "text-red-700"}>{q.explanation}</span>
                </div>
              )}
            </Card>
          );
        })}
      </div>
      {allAnswered && !showAll && (
        <div className="mt-5 p-4 bg-indigo-600 rounded-xl text-white text-center">
          <p className="text-2xl font-black">{score}/{quiz.length}</p>
          <p className="text-sm text-indigo-200 mt-1">
            {score === quiz.length ? "Perfeito! Excelente trabalho! 🎉" : score >= quiz.length / 2 ? "Bom resultado! Continua a praticar." : "Revê as regras e tenta de novo."}
          </p>
          <button onClick={() => setShowAll(true)} className="mt-2 text-xs underline text-indigo-300">
            Ver revisão completa
          </button>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════
   COMPONENTE PRINCIPAL
   ══════════════════════════════ */
export function GrammarPlayer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lesson = getGrammarById(id ?? "");

  // Cleanup: para TTS ao sair da página
  useEffect(() => {
    return () => { window.speechSynthesis?.cancel(); };
  }, []);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Lição não encontrada.</p>
          <Link to="/lessons" className="text-indigo-600 font-semibold hover:underline">
            ← Voltar às lições
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = GRAMMAR_LESSONS.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? GRAMMAR_LESSONS[currentIndex - 1] : null;
  const nextLesson = currentIndex < GRAMMAR_LESSONS.length - 1 ? GRAMMAR_LESSONS[currentIndex + 1] : null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-3xl">

        {/* Back */}
        <Link to="/lessons" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors mb-5 min-h-[44px] -ml-1 px-1">
          <ArrowLeft className="w-5 h-5" />
          Lições
        </Link>

        {/* Header da lição */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-indigo-600 to-indigo-800 border-0 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl">{lesson.icon}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${LEVEL_COLOR[lesson.level]}`}>
                  {lesson.level}
                </span>
              </div>
              <h1 className="text-2xl font-black text-white">{lesson.title}</h1>
              <p className="text-indigo-200 font-medium">{lesson.titlePt}</p>
              <span className="mt-2 inline-block px-2 py-0.5 bg-indigo-500 rounded text-xs text-indigo-100">
                {lesson.topic}
              </span>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <p className="text-xs text-indigo-300 mt-1">Lição {lesson.number}</p>
            </div>
          </div>
        </Card>

        {/* Introdução */}
        <Card className="p-5 mb-6 bg-white border shadow-sm">
          <h2 className="font-bold text-gray-900 mb-2 text-sm uppercase tracking-wide text-indigo-600">Introdução</h2>
          <p className="text-gray-700 leading-relaxed">{lesson.intro}</p>
        </Card>

        {/* Regras */}
        <div className="space-y-3 mb-6">
          <h2 className="text-lg font-black text-gray-900">Regras e Exemplos</h2>
          {lesson.rules.map((rule, i) => (
            <RuleCard key={i} rule={rule} index={i} />
          ))}
        </div>

        {/* Dica */}
        <Card className="p-5 mb-6 bg-amber-50 border-amber-200 border">
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">💡</span>
            <div>
              <p className="font-bold text-amber-800 text-sm mb-1">Dica do Professor</p>
              <p className="text-amber-700 text-sm leading-relaxed">{lesson.tip}</p>
            </div>
          </div>
        </Card>

        {/* Quiz */}
        {lesson.quickQuiz && lesson.quickQuiz.length > 0 && (
          <QuizSection quiz={lesson.quickQuiz} />
        )}

        {/* Navegação */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          <button
            onClick={() => prevLesson && navigate(`/grammar/${prevLesson.id}`)}
            disabled={!prevLesson}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-white border hover:border-indigo-300 hover:shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            {prevLesson ? prevLesson.titlePt : "Anterior"}
          </button>

          <Link
            to="/lessons"
            className="text-xs text-gray-400 hover:text-indigo-600 transition-colors"
          >
            {currentIndex + 1} / {GRAMMAR_LESSONS.length}
          </Link>

          <button
            onClick={() => nextLesson && navigate(`/grammar/${nextLesson.id}`)}
            disabled={!nextLesson}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {nextLesson ? nextLesson.titlePt : "Seguinte"}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
