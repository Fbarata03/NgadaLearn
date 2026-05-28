import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { API_URL } from "../context/AuthContext";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { GraduationCap, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";

export function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-gray-900 mb-2">Link inválido</h1>
          <p className="text-gray-500 text-sm mb-6">
            Este link de recuperação é inválido ou expirou.
          </p>
          <Link to="/login">
            <Button className="bg-purple-600 hover:bg-purple-700">
              Voltar ao login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao redefinir senha.");
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-5">
            <GraduationCap className="w-10 h-10 text-purple-600" />
            <span className="font-black text-2xl text-gray-900">NgadaLearn</span>
          </Link>
          <h1 className="text-2xl font-black text-gray-900">Nova senha</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Escolha uma senha segura para a sua conta.
          </p>
        </div>

        <Card className="p-5 sm:p-8 shadow-md border-0 rounded-2xl">
          {success ? (
            <div className="text-center py-4">
              <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
              <h2 className="text-lg font-bold text-gray-900 mb-2">Senha redefinida!</h2>
              <p className="text-sm text-gray-600 mb-2">
                A sua senha foi alterada com sucesso.
              </p>
              <p className="text-xs text-gray-400">
                A redirecionar para o login em instantes...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="new-password" className="text-sm font-semibold">
                  Nova senha
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="new-password"
                    type={showPw ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 pr-10"
                    autoComplete="new-password"
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

              <div>
                <Label htmlFor="confirm-password" className="text-sm font-semibold">
                  Confirmar nova senha
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="confirm-password"
                    type={showPw ? "text" : "password"}
                    placeholder="Repita a nova senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    autoComplete="new-password"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full bg-purple-600 hover:bg-purple-700 py-5 font-bold text-base"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    A processar...
                  </span>
                ) : (
                  "Redefinir senha"
                )}
              </Button>

              <Link
                to="/login"
                className="block text-center text-sm text-gray-500 hover:text-purple-600 transition-colors"
              >
                Voltar ao login
              </Link>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
