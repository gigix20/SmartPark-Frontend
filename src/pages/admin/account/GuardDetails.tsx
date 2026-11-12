import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit3, Ban, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { getAccountById, updateAccountStatus } from "./api/accountApi";

export default function GuardDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [guardData, setGuardData] = useState<any>(null);
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
          setGuardData(res.account);
        }
      } catch (err) {
        console.error("Failed to fetch guard details:", err);
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

  const handleDeactivateConfirm = async () => {
    try {
      if (!id) return;
      await updateAccountStatus(id, "Deactivated");
      setShowDeactivateModal(false);
      setGuardData((prev: any) => ({ ...prev, accountStatus: "Deactivated" }));
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Failed to deactivate guard account:", err);
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

  if (!guardData) {
    return (
      <AdminLayout>
        <div className="text-center py-32 text-slate-500">Guard account not found.</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="w-full max-w-5xl mx-auto space-y-6">
        
        {/* Main Card Container */}
        <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 sm:p-10 shadow-xs space-y-8 relative transition-colors">
          
          {/* Header Section */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/admin/accounts")}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">
                Guard Profile
              </h1>
            </div>

            <button
              type="button"
              onClick={() => setShowDeactivateModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 text-rose-600 bg-rose-50/50 hover:bg-rose-100/50 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Ban className="h-3.5 w-3.5" />
              <span>Deactivate</span>
            </button>
          </div>

          {/* Profile Basic Info Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={guardData.avatar}
                alt={guardData.firstName}
                className="h-16 w-16 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">
                    {guardData.firstName} {guardData.lastName}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                    Active
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Employee ID: {guardData.employeeId}</p>
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
                <p className="font-bold text-slate-900 dark:text-white mt-1 text-sm">{guardData.firstName}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Last Name</p>
                <p className="font-bold text-slate-900 dark:text-white mt-1 text-sm">{guardData.lastName}</p>
              </div>

              <div>
                <p className="text-slate-400 font-medium">Email Address</p>
                <p className="font-bold text-slate-900 dark:text-white mt-1 text-sm">{guardData.email}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Employee ID</p>
                <p className="font-bold text-slate-900 dark:text-white mt-1 text-sm">{guardData.employeeId}</p>
              </div>

              <div>
                <p className="text-slate-400 font-medium">Phone Number</p>
                <p className="font-bold text-slate-900 dark:text-white mt-1 text-sm">{guardData.phoneNumber}</p>
              </div>
            </div>
          </div>

          {/* Account Details Section */}
          <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-poppins text-sm font-bold text-[#0053CC] dark:text-blue-400">
              Account Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-12 text-xs">
              <div>
                <p className="text-slate-400 font-medium">Account Status</p>
                <span className="inline-block mt-1.5 px-3 py-1 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                  {guardData.accountStatus}
                </span>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Date Created</p>
                <p className="font-bold text-slate-900 dark:text-white mt-1 text-sm">{guardData.dateCreated}</p>
              </div>

              <div>
                <p className="text-slate-400 font-medium">Last Updated</p>
                <p className="font-bold text-slate-900 dark:text-white mt-1 text-sm">{guardData.lastUpdated}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Last Login</p>
                <p className="font-bold text-slate-900 dark:text-white mt-1 text-sm">{guardData.lastLogin}</p>
              </div>
            </div>
          </div>

          {/* Edit Button at Bottom Right */}
          <div className="flex justify-end pt-6">
            <button
              type="button"
              onClick={() => navigate(`/admin/guards/edit/${guardData.id}`)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Edit3 className="h-3.5 w-3.5 text-[#0053CC]" />
              <span>Edit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Deactivate Confirmation Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">
                Deactivate Guard Account?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to deactivate {guardData.firstName} {guardData.lastName}'s account?
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeactivateModal(false)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeactivateConfirm}
                className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-semibold text-white hover:bg-rose-700 cursor-pointer shadow-xs"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">
                Account Deactivated Successfully
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                The guard's account has been deactivated and access to SmartPark has been disabled.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowSuccessModal(false);
                navigate("/admin/accounts");
              }}
              className="w-full rounded-xl bg-[#0053CC] py-2.5 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
            >
              Back to Account Management
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}