import { useState } from "react";
import { Link } from "react-router";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { MessageCircle, CheckCircle2, Lock, PlayCircle, Star, Headphones } from "lucide-react";

const DEMO_EXERCISE = {
  question: "Como você cumprimenta alguém pela primeira vez em inglês?",
  options: [
    "Hey, what's up?",
    "Nice to meet you!",
    "See you later!",
    "Good night!",
  ],
  correctAnswer: "Nice to meet you!",
  explanation:
    "\"Nice to meet you!\" é a forma mais comum e educada de cumprimentar alguém pela primeira vez. Significa \"Prazer em conhecê-lo(a)!\"",
};

const LOCKED_LESSONS = [
  { title: "Fazendo Compras", module: "Conversação", icon: "🛒" },
  { title: "No Restaurante", module: "Conversação", icon: "🍽️" },
  { title: "Sotaque Americano", module: "NgadaFlow", icon: "🎧" },
  { title: "Inglês Profissional", module: "Negócios", icon: "💼" },
  { title: "Entrevista de Emprego", module: "Avançado", icon: "🎯" },
  { title: "E muito mais...", module: "50+ aulas", icon: "🚀" },
];

export function Demo() {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (opt: string) => {
    if (showResult) return;
    setSelectedAnswer(opt);
    setShowResult(true);
  };

  const playAudioDemo = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance("Nice to meet you!");
    u.lang = "en-US";
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner de demo */}
      <div className="bg-gradient-to-r from-purple-700 to-blue-700 text-white py-3">
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium">
            🎓 Você está vendo uma <strong>demonstração gratuita</strong> — apenas 1 aula de 50+
          </p>
          <Link to="/subscribe">
            <Button size="sm" className="bg-white text-purple-700 hover:bg-gray-100 font-bold text-xs">
              Comprar Acesso Completo — US$ 150
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* ── Aula demo ── */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wide">
                  Aula Gratuita · Módulo 1
                </span>
                <h1 className="text-2xl font-black text-gray-900 mt-1">
                  Apresentações e Saudações
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Aprenda as expressões essenciais para se apresentar em inglês
                </p>
              </div>

              {/* Exercício */}
              <Card className="p-6 border-0 shadow-sm rounded-2xl">
                <div className="flex items-center gap-2 mb-5 text-xs text-gray-500 font-medium">
                  <MessageCircle className="w-4 h-4 text-purple-600" />
                  Exercício 1 de 1 (demonstração)
                </div>

                {/* Pergunta */}
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 mb-5">
                  <p className="font-semibold text-gray-800">{DEMO_EXERCISE.question}</p>
                </div>

                {/* Opções */}
                <div className="space-y-3">
                  {DEMO_EXERCISE.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(opt)}
                      disabled={showResult}
                      className={`w-full p-4 text-left rounded-xl border-2 transition-all text-sm font-medium ${
                        showResult
                          ? opt === DEMO_EXERCISE.correctAnswer
                            ? "border-green-500 bg-green-50 text-green-800"
                            : opt === selectedAnswer
                            ? "border-red-400 bg-red-50 text-red-700"
                            : "border-gray-200 bg-gray-50 text-gray-400 opacity-60"
                          : "border-gray-200 hover:border-purple-300 hover:bg-purple-50 cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 flex items-center justify-center rounded-full bg-white border text-xs font-bold flex-shrink-0">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span>{opt}</span>
                        {showResult && opt === DEMO_EXERCISE.correctAnswer && (
                          <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Resultado */}
                {showResult && (
                  <div className={`mt-5 p-4 rounded-xl border-2 ${
                    selectedAnswer === DEMO_EXERCISE.correctAnswer
                      ? "bg-green-50 border-green-300"
                      : "bg-orange-50 border-orange-300"
                  }`}>
                    <p className="font-bold mb-1">
                      {selectedAnswer === DEMO_EXERCISE.correctAnswer
                        ? "🎉 Correto! Muito bem!"
                        : "❌ Não foi dessa vez — veja a explicação:"}
                    </p>
                    <p className="text-sm text-gray-700">{DEMO_EXERCISE.explanation}</p>
                  </div>
                )}
              </Card>

              {/* Áudio demo */}
              <Card className="p-5 bg-gradient-to-r from-purple-600 to-blue-700 border-0 rounded-2xl text-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Headphones className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">NgadaFlow — Áudio com Nativo</p>
                    <p className="text-xs text-purple-200">
                      Ouça e repita: "Nice to meet you!"
                    </p>
                  </div>
                  <Button onClick={playAudioDemo} size="sm" className="bg-white text-purple-700 hover:bg-gray-100 font-semibold flex-shrink-0">
                    <PlayCircle className="w-4 h-4 mr-1.5" />
                    Ouvir
                  </Button>
                </div>
              </Card>

              {/* CTA após demo */}
              <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 rounded-2xl text-center">
                <div className="text-4xl mb-3">🔓</div>
                <h3 className="text-xl font-black mb-2 text-gray-900">
                  Gostou? Desbloqueie tudo!
                </h3>
                <p className="text-gray-600 text-sm mb-5">
                  Você tem acesso a apenas 1 aula gratuita. Compre o curso e tenha
                  acesso a todas as 50+ aulas, NgadaFlow completo e certificados.
                </p>
                <Link to="/subscribe">
                  <Button
                    size="lg"
                    className="bg-purple-600 hover:bg-purple-700 px-8 font-bold"
                  >
                    Garantir Acesso Completo — US$ 150
                  </Button>
                </Link>
                <p className="text-xs text-gray-500 mt-3">
                  Pagamento único · Acesso para sempre
                </p>
              </Card>
            </div>

            {/* ── Sidebar: o que você perde ── */}
            <div className="space-y-5">
              <Card className="p-5 border-0 shadow-sm rounded-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="w-4 h-4 text-gray-400" />
                  <h3 className="font-bold text-sm text-gray-700">
                    Bloqueado — disponível após compra
                  </h3>
                </div>
                <div className="space-y-3">
                  {LOCKED_LESSONS.map((lesson) => (
                    <div
                      key={lesson.title}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl opacity-60"
                    >
                      <span className="text-xl">{lesson.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">{lesson.title}</p>
                        <p className="text-xs text-gray-500">{lesson.module}</p>
                      </div>
                      <Lock className="w-4 h-4 text-gray-400 ml-auto flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Avaliações */}
              <Card className="p-5 border-0 shadow-sm rounded-2xl">
                <div className="flex gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-xs font-bold text-gray-800 mb-3">4.9 · 1.842 avaliações</p>
                <p className="text-xs text-gray-600 italic">
                  "Depois de 3 meses, consegui meu primeiro emprego internacional!"
                </p>
                <p className="text-xs text-gray-400 mt-2">— Maria S., São Paulo</p>
              </Card>

              <Link to="/subscribe">
                <Button
                  size="lg"
                  className="w-full bg-purple-600 hover:bg-purple-700 font-bold py-5"
                >
                  Comprar por US$ 150 →
                </Button>
              </Link>
              <p className="text-center text-xs text-gray-500">
                Pagamento único · Acesso para sempre
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

