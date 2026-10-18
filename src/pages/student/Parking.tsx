import { useState } from "react";
import { Gauge, Car, Bike, Calendar, Clock, AlertTriangle } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";

export default function Parking() {
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  // State para sa Parking Forecast (Petsa at Oras)
  const [forecastDate] = useState("October 01, 2026");
  const [forecastTime] = useState("9:00 AM");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-28 transition-colors duration-300">
      {/* Top Header */}
      <Header currentUser={currentUser} />

      {/* Main Content Area */}
      <main className="mx-auto max-w-5xl p-4 sm:p-8 space-y-6">
        
        {/* PARKING INFORMATION BANNER */}
        <div className="rounded-[24px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-colors duration-300">
          <h1 className="font-poppins text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Parking Information
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Current status indicates plenty of spaces available for incoming vehicles.
          </p>
        </div>

        {/* MAIN GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* LEFT SIDE: PARKING OVERVIEW (Circular Progress Card - 5 Cols) */}
          <div className="md:col-span-5 rounded-[24px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between transition-colors duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400">
                <Gauge className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Parking Overview</h3>
            </div>

            {/* Circular Progress Graphic Simulation */}
            <div className="relative flex items-center justify-center my-4">
              <div className="relative h-44 w-44 rounded-full border-[16px] border-slate-100 dark:border-slate-800 flex items-center justify-center">
                <div className="absolute inset-[-16px] rounded-full border-[16px] border-[#0053CC] border-t-transparent border-r-transparent -rotate-45" />
                <div className="text-center">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">65 / 100</span>
                  <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">Currently Inside</p>
                </div>
              </div>
            </div>

            {/* Legend / Stats */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 mt-6">
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

          {/* RIGHT SIDE: VEHICLE TYPES, FORECAST & EXPECTED AVAILABILITY (7 Cols) */}
          <div className="md:col-span-7 space-y-6 flex flex-col justify-between">
            
            {/* Card 1: Parking by Vehicle Types */}
            <div className="rounded-[24px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-colors duration-300">
              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
                Parking by Vehicle types:
              </h4>
              <div className="grid grid-cols-2 gap-4 divide-x divide-slate-100 dark:divide-slate-800">
                {/* Cars */}
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400 shrink-0">
                    <Car className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Cars</p>
                    <p className="text-sm font-extrabold text-[#0053CC] dark:text-blue-400">
                      55 <span className="text-[11px] font-normal text-slate-400">(55.32%)</span>
                    </p>
                  </div>
                </div>

                {/* Motorcycle */}
                <div className="flex items-center gap-3 pl-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400 shrink-0">
                    <Bike className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Motorcycle</p>
                    <p className="text-sm font-extrabold text-[#0053CC] dark:text-blue-400">
                      10 <span className="text-[11px] font-normal text-slate-400">(22%)</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Parking Forecast */}
            <div className="rounded-[24px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-3 transition-colors duration-300">
              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Parking Forecast
              </h4>
              
              {/* Date Input Simulator */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-700 dark:text-slate-200">
                <span className="flex items-center gap-2 font-medium">
                  <Calendar className="h-4 w-4 text-[#0053CC] dark:text-blue-400" /> {forecastDate}
                </span>
                <span className="text-slate-400">›</span>
              </div>

              {/* Time Input Simulator */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-700 dark:text-slate-200">
                <span className="flex items-center gap-2 font-medium">
                  <Clock className="h-4 w-4 text-[#0053CC] dark:text-blue-400" /> {forecastTime}
                </span>
                <span className="text-slate-400">›</span>
              </div>
            </div>

            {/* Card 3: Expected Availability */}
            <div className="rounded-[24px] border border-amber-200/60 dark:border-amber-900/50 bg-amber-50/70 dark:bg-amber-950/20 p-6 shadow-sm transition-colors duration-300">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Expected Availability:
              </h4>
              <div className="text-center py-2">
                <span className="inline-flex items-center gap-2 font-poppins text-2xl font-extrabold text-amber-600 dark:text-amber-400 tracking-wide">
                  <AlertTriangle className="h-6 w-6" /> Moderate
                </span>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
                  Approximately 15–25 spaces available
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Parking demand is expected to be relatively high during this period.
                </p>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}