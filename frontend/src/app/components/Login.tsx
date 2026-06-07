import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useAuth, API_URL } from "../context/AuthContext";
import {
  GraduationCap, Lock, Mail, Eye, EyeOff,
  AlertCircle, CheckCircle, ArrowLeft, Headphones,
  Award, MessageCircle,
} from "lucide-react";

/* ─── Animações ─── */
const ANIM = `
  @keyframes lg-blob1 {
    0%,100% { transform:translate(0,0) scale(1); }
    33%      { transform:translate(5%,-8%) scale(1.08); }
    66%      { transform:translate(-4%,6%) scale(.94); }
  }
  @keyframes lg-blob2 {
    0%,100% { transform:translate(0,0) scale(1); }
    50%      { transform:translate(-7%,10%) scale(1.1); }
  }
  @keyframes lg-in {
    from { opacity:0; transform:translateY(22px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes lg-fade {
    from { opacity:0; }
    to   { opacity:1; }
  }
  @keyframes lg-float {
    0%,100% { transform:translateY(0); }
    50%     { transform:translateY(-8px); }
  }
  @keyframes lg-pulse {
    0%,100% { opacity:1; }
    50%     { opacity:.35; }
  }
  @keyframes lg-spin { to { transform:rotate(360deg); } }
  @keyframes lg-shake {
    0%,100% { transform:translateX(0); }
    20%,60% { transform:translateX(-5px); }
    40%,80% { transform:translateX(5px); }
  }

  /* ── Novas animações do painel direito ── */
  @keyframes lg-bg-shift {
    0%,100% { background-position:0% 50%; }
    50%      { background-position:100% 50%; }
  }
  @keyframes lg-orb-r {
    0%,100% { transform:translate(0,0) scale(1); }
    33%     { transform:translate(25px,-18px) scale(1.12); }
    66%     { transform:translate(-18px,22px) scale(.9); }
  }
  @keyframes lg-ring {
    0%  { box-shadow:0 0 0 0 rgba(124,58,237,.55), 0 6px 20px rgba(124,58,237,.35); }
    70% { box-shadow:0 0 0 16px rgba(124,58,237,0), 0 6px 20px rgba(124,58,237,.45); }
    100%{ box-shadow:0 0 0 0 rgba(124,58,237,0),   0 6px 20px rgba(124,58,237,.35); }
  }
  @keyframes lg-shimmer-move {
    0%   { background-position:-200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes lg-particle-up {
    0%   { transform:translateY(0) scale(1) rotate(0deg);   opacity:0; }
    12%  { opacity:.65; }
    88%  { opacity:.35; }
    100% { transform:translateY(-160px) scale(.3) rotate(200deg); opacity:0; }
  }
  @keyframes lg-icon-bob {
    0%,100% { transform:translateY(0) rotate(-3deg); }
    50%     { transform:translateY(-5px) rotate(3deg); }
  }

  .lg-blob1  { animation:lg-blob1 12s ease-in-out infinite; }
  .lg-blob2  { animation:lg-blob2 15s ease-in-out infinite; }
  .lg-float  { animation:lg-float 5s ease-in-out infinite; }
  .lg-float2 { animation:lg-float 7s ease-in-out 1.5s infinite; }
  .lg-pulse  { animation:lg-pulse 2s ease-in-out infinite; }
  .lg-in-1   { animation:lg-in .55s ease .05s both; }
  .lg-in-2   { animation:lg-in .55s ease .15s both; }
  .lg-in-3   { animation:lg-in .55s ease .25s both; }
  .lg-in-4   { animation:lg-in .55s ease .35s both; }
  .lg-in-5   { animation:lg-in .55s ease .45s both; }
  .lg-in-6   { animation:lg-in .55s ease .55s both; }
  .lg-fade   { animation:lg-fade .4s ease both; }
  .lg-shake  { animation:lg-shake .4s ease; }
  .lg-spin   { animation:lg-spin .8s linear infinite; }
  .lg-orb-r1 { animation:lg-orb-r 16s ease-in-out infinite; }
  .lg-orb-r2 { animation:lg-orb-r 20s ease-in-out 4s infinite reverse; }
  .lg-ring   { animation:lg-ring 2.2s ease-out infinite; }
  .lg-icon-bob { animation:lg-icon-bob 3s ease-in-out infinite; }

  .lg-right-bg {
    background:linear-gradient(120deg,#ffffff 0%,#fbf8ff 30%,#f4efff 60%,#faf7ff 80%,#ffffff 100%);
    background-size:300% 300%;
    animation:lg-bg-shift 10s ease infinite;
  }

  .lg-btn-shimmer {
    position:relative; overflow:hidden;
  }
  .lg-btn-shimmer::after {
    content:''; position:absolute; inset:0; border-radius:inherit;
    background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,.32) 50%,transparent 100%);
    background-size:200% 100%;
    animation:lg-shimmer-move 2.6s linear infinite;
    pointer-events:none;
  }

  .lg-particle {
    position:absolute; border-radius:50%;
    background:rgba(167,139,250,.55);
    pointer-events:none;
    animation:lg-particle-up var(--dur,5s) ease-in-out var(--delay,0s) infinite;
  }

  .lg-input {
    width:100%; height:48px; border-radius:12px;
    border:1.5px solid #e5e7eb; background:#f9fafb;
    padding:0 14px 0 44px; font-size:15px; color:#111;
    outline:none; transition:border-color .2s, background .2s, box-shadow .2s;
    font-family:inherit;
  }
  .lg-input:focus {
    border-color:#7c3aed; background:#fff;
    box-shadow:0 0 0 3px rgba(124,58,237,.12);
  }
  .lg-input::placeholder { color:#9ca3af; }
  .lg-btn {
    width:100%; height:50px; border-radius:14px; border:none;
    background:linear-gradient(135deg,#7c3aed,#4f46e5);
    color:#fff; font-size:16px; font-weight:800;
    cursor:pointer; font-family:inherit;
    box-shadow:0 6px 28px rgba(124,58,237,.4);
    transition:transform .15s ease, box-shadow .15s ease;
  }
  .lg-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 10px 36px rgba(124,58,237,.5); }
  .lg-btn:active:not(:disabled) { transform:translateY(1px); }
  .lg-btn:disabled { opacity:.7; cursor:not-allowed; }
`;

const FEATURES = [
  { icon: Headphones,    text: "50+ horas de áudio com nativos" },
  { icon: MessageCircle, text: "Conversação real e prática diária" },
  { icon: Award,         text: "Certificado de conclusão incluído" },
];

/* ═══════════════════════════════════
   COMPONENTE
═══════════════════════════════════ */
export function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from = (location.state as { from?: string })?.from || "/dashboard";

  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [showPw,     setShowPw]     = useState(false);
  const [error,      setError]      = useState("");
  const [loading,    setLoading]    = useState(false);
  const [slowServer, setSlowServer] = useState(false);
  const [shake,      setShake]      = useState(false);

  const [showForgot,   setShowForgot]   = useState(false);
  const [forgotEmail,  setForgotEmail]  = useState("");
  const [forgotLoad,   setForgotLoad]   = useState(false);
  const [forgotStatus, setForgotStatus] = useState<{
    type: "success" | "error"; msg: string; resetUrl?: string;
  } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Preenche todos os campos."); triggerShake(); return; }
    setLoading(true); setError(""); setSlowServer(false);
    const slowTimer = setTimeout(() => setSlowServer(true), 8000);
    const r = await login(email, password);
    clearTimeout(slowTimer); setSlowServer(false);
    if (r.success) navigate(from, { replace: true });
    else { setError(r.error || "Credenciais inválidas."); setLoading(false); triggerShake(); }
  };

  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 450);
  }

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.includes("@")) { setForgotStatus({ type: "error", msg: "Informe um email válido." }); return; }
    setForgotLoad(true); setForgotStatus(null);
    try {
      const res  = await fetch(`${API_URL}/api/auth/forgot-password`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: forgotEmail }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao enviar email.");
      setForgotStatus({ type: "success", msg: data.message, resetUrl: data.resetUrl });
    } catch (err) {
      setForgotStatus({ type: "error", msg: err instanceof Error ? err.message : "Erro inesperado." });
    } finally { setForgotLoad(false); }
  };

  const resetForgot = () => { setShowForgot(false); setForgotStatus(null); setForgotEmail(""); };

  /* ─────────────────────────────────────
     PAINEL ESQUERDO (partilhado)
  ───────────────────────────────────── */
  const LeftPanel = () => (
    <div style={{ position: "relative", background: "#07070f", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "48px 44px" }}>
      <style>{ANIM}</style>

      {/* Blobs */}
      <div className="lg-blob1" style={{ position: "absolute", top: "-10%", left: "-10%", width: "70%", height: "70%", borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,.4) 0%,transparent 65%)", filter: "blur(70px)", pointerEvents: "none" }} />
      <div className="lg-blob2" style={{ position: "absolute", bottom: "-15%", right: "-10%", width: "65%", height: "65%", borderRadius: "50%", background: "radial-gradient(circle,rgba(79,70,229,.28) 0%,transparent 65%)", filter: "blur(80px)", pointerEvents: "none" }} />

      {/* Grid sutil */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)", backgroundSize: "52px 52px", pointerEvents: "none" }} />

      {/* Foto de fundo com overlay */}
      <div style={{ position: "absolute", inset: 0 }}>
        <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=70" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.08, display: "block" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 52 }}>
          <GraduationCap size={28} color="#a78bfa" />
          <span style={{ fontWeight: 900, fontSize: 20, color: "#fff" }}>NgadaLearn</span>
        </div>

        {/* Headline */}
        <h2 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 900, color: "#fff", lineHeight: 1.15, margin: "0 0 14px", letterSpacing: "-0.5px" }}>
          Bem-vindo de volta<br />
          <span style={{ background: "linear-gradient(135deg,#a78bfa,#60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            à tua jornada
          </span>
        </h2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,.45)", lineHeight: 1.7, margin: "0 0 36px", maxWidth: 340 }}>
          Continua de onde ficaste. Cada aula conta para a tua fluência em inglês.
        </p>

        {/* Features */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {FEATURES.map(({ icon: Icon, text }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(124,58,237,.25)", border: "1px solid rgba(124,58,237,.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={16} color="#a78bfa" />
              </div>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,.7)", fontWeight: 500 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );

  /* ─────────────────────────────────────
     RECUPERAR SENHA
  ───────────────────────────────────── */
  if (showForgot) return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <style>{ANIM}</style>

      {/* Header mobile */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid #f0f0f5", background: "#fff" }}>
        <button onClick={resetForgot} style={{ minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: "#6b7280", borderRadius: 10 }}>
          <ArrowLeft size={20} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <GraduationCap size={22} color="#7c3aed" />
          <span style={{ fontWeight: 900, fontSize: 16, color: "#111" }}>NgadaLearn</span>
        </div>
        <div style={{ width: 44 }} />
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div className="lg-fade" style={{ width: "100%", maxWidth: 380 }}>
          {forgotStatus?.type === "success" ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#f0fdf4", border: "1px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <CheckCircle size={40} color="#16a34a" />
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: "#111", margin: "0 0 8px" }}>
                {forgotStatus.resetUrl ? "Link gerado!" : "Email enviado!"}
              </h1>
              <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7, margin: "0 0 24px" }}>{forgotStatus.msg}</p>
              {forgotStatus.resetUrl && (
                <a href={forgotStatus.resetUrl} style={{ display: "block", width: "100%", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", color: "#fff", fontWeight: 800, fontSize: 15, padding: "14px 0", borderRadius: 14, textDecoration: "none", textAlign: "center", marginBottom: 12 }}>
                  Redefinir senha agora →
                </a>
              )}
              <button onClick={resetForgot} style={{ fontSize: 13, color: "#7c3aed", fontWeight: 600, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                Voltar ao login
              </button>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 26, fontWeight: 900, color: "#111", margin: "0 0 6px", letterSpacing: "-0.5px" }}>Recuperar senha</h1>
                <p style={{ fontSize: 14, color: "#9ca3af", margin: 0 }}>Insere o teu email e enviamos as instruções.</p>
              </div>
              <form onSubmit={handleForgot} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ position: "relative" }}>
                  <Mail size={16} color="#9ca3af" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  <input className="lg-input" type="email" placeholder="o_teu@email.com" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} autoComplete="email" />
                </div>
                {forgotStatus?.type === "error" && (
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "12px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, fontSize: 13, color: "#dc2626" }}>
                    <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} /> {forgotStatus.msg}
                  </div>
                )}
                <button type="submit" className="lg-btn" disabled={forgotLoad} style={{ marginTop: 4 }}>
                  {forgotLoad
                    ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><span className="lg-spin" style={{ display: "inline-block", width: 18, height: 18, borderRadius: "50%", border: "2.5px solid rgba(255,255,255,.3)", borderTopColor: "#fff" }} />A enviar...</span>
                    : "Enviar instruções"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );

  /* ─────────────────────────────────────
     LOGIN PRINCIPAL
  ───────────────────────────────────── */
  return (
    <div style={{ minHeight: "100dvh", display: "grid", gridTemplateColumns: "1fr 1fr", fontFamily: "system-ui,-apple-system,sans-serif" }}
      className="login-layout">
      <style>{ANIM}{`
        @media(max-width:900px) {
          .login-layout { grid-template-columns:1fr!important; }
          .login-left   { display:none!important; }
        }
      `}</style>

      {/* ESQUERDA */}
      <div className="login-left" style={{ display: "flex" }}>
        <LeftPanel />
      </div>

      {/* DIREITA — Formulário */}
      <div className="lg-right-bg" style={{ position: "relative", display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Orbs de fundo */}
        <div className="lg-orb-r1" style={{ position:"absolute", top:"-8%", right:"-6%", width:340, height:340, borderRadius:"50%", background:"radial-gradient(circle,rgba(124,58,237,.09) 0%,transparent 65%)", filter:"blur(55px)", pointerEvents:"none", zIndex:0 }} />
        <div className="lg-orb-r2" style={{ position:"absolute", bottom:"-5%", left:"-6%", width:290, height:290, borderRadius:"50%", background:"radial-gradient(circle,rgba(99,102,241,.07) 0%,transparent 65%)", filter:"blur(65px)", pointerEvents:"none", zIndex:0 }} />

        {/* Partículas flutuantes */}
        {[
          { size:5, left:"10%", dur:"5.5s",  delay:"0s"   },
          { size:3, left:"26%", dur:"7s",    delay:"1.3s" },
          { size:6, left:"44%", dur:"4.8s",  delay:"0.7s" },
          { size:3, left:"60%", dur:"6.5s",  delay:"2.2s" },
          { size:5, left:"76%", dur:"5.2s",  delay:"1.6s" },
          { size:4, left:"89%", dur:"6.8s",  delay:"0.4s" },
        ].map((p, i) => (
          <div key={i} className="lg-particle" style={{ width:p.size, height:p.size, bottom:"4%", left:p.left, "--dur":p.dur, "--delay":p.delay } as React.CSSProperties} />
        ))}

        {/* Header mobile */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid #f0f0f5" }} className="block lg:hidden">
          <Link to="/" style={{ minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280", borderRadius: 10, textDecoration: "none" }}>
            <ArrowLeft size={20} />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <GraduationCap size={22} color="#7c3aed" />
            <span style={{ fontWeight: 900, fontSize: 16, color: "#111" }}>NgadaLearn</span>
          </div>
          <div style={{ width: 44 }} />
        </div>

        {/* Formulário centrado */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 32px" }}>
          <div style={{ width: "100%", maxWidth: 360 }}>

            {/* Título */}
            <div className="lg-in-2" style={{ marginBottom: 30 }}>
              <div className="lg-ring" style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <GraduationCap size={24} color="#fff" className="lg-icon-bob" />
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 900, color: "#111", margin: "0 0 6px", letterSpacing: "-0.5px" }}>Entrar na conta</h1>
              <p style={{ fontSize: 14, color: "#9ca3af", margin: 0 }}>Continua de onde ficaste.</p>
            </div>

            {/* ── Login Social ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 4 }}>
              <button type="button"
                onClick={() => window.location.href = `${API_URL}/api/auth/google`}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, width: "100%", minHeight: 48, borderRadius: 14, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "border-color .2s, box-shadow .2s" }}
                onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#4285F4"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 0 3px rgba(66,133,244,.12)"; }}
                onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "none"; }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                  <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                Entrar com Google
              </button>
              <button type="button"
                onClick={() => window.location.href = `${API_URL}/api/auth/apple`}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, width: "100%", minHeight: 48, borderRadius: 14, border: "1.5px solid #111", background: "#000", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "opacity .2s" }}
                onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
                onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}>
                <svg width="17" height="20" viewBox="0 0 814 1000" fill="#fff">
                  <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105.5-57.8-155.5-127.4C46 790.8 0 663.4 0 541.8c0-207.5 134.8-317.3 267.7-317.3 70.5 0 129.5 46.4 173.9 46.4 42.8 0 110.3-49.4 190.3-49.4zM656.6 90.5c32.3-40.8 56.1-97.8 56.1-154.8 0-8.3-.6-16.5-2-23.5-53.4 2-116.8 35.5-154.3 82.7-29.9 36.8-58.5 93.2-58.5 151.2 0 9 1.4 18 2 21 3.2.6 8.4 1.4 13.6 1.4 47.9 0 109.5-32 143.1-78z"/>
                </svg>
                Entrar com Apple
              </button>
            </div>

            {/* Divisor */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
              <div style={{ flex: 1, height: 1, background: "#f0f0f5" }} />
              <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>ou continua com email</span>
              <div style={{ flex: 1, height: 1, background: "#f0f0f5" }} />
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Email */}
              <div className="lg-in-3">
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 7 }}>E-mail</label>
                <div style={{ position: "relative" }}>
                  <Mail size={16} color="#9ca3af" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  <input className="lg-input" type="email" placeholder="o_teu@email.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
                </div>
              </div>

              {/* Senha */}
              <div className="lg-in-4">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Senha</label>
                  <button type="button" onClick={() => { setShowForgot(true); setForgotEmail(email); }}
                    style={{ fontSize: 12, fontWeight: 700, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}>
                    Esqueci a senha
                  </button>
                </div>
                <div style={{ position: "relative" }}>
                  <Lock size={16} color="#9ca3af" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  <input className="lg-input" type={showPw ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" style={{ paddingRight: 48 }} />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    style={{ position: "absolute", right: 0, top: 0, width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Erro */}
              {error && (
                <div className={`lg-fade ${shake ? "lg-shake" : ""}`} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "12px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, fontSize: 13, color: "#dc2626" }}>
                  <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} /> {error}
                </div>
              )}

              {/* Botão */}
              <button type="submit" className="lg-btn lg-in-5 lg-btn-shimmer" disabled={loading} style={{ marginTop: 4 }}>
                {loading
                  ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <span className="lg-spin" style={{ display: "inline-block", width: 18, height: 18, borderRadius: "50%", border: "2.5px solid rgba(255,255,255,.3)", borderTopColor: "#fff" }} />
                      A entrar...
                    </span>
                  : "Entrar →"}
              </button>

              {slowServer && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", background: "#f5f3ff", border: "1px solid #ddd6fe", borderRadius: 12, fontSize: 12, color: "#6d28d9" }}>
                  <span className="lg-spin" style={{ display: "inline-block", width: 14, height: 14, borderRadius: "50%", border: "2px solid #c4b5fd", borderTopColor: "#7c3aed", flexShrink: 0 }} />
                  O servidor está a acordar, aguarda até 1 minuto...
                </div>
              )}
            </form>

            {/* Divider */}
            <div className="lg-in-6" style={{ display: "flex", alignItems: "center", gap: 12, margin: "22px 0" }}>
              <div style={{ flex: 1, height: 1, background: "#f0f0f5" }} />
              <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, whiteSpace: "nowrap" }}>sem conta?</span>
              <div style={{ flex: 1, height: 1, background: "#f0f0f5" }} />
            </div>

            {/* Comprar */}
            <Link to="/subscribe" style={{ textDecoration: "none", display: "block" }} className="lg-in-6">
              <button style={{ width: "100%", height: 48, borderRadius: 14, border: "1.5px solid #c4b5fd", background: "#faf5ff", color: "#7c3aed", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", transition: "all .2s" }}
                onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = "#ede9fe"; }}
                onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background = "#faf5ff"; }}>
                Obter acesso — a partir de US$ 15
              </button>
            </Link>

            <p style={{ textAlign: "center", fontSize: 11, color: "#9ca3af", marginTop: 12 }}>
              O acesso é criado automaticamente ao comprar o curso.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
