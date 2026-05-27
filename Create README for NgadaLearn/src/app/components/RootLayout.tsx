import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router";
import { Button } from "./ui/button";
import { GraduationCap, Menu, X, BookOpen, LayoutDashboard } from "lucide-react";

export function RootLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: "/lessons", label: "Conteúdo do Curso", icon: BookOpen },
    { to: "/dashboard", label: "Meu Progresso", icon: LayoutDashboard },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ── HEADER ── */}
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <GraduationCap className="w-8 h-8 text-purple-600" />
            <span className="font-black text-xl text-gray-900 tracking-tight">NgadaLearn</span>
          </Link>

          {/* Nav (desktop) */}
          <nav className="hidden md:flex items-center gap-6 flex-1 ml-4">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`text-sm font-medium transition-colors hover:text-purple-600 ${
                  location.pathname === to ? "text-purple-700 font-semibold" : "text-gray-700"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3 ml-auto">
            <Link to="/dashboard" className="hidden md:block">
              <Button variant="outline" size="sm" className="border-gray-300">
                Entrar
              </Button>
            </Link>
            <Link to="/subscribe">
              <Button
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 font-semibold hidden md:flex"
              >
                Começar Grátis
              </Button>
            </Link>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-1.5 rounded-md hover:bg-gray-100"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t bg-white shadow-lg">
            <nav className="container mx-auto px-4 py-4 space-y-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
              <hr className="my-2" />
              <Link
                to="/dashboard"
                className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                Entrar
              </Link>
              <Link to="/subscribe" onClick={() => setMobileOpen(false)}>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 mt-1">
                  Começar Grátis — 7 dias
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 text-white mt-auto">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-7 h-7 text-purple-400" />
                <span className="font-black text-lg">NgadaLearn</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Fluência em Inglês com alma, ritmo e tecnologia. Para estudantes de todo o mundo.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-gray-300 mb-4">Curso</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/lessons" className="hover:text-white transition-colors">Conversação</Link></li>
                <li><Link to="/lessons" className="hover:text-white transition-colors">NgadaFlow (Áudio)</Link></li>
                <li><Link to="/lessons" className="hover:text-white transition-colors">Vocabulário</Link></li>
                <li><Link to="/lessons" className="hover:text-white transition-colors">Inglês Profissional</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-gray-300 mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors">Central de Ajuda</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Contato</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Termos de Uso</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Privacidade</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-gray-300 mb-4">Assinatura</h4>
              <p className="text-sm text-gray-400 mb-4">
                Acesso completo ao curso por apenas <strong className="text-white">US$ 5/mês</strong>
              </p>
              <Link to="/subscribe">
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  Começar 7 Dias Grátis
                </Button>
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>© 2026 NgadaLearn. Todos os direitos reservados.</p>
            <div className="flex items-center gap-6">
              <span>🌍 Português</span>
              <span>🔒 Pagamentos seguros via Stripe</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
