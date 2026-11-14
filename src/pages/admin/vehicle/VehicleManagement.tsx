import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, ChevronDown, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import CarIcon from "@/assets/car-icon.svg";
import MotorIcon from "@/assets/motor-icon.svg";
import { getAdminVehicles, type Vehicle } from "@/api/vehicleApi";

export default function VehicleManagement() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [metrics, setMetrics] = useState({
    totalRegistered: 0,
    totalCars: 0,
    totalMotorcycles: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All"); 
  const [selectedStatus, setSelectedStatus] = useState("All"); 
  const [selectedType, setSelectedType] = useState("All"); 

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

  const statusOptions = ["Approved", "Pending", "Rejected", "Inactive"];
  const typeOptions = ["Car", "Motorcycle"];

  const fetchAdminVehicles = async () => {
    try {
      setIsLoading(true);
      const res = await getAdminVehicles({
        search: searchQuery,
        tab: activeTab,
        status: selectedStatus,
        type: selectedType,
        page: currentPage,
        limit: 10,
      });

      if (res.success) {
        setVehicles(res.vehicles || []);
        if (res.metrics) {
          setMetrics(res.metrics);
        }
        if (res.pagination) {
          setTotalRecords(res.pagination.total);
          setTotalPages(res.pagination.totalPages);
        }
      }
    } catch (err: any) {
      console.error("Failed to fetch admin vehicles:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminVehicles();
  }, [searchQuery, activeTab, selectedStatus, selectedType, currentPage]);

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "Approved":
        return "text-emerald-600 dark:text-emerald-400";
      case "Pending":
        return "text-amber-600 dark:text-amber-400";
      case "Rejected":
        return "text-rose-600 dark:text-rose-400";
      case "Inactive":
        return "text-slate-500 dark:text-slate-400";
      default:
        return "text-slate-700 dark:text-slate-300";
    }
  };

  const isGateRegistered = activeTab === "Gate Registered Vehicles";

  const handleActionClick = (vehicleId: number | string) => {
    navigate(`/admin/vehicles/details/${vehicleId}`);
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">Vehicle Management</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Manage registered vehicles of campus users.</p>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-xs flex justify-between items-start transition-colors">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Registered</span>
            <h3 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white mt-2">
              {metrics.totalRegistered}
            </h3>
          </div>
          <img src={CarIcon} alt="Car" className="h-5 w-5 object-contain" />
        </div>
        <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-xs flex justify-between items-start transition-colors">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Cars & SUVs</span>
            <h3 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white mt-2">
              {metrics.totalCars}
            </h3>
          </div>
          <img src={CarIcon} alt="Car" className="h-5 w-5 object-contain" />
        </div>
        <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-xs flex justify-between items-start transition-colors">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Motorcycles</span>
            <h3 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white mt-2">
              {metrics.totalMotorcycles}
            </h3>
          </div>
          <img src={MotorIcon} alt="Motorcycle" className="h-5 w-5 object-contain" />
        </div>
      </div>

      {/* MAIN TABLE CONTAINER */}
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
              placeholder="Search plates, names, student ID..." 
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#0053CC]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
            {/* Tabs */}
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

            {/* Type Filter */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsTypeDropdownOpen(!isTypeDropdownOpen);
                  setIsStatusDropdownOpen(false);
                }}
                className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                <img 
                  src={selectedType === "Motorcycle" ? MotorIcon : CarIcon} 
                  alt="Type" 
                  className="h-3.5 w-3.5 object-contain" 
                />
                <span>Type: {selectedType}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {isTypeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg py-1 z-20 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedType("All");
                      setIsTypeDropdownOpen(false);
                      setCurrentPage(1);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer text-slate-500 italic border-b border-slate-100 dark:border-slate-700/50"
                  >
                    All Types
                  </button>
                  {typeOptions.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setSelectedType(type);
                        setIsTypeDropdownOpen(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer ${
                        selectedType === type ? "font-bold text-[#0053CC] dark:text-blue-400" : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Status Filter (Only if not Gate Registered tab) */}
            {!isGateRegistered && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsStatusDropdownOpen(!isStatusDropdownOpen);
                    setIsTypeDropdownOpen(false);
                  }}
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

        {/* TABLE */}
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
              {isLoading ? (
                <tr>
                  <td colSpan={isGateRegistered ? 7 : 8} className="py-12 text-center text-slate-400 text-xs">
                    <Loader2 className="h-6 w-6 animate-spin text-[#0053CC] dark:text-blue-400 mx-auto mb-2" />
                    Loading vehicles...
                  </td>
                </tr>
              ) : vehicles.length > 0 ? (
                vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 font-semibold text-slate-900 dark:text-white">
                      {vehicle.plateNo || vehicle.plateNumber}
                    </td>
                    <td className="py-3 font-medium text-slate-800 dark:text-slate-200">
                      {vehicle.owner || (vehicle.user ? `${vehicle.user.lastName}, ${vehicle.user.firstName}` : "--")}
                    </td>
                    <td className="py-3">
                      <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5 w-max">
                        <img 
                          src={vehicle.type === "Motorcycle" ? MotorIcon : CarIcon} 
                          alt={vehicle.type} 
                          className="h-3 w-3 object-contain" 
                        />
                        {vehicle.type}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">
                      {vehicle.brandModel || `${vehicle.brand} ${vehicle.model}`}
                    </td>
                    <td className="py-3 text-slate-500 dark:text-slate-400">{vehicle.color}</td>
                    <td className="py-3 text-slate-500 dark:text-slate-400">{vehicle.regDate || vehicle.createdAt?.split("T")[0]}</td>
                    {!isGateRegistered && (
                      <td className="py-3">
                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          vehicle.status === "Approved" ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800" :
                          vehicle.status === "Pending" ? "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800" : 
                          vehicle.status === "Inactive" ? "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700" :
                          "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                        }`}>
                          {vehicle.status}
                        </span>
                      </td>
                    )}
                    <td className="py-3 text-right">
                      <button 
                        type="button" 
                        onClick={() => handleActionClick(vehicle.id)}
                        className="font-bold text-[#0053CC] dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        {vehicle.status === "Pending" ? "Review" : "View"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isGateRegistered ? 7 : 8} className="py-8 text-center text-slate-400 text-xs italic">
                    No vehicle records found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 gap-4">
          <span>Showing {vehicles.length} of {totalRecords} records</span>
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