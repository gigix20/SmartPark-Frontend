import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Check, X } from "lucide-react";
import { GuardHeader } from "@/components/GuardHeader";
import { GuardNav } from "@/components/GuardNav";

export default function GateRegistrationForm() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Form Fields State
  const [ownerName, setOwnerName] = useState("Maria Santos");
  const [vehicleType, setVehicleType] = useState("Motorcycle");
  const [plateNumber, setPlateNumber] = useState("ABC 4921");
  const [model, setModel] = useState("Toyota Corolla");
  const [idType, setIdType] = useState("Driver's License");
  const [idNumber, setIdNumber] = useState("DL-07-482190");
  const [color, setColor] = useState("White");

  // Modal Control States
  const [activeModal, setActiveModal] = useState<
    "none" | "summary" | "duplicate" | "progressLost" | "success"
  >("none");

  // Prevent background scrolling when modal is active
  useEffect(() => {
    if (activeModal !== "none") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeModal]);

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (plateNumber.trim().toUpperCase() === "ABC 4021") {
      setActiveModal("duplicate");
      return;
    }
    setActiveModal("summary");
  };

  const handleCancelClick = () => {
    if (ownerName || plateNumber) {
      setActiveModal("progressLost");
    } else {
      navigate("/guard/registration");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex flex-col transition-colors font-sans">
      <GuardHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex-1 flex relative">
        <GuardNav isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto lg:pl-72 transition-all">
          <div className="space-y-6 max-w-6xl mx-auto pb-16">
            
            {/* Uniform Back Button & Header */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCancelClick}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div>
                <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">
                  Gate Registration
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Identify the vehicle and driver, verify ID, then create a temporary gate registration.
                </p>
              </div>
            </div>

            {/* Main Form Container */}
            <form
              onSubmit={handleSubmitForm}
              className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6 transition-colors"
            >
              <h2 className="font-poppins text-base font-bold text-slate-900 dark:text-white text-center pb-2 border-b border-slate-100 dark:border-slate-800">
                Gate Registration Form
              </h2>

              <div className="space-y-4">
                <h3 className="font-poppins text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  1. Owner & Vehicle Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Owner / driver name */}
                  <div className="space-y-1.5">
                    <label className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1">
                      Owner / driver name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="e.g. Maria Santos"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0053CC] transition-colors"
                    />
                  </div>

                  {/* Vehicle type */}
                  <div className="space-y-1.5">
                    <label className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1">
                      Vehicle type <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      placeholder="Motorcycle / Car"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0053CC] transition-colors"
                    />
                  </div>

                  {/* Plate number */}
                  <div className="space-y-1.5">
                    <label className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1">
                      Plate number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={plateNumber}
                      onChange={(e) => setPlateNumber(e.target.value)}
                      placeholder="ABC 4921"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0053CC] transition-colors"
                    />
                  </div>

                  {/* Model */}
                  <div className="space-y-1.5">
                    <label className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1">
                      Model <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="Toyota Corolla"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0053CC] transition-colors"
                    />
                  </div>

                  {/* ID type */}
                  <div className="space-y-1.5">
                    <label className="text-slate-700 dark:text-slate-300 font-bold block">
                      ID type
                    </label>
                    <input
                      type="text"
                      value={idType}
                      onChange={(e) => setIdType(e.target.value)}
                      placeholder="Driver's License"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0053CC] transition-colors"
                    />
                  </div>

                  {/* ID number */}
                  <div className="space-y-1.5">
                    <label className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1">
                      ID number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      placeholder="DL-07-482190"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0053CC] transition-colors"
                    />
                  </div>

                  {/* Color */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1">
                      Color <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder="White"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0053CC] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleCancelClick}
                  className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            </form>

          </div>
        </main>
      </div>

      {/* ================= MODALS SECTION ================= */}

      {/* 1. REGISTRATION SUMMARY MODAL */}
      {activeModal === "summary" && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-[32px] bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-6 relative transition-colors animate-in zoom-in-95 my-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">
                Registration Summary
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal("none")}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white">Owner & Vehicle Details</h4>

              <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                <div>
                  <p className="text-slate-400 font-medium">Owner / driver</p>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{ownerName}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Vehicle type</p>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{vehicleType} (Sedan)</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Plate number</p>
                  <p className="font-bold text-[#0053CC] dark:text-blue-400 mt-0.5">{plateNumber}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Model</p>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{model}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">ID type</p>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{idType}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">ID number</p>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{idNumber}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveModal("none")}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setActiveModal("success")}
                className="px-5 py-2.5 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                Confirm Registration
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 2. DUPLICATE REGISTRATION DETECTED MODAL */}
      {activeModal === "duplicate" && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-[32px] bg-white dark:bg-slate-900 p-7 text-center shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 animate-in zoom-in-95 relative transition-colors">
            
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-rose-500 text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/40">
              <X className="h-7 w-7 stroke-[2.5]" />
            </div>

            <div>
              <h3 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">
                Duplicate Registration Detected
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed px-2">
                Please use a different Vehicle ID or Plate Number.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <button 
                type="button"
                onClick={() => setActiveModal("none")}
                className="w-full h-11 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                View Details
              </button>
              <button 
                type="button"
                onClick={() => {
                  setActiveModal("none");
                  navigate("/guard/registration");
                }}
                className="w-full h-10 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
              >
                Cancel Registration
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 3. ALL PROGRESS WILL BE LOST MODAL */}
      {activeModal === "progressLost" && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-[32px] bg-white dark:bg-slate-900 p-7 text-center shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 animate-in zoom-in-95 relative transition-colors">
            
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/40">
              <AlertTriangle className="h-7 w-7" />
            </div>

            <div>
              <h3 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">
                All Progress Will Be Lost
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed px-2">
                Leaving now will discard the driver, vehicle, and verification information entered in this form.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 text-[11px] text-amber-700 dark:text-amber-400 font-medium">
              Unsaved registration for {plateNumber} - {ownerName}
            </div>

            <div className="space-y-2.5 pt-2">
              <button 
                type="button"
                onClick={() => {
                  setActiveModal("none");
                  navigate("/guard/registration");
                }}
                className="w-full h-11 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                Discard
              </button>
              <button 
                type="button"
                onClick={() => setActiveModal("none")}
                className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Keep Editing
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. GATE REGISTRATION SUCCESSFUL MODAL */}
      {activeModal === "success" && (
        <div className="fixed inset-0 z-110 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-[32px] bg-white dark:bg-slate-900 p-7 text-center shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 animate-in zoom-in-95 relative transition-colors">
            
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/40">
              <Check className="h-7 w-7 stroke-[2.5]" />
            </div>

            <div>
              <h3 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">
                Gate Registration Successful
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed px-2">
                The temporary vehicle registration is active and the vehicle may proceed to entry confirmation.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">
              Registration: SPK-REG-240707 • Gate A • Valid until exit
            </div>

            <div className="space-y-2.5 pt-2">
              <button 
                type="button"
                onClick={() => {
                  setActiveModal("none");
                  navigate("/guard/scan-qr");
                }}
                className="w-full h-11 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                Continue to Entry
              </button>
              <button 
                type="button"
                onClick={() => {
                  setActiveModal("none");
                  navigate("/guard/registration");
                }}
                className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}