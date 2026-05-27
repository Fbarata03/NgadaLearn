import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { LandingPage } from "./components/LandingPage";
import { Dashboard } from "./components/Dashboard";
import { Lessons } from "./components/Lessons";
import { Subscribe } from "./components/Subscribe";
import { Login } from "./components/Login";
import { Demo } from "./components/Demo";
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

      // ── Protegidas (exigem login + pagamento) ──
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
    ],
  },
  // Login fora do RootLayout (página isolada)
  { path: "/login", Component: Login },
]);
