import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, AlertCircle, X, FileText } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";

export default function IncidentReview() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionType, setActionType] = useState(""); 
  const [errorMessage, setErrorMessage] = useState("");

  // Lock background scroll kapag may nakatambad na modal
  useEffect(() => {
    if (isRejectModalOpen || isSuccessModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isRejectModalOpen, isSuccessModalOpen]);

  const handleOpenRejectModal = () => {
    setRejectionReason("");
    setErrorMessage("");
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      setErrorMessage("Please fill out this field.");
      return;
    }
    setIsRejectModalOpen(false);
    setActionType("Rejected");
    setIsSuccessModalOpen(true);
  };

  const handleMarkAsReviewed = () => {
    setActionType("Reviewed");
    setIsSuccessModalOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <button
            type="button"
            onClick={() => navigate("/admin/incidents")}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#0053CC] dark:hover:text-blue-400 transition-colors cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Incident Management</span>
          </button>
          <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">
            Review report
          </h1>
          <p className="text-xs text-slate-500">View resolved and past incident records.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4 lg:col-span-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Uploaded evidence</h3>
              <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-medium">1 photo</span>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50">
              <img 
                src="https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&auto=format&fit=crop&q=60" 
                alt="Car Evidence" 
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>car.jpg (2.4 MB)</span>
              <span className="text-emerald-600 font-bold">Uploaded with report</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-6 lg:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <p className="text-xs text-slate-400">Reference ID</p>
                <h3 className="font-poppins text-lg font-bold text-[#0053CC] dark:text-blue-400">INC-2026-{id || "0148"}</h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200">
                Pending
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <p className="text-slate-400">Reporter</p>
                <p className="font-bold text-slate-800 dark:text-slate-200">Sophia Reyes</p>
              </div>
              <div>
                <p className="text-slate-400">Vehicle Type</p>
                <p className="font-bold text-slate-800 dark:text-slate-200">Car (Sedan)</p>
              </div>
              <div>
                <p className="text-slate-400">Plate Number</p>
                <p className="font-bold text-slate-800 dark:text-slate-200">ABC 1234</p>
              </div>
              <div>
                <p className="text-slate-400">Model / Color</p>
                <p className="font-bold text-slate-800 dark:text-slate-200">Toyota Vios / Silver</p>
              </div>
              <div>
                <p className="text-slate-400">Report Type</p>
                <p className="font-bold text-slate-800 dark:text-slate-200">Blocking parking space</p>
              </div>
              <div>
                <p className="text-slate-400">Submitted Date/Time</p>
                <p className="font-bold text-slate-800 dark:text-slate-200">01 Oct 2026 - 10:24 AM</p>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-400">Description</p>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                A silver sedan is parked across the pedestrian access lane near the east entrance. People are having to walk around the vehicle to reach the building.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Registered Owner Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <p className="text-slate-400">Name</p>
              <p className="font-bold text-slate-800 dark:text-slate-200">Daniel Cruz</p>
            </div>
            <div>
              <p className="text-slate-400">Email Address</p>
              <p className="font-bold text-slate-800 dark:text-slate-200">daniel.cruz@email.com</p>
            </div>
            <div>
              <p className="text-slate-400">Phone Number</p>
              <p className="font-bold text-slate-800 dark:text-slate-200">0917 456 7708</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleOpenRejectModal}
              className="px-6 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs border border-red-200 cursor-pointer transition-colors"
            >
              Reject Report
            </button>
            <button
              type="button"
              onClick={handleMarkAsReviewed}
              className="px-6 py-2.5 rounded-xl bg-[#0053CC] hover:bg-blue-700 text-white font-bold text-xs shadow-md cursor-pointer transition-colors"
            >
              Mark as Reviewed
            </button>
          </div>
        </div>
      </div>

      {/* REJECT MODAL WITH RED DESIGN VALIDATION */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-5 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">Reason for rejection</h3>
                <p className="text-[11px] text-slate-400">The reporter will receive an email with this reason.</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmReject} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Reason for rejection <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={rejectionReason}
                  onChange={(e) => {
                    setRejectionReason(e.target.value);
                    if (e.target.value.trim()) setErrorMessage("");
                  }}
                  placeholder="e.g., Insufficient report information"
                  className={`w-full rounded-2xl border p-3 text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-800 focus:outline-none transition-all ${
                    errorMessage 
                      ? "border-red-500 ring-1 ring-red-500" 
                      : "border-slate-200 dark:border-slate-700 focus:border-[#0053CC]"
                  }`}
                ></textarea>
                
                {errorMessage && (
                  <div className="flex items-center gap-1.5 text-[11px] text-red-500 font-medium pt-0.5">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md cursor-pointer transition-colors"
                >
                  Reject Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white dark:bg-slate-900 p-6 text-center shadow-2xl space-y-4">
            <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${actionType === "Reviewed" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
              {actionType === "Reviewed" ? <CheckCircle2 className="h-8 w-8" /> : <AlertCircle className="h-8 w-8" />}
            </div>
            
            <div className="space-y-1">
              <h3 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">
                {actionType === "Reviewed" ? "Notification sent" : "Report rejected"}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {actionType === "Reviewed" 
                  ? "An incident notification and email have been sent to the registered vehicle owner."
                  : `The report was marked Rejected due to insufficient information. The rejection email has been sent to the reporter.`
                }
              </p>
            </div>

            {actionType === "Rejected" && (
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3 text-left border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  <FileText className="h-3.5 w-3.5 text-slate-400" />
                  <span>Reason recorded</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  {rejectionReason}
                </p>
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsSuccessModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                View report
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  navigate("/admin/incidents");
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#0053CC] hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-md"
              >
                Return to incidents
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}