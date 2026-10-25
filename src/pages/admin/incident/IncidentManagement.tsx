import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, History, X } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";

export default function IncidentManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // State para sa View Modal
  const [selectedIncident, setSelectedIncident] = useState<any | null>(null);
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

  const incidentsData = [
    { 
      id: 1, 
      ref: "INC-2025-098", 
      reporter: "Bryan Marcelo", 
      type: "Motorcycle", 
      model: "Yamaha Mio", 
      color: "Black", 
      plate: "GHI 9091", 
      reportType: "Obstruction", 
      status: "Pending", 
      desc: "Vehicle ignoring speed limit near pedestrian crossing.", 
      submitted: "Sept 30, 8:42 AM", 
      action: "Review",
      ownerName: "Daniel Cruz",
      ownerEmail: "daniel.cruz@email.com",
      ownerPhone: "0917 456 7708",
      evidenceImg: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=60"
    },
    { 
      id: 2, 
      ref: "INC-2025-097", 
      reporter: "Aivan Dormetorio", 
      type: "Car", 
      model: "Toyota Vios", 
      color: "Silver", 
      plate: "NDG 5214", 
      reportType: "Illegal Parking", 
      status: "Rejected", 
      desc: "Incorrect parking alignment blocking the pathway.", 
      submitted: "Sept 29, 2:00 PM", 
      action: "View",
      ownerName: "Maria Santos",
      ownerEmail: "maria.santos@qcu.edu.ph",
      ownerPhone: "0912 345 6789",
      evidenceImg: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&auto=format&fit=crop&q=60"
    },
    { 
      id: 3, 
      ref: "INC-2025-096", 
      reporter: "Duke Tolentino", 
      type: "Car", 
      model: "Honda Civic", 
      color: "White", 
      plate: "Unknown", 
      reportType: "Unidentified", 
      status: "Unidentified", 
      desc: "Unregistered vehicle left unattended for hours.", 
      submitted: "Sept 28, 3:00 PM", 
      action: "View",
      ownerName: "N/A",
      ownerEmail: "N/A",
      ownerPhone: "N/A",
      evidenceImg: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&auto=format&fit=crop&q=60"
    },
    { 
      id: 4, 
      ref: "INC-2025-095", 
      reporter: "Kyle Antonio", 
      type: "Car", 
      model: "Mitsubishi Montero", 
      color: "Gray", 
      plate: "ABC 1234", 
      reportType: "Illegal Parking", 
      status: "Pending", 
      desc: "Owner parked across yellow lines.", 
      submitted: "Sept 27, 10:00 AM", 
      action: "Review",
      ownerName: "Juan Dela Cruz",
      ownerEmail: "juan@qcu.edu.ph",
      ownerPhone: "0919 888 7766",
      evidenceImg: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format&fit=crop&q=60"
    },
    { 
      id: 5, 
      ref: "INC-2025-094", 
      reporter: "Kurt Laride", 
      type: "Motorcycle", 
      model: "Honda Click", 
      color: "Red", 
      plate: "XYZ 9876", 
      reportType: "Double parking", 
      status: "Reviewed", 
      desc: "Blocking other motorcycles in slot 12.", 
      submitted: "Sept 26, 7:10 AM", 
      action: "View",
      ownerName: "Pedro Penduko",
      ownerEmail: "pedro@qcu.edu.ph",
      ownerPhone: "0922 333 4455",
      evidenceImg: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&auto=format&fit=crop&q=60"
    },
  ];

  const handleActionClick = (item: any) => {
    if (item.action === "Review" || item.status === "Pending") {
      navigate(`/admin/incidents/review/${item.id}`);
    } else {
      setSelectedIncident(item);
      setIsViewModalOpen(true);
    }
  };

  const filteredIncidents = incidentsData.filter((item) => {
    const matchesSearch = 
      item.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reporter.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeTab !== "All" && item.status !== activeTab) return false;
    return true;
  });

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredIncidents.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">Incident Management</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Review and manage parking incident reports submitted by users.</p>
          </div>
          <Link
            to="/admin/incidents/history"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0053CC] px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors w-fit shadow-xs cursor-pointer"
          >
            <History className="h-4 w-4" />
            <span>View Incident History</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex justify-between items-start transition-colors">
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Waiting for review</p>
              <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">2</h3>
              <p className="text-[10px] font-medium text-slate-400 mt-1">New reports</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex justify-between items-start transition-colors">
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Reviewed this week</p>
              <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">12</h3>
              <p className="text-[10px] font-medium text-slate-400 mt-1">4 today</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex justify-between items-start transition-colors">
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Target metrics</p>
              <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">18</h3>
              <p className="text-[10px] font-medium text-slate-400 mt-1">Within target</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs space-y-4 transition-colors">
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
            <table className="w-full text-left text-xs min-w-187.5">
              <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="pb-3">Reference</th>
                  <th className="pb-3">Reporter</th>
                  <th className="pb-3">Vehicle Type</th>
                  <th className="pb-3">Plate No.</th>
                  <th className="pb-3">Report Type</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Description</th>
                  <th className="pb-3">Submitted</th>
                  <th className="pb-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 font-semibold text-[#0053CC] dark:text-blue-400">{item.ref}</td>
                      <td className="py-3 text-slate-800 dark:text-slate-200">{item.reporter}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                          {item.type}
                        </span>
                      </td>
                      <td className="py-3 font-bold text-slate-900 dark:text-white">{item.plate}</td>
                      <td className="py-3 text-slate-600 dark:text-slate-400">{item.reportType}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          item.status === "Pending" ? "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800" :
                          item.status === "Rejected" ? "bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800" :
                          item.status === "Reviewed" ? "bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400 border border-blue-200 dark:border-blue-800" :
                          "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-500 dark:text-slate-400 truncate max-w-xs">{item.desc}</td>
                      <td className="py-3 text-slate-600 dark:text-slate-400">{item.submitted}</td>
                      <td className="py-3">
                        <button 
                          type="button" 
                          onClick={() => handleActionClick(item)}
                          className="font-bold text-[#0053CC] dark:text-blue-400 hover:underline cursor-pointer"
                        >
                          {item.action}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400 text-xs italic">
                      No incident records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 gap-4">
            <span>
              Showing {filteredIncidents.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredIncidents.length)} of {filteredIncidents.length} records
            </span>
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
      </div>

      {/* VIEW MODAL (Fixed background scroll) */}
      {isViewModalOpen && selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-hidden">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-6 border border-slate-100 dark:border-slate-800 my-auto">
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
                  <img src={selectedIncident.evidenceImg} alt="Evidence" className="h-40 w-full object-cover rounded-xl" />
                  <p className="text-[11px] text-slate-500">{selectedIncident.ref}.jpg • 2.4 MB</p>
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
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-2 bg-slate-50/50 dark:bg-slate-800/30">
              <h4 className="text-xs font-bold text-[#0053CC] dark:text-blue-400 uppercase tracking-wider">Registered Owner</h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-slate-400">Registered Owner</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{selectedIncident.ownerName}</p>
                </div>
                <div>
                  <p className="text-slate-400">Email</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{selectedIncident.ownerEmail}</p>
                </div>
                <div>
                  <p className="text-slate-400">Contact</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{selectedIncident.ownerPhone}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                className="w-30 h-10 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}