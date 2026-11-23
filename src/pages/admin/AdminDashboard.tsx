import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Car,
  TrendingUp,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import {
  getAdminDashboard,
  type DashboardData,
  type DayOfWeek,
} from "@/api/dashboardApi";

const DAYS: DayOfWeek[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboard = useCallback(async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const res = await getAdminDashboard();
      if (res.success && res.data) {
        setDashboard(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch admin dashboard data:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Generate dynamic SVG path for weekly utilization curve
  const renderTrendPath = () => {
    if (!dashboard) return "M 30 130 L 470 130";

    const counts = DAYS.map((d) => dashboard.trends.weeklyUtilization[d] || 0);
    const max = Math.max(...counts, 1);

    const points = counts.map((count, i) => {
      const x = 30 + i * (440 / 6);
      const y = 130 - (count / max) * 90;
      return { x, y };
    });

    return points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, "");
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">
            Admin Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Live operations overview, parking occupancy, and pending actions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchDashboard(true)}
          disabled={isLoading || isRefreshing}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors w-fit shadow-xs cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-[#0053CC] dark:text-blue-400 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>{isRefreshing ? "Refreshing..." : "Refresh Data"}</span>
        </button>
      </div>

      {isLoading ? (
        <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-16 flex flex-col items-center justify-center text-center space-y-3">
          <Loader2 className="h-8 w-8 text-[#0053CC] animate-spin" />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Loading live dashboard metrics from database...
          </p>
        </div>
      ) : dashboard ? (
        <>
          {/* Top 5 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* 1. Parking Availability */}
            <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-xs transition-colors">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                <span>Parking Availability</span>
                {dashboard.metrics.availabilityStatus === "High" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                )}
              </div>
              <div className={`mt-3 flex items-center justify-center rounded-xl py-2.5 border ${
                dashboard.metrics.availabilityStatus === "High"
                  ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-100 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400"
                  : dashboard.metrics.availabilityStatus === "Moderate"
                  ? "bg-amber-50 dark:bg-amber-950/50 border-amber-100 dark:border-amber-800 text-amber-600 dark:text-amber-400"
                  : "bg-rose-50 dark:bg-rose-950/50 border-rose-100 dark:border-rose-800 text-rose-600 dark:text-rose-400"
              }`}>
                <span className="font-poppins text-lg font-bold">
                  {dashboard.metrics.availabilityStatus}
                </span>
              </div>
              <p className="mt-2 text-[10px] text-slate-400 font-medium">
                {dashboard.metrics.availableSpaces} spaces available
              </p>
            </div>

            {/* 2. Currently Inside */}
            <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-xs transition-colors">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                <span>Currently Inside</span>
                <Car className="h-4 w-4 text-[#0053CC] dark:text-blue-400" />
              </div>
              <div className="mt-3">
                <h3 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white">
                  {dashboard.metrics.currentlyInside}
                  <span className="text-xs text-slate-400 font-normal">
                    {" "}
                    / {dashboard.metrics.totalCapacity}
                  </span>
                </h3>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  {dashboard.metrics.occupancyRate}% occupied
                </p>
              </div>
            </div>

            {/* 3. Today's Vehicle Entries */}
            <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-xs transition-colors">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                <span>Today's Vehicle Entries</span>
                <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="mt-3">
                <h3 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white">
                  {dashboard.metrics.todayEntries}
                </h3>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  Logged entries today
                </p>
              </div>
            </div>

            {/* 4. Today's Vehicle Exits */}
            <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-xs transition-colors">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                <span>Today's Vehicle Exits</span>
                <ArrowUpRight className="h-4 w-4 text-amber-500" />
              </div>
              <div className="mt-3">
                <h3 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white">
                  {dashboard.metrics.todayExits}
                </h3>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  {dashboard.metrics.lastExitTimeFormatted}
                </p>
              </div>
            </div>

            {/* 5. Pending Incident Reports */}
            <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-xs transition-colors">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                <span>Pending Incident Reports</span>
                <AlertTriangle className="h-4 w-4 text-rose-500" />
              </div>
              <div className="mt-3">
                <h3 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white">
                  {dashboard.metrics.pendingIncidentCount}
                </h3>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  {dashboard.metrics.pendingIncidentCount === 0
                    ? "No pending reports"
                    : `${dashboard.metrics.pendingIncidentCount} awaiting review`}
                </p>
              </div>
            </div>
          </div>

          {/* Middle Section: Chart & Awaiting Action */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart: Parking Utilization Trends */}
            <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs lg:col-span-2 flex flex-col justify-between transition-colors">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">
                    Parking Utilization Trends
                  </h3>
                  <span className="text-xs text-slate-400">
                    ● Mon-Sun Usage ({dashboard.trends.totalWeeklyLogs} total logs)
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Daily live entry volume from the past 7 days
                </p>
              </div>

              <div className="my-6 h-48 w-full flex flex-col justify-end">
                <svg
                  className="w-full h-full text-[#0053CC] dark:text-blue-400"
                  viewBox="0 0 500 150"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d={renderTrendPath()}
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  {DAYS.map((d, i) => {
                    const counts = DAYS.map(
                      (k) => dashboard.trends.weeklyUtilization[k] || 0
                    );
                    const max = Math.max(...counts, 1);
                    const val = dashboard.trends.weeklyUtilization[d] || 0;
                    const cx = 30 + i * (440 / 6);
                    const cy = 130 - (val / max) * 90;
                    return (
                      <circle
                        key={d}
                        cx={cx}
                        cy={cy}
                        r="4"
                        className="fill-[#0053CC] dark:fill-blue-400 stroke-white dark:stroke-slate-900 stroke-2"
                      />
                    );
                  })}
                </svg>
              </div>

              <div className="flex justify-between text-[11px] font-semibold text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2 px-2">
                {DAYS.map((day) => (
                  <div key={day} className="flex flex-col items-center">
                    <span>{day}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                      {dashboard.trends.weeklyUtilization[day] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Awaiting Action Card */}
            <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs flex flex-col gap-4 transition-colors">
              <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">
                Awaiting Action
              </h3>

              {/* Pending Vehicle Registrations */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Pending Vehicle Registrations
                  </p>
                  {dashboard.awaitingAction.pendingVehicleCount > 0 && (
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                      {dashboard.awaitingAction.pendingVehicleCount} waiting
                    </span>
                  )}
                </div>

                {dashboard.awaitingAction.pendingVehicles.length > 0 ? (
                  <div className="space-y-2">
                    {dashboard.awaitingAction.pendingVehicles.map((veh) => (
                      <div key={veh.id} className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3 flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {veh.ownerName}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {veh.brand} {veh.model} • Plate: {veh.plateNumber}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigate("/admin/vehicles/registration")}
                          className="rounded-lg bg-[#0053CC] px-3 py-1 text-[11px] font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
                        >
                          Review
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-3 text-xs text-slate-400 text-center">
                    No pending vehicle registrations.
                  </div>
                )}
              </div>

              {/* Pending Incident Reports */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Pending Incident Reports
                  </p>
                  {dashboard.awaitingAction.pendingIncidentCount > 0 && (
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">
                      {dashboard.awaitingAction.pendingIncidentCount} waiting
                    </span>
                  )}
                </div>

                {dashboard.awaitingAction.pendingIncidents.length > 0 ? (
                  <div className="space-y-2">
                    {dashboard.awaitingAction.pendingIncidents.map((inc) => (
                      <div key={inc.id} className="rounded-xl border border-rose-100 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/30 p-3 flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-rose-700 dark:text-rose-400">
                            {inc.reportType}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {inc.model} • Plate {inc.plate}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/incidents/review/${inc.id}`)}
                          className="rounded-lg bg-rose-100 dark:bg-rose-900/60 px-3 py-1.5 text-[11px] font-semibold text-rose-700 dark:text-rose-200 hover:bg-rose-200 transition-colors cursor-pointer"
                        >
                          Review
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-3 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        No Pending Incidents
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        All submitted reports have been reviewed.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate("/admin/incidents")}
                      className="rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      View All
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs transition-colors">
            <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3 text-xs">
              {dashboard.recentActivities.length > 0 ? (
                dashboard.recentActivities.map((act) => (
                  <div
                    key={act.id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3 hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`h-2.5 w-2.5 rounded-full ${act.dotColor} shrink-0`}></span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {act.title}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0 ml-2 font-mono">
                      {act.time}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400 italic">
                  No recent activities recorded yet.
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-3xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 p-8 text-center text-xs text-red-600 dark:text-red-400">
          Failed to load dashboard data from the database. Please try refreshing.
        </div>
      )}
    </AdminLayout>
  );
}