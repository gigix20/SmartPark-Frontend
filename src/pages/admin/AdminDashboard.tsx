import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Car,
  TrendingUp,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { getAdminIncidents, type IncidentItem } from "@/api/incidentApi";
import { getAdminVehicles, type Vehicle } from "@/api/vehicleApi";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [latestIncident, setLatestIncident] = useState<IncidentItem | null>(null);
  const [pendingIncidentCount, setPendingIncidentCount] = useState<number>(0);
  const [latestVehicle, setLatestVehicle] = useState<Vehicle | null>(null);
  const [pendingVehicleCount, setPendingVehicleCount] = useState<number>(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [incRes, vehRes] = await Promise.allSettled([
          getAdminIncidents({ status: "Pending", limit: 1 }),
          getAdminVehicles({ status: "Pending", limit: 1 }),
        ]);

        if (incRes.status === "fulfilled" && incRes.value.success) {
          if (incRes.value.incidents && incRes.value.incidents.length > 0) {
            setLatestIncident(incRes.value.incidents[0]);
          }
          if (incRes.value.metrics) {
            setPendingIncidentCount(incRes.value.metrics.waitingForReview);
          }
        }

        if (vehRes.status === "fulfilled" && vehRes.value.success) {
          if (vehRes.value.vehicles && vehRes.value.vehicles.length > 0) {
            setLatestVehicle(vehRes.value.vehicles[0]);
          }
          if (vehRes.value.pagination) {
            setPendingVehicleCount(vehRes.value.pagination.total);
          }
        }
      } catch (err) {
        console.error("Failed to fetch pending data for dashboard:", err);
      }
    };

    fetchDashboardData();
  }, []);
  return (
    <AdminLayout>
      <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">
        Admin Dashboard
      </h1>

      {/* Top 5 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Parking Availability</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-3 flex items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50 py-2.5 border border-emerald-100 dark:border-emerald-800">
            <span className="font-poppins text-lg font-bold text-emerald-600 dark:text-emerald-400">
              High
            </span>
          </div>
          <p className="mt-2 text-[10px] text-slate-400">+45 this week</p>
        </div>

        <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Currently Inside</span>
            <Car className="h-4 w-4 text-[#0053CC] dark:text-blue-400" />
          </div>
          <div className="mt-3">
            <h3 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white">
              30
              <span className="text-xs text-slate-400 font-normal"> / 100</span>
            </h3>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              30% occupied
            </p>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Today's Vehicle Entries</span>
            <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-3">
            <h3 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white">
              12
            </h3>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              +3 from yesterday
            </p>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Today's Vehicle Exits</span>
            <ArrowUpRight className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-3">
            <h3 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white">
              20
            </h3>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Last Exit: 9:30 PM
            </p>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Pending Incident Reports</span>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-3">
            <h3 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white">
              {pendingIncidentCount}
            </h3>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              {pendingIncidentCount === 0 ? "No pending reports" : `${pendingIncidentCount} awaiting review`}
            </p>
          </div>
        </div>
      </div>

      {/* Middle Section: Chart & Awaiting Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs lg:col-span-2 flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">
                Parking Utilization Trends
              </h3>
              <span className="text-xs text-slate-400">● Mon-Sun Usage</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Daily average occupied spaces vs capacity
            </p>
          </div>
          <div className="my-6 h-48 w-full flex items-end">
            <svg
              className="w-full h-full text-[#0053CC] dark:text-blue-400"
              viewBox="0 0 500 150"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 130 Q 100 80, 180 50 T 340 20 T 480 90"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
              />
            </svg>
          </div>
          <div className="flex justify-between text-[11px] font-medium text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs flex flex-col gap-4 transition-colors">
          <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">
            Awaiting Action
          </h3>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Pending Vehicle Registrations
              </p>
              {pendingVehicleCount > 0 && (
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                  {pendingVehicleCount} waiting
                </span>
              )}
            </div>
            {latestVehicle ? (
              <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3 space-y-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {latestVehicle.user ? `${latestVehicle.user.lastName}, ${latestVehicle.user.firstName}` : latestVehicle.owner || "Pending Owner"}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {latestVehicle.brand} {latestVehicle.model} • Plate: {latestVehicle.plateNumber || latestVehicle.plateNo}
                  </p>
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => navigate("/admin/vehicles/registration")}
                    className="rounded-lg bg-[#0053CC] px-3 py-1 text-[11px] font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Review
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-3 text-xs text-slate-400 text-center">
                No pending vehicle registrations.
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Pending Incident Reports
              </p>
              {pendingIncidentCount > 0 && (
                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">
                  {pendingIncidentCount} waiting
                </span>
              )}
            </div>
            {latestIncident ? (
              <div className="rounded-xl border border-rose-100 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/30 p-3 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-rose-700 dark:text-rose-400">
                    {latestIncident.reportType}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {latestIncident.model} • Plate {latestIncident.plate}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/admin/incidents/review/${latestIncident.id}`)}
                  className="rounded-lg bg-rose-100 dark:bg-rose-900/60 px-3 py-1.5 text-[11px] font-semibold text-rose-700 dark:text-rose-200 hover:bg-rose-200 transition-colors cursor-pointer"
                >
                  Review
                </button>
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
          <div className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0"></span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                Vehicle ABC 1234 has entered
              </span>
            </div>
            <span className="text-[11px] text-slate-400 shrink-0 ml-2">
              Just now
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0"></span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                New registration request from John Doe
              </span>
            </div>
            <span className="text-[11px] text-slate-400 shrink-0 ml-2">
              4 mins ago
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0"></span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                Incident #1042 resolved (Block B Fencing)
              </span>
            </div>
            <span className="text-[11px] text-slate-400 shrink-0 ml-2">
              12 mins ago
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-red-500 shrink-0"></span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                Security alert: Unauthorized parking in Reserved Spot #02
              </span>
            </div>
            <span className="text-[11px] text-slate-400 shrink-0 ml-2">
              25 mins ago
            </span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}