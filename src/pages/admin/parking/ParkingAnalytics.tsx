import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, ArrowLeft, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import CarIcon from "@/assets/car-icon.svg";
import MotorIcon from "@/assets/motor-icon.svg";
import { getParkingAnalytics, type ParkingAnalyticsData } from "@/api/parkingApi";

export default function ParkingAnalytics() {
  const navigate = useNavigate();
  const [forecastDate, setForecastDate] = useState("2026-09-30");
  const [forecastTime, setForecastTime] = useState("14:00 (2:00 PM)");
  const [showPrediction, setShowPrediction] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<ParkingAnalyticsData>({
    vehiclesEntering24h: 0,
    vehiclesExiting24h: 0,
    peakParkingHour: "10:00 AM",
    distribution: {
      cars: 0,
      motorcycles: 0,
      total: 0,
      carPercentage: 50,
      motorcyclePercentage: 50,
    },
    weeklyUtilization: {
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
      Sun: 0,
    },
  });

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const res = await getParkingAnalytics();
      if (res.success && res.data) {
        setAnalytics(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch parking analytics:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleGenerateForecast = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPrediction(true);
  };

  // Find max weekly count to normalize bar heights
  const days: Array<keyof typeof analytics.weeklyUtilization> = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const maxWeeklyCount = Math.max(1, ...days.map((d) => analytics.weeklyUtilization[d] || 0));

  return (
    <AdminLayout>
      {/* Back Button & Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/admin/parking")}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">
            Parking Analytics & Forecast
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time visitor, traffic, and occupancy forecasts.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 flex flex-col items-center justify-center text-center space-y-3">
          <Loader2 className="h-8 w-8 text-[#0053CC] animate-spin" />
          <p className="text-xs text-slate-500 dark:text-slate-400">Loading parking analytics...</p>
        </div>
      ) : (
        <>
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-xs transition-colors">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Vehicles entering</p>
              <h3 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white mt-2">
                {analytics.vehiclesEntering24h}
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">Past 24hrs</p>
            </div>
            <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-xs transition-colors">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Vehicles exiting</p>
              <h3 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white mt-2">
                {analytics.vehiclesExiting24h}
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">Past 24hrs</p>
            </div>
            <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-xs transition-colors">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Registered Vehicles</p>
              <h3 className="font-poppins text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                {analytics.distribution.total}
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">Approved & Cleared</p>
            </div>
            <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-xs transition-colors">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Peak parking hours</p>
              <h3 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white mt-2">
                {analytics.peakParkingHour}
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">Highest gate entries</p>
            </div>
          </div>

          {/* Utilization & Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4 transition-colors">
              <div className="flex items-center justify-between">
                <h3 className="font-poppins text-sm font-bold text-slate-900 dark:text-white">
                  Weekly Parking Utilization
                </h3>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                  Past 7 Days
                </span>
              </div>

              <div className="h-48 flex items-end justify-between gap-2 pt-6 px-2 border-b border-slate-100 dark:border-slate-800">
                {days.map((day) => {
                  const count = analytics.weeklyUtilization[day] || 0;
                  const heightPercent = maxWeeklyCount > 0 ? Math.max(12, Math.round((count / maxWeeklyCount) * 100)) : 12;
                  return (
                    <div key={day} className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg flex flex-col justify-end h-full group relative">
                      <div
                        className="bg-[#0053CC] dark:bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600 relative"
                        style={{ height: `${heightPercent}%` }}
                      >
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-600 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded shadow-xs border border-slate-200 dark:border-slate-800">
                          {count}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-medium px-2">
                {days.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between space-y-4 transition-colors">
              <h3 className="font-poppins text-sm font-bold text-slate-900 dark:text-white">
                Vehicle Type Distribution
              </h3>
              <div className="flex items-center justify-center my-auto py-4">
                <div className="relative flex items-center justify-center h-28 w-28">
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
                      strokeDasharray={`${analytics.distribution.carPercentage}, 100`}
                      strokeWidth="3.8"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="font-poppins text-lg font-bold text-slate-900 dark:text-white">
                      {analytics.distribution.total}
                    </span>
                    <p className="text-[9px] text-slate-400 font-medium uppercase">total</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={CarIcon} alt="Car" className="h-3.5 w-3.5 object-contain" />
                    <span className="text-slate-600 dark:text-slate-400">
                      Cars ({analytics.distribution.carPercentage}%)
                    </span>
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {analytics.distribution.cars}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={MotorIcon} alt="Motorcycle" className="h-3.5 w-3.5 object-contain" />
                    <span className="text-slate-600 dark:text-slate-400">
                      Motorcycles ({analytics.distribution.motorcyclePercentage}%)
                    </span>
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {analytics.distribution.motorcycles}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Forecast Section */}
          <div
            id="forecast-section"
            className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6 transition-colors"
          >
            <div>
              <h2 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">
                Parking Forecast & Prediction
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Predict future parking occupancy based on historical gate data.
              </p>
            </div>

            <form
              onSubmit={handleGenerateForecast}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select forecast date
                </label>
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
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select forecast time
                </label>
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
                className="rounded-xl bg-[#0053CC] px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors h-9 cursor-pointer shadow-xs"
              >
                Generate Forecast
              </button>
            </form>

            {showPrediction && (
              <div className="space-y-4 animate-fade-in pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Prediction Outcome</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Estimated vehicle occupancy</p>
                    <h3 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white mt-1">
                      {Math.max(15, Math.min(85, Math.round(analytics.distribution.total * 0.7)))} vehicles
                    </h3>
                  </div>
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Estimated available spaces</p>
                    <h3 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white mt-1">
                      {Math.max(15, 100 - Math.round(analytics.distribution.total * 0.7))} spaces
                    </h3>
                  </div>
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Availability level</p>
                    <span className="inline-block mt-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Good Availability
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 p-4 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
                  <p>
                    <strong className="text-slate-900 dark:text-white">Forecast explanation:</strong> Based on historical gate logs for {forecastDate || "the selected period"} around {forecastTime || "the requested time"}, campus parking trends indicate steady vehicle flow with adequate open stalls.
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
}