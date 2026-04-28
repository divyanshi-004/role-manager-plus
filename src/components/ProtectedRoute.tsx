import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { user, loading } = useAuth();

  /* =============================
     STILL CHECKING AUTH
  ==============================*/
  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        Checking session...
      </div>
    );
  }

  /* =============================
     NOT LOGGED IN
  ==============================*/
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  /* =============================
     CHECK ROLE
  ==============================*/
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  /* =============================
     AUTHORIZED
  ==============================*/
  return <>{children}</>;
};

export default ProtectedRoute;