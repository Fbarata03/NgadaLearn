import { createContext, useContext, useState, ReactNode } from "react";

/* ── Tipos ── */
export interface User {
  name: string;
  email: string;
  isPaid: boolean;
}

interface StoredUser extends User {
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isPaid: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  /** Chamado após pagamento confirmado: cria conta + marca como pago */
  registerAndPay: (name: string, email: string, password: string) => void;
}

/* ── Helpers localStorage ── */
const USERS_KEY = "ngada_users";
const SESSION_KEY = "ngada_session";

function getUsers(): StoredUser[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); }
  catch { return []; }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getCurrentUser(): User | null {
  try {
    const email = localStorage.getItem(SESSION_KEY);
    if (!email) return null;
    const found = getUsers().find((u) => u.email === email);
    if (!found) return null;
    return { name: found.name, email: found.email, isPaid: found.isPaid };
  } catch { return null; }
}

/* ── Context ── */
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getCurrentUser);

  const login = (email: string, password: string) => {
    const found = getUsers().find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) return { success: false, error: "E-mail ou senha incorretos." };
    const u: User = { name: found.name, email: found.email, isPaid: found.isPaid };
    setUser(u);
    localStorage.setItem(SESSION_KEY, found.email);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const registerAndPay = (name: string, email: string, password: string) => {
    const users = getUsers();
    const exists = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
    const newUser: StoredUser = { name, email, password, isPaid: true };
    if (exists >= 0) {
      users[exists] = newUser; // actualiza se já existir
    } else {
      users.push(newUser);
    }
    saveUsers(users);
    setUser({ name, email, isPaid: true });
    localStorage.setItem(SESSION_KEY, email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isPaid: user?.isPaid ?? false,
        login,
        logout,
        registerAndPay,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
