/* ===================================================================
   NgadaLearn — Conversa ao Vivo com Batila
   Auto-listen · Avatar cartoon · Resposta em áudio · Tema livre
   Mobile + Desktop
   =================================================================== */

import { useState, useRef, useCallback } from "react";
import { Link } from "react-router";
import { ChevronLeft, X, Volume2, VolumeX, StopCircle } from "lucide-react";

/* ---------------------------------------------------------------
   Animações CSS
--------------------------------------------------------------- */
const ANIM = `
  @keyframes bt-float {
    0%,100% { transform: perspective(600px) rotateY(-4deg) rotateX(1deg) translateY(0); }
    50%      { transform: perspective(600px) rotateY(4deg)  rotateX(-1deg) translateY(-8px); }
  }
  @keyframes bt-ring {
    0%,100% { transform: scale(1);    opacity:.9; }
    50%     { transform: scale(1.07); opacity:1;  }
  }
  @keyframes bt-rip1 {
    0%   { transform: scale(1);   opacity:.6; }
    100% { transform: scale(2.2); opacity:0;  }
  }
  @keyframes bt-rip2 {
    0%   { transform: scale(1);   opacity:.4; }
    100% { transform: scale(2.9); opacity:0;  }
  }
  @keyframes bt-wave {
    0%,100% { height:4px;  }
    50%     { height:22px; }
  }
  @keyframes bt-speak {
    0%,100% { height:6px;  }
    50%     { height:30px; }
  }
  @keyframes bt-in {
    from { opacity:0; transform:translateY(8px); }
    to   { opacity:1; transform:translateY(0);   }
  }
  @keyframes bt-dot {
    0%,100% { opacity:1;   }
    50%     { opacity:.15; }
  }
  @keyframes bt-spin { to { transform:rotate(360deg); } }

  .bt-float  { animation: bt-float  5s ease-in-out infinite; }
  .bt-ring   { animation: bt-ring   1.4s ease-in-out infinite; }
  .bt-rip1   { animation: bt-rip1  2s ease-out infinite; }
  .bt-rip2   { animation: bt-rip2  2s ease-out .7s infinite; }
  .bt-wave   { animation: bt-wave  .6s ease-in-out infinite; height:4px; }
  .bt-speak  { animation: bt-speak .45s ease-in-out infinite; height:6px; }
  .bt-in     { animation: bt-in    .35s ease forwards; }
  .bt-dot    { animation: bt-dot   1.8s ease-in-out infinite; }
  .bt-spin   { animation: bt-spin  .8s linear infinite; }
`;

/* ---------------------------------------------------------------
   Config
--------------------------------------------------------------- */
const BASE     = import.meta.env.VITE_API_URL || "https://ngadalearn-api.onrender.com";
const API_TTS  = (v: string) => `${BASE}/api/speak?voice=${v}`;
const API_CHAT = `${BASE}/api/conversation`;

const BATILA_AVATAR =
  "https://api.dicebear.com/9.x/avataaars/png?seed=BatilaEnglishTutor&size=400" +
  "&backgroundColor=b6e3f4&skinColor=ae5d29&top=shortHairDreads01" +
  "&clotheType=blazerShirt&clotheColor=3c4f5c&eyeType=happy&mouthType=smile";

const VOICE  = "aura-orion-en";
const ACCENT = "#7c3aed";

const STARTER =
  "Hey! I'm Batila, your English conversation partner. So great to meet you! What's on your mind today — we can talk about absolutely anything!";

const FALLBACKS = [
  "That's interesting! Tell me more about that.",
  "Really? What do you think about it?",
  "I love that topic! What's your take on it?",
  "Great point! How does that make you feel?",
  "Fascinating! Have you always felt that way?",
];

/* ---------------------------------------------------------------
   Helpers
--------------------------------------------------------------- */
function quickTip(text: string): string | null {
  const t = text.toLowerCase();
  if (/\bhe have\b/.test(t))                    return '💡 "he has" — not "he have"';
  if (/\bi is\b/.test(t))                       return '💡 "I am" — not "I is"';
  if (/\bdon\'?t has\b/.test(t))                return '💡 "don\'t have" — not "don\'t has"';
  if (/\byesterday i (go|come|eat)\b/.test(t))  return '💡 Past tense: "I went", "I came", "I ate"';
  if (text.trim().split(/\s+/).length < 3)      return '💡 Try a full sentence, e.g. "I think that..."';
  return null;
}

async function getBatilaReply(user: string, history: string, difficulty: string): Promise<string> {
  try {
    const r = await fetch(API_CHAT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userMessage: user,
        history,
        difficulty,
        systemPrompt:
          `You are Batila, a warm and friendly English tutor for Portuguese speakers.\n` +
          `You can talk about ANY topic the student brings up — no restrictions.\n` +
          `Level: ${difficulty}.\n` +
          `Rules: SHORT replies (2–3 sentences max). Always end with an open question to keep the conversation going.\n` +
          `Gently correct grammar mistakes by repeating the correct form naturally in your reply.\n` +
          `Sound like a real person having a genuine conversation, not a robot.`,
      }),
    });
    if (r.ok) {
      const d = await r.json();
      if (d.response?.trim()) return d.response.trim();
    }
  } catch { /* fallback */ }
  return FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
}

type Phase = "idle" | "listening" | "thinking" | "speaking";

/* ===================================================================
   COMPONENTE PRINCIPAL
   =================================================================== */
export function ConversationPractice() {
  const [screen,     setScreen]     = useState<"select" | "live">("select");
  const [difficulty, setDifficulty] = useState("beginner");
  const [phase,      setPhase]      = useState<Phase>("idle");
  const [batilaText, setBatilaText] = useState("");
  const [userText,   setUserText]   = useState("");
  const [liveText,   setLiveText]   = useState("");
  const [tip,        setTip]        = useState<string | null>(null);
  const [muted,      setMuted]      = useState(false);
  const [history,    setHistory]    = useState("");
  const [error,      setError]      = useState("");

  const recognRef    = useRef<any>(null);
  const audioRef     = useRef<HTMLAudioElement | null>(null);
  const silenceRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phaseRef     = useRef<Phase>("idle");
  const liveRef      = useRef("");
  const listeningRef = useRef(false);

  phaseRef.current = phase;
  liveRef.current  = liveText;

  function clearSilence() {
    if (silenceRef.current) { clearTimeout(silenceRef.current); silenceRef.current = null; }
  }
  function stopRecog() {
    listeningRef.current = false;
    try { recognRef.current?.stop(); } catch (_) {}
    recognRef.current = null;
  }
  function stopSpeaking() {
    audioRef.current?.pause();
    if (audioRef.current) { audioRef.current.currentTime = 0; }
    window.speechSynthesis?.cancel();
    setPhase("listening");
    startListening();
  }

  /* ---- TTS ----------------------------------------------------- */
  const batilaSpeak = useCallback(async (text: string) => {
    audioRef.current?.pause();
    window.speechSynthesis?.cancel();
    stopRecog();
    setPhase("speaking");
    setBatilaText(text);

    const afterSpeak = () => {
      setPhase("listening");
      startListening();
    };

    if (!muted) {
      try {
        const r = await fetch(API_TTS(VOICE), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        if (!r.ok) throw new Error("tts");
        const blob = await r.blob();
        const url  = URL.createObjectURL(blob);
        const a    = new Audio(url);
        audioRef.current = a;
        a.onended = () => { URL.revokeObjectURL(url); afterSpeak(); };
        a.onerror = () => afterSpeak();
        await a.play();
        return;
      } catch { /* fallback para Web Speech */ }

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const u  = new SpeechSynthesisUtterance(text);
        u.lang   = "en-US";
        u.rate   = difficulty === "beginner" ? 0.88 : 0.95;
        u.pitch  = 0.9;
        const vs = window.speechSynthesis.getVoices();
        const pref =
          vs.find(v => v.lang === "en-US" && /daniel|david|james|oliver|microsoft david/i.test(v.name)) ||
          vs.find(v => v.lang.startsWith("en-US")) ||
          vs.find(v => v.lang.startsWith("en"));
        if (pref) u.voice = pref;
        u.onend = afterSpeak;
        window.speechSynthesis.speak(u);
        return;
      }
    }
    setTimeout(afterSpeak, Math.min(text.length * 50, 5000));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty, muted]);

  /* ---- Escuta contínua ----------------------------------------- */
  const startListening = useCallback(() => {
    if (listeningRef.current) return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setError("O teu browser não suporta reconhecimento de voz. Usa o Chrome.");
      return;
    }
    const rec = new SR();
    rec.lang           = "en-US";
    rec.continuous     = true;
    rec.interimResults = true;

    rec.onstart = () => {
      listeningRef.current = true;
      if (phaseRef.current !== "speaking") setPhase("listening");
    };

    rec.onresult = (e: any) => {
      if (phaseRef.current === "thinking" || phaseRef.current === "speaking") return;
      clearSilence();
      let interim = "";
      let finalTxt = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalTxt += e.results[i][0].transcript + " ";
        else interim += e.results[i][0].transcript;
      }
      const combined = (finalTxt + interim).trim();
      if (combined) setLiveText(combined);

      if (finalTxt.trim()) {
        silenceRef.current = setTimeout(() => {
          const captured = liveRef.current.trim();
          if (captured && phaseRef.current === "listening") handleUserSpeech(captured);
        }, 1300);
      }
    };

    rec.onspeechend = () => {
      if (phaseRef.current !== "listening") return;
      clearSilence();
      silenceRef.current = setTimeout(() => {
        const captured = liveRef.current.trim();
        if (captured) handleUserSpeech(captured);
      }, 900);
    };

    rec.onerror = (e: any) => {
      if (e.error === "no-speech") { try { rec.start(); } catch (_) {} return; }
      if (e.error === "not-allowed") { setError("Microfone bloqueado. Permite o acesso e recarrega a página."); return; }
      setTimeout(() => { if (phaseRef.current === "listening") startListening(); }, 600);
    };

    rec.onend = () => {
      listeningRef.current = false;
      if (phaseRef.current === "listening") setTimeout(() => startListening(), 300);
    };

    recognRef.current = rec;
    try { rec.start(); } catch (_) {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- Processar fala do utilizador ----------------------------- */
  const handleUserSpeech = useCallback(async (text: string) => {
    clearSilence();
    stopRecog();
    setLiveText("");
    setUserText(text);
    setTip(quickTip(text));
    setPhase("thinking");

    const newHistory = history + `Student: ${text}\n`;
    const reply = await getBatilaReply(text, newHistory, difficulty);
    setHistory(newHistory + `Batila: ${reply}\n`);
    await batilaSpeak(reply);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, difficulty, batilaSpeak]);

  /* ---- Iniciar sessão ------------------------------------------ */
  async function startSession() {
    setScreen("live");
    setPhase("idle");
    setBatilaText("");
    setUserText("");
    setLiveText("");
    setHistory("");
    setTip(null);
    setError("");
    setHistory(`Batila: ${STARTER}\n`);
    await batilaSpeak(STARTER);
  }

  /* =================================================================
     ECRÃ DE SELEÇÃO
     ================================================================= */
  if (screen === "select") return (
    <div style={{ minHeight: "100dvh", background: "#0a0a14", color: "#f0f0f5", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <style>{ANIM}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "max(16px,env(safe-area-inset-top)) 16px 12px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <Link to="/lessons" style={{ minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.4)", borderRadius: 12, textDecoration: "none" }}>
          <ChevronLeft size={22} />
        </Link>
        <div>
          <p style={{ fontWeight: 800, fontSize: 16, margin: 0, lineHeight: 1.2 }}>Conversa com Batila</p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", margin: "3px 0 0" }}>Tutor de inglês · IA ao vivo</p>
        </div>
      </div>

      <div style={{ maxWidth: 460, margin: "0 auto", padding: "32px 16px 48px" }}>

        {/* Card Batila */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 24px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 28, marginBottom: 32 }}>
          <div className="bt-float" style={{ position: "relative", width: 120, height: 120, marginBottom: 18 }}>
            <div style={{ position: "absolute", inset: -6, borderRadius: "50%", border: `2px solid ${ACCENT}40` }} />
            <div style={{ position: "absolute", inset: -20, borderRadius: "50%", background: `radial-gradient(circle,${ACCENT}20 0%,transparent 70%)` }} />
            <img
              src={BATILA_AVATAR}
              alt="Batila"
              style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", border: `3px solid ${ACCENT}90`, boxShadow: `0 8px 32px ${ACCENT}40`, display: "block" }}
              onError={e => { (e.target as HTMLImageElement).src = "https://api.dicebear.com/9.x/avataaars/png?seed=BatilaFallback&size=200&backgroundColor=b6e3f4"; }}
            />
            <div className="bt-dot" style={{ position: "absolute", bottom: 6, right: 6, width: 16, height: 16, borderRadius: "50%", background: "#4ade80", border: "2.5px solid #0a0a14" }} />
          </div>
          <p style={{ fontWeight: 900, fontSize: 24, margin: "0 0 4px" }}>Batila</p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", margin: "0 0 4px" }}>Tutor de Inglês · IA</p>
          <p style={{ fontSize: 12, color: "#4ade80", fontWeight: 600, margin: "0 0 16px" }}>Disponível agora</p>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", textAlign: "center", lineHeight: 1.7, margin: 0 }}>
            Fala comigo sobre <strong style={{ color: "rgba(255,255,255,0.8)" }}>qualquer assunto</strong> em inglês.<br />
            Futebol, música, trabalho, viagens, o que quiseres!<br />
            <span style={{ fontSize: 12, opacity: 0.6 }}>Ouço-te e respondo automaticamente com voz.</span>
          </p>
        </div>

        {/* Nível */}
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 10 }}>O teu nível de inglês</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
          {([
            ["beginner",     "A1–A2", "#22c55e", "Iniciante"],
            ["intermediate", "B1–B2", "#eab308", "Intermédio"],
            ["advanced",     "C1–C2", "#ef4444", "Avançado"],
          ] as const).map(([id, code, col, label]) => (
            <button key={id} onClick={() => setDifficulty(id)}
              style={{
                flex: 1, padding: "14px 6px", borderRadius: 18,
                border: `2px solid ${difficulty === id ? col : "rgba(255,255,255,0.09)"}`,
                background: difficulty === id ? `${col}15` : "rgba(255,255,255,0.03)",
                color: difficulty === id ? col : "rgba(255,255,255,0.35)",
                fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all .2s",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              }}>
              <span style={{ fontSize: 15 }}>{code}</span>
              <span style={{ fontSize: 10, opacity: 0.7 }}>{label}</span>
            </button>
          ))}
        </div>

        {/* CTA */}
        <button onClick={startSession}
          style={{ width: "100%", padding: 18, borderRadius: 22, border: "none", background: `linear-gradient(135deg,${ACCENT},#4f46e5)`, color: "#fff", fontWeight: 900, fontSize: 17, cursor: "pointer", boxShadow: `0 6px 28px ${ACCENT}50`, minHeight: 60, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          Começar conversa com Batila
        </button>
        <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.2)", marginTop: 12 }}>
          Permite o microfone quando pedido · Chrome recomendado
        </p>
      </div>
    </div>
  );

  /* =================================================================
     ECRÃ AO VIVO
     ================================================================= */
  const isListening = phase === "listening";
  const isSpeaking  = phase === "speaking";
  const isThinking  = phase === "thinking";
  const AV          = "min(46vw, 195px)";

  return (
    <div style={{
      height: "100dvh",
      background: "#0a0a14",
      color: "#f0f0f5",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      fontFamily: "system-ui,-apple-system,sans-serif",
      WebkitUserSelect: "none",
    }}>
      <style>{ANIM}</style>

      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "max(14px,env(safe-area-inset-top)) 16px 10px",
        flexShrink: 0,
      }}>
        <button
          onClick={() => { stopRecog(); clearSilence(); audioRef.current?.pause(); window.speechSynthesis?.cancel(); setScreen("select"); }}
          style={{ minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", borderRadius: 12 }}
        >
          <X size={20} />
        </button>
        <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>Conversa Livre</span>
        <button
          onClick={() => { setMuted(m => !m); audioRef.current?.pause(); window.speechSynthesis?.cancel(); }}
          style={{ minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", color: muted ? "#f87171" : "rgba(255,255,255,0.35)", cursor: "pointer", borderRadius: 12 }}
        >
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

      {/* Centro */}
      <div style={{
        flex: 1, minHeight: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "4px 20px",
        gap: "clamp(10px,2.2vh,20px)",
        overflowY: "auto",
      }}>

        {/* Avatar */}
        <div style={{ position: "relative", width: AV, height: AV, flexShrink: 0 }}>
          {isListening && <>
            <div className="bt-rip1" style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `${ACCENT}38` }} />
            <div className="bt-rip2" style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `${ACCENT}22` }} />
          </>}

          <div
            className={isSpeaking ? "bt-ring" : ""}
            style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid ${(isListening || isSpeaking) ? ACCENT : "rgba(255,255,255,0.1)"}`, transition: "border-color .4s" }}
          />

          <div
            className={!isSpeaking && !isListening ? "bt-float" : ""}
            style={{ position: "absolute", inset: "8%", zIndex: 10 }}
          >
            <div style={{
              width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden",
              border: `3px solid ${isSpeaking ? ACCENT : "rgba(255,255,255,0.12)"}`,
              boxShadow: isSpeaking ? `0 0 0 4px ${ACCENT}30,0 0 40px ${ACCENT}50` : "0 8px 32px rgba(0,0,0,0.5)",
              transform: isSpeaking ? "perspective(500px) scale(1.04)" : isListening ? "perspective(500px) rotateY(-2deg)" : "perspective(500px) rotateY(-3deg) rotateX(1deg)",
              transition: "all .45s ease",
            }}>
              <img
                src={BATILA_AVATAR}
                alt="Batila"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                onError={e => { (e.target as HTMLImageElement).src = "https://api.dicebear.com/9.x/avataaars/png?seed=BatilaFallback&size=400&backgroundColor=b6e3f4"; }}
              />
              {isSpeaking && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "0 0 14px", gap: 3, background: "linear-gradient(to top,rgba(0,0,0,0.5) 0%,transparent 55%)" }}>
                  {[0,1,2,3,4,5,6].map(i => (
                    <div key={i} className="bt-speak" style={{ width: 4, background: "#fff", borderRadius: 99, animationDelay: `${i*60}ms` }} />
                  ))}
                </div>
              )}
              {isThinking && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.42)" }}>
                  <div className="bt-spin" style={{ width: 34, height: 34, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.15)", borderTopColor: ACCENT }} />
                </div>
              )}
            </div>
          </div>

          {/* Badge de estado */}
          <div style={{
            position: "absolute", bottom: "-3%", left: "50%", transform: "translateX(-50%)",
            padding: "4px 13px", borderRadius: 99, fontSize: 11, fontWeight: 700, color: "#fff",
            whiteSpace: "nowrap", zIndex: 20, transition: "background .3s",
            boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
            background: isListening ? "rgba(239,68,68,0.92)" : isSpeaking ? ACCENT : isThinking ? "rgba(245,158,11,0.9)" : "rgba(255,255,255,0.1)",
          }}>
            {isListening ? "A ouvir" : isSpeaking ? "A falar..." : isThinking ? "A pensar..." : "Batila"}
          </div>
        </div>

        {/* Nome */}
        <p style={{ margin: 0, fontWeight: 800, fontSize: "clamp(15px,4vw,19px)", opacity: 0.9 }}>Batila</p>

        {/* Fala do Batila */}
        {batilaText && (
          <div className="bt-in" key={batilaText.slice(0, 20)} style={{ maxWidth: 340, width: "100%", textAlign: "center" }}>
            <p style={{ fontSize: "clamp(13px,3.5vw,16px)", fontWeight: 400, lineHeight: 1.6, color: "rgba(255,255,255,0.86)", fontStyle: "italic", margin: 0 }}>
              "{batilaText}"
            </p>
          </div>
        )}

        {/* Fala do utilizador */}
        {(liveText || userText) && (
          <div className="bt-in" key={(liveText || userText).slice(0, 20)} style={{ maxWidth: 340, width: "100%" }}>
            <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "10px 16px", textAlign: "center" }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", margin: "0 0 5px" }}>Tu</p>
              <p style={{ fontSize: "clamp(12px,3.2vw,15px)", color: liveText ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.88)", lineHeight: 1.5, margin: 0 }}>
                {liveText || userText}
              </p>
            </div>
          </div>
        )}

        {/* Dica gramatical */}
        {tip && !liveText && (
          <div className="bt-in" key={tip} style={{ maxWidth: 340, width: "100%", background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: 12, padding: "8px 16px", textAlign: "center" }}>
            <p style={{ fontSize: "clamp(11px,3vw,13px)", color: "#fbbf24", margin: 0, lineHeight: 1.5 }}>{tip}</p>
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className="bt-in" style={{ maxWidth: 340, width: "100%", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: "8px 16px", textAlign: "center" }}>
            <p style={{ fontSize: "clamp(11px,3vw,13px)", color: "#f87171", margin: 0, lineHeight: 1.5 }}>{error}</p>
          </div>
        )}
      </div>

      {/* Rodapé */}
      <div style={{
        flexShrink: 0,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
        paddingBottom: "max(20px,env(safe-area-inset-bottom))",
        paddingTop: 8,
      }}>
        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 22px", borderRadius: 99,
              border: "1.5px solid rgba(248,113,113,0.4)",
              background: "rgba(239,68,68,0.12)",
              color: "#f87171", fontWeight: 700, fontSize: 14,
              cursor: "pointer", transition: "all .2s",
            }}
          >
            <StopCircle size={17} />
            Parar Batila
          </button>
        )}
        {isListening && (
          <div style={{ display: "flex", alignItems: "center", gap: 3, height: 22 }}>
            {[0,1,2,3,4,5,6].map(i => (
              <div key={i} className="bt-wave" style={{ width: 4, background: liveText ? "#f87171" : "rgba(255,255,255,0.2)", borderRadius: 99, animationDelay: `${i*70}ms` }} />
            ))}
          </div>
        )}
        <p style={{ fontSize: "clamp(11px,2.8vw,13px)", color: "rgba(255,255,255,0.22)", margin: 0, textAlign: "center" }}>
          {isListening
            ? (liveText ? "Estou a ouvir-te!" : "Fala em inglês sobre qualquer tema...")
            : isSpeaking ? "Batila está a falar..."
            : isThinking ? "A preparar resposta..."
            : "A iniciar o microfone..."}
        </p>
      </div>
    </div>
  );
}
