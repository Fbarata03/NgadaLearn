import { Outlet, Link, useLocation } from "react-router";
import { Button } from "./ui/button";
import { GraduationCap, LayoutDashboard, BookOpen, CreditCard } from "lucide-react";

export function RootLayout() {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              NgadaLearn
            </span>
          </Link>

          {!isLanding && (
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 hover:text-blue-600 transition-colors ${
                  location.pathname === "/dashboard" ? "text-blue-600" : ""
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                to="/lessons"
                className={`flex items-center gap-2 hover:text-blue-600 transition-colors ${
                  location.pathname === "/lessons" ? "text-blue-600" : ""
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Lessons
              </Link>
              <Link
                to="/subscribe"
                className={`flex items-center gap-2 hover:text-blue-600 transition-colors ${
                  location.pathname === "/subscribe" ? "text-blue-600" : ""
                }`}
              >
                <CreditCard className="w-4 h-4" />
                Subscribe
              </Link>
            </nav>
          )}

          {isLanding ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link to="/subscribe">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          ) : (
            <Button variant="outline">Account</Button>
          )}
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t bg-white/80 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>© 2026 NgadaLearn. Fluência em Inglês Acessível com Alma, Ritmo e Tecnologia.</p>
        </div>
      </footer>
    </div>
  );
}
