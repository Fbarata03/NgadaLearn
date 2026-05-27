import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { LandingPage } from "./components/LandingPage";
import { Dashboard } from "./components/Dashboard";
import { Lessons } from "./components/Lessons";
import { LessonPlayer } from "./components/LessonPlayer";
import { ConversationPlayer } from "./components/ConversationPlayer";
import { TextPlayer } from "./components/TextPlayer";
import { Subscribe } from "./components/Subscribe";
import { Login } from "./components/Login";
import { Demo } from "./components/Demo";
import { Admin } from "./components/Admin";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      // ── Públicas ──
      { index: true, Component: LandingPage },
      { path: "subscribe", Component: Subscribe },
      { path: "demo", Component: Demo },

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
  // Login fora do RootLayout (página isolada)
  { path: "/login", Component: Login },
]);
