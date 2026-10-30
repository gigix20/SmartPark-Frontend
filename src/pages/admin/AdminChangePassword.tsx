import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { changePassword } from "@/pages/auth/api/authApi";

export default function AdminChangePassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isLengthValid = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumberOrSpecial = /[0-9!@#$%^&*(),.?":{}|<>]/.test(newPassword);

  const getPasswordStrength = () => {
    if (!newPassword) return 0;
    let score = 0;
    if (isLengthValid) score += 33;
    if (hasUppercase) score += 33;
    if (hasNumberOrSpecial) score += 34;
    return score;
  };

  const strengthScore = getPasswordStrength();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirm password do not match.");
      return;
    }

    if (!isLengthValid || !hasUppercase || !hasNumberOrSpecial) {
      setErrorMessage("Please fulfill all password requirements.");
      return;
    }

    setIsLoading(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setIsSuccessModalOpen(true);
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message ||
          "Failed to update password. Please check your current password."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      {/* Tinanggal ang max-w at mx-auto para sumunod sa gilid tulad ng iba pang pages */}
      <div className="space-y-6">
        
        {/* Back Button & Header */}
        <div className="space-y-1">
          <Link
            to="/admin/profile"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#0053CC] dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Profile</span>
          </Link>
          <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">
            Change Password
          </h1>
        </div>

        {/* Form Card Container */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6">
          <form onSubmit={handleChangePassword} className="space-y-5">
            
            {/* Current Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Current Password<span className="text-rose-500">*</span>
                </label>
                <Link
                  to="/admin/forgot-password"
                  className="text-xs font-semibold text-[#0053CC] dark:text-blue-400 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className={`w-full rounded-xl border ${
                    errorMessage ? "border-rose-500 bg-rose-50/20" : "border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40"
                  } px-3.5 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-[#0053CC] pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errorMessage && (
                <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" /> {errorMessage}
                </p>
              )}
            </div>

            {/* New Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                New Password<span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 px-3.5 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-[#0053CC] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              <div className="space-y-1 pt-1">
                <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      strengthScore < 50
                        ? "bg-rose-500"
                        : strengthScore < 100
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${strengthScore}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">Password Strength:</span>
                  <span
                    className={`font-bold ${
                      strengthScore === 100
                        ? "text-emerald-600 dark:text-emerald-400"
                        : strengthScore > 0
                        ? "text-amber-500"
                        : "text-slate-400"
                    }`}
                  >
                    {strengthScore === 100 ? "Strong Password" : strengthScore > 0 ? "Medium" : "Too Weak"}
                  </span>
                </div>
              </div>
            </div>

            {/* Confirm New Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Confirm New Password<span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 px-3.5 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-[#0053CC] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Requirements Box */}
            <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-4 space-y-2 text-xs">
              <p className="font-bold text-slate-700 dark:text-slate-300">Password Requirements:</p>
              <ul className="space-y-1 text-slate-500 dark:text-slate-400 text-[11px]">
                <li className={`flex items-center gap-1.5 ${isLengthValid ? "text-emerald-600 font-semibold" : ""}`}>
                  <span>✓</span> Must be at least 8 characters long
                </li>
                <li className={`flex items-center gap-1.5 ${hasUppercase ? "text-emerald-600 font-semibold" : ""}`}>
                  <span>✓</span> Include at least one uppercase letter (A-Z)
                </li>
                <li className={`flex items-center gap-1.5 ${hasNumberOrSpecial ? "text-emerald-600 font-semibold" : ""}`}>
                  <span>✓</span> Include at least one number (0-9) or special character
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => navigate("/admin/profile")}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl bg-[#0053CC] hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer transition-all"
              >
                {isLoading ? "Saving..." : "Change Password"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-8 text-center shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4 animate-in zoom-in-95">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border border-emerald-100 dark:border-emerald-900">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">
                Password Changed Successfully
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                The changes have been saved to your account.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsSuccessModalOpen(false);
                navigate("/admin/profile");
              }}
              className="w-full py-3 rounded-xl bg-[#0053CC] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}