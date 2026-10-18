import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, AlertTriangle, CheckCircle2 } from "lucide-react";
import logo from "@/assets/smartpark-logo.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPassword() {
  const navigate = useNavigate();

  // Primary States
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");

  // Validation & Modal States
  const [isInvalidEmailOpen, setIsInvalidEmailOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  // OTP States
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpStatus, setOtpStatus] = useState<"normal" | "invalid" | "expired">("normal");
  const [timer, setTimer] = useState(59);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Sample registered emails for validation simulation
  const registeredEmails = ["admin@qcu.edu.ph", "user@smartpark.com", "student@qcu.edu.ph"];

  // Countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && isTimerActive) {
      setIsTimerActive(false);
      setOtpStatus("expired");
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  // Handle Email Submit
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registeredEmails.includes(email.toLowerCase().trim())) {
      setIsInvalidEmailOpen(true);
    } else {
      setStep("otp");
      startTimer();
      setOtpStatus("normal");
    }
  };

  const startTimer = () => {
    setTimer(59);
    setIsTimerActive(true);
  };

  // Handle OTP Inputs
  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Reset error on typing
    if (otpStatus !== "normal") {
      setOtpStatus("normal");
    }

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP Action
  const handleVerifyOtp = () => {
    const enteredCode = otp.join("");
    
    if (timer === 0) {
      setOtpStatus("expired");
      return;
    }

    // Mock valid OTP code: "592123" o kaya "123456"
    if (enteredCode === "592123" || enteredCode === "123456") {
      setIsSuccessOpen(true);
    } else {
      setOtpStatus("invalid");
    }
  };

  const handleResendCode = () => {
    setOtp(Array(6).fill(""));
    setOtpStatus("normal");
    startTimer();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      {/* Background Image Container */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/bg-building.jpg')" }}
      >
        <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" />
      </div>

      {/* Main Form Card */}
      <div className="relative w-full max-w-lg rounded-[28px] bg-white p-8 sm:p-10 shadow-2xl">
        {/* Logo Header */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="SmartPark Logo" className="h-14 object-contain" />
        </div>

        {/* TITLE & SUBTITLE */}
        {step === "email" ? (
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B]">
              Forgot Password
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 font-normal">
              Enter your email address below and we&apos;ll help you regain access to your account.
            </p>
          </div>
        ) : (
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B]">
              Confirm your account
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 font-normal">
              We sent a code to your email. Enter the 6-digit code to confirm your account.
            </p>
          </div>
        )}

        {/* STEP 1: EMAIL FORM */}
        {step === "email" && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2 text-left mb-6">
              <Label htmlFor="email" className="text-xs sm:text-sm font-semibold text-slate-900">
                Email Address<span className="text-red-500 ml-0.5">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl border-slate-300 pr-10 text-xs sm:text-sm placeholder:text-slate-400 focus-visible:ring-[#0053CC]"
                />
                <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-white font-semibold text-sm transition-all shadow-sm"
            >
              Continue
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/")}
              className="w-full h-12 rounded-xl border border-slate-200 text-sm font-semibold text-[#0053CC] hover:bg-slate-50"
            >
              Cancel
            </Button>
          </form>
        )}

        {/* STEP 2: OTP INPUT FORM */}
        {step === "otp" && (
          <div className="space-y-6">
            {/* 6 OTP Boxes */}
            <div className="flex justify-between gap-2 sm:gap-3 my-4">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className={`h-14 w-12 sm:w-14 text-center text-lg sm:text-xl font-bold rounded-xl border transition-all focus:outline-none ${
                    otpStatus === "invalid"
                      ? "border-red-400 bg-red-50 text-red-600 focus:ring-2 focus:ring-red-400"
                      : otpStatus === "expired"
                      ? "border-amber-400 bg-amber-50/50 text-amber-700 focus:ring-2 focus:ring-amber-400"
                      : digit
                      ? "border-blue-500 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500"
                      : "border-slate-300 bg-white text-slate-900 focus:border-blue-500"
                  }`}
                />
              ))}
            </div>

            {/* Error Message Labels */}
            {otpStatus === "invalid" && (
              <div className="flex items-center gap-1.5 text-xs text-red-500 font-medium justify-start">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>The code you entered is incorrect. Please try again.</span>
              </div>
            )}

            {otpStatus === "expired" && (
              <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium justify-start">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>This OTP has expired. Please request a new code.</span>
              </div>
            )}

            {/* In-line Resend Timer Text (Katulad ng nasa larawan) */}
            <div className="text-center text-xs text-slate-400 font-medium">
              Didn&apos;t receive the code?{" "}
              {isTimerActive ? (
                <span className="text-blue-600 font-semibold">
                  Resend in 0:{timer < 10 ? `0${timer}` : timer}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-blue-600 font-semibold hover:underline focus:outline-none"
                >
                  Resend in 0:00
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <Button
                type="button"
                onClick={handleVerifyOtp}
                disabled={otp.some((digit) => !digit) || otpStatus === "expired"}
                className="w-full h-12 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-white font-semibold text-sm transition-all shadow-sm"
              >
                Verify
              </Button>

              {/* Cancel Button */}
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep("email")}
                className="w-full h-12 rounded-xl border border-slate-200 text-sm font-semibold text-[#0053CC] hover:bg-slate-50"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="my-6 border-t border-slate-100" />

        {/* Footer Note */}
        <div className="text-center text-[11px] sm:text-xs text-slate-400 space-y-0.5">
          <p>Didn&apos;t receive an email?</p>
          <p>Try checking your junk or spam folders.</p>
        </div>
      </div>

      {/* MODAL 1: INVALID EMAIL POPUP */}
      {isInvalidEmailOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 sm:p-8 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
              <AlertTriangle className="h-7 w-7" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">Invalid Email</h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              The email address you entered is not registered with SmartPark. Please check your email address and try again.
            </p>

            <Button
              type="button"
              onClick={() => setIsInvalidEmailOpen(false)}
              className="mt-6 w-full h-11 rounded-xl border border-red-300 bg-white text-red-500 font-medium hover:bg-red-50 transition-colors"
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* MODAL 2: CODE VERIFIED SUCCESSFULLY POPUP */}
      {isSuccessOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 sm:p-8 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
              <CheckCircle2 className="h-7 w-7" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">Code Verified Successfully!</h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Your verification code is verified. You may now create a new password.
            </p>

            <Button
              type="button"
              onClick={() => navigate("/reset-password")}
              className="mt-6 w-full h-11 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-white font-semibold transition-colors"
            >
              Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}