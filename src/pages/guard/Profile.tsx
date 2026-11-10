import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Edit3, CheckCircle2, AlertCircle } from "lucide-react";
import { GuardHeader } from "@/components/GuardHeader";
import { GuardNav } from "@/components/GuardNav";
import { getCurrentUser, updateUserProfile, type User } from "@/pages/auth/api/authApi";

// Helper to format createdAt date
const formatCreatedAt = (date: string | Date | undefined): string => {
  if (!date) return "N/A";
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return "N/A";
  }
};

// Philippine mobile number validation
const isValidPhilippineNumber = (phoneStr: string): boolean => {
  if (!phoneStr.trim()) return true;
  const clean = phoneStr.replace(/[\s-]/g, "");
  return /^(09|\+639)\d{9}$/.test(clean);
};

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150";

export default function GuardProfile() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState<string>(DEFAULT_AVATAR);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Lock background scroll when modal is open
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

  // Fetch fresh user from API on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const stored = localStorage.getItem("user");
        let userData: User | null = stored ? JSON.parse(stored) : null;
        try {
          const response = await getCurrentUser();
          userData = response.user;
          localStorage.setItem("user", JSON.stringify(userData));
        } catch (apiErr) {
          console.warn("Could not fetch fresh user from /me, using stored user:", apiErr);
        }
        if (userData) setCurrentUser(userData);
      } catch (err) {
        console.error("Failed to load user data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Sync form fields when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.firstName || "");
      setLastName(currentUser.lastName || "");
      setPhone(currentUser.phone || "");
      setProfileImage(currentUser.avatar || DEFAULT_AVATAR);
    }
  }, [currentUser]);

  // Phone input: only digits, spaces, and a leading +
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9+ ]/g, "");
    if (val.indexOf("+") > 0) {
      val = val[0] + val.slice(1).replace(/\+/g, "");
    }
    setPhone(val);
    if (phoneError) setPhoneError(null);
  };

  // Canvas-based image compression (max 500×500, 0.85 JPEG quality)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image file size must be less than 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_SIZE = 500;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_SIZE) { height = Math.round((height * MAX_SIZE) / width); width = MAX_SIZE; }
        } else {
          if (height > MAX_SIZE) { width = Math.round((width * MAX_SIZE) / height); height = MAX_SIZE; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          setProfileImage(canvas.toDataURL("image/jpeg", 0.85));
          setErrorMessage(null);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCameraClick = () => { fileInputRef.current?.click(); };

  // Save profile to real API
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setPhoneError(null);
    if (phone.trim() && !isValidPhilippineNumber(phone)) {
      setPhoneError("Invalid Philippine mobile number. Use 09XXXXXXXXX or +639XXXXXXXXX.");
      return;
    }
    setIsSaving(true);
    try {
      const response = await updateUserProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        avatar: profileImage === DEFAULT_AVATAR ? null : profileImage,
      });
      if (response.token) {
        localStorage.setItem("token", response.token);
      }
      const updatedUser = { ...currentUser, ...response.user } as User;
      setCurrentUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("userProfileUpdated"));
      window.dispatchEvent(new Event("storage"));
      setShowSuccessModal(true);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex flex-col transition-colors font-sans">
        <GuardHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 rounded-full border-2 border-[#0053CC] border-t-transparent animate-spin" />
            <p className="text-xs text-slate-500 font-semibold">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex flex-col transition-colors font-sans">
      <GuardHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex-1 flex relative">
        <GuardNav isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto lg:pl-72 transition-all">
          <div className="space-y-6 max-w-5xl mx-auto pb-16">
            
            {/* Main Profile Card Container */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6">
              
              {/* Profile Top Banner Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={profileImage}
                      alt={`${currentUser?.firstName || "Guard"} ${currentUser?.lastName || ""}`}
                      className="h-20 w-20 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 shadow-xs"
                      onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_AVATAR; }}
                    />
                    
                    {/* Hidden File Input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      className="hidden"
                    />

                    <button 
                      type="button" 
                      onClick={handleCameraClick}
                      className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-[#0053CC] text-white shadow-sm hover:bg-[#0042A5] cursor-pointer"
                      title="Change Profile Picture"
                    >
                      <Camera className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div>
                    <h1 className="font-poppins text-xl font-bold text-slate-900 dark:text-white">
                      {currentUser?.firstName || "Guard"} {currentUser?.lastName || ""}
                    </h1>
                    <div className="flex items-center gap-2.5 mt-0.5">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Guard</p>
                      {profileImage && profileImage !== DEFAULT_AVATAR && (
                        <button
                          type="button"
                          onClick={() => setProfileImage(DEFAULT_AVATAR)}
                          className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 underline cursor-pointer"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-xs space-y-1.5 sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200 dark:border-slate-700">
                  <div className="flex sm:justify-end gap-2">
                    <span className="text-slate-400">Account Status:</span>
                    <span className={`font-bold ${currentUser?.accountStatus === "Active" ? "text-emerald-600" : "text-amber-600"}`}>
                      {currentUser?.accountStatus?.toUpperCase() || "ACTIVE"}
                    </span>
                  </div>
                  <div className="flex sm:justify-end gap-2">
                    <span className="text-slate-400">Date Created:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{formatCreatedAt(currentUser?.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="flex items-center gap-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 px-4 py-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Personal Information Form */}
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <h2 className="font-poppins text-base font-bold text-[#0053CC] dark:text-blue-400">Personal Information</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">First Name</label>
                    <div className="relative">
                      <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#0053CC]" />
                      <Edit3 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Last Name</label>
                    <div className="relative">
                      <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#0053CC]" />
                      <Edit3 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                    <input type="email" disabled value={currentUser?.email || ""} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 px-3.5 py-2.5 text-slate-500 cursor-not-allowed" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Employee ID</label>
                    <input type="text" disabled value={currentUser?.schoolId || ""} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 px-3.5 py-2.5 text-slate-500 cursor-not-allowed" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Role</label>
                    <input type="text" disabled defaultValue="Guard" className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 px-3.5 py-2.5 text-slate-500 cursor-not-allowed" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Phone Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={phone}
                        onChange={handlePhoneChange}
                        maxLength={16}
                        placeholder="09XXXXXXXXX or +639XXXXXXXXX"
                        className={`w-full rounded-xl border bg-white dark:bg-slate-800 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none transition-colors ${phoneError ? "border-rose-500 focus:border-rose-500" : "border-slate-200 dark:border-slate-700 focus:border-[#0053CC]"}`}
                      />
                      <Edit3 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                    {phoneError && (
                      <div className="flex items-center gap-1.5 text-rose-500 text-[11px] font-semibold pt-0.5">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{phoneError}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => navigate("/guard/change-password")}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Update Password
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] disabled:opacity-60 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>

            </div>

          </div>
        </main>
      </div>

      {/* ================= SUCCESS POP-UP MODAL (LOCKED BACKGROUND SCROLL) ================= */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-110 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-[32px] bg-white dark:bg-slate-900 p-7 text-center shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 animate-in zoom-in-95 relative transition-colors">
            
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/40">
              <CheckCircle2 className="h-7 w-7" />
            </div>

            <div>
              <h3 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">Profile Updated Successfully</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed px-2">
                The changes have been saved to your account.
              </p>
            </div>
            
            <div className="pt-2">
              <button 
                type="button"
                onClick={() => setShowSuccessModal(false)}
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