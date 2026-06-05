/* ═══════════════════════════════════════════════════════════════════
   NgadaLearn — Prática de Conversação ao Vivo
   Deepgram STT (speech-to-text) + Deepgram Aura TTS (text-to-speech)
   IA tutor com tópicos, dificuldade e feedback em tempo real
   ═══════════════════════════════════════════════════════════════════ */

import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router";
import {
  Mic, MicOff, Volume2, VolumeX, RotateCcw, ChevronLeft,
  MessageCircle, Star, Zap, BookOpen, Globe, Briefcase,
  ShoppingBag, UtensilsCrossed, Plane, Users, Stethoscope,
  CheckCircle, AlertCircle, ChevronDown, PlayCircle, Trophy,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";

/* ── Config ──────────────────────────────────────────────────────── */
const DG_KEY    = import.meta.env.VITE_DEEPGRAM_KEY as string;
const DG_STT    = "https://api.deepgram.com/v1/listen?model=nova-2&language=en-US&punctuate=true&smart_format=true";
const DG_TTS    = (voice: string) => `https://api.deepgram.com/v1/speak?model=${voice}&encoding=mp3`;
const BACKEND   = import.meta.env.VITE_API_URL || "https://ngadalearn-api.onrender.com";

/* ── Tipos ───────────────────────────────────────────────────────── */
interface Message {
  role: "tutor" | "user";
  text: string;
  feedback?: { corrections: string[]; vocab: string[]; tip: string } | null;
  timestamp: number;
}

interface Topic {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  description: string;
  starter: string;
  systemPrompt: string;
  vocabulary: string[];
}

type Difficulty = "beginner" | "intermediate" | "advanced";

/* ── Tópicos de conversação ──────────────────────────────────────── */
const TOPICS: Topic[] = [
  {
    id: "smalltalk",
    label: "Apresentações",
    icon: Users,
    color: "bg-purple-500",
    description: "Cumprimentos, apresentações e conversa informal",
    starter: "Hi there! I'm Alex, your English tutor. Let's practice some small talk! How are you doing today? Tell me a bit about yourself.",
    systemPrompt: "Practice greetings, introductions, asking about hobbies and daily life. Keep it friendly and encouraging.",
    vocabulary: ["Nice to meet you", "How are you doing?", "What do you do for a living?", "I enjoy", "In my free time"],
  },
  {
    id: "shopping",
    label: "Compras",
    icon: ShoppingBag,
    color: "bg-blue-500",
    description: "Em lojas, mercados e centros comerciais",
    starter: "Welcome to our store! I'm here to help you practice shopping in English. What are you looking for today?",
    systemPrompt: "Simulate a shopping scenario. Practice asking about prices, sizes, colors, availability. Help with shopping vocabulary.",
    vocabulary: ["How much does it cost?", "Do you have it in...?", "I'm looking for...", "Can I try it on?", "I'll take it"],
  },
  {
    id: "restaurant",
    label: "Restaurante",
    icon: UtensilsCrossed,
    color: "bg-orange-500",
    description: "Fazer pedidos e conversar num restaurante",
    starter: "Good evening! Welcome to The English Café. I'm your server tonight. Are you ready to order, or would you like a few more minutes?",
    systemPrompt: "Simulate a restaurant scenario. Practice ordering food, asking about the menu, making special requests, paying the bill.",
    vocabulary: ["I'd like to order...", "What do you recommend?", "Is it spicy?", "The bill, please", "Could I have...?"],
  },
  {
    id: "travel",
    label: "Viagens",
    icon: Plane,
    color: "bg-cyan-500",
    description: "Aeroporto, hotel e turismo",
    starter: "Hello! I'm the receptionist at The Grand Hotel. How can I assist you today? Are you checking in?",
    systemPrompt: "Practice travel English — hotels, airports, directions, tourist information. Focus on practical travel phrases.",
    vocabulary: ["I have a reservation", "Where is the...?", "How do I get to...?", "Can you help me?", "How far is it?"],
  },
  {
    id: "interview",
    label: "Entrevista",
    icon: Briefcase,
    color: "bg-indigo-500",
    description: "Entrevistas de emprego em inglês",
    starter: "Good morning! I'm the hiring manager at TechCorp. Thank you for coming in today. Could you start by telling me a little about yourself and your background?",
    systemPrompt: "Simulate a job interview. Ask about experience, skills, strengths/weaknesses, career goals. Professional language focus.",
    vocabulary: ["My experience includes...", "I'm proficient in...", "My greatest strength is...", "I'm a team player", "I'm looking for a challenge"],
  },
  {
    id: "health",
    label: "Saúde",
    icon: Stethoscope,
    color: "bg-green-500",
    description: "Consultas médicas e farmácia",
    starter: "Good morning, I'm Dr. Miller. Please, take a seat. What seems to be the problem today? How can I help you?",
    systemPrompt: "Practice medical English — describing symptoms, asking for medicine, understanding medical advice. Be clear and helpful.",
    vocabulary: ["I have a headache", "It hurts here", "Since yesterday", "I'm allergic to...", "How often should I take it?"],
  },
  {
    id: "business",
    label: "Negócios",
    icon: Globe,
    color: "bg-slate-600",
    description: "Reuniões e e-mails profissionais",
    starter: "Good morning, everyone. Let's get started with today's meeting. First, could you give us a quick update on the project status?",
    systemPrompt: "Simulate business meetings, presentations and professional communication. Focus on formal business English.",
    vocabulary: ["As per our agenda", "Could you elaborate?", "I'd like to propose...", "Let's wrap up", "Following up on..."],
  },
  {
    id: "culture",
    label: "Cultura Pop",
    icon: Star,
    color: "bg-pink-500",
    description: "Filmes, música e entretenimento",
    starter: "Hey! So I just watched an amazing movie. What kind of movies or TV shows do you like? Are you a fan of any particular genre?",
    systemPrompt: "Casual conversation about movies, music, sports, entertainment. Fun and relaxed English practice.",
    vocabulary: ["I'm a big fan of...", "Have you seen...?", "What do you think of...?", "I'd highly recommend", "It's worth watching"],
  },
];

const DIFFICULTIES: { id: Difficulty; label: string; desc: string; color: string }[] = [
  { id: "beginner",     label: "A1–A2",      desc: "Frases simples, vocabulário básico",    color: "bg-green-500" },
  { id: "intermediate", label: "B1–B2",      desc: "Conversação fluente, erros ocasionais", color: "bg-yellow-500" },
  { id: "advanced",     label: "C1–C2",      desc: "Inglês complexo, expressões idiomáticas", color: "bg-red-500" },
];

const TUTOR_VOICES: Record<Difficulty, string> = {
  beginner:     "aura-asteria-en",
  intermediate: "aura-luna-en",
  advanced:     "aura-orion-en",
};

/* ── Avaliação de inglês (client-side) ───────────────────────────── */
function evaluateEnglish(text: string, difficulty: Difficulty): {
  corrections: string[]; vocab: string[]; tip: string; score: number;
} {
  const corrections: string[] = [];
  const vocab: string[] = [];
  const t = text.toLowerCase();

  /* Erros comuns PT→EN */
  if (/\bi (is|am) /.test(t))       corrections.push('"I am" not "I is"');
  if (/don't has/.test(t))           corrections.push('"don\'t have" not "don\'t has"');
  if (/he have/.test(t))             corrections.push('"he has" not "he have"');
  if (/yesterday i go/.test(t))      corrections.push('Use past tense: "I went" not "I go"');
  if (/since \d+ (day|year)s/.test(t)) corrections.push('Use "for" with duration, "since" with a point in time');

  /* Bom vocabulário identificado */
  const goodPhrases = ["however", "therefore", "furthermore", "in addition", "for instance", "on the other hand", "as a result", "in conclusion"];
  goodPhrases.forEach(p => { if (t.includes(p)) vocab.push(`Great use of "${p}"! 👍`); });

  /* Dicas por dificuldade */
  const tips: Record<Difficulty, string[]> = {
    beginner:     ["Try to use complete sentences!", "Good try — keep practising!", "Remember to say 'I am' or 'I'm'"],
    intermediate: ["Try adding more details to your answer.", "Use connectors like 'however', 'because', 'therefore'.", "Great effort! Try varying your vocabulary."],
    advanced:     ["Excellent! Try using idiomatic expressions.", "Consider using the passive voice for variety.", "Your English is improving — add more nuance!"],
  };
  const tip = tips[difficulty][Math.floor(Math.random() * tips[difficulty].length)];

  const wordCount = text.trim().split(/\s+/).length;
  const baseScore = Math.min(wordCount * 3, 40);
  const correctionPenalty = corrections.length * 5;
  const vocabBonus = vocab.length * 10;
  const score = Math.max(0, Math.min(100, baseScore - correctionPenalty + vocabBonus));

  return { corrections, vocab, tip, score };
}

/* ── Resposta do tutor (backend ou fallback) ─────────────────────── */
async function getTutorResponse(
  userText: string,
  topic: Topic,
  difficulty: Difficulty,
  history: Message[]
): Promise<string> {
  const difficultyInstructions: Record<Difficulty, string> = {
    beginner:     "Use simple words and short sentences. Speak slowly and clearly. Correct mistakes gently with the right form.",
    intermediate: "Use natural conversation. Occasionally introduce new vocabulary. Correct major mistakes kindly.",
    advanced:     "Use natural, complex English. Use idioms and advanced structures. Challenge the student with follow-up questions.",
  };

  const historyText = history.slice(-6).map(m => `${m.role === "tutor" ? "Tutor" : "Student"}: ${m.text}`).join("\n");

  const systemPrompt = `You are Alex, a friendly and encouraging English conversation tutor for Portuguese speakers learning English.
Topic: ${topic.label} — ${topic.description}
${topic.systemPrompt}
Difficulty: ${difficulty} — ${difficultyInstructions[difficulty]}

RULES:
- Keep responses SHORT (2-4 sentences max)
- ALWAYS end with a question to keep the conversation going
- If the student makes errors, gently correct them and continue
- Be warm, encouraging and natural
- Never break character
- Focus on the topic: ${topic.label}`;

  try {
    const res = await fetch(`${BACKEND}/api/conversation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ systemPrompt, history: historyText, userMessage: userText, topic: topic.id, difficulty }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.response) return data.response;
    }
  } catch { /* fallback */ }

  /* ── Fallback inteligente (sem backend) ── */
  const fallbacks: Record<string, string[]> = {
    smalltalk: [
      "That's great! Tell me more about your hobbies. What do you enjoy doing in your free time?",
      "Interesting! So what's a typical day like for you? Do you work or study?",
      "That sounds wonderful! Have you ever travelled to an English-speaking country?",
      "I love hearing about that! What's your favorite thing about your city?",
    ],
    shopping: [
      "Of course! We have that item available. What size are you looking for — small, medium, or large?",
      "Great choice! That item costs $25. Would you like to pay by cash or card?",
      "I'm afraid we're out of stock in that colour. We have it in blue and green — would either of those work?",
      "Excellent! Would you like to try it on? The fitting rooms are just over there.",
    ],
    restaurant: [
      "Excellent choice! And what would you like to drink? We have water, juice, or our house wine.",
      "Our chef's special tonight is grilled salmon with vegetables. It's absolutely delicious — highly recommended!",
      "Of course! Are you celebrating anything special tonight? We can make it extra memorable.",
      "I'm so glad you enjoyed the meal! Can I bring you the dessert menu, or would you like the bill?",
    ],
    travel: [
      "Welcome! I have your reservation right here. Your room is ready. Would you like a king or twin bed?",
      "The city centre is about 10 minutes by taxi. You can also take the number 5 bus from the front of the hotel.",
      "Absolutely! Check-out time is 11 AM. Would you like a wake-up call in the morning?",
      "I can recommend the old town area — it's beautiful and full of great restaurants. Do you need a map?",
    ],
    interview: [
      "That's very impressive! Could you tell me about a specific challenge you faced in your previous role and how you handled it?",
      "Excellent background! Where do you see yourself in five years? What are your career goals?",
      "I see. And why are you interested in working for our company specifically? What attracted you to this position?",
      "Great answer! Now, could you describe your greatest professional achievement so far?",
    ],
    health: [
      "I see. How long have you had this symptom? And does anything make it better or worse?",
      "I understand. Have you taken any medication for this? Are you allergic to any medicines?",
      "Based on what you've told me, I'd like to prescribe something for you. Take one tablet twice a day with food.",
      "That should help within a few days. If it doesn't improve, please come back and see me immediately.",
    ],
    business: [
      "Excellent update! Let's move to the next agenda item. Who wants to present the quarterly figures?",
      "That's a valid point. How do you propose we address this challenge? Any specific recommendations?",
      "Good idea! Let's put that on the action list. Can you send a follow-up email to the team by end of day?",
      "Absolutely. I think we're all in agreement. Let's schedule a follow-up meeting for next week to review progress.",
    ],
    culture: [
      "Oh interesting! Have you seen any good films recently? What's your all-time favourite movie?",
      "I love that show too! What kind of music do you listen to? Any favourite artists or bands?",
      "That's a great recommendation! Do you prefer watching things with subtitles or without? It's great practice!",
      "Totally agree! What about sports — do you follow any teams? The World Cup is always exciting!",
    ],
  };

  const topicFallbacks = fallbacks[topic.id] || fallbacks.smalltalk;
  const userWordCount = userText.trim().split(/\s+/).length;

  if (userWordCount < 3) {
    return "I didn't quite catch that! Could you try again? Speak a complete sentence — for example: 'I would like...' or 'I think...'";
  }

  return topicFallbacks[Math.floor(Math.random() * topicFallbacks.length)];
}

/* ════════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ════════════════════════════════════════════════════════════════════ */
export function ConversationPractice() {
  const [step,         setStep]         = useState<"select" | "practice">("select");
  const [topic,        setTopic]        = useState<Topic>(TOPICS[0]);
  const [difficulty,   setDifficulty]   = useState<Difficulty>("beginner");
  const [messages,     setMessages]     = useState<Message[]>([]);
  const [isListening,  setIsListening]  = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking,   setIsSpeaking]   = useState(false);
  const [liveText,     setLiveText]     = useState("");
  const [totalScore,   setTotalScore]   = useState(0);
  const [turnCount,    setTurnCount]    = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showVocab,    setShowVocab]    = useState(false);
  const [micError,     setMicError]     = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef   = useRef<Blob[]>([]);
  const streamRef        = useRef<MediaStream | null>(null);
  const chatEndRef       = useRef<HTMLDivElement>(null);
  const currentAudioRef  = useRef<HTMLAudioElement | null>(null);
  const recognitionRef   = useRef<any>(null);

  /* Auto-scroll */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, liveText]);

  /* Cleanup on unmount */
  useEffect(() => () => {
    stopStream();
    currentAudioRef.current?.pause();
    if (recognitionRef.current) try { recognitionRef.current.stop(); } catch(_) {}
  }, []);

  function stopStream() {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  }

  /* ── Falar com Deepgram TTS ──────────────────────────────────────── */
  const speak = useCallback(async (text: string) => {
    if (!audioEnabled) return;
    currentAudioRef.current?.pause();
    setIsSpeaking(true);
    try {
      const res = await fetch(DG_TTS(TUTOR_VOICES[difficulty]), {
        method: "POST",
        headers: { "Authorization": `Token ${DG_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("TTS failed");
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const audio = new Audio(url);
      currentAudioRef.current = audio;
      audio.onended = () => { setIsSpeaking(false); URL.revokeObjectURL(url); };
      audio.onerror = () => setIsSpeaking(false);
      await audio.play();
    } catch {
      /* Fallback: Web Speech API */
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = "en-US"; u.rate = difficulty === "beginner" ? 0.8 : 1;
        const voices = window.speechSynthesis.getVoices();
        const pref = voices.find(v => v.lang === "en-US" && v.name.includes("Google")) || voices.find(v => v.lang.startsWith("en"));
        if (pref) u.voice = pref;
        u.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(u);
      } else {
        setIsSpeaking(false);
      }
    }
  }, [difficulty, audioEnabled]);

  /* ── Iniciar sessão ──────────────────────────────────────────────── */
  async function startSession() {
    setMessages([]);
    setTotalScore(0);
    setTurnCount(0);
    setLiveText("");
    setMicError("");
    setStep("practice");

    const tutorMsg: Message = { role: "tutor", text: topic.starter, feedback: null, timestamp: Date.now() };
    setMessages([tutorMsg]);
    await speak(topic.starter);
  }

  /* ── Gravar com MediaRecorder ────────────────────────────────────── */
  async function startListening() {
    setMicError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioChunksRef.current = [];

      /* Web Speech API para preview em tempo real */
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.lang = "en-US"; rec.continuous = true; rec.interimResults = true;
        rec.onresult = (e: any) => {
          const interim = Array.from(e.results).map((r: any) => r[0].transcript).join(" ");
          setLiveText(interim);
        };
        rec.start();
        recognitionRef.current = rec;
      }

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "audio/webm";
      const mr = new MediaRecorder(stream, { mimeType });
      mr.ondataavailable = e => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mr.start(250);
      mediaRecorderRef.current = mr;
      setIsListening(true);
    } catch (err) {
      setMicError("Microfone bloqueado. Clica no cadeado da barra do browser e permite o microfone.");
    }
  }

  async function stopListening() {
    setIsListening(false);
    if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch(_) {} recognitionRef.current = null; }

    const mr = mediaRecorderRef.current;
    if (!mr) return;

    await new Promise<void>(resolve => {
      mr.onstop = () => resolve();
      mr.stop();
    });
    stopStream();

    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    const userText  = liveText.trim();
    setLiveText("");

    if (!userText && audioBlob.size < 2000) {
      setMicError("Não ouvi nada. Tenta falar mais alto ou mais perto do microfone.");
      return;
    }

    setIsProcessing(true);
    let finalText = userText;

    /* Tentar Deepgram STT se temos áudio */
    if (audioBlob.size > 2000) {
      try {
        const res = await fetch(DG_STT, {
          method: "POST",
          headers: { "Authorization": `Token ${DG_KEY}`, "Content-Type": "audio/webm" },
          body: audioBlob,
        });
        if (res.ok) {
          const data = await res.json();
          const dgText = data?.results?.channels?.[0]?.alternatives?.[0]?.transcript;
          if (dgText?.trim()) finalText = dgText.trim();
        }
      } catch { /* usar texto da Web Speech API */ }
    }

    if (!finalText) {
      setIsProcessing(false);
      setMicError("Não consegui transcrever. Tenta novamente.");
      return;
    }

    /* Avaliar inglês */
    const evaluation = evaluateEnglish(finalText, difficulty);
    const userMsg: Message = {
      role: "user",
      text: finalText,
      feedback: { corrections: evaluation.corrections, vocab: evaluation.vocab, tip: evaluation.tip },
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);
    setTotalScore(prev => prev + evaluation.score);
    setTurnCount(prev => prev + 1);

    /* Obter resposta do tutor */
    const allMessages = [...messages, userMsg];
    const response = await getTutorResponse(finalText, topic, difficulty, allMessages);
    const tutorMsg: Message = { role: "tutor", text: response, feedback: null, timestamp: Date.now() };
    setMessages(prev => [...prev, tutorMsg]);
    setIsProcessing(false);

    await speak(response);
  }

  const avgScore = turnCount > 0 ? Math.round(totalScore / turnCount) : 0;

  /* ════════════════════════════════════════════════════════
     ECRÃ DE SELEÇÃO
  ════════════════════════════════════════════════════════ */
  if (step === "select") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white">
        {/* Header */}
        <div className="flex-shrink-0 bg-gradient-to-r from-purple-800 via-violet-700 to-indigo-800 px-4 shadow-xl" style={{ height: 48 }}>
          <div className="max-w-5xl mx-auto h-full flex items-center justify-between">
            <Link to="/lessons" className="flex items-center gap-1.5 text-purple-200 hover:text-white transition-colors min-h-[44px] px-1">
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-semibold hidden sm:inline">Conteúdo</span>
            </Link>
            <div className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-purple-300" />
              <h1 className="text-sm sm:text-lg font-black">Prática de Conversação ao Vivo</h1>
            </div>
            <div className="w-16" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">

          {/* Título */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-purple-600/30 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
              <Mic className="w-10 h-10 text-purple-300" />
            </div>
            <h2 className="text-3xl font-black mb-2">Fala inglês em tempo real</h2>
            <p className="text-purple-200 max-w-lg mx-auto">
              O tutor IA Alex ouve-te, responde e corrige-te ao vivo. Usa o Deepgram para transcrição e voz profissional.
            </p>
          </div>

          {/* Escolher tópico */}
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-purple-300 mb-3">1. Escolhe o tópico</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {TOPICS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTopic(t)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    topic.id === t.id
                      ? "border-purple-400 bg-purple-700/40 shadow-lg shadow-purple-900/50"
                      : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                  }`}
                >
                  <div className={`w-9 h-9 ${t.color} rounded-xl flex items-center justify-center mb-2.5`}>
                    <t.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="font-bold text-sm">{t.label}</p>
                  <p className="text-[11px] text-white/50 mt-0.5 leading-snug">{t.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Escolher dificuldade */}
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-purple-300 mb-3">2. Escolhe o nível</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              {DIFFICULTIES.map(d => (
                <button
                  key={d.id}
                  onClick={() => setDifficulty(d.id)}
                  className={`flex-1 p-4 rounded-2xl border-2 text-left transition-all ${
                    difficulty === d.id
                      ? "border-purple-400 bg-purple-700/40"
                      : "border-white/10 bg-white/5 hover:border-white/30"
                  }`}
                >
                  <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-full text-white mb-2 ${d.color}`}>{d.label}</span>
                  <p className="font-bold text-sm">{d.id === "beginner" ? "Iniciante" : d.id === "intermediate" ? "Intermédio" : "Avançado"}</p>
                  <p className="text-xs text-white/50 mt-0.5">{d.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Vocabulário do tópico */}
          <div className="mb-8 bg-white/5 rounded-2xl border border-white/10 p-4">
            <button
              className="w-full flex items-center justify-between text-sm font-semibold text-purple-200"
              onClick={() => setShowVocab(!showVocab)}
            >
              <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> Vocabulário útil — {topic.label}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showVocab ? "rotate-180" : ""}`} />
            </button>
            {showVocab && (
              <div className="flex flex-wrap gap-2 mt-3">
                {topic.vocabulary.map(v => (
                  <span key={v} className="bg-purple-800/60 text-purple-200 text-xs px-3 py-1.5 rounded-full border border-purple-700/50">
                    {v}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Botão iniciar */}
          <button
            onClick={startSession}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-lg py-4 rounded-2xl transition-all shadow-xl shadow-purple-900/50 flex items-center justify-center gap-3"
          >
            <PlayCircle className="w-6 h-6" />
            Iniciar Conversa — {topic.label}
          </button>

          <p className="text-center text-xs text-white/30 mt-3">
            Microfone necessário · Deepgram STT + TTS · Tutor IA em inglês
          </p>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════
     ECRÃ DE PRÁTICA
  ════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen lg:h-[calc(100vh-4rem)] flex flex-col bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white lg:overflow-hidden">

      {/* Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-purple-800 via-violet-700 to-indigo-800 px-4 shadow-xl" style={{ height: 48 }}>
        <div className="max-w-5xl mx-auto h-full flex items-center justify-between">
          <button
            onClick={() => { setStep("select"); stopStream(); currentAudioRef.current?.pause(); }}
            className="flex items-center gap-1.5 text-purple-200 hover:text-white transition-colors min-h-[44px] px-1"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-semibold hidden sm:inline">Voltar</span>
          </button>

          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 ${topic.color} rounded-lg flex items-center justify-center`}>
              <topic.icon className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-black">{topic.label}</span>
            <span className="text-[10px] bg-white/15 px-2 py-0.5 rounded-full hidden sm:block">
              {difficulty === "beginner" ? "A1–A2" : difficulty === "intermediate" ? "B1–B2" : "C1–C2"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Score */}
            {turnCount > 0 && (
              <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-2.5 py-1">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-bold">{avgScore}</span>
              </div>
            )}
            {/* Toggle áudio */}
            <button
              onClick={() => { setAudioEnabled(!audioEnabled); currentAudioRef.current?.pause(); }}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors"
            >
              {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-white/40" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 lg:min-h-0 max-w-4xl mx-auto w-full px-4 py-3 flex flex-col gap-3">

        {/* Score bar */}
        {turnCount > 0 && (
          <div className="flex-shrink-0 bg-white/5 rounded-xl px-4 py-2 flex items-center gap-3 border border-white/10">
            <Trophy className="w-4 h-4 text-yellow-400 flex-shrink-0" />
            <div className="flex-1">
              <Progress value={avgScore} className="h-1.5" />
            </div>
            <span className="text-xs text-white/60 flex-shrink-0">{turnCount} {turnCount === 1 ? "turno" : "turnos"} · {avgScore}/100</span>
          </div>
        )}

        {/* Chat */}
        <div className="flex-1 lg:min-h-0 overflow-y-auto space-y-4 pr-1 pb-2">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1.5`}>

                {/* Bubble */}
                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "tutor"
                    ? "bg-white/10 border border-white/10 text-white rounded-tl-sm"
                    : "bg-purple-600 text-white rounded-tr-sm"
                }`}>
                  {msg.role === "tutor" && (
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className={`w-5 h-5 ${topic.color} rounded-md flex items-center justify-center flex-shrink-0`}>
                        <topic.icon className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-[10px] font-bold text-white/60 uppercase tracking-wide">Alex · Tutor</span>
                      {isSpeaking && i === messages.filter(m => m.role === "tutor").length - 1 + messages.filter(m => m.role === "user").length && (
                        <span className="flex items-center gap-0.5 ml-1">
                          {[1,2,3].map(n => <span key={n} className="w-1 h-1 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: `${n * 100}ms` }} />)}
                        </span>
                      )}
                    </div>
                  )}
                  <p>{msg.text}</p>
                </div>

                {/* Feedback para o utilizador */}
                {msg.role === "user" && msg.feedback && (
                  <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 max-w-full space-y-1.5 text-xs">
                    {msg.feedback.corrections.length > 0 && (
                      <div>
                        {msg.feedback.corrections.map((c, j) => (
                          <div key={j} className="flex items-start gap-1.5 text-orange-300">
                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {msg.feedback.vocab.length > 0 && (
                      <div>
                        {msg.feedback.vocab.map((v, j) => (
                          <div key={j} className="flex items-start gap-1.5 text-green-300">
                            <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                            <span>{v}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-start gap-1.5 text-purple-300">
                      <Zap className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      <span>{msg.feedback.tip}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Live transcript */}
          {(isListening || liveText) && (
            <div className="flex justify-end">
              <div className="max-w-[85%] bg-purple-700/40 border border-purple-500/40 rounded-2xl rounded-tr-sm px-4 py-3 text-sm">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="flex gap-0.5">
                    {[1,2,3].map(n => <span key={n} className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: `${n * 150}ms` }} />)}
                  </div>
                  <span className="text-[10px] text-white/50 uppercase">A ouvir...</span>
                </div>
                <p className={liveText ? "text-white" : "text-white/30 italic"}>
                  {liveText || "Fala em inglês..."}
                </p>
              </div>
            </div>
          )}

          {/* A processar */}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-white/10 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div className={`w-5 h-5 ${topic.color} rounded-md flex items-center justify-center`}>
                    <topic.icon className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex gap-1 items-center">
                    {[1,2,3].map(n => <span key={n} className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: `${n * 150}ms` }} />)}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Erro */}
        {micError && (
          <div className="flex-shrink-0 bg-red-500/20 border border-red-500/40 rounded-xl px-4 py-2.5 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {micError}
          </div>
        )}

        {/* Controlos */}
        <div className="flex-shrink-0 flex items-center gap-3 pb-2">
          {/* Vocabulário */}
          <button
            onClick={() => setShowVocab(!showVocab)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 transition-colors"
            title="Ver vocabulário"
          >
            <BookOpen className="w-5 h-5 text-purple-300" />
          </button>

          {/* Microfone */}
          <button
            onPointerDown={startListening}
            onPointerUp={stopListening}
            onPointerLeave={isListening ? stopListening : undefined}
            disabled={isProcessing || isSpeaking}
            className={`flex-1 min-h-[56px] rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all select-none ${
              isListening
                ? "bg-red-600 shadow-xl shadow-red-900/60 scale-105"
                : isProcessing || isSpeaking
                ? "bg-white/10 text-white/30 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-900/50"
            }`}
          >
            {isListening ? (
              <><MicOff className="w-6 h-6" /> <span>A gravar... (solta para enviar)</span></>
            ) : isProcessing ? (
              <><span className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" /> A processar...</>
            ) : isSpeaking ? (
              <><Volume2 className="w-6 h-6" /> Alex está a falar...</>
            ) : (
              <><Mic className="w-6 h-6" /> <span>Mantém pressionado para falar</span></>
            )}
          </button>

          {/* Reiniciar */}
          <button
            onClick={() => { stopStream(); startSession(); }}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 transition-colors"
            title="Reiniciar conversa"
          >
            <RotateCcw className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Vocabulário expandido */}
        {showVocab && (
          <div className="flex-shrink-0 bg-white/5 border border-white/10 rounded-xl p-3 flex flex-wrap gap-2">
            {topic.vocabulary.map(v => (
              <button
                key={v}
                onClick={() => speak(v)}
                className="bg-purple-800/60 text-purple-200 text-xs px-3 py-1.5 rounded-full border border-purple-700/50 hover:bg-purple-700/60 transition-colors flex items-center gap-1.5"
              >
                <Volume2 className="w-3 h-3" />
                {v}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
