import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
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
  ShieldCheck,
  Music,
  Tv,
  Globe,
  Lock,
  Home,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAccessActive, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  /* Fechar drawer com Escape + bloquear scroll do body */
  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navLinks = isAccessActive
    ? [
        { to: "/", label: "Início", icon: Home },
        { to: "/lessons", label: "Conteúdo do Curso", icon: BookOpen },
        { to: "/music", label: "Música", icon: Music },
        { to: "/netflix", label: "Netflix do Inglês", icon: Tv },
        { to: "/dashboard", label: "Meu Progresso", icon: LayoutDashboard },
      ]
    : [];

  /* Bottom nav (mobile) — 5 items para utilizadores autenticados */
  const BOTTOM_NAV = [
    { to: "/dashboard", label: "Progresso", icon: LayoutDashboard },
    { to: "/lessons",   label: "Aulas",     icon: BookOpen },
    { to: "/music",     label: "Música",    icon: Music },
    { to: "/netflix",   label: "Netflix",   icon: Tv },
    { to: "/",          label: "Início",    icon: Home },
  ];

  /* Páginas onde o bottom nav NÃO deve aparecer (full-screen players) */
  const hideBottomNav = ["/music", "/netflix"].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ── HEADER ── */}
      <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-[0_1px_12px_rgba(0,0,0,0.06)]">
        <div className="container mx-auto px-4 h-14 md:h-16 flex items-center gap-3">
          {/* Logo */}
          <Link to="/" title="Página Inicial" aria-label="Ir para a página inicial" className="flex items-center gap-1.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-sm">
              <GraduationCap className="w-4.5 h-4.5 text-white" style={{width:18,height:18}} />
            </div>
            <span className="font-black text-base sm:text-lg text-gray-900 tracking-tight">NgadaLearn</span>
          </Link>

          {/* Nav (desktop) */}
          {navLinks.length > 0 && (
            <nav className="hidden md:flex items-center gap-5 flex-1 ml-4">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-purple-600 ${
                    location.pathname === to ? "text-purple-700 font-semibold" : "text-gray-600"
                  }`}>
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto">
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
                  <span className="text-sm font-semibold text-gray-800 max-w-[120px] truncate" title={user?.name}>
                    {user?.name?.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white border rounded-xl shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b mb-1">
                      <p className="text-xs font-bold text-gray-800 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      {isAccessActive && (
                        <span className="inline-block mt-1 text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">
                          ✓ {user?.plan === "lifetime" ? "Acesso Vitalício" : "Acesso Ativo"}
                        </span>
                      )}
                    </div>
                    {isAccessActive && (
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
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-purple-700 font-semibold hover:bg-purple-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <ShieldCheck className="w-4 h-4" /> Painel Admin
                      </Link>
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

            {/* Mobile: avatar se autenticado, hamburger se visitante */}
            {isAuthenticated ? (
              <button
                className="md:hidden min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full bg-purple-100 border-2 border-purple-200 transition-all active:scale-95"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu do utilizador"
              >
                <User className="w-4 h-4 text-purple-700" />
              </button>
            ) : (
              <button
                className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
                aria-expanded={mobileOpen}
              >
                <Menu className="w-5 h-5 text-gray-700" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── OVERLAY do drawer ── */}
      <div
        className={`fixed inset-0 bg-black/50 z-[99] md:hidden transition-opacity duration-300 ease-in-out ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* ── MOBILE DRAWER (slide da esquerda) ── */}
      <nav
        aria-label="Menu principal"
        className={`fixed top-0 left-0 h-full w-72 max-w-[85vw] bg-white z-[100] shadow-2xl flex flex-col md:hidden transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Cabeçalho do drawer */}
        <div className="flex items-center justify-between px-4 h-16 border-b flex-shrink-0">
          <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <GraduationCap className="w-7 h-7 text-purple-600" />
            <span className="font-black text-lg text-gray-900">NgadaLearn</span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Perfil (se autenticado) */}
        {isAuthenticated && (
          <div className="flex items-center gap-3 px-4 py-3 bg-purple-50 border-b flex-shrink-0">
            <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-purple-700" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800 truncate">{user?.name}</p>
              {isAccessActive && (
                <p className="text-xs text-green-600 font-medium">
                  ✓ {user?.plan === "lifetime" ? "Acesso Vitalício" : "Acesso Ativo"}
                </p>
              )}
              {isAdmin && <p className="text-xs text-purple-600 font-bold">🛡 Admin</p>}
            </div>
          </div>
        )}

        {/* Links de navegação */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          <Link
            to="/"
            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
              location.pathname === "/" ? "bg-purple-100 text-purple-700 font-semibold" : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setMobileOpen(false)}
          >
            <GraduationCap className="w-4 h-4" />
            Início
          </Link>
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === to ? "bg-purple-100 text-purple-700 font-semibold" : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-purple-700 hover:bg-purple-50 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              <ShieldCheck className="w-4 h-4" /> Painel Admin
            </Link>
          )}
        </div>

        {/* Rodapé do drawer */}
        <div className="px-3 py-3 border-t space-y-1 flex-shrink-0">
          {isAuthenticated ? (
            <button
              onClick={() => { handleLogout(); setMobileOpen(false); }}
              className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sair
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-3 py-3 text-sm font-medium text-center text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Entrar
              </Link>
              <Link to="/subscribe" onClick={() => setMobileOpen(false)}>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 h-11">
                  Começar Agora
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Fechar menu do utilizador ao clicar fora */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setUserMenuOpen(false)}
        />
      )}

      <main className={`flex-1 ${isAccessActive && !hideBottomNav ? "pb-[64px] md:pb-0" : ""}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── FOOTER — oculto em páginas full-screen e quando o user está autenticado ── */}
      {!user && !["/", "/music", "/netflix"].includes(location.pathname) && (
      <footer className="bg-gray-900 text-white mt-auto">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
            <div className="col-span-1 sm:col-span-2 md:col-span-1">
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
                <li><Link to="/demo" className="hover:text-white transition-colors">Aula Gratuita</Link></li>
                <li>
                  <a href="mailto:suporte@ngadalearn.pt" className="hover:text-white transition-colors">
                    Contacto
                  </a>
                </li>
                <li><Link to="/subscribe" className="hover:text-white transition-colors">Comprar Acesso</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Entrar na Conta</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-gray-300 mb-4">Acesso Vitalício</h4>
              <p className="text-sm text-gray-400 mb-4">
                Acesso completo ao curso por apenas <strong className="text-white">US$ 150</strong> — pagamento único
              </p>
              <Link to="/subscribe">
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  Comprar Agora
                </Button>
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500 text-center">
            <p>© 2026 NgadaLearn. Todos os direitos reservados.</p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link to="/privacy" className="hover:text-gray-300 transition-colors">Política de Privacidade</Link>
              <span className="text-gray-700">|</span>
              <Link to="/terms" className="hover:text-gray-300 transition-colors">Termos de Uso</Link>
              <span className="text-gray-700">|</span>
              <a href="mailto:suporte@ngadalearn.pt" className="hover:text-gray-300 transition-colors">Contacto</a>
              <span className="text-gray-700">|</span>
              <a href="mailto:suporte@ngadalearn.pt" className="hover:text-gray-300 transition-colors">Suporte</a>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Português</span>
              <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Pagamentos seguros via Stripe</span>
            </div>
          </div>
        </div>
      </footer>
      )}

      {/* ── BOTTOM NAVIGATION BAR — mobile, só utilizadores autenticados ── */}
      {isAccessActive && !hideBottomNav && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-100"
          style={{ boxShadow: "0 -4px 20px rgba(0,0,0,0.07)", paddingBottom: "env(safe-area-inset-bottom)" }}>
          <div style={{ display: "flex" }}>
            {BOTTOM_NAV.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link key={to} to={to}
                  style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, minHeight: 58, textDecoration: "none", position: "relative", transition: "all .15s" }}>
                  {active && (
                    <span style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 2, borderRadius: "0 0 3px 3px", background: "linear-gradient(90deg,#7c3aed,#4f46e5)" }} />
                  )}
                  <div style={{ width: 36, height: 36, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: active ? "rgba(124,58,237,.1)" : "transparent", transition: "background .15s" }}>
                    <Icon style={{ width: 20, height: 20, color: active ? "#7c3aed" : "#9ca3af" }} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? "#7c3aed" : "#9ca3af", lineHeight: 1 }}>
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}

