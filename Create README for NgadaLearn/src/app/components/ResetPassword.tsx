import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { API_URL } from "../context/AuthContext";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  GraduationCap, Lock, Eye, EyeOff,
  AlertCircle, CheckCircle, ArrowLeft,
} from "lucide-react";

export function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token") || "";

  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw,          setShowPw]          = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState("");
  const [success,         setSuccess]         = useState(false);

  if (!token) {
    return (
      <div className="min-h-[100dvh] bg-gray-50 flex flex-col">
        <div className="flex items-center justify-between px-4 pt-safe pt-4 pb-3 border-b bg-white">
          <Link to="/login" className="p-2 -ml-2 text-gray-500 hover:text-gray-800">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-purple-600" />
            <span className="font-black text-base text-gray-900">NgadaLearn</span>
          </div>
          <div className="w-9" />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-5 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-xl font-black text-gray-900 mb-2">Link inválido</h1>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Este link de recuperação é inválido ou expirou.<br />Solicite um novo.
          </p>
          <Link to="/login">
            <Button className="bg-purple-600 hover:bg-purple-700 h-12 px-8 rounded-2xl font-bold">
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
    <div className="min-h-[100dvh] bg-gray-50 flex flex-col">
      {/* Cabeçalho com botão de retroceder */}
      <div className="flex items-center justify-between px-4 pt-safe pt-4 pb-3 border-b bg-white">
        <Link to="/login" className="p-2 -ml-2 text-gray-500 hover:text-gray-800">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-purple-600" />
          <span className="font-black text-base text-gray-900">NgadaLearn</span>
        </div>
        <div className="w-9" />
      </div>

      <div className="flex-1 flex flex-col px-5 pt-14 pb-6 max-w-md mx-auto w-full">
        {success ? (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-xl font-black text-gray-900 mb-2">Senha redefinida!</h1>
            <p className="text-sm text-gray-500 mb-2 leading-relaxed">
              A sua senha foi alterada com sucesso.
            </p>
            <p className="text-xs text-gray-400">A redirecionar para o login...</p>
          </div>
        ) : (
          <>
            <div className="mb-7">
              <h1 className="text-2xl font-black text-gray-900">Nova senha</h1>
              <p className="text-sm text-gray-500 mt-1">
                Escolha uma senha segura para a sua conta.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="new-password" className="text-sm font-semibold text-gray-700">
                  Nova senha
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="new-password"
                    type={showPw ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 pr-11 h-12 text-base rounded-xl"
                    autoComplete="new-password"
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

              <div>
                <Label htmlFor="confirm-password" className="text-sm font-semibold text-gray-700">
                  Confirmar nova senha
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="confirm-password"
                    type={showPw ? "text" : "password"}
                    placeholder="Repita a nova senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 h-12 text-base rounded-xl"
                    autoComplete="new-password"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full bg-purple-600 hover:bg-purple-700 active:bg-purple-800 h-13 text-base font-bold rounded-2xl mt-2"
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
            </form>
          </>
        )}
      </div>
    </div>
  );
}
