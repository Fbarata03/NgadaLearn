import { createBrowserRouter, Navigate } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { LandingPage } from "./components/LandingPage";
import { Dashboard } from "./components/Dashboard";
import { Lessons } from "./components/Lessons";
import { LessonPlayer } from "./components/LessonPlayer";
import { ConversationPlayer } from "./components/ConversationPlayer";
import { TextPlayer } from "./components/TextPlayer";
import { GrammarPlayer } from "./components/GrammarPlayer";
import { PhrasesViewer } from "./components/PhrasesViewer";
import { VocabularyViewer } from "./components/VocabularyViewer";
import { MusicPlayer } from "./components/MusicPlayer";
import { MoviesPlayer } from "./components/MoviesPlayer";
import { Subscribe } from "./components/Subscribe";
import { Login } from "./components/Login";
import { ResetPassword } from "./components/ResetPassword";
import { Demo } from "./components/Demo";
import { Admin } from "./components/Admin";
import { Certificate } from "./components/Certificate";
import { Terms } from "./components/Terms";
import { Privacy } from "./components/Privacy";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { GRAMMAR_LESSONS } from "./data/grammarData";

/* basename = nome do repo → funciona em GitHub Pages */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "") || "";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      // ── Públicas ──
      { index: true, Component: LandingPage },
      { path: "subscribe", Component: Subscribe },
      { path: "demo", Component: Demo },
      { path: "terms", Component: Terms },
      { path: "privacy", Component: Privacy },

      // ── Protegidas (exigem login + pagamento activo) ──
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "lessons",
        element: (
          <ProtectedRoute>
            <Lessons />
          </ProtectedRoute>
        ),
      },
      {
        path: "lessons/:id",
        element: (
          <ProtectedRoute>
            <LessonPlayer />
          </ProtectedRoute>
        ),
      },
      {
        path: "conversations/:id",
        element: (
          <ProtectedRoute>
            <ConversationPlayer />
          </ProtectedRoute>
        ),
      },
      {
        path: "texts/:id",
        element: (
          <ProtectedRoute>
            <TextPlayer />
          </ProtectedRoute>
        ),
      },

      // ── Gramática ──
      {
        path: "grammar",
        element: (
          <ProtectedRoute>
            <Navigate to={`/grammar/${GRAMMAR_LESSONS[0].id}`} replace />
          </ProtectedRoute>
        ),
      },
      {
        path: "grammar/:id",
        element: (
          <ProtectedRoute>
            <GrammarPlayer />
          </ProtectedRoute>
        ),
      },

      // ── Frases ──
      {
        path: "phrases",
        element: (
          <ProtectedRoute>
            <PhrasesViewer />
          </ProtectedRoute>
        ),
      },

      // ── Vocabulário ──
      {
        path: "vocabulary",
        element: (
          <ProtectedRoute>
            <VocabularyViewer />
          </ProtectedRoute>
        ),
      },

      // ── Música ──
      {
        path: "music",
        element: (
          <ProtectedRoute>
            <MusicPlayer />
          </ProtectedRoute>
        ),
      },

      // ── Filmes ──
      {
        path: "movies",
        element: (
          <ProtectedRoute>
            <MoviesPlayer />
          </ProtectedRoute>
        ),
      },

      // ── Certificado ──
      {
        path: "certificate",
        element: (
          <ProtectedRoute>
            <Certificate />
          </ProtectedRoute>
        ),
      },

      // ── Admin (só para administradores) ──
      {
        path: "admin",
        element: (
          <ProtectedRoute adminOnly>
            <Admin />
          </ProtectedRoute>
        ),
      },
    ],
  },
  // Login e reset-password fora do RootLayout (páginas isoladas)
  { path: "/login", Component: Login },
  { path: "/reset-password", Component: ResetPassword },
], { basename: BASE });
