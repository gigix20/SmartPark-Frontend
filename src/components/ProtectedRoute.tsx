import { useState, useEffect, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import {
  getCurrentUser,
  logoutUser,
  type User,
} from "@/pages/auth/api/authApi";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    getCurrentUser()
      .then((res) => {
        setUser(res.user);
        localStorage.setItem("user", JSON.stringify(res.user));
      })
      .catch(() => {
        logoutUser();
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 text-xs font-semibold text-slate-400">
        Authenticating session...
      </div>
    );
  }

  const token = localStorage.getItem("token");
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required, verify match
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.role.toUpperCase();
    const hasRole = allowedRoles.some(
      (r) =>
        r.toUpperCase() === userRole ||
        (r.toUpperCase() === "USER" && userRole === "STUDENT"),
    );

    if (!hasRole) {
      // Role not allowed for this route -> Redirect to appropriate dashboard for their role
      if (userRole === "ADMIN") {
        return <Navigate to="/admin" replace />;
      }
      if (userRole === "GUARD") {
        return <Navigate to="/guard" replace />;
      }
      return <Navigate to="/StudentHome" replace />;
    }
  }

  return <>{children}</>;
}
