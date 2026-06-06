import { useState, useRef } from "react";
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
  GraduationCap, Headphones, Award, Infinity,
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
    description: "30 dias de acesso completo.",
    features: ["50+ horas de conteúdo","NgadaFlow (áudio)","Certificados","Acesso 30 dias","Renovável"],
    note: "Renova mensalmente para manter acesso",
    noteColor: "text-orange-500",
  },
  {
    id: "lifetime" as PlanType,
    label: "Vitalício",
    labelFull: "Plano Vitalício",
    price: "150", priceOld: "300", period: " único",
    badge: "MELHOR VALOR", badgeColor: "bg-purple-600",
    selected: "border-purple-400 bg-purple-50",
    unselected: "border-gray-200 bg-white",
    description: "Um pagamento. Acesso para sempre.",
    features: ["50+ horas de conteúdo","NgadaFlow (áudio)","Certificados","Acesso para sempre","Futuros conteúdos incluídos"],
    note: "Sem mensalidades. Pagas hoje, acedes para sempre.",
    noteColor: "text-purple-700",
  },
];

/* ══════════════════════════════════════════
   CARTÃO 3D ANIMADO
══════════════════════════════════════════ */
const CARD_CSS = `
  @keyframes card-float {
    0%,100% { transform:perspective(900px) rotateX(4deg) rotateY(-4deg) translateY(0); }
    50%     { transform:perspective(900px) rotateX(-2deg) rotateY(4deg) translateY(-10px); }
  }
  @keyframes card-shine-move {
    0%   { background-position:200% 0; }
    100% { background-position:-200% 0; }
  }
  @keyframes card-glow-pulse {
    0%,100% { box-shadow:0 24px 64px rgba(124,58,237,.45), 0 8px 20px rgba(0,0,0,.25); }
    50%     { box-shadow:0 28px 80px rgba(124,58,237,.65), 0 12px 28px rgba(0,0,0,.3); }
  }
  .card-3d-idle {
    animation: card-float 5s ease-in-out infinite, card-glow-pulse 4s ease-in-out infinite;
    transition: transform .15s ease, box-shadow .15s ease;
  }
  .card-3d-hover {
    animation: card-glow-pulse 4s ease-in-out infinite;
    transition: transform .08s ease, box-shadow .08s ease;
  }
  .card-shine {
    background: linear-gradient(105deg,
      transparent 20%,
      rgba(255,255,255,.18) 35%,
      rgba(255,255,255,.38) 50%,
      rgba(255,255,255,.18) 65%,
      transparent 80%
    );
    background-size: 300% 100%;
    animation: card-shine-move 3s linear infinite;
  }
  .card-holo {
    background: linear-gradient(135deg,
      rgba(255,100,100,.05) 0%,
      rgba(100,100,255,.07) 25%,
      rgba(100,255,100,.05) 50%,
      rgba(255,100,200,.07) 75%,
      rgba(100,200,255,.05) 100%
    );
    background-size: 400% 400%;
    animation: card-shine-move 6s linear infinite;
  }
`;

function Card3D() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [shine, setShine] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top)  / rect.height;
    setTilt({ x: (ny - .5) * -22, y: (nx - .5) * 22 });
    setShine({ x: nx * 100, y: ny * 100 });
  };

  return (
    <>
      <style>{CARD_CSS}</style>
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setTilt({ x:0, y:0 }); setShine({ x:50, y:50 }); }}
        style={{ perspective: 1000, marginBottom: 20, userSelect: "none" }}
      >
        <div
          className={hovered ? "card-3d-hover" : "card-3d-idle"}
          style={{
            width: "100%", height: 160, borderRadius: 20,
            background: "linear-gradient(135deg,#6d28d9 0%,#4f46e5 45%,#2563eb 100%)",
            transform: hovered
              ? `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.04)`
              : undefined,
            position: "relative", overflow: "hidden", cursor: "default",
          }}
        >
          {/* Grid de fundo */}
          <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px)", backgroundSize:"32px 32px" }} />

          {/* Holo overlay */}
          <div className="card-holo" style={{ position:"absolute", inset:0 }} />

          {/* Shine seguindo o rato */}
          <div style={{
            position:"absolute", inset:0, borderRadius:20,
            background:`radial-gradient(ellipse at ${shine.x}% ${shine.y}%, rgba(255,255,255,.28) 0%, rgba(255,255,255,.06) 40%, transparent 65%)`,
            transition: hovered ? "none" : "opacity .4s",
            opacity: hovered ? 1 : 0.4,
          }} />

          {/* Shimmer contínuo */}
          <div className="card-shine" style={{ position:"absolute", inset:0 }} />

          {/* Chip */}
          <div style={{
            position:"absolute", top:22, left:22,
            width:40, height:30, borderRadius:6,
            background:"linear-gradient(135deg,#fbbf24,#f59e0b,#d97706)",
            boxShadow:"0 2px 8px rgba(0,0,0,.35)",
            display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden",
          }}>
            <div style={{ width:"100%", height:1, background:"rgba(0,0,0,.15)" }} />
          </div>

          {/* Ícone contactless */}
          <div style={{ position:"absolute", top:22, right:22, fontSize:18, color:"rgba(255,255,255,.65)", lineHeight:1, letterSpacing:-2 }}>
            <span style={{ display:"block", fontSize:7, marginBottom:1, opacity:.8 }}>(()</span>
            <span style={{ display:"block", fontSize:11, marginBottom:1 }}>(())</span>
            <span style={{ display:"block", fontSize:15 }}>((()))</span>
          </div>

          {/* Número do cartão */}
          <div style={{ position:"absolute", bottom:40, left:22, color:"rgba(255,255,255,.8)", fontSize:15, fontWeight:700, letterSpacing:5, fontFamily:"monospace", textShadow:"0 1px 4px rgba(0,0,0,.3)" }}>
            ••••  ••••  ••••  ••••
          </div>

          {/* Nome + data */}
          <div style={{ position:"absolute", bottom:14, left:22, right:22, display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
            <span style={{ color:"rgba(255,255,255,.5)", fontSize:10, fontWeight:600, letterSpacing:1.5, textTransform:"uppercase" }}>Nome no Cartão</span>
            <span style={{ color:"rgba(255,255,255,.5)", fontSize:10, fontWeight:600, letterSpacing:1 }}>MM/AA</span>
          </div>

          {/* Logo Mastercard */}
          <div style={{ position:"absolute", bottom:14, right:22, display:"flex" }}>
            <div style={{ width:24, height:24, borderRadius:"50%", background:"rgba(235,68,68,.85)", marginRight:-8 }} />
            <div style={{ width:24, height:24, borderRadius:"50%", background:"rgba(251,191,36,.85)" }} />
          </div>
        </div>
      </div>
    </>
  );
}

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
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Resumo do plano */}
      <div className="flex items-center justify-between p-4 rounded-2xl"
        style={{ background: "linear-gradient(135deg,#f5f3ff,#ede9fe)", border: "1.5px solid #ddd6fe" }}>
        <div>
          <p className="text-sm font-black text-purple-900">
            {isRenewal ? "Renovação — Plano Mensal" : plan.labelFull}
          </p>
          <p className="text-xs text-purple-500 mt-0.5">{isRenewal ? "30 dias renovados" : plan.note}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-purple-700">US$ {isRenewal ? "15" : plan.price}</p>
          <p className="text-[11px] text-gray-400">{isRenewal ? "≈ €14" : plan.id === "lifetime" ? "≈ €138" : "≈ €14/mês"}</p>
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
              <Label className="text-xs font-semibold text-gray-500">Nome completo</Label>
              <Input placeholder="O seu nome" value={form.name} onChange={set("name")}
                className="mt-1 h-11 text-base rounded-xl border-gray-200 focus:border-purple-400" />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-500">E-mail</Label>
              <Input type="email" placeholder="seu@email.com" value={form.email} onChange={set("email")}
                className="mt-1 h-11 text-base rounded-xl border-gray-200 focus:border-purple-400" />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-500">Senha</Label>
              <div className="relative mt-1">
                <Input
                  type={showPw ? "text" : "password"} placeholder="Mínimo 6 caracteres"
                  value={form.password} onChange={set("password")}
                  className="h-11 text-base rounded-xl pr-10 border-gray-200 focus:border-purple-400"
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
          <Separator className="bg-gray-100" />
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

        {/* Cartão 3D visual */}
        <Card3D />

        <div className="border-2 border-gray-200 rounded-xl px-4 py-4 bg-white focus-within:border-purple-400 focus-within:shadow-sm transition-all">
          <CardElement
            options={CARD_STYLE}
            onChange={(e) => { setCardReady(e.complete); setError(e.error?.message || ""); }}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="https://js.stripe.com/v3/fingerprinted/img/visa-365725566f9578a9589553aa9296d178.svg" alt="Visa" className="h-4 opacity-70" />
            <img src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg" alt="MC" className="h-4 opacity-70" />
            <img src="https://js.stripe.com/v3/fingerprinted/img/amex-a49b82f46c5cd6a96a6e418a6ca1717c.svg" alt="Amex" className="h-4 opacity-70" />
          </div>
          <span className="text-[11px] text-gray-400 flex items-center gap-1">
            <Lock className="w-3 h-3" /> SSL 256-bit
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
        <div>
          <span className="font-bold text-gray-800 text-sm">Total a pagar</span>
          <p className="text-[11px] text-gray-400 mt-0.5">Via Stripe · processado em USD</p>
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
        className="w-full h-14 text-base font-black rounded-2xl disabled:opacity-50"
        style={{ background: processing || !stripe || !cardReady ? undefined : "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 8px 24px rgba(124,58,237,.35)" }}>
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

      <div className="flex items-center justify-center gap-5 text-xs text-gray-400 pt-1">
        <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-green-500" /> SSL</span>
        <span className="flex items-center gap-1"><CreditCard className="w-3.5 h-3.5 text-blue-500" /> PCI</span>
        <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-purple-500" /> Stripe</span>
      </div>

      {!isRenewal && (
        <button type="button" onClick={onBack}
          className="w-full text-sm text-gray-400 hover:text-purple-600 transition-colors flex items-center justify-center gap-1 py-1">
          <ArrowLeft className="w-4 h-4" /> Escolher outro plano
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
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#f9f8ff" }}>
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
            <Check className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-black mb-2 text-gray-900">Já tens acesso!</h1>
          <p className="text-gray-500 text-sm mb-6">O teu plano está activo e pronto a usar.</p>
          <Link to="/dashboard">
            <Button className="font-bold px-10 h-12 rounded-2xl text-white"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
              Ir para o Painel →
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isRenewal = isAuthenticated && !isAccessActive && user?.plan === "monthly";

  return (
    <div className="min-h-screen" style={{ background: "#f9f8ff", fontFamily: "system-ui,-apple-system,sans-serif" }}>

      {/* ── Nav ── */}
      <header style={{ background: "#fff", borderBottom: "1px solid #ede9fe" }}>
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" style={{ textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <GraduationCap size={16} color="#fff" />
            </div>
            <span style={{ fontWeight: 900, fontSize: 17, color: "#111" }}>NgadaLearn</span>
          </Link>
          <Link to="/login" style={{ fontSize: 13, fontWeight: 600, color: "#7c3aed", textDecoration: "none" }}>
            Já tens conta? Entrar
          </Link>
        </div>
      </header>

      {/* ── Barra de confiança ── */}
      <div style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
        <div className="flex items-center justify-center gap-4 sm:gap-8 px-4 py-2.5 flex-wrap">
          {[
            { icon: Shield, label: "100% seguro" },
            { icon: Check,  label: "Acesso imediato" },
            { icon: Lock,   label: "Sem taxas ocultas" },
          ].map(({ icon: Icon, label }) => (
            <span key={label} className="flex items-center gap-1.5 text-white text-xs font-semibold">
              <Icon className="w-3.5 h-3.5 opacity-80" /> {label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Sticky CTA mobile ── */}
      {step === "plan" && !isRenewal && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-t border-gray-100 px-4 py-3 shadow-2xl">
          <Button size="lg" onClick={() => setStep("payment")}
            className="w-full h-13 text-[15px] font-black rounded-2xl text-white"
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
            Continuar com {plan.labelFull} — US$ {plan.price}{plan.period} →
          </Button>
          <p className="text-center text-xs text-gray-400 mt-2">
            Já tens conta?{" "}
            <Link to="/login" className="text-purple-600 font-semibold">Entrar</Link>
          </p>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 pb-40 sm:pb-10">

        {/* ── Banner de renovação ── */}
        {isRenewal && (
          <div className="mb-6 space-y-3">
            <div className="rounded-2xl p-5 text-white shadow-lg"
              style={{ background: "linear-gradient(135deg,#f97316,#ef4444)" }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <RefreshCw className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-black text-lg">O teu acesso expirou</p>
                  <p className="text-orange-100 text-sm mt-1">
                    O Plano Mensal chegou ao fim. Renova para retomar o acesso a todo o conteúdo.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-white border-2 border-purple-100 rounded-2xl shadow-sm">
              <div>
                <p className="font-black text-gray-900">Renovação — Plano Mensal</p>
                <p className="text-sm text-gray-400 mt-0.5">30 dias de acesso completo</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-purple-700">US$ 15</p>
                <p className="text-xs text-gray-400">/mês</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Passos ── */}
        {!isRenewal && (
          <div className="flex items-center gap-2 text-xs sm:text-sm mb-5">
            <button
              onClick={() => step === "payment" && setStep("plan")}
              className={`font-bold transition-colors ${step === "plan" ? "text-purple-700" : "text-gray-400 hover:text-purple-500"}`}
            >
              1. Escolher Plano
            </button>
            <ChevronRight className="w-3 h-3 text-gray-300" />
            <span className={`font-bold ${step === "payment" ? "text-purple-700" : "text-gray-400"}`}>
              2. Conta & Pagamento
            </span>
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-5 lg:gap-8">

          {/* ── Coluna principal ── */}
          <div className="lg:col-span-3 space-y-4">

            {/* Título */}
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                {isRenewal ? "Renovar acesso" : step === "plan" ? "Escolhe o teu plano" : "Criar conta e pagar"}
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                {step === "plan"
                  ? "Paga uma vez e nunca mais te preocupas — ou começa com o mensal."
                  : "Dados da conta e pagamento seguro via Stripe."}
              </p>
            </div>

            {/* ── ETAPA 1 — Selecção de plano ── */}
            {step === "plan" && !isRenewal && (
              <>
                <div className="space-y-3">

                  {/* Plano Vitalício */}
                  {(() => {
                    const p = PLANS[1];
                    const active = selectedPlan === p.id;
                    return (
                      <button
                        type="button"
                        onClick={() => setSelectedPlan(p.id)}
                        className="w-full text-left rounded-2xl overflow-hidden transition-all active:scale-[0.99]"
                        style={{
                          border: `2px solid ${active ? "#7c3aed" : "#e5e7eb"}`,
                          boxShadow: active ? "0 8px 32px rgba(124,58,237,.18)" : "none",
                        }}
                      >
                        {/* Faixa topo */}
                        <div style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ color: "#fff", fontSize: 12, fontWeight: 800, letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 6 }}>
                            <Star className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" /> Mais popular
                          </span>
                          <span style={{ background: "rgba(255,255,255,.22)", color: "#fff", fontSize: 10, fontWeight: 800, padding: "2px 10px", borderRadius: 99 }}>50% OFF</span>
                        </div>
                        {/* Corpo */}
                        <div style={{ padding: "20px", background: active ? "#faf8ff" : "#fff" }}>
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                                <div style={{
                                  width: 20, height: 20, borderRadius: "50%", border: `2px solid ${active ? "#7c3aed" : "#d1d5db"}`,
                                  background: active ? "#7c3aed" : "transparent",
                                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                                }}>
                                  {active && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}
                                </div>
                                <span style={{ fontWeight: 900, fontSize: 18, color: "#111" }}>Plano Vitalício</span>
                              </div>
                              <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 14 }}>Um pagamento. Acesso para sempre.</p>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px" }}>
                                {p.features.map((f) => (
                                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#374151" }}>
                                    <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />{f}
                                  </div>
                                ))}
                              </div>
                            </div>
                            {/* Preço */}
                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                              <div style={{ fontSize: 13, color: "#d1d5db", textDecoration: "line-through" }}>US$ {p.priceOld}</div>
                              <div style={{ fontSize: 36, fontWeight: 900, color: "#7c3aed", lineHeight: 1.1 }}>US$ {p.price}</div>
                              <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>pagamento único</div>
                              <div style={{ fontSize: 11, color: "#9ca3af" }}>≈ €138</div>
                            </div>
                          </div>
                          <div style={{ borderTop: "1px solid #ede9fe", marginTop: 14, paddingTop: 12, fontSize: 12, fontWeight: 600, color: "#7c3aed" }}>
                            ✓ Sem mensalidades. Pagas hoje, acedes para sempre.
                          </div>
                        </div>
                      </button>
                    );
                  })()}

                  {/* Plano Mensal */}
                  {(() => {
                    const p = PLANS[0];
                    const active = selectedPlan === p.id;
                    return (
                      <button
                        type="button"
                        onClick={() => setSelectedPlan(p.id)}
                        className="w-full text-left rounded-2xl overflow-hidden transition-all active:scale-[0.99]"
                        style={{
                          border: `2px solid ${active ? "#60a5fa" : "#e5e7eb"}`,
                          background: active ? "#f0f9ff" : "#fff",
                          boxShadow: active ? "0 4px 16px rgba(96,165,250,.15)" : "none",
                        }}
                      >
                        <div style={{ padding: "18px 20px" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                              <div style={{
                                width: 20, height: 20, borderRadius: "50%", border: `2px solid ${active ? "#3b82f6" : "#d1d5db"}`,
                                background: active ? "#3b82f6" : "transparent",
                                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                              }}>
                                {active && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}
                              </div>
                              <div>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <span style={{ fontWeight: 900, fontSize: 16, color: "#111" }}>Plano Mensal</span>
                                  <span style={{ background: "#dbeafe", color: "#2563eb", fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 99 }}>FLEXÍVEL</span>
                                </div>
                                <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>30 dias de acesso completo</p>
                              </div>
                            </div>
                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                              <div style={{ fontSize: 12, color: "#d1d5db", textDecoration: "line-through" }}>US$ {p.priceOld}</div>
                              <div style={{ fontSize: 22, fontWeight: 900, color: "#111" }}>
                                US$ {p.price}<span style={{ fontSize: 13, fontWeight: 400, color: "#9ca3af" }}>/mês</span>
                              </div>
                              <div style={{ fontSize: 11, color: "#9ca3af" }}>≈ €14/mês</div>
                            </div>
                          </div>
                          <div style={{ borderTop: "1px solid #f3f4f6", marginTop: 12, paddingTop: 10, fontSize: 12, fontWeight: 600, color: "#f97316" }}>
                            Renova mensalmente para manter o acesso
                          </div>
                        </div>
                      </button>
                    );
                  })()}
                </div>

                {/* CTA */}
                <div className="space-y-3 pt-1">
                  <Button size="lg" onClick={() => setStep("payment")}
                    className="w-full h-14 text-base font-black rounded-2xl text-white transition-all"
                    style={{
                      background: selectedPlan === "lifetime"
                        ? "linear-gradient(135deg,#7c3aed,#4f46e5)"
                        : "linear-gradient(135deg,#3b82f6,#2563eb)",
                      boxShadow: selectedPlan === "lifetime"
                        ? "0 8px 28px rgba(124,58,237,.4)"
                        : "0 8px 28px rgba(59,130,246,.35)",
                    }}>
                    Continuar com {plan.labelFull} — US$ {plan.price}{plan.period} →
                  </Button>
                  <p className="text-center text-sm text-gray-400">
                    Já tens conta?{" "}
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
          <div className="hidden lg:flex lg:col-span-2 flex-col gap-4">

            {/* O que está incluído */}
            <div style={{ background: "#fff", border: "1px solid #ede9fe", borderRadius: 20, padding: "22px 24px" }}>
              <h3 style={{ fontWeight: 800, fontSize: 14, color: "#111", marginBottom: 16 }}>O que está incluído</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { icon: Check,      text: "50+ horas de conteúdo" },
                  { icon: Headphones, text: "NgadaFlow — áudio com nativos" },
                  { icon: Check,      text: "Exercícios de conversação" },
                  { icon: Check,      text: "100+ exercícios práticos" },
                  { icon: Award,      text: "Certificado de conclusão" },
                  { icon: Check,      text: "Zero anúncios" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={13} color="#16a34a" />
                    </div>
                    <span style={{ fontSize: 13, color: "#374151" }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparação */}
            <div style={{ background: "#faf8ff", border: "1px solid #ede9fe", borderRadius: 20, padding: "22px 24px" }}>
              <h4 style={{ fontWeight: 800, fontSize: 14, color: "#111", marginBottom: 14 }}>Comparação rápida</h4>
              <div style={{ fontSize: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "0 16px", color: "#9ca3af", fontWeight: 700, paddingBottom: 8, borderBottom: "1px solid #ede9fe", marginBottom: 4 }}>
                  <span />
                  <span style={{ textAlign: "center" }}>Mensal</span>
                  <span style={{ textAlign: "center", color: "#7c3aed" }}>Vitalício</span>
                </div>
                {[
                  ["Preço",       "US$ 15/mês",   "US$ 150"],
                  ["Acesso",      "30 dias",       "Para sempre"],
                  ["Renovação",   "Mensal",        "Nunca"],
                  ["Conteúdos +", "✓",             "✓ incluídos"],
                  ["Certificado", "✓",             "✓"],
                ].map(([l, m, v]) => (
                  <div key={l} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "0 16px", padding: "9px 0", borderBottom: "1px solid #f3f4f6" }}>
                    <span style={{ color: "#6b7280", fontWeight: 500 }}>{l}</span>
                    <span style={{ textAlign: "center", color: "#6b7280" }}>{m}</span>
                    <span style={{ textAlign: "center", color: "#7c3aed", fontWeight: 700 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Garantia */}
            <div style={{ background: "linear-gradient(135deg,#f5f3ff,#ede9fe)", border: "1px solid #ddd6fe", borderRadius: 20, padding: "18px 20px", display: "flex", alignItems: "center", gap: 12 }}>
              <Shield size={22} color="#7c3aed" style={{ flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 800, color: "#5b21b6" }}>Pagamento seguro</p>
                <p style={{ fontSize: 12, color: "#8b5cf6", marginTop: 2 }}>Processado via Stripe · SSL · PCI Compliant</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
