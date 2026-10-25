import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, AlertCircle, Eye, EyeOff } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";

export default function AdminCreate() {
  const navigate = useNavigate();

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [adminType, setAdminType] = useState<"Super Administrator" | "Associate Administrator">("Associate Administrator");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation states
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [existingError, setExistingError] = useState(false);

  // Modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Prevent background scrolling kapag bukas ang modal
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

  // --- VALIDATION FUNCTIONS ---
  const nameRegex = /^[a-zA-ZÀ-ž\s'-]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Regex para sa format na XX-XXXX (e.g. 24-1474) o AA-XXXXXXX (e.g. AB-1234567 o ADM-1234567)
  const employeeIdRegex = /^(\d{2}-\d{4}|[A-Z]{2,3}-\d{4,7})$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const trimmedFirstName = firstName.trim();
  const trimmedLastName = lastName.trim();
  const trimmedEmail = email.trim();
  const trimmedEmployeeId = employeeId.trim();

  // Field errors validation
  const firstNameError = !trimmedFirstName
    ? "Please fill out this field."
    : trimmedFirstName.length < 2 || trimmedFirstName.length > 50
    ? "Must be between 2 and 50 characters."
    : !nameRegex.test(trimmedFirstName)
    ? "Letters, spaces, hyphens, and apostrophes only."
    : "";

  const lastNameError = !trimmedLastName
    ? "Please fill out this field."
    : trimmedLastName.length < 2 || trimmedLastName.length > 50
    ? "Must be between 2 and 50 characters."
    : !nameRegex.test(trimmedLastName)
    ? "Letters, spaces, hyphens, and apostrophes only."
    : "";

  const emailError = !trimmedEmail
    ? "Please fill out this field."
    : !emailRegex.test(trimmedEmail)
    ? "Invalid email format (name@domain.ext)."
    : !trimmedEmail.endsWith("@qcu.edu.ph")
    ? "Must be an official institutional email (@qcu.edu.ph)."
    : "";

  const employeeIdError = !trimmedEmployeeId
    ? "Please fill out this field."
    : !employeeIdRegex.test(trimmedEmployeeId)
    ? "Format must be XX-XXXX (e.g. 24-1474) or AA-XXXXXXX (e.g. AB-1234567)."
    : "";

  const passwordError = !password
    ? "Please fill out this field."
    : password.length < 8
    ? "Minimum of 8 characters required."
    : !passwordRegex.test(password)
    ? "Must include uppercase, lowercase, number, and special character."
    : "";

  const confirmPasswordError = !confirmPassword
    ? "Please fill out this field."
    : confirmPassword !== password
    ? "Passwords do not match."
    : "";

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (
      firstNameError ||
      lastNameError ||
      emailError ||
      employeeIdError ||
      passwordError ||
      confirmPasswordError
    ) {
      return;
    }

    // Simulation para sa database uniqueness check
    if (trimmedEmail.toLowerCase() === "existing@qcu.edu.ph" || trimmedEmployeeId === "00-0000") {
      setExistingError(true);
      return;
    }

    setExistingError(false);
    setShowSuccessModal(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl mx-auto relative">
        {/* Back Button */}
        <div>
          <button
            type="button"
            onClick={() => navigate("/admin/accounts")}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#0053CC] dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Accounts</span>
          </button>
        </div>

        {/* Main Form Container */}
        <form onSubmit={handleCreateAccount} noValidate className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-8 transition-colors">
          
          {/* Header Title */}
          <div className="border-b border-slate-100 dark:border-slate-800 pb-6">
            <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">Create New Admin</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Assign dedicated personnel profiles, with granular campus access rules.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column: Personal Information */}
            <div className="space-y-6">
              <h3 className="font-poppins text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Personal Information
              </h3>

              <div className="space-y-4 text-xs">
                {/* First Name */}
                <div className="space-y-1.5">
                  <label className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1">
                    First Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g., John"
                    className={`w-full rounded-xl border bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none transition-colors ${
                      isSubmitted && firstNameError ? "border-rose-500" : "border-slate-200 dark:border-slate-700 focus:border-[#0053CC]"
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
                  <label className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1">
                    Last Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g., Doe"
                    className={`w-full rounded-xl border bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none transition-colors ${
                      isSubmitted && lastNameError ? "border-rose-500" : "border-slate-200 dark:border-slate-700 focus:border-[#0053CC]"
                    }`}
                  />
                  {isSubmitted && lastNameError && (
                    <p className="text-rose-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3 shrink-0" /> {lastNameError}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setExistingError(false);
                    }}
                    placeholder="j.doe@qcu.edu.ph"
                    className={`w-full rounded-xl border bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none transition-colors ${
                      (isSubmitted && emailError) || existingError ? "border-rose-500" : "border-slate-200 dark:border-slate-700 focus:border-[#0053CC]"
                    }`}
                  />
                  {isSubmitted && emailError && !existingError && (
                    <p className="text-rose-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3 shrink-0" /> {emailError}
                    </p>
                  )}
                  {existingError && (
                    <p className="text-rose-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3 shrink-0" /> Admin Account Already Exists (Email taken)
                    </p>
                  )}
                </div>

                {/* Employee ID */}
                <div className="space-y-1.5">
                  <label className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1">
                    ID / Employee ID <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={employeeId}
                    onChange={(e) => {
                      setEmployeeId(e.target.value);
                      setExistingError(false);
                    }}
                    placeholder="24-1474 or ADM-1234567"
                    className={`w-full rounded-xl border bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none transition-colors ${
                      (isSubmitted && employeeIdError) || existingError ? "border-rose-500" : "border-slate-200 dark:border-slate-700 focus:border-[#0053CC]"
                    }`}
                  />
                  {isSubmitted && employeeIdError && !existingError && (
                    <p className="text-rose-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3 shrink-0" /> {employeeIdError}
                    </p>
                  )}
                  {existingError && (
                    <p className="text-rose-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3 shrink-0" /> Admin Account Already Exists (ID taken)
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Role Configuration */}
            <div className="space-y-6">
              <h3 className="font-poppins text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Role Configuration
              </h3>

              <div className="space-y-3 text-xs">
                <label className="text-slate-700 dark:text-slate-300 font-bold block">
                  Administrator Type <span className="text-rose-500">*</span>
                </label>

                {/* Super Administrator Radio Card */}
                <div 
                  onClick={() => setAdminType("Super Administrator")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    adminType === "Super Administrator" 
                      ? "border-[#0053CC] bg-blue-50/40 dark:bg-blue-950/20" 
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input 
                      type="radio" 
                      name="adminType" 
                      checked={adminType === "Super Administrator"}
                      onChange={() => setAdminType("Super Administrator")}
                      className="mt-0.5 accent-[#0053CC]"
                    />
                    <div className="space-y-1">
                      <p className="font-bold text-slate-900 dark:text-white">Super Administrator</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Unrestricted core logs, deletion, credential issuance, and audit access.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Associate Administrator Radio Card */}
                <div 
                  onClick={() => setAdminType("Associate Administrator")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    adminType === "Associate Administrator" 
                      ? "border-[#0053CC] bg-blue-50/40 dark:bg-blue-950/20" 
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input 
                      type="radio" 
                      name="adminType" 
                      checked={adminType === "Associate Administrator"}
                      onChange={() => setAdminType("Associate Administrator")}
                      className="mt-0.5 accent-[#0053CC]"
                    />
                    <div className="space-y-1">
                      <p className="font-bold text-slate-900 dark:text-white">Associate Administrator</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Normal access: records registration, vehicle decals review, and space auditing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Section: Access Credentials */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-poppins text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Access Credentials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              
              {/* Password */}
              <div className="space-y-1.5 relative">
                <label className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className={`w-full rounded-xl border bg-white dark:bg-slate-800 p-3 pr-10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none transition-colors ${
                      isSubmitted && passwordError ? "border-rose-500" : "border-slate-200 dark:border-slate-700 focus:border-[#0053CC]"
                    }`}
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

              {/* Confirm Password */}
              <div className="space-y-1.5 relative">
                <label className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className={`w-full rounded-xl border bg-white dark:bg-slate-800 p-3 pr-10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none transition-colors ${
                      isSubmitted && confirmPasswordError ? "border-rose-500" : "border-slate-200 dark:border-slate-700 focus:border-[#0053CC]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {isSubmitted && confirmPasswordError && (
                  <p className="text-rose-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3 shrink-0" /> {confirmPasswordError}
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* Action Buttons Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => navigate("/admin/accounts")}
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

        {/* --- ADMIN ACCOUNT CREATED SUCCESS MODAL --- */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-[32px] bg-white dark:bg-slate-900 p-7 text-center shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 animate-in zoom-in-95 relative transition-colors">
              
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/40">
                <Check className="h-7 w-7 stroke-[2.5]" />
              </div>

              <div>
                <h3 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">Admin Account Created Successfully</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed px-2">
                  The admin account has been successfully created.
                </p>
              </div>
              
              <div className="pt-2">
                <button 
                  onClick={() => navigate("/admin/accounts")}
                  className="w-full h-11 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
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