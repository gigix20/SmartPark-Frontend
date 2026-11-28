import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Car,
  X,
  ArrowUpRight,
  Search,
  Keyboard,
  Loader2,
  ShieldCheck,
  Clock,
  Camera,
  ScanBarcode,
} from "lucide-react";
import { GuardHeader } from "@/components/GuardHeader";
import { GuardNav } from "@/components/GuardNav";
import { scanGuardCode, recordGuardEntry, recordGuardExit, type GuardScanResponse } from "@/api/guardApi";

export default function ScanQR() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Manual code input state & scanner ref
  const [manualCode, setManualCode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const barcodeBufferRef = useRef<string>("");
  const lastKeyTimeRef = useRef<number>(0);

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
      // Auto-refocus scanner input when modal closes
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeModal]);

  // Auto-focus input on page load for seamless plug-and-play barcode scanner entry
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handler para sa manual / QR / Barcode verification gamit ang live backend API
  const handleVerifyCode = useCallback(async (codeToVerify: string) => {
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
  }, []);

  // Global listener for plug-and-play barcode scanner (rapid key sequence ending with Enter)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ignore if a modal is already open
      if (activeModal !== "none") return;

      const now = Date.now();
      const diff = now - lastKeyTimeRef.current;
      lastKeyTimeRef.current = now;

      // When Enter is pressed
      if (e.key === "Enter") {
        if (barcodeBufferRef.current.trim().length >= 3) {
          e.preventDefault();
          const scanned = barcodeBufferRef.current.trim();
          barcodeBufferRef.current = "";
          setManualCode(scanned);
          handleVerifyCode(scanned);
        }
        return;
      }

      // Barcode scanners type characters extremely fast (< 50ms per key)
      if (e.key.length === 1) {
        if (diff > 100) {
          // Reset buffer if delay is too long (human typing)
          barcodeBufferRef.current = e.key;
        } else {
          barcodeBufferRef.current += e.key;
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [activeModal, handleVerifyCode]);

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
      
      // Generate deterministic idempotency key BEFORE making request
      // Uses: guardId-vehicleId-action-roundedTimestamp (by second)
      // This prevents duplicate entries from concurrent rapid scans
      const currentUser = JSON.parse(localStorage.getItem("user") || "null");
      const guardId = currentUser?.id || "unknown";
      const roundedTime = Math.floor(Date.now() / 1000); // Round to seconds
      const action = scannedData.isCurrentlyParked ? "exit" : "entry";
      const idempotencyKey = `${guardId}-${vehicleId}-${action}-${roundedTime}`;
      
      if (scannedData.isCurrentlyParked) {
        // Vehicle is inside -> Confirm Exit
        const res = await recordGuardExit(vehicleId, idempotencyKey);
        if (res.success) {
          setLastExitResult(res.log);
          setActiveModal("exitRecorded");
        }
      } else {
        // Vehicle is outside -> Confirm Entry
        const res = await recordGuardEntry(vehicleId, idempotencyKey);
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors font-sans">
      
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
              <div
                onClick={() => inputRef.current?.focus()}
                className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6 lg:col-span-2 flex flex-col items-center justify-center transition-colors cursor-pointer"
              >
                
                <div className="w-full max-w-md h-72 rounded-2xl border-2 border-dashed border-[#0053CC]/40 dark:border-blue-500/40 bg-blue-50/20 dark:bg-blue-950/10 flex flex-col items-center justify-center relative p-6 space-y-4">
                  <div className="h-28 w-28 rounded-2xl border-2 border-[#0053CC] dark:border-blue-400 flex flex-col items-center justify-center bg-white dark:bg-slate-900 shadow-sm animate-pulse space-y-1">
                    <ScanBarcode className="h-10 w-10 text-[#0053CC] dark:text-blue-400" />
                    <span className="text-[10px] font-bold text-slate-500">USB SCANNER</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>Plug &amp; Play Scanner Ready</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium text-center">
                  <span>Aim barcode scanner at the vehicle pass or enter plate number below</span>
                </div>

                {/* --- MANUAL CODE ENTRY & SCANNER INPUT --- */}
                <div className="w-full max-w-md pt-2" onClick={(e) => e.stopPropagation()}>
                  <form onSubmit={handleManualSubmit} className="flex flex-col sm:flex-row items-center gap-2">
                    <div className="relative w-full">
                      <Keyboard className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        ref={inputRef}
                        type="text"
                        placeholder="Scan barcode or type plate (e.g. NDP 4419)..."
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#0053CC] focus:ring-1 focus:ring-[#0053CC] font-semibold"
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
      {activeModal === "verifyInfo" && scannedData?.vehicle && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/70 dark:bg-slate-950/90 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-3xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto transition-colors">
            
            {/* Modal Top Header Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  scannedData.isCurrentlyParked
                    ? "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300"
                    : "bg-blue-100 dark:bg-blue-950/60 text-[#0053CC] dark:text-blue-400"
                }`}>
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-poppins text-base font-bold text-slate-900 dark:text-white leading-tight">
                    {scannedData.isCurrentlyParked ? "Vehicle Exit Verification" : "Vehicle Entry Verification"}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Campus Gate Control &bull; {scannedData.isCurrentlyParked ? "Exit Checkpoint" : "Entry Clearance"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 text-xs font-semibold">
                  <span className={`h-2 w-2 rounded-full ${
                    scannedData.isCurrentlyParked ? "bg-purple-600 animate-pulse" : "bg-emerald-600 animate-pulse"
                  }`} />
                  <span className="text-slate-700 dark:text-slate-300">
                    {scannedData.isCurrentlyParked ? "Parked (Ready to Exit)" : "Approved Pass"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal("none")}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              
              {/* Top Split: Vehicle Photo & Plate + Core Vehicle Info */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                
                {/* Left (5 cols): Vehicle Photo & Official Plate Banner */}
                <div className="md:col-span-5 flex flex-col space-y-3">
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/60 h-48 w-full flex items-center justify-center group shadow-xs">
                    {scannedData.vehicle.photo ? (
                      <img
                        src={scannedData.vehicle.photo}
                        alt={`Vehicle ${scannedData.vehicle.plateNumber}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                        <Car className="h-14 w-14 mb-2 stroke-1 text-slate-400" />
                        <span className="text-xs font-semibold text-slate-500">No Photo Registered</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Physical check required</span>
                      </div>
                    )}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/75 backdrop-blur-xs text-[10px] font-semibold text-white tracking-wide uppercase flex items-center gap-1">
                      <Camera className="h-3 w-3" />
                      <span>Vehicle Photo</span>
                    </div>
                  </div>

                  {/* Official Style License Plate Box */}
                  <div className="rounded-xl border-2 border-slate-800 dark:border-slate-200 bg-white text-slate-950 p-2.5 text-center shadow-xs">
                    <p className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 leading-none mb-1">
                      PILIPINAS &bull; QCU SMARTPARK
                    </p>
                    <p className="font-mono text-2xl font-black tracking-wider text-slate-900 leading-none">
                      {scannedData.vehicle.plateNumber}
                    </p>
                    <p className="text-[9px] font-bold text-[#0053CC] uppercase tracking-wider mt-1">
                      {scannedData.vehicle.type} &bull; {scannedData.vehicle.color}
                    </p>
                  </div>
                </div>

                {/* Right (7 cols): Vehicle Specifications & Driver Details */}
                <div className="md:col-span-7 flex flex-col justify-between space-y-3">
                  
                  {/* Vehicle Spec Table */}
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-3.5 space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#0053CC] dark:text-blue-400">
                      Vehicle Specifications
                    </h3>

                    <div className="grid grid-cols-2 gap-2.5 text-xs pt-0.5">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Brand &amp; Model</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {scannedData.vehicle.brand} {scannedData.vehicle.model}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Year Model</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {scannedData.vehicle.year || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Color Finish</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {scannedData.vehicle.color || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Classification</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {scannedData.vehicle.type || "Car"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Registered Driver Details */}
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-3.5 space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#0053CC] dark:text-blue-400">
                      Registered Driver / Owner
                    </h3>

                    <div className="grid grid-cols-2 gap-2.5 text-xs pt-0.5">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Driver Name</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 truncate block" title={scannedData.vehicle.ownerName}>
                          {scannedData.vehicle.ownerName}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">ID Number</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {scannedData.vehicle.schoolId || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Role / Affiliation</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {scannedData.vehicle.role || "Student"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Contact Number</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {scannedData.vehicle.phone || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Parking Session / Gate Status Alert */}
              {scannedData.isCurrentlyParked && scannedData.activeLog ? (
                <div className="rounded-xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/60 dark:bg-purple-950/30 p-3.5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-purple-950 dark:text-purple-200">
                          Active Parking Session Detected
                        </p>
                        <p className="text-[11px] text-purple-800/80 dark:text-purple-300/80 mt-0.5">
                          Entered at: <strong>{scannedData.activeLog.formattedEntryTime}</strong> &bull; Total duration: <strong>{scannedData.activeLog.duration}</strong>
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wide shrink-0">
                      Departure Ready
                    </span>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/60 dark:bg-emerald-950/30 p-3.5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                          Vehicle Cleared for Entry
                        </p>
                        <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80 mt-0.5">
                          Registration active &bull; Please visually confirm vehicle and driver ID before opening the barrier.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide shrink-0">
                      Entry Cleared
                    </span>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80">
              <button
                type="button"
                onClick={() => setActiveModal("none")}
                className="px-5 h-11 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel / Deny
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={isSubmitting}
                className={`px-6 h-11 rounded-xl text-xs font-bold text-white shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  scannedData.isCurrentlyParked
                    ? "bg-purple-600 hover:bg-purple-700 shadow-purple-500/20"
                    : "bg-[#0053CC] hover:bg-[#0042A5] shadow-blue-500/20"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Recording to Database...</span>
                  </>
                ) : scannedData.isCurrentlyParked ? (
                  <span>Authorize &amp; Record Exit</span>
                ) : (
                  <span>Authorize &amp; Record Entry</span>
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