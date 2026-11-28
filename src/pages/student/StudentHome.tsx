import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, ShieldCheck, Gauge } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import {
  logoutUser,
  getCurrentUser,
  type User as UserType,
} from "@/pages/auth/api/authApi";
import {
  getStudentDashboard,
  type StudentDashboardData,
} from "@/api/studentApi";
import carIcon from "@/assets/car-icon.svg";

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserType | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [dashboardData, setDashboardData] =
    useState<StudentDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verify session with backend /me endpoint
    getCurrentUser()
      .then((res) => {
        setCurrentUser(res.user);
        localStorage.setItem("user", JSON.stringify(res.user));
      })
      .catch(() => {
        logoutUser();
        navigate("/login");
      });

    // Fetch live dashboard metrics from database
    getStudentDashboard()
      .then((data) => {
        if (data.success) {
          setDashboardData(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load student dashboard metrics:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [navigate]);

  const overview = dashboardData?.parkingOverview;
  const occupied = overview?.occupied ?? 0;
  const totalCapacity = overview?.totalCapacity ?? 0;
  const available = overview?.available ?? 0;
  const occupancyRate =
    overview?.occupancyRate ??
    (totalCapacity > 0 ? Math.round((occupied / totalCapacity) * 100) : 0);
  const availabilityLevel = overview?.availabilityLevel ?? "High";
  const remainingSlots = overview?.remainingSlots ?? available;
  const vehiclesCount = dashboardData?.vehiclesCount ?? 0;
  const recentHistory = dashboardData?.recentHistory ?? [];

  // SVG Donut Calculations
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const dashoffset =
    circumference *
    (1 - Math.min(1, Math.max(0, occupied / (totalCapacity || 1))));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-28 transition-colors duration-300">
      {/* Reusable Header */}
      <Header currentUser={currentUser} />

      {/* Main Content Area */}
      <main className="mx-auto max-w-5xl p-4 sm:p-8 space-y-6">
        {/* Welcome Section */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                <ShieldCheck className="h-4 w-4 text-[#0053CC] dark:text-blue-400 shrink-0" />
                <span>
                  Account Status: {currentUser?.accountStatus || "Active"}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-blue-400 tracking-tight">
                Welcome back, {currentUser?.firstName || "Student"}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                Monitor current campus parking spaces and review your vehicle
                activity records.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                type="button"
                onClick={() => navigate("/parking")}
                className="px-4 py-2.5 rounded-xl bg-[#0053CC] hover:bg-[#0042a5] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                View parking slots
              </button>
            </div>
          </div>
        </div>

        {/* Parking Overview Donut Chart Section */}
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs transition-colors">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Header info */}
            <div className="max-w-xs space-y-1">
              <div className="flex items-center gap-2 text-[#0053CC] dark:text-blue-400 mb-1">
                <Gauge className="h-5 w-5" />
                <span className="text-xs font-semibold">Campus Capacity</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Parking Overview
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Live space distribution across university designated parking
                bays for students and staff.
              </p>
            </div>

            {/* Donut Chart Display */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <div className="relative flex items-center justify-center">
                <svg className="h-44 w-44 -rotate-90" viewBox="0 0 140 140">
                  {/* Background Track */}
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-slate-100 dark:text-slate-800"
                  />
                  {/* Active Progress Ring */}
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    fill="transparent"
                    stroke="#0053CC"
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>

                <div className="absolute text-center select-none">
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {occupied} / {totalCapacity}
                  </span>
                  <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                    {occupancyRate}% Occupied
                  </p>
                </div>
              </div>

              {/* Data Breakdown Table / List */}
              <div className="w-full sm:w-56 space-y-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-[#0053CC]" />
                    Occupied Slots
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {occupied}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                    Available Slots
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {available}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/70 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">
                    Total Campus Bays
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {totalCapacity}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Metric Cards: Availability, Vehicles, Recent History */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Parking Availability Status */}
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between transition-colors">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Parking Availability
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Campus entry condition
              </p>

              <div className="my-5 rounded-xl p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
                <span
                  className={`text-xl font-bold tracking-tight ${
                    availabilityLevel === "High"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : availabilityLevel === "Moderate"
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {availabilityLevel === "High"
                    ? "Ample Space"
                    : availabilityLevel}
                </span>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  {remainingSlots} open slots remaining
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                Available bays
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {available} slots
              </span>
            </div>
          </section>

          {/* Card 2: Registered Vehicles Count */}
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between transition-colors">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Registered Vehicles
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Permitted for campus entry
                  </p>
                </div>
                <img
                  src={carIcon}
                  alt="Vehicle icon"
                  className="h-5 w-auto object-contain opacity-80"
                />
              </div>

              <div className="py-6 flex items-baseline justify-center gap-1.5">
                <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                  {vehiclesCount}
                </span>
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                  {vehiclesCount === 1 ? "vehicle" : "vehicles"}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => navigate("/vehicles")}
                className="text-xs font-semibold text-[#0053CC] dark:text-blue-400 hover:underline cursor-pointer"
              >
                Manage vehicles
              </button>
            </div>
          </section>

          {/* Card 3: Recent Vehicle Gate Activity */}
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between transition-colors">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-[#0053CC] dark:text-blue-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Gate Activity
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Latest gate scans
              </p>

              <div className="space-y-2">
                {isLoading ? (
                  <div className="py-5 text-center text-xs text-slate-400">
                    Loading records...
                  </div>
                ) : recentHistory.length > 0 ? (
                  recentHistory.slice(0, 2).map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {item.vehicleTitle}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {item.dateTime}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          item.action === "EXIT"
                            ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                            : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {item.action === "EXIT" ? "Exit" : "Entry"}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-5 text-center text-[11px] text-slate-400">
                    No recent gate activity found.
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => navigate("/reports")}
                className="text-xs font-semibold text-[#0053CC] dark:text-blue-400 hover:underline cursor-pointer"
              >
                View incident reports
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Floating Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
