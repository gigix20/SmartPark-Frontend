import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, CheckCircle2, AlertTriangle } from "lucide-react";
import { GuardHeader } from "@/components/GuardHeader";
import { GuardNav } from "@/components/GuardNav";
import { changePassword } from "@/pages/auth/api/authApi";

export default function GuardChangePassword() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Form states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Visibility toggles para sa password fields
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Validation, Loading & Modal states
  const [currentError, setCurrentError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lock background scroll kapag bukas ang success modal
  useEffect(() => {
    if (showSuccessModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showSuccessModal]);

  // Dynamic Password Strength Calculator habang nagtitipa
  const calculateStrength = (pass: string) => {
    if (!pass) return { width: "0%", label: "", color: "bg-slate-200" };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score++;

    if (score === 1) return { width: "33%", label: "Weak Password", color: "bg-rose-500" };
    if (score === 2) return { width: "66%", label: "Medium Password", color: "bg-amber-500" };
    if (score >= 3) return { width: "100%", label: "Strong Password", color: "bg-emerald-500" };
    return { width: "0%", label: "", color: "bg-slate-200" };
  };

  const strength = calculateStrength(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentError("");
    setConfirmError("");

    if (newPassword !== confirmPassword) {
      setConfirmError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setConfirmError("New password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowSuccessModal(true);
    } catch (err: any) {
      setCurrentError(
        err.response?.data?.message ||
          "Incorrect current password. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex flex-col transition-colors font-sans">
      <GuardHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex-1 flex relative">
        <GuardNav isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto lg:pl-72 transition-all">
          <div className="space-y-6 max-w-5xl mx-auto pb-16">
            
            {/* Uniform Back Button & Header sa labas ng card (gaya ng AdminChangePassword) */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/guard/profile")}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div>
                <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">
                  Change Password
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Update your account password to keep your profile secure.
                </p>
              </div>
            </div>

            {/* Main Change Password Card Container */}
            <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6 transition-colors">

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Current Password */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Current Password*</label>
                    <span 
                      onClick={() => navigate("/forgot-password")}
                      className="text-[#0053CC] hover:underline cursor-pointer font-semibold"
                    >
                      Forgot Password?
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showCurrent ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => {
                        setCurrentPassword(e.target.value);
                        if (currentError) setCurrentError("");
                      }}
                      placeholder="Enter current password"
                      required
                      className={`w-full rounded-xl border bg-white dark:bg-slate-800 px-3.5 py-2.5 pr-10 text-xs text-slate-900 dark:text-white focus:outline-none transition-colors ${
                        currentError ? "border-rose-500 focus:border-rose-500" : "border-slate-200 dark:border-slate-700 focus:border-[#0053CC]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {currentError && (
                    <div className="flex items-center gap-1.5 text-rose-500 text-[11px] font-semibold pt-1">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                      <span>{currentError}</span>
                    </div>
                  )}
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 text-xs">New Password*</label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 pr-10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0053CC]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  {newPassword && (
                    <div className="space-y-1 pt-1.5 animate-in fade-in duration-200">
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-300 ${strength.color}`} style={{ width: strength.width }}></div>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Password Strength:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{strength.label}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm New Password */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 text-xs">Confirm New Password*</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (confirmError) setConfirmError("");
                      }}
                      placeholder="Confirm new password"
                      required
                      className={`w-full rounded-xl border bg-white dark:bg-slate-800 px-3.5 py-2.5 pr-10 text-xs text-slate-900 dark:text-white focus:outline-none transition-colors ${
                        confirmError ? "border-rose-500 focus:border-rose-500" : "border-slate-200 dark:border-slate-700 focus:border-[#0053CC]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {confirmError && (
                    <div className="flex items-center gap-1.5 text-rose-500 text-[11px] font-semibold pt-1">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                      <span>{confirmError}</span>
                    </div>
                  )}
                </div>

                {/* Password Requirements Box */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2 text-xs text-slate-500">
                  <p className="font-bold text-slate-700 dark:text-slate-300">Password Requirements:</p>
                  <ul className="space-y-1 text-[11px]">
                    <li className="flex items-center gap-2">✓ Must be at least 8 characters long</li>
                    <li className="flex items-center gap-2">✓ Include at least one uppercase letter (A-Z)</li>
                    <li className="flex items-center gap-2">✓ Include at least one number (0-9) or special character</li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => navigate("/guard/profile")}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] disabled:opacity-60 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    {isSubmitting ? "Saving..." : "Change Password"}
                  </button>
                </div>

              </form>

            </div>

          </div>
        </main>
      </div>

      {/* ================= SUCCESS MODAL ================= */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-110 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-[32px] bg-white dark:bg-slate-900 p-7 text-center shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 animate-in zoom-in-95 relative transition-colors">
            
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/40">
              <CheckCircle2 className="h-7 w-7" />
            </div>

            <div>
              <h3 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">Password Changed Successfully</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed px-2">
                The changes have been saved to your account.
              </p>
            </div>
            
            <div className="pt-2">
              <button 
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate("/guard/profile");
                }}
                className="w-full h-11 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}