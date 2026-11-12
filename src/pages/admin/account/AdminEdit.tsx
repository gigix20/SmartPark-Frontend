import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronDown, Check, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { getAccountById, updateAccount } from "./api/accountApi";

export default function AdminEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Route guard: only Super Admin can access this page
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    if (currentUser?.role?.toUpperCase() !== "SUPER_ADMIN") {
      navigate("/admin/accounts", { replace: true });
    }
  }, [navigate]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState("Active");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState("");

  // Dropdown states para sa Role at Status
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  // Success Modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    async function fetchAccount() {
      if (!id) return;
      try {
        setIsLoading(true);
        const res = await getAccountById(id);
        if (res.success && res.account) {
          const acc = res.account;
          setFirstName(acc.firstName || "");
          setLastName(acc.lastName || "");
          setEmail(acc.email || "");
          setEmployeeId(acc.schoolId || "");
          setRole(acc.role || "ADMIN");
          setPhoneNumber(acc.phone || "");
          setStatus(acc.accountStatus || "Active");
        }
      } catch (err) {
        console.error("Failed to load account for editing:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAccount();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      setIsSaving(true);
      setApiError("");
      const payload = {
        firstName,
        lastName,
        email,
        schoolId: employeeId,
        phone: phoneNumber,
        role,
        accountStatus: status,
      };
      const res = await updateAccount(id, payload);
      if (res.success) {
        setShowSuccessModal(true);
      }
    } catch (err: any) {
      setApiError(err.response?.data?.message || "Failed to update account");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
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

  return (
    <AdminLayout>
      <div className="w-full max-w-5xl mx-auto space-y-6 relative">
        
        {/* Main Form Container */}
        <form
          onSubmit={handleSaveChanges}
          className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 sm:p-10 shadow-xs space-y-8 relative transition-colors"
        >
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
              Admin Profile
            </h1>
          </div>

          {/* Profile Basic Info Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                alt="John Doe"
                className="h-16 w-16 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">
                    {firstName} {lastName}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                    {status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Employee ID: {employeeId}</p>
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="font-poppins text-sm font-bold text-[#0053CC] dark:text-blue-400">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-12 text-xs">
              {/* First Name */}
              <div className="space-y-1.5">
                <label className="font-medium text-slate-400">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 focus:outline-none focus:border-[#0053CC] font-semibold text-xs"
                />
              </div>

              {/* Last Name */}
              <div className="space-y-1.5">
                <label className="font-medium text-slate-400">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 focus:outline-none focus:border-[#0053CC] font-semibold text-xs"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="font-medium text-slate-400">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 focus:outline-none focus:border-[#0053CC] font-semibold text-xs"
                />
              </div>

              {/* Employee ID */}
              <div className="space-y-1.5">
                <label className="font-medium text-slate-400">Employee ID</label>
                <input
                  type="text"
                  required
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 focus:outline-none focus:border-[#0053CC] font-semibold text-xs"
                />
              </div>

              {/* Role Dropdown */}
              <div className="space-y-1.5 relative" ref={roleDropdownRef}>
                <label className="font-medium text-slate-400">Role</label>
                <button
                  type="button"
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  className="w-full flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 font-bold text-slate-900 dark:text-white text-xs cursor-pointer"
                >
                  <span>{role}</span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isRoleDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isRoleDropdownOpen && (
                  <div className="absolute left-0 mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl py-1 z-30">
                    {["Super Administrator", "Administrator"].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          setRole(r);
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs transition-colors cursor-pointer ${
                          role === r ? "font-bold text-[#0053CC] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="font-medium text-slate-400">Phone Number</label>
                <input
                  type="text"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 focus:outline-none focus:border-[#0053CC] font-semibold text-xs"
                />
              </div>
            </div>
          </div>

          {/* Account Details Section */}
          <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-poppins text-sm font-bold text-[#0053CC] dark:text-blue-400">
              Account Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-12 text-xs">
              {/* Account Status Dropdown */}
              <div className="space-y-1.5 relative" ref={statusDropdownRef}>
                <label className="font-medium text-slate-400">Account Status</label>
                <button
                  type="button"
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  className="w-full flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 font-bold text-slate-900 dark:text-white text-xs cursor-pointer"
                >
                  <span>{status.toUpperCase()}</span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isStatusDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isStatusDropdownOpen && (
                  <div className="absolute left-0 mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl py-1 z-30">
                    {["Active", "Suspended", "Inactive"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setStatus(opt);
                          setIsStatusDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs transition-colors cursor-pointer ${
                          status === opt ? "font-bold text-[#0053CC] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <p className="text-slate-400 font-medium">Date Created</p>
                <p className="font-bold text-slate-900 dark:text-white mt-2 text-sm">December 2025</p>
              </div>

              <div>
                <p className="text-slate-400 font-medium">Last Updated</p>
                <p className="font-bold text-slate-900 dark:text-white mt-2 text-sm">Sep 28, 2026, 9:30 AM</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Last Login</p>
                <p className="font-bold text-slate-900 dark:text-white mt-2 text-sm">Sep 29, 2026, 9:00 PM</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            {apiError && (
              <p className="text-rose-500 text-xs font-semibold mr-auto">{apiError}</p>
            )}
            <button
              type="button"
              onClick={handleBack}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-[#0053CC] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

        {/* --- SUCCESS MODAL --- */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-[32px] bg-white dark:bg-slate-900 p-7 text-center shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5">
              
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/40">
                <Check className="h-7 w-7 stroke-[2.5]" />
              </div>

              <div>
                <h3 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">Admin Profile Updated</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  Changes to the admin account have been saved successfully.
                </p>
              </div>
              
              <div className="pt-2">
                <button 
                  type="button"
                  onClick={handleBack}
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