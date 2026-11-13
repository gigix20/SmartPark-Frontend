import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronDown, Check, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { getAccountById, updateAccount } from "./api/accountApi";

export default function UserEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    studentId: "",
    phoneNumber: "",
    accountStatus: "Active",
    dateCreated: "",
    lastUpdated: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [apiError, setApiError] = useState("");

  // Dropdown state para sa Account Status
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchUser() {
      if (!id) return;
      try {
        setIsLoading(true);
        const res = await getAccountById(id);
        if (res.success && res.account) {
          const acc = res.account;
          const rawStatus = acc.accountStatus || "Active";
          const formattedStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();

          setFormData({
            firstName: acc.firstName || "",
            lastName: acc.lastName || "",
            email: acc.email || "",
            studentId: acc.schoolId || "",
            phoneNumber: acc.phone || "",
            accountStatus: formattedStatus,
            dateCreated: acc.createdAt ? new Date(acc.createdAt).toLocaleDateString() : "",
            lastUpdated: acc.updatedAt ? new Date(acc.updatedAt).toLocaleString() : "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch user for edit:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      setIsSaving(true);
      setApiError("");
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        schoolId: formData.studentId,
        phone: formData.phoneNumber,
        accountStatus: formData.accountStatus.toUpperCase(),
        role: "USER",
      };
      const res = await updateAccount(id, payload);
      if (res.success) {
        setShowSuccessModal(true);
      }
    } catch (err: any) {
      console.error("Failed to update user account:", err);
      setApiError(err.response?.data?.message || "Failed to update user account");
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
        
        {/* Main Form Card Container */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 sm:p-10 shadow-xs space-y-8 relative transition-colors"
        >
          {/* Header Section */}
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-6">
            <button
              type="button"
              onClick={handleBack}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">
              User Profile
            </h1>
          </div>

          {/* Profile Basic Info Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={(formData as any).avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent((formData.firstName || '') + ' ' + (formData.lastName || ''))}&background=0053CC&color=fff`}
                alt={`${formData.firstName} ${formData.lastName}`}
                className="h-16 w-16 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">
                    {formData.firstName} {formData.lastName}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                    {formData.accountStatus || "Active"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Student ID: {formData.studentId}</p>
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
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 focus:outline-none focus:border-[#0053CC] font-semibold text-xs"
                />
              </div>

              {/* Last Name */}
              <div className="space-y-1.5">
                <label className="font-medium text-slate-400">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 focus:outline-none focus:border-[#0053CC] font-semibold text-xs"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="font-medium text-slate-400">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 focus:outline-none focus:border-[#0053CC] font-semibold text-xs"
                />
              </div>

              {/* Student ID */}
              <div className="space-y-1.5">
                <label className="font-medium text-slate-400">Student ID</label>
                <input
                  type="text"
                  name="studentId"
                  required
                  value={formData.studentId}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 focus:outline-none focus:border-[#0053CC] font-semibold text-xs"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="font-medium text-slate-400">Phone Number</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-500 text-xs">+63</span>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber ? formData.phoneNumber.replace(/^\+63/, '') : ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      if (val.length <= 10) {
                        setFormData(prev => ({ ...prev, phoneNumber: val ? `+63${val}` : '' }));
                      }
                    }}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 pl-10 focus:outline-none focus:border-[#0053CC] font-semibold text-xs"
                    placeholder="999 888 7777"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Account Details Section */}
          <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-poppins text-sm font-bold text-[#0053CC] dark:text-blue-400">
              Account Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-12 text-xs">
              {/* Account Status Custom Dropdown */}
              <div className="space-y-1.5 relative" ref={statusDropdownRef}>
                <label className="font-medium text-slate-400">Account Status</label>
                <button
                  type="button"
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  className="w-full flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 font-bold text-slate-900 dark:text-white text-xs cursor-pointer shadow-xs"
                >
                  <span>{formData.accountStatus}</span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isStatusDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isStatusDropdownOpen && (
                  <div className="absolute left-0 mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl py-1 z-30">
                    {["Active", "Suspended", "Inactive"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, accountStatus: opt }));
                          setIsStatusDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs transition-colors cursor-pointer ${
                          formData.accountStatus === opt ? "font-bold text-[#0053CC] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
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
                <p className="font-bold text-slate-900 dark:text-white mt-2 text-sm">{formData.dateCreated}</p>
              </div>

              <div>
                <p className="text-slate-400 font-medium">Last Updated</p>
                <p className="font-bold text-slate-900 dark:text-white mt-2 text-sm">{formData.lastUpdated}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Last Login</p>
                <p className="font-bold text-slate-900 dark:text-white mt-2 text-sm">N/A</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {apiError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-semibold text-center mb-4">
              {apiError}
            </div>
          )}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
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
                <h3 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">User Profile Updated</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  Changes to the user account have been saved successfully.
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