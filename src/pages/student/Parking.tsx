import { useState, useRef, useEffect, useMemo } from "react";
import {
  Calendar,
  Clock,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Check,
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

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Generate time slots from 7:00 AM to 9:00 PM (every 30 mins)
const TIME_SLOTS: { value: string; label: string }[] = (() => {
  const slots: { value: string; label: string }[] = [];
  for (let hour = 7; hour <= 21; hour++) {
    for (const minute of [0, 30]) {
      if (hour === 21 && minute > 0) break;
      const hh = String(hour).padStart(2, "0");
      const mm = String(minute).padStart(2, "0");
      const value = `${hh}:${mm}`;
      const period = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 === 0 ? 12 : hour % 12;
      const label = `${hour12}:${mm} ${period}`;
      slots.push({ value, label });
    }
  }
  return slots;
})();

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date.getFullYear(), date.getMonth() + months, date.getDate());
  if (d.getMonth() !== (((date.getMonth() + months) % 12) + 12) % 12) {
    return new Date(date.getFullYear(), date.getMonth() + months + 1, 0);
  }
  return d;
}

export default function Parking() {
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  // Current Occupancy Data
  const occupied = 65;
  const totalCapacity = 100;
  const available = totalCapacity - occupied;

  const carsCount = 55;
  const carsPercentage = "59.32%";

  const motorcycleCount = 10;
  const motorcyclePercentage = "22%";

  // Date bounds: Today up to 2 months from now
  const minDate = useMemo(() => startOfDay(new Date()), []);
  const maxDate = useMemo(() => startOfDay(addMonths(minDate, 2)), [minDate]);

  const [selectedDate, setSelectedDate] = useState<string>(() => toDateKey(minDate));
  const [selectedTime, setSelectedTime] = useState<string>("09:00");

  // Custom calendar & time dropdown states
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState<Date>(
    () => new Date(minDate.getFullYear(), minDate.getMonth(), 1)
  );

  const calendarContainerRef = useRef<HTMLDivElement>(null);
  const timeContainerRef = useRef<HTMLDivElement>(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarContainerRef.current &&
        !calendarContainerRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false);
      }
    };
    if (isCalendarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCalendarOpen]);

  // Close time menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        timeContainerRef.current &&
        !timeContainerRef.current.contains(event.target as Node)
      ) {
        setIsTimeOpen(false);
      }
    };
    if (isTimeOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isTimeOpen]);

  // SVG Donut Chart Calculations
  const radius = 66;
  const circumference = 2 * Math.PI * radius;
  const occupancyRatio = Math.min(1, Math.max(0, occupied / totalCapacity));
  const strokeDashoffset = circumference * (1 - occupancyRatio);

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

  const formatDisplayTime = (time24: string) => {
    const matched = TIME_SLOTS.find((s) => s.value === time24);
    if (matched) return matched.label;

    const [hourStr, minuteStr] = time24.split(":");
    let hour = Number(hourStr);
    if (hour < 7) hour = 7;
    if (hour > 21) hour = 21;
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12}:${minuteStr || "00"} ${period}`;
  };

  // Calendar grid days for viewMonth
  const calendarCells = useMemo(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: { date: Date | null; key: string }[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push({ date: null, key: `empty-${i}` });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      cells.push({ date: d, key: toDateKey(d) });
    }
    return cells;
  }, [viewMonth]);

  const canGoPrevMonth =
    viewMonth.getFullYear() > minDate.getFullYear() ||
    (viewMonth.getFullYear() === minDate.getFullYear() &&
      viewMonth.getMonth() > minDate.getMonth());

  const canGoNextMonth =
    viewMonth.getFullYear() < maxDate.getFullYear() ||
    (viewMonth.getFullYear() === maxDate.getFullYear() &&
      viewMonth.getMonth() < maxDate.getMonth());

  const handlePrevMonth = () => {
    if (!canGoPrevMonth) return;
    setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    if (!canGoNextMonth) return;
    setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const isDateDisabled = (date: Date) => {
    const d = startOfDay(date);
    return d < minDate || d > maxDate;
  };

  // Dynamic Forecast Calculation batay sa napiling oras (7 AM - 9 PM)
  const getForecast = (time24: string): ForecastResult => {
    const hour = Number(time24.split(":")[0] || 9);

    if (hour >= 10 && hour <= 14) {
      return {
        level: "Low",
        spacesRange: "5–14 spaces",
        description: "Peak campus hours — parking spaces are nearly full during this period",
      };
    }

    if ((hour >= 7 && hour < 10) || (hour > 14 && hour <= 18)) {
      return {
        level: "Moderate",
        spacesRange: "15–25 spaces",
        description: "Parking demand is expected to be relatively high during this period",
      };
    }

    return {
      level: "High",
      spacesRange: "40–65 spaces",
      description: "Evening hours — plenty of open parking spaces expected until 9:00 PM",
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
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="16"
                    className="text-slate-100 dark:text-slate-800"
                  />
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
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-poppins text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Parking Forecast
                </h2>
                <span className="text-[10px] font-semibold text-[#0053CC] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-100 dark:border-blue-900/60">
                  Up to 2 mos • 7AM–9PM
                </span>
              </div>

              {/* Custom SmartPark Calendar Picker */}
              <div ref={calendarContainerRef} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsCalendarOpen((prev) => !prev);
                    setIsTimeOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
                  aria-expanded={isCalendarOpen}
                  aria-label="Select forecast date"
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar className="h-4 w-4 text-[#0053CC] dark:text-blue-400 shrink-0" />
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                      {formatDisplayDate(selectedDate)}
                    </span>
                  </div>
                  <ChevronRight
                    className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isCalendarOpen ? "rotate-90 text-[#0053CC] dark:text-blue-400" : ""
                    }`}
                  />
                </button>

                {isCalendarOpen && (
                  <div className="absolute left-0 right-0 mt-2 z-40 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-xl space-y-3 animate-in fade-in zoom-in-95">
                    {/* Month Header */}
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={handlePrevMonth}
                        disabled={!canGoPrevMonth}
                        className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer"
                        aria-label="Previous month"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      <span className="font-poppins text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}
                      </span>

                      <button
                        type="button"
                        onClick={handleNextMonth}
                        disabled={!canGoNextMonth}
                        className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer"
                        aria-label="Next month"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Weekday Labels */}
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {WEEKDAYS.map((day) => (
                        <span
                          key={day}
                          className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 py-1"
                        >
                          {day}
                        </span>
                      ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {calendarCells.map((cell) => {
                        if (!cell.date) {
                          return <div key={cell.key} className="h-8" />;
                        }

                        const disabled = isDateDisabled(cell.date);
                        const isSelected = selectedDate === cell.key;
                        const isToday = toDateKey(cell.date) === toDateKey(minDate);

                        return (
                          <button
                            key={cell.key}
                            type="button"
                            disabled={disabled}
                            onClick={() => {
                              setSelectedDate(cell.key);
                              setIsCalendarOpen(false);
                            }}
                            className={`h-8 w-full rounded-xl text-xs font-semibold transition-all flex items-center justify-center relative ${
                              isSelected
                                ? "bg-[#0053CC] text-white font-bold shadow-xs cursor-pointer"
                                : disabled
                                ? "text-slate-300 dark:text-slate-700 cursor-not-allowed"
                                : "text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-[#0053CC] dark:hover:text-blue-400 cursor-pointer"
                            }`}
                          >
                            {cell.date.getDate()}
                            {isToday && !isSelected && (
                              <span className="h-1 w-1 rounded-full bg-[#0053CC] dark:bg-blue-400 absolute bottom-1" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Footer Range Info */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Selectable: {formatDisplayDate(toDateKey(minDate))}</span>
                      <span>Max: {formatDisplayDate(toDateKey(maxDate))}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Custom Styled Time Picker (Strictly 7:00 AM - 9:00 PM) */}
              <div ref={timeContainerRef} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsTimeOpen((prev) => !prev);
                    setIsCalendarOpen(false);
                  }}
                  aria-expanded={isTimeOpen}
                  aria-label="Select forecast time between 7:00 AM and 9:00 PM"
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Clock className="h-4 w-4 text-[#0053CC] dark:text-blue-400 shrink-0" />
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                      {formatDisplayTime(selectedTime)}
                    </span>
                  </div>
                  <ChevronRight
                    className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isTimeOpen ? "rotate-90 text-[#0053CC] dark:text-blue-400" : ""
                    }`}
                  />
                </button>

                {isTimeOpen && (
                  <div className="absolute left-0 right-0 mt-2 z-40 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 shadow-xl animate-in fade-in zoom-in-95">
                    <div className="px-2.5 py-1.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Available Hours
                      </span>
                      <span className="text-[10px] font-semibold text-[#0053CC] dark:text-blue-400">
                        7:00 AM – 9:00 PM
                      </span>
                    </div>

                    <div className="max-h-56 overflow-y-auto space-y-0.5 pr-0.5">
                      {TIME_SLOTS.map((slot) => {
                        const active = selectedTime === slot.value;
                        return (
                          <button
                            key={slot.value}
                            type="button"
                            onClick={() => {
                              setSelectedTime(slot.value);
                              setIsTimeOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                              active
                                ? "bg-[#0053CC] text-white font-bold shadow-xs"
                                : "text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-[#0053CC] dark:hover:text-blue-400 font-medium"
                            }`}
                          >
                            <span>{slot.label}</span>
                            {active && <Check className="h-3.5 w-3.5 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
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