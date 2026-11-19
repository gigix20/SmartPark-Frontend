import { useState } from "react";
import {
  Calendar,
  Clock,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import carIcon from "@/assets/car-icon.svg";
import motorIcon from "@/assets/motor-icon.svg";

interface ForecastResult {
  level: "Low" | "Moderate" | "High";
  spacesRange: string;
  description: string;
}

export default function Parking() {
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  // Current Occupancy Data (pwedeng i-connect sa API)
  const occupied = 65;
  const totalCapacity = 100;
  const available = totalCapacity - occupied;

  const carsCount = 55;
  const carsPercentage = "59.32%";

  const motorcycleCount = 10;
  const motorcyclePercentage = "22%";

  // Parking Forecast States
  const [selectedDate, setSelectedDate] = useState("2026-10-01");
  const [selectedTime, setSelectedTime] = useState("09:00");

  // SVG Donut Chart Calculations
  const radius = 66;
  const circumference = 2 * Math.PI * radius;
  const occupancyRatio = Math.min(1, Math.max(0, occupied / totalCapacity));
  const strokeDashoffset = circumference * (1 - occupancyRatio);

  // Format date display (e.g. "October 01, 2026")
  const formatDisplayDate = (isoDate: string) => {
    if (!isoDate) return "Select date";
    const [year, month, day] = isoDate.split("-").map(Number);
    const dateObj = new Date(year, month - 1, day);
    return dateObj.toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });
  };

  // Format time display (e.g. "9:00 AM")
  const formatDisplayTime = (time24: string) => {
    if (!time24) return "Select time";
    const [hourStr, minuteStr] = time24.split(":");
    const hour = Number(hourStr);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12}:${minuteStr} ${period}`;
  };

  // Dynamic Forecast Calculation batay sa napiling oras
  const getForecast = (time24: string): ForecastResult => {
    const hour = Number(time24.split(":")[0] || 9);

    if (hour >= 10 && hour <= 14) {
      return {
        level: "Low",
        spacesRange: "5–14 spaces",
        description: "Peak campus hours — parking spaces are nearly full during this period",
      };
    }

    if ((hour >= 8 && hour < 10) || (hour > 14 && hour <= 17)) {
      return {
        level: "Moderate",
        spacesRange: "15–25 spaces",
        description: "Parking demand is expected to be relatively high during this period",
      };
    }

    return {
      level: "High",
      spacesRange: "40–65 spaces",
      description: "Off-peak hours — plenty of open parking spaces expected",
    };
  };

  const forecast = getForecast(selectedTime);

  const forecastStyles = {
    Moderate: {
      container:
        "bg-[#F6E8D2] dark:bg-amber-950/35 border-[#E8C58E] dark:border-amber-800/70",
      titleColor: "text-[#E69500] dark:text-amber-400",
      icon: AlertTriangle,
    },
    Low: {
      container:
        "bg-rose-50 dark:bg-rose-950/35 border-rose-200 dark:border-rose-800/70",
      titleColor: "text-rose-600 dark:text-rose-400",
      icon: XCircle,
    },
    High: {
      container:
        "bg-emerald-50 dark:bg-emerald-950/35 border-emerald-200 dark:border-emerald-800/70",
      titleColor: "text-emerald-600 dark:text-emerald-400",
      icon: CheckCircle2,
    },
  }[forecast.level];

  const ForecastIcon = forecastStyles.icon;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-32 transition-colors duration-300">
      {/* Top Header (Unchanged) */}
      <Header currentUser={currentUser} />

      {/* Main Content Area */}
      <main className="mx-auto max-w-5xl p-4 sm:p-8 space-y-6">
        {/* BANNER HEADER */}
        <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs transition-colors duration-300">
          <h1 className="font-poppins text-xl sm:text-2xl font-extrabold text-[#0053CC] dark:text-blue-400">
            Parking Information
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Current status indicates plenty of spaces available for incoming vehicles.
          </p>
        </div>

        {/* MAIN 2-COLUMN ANALYTICS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT COLUMN: OCCUPANCY RING CARD */}
          <div className="lg:col-span-5 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs flex flex-col justify-between transition-colors duration-300">
            {/* Circular Donut Progress */}
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative flex items-center justify-center w-48 h-48">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                  {/* Background Track */}
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="16"
                    className="text-slate-100 dark:text-slate-800"
                  />
                  {/* Active Blue Arc */}
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="none"
                    stroke="#1166D8"
                    strokeWidth="16"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="butt"
                    className="transition-all duration-500"
                  />
                </svg>

                {/* Center Ratio Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <div className="font-poppins text-2xl sm:text-3xl font-extrabold tracking-tight">
                    <span className="text-slate-900 dark:text-white">{occupied}</span>
                    <span className="text-slate-400 dark:text-slate-500 font-bold">
                      {" "}
                      / {totalCapacity}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                    Currently Inside
                  </span>
                </div>
              </div>
            </div>

            {/* Occupancy Breakdown List */}
            <div className="space-y-3.5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="h-3.5 w-3.5 rounded-full bg-[#1166D8] inline-block shrink-0" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Occupied
                  </span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {occupied}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="h-3.5 w-3.5 rounded-full bg-slate-300 dark:bg-slate-600 inline-block shrink-0" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Available
                  </span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {available}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="h-3.5 w-3.5 rounded-full bg-slate-300 dark:bg-slate-600 inline-block shrink-0" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Total Capacity
                  </span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {totalCapacity}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: 3 STACKED CARDS */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-4">
            {/* CARD 1: Parking by Vehicle types */}
            <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs transition-colors duration-300">
              <h2 className="font-poppins text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-4">
                Parking by Vehicle types:
              </h2>

              <div className="grid grid-cols-2 divide-x divide-slate-200 dark:divide-slate-800">
                {/* Cars Column */}
                <div className="pr-4 sm:pr-6 space-y-1.5">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 p-1.5">
                    <img
                      src={carIcon}
                      alt="Car Icon"
                      className="h-7 w-7 object-contain"
                    />
                  </div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 pt-1">
                    Cars
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {carsCount}{" "}
                    <span className="text-xs font-normal text-slate-400">
                      ({carsPercentage})
                    </span>
                  </p>
                </div>

                {/* Motorcycle Column */}
                <div className="pl-4 sm:pl-6 space-y-1.5">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-950/50 p-1.5">
                    <img
                      src={motorIcon}
                      alt="Motorcycle Icon"
                      className="h-7 w-7 object-contain"
                    />
                  </div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 pt-1">
                    Motorcycle
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {motorcycleCount}{" "}
                    <span className="text-xs font-normal text-slate-400">
                      ({motorcyclePercentage})
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* CARD 2: Parking Forecast */}
            <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs space-y-3 transition-colors duration-300">
              <h2 className="font-poppins text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Parking Forecast
              </h2>

              {/* Date Picker Row */}
              <label className="relative flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Calendar className="h-4 w-4 text-slate-600 dark:text-slate-300 shrink-0" />
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    {formatDisplayDate(selectedDate)}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  aria-label="Select forecast date"
                />
              </label>

              {/* Time Picker Row */}
              <label className="relative flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Clock className="h-4 w-4 text-slate-600 dark:text-slate-300 shrink-0" />
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    {formatDisplayTime(selectedTime)}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  aria-label="Select forecast time"
                />
              </label>
            </div>

            {/* CARD 3: Expected Availability */}
            <div
              className={`rounded-2xl border-2 p-5 sm:p-6 shadow-xs transition-colors duration-300 ${forecastStyles.container}`}
            >
              <h2 className="font-poppins text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Expected Availability:
              </h2>

              <div className="flex flex-col items-center justify-center text-center py-3 space-y-1.5">
                <div
                  className={`flex items-center gap-2 font-poppins text-xl sm:text-2xl font-extrabold ${forecastStyles.titleColor}`}
                >
                  <ForecastIcon className="h-6 w-6 shrink-0" />
                  <span>{forecast.level}</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Approximately{" "}
                  <span className="font-bold text-slate-900 dark:text-white">
                    {forecast.spacesRange}
                  </span>{" "}
                  available
                </p>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  {forecast.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}