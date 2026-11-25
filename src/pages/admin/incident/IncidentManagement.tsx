import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Loader2, RefreshCw, Printer } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { getAdminIncidents, type IncidentItem, type IncidentMetrics } from "@/api/incidentApi";

export default function IncidentManagement() {
  const navigate = useNavigate();

  const [incidents, setIncidents] = useState<IncidentItem[]>([]);
  const [metrics, setMetrics] = useState<IncidentMetrics>({
    waitingForReview: 0,
    reviewedThisWeek: 0,
    reviewedToday: 0,
    totalIncidents: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Filters & Pagination
  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  // State para sa View Modal
  const [selectedIncident, setSelectedIncident] = useState<IncidentItem | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // I-lock ang background scroll kapag bukas ang View Modal
  useEffect(() => {
    if (isViewModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isViewModalOpen]);

  const fetchIncidents = async (showRefreshSpinner = false) => {
    try {
      if (showRefreshSpinner) setIsRefreshing(true);
      else setIsLoading(true);

      const res = await getAdminIncidents({
        search: searchQuery,
        status: activeTab,
        page: currentPage,
        limit: 10,
      });

      if (res.success) {
        setIncidents(res.incidents || []);
        if (res.metrics) {
          setMetrics(res.metrics);
        }
        if (res.pagination) {
          setTotalRecords(res.pagination.total);
          setTotalPages(res.pagination.totalPages);
        }
      }
    } catch (err) {
      console.error("Failed to fetch admin incidents:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [activeTab, searchQuery, currentPage]);

  const handleActionClick = (item: IncidentItem) => {
    if (item.action === "Review" || item.status === "Pending" || item.status === "Unidentified") {
      navigate(`/admin/incidents/review/${item.id}`);
    } else {
      setSelectedIncident(item);
      setIsViewModalOpen(true);
    }
  };

  const limit = 10;
  const startRecord = totalRecords > 0 ? (currentPage - 1) * limit + 1 : 0;
  const endRecord = Math.min(currentPage * limit, totalRecords);

  return (
    <AdminLayout>
      <div className="space-y-6 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">Incident Management</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Review and manage parking incident reports submitted by campus users.
            </p>
          </div>
          <button
            onClick={() => fetchIncidents(true)}
            disabled={isRefreshing || isLoading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer self-start sm:self-auto disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-[#0053CC]" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* METRICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-xs flex justify-between items-start transition-colors">
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Waiting for review</p>
              <h3 className="font-poppins text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">
                {metrics.waitingForReview}
              </h3>
              <p className="text-[10px] font-medium text-slate-400 mt-1">
                {metrics.waitingForReview === 1 ? "1 report pending" : `${metrics.waitingForReview} reports pending`}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-xs flex justify-between items-start transition-colors">
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Reviewed this week</p>
              <h3 className="font-poppins text-3xl font-extrabold text-[#0053CC] dark:text-blue-400 mt-2">
                {metrics.reviewedThisWeek}
              </h3>
              <p className="text-[10px] font-medium text-slate-400 mt-1">
                {metrics.reviewedToday} today
              </p>
            </div>
          </div>

          <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-xs flex justify-between items-start transition-colors">
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Total Incidents</p>
              <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
                {metrics.totalIncidents}
              </h3>
              <p className="text-[10px] font-medium text-slate-400 mt-1">
                {metrics.totalIncidents === 1 ? "1 total report" : `${metrics.totalIncidents} total reports`}
              </p>
            </div>
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
                placeholder="Search reference or plate"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#0053CC]"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold w-full lg:w-auto overflow-x-auto">
              {["All", "Pending", "Reviewed", "Rejected", "Unidentified"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
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

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="h-7 w-7 text-[#0053CC] animate-spin" />
                <p className="text-xs text-slate-400">Loading incident records...</p>
              </div>
            ) : incidents.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs italic">
                No incident records found.
              </div>
            ) : (
              <table className="w-full text-left text-xs min-w-full">
                <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="px-2.5 py-3 whitespace-nowrap">Reference</th>
                    <th className="px-2.5 py-3 whitespace-nowrap">Reporter</th>
                    <th className="px-2.5 py-3 whitespace-nowrap">Vehicle</th>
                    <th className="px-2.5 py-3 whitespace-nowrap">Plate No.</th>
                    <th className="px-2.5 py-3 whitespace-nowrap">Report Type</th>
                    <th className="px-2.5 py-3 whitespace-nowrap">Status</th>
                    <th className="px-2.5 py-3">Description</th>
                    <th className="px-2.5 py-3 whitespace-nowrap">Submitted</th>
                    <th className="px-2.5 py-3 whitespace-nowrap text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {incidents.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-2.5 py-3 font-semibold text-[#0053CC] dark:text-blue-400 whitespace-nowrap text-xs">
                        {item.ref}
                      </td>
                      <td className="px-2.5 py-3 text-slate-800 dark:text-slate-200 font-medium max-w-[110px] truncate" title={item.reporter}>
                        {item.reporter}
                      </td>
                      <td className="px-2.5 py-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.type?.toLowerCase().includes("motor")
                            ? "bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                            : "bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-2.5 py-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {item.plate}
                      </td>
                      <td className="px-2.5 py-3 text-slate-700 dark:text-slate-300 whitespace-nowrap font-medium max-w-[120px] truncate" title={item.reportType}>
                        {item.reportType}
                      </td>
                      <td className="px-2.5 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === "Pending"
                              ? "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                              : item.status === "Rejected"
                              ? "bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800"
                              : item.status === "Reviewed"
                              ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                              : item.status === "Unidentified"
                              ? "bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td
                        className="px-2.5 py-3 text-slate-500 dark:text-slate-400 max-w-[120px] xl:max-w-[160px] truncate text-xs"
                        title={item.desc}
                      >
                        {item.desc}
                      </td>
                      <td className="px-2.5 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap text-[11px]">
                        {item.submitted}
                      </td>
                      <td className="px-2.5 py-3 whitespace-nowrap text-right">
                        <button
                          type="button"
                          onClick={() => handleActionClick(item)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer shadow-xs ${
                            item.action === "Review" || item.status === "Pending" || item.status === "Unidentified"
                              ? "bg-[#0053CC] hover:bg-blue-700 text-white"
                              : "bg-blue-50 dark:bg-blue-950/40 text-[#0053CC] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40"
                          }`}
                        >
                          {item.status === "Unidentified" ? "Review" : item.action}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {!isLoading && totalRecords > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 gap-4">
              <span>
                Showing {startRecord} to {endRecord} of {totalRecords} records
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
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
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-3 py-1 rounded-lg font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* VIEW MODAL */}
      {isViewModalOpen && selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-hidden no-print">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-100 dark:border-slate-800 my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">Report details</h3>
                <p className="text-[11px] text-slate-400">Incident reference: {selectedIncident.ref}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#0053CC] border border-blue-200">
                  {selectedIncident.status}
                </span>
                <button
                  type="button"
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Uploaded evidence</span>
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3 text-center space-y-2">
                  <img
                    src={selectedIncident.evidenceImg}
                    alt="Evidence"
                    className="h-40 w-full object-cover rounded-xl"
                  />
                  <p className="text-[11px] text-slate-500">{selectedIncident.ref}.jpg</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div>
                    <p className="text-slate-400">Report ID</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{selectedIncident.ref}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Reporter</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{selectedIncident.reporter}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div>
                    <p className="text-slate-400">Vehicle Type</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{selectedIncident.type}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Plate Number</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{selectedIncident.plate}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div>
                    <p className="text-slate-400">Model</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{selectedIncident.model}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Color</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{selectedIncident.color}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-slate-400">Report Type</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{selectedIncident.reportType}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Submitted</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{selectedIncident.submitted}</p>
                  </div>
                </div>

                {selectedIncident.rejectionReason && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-rose-600">
                    <p className="text-[11px] font-bold">Disapproval / Rejection Reason:</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      {selectedIncident.rejectionReason}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Incident Description</span>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50/50 dark:bg-slate-800/30 text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {selectedIncident.desc || "No narrative description provided."}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 bg-slate-50/50 dark:bg-slate-800/30">
              <h4 className="text-xs font-bold text-[#0053CC] dark:text-blue-400 uppercase tracking-wider">
                Registered Owner Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="min-w-0">
                  <p className="text-slate-400">Owner Name</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200 truncate mt-0.5" title={selectedIncident.ownerName}>
                    {selectedIncident.ownerName}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-slate-400">Email Address</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200 break-all mt-0.5" title={selectedIncident.ownerEmail}>
                    {selectedIncident.ownerEmail}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-slate-400">Contact Number</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 whitespace-nowrap">
                    {selectedIncident.ownerPhone}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs transition-colors cursor-pointer"
              >
                <Printer className="h-4 w-4 text-[#0053CC] dark:text-blue-400" />
                <span>Print / Export PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                className="w-28 h-10 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            margin: 22mm 18mm;
            size: portrait;
          }
          body * {
            visibility: hidden;
          }
          #printable-incident-report, #printable-incident-report * {
            visibility: visible;
          }
          #printable-incident-report {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: #ffffff !important;
            color: #111827 !important;
            padding: 4px 2px !important;
            margin: 0 !important;
            font-family: Arial, Helvetica, sans-serif;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* PRINT-ONLY OFFICIAL INCIDENT REPORT DOCUMENT */}
      {selectedIncident && (
        <div id="printable-incident-report" className="hidden">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                Quezon City University &bull; SmartPark
              </p>
              <h1 className="text-lg font-bold text-slate-900 mt-0.5">
                Incident Report Summary
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                Campus Parking Management &amp; Security Office
              </p>
            </div>
            <div className="text-right text-xs text-slate-600">
              <p>
                <span className="text-slate-500">Status:</span>{" "}
                <strong className="text-slate-900 uppercase">
                  {selectedIncident.status}
                </strong>
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Date Printed:{" "}
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* Reference & Report Details */}
          <div className="mb-6">
            <div className="grid grid-cols-3 gap-6 text-xs pb-4 border-b border-slate-200">
              <div>
                <p className="text-slate-500">Reference ID</p>
                <p className="font-bold text-slate-900 text-sm mt-1">
                  {selectedIncident.ref}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Report Type</p>
                <p className="font-semibold text-slate-900 mt-1">
                  {selectedIncident.reportType}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Date &amp; Time Reported</p>
                <p className="font-semibold text-slate-900 mt-1">
                  {selectedIncident.submitted}
                </p>
              </div>
            </div>
          </div>

          {/* 1. Reporter Information */}
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase text-slate-800 border-b border-slate-300 pb-1.5 mb-3">
              1. Reporter Information
            </h2>
            <div className="grid grid-cols-3 gap-6 text-xs">
              <div>
                <p className="text-slate-500">Name</p>
                <p className="font-semibold text-slate-900 mt-1">
                  {selectedIncident.reporter}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Email</p>
                <p className="font-semibold text-slate-900 mt-1">
                  {selectedIncident.reporterEmail || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Contact Number</p>
                <p className="font-semibold text-slate-900 mt-1">
                  {selectedIncident.reporterPhone || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Vehicle & Registered Owner Information */}
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase text-slate-800 border-b border-slate-300 pb-1.5 mb-3">
              2. Vehicle &amp; Registered Owner Information
            </h2>
            <div className="grid grid-cols-4 gap-6 text-xs mb-4">
              <div>
                <p className="text-slate-500">Plate Number</p>
                <p className="font-bold text-slate-900 mt-1">
                  {selectedIncident.plate}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Vehicle Type</p>
                <p className="font-semibold text-slate-900 mt-1">
                  {selectedIncident.type}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Model / Brand</p>
                <p className="font-semibold text-slate-900 mt-1">
                  {selectedIncident.model || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Color</p>
                <p className="font-semibold text-slate-900 mt-1">
                  {selectedIncident.color || "N/A"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 text-xs pt-3 border-t border-slate-200">
              <div>
                <p className="text-slate-500">Registered Owner</p>
                <p className="font-semibold text-slate-900 mt-1">
                  {selectedIncident.ownerName}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Owner Email</p>
                <p className="font-semibold text-slate-900 mt-1">
                  {selectedIncident.ownerEmail}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Owner Contact</p>
                <p className="font-semibold text-slate-900 mt-1">
                  {selectedIncident.ownerPhone}
                </p>
              </div>
            </div>
          </div>

          {/* 3. Incident Description & Evidence */}
          <div className="mb-7">
            <h2 className="text-xs font-bold uppercase text-slate-800 border-b border-slate-300 pb-1.5 mb-3">
              3. Incident Description &amp; Photo Evidence
            </h2>
            <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap mb-4">
              {selectedIncident.desc || "No narrative description provided."}
            </p>
            {selectedIncident.evidenceImg && (
              <div className="mt-3">
                <img
                  src={selectedIncident.evidenceImg}
                  alt="Incident Photo Evidence"
                  className="max-h-52 max-w-xs object-contain border border-slate-300"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Attached Photo Evidence
                </p>
              </div>
            )}
          </div>

          {/* 4. Review & Sign-off */}
          <div className="border-t border-slate-800 pt-5 mt-8">
            <h2 className="text-xs font-bold uppercase text-slate-800 mb-3">
              4. Review &amp; Sign-Off
            </h2>
            <div className="grid grid-cols-2 gap-10 text-xs mb-8">
              <div>
                <p className="text-slate-500">Current Status</p>
                <p className="font-bold text-slate-900 mt-1">
                  {selectedIncident.status}
                </p>
                {selectedIncident.reviewedBy && (
                  <p className="text-xs text-slate-600 mt-1.5">
                    Reviewed By:{" "}
                    <span className="font-semibold text-slate-900">
                      {selectedIncident.reviewedBy}
                    </span>
                  </p>
                )}
                {selectedIncident.rejectionReason && (
                  <p className="text-xs text-slate-700 mt-1.5">
                    Remarks / Reason: {selectedIncident.rejectionReason}
                  </p>
                )}
              </div>
              <div>
                <p className="text-slate-500">Signature &amp; Date</p>
                <div className="border-b border-slate-500 mt-10 mb-1.5"></div>
                <p className="text-[11px] text-slate-600">
                  Authorized SmartPark Administrator / Security Officer
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 text-center border-t border-slate-200 pt-3">
              Quezon City University SmartPark System &mdash; Official Record (
              {selectedIncident.ref})
            </p>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}