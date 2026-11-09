import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Edit2, AlertCircle, Shield, ShieldCheck } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
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

// Role display helpers
const getRoleDisplay = (role: string) => {
  if (role === "SUPER_ADMIN") {
    return {
      title: "Super Administrator",
      privileges: "Full System Access & Governance",
      badgeClass: "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800",
      icon: ShieldCheck,
      headerRoleText: "Super Admin",
      headerBadgeClass: "text-purple-600 dark:text-purple-400",
      headerDotClass: "bg-purple-500",
    };
  }
  return {
    title: "System Administrator",
    privileges: "Operations & Parking Management",
    badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
    icon: Shield,
    headerRoleText: "Admin",
    headerBadgeClass: "text-blue-600 dark:text-blue-400",
    headerDotClass: "bg-blue-500",
  };
};

// Philippine mobile number validation helper
const isValidPhilippineNumber = (phoneStr: string): boolean => {
  if (!phoneStr.trim()) return true; // Optional field
  const clean = phoneStr.replace(/[\s-]/g, "");
  return /^(09|\+639)\d{9}$/.test(clean);
};

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150";

export default function AdminProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    employeeId: "",
    role: "",
    phone: "",
    avatar: DEFAULT_AVATAR,
    accountStatus: "Active",
    createdAt: "",
  });
  const [currentInitialData, setCurrentInitialData] = useState(formData);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        let userData: User | null = storedUser ? JSON.parse(storedUser) : null;

        try {
          const response = await getCurrentUser();
          userData = response.user;
          localStorage.setItem("user", JSON.stringify(userData));
        } catch (apiErr) {
          console.warn("Could not fetch fresh user from /me, using stored user:", apiErr);
        }

        if (userData) {
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error("Failed to parse user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Update form data when currentUser changes
  useEffect(() => {
    if (currentUser) {
      const newFormData = {
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || "",
        employeeId: currentUser.schoolId || "",
        role: currentUser.role || "ADMIN",
        phone: currentUser.phone || "",
        avatar: currentUser.avatar || DEFAULT_AVATAR,
        accountStatus: currentUser.accountStatus || "Active",
        createdAt: formatCreatedAt(currentUser.createdAt),
      };
      setFormData(newFormData);
      setCurrentInitialData(newFormData);
    }
  }, [currentUser]);

  // Lock scroll background when modal is open
  useEffect(() => {
    if (showConfirmModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showConfirmModal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Phone input handler with filtering and validation
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    val = val.replace(/[^0-9+ ]/g, "");
    if (val.indexOf("+") > 0) {
      val = val[0] + val.slice(1).replace(/\+/g, "");
    }
    setFormData((prev) => ({ ...prev, phone: val }));
    if (phoneError) {
      setPhoneError(null);
    }
  };

  // Validate phone number before submitting changes
  const validatePhoneBeforeSubmit = (): boolean => {
    if (!formData.phone || formData.phone.trim() === "") {
      setPhoneError(null);
      return true;
    }
    const isValid = isValidPhilippineNumber(formData.phone);
    if (!isValid) {
      setPhoneError("Invalid Philippine mobile number. Please use 09XXXXXXXXX (11 digits) or +639XXXXXXXXX.");
      return false;
    }
    setPhoneError(null);
    return true;
  };

  // Image Upload with Client-Side Resize and Compression
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.85);
          setFormData((prev) => ({ ...prev, avatar: compressedBase64 }));
          setErrorMessage(null);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Check whether form has unsaved modifications
  const isFormChanged =
    formData.firstName.trim() !== currentInitialData.firstName.trim() ||
    formData.lastName.trim() !== currentInitialData.lastName.trim() ||
    formData.phone.trim() !== currentInitialData.phone.trim() ||
    formData.avatar !== currentInitialData.avatar;

  // Open confirmation modal
  const handleOpenModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhoneBeforeSubmit()) {
      return;
    }
    if (isFormChanged) {
      setErrorMessage(null);
      setSuccessMessage(null);
      setShowConfirmModal(true);
    }
  };

  // Save changes via real API
  const handleConfirmSave = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await updateUserProfile({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        avatar: formData.avatar,
      });

      const updatedUser = { ...currentUser, ...response.user };
      setCurrentUser(updatedUser as User);

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Update baseline initial data
      setCurrentInitialData(formData);

      // Dispatch custom event to notify AdminHeader immediately
      window.dispatchEvent(new Event("userProfileUpdated"));

      setShowConfirmModal(false);
      setSuccessMessage("Profile updated successfully!");

      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (error: any) {
      console.error("Failed to save profile changes:", error);
      const msg = error?.response?.data?.message || "Failed to update profile. Please try again.";
      setErrorMessage(msg);
      setShowConfirmModal(false);
    } finally {
      setIsSaving(false);
    }
  };

  const roleDisplay = getRoleDisplay(formData.role);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-500 dark:text-slate-400">Loading profile...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">
          Admin Profile
        </h1>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs space-y-6 transition-colors">
          {/* Success Banner */}
          {successMessage && (
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 p-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  {successMessage}
                </p>
                <button
                  onClick={() => setSuccessMessage(null)}
                  className="text-emerald-500 hover:text-emerald-700 dark:text-emerald-400 cursor-pointer"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {errorMessage && (
            <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-4 animate-in fade-in">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">{errorMessage}</p>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="ml-auto text-red-500 hover:text-red-700 dark:text-red-400 cursor-pointer"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Dynamic Profile Card */}
          <div className="rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 p-4 sm:p-6 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Hidden File Input for Picture Upload */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden"
                onChange={handleImageUpload}
              />

              <div className="relative group">
                <img
                  src={formData.avatar}
                  alt={`${formData.firstName} ${formData.lastName}`}
                  onClick={() => fileInputRef.current?.click()}
                  title="Click to change profile picture"
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-xs cursor-pointer hover:opacity-90 transition-opacity"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload new profile picture"
                  className="absolute bottom-0 right-0 rounded-full bg-white dark:bg-slate-800 p-1.5 text-blue-600 dark:text-blue-400 shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border border-slate-100 dark:border-slate-700 cursor-pointer"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>

              <div>
                <h2 className="font-poppins text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {formData.firstName || "Admin"} {formData.lastName}
                </h2>

                {/* Dynamic Role Badge */}
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${roleDisplay.badgeClass}`}>
                    <roleDisplay.icon className="h-3.5 w-3.5" />
                    {roleDisplay.title}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {formData.accountStatus === "Active" ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                        {formData.accountStatus}
                      </span>
                    )}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  {roleDisplay.privileges}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1.5 text-xs border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-200 dark:border-slate-800">
              <div className="flex sm:justify-end items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  Account Status:
                </span>
                <span className="rounded-md bg-emerald-100/70 dark:bg-emerald-950/50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                  {formData.accountStatus}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400">
                Date Created:{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {formData.createdAt || "N/A"}
                </span>
              </p>
            </div>
          </div>

          {/* Form Inputs */}
          <form onSubmit={handleOpenModal} className="space-y-6">
            <div className="space-y-4 pt-2">
              <h3 className="font-poppins text-base font-bold text-[#0053CC] dark:text-blue-400">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    First Name:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-medium text-slate-800 dark:text-white focus:border-[#0053CC] focus:outline-none pr-9"
                    />
                    <Edit2 className="absolute right-3 top-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Last Name:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-medium text-slate-800 dark:text-white focus:border-[#0053CC] focus:outline-none pr-9"
                    />
                    <Edit2 className="absolute right-3 top-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Email Address:
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-3.5 py-2.5 text-xs font-medium text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Employee ID:
                  </label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    disabled
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-3.5 py-2.5 text-xs font-medium text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Role:
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={roleDisplay.title}
                    disabled
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-3.5 py-2.5 text-xs font-medium text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Phone Number:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      maxLength={16}
                      placeholder="e.g. 09123456789 or +63 912 345 6789"
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium focus:outline-none pr-9 ${
                        phoneError
                          ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-200"
                          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:border-[#0053CC]"
                      }`}
                    />
                    <Edit2 className="absolute right-3 top-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  </div>
                  {phoneError && (
                    <p className="text-[11px] text-red-500 dark:text-red-400 mt-1">
                      {phoneError}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => navigate("/admin/change-password")}
                className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Update Password
              </button>

              {isFormChanged && (
                <button
                  type="submit"
                  className="rounded-xl bg-[#0053CC] px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all cursor-pointer animate-in fade-in zoom-in-95"
                >
                  Save Changes
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Safety Net Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative overflow-hidden bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-200 text-center">
            
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400">
              <AlertCircle className="h-6 w-6" />
            </div>

            <div>
              <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">
                Save Changes?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Are you sure you want to update your profile details and picture?
              </p>
            </div>

            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={isSaving}
                className="w-1/2 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                disabled={isSaving}
                className="w-1/2 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0053CC] hover:bg-blue-700 active:scale-[0.98] transition-all shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : "Yes, Save"}
              </button>
            </div>

          </div>
        </div>
      )}
    </AdminLayout>
  );
}
