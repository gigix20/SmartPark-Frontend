import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Search, History, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import {
  getAdminAccessRecords,
  type AccessRecordItem,
  type AccessMetrics,
} from "@/api/accessApi";

export default function AccessRecords() {
  const [activeTab, setActiveTab] = useState("Entries");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [records, setRecords] = useState<AccessRecordItem[]>([]);
  const [metrics, setMetrics] = useState<AccessMetrics>({
    todayEntries: 0,
    todayExits: 0,
    currentlyInside: 0,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce search input to avoid spamming the backend
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch records whenever active tab, debounced search, or page changes
  const fetchRecords = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAdminAccessRecords({
        search: debouncedSearch,
        tab: activeTab,
        page: currentPage,
        limit: itemsPerPage,
      });

      if (data.success) {
        setRecords(data.records);
        setMetrics(data.metrics);
        setTotalPages(data.pagination.totalPages);
        setTotalRecords(data.pagination.total);
      }
    } catch (err: any) {
      console.error("Failed to load access records:", err);
      setError("Unable to load access records from the database. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, activeTab, currentPage]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const startRecord = totalRecords > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endRecord = Math.min(currentPage * itemsPerPage, totalRecords);

  return (
    <AdminLayout>
      {/* Title & View History Button Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">
            Access & Records
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Review and manage parking access logs and real-time records.
          </p>
        </div>
        <Link
          to="/admin/access-records/history"
          className="inline-flex items-center gap-2 rounded-xl bg-[#0053CC] px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors w-fit shadow-xs cursor-pointer"
        >
          <History className="h-4 w-4" />
          <span>View All History</span>
        </Link>
      </div>

      {/* Real-time Metric Cards Connected to Database */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-xs flex justify-between items-start transition-colors">
          <div>
            <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">
              Today's Entry Logs
            </p>
            <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              {metrics.todayEntries}
            </h3>
          </div>
        </div>

        <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-xs flex justify-between items-start transition-colors">
          <div>
            <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">
              Today's Exit Logs
            </p>
            <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              {metrics.todayExits}
            </h3>
          </div>
        </div>

        <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-xs flex justify-between items-start transition-colors">
          <div>
            <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">
              Currently inside
            </p>
            <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              {metrics.currentlyInside}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
        {/* Search and Tab Filters */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search owner, guard, or plate"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#0053CC]"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold w-full lg:w-auto overflow-x-auto">
            {["Entries", "Exits", "Currently Inside"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === tab
                    ? "bg-white dark:bg-slate-900 text-[#0053CC] dark:text-blue-400 shadow-xs font-bold"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
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
                <th className="px-4 py-3.5 whitespace-nowrap">Plate No.</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Owner</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Date & Time</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Guard</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Type</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-[#0053CC]" />
                      <span>Loading access records...</span>
                    </div>
                  </td>
                </tr>
              ) : records.length > 0 ? (
                records.map((item) => (
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
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {item.dateTime}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {item.guard}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          item.type.toLowerCase().includes("motor")
                            ? "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                            : "bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                          item.status === "Currently Parked"
                            ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {item.status}
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
                    No access records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination Controls */}
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
    </AdminLayout>
  );
}