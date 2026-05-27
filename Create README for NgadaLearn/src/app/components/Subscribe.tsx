import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { useAuth } from "../context/AuthContext";
import type { PlanType } from "../context/AuthContext";
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
  RefreshCw,
} from "lucide-react";

const PLANS = [
  {
    id: "monthly" as PlanType,
    label: "Plano Mensal",
    price: "5",
    priceOld: "15",
    period: "/mês",
    badge: "MAIS ACESSÍVEL",
    badgeColor: "bg-blue-600",
    borderColor: "border-blue-300",
    description: "Acesso completo por 30 dias. Renove quando quiser.",
    features: [
      "50+ horas de conteúdo",
      "NgadaFlow (áudio com nativos)",
      "Certificados de conclusão",
      "Acesso por 30 dias",
      "Renovável a qualquer momento",
    ],
    note: "Acesso bloqueado após 30 dias até renovar",
  },
  {
    id: "lifetime" as PlanType,
    label: "Plano Vitalício",
    price: "20",
    priceOld: "60",
    period: " único",
    badge: "MELHOR VALOR",
    badgeColor: "bg-purple-600",
    borderColor: "border-purple-300",
    description: "Pague uma vez, acesso para sempre. Sem renovações.",
    features: [
      "50+ horas de conteúdo",
      "NgadaFlow (áudio com nativos)",
      "Certificados de conclusão",
      "Acesso para sempre",
      "Todos os conteúdos futuros incluídos",
    ],
    note: "Pagamento único — sem mensalidades",
  },
];

const INCLUDES = [
  { icon: Clock,      text: "50+ horas de conteúdo em vídeo" },
  { icon: Headphones, text: "NgadaFlow — áudio com nativos" },
  { icon: Users,      text: "Exercícios de conversação ilimitados" },
  { icon: BookOpen,   text: "100+ exercícios práticos" },
  { icon: Award,      text: "Certificado de conclusão" },
  { icon: Check,      text: "Zero anúncios" },
];

export function Subscribe() {
  const { registerAndPay, renewMonthly, isAuthenticated, isAccessActive, user } = useAuth();
  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState<PlanType>("lifetime");
  const [step, setStep] = useState<"plan" | "payment">("plan");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    card: "",
    expiry: "",
    cvv: "",
    cardName: "",
  });

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const plan = PLANS.find((p) => p.id === selectedPlan)!;

  // Utilizador com acesso activo — redireciona
  if (isAuthenticated && isAccessActive) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-black mb-3">Você já tem acesso!</h1>
          <p className="text-gray-600 mb-6">
            O seu plano está activo. Vai directo para o painel.
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

  // Renovação de plano mensal expirado
  const isRenewal = isAuthenticated && !isAccessActive && user?.plan === "monthly";

  const validate = () => {
    if (!isRenewal) {
      if (!form.name.trim()) return "Informe seu nome completo.";
      if (!form.email.trim() || !form.email.includes("@")) return "Informe um e-mail válido.";
      if (form.password.length < 6) return "A senha deve ter pelo menos 6 caracteres.";
    }
    if (form.card.replace(/\s/g, "").length < 13) return "Número de cartão inválido.";
    if (!form.expiry) return "Informe a validade do cartão.";
    if (!form.cvv || form.cvv.length < 3) return "CVV inválido.";
    if (!form.cardName.trim()) return "Informe o nome no cartão.";
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setIsProcessing(true);
    setError("");
    setTimeout(() => {
      if (isRenewal) {
        renewMonthly();
      } else {
        registerAndPay(form.name, form.email, form.password, selectedPlan);
      }
      setIsProcessing(false);
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra de confiança */}
      <div className="bg-purple-700 text-white py-2.5">
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-center gap-6 text-sm">
          <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> Pagamento 100% seguro</span>
          <span className="flex items-center gap-1.5"><Check className="w-4 h-4" /> Acesso imediato após pagamento</span>
          <span className="flex items-center gap-1.5"><Lock className="w-4 h-4" /> Sem taxas escondidas</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto">

          {/* Alerta de renovação */}
          {isRenewal && (
            <div className="mb-6 p-4 bg-orange-50 border-2 border-orange-300 rounded-2xl flex items-start gap-3">
              <RefreshCw className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-orange-800">O seu plano mensal expirou</p>
                <p className="text-sm text-orange-700 mt-0.5">
                  Renove agora para recuperar o acesso completo ao curso.
                </p>
              </div>
            </div>
          )}

          {/* Passos */}
          {!isRenewal && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
              <button
                onClick={() => step === "payment" && setStep("plan")}
                className={`font-semibold ${step === "plan" ? "text-purple-700" : "text-gray-400"}`}
              >
                1. Escolher Plano
              </button>
              <ChevronRight className="w-4 h-4" />
              <span className={`font-semibold ${step === "payment" ? "text-purple-700" : "text-gray-400"}`}>
                2. {isRenewal ? "Renovar" : "Criar Conta & Pagar"}
              </span>
            </div>
          )}

          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-5">
              <div>
                <h1 className="text-3xl font-black mb-1">
                  {isRenewal ? "Renovar Plano Mensal" : step === "plan" ? "Escolha seu plano" : "Criar conta e pagar"}
                </h1>
                <p className="text-gray-600 text-sm">
                  {isRenewal
                    ? "Pague para ter mais 30 dias de acesso completo"
                    : step === "plan"
                    ? "Seleccione o plano que melhor se adapta a si"
                    : "Crie a sua conta e finalize o pagamento"}
                </p>
              </div>

              {/* ── ETAPA 1: Escolha de plano ── */}
              {step === "plan" && !isRenewal && (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {PLANS.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPlan(p.id)}
                        className={`relative p-5 border-2 rounded-2xl cursor-pointer transition-all ${
                          selectedPlan === p.id
                            ? `${p.borderColor} bg-white shadow-lg scale-[1.02]`
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className={`absolute top-0 right-0 ${p.badgeColor} text-white text-xs font-bold px-2.5 py-1 rounded-bl-lg rounded-tr-xl`}>
                          {p.badge}
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 mb-3 flex items-center justify-center ${
                          selectedPlan === p.id ? "border-purple-600 bg-purple-600" : "border-gray-300"
                        }`}>
                          {selectedPlan === p.id && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <h3 className="font-black text-lg mb-0.5">{p.label}</h3>
                        <p className="text-xs text-gray-500 mb-3">{p.description}</p>
                        <div className="mb-3">
                          <span className="text-xs text-gray-400 line-through">US$ {p.priceOld}</span>
                          <div className="text-3xl font-black text-gray-900">
                            US$ {p.price}<span className="text-sm font-normal text-gray-500">{p.period}</span>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          {p.features.map((f) => (
                            <div key={f} className="flex items-start gap-2 text-xs text-gray-700">
                              <Check className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                              {f}
                            </div>
                          ))}
                        </div>
                        <p className={`text-xs mt-3 font-medium ${
                          p.id === "monthly" ? "text-orange-600" : "text-purple-700"
                        }`}>
                          {p.note}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Button
                    size="lg"
                    className="w-full bg-purple-600 hover:bg-purple-700 py-6 text-lg font-bold"
                    onClick={() => setStep("payment")}
                  >
                    Continuar com {plan.label} — US$ {plan.price}{plan.period} →
                  </Button>

                  <div className="text-center text-sm text-gray-600">
                    Já tem conta?{" "}
                    <Link to="/login" className="text-purple-700 font-bold hover:underline">Entrar</Link>
                  </div>
                </>
              )}

              {/* ── ETAPA 2: Formulário ── */}
              {(step === "payment" || isRenewal) && (
                <form onSubmit={handleSubmit}>
                  <Card className="p-6 bg-white shadow-sm">
                    <div className="space-y-5">

                      {/* Resumo do plano */}
                      <div className="p-3 bg-purple-50 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-purple-900">
                            {isRenewal ? "Renovação — Plano Mensal" : plan.label}
                          </p>
                          <p className="text-xs text-purple-700">
                            {isRenewal ? "30 dias de acesso renovado" : plan.note}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-purple-700">
                            US$ {isRenewal ? "5" : plan.price}
                          </p>
                          <p className="text-xs text-gray-500">
                            {isRenewal ? "/mês" : plan.period}
                          </p>
                        </div>
                      </div>

                      {/* Dados da conta (apenas novo registo) */}
                      {!isRenewal && (
                        <>
                          <div>
                            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                              <span className="w-6 h-6 bg-purple-600 text-white rounded-full text-xs flex items-center justify-center font-bold">1</span>
                              Criar sua conta
                            </h3>
                            <div className="space-y-3">
                              <div>
                                <Label className="text-sm font-semibold">Nome completo</Label>
                                <Input placeholder="Seu nome completo" value={form.name} onChange={set("name")} className="mt-1.5" />
                              </div>
                              <div>
                                <Label className="text-sm font-semibold">E-mail</Label>
                                <Input type="email" placeholder="seu@email.com" value={form.email} onChange={set("email")} className="mt-1.5" />
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
                                  />
                                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowPw(!showPw)}>
                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Guarde esta senha para futuros acessos.</p>
                              </div>
                            </div>
                          </div>
                          <Separator />
                        </>
                      )}

                      {/* Dados do cartão */}
                      <div>
                        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <span className="w-6 h-6 bg-purple-600 text-white rounded-full text-xs flex items-center justify-center font-bold">
                            {isRenewal ? "1" : "2"}
                          </span>
                          Dados do cartão
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm font-semibold">Número do Cartão</Label>
                            <div className="relative mt-1.5">
                              <Input placeholder="0000 0000 0000 0000" value={form.card} onChange={set("card")} className="pl-10" maxLength={19} />
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

                      {/* Resumo final */}
                      <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                        <div className="flex justify-between text-gray-700">
                          <span>{isRenewal ? "Renovação Plano Mensal" : plan.label}</span>
                          <span>US$ {isRenewal ? "5" : plan.price},00</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-black text-lg">
                          <span>Total</span>
                          <span className="text-purple-700">US$ {isRenewal ? "5" : plan.price},00</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {isRenewal
                            ? "Acesso renovado por mais 30 dias a partir de hoje"
                            : selectedPlan === "monthly"
                            ? "Acesso por 30 dias · Renove para continuar"
                            : "Cobrança única · Acesso para sempre"}
                        </p>
                      </div>

                      {error && (
                        <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          {error}
                        </div>
                      )}

                      <Button type="submit" size="lg" className="w-full bg-purple-600 hover:bg-purple-700 py-6 text-lg font-bold" disabled={isProcessing}>
                        {isProcessing ? (
                          <span className="flex items-center gap-2">
                            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                            Processando pagamento...
                          </span>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            {isRenewal
                              ? "Renovar por US$ 5 e Recuperar Acesso"
                              : `Pagar US$ ${plan.price} e Liberar Acesso`}
                          </>
                        )}
                      </Button>

                      <div className="flex items-center justify-center gap-5 pt-1">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500"><Shield className="w-4 h-4 text-green-500" /> SSL Criptografado</div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500"><CreditCard className="w-4 h-4 text-blue-500" /> PCI Compliant</div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500"><Lock className="w-4 h-4 text-purple-500" /> Dados Protegidos</div>
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

              {/* Comparação de planos */}
              <Card className="p-5 bg-gray-50">
                <h4 className="font-bold text-sm mb-3">Comparação de planos</h4>
                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-3 gap-2 font-bold text-gray-500 pb-2 border-b">
                    <span></span><span className="text-center">Mensal</span><span className="text-center">Vitalício</span>
                  </div>
                  {[
                    ["Preço", "US$ 5/mês", "US$ 20"],
                    ["Acesso", "30 dias", "Para sempre"],
                    ["Renovação", "Necessária", "Não precisa"],
                    ["Conteúdos futuros", "✓", "✓ incluídos"],
                    ["Certificados", "✓", "✓"],
                  ].map(([label, monthly, lifetime]) => (
                    <div key={label} className="grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">{label}</span>
                      <span className="text-center text-gray-700">{monthly}</span>
                      <span className="text-center text-purple-700 font-semibold">{lifetime}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-5">
                <h4 className="font-semibold text-sm mb-3">O que dizem nossos alunos</h4>
                <div className="space-y-3">
                  {[
                    { avatar: "👩🏽", name: "Maria S.", text: "Consegui emprego internacional em 3 meses!" },
                    { avatar: "👨🏻", name: "João C.",  text: "Assisto séries sem legenda agora!" },
                  ].map((r) => (
                    <div key={r.name} className="flex items-start gap-3">
                      <div className="text-2xl leading-none">{r.avatar}</div>
                      <div>
                        <div className="flex gap-0.5 mb-0.5">
                          {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                        </div>
                        <p className="text-xs text-gray-700 italic">"{r.text}"</p>
                        <p className="text-xs text-gray-400 mt-0.5 font-medium">{r.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
