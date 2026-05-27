import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

interface Props {
  children: React.ReactNode;
  adminOnly?: boolean;
}

/** Rota protegida: exige login + acesso activo (pago e não expirado) */
export function ProtectedRoute({ children, adminOnly = false }: Props) {
  const { isAuthenticated, isAccessActive, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!isAccessActive) {
    // Redireciona para /subscribe onde está o fluxo de renovação/compra
    return <Navigate to="/subscribe" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
