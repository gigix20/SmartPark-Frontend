import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit, UserX, AlertCircle, CheckCircle2, X } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";

export default function AdminDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Sample admin data batay sa ID
  const [adminData, setAdminData] = useState({
    id: id || "1",
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@qcu.edu.ph",
    employeeId: "QCU-IT-2024-08",
    role: "Super Administrator",
    phoneNumber: "+63 912 345 6789",
    status: "Active",
    dateCreated: "December 2025",
    lastUpdated: "Sep 28, 2026, 9:30 AM",
    lastLogin: "Sep 29, 2026, 9:00 PM",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=60"
  });

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

  const handleConfirmDeactivate = () => {
    setAdminData(prev => ({ ...prev, status: "Disabled" }));
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
            onClick={() => navigate("/admin/accounts")}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#0053CC] dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Accounts</span>
          </button>
        </div>

        {/* Main Card Container */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-8 transition-colors">
          
          {/* Header Title & Deactivate Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">Admin Profile</h1>
            <button
              type="button"
              onClick={() => setShowDeactivateModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/30 px-4 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors w-fit cursor-pointer"
            >
              <UserX className="h-3.5 w-3.5" />
              <span>Deactivate</span>
            </button>
          </div>

          {/* Profile Overview Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <img 
                src={adminData.avatar} 
                alt={adminData.firstName} 
                className="h-16 w-16 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-poppins text-lg font-extrabold text-slate-900 dark:text-white">
                    {adminData.firstName} {adminData.lastName}
                  </h2>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    adminData.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                    adminData.status === "Suspended" ? "bg-amber-50 text-amber-600 border-amber-200" :
                    "bg-rose-50 text-rose-600 border-rose-200"
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      adminData.status === "Active" ? "bg-emerald-500" : adminData.status === "Suspended" ? "bg-amber-500" : "bg-rose-500"
                    }`}></span>
                    {adminData.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">Employee ID: {adminData.employeeId}</p>
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="font-poppins text-xs font-bold text-[#0053CC] dark:text-blue-400 uppercase tracking-wider">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs bg-slate-50/30 dark:bg-slate-800/20 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <span className="text-slate-400">First Name</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{adminData.firstName}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400">Last Name</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{adminData.lastName}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400">Email Address</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{adminData.email}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400">Employee ID</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{adminData.employeeId}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400">Role</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{adminData.role}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400">Phone Number</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{adminData.phoneNumber}</p>
              </div>
            </div>
          </div>

          {/* Account Details Section */}
          <div className="space-y-4">
            <h3 className="font-poppins text-xs font-bold text-[#0053CC] dark:text-blue-400 uppercase tracking-wider">
              Account Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs bg-slate-50/30 dark:bg-slate-800/20 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <span className="text-slate-400">Account Status</span>
                <div className="pt-0.5">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                    adminData.status === "Active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" :
                    "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                  }`}>
                    {adminData.status.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400">Date Created</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{adminData.dateCreated}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400">Last Updated</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{adminData.lastUpdated}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400">Last Login</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{adminData.lastLogin}</p>
              </div>
            </div>
          </div>

          {/* Edit Button Footer */}
          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => navigate(`/admin/accounts/edit/${adminData.id}`)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit</span>
            </button>
          </div>

        </div>

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
                  Are you sure you want to deactivate {adminData.firstName} {adminData.lastName}'s account?
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