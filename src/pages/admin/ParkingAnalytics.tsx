import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Calendar, Clock, ArrowRight, Menu } from "lucide-react";
import logo from "@/assets/smartpark - favicon.svg";
import { AdminNav } from "@/components/AdminNav";

export default function ParkingAnalytics() {
  // State para sa Forecast section generator[cite: 8]
  const [forecastDate, setForecastDate] = useState("2026-09-30");
  const [forecastTime, setForecastTime] = useState("14:00 (2:00 PM)");
  const [showPrediction, setShowPrediction] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleGenerateForecast = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPrediction(true);
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
          {/* Header Title with Action */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-poppins text-xl font-bold text-slate-900 dark:text-white">Parking Analytics & Forecast</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Real-time visitor, traffic, and occupancy forecasts[cite: 8].</p>
            </div>
            <a 
              href="#forecast-section" 
              className="inline-flex items-center gap-2 rounded-xl bg-[#0053CC] px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors w-fit cursor-pointer"
            >
              <span>Generate Forecast</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Top 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition-colors">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Vehicles entering</p>
              <h3 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white mt-2">812</h3>
              <p className="text-[10px] text-slate-400 mt-1">Past 24hrs</p>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition-colors">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Vehicles exiting</p>
              <h3 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white mt-2">790</h3>
              <p className="text-[10px] text-slate-400 mt-1">Past 24hrs</p>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition-colors">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Parking demand trends</p>
              <h3 className="font-poppins text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">+5%</h3>
              <p className="text-[10px] text-slate-400 mt-1">vs previous period</p>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition-colors">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Peak parking hours</p>
              <h3 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white mt-2">10:00 AM</h3>
              <p className="text-[10px] text-slate-400 mt-1">94% occupancy</p>
            </div>
          </div>

          {/* Charts & Quick Forecast Preview Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Weekly Parking Utilization Bar Chart Mock */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs space-y-4 transition-colors">
              <div className="flex items-center justify-between">
                <h3 className="font-poppins text-sm font-bold text-slate-900 dark:text-white">Weekly Parking Utilization</h3>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                  <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-[#0053CC] dark:text-blue-400 shadow-xs">Daily</span>
                  <span className="px-2 py-0.5">Weekly</span>
                  <span className="px-2 py-0.5">Monthly</span>
                </div>
              </div>

              {/* Mock Bar Chart Graphics */}
              <div className="h-48 flex items-end justify-between gap-2 pt-6 px-2 border-b border-slate-100 dark:border-slate-800">
                {[45, 60, 85, 95, 75, 88, 65, 90, 70, 50].map((val, idx) => (
                  <div key={idx} className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg flex flex-col justify-end h-full">
                    <div 
                      className="bg-[#0053CC] dark:bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600" 
                      style={{ height: `${val}%` }}
                    ></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-medium px-2">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>

            {/* Vehicle Type Distribution */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 transition-colors">
              <h3 className="font-poppins text-sm font-bold text-slate-900 dark:text-white">Vehicle Type Distribution</h3>
              <div className="flex items-center justify-center my-auto py-4">
                <div className="relative flex items-center justify-center h-28 w-28">
                  <svg className="h-full w-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-slate-100 dark:text-slate-800" strokeWidth="3.8" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-[#0053CC] dark:text-blue-400" strokeDasharray="75, 100" strokeWidth="3.8" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute text-center">
                    <span className="font-poppins text-lg font-bold text-slate-900 dark:text-white">100</span>
                    <p className="text-[9px] text-slate-400 font-medium uppercase">total</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#0053CC] dark:bg-blue-400"></span>
                    <span className="text-slate-600 dark:text-slate-400">Cars (60%)</span>
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">60</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-300"></span>
                    <span className="text-slate-600 dark:text-slate-400">Motorcycles (40%)</span>
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">40</span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= FORECAST SECTION ================= */}
          <div id="forecast-section" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs space-y-6 pt-8 transition-colors">
            <div>
              <h2 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">Parking Forecast & Prediction</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Predict future parking occupancy based on historical data[cite: 8].</p>
            </div>

            {/* Generator Form */}
            <form onSubmit={handleGenerateForecast} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Select forecast date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="date"
                    value={forecastDate}
                    onChange={(e) => setForecastDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#0053CC]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Select forecast time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={forecastTime}
                    onChange={(e) => setForecastTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#0053CC]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="rounded-xl bg-[#0053CC] px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors h-9 cursor-pointer"
              >
                Generate Forecast
              </button>
            </form>

            {/* Prediction Results */}
            {showPrediction && (
              <div className="space-y-4 animate-fade-in pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Prediction Outcome</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Predicted vehicle count</p>
                    <h3 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white mt-1">72 vehicles</h3>
                  </div>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Predicted available spaces</p>
                    <h3 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white mt-1">28 spaces</h3>
                  </div>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Predicted availability level</p>
                    <span className="inline-block mt-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                      Moderate Availability
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 p-4 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
                  <p>
                    <strong className="text-slate-900 dark:text-white">Forecast explanation:</strong> Our predictive model indicates a peak influx based on historical data for Tuesday afternoon lunch deliveries and seasonal office occupancy rates.
                  </p>
                </div>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
