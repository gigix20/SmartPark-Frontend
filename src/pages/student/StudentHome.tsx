import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Car, Clock, ShieldCheck, ArrowRight, Gauge, History } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { logoutUser, getCurrentUser, type User as UserType } from "@/pages/auth/api/authApi";

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserType | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    // Verify session with backend /me endpoint (WALANG GALAW SA BACKEND LOGIC)
    getCurrentUser()
      .then((res) => {
        setCurrentUser(res.user);
        localStorage.setItem("user", JSON.stringify(res.user));
      })
      .catch(() => {
        // If token is invalid or expired, redirect to login
        logoutUser();
        navigate("/login");
      });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-28 transition-colors duration-300">
      {/* Reusable Header Component */}
      <Header currentUser={currentUser} />

      {/* Main Content Area */}
      <main className="mx-auto max-w-5xl p-4 sm:p-8 space-y-6">
        
        {/* TOP WELCOME BANNER (Responsive with Background Image & Gradient) */}
        <div className="relative overflow-hidden rounded-[28px] bg-linear-to-r from-[#0053CC] via-[#2563eb] to-[#4a80e2] text-white shadow-xl">
          <div 
            className="absolute inset-0 -z-10 bg-cover bg-right bg-no-repeat opacity-40 sm:opacity-70 mix-blend-overlay"
            style={{ backgroundImage: "url('/assets/bg-building.jpg')" }} 
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#0053CC] via-[#0053CC]/90 to-transparent sm:w-3/4 -z-10" />

          <div className="p-6 sm:p-10 flex flex-col justify-center min-h-45 sm:min-h-52.5 max-w-xl">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-xs mb-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              Account {currentUser?.accountStatus || "Active"}
            </span>
            <h1 className="font-poppins text-2xl sm:text-4xl font-extrabold tracking-tight">
              Good Morning, {currentUser?.firstName || "Student"}!
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-blue-100 font-normal leading-relaxed">
              Here&apos;s whats happening in the QCU&apos;s parking today. Monitor available slots and manage your vehicle logs in real-time.
            </p>
          </div>
        </div>

        {/* PARKING OVERVIEW CARD (Circular Progress & Stats) */}
        <div className="rounded-[24px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm transition-colors duration-300">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            
            {/* Circular Progress Graphic Simulation */}
            <div className="relative flex items-center justify-center">
              <div className="relative h-44 w-44 sm:h-48 sm:w-48 rounded-full border-16 border-slate-100 dark:border-slate-800 flex items-center justify-center">
                <div className="absolute -inset-4 rounded-full border-16 border-[#0053CC] border-t-transparent border-r-transparent -rotate-45" />
                <div className="text-center">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">65 / 100</span>
                  <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">Currently Inside</p>
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="flex items-center gap-3 self-start md:self-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400">
                <Gauge className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Parking Overview</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">QCU Main Campus Real-time Status</p>
              </div>
            </div>

            {/* Legend / Stats */}
            <div className="w-full md:w-auto space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800 min-w-50">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium text-slate-600 dark:text-slate-300">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#0053CC]" /> Occupied
                </span>
                <span className="font-bold text-slate-900 dark:text-white">65</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium text-slate-600 dark:text-slate-300">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-600" /> Available
                </span>
                <span className="font-bold text-slate-900 dark:text-white">35</span>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-slate-200/60 dark:border-slate-700 pt-2.5">
                <span className="flex items-center gap-2 font-medium text-slate-600 dark:text-slate-300">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-400" /> Total Capacity
                </span>
                <span className="font-bold text-slate-900 dark:text-white">100</span>
              </div>
            </div>

          </div>
        </div>

        {/* THREE BOTTOM CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Parking Availability Status */}
          <div className="rounded-[24px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between transition-colors duration-300">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  Parking Availability
                </h3>
              </div>
              <div className="my-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/50 py-4 text-center">
                <span className="font-poppins text-2xl font-extrabold text-amber-600 dark:text-amber-400 tracking-wide">
                  Moderate
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Remaining Slots</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">28 slots</span>
            </div>
          </div>

          {/* Card 2: My Vehicles (Mas pinalaki ang numero at pinaluwag ang vertical display para maayos tingnan) */}
          <div className="rounded-[24px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between transition-colors duration-300">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Car className="h-4 w-4 text-[#0053CC] dark:text-blue-400" /> My Vehicles
                </h3>
              </div>

              <div className="py-6 flex items-center justify-center">
                <span className="font-poppins text-5xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
                  4
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Registered Vehicles</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">4 total</span>
            </div>
          </div>

          {/* Card 3: Vehicle History Preview */}
          <div className="rounded-[24px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between transition-colors duration-300">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#0053CC] dark:text-blue-400" /> Vehicle History
                </h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-[11px] border border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">Toyota Vios (ABC-6521)</p>
                    <p className="text-[10px] text-slate-400">Oct 22, 2026 • 10:12 PM</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 font-bold text-[10px]">EXIT</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-[11px] border border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">Toyota Fortuner (XYZ-4521)</p>
                    <p className="text-[10px] text-slate-400">Oct 24, 2026 • 10:45 AM</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">ENTRANCE</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button 
                onClick={() => navigate("/history")}
                variant="ghost"
                className="w-full h-8 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-[#0053CC] dark:hover:text-blue-400 flex items-center justify-center gap-1 cursor-pointer"
              >
                <History className="h-3.5 w-3.5" /> View Full Logs <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </div>

        </div>

      </main>

      {/* Floating Bottom Navigation */}
      <BottomNav />
    </div>
  );
}