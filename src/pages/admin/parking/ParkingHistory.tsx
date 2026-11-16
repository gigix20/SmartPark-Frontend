import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Calendar, ChevronDown, RotateCcw, ArrowLeft, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import CarIcon from "@/assets/car-icon.svg";
import MotorIcon from "@/assets/motor-icon.svg";
import { getParkingHistory, type ParkingHistoryItem } from "@/api/parkingApi";

export default function ParkingHistory() {
  const navigate = useNavigate();

  const [historyData, setHistoryData] = useState<ParkingHistoryItem[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>(["All Dates"]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters & Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedDate, setSelectedDate] = useState<string>("All Dates");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  // Dropdown UI states
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const res = await getParkingHistory({
        search: searchQuery,
        type: selectedType,
        date: selectedDate,
        status: selectedStatus,
        page: currentPage,
        limit: 10,
      });

      if (res.success) {
        setHistoryData(res.history || []);
        if (res.availableDates) {
          setAvailableDates(res.availableDates);
        }
        if (res.pagination) {
          setTotalRecords(res.pagination.total);
          setTotalPages(res.pagination.totalPages);
        }
      }
    } catch (err) {
      console.error("Failed to fetch parking history:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [searchQuery, selectedType, selectedDate, selectedStatus, currentPage]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedType("All");
    setSelectedDate("All Dates");
    setSelectedStatus("All");
    setCurrentPage(1);
  };

  const limit = 10;
  const startRecord = totalRecords > 0 ? (currentPage - 1) * limit + 1 : 0;
  const endRecord = Math.min(currentPage * limit, totalRecords);

  return (
    <AdminLayout>
      {/* Back Button & Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/admin/parking")}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">Parking History</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Historical parking records of campus access.</p>
        </div>
      </div>

      <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
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
              placeholder="Search plates, vehicles, guard..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#0053CC]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Date Filter Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsDateDropdownOpen(!isDateDropdownOpen);
                  setIsTypeDropdownOpen(false);
                  setIsStatusDropdownOpen(false);
                }}
                className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 cursor-pointer shadow-xs"
              >
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>{selectedDate}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-1" />
              </button>

              {isDateDropdownOpen && (
                <div className="absolute right-0 mt-1 w-44 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-1.5 shadow-xl z-20 max-h-48 overflow-y-auto">
                  {availableDates.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        setSelectedDate(d);
                        setIsDateDropdownOpen(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs transition-colors cursor-pointer ${
                        selectedDate === d
                          ? "bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400 font-bold"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Vehicle Type Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsTypeDropdownOpen(!isTypeDropdownOpen);
                  setIsDateDropdownOpen(false);
                  setIsStatusDropdownOpen(false);
                }}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 min-w-32 cursor-pointer shadow-xs"
              >
                <span>{selectedType === "All" ? "All Types" : selectedType}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {isTypeDropdownOpen && (
                <div className="absolute right-0 mt-1 w-36 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-1.5 shadow-xl z-20">
                  {["All", "Car", "Motorcycle"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setSelectedType(t);
                        setIsTypeDropdownOpen(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs transition-colors cursor-pointer ${
                        selectedType === t
                          ? "bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400 font-bold"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      {t === "All" ? "All Types" : t}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Status Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsStatusDropdownOpen(!isStatusDropdownOpen);
                  setIsDateDropdownOpen(false);
                  setIsTypeDropdownOpen(false);
                }}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 min-w-28 cursor-pointer shadow-xs"
              >
                <span>{selectedStatus === "All" ? "All Status" : selectedStatus}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {isStatusDropdownOpen && (
                <div className="absolute right-0 mt-1 w-40 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-1.5 shadow-xl z-20">
                  {["All", "Complete", "Currently Parked"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setSelectedStatus(s);
                        setIsStatusDropdownOpen(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs transition-colors cursor-pointer ${
                        selectedStatus === s
                          ? "bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400 font-bold"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      {s === "All" ? "All Status" : s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Reset Button */}
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-[#0053CC] dark:hover:text-blue-400 px-2 py-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="h-7 w-7 text-[#0053CC] animate-spin" />
              <p className="text-xs text-slate-400">Loading parking records...</p>
            </div>
          ) : historyData.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No parking history records found matching your filters.
            </div>
          ) : (
            <table className="w-full text-left text-xs min-w-175">
              <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Vehicle Name</th>
                  <th className="pb-3">Plate Number</th>
                  <th className="pb-3">Entry Time</th>
                  <th className="pb-3">Exit Time</th>
                  <th className="pb-3">Duration</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Guard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {historyData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 text-slate-600 dark:text-slate-400">{item.date}</td>
                    <td className="py-3 font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <img
                        src={item.type === "Motorcycle" ? MotorIcon : CarIcon}
                        alt="Vehicle Icon"
                        className="h-3.5 w-3.5 object-contain shrink-0"
                      />
                      <span>{item.vehicleName}</span>
                    </td>
                    <td className="py-3 font-bold text-slate-900 dark:text-white">{item.plateNo}</td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">{item.entryTime}</td>
                    <td className="py-3 text-slate-500 dark:text-slate-400">{item.exitTime}</td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">{item.duration}</td>
                    <td className="py-3">
                      <span
                        className={`font-semibold ${
                          item.status === "Complete"
                            ? "text-slate-700 dark:text-slate-300"
                            : "text-amber-600 dark:text-amber-400 font-bold"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500 dark:text-slate-400 text-[11px]">{item.guardName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Section */}
        {!isLoading && totalRecords > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 gap-4">
            <span>
              Showing {startRecord} to {endRecord} of {totalRecords} records
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 rounded-lg font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 rounded-lg font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}