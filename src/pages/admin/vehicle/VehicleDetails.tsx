import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Edit3, 
  Ban, 
  AlertTriangle, 
  Search, 
  Calendar, 
  ChevronDown, 
  RotateCcw, 
  Check, 
  X, 
  Clock,
  Loader2 
} from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import CarIcon from "@/assets/car-icon.svg";
import MotorIcon from "@/assets/motor-icon.svg";
import { 
  getAdminVehicleById, 
  updateAdminVehicleStatus, 
  approveVehicle, 
  rejectVehicle,
  getVehicleParkingHistory 
} from "@/api/vehicleApi";

export default function VehicleDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [vehicle, setVehicle] = useState<any>(null);
  const [isManaging, setIsManaging] = useState(false);
  const [vehicleStatus, setVehicleStatus] = useState<string>("Active");
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modals for approval and rejection
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState<string | null>(null);

  const fetchVehicle = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const res = await getAdminVehicleById(id);
      if (res.success && res.vehicle) {
        setVehicle(res.vehicle);
        setVehicleStatus(res.vehicle.status || "Active");
      }
    } catch (err: any) {
      console.error("Failed to load vehicle details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  // Prevent background scrolling when modals are open
  useEffect(() => {
    if (showDeactivateModal || showApproveModal || showRejectModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showDeactivateModal, showApproveModal, showRejectModal]);

  // History Table Functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("All");
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("All Dates");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [historyList, setHistoryList] = useState<any[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);
  const [historyTotalRecords, setHistoryTotalRecords] = useState(0);
  const [dateOptions, setDateOptions] = useState<string[]>(["All Dates"]);

  const timeOptions = ["All", "Morning (AM)", "Afternoon / Evening (PM)"];

  const fetchParkingHistory = async () => {
    if (!id || vehicle?.status === "Pending") return;
    try {
      setIsHistoryLoading(true);
      const res = await getVehicleParkingHistory(id, {
        search: searchQuery,
        date: selectedDate,
        timeFilter: selectedTimeFilter,
        page: currentPage,
        limit: itemsPerPage,
      });
      if (res.success) {
        setHistoryList(res.history || []);
        if (res.availableDates && res.availableDates.length > 0) {
          setDateOptions(res.availableDates);
        }
        if (res.pagination) {
          setHistoryTotalPages(res.pagination.totalPages || 1);
          setHistoryTotalRecords(res.pagination.total || 0);
        }
      }
    } catch (err: any) {
      console.error("Failed to load vehicle parking history:", err);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (vehicle && vehicle.status !== "Pending") {
      fetchParkingHistory();
    }
  }, [id, vehicle?.status, searchQuery, selectedDate, selectedTimeFilter, currentPage]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedTimeFilter("All");
    setSelectedDate("All Dates");
    setCurrentPage(1);
  };

  const handleSaveStatus = async () => {
    if (!vehicle) return;
    try {
      setIsSubmitting(true);
      await updateAdminVehicleStatus(vehicle.id, vehicleStatus);
      await fetchVehicle();
      setIsManaging(false);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update vehicle status.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDeactivate = async () => {
    if (!vehicle) return;
    try {
      setIsSubmitting(true);
      await updateAdminVehicleStatus(vehicle.id, "Inactive");
      await fetchVehicle();
      setShowDeactivateModal(false);
      setIsManaging(false);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to deactivate vehicle.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async () => {
    if (!vehicle) return;
    try {
      setIsSubmitting(true);
      await approveVehicle(vehicle.id);
      await fetchVehicle();
      setShowApproveModal(false);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to approve vehicle.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!vehicle) return;
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for disapproval.");
      return;
    }
    try {
      setIsSubmitting(true);
      await rejectVehicle(vehicle.id, rejectionReason.trim());
      await fetchVehicle();
      setShowRejectModal(false);
      setRejectionReason("");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to disapprove vehicle.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "Approved":
      case "Active":
        return "bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800";
      case "Pending":
        return "bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800";
      case "Rejected":
        return "bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800";
      case "Inactive":
        return "bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
    }
  };

  return (
    <AdminLayout>
      {/* Back Button & Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/admin/vehicles")}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">
            Vehicle Details
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            View comprehensive vehicle and owner profile details.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-24 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#0053CC] dark:text-blue-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500 dark:text-slate-400">Loading vehicle details...</p>
        </div>
      ) : !vehicle ? (
        <div className="py-24 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Vehicle not found or has been removed.</p>
          <button 
            type="button"
            onClick={() => navigate("/admin/vehicles")} 
            className="px-4 py-2 bg-[#0053CC] hover:bg-[#0042A5] text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Back to Vehicle Management
          </button>
        </div>
      ) : (
        <>
          {/* PENDING REVIEW CARD NOTIFICATION */}
          {vehicle.status === "Pending" && (
            <div className="rounded-3xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-800/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 shrink-0">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-poppins text-sm font-bold text-amber-900 dark:text-amber-200">
                    FOR REVIEW: Pending Registration
                  </h3>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5 leading-relaxed">
                    This vehicle is awaiting administrator review. Verify the vehicle and owner information below to grant campus gate access.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(true)}
                  className="px-4 py-2.5 rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-amber-100/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Disapprove
                </button>
                <button
                  type="button"
                  onClick={() => setShowApproveModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#0053CC] hover:bg-blue-700 text-xs font-bold text-white shadow-sm transition-colors cursor-pointer"
                >
                  Approve Vehicle
                </button>
              </div>
            </div>
          )}

          {/* Main Details Card */}
          <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6 transition-colors mt-6">
            
            {/* Vehicle Banner & Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div 
                  onClick={() => vehicle.photo && setSelectedPhotoPreview(vehicle.photo)}
                  title={vehicle.photo ? "Click to zoom in" : ""}
                  className={`flex h-20 w-28 sm:h-24 sm:w-36 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-[#0053CC] dark:text-blue-400 border border-slate-200 dark:border-slate-700 shrink-0 overflow-hidden shadow-xs ${vehicle.photo ? "cursor-zoom-in hover:opacity-90 transition-opacity" : ""}`}
                >
                  {vehicle.photo ? (
                    <img 
                      src={vehicle.photo} 
                      alt={vehicle.plateNo || vehicle.plateNumber} 
                      className="h-full w-full object-cover" 
                    />
                  ) : (
                    <img 
                      src={vehicle.type === "Motorcycle" ? MotorIcon : CarIcon} 
                      alt="Vehicle Icon" 
                      className="h-10 w-10 object-contain p-2" 
                    />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="font-poppins text-2xl font-extrabold text-slate-900 dark:text-white">
                      {vehicle.plateNo || vehicle.plateNumber}
                    </h2>
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${getStatusBadgeStyle(vehicle.status)}`}>
                      {vehicle.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {vehicle.brandModel || `${vehicle.brand} ${vehicle.model} (${vehicle.year}) • ${vehicle.color}`}
                  </p>
                </div>
              </div>

              {/* Action Buttons based on status */}
              <div className="flex items-center gap-2.5 flex-wrap">
                {vehicle.status === "Pending" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowRejectModal(true)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 px-4 py-2.5 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Disapprove
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowApproveModal(true)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0053CC] hover:bg-blue-700 px-5 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer shadow-xs"
                    >
                      Approve Vehicle
                    </button>
                  </>
                ) : (
                  <>
                    {isManaging && vehicle.status !== "Inactive" && (
                      <button
                        type="button"
                        onClick={() => setShowDeactivateModal(true)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer shadow-xs"
                      >
                        <Ban className="h-4 w-4" />
                        <span>Deactivate</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setIsManaging(!isManaging)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0053CC] hover:bg-blue-700 px-4 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer shadow-xs"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>{isManaging ? "Close Manager" : "Manage Status"}</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Manage Vehicle Status Panel */}
            {isManaging && (
              <div className="rounded-2xl border-2 border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 p-5 space-y-4 animate-in fade-in duration-200">
                <div>
                  <h3 className="font-poppins text-sm font-bold text-slate-900 dark:text-white">
                    Manage Vehicle Status
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Current status: <span className="font-semibold text-slate-700 dark:text-slate-300">{vehicle.status}</span>.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    vehicleStatus === "Active" || vehicleStatus === "Approved" 
                      ? "border-[#0053CC] bg-white dark:bg-slate-900 shadow-xs" 
                      : "border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40"
                  }`}>
                    <input 
                      type="radio" 
                      name="status" 
                      checked={vehicleStatus === "Active" || vehicleStatus === "Approved"} 
                      onChange={() => setVehicleStatus("Active")}
                      className="mt-0.5 accent-[#0053CC]" 
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Active / Approved</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Granted immediate campus gate entry and exit clearance.</p>
                    </div>
                  </label>

                  <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    vehicleStatus === "Inactive" 
                      ? "border-[#0053CC] bg-white dark:bg-slate-900 shadow-xs" 
                      : "border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40"
                  }`}>
                    <input 
                      type="radio" 
                      name="status" 
                      checked={vehicleStatus === "Inactive"} 
                      onChange={() => setVehicleStatus("Inactive")}
                      className="mt-0.5 accent-[#0053CC]" 
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Inactive</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Suspends gate access clearance for this vehicle.</p>
                    </div>
                  </label>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSaveStatus}
                    className="rounded-xl bg-[#0053CC] hover:bg-blue-700 px-5 py-2 text-xs font-bold text-white transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    {isSubmitting ? "Saving..." : "Save Status"}
                  </button>
                </div>
              </div>
            )}

            {/* Rejection Warning Card if rejected */}
            {vehicle.status === "Rejected" && vehicle.rejectionReason && (
              <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 p-4 text-xs text-rose-700 dark:text-rose-300 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Dahilan ng Disapproval</span>
                </div>
                <p className="pl-5.5">{vehicle.rejectionReason}</p>
              </div>
            )}

            {/* Section 1: Vehicle Information */}
            <div className="space-y-4">
              <h3 className="font-poppins text-sm font-bold text-[#0053CC] dark:text-blue-400">
                Vehicle Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-xs">
                <div>
                  <p className="text-slate-400 font-medium">Vehicle Type</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{vehicle.type}</p>
                </div>

                <div>
                  <p className="text-slate-400 font-medium">Brand</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{vehicle.brand}</p>
                </div>

                <div>
                  <p className="text-slate-400 font-medium">Model</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{vehicle.model}</p>
                </div>

                <div>
                  <p className="text-slate-400 font-medium">Color</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{vehicle.color}</p>
                </div>

                <div>
                  <p className="text-slate-400 font-medium">Year Registered</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{vehicle.year}</p>
                </div>

                <div>
                  <p className="text-slate-400 font-medium mb-0.5">Vehicle Status</p>
                  <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold ${getStatusBadgeStyle(vehicle.status)}`}>
                    {vehicle.status}
                  </span>
                </div>

                <div>
                  <p className="text-slate-400 font-medium mb-0.5">Registration Source</p>
                  <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {vehicle.registrationSource || "Online"}
                  </span>
                </div>

                <div>
                  <p className="text-slate-400 font-medium">Registration Date</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{vehicle.registrationDate || vehicle.createdAt?.split("T")[0]}</p>
                </div>

                <div>
                  <p className="text-slate-400 font-medium mb-0.5">QR Gate Pass Status</p>
                  <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold ${vehicle.status === "Approved" ? "bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800" : "bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"}`}>
                    {vehicle.status === "Approved" ? "Active" : "Inactive / No Pass"}
                  </span>
                </div>
              </div>
            </div>

            <hr className="border-slate-100 dark:border-slate-800" />

            {/* Section 2: Owner Information */}
            <div className="space-y-4">
              <h3 className="font-poppins text-sm font-bold text-[#0053CC] dark:text-blue-400">
                Owner Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-xs">
                <div>
                  <p className="text-slate-400 font-medium">Full Name</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{vehicle.owner?.fullName || "--"}</p>
                </div>

                <div>
                  <p className="text-slate-400 font-medium">Student / School ID</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{vehicle.owner?.studentId || "--"}</p>
                </div>

                <div>
                  <p className="text-slate-400 font-medium">Email Address</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{vehicle.owner?.email || "--"}</p>
                </div>

                <div>
                  <p className="text-slate-400 font-medium">Phone Number</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{vehicle.owner?.phoneNumber || "--"}</p>
                </div>
              </div>
            </div>

          </div>

          {/* Vehicle History Section */}
          <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6 transition-colors mt-6">
            <div>
              <h3 className="font-poppins text-lg font-bold text-[#0053CC] dark:text-blue-400">
                Vehicle Parking History
              </h3>
            </div>

            {/* If vehicle is Pending, do not show empty table, show clear explanation */}
            {vehicle.status === "Pending" ? (
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 p-8 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
                <Clock className="h-8 w-8 text-amber-500 mx-auto mb-1 animate-pulse" />
                <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  No Parking Records Available
                </p>
                <p className="max-w-md mx-auto leading-relaxed">
                  Ang sasakyang ito ay kasalukuyang <strong>Pending Approval</strong>. Magkakaroon lamang ng parking records kapag naaprubahan na ng administrator ang rehistrasyon at ginamit na sa campus gate.
                </p>
              </div>
            ) : (
              <>
                {/* Search & Filters */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                  <div className="relative w-full lg:w-72">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Search date, guard, status..." 
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#0053CC]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                        className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 cursor-pointer"
                      >
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>{selectedDate}</span>
                        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                      </button>

                      {isCalendarOpen && (
                        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg py-1 z-20 text-xs">
                          {dateOptions.map((date) => (
                            <button
                              key={date}
                              type="button"
                              onClick={() => {
                                setSelectedDate(date);
                                setIsCalendarOpen(false);
                                setCurrentPage(1);
                              }}
                              className={`w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer ${
                                selectedDate === date ? "font-bold text-[#0053CC] dark:text-blue-400" : "text-slate-700 dark:text-slate-300"
                              }`}
                            >
                              {date}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                        className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 min-w-35 cursor-pointer"
                      >
                        <span>{selectedTimeFilter}</span>
                        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                      </button>

                      {isTimeDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg py-1 z-20 text-xs">
                          {timeOptions.map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => {
                                setSelectedTimeFilter(option);
                                setIsTimeDropdownOpen(false);
                                setCurrentPage(1);
                              }}
                              className={`w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer ${
                                selectedTimeFilter === option ? "font-bold text-[#0053CC] dark:text-blue-400" : "text-slate-700 dark:text-slate-300"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <button 
                      type="button" 
                      onClick={handleResetFilters}
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-[#0053CC] px-2 py-1 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>

                {/* History Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-162.5">
                    <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold uppercase text-[10px]">
                      <tr>
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Entry Time</th>
                        <th className="pb-3">Exit Time</th>
                        <th className="pb-3">Duration</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Registered By</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {isHistoryLoading ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <Loader2 className="h-6 w-6 animate-spin text-[#0053CC]" />
                              <span>Loading parking history logs...</span>
                            </div>
                          </td>
                        </tr>
                      ) : historyList.length > 0 ? (
                        historyList.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="py-3 font-semibold text-slate-900 dark:text-white">{item.date}</td>
                            <td className="py-3 text-slate-600 dark:text-slate-400">{item.entryTime}</td>
                            <td className="py-3 text-slate-600 dark:text-slate-400">{item.exitTime}</td>
                            <td className="py-3 text-slate-600 dark:text-slate-400">{item.duration}</td>
                            <td className="py-3">
                              <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                                item.status === "Complete" 
                                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800" 
                                  : "bg-blue-50 text-[#0053CC] border border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800"
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="py-3 font-medium text-slate-700 dark:text-slate-300">{item.registeredBy}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400 text-xs italic">
                            No parking history records found for this vehicle.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 gap-4">
                  <span>Showing {historyTotalRecords > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, historyTotalRecords)} of {historyTotalRecords} records</span>
                  <div className="flex items-center gap-1">
                    <button 
                      type="button" 
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded-lg font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {Array.from({ length: historyTotalPages }, (_, i) => i + 1).map((number) => (
                      <button
                        key={number}
                        type="button"
                        onClick={() => setCurrentPage(number)}
                        className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                          currentPage === number
                            ? "bg-[#0053CC] text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        {number}
                      </button>
                    ))}
                    <button 
                      type="button" 
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, historyTotalPages))}
                      disabled={currentPage === historyTotalPages || historyTotalPages === 0}
                      className="px-3 py-1 rounded-lg font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* Deactivate Confirmation Modal */}
      {showDeactivateModal && vehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-[24px] bg-white dark:bg-slate-900 p-6 shadow-xl border border-slate-100 dark:border-slate-800 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">
                Deactivate Vehicle?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Vehicle <strong className="text-slate-800 dark:text-slate-200">{vehicle.plateNo || vehicle.plateNumber}</strong> will no longer be allowed entry and campus access clearance will be revoked.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeactivateModal(false)}
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmDeactivate}
                className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-700 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? "Deactivating..." : "Yes, Deactivate"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Confirmation Modal */}
      {showApproveModal && vehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-[24px] bg-white dark:bg-slate-900 p-6 shadow-xl border border-slate-100 dark:border-slate-800 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-[#0053CC]">
              <Check className="h-7 w-7" />
            </div>

            <div className="space-y-1">
              <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">
                Approve Vehicle Registration?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Do you want to grant campus parking access to <strong className="text-slate-800 dark:text-slate-200">{vehicle.plateNo || vehicle.plateNumber}</strong>?
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowApproveModal(false)}
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleApprove}
                className="flex-1 rounded-xl bg-[#0053CC] hover:bg-blue-700 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? "Approving..." : "Yes, Approve"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disapprove Modal */}
      {showRejectModal && vehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-[24px] bg-white dark:bg-slate-900 p-6 shadow-xl border border-slate-100 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">
                Reason for Disapproval
              </h3>
              <button onClick={() => setShowRejectModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <p className="text-xs text-slate-500">The vehicle owner will see this disapproval reason in their portal.</p>
            
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

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleReject}
                className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-700 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? "Disapproving..." : "Disapprove"}
              </button>
            </div>
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