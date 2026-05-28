import { useState, useEffect } from "react";
import { useAuth, checkAccessActive, getExpiryDate, API_URL } from "../context/AuthContext";
import type { User } from "../context/AuthContext";
import {
  Users,
  Crown,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Search,
  Filter,
  ShieldCheck,
} from "lucide-react";
import { Input } from "./ui/input";

type FilterType = "all" | "lifetime" | "monthly_active" | "monthly_expired";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function daysLeft(user: User): number | null {
  if (user.plan !== "monthly") return null;
  const expiry = getExpiryDate(user);
  if (!expiry) return null;
  const diff = expiry.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function Admin() {
  const { user: currentUser, token } = useAuth();
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState<FilterType>("all");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loadErr,  setLoadErr]  = useState("");

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/api/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.users) setAllUsers(d.users.filter((u: User) => u.role !== "admin"));
        else setLoadErr("Erro ao carregar utilizadores.");
      })
      .catch(() => setLoadErr("Sem ligação ao servidor."));
  }, [token]);

  // Estatísticas
  if (loadErr) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-sm">
        {loadErr}
      </div>
    );
  }

  const total = allUsers.length;
  const lifetime = allUsers.filter((u) => u.plan === "lifetime").length;
  const monthlyActive = allUsers.filter(
    (u: User) => u.plan === "monthly" && checkAccessActive(u)
  ).length;
  const monthlyExpired = allUsers.filter(
    (u: User) => u.plan === "monthly" && !checkAccessActive(u)
  ).length;
  const totalRevenue =
    lifetime * 20 + (monthlyActive + monthlyExpired) * 5;

  // Filtros
  const filtered = allUsers.filter((u: User) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "lifetime"        && u.plan === "lifetime") ||
      (filter === "monthly_active"  && u.plan === "monthly" && checkAccessActive(u)) ||
      (filter === "monthly_expired" && u.plan === "monthly" && !checkAccessActive(u));
    return matchSearch && matchFilter;
  });

  const FILTERS: { key: FilterType; label: string; count: number; color: string }[] = [
    { key: "all", label: "Todos", count: total, color: "bg-gray-100 text-gray-700" },
    { key: "lifetime", label: "Vitalício", count: lifetime, color: "bg-purple-100 text-purple-700" },
    { key: "monthly_active", label: "Mensal Ativo", count: monthlyActive, color: "bg-green-100 text-green-700" },
    { key: "monthly_expired", label: "Mensal Expirado", count: monthlyExpired, color: "bg-red-100 text-red-700" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header do painel */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-purple-700" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Painel Admin</h1>
              <p className="text-sm text-gray-500">
                Logado como <span className="font-semibold text-purple-700">{currentUser?.email}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Cards de estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Users className="w-5 h-5 text-blue-600" />}
            bg="bg-blue-50"
            label="Total de Alunos"
            value={total}
            sub="registados"
          />
          <StatCard
            icon={<Crown className="w-5 h-5 text-purple-600" />}
            bg="bg-purple-50"
            label="Plano Vitalício"
            value={lifetime}
            sub={`US$ ${lifetime * 20} receita`}
          />
          <StatCard
            icon={<CheckCircle2 className="w-5 h-5 text-green-600" />}
            bg="bg-green-50"
            label="Mensal Ativo"
            value={monthlyActive}
            sub="acesso válido"
          />
          <StatCard
            icon={<AlertCircle className="w-5 h-5 text-red-500" />}
            bg="bg-red-50"
            label="Mensal Expirado"
            value={monthlyExpired}
            sub="aguardam renovação"
          />
        </div>

        {/* Receita estimada */}
        <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white rounded-2xl p-6 mb-8 flex items-center justify-between">
          <div>
            <p className="text-purple-200 text-sm font-medium">Receita Total Estimada</p>
            <p className="text-4xl font-black mt-1">US$ {totalRevenue.toFixed(2)}</p>
            <p className="text-purple-300 text-xs mt-1">
              {lifetime} × US$20 (vitalício) + {monthlyActive + monthlyExpired} × US$5 (mensal)
            </p>
          </div>
          <Crown className="w-16 h-16 text-purple-400 opacity-40" />
        </div>

        {/* Barra de pesquisa e filtros */}
        <div className="bg-white rounded-2xl border shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Pesquisar por nome ou e-mail..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border-2 ${
                    filter === f.key
                      ? "border-purple-500 " + f.color
                      : "border-transparent bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {f.label} ({f.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tabela de utilizadores */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="font-bold text-gray-800">
              Utilizadores ({filtered.length})
            </h2>
            {filtered.length === 0 && search && (
              <span className="text-sm text-gray-400">Nenhum resultado para "{search}"</span>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Nenhum utilizador encontrado</p>
              <p className="text-sm mt-1">
                {total === 0 ? "Ainda não há alunos registados." : "Tente ajustar os filtros."}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="text-left px-6 py-3 font-semibold text-gray-600">Aluno</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Plano</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Data de Pagamento</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Expiração</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtered.map((u) => (
                      <UserRow key={u.email} user={u} />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile — cards */}
              <div className="md:hidden divide-y divide-gray-100">
                {filtered.map((u) => (
                  <UserCard key={u.email} user={u} />
                ))}
              </div>
            </>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Dados em tempo real via Neon PostgreSQL · Painel restrito a administradores
        </p>
      </div>
    </div>
  );
}

/* ── Subcomponentes ── */

function StatCard({
  icon, bg, label, value, sub,
}: {
  icon: React.ReactNode;
  bg: string;
  label: string;
  value: number;
  sub: string;
}) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-5">
      <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-black text-gray-900">{value}</p>
      <p className="text-sm font-semibold text-gray-700 mt-0.5">{label}</p>
      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
    </div>
  );
}

function PlanBadge({ user }: { user: User }) {
  if (user.plan === "lifetime") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
        <Crown className="w-3 h-3" /> Vitalício
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
      <RefreshCw className="w-3 h-3" /> Mensal
    </span>
  );
}

function StatusBadge({ user }: { user: User }) {
  if (user.plan === "lifetime") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
        <CheckCircle2 className="w-3 h-3" /> Ativo para sempre
      </span>
    );
  }
  const active = checkAccessActive(user);
  const days = daysLeft(user);
  if (active) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
        <Clock className="w-3 h-3" /> {days}d restantes
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600">
      <AlertCircle className="w-3 h-3" /> Expirado
    </span>
  );
}

function UserRow({ user }: { user: User }) {
  const expiry = getExpiryDate(user);
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-bold text-purple-700">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <PlanBadge user={user} />
      </td>
      <td className="px-4 py-4 text-gray-600">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          {user.createdAt ? formatDate(user.createdAt) : "—"}
        </div>
      </td>
      <td className="px-4 py-4 text-gray-600">
        {expiry ? (
          <span className={checkAccessActive(user) ? "text-gray-600" : "text-red-500 font-semibold"}>
            {formatDate(expiry.toISOString())}
          </span>
        ) : (
          <span className="text-gray-400 text-xs">Nunca expira</span>
        )}
      </td>
      <td className="px-4 py-4">
        <StatusBadge user={user} />
      </td>
    </tr>
  );
}

function UserCard({ user }: { user: User }) {
  const expiry = getExpiryDate(user);
  const active = checkAccessActive(user);
  return (
    <div className="px-4 py-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-bold text-purple-700">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
        <StatusBadge user={user} />
      </div>
      <div className="flex items-center gap-4 text-xs text-gray-500 pl-10">
        <span><PlanBadge user={user} /></span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {user.createdAt ? formatDate(user.createdAt) : "—"}
        </span>
        {expiry && (
          <span className={active ? "" : "text-red-500 font-semibold"}>
            Exp: {formatDate(expiry.toISOString())}
          </span>
        )}
      </div>
    </div>
  );
}
