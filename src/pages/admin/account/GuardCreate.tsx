import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, AlertCircle, Eye, EyeOff } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";

export default function GuardCreate() {
  const navigate = useNavigate();

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  // Password visibility toggle
  const [showPassword, setShowPassword] = useState(false);

  // Validation & Modal states
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Prevent background scrolling kapag bukas ang success modal
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

  // --- VALIDATION RULES ---
  const nameRegex = /^[a-zA-ZÀ-ž\s'-]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const employeeIdRegex = /^([A-Z0-9]{2,4}-[A-Z0-9]{2,4}-[A-Z0-9]{2,4}|\w+-\w+-\w+|\w+)$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const trimmedFirstName = firstName.trim();
  const trimmedLastName = lastName.trim();
  const trimmedEmail = email.trim();
  const trimmedEmployeeId = employeeId.trim();

  // Error validations para sa bawat field
  const firstNameError = !trimmedFirstName
    ? "Please fill out this field."
    : !nameRegex.test(trimmedFirstName)
    ? "Letters, spaces, hyphens, and apostrophes only."
    : "";

  const lastNameError = !trimmedLastName
    ? "Please fill out this field."
    : !nameRegex.test(trimmedLastName)
    ? "Letters, spaces, hyphens, and apostrophes only."
    : "";

  const employeeIdError = !trimmedEmployeeId
    ? "Please fill out this field."
    : !employeeIdRegex.test(trimmedEmployeeId)
    ? "Invalid Employee ID format (e.g. QCU-G-046)."
    : "";

  const emailError = trimmedEmail && !emailRegex.test(trimmedEmail)
    ? "Invalid email format (name@domain.ext)."
    : "";

  const passwordError = !password
    ? "Please fill out this field."
    : password.length < 8
    ? "Minimum of 8 characters required."
    : !passwordRegex.test(password)
    ? "Must include uppercase, lowercase, number, and special character."
    : "";

  const handleCreateGuard = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (firstNameError || lastNameError || employeeIdError || emailError || passwordError) {
      return;
    }

    // Kung walang error, ipakita ang success modal
    setShowSuccessModal(true);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 w-full relative">
        
        {/* Main Card Container */}
        <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-8 transition-colors">
          
          {/* Header Section with Circular Back Button */}
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-6">
            <button
              type="button"
              onClick={handleBack}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            
        <ArrowLeft className="h-4 w-4" />
            </button>
            <h1 
              onClick={handleBack}
              className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400 cursor-pointer hover:underline"
            >
              Create Guard Account
            </h1>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 -mt-4">
            Register a new campus security officer and configure their initial terminal permissions.
          </p>

          <form onSubmit={handleCreateGuard} noValidate className="space-y-8">
            <div className="space-y-6">
              
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="font-poppins text-xs font-bold text-[#0053CC] dark:text-blue-400 uppercase tracking-wider">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* First Name */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      First Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Jose"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={`w-full rounded-xl bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none transition-colors ${
                        isSubmitted && firstNameError 
                          ? "border-2 border-rose-500 focus:border-rose-500" 
                          : "border border-slate-200 dark:border-slate-700 focus:border-[#0053CC]"
                      }`}
                    />
                    {isSubmitted && firstNameError && (
                      <p className="text-rose-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3 shrink-0" /> {firstNameError}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      Last Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Santos"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={`w-full rounded-xl bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none transition-colors ${
                        isSubmitted && lastNameError 
                          ? "border-2 border-rose-500 focus:border-rose-500" 
                          : "border border-slate-200 dark:border-slate-700 focus:border-[#0053CC]"
                      }`}
                    />
                    {isSubmitted && lastNameError && (
                      <p className="text-rose-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3 shrink-0" /> {lastNameError}
                      </p>
                    )}
                  </div>

                  {/* Employee ID */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      Employee ID <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. QCU-G-046"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      className={`w-full rounded-xl bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none transition-colors ${
                        isSubmitted && employeeIdError 
                          ? "border-2 border-rose-500 focus:border-rose-500" 
                          : "border border-slate-200 dark:border-slate-700 focus:border-[#0053CC]"
                      }`}
                    />
                    {isSubmitted && employeeIdError && (
                      <p className="text-rose-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3 shrink-0" /> {employeeIdError}
                      </p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="j.santos@qcu-guard.ph"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full rounded-xl bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none transition-colors ${
                        isSubmitted && emailError 
                          ? "border-2 border-rose-500 focus:border-rose-500" 
                          : "border border-slate-200 dark:border-slate-700 focus:border-[#0053CC]"
                      }`}
                    />
                    {isSubmitted && emailError && (
                      <p className="text-rose-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3 shrink-0" /> {emailError}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <div className={`relative rounded-xl border transition-colors bg-white dark:bg-slate-800 ${
                      isSubmitted && passwordError 
                        ? "border-2 border-rose-500" 
                        : "border border-slate-200 dark:border-slate-700 focus-within:border-[#0053CC]"
                    }`}>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="QCU_Guard_9081!"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-transparent p-3 pr-10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {isSubmitted && passwordError && (
                      <p className="text-rose-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3 shrink-0" /> {passwordError}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="space-y-4 pt-2">
                <h3 className="font-poppins text-xs font-bold text-[#0053CC] dark:text-blue-400 uppercase tracking-wider">
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      Phone Number <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. +63 999 888 7777"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0053CC] transition-colors"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Action Buttons Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                <span>Create Account</span>
              </button>
            </div>

          </form>

        </div>

        {/* --- GUARD ACCOUNT CREATED SUCCESS MODAL --- */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-xs sm:max-w-sm rounded-[32px] bg-white dark:bg-slate-900 p-7 text-center shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 animate-in zoom-in-95 relative transition-colors">
              
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/40">
                <Check className="h-7 w-7 stroke-[2.5]" />
              </div>

              <div>
                <h3 className="font-poppins text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Guard Account Created Successfully
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed px-2">
                  The guard account has been successfully created.
                </p>
              </div>
              
              <div className="pt-2">
                <button 
                  onClick={() => navigate("/admin/accounts")}
                  className="w-full h-10 sm:h-11 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}