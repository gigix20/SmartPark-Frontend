import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit3, Car, Ban, AlertTriangle, Search, Calendar, ChevronDown, RotateCcw } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";

export default function VehicleDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // States para sa management at modals
  const [isManaging, setIsManaging] = useState(false);
  const [vehicleStatus, setVehicleStatus] = useState<"Active" | "Inactive">("Active");
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  
  // States para sa Table Functionality (Search, Time Filter, Calendar Date Filter, Pagination)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("All");
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  
  // Calendar Filter States
  const [selectedDate, setSelectedDate] = useState("Sept 30, 2025");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Mock vehicle data
  const [vehicle, setVehicle] = useState({
    id: id || "1",
    plateNo: "ABC 1234",
    brandModel: "Toyota Vios (2020) • White",
    vehicleType: "Car (Sedan)",
    brand: "Toyota",
    model: "Vios",
    color: "White",
    yearRegistered: "2026",
    status: "Active",
    registrationStatus: "Registered",
    registrationSource: "Online",
    registrationDate: "September 20, 2026",
    qrStatus: "Active",
    owner: {
      fullName: "Sophia Reyes",
      studentId: "24-0123",
      email: "sophiareyes@gmail.com",
      phoneNumber: "+63 912 345 6789",
    },
  });

  // Mock vehicle history data
  const historyData = [
    { id: 1, date: "Sept 30, 2025", entryTime: "05:30 PM", exitTime: "12:00 PM", duration: "6h 15m", status: "Complete", registeredBy: "Guard Santos" },
    { id: 2, date: "Sept 30, 2025", entryTime: "08:02 AM", exitTime: "--", duration: "--", status: "Currently Parked", registeredBy: "Guard Santos" },
    { id: 3, date: "Sept 30, 2025", entryTime: "05:30 PM", exitTime: "12:00 PM", duration: "6h 18m", status: "Complete", registeredBy: "Guard Santos" },
    { id: 4, date: "Sept 29, 2025", entryTime: "01:15 PM", exitTime: "04:30 PM", duration: "3h 15m", status: "Complete", registeredBy: "Guard Reyes" },
    { id: 5, date: "Sept 28, 2025", entryTime: "09:00 AM", exitTime: "05:00 PM", duration: "8h 00m", status: "Complete", registeredBy: "Guard Santos" },
  ];

  const timeOptions = ["All", "Morning (AM)", "Afternoon / Evening (PM)"];
  const dateOptions = ["All Dates", "Sept 30, 2025", "Sept 29, 2025", "Sept 28, 2025"];

  // Filter logic para sa search query, time filter, at calendar date
  const filteredHistory = historyData.filter((item) => {
    const matchesSearch = 
      item.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.registeredBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.entryTime.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedDate !== "All Dates" && item.date !== selectedDate) {
      return false;
    }

    if (selectedTimeFilter === "Morning (AM)" && !item.entryTime.includes("AM")) return false;
    if (selectedTimeFilter === "Afternoon / Evening (PM)" && !item.entryTime.includes("PM")) return false;

    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHistoryItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedTimeFilter("All");
    setSelectedDate("All Dates");
    setCurrentPage(1);
  };

  const handleSaveStatus = () => {
    setIsManaging(false);
  };

  const handleConfirmDeactivate = () => {
    setVehicleStatus("Inactive");
    setVehicle({ ...vehicle, status: "Inactive" });
    setShowDeactivateModal(false);
    setIsManaging(false);
  };

  return (
    <AdminLayout>
      {/* Back Button */}
      <div className="mb-2">
        <button
          type="button"
          onClick={() => navigate("/admin/vehicles")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#0053CC] dark:hover:text-blue-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Vehicle Management</span>
        </button>
      </div>

      {/* Header */}
      <div>
        <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">
          Vehicle Details
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          View comprehensive vehicle and owner profile details.
        </p>
      </div>

      {/* Main Details Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-6 transition-colors">
        
        {/* Vehicle Banner & Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-20 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 shrink-0">
              <Car className="h-9 w-9" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="font-poppins text-2xl font-extrabold text-slate-900 dark:text-white">
                  {vehicle.plateNo}
                </h2>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  vehicleStatus === "Active" 
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800" 
                    : "bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800"
                }`}>
                  {vehicleStatus}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {vehicle.brandModel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isManaging && (
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
              <span>{isManaging ? "Close Manager" : "Manage Vehicle"}</span>
            </button>
          </div>
        </div>

        {/* Manage Vehicle Status Card Panel */}
        {isManaging && (
          <div className="rounded-2xl border-2 border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 p-5 space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="font-poppins text-sm font-bold text-slate-900 dark:text-white">
                Manage Vehicle Status
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Current status: <span className="font-semibold text-slate-700 dark:text-slate-300">{vehicleStatus}</span>. Vehicle can use gate access.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                vehicleStatus === "Active" 
                  ? "border-[#0053CC] bg-white dark:bg-slate-900 shadow-xs" 
                  : "border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40"
              }`}>
                <input 
                  type="radio" 
                  name="status" 
                  checked={vehicleStatus === "Active"} 
                  onChange={() => setVehicleStatus("Active")}
                  className="mt-0.5 accent-[#0053CC]" 
                />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Active</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Granted immediate entry and exit clearance.</p>
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
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Temporary suspension of automatic access.</p>
                </div>
              </label>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleSaveStatus}
                className="rounded-xl bg-[#0053CC] hover:bg-blue-700 px-5 py-2 text-xs font-bold text-white transition-colors cursor-pointer shadow-xs"
              >
                Save
              </button>
            </div>
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
              <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{vehicle.vehicleType}</p>
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
              <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{vehicle.yearRegistered}</p>
            </div>

            <div>
              <p className="text-slate-400 font-medium mb-0.5">Vehicle Status</p>
              <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                vehicleStatus === "Active" 
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800" 
                  : "bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800"
              }`}>
                {vehicleStatus}
              </span>
            </div>

            <div>
              <p className="text-slate-400 font-medium mb-0.5">Registration Status</p>
              <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                {vehicle.registrationStatus}
              </span>
            </div>

            <div>
              <p className="text-slate-400 font-medium mb-0.5">Registration Source</p>
              <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {vehicle.registrationSource}
              </span>
            </div>

            <div>
              <p className="text-slate-400 font-medium">Registration Date</p>
              <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{vehicle.registrationDate}</p>
            </div>

            <div>
              <p className="text-slate-400 font-medium mb-0.5">QR Status</p>
              <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                {vehicle.qrStatus}
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
              <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{vehicle.owner.fullName}</p>
            </div>

            <div>
              <p className="text-slate-400 font-medium">Student ID</p>
              <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{vehicle.owner.studentId}</p>
            </div>

            <div>
              <p className="text-slate-400 font-medium">Email Address</p>
              <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{vehicle.owner.email}</p>
            </div>

            <div>
              <p className="text-slate-400 font-medium">Phone Number</p>
              <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{vehicle.owner.phoneNumber}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Vehicle History Section */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs space-y-4 transition-colors mt-6">
        <div>
          <h3 className="font-poppins text-lg font-bold text-[#0053CC] dark:text-blue-400">
            Vehicle History
          </h3>
        </div>

        {/* Functional Search & Filters */}
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
            
            {/* Functional Calendar Date Dropdown Filter */}
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

            {/* Time Dropdown Filter */}
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
              {currentHistoryItems.length > 0 ? (
                currentHistoryItems.map((item) => (
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
                    No history records found matching your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Functional Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 gap-4">
          <span>Showing {filteredHistory.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredHistory.length)} of {filteredHistory.length} records</span>
          <div className="flex items-center gap-1">
            <button 
              type="button" 
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
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
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 rounded-lg font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Deactivate Confirmation Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center space-y-4 border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-100 dark:border-rose-900 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="h-7 w-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">Deactivate Vehicle?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-2">
                Are you sure you want to deactivate vehicle <span className="font-bold text-slate-800 dark:text-slate-200">{vehicle.plateNo}</span>? The vehicle will no longer have gate access.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleConfirmDeactivate}
                className="w-full rounded-xl bg-rose-600 hover:bg-rose-700 py-3 text-xs font-bold text-white transition-colors shadow-md shadow-rose-500/20 cursor-pointer"
              >
                Deactivate
              </button>
              <button
                type="button"
                onClick={() => setShowDeactivateModal(false)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}