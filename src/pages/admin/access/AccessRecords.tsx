import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, History } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";

export default function AccessRecords() {
  const [activeTab, setActiveTab] = useState("Entries");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Sample data na may kasamang kategorya (tab) para sa filtering
  const recordsData = [
    { 
      id: 1, 
      plateNo: "NDX 5521", 
      vehicleDesc: "Yamaha Mio", 
      owner: "Maria Santos", 
      dateTime: "Sept 29, 7:42 AM", 
      guard: "Reyes", 
      type: "Motorcycle",
      category: "Entries" 
    },
    { 
      id: 2, 
      plateNo: "QWE 4477", 
      vehicleDesc: "Nissan Almera", 
      owner: "Jon Dela Cruz", 
      dateTime: "Sept 29, 7:41 AM", 
      guard: "Santos", 
      type: "Car",
      category: "Entries" 
    },
    { 
      id: 3, 
      plateNo: "GHI 3456", 
      vehicleDesc: "Hyundai Accent", 
      owner: "Liza Dizon", 
      dateTime: "Sept 29, 7:40 AM", 
      guard: "Reyes", 
      type: "Car",
      category: "Entries" 
    },
    { 
      id: 4, 
      plateNo: "ABC 1234", 
      vehicleDesc: "Toyota Vios", 
      owner: "Juan Dela Cruz", 
      dateTime: "Sept 29, 5:00 PM", 
      guard: "Santos", 
      type: "Car",
      category: "Exits" 
    },
    { 
      id: 5, 
      plateNo: "XYZ 9876", 
      vehicleDesc: "Honda Click", 
      owner: "Pedro Penduko", 
      dateTime: "Sept 29, 4:30 PM", 
      guard: "Reyes", 
      type: "Motorcycle",
      category: "Exits" 
    },
    { 
      id: 6, 
      plateNo: "TXT 5544", 
      vehicleDesc: "Mitsubishi Montero", 
      owner: "Bryan Marcelo", 
      dateTime: "Sept 29, 8:00 AM", 
      guard: "Santos", 
      type: "Car",
      category: "Currently Inside" 
    },
    { 
      id: 7, 
      plateNo: "S 1122", 
      vehicleDesc: "Kawasaki Dominar", 
      owner: "Aivan Dormetorio", 
      dateTime: "Sept 29, 9:15 AM", 
      guard: "Reyes", 
      type: "Motorcycle",
      category: "Currently Inside" 
    },
  ];

  // Filtering logic para sa Tabs at Search Query
  const filteredRecords = recordsData.filter((item) => {
    const matchesTab = activeTab === "All" || item.category === activeTab;
    const matchesSearch = 
      item.plateNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vehicleDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.guard.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Pagination logic
  const itemsPerPage = 3; // Pwede mong baguhin depende sa gusto mo kada pahina
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRecords.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <AdminLayout>
      {/* Title & View History Button Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">Access & Records</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Review and manage parking access logs and real-time records.</p>
        </div>
        <Link
          to="/admin/access-records/history"
          className="inline-flex items-center gap-2 rounded-xl bg-[#0053CC] px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors w-fit shadow-xs cursor-pointer"
        >
          <History className="h-4 w-4" />
          <span>View All History</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex justify-between items-start transition-colors">
          <div>
            <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">Today's Entry Logs</p>
            <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">86</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex justify-between items-start transition-colors">
          <div>
            <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">Today's Exit Logs</p>
            <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">71</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex justify-between items-start transition-colors">
          <div>
            <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">Currently inside</p>
            <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">15</h3>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Bumalik sa page 1 kapag naghahanap
              }}
              placeholder="Search owner, id, or plate" 
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
                  setCurrentPage(1); // Bumalik sa page 1 kapag lumipat ng tab
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

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-150">
            <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="pb-3">Plate No.</th>
                <th className="pb-3">Owner</th>
                <th className="pb-3">Date & Time</th>
                <th className="pb-3">Guard</th>
                <th className="pb-3">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3">
                      <p className="font-bold text-slate-900 dark:text-white">{item.plateNo}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{item.vehicleDesc}</p>
                    </td>
                    <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">{item.owner}</td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">{item.dateTime}</td>
                    <td className="py-3 font-medium text-slate-700 dark:text-slate-300">{item.guard}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        item.type === "Motorcycle" 
                          ? "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800" 
                          : "bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                      }`}>
                        {item.type}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 italic">
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
            Showing {filteredRecords.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredRecords.length)} of {filteredRecords.length} records
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
    </AdminLayout>
  );
}