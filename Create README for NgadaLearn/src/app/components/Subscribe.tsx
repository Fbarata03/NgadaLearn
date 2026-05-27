import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { useAuth } from "../context/AuthContext";
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
  Eye,
  EyeOff,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

const INCLUDES = [
  { icon: Clock,      text: "50+ horas de conteúdo em vídeo" },
  { icon: Headphones, text: "NgadaFlow — áudio com nativos" },
  { icon: Users,      text: "Exercícios de conversação ilimitados" },
  { icon: BookOpen,   text: "100+ exercícios práticos" },
  { icon: Award,      text: "Certificado de conclusão" },
  { icon: Check,      text: "Novos conteúdos adicionados todo mês" },
  { icon: Check,      text: "Acesso em todos os dispositivos" },
  { icon: Check,      text: "Zero anúncios" },
  { icon: Check,      text: "Acesso vitalício — pague uma única vez" },
];

const PRICE = "29";

export function Subscribe() {
  const { registerAndPay, isAuthenticated, isPaid } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<"plan" | "payment">("plan");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    card: "",
    expiry: "",
    cvv: "",
    cardName: "",
  });

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validatePayment = () => {
    if (!form.name.trim()) return "Informe seu nome completo.";
    if (!form.email.trim() || !form.email.includes("@")) return "Informe um e-mail válido.";
    if (form.password.length < 6) return "A senha deve ter pelo menos 6 caracteres.";
    if (form.card.replace(/\s/g, "").length < 13) return "Número de cartão inválido.";
    if (!form.expiry) return "Informe a validade do cartão.";
    if (!form.cvv || form.cvv.length < 3) return "CVV inválido.";
    if (!form.cardName.trim()) return "Informe o nome impresso no cartão.";
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validatePayment();
    if (err) { setError(err); return; }

    setIsProcessing(true);
    setError("");

    // Simula processamento do pagamento
    setTimeout(() => {
      registerAndPay(form.name, form.email, form.password);
      setIsProcessing(false);
      navigate("/dashboard");
    }, 2000);
  };

  // Se já tem acesso, redireciona
  if (isAuthenticated && isPaid) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-black mb-3">Você já tem acesso!</h1>
          <p className="text-gray-600 mb-6">
            Seu acesso vitalício já está ativo. Vá directo para o seu painel.
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 font-bold px-10">
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
          <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> Pagamento 100% seguro</span>
          <span className="flex items-center gap-1.5"><Check className="w-4 h-4" /> Acesso imediato após pagamento</span>
          <span className="flex items-center gap-1.5"><Lock className="w-4 h-4" /> Pagamento único — sem mensalidades</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto">
          {/* Passos */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <button
              onClick={() => step === "payment" && setStep("plan")}
              className={`font-semibold ${step === "plan" ? "text-purple-700" : "text-gray-400"}`}
            >
              1. Resumo
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className={`font-semibold ${step === "payment" ? "text-purple-700" : "text-gray-400"}`}>
              2. Criar Conta & Pagar
            </span>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* ── Formulário ── */}
            <div className="lg:col-span-3 space-y-5">
              <div>
                <h1 className="text-3xl font-black mb-1">
                  {step === "plan" ? "Garantir Acesso Vitalício" : "Criar conta e pagar"}
                </h1>
                <p className="text-gray-600 text-sm">
                  {step === "plan"
                    ? "Pague uma vez e tenha acesso ao curso para sempre"
                    : "Crie sua conta e finalize o pagamento para liberar o acesso"}
                </p>
              </div>

              {/* ── ETAPA 1 ── */}
              {step === "plan" && (
                <>
                  <Card className="p-5 border-2 border-purple-300 bg-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                      ACESSO VITALÍCIO
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
                            "Acesso para sempre — sem renovação",
                          ].map((f) => (
                            <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                              <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                              {f}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <div className="text-xs text-gray-400 line-through mb-0.5">US$ 99</div>
                        <div className="text-4xl font-black text-gray-900">US$ {PRICE}</div>
                        <div className="text-xs text-purple-700 font-bold mt-1">pagamento único</div>
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
                    Pagamento único · Sem mensalidades · Acesso para sempre
                  </p>

                  <div className="text-center text-sm text-gray-600">
                    Já tem conta?{" "}
                    <Link to="/login" className="text-purple-700 font-bold hover:underline">
                      Entrar
                    </Link>
                  </div>
                </>
              )}

              {/* ── ETAPA 2: Formulário completo ── */}
              {step === "payment" && (
                <form onSubmit={handleSubmit}>
                  <Card className="p-6 bg-white shadow-sm">
                    <div className="space-y-5">

                      {/* ── Dados da conta ── */}
                      <div>
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <span className="w-6 h-6 bg-purple-600 text-white rounded-full text-xs flex items-center justify-center font-bold">1</span>
                          Criar sua conta
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm font-semibold">Nome completo</Label>
                            <Input
                              placeholder="Seu nome completo"
                              value={form.name}
                              onChange={set("name")}
                              className="mt-1.5"
                              autoComplete="name"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-semibold">E-mail</Label>
                            <Input
                              type="email"
                              placeholder="seu@email.com"
                              value={form.email}
                              onChange={set("email")}
                              className="mt-1.5"
                              autoComplete="email"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-semibold">Senha (mín. 6 caracteres)</Label>
                            <div className="relative mt-1.5">
                              <Input
                                type={showPw ? "text" : "password"}
                                placeholder="Crie uma senha segura"
                                value={form.password}
                                onChange={set("password")}
                                className="pr-10"
                                autoComplete="new-password"
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowPw(!showPw)}
                              >
                                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Guarde esta senha — vai usá-la para fazer login no futuro.
                            </p>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* ── Dados do cartão ── */}
                      <div>
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <span className="w-6 h-6 bg-purple-600 text-white rounded-full text-xs flex items-center justify-center font-bold">2</span>
                          Dados do cartão
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm font-semibold">Número do Cartão</Label>
                            <div className="relative mt-1.5">
                              <Input
                                placeholder="0000 0000 0000 0000"
                                value={form.card}
                                onChange={set("card")}
                                className="pl-10"
                                maxLength={19}
                              />
                              <CreditCard className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-sm font-semibold">Validade</Label>
                              <Input placeholder="MM/AA" value={form.expiry} onChange={set("expiry")} className="mt-1.5" maxLength={5} />
                            </div>
                            <div>
                              <Label className="text-sm font-semibold">CVV</Label>
                              <Input placeholder="000" value={form.cvv} onChange={set("cvv")} className="mt-1.5" maxLength={4} />
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-semibold">Nome no cartão</Label>
                            <Input placeholder="Como aparece no cartão" value={form.cardName} onChange={set("cardName")} className="mt-1.5" />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Resumo */}
                      <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                        <div className="flex justify-between text-gray-700">
                          <span>NgadaLearn — Acesso Vitalício</span>
                          <span>US$ {PRICE},00</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-black text-lg">
                          <span>Total</span>
                          <span className="text-purple-700">US$ {PRICE},00</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Cobrança única · Acesso para sempre · Sem renovações automáticas
                        </p>
                      </div>

                      {/* Erro */}
                      {error && (
                        <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          {error}
                        </div>
                      )}

                      {/* Botão pagar */}
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-purple-600 hover:bg-purple-700 py-6 text-lg font-bold"
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <span className="flex items-center gap-2">
                            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                            Processando pagamento...
                          </span>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Pagar US$ {PRICE} e Liberar Acesso
                          </>
                        )}
                      </Button>

                      <p className="text-xs text-gray-500 text-center">
                        Ao confirmar, você concorda com os{" "}
                        <span className="underline cursor-pointer">Termos de Serviço</span> e{" "}
                        <span className="underline cursor-pointer">Política de Privacidade</span>.
                      </p>

                      {/* Selos */}
                      <div className="flex items-center justify-center gap-5 pt-1">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Shield className="w-4 h-4 text-green-500" /> SSL Criptografado
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <CreditCard className="w-4 h-4 text-blue-500" /> PCI Compliant
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Lock className="w-4 h-4 text-purple-500" /> Dados Protegidos
                        </div>
                      </div>
                    </div>
                  </Card>
                </form>
              )}
            </div>

            {/* ── Lado direito ── */}
            <div className="lg:col-span-2 space-y-5">
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

              <Card className="p-5 bg-purple-50 border-purple-200">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">♾️</span>
                  <div>
                    <h4 className="font-bold text-purple-900 mb-1">Acesso para Sempre</h4>
                    <p className="text-sm text-purple-800 leading-relaxed">
                      Pague uma única vez e tenha acesso completo ao curso pelo resto da vida. Sem mensalidades, sem surpresas.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-5">
                <h4 className="font-semibold text-sm mb-4">O que dizem nossos alunos</h4>
                <div className="space-y-4">
                  {[
                    { avatar: "👩🏽", name: "Maria S.", text: "Consegui emprego internacional em 3 meses!" },
                    { avatar: "👨🏻", name: "João C.",  text: "Assisto séries sem legenda agora!" },
                    { avatar: "👩🏾", name: "Amara N.", text: "Fui promovida graças ao inglês que aprendi aqui!" },
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
