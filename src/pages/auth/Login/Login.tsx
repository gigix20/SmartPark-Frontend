import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Clock, CheckCircle2, ShieldAlert } from "lucide-react";
import logo from "../../../assets/smartpark-logo.svg";
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
  
  // Modal States
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes (300s)

  // Countdown Timer Logic
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isLocked && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsLocked(false);
      setFailedAttempts(0);
      setTimeLeft(300);
      setErrorMessage("");
    }
    return () => clearInterval(timer);
  }, [isLocked, timeLeft]);

  // Handle Login Logic with real backend API
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormDisabled || isLoading) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await loginUser({ identifier: email, password });

      // Save token and user details
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      setIsSuccess(true);
      setFailedAttempts(0);

      // Auto-redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err: any) {
      const status = err.response?.data?.status;
      const message = err.response?.data?.message || "Invalid credentials. Please try again.";

      if (status === "Suspended") {
        setIsSuspended(true);
      } else if (status === "Locked") {
        setIsLocked(true);
        setErrorMessage("Account is temporarily locked.");
      } else {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);

        if (newAttempts >= 5) {
          setIsLocked(true);
          setErrorMessage("Account locked due to multiple failed attempts.");
        } else {
          setErrorMessage(message);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    navigate("/dashboard");
  };

  const handleAppeal = () => {
    // I-navigate sa appeal submission page o mag-open ng appeal form
    navigate("/appeal");
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const isFormDisabled = isLocked || isSuccess || isSuspended;

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
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 rounded-xl bg-white text-xs shadow-sm focus-visible:ring-[#0053CC]"
                required
                disabled={isFormDisabled}
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
                  disabled={isFormDisabled}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  disabled={isFormDisabled}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error Message Indicator */}
            {errorMessage && !isLocked && !isSuspended && (
              <p className="text-xs font-medium text-[#EF4444]">
                {errorMessage}
              </p>
            )}

            {/* Options */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" className="data-[state=checked]:bg-[#0053CC]" disabled={isFormDisabled} />
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
              disabled={isFormDisabled || isLoading}
              className="mt-2 w-full bg-[#0053CC] py-5 text-sm font-semibold text-white hover:bg-[#0053CC]/90 disabled:opacity-50"
            >
              {isLoading ? "Signing In..." : "Sign In"}
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
      {isLocked && (
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
              onClick={() => setIsLocked(false)}
              variant="outline"
              className="mt-6 w-full rounded-xl border-slate-200 text-xs font-semibold text-[#0053CC] hover:bg-slate-50"
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