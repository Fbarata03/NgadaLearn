import { useState } from "react";
import { Link } from "react-router";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  Check,
  Headphones,
  MessageCircle,
  TrendingUp,
  Globe,
  Zap,
  Award,
  Star,
  PlayCircle,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Smartphone,
  FileText,
  Shield,
  Users,
  Lock,
} from "lucide-react";

/* ─── Data ─── */
const WHAT_YOU_LEARN = [
  "Manter conversas no dia a dia com confiança",
  "Entender nativos falando em velocidade real",
  "Escrever e-mails profissionais sem erros",
  "Passar em entrevistas de emprego em inglês",
  "Viajar para países anglófonos sem dificuldades",
  "Compreender filmes e séries sem legenda",
  "Dominar vocabulário de negócios e tecnologia",
  "Atingir fluência real em menos de 6 meses",
];

const COURSE_INCLUDES = [
  { icon: Clock, text: "50+ horas de conteúdo em vídeo" },
  { icon: FileText, text: "100+ exercícios práticos" },
  { icon: Headphones, text: "Áudio NgadaFlow com sotaques reais" },
  { icon: Smartphone, text: "Acesso no celular e computador" },
  { icon: BookOpen, text: "Acesso completo enquanto assinante" },
  { icon: Award, text: "Certificado de conclusão" },
];

const LESSONS_PREVIEW = [
  {
    section: "Módulo 1 — Fundamentos",
    count: "5 aulas · 45 min",
    lessons: [
      "Apresentações e saudações",
      "Números, datas e horas",
      "Perguntar e responder no cotidiano",
      "Expressões essenciais",
      "Prática de pronúncia",
    ],
  },
  {
    section: "Módulo 2 — Conversação Prática",
    count: "8 aulas · 1h 20min",
    lessons: [
      "No restaurante e café",
      "Fazendo compras",
      "Transporte e direções",
      "Na farmácia e hospital",
    ],
  },
  {
    section: "Módulo 3 — Inglês Profissional",
    count: "7 aulas · 1h 10min",
    lessons: [
      "E-mails de negócios",
      "Reuniões e apresentações",
      "Entrevistas de emprego",
      "Networking internacional",
    ],
  },
  {
    section: "NgadaFlow — Listening Intensivo",
    count: "6 faixas · 2h",
    lessons: [
      "Sotaque americano",
      "Sotaque britânico",
      "Inglês australiano",
      "Inglês em velocidade real",
    ],
  },
];

const FAQ_ITEMS = [
  {
    q: "É um pagamento único ou mensalidade?",
    a: "Pagamento único! Você paga uma vez e tem acesso completo ao curso para sempre. Sem mensalidades, sem renovações automáticas, sem surpresas.",
  },
  {
    q: "O que está incluído no curso?",
    a: "Você tem acesso completo a TUDO: todas as aulas de conversação, áudio NgadaFlow com sotaques reais, exercícios de vocabulário, dashboard de progresso e certificados de conclusão. Sem restrições, para sempre.",
  },
  {
    q: "Tenho acesso para sempre mesmo?",
    a: "Sim! Após o pagamento único, o acesso é vitalício. Mesmo quando adicionarmos novos conteúdos, você continuará tendo acesso sem pagar nada a mais.",
  },
  {
    q: "O curso funciona no celular?",
    a: "Perfeitamente! O NgadaLearn foi projetado para funcionar em qualquer dispositivo — celular, tablet ou computador. Estude onde e quando quiser.",
  },
  {
    q: "Quais métodos de pagamento são aceitos?",
    a: "Aceitamos todos os principais cartões de crédito e débito via Stripe, o processador de pagamentos mais seguro do mundo.",
  },
];

const REVIEWS = [
  {
    name: "Maria Silva",
    location: "São Paulo, BR",
    avatar: "👩🏽",
    date: "há 2 semanas",
    stars: 5,
    text: "Depois de 3 meses com NgadaLearn, consegui meu primeiro emprego internacional! O método de conversação é completamente diferente de tudo que já tentei.",
    helpful: 134,
    badge: "Emprego internacional",
  },
  {
    name: "João Costa",
    location: "Lisboa, PT",
    avatar: "👨🏻",
    date: "há 1 mês",
    stars: 5,
    text: "O NgadaFlow mudou completamente meu listening. Em 2 meses comecei a entender séries americanas sem legenda. Por US$ 5, é impossível encontrar algo melhor.",
    helpful: 89,
    badge: "Séries sem legenda",
  },
  {
    name: "Amara Ndiaye",
    location: "Luanda, AO",
    avatar: "👩🏾",
    date: "há 3 semanas",
    stars: 5,
    text: "Aprendo no celular durante o trajeto pro trabalho. Em 4 meses fui promovida por causa das minhas habilidades em inglês. Melhor investimento que já fiz!",
    helpful: 67,
    badge: "Promovida no trabalho",
  },
];

/* ─── Component ─── */
/* Vídeo promocional — altera este ID para qualquer vídeo do YouTube */

export function LandingPage() {
  const [openFaq,     setOpenFaq]     = useState<number | null>(null);
  const [openSection, setOpenSection] = useState<number | null>(0);
  const [videoOpen,   setVideoOpen]   = useState(false);

  return (
    <div className="w-full">
      {/* ══════════════════════════════════════
          HERO — estilo Udemy
      ══════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-8 sm:py-14">
          <div className="grid lg:grid-cols-3 gap-8 sm:gap-12 items-start">
            {/* ── Texto ── */}
            <div className="lg:col-span-2 space-y-5">
              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 text-sm text-purple-400">
                <span>Idiomas</span>
                <span className="text-gray-600">›</span>
                <span>Inglês</span>
                <span className="text-gray-600">›</span>
                <span className="text-gray-300">NgadaLearn Premium</span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black leading-tight">
                Domine o Inglês de<br />Uma Vez por Todas
              </h1>

              <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
                Do zero à fluência — conversação real, áudio com nativos e um método
                que realmente funciona. <strong className="text-white">Acesso completo e vitalício</strong> —
                pague uma vez e aprenda para sempre.
              </p>

              {/* Rating */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <span className="text-yellow-400 font-bold text-lg">4.9</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-gray-400">(1.842 avaliações)</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-300">
                  <Users className="w-4 h-4" />
                  2.300+ alunos matriculados
                </div>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
                <span>🌍 Instruído em Português</span>
                <span>•</span>
                <span>📱 Acesso em qualquer dispositivo</span>
                <span>•</span>
                <span>✅ Atualizado em Maio de 2026</span>
              </div>

              {/* CTA móvel */}
              <div className="lg:hidden space-y-3 pt-2">
                <Link to="/subscribe">
                  <Button
                    size="lg"
                    className="w-full bg-purple-600 hover:bg-purple-700 py-6 text-lg font-bold"
                  >
                    Garantir Acesso Vitalício — US$ 150
                  </Button>
                </Link>
                <p className="text-center text-sm text-gray-400">
                  Pagamento único · Acesso para sempre
                </p>
              </div>
            </div>

            {/* ── Card de compra (desktop) ── */}
            <div className="hidden lg:block">
              <Card className="p-6 bg-white text-gray-900 shadow-2xl">
                {/* Thumbnail preview — clica para abrir vídeo */}
                <button onClick={() => setVideoOpen(true)}
                  className="w-full aspect-video rounded-lg mb-5 overflow-hidden relative cursor-pointer group block">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 flex flex-col items-center justify-center gap-3">
                    {/* App feature pills */}
                    <div className="flex gap-1.5 mb-1">
                      <span className="bg-white/15 backdrop-blur rounded-full px-2 py-0.5 text-white text-[10px] font-semibold">🎵 Música</span>
                      <span className="bg-white/15 backdrop-blur rounded-full px-2 py-0.5 text-white text-[10px] font-semibold">🎬 Filmes</span>
                      <span className="bg-white/15 backdrop-blur rounded-full px-2 py-0.5 text-white text-[10px] font-semibold">💬 Conversação</span>
                    </div>
                    {/* Glow ring + play */}
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-red-500/30 blur-xl scale-150 group-hover:bg-red-500/50 transition-all" />
                      <div className="relative w-14 h-14 bg-red-600 group-hover:bg-red-500 rounded-full flex items-center justify-center transition-all group-hover:scale-110 shadow-2xl">
                        <PlayCircle className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <p className="text-xs text-white/70 group-hover:text-white transition-colors font-medium">
                      ▶ Ver demonstração gratuita
                    </p>
                    {/* Barra de progresso fake */}
                    <div className="w-2/3 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-1/3 bg-red-500 rounded-full" />
                    </div>
                  </div>
                </button>

                <div className="mb-4">
                  <div className="text-xs text-gray-400 line-through mb-0.5">US$ 300</div>
                  <div className="text-4xl font-black text-purple-700">US$ 150</div>
                  <div className="text-gray-500 text-xs font-semibold mt-0.5">pagamento único • acesso para sempre</div>
                </div>

                <Link to="/subscribe" className="block mb-4">
                  <Button
                    size="lg"
                    className="w-full bg-purple-600 hover:bg-purple-700 py-5 text-base font-bold"
                  >
                    Garantir Meu Acesso Agora
                  </Button>
                </Link>

                <p className="text-center text-xs text-gray-500 mb-5">
                  🔒 Pagamento único e seguro via Stripe
                </p>

                <div className="space-y-2.5 text-sm text-gray-700 border-t pt-4">
                  <p className="font-semibold">Este curso inclui:</p>
                  {COURSE_INCLUDES.map((item) => (
                    <div key={item.text} className="flex items-center gap-2.5">
                      <item.icon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg flex items-start gap-2.5">
                  <Shield className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-purple-800">
                    <strong>Pagamento 100% seguro via Stripe.</strong> SSL encriptado · Sem taxas ocultas.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mais vendido ── */}
      <div className="bg-yellow-50 border-y border-yellow-200 py-3">
        <div className="container mx-auto px-4 flex flex-wrap items-center gap-3">
          <span className="bg-yellow-500 text-white text-xs font-bold px-2.5 py-1 rounded">
            MAIS VENDIDO
          </span>
          <span className="text-sm text-gray-700">
            Mais de 2.300 alunos matriculados nos últimos 30 dias
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════
          BODY — conteúdo + sidebar sticky
      ══════════════════════════════════════ */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* ── Coluna principal ── */}
          <div className="lg:col-span-2 space-y-12">

            {/* O que você vai aprender */}
            <section>
              <h2 className="text-2xl font-bold mb-4">O que você vai aprender</h2>
              <div className="border rounded-xl p-6 bg-gray-50">
                <div className="grid md:grid-cols-2 gap-3">
                  {WHAT_YOU_LEARN.map((item) => (
                    <div key={item} className="flex items-start gap-2.5 text-sm">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Para quem é */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Para quem é este curso</h2>
              <div className="space-y-2.5">
                {[
                  "Iniciantes que nunca estudaram inglês formalmente",
                  "Quem estudou inglês na escola mas ainda não sabe falar",
                  "Profissionais que precisam do inglês para crescer na carreira",
                  "Viajantes que querem se comunicar sem dificuldades",
                  "Quem quer assistir filmes e séries sem legenda",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="text-purple-600 font-bold mt-0.5">›</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Conteúdo do curso */}
            <section>
              <h2 className="text-2xl font-bold mb-1">Conteúdo do curso</h2>
              <p className="text-sm text-gray-500 mb-4">
                4 módulos · 26+ aulas · 5h de conteúdo ao vivo
              </p>

              <div className="border rounded-xl overflow-hidden">
                {LESSONS_PREVIEW.map((sec, i) => (
                  <div key={i} className="border-b last:border-b-0">
                    <button
                      className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 text-left transition-colors"
                      onClick={() => setOpenSection(openSection === i ? null : i)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-sm">{sec.section}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          {sec.count}
                        </span>
                      </div>
                      {openSection === i ? (
                        <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {openSection === i && (
                      <div className="bg-gray-50 border-t">
                        {sec.lessons.map((lesson) => (
                          <div
                            key={lesson}
                            className="flex items-center gap-3 px-5 py-3 border-b last:border-b-0 text-sm text-gray-700"
                          >
                            <PlayCircle className="w-4 h-4 text-purple-500 flex-shrink-0" />
                            <span>{lesson}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Recursos do curso */}
            <section>
              <h2 className="text-2xl font-bold mb-5">Este curso inclui</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {COURSE_INCLUDES.map((item) => (
                  <div key={item.text} className="flex items-center gap-3 text-sm text-gray-700">
                    <item.icon className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Avaliações */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Avaliações dos alunos</h2>

              {/* Resumo de rating */}
              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 mb-8">
                <div className="text-center flex-shrink-0">
                  <div className="text-6xl font-black text-yellow-500">4.9</div>
                  <div className="flex justify-center gap-0.5 my-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">Avaliação do curso</p>
                </div>

                <div className="flex-1 space-y-2">
                  {[
                    { pct: 82, stars: 5 },
                    { pct: 13, stars: 4 },
                    { pct: 4, stars: 3 },
                    { pct: 1, stars: 2 },
                    { pct: 0, stars: 1 },
                  ].map(({ pct, stars }) => (
                    <div key={stars} className="flex items-center gap-2 text-xs">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-yellow-400 h-2 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="flex gap-0.5 w-16 justify-end">
                        {[...Array(stars)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-gray-500 w-8 text-right">{pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews individuais */}
              <div className="space-y-6">
                {REVIEWS.map((r) => (
                  <div key={r.name} className="border-b pb-6 last:border-b-0">
                    <div className="flex flex-wrap items-start gap-2 mb-3">
                      <div className="text-3xl leading-none">{r.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm">{r.name}</div>
                        <div className="text-xs text-gray-500">
                          {r.location} · {r.date}
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                        ✓ {r.badge}
                      </span>
                    </div>
                    <div className="flex gap-0.5 mb-2">
                      {[...Array(r.stars)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{r.text}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {r.helpful} pessoas acharam esta avaliação útil
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Perguntas frequentes</h2>
              <div className="space-y-3">
                {FAQ_ITEMS.map((item, i) => (
                  <div key={i} className="border rounded-xl overflow-hidden">
                    <button
                      className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 text-left transition-colors"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span className="font-semibold text-sm">{item.q}</span>
                      {openFaq === i ? (
                        <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-5 text-sm text-gray-600 border-t pt-4 leading-relaxed">
                        {item.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* CTA final */}
            <section className="bg-gradient-to-br from-purple-600 to-blue-700 rounded-2xl p-6 sm:p-8 text-white text-center">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-2xl sm:text-3xl font-black mb-3">Sua jornada começa hoje</h2>
              <p className="text-purple-200 mb-6 max-w-md mx-auto">
                Não adie mais. Com apenas US$ 20 você investe no inglês que abre portas para
                empregos, viagens e oportunidades do mundo inteiro — para sempre.
              </p>
              <Link to="/subscribe">
                <Button
                  size="lg"
                  className="bg-white text-purple-700 hover:bg-gray-100 px-10 py-5 font-black text-lg"
                >
                  Garantir Meu Acesso Vitalício
                </Button>
              </Link>
              <p className="text-xs text-purple-300 mt-3">
                Pagamento único · Sem mensalidades · Acesso para sempre
              </p>
            </section>
          </div>

          {/* ── Sidebar sticky (desktop) ── */}
          <div className="hidden lg:block">
            <div className="sticky top-20 space-y-4">
              <Card className="p-6 shadow-xl border-2 border-gray-100">
                <div className="text-xs text-gray-400 line-through mb-0.5">US$ 60</div>
                <div className="text-4xl font-black mb-0.5">US$ 20</div>
                <div className="text-purple-700 text-xs font-bold mb-5">pagamento único · acesso vitalício</div>

                <Link to="/subscribe" className="block mb-4">
                  <Button
                    size="lg"
                    className="w-full bg-purple-600 hover:bg-purple-700 py-5 font-bold text-base"
                  >
                    Garantir Meu Acesso Agora
                  </Button>
                </Link>

                <p className="text-center text-xs text-gray-500 mb-4 flex items-center justify-center gap-1.5">
                  <Lock className="w-3 h-3" />
                  Pagamento único e seguro via Stripe
                </p>

                <div className="space-y-2.5 text-sm text-gray-700 border-t pt-4">
                  <p className="font-semibold">Este curso inclui:</p>
                  {COURSE_INCLUDES.map((item) => (
                    <div key={item.text} className="flex items-center gap-2.5">
                      <item.icon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Alunos recentes */}
              <Card className="p-4 border">
                <p className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wide">
                  Alunos recentes
                </p>
                {REVIEWS.slice(0, 2).map((r) => (
                  <div key={r.name} className="flex items-center gap-2.5 mb-2.5 last:mb-0">
                    <div className="text-2xl">{r.avatar}</div>
                    <div>
                      <p className="text-xs font-semibold">{r.name}</p>
                      <p className="text-xs text-green-600">✓ {r.badge}</p>
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA Fixo móvel (bottom bar) ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl z-50 p-4">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-2xl font-black leading-none">US$ 20</div>
            <div className="text-xs text-purple-600 font-medium">acesso vitalício</div>
          </div>
          <Link to="/subscribe" className="flex-1">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 font-bold py-5">
              Começar Agora
            </Button>
          </Link>
        </div>
      </div>
      <div className="lg:hidden h-24" />

      {/* ════════════════════════════════════════
          MODAL DE VÍDEO PROMOCIONAL
      ════════════════════════════════════════ */}
      {videoOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{background:"rgba(0,0,0,.88)"}}
          onClick={() => setVideoOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Botão fechar */}
            <div className="flex justify-between items-center mb-3">
              <p className="text-white font-bold text-sm">
                🎓 NgadaLearn — Aprende Inglês de Verdade
              </p>
              <button
                onClick={() => setVideoOpen(false)}
                className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors"
              >
                ✕ Fechar
              </button>
            </div>
            {/* Player — vídeo local */}
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
              <video
                className="w-full h-full"
                controls
                autoPlay
                muted
                playsInline
                preload="auto"
                src="/demo.mp4"
              >
                O teu browser não suporta vídeo HTML5.
              </video>
            </div>
            {/* CTA abaixo do vídeo */}
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-3 justify-center">
              <Link to="/subscribe" onClick={() => setVideoOpen(false)}>
                <Button className="bg-purple-600 hover:bg-purple-500 font-bold px-8 py-3 text-base">
                  🚀 Garantir Acesso Agora — US$ 20
                </Button>
              </Link>
              <Link to="/demo" onClick={() => setVideoOpen(false)}
                className="text-sm text-white/60 hover:text-white transition-colors underline underline-offset-2">
                Ver aula gratuita interativa →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
