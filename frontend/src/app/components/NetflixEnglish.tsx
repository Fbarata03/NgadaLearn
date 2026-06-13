/* ═══════════════════════════════════════════════════════════════════
   NgadaLearn — Netflix do Inglês
   Canais curados de YouTube organizados por nível · estilo Netflix
   ═══════════════════════════════════════════════════════════════════ */

import React, { useState } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";

/* ── Tipos ─────────────────────────────────────────────────────────── */
interface Video {
  id: string;
  title: string;
  duration?: string;
}
interface Channel {
  id: string;
  name: string;
  handle: string;
  badge: string;
  badgeColor: string;
  accent: string;
  description: string;
  emoji: string;
  videos: Video[];
}

/* ── Catálogo curado — IDs reais extraídos via RSS ──────────────────── */
const CHANNELS: Channel[] = [
  {
    id: "everyday-english",
    name: "Everyday English Education",
    handle: "@EverydayEnglishEducation",
    badge: "B1–C1",
    badgeColor: "#4ade80",
    accent: "#4ade80",
    emoji: "🟢",
    description: "Conversações avançadas do dia a dia para melhorar o speaking",
    videos: [
      { id: "NLjO7lnf6_Y", title: "Advanced Daily English Conversations to Improve English Speaking Practice" },
      { id: "H8qoqu4OZCc", title: "Advanced Daily English Conversations (Improve English Speaking)" },
      { id: "oySsPgAbmSc", title: "Advanced Daily English Conversations (Improve English Speaking)" },
      { id: "EGthm68UkHQ", title: "Advanced Daily English Conversations (English Speaking Practice)" },
      { id: "Sm4SytQDY4w", title: "Advanced Daily English Conversations to Improve English Speaking" },
      { id: "sFgZCDFZbNs", title: "Advanced Daily English Conversations (English Speaking Practice)" },
      { id: "xzGL4nvkMP0", title: "Advanced Daily English Conversations (English Speaking Practice)" },
      { id: "QEtg2RpY05c", title: "Advanced Daily English Conversations (Improve English Speaking)" },
      { id: "Im-_l711mvY", title: "Advanced Daily English Conversations to Improve English Speaking" },
      { id: "fALqlRtIUdc", title: "Advanced Daily English Conversations to Improve English Speaking" },
      { id: "_VuSmeD05Tw", title: "Advanced English Conversations to Improve English Speaking" },
      { id: "kdgIvY5T81I", title: "Advanced English Conversations (Improve English Speaking)" },
      { id: "6klRe4dydz4", title: "Advanced Daily English Conversations to Improve English Speaking" },
      { id: "GAVL_4UkpMY", title: "Advanced English Conversations to Improve English Speaking" },
      { id: "YRJ-o70Lidk", title: "Advanced English Conversations (Improve English Speaking)" },
      { id: "JGZzCNZDsek", title: "Advanced Daily English Conversations Practice" },
      { id: "OrXKUg4K9A0", title: "Advanced Daily English Conversations Practice" },
      { id: "hlpCsjyJlFQ", title: "Advanced Daily English Conversations Practice" },
      { id: "Euk_qyca7jM", title: "Advanced Daily English Conversations Practice" },
      { id: "nbVUPgEq7GE", title: "Advanced Daily English Conversations Practice" },
      { id: "lrRFmf7dV5Q", title: "Advanced Daily English Conversations Practice" },
      { id: "o_5YpgW2wHQ", title: "Advanced Daily English Conversations Practice" },
      { id: "EajO9ijqBRQ", title: "Advanced Daily English Conversations Practice" },
      { id: "M9llvzQZKME", title: "Advanced Daily English Conversations Practice" },
      { id: "ZrfzGnrNsI4", title: "Advanced Daily English Conversations Practice" },
      { id: "TElaof5TnjE", title: "Advanced Daily English Conversations Practice" },
      { id: "O9ARUuYqUkI", title: "Advanced Daily English Conversations Practice" },
      { id: "P20fOMK4Lzc", title: "Advanced Daily English Conversations Practice" },
      { id: "VX8HXrG0hIk", title: "Advanced Daily English Conversations Practice" },
      { id: "AVhNYBe-K3s", title: "Advanced Daily English Conversations Practice" },
    ],
  },
  {
    id: "proactive-english",
    name: "Proactive English Practice",
    handle: "@ProactiveEnglishPractice",
    badge: "A1–B1",
    badgeColor: "#60a5fa",
    accent: "#60a5fa",
    emoji: "🔵",
    description: "Conversação real e devagar para iniciantes — inglês do dia a dia",
    videos: [
      { id: "duApVrtMH0k", title: "Real-Life English Speaking Practice | Slow English for Beginners" },
      { id: "emx2QMF3q64", title: "English Speaking Practice for Beginners | Everyday Real-Life Conversations" },
      { id: "2-daKfdrUfk", title: "English Speaking Practice for Beginners | Real-Life English Conversations" },
      { id: "MKln91sQYFQ", title: "Real-Life English Speaking Practice | Slow Conversations for Beginners" },
      { id: "KwiZqeDYEpI", title: "English Speaking Practice for Beginners | Real-Life English Conversations" },
      { id: "wqRIlZv6lMU", title: "English Speaking Practice for Beginners | Simple Real-Life Conversations" },
      { id: "DoFSjJ0rJQM", title: "Real-Life English Conversations | Speaking Practice with Slow English" },
      { id: "z0xujNoKr-M", title: "Daily English Conversations | Slow Real-Life Speaking Practice" },
      { id: "1h3Odqy4jOU", title: "English Speaking Practice for Beginners | Mark & Lisa's Real-Life Story" },
      { id: "98XzBVnB4rw", title: "Real-Life English Speaking Practice | Slow English for Beginners" },
      { id: "vASweKL6Uow", title: "Simple English Conversations | Real Life Speaking for Beginners" },
      { id: "4PVoycHe8pw", title: "Simple English Conversations | Real Life Speaking for Beginners" },
      { id: "3slcNn8hIAU", title: "English Conversation for Beginners | Slow Listening and Speaking Practice" },
      { id: "1hm1h-0yzko", title: "Learn English Speaking Easily | Daily Conversations for Beginners" },
      { id: "Kd3PcqZPKQ0", title: "English Conversations for Beginners | Slow Real-Life Speaking Practice" },
      { id: "bKQ0o_bsh1E", title: "English Speaking Practice — Real-Life Conversations" },
      { id: "PUdGPKEZnRI", title: "English Speaking Practice — Real-Life Conversations" },
      { id: "zu-YfU5UNX8", title: "English Speaking Practice — Real-Life Conversations" },
      { id: "AGnQOmTX-_w", title: "English Speaking Practice — Real-Life Conversations" },
      { id: "mOiK6H7j32Y", title: "English Speaking Practice — Real-Life Conversations" },
      { id: "EEoh5k2wAEU", title: "English Speaking Practice — Real-Life Conversations" },
      { id: "5Q0KDOKfn-s", title: "English Speaking Practice — Real-Life Conversations" },
      { id: "iEzbXDBiJKw", title: "English Speaking Practice — Real-Life Conversations" },
      { id: "Me-F5NDHDew", title: "English Speaking Practice — Real-Life Conversations" },
      { id: "HmR4M1ODZYo", title: "English Speaking Practice — Real-Life Conversations" },
      { id: "hHmZxmeoCYE", title: "English Speaking Practice — Real-Life Conversations" },
      { id: "bsU7yd3t3Ys", title: "English Speaking Practice — Real-Life Conversations" },
      { id: "Xs4ECoM9IFY", title: "English Speaking Practice — Real-Life Conversations" },
      { id: "R1ObKmiwTdA", title: "English Speaking Practice — Real-Life Conversations" },
      { id: "OpWBP_iMUUM", title: "English Speaking Practice — Real-Life Conversations" },
    ],
  },
  {
    id: "teacher-abelhinha",
    name: "Teacher Abelhinha",
    handle: "@TeacherAbelhinha",
    badge: "A1–A2",
    badgeColor: "#f87171",
    accent: "#f87171",
    emoji: "🔴",
    description: "Inglês lento e fácil para lusófonos — listening e conversação natural",
    videos: [
      { id: "nTlZXfstM7I", title: "Um dia na minha vida 🌅 | Pratique a Conversação em Inglês | Listening Lento A1–A2" },
      { id: "r3I046BgFPA", title: "Quando comecei a pensar em inglês naturalmente ✨ | Inglês Fácil para Iniciantes A1–A2" },
      { id: "TXndGWUZfgw", title: "Nosso fim de semana ☀️ | Inglês Lento e Fácil para Iniciantes A1–A2" },
      { id: "Uwl8xi4ZP9M", title: "Eu tinha medo de falar inglês 😶 | História Lenta em Inglês para Treinar o Listening" },
      { id: "_e7C8Cs-AWU", title: "Inglês britânico x inglês americano | Inglês Lento para Iniciantes" },
      { id: "1R1wm9f0gcc", title: "Minha primeira estadia em um hotel 🏨 | Inglês para Iniciantes A1–A2" },
      { id: "5UB6duNEErg", title: "Meu dia como professora 📚 | Inglês Lento e Natural para Conversação A1–A2" },
      { id: "jP3YksG6HKU", title: "Problemas na estrada 🚘 | Inglês Lento e Fácil para Iniciantes A1–A2" },
      { id: "serh5xpbfGo", title: "Comparativos e Superlativos na prática 📚 | Inglês Lento nível A2" },
      { id: "DzRJc6NkBiQ", title: "Tinha alguém na minha casa? 😳 | História curta em Inglês A1–A2" },
      { id: "mtbuSF5_1I0", title: "Pedindo direções 📍 | Inglês Lento e Fácil para Iniciantes A1–A2" },
      { id: "5R6SDUtFUvE", title: "Quem deixou flores pra mim? 💐 | História Lenta em Inglês para Iniciantes" },
      { id: "SFvPJcl_Le4", title: "Como falar sobre clima e estações do ano em inglês 🌦️ | Inglês Lento A1–A2" },
      { id: "feTT1l9Ah0w", title: "Resolvendo problemas do dia a dia 🔧 | Inglês Lento e Fácil A1–A2" },
      { id: "o2zQT4ssV9Q", title: "Conhecendo os lugares da cidade 🏢 | Inglês Lento para Iniciantes" },
      { id: "snKlPruFUqo", title: "Inglês Lento e Fácil para Iniciantes A1–A2" },
      { id: "6IlVzmHCpOA", title: "Inglês Lento e Fácil para Iniciantes A1–A2" },
      { id: "wQ4-Z9CSFLw", title: "Inglês Lento e Fácil para Iniciantes A1–A2" },
      { id: "qtpnFAaIDKQ", title: "Inglês Lento e Fácil para Iniciantes A1–A2" },
      { id: "5BVDcf9G8AY", title: "Inglês Lento e Fácil para Iniciantes A1–A2" },
      { id: "ecRnHsJUoo8", title: "Inglês Lento e Fácil para Iniciantes A1–A2" },
      { id: "PfgkG9poKGA", title: "Inglês Lento e Fácil para Iniciantes A1–A2" },
      { id: "ZdVfCLNPW5M", title: "Inglês Lento e Fácil para Iniciantes A1–A2" },
      { id: "r1Y8d3m20ZA", title: "Inglês Lento e Fácil para Iniciantes A1–A2" },
      { id: "IdUc3wzI4p0", title: "Inglês Lento e Fácil para Iniciantes A1–A2" },
      { id: "JXY75vz-CfU", title: "Inglês Lento e Fácil para Iniciantes A1–A2" },
      { id: "eMJ7pvAdd-M", title: "Inglês Lento e Fácil para Iniciantes A1–A2" },
      { id: "dRArltIX_N4", title: "Inglês Lento e Fácil para Iniciantes A1–A2" },
      { id: "zMsYiA7z1DQ", title: "Inglês Lento e Fácil para Iniciantes A1–A2" },
      { id: "cwne2zAaMKY", title: "Inglês Lento e Fácil para Iniciantes A1–A2" },
    ],
  },
  {
    id: "english-speaking-courses",
    name: "English Speaking Courses",
    handle: "@EnglishSpeakingCourses",
    badge: "A2–B1",
    badgeColor: "#fb923c",
    accent: "#fb923c",
    emoji: "🟠",
    description: "Conversações reais do dia a dia — diálogos para falar inglês naturalmente",
    videos: [
      { id: "m85MeUJCYac", title: "Daily English Conversations About Emergencies & Safety | Real-Life English Practice (A2–B1)" },
      { id: "adN2Pi1wwtw", title: "Real-life English Conversations to Speak English Naturally | English Speaking Practice (A2-B1)" },
      { id: "Ow82Mw5g8Oc", title: "2 Hours of Daily English Conversations for English Speaking Practice | Real-life Dialogues" },
      { id: "g90FsEKaSPw", title: "2 Hours of Daily English Conversations for English Speaking Practice | Real-life Dialogues" },
      { id: "JU3-OoSLQsM", title: "Common English Mistakes in Daily Conversations | Speak English More Naturally (A2-B1)" },
      { id: "-UlsGB9hj-Q", title: "75 Minutes of Conversations to Speak Like a Native | Real-life English Dialogues for Beginners" },
      { id: "TmChuQWgiEs", title: "Daily Routines English Conversations for English Speaking Practice | English Story for Speaking" },
      { id: "NK-T0X1tO9Y", title: "Learn English Speaking Practice for Beginners | Real-life English Story (A1-A2)" },
      { id: "_fdVSi36-Cg", title: "Practice English Speaking with Shadowing Real-life Conversations | Improve Your English Skills" },
      { id: "6sj7CfJrCNk", title: "30 Minutes of Daily English Conversations for Beginners | English Speaking Practice" },
      { id: "rJWs9AW5eQU", title: "Learn English Conversations for Beginners | Listen and Repeat English Speaking Practice (A2-B1)" },
      { id: "xvwX6hA12gk", title: "Learn English Speaking Practice for Beginners | Daily Speaking Conversations for Everyday Life" },
      { id: "T2XzQz_DQCU", title: "Common Mistakes in Daily English Conversations | Are you USING It Wrong?" },
      { id: "GO4vBoiAFsc", title: "Practice English Speaking with Daily English Conversations | Speaking practice for Beginners" },
      { id: "-iR47SMAreA", title: "100 Daily English Conversations for Everyday Situations | Real-life Dialogues for Beginners" },
      { id: "6Dd48Z0jZdw", title: "Daily English Conversations for Speaking Practice" },
      { id: "RJUj82KG2PM", title: "Daily English Conversations for Speaking Practice" },
      { id: "feHt3D2pv80", title: "Daily English Conversations for Speaking Practice" },
      { id: "rYImtQIqSEw", title: "Daily English Conversations for Speaking Practice" },
      { id: "jBChsVZ8cyo", title: "Daily English Conversations for Speaking Practice" },
      { id: "no7dB4439bc", title: "Daily English Conversations for Speaking Practice" },
      { id: "zt84R19pQl8", title: "Daily English Conversations for Speaking Practice" },
      { id: "n4q-PNAZGT0", title: "Daily English Conversations for Speaking Practice" },
      { id: "o4QM0lLiD4s", title: "Daily English Conversations for Speaking Practice" },
      { id: "-fonc7XSZ0U", title: "Daily English Conversations for Speaking Practice" },
      { id: "LTLj1gRqzU8", title: "Daily English Conversations for Speaking Practice" },
      { id: "qd6ghOsVIXU", title: "Daily English Conversations for Speaking Practice" },
      { id: "YcXA2Km99iE", title: "Daily English Conversations for Speaking Practice" },
      { id: "nVIdoeWeOhU", title: "Daily English Conversations for Speaking Practice" },
      { id: "qWgjx-Q9iwY", title: "Daily English Conversations for Speaking Practice" },
    ],
  },
];

const FEATURED = CHANNELS[0].videos[0];

/* ── Thumbnail helpers ──────────────────────────────────────────────── */
function thumb(id: string) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

/* ══════════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════════════════════════════════════ */
export function NetflixEnglish() {
  const [activeVideo, setActiveVideo] = useState<{ id: string; title: string } | null>(null);
  const scrollRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

  function scroll(id: string, dir: 1 | -1) {
    const el = scrollRefs.current[id];
    if (el) el.scrollBy({ left: dir * 680, behavior: "smooth" });
  }

  return (
    <div style={{
      minHeight: "100dvh",
      background: "#0a0a0f",
      color: "#fff",
      fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
      paddingBottom: "env(safe-area-inset-bottom)",
    }}>

      {/* ── Header ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "linear-gradient(180deg,rgba(10,10,15,1) 0%,rgba(10,10,15,.85) 100%)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,.06)",
        paddingTop: "env(safe-area-inset-top)",
      }}>
        <div style={{ height: 54, display: "flex", alignItems: "center", padding: "0 16px", gap: 12 }}>
          <Link to="/lessons" style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
            color: "rgba(255,255,255,.7)", textDecoration: "none",
            background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.1)",
          }}>
            <ChevronLeft size={18} strokeWidth={2.5} />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
            <span style={{ fontSize: 22 }}>🎬</span>
            <span style={{ fontSize: 16, fontWeight: 900, letterSpacing: "-.3px" }}>
              Netflix do Inglês
            </span>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 50,
              background: "rgba(229,9,20,.2)", color: "#f87171",
              border: "1px solid rgba(229,9,20,.3)", letterSpacing: ".5px",
            }}>GRÁTIS</span>
          </div>
        </div>
      </div>

      {/* ── Hero ── */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/7", maxHeight: 420, overflow: "hidden" }}>
        <img
          src={`https://img.youtube.com/vi/${FEATURED.id}/maxresdefault.jpg`}
          alt="Featured"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          onError={e => { (e.target as HTMLImageElement).style.opacity = "0"; }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, rgba(10,10,15,.95) 0%, rgba(10,10,15,.5) 50%, transparent 100%)",
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(to top, rgba(10,10,15,1) 0%, transparent 80%)",
          height: "60%",
        }} />
        <div style={{ position: "absolute", bottom: 32, left: 24, maxWidth: 480 }}>
          <span style={{
            display: "inline-block", fontSize: 10, fontWeight: 800,
            background: "#4ade80", color: "#000", borderRadius: 4,
            padding: "3px 8px", marginBottom: 10, letterSpacing: ".5px",
          }}>🟢 A1–A2 · EM DESTAQUE</span>
          <h1 style={{ margin: "0 0 10px", fontSize: "clamp(1.3rem,3vw,2rem)", fontWeight: 900, lineHeight: 1.2 }}>
            English Easy Practice
          </h1>
          <p style={{ margin: "0 0 16px", fontSize: 13, color: "rgba(255,255,255,.65)", lineHeight: 1.5, maxWidth: 380 }}>
            Histórias simples em inglês americano para principiantes. Ouve, repete e aprende no teu ritmo.
          </p>
          <button
            onClick={() => setActiveVideo(FEATURED)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#fff", color: "#000",
              border: "none", borderRadius: 8, padding: "10px 22px",
              fontSize: 14, fontWeight: 800, cursor: "pointer",
              boxShadow: "0 4px 20px rgba(0,0,0,.5)",
            }}>
            <Play size={16} fill="#000" /> Ver Agora
          </button>
        </div>
      </div>

      {/* ── Linhas de canais ── */}
      <div style={{ padding: "8px 0 32px" }}>
        {CHANNELS.map(ch => (
          <div key={ch.id} style={{ marginBottom: 40 }}>

            {/* Cabeçalho da linha */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 20px", marginBottom: 14 }}>
              <span style={{ fontSize: 18 }}>{ch.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 15, fontWeight: 900, letterSpacing: "-.2px" }}>{ch.name}</span>
                  <span style={{
                    fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 50,
                    background: `${ch.badgeColor}20`, color: ch.badgeColor,
                    border: `1px solid ${ch.badgeColor}40`, letterSpacing: ".5px",
                  }}>{ch.badge}</span>
                </div>
                <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,.38)", marginTop: 2 }}>
                  {ch.description}
                </p>
              </div>
              <span
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  fontSize: 11, fontWeight: 700, color: ch.accent,
                  flexShrink: 0,
                  padding: "5px 12px", borderRadius: 50,
                  background: `${ch.accent}14`, border: `1px solid ${ch.accent}30`,
                }}>
                {ch.videos.length} vídeos
              </span>
            </div>

            {/* Cards com scroll */}
            <div style={{ position: "relative" }}>
              {/* Seta esquerda */}
              <button
                onClick={() => scroll(ch.id, -1)}
                style={{
                  position: "absolute", left: 4, top: "50%", transform: "translateY(-50%)",
                  zIndex: 20, width: 36, height: 36, borderRadius: "50%",
                  background: "rgba(10,10,15,.9)", border: "1px solid rgba(255,255,255,.15)",
                  color: "#fff", cursor: "pointer", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,.5)",
                }}>
                <ChevronLeft size={16} />
              </button>

              {/* Scroll row */}
              <div
                ref={el => { scrollRefs.current[ch.id] = el; }}
                style={{
                  display: "flex", gap: 10, overflowX: "auto", overflowY: "visible",
                  padding: "4px 20px 8px",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}>
                {ch.videos.map(v => (
                  <VideoCard
                    key={v.id}
                    video={v}
                    accent={ch.accent}
                    onPlay={() => setActiveVideo(v)}
                  />
                ))}
              </div>

              {/* Seta direita */}
              <button
                onClick={() => scroll(ch.id, 1)}
                style={{
                  position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)",
                  zIndex: 20, width: 36, height: 36, borderRadius: "50%",
                  background: "rgba(10,10,15,.9)", border: "1px solid rgba(255,255,255,.15)",
                  color: "#fff", cursor: "pointer", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,.5)",
                }}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Modal de vídeo ── */}
      {activeVideo && (
        <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </div>
  );
}

/* ── Card de vídeo ──────────────────────────────────────────────────── */
function VideoCard({ video, accent, onPlay }: {
  video: Video; accent: string; onPlay: () => void;
}) {
  const [hover, setHover] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={onPlay}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        flexShrink: 0, width: "clamp(180px,28vw,260px)",
        borderRadius: 12, overflow: "hidden", cursor: "pointer",
        transform: hover ? "scale(1.05) translateY(-4px)" : "scale(1)",
        transition: "all .22s cubic-bezier(.34,1.56,.64,1)",
        boxShadow: hover ? `0 16px 40px rgba(0,0,0,.6), 0 0 0 2px ${accent}60` : "0 4px 16px rgba(0,0,0,.4)",
        background: "#1a1a2e",
        position: "relative",
      }}>
      {/* Thumbnail */}
      <div style={{ aspectRatio: "16/9", position: "relative", overflow: "hidden" }}>
        {!imgError ? (
          <img
            src={thumb(video.id)}
            alt={video.title}
            onError={() => setImgError(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            background: `linear-gradient(135deg, ${accent}33, rgba(10,10,15,.9))`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28,
          }}>🎬</div>
        )}
        {/* Overlay play */}
        <div style={{
          position: "absolute", inset: 0,
          background: hover ? "rgba(0,0,0,.45)" : "rgba(0,0,0,.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background .2s",
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: hover ? "rgba(255,255,255,.95)" : "rgba(255,255,255,.0)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transform: hover ? "scale(1)" : "scale(0.6)",
            opacity: hover ? 1 : 0,
            transition: "all .2s",
            boxShadow: "0 4px 16px rgba(0,0,0,.4)",
          }}>
            <Play size={18} color="#000" fill="#000" />
          </div>
        </div>
        {/* Duração */}
        {video.duration && (
          <span style={{
            position: "absolute", bottom: 6, right: 8,
            fontSize: 10, fontWeight: 700,
            background: "rgba(0,0,0,.8)", color: "#fff",
            padding: "2px 6px", borderRadius: 4,
          }}>{video.duration}</span>
        )}
      </div>
      {/* Título */}
      <div style={{ padding: "10px 12px 12px" }}>
        <p style={{
          margin: 0, fontSize: 12, fontWeight: 700, lineHeight: 1.4,
          color: hover ? "#fff" : "rgba(255,255,255,.8)",
          overflow: "hidden", display: "-webkit-box",
          WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
        }}>{video.title}</p>
      </div>
    </div>
  );
}

/* ── Modal do player ────────────────────────────────────────────────── */
function VideoModal({ video, onClose }: { video: { id: string; title: string }; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,.88)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 860,
          borderRadius: 18, overflow: "hidden",
          background: "#0f0f18",
          border: "1px solid rgba(255,255,255,.1)",
          boxShadow: "0 40px 100px rgba(0,0,0,.8)",
        }}>
        {/* Barra superior — SEM link para YouTube */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "12px 16px",
          background: "rgba(255,255,255,.04)",
          borderBottom: "1px solid rgba(255,255,255,.07)",
        }}>
          <span style={{ fontSize: 14 }}>🎬</span>
          <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,.85)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {video.title}
          </span>
          <span style={{
            fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 50,
            background: "rgba(74,222,128,.15)", color: "#4ade80",
            border: "1px solid rgba(74,222,128,.25)", letterSpacing: ".3px",
            flexShrink: 0,
          }}>NgadaLearn</span>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)",
              borderRadius: "50%", width: 30, height: 30, cursor: "pointer",
              color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
            <X size={14} />
          </button>
        </div>
        {/* Player com overlays para bloquear cliques em links do YouTube */}
        <div style={{ aspectRatio: "16/9", position: "relative" }}>
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
            style={{ width: "100%", height: "100%", border: "none", display: "block" }}
            title={video.title}
            sandbox="allow-scripts allow-same-origin allow-presentation"
          />
          {/* Overlay: bloqueia o título clicável do YouTube (barra superior da iframe) */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0,
            height: "14%", zIndex: 10, cursor: "default",
          }} />
          {/* Overlay: bloqueia o logo/watermark do YouTube (canto inferior direito) */}
          <div style={{
            position: "absolute", bottom: "6%", right: 0,
            width: "16%", height: "13%", zIndex: 10, cursor: "default",
          }} />
        </div>
      </div>
    </div>
  );
}
