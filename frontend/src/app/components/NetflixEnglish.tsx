/* ═══════════════════════════════════════════════════════════════════
   NgadaLearn — Netflix do Inglês
   Canais curados de YouTube organizados por nível · estilo Netflix
   ═══════════════════════════════════════════════════════════════════ */

import React, { useState } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight, Play, X, ExternalLink } from "lucide-react";

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

/* ── Catálogo curado ────────────────────────────────────────────────── */
const CHANNELS: Channel[] = [
  {
    id: "easy-practice",
    name: "English Easy Practice",
    handle: "@EnglishEasyPractice",
    badge: "A1–A2",
    badgeColor: "#4ade80",
    accent: "#4ade80",
    emoji: "🟢",
    description: "Histórias curtas para ouvir e responder — perfeito para iniciantes",
    videos: [
      { id: "kHyGS3Cv1WE", title: "Daily English Conversations", duration: "8:12" },
      { id: "M6ij2dlZbAU", title: "English for Beginners — Story 1", duration: "6:34" },
      { id: "Q2DP5hbO7BE", title: "Simple English Dialogues", duration: "7:45" },
      { id: "4Bk3d1RNKMU", title: "Learn English Through Stories", duration: "9:20" },
      { id: "Xm4PkM7PJBQ", title: "Easy English Listening Practice", duration: "5:55" },
      { id: "dqmGatXHqFU", title: "Everyday English Phrases", duration: "6:10" },
      { id: "9bZkp7q19f0", title: "English Conversation for Beginners", duration: "8:00" },
      { id: "OTR9miGMSAw", title: "Short English Stories A1", duration: "7:30" },
    ],
  },
  {
    id: "english-lucy",
    name: "English with Lucy",
    handle: "@EnglishwithLucy",
    badge: "A2–B1",
    badgeColor: "#60a5fa",
    accent: "#60a5fa",
    emoji: "🔵",
    description: "Pronúncia britânica, gramática e vocabulário com Lucy",
    videos: [
      { id: "rksdQABknQA", title: "25 Phrases Native Speakers Use", duration: "14:22" },
      { id: "VnmNRLxHlgw", title: "British vs American English — 100 Differences", duration: "18:45" },
      { id: "gHkKBQnBxXc", title: "Stop Saying 'Very' — Use These Instead", duration: "12:03" },
      { id: "t-fcrQmKbOg", title: "Fix Your English Pronunciation", duration: "16:30" },
      { id: "HrqX0N5OboQ", title: "10 English Words You're Saying Wrong", duration: "11:18" },
      { id: "F4JDZ7LpbBY", title: "How to Sound More British", duration: "13:55" },
      { id: "s-gCN9SRhTA", title: "English Grammar — Present Perfect", duration: "15:40" },
      { id: "hkOBXvDoApI", title: "Advanced English Vocabulary", duration: "17:00" },
    ],
  },
  {
    id: "bbc-english",
    name: "BBC Learning English",
    handle: "@bbclearningenglish",
    badge: "A2–B2",
    badgeColor: "#f87171",
    accent: "#f87171",
    emoji: "🔴",
    description: "6 Minutos de inglês com a BBC — tópicos reais do mundo",
    videos: [
      { id: "ArnBuAuiLcI", title: "6 Minute English — The Future of Food", duration: "6:00" },
      { id: "7VyXBHmwfOE", title: "6 Minute English — Social Media", duration: "6:00" },
      { id: "K61ZtEfmPys", title: "6 Minute English — Climate Change", duration: "6:00" },
      { id: "O4N7-vHSHuU", title: "BBC English — News Words 2024", duration: "5:30" },
      { id: "jNQXAC9IVRw", title: "The English We Speak — New Words", duration: "3:00" },
      { id: "WRmBChQjZDs", title: "6 Minute Grammar — Conditionals", duration: "6:00" },
      { id: "BmknASGrBXM", title: "English in a Minute — So vs Such", duration: "1:00" },
      { id: "w6gBT7tYsEE", title: "BBC Pronunciation — Silent Letters", duration: "5:00" },
    ],
  },
  {
    id: "tv-series",
    name: "Learn English with TV Series",
    handle: "@LearnEnglishWithTVSeries",
    badge: "B1–B2",
    badgeColor: "#fb923c",
    accent: "#fb923c",
    emoji: "🟠",
    description: "Aprende inglês real com Friends, The Office e outras séries",
    videos: [
      { id: "hzMMHhNqrIE", title: "Learn English with FRIENDS — The One Where…", duration: "12:30" },
      { id: "RIlHFxDoHMk", title: "The Office — Real English Expressions", duration: "10:45" },
      { id: "BRzK2fqR_dI", title: "Breaking Bad — Advanced Vocabulary", duration: "11:20" },
      { id: "5JJQ2yMkJG4", title: "Game of Thrones — Medieval English", duration: "9:55" },
      { id: "NlgmH5q9uNk", title: "Friends — Sarcasm and Humor in English", duration: "13:10" },
      { id: "7EDjQWNFU6c", title: "How I Met Your Mother — Slang Explained", duration: "8:30" },
      { id: "XE_8sENPxiQ", title: "The Crown — Formal British English", duration: "10:00" },
      { id: "OPDJBklADiM", title: "Stranger Things — American English 80s", duration: "9:15" },
    ],
  },
  {
    id: "voa-english",
    name: "VOA Learning English",
    handle: "@VOALearningEnglish",
    badge: "B1–C1",
    badgeColor: "#a78bfa",
    accent: "#a78bfa",
    emoji: "🟣",
    description: "Inglês americano através de notícias reais e programas VOA",
    videos: [
      { id: "p_BpCEsEi0k", title: "VOA — English in a Minute: Idioms", duration: "1:30" },
      { id: "5Xd_zkMSPBQ", title: "Everyday Grammar — Phrasal Verbs", duration: "4:20" },
      { id: "6iRV8liah5A", title: "VOA Learning English — Level 2 Lesson 1", duration: "5:00" },
      { id: "TG6BuIEjxZE", title: "American English Pronunciation Tips", duration: "6:15" },
      { id: "KjfaMjcJFqs", title: "VOA — Words and Their Stories", duration: "3:45" },
      { id: "n6rdBWGgBhc", title: "Learning English TV — Episode 1", duration: "24:00" },
      { id: "O9G3Bq24YBo", title: "Everyday Grammar — Passive Voice", duration: "4:30" },
      { id: "3gOHx4Rfy4Y", title: "VOA Science Report — English Vocab", duration: "5:00" },
    ],
  },
  {
    id: "mr-duncan",
    name: "English Addict — Mr. Duncan",
    handle: "@misterduncan_uk",
    badge: "B2–C1",
    badgeColor: "#fbbf24",
    accent: "#fbbf24",
    emoji: "🟡",
    description: "Mr. Duncan ensina inglês britânico há 19 anos no YouTube",
    videos: [
      { id: "ZLkbWUNQbgk", title: "Mr Duncan — Lesson 1: Hello", duration: "12:00" },
      { id: "HEGpGHpZr4E", title: "Expressions and Idioms in English", duration: "15:30" },
      { id: "V7CNPxpEDkc", title: "English Vocabulary — Emotions", duration: "14:20" },
      { id: "fJ9rUzIMcZQ", title: "Full English — Live Stream Highlights", duration: "22:00" },
      { id: "CevxZvSJLk8", title: "Mr Duncan — Advanced English Lesson", duration: "18:45" },
      { id: "9bxBnpXLMF4", title: "English Pronunciation — Tricky Sounds", duration: "11:30" },
      { id: "pS-gbqbVd8Q", title: "English in a Global World", duration: "16:00" },
      { id: "xRJ5Fm4pTAo", title: "Learn English While You Sleep", duration: "8:00" },
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
              <a
                href={`https://www.youtube.com/${ch.handle}`}
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  fontSize: 11, fontWeight: 700, color: ch.accent,
                  textDecoration: "none", flexShrink: 0,
                  padding: "5px 12px", borderRadius: 50,
                  background: `${ch.accent}14`, border: `1px solid ${ch.accent}30`,
                }}>
                <ExternalLink size={11} /> Canal
              </a>
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
        {/* Barra superior */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "12px 16px",
          background: "rgba(255,255,255,.04)",
          borderBottom: "1px solid rgba(255,255,255,.07)",
        }}>
          <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,.85)" }}>
            {video.title}
          </span>
          <a
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank" rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: 5,
              fontSize: 11, fontWeight: 700, color: "#60a5fa",
              textDecoration: "none",
            }}>
            <ExternalLink size={12} /> YouTube
          </a>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)",
              borderRadius: "50%", width: 30, height: 30, cursor: "pointer",
              color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
            <X size={14} />
          </button>
        </div>
        {/* Player */}
        <div style={{ aspectRatio: "16/9" }}>
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ width: "100%", height: "100%", border: "none", display: "block" }}
            title={video.title}
          />
        </div>
      </div>
    </div>
  );
}
