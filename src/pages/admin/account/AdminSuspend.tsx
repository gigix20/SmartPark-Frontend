import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronDown, Check, Clock, Info, AlertCircle } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function AdminSuspend() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Form states
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("7 Days");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState("");

  // Dropdown states
  const [isDurationOpen, setIsDurationOpen] = useState(false);

  // Validation / Error states
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Prevent background scrolling kapag bukas ang modal
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

  // Awtomatikong kukuwenta ng End Date kapag nagbago ang Start Date o Duration
  useEffect(() => {
    if (startDate) {
      const resultDate = new Date(startDate);
      
      if (duration === "3 Days") {
        resultDate.setDate(resultDate.getDate() + 3);
      } else if (duration === "7 Days") {
        resultDate.setDate(resultDate.getDate() + 7);
      } else if (duration === "14 Days") {
        resultDate.setDate(resultDate.getDate() + 14);
      } else if (duration === "30 Days") {
        resultDate.setDate(resultDate.getDate() + 30);
      } else if (duration === "Permanent") {
        // Halimbawa ay magset ng 100 taon o i-blank/i-disable kung permanent
        resultDate.setFullYear(resultDate.getFullYear() + 100);
      }

      setEndDate(resultDate);
    }
  }, [startDate, duration]);

  const handleSuspendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!reason.trim() || !startDate || !endDate) {
      return;
    }

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
        <form onSubmit={handleSuspendSubmit} noValidate className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-8 transition-colors">
          
          {/* Header Title */}
          <div className="border-b border-slate-100 dark:border-slate-800 pb-6">
            <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">Suspend Admin Account</h1>
            <p className="text-xs text-slate-500 mt-1">Temporarily restrict the admin's account access.</p>
          </div>

          {/* Profile Overview Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=60" 
                alt="John Doe" 
                className="h-14 w-14 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm"
              />
              <div>
                <h2 className="font-poppins text-base font-extrabold text-slate-900 dark:text-white">
                  John Doe
                </h2>
                <p className="text-xs text-slate-400 font-medium">QCU-IT-2024-08</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-500">Current Status</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                Active
              </span>
            </div>
          </div>

          {/* Form Fields Section */}
          <div className="space-y-6 text-xs">
            
            {/* Suspension Reason */}
            <div className="space-y-1.5">
              <label className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1">
                Suspension Reason <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for suspension..."
                className={`w-full rounded-xl border bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none transition-colors ${
                  isSubmitted && !reason.trim()
                    ? "border-rose-500 focus:border-rose-500" 
                    : "border-slate-200 dark:border-slate-700 focus:border-[#0053CC]"
                }`}
              />
              {isSubmitted && !reason.trim() && (
                <p className="text-rose-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" /> Please fill out this field.
                </p>
              )}
            </div>

            {/* Suspension Duration */}
            <div className="space-y-1.5 relative">
              <label className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1">
                Suspension Duration <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsDurationOpen(!isDurationOpen)}
                className="w-full flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs font-semibold text-slate-900 dark:text-white cursor-pointer"
              >
                <span>{duration}</span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              {isDurationOpen && (
                <div className="absolute left-0 mt-1 w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl py-1 z-20">
                  {["3 Days", "7 Days", "14 Days", "30 Days", "Permanent"].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        setDuration(d);
                        setIsDurationOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs transition-colors cursor-pointer ${
                        duration === d ? "bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] font-bold" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Start Date & End Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Start Date */}
              <div className="space-y-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1">
                  Start Date <span className="text-rose-500">*</span>
                </label>
                <div className={`rounded-xl border transition-colors ${
                  isSubmitted && !startDate ? "border-rose-500" : "border-slate-200 dark:border-slate-700"
                }`}>
                  <DatePicker
                    selected={startDate}
                    onChange={(date: Date | null) => setStartDate(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="DD/MM/YYYY"
                    className="w-full bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none rounded-xl border-none"
                    wrapperClassName="w-full"
                  />
                </div>
                {isSubmitted && !startDate && (
                  <p className="text-rose-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" /> Please fill out this field.
                  </p>
                )}
              </div>

              {/* End Date (Auto-calculated) */}
              <div className="space-y-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1">
                  End Date <span className="text-rose-500">*</span>
                </label>
                <div className={`rounded-xl border transition-colors ${
                  isSubmitted && !endDate ? "border-rose-500" : "border-slate-200 dark:border-slate-700"
                }`}>
                  <DatePicker
                    selected={endDate}
                    onChange={(date: Date | null) => setEndDate(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="DD/MM/YYYY"
                    className="w-full bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none rounded-xl border-none"
                    wrapperClassName="w-full"
                  />
                </div>
                {isSubmitted && !endDate && (
                  <p className="text-rose-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" /> Please fill out this field.
                  </p>
                )}
              </div>

            </div>

            {/* Additional Notes */}
            <div className="space-y-1.5">
              <label className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1">
                Additional Notes <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter any additional information..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0053CC] resize-none"
              />
            </div>

            {/* Notification Notice */}
            <div className="flex items-center gap-2 text-slate-500 pt-2">
              <Info className="h-4 w-4 text-blue-500 shrink-0" />
              <span>The admin will be notified after the suspension is confirmed through email.</span>
            </div>

          </div>

          {/* Action Buttons Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => navigate(`/admin/accounts/details/${id || "1"}`)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <span>Confirm</span>
            </button>
          </div>

        </form>

        {/* --- ACCOUNT SUSPENDED SUCCESS MODAL --- */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-[32px] bg-white dark:bg-slate-900 p-7 text-center shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 animate-in zoom-in-95 relative transition-colors">
              
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/40">
                <Check className="h-7 w-7 stroke-[2.5]" />
              </div>

              <div>
                <h3 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">Account Suspended Successfully</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed px-2">
                  John Santo's account has been suspended successfully.
                </p>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">DURATION</span>
                <div className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-2xl border-2 border-emerald-500/80 bg-emerald-50/30 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm shadow-xs">
                  <Clock className="h-4 w-4 stroke-[2.5]" />
                  <span>{duration}</span>
                </div>
              </div>
              
              <div className="pt-2">
                <button 
                  onClick={() => navigate("/admin/accounts")}
                  className="w-full h-11 rounded-xl border border-blue-200 dark:border-slate-700 text-xs font-bold text-[#0053CC] dark:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
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