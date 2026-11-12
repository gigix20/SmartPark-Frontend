import { useState, useRef, useEffect } from "react";
import { Search, Filter, ChevronDown, Download } from "lucide-react";
import { GuardHeader } from "@/components/GuardHeader";
import { GuardNav } from "@/components/GuardNav";

interface MonitoringRecord {
  id: string;
  owner: string;
  plate: string;
  vehicleType?: "Car" | "Motorcycle";
  timeOrDate: string;
  rawDate?: string; 
  registrationSource?: string;
  guard?: string;
  duration?: string;
  action?: "ENTRY" | "EXIT";
  result?: "GRANTED" | "DENIED";
}

export default function GateMonitoring() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"entries" | "exits" | "inside" | "history">("entries");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Dynamic Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All Vehicle");
  const [selectedDate, setSelectedDate] = useState(""); 
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dataEntries: MonitoringRecord[] = [
    { id: "1", owner: "Maria Santos", plate: "ABC 4901", vehicleType: "Car", timeOrDate: "10:42 AM", rawDate: "2026-09-29", registrationSource: "User registration", guard: "James Miller" },
    { id: "2", owner: "Daniel Reyes", plate: "NQX 772", vehicleType: "Motorcycle", timeOrDate: "10:30 AM", rawDate: "2026-09-29", registrationSource: "Gate registration", guard: "Sofia Chen" },
    { id: "3", owner: "Ford Ranger - Aisha Khan", plate: "KJM 9031", vehicleType: "Car", timeOrDate: "10:24 AM", rawDate: "2026-09-29", registrationSource: "User registration", guard: "James Miller" },
    { id: "4", owner: "Nissan Navara - Noah Williams", plate: "TFV 1150", vehicleType: "Motorcycle", timeOrDate: "10:20 AM", rawDate: "2026-09-29", registrationSource: "Gate registration", guard: "David Lee" },
    { id: "5", owner: "Hyundai Tucson - Elena Cruz", plate: "JDP 4457", vehicleType: "Motorcycle", timeOrDate: "10:01 AM", rawDate: "2026-09-28", registrationSource: "User registration", guard: "James Miller" },
    { id: "6", owner: "Mazda CX-5 - Liam Garcia", plate: "RSM 6204", vehicleType: "Car", timeOrDate: "09:54 AM", rawDate: "2026-09-28", registrationSource: "User registration", guard: "Sofia Chen" },
  ];

  const dataExits: MonitoringRecord[] = [
    { id: "1", owner: "Maria Santos", plate: "ABC 4901", vehicleType: "Car", timeOrDate: "10:40 AM", rawDate: "2026-09-29", duration: "4h 13m", guard: "James Miller" },
    { id: "2", owner: "Daniel Reyes", plate: "NQX 772", vehicleType: "Motorcycle", timeOrDate: "10:39 AM", rawDate: "2026-09-29", duration: "4h 13m", guard: "Sofia Chen" },
    { id: "3", owner: "Ford Ranger - Aisha Khan", plate: "KJM 9031", vehicleType: "Car", timeOrDate: "10:24 AM", rawDate: "2026-09-29", duration: "4h 13m", guard: "James Miller" },
    { id: "4", owner: "Nissan Navara - Noah Williams", plate: "TFV 1150", vehicleType: "Motorcycle", timeOrDate: "10:20 AM", rawDate: "2026-09-29", duration: "4h 13m", guard: "David Lee" },
    { id: "5", owner: "Hyundai Tucson - Elena Cruz", plate: "JDP 4457", vehicleType: "Motorcycle", timeOrDate: "10:01 AM", rawDate: "2026-09-28", duration: "4h 13m", guard: "James Miller" },
  ];

  const dataInside: MonitoringRecord[] = [
    { id: "1", owner: "Maria Santos", plate: "ABC 4901", vehicleType: "Car", timeOrDate: "10:42 AM", rawDate: "2026-09-29" },
    { id: "2", owner: "Daniel Reyes", plate: "NQX 772", vehicleType: "Motorcycle", timeOrDate: "10:30 AM", rawDate: "2026-09-29" },
    { id: "3", owner: "Ford Ranger - Aisha Khan", plate: "KJM 9031", vehicleType: "Car", timeOrDate: "10:24 AM", rawDate: "2026-09-29" },
    { id: "4", owner: "Nissan Navara - Noah Williams", plate: "TFV 1150", vehicleType: "Motorcycle", timeOrDate: "10:20 AM", rawDate: "2026-09-29" },
  ];

  const dataHistory: MonitoringRecord[] = [
    { id: "1", owner: "Maria Santos", plate: "ABC 4901", vehicleType: "Car", action: "EXIT", timeOrDate: "Oct 4, 6:42 PM", rawDate: "2026-10-04", result: "DENIED" },
    { id: "2", owner: "Daniel Reyes", plate: "NQX 772", vehicleType: "Motorcycle", action: "ENTRY", timeOrDate: "Oct 4, 6:42 PM", rawDate: "2026-10-04", result: "GRANTED" },
    { id: "3", owner: "Ford Ranger - Aisha Khan", plate: "KJM 9031", vehicleType: "Car", action: "ENTRY", timeOrDate: "Oct 4, 6:42 PM", rawDate: "2026-10-04", result: "DENIED" },
    { id: "4", owner: "Nissan Navara - Noah Williams", plate: "TFV 1150", vehicleType: "Motorcycle", action: "ENTRY", timeOrDate: "Oct 4, 6:42 PM", rawDate: "2026-10-04", result: "GRANTED" },
    { id: "5", owner: "Hyundai Tucson - Elena Cruz", plate: "JDP 4457", vehicleType: "Motorcycle", action: "EXIT", timeOrDate: "Oct 4, 6:35 PM", rawDate: "2026-10-04", result: "GRANTED" },
  ];

  const getActiveData = () => {
    switch (activeTab) {
      case "entries": return dataEntries;
      case "exits": return dataExits;
      case "inside": return dataInside;
      case "history": return dataHistory;
    }
  };

  // COMPLETE FILTERING LOGIC
  const filteredData = getActiveData().filter((item) => {
    const matchesSearch = 
      item.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.guard && item.guard.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedFilter !== "All Vehicle" && item.vehicleType) {
      if (item.vehicleType !== selectedFilter) return false;
    }

    if (selectedDate && item.rawDate) {
      if (item.rawDate !== selectedDate) return false;
    }

    return true;
  });

  // Pagination Calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleClearAllFilters = () => {
    setSelectedFilter("All Vehicle");
    setSearchQuery("");
    setSelectedDate("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex flex-col transition-colors font-sans">
      <GuardHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex-1 flex relative">
        <GuardNav isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto lg:pl-72 transition-all">
          <div className="space-y-6 max-w-6xl mx-auto pb-16">
            
            {/* Header & Export Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">
                  Gate Monitoring
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Search and review live vehicle movements and facility access history.
                </p>
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
              >
                <Download className="h-4 w-4 text-slate-400" />
                <span>Export Report</span>
              </button>
            </div>

            {/* Main Table Container na may uniform shadow at border */}
            <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xs overflow-hidden transition-colors">
              
              {/* Tabs Navigation */}
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 px-6 pt-4 overflow-x-auto">
                {(["entries", "exits", "inside", "history"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                    className={`pb-3 text-xs font-bold transition-all relative cursor-pointer whitespace-nowrap px-4 ${
                      activeTab === tab
                        ? "text-[#0053CC] dark:text-blue-400 border-b-2 border-[#0053CC] dark:border-blue-400"
                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    }`}
                  >
                    {tab === "entries" && "Recent Entries"}
                    {tab === "exits" && "Recent Exits"}
                    {tab === "inside" && "Vehicles Currently Inside"}
                    {tab === "history" && "Access History"}
                  </button>
                ))}
              </div>

              {/* Toolbar: Search, Vehicle Type Filter, Date Picker */}
              <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    placeholder="Search plate, owner, vehicle type..."
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0053CC] transition-colors"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {/* Custom Vehicle Type Dropdown Filter */}
                  <div className="relative" ref={filterRef}>
                    <button
                      type="button"
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-xs"
                    >
                      <span>Filter: {selectedFilter}</span>
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                    </button>

                    {isFilterOpen && (
                      <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl py-1 z-30 text-xs">
                        <button
                          type="button"
                          onClick={() => { setSelectedFilter("All Vehicle"); setIsFilterOpen(false); setCurrentPage(1); }}
                          className="w-full text-left px-4 py-2 text-blue-600 dark:text-blue-400 font-bold italic border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          Clear Filter (All)
                        </button>
                        <button
                          type="button"
                          onClick={() => { setSelectedFilter("Car"); setIsFilterOpen(false); setCurrentPage(1); }}
                          className={`w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer font-medium ${
                            selectedFilter === "Car" ? "bg-blue-50 dark:bg-blue-950/40 text-[#0053CC] font-bold" : "text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          Car
                        </button>
                        <button
                          type="button"
                          onClick={() => { setSelectedFilter("Motorcycle"); setIsFilterOpen(false); setCurrentPage(1); }}
                          className={`w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer font-medium ${
                            selectedFilter === "Motorcycle" ? "bg-blue-50 dark:bg-blue-950/40 text-[#0053CC] font-bold" : "text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          Motorcycle
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Interactive Date Input Filter */}
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => { setSelectedDate(e.target.value); setCurrentPage(1); }}
                    className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none transition-colors cursor-pointer"
                  />

                  {/* Filter Action / Reset Button */}
                  <button
                    type="button"
                    onClick={handleClearAllFilters}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0053CC] text-white text-xs font-bold hover:bg-[#0042A5] transition-colors cursor-pointer shadow-xs"
                  >
                    <Filter className="h-3.5 w-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-162.5">
                  <thead className="bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3.5 px-6">Owner</th>
                      <th className="py-3.5 px-4">Plate</th>
                      
                      {activeTab === "history" ? (
                        <>
                          <th className="py-3.5 px-4">Action</th>
                          <th className="py-3.5 px-4">Date & Time</th>
                          <th className="py-3.5 px-6">Result</th>
                        </>
                      ) : (
                        <>
                          <th className="py-3.5 px-4">Vehicle Type</th>
                          {activeTab === "exits" ? (
                            <>
                              <th className="py-3.5 px-4">Exit Time</th>
                              <th className="py-3.5 px-4">Duration</th>
                            </>
                          ) : (
                            <th className="py-3.5 px-4">Entry Time</th>
                          )}
                          {activeTab === "entries" && <th className="py-3.5 px-4">Registration Source</th>}
                          <th className="py-3.5 px-6">Guard</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {currentItems.length > 0 ? (
                      currentItems.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-blue-50/40 dark:hover:bg-slate-800/60 transition-colors"
                        >
                          <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white">
                            {item.owner}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-[#0053CC] dark:text-blue-400">
                            {item.plate}
                          </td>

                          {activeTab === "history" ? (
                            <>
                              <td className="py-3.5 px-4">
                                <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                  item.action === "ENTRY" 
                                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
                                    : "bg-rose-50 text-rose-600 border border-rose-200"
                                }`}>
                                  {item.action}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-slate-500">{item.timeOrDate}</td>
                              <td className="py-3.5 px-6">
                                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                                  item.result === "GRANTED" 
                                    ? "bg-emerald-100/70 text-emerald-700" 
                                    : "bg-rose-100/70 text-rose-700"
                                }`}>
                                  {item.result}
                                </span>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="py-3.5 px-4">
                                <span
                                  className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                                    item.vehicleType === "Car"
                                      ? "bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400 border border-blue-100 dark:border-blue-900"
                                      : "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900"
                                  }`}
                                >
                                  {item.vehicleType}
                                </span>
                              </td>
                              
                              <td className="py-3.5 px-4 text-slate-500 font-medium">{item.timeOrDate}</td>

                              {activeTab === "exits" && (
                                <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">{item.duration}</td>
                              )}

                              {activeTab === "entries" && (
                                <td className="py-3.5 px-4">
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50/60 dark:bg-blue-950/40 text-[#0053CC] dark:text-blue-300 font-semibold text-[10px] border border-blue-100 dark:border-blue-900">
                                    {item.registrationSource}
                                  </span>
                                </td>
                              )}

                              <td className="py-3.5 px-6 text-slate-500">{item.guard || "James Miller"}</td>
                            </>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                          No matching records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Functional Pagination Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                <span>Showing {filteredData.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} records</span>
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
    </div>
  );
}