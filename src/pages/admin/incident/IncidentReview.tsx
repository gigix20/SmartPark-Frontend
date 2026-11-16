import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, AlertCircle, X, FileText, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { getAdminIncidentDetails, reviewAdminIncident, type IncidentItem } from "@/api/incidentApi";

export default function IncidentReview() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [incident, setIncident] = useState<IncidentItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const [rejectionReason, setRejectionReason] = useState("");
  const [actionType, setActionType] = useState<"Reviewed" | "Rejected" | "">("");
  const [errorMessage, setErrorMessage] = useState("");

  // Lock background scroll kapag may modal
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

  // Fetch real incident details from backend
  useEffect(() => {
    const fetchIncident = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const res = await getAdminIncidentDetails(id);
        if (res.success && res.incident) {
          setIncident(res.incident);
        }
      } catch (err: any) {
        console.error("Failed to fetch incident details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIncident();
  }, [id]);

  const handleOpenRejectModal = () => {
    setRejectionReason("");
    setErrorMessage("");
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      setErrorMessage("Please fill out this field.");
      return;
    }

    if (!id) return;

    try {
      setIsSubmitting(true);
      const res = await reviewAdminIncident(id, {
        action: "Rejected",
        rejectionReason: rejectionReason.trim(),
      });

      if (res.success) {
        setIsRejectModalOpen(false);
        setActionType("Rejected");
        setIsSuccessModalOpen(true);
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to reject report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkAsReviewed = async () => {
    if (!id) return;

    try {
      setIsSubmitting(true);
      const res = await reviewAdminIncident(id, {
        action: "Reviewed",
      });

      if (res.success) {
        setActionType("Reviewed");
        setIsSuccessModalOpen(true);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to mark report as reviewed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Back Button & Header */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/incidents")}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">Review report</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Review incident and notify vehicle owner.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 flex flex-col items-center justify-center text-center space-y-3">
            <Loader2 className="h-8 w-8 text-[#0053CC] animate-spin" />
            <p className="text-xs text-slate-500 dark:text-slate-400">Loading incident details...</p>
          </div>
        ) : !incident ? (
          <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center text-slate-400 text-xs">
            Incident report not found.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Evidence Card */}
              <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4 lg:col-span-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                    Uploaded evidence
                  </h3>
                  <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-medium">
                    1 photo
                  </span>
                </div>
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50">
                  <img
                    src={incident.evidenceImg}
                    alt="Incident Evidence"
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{incident.ref}.jpg</span>
                  <span className="text-emerald-600 font-bold">Uploaded with report</span>
                </div>
              </div>

              {/* Main Report Details */}
              <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6 lg:col-span-2">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <p className="text-xs text-slate-400">Reference ID</p>
                    <h3 className="font-poppins text-lg font-bold text-[#0053CC] dark:text-blue-400">
                      {incident.ref}
                    </h3>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      incident.status === "Pending"
                        ? "bg-amber-50 text-amber-600 border border-amber-200"
                        : incident.status === "Reviewed"
                        ? "bg-blue-50 text-[#0053CC] border border-blue-200"
                        : "bg-red-50 text-red-600 border border-red-200"
                    }`}
                  >
                    {incident.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="text-slate-400">Reporter</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{incident.reporter}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Vehicle Type</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{incident.type}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Plate Number</p>
                    <p className="font-bold text-slate-900 dark:text-white">{incident.plate}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Model / Color</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      {incident.model} / {incident.color}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400">Report Type</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{incident.reportType}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Submitted Date/Time</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{incident.submitted}</p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-400">Description</p>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {incident.desc}
                  </p>
                </div>
              </div>
            </div>

            {/* Registered Owner Details */}
            <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                Registered Owner Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <p className="text-slate-400">Name</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{incident.ownerName}</p>
                </div>
                <div>
                  <p className="text-slate-400">Email Address</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{incident.ownerEmail}</p>
                </div>
                <div>
                  <p className="text-slate-400">Phone Number</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{incident.ownerPhone}</p>
                </div>
              </div>

              {incident.status === "Pending" ? (
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={handleOpenRejectModal}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs border border-red-200 cursor-pointer transition-colors disabled:opacity-50"
                  >
                    Reject Report
                  </button>
                  <button
                    type="button"
                    onClick={handleMarkAsReviewed}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0053CC] hover:bg-blue-700 text-white font-bold text-xs shadow-md cursor-pointer transition-colors disabled:opacity-50"
                  >
                    {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    <span>Mark as Reviewed</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-slate-500">
                    Status: <strong className="text-slate-800 dark:text-white">{incident.status}</strong>
                    {incident.reviewedBy && ` by ${incident.reviewedBy}`}
                  </span>
                  {incident.rejectionReason && (
                    <span className="text-rose-600">Reason: {incident.rejectionReason}</span>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* REJECT MODAL */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-5 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">
                  Reason for rejection
                </h3>
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
                  placeholder="e.g., Insufficient report information or blurry evidence photo."
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
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md cursor-pointer transition-colors disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Reject Report</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-8 text-center shadow-2xl space-y-4">
            <div
              className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
                actionType === "Reviewed" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
              }`}
            >
              {actionType === "Reviewed" ? (
                <CheckCircle2 className="h-8 w-8" />
              ) : (
                <AlertCircle className="h-8 w-8" />
              )}
            </div>

            <div className="space-y-1">
              <h3 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">
                {actionType === "Reviewed" ? "Report marked as reviewed" : "Report rejected"}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {actionType === "Reviewed"
                  ? "The report has been successfully reviewed and the incident status is updated in the database."
                  : "The report was marked Rejected due to insufficient information. The rejection reason has been saved."}
              </p>
            </div>

            {actionType === "Rejected" && (
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3 text-left border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  <FileText className="h-3.5 w-3.5 text-slate-400" />
                  <span>Reason recorded</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">{rejectionReason}</p>
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  navigate("/admin/incidents");
                }}
                className="w-full py-2.5 rounded-xl bg-[#0053CC] hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-md"
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