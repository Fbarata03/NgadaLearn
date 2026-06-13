import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import {
  Star, Users, Shield, Award, Check, ChevronDown, ChevronUp,
  Headphones, BookOpen, Smartphone, Clock,
  Globe, ArrowRight, MessageCircle, TrendingUp, Lock,
} from "lucide-react";

/* ─── Animações ─── */
/* ─── Carrossel simples com touch ─── */
function Carousel({ children, dots = true }: { children: React.ReactNode[]; dots?: boolean }) {
  const [idx, setIdx] = useState(0);
  const startX = useRef(0);
  const total = children.length;

  const prev = () => setIdx(i => (i - 1 + total) % total);
  const next = () => setIdx(i => (i + 1) % total);

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{ overflow: "hidden" }}
        onTouchStart={e => { startX.current = e.touches[0].clientX; }}
        onTouchEnd={e => {
          const dx = e.changedTouches[0].clientX - startX.current;
          if (dx < -40) next();
          else if (dx > 40) prev();
        }}
      >
        <div style={{ display: "flex", transition: "transform .35s ease", transform: `translateX(-${idx * 100}%)` }}>
          {children.map((child, i) => (
            <div key={i} style={{ minWidth: "100%", boxSizing: "border-box" }}>{child}</div>
          ))}
        </div>
      </div>
      {dots && (
        <div style={{ display: "flex", justifyContent: "center", gap: 7, marginTop: 20 }}>
          {children.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 20 : 8, height: 8, borderRadius: 99, border: "none", background: i === idx ? "#7c3aed" : "#d1d5db", cursor: "pointer", transition: "all .2s", padding: 0 }} />
          ))}
        </div>
      )}
    </div>
  );
}

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
  @keyframes lp-float2 {
    0%,100% { transform: translateY(0); }
    50%     { transform: translateY(-8px); }
  }
  @keyframes lp-in {
    from { opacity:0; transform:translateY(28px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes lp-badge {
    0%,100% { transform:scale(1); }
    50%     { transform:scale(1.04); }
  }
  @keyframes lp-bar {
    0%   { width:0; }
  }
  @keyframes lp-pulse {
    0%,100% { opacity:1; }
    50%     { opacity:.35; }
  }
  @keyframes lp-wave {
    0%,100% { height:4px; }
    50%     { height:20px; }
  }
  @keyframes lp-photo-in {
    from { opacity:0; transform:scale(.97) translateY(20px); }
    to   { opacity:1; transform:scale(1)   translateY(0); }
  }
  @keyframes lp-spin { to { transform:rotate(360deg); } }

  .blob1  { animation: blob1 12s ease-in-out infinite; }
  .blob2  { animation: blob2 15s ease-in-out infinite; }
  .blob3  { animation: blob3 10s ease-in-out infinite; }
  .lp-float  { animation: lp-float  5s ease-in-out infinite; }
  .lp-float2 { animation: lp-float2 7s ease-in-out 1.5s infinite; }
  .lp-float3 { animation: lp-float2 6s ease-in-out 3s infinite; }
  .lp-badge  { animation: lp-badge  3.5s ease-in-out infinite; }
  .lp-pulse  { animation: lp-pulse  2s ease-in-out infinite; }
  .lp-wave   { animation: lp-wave   .55s ease-in-out infinite; }
  .lp-in-1   { animation: lp-in .65s ease .05s both; }
  .lp-in-2   { animation: lp-in .65s ease .2s  both; }
  .lp-in-3   { animation: lp-in .65s ease .35s both; }
  .lp-in-4   { animation: lp-in .65s ease .5s  both; }
  .lp-in-5   { animation: lp-in .65s ease .65s both; }
  .lp-photo  { animation: lp-photo-in .9s ease .3s both; }
  .lp-card   { transition: transform .25s ease, box-shadow .25s ease; cursor:default; }
  .lp-card:hover { transform:translateY(-5px); box-shadow:0 20px 60px rgba(0,0,0,.12); }

  /* ── RESPONSIVIDADE MOBILE ── */

  /* Secções: reduz padding vertical em mobile */
  @media(max-width:640px){
    .lp-section-lg  { padding-top: 52px !important; padding-bottom: 52px !important; }
    .lp-section-pad { padding-left: 16px !important; padding-right: 16px !important; }
  }
  @media(max-width:400px){
    .lp-section-lg  { padding-top: 40px !important; padding-bottom: 40px !important; }
  }

  /* Pricing grid: força 1 coluna em ecrãs muito pequenos */
  @media(max-width:400px){
    .lp-price-grid { grid-template-columns: 1fr !important; }
    .lp-price-card { padding: 24px 20px !important; }
    .lp-price-value { font-size: 32px !important; }
  }

  /* Trust bar: permite quebra de linha em mobile */
  @media(max-width:480px){
    .lp-trust-bar { gap: 10px 20px !important; }
    .lp-trust-item { font-size: 12px !important; }
  }

  /* Stats floating cards: ocultar em ecrãs muito pequenos */
  @media(max-width:360px){
    .lp-float, .lp-float2, .lp-float3 { display: none !important; }
  }

  /* Rating section: empilhar em coluna em ecrãs pequenos */
  @media(max-width:400px){
    .lp-rating-inner { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
  }

  /* FAQ botões: reduz padding em mobile */
  @media(max-width:400px){
    .lp-faq-btn { padding: 14px 16px !important; }
    .lp-faq-btn span { font-size: 14px !important; }
  }

  /* Feature cards: reduz padding em mobile */
  @media(max-width:400px){
    .lp-feat-card { padding: 20px 18px !important; }
  }
`;

/* ─── Imagens ─── */
const HERO_PHOTO =
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85";

/* ─── Data ─── */
const FEATURES = [
  { icon: MessageCircle, color: "#7c3aed", title: "Conversação Real",    desc: "Situações reais do dia a dia, trabalho e viagens. Não decorares regras — falas com confiança." },
  { icon: Headphones,    color: "#0891b2", title: "NgadaFlow Áudio",     desc: "Sotaques americano, britânico e australiano em velocidade real. Listening que realmente treina." },
  { icon: Globe,         color: "#d97706", title: "Inglês Profissional", desc: "E-mails, reuniões, entrevistas de emprego. Vocabulário e expressões do mundo real dos negócios." },
  { icon: Award,         color: "#16a34a", title: "Certificado",         desc: "Certificado de conclusão reconhecido por empresas de Portugal, Brasil e Angola." },
];

const STEPS = [
  { n: "01", title: "Escolhe o teu nível",   desc: "Do zero à fluência avançada. O curso adapta-se a ti desde o primeiro dia." },
  { n: "02", title: "Pratica todos os dias", desc: "15 minutos por dia bastam. Áudio, conversação e exercícios interativos." },
  { n: "03", title: "Fala com confiança",    desc: "Em 90 dias já fazes conversas reais. Empregos, viagens, séries — tudo muda." },
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
    text: "O NgadaFlow mudou completamente o meu listening. Em 2 meses comecei a entender séries americanas sem legenda. Impossível encontrar algo melhor no mercado.",
  },
  {
    name: "Amara Ndiaye", location: "Luanda, AO",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face",
    stars: 5, badge: "Promovida no trabalho",
    text: "Aprendo no telemóvel no trajeto para o trabalho. Em 4 meses fui promovida graças às competências em inglês. Melhor investimento da minha carreira!",
  },
];

const FAQ_ITEMS = [
  { q: "É pagamento único ou mensalidade?",  a: "Pagamento único! Pagas uma vez e tens acesso completo para sempre. Sem mensalidades, sem surpresas." },
  { q: "O que está incluído?",               a: "Acesso completo a TUDO: aulas de conversação, áudio NgadaFlow, exercícios, dashboard de progresso e certificado. Sem restrições." },
  { q: "Tenho acesso para sempre?",          a: "Sim! Após o pagamento único o acesso é vitalício. Mesmo quando adicionarmos novos conteúdos, continuas sem pagar mais." },
  { q: "Funciona no telemóvel?",             a: "Perfeitamente! Funciona em qualquer dispositivo — telemóvel, tablet ou computador. Estuda onde e quando quiseres." },
  { q: "Quais métodos de pagamento?",        a: "Aceitamos todos os principais cartões de crédito e débito via Stripe, o processador de pagamentos mais seguro do mundo." },
];

const RATING_BARS = [
  { stars: 5, pct: 82 }, { stars: 4, pct: 13 },
  { stars: 3, pct: 4  }, { stars: 2, pct: 1  }, { stars: 1, pct: 0 },
];

/* ═══════════════════════════════════════════════
   COMPONENTE
═══════════════════════════════════════════════ */
export function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [rates, setRates] = useState<{ eur?: number; brl?: number } | null>(null);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then(r => r.json())
      .then(d => { if (d.rates) setRates({ eur: d.rates.EUR, brl: d.rates.BRL }); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ fontFamily: "system-ui,-apple-system,sans-serif", overflowX: "hidden" }}>
      <style>{ANIM}</style>

      {/* ── Botão CTA Sticky (aparece ao fazer scroll) ── */}
      {showSticky && (
        <div style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", zIndex: 1000, pointerEvents: "none" }}
          className="sticky-cta-wrap">
          <style>{`
            @keyframes sticky-in{from{opacity:0;transform:translateX(-50%) translateY(16px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
            .sticky-cta-wrap{animation:sticky-in .3s ease both}
            @media(min-width:768px){.sticky-cta-wrap{display:none!important}}
          `}</style>
          <Link to="/subscribe" style={{ pointerEvents: "auto", textDecoration: "none" }}>
            <button style={{
              background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
              color: "#fff", border: "none", borderRadius: 12,
              padding: "14px 28px", fontSize: 15, fontWeight: 800,
              cursor: "pointer", fontFamily: "inherit",
              boxShadow: "0 8px 32px rgba(124,58,237,.45), 0 2px 8px rgba(0,0,0,.2)",
              whiteSpace: "nowrap", minHeight: 48,
            }}>
              Começar Agora →
            </button>
          </Link>
        </div>
      )}

      {/* ════════════════════════════════════════
          HERO — split layout
      ════════════════════════════════════════ */}
      <section style={{ position: "relative", minHeight: "100vh", background: "#07070f", display: "flex", alignItems: "center", overflow: "hidden" }}>

        {/* Blobs */}
        <div className="blob1" style={{ position: "absolute", top: "-15%", left: "-8%", width: "55vw", height: "55vw", maxWidth: 700, maxHeight: 700, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,.32) 0%,transparent 65%)", filter: "blur(70px)", pointerEvents: "none" }} />
        <div className="blob2" style={{ position: "absolute", bottom: "-20%", right: "-5%", width: "50vw", height: "50vw", maxWidth: 650, maxHeight: 650, borderRadius: "50%", background: "radial-gradient(circle,rgba(79,70,229,.22) 0%,transparent 65%)", filter: "blur(80px)", pointerEvents: "none" }} />
        <div className="blob3" style={{ position: "absolute", top: "30%", right: "30%", width: "25vw", height: "25vw", maxWidth: 350, maxHeight: 350, borderRadius: "50%", background: "radial-gradient(circle,rgba(8,145,178,.14) 0%,transparent 65%)", filter: "blur(60px)", pointerEvents: "none" }} />

        {/* Grid de linhas */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px)", backgroundSize: "64px 64px", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 10, maxWidth: 1200, margin: "0 auto", padding: "100px 24px 80px", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}
          className="hero-grid">
          <style>{`
            @media(max-width:900px){
              .hero-grid { grid-template-columns:1fr!important; gap:32px!important; padding:64px 20px 52px!important; }
              .hero-photo-col { order:-1; max-height:260px!important; overflow:hidden; border-radius:20px; }
              .hero-photo-col > div { max-height:260px!important; border-radius:20px!important; }
            }
            @media(max-width:480px){
              .hero-grid { padding:56px 16px 44px!important; }
            }
          `}</style>

          {/* ── ESQUERDA — Texto ── */}
          <div>
            {/* Badge */}
            <div className="lp-in-1 lp-badge" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.4)", borderRadius: 99, padding: "6px 16px", marginBottom: 28 }}>
              <div className="lp-pulse" style={{ width: 7, height: 7, borderRadius: "50%", background: "#a78bfa" }} />
              <span style={{ fontSize: 13, color: "#c4b5fd", fontWeight: 600 }}>Conversação real · Áudio com nativos</span>
            </div>

            {/* Headline */}
            <h1 className="lp-in-2" style={{ fontSize: "clamp(36px,5.5vw,72px)", fontWeight: 900, lineHeight: 1.05, color: "#fff", margin: "0 0 22px", letterSpacing: "-1.5px" }}>
              Fala Inglês<br />
              <span style={{ background: "linear-gradient(135deg,#a78bfa 0%,#60a5fa 50%,#818cf8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                com Confiança
              </span>
            </h1>

            <p className="lp-in-3" style={{ fontSize: "clamp(15px,1.8vw,19px)", color: "rgba(255,255,255,0.52)", lineHeight: 1.75, maxWidth: 480, margin: "0 0 36px" }}>
              Do zero à fluência — conversação real e áudio com nativos.{" "}
              <strong style={{ color: "rgba(255,255,255,0.82)" }}>Paga uma vez, aprende para sempre.</strong>
            </p>

            {/* CTAs */}
            <div className="lp-in-4 hero-ctas" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 40 }}>
              <style>{`
                @media(max-width:600px){
                  .hero-ctas { flex-direction:column!important; }
                  .hero-ctas a { width:100%!important; }
                  .hero-ctas button { width:100%!important; justify-content:center!important; min-height:52px!important; font-size:17px!important; }
                }
              `}</style>
              <Link to="/subscribe" style={{ textDecoration: "none" }}>
                <button style={{ display: "flex", alignItems: "center", gap: 10, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", color: "#fff", border: "none", borderRadius: 14, padding: "15px 28px", fontSize: 16, fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 36px rgba(124,58,237,.55)", whiteSpace: "nowrap", minHeight: 52 }}>
                  Começar Agora <ArrowRight size={18} />
                </button>
              </Link>
              <Link to="/demo" style={{ textDecoration: "none" }}>
                <button style={{ display: "flex", alignItems: "center", gap: 9, background: "rgba(255,255,255,.06)", color: "rgba(255,255,255,.8)", border: "1px solid rgba(255,255,255,.14)", borderRadius: 14, padding: "15px 24px", fontSize: 16, fontWeight: 700, cursor: "pointer", backdropFilter: "blur(8px)", whiteSpace: "nowrap", minHeight: 52 }}>
                  Ver Aula Gratuita →
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="lp-in-5" style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {[
                { val: "2.300+",  label: "Alunos activos", icon: Users,  color: "#7c3aed" },
                { val: "4.9 ★",   label: "Avaliação média", icon: Star,   color: "#d97706" },
                { val: "90 dias", label: "Para fluência",   icon: TrendingUp, color: "#0891b2" },
              ].map(({ val, label, icon: Icon, color }) => (
                <div key={label} className="lp-float" style={{ display: "flex", alignItems: "center", gap: 11, background: "rgba(255,255,255,.05)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,.09)", borderRadius: 14, padding: "10px 16px" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: `${color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={16} style={{ color }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: "#fff", lineHeight: 1.1 }}>{val}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,.38)", marginTop: 1 }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── DIREITA — Foto realista + cards flutuantes ── */}
          <div className="hero-photo-col lp-photo" style={{ position: "relative" }}>

            {/* Foto principal */}
            <div style={{ position: "relative", borderRadius: 28, overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,.6)", border: "1px solid rgba(255,255,255,.08)", aspectRatio: "3/4", maxHeight: 580 }}>
              <img
                src={HERO_PHOTO}
                alt="Estudante de inglês"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              {/* Overlay gradiente base */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(7,7,15,.7) 0%,rgba(7,7,15,.1) 50%,transparent 100%)" }} />
              {/* Overlay cor brand */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(124,58,237,.18) 0%,transparent 60%)" }} />
            </div>

            {/* Card flutuante — Áudio a tocar */}
            <div className="lp-float2" style={{ position: "absolute", top: "8%", left: "-18%", background: "rgba(255,255,255,.08)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 20, padding: "14px 18px", minWidth: 180, boxShadow: "0 16px 48px rgba(0,0,0,.4)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Headphones size={16} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>NgadaFlow</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,.5)" }}>A estudar inglês</div>
                </div>
              </div>
              {/* Waveform */}
              <div style={{ display: "flex", alignItems: "center", gap: 3, height: 24 }}>
                {[0,1,2,3,4,5,6,7].map(i => (
                  <div key={i} className="lp-wave" style={{ width: 3, background: "linear-gradient(to top,#7c3aed,#a78bfa)", borderRadius: 99, animationDelay: `${i * 80}ms` }} />
                ))}
                <span style={{ fontSize: 10, color: "rgba(255,255,255,.4)", marginLeft: 4 }}>2:34</span>
              </div>
            </div>

            {/* Card flutuante — Rating */}
            <div className="lp-float3" style={{ position: "absolute", bottom: "22%", left: "-15%", background: "rgba(255,255,255,.08)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 18, padding: "14px 18px", boxShadow: "0 16px 48px rgba(0,0,0,.4)" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", marginBottom: 4 }}>Avaliação dos alunos</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>4.9</span>
                <div style={{ display: "flex", gap: 1 }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />)}
                </div>
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.35)", marginTop: 2 }}>1.842 avaliações verificadas</div>
            </div>

            {/* Card flutuante — Alunos online */}
            <div className="lp-float2" style={{ position: "absolute", top: "30%", right: "8px", background: "rgba(255,255,255,.07)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 16, padding: "12px 16px", boxShadow: "0 12px 40px rgba(0,0,0,.3)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <div className="lp-pulse" style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", flexShrink: 0 }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>A estudar agora</span>
              </div>
              {/* Avatares */}
              <div style={{ display: "flex" }}>
                {[
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=40&h=40&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=40&h=40&fit=crop&crop=face",
                ].map((src, i) => (
                  <img key={i} src={src} alt="" style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(7,7,15,.8)", marginLeft: i > 0 ? -8 : 0 }}
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                ))}
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#fff", marginLeft: -8, border: "2px solid rgba(7,7,15,.8)" }}>+87</div>
              </div>
            </div>
          </div>
        </div>

        {/* Seta scroll */}
        <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, opacity: 0.25, pointerEvents: "none" }}>
          <div style={{ width: 1, height: 36, background: "linear-gradient(to bottom,transparent,#fff)" }} />
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff" }} />
        </div>
      </section>

      {/* ════════════════════════════════════════
          TRUST BAR
      ════════════════════════════════════════ */}
      <div style={{ background: "#fff", borderBottom: "1px solid #f0f0f5", padding: "12px 16px" }}>
        <div className="lp-trust-bar" style={{ maxWidth: 960, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "10px 24px" }}>
          {[
            { icon: Star,   color: "#d97706", text: "4.9/5 — 1.842 avaliações" },
            { icon: Users,  color: "#7c3aed", text: "2.300+ alunos" },
            { icon: Shield, color: "#16a34a", text: "Stripe seguro" },
            { icon: Award,  color: "#0891b2", text: "Certificado incluído" },
            { icon: Globe,  color: "#6366f1", text: "PT · BR · AO" },
          ].map(({ icon: Icon, color, text }) => (
            <div key={text} className="lp-trust-item" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#4b5563", fontWeight: 500, whiteSpace: "nowrap" }}>
              <Icon size={14} style={{ color, flexShrink: 0 }} />
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════
          FEATURES
      ════════════════════════════════════════ */}
      <section className="lp-section-lg lp-section-pad" style={{ background: "#f8f7ff", padding: "88px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", color: "#7c3aed", textTransform: "uppercase" }}>Porque funciona</span>
            <h2 style={{ fontSize: "clamp(26px,4vw,44px)", fontWeight: 900, margin: "10px 0 12px", color: "#111", letterSpacing: "-0.5px" }}>Tudo o que precisas num só lugar</h2>
            <p style={{ fontSize: 17, color: "#6b7280", maxWidth: 480, margin: "0 auto", lineHeight: 1.65 }}>Sem apps diferentes, sem confusão. Conversa e áudio — tudo integrado num único lugar.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(240px,100%),1fr))", gap: 20 }}>
            {FEATURES.map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="lp-card lp-feat-card" style={{ background: "#fff", borderRadius: 22, padding: "28px 26px", border: "1px solid #ede9fe" }}>
                <div style={{ width: 52, height: 52, borderRadius: 15, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
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
      <section className="lp-section-lg lp-section-pad" style={{ background: "#fff", padding: "88px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", color: "#7c3aed", textTransform: "uppercase" }}>Como funciona</span>
            <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 900, margin: "10px 0 0", color: "#111", letterSpacing: "-0.5px" }}>3 passos para a fluência</h2>
          </div>
          {/* Desktop: grid | Mobile: carrossel */}
          <div className="hidden sm:grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", position: "relative" }}>
            <div style={{ position: "absolute", top: 36, left: "17%", right: "17%", height: 2, background: "linear-gradient(to right,#7c3aed,#4f46e5)", zIndex: 0 }} />
            {STEPS.map(({ n, title, desc }) => (
              <div key={n} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 28px", position: "relative", zIndex: 1 }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22, boxShadow: "0 8px 28px rgba(124,58,237,.4)", border: "4px solid #fff" }}>
                  <span style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>{n}</span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: "#111", margin: "0 0 8px" }}>{title}</h3>
                <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
          <div className="sm:hidden">
            <Carousel>
              {STEPS.map(({ n, title, desc }) => (
                <div key={n} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 16px" }}>
                  <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, boxShadow: "0 8px 28px rgba(124,58,237,.4)", border: "4px solid #fff" }}>
                    <span style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>{n}</span>
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: "#111", margin: "0 0 10px" }}>{title}</h3>
                  <p style={{ fontSize: 15, color: "#6b7280", lineHeight: 1.7, margin: 0, maxWidth: 280 }}>{desc}</p>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          TESTEMUNHOS
      ════════════════════════════════════════ */}
      <section className="lp-section-lg lp-section-pad" style={{ background: "#f8f7ff", padding: "88px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", color: "#7c3aed", textTransform: "uppercase" }}>Resultados reais</span>
            <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 900, margin: "10px 0 10px", color: "#111", letterSpacing: "-0.5px" }}>O que dizem os nossos alunos</h2>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
              <div style={{ display: "flex", gap: 2 }}>{[...Array(5)].map((_,i) => <Star key={i} size={17} fill="#f59e0b" color="#f59e0b" />)}</div>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>4.9</span>
              <span style={{ fontSize: 13, color: "#9ca3af" }}>· 1.842 avaliações verificadas</span>
            </div>
          </div>

          {/* Desktop: grid | Mobile: carrossel */}
          <div className="hidden sm:grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
            {REVIEWS.map((r) => (
              <div key={r.name} className="lp-card" style={{ background: "#fff", borderRadius: 22, padding: "26px", border: "1px solid #ede9fe", display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", gap: 2 }}>{[...Array(r.stars)].map((_,i) => <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />)}</div>
                <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.75, margin: 0, flex: 1 }}>"{r.text}"</p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 99, padding: "4px 12px", alignSelf: "flex-start" }}>
                  <Check size={11} color="#16a34a" />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#16a34a" }}>{r.badge}</span>
                </div>
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
          <div className="sm:hidden">
            <Carousel>
              {REVIEWS.map((r) => (
                <div key={r.name} style={{ background: "#fff", borderRadius: 22, padding: "24px", border: "1px solid #ede9fe", display: "flex", flexDirection: "column", gap: 14, margin: "0 4px" }}>
                  <div style={{ display: "flex", gap: 2 }}>{[...Array(r.stars)].map((_,i) => <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />)}</div>
                  <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.75, margin: 0 }}>"{r.text}"</p>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 99, padding: "4px 12px", alignSelf: "flex-start" }}>
                    <Check size={11} color="#16a34a" />
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#16a34a" }}>{r.badge}</span>
                  </div>
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
            </Carousel>
          </div>

          {/* Barras de rating */}
          <div style={{ maxWidth: 500, margin: "40px auto 0", background: "#fff", borderRadius: 20, padding: "24px 28px", border: "1px solid #ede9fe" }}>
            <div className="lp-rating-inner" style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ textAlign: "center", flexShrink: 0 }}>
                <div style={{ fontSize: 48, fontWeight: 900, color: "#f59e0b", lineHeight: 1 }}>4.9</div>
                <div style={{ display: "flex", gap: 2, marginTop: 4, justifyContent: "center" }}>{[...Array(5)].map((_,i) => <Star key={i} size={12} fill="#f59e0b" color="#f59e0b" />)}</div>
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>avaliação</div>
              </div>
              <div style={{ flex: 1 }}>
                {RATING_BARS.map(({ stars, pct }) => (
                  <div key={stars} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                    <div style={{ flex: 1, height: 7, background: "#f3f4f6", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(to right,#f59e0b,#fbbf24)", borderRadius: 99 }} />
                    </div>
                    <div style={{ display: "flex", gap: 1, width: 50, justifyContent: "flex-end" }}>{[...Array(stars)].map((_,i) => <Star key={i} size={10} fill="#f59e0b" color="#f59e0b" />)}</div>
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
      <section className="lp-section-lg lp-section-pad" style={{ background: "#07070f", padding: "88px 24px", position: "relative", overflow: "hidden" }}>
        <div className="blob1" style={{ position: "absolute", top: "-20%", left: "-10%", width: "50vw", height: "50vw", maxWidth: 600, maxHeight: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,.22) 0%,transparent 65%)", filter: "blur(70px)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 820, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", color: "#a78bfa", textTransform: "uppercase" }}>Preços simples</span>
            <h2 style={{ fontSize: "clamp(26px,4vw,44px)", fontWeight: 900, margin: "10px 0 8px", color: "#fff", letterSpacing: "-0.5px" }}>Escolhe o teu plano</h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,.4)", margin: 0 }}>Sem truques. Sem taxas ocultas.</p>
          </div>

          <div className="lp-price-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(280px,100%),1fr))", gap: 20, alignItems: "start" }}>

            {/* Mensal */}
            <div className="lp-price-card" style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.09)", borderRadius: 24, padding: "32px 28px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,.45)", marginBottom: 14 }}>Plano Mensal</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 4 }}>
                <span className="lp-price-value" style={{ fontSize: 40, fontWeight: 900, color: "#fff", lineHeight: 1 }}>US$ 15</span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,.35)", marginBottom: 6 }}>/mês</span>
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.25)", marginBottom: 6, textDecoration: "line-through" }}>US$ 30/mês</div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,.22)", marginBottom: 18, lineHeight: 1.4 }}>
                Preço em dólares americanos (USD)
                {rates?.eur && ` · ≈ €${Math.round(15 * rates.eur)}`}
                {rates?.brl && ` · ≈ R$${Math.round(15 * rates.brl)}`}
              </p>
              <Link to="/subscribe" style={{ textDecoration: "none", display: "block" }}>
                <button style={{ width: "100%", padding: "13px 0", borderRadius: 13, border: "1.5px solid rgba(124,58,237,.55)", background: "transparent", color: "#a78bfa", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                  Começar mensal →
                </button>
              </Link>
              <ul style={{ listStyle: "none", padding: 0, margin: "22px 0 0", display: "flex", flexDirection: "column", gap: 9 }}>
                {["Todas as aulas","NgadaFlow Áudio","Dashboard de progresso","Suporte por email"].map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: "rgba(255,255,255,.55)" }}>
                    <Check size={14} color="#a78bfa" /> {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Vitalício */}
            <div className="lp-price-card" style={{ background: "linear-gradient(145deg,rgba(124,58,237,.22),rgba(79,70,229,.12))", border: "1.5px solid rgba(124,58,237,.55)", borderRadius: 24, padding: "32px 28px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 16, right: 16, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", color: "#fff", fontSize: 10, fontWeight: 800, padding: "4px 12px", borderRadius: 99, letterSpacing: "0.07em" }}>
                ⭐ MELHOR VALOR
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#a78bfa", marginBottom: 14 }}>Plano Vitalício</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 6 }}>
                <span className="lp-price-value" style={{ fontSize: 40, fontWeight: 900, color: "#fff", lineHeight: 1 }}>US$ 150</span>
              </div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,.22)", marginBottom: 8, lineHeight: 1.4 }}>
                Preço em dólares americanos (USD)
                {rates?.eur && ` · ≈ €${Math.round(150 * rates.eur)}`}
                {rates?.brl && ` · ≈ R$${Math.round(150 * rates.brl)}`}
              </p>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 24 }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,.3)", textDecoration: "line-through" }}>US$ 300</span>
                <span style={{ fontSize: 11, color: "#4ade80", fontWeight: 700, background: "rgba(74,222,128,.1)", padding: "2px 8px", borderRadius: 99 }}>50% desconto</span>
              </div>
              <Link to="/subscribe" style={{ textDecoration: "none", display: "block" }}>
                <button style={{ width: "100%", padding: "15px 0", borderRadius: 13, border: "none", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer", boxShadow: "0 8px 32px rgba(124,58,237,.5)" }}>
                  Garantir Acesso Vitalício →
                </button>
              </Link>
              <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,.3)", margin: "8px 0 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                <Lock size={11} /> Pagamento único · Stripe
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "22px 0 0", display: "flex", flexDirection: "column", gap: 9 }}>
                {["Todas as aulas + futuras","NgadaFlow Áudio completo","Inglês Profissional","Dashboard + progresso","Certificado de conclusão","Acesso vitalício"].map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: "rgba(255,255,255,.75)" }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(124,58,237,.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Check size={11} color="#a78bfa" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "10px 28px", marginTop: 32 }}>
            {[{ icon: Smartphone, text: "Telemóvel" },{ icon: BookOpen, text: "Tablet" },{ icon: Globe, text: "Computador" },{ icon: Clock, text: "Acesso 24/7" }].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(255,255,255,.3)" }}>
                <Icon size={13} /> {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FAQ
      ════════════════════════════════════════ */}
      <section className="lp-section-lg lp-section-pad" style={{ background: "#fff", padding: "88px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", color: "#7c3aed", textTransform: "uppercase" }}>FAQ</span>
            <h2 style={{ fontSize: "clamp(24px,4vw,40px)", fontWeight: 900, margin: "10px 0 0", color: "#111", letterSpacing: "-0.5px" }}>Perguntas frequentes</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} style={{ border: "1px solid", borderColor: openFaq === i ? "#c4b5fd" : "#e5e7eb", borderRadius: 16, overflow: "hidden", transition: "border-color .2s" }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="lp-faq-btn"
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 12, minHeight: 44 }}>
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
          RODAPÉ
      ════════════════════════════════════════ */}
      <footer style={{ background: "#07070f", borderTop: "1px solid rgba(124,58,237,.15)", padding: "52px 24px 28px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* 3 colunas */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: "36px 48px", marginBottom: 40 }}>

            {/* Col 1 — Marca */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: "#fff" }}>N</div>
                <span style={{ fontSize: 17, fontWeight: 900, color: "#fff" }}>NgadaLearn</span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,.35)", lineHeight: 1.6, margin: "0 0 14px", maxWidth: 200 }}>Do zero à fluência — aprende inglês com música, filmes e conversação real.</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,.2)", margin: 0 }}>Desenvolvido em Portugal 🇵🇹</p>
            </div>

            {/* Col 2 — Links */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: "rgba(255,255,255,.3)", textTransform: "uppercase", margin: "0 0 14px" }}>Plataforma</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { to: "/", label: "Início" },
                  { to: "/lessons", label: "Conteúdo do Curso" },
                  { to: "/music", label: "Música" },
                  { to: "/netflix", label: "Netflix do Inglês" },
                  { to: "/dashboard", label: "Meu Progresso" },
                ].map(({ to, label }) => (
                  <Link key={to} to={to} style={{ fontSize: 13, color: "rgba(255,255,255,.45)", textDecoration: "none" }}
                    onMouseOver={e => (e.currentTarget.style.color = "#a78bfa")}
                    onMouseOut={e => (e.currentTarget.style.color = "rgba(255,255,255,.45)")}>{label}</Link>
                ))}
              </div>
            </div>

            {/* Col 3 — Legal & Suporte */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: "rgba(255,255,255,.3)", textTransform: "uppercase", margin: "0 0 14px" }}>Legal & Suporte</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Link to="/privacy" style={{ fontSize: 13, color: "rgba(255,255,255,.45)", textDecoration: "none" }}
                  onMouseOver={e => (e.currentTarget.style.color = "#a78bfa")}
                  onMouseOut={e => (e.currentTarget.style.color = "rgba(255,255,255,.45)")}>Política de Privacidade</Link>
                <Link to="/terms" style={{ fontSize: 13, color: "rgba(255,255,255,.45)", textDecoration: "none" }}
                  onMouseOver={e => (e.currentTarget.style.color = "#a78bfa")}
                  onMouseOut={e => (e.currentTarget.style.color = "rgba(255,255,255,.45)")}>Termos de Uso</Link>
                <a href="mailto:suporte@ngadalearn.pt" style={{ fontSize: 13, color: "rgba(255,255,255,.45)", textDecoration: "none" }}
                  onMouseOver={e => (e.currentTarget.style.color = "#a78bfa")}
                  onMouseOut={e => (e.currentTarget.style.color = "rgba(255,255,255,.45)")}>suporte@ngadalearn.pt</a>
              </div>
            </div>
          </div>

          {/* Linha base */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,.06)", paddingTop: 24, display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,.18)", margin: 0 }}>© 2026 NgadaLearn. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
