import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronDown, AlertCircle, CheckCircle2, X } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";

export default function AdminEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Form states
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [email, setEmail] = useState("johndoe@qcu.edu.ph");
  const [employeeId] = useState("QCU-IT-2024-08");
  const [role, setRole] = useState("Super Administrator");
  const [phoneNumber, setPhoneNumber] = useState("09123456789");
  const [status, setStatus] = useState("Active");

  // Custom dropdown states
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  // Modal states
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Prevent background scrolling kapag bukas ang modal
  useEffect(() => {
    if (showDeactivateModal || showSuccessModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showDeactivateModal, showSuccessModal]);

  // Handler para sa Phone Number (Numbers only, max 12 digits)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 12) {
      setPhoneNumber(value);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/admin/accounts/details/${id || "1"}`);
  };

  const handleConfirmDeactivate = () => {
    setStatus("Disabled");
    setShowDeactivateModal(false);
    setShowSuccessModal(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl mx-auto relative">
        {/* Back Button */}
        <div>
          <button
            type="button"
            onClick={() => navigate(`/admin/accounts/details/${id || "1"}`)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#0053CC] dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Profile</span>
          </button>
        </div>

        {/* Main Form Container */}
        <form onSubmit={handleSave} className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-8 transition-colors">
          
          {/* Header Title */}
          <div className="border-b border-slate-100 dark:border-slate-800 pb-6">
            <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">Admin Profile</h1>
          </div>

          {/* Profile Overview Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=60" 
                alt="John Doe" 
                className="h-16 w-16 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-poppins text-lg font-extrabold text-slate-900 dark:text-white">
                    {firstName} {lastName}
                  </h2>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                    status === "Suspended" ? "bg-amber-50 text-amber-600 border-amber-200" :
                    "bg-rose-50 text-rose-600 border-rose-200"
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      status === "Active" ? "bg-emerald-500" : status === "Suspended" ? "bg-amber-500" : "bg-rose-500"
                    }`}></span>
                    {status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">Employee ID: {employeeId}</p>
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="font-poppins text-xs font-bold text-[#0053CC] dark:text-blue-400 uppercase tracking-wider">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs bg-slate-50/30 dark:bg-slate-800/20 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
              
              {/* First Name */}
              <div className="space-y-1.5">
                <label className="text-slate-500 font-semibold">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#0053CC]"
                />
              </div>

              {/* Last Name */}
              <div className="space-y-1.5">
                <label className="text-slate-500 font-semibold">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#0053CC]"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-slate-500 font-semibold">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#0053CC]"
                />
              </div>

              {/* Employee ID */}
              <div className="space-y-1.5">
                <label className="text-slate-500 font-semibold">Employee ID</label>
                <input
                  type="text"
                  value={employeeId}
                  disabled
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 p-2.5 text-xs font-bold text-slate-500 cursor-not-allowed"
                />
              </div>

              {/* Role Dropdown */}
              <div className="space-y-1.5 relative">
                <label className="text-slate-500 font-semibold">Role</label>
                <button
                  type="button"
                  onClick={() => {
                    setIsRoleOpen(!isRoleOpen);
                    setIsStatusOpen(false);
                  }}
                  className="w-full flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
                >
                  <span>{role}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {isRoleOpen && (
                  <div className="absolute left-0 mt-1 w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl py-1 z-20">
                    {["Super Administrator", "Administrator"].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          setRole(r);
                          setIsRoleOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs transition-colors cursor-pointer ${
                          role === r ? "bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] font-bold" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Phone Number (Numbers only, max 12 digits) */}
              <div className="space-y-1.5">
                <label className="text-slate-500 font-semibold">Phone Number</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="09123456789"
                  maxLength={12}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#0053CC]"
                />
              </div>

            </div>
          </div>

          {/* Account Details Section */}
          <div className="space-y-4">
            <h3 className="font-poppins text-xs font-bold text-[#0053CC] dark:text-blue-400 uppercase tracking-wider">
              Account Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs bg-slate-50/30 dark:bg-slate-800/20 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 items-center">
              
              <div className="space-y-1">
                <span className="text-slate-400">Account Status</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">Current state of the account</p>
              </div>

              {/* Status Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsStatusOpen(!isStatusOpen);
                    setIsRoleOpen(false);
                  }}
                  className="w-full sm:w-40 flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white cursor-pointer ml-auto"
                >
                  <span>{status}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {isStatusOpen && (
                  <div className="absolute right-0 mt-1 w-full sm:w-40 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl py-1 z-20">
                    {["Active", "Suspended", "Deactivate"].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          setIsStatusOpen(false);
                          if (st === "Suspended") {
                            navigate(`/admin/accounts/suspend/${id || "1"}`);
                          } else if (st === "Deactivate") {
                            setShowDeactivateModal(true);
                          } else {
                            setStatus(st);
                          }
                        }}
                        className={`w-full text-left px-3 py-2 text-xs transition-colors cursor-pointer ${
                          st === "Deactivate" 
                            ? "text-rose-600 font-bold hover:bg-rose-50 dark:hover:bg-rose-950/30" 
                            : st === "Suspended"
                            ? "text-amber-600 font-bold hover:bg-amber-50 dark:hover:bg-amber-950/30"
                            : status === st 
                            ? "bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] font-bold" 
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-slate-400">Date Created</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">December 2025</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400">Last Updated</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">Sep 28, 2026, 9:30 AM</p>
              </div>
            </div>
          </div>

          {/* Action Buttons Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => navigate(`/admin/accounts/details/${id || "1"}`)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Discard
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <span>Save Changes</span>
            </button>
          </div>

        </form>

        {/* --- DEACTIVATE CONFIRMATION MODAL --- */}
        {showDeactivateModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-8 text-center shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 animate-in zoom-in-95 relative">
              <button 
                onClick={() => setShowDeactivateModal(false)}
                className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                <AlertCircle className="h-7 w-7" />
              </div>

              <div>
                <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">Deactivate Admin Account?</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Are you sure you want to deactivate {firstName} {lastName}'s account?
                </p>
              </div>
              
              <div className="space-y-2 pt-2">
                <button 
                  onClick={handleConfirmDeactivate}
                  className="w-full h-11 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/20 transition-all cursor-pointer"
                >
                  Deactivate
                </button>
                <button 
                  onClick={() => setShowDeactivateModal(false)}
                  className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- ACCOUNT DEACTIVATED SUCCESS MODAL --- */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-8 text-center shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 animate-in zoom-in-95 relative">
              
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-7 w-7" />
              </div>

              <div>
                <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">Account Deactivated Successfully</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  The admin's account has been deactivated and access to SmartPark has been disabled.
                </p>
              </div>

              <div className="space-y-1.5 py-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">System Access</span>
                <div className="inline-block w-full py-2.5 rounded-xl border border-rose-200 bg-rose-50/50 text-rose-600 font-extrabold text-xs">
                  Disabled
                </div>
              </div>
              
              <div className="pt-2">
                <button 
                  onClick={() => navigate("/admin/accounts")}
                  className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-[#0053CC] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Back to Admin Management
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}