import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { CONVERSATIONS, type DialogueLine } from "../data/conversationsData";
import {
  ChevronLeft, ChevronRight, Volume2, VolumeX, Trophy,
  BookOpen, Lightbulb, MessageCircle, Star, CheckCircle2,
  RotateCcw, Home,
} from "lucide-react";

/* ── Utilitário TTS ── */
function speak(text: string, onEnd?: () => void) {
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = "en-US";
  utt.rate = 0.85;

  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(
    (v) =>
      v.lang.startsWith("en") &&
      (v.name.includes("Google") ||
        v.name.includes("Microsoft") ||
        v.name.includes("Samantha") ||
        v.name.includes("Alex"))
  );
  if (preferred) utt.voice = preferred;

  if (onEnd) utt.onend = onEnd;
  window.speechSynthesis.speak(utt);
}

/* ══════════════════════════════════════════
   CARD de uma linha do diálogo
   ══════════════════════════════════════════ */
function DialogueCard({
  line,
  index,
  current,
  revealed,
  onReveal,
}: {
  line: DialogueLine;
  index: number;
  current: number;
  revealed: boolean;
  onReveal: () => void;
}) {
  const isCurrent = index === current;
  const isPast = index < current;

  if (!isCurrent && !isPast) return null;

  const isLeft = index % 2 === 0;

  return (
    <div
      className={`flex ${isLeft ? "justify-start" : "justify-end"} mb-3 transition-all duration-300`}
    >
      <div className={`max-w-[85%] ${isLeft ? "items-start" : "items-end"} flex flex-col gap-1`}>
        <span className="text-xs font-bold text-gray-500 px-1">
          {line.speaker}
        </span>
        <div
          className={`rounded-2xl px-4 py-3 shadow-sm ${
            isLeft
              ? "bg-white border border-gray-200 rounded-tl-sm"
              : "bg-purple-600 text-white rounded-tr-sm"
          } ${isCurrent ? "ring-2 ring-purple-400 ring-offset-1" : ""}`}
        >
          <p className={`font-semibold text-sm mb-1 ${isLeft ? "text-gray-900" : "text-white"}`}>
            {line.en}
          </p>
          {revealed ? (
            <p className={`text-xs ${isLeft ? "text-gray-500" : "text-purple-200"}`}>
              {line.pt}
            </p>
          ) : isCurrent ? (
            <button
              onClick={onReveal}
              className={`text-xs underline ${isLeft ? "text-purple-600" : "text-purple-200"} hover:opacity-80`}
            >
              Ver tradução
            </button>
          ) : (
            <p className={`text-xs ${isLeft ? "text-gray-500" : "text-purple-200"}`}>
              {line.pt}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   ECRÃ DE CONCLUSÃO
   ══════════════════════════════════════════ */
function CompletionScreen({
  conv,
  onRestart,
}: {
  conv: (typeof CONVERSATIONS)[0];
  onRestart: () => void;
}) {
  const nextConv = CONVERSATIONS.find((c) => c.number === conv.number + 1);

  return (
    <div className="text-center py-8 px-4">
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="text-2xl font-black text-gray-900 mb-2">
        Conversa Concluída!
      </h2>
      <p className="text-gray-600 mb-6">
        Completaste a conversa <strong>"{conv.title}"</strong>
      </p>

      {/* Key phrases resumo */}
      <Card className="p-5 mb-6 border-purple-200 bg-purple-50 text-left">
        <h3 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
          <Star className="w-4 h-4" />
          Frases-chave desta conversa
        </h3>
        <div className="space-y-2">
          {conv.keyPhrases.map((kp, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-gray-900">{kp.en}</p>
                <p className="text-xs text-gray-600">{kp.pt}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Tip */}
      <Card className="p-4 mb-6 bg-yellow-50 border-yellow-200 text-left">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700">{conv.tip}</p>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="outline" onClick={onRestart} className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          Repetir
        </Button>
        {nextConv && (
          <Link to={`/conversations/${nextConv.id}`}>
            <Button className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2 w-full sm:w-auto">
              Próxima Conversa
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        )}
        <Link to="/lessons">
          <Button variant="outline" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Voltar às Lições
          </Button>
        </Link>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ══════════════════════════════════════════ */
export function ConversationPlayer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const conv = CONVERSATIONS.find((c) => c.id === id);

  const [currentLine, setCurrentLine] = useState(0);
  const [revealedLines, setRevealedLines] = useState<Set<number>>(new Set());
  const [autoRead, setAutoRead] = useState(true);
  const [done, setDone] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-TTS quando muda de linha
  useEffect(() => {
    if (!conv || done) return;
    if (autoRead && currentLine < conv.lines.length) {
      const line = conv.lines[currentLine];
      speak(line.en);
    }
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentLine, autoRead, conv, done]);

  // Carrega vozes
  useEffect(() => {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }, []);

  if (!conv) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Conversa não encontrada.</p>
          <Link to="/lessons">
            <Button>Voltar às Lições</Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalLines = conv.lines.length;
  const progress = Math.round((currentLine / totalLines) * 100);

  function revealTranslation() {
    setRevealedLines((prev) => new Set([...prev, currentLine]));
  }

  function handleNext() {
    if (currentLine < totalLines - 1) {
      setCurrentLine((n) => n + 1);
    } else {
      window.speechSynthesis.cancel();
      setDone(true);
    }
  }

  function handlePrev() {
    if (currentLine > 0) {
      setCurrentLine((n) => n - 1);
    }
  }

  function handleReplay() {
    if (!done) speak(conv.lines[currentLine].en);
  }

  function handleRestart() {
    setCurrentLine(0);
    setRevealedLines(new Set());
    setDone(false);
  }

  const prevConv = CONVERSATIONS.find((c) => c.number === conv.number - 1);
  const nextConv = CONVERSATIONS.find((c) => c.number === conv.number + 1);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ── Header ── */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 max-w-3xl">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => navigate("/lessons")}
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Lições
            </button>
            <div className="text-center flex-1 min-w-0">
              <p className="text-xs text-purple-600 font-bold">
                Conversa {conv.number} de {CONVERSATIONS.length}
              </p>
              <p className="font-bold text-gray-900 text-sm truncate">{conv.title}</p>
            </div>
            <button
              onClick={() => setAutoRead((v) => !v)}
              title={autoRead ? "Desligar leitura automática" : "Ligar leitura automática"}
              className={`p-2 rounded-lg transition-colors ${
                autoRead ? "bg-purple-100 text-purple-600" : "text-gray-400 hover:bg-gray-100"
              }`}
            >
              {autoRead ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {/* Barra de progresso */}
          {!done && (
            <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Info da conversa */}
        {!done && (
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
              {conv.level}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
              {conv.topic}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
              {totalLines} linhas
            </span>
          </div>
        )}

        {done ? (
          <CompletionScreen conv={conv} onRestart={handleRestart} />
        ) : (
          <>
            {/* ── Chat ── */}
            <div className="mb-6 min-h-[320px]">
              {conv.lines.map((line, i) => (
                <DialogueCard
                  key={i}
                  line={line}
                  index={i}
                  current={currentLine}
                  revealed={revealedLines.has(i)}
                  onReveal={revealTranslation}
                />
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* ── Controlos ── */}
            <div className="sticky bottom-4">
              <Card className="p-4 border-0 shadow-lg bg-white">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrev}
                    disabled={currentLine === 0}
                    className="flex-shrink-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  <div className="flex-1 text-center">
                    <p className="text-xs text-gray-500 mb-0.5">Linha actual</p>
                    <p className="font-bold text-sm text-gray-900">
                      {conv.lines[currentLine].speaker}:
                    </p>
                    <button
                      onClick={handleReplay}
                      className="flex items-center gap-1.5 mx-auto mt-1 text-xs text-purple-600 hover:text-purple-800 transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      Ouvir novamente
                    </button>
                  </div>

                  <Button
                    size="sm"
                    onClick={handleNext}
                    className="bg-purple-600 hover:bg-purple-700 flex-shrink-0"
                  >
                    {currentLine === totalLines - 1 ? (
                      <>
                        <Trophy className="w-4 h-4 mr-1" />
                        Concluir
                      </>
                    ) : (
                      <>
                        Próximo
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>

                {/* Linha actual */}
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-start gap-2">
                    <MessageCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {conv.lines[currentLine].en}
                      </p>
                      {revealedLines.has(currentLine) ? (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {conv.lines[currentLine].pt}
                        </p>
                      ) : (
                        <button
                          onClick={revealTranslation}
                          className="text-xs text-purple-600 underline mt-0.5 hover:text-purple-800"
                        >
                          Mostrar tradução
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* ── Dica ── */}
            <Card className="mt-4 p-4 bg-yellow-50 border-yellow-200">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-yellow-800 mb-0.5">Dica</p>
                  <p className="text-xs text-gray-700">{conv.tip}</p>
                </div>
              </div>
            </Card>

            {/* ── Frases-chave ── */}
            <Card className="mt-4 p-4">
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-600" />
                Frases-Chave
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {conv.keyPhrases.map((kp, i) => (
                  <div key={i} className="p-2.5 bg-purple-50 rounded-lg">
                    <p className="text-sm font-bold text-purple-800">{kp.en}</p>
                    <p className="text-xs text-gray-600">{kp.pt}</p>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {/* Navegação entre conversas */}
        {!done && (
          <div className="flex justify-between mt-6 text-sm">
            {prevConv ? (
              <Link to={`/conversations/${prevConv.id}`} className="text-gray-500 hover:text-purple-600 flex items-center gap-1">
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </Link>
            ) : <span />}
            {nextConv ? (
              <Link to={`/conversations/${nextConv.id}`} className="text-gray-500 hover:text-purple-600 flex items-center gap-1">
                Próxima
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : <span />}
          </div>
        )}
      </div>
    </div>
  );
}
