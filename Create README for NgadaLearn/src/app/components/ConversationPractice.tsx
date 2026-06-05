/* ═══════════════════════════════════════════════════════════════════
   NgadaLearn — Prática de Conversação ao Vivo
   Interface estilo Gemini Live — foto real, animação, mobile-first
   ═══════════════════════════════════════════════════════════════════ */

import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router";
import {
  Mic, MicOff, Volume2, VolumeX, ChevronLeft, X,
  ShoppingBag, UtensilsCrossed, Plane, Users, Briefcase, Star,
  Stethoscope, Globe,
} from "lucide-react";

/* ── CSS de animação ─────────────────────────────────────────────── */
const ANIM = `
@keyframes ripple {
  0%   { transform: scale(1);   opacity: .6; }
  100% { transform: scale(2.2); opacity: 0;  }
}
@keyframes ripple2 {
  0%   { transform: scale(1);   opacity: .4; }
  100% { transform: scale(2.8); opacity: 0;  }
}
@keyframes pulse-ring {
  0%,100% { transform: scale(1);   opacity: .8; }
  50%      { transform: scale(1.08); opacity: 1;  }
}
@keyframes wave {
  0%,100% { height: 6px;  }
  50%     { height: 28px; }
}
@keyframes fadeUp {
  from { opacity:0; transform:translateY(12px); }
  to   { opacity:1; transform:translateY(0);    }
}
.ripple-1 { animation: ripple  1.8s ease-out infinite; }
.ripple-2 { animation: ripple2 1.8s ease-out .5s infinite; }
.pulse-ring{ animation: pulse-ring 1.4s ease-in-out infinite; }
.wave-bar  { animation: wave 0.6s ease-in-out infinite; }
.fade-up   { animation: fadeUp .4s ease forwards; }
`;

/* ── Config ──────────────────────────────────────────────────────── */
const BACKEND = import.meta.env.VITE_API_URL || "https://ngadalearn-api.onrender.com";
const API_STT  = `${BACKEND}/api/transcribe`;
const API_TTS  = (v: string) => `${BACKEND}/api/speak?voice=${v}`;
const API_CHAT = `${BACKEND}/api/conversation`;

/* ── Foto real do tutor (Unsplash) ───────────────────────────────── */
const TUTOR_PHOTO =
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&h=300&q=80";

/* ── Tópicos ─────────────────────────────────────────────────────── */
const TOPICS = [
  { id: "smalltalk", label: "Apresentações",  icon: Users,         color: "#7c3aed", starter: "Hi! I'm Alex, your English tutor. Let's chat! How are you today?" },
  { id: "shopping",  label: "Compras",         icon: ShoppingBag,  color: "#2563eb", starter: "Welcome! I'm a shop assistant. What are you looking for today?" },
  { id: "restaurant",label: "Restaurante",     icon: UtensilsCrossed,color:"#ea580c",starter: "Good evening! Welcome. Are you ready to order?" },
  { id: "travel",    label: "Viagens",          icon: Plane,        color: "#0891b2", starter: "Hello! I'm the hotel receptionist. How can I help you today?" },
  { id: "interview", label: "Entrevista",       icon: Briefcase,    color: "#4338ca", starter: "Good morning! Please tell me about yourself and your experience." },
  { id: "health",    label: "Saúde",            icon: Stethoscope,  color: "#16a34a", starter: "Good morning, I'm Dr. Alex. What seems to be the problem today?" },
  { id: "business",  label: "Negócios",         icon: Globe,        color: "#475569", starter: "Good morning! Let's start our meeting. Can you give us a project update?" },
  { id: "culture",   label: "Cultura Pop",      icon: Star,         color: "#db2777", starter: "Hey! What kind of movies or music do you enjoy? Let's talk!" },
] as const;
type TopicId = typeof TOPICS[number]["id"];

const VOICES: Record<string, string> = {
  beginner: "aura-asteria-en", intermediate: "aura-luna-en", advanced: "aura-orion-en",
};

/* ── Avaliação simples ───────────────────────────────────────────── */
function quickFeedback(text: string): string | null {
  const t = text.toLowerCase();
  if (/\bhe have\b/.test(t))   return "💡 \"he has\" not \"he have\"";
  if (/\bi is\b/.test(t))      return "💡 \"I am\" not \"I is\"";
  if (/\bdon't has\b/.test(t)) return "💡 \"don't have\" not \"don't has\"";
  if (text.trim().split(" ").length < 3) return "💡 Try to answer with a full sentence!";
  return null;
}

/* ── Fallback de respostas ───────────────────────────────────────── */
const FALLBACKS: Record<string, string[]> = {
  smalltalk:  ["That sounds great! Tell me more — what do you enjoy doing at weekends?", "Interesting! And where are you from? Have you ever visited an English-speaking country?", "Wonderful! What's your favourite thing about learning English?"],
  shopping:   ["Great choice! What size are you looking for?", "We have it in blue and green — which do you prefer?", "Of course! The fitting rooms are just over there. Can I help with anything else?"],
  restaurant: ["Excellent! And what would you like to drink with that?", "Our special today is grilled salmon — highly recommended!", "Absolutely! Would you like any dessert? Our chocolate cake is amazing."],
  travel:     ["Your room is ready on the 5th floor. Would you like a wake-up call?", "The city centre is about 10 minutes by taxi. Shall I call one for you?", "Check-out is at 11 AM. Is there anything else I can help you with?"],
  interview:  ["Impressive! Could you give me a specific example of a challenge you overcame?", "Interesting! Where do you see yourself in five years?", "Great answer! What would you say is your biggest professional achievement so far?"],
  health:     ["I see. How long have you had this? And does anything make it worse?", "Are you allergic to any medications? Have you taken anything for it already?", "I'll prescribe something for you. Take one tablet twice a day with food."],
  business:   ["Excellent update! Any blockers we should be aware of?", "Good point! How do you propose we resolve this before the deadline?", "Let's action that. Can you send a follow-up email to the team today?"],
  culture:    ["Oh amazing! What's your all-time favourite film? I'd love to know!", "Great taste! Have you seen any good series lately on Netflix?", "I love that! Do you prefer watching with subtitles? It's great for English practice!"],
};

async function getTutorReply(user: string, topicId: TopicId, history: string, difficulty: string): Promise<string> {
  try {
    const r = await fetch(API_CHAT, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userMessage: user, topic: topicId, history, difficulty,
        systemPrompt: `You are Alex, a friendly English tutor. Topic: ${topicId}. Keep replies SHORT — max 2 sentences. Always end with a question. Correct gently. Level: ${difficulty}.` }),
    });
    if (r.ok) { const d = await r.json(); if (d.response) return d.response; }
  } catch { /* fallback */ }
  const arr = FALLBACKS[topicId] || FALLBACKS.smalltalk;
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ════════════════════════════════════════════════════════════════════
   COMPONENTE
   ════════════════════════════════════════════════════════════════════ */
export function ConversationPractice() {
  /* ── Estado ── */
  const [screen,      setScreen]      = useState<"select" | "live">("select");
  const [topicId,     setTopicId]     = useState<TopicId>("smalltalk");
  const [difficulty,  setDifficulty]  = useState("beginner");
  const [phase,       setPhase]       = useState<"idle" | "listening" | "thinking" | "speaking">("idle");
  const [tutorText,   setTutorText]   = useState("");
  const [userText,    setUserText]    = useState("");
  const [liveText,    setLiveText]    = useState("");
  const [feedback,    setFeedback]    = useState<string | null>(null);
  const [muted,       setMuted]       = useState(false);
  const [history,     setHistory]     = useState("");
  const [micError,    setMicError]    = useState("");

  const mediaRecRef  = useRef<MediaRecorder | null>(null);
  const chunksRef    = useRef<Blob[]>([]);
  const streamRef    = useRef<MediaStream | null>(null);
  const audioRef     = useRef<HTMLAudioElement | null>(null);
  const recognRef    = useRef<any>(null);

  const topic = TOPICS.find(t => t.id === topicId)!;

  /* cleanup */
  useEffect(() => () => { stopStream(); audioRef.current?.pause(); stopRecog(); }, []);

  function stopStream() { streamRef.current?.getTracks().forEach(t => t.stop()); streamRef.current = null; }
  function stopRecog()  { try { recognRef.current?.stop(); } catch(_) {}  recognRef.current = null; }

  /* ── Falar (TTS) ─────────────────────────────────────────────── */
  const speak = useCallback(async (text: string) => {
    if (muted) return;
    audioRef.current?.pause();
    setPhase("speaking"); setTutorText(text);
    try {
      const r = await fetch(API_TTS(VOICES[difficulty]), {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!r.ok) throw new Error();
      const blob = await r.blob();
      const url  = URL.createObjectURL(blob);
      const a    = new Audio(url);
      audioRef.current = a;
      a.onended = () => { setPhase("idle"); URL.revokeObjectURL(url); };
      a.onerror = () => setPhase("idle");
      a.play();
    } catch {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = "en-US"; u.rate = difficulty === "beginner" ? 0.85 : 1;
        const v = window.speechSynthesis.getVoices().find(x => x.lang === "en-US");
        if (v) u.voice = v;
        u.onend = () => setPhase("idle");
        window.speechSynthesis.speak(u);
      } else { setPhase("idle"); }
    }
  }, [difficulty, muted]);

  /* ── Iniciar sessão ──────────────────────────────────────────── */
  async function startSession() {
    setScreen("live"); setPhase("idle");
    setTutorText(""); setUserText(""); setLiveText(""); setHistory(""); setFeedback(""); setMicError("");
    await speak(topic.starter);
    setHistory(`Tutor: ${topic.starter}\n`);
  }

  /* ── Gravar ──────────────────────────────────────────────────── */
  async function startListen() {
    if (phase === "speaking") { audioRef.current?.pause(); setPhase("idle"); }
    setMicError(""); setLiveText(""); chunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      /* Web Speech preview */
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SR) { const r = new SR(); r.lang="en-US"; r.continuous=true; r.interimResults=true;
        r.onresult = (e:any) => setLiveText(Array.from(e.results).map((x:any)=>x[0].transcript).join(" "));
        r.start(); recognRef.current = r; }
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "audio/webm";
      const mr = new MediaRecorder(stream, { mimeType: mime });
      mr.ondataavailable = e => { if (e.data.size>0) chunksRef.current.push(e.data); };
      mr.start(250);
      mediaRecRef.current = mr;
      setPhase("listening");
    } catch { setMicError("Microfone bloqueado — permite o acesso no browser."); }
  }

  async function stopListen() {
    if (phase !== "listening") return;
    stopRecog();
    const mr = mediaRecRef.current;
    if (!mr) return;
    await new Promise<void>(r => { mr.onstop = () => r(); mr.stop(); });
    stopStream();

    const captured = liveText.trim();
    setLiveText(""); setPhase("thinking");

    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
    let finalText = captured;

    if (blob.size > 1500) {
      try {
        const r = await fetch(API_STT, { method:"POST", headers:{"Content-Type":"audio/webm"}, body: blob });
        if (r.ok) { const d = await r.json(); if (d.transcript?.trim()) finalText = d.transcript.trim(); }
      } catch { /* usa Web Speech */ }
    }

    if (!finalText) { setPhase("idle"); setMicError("Não ouvi nada. Tenta de novo!"); return; }

    setUserText(finalText);
    const tip = quickFeedback(finalText);
    setFeedback(tip);
    const newHistory = history + `Student: ${finalText}\n`;
    const reply = await getTutorReply(finalText, topicId, newHistory, difficulty);
    setHistory(newHistory + `Tutor: ${reply}\n`);
    await speak(reply);
  }

  /* ════════════════════════
     ECRÃ DE SELEÇÃO
  ════════════════════════ */
  if (screen === "select") return (
    <div className="min-h-screen bg-[#0d0d1a] text-white flex flex-col">
      <style>{ANIM}</style>

      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-safe pt-4 pb-3 border-b border-white/10">
        <Link to="/lessons" className="min-w-[44px] min-h-[44px] flex items-center justify-center text-white/50 hover:text-white rounded-xl transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-black text-base">Conversação ao Vivo</h1>
          <p className="text-xs text-white/40">Fala inglês com o tutor IA Alex</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-lg mx-auto w-full">

        {/* Tutor card */}
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 mb-8">
          <img
            src={TUTOR_PHOTO}
            alt="Alex — English Tutor"
            className="w-16 h-16 rounded-full object-cover border-2 border-purple-500 flex-shrink-0"
            onError={e => { (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Alex&background=7c3aed&color=fff&size=128"; }}
          />
          <div>
            <p className="font-black text-lg">Alex</p>
            <p className="text-sm text-white/50">Tutor de Inglês IA · Deepgram</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-green-400 font-medium">Disponível agora</span>
            </div>
          </div>
        </div>

        {/* Tópicos */}
        <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Escolhe o tópico</p>
        <div className="grid grid-cols-2 gap-2.5 mb-6">
          {TOPICS.map(t => (
            <button key={t.id} onClick={() => setTopicId(t.id)}
              className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all ${
                topicId === t.id ? "border-purple-500 bg-purple-600/20" : "border-white/10 bg-white/5 hover:border-white/25"
              }`}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: t.color + "33" }}>
                <t.icon className="w-4.5 h-4.5" style={{ color: t.color }} />
              </div>
              <span className="text-sm font-semibold leading-tight">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Nível */}
        <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Nível</p>
        <div className="flex gap-2 mb-8">
          {[["beginner","A1–A2","#22c55e"],["intermediate","B1–B2","#eab308"],["advanced","C1–C2","#ef4444"]].map(([id,lbl,col])=>(
            <button key={id} onClick={()=>setDifficulty(id)}
              className={`flex-1 py-3 rounded-2xl border-2 text-sm font-bold transition-all ${
                difficulty===id ? "border-current bg-current/10" : "border-white/10 bg-white/5 text-white/50"
              }`}
              style={difficulty===id ? { color: col, borderColor: col } : undefined}
            >
              {lbl}
            </button>
          ))}
        </div>

        {/* Botão iniciar */}
        <button onClick={startSession}
          className="w-full py-4 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 rounded-2xl font-black text-lg transition-all shadow-xl shadow-purple-900/50 flex items-center justify-center gap-3"
        >
          <Mic className="w-5 h-5" />
          Iniciar com Alex
        </button>
      </div>
    </div>
  );

  /* ════════════════════════
     ECRÃ LIVE (Gemini style)
  ════════════════════════ */
  return (
    <div className="min-h-[100dvh] bg-[#0d0d1a] text-white flex flex-col select-none overflow-hidden">
      <style>{ANIM}</style>

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-safe pt-3 pb-3 flex-shrink-0">
        <button
          onClick={() => { stopStream(); audioRef.current?.pause(); setScreen("select"); }}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-white/40 hover:text-white rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: topic.color }} />
          <span className="text-sm font-semibold text-white/70">{topic.label}</span>
        </div>

        <button
          onClick={() => { setMuted(!muted); audioRef.current?.pause(); }}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-white/40 hover:text-white rounded-xl transition-colors"
        >
          {muted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Centro — avatar + animações */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">

        {/* Avatar com círculos animados */}
        <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>

          {/* Ripples (só quando fala ou ouve) */}
          {(phase === "speaking" || phase === "listening") && <>
            <div className="absolute inset-0 rounded-full ripple-1" style={{ backgroundColor: topic.color + "33" }} />
            <div className="absolute inset-0 rounded-full ripple-2" style={{ backgroundColor: topic.color + "22" }} />
          </>}

          {/* Anel exterior */}
          <div className={`absolute inset-0 rounded-full border-2 transition-all duration-500 ${
            phase === "speaking"  ? "pulse-ring" :
            phase === "listening" ? "pulse-ring" : ""
          }`}
            style={{ borderColor: phase !== "idle" && phase !== "thinking" ? topic.color : "rgba(255,255,255,0.1)" }}
          />

          {/* Foto */}
          <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl z-10 relative">
            <img
              src={TUTOR_PHOTO}
              alt="Alex"
              className="w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Alex&background=7c3aed&color=fff&size=256"; }}
            />
            {/* Overlay de estado */}
            <div className={`absolute inset-0 transition-all duration-300 flex items-center justify-center ${
              phase === "listening" ? "bg-black/30" : "bg-transparent"
            }`}>
              {phase === "listening" && (
                <div className="flex items-end gap-1">
                  {[1,2,3,4,5].map((_, i) => (
                    <div key={i} className="w-1.5 bg-white rounded-full wave-bar"
                      style={{ animationDelay: `${i * 80}ms`, minHeight: 6 }} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Badge de estado */}
          <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold z-20 whitespace-nowrap transition-all ${
            phase === "speaking"  ? "bg-purple-600 text-white" :
            phase === "listening" ? "bg-red-500 text-white" :
            phase === "thinking"  ? "bg-amber-500 text-black" :
            "bg-white/10 text-white/50"
          }`}>
            {phase === "speaking"  ? "Alex está a falar..." :
             phase === "listening" ? "⏺ A ouvir..." :
             phase === "thinking"  ? "A pensar..." :
             "Alex"}
          </div>
        </div>

        {/* Texto do tutor */}
        {tutorText && (
          <div className="fade-up max-w-sm text-center">
            <p className="text-white/90 text-base leading-relaxed font-medium">
              "{tutorText}"
            </p>
          </div>
        )}

        {/* Texto do utilizador */}
        {(userText || liveText) && (
          <div className="fade-up max-w-sm w-full">
            <div className="bg-white/8 border border-white/10 rounded-2xl px-4 py-3 text-center">
              <p className="text-xs text-white/40 mb-1 uppercase tracking-wide">Tu disseste</p>
              <p className="text-white/80 text-sm leading-relaxed">{liveText || userText}</p>
            </div>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div className="fade-up bg-amber-500/15 border border-amber-500/30 rounded-xl px-4 py-2.5 max-w-sm w-full text-center">
            <p className="text-amber-300 text-sm">{feedback}</p>
          </div>
        )}

        {/* Erro de mic */}
        {micError && (
          <div className="fade-up bg-red-500/15 border border-red-500/30 rounded-xl px-4 py-2.5 max-w-sm w-full text-center">
            <p className="text-red-300 text-sm">{micError}</p>
          </div>
        )}
      </div>

      {/* Bottom — botão de microfone */}
      <div className="flex-shrink-0 flex items-center justify-center gap-6 px-6 pb-safe pb-8 pt-4">

        {/* Botão mic — pressionar e soltar */}
        <button
          onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); startListen(); }}
          onPointerUp={stopListen}
          onPointerCancel={stopListen}
          disabled={phase === "thinking"}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 shadow-2xl ${
            phase === "listening"
              ? "bg-red-500 scale-110 shadow-red-900/60"
              : phase === "thinking"
              ? "bg-white/10 scale-95 cursor-not-allowed"
              : phase === "speaking"
              ? "bg-purple-600/60 scale-100"
              : "bg-white/15 hover:bg-white/25 active:scale-95 border border-white/20"
          }`}
          aria-label={phase === "listening" ? "Parar de gravar" : "Falar"}
        >
          {phase === "listening"
            ? <MicOff className="w-8 h-8 text-white" />
            : phase === "thinking"
            ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <Mic className="w-8 h-8 text-white" />
          }
        </button>
      </div>

      {/* Hint */}
      <p className="text-center text-xs text-white/20 pb-3 flex-shrink-0 pb-safe">
        {phase === "idle" ? "Mantém pressionado para falar" : ""}
      </p>
    </div>
  );
}
