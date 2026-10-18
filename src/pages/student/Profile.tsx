import { useState } from "react";
import { 
  User, 
  Mail, 
  CreditCard, 
  Phone, 
  Calendar, 
  Lock, 
  ChevronRight, 
  ArrowLeft, 
  Camera, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  AlertTriangle,
  Edit2
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Profile() {
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  // View States: 'main' | 'edit-profile' | 'change-password'
  const [viewState, setViewState] = useState<"main" | "edit-profile" | "change-password">("main");

  // Profile Data State
  const [profileData, setProfileData] = useState({
    fullName: currentUser ? `${currentUser.firstName || "Sophia"} ${currentUser.lastName || "Reyes"}` : "Sophia Reyes",
    email: currentUser?.email || "sophia.reyes@qcu.edu.ph",
    schoolId: currentUser?.schoolId || "24-0123",
    phoneNumber: "+63 912 345 6789",
    campus: "San Bartolome Campus",
    accountStatus: currentUser?.accountStatus || "Active",
    yearRegistered: "2026",
    lastPasswordUpdate: "October 12, 2026 10:00AM",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300"
  });

  // Edit Profile Form State
  const [editForm, setEditForm] = useState({ ...profileData });

  // Password Form State & Errors
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [pwErrors, setPwErrors] = useState<{ [key: string]: string }>({});

  // Modal States
  const [isProfileSuccessOpen, setIsProfileSuccessOpen] = useState(false);
  const [isPwSuccessOpen, setIsPwSuccessOpen] = useState(false);
  const [isPwErrorOpen, setIsPwErrorOpen] = useState(false);

  // Password Requirements Check
  const pwRequirements = {
    length: passwordForm.newPassword.length >= 8,
    uppercase: /[A-Z]/.test(passwordForm.newPassword),
    specialOrNumber: /[0-9!@#$%^&*]/.test(passwordForm.newPassword)
  };

  // Submit Profile Changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileData({ ...editForm });
    setIsProfileSuccessOpen(true);
  };

  // Submit Password Change
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Current password is required.";
    }
    if (!passwordForm.newPassword) {
      errors.newPassword = "New password is required.";
    } else if (!pwRequirements.length || !pwRequirements.uppercase || !pwRequirements.specialOrNumber) {
      errors.newPassword = "Password does not meet requirements.";
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(errors).length > 0) {
      setPwErrors(errors);
      if (passwordForm.currentPassword === "wrong") {
        setIsPwErrorOpen(true);
      }
      return;
    }

    setPwErrors({});
    setIsPwSuccessOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-28 transition-colors duration-300">
      {/* Top Header */}
      <Header currentUser={currentUser} />

      {/* Main Content Area */}
      <main className="mx-auto max-w-4xl p-4 sm:p-8 space-y-6">

        {/* ----------------- VIEW 1: MAIN PROFILE UI ----------------- */}
        {viewState === "main" && (
          <div className="space-y-6">
            
            {/* Header Banner */}
            <div className="rounded-[24px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm transition-colors duration-300">
              <h1 className="font-poppins text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                Profile
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Manage your personal information and account settings
              </p>
            </div>

            {/* User Profile Card */}
            <div className="rounded-[24px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex items-center gap-5 transition-colors duration-300">
              <div className="relative">
                <img
                  src={profileData.avatar}
                  alt={profileData.fullName}
                  className="h-20 w-20 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setViewState("edit-profile")}
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#0053CC] text-white shadow-md hover:bg-blue-700 transition-colors cursor-pointer"
                  title="Change Photo"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>

              <div>
                <h2 className="font-poppins text-xl font-bold text-slate-900 dark:text-white">
                  {profileData.fullName}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {profileData.campus}
                </p>
                <span className="inline-block mt-2 px-3 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                  {profileData.accountStatus}
                </span>
              </div>
            </div>

            {/* Personal Information Section with Edit Profile Button */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">
                  Personal Information
                </h3>
                <button
                  type="button"
                  onClick={() => setViewState("edit-profile")}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#0053CC] dark:text-blue-400 hover:underline cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Edit Profile</span>
                </button>
              </div>

              <div className="rounded-[24px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-sm divide-y divide-slate-100 dark:divide-slate-800 transition-colors duration-300">
                
                {/* Full Name */}
                <div className="flex items-center gap-4 p-4">
                  <User className="h-5 w-5 text-slate-400 shrink-0" />
                  <div className="flex-1">
                    <p className="text-[11px] text-slate-400 font-medium">Full Name</p>
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">{profileData.fullName}</p>
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex items-center gap-4 p-4">
                  <Mail className="h-5 w-5 text-slate-400 shrink-0" />
                  <div className="flex-1">
                    <p className="text-[11px] text-slate-400 font-medium">Email Address</p>
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">{profileData.email}</p>
                  </div>
                </div>

                {/* ID No */}
                <div className="flex items-center gap-4 p-4">
                  <CreditCard className="h-5 w-5 text-slate-400 shrink-0" />
                  <div className="flex-1">
                    <p className="text-[11px] text-slate-400 font-medium">ID No.</p>
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">{profileData.schoolId}</p>
                  </div>
                </div>

                {/* Phone Number (Static Row, no arrow) */}
                <div className="flex items-center gap-4 p-4">
                  <Phone className="h-5 w-5 text-slate-400 shrink-0" />
                  <div className="flex-1">
                    <p className="text-[11px] text-slate-400 font-medium">Phone Number</p>
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">{profileData.phoneNumber}</p>
                  </div>
                </div>

                {/* Year Registered */}
                <div className="flex items-center gap-4 p-4">
                  <Calendar className="h-5 w-5 text-slate-400 shrink-0" />
                  <div className="flex-1">
                    <p className="text-[11px] text-slate-400 font-medium">Year Registered</p>
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">{profileData.yearRegistered}</p>
                  </div>
                </div>

                {/* Last Password Update */}
                <div className="flex items-center gap-4 p-4">
                  <Lock className="h-5 w-5 text-slate-400 shrink-0" />
                  <div className="flex-1">
                    <p className="text-[11px] text-slate-400 font-medium">Last Password Update</p>
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">{profileData.lastPasswordUpdate}</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Change Password Card Button */}
            <button
              type="button"
              onClick={() => setViewState("change-password")}
              className="w-full flex items-center justify-between p-5 rounded-[24px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400">
                  <Lock className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-[#0053CC] dark:group-hover:text-blue-400 transition-colors">
                    Change Password
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Update your password for better security
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

          </div>
        )}

        {/* ----------------- VIEW 2: EDIT PROFILE FORM ----------------- */}
        {viewState === "edit-profile" && (
          <div className="rounded-[28px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
            
            <button
              type="button"
              onClick={() => setViewState("main")}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#0053CC] dark:hover:text-blue-400 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Edit Profile
            </button>

            <form onSubmit={handleSaveProfile} className="space-y-6 pt-2">
              
              {/* Profile Photo Upload Section */}
              <div className="flex items-center gap-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="relative">
                  <img
                    src={editForm.avatar}
                    alt={editForm.fullName}
                    className="h-20 w-20 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Profile Photo</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Accepted file formats: JPG, PNG. Max size: 2MB.
                  </p>
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-4">
                
                {/* Full Name */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">Full Name:</Label>
                  <div className="relative">
                    <Input
                      value={editForm.fullName}
                      onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                      className="h-11 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/50 pr-9"
                    />
                    <Edit2 className="h-4 w-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                  </div>
                </div>

                {/* Email Address (Readonly) */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">Email Address:</Label>
                  <Input
                    value={editForm.email}
                    disabled
                    className="h-11 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
                  />
                </div>

                {/* Student/Employee ID No */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">Student/Employee ID No:</Label>
                  <Input
                    value={editForm.schoolId}
                    disabled
                    className="h-11 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">Phone Number:</Label>
                  <div className="relative">
                    <Input
                      value={editForm.phoneNumber}
                      onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                      className="h-11 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/50 pr-9"
                    />
                    <Edit2 className="h-4 w-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setViewState("main")}
                className="h-11 px-6 rounded-xl border border-slate-200 text- font-semibold text-[#0053CC] hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-11 px-6 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-white font-semibold text-xs shadow-sm cursor-pointer"
                >
                  Save Changes
                </Button>
              </div>

            </form>

          </div>
        )}

        {/* ----------------- VIEW 3: CHANGE PASSWORD FORM ----------------- */}
        {viewState === "change-password" && (
          <div className="rounded-[28px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
            
            <button
              type="button"
              onClick={() => setViewState("main")}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#0053CC] dark:hover:text-blue-400 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Change Password
            </button>

            <form onSubmit={handleSavePassword} className="space-y-4 pt-2">
              
              {/* Current Password */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Current Password<span className="text-red-500 ml-0.5">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showCurrentPw ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className={`h-11 rounded-xl text-xs pr-10 ${pwErrors.currentPassword ? "border-red-500 bg-red-50/20" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPw(!showCurrentPw)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {pwErrors.currentPassword && <span className="text-[10px] text-red-500 font-medium">{pwErrors.currentPassword}</span>}
              </div>

              {/* New Password */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  New Password<span className="text-red-500 ml-0.5">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showNewPw ? "text" : "password"}
                    placeholder="Enter new password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className={`h-11 rounded-xl text-xs pr-10 ${pwErrors.newPassword ? "border-red-500 bg-red-50/20" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw(!showNewPw)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {pwErrors.newPassword && <span className="text-[10px] text-red-500 font-medium">{pwErrors.newPassword}</span>}
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Confirm New Password<span className="text-red-500 ml-0.5">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showConfirmPw ? "text" : "password"}
                    placeholder="Re-type new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className={`h-11 rounded-xl text-xs pr-10 ${pwErrors.confirmPassword ? "border-red-500 bg-red-50/20" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPw(!showConfirmPw)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {pwErrors.confirmPassword && <span className="text-[10px] text-red-500 font-medium">{pwErrors.confirmPassword}</span>}
              </div>

              {/* Password Requirements Box */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1.5 text-xs">
                <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">Password Requirements:</p>
                <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <p className={`flex items-center gap-1.5 ${pwRequirements.length ? "text-emerald-600 font-semibold" : ""}`}>
                    ✓ Must be at least 8 characters long
                  </p>
                  <p className={`flex items-center gap-1.5 ${pwRequirements.uppercase ? "text-emerald-600 font-semibold" : ""}`}>
                    ✓ Include at least one uppercase letter (A-Z)
                  </p>
                  <p className={`flex items-center gap-1.5 ${pwRequirements.specialOrNumber ? "text-emerald-600 font-semibold" : ""}`}>
                    ✓ Include at least one number (0-9) or special character
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setViewState("main")}
                  className="h-11 px-6 rounded-xl border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-11 px-6 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-white font-semibold text-xs shadow-sm cursor-pointer"
                >
                  Update Password
                </Button>
              </div>

            </form>

          </div>
        )}

      </main>

      {/* ----------------- MODAL 1: PROFILE UPDATED SUCCESSFUL ----------------- */}
      {isProfileSuccessOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="w-full max-w-xs sm:max-w-sm rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-8 text-center shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500">
              <CheckCircle2 className="h-7 w-7" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Profile Updated Successfully</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              The changes have been saved to your account.
            </p>

            <Button
              type="button"
              onClick={() => {
                setIsProfileSuccessOpen(false);
                setViewState("main");
              }}
              className="mt-6 w-full h-11 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-white font-semibold text-xs shadow-sm cursor-pointer"
            >
              Done
            </Button>
          </div>
        </div>
      )}

      {/* ----------------- MODAL 2: PASSWORD CHANGED SUCCESSFUL ----------------- */}
      {isPwSuccessOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="w-full max-w-xs sm:max-w-sm rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-8 text-center shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500">
              <CheckCircle2 className="h-7 w-7" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Password Changed Successfully</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              For security purposes, please use your new password the next time you sign in.
            </p>

            <Button
              type="button"
              onClick={() => {
                setIsPwSuccessOpen(false);
                setViewState("main");
              }}
              className="mt-6 w-full h-11 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-white font-semibold text-xs shadow-sm cursor-pointer"
            >
              Done
            </Button>
          </div>
        </div>
      )}

      {/* ----------------- MODAL 3: PASSWORD CHANGE FAILED ----------------- */}
      {isPwErrorOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="w-full max-w-xs sm:max-w-sm rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-8 text-center shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/50 text-red-500">
              <AlertTriangle className="h-7 w-7" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Password Change Failed</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              The current password you entered is incorrect. Please check your password and try again.
            </p>

            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPwErrorOpen(false)}
              className="mt-6 w-full h-11 rounded-xl border-red-300 text-red-600 hover:bg-red-50 font-semibold text-xs shadow-sm cursor-pointer"
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}