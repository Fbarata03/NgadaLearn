import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { getLessonById, ALL_LESSONS, type Exercise, type MCExercise, type ListenExercise, type FillExercise } from "../data/lessonsData";
import { useProgress } from "../hooks/useProgress";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import {
  ChevronRight, Play, Pause, RotateCcw, Volume2,
  CheckCircle2, XCircle, BookOpen, Headphones, Mic, Trophy,
  ArrowLeft, SkipForward,
} from "lucide-react";

/* ── Componente de exercício: múltipla escolha ── */
function MCStep({ ex, onNext }: { ex: MCExercise; onNext: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const check = (i: number) => {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
  };

  const isCorrect = selected === ex.correct;

  return (
    <div className="space-y-5">
      <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl">
        <div className="flex items-start gap-2.5">
          <BookOpen className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <p className="font-semibold text-gray-800">{ex.question}</p>
        </div>
      </div>

      <div className="space-y-3">
        {ex.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => check(i)}
            disabled={revealed}
            className={`w-full p-4 text-left rounded-xl border-2 transition-all text-sm font-medium ${
              revealed
                ? i === ex.correct
                  ? "border-green-500 bg-green-50 text-green-800"
                  : i === selected
                  ? "border-red-400 bg-red-50 text-red-700"
                  : "border-gray-200 bg-gray-50 text-gray-400 opacity-50"
                : "border-gray-200 hover:border-purple-300 hover:bg-purple-50 cursor-pointer"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 flex items-center justify-center rounded-full bg-white border text-xs font-bold flex-shrink-0">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{opt}</span>
              {revealed && i === ex.correct && <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />}
              {revealed && i === selected && i !== ex.correct && <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
            </div>
          </button>
        ))}
      </div>

      {revealed && (
        <div className={`p-4 rounded-xl border-2 ${isCorrect ? "bg-green-50 border-green-300" : "bg-orange-50 border-orange-300"}`}>
          <p className="font-bold mb-1">{isCorrect ? "🎉 Correto!" : "❌ Não foi dessa vez"}</p>
          <p className="text-sm text-gray-700">{ex.explanation}</p>
        </div>
      )}

      {revealed && (
        <Button onClick={onNext} className="w-full bg-purple-600 hover:bg-purple-700 py-5 font-bold">
          Próximo <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      )}

      {!revealed && (
        <p className="text-center text-sm text-gray-400">Selecione uma opção para continuar</p>
      )}
    </div>
  );
}

/* ── Componente de exercício: ouvir e repetir ── */
function ListenStep({ ex, onNext }: { ex: ListenExercise; onNext: () => void }) {
  const [confirmed, setConfirmed] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const speak = useCallback(() => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(ex.english);
    u.lang = "en-US";
    u.rate = 0.82;
    u.pitch = 1;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    // Prefer a good voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang === "en-US" && (v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Daniel")));
    if (preferred) u.voice = preferred;
    window.speechSynthesis.speak(u);
  }, [ex.english]);

  useEffect(() => {
    // Auto-play when step appears
    const timer = setTimeout(speak, 300);
    return () => {
      clearTimeout(timer);
      window.speechSynthesis?.cancel();
    };
  }, [speak]);

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-6 text-white text-center">
        <Headphones className="w-10 h-10 mx-auto mb-3 opacity-80" />
        <h3 className="text-lg font-bold mb-1">Ouça e Repita</h3>
        <p className="text-blue-100 text-sm">Clique para ouvir, depois repita em voz alta</p>
      </div>

      <div className="bg-white border-2 border-purple-100 rounded-xl p-5 text-center space-y-3">
        <p className="text-xl font-bold text-gray-900 leading-relaxed">"{ex.english}"</p>
        <p className="text-sm text-gray-500 italic">"{ex.portuguese}"</p>
      </div>

      <button
        onClick={speak}
        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
          speaking
            ? "bg-blue-100 text-blue-700 cursor-wait"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {speaking ? (
          <><Volume2 className="w-5 h-5 animate-pulse" /> Reproduzindo...</>
        ) : (
          <><Play className="w-5 h-5" /> Ouvir Novamente</>
        )}
      </button>

      {ex.tip && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800">
          💡 <strong>Dica:</strong> {ex.tip}
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
          <Mic className="w-4 h-4 text-purple-600" />
          Repita a frase em voz alta, depois confirme:
        </div>
        <Button
          onClick={() => { setConfirmed(true); }}
          disabled={confirmed}
          className={`w-full py-5 font-bold ${confirmed ? "bg-green-600 hover:bg-green-700" : "bg-gray-800 hover:bg-gray-900"}`}
        >
          {confirmed ? "✓ Confirmado!" : "Já repeti em voz alta!"}
        </Button>
      </div>

      {confirmed && (
        <Button onClick={onNext} className="w-full bg-purple-600 hover:bg-purple-700 py-5 font-bold">
          Próximo <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      )}
    </div>
  );
}

/* ── Componente de exercício: preencher lacuna ── */
function FillStep({ ex, onNext }: { ex: FillExercise; onNext: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const check = (i: number) => {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
  };

  const isCorrect = selected === ex.correct;

  return (
    <div className="space-y-5">
      <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl text-center">
        <p className="text-sm text-gray-500 mb-2">Complete a frase:</p>
        <p className="text-lg font-bold text-gray-900">
          {ex.before}{" "}
          <span className={`px-3 py-1 rounded-lg border-2 border-dashed ${revealed ? (selected === ex.correct ? "border-green-400 bg-green-50 text-green-800" : "border-red-400 bg-red-50 text-red-700") : "border-purple-400 bg-purple-50 text-purple-700"}`}>
            {revealed ? ex.options[ex.correct] : selected !== null ? ex.options[selected] : "___"}
          </span>{" "}
          {ex.after}
        </p>
        <p className="text-sm text-gray-500 mt-2 italic">"{ex.portuguese}"</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {ex.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => check(i)}
            disabled={revealed}
            className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
              revealed
                ? i === ex.correct
                  ? "border-green-500 bg-green-50 text-green-700"
                  : i === selected
                  ? "border-red-400 bg-red-50 text-red-600"
                  : "border-gray-200 bg-gray-50 text-gray-400 opacity-50"
                : "border-gray-200 hover:border-purple-300 hover:bg-purple-50 cursor-pointer"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {revealed && (
        <div className={`p-4 rounded-xl border-2 ${isCorrect ? "bg-green-50 border-green-300" : "bg-orange-50 border-orange-300"}`}>
          <p className="font-bold">{isCorrect ? "🎉 Correto!" : `❌ A resposta é: "${ex.options[ex.correct]}"`}</p>
        </div>
      )}

      {revealed && (
        <Button onClick={onNext} className="w-full bg-purple-600 hover:bg-purple-700 py-5 font-bold">
          Próximo <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   PLAYER PRINCIPAL
   ══════════════════════════════════════════════ */
export function LessonPlayer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { completeLesson, isCompleted, openLesson } = useProgress();

  const lesson = id ? getLessonById(id) : undefined;

  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const [ttsPlaying, setTtsPlaying] = useState(false);
  const [ttsProgress, setTtsProgress] = useState(0);
  const [audioSpeed, setAudioSpeed] = useState<number>(
    () => parseFloat(localStorage.getItem("ngada_audio_speed") || "1")
  );
  const audioRef = useRef<HTMLAudioElement>(null);

  const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5];
  function changeSpeed(s: number) {
    setAudioSpeed(s);
    localStorage.setItem("ngada_audio_speed", String(s));
    if (audioRef.current) audioRef.current.playbackRate = s;
  }

  // Lógica de "Self-Healing": Tenta várias opções de caminhos de áudio
  const [audioSources, setAudioSources] = useState<string[]>([]);
  const [currentSrcIdx, setCurrentSrcIdx] = useState(0);

  useEffect(() => {
    if (!lesson) return;
    setAudioError(false);
    setCurrentSrcIdx(0);
    setAudioPlaying(false);

    const base = import.meta.env.BASE_URL || "/";
    const cleanBase = base.endsWith("/") ? base : base + "/";
    const sources: string[] = [];

    // 1. Tenta o caminho VITE padrão limpo (ex: /audio/assimil/001.mp3)
    sources.push(`${cleanBase}${lesson.audioSrc.replace(/^\//, "")}`);

    // 2. Fallbacks de nomes originais cobrindo todas as variantes possíveis
    if (lesson.category === "assimil") {
      const p1 = `Assimil/Assimil - O Novo Inglês Sem Esforço - Audio/Lição  (${lesson.number}).mp3`;
      const p2 = `Assimil/Assimil - O Novo Inglês Sem Esforço - Audio/Lição (${lesson.number}).mp3`;
      sources.push(`${cleanBase}${p1.split("/").map(encodeURIComponent).join("/")}`);
      sources.push(`${cleanBase}${p1}`);
      sources.push(`${cleanBase}${p2.split("/").map(encodeURIComponent).join("/")}`);
      sources.push(`${cleanBase}${p2}`);
    } else if (lesson.category === "pimsleur") {
      const p1 = `PIMSLEUR/ÁUDIO/Ingles ${String(lesson.number).padStart(2, "0")}.mp3`;
      const p2 = `PIMSLEUR/AUDIO/Ingles ${String(lesson.number).padStart(2, "0")}.mp3`;
      sources.push(`${cleanBase}${p1.split("/").map(encodeURIComponent).join("/")}`);
      sources.push(`${cleanBase}${p1}`);
      sources.push(`${cleanBase}${p2.split("/").map(encodeURIComponent).join("/")}`);
      sources.push(`${cleanBase}${p2}`);
    } else if (lesson.category === "leituras") {
      const is08 = lesson.number === 8;
      const p1 = `PIMSLEUR/ÁUDIO/${is08 ? "Lieturas 08" : `Leituras ${String(lesson.number).padStart(2, "0")}`}.mp3`;
      const p2 = `PIMSLEUR/AUDIO/Leituras ${String(lesson.number).padStart(2, "0")}.mp3`;
      sources.push(`${cleanBase}${p1.split("/").map(encodeURIComponent).join("/")}`);
      sources.push(`${cleanBase}${p1}`);
      sources.push(`${cleanBase}${p2.split("/").map(encodeURIComponent).join("/")}`);
      sources.push(`${cleanBase}${p2}`);
    }
    
    setAudioSources([...new Set(sources)]);
  }, [lesson]);

  // Regista abertura da lição para "Continuar onde paraste"
  useEffect(() => {
    if (lesson) openLesson(lesson.id);
  }, [lesson?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup: para todo o áudio ao sair da página
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      window.speechSynthesis?.cancel();
    };
  }, []);

  // Tenta recarregar caso a fonte mude após um erro
  useEffect(() => {
    if (audioSources.length > 0 && audioRef.current) {
      audioRef.current.load();
      if (audioPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [currentSrcIdx, audioSources]);

  const alreadyDone = lesson ? isCompleted(lesson.id) : false;

  // Audio controls
  const toggleAudio = () => {
    const a = audioRef.current;
    if (!a) return;
    if (audioPlaying) {
      a.pause();
      setAudioPlaying(false);
    } else {
      // Para TTS se estiver ativo
      if (ttsPlaying) {
        window.speechSynthesis?.cancel();
        setTtsPlaying(false);
      }
      if (audioError) {
        setAudioError(false);
        setCurrentSrcIdx(0);
      }
      setAudioPlaying(true);
      a.play().catch(() => handleAudioError());
    }
  };

  const seekAudio = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    if (!a || !audioDuration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    a.currentTime = pct * audioDuration;
  };

  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleAudioError = () => {
    if (currentSrcIdx < audioSources.length - 1) {
      setCurrentSrcIdx((prev) => prev + 1);
    } else {
      setAudioError(true);
      setAudioPlaying(false);
    }
  };

  // TTS: lê o vocabulário da lição em inglês, um a um
  const speakVocab = useCallback(() => {
    if (!lesson?.vocab?.length || !window.speechSynthesis) return;
    // Para o MP3 se estiver a tocar
    if (audioRef.current) {
      audioRef.current.pause();
      setAudioPlaying(false);
    }
    window.speechSynthesis.cancel();
    setTtsPlaying(true);
    setTtsProgress(0);

    const items = lesson.vocab;
    let idx = 0;

    const speakNext = () => {
      if (idx >= items.length) {
        setTtsPlaying(false);
        setTtsProgress(100);
        return;
      }
      setTtsProgress(Math.round((idx / items.length) * 100));

      const u = new SpeechSynthesisUtterance(items[idx].en);
      u.lang  = "en-US";
      u.rate  = 0.8;
      u.pitch = 1;

      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v =>
        v.lang.startsWith("en") &&
        (v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Daniel"))
      );
      if (preferred) u.voice = preferred;

      u.onend   = () => { idx++; setTimeout(speakNext, 600); };
      u.onerror = () => { idx++; setTimeout(speakNext, 300); };
      window.speechSynthesis.speak(u);
    };

    speakNext();
  }, [lesson]);

  const stopTts = useCallback(() => {
    window.speechSynthesis?.cancel();
    setTtsPlaying(false);
  }, []);

  const handleNext = () => {
    if (!lesson) return;
    // Para TTS ao avançar (novo exercício vai gerir o próprio áudio)
    window.speechSynthesis?.cancel();
    setTtsPlaying(false);
    if (exerciseIdx < lesson.exercises.length - 1) {
      setExerciseIdx((i) => i + 1);
    } else {
      completeLesson(lesson.id, lesson.durationMin);
      setCompleted(true);
    }
  };

  const renderExercise = (ex: Exercise) => {
    const key = exerciseIdx;
    if (ex.type === "mc") return <MCStep key={key} ex={ex as MCExercise} onNext={handleNext} />;
    if (ex.type === "listen") return <ListenStep key={key} ex={ex as ListenExercise} onNext={handleNext} />;
    if (ex.type === "fill") return <FillStep key={key} ex={ex as FillExercise} onNext={handleNext} />;
    return null;
  };

  if (!lesson) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Lição não encontrada.</p>
          <Link to="/lessons"><Button>← Voltar às Aulas</Button></Link>
        </div>
      </div>
    );
  }

  const catLabel = { assimil: "Assimil", pimsleur: "Pimsleur", leituras: "Leituras" }[lesson.category];
  const catColor = { assimil: "bg-purple-100 text-purple-700", pimsleur: "bg-blue-100 text-blue-700", leituras: "bg-green-100 text-green-700" }[lesson.category];
  const progressPct = completed ? 100 : ((exerciseIdx) / lesson.exercises.length) * 100;

  /* Calcular a lição seguinte na lista global */
  const allIdx = ALL_LESSONS.findIndex(l => l.id === lesson.id);
  const nextLesson = allIdx >= 0 && allIdx < ALL_LESSONS.length - 1 ? ALL_LESSONS[allIdx + 1] : null;

  /* ── Tela de conclusão ── */
  if (completed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-5 sm:p-8 text-center shadow-xl rounded-2xl border-0">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-black mb-2">Aula Concluída! 🎉</h2>
          <p className="text-gray-600 mb-1 font-semibold">{lesson.title}</p>
          <p className="text-gray-500 text-sm mb-6">{lesson.subtitle}</p>

          {/* Vocabulário aprendido */}
          {lesson.vocab.length > 0 && (
            <div className="bg-purple-50 rounded-xl p-4 mb-6 text-left">
              <p className="text-xs font-bold text-purple-700 uppercase tracking-wide mb-3">Vocabulário desta lição</p>
              <div className="space-y-1.5">
                {lesson.vocab.map((v) => (
                  <div key={v.en} className="flex justify-between text-sm">
                    <span className="font-semibold text-gray-800">{v.en}</span>
                    <span className="text-gray-500">{v.pt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            {nextLesson ? (
              <Button
                onClick={() => navigate(`/lessons/${nextLesson.id}`)}
                className="w-full bg-purple-600 hover:bg-purple-700 font-bold py-5"
              >
                Próxima Lição → {nextLesson.title}
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/lessons")}
                className="w-full bg-purple-600 hover:bg-purple-700 font-bold py-5"
              >
                Ver todas as Aulas →
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => { setExerciseIdx(0); setCompleted(false); }}
              className="w-full"
            >
              <RotateCcw className="w-4 h-4 mr-2" /> Rever esta Aula
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/lessons" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-purple-700 font-semibold min-h-[44px] pr-3">
            <ArrowLeft className="w-5 h-5" /> Aulas
          </Link>
          <div className="flex-1">
            <Progress value={progressPct} className="h-2" />
            <p className="text-[10px] text-gray-400 mt-0.5 text-center">Exercícios desta lição</p>
          </div>
          <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
            {exerciseIdx}/{lesson.exercises.length}
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-5 sm:py-8 max-w-3xl">
        {/* Info da lição */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${catColor}`}>
              {catLabel}
            </span>
            <span className="text-xs text-gray-400">Unidade {lesson.unit}</span>
            {alreadyDone && (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                ✓ Concluída
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black text-gray-900">{lesson.title}</h1>
          <p className="text-purple-700 font-semibold">{lesson.subtitle}</p>
          <p className="text-gray-600 text-sm mt-1">{lesson.description}</p>
        </div>

        {/* ── PLAYER DE ÁUDIO ── */}
        <Card className="p-5 mb-6 bg-gradient-to-r from-gray-900 to-gray-800 border-0 rounded-2xl text-white">
          <audio
            ref={audioRef}
            src={audioSources[currentSrcIdx] || ""}
            onTimeUpdate={() => setAudioProgress(audioRef.current?.currentTime || 0)}
            onLoadedMetadata={() => { setAudioDuration(audioRef.current?.duration || 0); if(audioRef.current) audioRef.current.playbackRate = audioSpeed; }}
            onEnded={() => setAudioPlaying(false)}
            onError={handleAudioError}
            preload="metadata"
          />

          {!audioError ? (
            <>
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={toggleAudio}
                  className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all flex-shrink-0"
                >
                  {audioPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                </button>
                <div className="flex-1">
                  <p className="text-sm font-bold truncate">{lesson.title} — {lesson.subtitle}</p>
                  <p className="text-xs text-gray-400">{catLabel} · {lesson.durationMin} min</p>
                </div>
              </div>
              <div
                className="h-2 bg-white/20 rounded-full cursor-pointer mb-2"
                onClick={seekAudio}
              >
                <div
                  className="h-full bg-purple-400 rounded-full transition-all"
                  style={{ width: audioDuration ? `${(audioProgress / audioDuration) * 100}%` : "0%" }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mb-3">
                <span>{formatTime(audioProgress)}</span>
                <span>{formatTime(audioDuration)}</span>
              </div>
              {/* Controlo de velocidade */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-gray-400 flex-shrink-0">Vel.</span>
                {SPEEDS.map(s => (
                  <button key={s} onClick={() => changeSpeed(s)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      audioSpeed === s
                        ? "bg-purple-600 text-white shadow"
                        : "bg-white/10 text-gray-400 hover:bg-white/20"
                    }`}>
                    {s}×
                  </button>
                ))}
              </div>
            </>
          ) : (
            /* TTS fallback — lê vocabulário em inglês via Web Speech API */
            <>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 bg-blue-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <Volume2 className="w-4 h-4 text-blue-300" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">Pronúncia do Vocabulário</p>
                  <p className="text-xs text-blue-300">Síntese de voz · {lesson.vocab.length} palavras</p>
                </div>
                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-medium">TTS</span>
              </div>

              {lesson.vocab.length > 0 ? (
                <>
                  <button
                    onClick={ttsPlaying ? stopTts : speakVocab}
                    className={`w-full mt-3 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm ${
                      ttsPlaying
                        ? "bg-red-500/80 hover:bg-red-500/100 text-white"
                        : "bg-blue-500/80 hover:bg-blue-500/100 text-white"
                    }`}
                  >
                    {ttsPlaying ? (
                      <><Pause className="w-4 h-4" /> Parar</>
                    ) : (
                      <><Play className="w-4 h-4" /> {ttsProgress === 100 ? "Repetir Pronúncia" : "Ouvir Pronúncia"}</>
                    )}
                  </button>
                  <div className="mt-3 h-1.5 bg-white/20 rounded-full">
                    <div
                      className="h-full bg-blue-400 rounded-full transition-all duration-300"
                      style={{ width: `${ttsProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{ttsPlaying ? "A reproduzir..." : ttsProgress === 100 ? "Concluído" : "Pronto para ouvir"}</span>
                    <span>{lesson.vocab.length} palavras</span>
                  </div>
                </>
              ) : (
                <p className="text-xs text-gray-400 mt-3 text-center">
                  Sem vocabulário para reproduzir nesta lição.
                </p>
              )}
            </>
          )}
        </Card>

        {/* ── EXERCÍCIOS ── */}
        <Card className="p-4 sm:p-6 border-0 shadow-sm rounded-2xl bg-white">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                {lesson.exercises[exerciseIdx].type === "mc" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                    <BookOpen className="w-3 h-3" /> Escolha Múltipla
                  </span>
                )}
                {lesson.exercises[exerciseIdx].type === "listen" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                    <Headphones className="w-3 h-3" /> Ouvir & Repetir
                  </span>
                )}
                {lesson.exercises[exerciseIdx].type === "fill" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                    <Mic className="w-3 h-3" /> Preencher Lacuna
                  </span>
                )}
                <span className="text-xs text-gray-400 font-medium">
                  {exerciseIdx + 1}/{lesson.exercises.length}
                </span>
              </div>
              <p className="text-xs text-gray-400 pl-0.5">
                {lesson.exercises[exerciseIdx].type === "mc" && "Lê a pergunta e escolhe a melhor resposta"}
                {lesson.exercises[exerciseIdx].type === "listen" && "Ouve com atenção e repete em voz alta"}
                {lesson.exercises[exerciseIdx].type === "fill" && "Escolhe a palavra certa para completar"}
              </p>
            </div>
            <button
              onClick={handleNext}
              className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 ml-3 flex-shrink-0"
            >
              Pular <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>

          {renderExercise(lesson.exercises[exerciseIdx])}
        </Card>

        {/* Vocabulário (colapsável ao fundo) */}
        {lesson.vocab.length > 0 && (
          <Card className="p-5 mt-4 border-0 shadow-sm rounded-2xl bg-white">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Vocabulário desta lição</p>
            <div className="grid grid-cols-2 gap-2">
              {lesson.vocab.map((v) => (
                <div key={v.en} className="p-2.5 bg-purple-50 rounded-lg">
                  <p className="font-semibold text-sm text-gray-900">{v.en}</p>
                  <p className="text-xs text-gray-500">{v.pt}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
