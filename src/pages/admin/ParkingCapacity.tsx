import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Menu } from "lucide-react";
import logo from "@/assets/smartpark - favicon.svg";
import { AdminNav } from "@/components/AdminNav";

export default function ParkingCapacity() {
  // States para sa Capacity inputs[cite: 9]
  const [carCapacity, setCarCapacity] = useState<number>(60);
  const [motorcycleCapacity, setMotorcycleCapacity] = useState<number>(40);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Static values base sa kasalukuyang nakaparada[cite: 9]
  const carParked = 38;
  const motorcycleParked = 19;
  const totalOccupied = carParked + motorcycleParked; // 57[cite: 9]

  // Computed total capacity[cite: 9]
  const totalCapacity = (Number(carCapacity) || 0) + (Number(motorcycleCapacity) || 0);

  // Computed utilization percentage[cite: 9]
  const utilizationPercentage = totalCapacity > 0 
    ? Math.round((totalOccupied / totalCapacity) * 100) 
    : 0;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Parking capacity updated successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 font-sans relative transition-colors">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-6 transition-colors">
        <div className="flex items-center gap-3">
          {/* Hamburger Menu Button para sa Mobile */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <img src={logo} alt="SmartPark Logo" className="h-8 w-auto object-contain rounded-lg bg-white p-1" />
            <span className="font-poppins text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              SMARTPARK
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden text-right sm:block">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Tue, Sep 29, 2026</p>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">10:21:15 PM</p>
          </div>

          <button type="button" className="relative rounded-full p-2 text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          <Link 
            to="/admin/profile" 
            className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-4 sm:pl-6 group hover:opacity-80 transition-opacity"
          >
            <div className="hidden text-right md:block">
              <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#0053CC] transition-colors">John Doe</p>
              <p className="text-[10px] font-semibold text-emerald-600">Admin</p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
              alt="Admin Profile"
              className="h-9 w-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
            />
          </Link>
        </div>
      </header>

      <div className="flex">
        {/* Responsive Admin Sidebar */}
        <AdminNav isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Main Content Area na may responsive margins at padding */}
        <main className="flex-1 ml-0 lg:ml-64 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto overflow-x-hidden">
          <div>
            <h1 className="font-poppins text-xl font-bold text-slate-900 dark:text-white">Manage Parking Capacity</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Update the number of spaces for cars and motorcycles.</p>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Total Capacity */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition-colors">
              <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">Total capacity</p>
              <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{totalCapacity}</h3>
              <p className="text-[10px] font-medium text-slate-400 mt-1">Total configured stalls</p>
            </div>

            {/* Car Capacity */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition-colors">
              <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">Car capacity</p>
              <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{carParked}</h3>
              <p className="text-[10px] font-medium text-slate-400 mt-1">Inside now</p>
            </div>

            {/* Motorcycle Capacity */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition-colors">
              <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">Motorcycle capacity</p>
              <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{motorcycleParked}</h3>
              <p className="text-[10px] font-medium text-slate-400 mt-1">Inside now</p>
            </div>

            {/* Total Occupied */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition-colors">
              <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">Total Occupied</p>
              <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{totalOccupied}</h3>
              <p className="text-[10px] font-medium text-slate-400 mt-1">Inside now</p>
            </div>

          </div>

          {/* Utilization Percentage Progress Card */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-3 transition-colors">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#0053CC] dark:text-blue-400 border-b-2 border-[#0053CC] dark:border-blue-400 pb-1">Utilization Percentage</span>
              <span className="text-slate-500 dark:text-slate-400 font-semibold">{utilizationPercentage}% used</span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#0053CC] dark:bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Form Card: Update Capacity */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-6 transition-colors">
            <div>
              <h2 className="font-poppins text-sm font-bold text-[#0053CC] dark:text-blue-400">Update capacity</h2>
              <p className="text-xs text-slate-400">Specify the maximum vehicle stall thresholds.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-4 max-w-full">
              {/* Car capacity Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Car capacity<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={carCapacity}
                  onChange={(e) => setCarCapacity(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#0053CC] dark:border-blue-500 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-100 text-slate-800 dark:text-white"
                  required
                />
              </div>

              {/* Motorcycle capacity Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Motorcycle capacity<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={motorcycleCapacity}
                  onChange={(e) => setMotorcycleCapacity(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs focus:outline-none focus:border-[#0053CC] text-slate-800 dark:text-white"
                  required
                />
              </div>

              {/* Total capacity (Calculated - Read only) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Total capacity (calculated)
                </label>
                <input
                  type="number"
                  value={totalCapacity}
                  readOnly
                  className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 text-xs text-slate-500 dark:text-slate-400 cursor-not-allowed focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setCarCapacity(60);
                    setMotorcycleCapacity(40);
                  }}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#0053CC] px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Save capacity
                </button>
              </div>
            </form>
          </div>

        </main>
      </div>
    </div>
  );
}