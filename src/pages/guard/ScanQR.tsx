import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QrCode, AlertTriangle, ShieldAlert, CheckCircle2, Car, X, RefreshCw, ArrowUpRight, Search, Keyboard, Loader2 } from "lucide-react";
import { GuardHeader } from "@/components/GuardHeader";
import { GuardNav } from "@/components/GuardNav";
import { scanGuardCode, recordGuardEntry, recordGuardExit, type GuardScanResponse } from "@/api/guardApi";

export default function ScanQR() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Manual code input state
  const [manualCode, setManualCode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Scanned vehicle state from backend
  const [scannedData, setScannedData] = useState<GuardScanResponse | null>(null);
  const [lastEntryResult, setLastEntryResult] = useState<any>(null);
  const [lastExitResult, setLastExitResult] = useState<any>(null);

  // Modal states
  const [activeModal, setActiveModal] = useState<
    "none" | "verifyInfo" | "entryRecorded" | "exitRecorded" | "vehicleMismatch" | "parkingFull" | "invalidQR"
  >("none");

  // Prevent background scrolling kapag may bukas na modal
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

  // Handler para sa manual / QR verification gamit ang live backend API
  const handleVerifyCode = async (codeToVerify: string) => {
    if (!codeToVerify.trim()) return;
    try {
      setIsSearching(true);
      setErrorMessage("");
      const res = await scanGuardCode(codeToVerify.trim());

      if (res.success && res.vehicle) {
        setScannedData(res);
        setActiveModal("verifyInfo");
      }
    } catch (err: any) {
      const resp = err.response?.data;
      if (resp?.reason === "NOT_APPROVED") {
        setErrorMessage(resp.message || "Vehicle registration is not approved.");
        setActiveModal("vehicleMismatch");
      } else if (resp?.reason === "INVALID_QR" || err.response?.status === 404) {
        setErrorMessage(resp?.message || "Invalid or unregistered QR code / plate number.");
        setActiveModal("invalidQR");
      } else {
        setErrorMessage(resp?.message || "Verification failed. Please try again.");
        setActiveModal("invalidQR");
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleVerifyCode(manualCode);
  };

  // Confirm Entry or Exit based on vehicle parked state
  const handleConfirmAction = async () => {
    if (!scannedData?.vehicle) return;
    const vehicleId = scannedData.vehicle.id;

    try {
      setIsSubmitting(true);
      if (scannedData.isCurrentlyParked) {
        // Vehicle is inside -> Confirm Exit
        const res = await recordGuardExit(vehicleId);
        if (res.success) {
          setLastExitResult(res.log);
          setActiveModal("exitRecorded");
        }
      } else {
        // Vehicle is outside -> Confirm Entry
        const res = await recordGuardEntry(vehicleId);
        if (res.success) {
          setLastEntryResult(res.log);
          setActiveModal("entryRecorded");
        }
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to record access. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex flex-col transition-colors font-sans">
      
      {/* Guard Header */}
      <GuardHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex-1 flex relative pt-16">
        
        {/* Guard Nav Sidebar */}
        <GuardNav isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Main Content Area */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto lg:pl-72 transition-all">
          <div className="space-y-6 max-w-6xl mx-auto">
            
            {/* Page Header */}
            <div>
              <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">Scan QR</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Scan the QR code with the barcode scanner or enter the plate number manually.</p>
            </div>

            {/* Main Scanner Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Scanner Viewport Box & Manual Input */}
              <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6 lg:col-span-2 flex flex-col items-center justify-center transition-colors">
                
                <div className="w-full max-w-md h-72 rounded-2xl border-2 border-dashed border-[#0053CC]/40 dark:border-blue-500/40 bg-blue-50/20 dark:bg-blue-950/10 flex flex-col items-center justify-center relative p-6 space-y-4">
                  <div className="h-28 w-28 rounded-2xl border-2 border-[#0053CC] dark:border-blue-400 flex items-center justify-center bg-white dark:bg-slate-900 shadow-sm animate-pulse">
                    <QrCode className="h-16 w-16 text-[#0053CC] dark:text-blue-400" />
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>Ready to scan</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <RefreshCw className="h-4 w-4 animate-spin text-[#0053CC]" />
                  <span>Waiting for scanner or manual plate search...</span>
                </div>

                {/* --- MANUAL CODE ENTRY --- */}
                <div className="w-full max-w-md pt-2">
                  <form onSubmit={handleManualSubmit} className="flex flex-col sm:flex-row items-center gap-2">
                    <div className="relative w-full">
                      <Keyboard className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Type plate number (e.g. NDP 4419) or QR code..."
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#0053CC] font-semibold"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSearching || !manualCode.trim()}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] px-5 py-2.5 text-xs font-bold text-white transition-colors shadow-xs cursor-pointer shrink-0 disabled:opacity-50"
                    >
                      {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                      <span>Verify</span>
                    </button>
                  </form>
                </div>

                {/* Simulator Test Buttons */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 w-full flex flex-wrap items-center justify-center gap-2.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider w-full text-center">Quick Test Scans:</span>
                  <button
                    type="button"
                    onClick={() => handleVerifyCode("NDP 4419")}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    Test Plate: NDP 4419 (Live DB)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModal("vehicleMismatch")}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    Vehicle Mismatch
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModal("parkingFull")}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    Parking Lot Full
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModal("invalidQR")}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Invalid / Expired QR
                  </button>
                </div>

              </div>

              {/* Right Column: Important Instructions */}
              <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-4 transition-colors">
                <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-poppins font-bold text-sm">
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400">
                    <Car className="h-4 w-4" />
                  </div>
                  <span>Important</span>
                </div>

                <ol className="space-y-3 text-xs text-slate-500 dark:text-slate-400 list-decimal list-inside leading-relaxed">
                  <li>Make sure the QR code is clear and not damaged.</li>
                  <li>Ensure the vehicle is properly registered.</li>
                  <li>If the QR scanner fails, you can manually type the plate number in the input box provided.</li>
                  <li>Entries and exits are recorded in real-time to the database and sync directly with Admin Access Records.</li>
                </ol>
              </div>

            </div>

          </div>
        </main>

      </div>

      {/* ================= MODALS SECTION ================= */}

      {/* 1. VERIFY VEHICLE INFORMATION MODAL */}
      {activeModal === "verifyInfo" && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-2xl rounded-[32px] bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-6 relative transition-colors my-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">
                  {scannedData?.isCurrentlyParked ? "Verify Vehicle Exit" : "Verify Vehicle Entry"}
                </h2>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                  scannedData?.isCurrentlyParked
                    ? "bg-purple-50 text-purple-600 border-purple-200"
                    : "bg-emerald-50 text-emerald-600 border-emerald-200"
                }`}>
                  {scannedData?.isCurrentlyParked ? "Exit Recorded Checkpoint" : "QR Valid - Entry Approved"}
                </span>
              </div>
              <button 
                onClick={() => setActiveModal("none")}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Vehicle Card Preview */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <div className="h-28 w-40 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-2 shadow-xs shrink-0">
                <Car className="h-20 w-20 text-[#0053CC] dark:text-blue-400" />
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="font-poppins text-2xl font-black text-[#0053CC] dark:text-blue-400 tracking-wide">
                  {scannedData?.vehicle?.plateNumber || "NDP 4419"}
                </h3>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {scannedData?.vehicle?.brand} {scannedData?.vehicle?.model} {scannedData?.vehicle?.year}
                </p>
                <div>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400 border border-blue-100 dark:border-blue-900">
                    {scannedData?.vehicle?.type || "Car"}
                  </span>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="space-y-3 text-xs pt-2">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-400 font-medium">Owner / Driver Name:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {scannedData?.vehicle?.ownerName || "Bryan Emmanuel Marcelo"}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-400 font-medium">ID Number:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {scannedData?.vehicle?.schoolId || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-400 font-medium">Role:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {scannedData?.vehicle?.role || "Student"}
                </span>
              </div>
              <div className="flex justify-between items-center pb-1">
                <span className="text-slate-400 font-medium">Vehicle Color:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {scannedData?.vehicle?.color || "White"}
                </span>
              </div>

              {scannedData?.isCurrentlyParked && scannedData.activeLog && (
                <div className="flex justify-between items-center pt-2 border-t border-purple-100 dark:border-purple-900/50 text-purple-700 dark:text-purple-300">
                  <span className="font-medium">Entered At:</span>
                  <span className="font-bold">{scannedData.activeLog.formattedEntryTime} ({scannedData.activeLog.duration})</span>
                </div>
              )}
            </div>

            {/* Guard Verification Notice Box */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
              <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-[#0053CC] dark:text-blue-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">Guard Verification</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {scannedData?.isCurrentlyParked
                    ? "Verify vehicle exit and driver identity before departure"
                    : "Please check the driver's ID manually before granting entrance"}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveModal("none")}
                className="w-1/2 h-11 rounded-xl border border-rose-200 dark:border-rose-900/50 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={isSubmitting}
                className={`w-1/2 h-11 rounded-xl text-xs font-bold text-white shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  scannedData?.isCurrentlyParked
                    ? "bg-purple-600 hover:bg-purple-700 shadow-purple-500/20"
                    : "bg-[#0053CC] hover:bg-[#0042A5] shadow-blue-500/20"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving to DB...</span>
                  </>
                ) : scannedData?.isCurrentlyParked ? (
                  <span>Confirm Exit</span>
                ) : (
                  <span>Confirm Entry</span>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 2. ENTRY RECORDED SUCCESS MODAL */}
      {activeModal === "entryRecorded" && (
        <div className="fixed inset-0 z-110 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-[32px] bg-white dark:bg-slate-900 p-7 text-center shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 animate-in zoom-in-95 relative transition-colors">
            
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/40">
              <CheckCircle2 className="h-7 w-7" />
            </div>

            <div>
              <h3 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">Entry Recorded</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed px-2">
                Vehicle entry was saved to database and campus occupancy has been synchronized.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 text-[11px] text-left space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Vehicle:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {lastEntryResult?.plateNumber || scannedData?.vehicle?.plateNumber} - {lastEntryResult?.model || scannedData?.vehicle?.model}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Entry Time:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {lastEntryResult?.entryTime || new Date().toLocaleTimeString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Currently Inside</span>
              </div>
            </div>
            
            <div className="pt-2">
              <button 
                onClick={() => {
                  setActiveModal("none");
                  setManualCode("");
                  setScannedData(null);
                }}
                className="w-full h-11 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 3. EXIT RECORDED SUCCESS MODAL */}
      {activeModal === "exitRecorded" && (
        <div className="fixed inset-0 z-110 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-[32px] bg-white dark:bg-slate-900 p-7 text-center shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 animate-in zoom-in-95 relative transition-colors">
            
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-950/40">
              <ArrowUpRight className="h-7 w-7" />
            </div>

            <div>
              <h3 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">Exit Recorded</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed px-2">
                Vehicle exit was saved to database and campus occupancy has been updated.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 text-[11px] text-left space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Vehicle:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {lastExitResult?.plateNumber || scannedData?.vehicle?.plateNumber} - {lastExitResult?.model || scannedData?.vehicle?.model}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Exit Time:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {lastExitResult?.exitTime || new Date().toLocaleTimeString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Duration:</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  {lastExitResult?.duration || "--"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">Exited</span>
              </div>
            </div>
            
            <div className="pt-2">
              <button 
                onClick={() => {
                  setActiveModal("none");
                  setManualCode("");
                  setScannedData(null);
                }}
                className="w-full h-11 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. VEHICLE MISMATCH / UNAPPROVED MODAL */}
      {activeModal === "vehicleMismatch" && (
        <div className="fixed inset-0 z-110 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-[32px] bg-white dark:bg-slate-900 p-7 text-center shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 animate-in zoom-in-95 relative transition-colors">
            
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-rose-500 text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/40">
              <ShieldAlert className="h-7 w-7" />
            </div>

            <div>
              <h3 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">Vehicle Access Denied</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed px-2">
                {errorMessage || "Vehicle information does not match active approved records. Entry is denied."}
              </p>
            </div>
            
            <div className="pt-2">
              <button 
                onClick={() => setActiveModal("none")}
                className="w-full h-11 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                Back to Scan
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. PARKING LOT IS FULL MODAL */}
      {activeModal === "parkingFull" && (
        <div className="fixed inset-0 z-110 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-[32px] bg-white dark:bg-slate-900 p-7 text-center shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 animate-in zoom-in-95 relative transition-colors">
            
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/40">
              <AlertTriangle className="h-7 w-7" />
            </div>

            <div>
              <h3 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">Parking Lot Is Full</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed px-2">
                The facility has reached its parking capacity.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 text-[11px] flex justify-between items-center">
              <span className="text-slate-500 font-medium">Facility status:</span>
              <span className="font-extrabold text-amber-600 dark:text-amber-400">FULL CAPACITY</span>
            </div>
            
            <div className="space-y-2.5 pt-2">
              <button 
                onClick={() => setActiveModal("verifyInfo")}
                className="w-full h-11 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                Override & Confirm
              </button>
              <button 
                onClick={() => setActiveModal("none")}
                className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 6. INVALID OR EXPIRED QR MODAL */}
      {activeModal === "invalidQR" && (
        <div className="fixed inset-0 z-110 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-[32px] bg-white dark:bg-slate-900 p-7 text-center shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 animate-in zoom-in-95 relative transition-colors">
            
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/40">
              <AlertTriangle className="h-7 w-7" />
            </div>

            <div>
              <h3 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">Invalid or Expired QR</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed px-2">
                {errorMessage || "This vehicle could not be found or verified in the database. You may register the vehicle at the gate."}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button 
                onClick={() => {
                  setActiveModal("none");
                  navigate("/guard/registration");
                }}
                className="w-full h-11 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                Register Vehicle
              </button>

              <button 
                onClick={() => setActiveModal("none")}
                className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}