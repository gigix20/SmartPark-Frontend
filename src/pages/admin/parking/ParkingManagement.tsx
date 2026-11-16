import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Settings, History, BarChart2, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import CarIcon from "@/assets/car-icon.svg";
import MotorIcon from "@/assets/motor-icon.svg";
import { getParkingOverview, type ParkingOverviewData } from "@/api/parkingApi";

export default function ParkingManagement() {
  const [overview, setOverview] = useState<ParkingOverviewData>({
    totalCapacity: 100,
    totalOccupied: 0,
    availableSpaces: 100,
    occupancyRate: 0,
    cars: {
      capacity: 60,
      parked: 0,
      available: 60,
      occupancyRate: 0,
    },
    motorcycles: {
      capacity: 40,
      parked: 0,
      available: 40,
      occupancyRate: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOverview = async (showRefreshSpinner = false) => {
    try {
      if (showRefreshSpinner) setIsRefreshing(true);
      const res = await getParkingOverview();
      if (res.success && res.data) {
        setOverview(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch parking overview:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">Parking Management</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Live occupancy based on vehicles currently inside.</p>
        </div>
        <button
          onClick={() => fetchOverview(true)}
          disabled={isRefreshing || isLoading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer disabled:opacity-60"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-[#0053CC]" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {isLoading ? (
        <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 flex flex-col items-center justify-center text-center space-y-3">
          <Loader2 className="h-8 w-8 text-[#0053CC] animate-spin" />
          <p className="text-xs text-slate-500 dark:text-slate-400">Loading live occupancy data...</p>
        </div>
      ) : (
        <>
          {/* Main Occupancy Card */}
          <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center gap-8 transition-colors">
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
                  strokeDasharray={`${Math.min(overview.occupancyRate, 100)}, 100`}
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="font-poppins text-xl font-bold text-slate-900 dark:text-white">
                  {overview.occupancyRate}%
                </span>
                <span className="text-[10px] font-medium text-slate-400">full</span>
              </div>
            </div>

            <div className="space-y-3 w-full text-center sm:text-left">
              <p className="text-xs font-semibold text-slate-400">Available spaces</p>
              <div className="flex items-baseline justify-center sm:justify-start gap-1.5">
                <span className="font-poppins text-4xl font-extrabold text-slate-900 dark:text-white">
                  {overview.availableSpaces}
                </span>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  / {overview.totalCapacity} total spaces
                </span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-6 pt-1 text-xs font-medium">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#0053CC] dark:bg-blue-400"></span>
                  <span className="text-slate-600 dark:text-slate-300">{overview.totalOccupied} occupied</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span className="text-slate-500 dark:text-slate-400">{overview.availableSpaces} available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Category Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between space-y-4 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400 rounded-xl flex items-center justify-center">
                    <img src={CarIcon} alt="Car" className="h-5 w-5 object-contain" />
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Cars</span>
                </div>
                <div className="text-right">
                  <span className="font-poppins text-2xl font-bold text-slate-900 dark:text-white">
                    {overview.cars.available}
                  </span>
                  <span className="text-xs text-slate-400"> / {overview.cars.capacity} spaces</span>
                </div>
              </div>
              <div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0053CC] dark:bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(overview.cars.occupancyRate, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-2">
                  <span>{overview.cars.parked} parked now</span>
                  <span>{overview.cars.available} available</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between space-y-4 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400 rounded-xl flex items-center justify-center">
                    <img src={MotorIcon} alt="Motorcycle" className="h-5 w-5 object-contain" />
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Motorcycles</span>
                </div>
                <div className="text-right">
                  <span className="font-poppins text-2xl font-bold text-slate-900 dark:text-white">
                    {overview.motorcycles.available}
                  </span>
                  <span className="text-xs text-slate-400"> / {overview.motorcycles.capacity} spaces</span>
                </div>
              </div>
              <div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0053CC] dark:bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(overview.motorcycles.occupancyRate, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-2">
                  <span>{overview.motorcycles.parked} parked now</span>
                  <span>{overview.motorcycles.available} available</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Action Cards Section */}
      <div className="space-y-4 pt-2">
        <h2 className="font-poppins text-base font-bold text-slate-900 dark:text-white">What would you like to do?</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="group rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
                  <Settings className="h-5 w-5" />
                </div>
                <h3 className="font-poppins text-sm font-bold text-slate-900 dark:text-white">Manage Parking Capacity</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Configure threshold capacities for cars and motorcycles, edit parameters and alert profiles.
              </p>
            </div>
            <Link
              to="/admin/parking/capacity"
              className="inline-flex items-center justify-between rounded-xl bg-[#0053CC] px-4 py-3 text-xs font-bold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] cursor-pointer w-full group/btn"
            >
              <span>Configure Capacity</span>
              <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="group rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
                  <History className="h-5 w-5" />
                </div>
                <h3 className="font-poppins text-sm font-bold text-slate-900 dark:text-white">View Parking History</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Inspect access transaction history, view timestamps of entries, exits, plate registers and gate locations.
              </p>
            </div>
            <Link
              to="/admin/parking/history"
              className="inline-flex items-center justify-between rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white transition-all hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98] cursor-pointer w-full group/btn"
            >
              <span>Audit Logs</span>
              <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="group rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-xl group-hover:scale-110 transition-transform">
                  <BarChart2 className="h-5 w-5" />
                </div>
                <h3 className="font-poppins text-sm font-bold text-slate-900 dark:text-white">View Parking Analytics</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Investigate high occupancy periods, view distribution of vehicle types, and forecast busy checkpoint hours.
              </p>
            </div>
            <Link
              to="/admin/parking/analytics"
              className="inline-flex items-center justify-between rounded-xl bg-purple-600 px-4 py-3 text-xs font-bold text-white transition-all hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/25 active:scale-[0.98] cursor-pointer w-full group/btn"
            >
              <span>Open Analytics</span>
              <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}