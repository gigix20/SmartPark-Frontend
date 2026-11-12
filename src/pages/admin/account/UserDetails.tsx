import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit, UserX, AlertCircle, CheckCircle2, X, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { getAccountById, updateAccountStatus } from "./api/accountApi";

export default function UserDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  const handleConfirmDeactivate = async () => {
    try {
      if (!id) return;
      await updateAccountStatus(id, "Deactivated");
      setUserData((prev: any) => ({ ...prev, accountStatus: "Deactivated" }));
      setShowDeactivateModal(false);
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Failed to deactivate user account:", err);
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
        <div className="text-center py-32 text-slate-500">User account not found.</div>
      </AdminLayout>
    );
  }

  const status = userData.accountStatus || userData.status || "Active";
  const isDeactivated = status?.toUpperCase() === "DEACTIVATED" || status?.toUpperCase() === "INACTIVE";
  const studentId = userData.schoolId || userData.studentId || "N/A";
  const phone = userData.phone || userData.phoneNumber || "N/A";
  const dateCreated = userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : (userData.dateCreated || "N/A");
  const lastUpdated = userData.updatedAt ? new Date(userData.updatedAt).toLocaleString() : (userData.lastUpdated || "N/A");

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl mx-auto relative">

        {/* Main Card Container */}
        <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-8 transition-colors">
          
          {/* Header Title, Back Button & Deactivate Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/admin/accounts")}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div>
                <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">User Profile</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Detailed view of user credentials and account status.</p>
              </div>
            </div>
            
            {!isDeactivated && (
              <button
                type="button"
                onClick={() => setShowDeactivateModal(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/30 px-4 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors w-fit cursor-pointer"
              >
                <UserX className="h-3.5 w-3.5" />
                <span>Deactivate</span>
              </button>
            )}
          </div>

          {/* Profile Overview Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-4">
              <img 
                src={userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent((userData.firstName || '') + ' ' + (userData.lastName || ''))}&background=0053CC&color=fff`} 
                alt={userData.firstName} 
                className="h-16 w-16 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shadow-xs"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-poppins text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                    {userData.firstName} {userData.lastName}
                  </h2>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    userData.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-400" :
                    userData.status === "Suspended" ? "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-400" :
                    "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/50 dark:border-rose-800 dark:text-rose-400"
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      status === "Active" ? "bg-emerald-500" : status === "Suspended" ? "bg-amber-500" : "bg-rose-500"
                    }`}></span>
                    {status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">Student ID: {studentId}</p>
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="font-poppins text-xs font-bold text-[#0053CC] dark:text-blue-400 uppercase tracking-wider">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="space-y-1">
                <span className="text-slate-400">First Name</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{userData.firstName}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400">Last Name</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{userData.lastName}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400">Email Address</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{userData.email}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400">Student ID</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{studentId}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400">Role</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{userData.role}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400">Phone Number</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{phone}</p>
              </div>
            </div>
          </div>

          {/* Account Details Section */}
          <div className="space-y-4">
            <h3 className="font-poppins text-xs font-bold text-[#0053CC] dark:text-blue-400 uppercase tracking-wider">
              Account Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="space-y-1">
                <span className="text-slate-400">Account Status</span>
                <div className="pt-0.5">
                  <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                    userData.status === "Active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" :
                    "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                  }`}>
                    {status.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400">Date Created</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{dateCreated}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400">Last Updated</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{lastUpdated}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400">Last Login</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{userData.lastLogin}</p>
              </div>
            </div>
          </div>

          {/* Edit Button Footer */}
          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => navigate(`/admin/users/edit/${userData.id}`)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit</span>
            </button>
          </div>

        </div>

        {/* --- DEACTIVATE MODAL --- */}
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
                <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">Deactivate User Account?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Are you sure you want to deactivate {userData.firstName} {userData.lastName}'s account?
                </p>
              </div>
              
              <div className="space-y-2 pt-2">
                <button 
                  type="button"
                  onClick={handleConfirmDeactivate}
                  className="w-full h-11 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/20 transition-all cursor-pointer"
                >
                  Deactivate
                </button>
                <button 
                  type="button"
                  onClick={() => setShowDeactivateModal(false)}
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
                <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">Account Deactivated Successfully</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  The user's account has been deactivated.
                </p>
              </div>
              
              <div className="pt-2">
                <button 
                  type="button"
                  onClick={() => navigate("/admin/accounts")}
                  className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-[#0053CC] dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Back to Accounts
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}