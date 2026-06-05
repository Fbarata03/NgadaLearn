/* ═══════════════════════════════════════════════════════════════════
   NgadaLearn — Prática de Conversação ao Vivo
   Interface estilo Gemini Live · Deepgram STT + TTS
   ═══════════════════════════════════════════════════════════════════ */

import { useState, useRef, useCallback } from "react";
import { Link } from "react-router";
import {
  Mic, MicOff, Volume2, VolumeX, X,
  ChevronLeft, ShoppingBag, UtensilsCrossed, Plane,
  Users, Briefcase, Star, Stethoscope, Globe,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────────
   CSS injectado — animações que não existem em Tailwind
───────────────────────────────────────────────────────────────── */
const ANIM = `
  /* Ripple expandido ao falar / ouvir */
  @keyframes lv-ripple {
    0%   { transform: scale(1);   opacity: 0.55; }
    100% { transform: scale(2.4); opacity: 0; }
  }
  @keyframes lv-ripple2 {
    0%   { transform: scale(1);   opacity: 0.35; }
    100% { transform: scale(3.0); opacity: 0; }
  }
  /* Anel que pulsa suavemente */
  @keyframes lv-pulse {
    0%, 100% { transform: scale(1);    opacity: 0.8; }
    50%       { transform: scale(1.06); opacity: 1;   }
  }
  /* Barras de waveform */
  @keyframes lv-wave {
    0%, 100% { height: 5px;  }
    50%       { height: 26px; }
  }
  /* Entrada de texto suave */
  @keyframes lv-fade-up {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  /* Ponto a piscar no estado idle */
  @keyframes lv-blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.2; }
  }

  .lv-ripple-1 { animation: lv-ripple  2s ease-out infinite; }
  .lv-ripple-2 { animation: lv-ripple2 2s ease-out 0.6s infinite; }
  .lv-pulse    { animation: lv-pulse   1.6s ease-in-out infinite; }
  .lv-wave     { animation: lv-wave    0.55s ease-in-out infinite; height: 5px; }
  .lv-fade-up  { animation: lv-fade-up 0.35s ease forwards; }
  .lv-blink    { animation: lv-blink   2s ease-in-out infinite; }
`;

/* ─────────────────────────────────────────────────────────────────
   Constantes
───────────────────────────────────────────────────────────────── */
const BACKEND  = import.meta.env.VITE_API_URL || "https://ngadalearn-api.onrender.com";
const API_STT  = `${BACKEND}/api/transcribe`;
const API_TTS  = (v: string) => `${BACKEND}/api/speak?voice=${v}`;
const API_CHAT = `${BACKEND}/api/conversation`;

const TUTOR_PHOTO =
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=85";

const TOPICS = [
  { id: "smalltalk",  label: "Apresentações", icon: Users,           color: "#7c3aed", starter: "Hi! I'm Alex, your English tutor. Let's chat — how are you doing today?" },
  { id: "shopping",   label: "Compras",        icon: ShoppingBag,    color: "#2563eb", starter: "Welcome to the store! I'm the shop assistant. What are you looking for today?" },
  { id: "restaurant", label: "Restaurante",    icon: UtensilsCrossed,color: "#ea580c", starter: "Good evening and welcome! Are you ready to order, or do you need a few more minutes?" },
  { id: "travel",     label: "Viagens",         icon: Plane,          color: "#0891b2", starter: "Hello and welcome to The Grand Hotel! I'm at the front desk. How can I help you today?" },
  { id: "interview",  label: "Entrevista",      icon: Briefcase,      color: "#4338ca", starter: "Good morning! Thank you for coming in. Please, tell me about yourself and your experience." },
  { id: "health",     label: "Saúde",           icon: Stethoscope,    color: "#16a34a", starter: "Good morning, I'm Dr. Alex. Please, take a seat. What seems to be the problem today?" },
  { id: "business",   label: "Negócios",        icon: Globe,          color: "#475569", starter: "Good morning, everyone. Let's begin. Can you give us a quick update on the project?" },
  { id: "culture",    label: "Cultura Pop",     icon: Star,           color: "#db2777", starter: "Hey! So, what kind of movies or music are you into? Let's talk about it!" },
] as const;
type TopicId = typeof TOPICS[number]["id"];

const VOICES: Record<string, string> = {
  beginner: "aura-asteria-en",
  intermediate: "aura-luna-en",
  advanced: "aura-orion-en",
};

const FALLBACKS: Record<string, string[]> = {
  smalltalk:  ["That's great! What do you enjoy doing at weekends?", "Interesting! Have you ever visited an English-speaking country?", "Wonderful! What's your favourite thing about learning English?"],
  shopping:   ["Great choice! What size are you looking for?", "We have it in blue and green — which would you prefer?", "Of course! The fitting rooms are just over there."],
  restaurant: ["Excellent! And what would you like to drink?", "Our special today is grilled salmon — highly recommended!", "Would you like to see the dessert menu as well?"],
  travel:     ["Your room is ready on the fifth floor. Would you like a wake-up call?", "The city centre is about ten minutes by taxi.", "Check-out is at eleven AM. Is there anything else I can help with?"],
  interview:  ["Impressive! Can you give me a specific example of a challenge you overcame?", "Where do you see yourself in five years?", "What would you say is your biggest professional achievement so far?"],
  health:     ["I see. How long have you had this? Does anything make it worse?", "Are you allergic to any medications? Have you taken anything already?", "I'll prescribe something for you — take one tablet twice a day with food."],
  business:   ["Excellent update! Are there any blockers we should know about?", "Good point — how do you propose we resolve this before the deadline?", "Let's action that. Can you send a follow-up email to the team today?"],
  culture:    ["Oh amazing! What's your all-time favourite film?", "Great taste! Have you seen anything good on Netflix lately?", "I love that! Do you prefer watching with subtitles? It's great for English practice!"],
};

/* ─────────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────────── */
function quickFeedback(text: string): string | null {
  const t = text.toLowerCase();
  if (/\bhe have\b/.test(t))          return '💡 Use "he has" — not "he have"';
  if (/\bi is\b/.test(t))             return '💡 Use "I am" — not "I is"';
  if (/\bdon\'?t has\b/.test(t))      return '💡 Use "don\'t have" — not "don\'t has"';
  if (/\byesterday i (go|come)\b/.test(t)) return '💡 Use past tense — "I went", "I came"';
  if (text.trim().split(/\s+/).length < 3) return "💡 Try to answer with a complete sentence!";
  return null;
}

async function getTutorReply(
  user: string, topicId: TopicId, history: string, difficulty: string
): Promise<string> {
  try {
    const r = await fetch(API_CHAT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userMessage: user, topic: topicId, history, difficulty,
        systemPrompt: `You are Alex, a friendly and encouraging English tutor for Portuguese speakers.
Topic: ${topicId}. Level: ${difficulty}.
Rules: keep replies SHORT (2 sentences max). Always end with a question to keep the conversation going.
Correct mistakes gently. Be warm and natural. Never break character.`,
      }),
    });
    if (r.ok) { const d = await r.json(); if (d.response?.trim()) return d.response.trim(); }
  } catch { /* use fallback */ }
  const arr = FALLBACKS[topicId] ?? FALLBACKS.smalltalk;
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ─────────────────────────────────────────────────────────────────
   Tipos internos
───────────────────────────────────────────────────────────────── */
type Phase = "idle" | "listening" | "thinking" | "speaking";

/* ═══════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════════════ */
export function ConversationPractice() {
  /* Estado */
  const [screen,     setScreen]     = useState<"select" | "live">("select");
  const [topicId,    setTopicId]    = useState<TopicId>("smalltalk");
  const [difficulty, setDifficulty] = useState("beginner");
  const [phase,      setPhase]      = useState<Phase>("idle");
  const [tutorText,  setTutorText]  = useState("");
  const [userText,   setUserText]   = useState("");
  const [liveText,   setLiveText]   = useState("");
  const [feedback,   setFeedback]   = useState<string | null>(null);
  const [muted,      setMuted]      = useState(false);
  const [history,    setHistory]    = useState("");
  const [micError,   setMicError]   = useState("");

  /* Refs */
  const mediaRecRef = useRef<MediaRecorder | null>(null);
  const chunksRef   = useRef<Blob[]>([]);
  const streamRef   = useRef<MediaStream | null>(null);
  const audioRef    = useRef<HTMLAudioElement | null>(null);
  const recognRef   = useRef<any>(null);
  const phaseRef    = useRef<Phase>("idle");

  phaseRef.current = phase;

  const topic = TOPICS.find(t => t.id === topicId)!;

  function stopStream() {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  }
  function stopRecog() {
    try { recognRef.current?.stop(); } catch (_) {}
    recognRef.current = null;
  }

  /* ── TTS ────────────────────────────────────────────────────── */
  const speak = useCallback(async (text: string) => {
    audioRef.current?.pause();
    setPhase("speaking");
    setTutorText(text);

    if (!muted) {
      try {
        const r = await fetch(API_TTS(VOICES[difficulty]), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        if (!r.ok) throw new Error("tts_error");
        const blob = await r.blob();
        const url  = URL.createObjectURL(blob);
        const a    = new Audio(url);
        audioRef.current = a;
        a.onended = () => { setPhase("idle"); URL.revokeObjectURL(url); };
        a.onerror = () => setPhase("idle");
        await a.play();
        return;
      } catch { /* fallback abaixo */ }

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const u   = new SpeechSynthesisUtterance(text);
        u.lang    = "en-US";
        u.rate    = difficulty === "beginner" ? 0.85 : 1;
        const voices = window.speechSynthesis.getVoices();
        const pref   = voices.find(v => v.lang.startsWith("en-US") && v.name.includes("Google"))
                    || voices.find(v => v.lang.startsWith("en"));
        if (pref) u.voice = pref;
        u.onend = () => setPhase("idle");
        window.speechSynthesis.speak(u);
        return;
      }
    }
    /* Modo muted — só mostra texto */
    setTimeout(() => setPhase("idle"), Math.min(text.length * 55, 5000));
  }, [difficulty, muted]);

  /* ── Iniciar sessão ─────────────────────────────────────────── */
  async function startSession() {
    stopStream();
    setScreen("live");
    setPhase("idle");
    setTutorText("");
    setUserText("");
    setLiveText("");
    setHistory("");
    setFeedback(null);
    setMicError("");
    await speak(topic.starter);
    setHistory(`Tutor: ${topic.starter}\n`);
  }

  /* ── Gravar áudio ───────────────────────────────────────────── */
  async function startListen() {
    /* Se o Alex está a falar, interromper */
    if (phaseRef.current === "speaking") {
      audioRef.current?.pause();
      window.speechSynthesis?.cancel();
    }
    if (phaseRef.current === "thinking") return;

    setMicError("");
    setLiveText("");
    setFeedback(null);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      /* Preview em tempo real com Web Speech API */
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SR) {
        const rec = new SR();
        rec.lang = "en-US";
        rec.continuous = true;
        rec.interimResults = true;
        rec.onresult = (e: any) => {
          const t = Array.from(e.results as any[]).map((r: any) => r[0].transcript).join(" ");
          setLiveText(t);
        };
        rec.start();
        recognRef.current = rec;
      }

      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const mr = new MediaRecorder(stream, { mimeType: mime });
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.start(200);
      mediaRecRef.current = mr;
      setPhase("listening");
    } catch {
      setMicError("Microfone bloqueado. Permite o acesso no browser e tenta novamente.");
    }
  }

  async function stopListen() {
    if (phaseRef.current !== "listening") return;
    stopRecog();

    const mr = mediaRecRef.current;
    if (!mr) return;
    await new Promise<void>(res => { mr.onstop = () => res(); mr.stop(); });
    stopStream();

    const captured = liveText.trim();
    setLiveText("");
    setPhase("thinking");

    /* Tentar Deepgram STT via backend */
    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
    let finalText = captured;

    if (blob.size > 1500) {
      try {
        const r = await fetch(API_STT, {
          method: "POST",
          headers: { "Content-Type": "audio/webm" },
          body: blob,
        });
        if (r.ok) {
          const d = await r.json();
          if (d.transcript?.trim()) finalText = d.transcript.trim();
        }
      } catch { /* usar Web Speech */ }
    }

    if (!finalText) {
      setPhase("idle");
      setMicError("Não ouvi nada. Fala mais perto do microfone e tenta de novo.");
      return;
    }

    setUserText(finalText);
    const tip = quickFeedback(finalText);
    setFeedback(tip);

    const newHistory = history + `Student: ${finalText}\n`;
    const reply = await getTutorReply(finalText, topicId, newHistory, difficulty);
    setHistory(newHistory + `Tutor: ${reply}\n`);
    await speak(reply);
  }

  /* ═══════════════════════════════════════════════════════
     ECRÃ DE SELEÇÃO
  ═══════════════════════════════════════════════════════ */
  if (screen === "select") return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#0d0d1a", color: "#f1f1f3" }}
    >
      <style>{ANIM}</style>

      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 border-b"
        style={{
          paddingTop: "max(16px, env(safe-area-inset-top))",
          paddingBottom: 12,
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >
        <Link
          to="/lessons"
          className="flex items-center justify-center rounded-xl transition-colors"
          style={{ minWidth: 44, minHeight: 44, color: "rgba(255,255,255,0.45)" }}
        >
          <ChevronLeft size={20} />
        </Link>
        <div>
          <p style={{ fontWeight: 900, fontSize: 16, lineHeight: 1.2 }}>Conversação ao Vivo</p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
            Fala inglês com o tutor IA Alex
          </p>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto mx-auto w-full"
        style={{ maxWidth: 480, padding: "24px 16px 32px" }}
      >
        {/* Card do tutor */}
        <div
          className="flex items-center gap-4 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "16px 20px",
            marginBottom: 28,
          }}
        >
          <img
            src={TUTOR_PHOTO}
            alt="Alex — Tutora de Inglês"
            style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover",
                     border: "2px solid #7c3aed", flexShrink: 0 }}
            onError={e => {
              (e.target as HTMLImageElement).src =
                "https://ui-avatars.com/api/?name=Alex&background=7c3aed&color=fff&size=128";
            }}
          />
          <div>
            <p style={{ fontWeight: 900, fontSize: 18, marginBottom: 2 }}>Alex</p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 6 }}>
              Tutora de Inglês · IA Deepgram
            </p>
            <div className="flex items-center gap-1.5">
              <span
                className="lv-blink"
                style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", display: "inline-block" }}
              />
              <span style={{ fontSize: 12, color: "#4ade80", fontWeight: 600 }}>Disponível agora</span>
            </div>
          </div>
        </div>

        {/* Tópicos */}
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
                    color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: 12 }}>
          Escolhe o tópico
        </p>
        <div
          className="grid grid-cols-2 gap-3"
          style={{ marginBottom: 24 }}
        >
          {TOPICS.map(t => {
            const active = topicId === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTopicId(t.id)}
                className="flex items-center gap-3 rounded-2xl text-left transition-all"
                style={{
                  padding: "14px 16px",
                  border: `2px solid ${active ? t.color : "rgba(255,255,255,0.1)"}`,
                  background: active ? `${t.color}22` : "rgba(255,255,255,0.04)",
                  minHeight: 62,
                }}
              >
                <div
                  className="flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{ width: 38, height: 38, background: `${t.color}30` }}
                >
                  <t.icon size={18} style={{ color: t.color }} />
                </div>
                <span style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.3 }}>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Nível */}
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
                    color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: 12 }}>
          Nível de inglês
        </p>
        <div className="flex gap-2" style={{ marginBottom: 32 }}>
          {([ ["beginner","A1–A2","#22c55e"], ["intermediate","B1–B2","#eab308"], ["advanced","C1–C2","#ef4444"] ] as const).map(([id,lbl,col]) => (
            <button
              key={id}
              onClick={() => setDifficulty(id)}
              className="flex-1 rounded-2xl transition-all"
              style={{
                padding: "12px 8px",
                border: `2px solid ${difficulty === id ? col : "rgba(255,255,255,0.1)"}`,
                background: difficulty === id ? `${col}18` : "rgba(255,255,255,0.04)",
                color: difficulty === id ? col : "rgba(255,255,255,0.45)",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              {lbl}
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={startSession}
          className="w-full flex items-center justify-center gap-3 rounded-2xl transition-all"
          style={{
            padding: "16px",
            background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
            fontWeight: 900,
            fontSize: 16,
            color: "#fff",
            boxShadow: "0 8px 32px rgba(124,58,237,0.45)",
            minHeight: 56,
          }}
        >
          <Mic size={20} />
          Iniciar conversa com Alex
        </button>

        <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.2)", marginTop: 12 }}>
          Microfone necessário · Push-to-talk
        </p>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════════════
     ECRÃ AO VIVO — Gemini Live style
  ═══════════════════════════════════════════════════════ */
  const isActive   = phase === "listening" || phase === "speaking";
  const topicColor = topic.color;

  return (
    <div
      className="flex flex-col"
      style={{
        minHeight: "100dvh",
        background: "#0d0d1a",
        color: "#f1f1f3",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      <style>{ANIM}</style>

      {/* ── Top bar ────────────────────────────────────── */}
      <div
        className="flex items-center justify-between flex-shrink-0"
        style={{
          paddingTop: "max(14px, env(safe-area-inset-top))",
          paddingLeft: 16, paddingRight: 16, paddingBottom: 12,
        }}
      >
        <button
          onClick={() => { stopStream(); audioRef.current?.pause(); window.speechSynthesis?.cancel(); setScreen("select"); }}
          className="flex items-center justify-center rounded-xl transition-colors"
          style={{ minWidth: 44, minHeight: 44, color: "rgba(255,255,255,0.4)" }}
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2">
          <span
            className={isActive ? "lv-blink" : ""}
            style={{ width: 8, height: 8, borderRadius: "50%",
                     background: isActive ? topicColor : "rgba(255,255,255,0.2)",
                     display: "inline-block" }}
          />
          <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.65)" }}>
            {topic.label}
          </span>
        </div>

        <button
          onClick={() => { setMuted(m => !m); audioRef.current?.pause(); window.speechSynthesis?.cancel(); }}
          className="flex items-center justify-center rounded-xl transition-colors"
          style={{ minWidth: 44, minHeight: 44, color: muted ? "#f87171" : "rgba(255,255,255,0.4)" }}
        >
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

      {/* ── Centro — avatar ─────────────────────────────── */}
      <div
        className="flex-1 flex flex-col items-center justify-center"
        style={{ padding: "0 24px", gap: 28, minHeight: 0 }}
      >
        {/* Contentor do avatar — overflow hidden para cortar os ripples */}
        <div
          className="relative flex items-center justify-center flex-shrink-0"
          style={{ width: 200, height: 200 }}
        >
          {/* Ripples (só quando activo) */}
          {isActive && (
            <>
              <div
                className="lv-ripple-1 absolute inset-0 rounded-full"
                style={{ background: `${topicColor}40` }}
              />
              <div
                className="lv-ripple-2 absolute inset-0 rounded-full"
                style={{ background: `${topicColor}28` }}
              />
            </>
          )}

          {/* Anel exterior */}
          <div
            className={`absolute inset-0 rounded-full ${isActive ? "lv-pulse" : ""}`}
            style={{
              border: `2px solid ${isActive ? topicColor : "rgba(255,255,255,0.12)"}`,
              transition: "border-color 0.4s ease",
            }}
          />

          {/* Foto da tutora */}
          <div
            className="overflow-hidden relative z-10"
            style={{
              width: 160, height: 160, borderRadius: "50%",
              border: "3px solid rgba(255,255,255,0.12)",
              boxShadow: isActive ? `0 0 40px ${topicColor}55` : "0 8px 32px rgba(0,0,0,0.5)",
              transition: "box-shadow 0.4s ease",
            }}
          >
            <img
              src={TUTOR_PHOTO}
              alt="Alex"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              onError={e => {
                (e.target as HTMLImageElement).src =
                  "https://ui-avatars.com/api/?name=Alex&background=7c3aed&color=fff&size=256";
              }}
            />

            {/* Waveform overlay quando a gravar */}
            {phase === "listening" && (
              <div
                className="absolute inset-0 flex items-center justify-center gap-1"
                style={{ background: "rgba(0,0,0,0.38)" }}
              >
                {[0, 1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className="lv-wave rounded-full"
                    style={{
                      width: 4, background: "#fff", borderRadius: 99,
                      animationDelay: `${i * 90}ms`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Spinner quando a pensar */}
            {phase === "thinking" && (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: "rgba(0,0,0,0.45)" }}
              >
                <div
                  style={{
                    width: 36, height: 36, borderRadius: "50%",
                    border: "3px solid rgba(255,255,255,0.2)",
                    borderTopColor: topicColor,
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}
          </div>

          {/* Badge de estado abaixo do avatar */}
          <div
            className="absolute flex items-center justify-center rounded-full"
            style={{
              bottom: -10, left: "50%", transform: "translateX(-50%)",
              padding: "4px 14px",
              background:
                phase === "listening" ? "#ef4444" :
                phase === "thinking"  ? "#f59e0b" :
                phase === "speaking"  ? topicColor :
                "rgba(255,255,255,0.1)",
              fontSize: 11, fontWeight: 700, color: "#fff",
              whiteSpace: "nowrap",
              transition: "background 0.3s ease",
              zIndex: 20,
            }}
          >
            {phase === "listening" ? "⏺ A gravar"     :
             phase === "thinking"  ? "A pensar..."    :
             phase === "speaking"  ? "A falar..."     :
             "Alex"}
          </div>
        </div>

        {/* Texto do tutor */}
        {tutorText && (
          <div
            className="lv-fade-up text-center"
            style={{ maxWidth: 340 }}
            key={tutorText.slice(0, 20)}
          >
            <p style={{
              fontSize: 16, fontWeight: 500, lineHeight: 1.55,
              color: "rgba(255,255,255,0.88)",
              fontStyle: "italic",
            }}>
              "{tutorText}"
            </p>
          </div>
        )}

        {/* Texto do utilizador */}
        {(userText || liveText) && (
          <div
            className="lv-fade-up w-full"
            style={{ maxWidth: 360 }}
            key={(liveText || userText).slice(0, 20)}
          >
            <div
              className="text-center rounded-2xl"
              style={{
                padding: "12px 20px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
                          color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: 6 }}>
                Tu disseste
              </p>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>
                {liveText || userText}
              </p>
            </div>
          </div>
        )}

        {/* Feedback de gramática */}
        {feedback && (
          <div
            className="lv-fade-up text-center rounded-xl"
            style={{
              maxWidth: 340, width: "100%",
              padding: "10px 18px",
              background: "rgba(251,191,36,0.12)",
              border: "1px solid rgba(251,191,36,0.3)",
            }}
            key={feedback}
          >
            <p style={{ fontSize: 13, color: "#fbbf24", lineHeight: 1.5 }}>{feedback}</p>
          </div>
        )}

        {/* Erro de microfone */}
        {micError && (
          <div
            className="lv-fade-up text-center rounded-xl"
            style={{
              maxWidth: 340, width: "100%",
              padding: "10px 18px",
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.3)",
            }}
            key={micError}
          >
            <p style={{ fontSize: 13, color: "#f87171", lineHeight: 1.5 }}>{micError}</p>
          </div>
        )}
      </div>

      {/* ── Bottom — botão de microfone ──────────────────── */}
      <div
        className="flex-shrink-0 flex flex-col items-center"
        style={{
          paddingBottom: "max(32px, env(safe-area-inset-bottom))",
          paddingTop: 16,
          gap: 10,
        }}
      >
        {/* Dica */}
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", height: 18 }}>
          {phase === "idle"      ? "Mantém pressionado para falar" :
           phase === "listening" ? "Solta para enviar" : ""}
        </p>

        {/* Botão principal */}
        <button
          onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); startListen(); }}
          onPointerUp={stopListen}
          onPointerCancel={stopListen}
          disabled={phase === "thinking"}
          style={{
            width: 80, height: 80, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "none", cursor: phase === "thinking" ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
            background:
              phase === "listening" ? "#ef4444" :
              phase === "thinking"  ? "rgba(255,255,255,0.1)" :
              phase === "speaking"  ? `${topicColor}aa` :
              "rgba(255,255,255,0.12)",
            boxShadow:
              phase === "listening" ? "0 0 0 8px rgba(239,68,68,0.25), 0 4px 20px rgba(239,68,68,0.5)" :
              phase === "speaking"  ? `0 0 0 6px ${topicColor}30` :
              "0 4px 16px rgba(0,0,0,0.4)",
            transform: phase === "listening" ? "scale(1.1)" : "scale(1)",
          }}
          aria-label="Falar"
        >
          {phase === "thinking" ? (
            <div style={{ width: 24, height: 24, borderRadius: "50%",
                          border: "2.5px solid rgba(255,255,255,0.2)",
                          borderTopColor: topicColor,
                          animation: "spin 0.8s linear infinite" }} />
          ) : phase === "listening" ? (
            <MicOff size={30} color="#fff" />
          ) : (
            <Mic size={30} color={phase === "speaking" ? "#fff" : "rgba(255,255,255,0.8)"} />
          )}
        </button>
      </div>
    </div>
  );
}
