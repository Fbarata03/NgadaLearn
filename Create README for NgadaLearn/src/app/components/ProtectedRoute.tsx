import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

interface Props {
  children: React.ReactNode;
}

/** Rota protegida: exige login + pagamento confirmado */
export function ProtectedRoute({ children }: Props) {
  const { isAuthenticated, isPaid } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Guarda a rota original para redirect após login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!isPaid) {
    return <Navigate to="/subscribe" replace />;
  }

  return <>{children}</>;
}
