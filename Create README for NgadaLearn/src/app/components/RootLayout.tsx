import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { Button } from "./ui/button";
import {
  GraduationCap,
  Menu,
  X,
  BookOpen,
  LayoutDashboard,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isPaid, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  const navLinks = isPaid
    ? [
        { to: "/lessons", label: "Conteúdo do Curso", icon: BookOpen },
        { to: "/dashboard", label: "Meu Progresso", icon: LayoutDashboard },
      ]
    : [];

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
          {navLinks.length > 0 && (
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
          )}

          {/* Right actions */}
          <div className="flex items-center gap-3 ml-auto">
            {isAuthenticated ? (
              /* ── Utilizador logado ── */
              <div className="relative hidden md:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-purple-700" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800 max-w-[120px] truncate">
                    {user?.name}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white border rounded-xl shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b mb-1">
                      <p className="text-xs font-bold text-gray-800 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      {isPaid && (
                        <span className="inline-block mt-1 text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">
                          ✓ Acesso Vitalício
                        </span>
                      )}
                    </div>
                    {isPaid && (
                      <>
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" /> Meu Progresso
                        </Link>
                        <Link
                          to="/lessons"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <BookOpen className="w-4 h-4" /> Minhas Aulas
                        </Link>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left mt-1 border-t"
                    >
                      <LogOut className="w-4 h-4" /> Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* ── Visitante ── */
              <>
                <Link to="/login" className="hidden md:block">
                  <Button variant="outline" size="sm" className="border-gray-300">
                    Entrar
                  </Button>
                </Link>
                <Link to="/subscribe">
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 font-semibold hidden md:flex">
                    Comprar Agora
                  </Button>
                </Link>
              </>
            )}

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

        {/* Menu mobile */}
        {mobileOpen && (
          <div className="md:hidden border-t bg-white shadow-lg">
            <nav className="container mx-auto px-4 py-4 space-y-1">
              {isAuthenticated && (
                <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-purple-50 rounded-xl">
                  <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-700" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{user?.name}</p>
                    {isPaid && (
                      <p className="text-xs text-green-600 font-medium">✓ Acesso Vitalício</p>
                    )}
                  </div>
                </div>
              )}

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

              {isAuthenticated ? (
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full"
                >
                  <LogOut className="w-4 h-4" /> Sair
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                    onClick={() => setMobileOpen(false)}
                  >
                    Entrar
                  </Link>
                  <Link to="/subscribe" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 mt-1">
                      Comprar Agora — US$ 29
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Fechar menu do utilizador ao clicar fora */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setUserMenuOpen(false)}
        />
      )}

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
                <li><Link to="/demo" className="hover:text-white transition-colors">Aula Gratuita</Link></li>
                <li><Link to="/lessons" className="hover:text-white transition-colors">Conversação</Link></li>
                <li><Link to="/lessons" className="hover:text-white transition-colors">NgadaFlow (Áudio)</Link></li>
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
              <h4 className="font-bold text-sm uppercase tracking-wider text-gray-300 mb-4">Acesso Vitalício</h4>
              <p className="text-sm text-gray-400 mb-4">
                Acesso completo ao curso por apenas <strong className="text-white">US$ 29</strong> — pagamento único
              </p>
              <Link to="/subscribe">
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  Comprar Agora
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
