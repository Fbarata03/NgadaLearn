import { useState } from "react";
import { Link } from "react-router";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import {
  Check,
  CreditCard,
  Shield,
  Clock,
  Headphones,
  Award,
  Lock,
  Star,
  Users,
  BookOpen,
  X,
  ChevronRight,
} from "lucide-react";

const INCLUDES = [
  { icon: Clock, text: "50+ horas de conteúdo em vídeo" },
  { icon: Headphones, text: "NgadaFlow — áudio com nativos" },
  { icon: Users, text: "Exercícios de conversação ilimitados" },
  { icon: BookOpen, text: "100+ exercícios práticos" },
  { icon: Award, text: "Certificado de conclusão" },
  { icon: Check, text: "Novos conteúdos adicionados todo mês" },
  { icon: Check, text: "Acesso em todos os dispositivos" },
  { icon: Check, text: "Zero anúncios" },
  { icon: Check, text: "Cancele quando quiser" },
];

export function Subscribe() {
  const [step, setStep] = useState<"plan" | "payment" | "success">("plan");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep("success");
    }, 2000);
  };

  /* ── Tela de sucesso ── */
  if (step === "success") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-black mb-3">Bem-vindo ao NgadaLearn! 🎉</h1>
          <p className="text-gray-600 mb-2">
            Sua assinatura foi ativada com sucesso.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Acesso completo ao curso liberado. Comece a aprender agora mesmo!
          </p>
          <Link to="/dashboard">
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 px-10 font-bold text-lg"
            >
              Ir para Meu Painel →
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra de confiança */}
      <div className="bg-purple-700 text-white py-2.5">
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-center gap-6 text-sm">
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4" /> Pagamento 100% seguro
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4" /> 7 dias grátis
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-4 h-4" /> Cancele quando quiser
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb de passos */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <button
              onClick={() => step === "payment" && setStep("plan")}
              className={`font-semibold ${step === "plan" ? "text-purple-700" : "text-gray-400"}`}
            >
              1. Plano
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className={`font-semibold ${step === "payment" ? "text-purple-700" : "text-gray-400"}`}>
              2. Pagamento
            </span>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* ── Lado esquerdo: formulário ── */}
            <div className="lg:col-span-3 space-y-5">
              <div>
                <h1 className="text-3xl font-black mb-1">
                  {step === "plan" ? "Escolha seu plano" : "Dados de pagamento"}
                </h1>
                <p className="text-gray-600 text-sm">
                  {step === "plan"
                    ? "Você está a um passo de falar inglês com fluência"
                    : "Insira os dados do seu cartão para ativar o acesso"}
                </p>
              </div>

              {step === "plan" && (
                <>
                  {/* Card do plano */}
                  <Card className="p-5 border-2 border-purple-300 bg-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                      MAIS POPULAR
                    </div>
                    <div className="flex items-start justify-between pr-4">
                      <div className="flex-1">
                        <h2 className="text-lg font-black mb-0.5">NgadaLearn — Acesso Completo</h2>
                        <p className="text-sm text-gray-500">Inglês do zero à fluência · Todos os módulos</p>
                        <div className="flex items-center gap-1 mt-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="text-xs text-gray-500 ml-1">4.9 · (1.842 avaliações)</span>
                        </div>
                        <div className="mt-3 space-y-1.5">
                          {[
                            "50+ horas de conteúdo",
                            "NgadaFlow (áudio com nativos)",
                            "Certificados de conclusão",
                            "Novos conteúdos todo mês",
                          ].map((f) => (
                            <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                              <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                              {f}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <div className="text-xs text-gray-400 line-through mb-0.5">US$ 49/ano</div>
                        <div className="text-4xl font-black text-gray-900">US$ 5</div>
                        <div className="text-xs text-gray-500">por mês</div>
                        <div className="text-xs text-purple-600 font-semibold mt-1">7 dias grátis</div>
                      </div>
                    </div>
                  </Card>

                  <Button
                    size="lg"
                    className="w-full bg-purple-600 hover:bg-purple-700 py-6 text-lg font-bold"
                    onClick={() => setStep("payment")}
                  >
                    Continuar para o Pagamento →
                  </Button>

                  <p className="text-center text-xs text-gray-500">
                    Nenhum valor cobrado hoje · Cancele a qualquer momento
                  </p>
                </>
              )}

              {step === "payment" && (
                <Card className="p-6 bg-white shadow-sm">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email" className="text-sm font-semibold">
                        E-mail
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        className="mt-1.5"
                      />
                    </div>

                    <Separator />

                    <div>
                      <Label htmlFor="cardNumber" className="text-sm font-semibold">
                        Número do Cartão
                      </Label>
                      <div className="relative mt-1.5">
                        <Input
                          id="cardNumber"
                          placeholder="0000 0000 0000 0000"
                          className="pl-10"
                        />
                        <CreditCard className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry" className="text-sm font-semibold">
                          Validade
                        </Label>
                        <Input id="expiry" placeholder="MM/AA" className="mt-1.5" />
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="text-sm font-semibold">
                          CVV
                        </Label>
                        <Input id="cvv" placeholder="000" maxLength={3} className="mt-1.5" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="name" className="text-sm font-semibold">
                        Nome no cartão
                      </Label>
                      <Input id="name" placeholder="Como aparece no cartão" className="mt-1.5" />
                    </div>

                    <Separator />

                    {/* Resumo */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                      <div className="flex justify-between text-gray-700">
                        <span>NgadaLearn — Acesso Completo</span>
                        <span>US$ 5,00/mês</span>
                      </div>
                      <div className="flex justify-between text-green-600 font-medium">
                        <span>🎁 7 dias de teste gratuito</span>
                        <span>- US$ 5,00</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-black text-lg">
                        <span>Total hoje</span>
                        <span className="text-purple-700">US$ 0,00</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Após 7 dias: US$ 5,00/mês · Cancele quando quiser
                      </p>
                    </div>

                    <Button
                      size="lg"
                      className="w-full bg-purple-600 hover:bg-purple-700 py-6 text-lg font-bold"
                      onClick={handleSubmit}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          Processando...
                        </span>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Ativar Acesso Gratuito
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-gray-500 text-center leading-relaxed">
                      Ao confirmar, você concorda com os{" "}
                      <span className="underline cursor-pointer">Termos de Serviço</span> e{" "}
                      <span className="underline cursor-pointer">Política de Privacidade</span>.
                    </p>

                    {/* Selos de segurança */}
                    <div className="flex items-center justify-center gap-5 pt-2">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Shield className="w-4 h-4 text-green-500" />
                        SSL Criptografado
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <CreditCard className="w-4 h-4 text-blue-500" />
                        PCI Compliant
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Lock className="w-4 h-4 text-purple-500" />
                        Dados Protegidos
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* ── Lado direito: resumo do que inclui ── */}
            <div className="lg:col-span-2 space-y-5">
              {/* O que está incluído */}
              <Card className="p-5">
                <h3 className="font-bold text-base mb-4">O que está incluído</h3>
                <div className="space-y-2.5">
                  {INCLUDES.map((item) => (
                    <div key={item.text} className="flex items-center gap-2.5 text-sm text-gray-700">
                      <item.icon className="w-4 h-4 text-purple-600 flex-shrink-0" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Garantia */}
              <Card className="p-5 bg-green-50 border-green-200">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-green-900 mb-1">Garantia de 30 dias</h4>
                    <p className="text-sm text-green-800 leading-relaxed">
                      Se não ficar 100% satisfeito dentro de 30 dias após a assinatura,
                      devolvemos o valor integral. Sem perguntas.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Depoimentos curtos */}
              <Card className="p-5">
                <h4 className="font-semibold text-sm mb-4">O que dizem nossos alunos</h4>
                <div className="space-y-4">
                  {[
                    {
                      avatar: "👩🏽",
                      name: "Maria S.",
                      text: "Consegui emprego internacional em 3 meses!",
                    },
                    {
                      avatar: "👨🏻",
                      name: "João C.",
                      text: "Assisto séries sem legenda agora!",
                    },
                    {
                      avatar: "👩🏾",
                      name: "Amara N.",
                      text: "Fui promovida graças ao inglês que aprendi aqui!",
                    },
                  ].map((r) => (
                    <div key={r.name} className="flex items-start gap-3">
                      <div className="text-2xl leading-none">{r.avatar}</div>
                      <div>
                        <div className="flex gap-0.5 mb-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-xs text-gray-700 italic">"{r.text}"</p>
                        <p className="text-xs text-gray-400 mt-0.5 font-medium">{r.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Confiança */}
              <div className="text-center text-xs text-gray-400 space-y-1">
                <p>Confiado por alunos em mais de 50 países</p>
                <div className="flex items-center justify-center gap-3 mt-2 flex-wrap">
                  <span className="bg-gray-100 px-2 py-1 rounded text-gray-600">🌍 50+ países</span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-gray-600">⭐ 4.9/5</span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-gray-600">👥 2.300+ alunos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
