import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Calendar,
  ChevronDown,
  RotateCcw,
  User,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import {
  getAdminAccessHistory,
  type AccessHistoryItem,
} from "@/api/accessApi";

export default function AccessHistory() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState("All Dates");
  const [selectedAction, setSelectedAction] = useState("All actions");
  const [selectedSource, setSelectedSource] = useState("All sources");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [isSourceOpen, setIsSourceOpen] = useState(false);

  const [history, setHistory] = useState<AccessHistoryItem[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([
    "All Dates",
    "Today",
    "Yesterday",
    "Last 7 days",
  ]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch access history from backend
  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAdminAccessHistory({
        search: debouncedSearch,
        action: selectedAction,
        source: selectedSource,
        dateRange: selectedDateRange,
        page: currentPage,
        limit: itemsPerPage,
      });

      if (data.success) {
        setHistory(data.history);
        if (data.availableDates && data.availableDates.length > 0) {
          setAvailableDates(data.availableDates);
        }
        setTotalPages(data.pagination.totalPages);
        setTotalRecords(data.pagination.total);
      }
    } catch (err: any) {
      console.error("Failed to load access history:", err);
      setError("Unable to load access history from the database. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, selectedAction, selectedSource, selectedDateRange, currentPage]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleReset = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setSelectedDateRange("All Dates");
    setSelectedAction("All actions");
    setSelectedSource("All sources");
    setCurrentPage(1);
    setIsDateOpen(false);
    setIsActionOpen(false);
    setIsSourceOpen(false);
  };

  const startRecord = totalRecords > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endRecord = Math.min(currentPage * itemsPerPage, totalRecords);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Back Button & Header */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/access-records")}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">
              Access History
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Review and manage complete gate access entry and exit history logs.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Plate number, owner, or guard"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#0053CC]"
              />
            </div>

            {/* Filter Dropdowns & Reset */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto relative">
              {/* Date Range Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsDateOpen(!isDateOpen);
                    setIsActionOpen(false);
                    setIsSourceOpen(false);
                  }}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 min-w-[150px] cursor-pointer hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{selectedDateRange}</span>
                  </div>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                      isDateOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isDateOpen && (
                  <div className="absolute left-0 mt-2 w-full min-w-44 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl py-1 z-30 max-h-60 overflow-y-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDateRange("All Dates");
                        setIsDateOpen(false);
                        setCurrentPage(1);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs italic text-[#0053CC] dark:text-blue-400 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      Clear Filter (All Dates)
                    </button>
                    {availableDates.map((range) => (
                      <button
                        key={range}
                        type="button"
                        onClick={() => {
                          setSelectedDateRange(range);
                          setIsDateOpen(false);
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs transition-colors cursor-pointer ${
                          selectedDateRange === range
                            ? "bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400 font-bold"
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsActionOpen(!isActionOpen);
                    setIsDateOpen(false);
                    setIsSourceOpen(false);
                  }}
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 min-w-32 cursor-pointer hover:border-slate-300 transition-colors"
                >
                  <span>{selectedAction}</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                      isActionOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isActionOpen && (
                  <div className="absolute left-0 mt-2 w-full min-w-36 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl py-1 z-30 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAction("All actions");
                        setIsActionOpen(false);
                        setCurrentPage(1);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs italic text-[#0053CC] dark:text-blue-400 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      Clear Filter (All)
                    </button>
                    {["Entry", "Exit"].map((action) => (
                      <button
                        key={action}
                        type="button"
                        onClick={() => {
                          setSelectedAction(action);
                          setIsActionOpen(false);
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs transition-colors cursor-pointer ${
                          selectedAction === action
                            ? "bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400 font-bold"
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Source Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsSourceOpen(!isSourceOpen);
                    setIsDateOpen(false);
                    setIsActionOpen(false);
                  }}
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 min-w-[150px] cursor-pointer hover:border-slate-300 transition-colors"
                >
                  <span>{selectedSource}</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                      isSourceOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isSourceOpen && (
                  <div className="absolute left-0 mt-2 w-full min-w-44 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl py-1 z-30 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSource("All sources");
                        setIsSourceOpen(false);
                        setCurrentPage(1);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs italic text-[#0053CC] dark:text-blue-400 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      Clear Filter (All)
                    </button>
                    {["User registration", "Gate registration"].map((source) => (
                      <button
                        key={source}
                        type="button"
                        onClick={() => {
                          setSelectedSource(source);
                          setIsSourceOpen(false);
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs transition-colors cursor-pointer ${
                          selectedSource === source
                            ? "bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400 font-bold"
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        {source}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Reset Button */}
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-[#0053CC] dark:hover:text-blue-400 px-2 py-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs rounded-xl border border-red-200 dark:border-red-900">
              {error}
            </div>
          )}

          {/* Spacious Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[950px]">
              <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3.5 whitespace-nowrap">Plate</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Owner or Driver</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Action</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Date and Time</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Guard</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Registration Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-[#0053CC]" />
                        <span>Loading access history...</span>
                      </div>
                    </td>
                  </tr>
                ) : history.length > 0 ? (
                  history.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <p className="font-bold text-slate-900 dark:text-white">
                          {item.plateNo}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {item.vehicleDesc}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                        {item.owner}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold ${
                            item.action === "Entry"
                              ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                              : "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              item.action === "Entry" ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                          ></span>
                          {item.action}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {item.dateTime}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {item.guard}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold ${
                            item.source === "User registration"
                              ? "bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                              : "bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800"
                          }`}
                        >
                          <User className="h-3 w-3" />
                          {item.source}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-slate-400 italic"
                    >
                      No access history records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 gap-4">
            <span>
              Showing {startRecord} to {endRecord} of {totalRecords} records
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || isLoading}
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
                disabled={currentPage === totalPages || totalPages === 0 || isLoading}
                className="px-3 py-1 rounded-lg font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}