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
    setLoading(true); setError("");
    const r = await login(email, password);
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
    <div className="min-h-[100dvh] bg-gray-50 flex flex-col">
      {/* Logo centrado no topo */}
      <div className="flex items-center justify-center pt-safe pt-8 pb-6">
        <Link to="/" className="flex items-center gap-2">
          <GraduationCap className="w-9 h-9 text-purple-600" />
          <span className="font-black text-2xl text-gray-900">NgadaLearn</span>
        </Link>
      </div>

      {/* Formulário */}
      <div className="flex-1 px-5 max-w-md mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900">Entrar na conta</h1>
          <p className="text-sm text-gray-500 mt-1">Bem-vindo de volta! Continue a sua jornada.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">E-mail</Label>
            <div className="relative mt-1.5">
              <Input
                id="email" type="email" placeholder="seu@email.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 text-base rounded-xl" autoComplete="email"
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
                className="text-xs text-purple-600 font-semibold py-1"
              >
                Esqueci minha senha
              </button>
            </div>
            <div className="relative">
              <Input
                id="password" type={showPw ? "text" : "password"} placeholder="••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-11 h-12 text-base rounded-xl" autoComplete="current-password"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPw(!showPw)}
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
            className="w-full bg-purple-600 hover:bg-purple-700 active:bg-purple-800 h-13 text-base font-bold rounded-2xl mt-2">
            {loading
              ? <span className="flex items-center gap-2"><span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> Entrando...</span>
              : "Entrar"}
          </Button>
        </form>

        {/* Divisor */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">ou</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Comprar */}
        <Link to="/subscribe">
          <Button variant="outline" size="lg"
            className="w-full h-13 text-base font-bold rounded-2xl border-2 border-purple-200 text-purple-700 hover:bg-purple-50">
            Comprar acesso — US$ 20
          </Button>
        </Link>

        <p className="text-center text-xs text-gray-400 mt-5 pb-safe pb-6">
          O acesso é criado automaticamente ao comprar o curso.
        </p>
      </div>
    </div>
  );
}
