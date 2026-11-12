import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, ChevronDown, X, Check, ArrowRight } from "lucide-react";
import { GuardHeader } from "@/components/GuardHeader";
import { GuardNav } from "@/components/GuardNav";

interface RegisteredVehicle {
  id: string;
  owner: string;
  plate: string;
  vehicleType: "Car" | "Motorcycle";
  model: string;
  idType: string;
  idNumber: string;
  entryTime: string;
  exitTime?: string;
  duration?: string;
  guard: string;
  registrationDate: string;
  status: "Active" | "Deactivated";
}

export default function GateRegistered() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "deactivated">("active");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  
  // Filter Dropdown States
  const [selectedFilter, setSelectedFilter] = useState("All Vehicles");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const filterOptions = ["Car", "Motorcycle"];

  // Modal states
  const [selectedVehicle, setSelectedVehicle] = useState<RegisteredVehicle | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeactivatedSuccessModal, setShowDeactivatedSuccessModal] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showDetailsModal || showDeactivatedSuccessModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showDetailsModal, showDeactivatedSuccessModal]);

  const [vehicles, setVehicles] = useState<RegisteredVehicle[]>([
    {
      id: "1",
      owner: "Maria Santos",
      plate: "ABC 4901",
      vehicleType: "Car",
      model: "Toyota Corolla",
      idType: "Driver's License",
      idNumber: "DL-07-482190",
      entryTime: "10:42 AM",
      guard: "James Miller",
      registrationDate: "September 14, 2026",
      status: "Active",
    },
    {
      id: "2",
      owner: "Daniel Reyes",
      plate: "NQX 772",
      vehicleType: "Motorcycle",
      model: "Yamaha NMAX",
      idType: "Driver's License",
      idNumber: "DL-09-112344",
      entryTime: "10:30 AM",
      guard: "Sofia Chen",
      registrationDate: "September 14, 2026",
      status: "Active",
    },
    {
      id: "3",
      owner: "Ford Ranger - Aisha Khan",
      plate: "KJM 9031",
      vehicleType: "Car",
      model: "Ford Ranger",
      idType: "Company ID",
      idNumber: "EMP-2026-99",
      entryTime: "10:24 AM",
      guard: "James Miller",
      registrationDate: "September 14, 2026",
      status: "Active",
    },
    {
      id: "4",
      owner: "Nissan Navara - Noah Williams",
      plate: "TFV 1150",
      vehicleType: "Motorcycle",
      model: "Honda Click",
      idType: "Student ID",
      idNumber: "24-1474",
      entryTime: "10:20 AM",
      guard: "David Lee",
      registrationDate: "September 14, 2026",
      status: "Active",
    },
    {
      id: "5",
      owner: "Maria Santos (Past Exit)",
      plate: "ABC 4901",
      vehicleType: "Car",
      model: "Toyota Corolla",
      idType: "Driver's License",
      idNumber: "DL-07-482190",
      entryTime: "06:10 AM",
      exitTime: "10:42 AM",
      duration: "4h 32m",
      guard: "James Miller",
      registrationDate: "September 10, 2026",
      status: "Deactivated",
    },
  ]);

  const filteredVehicles = vehicles.filter((v) => {
    const matchesTab = activeTab === "active" ? v.status === "Active" : v.status === "Deactivated";
    const matchesSearch = 
      v.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesTab || !matchesSearch) return false;

    if (selectedFilter !== "All Vehicles" && v.vehicleType !== selectedFilter) {
      return false;
    }

    return true;
  });

  // Pagination Calculations
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVehicles = filteredVehicles.slice(indexOfFirstItem, indexOfLastItem);

  const handleOpenDetails = (v: RegisteredVehicle) => {
    setSelectedVehicle(v);
    setShowDetailsModal(true);
  };

  const handleDeactivate = () => {
    if (!selectedVehicle) return;
    setVehicles((prev) =>
      prev.map((item) =>
        item.id === selectedVehicle.id ? { ...item, status: "Deactivated" as const } : item
      )
    );
    setShowDetailsModal(false);
    setShowDeactivatedSuccessModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex flex-col transition-colors font-sans">
      <GuardHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex-1 flex relative">
        <GuardNav isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto lg:pl-72 transition-all">
          <div className="space-y-6 max-w-6xl mx-auto pb-16">
            
            {/* Header Title */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">
                  Gate Registered
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Search and review live vehicle movements and facility access history.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/guard/registration/new")}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer self-start sm:self-auto"
              >
                <ArrowRight className="h-4 w-4" />
                <span>Register Vehicle</span>
              </button>
            </div>

            {/* Table Container na may uniform shadow at border */}
            <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xs overflow-hidden transition-colors">
              
              {/* Tabs Navigation */}
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 px-6 pt-4">
                <button
                  type="button"
                  onClick={() => { setActiveTab("active"); setCurrentPage(1); }}
                  className={`pb-3 text-xs font-bold transition-all relative cursor-pointer ${
                    activeTab === "active"
                      ? "text-[#0053CC] dark:text-blue-400 border-b-2 border-[#0053CC] dark:border-blue-400"
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  }`}
                >
                  Registered / Entry
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab("deactivated"); setCurrentPage(1); }}
                  className={`pb-3 text-xs font-bold transition-all relative cursor-pointer px-4 ${
                    activeTab === "deactivated"
                      ? "text-[#0053CC] dark:text-blue-400 border-b-2 border-[#0053CC] dark:border-blue-400"
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  }`}
                >
                  Deactivated / Exit
                </button>
              </div>

              {/* Toolbar: Search and Filter */}
              <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    placeholder="Search plate number, owner..."
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#0053CC]"
                  />
                </div>

                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    <Filter className="h-3.5 w-3.5 text-[#0053CC] dark:text-blue-400" />
                    <span>Filter: {selectedFilter}</span>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  </button>

                  {isFilterDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl py-1 z-20 text-xs overflow-hidden">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFilter("All Vehicles");
                          setIsFilterDropdownOpen(false);
                          setCurrentPage(1);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs italic text-[#0053CC] dark:text-blue-400 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        Clear Filter (All)
                      </button>
                      {filterOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setSelectedFilter(option);
                            setIsFilterDropdownOpen(false);
                            setCurrentPage(1);
                          }}
                          className={`w-full text-left px-4 py-2.5 transition-colors cursor-pointer ${
                            selectedFilter === option 
                              ? "bg-blue-50 dark:bg-blue-950/50 font-bold text-[#0053CC] dark:text-blue-400" 
                              : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-162.5">
                  <thead className="bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3.5 px-6">Owner</th>
                      <th className="py-3.5 px-4">Plate</th>
                      <th className="py-3.5 px-4">Vehicle Type</th>
                      {activeTab === "active" ? (
                        <th className="py-3.5 px-4">Entry Time</th>
                      ) : (
                        <>
                          <th className="py-3.5 px-4">Exit Time</th>
                          <th className="py-3.5 px-4">Duration</th>
                        </>
                      )}
                      <th className="py-3.5 px-6">Guard</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {currentVehicles.length > 0 ? (
                      currentVehicles.map((v) => (
                        <tr
                          key={v.id}
                          onClick={() => handleOpenDetails(v)}
                          className="hover:bg-blue-50/40 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                        >
                          <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white">
                            {v.owner}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-[#0053CC] dark:text-blue-400">
                            {v.plate}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                                v.vehicleType === "Car"
                                  ? "bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400 border border-blue-100 dark:border-blue-900"
                                  : "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900"
                              }`}
                            >
                              {v.vehicleType}
                            </span>
                          </td>
                          {activeTab === "active" ? (
                            <td className="py-3.5 px-4 text-slate-500">{v.entryTime}</td>
                          ) : (
                            <>
                              <td className="py-3.5 px-4 text-slate-500">{v.exitTime}</td>
                              <td className="py-3.5 px-4 font-medium">{v.duration}</td>
                            </>
                          )}
                          <td className="py-3.5 px-6 text-slate-500">{v.guard}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                          No matching vehicle records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Functional Pagination Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                <span>Showing {filteredVehicles.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredVehicles.length)} of {filteredVehicles.length} records</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-slate-600 dark:text-slate-300 font-medium disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      type="button"
                      onClick={() => setCurrentPage(number)}
                      className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                        currentPage === number ? "bg-[#0053CC] text-white" : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-slate-600 dark:text-slate-300 font-medium disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>

      {/* ================= MODALS SECTION ================= */}

      {/* 1. REGISTRATION DETAILS MODAL */}
      {showDetailsModal && selectedVehicle && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-[32px] bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-6 relative transition-colors animate-in zoom-in-95 my-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">
                  Registration Details
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    selectedVehicle.status === "Active"
                      ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border border-emerald-200"
                      : "bg-slate-100 text-slate-500 border border-slate-300"
                  }`}
                >
                  {selectedVehicle.status}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowDetailsModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
              <div>
                <p className="text-slate-400 font-medium">Owner / driver</p>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedVehicle.owner}
                </p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Vehicle type</p>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedVehicle.vehicleType}
                </p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Plate number</p>
                <p className="font-bold text-[#0053CC] dark:text-blue-400 mt-0.5">
                  {selectedVehicle.plate}
                </p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Model</p>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedVehicle.model}
                </p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">ID type</p>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedVehicle.idType}
                </p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">ID number</p>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedVehicle.idNumber}
                </p>
              </div>
              <div className="col-span-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                <p className="text-slate-400 font-medium">Registration date</p>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedVehicle.registrationDate}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowDetailsModal(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close
              </button>
              {selectedVehicle.status === "Active" && (
                <button
                  type="button"
                  onClick={handleDeactivate}
                  className="px-5 py-2.5 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  Deactivate
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 2. CONFIRMED DEACTIVATED SUCCESS MODAL */}
      {showDeactivatedSuccessModal && (
        <div className="fixed inset-0 z-110 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-[32px] bg-white dark:bg-slate-900 p-7 text-center shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 animate-in zoom-in-95 relative transition-colors">
            
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/40">
              <Check className="h-7 w-7 stroke-[2.5]" />
            </div>

            <div>
              <h3 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">
                Previous registration deactivated
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed px-2">
                You can now re-register this vehicle.
              </p>
            </div>
            
            <div className="pt-2">
              <button 
                type="button"
                onClick={() => setShowDeactivatedSuccessModal(false)}
                className="w-full h-11 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}