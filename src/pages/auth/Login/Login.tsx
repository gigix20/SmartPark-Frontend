import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Clock, CheckCircle2, ShieldAlert } from "lucide-react";
import logo from "@/assets/smartpark-logo.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { loginUser } from "../api/authApi";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  
  // Modal States
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [lockUntil, setLockUntil] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes = 900 seconds

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(Math.max(0, seconds) / 60);
    const secs = Math.max(0, seconds) % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Helper functions for per-account lockout
  const getNormalizedId = useCallback((id: string) => {
    return id.toLowerCase().trim();
  }, []);

  const getLockoutKey = useCallback((id: string) => {
    const norm = getNormalizedId(id);
    return norm ? `smartpark_lock_${norm}` : "";
  }, [getNormalizedId]);

  const getAttemptsKey = useCallback((id: string) => {
    const norm = getNormalizedId(id);
    return norm ? `smartpark_attempts_${norm}` : "";
  }, [getNormalizedId]);

  // Load lockout state for a specific identifier
  const checkAndApplyLockState = useCallback((identifier: string) => {
    const norm = getNormalizedId(identifier);
    if (!norm) {
      setIsLocked(false);
      setIsLockModalOpen(false);
      setLockUntil(null);
      setTimeLeft(900);
      setErrorMessage("");
      return;
    }

    const lockKey = getLockoutKey(norm);
    const lockUntilStr = sessionStorage.getItem(lockKey);
    if (lockUntilStr) {
      const until = parseInt(lockUntilStr, 10);
      const remaining = Math.ceil((until - Date.now()) / 1000);
      if (remaining > 0) {
        setIsLocked(true);
        setLockUntil(until);
        setTimeLeft(remaining);
        setErrorMessage("Too many failed login attempts for this account. Account locked for 15 minutes.");
        return;
      } else {
        sessionStorage.removeItem(lockKey);
      }
    }

    setIsLocked(false);
    setIsLockModalOpen(false);
    setLockUntil(null);
    setTimeLeft(900);
    setErrorMessage("");
  }, [getNormalizedId, getLockoutKey]);

  // Auto-redirect if authenticated + load remembered identifier
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        const role = user.role?.toUpperCase();
        if (role === "ADMIN") {
          navigate("/admin/dashboard", { replace: true });
          return;
        } else if (role === "GUARD") {
          navigate("/guard", { replace: true });
          return;
        } else {
          navigate("/StudentHome", { replace: true });
          return;
        }
      } catch {
        // Continue if invalid user JSON
      }
    }

    const rememberedId = localStorage.getItem("remembered_identifier");
    if (rememberedId) {
      setEmail(rememberedId);
      setRememberDevice(true);
      checkAndApplyLockState(rememberedId);
    }
  }, [navigate, checkAndApplyLockState]);

  // Continuous countdown timer
  useEffect(() => {
    if (!isLocked || !lockUntil) return;

    const tick = () => {
      const remaining = Math.ceil((lockUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setIsLocked(false);
        setIsLockModalOpen(false);
        setLockUntil(null);
        setTimeLeft(900);
        setErrorMessage("");
        const lockKey = getLockoutKey(email);
        const attemptsKey = getAttemptsKey(email);
        if (lockKey) sessionStorage.removeItem(lockKey);
        if (attemptsKey) sessionStorage.removeItem(attemptsKey);
      } else {
        setTimeLeft(remaining);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isLocked, lockUntil, email, getLockoutKey, getAttemptsKey]);

  // Handle identifier input change - instant switching
  const handleIdentifierChange = (value: string) => {
    setEmail(value);
    checkAndApplyLockState(value);
  };

  // Handle remember device toggle
  const handleRememberToggle = (checked: boolean) => {
    setRememberDevice(checked);
    if (!checked) {
      localStorage.removeItem("remembered_identifier");
    }
  };

  // Handle Login Logic with real backend API
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked || isLoading || isSuccess || isSuspended) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await loginUser({ identifier: email, password });

      // Save token and user details
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      // Handle Remember this device
      if (rememberDevice && email.trim()) {
        localStorage.setItem("remembered_identifier", email.trim());
      } else {
        localStorage.removeItem("remembered_identifier");
      }

      // Clear failed attempts for this identifier
      const attemptsKey = getAttemptsKey(email);
      if (attemptsKey) {
        sessionStorage.removeItem(attemptsKey);
      }

      const redirectByRole = (role: string) => {
        const normalizedRole = role.toUpperCase();
        if (normalizedRole === "ADMIN") {
          navigate("/admin/dashboard");
        } else if (normalizedRole === "GUARD") {
          navigate("/guard");
        } else {
          navigate("/StudentHome");
        }
      };

      setIsSuccess(true);

      setTimeout(() => {
        redirectByRole(res.user.role);
      }, 1500);
    } catch (err: any) {
      const status = err.response?.data?.status;
      const backendMessage = err.response?.data?.message;

      if (status === "Suspended") {
        setIsSuspended(true);
      } else if (status === "Locked") {
        const lockUntilTime = Date.now() + 15 * 60 * 1000;
        const lockKey = getLockoutKey(email);
        if (lockKey) {
          sessionStorage.setItem(lockKey, lockUntilTime.toString());
        }
        setIsLocked(true);
        setIsLockModalOpen(true);
        setLockUntil(lockUntilTime);
        setTimeLeft(900);
        setErrorMessage(
          backendMessage ||
            "Too many failed login attempts for this account. Please try again after 15 minutes."
        );
      } else {
        const attemptsKey = getAttemptsKey(email);
        const currentCount = parseInt(
          (attemptsKey && sessionStorage.getItem(attemptsKey)) || "0",
          10
        );
        const newCount = currentCount + 1;

        if (newCount >= 5) {
          // Instant 15-minute countdown on exactly 5th attempt
          const lockUntilTime = Date.now() + 15 * 60 * 1000;
          const lockKey = getLockoutKey(email);
          if (lockKey) {
            sessionStorage.setItem(lockKey, lockUntilTime.toString());
          }
          if (attemptsKey) {
            sessionStorage.removeItem(attemptsKey);
          }
          setIsLocked(true);
          setIsLockModalOpen(true);
          setLockUntil(lockUntilTime);
          setTimeLeft(900);
          setErrorMessage(
            "Too many failed login attempts for this account. Account locked for 15 minutes."
          );
        } else {
          if (attemptsKey) {
            sessionStorage.setItem(attemptsKey, newCount.toString());
          }
          const remaining = 5 - newCount;
          setErrorMessage(
            `Invalid email/school ID or password. (${remaining} attempt${remaining === 1 ? "" : "s"} remaining before 15-minute account lockout)`
          );
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        const r = u.role?.toUpperCase();
        if (r === "ADMIN") return navigate("/admin/dashboard");
        if (r === "GUARD") return navigate("/guard");
      } catch (e) {}
    }
    navigate("/StudentHome");
  };

  const handleAppeal = () => {
    navigate("/appeal");
  };

  return (
    <div className="relative flex min-h-screen w-full font-sans">
      {/* Left Panel - Custom Requested Gradient */}
      <div className="relative hidden min-h-screen w-1/2 flex-col justify-between overflow-hidden bg-linear-to-b from-[#b0c4de] via-[#4a80e2] to-[#2563eb] p-12 text-white md:flex">
        <div />

        {/* Logo */}
        <div className="flex items-center justify-center gap-6">
          <img
            src={logo}
            alt="SmartPark Logo"
            className="h-64 w-auto shrink-0 object-contain md:h-80 lg:h-112"
          />
        </div>

        {/* Active users badge */}
        <div className="z-10 flex items-center gap-3">
          <div className="flex -space-x-2 overflow-hidden">
            <div className="inline-block h-8 w-8 rounded-full border-2 border-white bg-slate-200" />
            <div className="inline-block h-8 w-8 rounded-full border-2 border-white bg-slate-300" />
            <div className="inline-block h-8 w-8 rounded-full border-2 border-white bg-slate-400" />
          </div>
          <span className="text-sm font-semibold text-white">+100 active users</span>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex w-full flex-col justify-center bg-white font-sans px-8 py-12 md:w-1/2 md:px-16 lg:px-24">
        <div className="text-center">
          <h2 className="font-poppins text-3xl font-extrabold text-slate-900">Log In</h2>
          <p className="mt-2 text-xs text-slate-500">
            Enter your credentials to manage your parking access.
          </p>

          {/* Form */}
          <form className="mt-6 flex flex-col gap-6" onSubmit={handleLogin}>
            
            {/* Email / ID Input */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-800">
                Email Address or School ID<span className="text-[#EF4444]">*</span>
              </Label>
              <Input
                type="text"
                id="email"
                placeholder="juandelacruz@gmail.com or 24-1478"
                value={email}
                onChange={(e) => handleIdentifierChange(e.target.value)}
                className="h-10 rounded-xl bg-white text-xs shadow-sm focus-visible:ring-[#0053CC]"
                required
                disabled={isLoading}
              />
            </div>

            {/* Password Input Field */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-xs font-semibold text-slate-800">
                Password<span className="text-[#EF4444]">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 rounded-xl bg-white text-xs shadow-sm focus-visible:ring-[#0053CC]"
                  required
                  disabled={isLocked || isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  disabled={isLocked || isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error Message Indicator */}
            {errorMessage && !isSuspended && (
              <p className="text-xs font-medium text-[#EF4444]">
                {errorMessage}
              </p>
            )}

            {/* Options */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  className="data-[state=checked]:bg-[#0053CC]"
                  checked={rememberDevice}
                  onCheckedChange={(val) => handleRememberToggle(val === true)}
                  disabled={isLoading}
                />
                <Label htmlFor="remember" className="cursor-pointer text-xs font-normal text-slate-700">
                  Remember this device
                </Label>
              </div>
              <Link to="/forgot-password" className="font-medium text-[#0053CC] hover:underline">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLocked || isLoading}
              className="mt-2 w-full bg-[#0053CC] py-5 text-sm font-semibold text-white hover:bg-[#0053CC]/90 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isLocked
                ? `Locked (${formatTime(timeLeft)})`
                : isLoading
                  ? "Signing In..."
                  : "Sign In"}
            </Button>
          </form>

          {/* Footer Links */}
          <p className="mt-6 text-sm text-slate-700">
            New user?{" "}
            <Link to="/register" className="font-semibold text-[#0053CC] hover:underline">
              Register your vehicle
            </Link>
          </p>
          <p className="mt-4 text-xs text-[#9E9E9E]">
            By logging in, you agree to SmartPark&apos;s{" "}
            <Link to="/terms-and-conditions" className="underline hover:text-slate-700 transition-colors">
              Terms & Conditions
            </Link>
            .
          </p>
        </div>
      </div>

      {/* 1. SUCCESS MODAL OVERLAY */}
      {isSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl transition-all animate-in fade-in zoom-in-95">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-[#008080]">
              <CheckCircle2 className="h-9 w-9 stroke-[1.75]" />
            </div>

            <h3 className="mt-4 font-poppins text-xl font-bold text-slate-900">
              Log in Successful
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Redirecting to your dashboard...
            </p>

            <Button
              type="button"
              onClick={handleContinue}
              className="mt-6 w-full rounded-xl bg-[#0053CC] py-5 text-xs font-semibold text-white hover:bg-[#0053CC]/90 shadow-sm"
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* 2. ACCOUNT LOCKED MODAL OVERLAY */}
      {isLockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl transition-all animate-in fade-in zoom-in-95">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-[#EF4444]">
              <Lock className="h-7 w-7" />
            </div>

            <h3 className="mt-4 font-poppins text-xl font-bold text-slate-900">
              Account Locked
            </h3>
            <p className="mt-2 text-xs text-slate-500">
              Your account has been temporarily locked due to multiple failed login attempts.
            </p>

            <div className="mt-5 flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/60 p-4">
              <span className="text-[11px] font-medium text-[#EF4444]">
                Time remaining
              </span>
              <div className="mt-1 flex items-center gap-1.5 text-[#EF4444]">
                <Clock className="h-5 w-5" />
                <span className="font-poppins text-3xl font-bold tracking-tight">
                  {formatTime(timeLeft)}
                </span>
              </div>
              <span className="text-[10px] text-red-400">minutes</span>
            </div>

            <Button
              type="button"
              onClick={() => setIsLockModalOpen(false)}
              variant="outline"
              className="mt-6 w-full rounded-xl border-slate-200 text-xs font-semibold text-[#0053CC] hover:bg-slate-50 cursor-pointer"
            >
              Return to Log In
            </Button>
          </div>
        </div>
      )}

      {/* 3. ACCOUNT SUSPENDED MODAL OVERLAY */}
      {isSuspended && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl transition-all animate-in fade-in zoom-in-95">
            {/* Red Tint Shield Icon */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-[#EF4444]">
              <ShieldAlert className="h-7 w-7" />
            </div>

            {/* Suspended Header & Message */}
            <h3 className="mt-4 font-poppins text-xl font-bold text-slate-900">
              Account Suspended
            </h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              If you believe this suspension was a mistake, you may submit an appeal for review.
            </p>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col gap-3">
              <Button
                type="button"
                onClick={handleAppeal}
                className="w-full rounded-xl bg-[#0053CC] py-5 text-xs font-semibold text-white hover:bg-[#0053CC]/90 shadow-xs"
              >
                Submit Appeal
              </Button>
              <Button
                type="button"
                onClick={() => navigate("/terms-and-conditions")}
                variant="outline"
                className="w-full rounded-xl border border-slate-200 text-xs font-semibold text-[#0053CC] hover:bg-slate-50"
              >
                Terms & Conditions
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;