import { useState } from "react";
import { Link } from "react-router";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { MessageCircle, CheckCircle2, Lock, PlayCircle, Star, Headphones } from "lucide-react";

const DEMO_EXERCISE = {
  question: "Como se cumprimenta alguém pela primeira vez em inglês?",
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
            🎓 Estás a ver uma <strong>demonstração gratuita</strong> — apenas 1 aula de 50+
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
                <div className="flex items-center gap-2 mb-5">
                  <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5" />
                    Exercício 1 de 1 · Demonstração gratuita
                  </span>
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
                        <span className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-black flex-shrink-0 transition-colors ${
                          showResult
                            ? opt === DEMO_EXERCISE.correctAnswer ? "bg-green-500 text-white" : opt === selectedAnswer ? "bg-red-400 text-white" : "bg-gray-200 text-gray-500"
                            : "bg-purple-100 text-purple-700"
                        }`}>
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
              <Card className="p-6 bg-gradient-to-br from-purple-600 to-indigo-700 border-0 rounded-2xl text-center text-white overflow-hidden relative">
                <div className="absolute inset-0 opacity-10">
                  <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=60" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-black mb-2">
                  Gostaste? Desbloqueia tudo!
                </h3>
                <p className="text-purple-100 text-sm mb-5">
                  Tens acesso a apenas 1 aula gratuita. Compra o curso e acede
                  a todas as 50+ aulas, NgadaFlow completo e certificados.
                </p>
                <Link to="/subscribe">
                  <Button
                    size="lg"
                    className="bg-white text-purple-700 hover:bg-purple-50 px-8 font-bold shadow-md"
                  >
                    Garantir Acesso Completo — US$ 150
                  </Button>
                </Link>
                <p className="text-xs text-purple-200 mt-3">
                  Pagamento único · Acesso para sempre · ≈ €138
                </p>
                </div>
              </Card>
            </div>

            {/* ── Sidebar: o que perdes ── */}
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
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm font-black text-gray-800">4.9</span>
                  <span className="text-xs text-gray-400">· 1.842 avaliações</span>
                </div>
                <div className="flex items-start gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=face"
                    alt="Maria S."
                    className="w-9 h-9 rounded-full object-cover flex-shrink-0 border-2 border-purple-100"
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Maria+S&background=7c3aed&color=fff&size=48"; }}
                  />
                  <div>
                    <p className="text-xs text-gray-600 italic leading-relaxed">
                      "Depois de 3 meses, consegui o meu primeiro emprego internacional!"
                    </p>
                    <p className="text-xs font-semibold text-gray-700 mt-1.5">Maria S. <span className="text-green-600">✓ Verificado</span></p>
                    <p className="text-[10px] text-gray-400">São Paulo, BR</p>
                  </div>
                </div>
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

