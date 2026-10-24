import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, ArrowRight, ArrowLeft } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";

export default function ParkingAnalytics() {
  const navigate = useNavigate();
  const [forecastDate, setForecastDate] = useState("2026-09-30");
  const [forecastTime, setForecastTime] = useState("14:00 (2:00 PM)");
  const [showPrediction, setShowPrediction] = useState(false);

  const handleGenerateForecast = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPrediction(true);
  };

  return (
    <AdminLayout>
      <div className="mb-2">
        <button
          type="button"
          onClick={() => navigate("/admin/parking")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#0053CC] dark:hover:text-blue-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Parking Management</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">Parking Analytics & Forecast</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Real-time visitor, traffic, and occupancy forecasts.</p>
        </div>
        <a 
          href="#forecast-section" 
          className="inline-flex items-center gap-2 rounded-xl bg-[#0053CC] px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors w-fit cursor-pointer"
        >
          <span>Generate Forecast</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="font-poppins text-sm font-bold text-slate-900 dark:text-white">Weekly Parking Utilization</h3>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-[#0053CC] dark:text-blue-400 shadow-xs">Daily</span>
              <span className="px-2 py-0.5">Weekly</span>
              <span className="px-2 py-0.5">Monthly</span>
            </div>
          </div>

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

      <div id="forecast-section" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs space-y-6 pt-8 transition-colors">
        <div>
          <h2 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">Parking Forecast & Prediction</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Predict future parking occupancy based on historical data.</p>
        </div>

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
    </AdminLayout>
  );
}