import { useState, useEffect, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShieldAlert, Clock, ArrowRight } from "lucide-react";
import {
  getCurrentUser,
  logoutUser,
  type User,
} from "@/pages/auth/api/authApi";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const hasToken = typeof window !== "undefined" && !!localStorage.getItem("token");
  const [loading, setLoading] = useState(hasToken);
  const [unauthorizedState, setUnauthorizedState] = useState<{
    type: "NO_SESSION" | "INSUFFICIENT_ROLE";
    target: string;
  } | null>(() => {
    if (!hasToken) {
      return { type: "NO_SESSION", target: "/login" };
    }
    return null;
  });
  const [countdown, setCountdown] = useState(3);
  const [, setUser] = useState<User | null>(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUnauthorizedState({ type: "NO_SESSION", target: "/login" });
      setLoading(false);
      return;
    }

    getCurrentUser()
      .then((res) => {
        if (res.user?.accountStatus && res.user.accountStatus !== "Active") {
          logoutUser();
          setUser(null);
          setUnauthorizedState({ type: "NO_SESSION", target: "/login" });
          return;
        }

        setUser(res.user);
        localStorage.setItem("user", JSON.stringify(res.user));

        // Role verification
        if (allowedRoles && allowedRoles.length > 0) {
          const userRole = res.user.role?.toUpperCase();
          const hasRole = allowedRoles.some(
            (r) =>
              r.toUpperCase() === userRole ||
              (r.toUpperCase() === "USER" && userRole === "STUDENT") ||
              (r.toUpperCase() === "ADMIN" && userRole === "SUPER_ADMIN")
          );

          if (!hasRole) {
            let target = "/StudentHome";
            if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") target = "/admin/dashboard";
            else if (userRole === "GUARD") target = "/guard";

            setUnauthorizedState({ type: "INSUFFICIENT_ROLE", target });
            return;
          }
        }

        setUnauthorizedState(null);
      })
      .catch(() => {
        logoutUser();
        setUser(null);
        setUnauthorizedState({ type: "NO_SESSION", target: "/login" });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [allowedRoles]);

  // Countdown effect to automatically redirect
  useEffect(() => {
    if (!unauthorizedState) return;

    if (countdown <= 0) {
      navigate(unauthorizedState.target, {
        state: { from: location },
        replace: true,
      });
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [unauthorizedState, countdown, navigate, location]);

  const handleRedirectNow = () => {
    if (!unauthorizedState) return;
    navigate(unauthorizedState.target, {
      state: { from: location },
      replace: true,
    });
  };

  // 1. Loading state with brand spinner
  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-white text-slate-400 space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#0053CC] border-t-transparent" />
        <span className="text-xs font-medium text-slate-400">
          Checking authorization...
        </span>
      </div>
    );
  }

  // 2. Unauthorized / Access Denied Modal matching SmartPark color palette
  if (unauthorizedState) {
    const isNoSession = unauthorizedState.type === "NO_SESSION";

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl transition-all animate-in fade-in zoom-in-95">
          {/* Red Tint Shield Icon (consistent with SmartPark Locked and Suspended modals) */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-[#EF4444]">
            <ShieldAlert className="h-7 w-7" />
          </div>

          {/* Heading and Message */}
          <h3 className="mt-4 font-poppins text-xl font-bold text-slate-900">
            {isNoSession ? "You're Not Authorized" : "Access Restricted"}
          </h3>
          <p className="mt-2 text-xs text-slate-500 leading-relaxed px-1">
            {isNoSession
              ? "You do not have an active session to access this page. Redirecting to login..."
              : "Your account does not have permission to view this page. Redirecting to your dashboard..."}
          </p>

          {/* Countdown & Progress indicator with #0053CC */}
          <div className="mt-5 flex flex-col items-center justify-center rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0053CC]">
              <Clock className="h-4 w-4" />
              <span>
                Redirecting in {countdown} second{countdown === 1 ? "" : "s"}...
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-blue-100">
              <div
                className="h-full bg-[#0053CC] transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${(countdown / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Action Button */}
          <Button
            type="button"
            onClick={handleRedirectNow}
            className="mt-6 w-full rounded-xl bg-[#0053CC] py-5 text-xs font-semibold text-white hover:bg-[#0053CC]/90 shadow-sm cursor-pointer"
          >
            <span>
              {isNoSession ? "Return to Log In" : "Return to Dashboard"}
            </span>
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
