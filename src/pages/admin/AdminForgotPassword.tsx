import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { forgotPassword } from "@/pages/auth/api/authApi";

export default function AdminForgotPassword() {
  const [email, setEmail] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user.email || "";
    } catch {
      return "";
    }
  });
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      await forgotPassword({ email });
      setIsSent(true);
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || "Failed to send reset link. Please try again."
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
            Enter the email linked to your admin account and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {/* Card Container */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6">
          {!isSent ? (
            <form onSubmit={handleReset} className="space-y-4">
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
                  {isLoading ? "Sending..." : "Send reset link"}
                </button>
              </div>

              <p className="text-[10px] text-center text-slate-400 pt-1">
                Didn&apos;t receive an email? Try checking your junk or spam folders.
              </p>
            </form>
          ) : (
            <div className="text-center space-y-4 py-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border border-emerald-100 dark:border-emerald-900">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                A password reset link has been sent to <strong>{email}</strong>.
              </p>
              <Link
                to="/admin/change-password"
                className="inline-block px-6 py-2.5 rounded-xl bg-[#0053CC] hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all"
              >
                Back to Change Password
              </Link>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}