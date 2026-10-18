import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import logo from "@/assets/smartpark-logo.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPassword() {
  const navigate = useNavigate();

  // Input states
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [logoutOtherDevices, setLogoutOtherDevices] = useState(false);

  // Validation & Modal states
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  // Password Strength Calculator (1 to 4)
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return { score: 0, label: "" };
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-500", text: "text-red-500" };
    if (score === 2) return { score: 2, label: "Fair", color: "bg-amber-500", text: "text-amber-500" };
    if (score === 3) return { score: 3, label: "Good", color: "bg-blue-500", text: "text-blue-500" };
    return { score: 4, label: "Strong", color: "bg-emerald-500", text: "text-emerald-500" };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    // Validate Password Length
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      hasError = true;
    } else {
      setPasswordError("");
    }

    // Validate Confirm Password Match
    if (password !== confirmPassword) {
      setConfirmError("Passwords do not match. Please try again.");
      hasError = true;
    } else {
      setConfirmError("");
    }

    if (!hasError) {
      setIsSuccessOpen(true);
    }
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
          <img src={logo} alt="SmartPark Logo" className="h-12 object-contain" />
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B]">
            Set New Password
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 font-normal">
            Enter and confirm your new password to regain access to your account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password Field */}
          <div className="space-y-1.5 text-left">
            <Label htmlFor="password" className="text-xs sm:text-sm font-semibold text-slate-900">
              New Password<span className="text-red-500 ml-0.5">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError("");
                }}
                className={`h-12 rounded-xl pr-10 text-xs sm:text-sm transition-colors focus-visible:ring-1 ${
                  passwordError
                    ? "border-red-500 bg-red-50/20 focus-visible:ring-red-500"
                    : "border-slate-300 focus-visible:ring-[#0053CC]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {passwordError && (
              <div className="flex items-center gap-1 text-[11px] text-red-500 font-medium">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}
          </div>

          {/* Password Strength Indicator Bar */}
          {password && (
            <div className="space-y-1 pt-1">
              <div className="flex justify-between items-center text-[11px] font-medium text-slate-500">
                <span>Password Strength</span>
                <span className={`font-semibold ${strength.text}`}>{strength.label}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      step <= strength.score ? strength.color : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Confirm New Password Field */}
          <div className="space-y-1.5 text-left pt-2">
            <Label htmlFor="confirmPassword" className="text-xs sm:text-sm font-semibold text-slate-900">
              Confirm New Password<span className="text-red-500 ml-0.5">*</span>
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (confirmError) setConfirmError("");
                }}
                className={`h-12 rounded-xl pr-10 text-xs sm:text-sm transition-colors focus-visible:ring-1 ${
                  confirmError
                    ? "border-red-500 bg-red-50/20 focus-visible:ring-red-500"
                    : "border-slate-300 focus-visible:ring-[#0053CC]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {confirmError && (
              <div className="flex items-center gap-1 text-[11px] text-red-500 font-medium">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{confirmError}</span>
              </div>
            )}
          </div>

          {/* Logout Checkbox */}
          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="logoutDevices"
              checked={logoutOtherDevices}
              onChange={(e) => setLogoutOtherDevices(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label
              htmlFor="logoutDevices"
              className="text-[11px] sm:text-xs text-slate-500 cursor-pointer select-none"
            >
              Log out in other devices, confirm this if someone else use your account.
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-white font-semibold text-sm transition-all shadow-sm mt-4"
          >
            Reset Password
          </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/forgot-password")} 
              className="w-full h-12 rounded-xl border border-slate-200 text-sm font-semibold text-[#0053CC] hover:bg-slate-50"
            >
              Cancel
            </Button>
        </form>
      </div>

      {/* SUCCESS MODAL POPUP */}
      {isSuccessOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 sm:p-8 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
              <CheckCircle2 className="h-7 w-7" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">Password Reset Successful!</h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Your password has been successfully updated. You may now sign in to your SmartPark account using your new password.
            </p>

            <Button
              type="button"
              onClick={() => navigate("/")} // Navigate pabalik sa Login Page
              className="mt-6 w-full h-11 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-white font-semibold transition-colors"
            >
              Return to Log In
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}