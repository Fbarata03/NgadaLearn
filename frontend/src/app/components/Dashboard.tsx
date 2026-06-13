import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Link } from "react-router";
import { useProgress } from "../hooks/useProgress";
import { useAuth } from "../context/AuthContext";
import {
  ASSIMIL_LESSONS, PIMSLEUR_LESSONS_LIST, LEITURAS_LIST, ALL_LESSONS,
} from "../data/lessonsData";
import { downloadCertificate } from "../utils/generateCertificate";
import {
  BookOpen, Headphones, Award, TrendingUp,
  Target, Clock, Flame, ChevronRight, PlayCircle, Download, Lock,
  Zap, Star, Trophy,
} from "lucide-react";

const CERT_UNLOCK_AT = 50;

/* ── Ícone SVG realista inline ── */
function StatIcon({ type }: { type: "lessons" | "streak" | "minutes" | "level" }) {
  const configs = {
    lessons: {
      bg: "linear-gradient(135deg,#7c3aed,#4f46e5)",
      shadow: "0 8px 24px rgba(124,58,237,.45)",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
          <rect x="3" y="3" width="18" height="18" rx="3" fill="rgba(255,255,255,.25)" />
          <path d="M7 8h10M7 12h8M7 16h6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          <circle cx="18" cy="17" r="4" fill="#a78bfa" />
          <path d="M16.5 17l1 1 2-2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    streak: {
      bg: "linear-gradient(135deg,#f97316,#ef4444)",
      shadow: "0 8px 24px rgba(249,115,22,.45)",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
          <path d="M12 2C12 2 7 8 7 13a5 5 0 0010 0c0-2-.8-3.8-2-5.2C14.5 9.5 14 11 14 12c0 0-1-1-1-3s-1-7-1-7z" fill="rgba(255,255,255,.3)" />
          <path d="M12 2C12 2 7 8 7 13a5 5 0 0010 0c0-2-.8-3.8-2-5.2C14.5 9.5 14 11 14 12c0 0-1-1-1-3s-1-7-1-7z" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="12" cy="15" r="2" fill="#fde68a" />
        </svg>
      ),
    },
    minutes: {
      bg: "linear-gradient(135deg,#059669,#0891b2)",
      shadow: "0 8px 24px rgba(5,150,105,.4)",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
          <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,.35)" strokeWidth="2" />
          <circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="2" strokeDasharray="20 56" strokeLinecap="round" />
          <path d="M12 7v5l3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="1.5" fill="#6ee7b7" />
        </svg>
      ),
    },
    level: {
      bg: "linear-gradient(135deg,#d97706,#f59e0b)",
      shadow: "0 8px 24px rgba(217,119,6,.45)",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" fill="rgba(255,255,255,.3)" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M12 6l1.5 4.6H18l-3.9 2.8 1.5 4.6L12 15.5l-3.6 2.5 1.5-4.6L6 10.6h4.5L12 6z" fill="#fde68a" />
        </svg>
      ),
    },
  };
  const c = configs[type];
  return (
    <div style={{ width: 52, height: 52, borderRadius: 16, background: c.bg, boxShadow: c.shadow, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {c.icon}
    </div>
  );
}

function CertificateSection({
  name, level, totalCompleted, totalAll, totalMinutes,
}: {
  name: string; level: string; totalCompleted: number;
  totalAll: number; totalMinutes: number;
}) {
  const unlocked = totalCompleted >= CERT_UNLOCK_AT;
  const pctToUnlock = Math.min(Math.round((totalCompleted / CERT_UNLOCK_AT) * 100), 100);

  const handleDownload = () => {
    downloadCertificate({ name, level, totalCompleted, totalAll, totalMinutes });
  };

  return (
    <div style={{ borderRadius: 24, overflow: "hidden", border: `2px solid ${unlocked ? "#fde68a" : "#e5e7eb"}`, background: unlocked ? "linear-gradient(135deg,#fffbeb,#fef3c7)" : "#fff", boxShadow: unlocked ? "0 8px 32px rgba(217,119,6,.15)" : "0 2px 8px rgba(0,0,0,.06)" }}>
      {/* Header */}
      <div style={{ padding: "16px 24px", display: "flex", alignItems: "center", gap: 14, background: unlocked ? "linear-gradient(135deg,#f59e0b,#d97706)" : "linear-gradient(135deg,#f3f4f6,#e5e7eb)" }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(255,255,255,.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {unlocked
            ? <Trophy size={22} color="#78350f" />
            : <Lock size={20} color="#9ca3af" />}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 900, fontSize: 15, color: unlocked ? "#78350f" : "#374151", margin: 0 }}>
            {unlocked ? "🎓 Certificado Disponível!" : "Certificado de Conclusão"}
          </p>
          <p style={{ fontSize: 12, color: unlocked ? "#92400e" : "#6b7280", margin: 0 }}>
            {unlocked ? `Parabéns! Concluíste ${totalCompleted} lições — Nível ${level}` : `Completa ${CERT_UNLOCK_AT} lições para desbloquear`}
          </p>
        </div>
        {unlocked && (
          <span style={{ background: "rgba(120,53,15,.2)", color: "#78350f", fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 99, letterSpacing: "0.05em" }}>DESBLOQUEADO</span>
        )}
      </div>

      <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 20 }} className="sm:flex-row sm:items-center">
        {/* Preview do certificado */}
        <div style={{ width: "100%", maxWidth: 220, height: 140, borderRadius: 16, flexShrink: 0, position: "relative", overflow: "hidden", background: unlocked ? "linear-gradient(135deg,#1e1b4b,#312e81)" : "#f9fafb", border: `2px solid ${unlocked ? "#a78bfa" : "#e5e7eb"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {unlocked ? (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 16 }}>
              <p style={{ fontSize: 9, color: "#c4b5fd", fontWeight: 700, letterSpacing: "0.2em", margin: "0 0 4px" }}>NgadaLearn</p>
              <p style={{ fontWeight: 900, fontSize: 13, color: "#fff", lineHeight: 1.2, margin: 0 }}>CERTIFICADO DE CONCLUSÃO</p>
              <div style={{ width: 48, height: 1, background: "#fbbf24", margin: "8px 0" }} />
              <p style={{ fontWeight: 800, fontSize: 11, color: "#fde68a", margin: 0, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</p>
              <p style={{ fontSize: 10, color: "#a78bfa", margin: "3px 0 0" }}>Nível {level}</p>
              <div style={{ position: "absolute", top: 8, left: 8, width: 8, height: 8, border: "1.5px solid rgba(251,191,36,.5)" }} />
              <div style={{ position: "absolute", top: 8, right: 8, width: 8, height: 8, border: "1.5px solid rgba(251,191,36,.5)" }} />
              <div style={{ position: "absolute", bottom: 8, left: 8, width: 8, height: 8, border: "1.5px solid rgba(251,191,36,.5)" }} />
              <div style={{ position: "absolute", bottom: 8, right: 8, width: 8, height: 8, border: "1.5px solid rgba(251,191,36,.5)" }} />
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "#d1d5db" }}>
              <Lock size={36} />
              <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, margin: 0 }}>{totalCompleted}/{CERT_UNLOCK_AT} lições</p>
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          {unlocked ? (
            <>
              <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16, lineHeight: 1.7 }}>
                O teu certificado está pronto. Partilha no LinkedIn, CV ou redes sociais!
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
                {[
                  { val: totalCompleted, label: "Lições", color: "#7c3aed", bg: "#f5f3ff" },
                  { val: `${Math.round(totalMinutes / 60)}h`, label: "Estudo", color: "#2563eb", bg: "#eff6ff" },
                  { val: level, label: "Nível", color: "#059669", bg: "#f0fdf4" },
                ].map(({ val, label, color, bg }) => (
                  <div key={label} style={{ background: bg, borderRadius: 14, padding: "10px 8px", textAlign: "center" }}>
                    <p style={{ fontWeight: 900, fontSize: 18, color, margin: 0, lineHeight: 1 }}>{val}</p>
                    <p style={{ fontSize: 10, color: "#9ca3af", margin: "4px 0 0" }}>{label}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <Link to="/certificate" style={{ flex: 1, textDecoration: "none" }}>
                  <button style={{ width: "100%", height: 46, borderRadius: 14, border: "none", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 6px 20px rgba(124,58,237,.35)", fontFamily: "inherit" }}>
                    <Award size={16} /> Ver Certificado
                  </button>
                </Link>
                <button onClick={handleDownload} style={{ width: 46, height: 46, borderRadius: 14, border: "2px solid #fde68a", background: "#fffbeb", color: "#d97706", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Download size={16} />
                </button>
              </div>
            </>
          ) : (
            <>
              <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 14 }}>
                Faltam <strong style={{ color: "#111" }}>{CERT_UNLOCK_AT - totalCompleted} lições</strong> para o teu certificado.
              </p>
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9ca3af", marginBottom: 6 }}>
                  <span>{totalCompleted} concluídas</span><span>{CERT_UNLOCK_AT} necessárias</span>
                </div>
                <Progress value={pctToUnlock} className="h-3" />
                <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>{pctToUnlock}% do caminho para o certificado</p>
              </div>
              <Link to="/lessons" style={{ textDecoration: "none", display: "block" }}>
                <button style={{ width: "100%", height: 44, borderRadius: 14, border: "2px solid #e5e7eb", background: "#fff", color: "#374151", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                  Continuar a estudar →
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   DASHBOARD PRINCIPAL
══════════════════════════════════════════ */
export function Dashboard() {
  const { user } = useAuth();
  const { totalCompleted, totalMinutes, streak, lastOpened, isCompleted } = useProgress();

  const totalAll = ALL_LESSONS.length;
  const pct = Math.round((totalCompleted / totalAll) * 100);

  const nextAssimil  = ASSIMIL_LESSONS.find(l => !isCompleted(l.id));
  const nextPimsleur = PIMSLEUR_LESSONS_LIST.find(l => !isCompleted(l.id));
  const nextLeitura  = LEITURAS_LIST.find(l => !isCompleted(l.id));
  const nextLessons  = [nextAssimil, nextPimsleur, nextLeitura].filter(Boolean);

  const doneAssimil  = ASSIMIL_LESSONS.filter(l => isCompleted(l.id)).length;
  const donePimsleur = PIMSLEUR_LESSONS_LIST.filter(l => isCompleted(l.id)).length;
  const doneLeituras = LEITURAS_LIST.filter(l => isCompleted(l.id)).length;

  const level     = pct < 20 ? "Iniciante" : pct < 50 ? "Elementar" : pct < 75 ? "Intermediário" : "Avançado";
  const nextLevel = pct < 20 ? "Elementar" : pct < 50 ? "Intermediário" : pct < 75 ? "Avançado" : "Fluente";

  const achievements = [
    { emoji: "🏆", title: "Primeira Aula",    desc: "Complete 1 aula",       unlocked: totalCompleted >= 1 },
    { emoji: "🔥", title: "Em Chamas",        desc: "3 dias seguidos",       unlocked: streak >= 3 },
    { emoji: "📚", title: "Assimil Iniciado", desc: "5 lições Assimil",      unlocked: doneAssimil >= 5 },
    { emoji: "🎧", title: "Ouvido Afinado",   desc: "5 aulas Pimsleur",      unlocked: donePimsleur >= 5 },
    { emoji: "⭐", title: "Dedicado",         desc: "10 aulas totais",       unlocked: totalCompleted >= 10 },
    { emoji: "🌍", title: "Explorador",       desc: "25 aulas totais",       unlocked: totalCompleted >= 25 },
    { emoji: "💎", title: "Comprometido",     desc: "50 aulas totais",       unlocked: totalCompleted >= 50 },
    { emoji: "🏅", title: "Mestre do Inglês", desc: "100 aulas totais",      unlocked: totalCompleted >= 100 },
  ];

  const MODULE_CONFIG = [
    { label: "Assimil",     value: doneAssimil,  total: ASSIMIL_LESSONS.length,       color: "#7c3aed", bg: "#f5f3ff", icon: "📖" },
    { label: "Pimsleur",    value: donePimsleur, total: PIMSLEUR_LESSONS_LIST.length, color: "#2563eb", bg: "#eff6ff", icon: "🎧" },
    { label: "Leituras",    value: doneLeituras, total: LEITURAS_LIST.length,          color: "#059669", bg: "#f0fdf4", icon: "📰" },
    { label: "Total Geral", value: totalCompleted, total: totalAll,                   color: "#374151", bg: "#f9fafb", icon: "📊" },
  ];

  return (
    <div style={{ background: "#f4f3ff", minHeight: "100vh", fontFamily: "system-ui,-apple-system,sans-serif" }}>

      {/* ── Hero ── */}
      <div style={{ background: "linear-gradient(135deg,#07070f 0%,#1e1b4b 55%,#312e81 100%)", padding: "clamp(16px,4vw,36px) clamp(14px,4vw,20px) clamp(20px,4vw,40px)", position: "relative", overflow: "hidden" }}>
        <div style={{ position:"absolute", top:"-20%", left:"-5%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(124,58,237,.3) 0%,transparent 65%)", filter:"blur(70px)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"-30%", right:"-5%", width:320, height:320, borderRadius:"50%", background:"radial-gradient(circle,rgba(79,70,229,.2) 0%,transparent 65%)", filter:"blur(80px)", pointerEvents:"none" }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }} className="md:flex-row md:items-center md:justify-between">
            <div>
              {streak > 0 && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(249,115,22,.2)", border: "1px solid rgba(249,115,22,.4)", borderRadius: 99, padding: "4px 14px", marginBottom: 12 }}>
                  <Flame size={13} color="#fb923c" />
                  <span style={{ fontSize: 12, color: "#fb923c", fontWeight: 700 }}>{streak} dia{streak > 1 ? "s" : ""} em sequência</span>
                </div>
              )}
              <h1 style={{ fontSize: "clamp(22px,3.5vw,34px)", fontWeight: 900, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.5px" }}>
                Olá, {user?.name?.split(" ")[0] || "estudante"}! 👋
              </h1>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,.5)", margin: 0 }}>
                {totalCompleted === 0
                  ? "A tua jornada para a fluência começa hoje."
                  : `${totalCompleted} aula${totalCompleted > 1 ? "s" : ""} concluída${totalCompleted > 1 ? "s" : ""} · continua assim!`}
              </p>
            </div>
            <Link to="/lessons" style={{ textDecoration: "none" }}>
              <button style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", color: "#7c3aed", border: "none", borderRadius: 16, padding: "14px 24px", fontWeight: 800, fontSize: 15, cursor: "pointer", boxShadow: "0 8px 28px rgba(0,0,0,.25)", whiteSpace: "nowrap", fontFamily: "inherit" }}>
                <PlayCircle size={20} />
                {lastOpened ? "Continuar" : "Começar a Aprender"}
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px clamp(12px,4vw,16px) 80px" }}>

        {/* ── Banner boas-vindas (só quando 0 aulas) ── */}
        {totalCompleted === 0 && (
          <div style={{ background: "linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%)", borderRadius: 22, padding: "24px 28px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
            <div style={{ position:"absolute", top:"-30%", right:"-5%", width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,.06)", pointerEvents:"none" }} />
            <h2 style={{ fontWeight: 900, fontSize: "clamp(18px,3vw,22px)", color: "#fff", margin: "0 0 8px" }}>
              👋 Bem-vindo à NgadaLearn!
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.75)", margin: "0 0 18px", lineHeight: 1.65, maxWidth: 520 }}>
              A tua primeira lição demora apenas 25 minutos. Começa agora e inicia a tua sequência diária.
            </p>
            <Link to={`/lessons/${ASSIMIL_LESSONS[0]?.id || ""}`} style={{ textDecoration: "none" }}>
              <button style={{ background: "#fff", color: "#7c3aed", border: "none", borderRadius: 14, padding: "12px 22px", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 20px rgba(0,0,0,.18)", display: "inline-flex", alignItems: "center", gap: 8 }}>
                ▶ Começar Lição 1 — Primeiros Contatos →
              </button>
            </Link>
          </div>
        )}

        {/* ── Stats cards ── */}
        <style>{`
          @media(max-width:500px){.stats-grid{grid-template-columns:1fr 1fr!important;gap:8px!important;}}
          @media(max-width:360px){.stats-grid{grid-template-columns:1fr 1fr!important;}}
          @media(max-width:500px){.dash-2col{grid-template-columns:1fr!important;}}
          @media(max-width:500px){.stat-card{padding:12px 10px!important;}}
          @media(max-width:500px){.stat-val{font-size:20px!important;}}
        `}</style>
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 24 }}>
          {[
            { type: "lessons" as const, value: totalCompleted, label: "Aulas Concluídas", sub: `${totalCompleted}/${totalAll}`, progress: pct },
            { type: "streak"  as const, value: streak,         label: "Dias em Sequência", sub: streak === 0 ? "Começa hoje!" : streak >= 7 ? "Incrível! 🔥" : "Continue assim!", progress: null },
            { type: "minutes" as const, value: totalMinutes,   label: "Minutos Estudados", sub: `≈ ${Math.round(totalMinutes / 60)}h de estudo`, progress: null },
            { type: "level"   as const, value: level,          label: "Nível Atual",       sub: `Próximo: ${nextLevel}`, progress: null },
          ].map(({ type, value, label, sub, progress }) => (
            <div key={type} className="stat-card" style={{ background: "#fff", borderRadius: 18, padding: "16px 14px", boxShadow: "0 2px 12px rgba(0,0,0,.06)", border: "1px solid rgba(0,0,0,.05)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                <StatIcon type={type} />
                <span className="stat-val" style={{ fontSize: type === "level" ? 14 : 26, fontWeight: 900, color: "#111", lineHeight: 1, textAlign: "right", wordBreak: "break-word", maxWidth: "55%" }}>{value}</span>
              </div>
              <p style={{ fontWeight: 700, fontSize: 12, color: "#374151", margin: "0 0 3px" }}>{label}</p>
              <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>{sub}</p>
              {progress !== null && (
                <div style={{ marginTop: 10, height: 5, background: "#f0eeff", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#7c3aed,#4f46e5)", borderRadius: 99, transition: "width .5s ease" }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Progresso + Próximas Aulas ── */}
        <style>{`@media(max-width:640px){.dash-2col{grid-template-columns:1fr!important;}}`}</style>
        <div className="dash-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>

          {/* Progresso por Módulo */}
          <div style={{ background: "#fff", borderRadius: 22, padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,.06)", border: "1px solid rgba(0,0,0,.05)" }}>
            <h2 style={{ fontWeight: 800, fontSize: 16, color: "#111", margin: "0 0 20px", display: "flex", alignItems: "center", gap: 8 }}>
              <TrendingUp size={18} color="#7c3aed" /> Progresso por Módulo
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {MODULE_CONFIG.map(({ label, value, total, color, bg, icon }) => {
                const pctMod = total > 0 ? (value / total) * 100 : 0;
                return (
                  <div key={label}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{icon}</div>
                        <span style={{ fontWeight: 700, fontSize: 14, color: "#374151" }}>{label}</span>
                      </div>
                      <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>{value}/{total}</span>
                    </div>
                    <div style={{ height: 8, background: "#f3f4f6", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pctMod}%`, background: color, borderRadius: 99, transition: "width .6s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Próximas Aulas */}
          <div style={{ background: "#fff", borderRadius: 22, padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,.06)", border: "1px solid rgba(0,0,0,.05)" }}>
            <h2 style={{ fontWeight: 800, fontSize: 16, color: "#111", margin: "0 0 20px", display: "flex", alignItems: "center", gap: 8 }}>
              <Zap size={18} color="#7c3aed" /> Próximas Aulas
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {nextLessons.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 0", color: "#9ca3af" }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>🏆</div>
                  <p style={{ fontWeight: 700, fontSize: 14, color: "#374151", margin: 0 }}>Parabéns! Concluíste tudo!</p>
                </div>
              ) : (
                nextLessons.map((lesson) => lesson && (
                  <Link key={lesson.id} to={`/lessons/${lesson.id}`} style={{ textDecoration: "none" }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                      border: "1.5px solid #f0eeff", borderRadius: 16,
                      transition: "all .2s",
                      cursor: "pointer",
                    }}
                      onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#a78bfa"; (e.currentTarget as HTMLDivElement).style.background = "#faf8ff"; }}
                      onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#f0eeff"; (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
                    >
                      <div style={{
                        width: 42, height: 42, borderRadius: 13, flexShrink: 0, fontSize: 20,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: lesson.category === "assimil" ? "#f5f3ff" : lesson.category === "pimsleur" ? "#eff6ff" : "#f0fdf4",
                      }}>
                        {lesson.category === "pimsleur" ? "🎧" : lesson.category === "assimil" ? "📖" : "📰"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 700, fontSize: 13, color: "#111", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lesson.title}</p>
                        <p style={{ fontSize: 11, color: "#9ca3af", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lesson.subtitle}</p>
                      </div>
                      <span style={{ fontSize: 11, color: "#9ca3af", flexShrink: 0, display: "flex", alignItems: "center", gap: 3 }}>
                        <Clock size={11} />{lesson.durationMin}min
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
            <Link to="/lessons" style={{ textDecoration: "none", display: "block", marginTop: 14 }}>
              <button style={{ width: "100%", height: 42, borderRadius: 14, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "inherit" }}>
                Ver Todas as Aulas <ChevronRight size={14} />
              </button>
            </Link>
          </div>
        </div>

        {/* ── Certificado ── */}
        <div style={{ marginBottom: 24 }}>
          <CertificateSection
            name={user?.name || ""}
            level={level}
            totalCompleted={totalCompleted}
            totalAll={totalAll}
            totalMinutes={totalMinutes}
          />
        </div>

        {/* ── Conquistas ── */}
        <div style={{ background: "#fff", borderRadius: 22, padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,.06)", border: "1px solid rgba(0,0,0,.05)", marginBottom: 24 }}>
          <h2 style={{ fontWeight: 800, fontSize: 16, color: "#111", margin: "0 0 20px", display: "flex", alignItems: "center", gap: 8 }}>
            <Star size={18} color="#f59e0b" /> Conquistas
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 14 }}>
            {achievements.map((a) => (
              <div key={a.title} style={{
                position: "relative", textAlign: "center",
                padding: "22px 14px 18px", borderRadius: 22, minHeight: 130,
                background: a.unlocked ? "linear-gradient(135deg,#fffbeb,#fef3c7)" : "#f9fafb",
                border: `2px solid ${a.unlocked ? "#fde68a" : "#f3f4f6"}`,
                boxShadow: a.unlocked ? "0 6px 20px rgba(217,119,6,.18)" : "none",
                opacity: a.unlocked ? 1 : 0.4,
                transition: "all .2s",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              }}>
                {a.unlocked ? (
                  <div style={{ position: "absolute", top: -7, right: -7, width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg,#10b981,#059669)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(5,150,105,.4)" }}>
                    <span style={{ color: "#fff", fontSize: 10, fontWeight: 900 }}>✓</span>
                  </div>
                ) : (
                  <div style={{ position: "absolute", top: 8, right: 10 }}>
                    <Lock size={14} color="#9ca3af" />
                  </div>
                )}
                <div style={{ fontSize: 48, lineHeight: 1, marginBottom: 10 }}>{a.emoji}</div>
                <p style={{ fontWeight: 800, fontSize: 14, color: "#111", margin: "0 0 5px", lineHeight: 1.3 }}>{a.title}</p>
                <p style={{ fontSize: 12, color: "#9ca3af", margin: 0, lineHeight: 1.4 }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA / Meta diária ── */}
        <div style={{ background: "linear-gradient(135deg,#07070f,#1e1b4b,#312e81)", borderRadius: 24, padding: "28px 28px", position: "relative", overflow: "hidden" }}>
          <div style={{ position:"absolute", top:"-30%", right:"-5%", width:280, height:280, borderRadius:"50%", background:"radial-gradient(circle,rgba(124,58,237,.3) 0%,transparent 65%)", filter:"blur(60px)", pointerEvents:"none" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "relative", zIndex: 1 }} className="sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 style={{ fontWeight: 900, fontSize: 20, color: "#fff", margin: "0 0 6px", display: "flex", alignItems: "center", gap: 8 }}>
                {totalCompleted === 0 ? <><PlayCircle size={20} /> Começa Hoje!</> : <><Target size={20} /> Continua Hoje!</>}
              </h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,.5)", margin: 0 }}>
                {totalCompleted === 0
                  ? `Tens acesso a ${totalAll} aulas — Assimil, Pimsleur e Leituras.`
                  : "Cada aula aproxima-te da fluência. Mantém a sequência!"}
              </p>
            </div>
            <Link to="/lessons" style={{ textDecoration: "none", flexShrink: 0 }}>
              <button style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", color: "#7c3aed", border: "none", borderRadius: 16, padding: "13px 22px", fontWeight: 800, fontSize: 14, cursor: "pointer", boxShadow: "0 6px 20px rgba(0,0,0,.3)", whiteSpace: "nowrap", fontFamily: "inherit" }}>
                {totalCompleted === 0 ? "Começar Lição 1 →" : "Próxima Aula →"}
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
