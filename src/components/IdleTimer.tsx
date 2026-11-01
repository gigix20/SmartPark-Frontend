import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logoutUserServer, logoutUser } from "@/pages/auth/api/authApi";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function IdleTimer() {
  const [showIdleModal, setShowIdleModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

  const triggerIdleLogout = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await logoutUserServer();
    } catch (err) {
      // Ignore network errors during automated logout
    } finally {
      logoutUser();
      setShowIdleModal(true);
    }
  }, []);

  const resetTimer = useCallback(() => {
    const publicPaths = ["/login", "/register", "/", "/forgot-password", "/reset-password", "/appeal", "/terms-and-conditions"];
    if (publicPaths.includes(location.pathname) || showIdleModal) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      triggerIdleLogout();
    }, IDLE_TIMEOUT_MS);
  }, [location.pathname, showIdleModal, triggerIdleLogout]);

  useEffect(() => {
    const publicPaths = ["/login", "/register", "/", "/forgot-password", "/reset-password", "/appeal", "/terms-and-conditions"];
    if (publicPaths.includes(location.pathname)) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];

    const handleActivity = () => {
      resetTimer();
    };

    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [location.pathname, resetTimer]);

  const handleReturnToLogin = () => {
    setShowIdleModal(false);
    navigate("/login", { replace: true });
  };

  if (!showIdleModal) return null;

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-slate-900/70 dark:bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-[32px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 text-center shadow-2xl transition-all animate-in zoom-in-95 duration-200 space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 shadow-inner">
          <Clock className="h-8 w-8 animate-pulse" />
        </div>
        
        <div className="space-y-2">
          <h3 className="font-poppins text-xl font-extrabold text-slate-900 dark:text-white">
            Session Expired Due to Inactivity
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            For campus security, your session was ended after 15 minutes of idle time. Please sign in again.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleReturnToLogin}
          className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
        >
          Return to Login
        </Button>
      </div>
    </div>
  );
}
