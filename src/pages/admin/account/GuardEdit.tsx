import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, ChevronDown } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";

export default function GuardEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Guard initial editable states
  const [firstName, setFirstName] = useState("Jose");
  const [lastName, setLastName] = useState("Santos");
  const [email, setEmail] = useState("josesantos@qcu.edu.ph");
  const [employeeId, setEmployeeId] = useState("QCU-G-002");
  const [phoneNumber, setPhoneNumber] = useState("+63 912 345 6789");
  const [status, setStatus] = useState("Active");

  // Dropdown state para sa Account Status
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  // Success Modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccessModal(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl mx-auto relative">
        {/* Back Button */}
        <div>
          <button
            type="button"
            onClick={() => navigate(`/admin/guards/details/${id || 3}`)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#0053CC] dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Guard Profile</span>
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSaveChanges} className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-8 transition-colors">
          
          {/* Header Title */}
          <div className="border-b border-slate-100 dark:border-slate-800 pb-6">
            <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">Guard Profile</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Modify guard personnel information and account privileges.</p>
          </div>

          {/* Profile Badge Preview */}
          <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60" 
              alt="Guard" 
              className="h-14 w-14 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">{firstName} {lastName}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-400">
                  {status}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Employee ID: {employeeId}</p>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="font-poppins text-xs font-bold text-[#0053CC] dark:text-blue-400 uppercase tracking-wider">
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              {/* First Name */}
              <div className="space-y-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold">First Name</label>
                <input 
                  type="text" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0053CC]"
                  required
                />
              </div>

              {/* Last Name */}
              <div className="space-y-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold">Last Name</label>
                <input 
                  type="text" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0053CC]"
                  required
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0053CC]"
                  required
                />
              </div>

              {/* Employee ID */}
              <div className="space-y-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold">Employee ID</label>
                <input 
                  type="text" 
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0053CC]"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-slate-700 dark:text-slate-300 font-bold">Phone Number</label>
                <input 
                  type="text" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0053CC]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Account Details Section */}
          <div className="space-y-4">
            <h3 className="font-poppins text-xs font-bold text-[#0053CC] dark:text-blue-400 uppercase tracking-wider">
              Account Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 items-center">
              
              {/* Status Dropdown (Katulad sa iyong ikalawang screenshot) */}
              <div className="space-y-1.5 relative" ref={statusDropdownRef}>
                <label className="text-slate-700 dark:text-slate-300 font-bold block">Account Status</label>
                <button
                  type="button"
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  className="w-full flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-3 text-xs font-bold text-slate-900 dark:text-white shadow-xs hover:border-[#0053CC] cursor-pointer"
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

              <div className="space-y-1">
                <span className="text-slate-400">Date Created</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">December 2025</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400">Last Updated</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">Sep 28, 2026, 9:30 AM</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400">Last Login</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">Sep 29, 2026, 9:00 PM</p>
              </div>

            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => navigate(`/admin/guards/details/${id || 3}`)}
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

        {/* --- SUCCESS MODAL --- */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-[32px] bg-white dark:bg-slate-900 p-7 text-center shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 relative">
              
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/40">
                <Check className="h-7 w-7 stroke-[2.5]" />
              </div>

              <div>
                <h3 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">Guard Profile Updated</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  Changes to the guard account have been saved successfully.
                </p>
              </div>
              
              <div className="pt-2">
                <button 
                  type="button"
                  onClick={() => navigate(`/admin/guards/details/${id || 3}`)}
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