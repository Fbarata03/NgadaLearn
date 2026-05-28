import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { GraduationCap, Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Preencha todos os campos.");
      return;
    }
    setLoading(true);
    setError("");
    const result = await login(email, password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || "Credenciais inválidas.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-5">
            <GraduationCap className="w-10 h-10 text-purple-600" />
            <span className="font-black text-2xl text-gray-900">NgadaLearn</span>
          </Link>
          <h1 className="text-2xl font-black text-gray-900">Entrar na sua conta</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Bem-vindo de volta! Continue sua jornada de inglês.
          </p>
        </div>

        <Card className="p-5 sm:p-8 shadow-md border-0 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* E-mail */}
            <div>
              <Label htmlFor="email" className="text-sm font-semibold">E-mail</Label>
              <div className="relative mt-1.5">
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  autoComplete="email"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Senha */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="password" className="text-sm font-semibold">Senha</Label>
                <button type="button" className="text-xs text-purple-600 hover:underline">
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  autoComplete="current-password"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPw(!showPw)}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Erro */}
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              size="lg"
              className="w-full bg-purple-600 hover:bg-purple-700 py-5 font-bold text-base"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Entrando...
                </span>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t text-center">
            <p className="text-sm text-gray-600">
              Ainda não tem acesso?{" "}
              <Link to="/subscribe" className="text-purple-700 font-bold hover:underline">
                Comprar o curso
              </Link>
            </p>
          </div>
        </Card>

        {/* Info */}
        <p className="text-center text-xs text-gray-400 mt-6">
          O acesso é criado automaticamente ao comprar o curso.
        </p>
      </div>
    </div>
  );
}
