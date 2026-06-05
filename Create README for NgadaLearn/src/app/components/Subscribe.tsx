import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements, CardElement, useStripe, useElements,
} from "@stripe/react-stripe-js";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { useAuth, API_URL } from "../context/AuthContext";
import type { PlanType } from "../context/AuthContext";
import {
  Check, Shield, Lock, Star, ChevronRight,
  AlertCircle, RefreshCw, CreditCard, ArrowLeft,
} from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PLANS = [
  {
    id: "monthly" as PlanType,
    label: "Mensal",
    labelFull: "Plano Mensal",
    price: "15", priceOld: "30", period: "/mês",
    badge: "FLEXÍVEL", badgeColor: "bg-blue-600",
    selected: "border-blue-400 bg-blue-50",
    unselected: "border-gray-200 bg-white",
    description: "Acesso completo por 30 dias.",
    features: ["50+ horas de conteúdo","NgadaFlow (áudio)","Certificados","Acesso 30 dias","Renovável"],
    note: "Acesso bloqueado após 30 dias",
    noteColor: "text-orange-600",
  },
  {
    id: "lifetime" as PlanType,
    label: "Vitalício",
    labelFull: "Plano Vitalício",
    price: "150", priceOld: "300", period: " único",
    badge: "MELHOR VALOR", badgeColor: "bg-purple-600",
    selected: "border-purple-400 bg-purple-50",
    unselected: "border-gray-200 bg-white",
    description: "Pague uma vez, acesso para sempre.",
    features: ["50+ horas de conteúdo","NgadaFlow (áudio)","Certificados","Acesso para sempre","Futuros conteúdos incluídos"],
    note: "Pagamento único — sem mensalidades",
    noteColor: "text-purple-700",
  },
];

const CARD_STYLE = {
  style: {
    base: { fontSize: "16px", color: "#1f2937", fontFamily: "inherit", "::placeholder": { color: "#9ca3af" } },
    invalid: { color: "#ef4444" },
  },
};

/* ══════════════════════════════════════════
   FORMULÁRIO DE PAGAMENTO
══════════════════════════════════════════ */
function PaymentForm({
  selectedPlan, isRenewal, onBack,
}: { selectedPlan: PlanType; isRenewal: boolean; onBack: () => void }) {
  const stripe   = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { activatePlan, renewMonthly, user, token } = useAuth();

  const plan = PLANS.find((p) => p.id === selectedPlan)!;

  const [form, setForm] = useState({
    name: user?.name || "", email: user?.email || "", password: "",
  });
  const [error,      setError]      = useState("");
  const [processing, setProcessing] = useState(false);
  const [cardReady,  setCardReady]  = useState(false);
  const [showPw,     setShowPw]     = useState(false);
  const [slowServer, setSlowServer] = useState(false);

  const set = (f: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setError("");
    if (!isRenewal) {
      if (!form.name.trim())           return setError("Informe o seu nome completo.");
      if (!form.email.includes("@"))   return setError("Informe um e-mail válido.");
      if (form.password.length < 6)    return setError("A senha deve ter pelo menos 6 caracteres.");
    }
    setProcessing(true); setSlowServer(false);
    const slowTimer = setTimeout(() => setSlowServer(true), 8000);
    try {
      const planToUse  = isRenewal ? "monthly" : selectedPlan;
      const emailToUse = isRenewal ? user?.email ?? "" : form.email;

      const intentRes = await fetch(`${API_URL}/api/payments/create-intent`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planToUse, email: emailToUse }),
      });
      if (!intentRes.ok) {
        const errData = await intentRes.json().catch(() => ({}));
        throw new Error(errData.error || "Erro ao iniciar pagamento. Verifique a sua ligação.");
      }
      const { clientSecret } = await intentRes.json();

      const cardEl = elements.getElement(CardElement);
      if (!cardEl) throw new Error("Elemento de cartão não encontrado.");

      const { error: stripeErr, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardEl,
          billing_details: { name: isRenewal ? (user?.name ?? "") : form.name, email: emailToUse },
        },
      });
      if (stripeErr) { setError(stripeErr.message || "Pagamento recusado."); setProcessing(false); return; }
      if (!paymentIntent?.id) throw new Error("ID de pagamento em falta.");

      if (isRenewal) {
        const r = await fetch(`${API_URL}/api/payments/renew`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
        });
        if (!r.ok) { const d = await r.json(); throw new Error(d.error || "Erro ao renovar."); }
        const { user: u, token: t } = await r.json();
        renewMonthly(u, t);
      } else {
        const r = await fetch(`${API_URL}/api/payments/confirm`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentIntentId: paymentIntent.id, name: form.name, email: form.email, password: form.password, plan: selectedPlan }),
        });
        if (!r.ok) { const d = await r.json(); throw new Error(d.error || "Erro ao activar conta."); }
        const { user: u, token: t } = await r.json();
        activatePlan(u, t);
      }
      clearTimeout(slowTimer);
      setSlowServer(false);
      navigate("/dashboard");
    } catch (err: unknown) {
      clearTimeout(slowTimer);
      setSlowServer(false);
      setError(err instanceof Error ? err.message : "Erro inesperado. Tente novamente.");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Resumo do plano */}
      <div className="flex items-center justify-between p-3.5 bg-purple-50 border border-purple-200 rounded-2xl">
        <div>
          <p className="text-sm font-bold text-purple-900">
            {isRenewal ? "Renovação — Plano Mensal" : plan.labelFull}
          </p>
          <p className="text-xs text-purple-600 mt-0.5">{isRenewal ? "30 dias renovados" : plan.note}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-purple-700">US$ {isRenewal ? "15" : plan.price}</p>
          <p className="text-xs text-gray-500">{isRenewal ? "/mês" : plan.period}</p>
          <p className="text-[11px] text-gray-400">≈ {isRenewal ? "€14/mês" : plan.id === "lifetime" ? "€138" : "€14/mês"}</p>
        </div>
      </div>

      {/* Dados da conta */}
      {!isRenewal && (
        <>
          <div className="space-y-3">
            <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <span className="w-5 h-5 bg-purple-600 text-white rounded-full text-[11px] flex items-center justify-center font-bold flex-shrink-0">1</span>
              Criar a sua conta
            </p>
            <div>
              <Label className="text-xs font-semibold text-gray-600">Nome completo</Label>
              <Input placeholder="O seu nome" value={form.name} onChange={set("name")}
                className="mt-1 h-11 text-base rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-600">E-mail</Label>
              <Input type="email" placeholder="seu@email.com" value={form.email} onChange={set("email")}
                className="mt-1 h-11 text-base rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-600">Senha (mín. 6 caracteres)</Label>
              <div className="relative mt-1">
                <Input
                  type={showPw ? "text" : "password"} placeholder="Crie uma senha segura"
                  value={form.password} onChange={set("password")}
                  className="h-11 text-base rounded-xl pr-10"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5">
                  {showPw
                    ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/></svg>
                    : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Cartão */}
      <div className="space-y-2">
        <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <span className="w-5 h-5 bg-purple-600 text-white rounded-full text-[11px] flex items-center justify-center font-bold flex-shrink-0">
            {isRenewal ? "1" : "2"}
          </span>
          Dados do cartão
        </p>
        <div className="border-2 border-gray-200 rounded-xl px-4 py-4 bg-white focus-within:border-purple-400 focus-within:shadow-sm transition-all">
          <CardElement
            options={CARD_STYLE}
            onChange={(e) => { setCardReady(e.complete); setError(e.error?.message || ""); }}
          />
        </div>
        <p className="text-[11px] text-gray-400 flex items-center gap-1">
          <Lock className="w-3 h-3" /> Número do cartão · Validade (MM/AA) · CVV — encriptação SSL 256-bit
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <img src="https://js.stripe.com/v3/fingerprinted/img/visa-365725566f9578a9589553aa9296d178.svg" alt="Visa" className="h-4" />
          <img src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg" alt="MC" className="h-4" />
          <img src="https://js.stripe.com/v3/fingerprinted/img/amex-a49b82f46c5cd6a96a6e418a6ca1717c.svg" alt="Amex" className="h-4" />
          <span className="ml-auto text-xs text-gray-400 flex items-center gap-1">
            <Lock className="w-3 h-3" /> Stripe
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
        <div>
          <span className="font-bold text-gray-800">Total</span>
          <p className="text-[11px] text-gray-400">Processado em USD via Stripe</p>
        </div>
        <div className="text-right">
          <span className="text-xl font-black text-purple-700">US$ {isRenewal ? "15" : plan.price},00</span>
          <p className="text-[11px] text-gray-400">≈ {isRenewal || plan.id === "monthly" ? "€14" : "€138"}</p>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Botão pagar */}
      <Button type="submit" size="lg" disabled={processing || !stripe || !cardReady}
        className="w-full bg-purple-600 hover:bg-purple-700 active:bg-purple-800 h-14 text-base font-bold rounded-2xl disabled:opacity-60">
        {processing
          ? <span className="flex items-center gap-2"><span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> A processar...</span>
          : <><Lock className="w-4 h-4 mr-2" />{isRenewal ? "Renovar por US$ 15" : `Pagar US$ ${plan.price} e Activar`}</>
        }
      </Button>

      {slowServer && (
        <div className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-100 rounded-xl text-xs text-purple-600">
          <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-purple-400 border-t-transparent flex-shrink-0" />
          A verificar pagamento com segurança...
        </div>
      )}

      {/* Selos */}
      <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-green-500" /> SSL</span>
        <span className="flex items-center gap-1"><CreditCard className="w-3.5 h-3.5 text-blue-500" /> PCI</span>
        <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-purple-500" /> Seguro</span>
      </div>

      {!isRenewal && (
        <button type="button" onClick={onBack}
          className="w-full text-sm text-gray-400 hover:text-purple-600 transition-colors flex items-center justify-center gap-1 py-1">
          <ArrowLeft className="w-4 h-4" /> Voltar e alterar plano
        </button>
      )}
    </form>
  );
}

/* ══════════════════════════════════════════
   PÁGINA PRINCIPAL
══════════════════════════════════════════ */
export function Subscribe() {
  const { isAuthenticated, isAccessActive, user } = useAuth();

  const [selectedPlan, setSelectedPlan] = useState<PlanType>("lifetime");
  const [step, setStep] = useState<"plan" | "payment">("plan");

  const plan = PLANS.find((p) => p.id === selectedPlan)!;

  if (isAuthenticated && isAccessActive) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-xl font-black mb-2">Já tem acesso!</h1>
          <p className="text-gray-500 text-sm mb-5">O seu plano está activo.</p>
          <Link to="/dashboard">
            <Button className="bg-purple-600 hover:bg-purple-700 font-bold px-8 h-12 rounded-2xl">
              Ir para o Painel →
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isRenewal = isAuthenticated && !isAccessActive && user?.plan === "monthly";

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Barra de confiança (compacta no mobile) ── */}
      <div className="bg-purple-700 text-white">
        <div className="flex items-center justify-center gap-3 sm:gap-6 px-4 py-2 text-[11px] sm:text-sm flex-wrap">
          <span className="flex items-center gap-1"><Shield className="w-3 h-3 sm:w-4 sm:h-4" /> 100% seguro</span>
          <span className="flex items-center gap-1"><Check className="w-3 h-3 sm:w-4 sm:h-4" /> Acesso imediato</span>
          <span className="flex items-center gap-1"><Lock className="w-3 h-3 sm:w-4 sm:h-4" /> Sem taxas ocultas</span>
        </div>
      </div>

      {/* ── Sticky CTA mobile — passo 1 ── */}
      {step === "plan" && !isRenewal && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-t border-gray-100 px-4 py-3 shadow-2xl pb-safe">
          <Button size="lg" onClick={() => setStep("payment")}
            className="w-full bg-purple-600 active:bg-purple-800 h-13 text-[15px] font-bold rounded-2xl">
            Continuar com {plan.labelFull} — US$ {plan.price}{plan.period} →
          </Button>
          <p className="text-center text-xs text-gray-400 mt-2">
            Já tem conta?{" "}
            <Link to="/login" className="text-purple-600 font-semibold">Entrar</Link>
          </p>
        </div>
      )}

      <div className="container mx-auto px-4 py-5 sm:py-8 pb-36 sm:pb-8 max-w-5xl">

        {/* ── Banner de renovação profissional ── */}
        {isRenewal && (
          <div className="mb-6">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-5 text-white mb-4 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <RefreshCw className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-black text-lg leading-tight">O seu acesso expirou</p>
                  <p className="text-orange-100 text-sm mt-1">
                    O seu Plano Mensal chegou ao fim. Renove agora para retomar o acesso imediato a todo o conteúdo.
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                {["50+ horas de conteúdo", "NgadaFlow (áudio)", "Acesso em 30 segundos"].map(f => (
                  <div key={f} className="bg-white/15 rounded-xl p-2">
                    <Check className="w-4 h-4 text-white mx-auto mb-1" />
                    <p className="text-[10px] text-orange-100 font-semibold leading-tight">{f}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-white border-2 border-purple-100 rounded-2xl shadow-sm">
              <div>
                <p className="font-black text-gray-900">Plano Mensal — Renovação</p>
                <p className="text-sm text-gray-500 mt-0.5">30 dias de acesso completo · Renova quando precisar</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-purple-700">US$ 15</p>
                <p className="text-xs text-gray-400">/mês</p>
              </div>
            </div>
          </div>
        )}

        {/* Passos */}
        {!isRenewal && (
          <div className="flex items-center gap-2 text-xs sm:text-sm mb-4">
            <button
              onClick={() => step === "payment" && setStep("plan")}
              className={`font-bold ${step === "plan" ? "text-purple-700" : "text-gray-400"}`}
            >
              1. Escolher Plano
            </button>
            <ChevronRight className="w-3 h-3 text-gray-300" />
            <span className={`font-bold ${step === "payment" ? "text-purple-700" : "text-gray-400"}`}>
              2. Criar Conta & Pagar
            </span>
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-5 lg:gap-8">

          {/* ── Coluna principal ── */}
          <div className="lg:col-span-3 space-y-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black">
                {isRenewal ? "Renovar Plano Mensal" : step === "plan" ? "Escolha o seu plano" : "Criar conta e pagar"}
              </h1>
              <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
                {step === "plan" ? "Seleccione o plano que melhor se adapta a si" : "Dados da conta e pagamento seguro via Stripe"}
              </p>
            </div>

            {/* ── ETAPA 1 ── */}
            {step === "plan" && !isRenewal && (
              <>
                {/* Cards de plano — empilhados, design premium */}
                <div className="space-y-3">

                  {/* ── Plano Vitalício (destaque) ── */}
                  {(() => {
                    const p = PLANS[1]; // lifetime
                    const active = selectedPlan === p.id;
                    return (
                      <button
                        type="button"
                        onClick={() => setSelectedPlan(p.id)}
                        className={`w-full text-left rounded-2xl transition-all active:scale-[0.99] border-2 ${
                          active ? "border-purple-500 shadow-xl shadow-purple-100" : "border-gray-200 hover:border-purple-300"
                        }`}
                      >
                        {/* Faixa topo */}
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2 flex items-center justify-between">
                          <span className="text-white text-xs font-black tracking-wider uppercase">⭐ Recomendado — Melhor Valor</span>
                          <span className="bg-white/25 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">POUPA 50%</span>
                        </div>
                        {/* Corpo */}
                        <div className={`p-5 ${active ? "bg-purple-50" : "bg-white"}`}>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                  active ? "border-purple-600 bg-purple-600" : "border-gray-300"
                                }`}>
                                  {active && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                                <span className="font-black text-lg text-gray-900">Plano Vitalício</span>
                              </div>
                              <p className="text-sm text-gray-500 mb-3">Pague uma vez, acesso para sempre. Nunca paga novamente.</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                {p.features.map((f) => (
                                  <div key={f} className="flex items-center gap-1.5 text-sm text-gray-700">
                                    <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />{f}
                                  </div>
                                ))}
                              </div>
                            </div>
                            {/* Preço */}
                            <div className="text-right flex-shrink-0">
                              <div className="text-sm text-gray-400 line-through">US$ {p.priceOld}</div>
                              <div className="text-4xl font-black text-purple-700 leading-none">US$ {p.price}</div>
                              <div className="text-xs text-gray-500 mt-0.5">pagamento único</div>
                              <div className="text-[11px] text-gray-400 mt-0.5">≈ €138</div>
                              <div className="mt-2 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-lg">
                                = US$ 1,25/mês por 10 anos
                              </div>
                            </div>
                          </div>
                          <p className="text-xs font-semibold text-purple-700 mt-3 pt-3 border-t border-purple-100">
                            ✓ Pagamento único — sem mensalidades, sem surpresas
                          </p>
                        </div>
                      </button>
                    );
                  })()}

                  {/* ── Plano Mensal ── */}
                  {(() => {
                    const p = PLANS[0]; // monthly
                    const active = selectedPlan === p.id;
                    return (
                      <button
                        type="button"
                        onClick={() => setSelectedPlan(p.id)}
                        className={`w-full text-left rounded-2xl transition-all active:scale-[0.99] border-2 ${
                          active ? "border-blue-400 shadow-md shadow-blue-50 bg-blue-50" : "border-gray-200 bg-white hover:border-blue-300"
                        }`}
                      >
                        <div className="p-5">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                active ? "border-blue-500 bg-blue-500" : "border-gray-300"
                              }`}>
                                {active && <div className="w-2 h-2 bg-white rounded-full" />}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-black text-base text-gray-900">Plano Mensal</span>
                                  <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">FLEXÍVEL</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">Acesso completo por 30 dias · Cancela quando quiser</p>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="text-xs text-gray-400 line-through">US$ {p.priceOld}</div>
                              <div className="text-2xl font-black text-gray-900">US$ {p.price}<span className="text-sm font-normal text-gray-500">/mês</span></div>
                              <div className="text-[11px] text-gray-400">≈ €14/mês</div>
                            </div>
                          </div>
                          <p className="text-xs font-semibold text-orange-600 mt-3 pt-3 border-t border-gray-100">
                            ⚠ Acesso bloqueado após 30 dias sem renovação
                          </p>
                        </div>
                      </button>
                    );
                  })()}
                </div>

                {/* CTA */}
                <div className="space-y-3 pt-1">
                  <Button size="lg" onClick={() => setStep("payment")}
                    className={`w-full h-14 text-base font-bold rounded-2xl ${
                      selectedPlan === "lifetime"
                        ? "bg-purple-600 hover:bg-purple-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}>
                    Continuar com {plan.labelFull} — US$ {plan.price}{plan.period} →
                  </Button>
                  <p className="text-center text-sm text-gray-500">
                    Já tem conta?{" "}
                    <Link to="/login" className="text-purple-700 font-bold hover:underline">Entrar</Link>
                  </p>
                </div>
              </>
            )}

            {/* ── ETAPA 2 ── */}
            {(step === "payment" || isRenewal) && (
              <Elements stripe={stripePromise} options={{ locale: "pt-PT" }}>
                <PaymentForm selectedPlan={selectedPlan} isRenewal={isRenewal} onBack={() => setStep("plan")} />
              </Elements>
            )}
          </div>

          {/* ── Coluna lateral (só desktop) ── */}
          <div className="hidden lg:block lg:col-span-2 space-y-4">
            <Card className="p-5">
              <h3 className="font-bold text-sm mb-3">O que está incluído</h3>
              <div className="space-y-2">
                {[
                  "50+ horas de conteúdo em vídeo",
                  "NgadaFlow — áudio com nativos",
                  "Exercícios de conversação ilimitados",
                  "100+ exercícios práticos",
                  "Certificado de conclusão",
                  "Zero anúncios",
                ].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />{t}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5 bg-gray-50">
              <h4 className="font-bold text-sm mb-3">Comparação de planos</h4>
              <div className="space-y-1.5 text-xs">
                <div className="grid grid-cols-3 font-bold text-gray-400 pb-1.5 border-b">
                  <span /><span className="text-center">Mensal</span><span className="text-center">Vitalício</span>
                </div>
                {[
                  ["Preço",    "US$ 15/mês", "US$ 150"],
                  ["Acesso",   "30 dias",   "Para sempre"],
                  ["Renovação","Necessária","Não precisa"],
                  ["Futuros",  "✓",         "✓ incluídos"],
                  ["Certific.","✓",         "✓"],
                ].map(([l, m, v]) => (
                  <div key={l} className="grid grid-cols-3 py-1.5 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">{l}</span>
                    <span className="text-center text-gray-700">{m}</span>
                    <span className="text-center text-purple-700 font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h4 className="font-semibold text-sm mb-3">O que dizem os alunos</h4>
              <div className="space-y-3">
                {[
                  { av: "👩🏽", name: "Maria S.", text: "Consegui emprego internacional em 3 meses!" },
                  { av: "👨🏻", name: "João C.", text: "Assisto séries sem legenda agora!" },
                ].map((r) => (
                  <div key={r.name} className="flex items-start gap-3">
                    <span className="text-2xl leading-none">{r.av}</span>
                    <div>
                      <div className="flex gap-0.5 mb-0.5">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                      </div>
                      <p className="text-xs text-gray-600 italic">"{r.text}"</p>
                      <p className="text-xs text-gray-400 font-medium">{r.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
