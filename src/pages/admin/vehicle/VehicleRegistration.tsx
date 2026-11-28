import { useState, useEffect } from "react";
import { Search, CheckCircle2, Clock, X, Check, AlertCircle, Loader2, Eye } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import CarIcon from "@/assets/car-icon.svg";
import MotorIcon from "@/assets/motor-icon.svg";
import { 
  getAdminVehicleRegistrations, 
  approveVehicle, 
  rejectVehicle 
} from "@/api/vehicleApi";

export default function VehicleRegistration() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    totalRegistered: 0,
    pendingApprovals: 0,
    activePasses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Pending");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [modalType, setModalType] = useState<"review" | "confirmApprove" | "rejectReason" | "confirmReject" | "approvedSuccess" | "rejectedSuccess" | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState<string | null>(null);

  const fetchRegistrations = async () => {
    try {
      setIsLoading(true);
      const res = await getAdminVehicleRegistrations({
        search: searchQuery,
        filter: selectedFilter === "All Vehicles" ? "All" : selectedFilter,
      });

      if (res.success) {
        setRegistrations(res.registrations || []);
        if (res.metrics) {
          setMetrics(res.metrics);
        }
      }
    } catch (err: any) {
      console.error("Failed to fetch vehicle registrations:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [searchQuery, selectedFilter]);

  useEffect(() => {
    if (modalType !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [modalType]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(registrations.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = registrations.slice(indexOfFirstItem, indexOfLastItem);

  const confirmApproveAction = async () => {
    if (selectedVehicle) {
      try {
        await approveVehicle(selectedVehicle.id);
        await fetchRegistrations();
        setModalType("approvedSuccess");
      } catch (err: any) {
        alert(err.response?.data?.message || "Failed to approve vehicle registration.");
      }
    }
  };

  const confirmRejectAction = async () => {
    if (selectedVehicle) {
      if (!rejectionReason.trim()) {
        alert("Rejection reason cannot be blank.");
        return;
      }
      try {
        await rejectVehicle(selectedVehicle.id, rejectionReason.trim());
        await fetchRegistrations();
        setModalType("rejectedSuccess");
      } catch (err: any) {
        alert(err.response?.data?.message || "Failed to reject vehicle registration.");
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">Vehicle Registration</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Review and approve registered vehicles entering QCU premises.</p>
        </div>

        {/* METRICS & QUICK FILTER CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div 
            onClick={() => {
              setSelectedFilter("Pending");
              setCurrentPage(1);
            }}
            className={`rounded-3xl border-2 p-5 shadow-xs flex justify-between items-start transition-all cursor-pointer ${
              selectedFilter === "Pending"
                ? "bg-amber-50/50 dark:bg-amber-950/20 border-amber-500 ring-2 ring-amber-500/20"
                : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:border-amber-400"
            }`}
          >
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pending Approvals</span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
                  Needs Review
                </span>
              </div>
              <h3 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white mt-2">
                {metrics.pendingApprovals}
              </h3>
            </div>
            <div className="h-9 w-9 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5" />
            </div>
          </div>

          <div 
            onClick={() => {
              setSelectedFilter("Approved");
              setCurrentPage(1);
            }}
            className={`rounded-3xl border-2 p-5 shadow-xs flex justify-between items-start transition-all cursor-pointer ${
              selectedFilter === "Approved"
                ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500 ring-2 ring-emerald-500/20"
                : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:border-emerald-400"
            }`}
          >
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Passes</span>
              <h3 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white mt-2">
                {metrics.activePasses}
              </h3>
            </div>
            <div className="h-9 w-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>

          <div 
            onClick={() => {
              setSelectedFilter("All Vehicles");
              setCurrentPage(1);
            }}
            className={`rounded-3xl border-2 p-5 shadow-xs flex justify-between items-start transition-all cursor-pointer ${
              selectedFilter === "All Vehicles"
                ? "bg-blue-50/50 dark:bg-blue-950/20 border-[#0053CC] ring-2 ring-[#0053CC]/20"
                : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:border-blue-400"
            }`}
          >
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Registered</span>
              <h3 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white mt-2">
                {metrics.totalRegistered}
              </h3>
            </div>
            <div className="h-9 w-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
              <img src={CarIcon} alt="Car" className="h-5 w-5 object-contain" />
            </div>
          </div>
        </div>

        {/* REGISTRATION TABLE */}
        <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
          
          {/* STATUS TABS */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedFilter("Pending");
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedFilter === "Pending"
                    ? "bg-[#0053CC] text-white shadow-sm shadow-blue-500/20"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <Clock className="h-3.5 w-3.5" />
                <span>Pending Approvals</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  selectedFilter === "Pending" 
                    ? "bg-white/25 text-white" 
                    : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                }`}>
                  {metrics.pendingApprovals}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedFilter("Approved");
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedFilter === "Approved"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Approved</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  selectedFilter === "Approved" 
                    ? "bg-white/25 text-white" 
                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                }`}>
                  {metrics.activePasses}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedFilter("Rejected");
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedFilter === "Rejected"
                    ? "bg-rose-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <X className="h-3.5 w-3.5" />
                <span>Disapproved</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedFilter("All Vehicles");
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedFilter === "All Vehicles"
                    ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <span>All Registrations</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  selectedFilter === "All Vehicles" 
                    ? "bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900" 
                    : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                }`}>
                  {metrics.totalRegistered}
                </span>
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search plate, owner..." 
                className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 pl-8 pr-3 text-xs focus:outline-none focus:border-[#0053CC]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-175">
              <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="pb-3">Owner Name</th>
                  <th className="pb-3">Vehicle Details</th>
                  <th className="pb-3">Plate Number</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date Submitted</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                      <Loader2 className="h-6 w-6 animate-spin text-[#0053CC] dark:text-blue-400 mx-auto mb-2" />
                      Loading registrations...
                    </td>
                  </tr>
                ) : currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 font-medium text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2.5">
                          <div className="h-9 w-12 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                            {item.photo ? (
                              <img src={item.photo} alt={item.plateNo} className="h-full w-full object-cover" />
                            ) : (
                              <img src={item.type === "Motorcycle" || item.vehicleType?.includes("Motorcycle") ? MotorIcon : CarIcon} alt="" className="h-5 w-5 object-contain" />
                            )}
                          </div>
                          <div>
                            <span className="block font-semibold text-slate-900 dark:text-white">{item.owner}</span>
                            <span className="text-[10px] text-slate-400">{item.idNo !== "--" ? `ID: ${item.idNo}` : item.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-300">
                        <div className="font-medium">{item.brand} {item.model}</div>
                        <div className="text-[10px] text-slate-400">{item.type || item.vehicleType} • {item.color}</div>
                      </td>
                      <td className="py-3 font-bold text-slate-900 dark:text-white">{item.plateNo}</td>
                      <td className="py-3">
                        <span className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-bold ${
                          item.status === "Approved" ? "bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800" :
                          item.status === "Pending" ? "bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800" :
                          "bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800"
                        }`}>
                          {item.status === "Pending" && <Clock className="h-3 w-3" />}
                          {item.status === "Approved" && <Check className="h-3 w-3" />}
                          {item.status === "Rejected" && <X className="h-3 w-3" />}
                          <span>{item.status === "Pending" ? "For Approval" : item.status}</span>
                        </span>
                      </td>
                      <td className="py-3 text-slate-500 dark:text-slate-400">{item.date}</td>
                      <td className="py-3 text-right">
                        <button 
                          type="button" 
                          onClick={() => { setSelectedVehicle(item); setModalType("review"); }}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all shadow-xs cursor-pointer ${
                            item.status === "Pending"
                              ? "bg-[#0053CC] hover:bg-[#0042A5] text-white shadow-blue-500/20 hover:scale-[1.02]"
                              : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>{item.status === "Pending" ? "Review" : "View Details"}</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                      <div className="max-w-xs mx-auto space-y-2">
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                          {selectedFilter === "Pending" ? (
                            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                          ) : (
                            <Search className="h-6 w-6" />
                          )}
                        </div>
                        <p className="font-semibold text-slate-700 dark:text-slate-300">
                          {selectedFilter === "Pending" 
                            ? "No Pending Vehicle Approvals" 
                            : `No ${selectedFilter === "All Vehicles" ? "" : selectedFilter} vehicle records found`}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {selectedFilter === "Pending"
                            ? "All online vehicle registrations have been reviewed and processed!"
                            : "Try adjusting your search query or select another filter tab."}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {registrations.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 gap-4">
              <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, registrations.length)} of {registrations.length} records</span>
              <div className="flex items-center gap-1">
                <button 
                  type="button" 
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-lg font-medium text-slate-500 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 cursor-pointer disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    type="button"
                    onClick={() => setCurrentPage(number)}
                    className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                      currentPage === number ? "bg-[#0053CC] text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    {number}
                  </button>
                ))}
                <button 
                  type="button" 
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-3 py-1 rounded-lg font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 cursor-pointer disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL: REVIEW / VIEW --- */}
      {modalType === "review" && selectedVehicle && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-2xl rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-6 relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="font-poppins text-lg font-bold text-[#0053CC] dark:text-blue-400">Vehicle Registration Details</h2>
              <button onClick={() => setModalType(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div 
                onClick={() => selectedVehicle.photo && setSelectedPhotoPreview(selectedVehicle.photo)}
                title={selectedVehicle.photo ? "Click to zoom in" : ""}
                className={`h-28 w-40 sm:h-24 sm:w-36 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 flex items-center justify-center shadow-xs ${selectedVehicle.photo ? "cursor-zoom-in hover:opacity-90 transition-opacity" : ""}`}
              >
                {selectedVehicle.photo ? (
                  <img 
                    src={selectedVehicle.photo} 
                    alt={selectedVehicle.plateNo} 
                    className="h-full w-full object-cover" 
                  />
                ) : (
                  <img 
                    src={selectedVehicle.type === "Motorcycle" || selectedVehicle.vehicleType?.includes("Motorcycle") ? MotorIcon : CarIcon} 
                    alt="Vehicle Icon" 
                    className="h-10 w-10 object-contain p-2" 
                  />
                )}
              </div>
              <div className="text-center sm:text-left">
                <h3 className="font-poppins text-xl font-extrabold text-slate-900 dark:text-white">{selectedVehicle.plateNo}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{selectedVehicle.vehicleType} • {selectedVehicle.color}</p>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-[#0053CC] dark:text-blue-300 text-[10px] font-bold">
                  {selectedVehicle.type || (selectedVehicle.vehicleType?.includes("Motorcycle") ? "Motorcycle" : "Car")}
                </span>
              </div>
            </div>

            {/* Rejection Notice if rejected */}
            {selectedVehicle.status === "Rejected" && selectedVehicle.rejectionReason && (
              <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 p-4 text-xs text-rose-700 dark:text-rose-300">
                <span className="font-bold">Dahilan ng Disapproval:</span> {selectedVehicle.rejectionReason}
              </div>
            )}

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Vehicle Information</h4>
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div><span className="text-slate-400 block">Vehicle Type</span> <strong className="text-slate-800 dark:text-slate-200">{selectedVehicle.type || selectedVehicle.vehicleType}</strong></div>
                <div><span className="text-slate-400 block">Brand</span> <strong className="text-slate-800 dark:text-slate-200">{selectedVehicle.brand}</strong></div>
                <div><span className="text-slate-400 block">Model</span> <strong className="text-slate-800 dark:text-slate-200">{selectedVehicle.model}</strong></div>
                <div><span className="text-slate-400 block">Color</span> <strong className="text-slate-800 dark:text-slate-200">{selectedVehicle.color}</strong></div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Owner Information</h4>
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div><span className="text-slate-400 block">Email Address</span> <strong className="text-slate-800 dark:text-slate-200">{selectedVehicle.email}</strong></div>
                <div><span className="text-slate-400 block">Phone Number</span> <strong className="text-slate-800 dark:text-slate-200">{selectedVehicle.phone}</strong></div>
                <div><span className="text-slate-400 block">Full Name</span> <strong className="text-slate-800 dark:text-slate-200">{selectedVehicle.owner}</strong></div>
                <div><span className="text-slate-400 block">ID Number</span> <strong className="text-slate-800 dark:text-slate-200">{selectedVehicle.idNo}</strong></div>
              </div>
            </div>

            {/* DYNAMIC ACTION FOOTER */}
            <div className="flex items-center justify-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
              {selectedVehicle.status === "Pending" ? (
                <>
                  <button
                    type="button"
                    onClick={() => setModalType("rejectReason")}
                    className="flex-1 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer" 
                  >
                    Disapprove
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalType("confirmApprove")}
                    className="flex-1 h-10 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer"
                  >
                    Approve 
                  </button>
                </>
              ) : selectedVehicle.status === "Approved" ? (
                <div className="w-full flex items-center justify-between">
                  <span className="px-3 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                    Registration is Already Approved
                  </span>
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="px-6 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="w-full flex items-center justify-between">
                  <span className="px-3 py-1 rounded-md bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-200 dark:border-rose-800">
                    Registration Disapproved
                  </span>
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="px-6 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM APPROVE MODAL */}
      {modalType === "confirmApprove" && selectedVehicle && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-8 text-center shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 animate-in zoom-in-95">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-[#0053CC]">
              <Check className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">Are you sure?</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Do you really want to approve vehicle registration for <strong>{selectedVehicle.plateNo}</strong>?</p>
            </div>
            
            <div className="flex items-center justify-center gap-3 pt-2">
              <button onClick={() => setModalType("review")} className="flex-1 h-10 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer">
                Cancel
              </button>
              <button onClick={confirmApproveAction} className="flex-1 h-10 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer">
                Yes, Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT REASON MODAL */}
      {modalType === "rejectReason" && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">Reason for Disapproval</h3>
              <button onClick={() => setModalType(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500">The vehicle owner will see this reason in their portal.</p>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Reason for rejection *</label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Insufficient vehicle documentation, blurry registration, or mismatched plate number."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0053CC]"
              />
            </div>
            
            <div className="flex items-center justify-center gap-3 pt-2">
              <button onClick={() => setModalType("review")} className="flex-1 h-10 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer">
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (!rejectionReason.trim()) {
                    alert("Please provide a reason for disapproval.");
                    return;
                  }
                  setModalType("confirmReject");
                }} 
                className="flex-1 h-10 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/20 cursor-pointer"
              >
                Disapprove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM REJECT MODAL */}
      {modalType === "confirmReject" && selectedVehicle && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-8 text-center shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 animate-in zoom-in-95">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <AlertCircle className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">Are you sure?</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Do you really want to disapprove vehicle registration for <strong>{selectedVehicle.plateNo}</strong>?</p>
            </div>
            
            <div className="flex items-center justify-center gap-3 pt-2">
              <button onClick={() => setModalType("rejectReason")} className="flex-1 h-10 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer">
                Cancel
              </button>
              <button onClick={confirmRejectAction} className="flex-1 h-10 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/20 cursor-pointer">
                Yes, Disapprove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* APPROVED SUCCESS MODAL */}
      {modalType === "approvedSuccess" && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-8 text-center shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4 animate-in zoom-in-95">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <Check className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">Vehicle Registration Approved</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">The vehicle is now Approved and a QR gate pass has been issued.</p>
            </div>
            <button onClick={() => setModalType(null)} className="w-full h-11 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer">
              Close
            </button>
          </div>
        </div>
      )}

      {/* REJECTED SUCCESS MODAL */}
      {modalType === "rejectedSuccess" && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-8 text-center shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4 animate-in zoom-in-95">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <AlertCircle className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">Vehicle Registration Disapproved</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">The disapproval reason has been recorded and the owner will be notified.</p>
            </div>
            <button onClick={() => setModalType(null)} className="w-full h-11 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer">
              Close
            </button>
          </div>
        </div>
      )}

      {/* PHOTO ZOOM PREVIEW LIGHTBOX */}
      {selectedPhotoPreview && (
        <div 
          onClick={() => setSelectedPhotoPreview(null)}
          className="fixed inset-0 z-110 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedPhotoPreview(null)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={selectedPhotoPreview}
              alt="Vehicle Preview"
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}
    </AdminLayout>
  );
}