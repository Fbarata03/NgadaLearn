import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useAuth, API_URL } from "../context/AuthContext";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  GraduationCap, Lock, Mail, Eye, EyeOff,
  AlertCircle, CheckCircle, ArrowLeft,
} from "lucide-react";

export function Login() {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const from = (location.state as { from?: string })?.from || "/dashboard";

  /* ── Login ── */
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [slowServer, setSlowServer] = useState(false);

  /* ── Recuperar senha ── */
  const [showForgot,   setShowForgot]   = useState(false);
  const [forgotEmail,  setForgotEmail]  = useState("");
  const [forgotLoad,   setForgotLoad]   = useState(false);
  const [forgotStatus, setForgotStatus] = useState<{
    type: "success" | "error"; msg: string; resetUrl?: string;
  } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Preencha todos os campos."); return; }
    setLoading(true); setError(""); setSlowServer(false);
    const slowTimer = setTimeout(() => setSlowServer(true), 8000);
    const r = await login(email, password);
    clearTimeout(slowTimer);
    setSlowServer(false);
    if (r.success) navigate(from, { replace: true });
    else { setError(r.error || "Credenciais inválidas."); setLoading(false); }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.includes("@")) {
      setForgotStatus({ type: "error", msg: "Informe um email válido." }); return;
    }
    setForgotLoad(true); setForgotStatus(null);
    try {
      const res  = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao enviar email.");
      setForgotStatus({ type: "success", msg: data.message, resetUrl: data.resetUrl });
    } catch (err) {
      setForgotStatus({ type: "error", msg: err instanceof Error ? err.message : "Erro inesperado." });
    } finally { setForgotLoad(false); }
  };

  const resetForgot = () => { setShowForgot(false); setForgotStatus(null); setForgotEmail(""); };

  /* ─────────────────────────────────────────
     ECRÃ: RECUPERAR SENHA
  ───────────────────────────────────────── */
  if (showForgot) {
    return (
      <div className="min-h-[100dvh] bg-gray-50 flex flex-col">
        {/* Cabeçalho compacto */}
        <div className="flex items-center justify-between px-4 pt-safe pt-4 pb-3 border-b bg-white">
          <button onClick={resetForgot} className="p-2 -ml-2 text-gray-500 hover:text-gray-800">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-purple-600" />
            <span className="font-black text-base text-gray-900">NgadaLearn</span>
          </div>
          <div className="w-9" />
        </div>

        <div className="flex-1 flex flex-col px-5 pt-14 pb-6 max-w-md mx-auto w-full">
          {forgotStatus?.type === "success" ? (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-xl font-black text-gray-900 mb-2">
                {forgotStatus.resetUrl ? "Link gerado!" : "Email enviado!"}
              </h1>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">{forgotStatus.msg}</p>

              {forgotStatus.resetUrl && (
                <a
                  href={forgotStatus.resetUrl}
                  className="block w-full bg-purple-600 text-white font-bold py-4 rounded-2xl text-center text-base mb-4 active:bg-purple-700"
                >
                  🔑 Redefinir senha agora →
                </a>
              )}

              <button onClick={resetForgot}
                className="text-sm text-purple-600 font-semibold underline underline-offset-2">
                Voltar ao login
              </button>
            </div>
          ) : (
            <>
              <div className="mb-7">
                <h1 className="text-2xl font-black text-gray-900">Recuperar senha</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Insira o email e enviaremos as instruções.
                </p>
              </div>

              <form onSubmit={handleForgot} className="space-y-4">
                <div>
                  <Label htmlFor="f-email" className="text-sm font-semibold text-gray-700">E-mail</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="f-email" type="email" placeholder="seu@email.com"
                      value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)}
                      className="pl-10 h-12 text-base rounded-xl" autoComplete="email"
                    />
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {forgotStatus?.type === "error" && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    {forgotStatus.msg}
                  </div>
                )}

                <Button type="submit" size="lg" disabled={forgotLoad}
                  className="w-full bg-purple-600 hover:bg-purple-700 h-13 text-base font-bold rounded-2xl">
                  {forgotLoad
                    ? <span className="flex items-center gap-2"><span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> A enviar...</span>
                    : "Enviar instruções"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────
     ECRÃ: LOGIN
  ───────────────────────────────────────── */
  return (
    <div className="min-h-[100dvh] flex flex-col lg:flex-row">
      {/* ── Painel esquerdo — visual (só desktop) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-900 text-white flex-col justify-between p-12 overflow-hidden">
        {/* Imagem de fundo */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=75"
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-16">
            <GraduationCap className="w-8 h-8 text-purple-400" />
            <span className="font-black text-xl">NgadaLearn</span>
          </div>
          <h2 className="text-3xl font-black leading-tight mb-4">
            Bem-vindo de volta à tua jornada em inglês
          </h2>
          <p className="text-purple-200 text-sm leading-relaxed mb-10">
            Continua de onde ficaste. Cada aula conta para a tua fluência.
          </p>
          <div className="space-y-4">
            {[
              { icon: "🎵", text: "Mais de 50 horas de conteúdo" },
              { icon: "🎬", text: "Filmes e música em inglês" },
              { icon: "🏆", text: "Certificado de conclusão" },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3 text-sm text-purple-100">
                <span className="text-lg">{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-3 bg-white/10 backdrop-blur rounded-2xl p-4">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=face"
            alt="Aluno"
            className="w-10 h-10 rounded-full object-cover border-2 border-purple-300"
            onError={(e) => { (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Maria+Silva&background=7c3aed&color=fff&size=48"; }}
          />
          <div>
            <p className="text-xs font-bold text-white">Maria Silva</p>
            <p className="text-[11px] text-purple-300">"Consegui o meu primeiro emprego internacional em 3 meses!"</p>
          </div>
        </div>
      </div>

      {/* ── Painel direito — formulário ── */}
      <div className="flex-1 bg-white flex flex-col">
        {/* Cabeçalho mobile */}
        <div className="lg:hidden flex items-center justify-between px-4 pt-4 pb-3 border-b">
          <Link to="/" className="min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2 text-gray-500 hover:text-gray-800 rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-purple-600" />
            <span className="font-black text-base text-gray-900">NgadaLearn</span>
          </div>
          <div className="w-11" />
        </div>

        <div className="flex-1 flex items-center justify-center px-5 py-10">
          <div className="w-full max-w-sm">
            {/* Logo (desktop) */}
            <div className="hidden lg:flex items-center gap-2 mb-8">
              <Link to="/" className="flex items-center gap-2 text-gray-800 hover:text-purple-600 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Voltar</span>
              </Link>
            </div>

            <div className="mb-8">
              <h1 className="text-2xl font-black text-gray-900">Entrar na conta</h1>
              <p className="text-sm text-gray-500 mt-1">Bem-vindo de volta! Continua a tua jornada.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">E-mail</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="email" type="email" placeholder="o_teu@email.com"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 text-base rounded-xl border-gray-200 focus:border-purple-400" autoComplete="email"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Senha */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Senha</Label>
                  <button
                    type="button"
                    onClick={() => { setShowForgot(true); setForgotEmail(email); }}
                    className="text-xs text-purple-600 font-semibold min-h-[36px] flex items-center px-1 hover:text-purple-800 transition-colors"
                  >
                    Esqueci a senha
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password" type={showPw ? "text" : "password"} placeholder="••••••••"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-11 h-12 text-base rounded-xl border-gray-200 focus:border-purple-400" autoComplete="current-password"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    className="absolute right-0 top-0 h-12 w-11 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPw(!showPw)}
                    aria-label={showPw ? "Esconder senha" : "Mostrar senha"}
                  >
                    {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Erro */}
              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              {/* Botão entrar */}
              <Button type="submit" size="lg" disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 active:bg-purple-800 h-12 text-base font-bold rounded-2xl mt-2 shadow-md shadow-purple-200">
                {loading
                  ? <span className="flex items-center gap-2"><span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> A entrar...</span>
                  : "Entrar →"}
              </Button>

              {slowServer && (
                <div className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-700">
                  <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-purple-400 border-t-transparent flex-shrink-0" />
                  O servidor está a acordar, aguarda até 1 minuto na primeira vez...
                </div>
              )}
            </form>

            {/* Divisor */}
            <div className="my-5 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400 font-medium">sem conta?</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Comprar */}
            <Link to="/subscribe">
              <Button variant="outline" size="lg"
                className="w-full h-12 text-base font-bold rounded-2xl border-2 border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400 transition-colors">
                Obter acesso — a partir de US$ 15
              </Button>
            </Link>

            <p className="text-center text-xs text-gray-400 mt-4">
              O acesso é criado automaticamente ao comprar o curso.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

