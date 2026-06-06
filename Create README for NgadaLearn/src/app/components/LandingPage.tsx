import { useState } from "react";
import { Link } from "react-router";
import {
  Star, Users, Shield, Award, Check, ChevronDown, ChevronUp,
  Headphones, BookOpen, Smartphone, Clock, PlayCircle,
  Globe, ArrowRight, Zap, MessageCircle, TrendingUp, Lock,
} from "lucide-react";

/* ─── Animações ─── */
const ANIM = `
  @keyframes blob1 {
    0%,100% { transform: translate(0,0) scale(1); }
    33%     { transform: translate(6%,-10%) scale(1.1); }
    66%     { transform: translate(-5%,7%) scale(.93); }
  }
  @keyframes blob2 {
    0%,100% { transform: translate(0,0) scale(1); }
    50%     { transform: translate(-8%,12%) scale(1.12); }
  }
  @keyframes blob3 {
    0%,100% { transform: translate(0,0) scale(1); }
    40%     { transform: translate(10%,5%) scale(.9); }
  }
  @keyframes lp-float {
    0%,100% { transform: translateY(0); }
    50%     { transform: translateY(-10px); }
  }
  @keyframes lp-in {
    from { opacity:0; transform:translateY(28px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes lp-ring {
    0%   { transform:scale(1); opacity:.6; }
    100% { transform:scale(1.9); opacity:0; }
  }
  @keyframes lp-bar {
    from { width:0; }
  }
  @keyframes lp-shimmer {
    0%   { background-position:-200% 0; }
    100% { background-position:200% 0; }
  }
  @keyframes lp-badge {
    0%,100% { transform:scale(1)  translateY(0); }
    50%     { transform:scale(1.04) translateY(-3px); }
  }
  @keyframes lp-spin { to { transform:rotate(360deg); } }
  @keyframes lp-pulse {
    0%,100% { opacity:1; }
    50%     { opacity:.4; }
  }

  .blob1 { animation: blob1 12s ease-in-out infinite; }
  .blob2 { animation: blob2 15s ease-in-out infinite; }
  .blob3 { animation: blob3 10s ease-in-out infinite; }
  .lp-float  { animation: lp-float 5s ease-in-out infinite; }
  .lp-float2 { animation: lp-float 7s ease-in-out 1s infinite; }
  .lp-float3 { animation: lp-float 6s ease-in-out 2s infinite; }
  .lp-badge  { animation: lp-badge 3.5s ease-in-out infinite; }
  .lp-in-1   { animation: lp-in .65s ease .05s both; }
  .lp-in-2   { animation: lp-in .65s ease .2s  both; }
  .lp-in-3   { animation: lp-in .65s ease .35s both; }
  .lp-in-4   { animation: lp-in .65s ease .5s  both; }
  .lp-in-5   { animation: lp-in .65s ease .65s both; }
  .lp-pulse  { animation: lp-pulse 2s ease-in-out infinite; }
  .lp-card   { transition: transform .25s ease, box-shadow .25s ease; }
  .lp-card:hover { transform:translateY(-5px); box-shadow: 0 20px 60px rgba(0,0,0,.12); }
`;

/* ─── Data ─── */
const FEATURES = [
  {
    icon: MessageCircle, color: "#7c3aed",
    title: "Conversação Real",
    desc: "Aprende a falar com situações reais do dia a dia, trabalho e viagens. Não decorares regras — falas.",
  },
  {
    icon: Headphones, color: "#0891b2",
    title: "NgadaFlow Áudio",
    desc: "Treina o ouvido com sotaques americano, britânico e australiano em velocidade real. Listening de verdade.",
  },
  {
    icon: Zap, color: "#d97706",
    title: "IA Assistente",
    desc: "Corrige a tua pronúncia, responde às tuas dúvidas e adapta-se ao teu ritmo de aprendizagem.",
  },
  {
    icon: Award, color: "#16a34a",
    title: "Certificado Internacional",
    desc: "Recebe o teu certificado de conclusão reconhecido por empresas de Portugal, Brasil e Angola.",
  },
];

const STEPS = [
  { n: "01", title: "Escolhe o teu nível", desc: "Do zero à fluência avançada. O curso adapta-se a ti." },
  { n: "02", title: "Pratica todos os dias", desc: "15 minutos por dia bastam. Áudio, vídeo e conversação." },
  { n: "03", title: "Fala com confiança", desc: "Em 90 dias já fazes conversas reais. Garantido." },
];

const REVIEWS = [
  {
    name: "Maria Silva", location: "São Paulo, BR",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    stars: 5, badge: "Emprego internacional",
    text: "Em 3 meses com NgadaLearn consegui o meu primeiro emprego internacional. O método de conversação é completamente diferente de tudo o que já tentei.",
  },
  {
    name: "João Costa", location: "Lisboa, PT",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    stars: 5, badge: "Séries sem legenda",
    text: "O NgadaFlow mudou completamente o meu listening. Em 2 meses comecei a entender séries americanas sem legenda. Impossível encontrar algo melhor.",
  },
  {
    name: "Amara Ndiaye", location: "Luanda, AO",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face",
    stars: 5, badge: "Promovida no trabalho",
    text: "Aprendo no telemóvel durante o trajeto para o trabalho. Em 4 meses fui promovida graças às competências em inglês. Melhor investimento da minha carreira!",
  },
];

const FAQ_ITEMS = [
  { q: "É pagamento único ou mensalidade?", a: "Pagamento único! Pagas uma vez e tens acesso completo para sempre. Sem mensalidades, sem surpresas." },
  { q: "O que está incluído?", a: "Acesso completo a TUDO: aulas de conversação, áudio NgadaFlow, exercícios, dashboard de progresso e certificado. Sem restrições." },
  { q: "Tenho acesso para sempre?", a: "Sim! Após o pagamento único o acesso é vitalício. Mesmo quando adicionarmos novos conteúdos, continuas a ter acesso sem pagar mais." },
  { q: "Funciona no telemóvel?", a: "Perfeitamente! O NgadaLearn funciona em qualquer dispositivo — telemóvel, tablet ou computador. Estuda onde e quando quiseres." },
  { q: "Quais métodos de pagamento?", a: "Aceitamos todos os principais cartões de crédito e débito via Stripe, o processador de pagamentos mais seguro do mundo." },
];

const RATING_BARS = [
  { stars: 5, pct: 82 }, { stars: 4, pct: 13 },
  { stars: 3, pct: 4  }, { stars: 2, pct: 1  }, { stars: 1, pct: 0 },
];

/* ─── Component ─── */
export function LandingPage() {
  const [openFaq, setOpenFaq]     = useState<number | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const [videoError, setVideoError] = useState(false);

  return (
    <div style={{ fontFamily: "system-ui,-apple-system,sans-serif", overflowX: "hidden" }}>
      <style>{ANIM}</style>

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section style={{ position: "relative", minHeight: "100vh", background: "#07070f", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden" }}>

        {/* Blobs animados */}
        <div className="blob1" style={{ position: "absolute", top: "-10%", left: "-5%", width: "55vw", height: "55vw", maxWidth: 700, maxHeight: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 65%)", filter: "blur(60px)", pointerEvents: "none" }} />
        <div className="blob2" style={{ position: "absolute", bottom: "-15%", right: "-10%", width: "60vw", height: "60vw", maxWidth: 750, maxHeight: 750, borderRadius: "50%", background: "radial-gradient(circle, rgba(79,70,229,0.25) 0%, transparent 65%)", filter: "blur(80px)", pointerEvents: "none" }} />
        <div className="blob3" style={{ position: "absolute", top: "40%", right: "15%", width: "30vw", height: "30vw", maxWidth: 400, maxHeight: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(8,145,178,0.15) 0%, transparent 65%)", filter: "blur(60px)", pointerEvents: "none" }} />

        {/* Grid de linhas subtil */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 10, maxWidth: 1100, margin: "0 auto", padding: "80px 24px 60px", width: "100%" }}>

          {/* Badge top */}
          <div className="lp-in-1 lp-badge" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.4)", borderRadius: 99, padding: "6px 16px", marginBottom: 28 }}>
            <div className="lp-pulse" style={{ width: 7, height: 7, borderRadius: "50%", background: "#a78bfa" }} />
            <span style={{ fontSize: 13, color: "#c4b5fd", fontWeight: 600 }}>Novo · IA integrada · Áudio com nativos</span>
          </div>

          {/* Headline */}
          <h1 className="lp-in-2" style={{ fontSize: "clamp(38px,7vw,82px)", fontWeight: 900, lineHeight: 1.05, color: "#fff", margin: "0 0 24px", maxWidth: 700, letterSpacing: "-1px" }}>
            Fala Inglês<br />
            <span style={{ background: "linear-gradient(135deg,#a78bfa,#60a5fa,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>com Confiança</span>
          </h1>

          <p className="lp-in-3" style={{ fontSize: "clamp(16px,2.2vw,20px)", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 520, margin: "0 0 40px" }}>
            Do zero à fluência — conversação real, áudio com nativos e IA que se adapta ao teu ritmo. <strong style={{ color: "rgba(255,255,255,0.8)" }}>Paga uma vez, aprende para sempre.</strong>
          </p>

          {/* CTAs */}
          <div className="lp-in-4" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 56 }}>
            <Link to="/subscribe" style={{ textDecoration: "none" }}>
              <button style={{ display: "flex", alignItems: "center", gap: 10, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", color: "#fff", border: "none", borderRadius: 14, padding: "15px 28px", fontSize: 16, fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 32px rgba(124,58,237,.5)", whiteSpace: "nowrap" }}>
                Começar Agora — US$ 150 <ArrowRight size={18} />
              </button>
            </Link>
            <button onClick={() => { setVideoError(false); setVideoOpen(true); }}
              style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.06)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14, padding: "15px 24px", fontSize: 16, fontWeight: 700, cursor: "pointer", backdropFilter: "blur(8px)", whiteSpace: "nowrap" }}>
              <PlayCircle size={20} style={{ color: "#a78bfa" }} /> Ver demonstração
            </button>
          </div>

          {/* Stats flutuantes */}
          <div className="lp-in-5" style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {[
              { val: "2.300+", label: "Alunos activos", icon: Users,  color: "#7c3aed" },
              { val: "4.9 ★", label: "Avaliação média", icon: Star,   color: "#d97706" },
              { val: "90 dias", label: "Para fluência", icon: Zap,    color: "#0891b2" },
            ].map(({ val, label, icon: Icon, color }) => (
              <div key={label} className="lp-float" style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.05)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "12px 20px" }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", lineHeight: 1.1 }}>{val}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0.3 }}>
          <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, transparent, #fff)" }} />
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />
        </div>
      </section>

      {/* ════════════════════════════════════════
          TRUST BAR
      ════════════════════════════════════════ */}
      <div style={{ background: "#fff", borderBottom: "1px solid #f0f0f5", padding: "18px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "20px 40px" }}>
          {[
            { icon: Star,    color: "#d97706", text: "4.9/5 — 1.842 avaliações" },
            { icon: Users,   color: "#7c3aed", text: "2.300+ alunos matriculados" },
            { icon: Shield,  color: "#16a34a", text: "Pagamento seguro via Stripe" },
            { icon: Award,   color: "#0891b2", text: "Certificado incluído" },
            { icon: Globe,   color: "#6366f1", text: "PT · BR · AO" },
          ].map(({ icon: Icon, color, text }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "#4b5563", fontWeight: 500, whiteSpace: "nowrap" }}>
              <Icon size={15} style={{ color, flexShrink: 0 }} />
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════
          FEATURES
      ════════════════════════════════════════ */}
      <section style={{ background: "#f8f7ff", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: "#7c3aed", textTransform: "uppercase" }}>Porque funciona</span>
            <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, margin: "10px 0 12px", color: "#111", letterSpacing: "-0.5px" }}>Tudo o que precisas num só lugar</h2>
            <p style={{ fontSize: 17, color: "#6b7280", maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>Sem apps diferentes, sem confusão. Conversa, áudio e IA — tudo integrado.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20 }}>
            {FEATURES.map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="lp-card" style={{ background: "#fff", borderRadius: 22, padding: "28px 26px", border: "1px solid #ede9fe", cursor: "default" }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  <Icon size={24} style={{ color }} />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: "#111", margin: "0 0 8px" }}>{title}</h3>
                <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          COMO FUNCIONA
      ════════════════════════════════════════ */}
      <section style={{ background: "#fff", padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: "#7c3aed", textTransform: "uppercase" }}>Como funciona</span>
            <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 900, margin: "10px 0 0", color: "#111", letterSpacing: "-0.5px" }}>3 passos para a fluência</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 0, position: "relative" }}>
            {/* Linha conectora (desktop) */}
            <div style={{ position: "absolute", top: 36, left: "16.5%", right: "16.5%", height: 2, background: "linear-gradient(to right,#7c3aed,#4f46e5)", display: "block", zIndex: 0 }} />

            {STEPS.map(({ n, title, desc }) => (
              <div key={n} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 24px 0", position: "relative", zIndex: 1 }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, boxShadow: "0 8px 24px rgba(124,58,237,.35)", border: "4px solid #fff" }}>
                  <span style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>{n}</span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: "#111", margin: "0 0 8px" }}>{title}</h3>
                <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════ */}
      <section style={{ background: "#f8f7ff", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: "#7c3aed", textTransform: "uppercase" }}>Resultados reais</span>
            <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 900, margin: "10px 0 10px", color: "#111", letterSpacing: "-0.5px" }}>O que dizem os nossos alunos</h2>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <div style={{ display: "flex", gap: 2 }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />)}
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>4.9</span>
              <span style={{ fontSize: 13, color: "#9ca3af" }}>de 1.842 avaliações verificadas</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
            {REVIEWS.map((r) => (
              <div key={r.name} className="lp-card" style={{ background: "#fff", borderRadius: 22, padding: "26px", border: "1px solid #ede9fe", display: "flex", flexDirection: "column", gap: 16, cursor: "default" }}>
                {/* Stars */}
                <div style={{ display: "flex", gap: 2 }}>
                  {[...Array(r.stars)].map((_, i) => <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />)}
                </div>
                {/* Quote */}
                <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: 0, flex: 1 }}>"{r.text}"</p>
                {/* Badge resultado */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 99, padding: "4px 12px", alignSelf: "flex-start" }}>
                  <Check size={12} color="#16a34a" />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#16a34a" }}>{r.badge}</span>
                </div>
                {/* Author */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, borderTop: "1px solid #f3f4f6", paddingTop: 14 }}>
                  <img src={r.avatar} alt={r.name} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", border: "2px solid #ede9fe", flexShrink: 0 }}
                    onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(r.name)}&background=7c3aed&color=fff&size=80`; }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>{r.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Rating bars */}
          <div style={{ maxWidth: 500, margin: "40px auto 0", background: "#fff", borderRadius: 20, padding: "24px 28px", border: "1px solid #ede9fe" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 16 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 48, fontWeight: 900, color: "#f59e0b", lineHeight: 1 }}>4.9</div>
                <div style={{ display: "flex", gap: 2, marginTop: 4, justifyContent: "center" }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />)}
                </div>
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>avaliação</div>
              </div>
              <div style={{ flex: 1 }}>
                {RATING_BARS.map(({ stars, pct }) => (
                  <div key={stars} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                    <div style={{ flex: 1, height: 7, background: "#f3f4f6", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(to right,#f59e0b,#fbbf24)", borderRadius: 99, transition: "width 1s ease" }} />
                    </div>
                    <div style={{ display: "flex", gap: 1, width: 52, justifyContent: "flex-end" }}>
                      {[...Array(stars)].map((_, i) => <Star key={i} size={10} fill="#f59e0b" color="#f59e0b" />)}
                    </div>
                    <span style={{ fontSize: 11, color: "#9ca3af", width: 28, textAlign: "right" }}>{pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          PRICING
      ════════════════════════════════════════ */}
      <section style={{ background: "#07070f", padding: "80px 24px", position: "relative", overflow: "hidden" }}>
        <div className="blob1" style={{ position: "absolute", top: "-20%", left: "-10%", width: "50vw", height: "50vw", maxWidth: 600, maxHeight: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,.25) 0%,transparent 65%)", filter: "blur(70px)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: "#a78bfa", textTransform: "uppercase" }}>Preços simples</span>
            <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, margin: "10px 0 10px", color: "#fff", letterSpacing: "-0.5px" }}>Escolhe o teu plano</h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", margin: 0 }}>Sem truques. Sem taxas ocultas.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20, alignItems: "start" }}>

            {/* Mensal */}
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: "32px 28px" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>Plano Mensal</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 4 }}>
                <span style={{ fontSize: 42, fontWeight: 900, color: "#fff", lineHeight: 1 }}>US$ 15</span>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>/mês</span>
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 24, textDecoration: "line-through" }}>US$ 30/mês</div>
              <Link to="/subscribe" style={{ textDecoration: "none", display: "block" }}>
                <button style={{ width: "100%", padding: "13px 0", borderRadius: 14, border: "1.5px solid rgba(124,58,237,0.6)", background: "transparent", color: "#a78bfa", fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "all .2s" }}
                  onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(124,58,237,0.15)"; }}
                  onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>
                  Começar mensal →
                </button>
              </Link>
              <ul style={{ listStyle: "none", padding: 0, margin: "24px 0 0", display: "flex", flexDirection: "column", gap: 10 }}>
                {["Todas as aulas","NgadaFlow Áudio","Dashboard de progresso","Suporte por email"].map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                    <Check size={14} color="#a78bfa" /> {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Vitalício — destaque */}
            <div style={{ background: "linear-gradient(145deg,rgba(124,58,237,0.25),rgba(79,70,229,0.15))", border: "1.5px solid rgba(124,58,237,0.6)", borderRadius: 24, padding: "32px 28px", position: "relative", overflow: "hidden" }}>
              {/* Selo MELHOR VALOR */}
              <div style={{ position: "absolute", top: 18, right: 18, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", color: "#fff", fontSize: 10, fontWeight: 800, padding: "4px 12px", borderRadius: 99, letterSpacing: "0.08em" }}>
                ⭐ MELHOR VALOR
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#a78bfa", marginBottom: 12 }}>Plano Vitalício</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 4 }}>
                <span style={{ fontSize: 42, fontWeight: 900, color: "#fff", lineHeight: 1 }}>US$ 150</span>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 24 }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", textDecoration: "line-through" }}>US$ 300</span>
                <span style={{ fontSize: 11, color: "#4ade80", fontWeight: 700, background: "rgba(74,222,128,0.12)", padding: "2px 8px", borderRadius: 99 }}>50% desconto</span>
              </div>
              <Link to="/subscribe" style={{ textDecoration: "none", display: "block" }}>
                <button style={{ width: "100%", padding: "15px 0", borderRadius: 14, border: "none", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer", boxShadow: "0 8px 32px rgba(124,58,237,.5)" }}>
                  Garantir Acesso Vitalício →
                </button>
              </Link>
              <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.35)", margin: "8px 0 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                <Lock size={11} /> Pagamento único e seguro via Stripe
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "24px 0 0", display: "flex", flexDirection: "column", gap: 10 }}>
                {["Todas as aulas + futuras","NgadaFlow Áudio completo","IA Assistente incluída","Dashboard + progresso","Certificado de conclusão","Acesso vitalício"].map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: "rgba(255,255,255,0.75)" }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(124,58,237,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Check size={11} color="#a78bfa" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Dispositivos */}
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "12px 28px", marginTop: 36 }}>
            {[
              { icon: Smartphone, text: "Telemóvel" },
              { icon: BookOpen,   text: "Tablet" },
              { icon: Globe,      text: "Computador" },
              { icon: Clock,      text: "Acesso 24/7" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
                <Icon size={13} /> {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FAQ
      ════════════════════════════════════════ */}
      <section style={{ background: "#fff", padding: "80px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: "#7c3aed", textTransform: "uppercase" }}>FAQ</span>
            <h2 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 900, margin: "10px 0 0", color: "#111", letterSpacing: "-0.5px" }}>Perguntas frequentes</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} style={{ border: "1px solid", borderColor: openFaq === i ? "#c4b5fd" : "#e5e7eb", borderRadius: 16, overflow: "hidden", transition: "border-color .2s" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 12 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>{item.q}</span>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: openFaq === i ? "#ede9fe" : "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background .2s" }}>
                    {openFaq === i ? <ChevronUp size={15} color="#7c3aed" /> : <ChevronDown size={15} color="#9ca3af" />}
                  </div>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 22px 20px", fontSize: 14, color: "#6b7280", lineHeight: 1.75, borderTop: "1px solid #f3f4f6" }}>
                    <div style={{ paddingTop: 14 }}>{item.a}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA FINAL
      ════════════════════════════════════════ */}
      <section style={{ background: "#f8f7ff", padding: "80px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <div style={{ background: "linear-gradient(135deg,#7c3aed,#4338ca)", borderRadius: 28, padding: "52px 32px", position: "relative", overflow: "hidden" }}>
            {/* Brilho fundo */}
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "80%", height: "80%", background: "radial-gradient(circle,rgba(255,255,255,.12) 0%,transparent 65%)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", backdropFilter: "blur(8px)" }}>
                <TrendingUp size={28} color="#fff" />
              </div>
              <h2 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 900, color: "#fff", margin: "0 0 14px", letterSpacing: "-0.5px" }}>
                A tua jornada começa hoje
              </h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", margin: "0 0 32px", lineHeight: 1.65, maxWidth: 440, marginLeft: "auto", marginRight: "auto" }}>
                US$ 150 — pagamento único. Acesso vitalício a todo o conteúdo, para sempre.
              </p>
              <Link to="/subscribe" style={{ textDecoration: "none" }}>
                <button style={{ background: "#fff", color: "#7c3aed", border: "none", borderRadius: 14, padding: "16px 36px", fontSize: 17, fontWeight: 900, cursor: "pointer", boxShadow: "0 8px 32px rgba(0,0,0,.2)" }}>
                  Garantir Acesso Vitalício
                </button>
              </Link>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                <Lock size={11} /> Pagamento único · Stripe · Sem mensalidades
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA fixo mobile ── */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #e5e7eb", padding: "12px 16px", paddingBottom: "max(12px,env(safe-area-inset-bottom))", display: "flex", alignItems: "center", gap: 12, zIndex: 50, boxShadow: "0 -4px 24px rgba(0,0,0,.08)" }}
        className="lg-hidden" id="mobile-cta-bar">
        <div style={{ flexShrink: 0 }}>
          <div style={{ fontSize: 19, fontWeight: 900, lineHeight: 1, color: "#111" }}>US$ 150</div>
          <div style={{ fontSize: 11, color: "#7c3aed", fontWeight: 600 }}>acesso vitalício</div>
        </div>
        <Link to="/subscribe" style={{ flex: 1, textDecoration: "none" }}>
          <button style={{ width: "100%", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", color: "#fff", border: "none", borderRadius: 12, padding: "13px 0", fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
            Garantir Acesso →
          </button>
        </Link>
      </div>
      <div style={{ height: 72 }} className="block lg:hidden" />

      {/* ════════════════════════════════════════
          MODAL VÍDEO
      ════════════════════════════════════════ */}
      {videoOpen && (
        <div onClick={() => setVideoOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,.9)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 900 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>NgadaLearn — Demonstração</p>
              <button onClick={() => setVideoOpen(false)} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>✕ Fechar</button>
            </div>
            <div style={{ aspectRatio: "16/9", borderRadius: 16, overflow: "hidden", background: "#000" }}>
              {!videoError ? (
                <video style={{ width: "100%", height: "100%" }} controls autoPlay muted playsInline
                  onError={() => setVideoError(true)}>
                  <source src="/demo.mp4" type="video/mp4" />
                </video>
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, color: "#fff", textAlign: "center" }}>
                  <span style={{ fontSize: 40 }}>😔</span>
                  <div>
                    <p style={{ fontWeight: 600, margin: "0 0 4px" }}>Não foi possível carregar o vídeo.</p>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,.5)" }}>Tenta a aula gratuita.</p>
                  </div>
                  <Link to="/demo" onClick={() => setVideoOpen(false)}>
                    <button style={{ background: "#7c3aed", color: "#fff", border: "none", borderRadius: 10, padding: "10px 24px", fontWeight: 700, cursor: "pointer" }}>
                      Ver Aula Gratuita
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
