import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  UserX,
  UserMinus,
  ShieldAlert,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  X,
  Loader2,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { CustomSelect } from "@/components/ui/CustomSelect";
import {
  getAccountById,
  suspendAccount,
  deactivateAccount,
  reactivateAccount,
  setAccountInactive,
} from "./api/accountApi";

export default function UserDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const returnTab = (location.state as any)?.activeTab || "Users";
  const handleBack = () => {
    navigate("/admin/accounts", { state: { activeTab: returnTab } });
  };

  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  // Dropdown menu state
  const [isActionsDropdownOpen, setIsActionsDropdownOpen] = useState(false);
  const actionsDropdownRef = useRef<HTMLDivElement>(null);

  // Modals state
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Suspend form state
  const [suspensionDuration, setSuspensionDuration] = useState("7");
  const [customDate, setCustomDate] = useState("");
  const [suspensionReason, setSuspensionReason] = useState("");
  const [deactivateReason, setDeactivateReason] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    async function fetchDetails() {
      if (!id) return;
      try {
        setIsLoading(true);
        const res = await getAccountById(id);
        if (res.success) {
          setUserData(res.account);
        }
      } catch (err) {
        console.error("Failed to fetch user details:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

  // Click outside listener para sa Actions dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        actionsDropdownRef.current &&
        !actionsDropdownRef.current.contains(event.target as Node)
      ) {
        setIsActionsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Overflow management kapag bukas ang modal
  useEffect(() => {
    if (
      showSuspendModal ||
      showDeactivateModal ||
      showInactiveModal ||
      showSuccessModal
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [
    showSuspendModal,
    showDeactivateModal,
    showInactiveModal,
    showSuccessModal,
  ]);

  const handleSuspendSubmit = async () => {
    if (!suspensionReason.trim()) {
      setFormError("Please provide a reason for the suspension.");
      return;
    }
    if (suspensionDuration === "custom" && !customDate) {
      setFormError("Please select a valid expiration date.");
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError("");
      const payload: any = {
        reason: suspensionReason.trim(),
      };
      if (suspensionDuration === "custom") {
        payload.suspendedUntil = customDate;
        payload.duration = "Custom Date";
      } else {
        payload.durationDays = parseInt(suspensionDuration, 10);
        payload.duration = `${suspensionDuration} Days`;
      }

      const res = await suspendAccount(id!, payload);
      if (res?.success) {
        setUserData(res.account);
        setShowSuspendModal(false);
        setSuspensionReason("");
        setSuspensionDuration("7");
        setCustomDate("");
        setSuccessMessage("Account has been suspended successfully. An email notification has been sent to the user.");
        setShowSuccessModal(true);
      }
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Failed to suspend account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDeactivate = async () => {
    try {
      setIsSubmitting(true);
      const res = await deactivateAccount(id!, deactivateReason.trim() ? { reason: deactivateReason.trim() } : undefined);
      if (res?.success) {
        setUserData(res.account);
        setShowDeactivateModal(false);
        setDeactivateReason("");
        setSuccessMessage("Account has been permanently deactivated. An email notice has been sent to the user.");
        setShowSuccessModal(true);
      }
    } catch (err) {
      console.error("Failed to deactivate account:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmInactive = async () => {
    try {
      setIsSubmitting(true);
      const res = await setAccountInactive(id!);
      if (res?.success) {
        setUserData(res.account);
        setShowInactiveModal(false);
        setSuccessMessage("Account has been set to Inactive.");
        setShowSuccessModal(true);
      }
    } catch (err) {
      console.error("Failed to set account inactive:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReactivate = async () => {
    try {
      setIsSubmitting(true);
      const res = await reactivateAccount(id!);
      if (res?.success) {
        setUserData(res.account);
        setSuccessMessage("Account has been reactivated successfully.");
        setShowSuccessModal(true);
      }
    } catch (err) {
      console.error("Failed to reactivate account:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-[#0053CC]" />
        </div>
      </AdminLayout>
    );
  }

  if (!userData) {
    return (
      <AdminLayout>
        <div className="text-center py-32 text-slate-500">
          User account not found.
        </div>
      </AdminLayout>
    );
  }

  const rawStatus = userData.accountStatus || userData.status || "Active";
  const status =
    rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();
  const isSuspended = status === "Suspended";
  const isDeactivated = status === "Deactivated";
  const isInactive = status === "Inactive";
  const isActive = status === "Active";

  const studentId = userData.schoolId || userData.studentId || "N/A";
  const phone = userData.phone || userData.phoneNumber || "N/A";
  const dateCreated = userData.createdAt
    ? new Date(userData.createdAt).toLocaleDateString()
    : userData.dateCreated || "N/A";
  const lastUpdated = userData.updatedAt
    ? new Date(userData.updatedAt).toLocaleString()
    : userData.lastUpdated || "N/A";
  const lastLogin = userData.lastLogin
    ? new Date(userData.lastLogin).toLocaleString()
    : userData.updatedAt
      ? new Date(userData.updatedAt).toLocaleString()
      : "N/A";

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl mx-auto relative">
        {/* --- SUSPENSION ALERT BANNER --- */}
        {isSuspended && (
          <div className="bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 p-4 sm:p-5 rounded-2xl flex items-start gap-3.5 text-xs shadow-xs animate-in fade-in">
            <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-sm text-amber-900 dark:text-amber-200">
                Account Currently Suspended
              </p>
              <p className="text-amber-700 dark:text-amber-300/90 leading-relaxed">
                <span className="font-semibold">Suspended Until:</span>{" "}
                {userData.suspendedUntil
                  ? new Date(userData.suspendedUntil).toLocaleDateString(
                      "en-US",
                      { month: "long", day: "numeric", year: "numeric" },
                    )
                  : "N/A"}
                <span className="mx-2 text-amber-400">|</span>
                <span className="font-semibold">Reason:</span>{" "}
                {userData.suspensionReason || "No specific reason provided."}
              </p>
            </div>
          </div>
        )}

        {/* --- MAIN CARD --- */}
        <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-8 transition-colors">
          {/* Header Bar & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div>
                <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">
                  User Profile
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Detailed view of student credentials and account standing.
                </p>
              </div>
            </div>

            {/* Actions Dropdown Button */}
            {!isDeactivated ? (
              <div className="relative" ref={actionsDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsActionsDropdownOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span>Account Actions</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${isActionsDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isActionsDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                      Manage User Status
                    </div>

                    <div className="p-1 space-y-0.5">
                      {isActive && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setIsActionsDropdownOpen(false);
                              setFormError("");
                              setShowSuspendModal(true);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors cursor-pointer text-left"
                          >
                            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600" />
                            <div>
                              <p className="font-bold">Suspend Account</p>
                              <p className="text-[10px] text-slate-400 font-normal">
                                Temporary parking lockout
                              </p>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setIsActionsDropdownOpen(false);
                              setShowInactiveModal(true);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
                          >
                            <UserMinus className="h-4 w-4 shrink-0 text-slate-500" />
                            <div>
                              <p className="font-bold">Mark as Inactive</p>
                              <p className="text-[10px] text-slate-400 font-normal">
                                Soft-freeze privileges
                              </p>
                            </div>
                          </button>
                        </>
                      )}

                      {(isSuspended || isInactive) && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsActionsDropdownOpen(false);
                            handleReactivate();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer text-left"
                        >
                          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                          <div>
                            <p className="font-bold">
                              {isSuspended
                                ? "Lift Suspension"
                                : "Activate Account"}
                            </p>
                            <p className="text-[10px] text-slate-400 font-normal">
                              Restore full system access
                            </p>
                          </div>
                        </button>
                      )}

                      <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                      <button
                        type="button"
                        onClick={() => {
                          setIsActionsDropdownOpen(false);
                          setShowDeactivateModal(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer text-left"
                      >
                        <UserX className="h-4 w-4 shrink-0 text-rose-600" />
                        <div>
                          <p className="font-bold">Deactivate Account</p>
                          <p className="text-[10px] text-rose-400/80 font-normal">
                            Permanent account closure
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-200 dark:border-rose-800">
                <UserX className="h-3.5 w-3.5" />
                <span>Account Permanently Deactivated</span>
              </span>
            )}
          </div>

          {/* Profile Basic Info Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-4">
              {userData.avatar &&
              !avatarError &&
              !userData.avatar.includes("unsplash.com") ? (
                <img
                  src={userData.avatar}
                  alt={userData.firstName}
                  onError={() => setAvatarError(true)}
                  className="h-16 w-16 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shadow-xs"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-[#0053CC] dark:bg-blue-600 text-white flex items-center justify-center font-extrabold text-xl shadow-md border-2 border-white dark:border-slate-800 uppercase select-none shrink-0">
                  {(userData.firstName?.[0] || "") +
                    (userData.lastName?.[0] || "") || "U"}
                </div>
              )}
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">
                    {userData.firstName} {userData.lastName}
                  </h2>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold border transition-colors ${
                      status === "Active"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-400"
                        : status === "Suspended"
                          ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-400"
                          : status === "Inactive"
                            ? "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                            : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:border-rose-800 dark:text-rose-400"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        status === "Active"
                          ? "bg-emerald-500"
                          : status === "Suspended"
                            ? "bg-amber-500"
                            : status === "Inactive"
                              ? "bg-slate-400"
                              : "bg-rose-500"
                      }`}
                    />
                    <span>{status}</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Student ID: {studentId}
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="font-poppins text-sm font-bold text-[#0053CC] dark:text-blue-400">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-12 text-xs">
              <div>
                <p className="text-slate-400 font-medium">First Name</p>
                <p className="font-bold text-slate-900 dark:text-white mt-1 text-sm">
                  {userData.firstName}
                </p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Last Name</p>
                <p className="font-bold text-slate-900 dark:text-white mt-1 text-sm">
                  {userData.lastName}
                </p>
              </div>

              <div>
                <p className="text-slate-400 font-medium">Email Address</p>
                <p className="font-bold text-slate-900 dark:text-white mt-1 text-sm">
                  {userData.email}
                </p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Phone Number</p>
                <p className="font-bold text-slate-900 dark:text-white mt-1 text-sm">
                  {phone}
                </p>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800" />

          {/* Account Details Section */}
          <div className="space-y-4">
            <h3 className="font-poppins text-sm font-bold text-[#0053CC] dark:text-blue-400">
              Account Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-12 text-xs">
              <div>
                <p className="text-slate-400 font-medium">Role</p>
                <p className="font-bold text-slate-900 dark:text-white mt-1 text-sm">
                  {userData.role || "User"}
                </p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Student ID</p>
                <p className="font-bold text-slate-900 dark:text-white mt-1 text-sm">
                  {studentId}
                </p>
              </div>

              <div>
                <p className="text-slate-400 font-medium">Date Created</p>
                <p className="font-bold text-slate-900 dark:text-white mt-1 text-sm">
                  {dateCreated}
                </p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Last Updated</p>
                <p className="font-bold text-slate-900 dark:text-white mt-1 text-sm">
                  {lastUpdated}
                </p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Last Login</p>
                <p className="font-bold text-slate-900 dark:text-white mt-1 text-sm">
                  {lastLogin}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- SUSPEND MODAL --- */}
        {showSuspendModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-md rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 relative">
              <button
                type="button"
                onClick={() => setShowSuspendModal(false)}
                className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">
                    Suspend User Account
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Temporarily block parking and account access.
                  </p>
                </div>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-medium">
                  {formError}
                </div>
              )}

              {/* Duration selector via dropdown */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Suspension Duration
                </label>
                <CustomSelect
                  value={suspensionDuration}
                  onChange={(val) => setSuspensionDuration(val)}
                  options={[
                    { value: "3", label: "3 Days (Short Suspension)", badge: "3d" },
                    { value: "7", label: "7 Days (1 Week)", badge: "1w" },
                    { value: "14", label: "14 Days (2 Weeks)", badge: "2w" },
                    { value: "30", label: "30 Days (1 Month)", badge: "1m" },
                    { value: "custom", label: "Custom Expiration Date...", isSpecial: true },
                  ]}
                  placeholder="Select duration"
                  searchable={false}
                />

                {suspensionDuration === "custom" && (
                  <div className="pt-1.5 space-y-1 animate-in fade-in duration-150">
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      Select Suspension End Date:
                    </label>
                    <input
                      type="date"
                      min={todayStr}
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0053CC]"
                    />
                  </div>
                )}
              </div>

              {/* Reason input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Reason for Suspension <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={suspensionReason}
                  onChange={(e) => setSuspensionReason(e.target.value)}
                  placeholder="e.g., Unsettled parking violation, expired permit documents..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0053CC] resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSuspendModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 h-11 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSuspendSubmit}
                  disabled={isSubmitting}
                  className="flex-1 h-11 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>Confirm Suspension</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- MARK INACTIVE CONFIRMATION MODAL --- */}
        {showInactiveModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-8 text-center shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 relative">
              <button
                type="button"
                onClick={() => setShowInactiveModal(false)}
                className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <UserMinus className="h-7 w-7" />
              </div>

              <div>
                <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">
                  Mark Account Inactive?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Are you sure you want to mark {userData.firstName}{" "}
                  {userData.lastName}'s account as Inactive? This will
                  soft-freeze parking access until reactivated.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleConfirmInactive}
                  disabled={isSubmitting}
                  className="w-full h-11 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>Mark Inactive</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowInactiveModal(false)}
                  disabled={isSubmitting}
                  className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- DEACTIVATE CONFIRMATION MODAL --- */}
        {showDeactivateModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-8 text-center shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 relative">
              <button
                type="button"
                onClick={() => setShowDeactivateModal(false)}
                className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
                <AlertCircle className="h-7 w-7" />
              </div>

              <div>
                <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">
                  Deactivate User Account?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Are you sure you want to permanently deactivate{" "}
                  {userData.firstName} {userData.lastName}'s account? This
                  action cannot be undone. An email notice will be sent to the user.
                </p>
              </div>

              {/* Reason input for deactivation */}
              <div className="space-y-1.5 text-left">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Reason for Deactivation (Optional)
                </label>
                <textarea
                  rows={2}
                  value={deactivateReason}
                  onChange={(e) => setDeactivateReason(e.target.value)}
                  placeholder="e.g. Account permanently deactivated due to policy violation or student graduation"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                />
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleConfirmDeactivate}
                  disabled={isSubmitting}
                  className="w-full h-11 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>Deactivate Permanently</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeactivateModal(false)}
                  disabled={isSubmitting}
                  className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- SUCCESS MODAL --- */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-8 text-center shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 relative">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-7 w-7" />
              </div>

              <div>
                <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">
                  Action Completed
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {successMessage}
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-[#0053CC] dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
