import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { forgotPassword, verifyOtp } from "@/pages/auth/api/authApi";

export default function AdminForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user.email || "";
    } catch {
      return "";
    }
  });
  const [step, setStep] = useState<"email" | "otp">("email");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      await forgotPassword({ email });
      setStep("otp");
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || "Failed to send reset code. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setErrorMessage("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = otp.join("");
    if (enteredCode.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await verifyOtp({ email, otp: enteredCode });
      navigate("/reset-password", { state: { email, resetToken: res.resetToken } });
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || "Invalid or expired verification code."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      {/* Tinanggal ang max-w at mx-auto para naka-align sa kaliwa katulad ng iba */}
      <div className="space-y-6">
        
        {/* Back Button & Header */}
        <div className="space-y-1">
          <Link
            to="/admin/change-password"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#0053CC] dark:hover:text-blue-400 transition-colors cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Change Password</span>
          </Link>
          <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">
            Forgot Password
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {step === "email"
              ? "Enter the email linked to your admin account and we'll send you a 6-digit verification code."
              : `We sent a 6-digit code to ${email}. Enter the code below to proceed.`}
          </p>
        </div>

        {/* Card Container */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6">
          {step === "email" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Email Address<span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 px-3.5 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-[#0053CC]"
                />
              </div>

              {errorMessage && (
                <p className="text-xs text-rose-500 font-medium">{errorMessage}</p>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-[#0053CC] hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer transition-all"
                >
                  {isLoading ? "Sending..." : "Send verification code"}
                </button>
              </div>

              <p className="text-[10px] text-center text-slate-400 pt-1">
                Didn&apos;t receive an email? Try checking your junk or spam folders.
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block text-center">
                  Enter 6-Digit Verification Code
                </label>
                <div className="flex justify-center gap-2 sm:gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#0053CC]"
                    />
                  ))}
                </div>
              </div>

              {errorMessage && (
                <p className="text-xs text-rose-500 font-medium text-center">{errorMessage}</p>
              )}

              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  disabled={isLoading || otp.join("").length !== 6}
                  className="w-full py-3 rounded-xl bg-[#0053CC] hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer transition-all"
                >
                  {isLoading ? "Verifying..." : "Verify Code"}
                </button>

                <div className="flex justify-between items-center text-xs">
                  <button
                    type="button"
                    onClick={() => setStep("email")}
                    className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline cursor-pointer"
                  >
                    Change email
                  </button>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isLoading}
                    className="text-[#0053CC] dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                  >
                    Resend Code
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}