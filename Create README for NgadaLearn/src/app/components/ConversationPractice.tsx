/* ═══════════════════════════════════════════════════════════════════
   NgadaLearn — Conversação ao Vivo com Batila
   Auto-listen · Sem botão · Avatar 3D animado · Resposta em áudio
   ═══════════════════════════════════════════════════════════════════ */

import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router";
import {
  ChevronLeft, X, Volume2, VolumeX,
  ShoppingBag, UtensilsCrossed, Plane, Users,
  Briefcase, Star, Stethoscope, Globe,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────────
   Animações CSS
───────────────────────────────────────────────────────────────── */
const ANIM = `
  /* Avatar flutua suavemente */
  @keyframes bt-float {
    0%,100% { transform: perspective(600px) rotateY(-4deg) rotateX(1deg) translateY(0); }
    50%      { transform: perspective(600px) rotateY(4deg)  rotateX(-1deg) translateY(-10px); }
  }
  /* Anel que pulsa ao falar */
  @keyframes bt-ring {
    0%,100% { transform: scale(1);    opacity: 0.9; }
    50%      { transform: scale(1.07); opacity: 1;   }
  }
  /* Ripple de escuta */
  @keyframes bt-ripple {
    0%   { transform: scale(1);   opacity: 0.6; }
    100% { transform: scale(2.2); opacity: 0;   }
  }
  @keyframes bt-ripple2 {
    0%   { transform: scale(1);   opacity: 0.4; }
    100% { transform: scale(2.9); opacity: 0;   }
  }
  /* Barras de voz (user) */
  @keyframes bt-wave {
    0%,100% { height: 4px;  }
    50%      { height: 22px; }
  }
  /* Barras de fala do Batila */
  @keyframes bt-speak {
    0%,100% { height: 6px;  }
    50%      { height: 32px; }
  }
  /* Blink olhos */
  @keyframes bt-blink {
    0%,90%,100% { transform: scaleY(1); }
    95%          { transform: scaleY(0.05); }
  }
  /* Entrada de texto */
  @keyframes bt-in {
    from { opacity:0; transform:translateY(8px); }
    to   { opacity:1; transform:translateY(0); }
  }
  /* Ponto a pulsar */
  @keyframes bt-dot {
    0%,100% { opacity:1; }
    50%      { opacity:0.15; }
  }
  /* Spinner */
  @keyframes bt-spin { to { transform: rotate(360deg); } }

  .bt-float   { animation: bt-float  5s ease-in-out infinite; }
  .bt-ring    { animation: bt-ring   1.4s ease-in-out infinite; }
  .bt-ripple1 { animation: bt-ripple  2s ease-out infinite; }
  .bt-ripple2 { animation: bt-ripple2 2s ease-out 0.7s infinite; }
  .bt-wave    { animation: bt-wave   0.6s ease-in-out infinite; height:4px; }
  .bt-speak   { animation: bt-speak  0.45s ease-in-out infinite; height:6px; }
  .bt-in      { animation: bt-in     0.35s ease forwards; }
  .bt-dot     { animation: bt-dot    1.8s ease-in-out infinite; }
  .bt-spin    { animation: bt-spin   0.8s linear infinite; }
  .bt-blink   { animation: bt-blink  4s ease-in-out infinite; }
`;

/* ─────────────────────────────────────────────────────────────────
   Config
───────────────────────────────────────────────────────────────── */
const BACKEND  = import.meta.env.VITE_API_URL || "https://ngadalearn-api.onrender.com";
const API_STT  = `${BACKEND}/api/transcribe`;
const API_TTS  = (v: string) => `${BACKEND}/api/speak?voice=${v}`;
const API_CHAT = `${BACKEND}/api/conversation`;

/* Avatar cartoon animado do Batila — DiceBear Avataaars */
const BATILA_PHOTO =
  "https://api.dicebear.com/9.x/avataaars/png?seed=BatilaEnglishTutor&size=400&backgroundColor=b6e3f4&skinColor=ae5d29&top=shortHairDreads01&accessories=prescription01&clotheType=blazerShirt&clotheColor=3c4f5c&eyeType=happy&eyebrowType=raisedExcited&mouthType=smile";

/* Voz masculina Deepgram Aura — Orion (americano) */
const VOICES = {
  beginner:     "aura-orion-en",
  intermediate: "aura-orion-en",
  advanced:     "aura-orion-en",
};

const TOPICS = [
  { id: "smalltalk",  label: "Apresentações", icon: Users,            color: "#7c3aed" },
  { id: "shopping",   label: "Compras",        icon: ShoppingBag,     color: "#2563eb" },
  { id: "restaurant", label: "Restaurante",    icon: UtensilsCrossed, color: "#ea580c" },
  { id: "travel",     label: "Viagens",         icon: Plane,           color: "#0891b2" },
  { id: "interview",  label: "Entrevista",      icon: Briefcase,       color: "#4338ca" },
  { id: "health",     label: "Saúde",           icon: Stethoscope,     color: "#16a34a" },
  { id: "business",   label: "Negócios",        icon: Globe,           color: "#475569" },
  { id: "culture",    label: "Cultura Pop",     icon: Star,            color: "#db2777" },
] as const;
type TopicId = typeof TOPICS[number]["id"];

const STARTERS: Record<TopicId, string> = {
  smalltalk:  "Hey! I'm Batila, your English conversation partner. Great to meet you! So, how's your day going so far?",
  shopping:   "Welcome to the store! I'm Batila, here to help. What can I assist you with today?",
  restaurant: "Good evening! I'm Batila, your server tonight. Our specials are amazing today — shall I tell you about them?",
  travel:     "Hello and welcome! I'm Batila at the front desk. How can I make your stay perfect today?",
  interview:  "Good morning! I'm Batila, the hiring manager. Thank you so much for coming in. Please, tell me about yourself.",
  health:     "Hello, I'm Dr. Batila. Please have a seat and tell me — how are you feeling today?",
  business:   "Good morning, everyone! I'm Batila, leading today's meeting. Let's get started — can you give us an update?",
  culture:    "Hey there! I'm Batila. I'm a huge film and music fan. What kind of stuff are you into?",
};

const FALLBACKS: Record<string, string[]> = {
  smalltalk:  ["That sounds really interesting! Tell me more — what do you enjoy doing at weekends?","Nice! And where are you from? Have you ever been to an English-speaking country?","Awesome! What's your biggest goal with learning English?"],
  shopping:   ["Great choice! What size do you need — small, medium, or large?","We have it in blue, green and black. Which colour do you prefer?","Of course! The fitting rooms are just down the hall on your right."],
  restaurant: ["Excellent! And what would you like to drink with that?","Our chef's special today is pan-seared salmon — it's absolutely delicious!","Of course! Would you also like to hear about our desserts?"],
  travel:     ["Perfect, your room is all ready on the fifth floor. Would you like a wake-up call?","The city centre is about ten minutes by taxi. Shall I call one for you?","Check-out is at eleven in the morning. Is there anything else I can help with?"],
  interview:  ["Impressive background! Can you tell me about a specific challenge you've overcome?","Interesting! Where do you see yourself professionally in the next five years?","Great answer! What would you say is your single biggest professional achievement?"],
  health:     ["I see. How long have you been feeling this way? Does anything make it worse?","Are you allergic to any medications? Have you taken anything for this already?","I'll prescribe something for you. Take one tablet twice daily with food, okay?"],
  business:   ["Excellent update! Are there any blockers the team should know about?","Good point — how do you suggest we tackle this before the deadline?","Perfect. Can you action that and send the team a follow-up email today?"],
  culture:    ["Oh amazing taste! What's your all-time favourite movie? I'd love to know!","Great picks! Have you seen anything good on streaming lately?","I totally agree! Do you watch things in English? It's one of the best ways to learn!"],
};

/* ─────────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────────── */
function quickTip(text: string): string | null {
  const t = text.toLowerCase();
  if (/\bhe have\b/.test(t))              return '💡  "he has" — not "he have"';
  if (/\bi is\b/.test(t))                 return '💡  "I am" — not "I is"';
  if (/\bdon\'?t has\b/.test(t))          return '💡  "don\'t have" — not "don\'t has"';
  if (/\byesterday i (go|come|eat)\b/.test(t)) return '💡  Use past tense: "I went", "I came", "I ate"';
  if (text.trim().split(/\s+/).length < 3) return "💡  Try a full sentence — for example: 'I would like to...'";
  return null;
}

async function getBatilaReply(
  user: string, topicId: TopicId, history: string, difficulty: string
): Promise<string> {
  try {
    const r = await fetch(API_CHAT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userMessage: user,
        topic: topicId,
        history,
        difficulty,
        systemPrompt: `You are Batila, a warm, friendly and encouraging English conversation tutor.
Your student is a Portuguese speaker learning English.
Topic: ${topicId}. Level: ${difficulty}.
Rules:
- Keep replies SHORT and natural — maximum 2-3 sentences.
- Always end with a question to keep the conversation going.
- If the student makes a grammar mistake, correct it gently and continue naturally.
- Sound like a real person — not a robot. Use casual, friendly language.
- Never say you are an AI. You are Batila, a real tutor.`,
      }),
    });
    if (r.ok) { const d = await r.json(); if (d.response?.trim()) return d.response.trim(); }
  } catch { /* use fallback */ }
  const arr = FALLBACKS[topicId] ?? FALLBACKS.smalltalk;
  return arr[Math.floor(Math.random() * arr.length)];
}

type Phase = "idle" | "listening" | "thinking" | "speaking";

/* ═══════════════════════════════════════════════════════════════════
   COMPONENTE
═══════════════════════════════════════════════════════════════════ */
export function ConversationPractice() {
  const [screen,     setScreen]     = useState<"select" | "live">("select");
  const [topicId,    setTopicId]    = useState<TopicId>("smalltalk");
  const [difficulty, setDifficulty] = useState("beginner");
  const [phase,      setPhase]      = useState<Phase>("idle");
  const [batilaText, setBatilaText] = useState("");
  const [userText,   setUserText]   = useState("");
  const [liveText,   setLiveText]   = useState("");
  const [tip,        setTip]        = useState<string | null>(null);
  const [muted,      setMuted]      = useState(false);
  const [history,    setHistory]    = useState("");
  const [error,      setError]      = useState("");

  /* Refs */
  const recognRef    = useRef<any>(null);
  const audioRef     = useRef<HTMLAudioElement | null>(null);
  const silenceRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phaseRef     = useRef<Phase>("idle");
  const liveRef      = useRef("");
  const listeningRef = useRef(false);

  phaseRef.current = phase;
  liveRef.current  = liveText;

  const topic = TOPICS.find(t => t.id === topicId)!;

  /* Cleanup */
  useEffect(() => () => {
    clearSilence();
    stopRecog();
    audioRef.current?.pause();
    window.speechSynthesis?.cancel();
  }, []);

  function clearSilence() {
    if (silenceRef.current) { clearTimeout(silenceRef.current); silenceRef.current = null; }
  }
  function stopRecog() {
    listeningRef.current = false;
    try { recognRef.current?.stop(); } catch (_) {}
    recognRef.current = null;
  }

  /* ── TTS — Batila fala ──────────────────────────────────────── */
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
      /* Tenta Deepgram TTS via backend */
      try {
        const r = await fetch(API_TTS(VOICES[difficulty as keyof typeof VOICES]), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        if (!r.ok) throw new Error();
        const blob = await r.blob();
        const url  = URL.createObjectURL(blob);
        const a    = new Audio(url);
        audioRef.current = a;
        a.onended = () => { URL.revokeObjectURL(url); afterSpeak(); };
        a.onerror = () => afterSpeak();
        await a.play();
        return;
      } catch { /* fallback */ }

      /* Fallback: Web Speech API */
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const u   = new SpeechSynthesisUtterance(text);
        u.lang    = "en-US";
        u.rate    = difficulty === "beginner" ? 0.88 : 0.95;
        u.pitch   = 0.95;
        const voices = window.speechSynthesis.getVoices();
        /* Preferir voz masculina inglesa */
        const pref   = voices.find(v => v.lang === "en-US" && /daniel|david|james|oliver|google uk english male|microsoft david/i.test(v.name))
                    || voices.find(v => v.lang === "en-GB" && /daniel|oliver/i.test(v.name))
                    || voices.find(v => v.lang.startsWith("en-US"))
                    || voices.find(v => v.lang.startsWith("en"));
        if (pref) u.voice = pref;
        u.onend = afterSpeak;
        window.speechSynthesis.speak(u);
        return;
      }
    }
    /* Muted ou sem TTS: apenas mostrar texto */
    const wait = Math.min(text.length * 50, 5000);
    setTimeout(afterSpeak, wait);
  }, [difficulty, muted]);

  /* ── Iniciar escuta contínua ────────────────────────────────── */
  const startListening = useCallback(() => {
    if (listeningRef.current) return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setError("Este browser não suporta reconhecimento de voz. Usa o Chrome."); return; }

    const rec = new SR();
    rec.lang            = "en-US";
    rec.continuous      = true;
    rec.interimResults  = true;
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      listeningRef.current = true;
      if (phaseRef.current !== "speaking") setPhase("listening");
    };

    rec.onresult = (e: any) => {
      if (phaseRef.current === "thinking" || phaseRef.current === "speaking") return;
      clearSilence();

      let interim = "";
      let finalText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalText += e.results[i][0].transcript + " ";
        else interim += e.results[i][0].transcript;
      }
      const combined = (finalText + interim).trim();
      if (combined) setLiveText(combined);

      /* Silêncio de 1.3s após fala → enviar */
      if (finalText.trim()) {
        silenceRef.current = setTimeout(() => {
          const captured = liveRef.current.trim();
          if (captured && phaseRef.current === "listening") {
            handleUserSpeech(captured);
          }
        }, 1300);
      }
    };

    rec.onspeechend = () => {
      if (phaseRef.current !== "listening") return;
      clearSilence();
      silenceRef.current = setTimeout(() => {
        const captured = liveRef.current.trim();
        if (captured) handleUserSpeech(captured);
      }, 800);
    };

    rec.onerror = (e: any) => {
      if (e.error === "no-speech") { if (phaseRef.current === "listening") rec.start(); return; }
      if (e.error === "not-allowed") { setError("Microfone bloqueado. Permite o acesso e recarrega."); return; }
      /* restart em outros erros */
      setTimeout(() => { if (phaseRef.current === "listening") startListening(); }, 500);
    };

    rec.onend = () => {
      listeningRef.current = false;
      /* Reiniciar automaticamente se ainda em modo listening */
      if (phaseRef.current === "listening") {
        setTimeout(() => startListening(), 300);
      }
    };

    recognRef.current = rec;
    rec.start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Processar o que o utilizador disse ─────────────────────── */
  const handleUserSpeech = useCallback(async (text: string) => {
    clearSilence();
    stopRecog();
    setLiveText("");
    setUserText(text);
    setTip(quickTip(text));
    setPhase("thinking");

    const newHistory = history + `Student: ${text}\n`;
    const reply = await getBatilaReply(text, topicId, newHistory, difficulty);
    setHistory(newHistory + `Batila: ${reply}\n`);
    await batilaSpeak(reply);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, topicId, difficulty, batilaSpeak]);

  /* ── Iniciar sessão ─────────────────────────────────────────── */
  async function startSession() {
    setScreen("live");
    setPhase("idle");
    setBatilaText("");
    setUserText("");
    setLiveText("");
    setHistory("");
    setTip(null);
    setError("");
    const starter = STARTERS[topicId];
    setHistory(`Batila: ${starter}\n`);
    await batilaSpeak(starter);
  }

  /* ─────────────────────────────────────────────────────────────
     ECRÃ DE SELEÇÃO
  ───────────────────────────────────────────────────────────── */
  if (screen === "select") return (
    <div style={{ minHeight: "100dvh", background: "#0a0a14", color: "#f0f0f5", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <style>{ANIM}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "max(16px,env(safe-area-inset-top)) 16px 12px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <Link to="/lessons" style={{ minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.4)", borderRadius: 12, textDecoration: "none" }}>
          <ChevronLeft size={22} />
        </Link>
        <div>
          <p style={{ fontWeight: 800, fontSize: 16, margin: 0, lineHeight: 1.2 }}>Conversa com Batila</p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", margin: "3px 0 0", lineHeight: 1 }}>Tutor de inglês · IA ao vivo</p>
        </div>
      </div>

      <div style={{ maxWidth: 460, margin: "0 auto", padding: "24px 16px 40px", overflowY: "auto" }}>

        {/* Avatar card do Batila */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 20px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 24, marginBottom: 28 }}>
          {/* Avatar 3D */}
          <div className="bt-float" style={{ position: "relative", width: 120, height: 120, marginBottom: 16 }}>
            {/* Anel decorativo */}
            <div style={{ position: "absolute", inset: -6, borderRadius: "50%", border: "2px solid rgba(124,58,237,0.4)" }} />
            {/* Glow */}
            <div style={{ position: "absolute", inset: -16, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)" }} />
            <img
              src={BATILA_PHOTO}
              alt="Batila"
              style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", display: "block", border: "3px solid rgba(124,58,237,0.6)", boxShadow: "0 8px 32px rgba(124,58,237,0.3)" }}
              onError={e => {
                (e.target as HTMLImageElement).src =
                  "https://api.dicebear.com/9.x/avataaars/png?seed=BatilaFallback&size=400&backgroundColor=b6e3f4";
              }}
            />
            {/* Ponto verde */}
            <div className="bt-dot" style={{ position: "absolute", bottom: 6, right: 6, width: 14, height: 14, borderRadius: "50%", background: "#4ade80", border: "2px solid #0a0a14" }} />
          </div>

          <p style={{ fontWeight: 900, fontSize: 22, margin: "0 0 4px", letterSpacing: "-0.3px" }}>Batila</p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", margin: "0 0 4px" }}>Tutor de Inglês Nativo · IA</p>
          <p style={{ fontSize: 12, color: "#4ade80", fontWeight: 600, margin: 0 }}>● Disponível agora</p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 10, textAlign: "center", lineHeight: 1.5 }}>
            Fala normalmente — o Batila ouve-te e responde<br />automaticamente em inglês com áudio real.
          </p>
        </div>

        {/* Tópicos */}
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 10 }}>Escolhe o tópico</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
          {TOPICS.map(t => {
            const active = topicId === t.id;
            return (
              <button key={t.id} onClick={() => setTopicId(t.id)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 18, border: `2px solid ${active ? t.color : "rgba(255,255,255,0.09)"}`, background: active ? `${t.color}20` : "rgba(255,255,255,0.03)", cursor: "pointer", textAlign: "left", transition: "all 0.2s", minHeight: 60, color: "#f0f0f5" }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: `${t.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <t.icon size={18} style={{ color: t.color }} />
                </div>
                <span style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.3 }}>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Nível */}
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 10 }}>Nível de inglês</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {([["beginner","A1–A2","#22c55e"],["intermediate","B1–B2","#eab308"],["advanced","C1–C2","#ef4444"]] as const).map(([id,lbl,col]) => (
            <button key={id} onClick={() => setDifficulty(id)}
              style={{ flex: 1, padding: "12px 6px", borderRadius: 16, border: `2px solid ${difficulty===id ? col : "rgba(255,255,255,0.09)"}`, background: difficulty===id ? `${col}15` : "rgba(255,255,255,0.03)", color: difficulty===id ? col : "rgba(255,255,255,0.4)", fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s" }}>
              {lbl}
            </button>
          ))}
        </div>

        {/* CTA */}
        <button onClick={startSession}
          style={{ width: "100%", padding: "17px", borderRadius: 20, border: "none", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", color: "#fff", fontWeight: 900, fontSize: 17, cursor: "pointer", boxShadow: "0 6px 28px rgba(124,58,237,0.5)", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, minHeight: 58 }}>
          Começar conversa com Batila
        </button>
        <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.2)", marginTop: 10 }}>Permite o microfone quando pedido</p>
      </div>
    </div>
  );

  /* ─────────────────────────────────────────────────────────────
     ECRÃ AO VIVO
  ───────────────────────────────────────────────────────────── */
  const isListening = phase === "listening";
  const isSpeaking  = phase === "speaking";
  const isThinking  = phase === "thinking";
  const topicColor  = topic.color;

  return (
    <div style={{
      minHeight: "100dvh", background: "#0a0a14", color: "#f0f0f5",
      display: "flex", flexDirection: "column", overflow: "hidden",
      fontFamily: "system-ui, -apple-system, sans-serif", userSelect: "none",
    }}>
      <style>{ANIM}</style>

      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "max(14px,env(safe-area-inset-top))", paddingLeft: 16, paddingRight: 16, paddingBottom: 10, flexShrink: 0 }}>
        <button onClick={() => { stopRecog(); clearSilence(); audioRef.current?.pause(); window.speechSynthesis?.cancel(); setScreen("select"); }}
          style={{ minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", borderRadius: 12 }}>
          <X size={20} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <topic.icon size={15} style={{ color: topicColor }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>{topic.label}</span>
        </div>

        <button onClick={() => { setMuted(m => !m); audioRef.current?.pause(); window.speechSynthesis?.cancel(); }}
          style={{ minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", color: muted ? "#f87171" : "rgba(255,255,255,0.35)", cursor: "pointer", borderRadius: 12 }}>
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

      {/* Centro */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 20px", gap: 24, minHeight: 0 }}>

        {/* Avatar 3D do Batila */}
        <div style={{ position: "relative", width: 220, height: 220, flexShrink: 0 }}>

          {/* Ripples ao ouvir */}
          {isListening && <>
            <div className="bt-ripple1" style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `${topicColor}35` }} />
            <div className="bt-ripple2" style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `${topicColor}20` }} />
          </>}

          {/* Anel exterior pulsante ao falar */}
          <div className={isSpeaking ? "bt-ring" : ""} style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2.5px solid ${(isListening || isSpeaking) ? topicColor : "rgba(255,255,255,0.1)"}`, transition: "border-color 0.4s ease" }} />

          {/* Contentor 3D da foto */}
          <div className={isSpeaking || isListening ? "" : "bt-float"} style={{ position: "absolute", inset: 18, zIndex: 10, perspective: "600px" }}>
            <div style={{
              width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden",
              border: `3px solid ${isSpeaking ? topicColor : "rgba(255,255,255,0.12)"}`,
              boxShadow: isSpeaking ? `0 0 0 4px ${topicColor}30, 0 0 60px ${topicColor}50, 0 10px 40px rgba(0,0,0,0.6)` : "0 10px 40px rgba(0,0,0,0.5)",
              transform: isSpeaking ? "perspective(600px) rotateY(0deg) scale(1.04)" : isListening ? "perspective(600px) rotateY(-2deg) rotateX(1deg)" : "perspective(600px) rotateY(-4deg) rotateX(1deg)",
              transition: "all 0.5s ease",
            }}>
              {/* Foto */}
              <img
                src={BATILA_PHOTO}
                alt="Batila"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                onError={e => { (e.target as HTMLImageElement).src = "https://api.dicebear.com/9.x/avataaars/png?seed=BatilaFallback&size=400&backgroundColor=b6e3f4"; }}
              />

              {/* Overlay quando a falar — barras de áudio */}
              {isSpeaking && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "0 0 18px", gap: 4, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)" }}>
                  {[0,1,2,3,4,5,6].map(i => (
                    <div key={i} className="bt-speak" style={{ width: 5, background: "#fff", borderRadius: 99, animationDelay: `${i*60}ms` }} />
                  ))}
                </div>
              )}

              {/* Thinking spinner */}
              {isThinking && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.45)" }}>
                  <div className="bt-spin" style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.15)", borderTopColor: topicColor }} />
                </div>
              )}
            </div>
          </div>

          {/* Badge de estado */}
          <div style={{
            position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)",
            padding: "5px 16px", borderRadius: 99,
            background: isListening ? "rgba(239,68,68,0.9)" : isSpeaking ? topicColor : isThinking ? "rgba(245,158,11,0.9)" : "rgba(255,255,255,0.1)",
            fontSize: 12, fontWeight: 700, color: "#fff", whiteSpace: "nowrap",
            transition: "background 0.3s ease", zIndex: 20,
            boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
          }}>
            {isListening ? "⏺ A ouvir-te..." : isSpeaking ? "Batila está a falar" : isThinking ? "A pensar..." : "Batila"}
          </div>
        </div>

        {/* O que Batila disse */}
        {batilaText && (
          <div className="bt-in" key={batilaText.slice(0,25)} style={{ maxWidth: 360, textAlign: "center" }}>
            <p style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.6, color: "rgba(255,255,255,0.88)", fontStyle: "italic", margin: 0 }}>
              "{batilaText}"
            </p>
          </div>
        )}

        {/* O que o utilizador está a dizer / disse */}
        {(liveText || userText) && (
          <div className="bt-in" key={(liveText||userText).slice(0,20)} style={{ maxWidth: 360, width: "100%" }}>
            <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, padding: "12px 18px", textAlign: "center" }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", margin: "0 0 6px" }}>Tu</p>
              <p style={{ fontSize: 15, color: liveText ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.88)", lineHeight: 1.5, margin: 0, fontStyle: liveText ? "italic" : "normal" }}>
                {liveText || userText}
              </p>
            </div>
          </div>
        )}

        {/* Dica de gramática */}
        {tip && !liveText && (
          <div className="bt-in" key={tip} style={{ maxWidth: 360, width: "100%", background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: 14, padding: "10px 18px", textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "#fbbf24", margin: 0, lineHeight: 1.5 }}>{tip}</p>
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className="bt-in" style={{ maxWidth: 360, width: "100%", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 14, padding: "10px 18px", textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "#f87171", margin: 0, lineHeight: 1.5 }}>{error}</p>
          </div>
        )}
      </div>

      {/* Rodapé — indicador do utilizador */}
      <div style={{
        flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
        paddingBottom: "max(32px,env(safe-area-inset-bottom))", paddingTop: 12,
      }}>
        {/* Waveform do utilizador quando fala */}
        {isListening && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, height: 28, marginBottom: 4 }}>
            {[0,1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="bt-wave" style={{ width: 4, background: liveText ? "#f87171" : "rgba(255,255,255,0.25)", borderRadius: 99, animationDelay: `${i*70}ms` }} />
            ))}
          </div>
        )}

        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.22)", margin: 0, textAlign: "center", lineHeight: 1.5 }}>
          {isListening
            ? liveText
              ? "Detectei a tua voz — fala!"
              : "A ouvir... fala em inglês"
            : isSpeaking
            ? "Aguarda o Batila terminar"
            : isThinking
            ? "Batila está a preparar a resposta..."
            : "A iniciar..."}
        </p>
      </div>
    </div>
  );
}
