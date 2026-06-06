import {
  createContext, useContext, useState,
  useEffect, useCallback, ReactNode,
} from "react";

/* ── Tipos públicos ── */
export type PlanType = "monthly" | "lifetime" | "none";

export interface User {
  id:              string;
  name:            string;
  email:           string;
  plan:            PlanType;
  role:            string;
  accessExpiresAt: string | null;
  createdAt?:      string;
  lastLoginAt?:    string | null;
}

interface AuthContextType {
  user:             User | null;
  token:            string | null;
  isAuthenticated:  boolean;
  isAccessActive:   boolean;
  isAdmin:          boolean;
  login:            (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout:           () => void;
  activatePlan:     (userData: User, jwtToken: string) => void;
  renewMonthly:     (userData: User, jwtToken: string) => void;
}

/* ── Constantes ── */
const TOKEN_KEY = "ngada_token";
export const API_URL =
  import.meta.env.VITE_API_URL || "https://ngadalearn-api.onrender.com";

/* ── Helpers exportados (usados em Admin.tsx) ── */
export function checkAccessActive(user: User): boolean {
  if (user.plan === "lifetime") return true;
  if (user.plan === "monthly" && user.accessExpiresAt) {
    return new Date() < new Date(user.accessExpiresAt);
  }
  return false;
}

export function getExpiryDate(user: User): Date | null {
  if (user.plan !== "monthly" || !user.accessExpiresAt) return null;
  return new Date(user.accessExpiresAt);
}

/* ── Context ── */
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem(TOKEN_KEY)
  );
  const [user,    setUser]    = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* Guardar / limpar sessão */
  const saveSession = useCallback((u: User | null, t: string | null) => {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else   localStorage.removeItem(TOKEN_KEY);
    setToken(t);
    setUser(u);
  }, []);

  /* Verificar token existente no arranque */
  const verifyToken = useCallback(async (t: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (!res.ok) throw new Error("token inválido");
      const data = await res.json();
      setUser(data.user);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY);
    if (saved) {
      verifyToken(saved);
    } else {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Login via backend */
  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res  = await fetch(`${API_URL}/api/auth/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || "Credenciais inválidas." };
      saveSession(data.user, data.token);
      return { success: true };
    } catch {
      return { success: false, error: "Sem ligação ao servidor. Tente novamente." };
    }
  };

  const logout = () => saveSession(null, null);

  /* Chamado após pagamento bem-sucedido (novo utilizador) */
  const activatePlan = (userData: User, jwtToken: string) => {
    saveSession(userData, jwtToken);
  };

  /* Chamado após renovação mensal bem-sucedida */
  const renewMonthly = (userData: User, jwtToken: string) => {
    saveSession(userData, jwtToken);
  };

  const isAccessActive = user ? checkAccessActive(user) : false;

  /* Spinner enquanto verifica o token inicial */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user,
      isAccessActive,
      isAdmin:         user?.role === "admin",
      login,
      logout,
      activatePlan,
      renewMonthly,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
