import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Settings, History, BarChart2, Car, Bike, Menu } from "lucide-react";
import logo from "@/assets/smartpark - favicon.svg";
import { AdminNav } from "@/components/AdminNav";

export default function ParkingManagement() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
            <img src={logo} alt="SmartPark Logo" className="h-8 w-auto object-contain rounded-lg bg-white p-1"/>
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
            <h1 className="font-poppins text-xl font-bold text-slate-900 dark:text-white">Parking Management</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Live occupancy based on vehicles currently inside.</p>
          </div>

          {/* Main Occupancy Card */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center gap-8 transition-colors">
            {/* Donut Progress Gauge */}
            <div className="relative flex items-center justify-center h-32 w-32 shrink-0">
              <svg className="h-full w-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100 dark:text-slate-800"
                  strokeWidth="3.8"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#0053CC] dark:text-blue-400"
                  strokeDasharray="57, 100"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="font-poppins text-xl font-bold text-slate-900 dark:text-white">57%</span>
                <span className="text-[10px] font-medium text-slate-400">full</span>
              </div>
            </div>

            {/* Occupancy Info */}
            <div className="space-y-3 w-full text-center sm:text-left">
              <p className="text-xs font-semibold text-slate-400">Available spaces</p>
              <div className="flex items-baseline justify-center sm:justify-start gap-1.5">
                <span className="font-poppins text-4xl font-extrabold text-slate-900 dark:text-white">43</span>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">/ 100 total spaces</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-6 pt-1 text-xs font-medium">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#0053CC] dark:bg-blue-400"></span>
                  <span className="text-slate-600 dark:text-slate-300">57 occupied</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span className="text-slate-500 dark:text-slate-400">43 available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Category Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cars Card */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col justify-between space-y-4 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400 rounded-xl">
                    <Car className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Cars</span>
                </div>
                <div className="text-right">
                  <span className="font-poppins text-2xl font-bold text-slate-900 dark:text-white">22</span>
                  <span className="text-xs text-slate-400"> / 60 spaces</span>
                </div>
              </div>
              <div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0053CC] dark:bg-blue-500 w-[63%] rounded-full"></div>
                </div>
                <div className="flex justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-2">
                  <span>38 parked now</span>
                  <span>22 available</span>
                </div>
              </div>
            </div>

            {/* Motorcycles Card */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col justify-between space-y-4 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400 rounded-xl">
                    <Bike className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Motorcycles</span>
                </div>
                <div className="text-right">
                  <span className="font-poppins text-2xl font-bold text-slate-900 dark:text-white">21</span>
                  <span className="text-xs text-slate-400"> / 40 spaces</span>
                </div>
              </div>
              <div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0053CC] dark:bg-blue-500 w-[47.5%] rounded-full"></div>
                </div>
                <div className="flex justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-2">
                  <span>19 parked now</span>
                  <span>21 available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Cards Section */}
          <div className="space-y-4 pt-2">
            <h2 className="font-poppins text-base font-bold text-slate-900 dark:text-white">What would you like to do?</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Manage Capacity */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between space-y-4 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400 rounded-lg">
                      <Settings className="h-4 w-4" />
                    </div>
                    <h3 className="font-poppins text-sm font-bold text-slate-900 dark:text-white">Manage Parking Capacity</h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Configure threshold capacities for cars and motorcycles, edit parameters and alert profiles.
                  </p>
                </div>
                <Link
                  to="/admin/parking/capacity"
                  className="inline-flex items-center justify-center rounded-xl bg-[#0053CC] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-blue-700 w-fit cursor-pointer"
                >
                  Configure Capacity
                </Link>
              </div>

              {/* View History */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between space-y-4 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-lg">
                      <History className="h-4 w-4" />
                    </div>
                    <h3 className="font-poppins text-sm font-bold text-slate-900 dark:text-white">View Parking History</h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Inspect access transaction history, view timestamps of entries, exits, plate registers and gate locations.
                  </p>
                </div>
                <Link
                  to="/admin/parking/history"
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-emerald-700 w-fit cursor-pointer"
                >
                  Audit Logs
                </Link>
              </div>

              {/* View Analytics */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between space-y-4 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-lg">
                      <BarChart2 className="h-4 w-4" />
                    </div>
                    <h3 className="font-poppins text-sm font-bold text-slate-900 dark:text-white">View Parking Analytics</h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Investigate high occupancy periods, view distribution of vehicle types, and forecast busy checkpoint hours.
                  </p>
                </div>
                <Link
                  to="/admin/parking/analytics"
                  className="inline-flex items-center justify-center rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-purple-700 w-fit cursor-pointer"
                >
                  Open Analytics
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}