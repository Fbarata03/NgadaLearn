import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Link } from "react-router";
import { useProgress } from "../hooks/useProgress";
import { useAuth } from "../context/AuthContext";
import {
  ASSIMIL_LESSONS, PIMSLEUR_LESSONS_LIST, LEITURAS_LIST, ALL_LESSONS,
} from "../data/lessonsData";
import {
  BookOpen, Headphones, Award, TrendingUp, Calendar,
  Target, Clock, Flame, ChevronRight, PlayCircle,
} from "lucide-react";

export function Dashboard() {
  const { user } = useAuth();
  const { totalCompleted, totalMinutes, streak, lastOpened, isCompleted } = useProgress();

  const totalAll = ALL_LESSONS.length;
  const pct = Math.round((totalCompleted / totalAll) * 100);

  // Próximas lições não concluídas
  const nextAssimil = ASSIMIL_LESSONS.find(l => !isCompleted(l.id));
  const nextPimsleur = PIMSLEUR_LESSONS_LIST.find(l => !isCompleted(l.id));
  const nextLeitura = LEITURAS_LIST.find(l => !isCompleted(l.id));

  const nextLessons = [nextAssimil, nextPimsleur, nextLeitura].filter(Boolean);

  // Aulas feitas por categoria
  const doneAssimil = ASSIMIL_LESSONS.filter(l => isCompleted(l.id)).length;
  const donePimsleur = PIMSLEUR_LESSONS_LIST.filter(l => isCompleted(l.id)).length;
  const doneLeituras = LEITURAS_LIST.filter(l => isCompleted(l.id)).length;

  const level = pct < 20 ? "Iniciante" : pct < 50 ? "Elementar" : pct < 75 ? "Intermediário" : "Avançado";
  const nextLevel = pct < 20 ? "Elementar" : pct < 50 ? "Intermediário" : pct < 75 ? "Avançado" : "Fluente";

  // Conquistas
  const achievements = [
    { emoji: "🏆", title: "Primeira Aula", desc: "Complete 1 aula", unlocked: totalCompleted >= 1 },
    { emoji: "🔥", title: "Em Chamas", desc: "3 dias seguidos", unlocked: streak >= 3 },
    { emoji: "📚", title: "Assimil Iniciado", desc: "5 lições Assimil", unlocked: doneAssimil >= 5 },
    { emoji: "🎧", title: "Ouvido Afinado", desc: "5 aulas Pimsleur", unlocked: donePimsleur >= 5 },
    { emoji: "⭐", title: "Dedicado", desc: "10 aulas totais", unlocked: totalCompleted >= 10 },
    { emoji: "🌍", title: "Explorador", desc: "25 aulas totais", unlocked: totalCompleted >= 25 },
    { emoji: "💎", title: "Comprometido", desc: "50 aulas totais", unlocked: totalCompleted >= 50 },
    { emoji: "🏅", title: "Mestre do Inglês", desc: "100 aulas totais", unlocked: totalCompleted >= 100 },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* ── Boas-vindas ── */}
          <div className="bg-gradient-to-r from-purple-700 to-blue-700 rounded-2xl p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-black mb-1">
                  Bem-vindo{user?.name ? `, ${user.name.split(" ")[0]}` : ""}! 👋
                </h1>
                <p className="text-purple-200">
                  {totalCompleted === 0
                    ? "Comece sua primeira aula hoje — a jornada para a fluência começa aqui!"
                    : `Continue sua jornada — ${totalCompleted} aula${totalCompleted > 1 ? "s" : ""} concluída${totalCompleted > 1 ? "s" : ""}!`}
                </p>
                {streak > 0 && (
                  <div className="flex items-center gap-2 mt-3 text-sm">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="font-semibold">{streak} dia{streak > 1 ? "s" : ""} de sequência 🔥</span>
                  </div>
                )}
              </div>
              <Link to="/lessons">
                <Button size="lg" className="bg-white text-purple-700 hover:bg-gray-100 font-bold flex items-center gap-2">
                  <PlayCircle className="w-5 h-5" />
                  {lastOpened ? "Continuar" : "Começar a Aprender"}
                </Button>
              </Link>
            </div>
          </div>

          {/* ── Cards de estatísticas ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 bg-white border-0 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-3xl font-black text-gray-900">{totalCompleted}</span>
              </div>
              <p className="text-xs text-gray-500 font-medium">Aulas Concluídas</p>
              <Progress value={pct} className="mt-2 h-1.5" />
              <p className="text-xs text-gray-400 mt-1">{totalCompleted}/{totalAll} total</p>
            </Card>

            <Card className="p-5 bg-white border-0 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-500" />
                </div>
                <span className="text-3xl font-black text-gray-900">{streak}</span>
              </div>
              <p className="text-xs text-gray-500 font-medium">Dias de Sequência 🔥</p>
              <p className="text-xs text-orange-500 mt-1 font-medium">
                {streak === 0 ? "Comece hoje!" : streak >= 7 ? "Incrível!" : "Continue assim!"}
              </p>
            </Card>

            <Card className="p-5 bg-white border-0 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-3xl font-black text-gray-900">{totalMinutes}</span>
              </div>
              <p className="text-xs text-gray-500 font-medium">Minutos Estudados</p>
              <p className="text-xs text-gray-400 mt-1">≈ {Math.round(totalMinutes / 60)}h de estudo</p>
            </Card>

            <Card className="p-5 bg-white border-0 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-yellow-600" />
                </div>
                <span className="text-lg font-black text-gray-900">{level}</span>
              </div>
              <p className="text-xs text-gray-500 font-medium">Nível Atual</p>
              <p className="text-xs text-gray-400 mt-1">Próximo: {nextLevel}</p>
            </Card>
          </div>

          {/* ── Progresso por módulo ── */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-white border-0 shadow-sm">
              <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Progresso por Módulo
              </h2>
              <div className="space-y-5">
                {[
                  { label: "Assimil", value: doneAssimil, total: ASSIMIL_LESSONS.length, color: "bg-purple-600" },
                  { label: "Pimsleur", value: donePimsleur, total: PIMSLEUR_LESSONS_LIST.length, color: "bg-blue-600" },
                  { label: "Leituras", value: doneLeituras, total: LEITURAS_LIST.length, color: "bg-green-600" },
                  { label: "Total Geral", value: totalCompleted, total: totalAll, color: "bg-gray-800" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between mb-1.5 text-sm">
                      <span className="font-medium text-gray-700">{item.label}</span>
                      <span className="text-gray-500">{item.value}/{item.total} lições</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${item.color}`}
                        style={{ width: `${item.total > 0 ? (item.value / item.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* ── Próximas aulas ── */}
            <Card className="p-6 bg-white border-0 shadow-sm">
              <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Próximas Aulas
              </h2>
              <div className="space-y-3">
                {nextLessons.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Award className="w-10 h-10 mx-auto mb-2 text-yellow-400" />
                    <p className="font-bold">Parabéns! Concluiu tudo!</p>
                  </div>
                ) : (
                  nextLessons.map((lesson) => lesson && (
                    <Link key={lesson.id} to={`/lessons/${lesson.id}`}>
                      <div className="flex items-center gap-3 p-3 border rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          lesson.category === "assimil" ? "bg-purple-100 text-purple-700" :
                          lesson.category === "pimsleur" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                        }`}>
                          {lesson.category === "pimsleur" ? <Headphones className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-gray-800 truncate">{lesson.title}</p>
                          <p className="text-xs text-gray-500 truncate">{lesson.subtitle}</p>
                        </div>
                        <div className="text-xs text-gray-400 flex-shrink-0 flex items-center gap-1">
                          <Clock className="w-3 h-3" />{lesson.durationMin}min
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
              <Link to="/lessons">
                <Button variant="outline" className="w-full mt-4 text-sm">
                  Ver Todas as Aulas <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </Card>
          </div>

          {/* ── Conquistas ── */}
          <Card className="p-6 bg-white border-0 shadow-sm">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Conquistas
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.map((a) => (
                <div
                  key={a.title}
                  className={`text-center p-4 rounded-xl border transition-all ${
                    a.unlocked
                      ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-sm"
                      : "bg-gray-50 opacity-40 border-gray-200"
                  }`}
                >
                  <div className="text-3xl mb-2">{a.emoji}</div>
                  <p className="font-bold text-sm text-gray-800">{a.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{a.unlocked ? a.desc : "🔒 " + a.desc}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* ── CTA se não começou ── */}
          {totalCompleted === 0 && (
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white text-center">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="text-2xl font-black mb-2">Comece a Aprender Agora!</h3>
              <p className="text-purple-200 mb-5">
                Você tem acesso a <strong>194 aulas</strong> — Assimil, Pimsleur e Leituras.
                Cada aula tem áudio real e exercícios interativos.
              </p>
              <Link to="/lessons">
                <Button size="lg" className="bg-white text-purple-700 hover:bg-gray-100 font-black px-10">
                  Começar Lição 1 →
                </Button>
              </Link>
            </div>
          )}

          {/* ── Meta diária ── */}
          {totalCompleted > 0 && (
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black mb-1">Continue Hoje! 🎯</h3>
                  <p className="text-purple-200 text-sm">
                    Cada aula te aproxima da fluência. Mantenha a sequência!
                  </p>
                </div>
                <Link to="/lessons">
                  <Button size="lg" className="bg-white text-purple-700 hover:bg-gray-100 font-bold">
                    Próxima Aula →
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
