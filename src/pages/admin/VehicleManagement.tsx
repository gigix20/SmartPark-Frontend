import { useState } from "react";
import { Search, Filter, Car, ShieldCheck, ChevronDown } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";

export default function VehicleManagement() {
  const vehiclesData = [
    { id: 1, plateNo: "ABC 1234", owner: "Dela Cruz, Rafael", type: "Car", brandModel: "Toyota Vios", color: "White", regDate: "15 Dec 2025", status: "Approved" },
    { id: 2, plateNo: "XYZ 5678", owner: "Cruz, Mark Anthony", type: "Motorcycle", brandModel: "Honda Click 125", color: "Black", regDate: "02 Jan 2026", status: "Approved" },
    { id: 3, plateNo: "DEF 9012", owner: "Santos, Maria", type: "Car", brandModel: "Mitsubishi L300", color: "Silver", regDate: "14 Jan 2026", status: "Pending" },
    { id: 4, plateNo: "GHI 3456", owner: "Reyes, Jose", type: "Car", brandModel: "Hyundai Accent", color: "Red", regDate: "20 Jan 2026", status: "Approved" },
    { id: 5, plateNo: "JKL 7890", owner: "Del Prado, Juan", type: "Motorcycle", brandModel: "Yamaha Mio", color: "Blue", regDate: "22 Jan 2026", status: "Rejected" },
    { id: 6, plateNo: "MNO 1122", owner: "Villanueva, Ana", type: "Car", brandModel: "Honda Civic", color: "Gray", regDate: "05 Feb 2026", status: "Approved" },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("All"); 
  const [selectedStatus, setSelectedStatus] = useState("All"); 
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const itemsPerPage = 5;

  const statusOptions = ["Approved", "Pending", "Rejected"];

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "Approved":
        return "text-emerald-600 dark:text-emerald-400";
      case "Pending":
        return "text-amber-600 dark:text-amber-400";
      case "Rejected":
        return "text-rose-600 dark:text-rose-400";
      default:
        return "text-slate-700 dark:text-slate-300";
    }
  };

  const filteredData = vehiclesData.filter((item) => {
    if (activeTab === "Gate Registered Vehicles" && item.status !== "Approved") {
      return false;
    }
    if (selectedStatus !== "All" && item.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const isGateRegistered = activeTab === "Gate Registered Vehicles";

  return (
    <AdminLayout>
      <div>
        <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">Vehicle Management</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Manage registered vehicles of users.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Total Registered</span>
            <Car className="h-4 w-4 text-[#0053CC] dark:text-blue-400" />
          </div>
          <h3 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white mt-2">1,247</h3>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Cars & SUVs</span>
            <Car className="h-4 w-4 text-blue-500" />
          </div>
          <h3 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white mt-2">890</h3>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Motorcycles</span>
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white mt-2">357</h3>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search plates, names, logs..." 
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#0053CC]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              {["All", "Gate Registered Vehicles"].map((tab) => (
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

            {/* Itinatago o di pinapakita ang status dropdown kapag naka-Gate Registered Vehicles tab */}
            {!isGateRegistered && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  className={`flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${getStatusColorClass(selectedStatus)}`}
                >
                  <Filter className="h-3.5 w-3.5" />
                  <span>Status: {selectedStatus}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {isStatusDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg py-1 z-20 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStatus("All");
                        setIsStatusDropdownOpen(false);
                        setCurrentPage(1);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer text-slate-500 italic border-b border-slate-100 dark:border-slate-700/50"
                    >
                      Clear Filter (All)
                    </button>

                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => {
                          setSelectedStatus(status);
                          setIsStatusDropdownOpen(false);
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer ${
                          selectedStatus === status ? "font-bold text-[#0053CC] dark:text-blue-400" : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-187.5">
            <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="pb-3">Plate No.</th>
                <th className="pb-3">Owner</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Brand & Model</th>
                <th className="pb-3">Color</th>
                <th className="pb-3">Registration Date</th>
                {!isGateRegistered && <th className="pb-3">Status</th>}
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {currentItems.length > 0 ? (
                currentItems.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 font-semibold text-slate-900 dark:text-white">{vehicle.plateNo}</td>
                    <td className="py-3 font-medium text-slate-800 dark:text-slate-200">{vehicle.owner}</td>
                    <td className="py-3">
                      <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-400">
                        {vehicle.type}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">{vehicle.brandModel}</td>
                    <td className="py-3 text-slate-500 dark:text-slate-400">{vehicle.color}</td>
                    <td className="py-3 text-slate-500 dark:text-slate-400">{vehicle.regDate}</td>
                    {!isGateRegistered && (
                      <td className="py-3">
                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          vehicle.status === "Approved" ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800" :
                          vehicle.status === "Pending" ? "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800" : 
                          "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                        }`}>
                          {vehicle.status}
                        </span>
                      </td>
                    )}
                    <td className="py-3 text-right">
                      <button type="button" className="text-[#0053CC] dark:text-blue-400 hover:underline font-medium cursor-pointer">
                        {vehicle.status === "Pending" || vehicle.status === "Rejected" ? "Review" : "View"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isGateRegistered ? 7 : 8} className="py-8 text-center text-slate-400 text-xs italic">
                    No records found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 gap-4">
          <span>Showing {currentItems.length} of {filteredData.length} records</span>
          <div className="flex items-center gap-1">
            <button 
              type="button" 
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((number) => (
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