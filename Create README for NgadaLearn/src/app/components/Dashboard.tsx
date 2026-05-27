import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Link } from "react-router";
import {
  BookOpen,
  Headphones,
  Award,
  TrendingUp,
  Calendar,
  Target,
  Clock,
  Star,
  Flame,
  ChevronRight,
  PlayCircle,
} from "lucide-react";

export function Dashboard() {
  const stats = {
    lessonsCompleted: 24,
    totalLessons: 100,
    currentStreak: 7,
    totalMinutes: 320,
    level: "Intermediário",
    nextMilestone: "Avançado",
  };

  const recentLessons = [
    { id: 1, title: "Conversas do Cotidiano", progress: 100, type: "conversation", time: "Hoje" },
    { id: 2, title: "Inglês para Negócios", progress: 60, type: "vocabulary", time: "Ontem" },
    { id: 3, title: "Prática de Listening", progress: 80, type: "audio", time: "Há 2 dias" },
  ];

  const nextLessons = [
    { title: "No Restaurante", module: "Conversação", duration: "15 min", icon: "🍽️" },
    { title: "Sotaque Britânico", module: "NgadaFlow", duration: "20 min", icon: "🎧" },
    { title: "Termos de Tecnologia", module: "Vocabulário", duration: "12 min", icon: "💻" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* ── Boas-vindas ── */}
          <div className="bg-gradient-to-r from-purple-700 to-blue-700 rounded-2xl p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-black mb-1">Bem-vindo de volta! 👋</h1>
                <p className="text-purple-200">
                  Continue sua jornada para a fluência — você está indo muito bem!
                </p>
                <div className="flex items-center gap-2 mt-3 text-sm">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="font-semibold">{stats.currentStreak} dias de sequência</span>
                  <span className="text-purple-300">· Continue assim!</span>
                </div>
              </div>
              <Link to="/lessons">
                <Button
                  size="lg"
                  className="bg-white text-purple-700 hover:bg-gray-100 font-bold flex items-center gap-2"
                >
                  <PlayCircle className="w-5 h-5" />
                  Continuar Aprendendo
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
                <span className="text-3xl font-black text-gray-900">{stats.lessonsCompleted}</span>
              </div>
              <p className="text-xs text-gray-500 font-medium">Aulas Concluídas</p>
              <Progress
                value={(stats.lessonsCompleted / stats.totalLessons) * 100}
                className="mt-2 h-1.5"
              />
              <p className="text-xs text-gray-400 mt-1">
                {stats.lessonsCompleted}/{stats.totalLessons} aulas
              </p>
            </Card>

            <Card className="p-5 bg-white border-0 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-500" />
                </div>
                <span className="text-3xl font-black text-gray-900">{stats.currentStreak}</span>
              </div>
              <p className="text-xs text-gray-500 font-medium">Dias de Sequência 🔥</p>
              <p className="text-xs text-orange-500 mt-1 font-medium">Continue assim!</p>
            </Card>

            <Card className="p-5 bg-white border-0 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-3xl font-black text-gray-900">{stats.totalMinutes}</span>
              </div>
              <p className="text-xs text-gray-500 font-medium">Minutos Estudados</p>
              <p className="text-xs text-gray-400 mt-1">este mês</p>
            </Card>

            <Card className="p-5 bg-white border-0 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-yellow-600" />
                </div>
                <span className="text-lg font-black text-gray-900">{stats.level}</span>
              </div>
              <p className="text-xs text-gray-500 font-medium">Nível Atual</p>
              <p className="text-xs text-gray-400 mt-1">Próximo: {stats.nextMilestone}</p>
            </Card>
          </div>

          {/* ── Progresso + Atividade recente ── */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-white border-0 shadow-sm">
              <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Seu Progresso
              </h2>

              <div className="space-y-5">
                {[
                  { label: "Progresso Geral", value: (stats.lessonsCompleted / stats.totalLessons) * 100, sub: `${stats.lessonsCompleted}/${stats.totalLessons} aulas` },
                  { label: "Habilidade de Conversação", value: 85, sub: "85%" },
                  { label: "Listening (NgadaFlow)", value: 72, sub: "72%" },
                  { label: "Vocabulário", value: 90, sub: "90%" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between mb-1.5 text-sm">
                      <span className="font-medium text-gray-700">{item.label}</span>
                      <span className="text-gray-500">{item.sub}</span>
                    </div>
                    <Progress value={item.value} className="h-2" />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-white border-0 shadow-sm">
              <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                Atividade Recente
              </h2>

              <div className="space-y-3">
                {recentLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="w-11 h-11 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      {lesson.type === "conversation" && <BookOpen className="w-5 h-5 text-purple-600" />}
                      {lesson.type === "audio" && <Headphones className="w-5 h-5 text-purple-600" />}
                      {lesson.type === "vocabulary" && <Star className="w-5 h-5 text-purple-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-sm text-gray-800 truncate">{lesson.title}</h3>
                        <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{lesson.time}</span>
                      </div>
                      <Progress value={lesson.progress} className="h-1.5" />
                    </div>
                    <span className="text-xs text-gray-500 flex-shrink-0 font-medium">
                      {lesson.progress}%
                    </span>
                  </div>
                ))}
              </div>

              <Link to="/lessons">
                <Button variant="outline" className="w-full mt-4 text-sm">
                  Ver Todas as Aulas
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </Card>
          </div>

          {/* ── Próximas aulas recomendadas ── */}
          <Card className="p-6 bg-white border-0 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Próximas Aulas Recomendadas
              </h2>
              <Link to="/lessons">
                <Button variant="ghost" size="sm" className="text-purple-600 text-xs">
                  Ver todas <ChevronRight className="w-3 h-3 ml-0.5" />
                </Button>
              </Link>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {nextLessons.map((lesson) => (
                <Link key={lesson.title} to="/lessons">
                  <div className="border rounded-xl p-4 hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer group">
                    <div className="text-2xl mb-2">{lesson.icon}</div>
                    <h3 className="font-semibold text-sm text-gray-800 mb-0.5 group-hover:text-purple-700">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-gray-500">{lesson.module}</p>
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {lesson.duration}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          {/* ── Conquistas ── */}
          <Card className="p-6 bg-white border-0 shadow-sm">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Suas Conquistas
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { emoji: "🏆", title: "Guerreiro Semanal", desc: "7 dias seguidos", unlocked: true },
                { emoji: "🎯", title: "Aprendiz Rápido", desc: "20 aulas em uma semana", unlocked: true },
                { emoji: "🎧", title: "Mestre do Áudio", desc: "100 min de listening", unlocked: true },
                { emoji: "🌟", title: "Mês Perfeito", desc: "30 dias consecutivos", unlocked: false },
              ].map((achievement) => (
                <div
                  key={achievement.title}
                  className={`text-center p-4 rounded-xl transition-all ${
                    achievement.unlocked
                      ? "bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200"
                      : "bg-gray-50 opacity-50 border border-gray-200"
                  }`}
                >
                  <div className="text-4xl mb-2">{achievement.emoji}</div>
                  <p className="font-semibold text-sm">{achievement.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {achievement.unlocked ? achievement.desc : "🔒 Bloqueado"}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* ── Meta diária ── */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black mb-1">Meta Diária: Quase lá! 🎯</h3>
                <p className="text-purple-200 text-sm">
                  Complete mais 1 aula para atingir sua meta de hoje
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex gap-1.5">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`w-8 h-2 rounded-full ${
                          i < 3 ? "bg-white" : "bg-white/30"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-purple-200">2 de 3 aulas</span>
                </div>
              </div>
              <Link to="/lessons">
                <Button size="lg" className="bg-white text-purple-700 hover:bg-gray-100 font-bold">
                  Iniciar Próxima Aula
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
