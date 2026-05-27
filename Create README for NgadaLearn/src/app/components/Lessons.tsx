import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  BookOpen,
  Headphones,
  MessageCircle,
  Star,
  Play,
  CheckCircle2,
  Clock,
  Volume2,
  ChevronLeft,
  Lock,
} from "lucide-react";

export function Lessons() {
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const lessonCategories = [
    {
      id: "conversation",
      name: "Conversação",
      icon: MessageCircle,
      color: "purple",
      description: "Diálogos reais do cotidiano, trabalho e viagens",
      lessons: [
        { id: 1, title: "Apresentações e Saudações", level: "Iniciante", completed: true, duration: "15 min" },
        { id: 2, title: "Fazendo Compras", level: "Iniciante", completed: true, duration: "18 min" },
        { id: 3, title: "No Restaurante", level: "Intermediário", completed: false, duration: "20 min" },
        { id: 4, title: "Entrevista de Emprego", level: "Avançado", completed: false, duration: "25 min", soon: true },
        { id: 5, title: "Viagens e Turismo", level: "Intermediário", completed: false, duration: "22 min", soon: true },
      ],
    },
    {
      id: "ngadaflow",
      name: "NgadaFlow (Áudio)",
      icon: Headphones,
      color: "blue",
      description: "Treinamento de listening com sotaques reais",
      lessons: [
        { id: 6, title: "Sotaque Americano", level: "Iniciante", completed: true, duration: "20 min" },
        { id: 7, title: "Sotaque Britânico", level: "Intermediário", completed: false, duration: "25 min" },
        { id: 8, title: "Inglês em Alta Velocidade", level: "Avançado", completed: false, duration: "30 min", soon: true },
        { id: 9, title: "Inglês Australiano", level: "Avançado", completed: false, duration: "25 min", soon: true },
      ],
    },
    {
      id: "vocabulary",
      name: "Vocabulário",
      icon: Star,
      color: "orange",
      description: "Palavras e expressões que realmente usam no dia a dia",
      lessons: [
        { id: 10, title: "Frases de Viagem", level: "Iniciante", completed: true, duration: "15 min" },
        { id: 11, title: "Termos de Negócios", level: "Intermediário", completed: false, duration: "20 min" },
        { id: 12, title: "Tecnologia e Inovação", level: "Avançado", completed: false, duration: "18 min", soon: true },
        { id: 13, title: "Gírias e Expressões Idiomáticas", level: "Avançado", completed: false, duration: "22 min", soon: true },
      ],
    },
  ];

  const sampleExercise = {
    question: "Como você cumprimenta alguém formalmente em uma reunião de negócios?",
    options: [
      "Hey, what's up?",
      "Good morning, nice to meet you.",
      "Yo, how's it going?",
      "Hi there!",
    ],
    correctAnswer: "Good morning, nice to meet you.",
    explanation:
      "Em ambientes formais de negócios, o correto é usar cumprimentos como 'Good morning' ou 'Good afternoon', seguidos de uma apresentação profissional.",
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
  };

  const handleNextExercise = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setCurrentExercise((prev) => prev + 1);
  };

  const levelColor: Record<string, string> = {
    "Iniciante": "bg-green-100 text-green-700",
    "Intermediário": "bg-blue-100 text-blue-700",
    "Avançado": "bg-purple-100 text-purple-700",
  };

  /* ── Tela da aula em andamento ── */
  if (selectedLesson !== null) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => setSelectedLesson(null)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-700 mb-6 font-medium transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar às Aulas
            </button>

            <Card className="p-8 bg-white shadow-sm border-0 rounded-2xl">
              {/* Header da aula */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-2xl font-bold">No Restaurante</h2>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    Intermediário
                  </span>
                </div>
                <Progress value={33} className="h-2" />
                <p className="text-sm text-gray-500 mt-2">
                  Exercício {currentExercise + 1} de 10
                </p>
              </div>

              {/* Pergunta */}
              <div className="space-y-5">
                <div className="p-5 bg-purple-50 rounded-xl border border-purple-100">
                  <div className="flex items-start gap-3">
                    <MessageCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                    <h3 className="text-lg font-medium text-gray-800">{sampleExercise.question}</h3>
                  </div>
                </div>

                {/* Opções */}
                <div className="space-y-3">
                  {sampleExercise.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => !showResult && handleAnswerSelect(option)}
                      disabled={showResult}
                      className={`w-full p-4 text-left rounded-xl border-2 transition-all font-medium text-sm ${
                        showResult
                          ? option === sampleExercise.correctAnswer
                            ? "border-green-500 bg-green-50 text-green-800"
                            : option === selectedAnswer
                            ? "border-red-400 bg-red-50 text-red-700"
                            : "border-gray-200 bg-gray-50 text-gray-400 opacity-60"
                          : selectedAnswer === option
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 flex items-center justify-center rounded-full bg-white border text-xs font-bold flex-shrink-0">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="flex-1">{option}</span>
                        {showResult && option === sampleExercise.correctAnswer && (
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Resultado */}
                {showResult && (
                  <div
                    className={`p-5 rounded-xl border-2 ${
                      selectedAnswer === sampleExercise.correctAnswer
                        ? "bg-green-50 border-green-300"
                        : "bg-red-50 border-red-300"
                    }`}
                  >
                    <h4 className="font-bold mb-2">
                      {selectedAnswer === sampleExercise.correctAnswer
                        ? "🎉 Correto! Muito bem!"
                        : "❌ Não foi dessa vez"}
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {sampleExercise.explanation}
                    </p>
                  </div>
                )}

                <div className="flex justify-between pt-2">
                  <Button variant="outline" className="text-sm">
                    Pular
                  </Button>
                  {showResult ? (
                    <Button
                      onClick={handleNextExercise}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Próximo Exercício →
                    </Button>
                  ) : (
                    <Button
                      disabled={!selectedAnswer}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Verificar Resposta
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* NgadaFlow */}
            <Card className="p-5 mt-4 bg-gradient-to-r from-purple-600 to-blue-700 border-0 rounded-2xl">
              <div className="flex items-center gap-4 text-white">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Volume2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm">NgadaFlow — Prática de Áudio</h3>
                  <p className="text-xs text-purple-200">Ouça e repita após o falante nativo</p>
                </div>
                <Button size="sm" className="bg-white text-purple-700 hover:bg-gray-100 font-semibold">
                  <Play className="w-4 h-4 mr-1.5" />
                  Reproduzir
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  /* ── Lista de aulas ── */
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black mb-1 text-gray-900">Seu Plano de Estudos</h1>
            <p className="text-gray-600">
              Você tem acesso completo a todo o conteúdo — escolha por onde começar!
            </p>
          </div>

          {/* Progresso geral */}
          <Card className="p-5 mb-6 bg-white border-0 shadow-sm rounded-2xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-gray-700">Progresso geral do curso</span>
                  <span className="text-gray-500">24 de 100 aulas</span>
                </div>
                <Progress value={24} className="h-3" />
              </div>
              <div className="text-center md:text-right flex-shrink-0">
                <div className="text-2xl font-black text-purple-700">24%</div>
                <p className="text-xs text-gray-500">concluído</p>
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="conversation" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 h-12 rounded-xl bg-white shadow-sm border">
              {lessonCategories.map((cat) => (
                <TabsTrigger
                  key={cat.id}
                  value={cat.id}
                  className="flex items-center gap-2 text-sm rounded-lg data-[state=active]:bg-purple-600 data-[state=active]:text-white font-medium"
                >
                  <cat.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{cat.name}</span>
                  <span className="sm:hidden">{cat.name.split(" ")[0]}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {lessonCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="space-y-3">
                {/* Descrição da categoria */}
                <p className="text-sm text-gray-600 mb-4 px-1">{category.description}</p>

                {category.lessons.map((lesson) => (
                  <Card
                    key={lesson.id}
                    className={`p-5 bg-white border-0 shadow-sm rounded-2xl transition-all ${
                      lesson.soon
                        ? "opacity-60"
                        : "hover:shadow-md cursor-pointer hover:-translate-y-0.5"
                    }`}
                    onClick={() => !lesson.soon && setSelectedLesson(lesson.id)}
                  >
                    <div className="flex items-center gap-4">
                      {/* Ícone */}
                      <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          lesson.completed
                            ? "bg-green-100"
                            : lesson.soon
                            ? "bg-gray-100"
                            : "bg-purple-100"
                        }`}
                      >
                        {lesson.soon ? (
                          <Lock className="w-6 h-6 text-gray-400" />
                        ) : lesson.completed ? (
                          <CheckCircle2 className="w-7 h-7 text-green-600" />
                        ) : (
                          <category.icon className="w-7 h-7 text-purple-600" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 text-base">{lesson.title}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${levelColor[lesson.level]}`}>
                            {lesson.level}
                          </span>
                          {lesson.completed && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                              ✓ Concluída
                            </span>
                          )}
                          {lesson.soon && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs font-semibold">
                              🔜 Em breve
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Clock className="w-3.5 h-3.5" />
                          {lesson.duration}
                        </div>
                      </div>

                      {/* CTA */}
                      {!lesson.soon && (
                        <Button
                          className={`flex-shrink-0 font-semibold ${
                            lesson.completed
                              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              : "bg-purple-600 hover:bg-purple-700 text-white"
                          }`}
                          size="sm"
                        >
                          {lesson.completed ? "Rever" : (
                            <>
                              <Play className="w-3.5 h-3.5 mr-1.5" />
                              Iniciar
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
