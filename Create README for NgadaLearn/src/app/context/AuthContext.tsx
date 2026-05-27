import { createContext, useContext, useState, useEffect, ReactNode } from "react";

/* ── Tipos públicos ── */
export type PlanType = "monthly" | "lifetime";

export interface User {
  name: string;
  email: string;
  plan: PlanType;
  paymentDate: string; // ISO 8601
  isAdmin: boolean;
}

/* ── Tipo interno (com senha) ── */
export interface StoredUser extends User {
  password: string;
}

/* ── Context API ── */
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAccessActive: boolean;   // false se plano mensal expirou
  isAdmin: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  registerAndPay: (name: string, email: string, password: string, plan: PlanType) => void;
  /** Usado na renovação do plano mensal */
  renewMonthly: () => void;
  /** Apenas para o admin */
  getAllUsers: () => StoredUser[];
}

/* ── Helpers ── */
const USERS_KEY   = "ngada_users";
const SESSION_KEY = "ngada_session";

const ADMIN_SEED: StoredUser = {
  name: "Fbarata03",
  email: "Fbarata03",
  password: "marias66s3",
  plan: "lifetime",
  paymentDate: new Date().toISOString(),
  isAdmin: true,
};

function getUsers(): StoredUser[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); }
  catch { return []; }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function seedAdmin() {
  const users = getUsers();
  // Remove qualquer admin antigo e insere o seed actualizado
  const filtered = users.filter((u) => !u.isAdmin);
  filtered.unshift({ ...ADMIN_SEED, paymentDate: ADMIN_SEED.paymentDate || new Date().toISOString() });
  saveUsers(filtered);
}

export function checkAccessActive(user: User | StoredUser): boolean {
  if (user.plan === "lifetime") return true;
  if (user.plan === "monthly") {
    const paid = new Date(user.paymentDate);
    const expiry = new Date(paid);
    expiry.setDate(expiry.getDate() + 30);
    return new Date() < expiry;
  }
  return false;
}

/** Devolve a data de expiração para plano mensal */
export function getExpiryDate(user: User | StoredUser): Date | null {
  if (user.plan !== "monthly") return null;
  const paid = new Date(user.paymentDate);
  const expiry = new Date(paid);
  expiry.setDate(expiry.getDate() + 30);
  return expiry;
}

function getCurrentUser(): User | null {
  try {
    const email = localStorage.getItem(SESSION_KEY);
    if (!email) return null;
    const found = getUsers().find((u) => u.email === email);
    if (!found) return null;
    const { password: _, ...rest } = found;
    void _;
    return rest;
  } catch { return null; }
}

/* ── Context ── */
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Seed admin na primeira carga
  useEffect(() => { seedAdmin(); }, []);

  const [user, setUser] = useState<User | null>(getCurrentUser);

  const login = (email: string, password: string) => {
    const found = getUsers().find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) return { success: false, error: "E-mail ou senha incorretos." };
    const { password: _, ...rest } = found;
    void _;
    setUser(rest);
    localStorage.setItem(SESSION_KEY, found.email);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const registerAndPay = (name: string, email: string, password: string, plan: PlanType) => {
    const users = getUsers();
    const idx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
    const newUser: StoredUser = {
      name,
      email,
      password,
      plan,
      paymentDate: new Date().toISOString(),
      isAdmin: false,
    };
    if (idx >= 0) users[idx] = newUser;
    else users.push(newUser);
    saveUsers(users);
    const { password: _, ...rest } = newUser;
    void _;
    setUser(rest);
    localStorage.setItem(SESSION_KEY, email);
  };

  const renewMonthly = () => {
    if (!user) return;
    const users = getUsers();
    const idx = users.findIndex((u) => u.email === user.email);
    if (idx < 0) return;
    users[idx].paymentDate = new Date().toISOString();
    saveUsers(users);
    setUser({ ...user, paymentDate: users[idx].paymentDate });
  };

  const getAllUsers = (): StoredUser[] => getUsers();

  const isAccessActive = user ? checkAccessActive(user) : false;

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAccessActive,
      isAdmin: user?.isAdmin ?? false,
      login,
      logout,
      registerAndPay,
      renewMonthly,
      getAllUsers,
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
