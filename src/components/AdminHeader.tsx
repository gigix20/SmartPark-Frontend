import { Link, useLocation } from "react-router-dom";
import { Bell, Menu, Clock, Calendar, Sun, Moon } from "lucide-react";
import logo from "@/assets/smartpark - favicon.svg";
import { useState, useEffect } from "react";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const location = useLocation();
  const isNotificationActive = location.pathname === "/admin/notifications";
  const isProfileActive = location.pathname === "/admin/profile" || location.pathname === "/profile";

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Live Manila Time State
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Mag-update bawat segundo para gumalaw ang oras nang live
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format para sa Petsa (Asia/Manila Timezone)
  const dateString = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(currentDateTime);

  // Format para sa Oras (Asia/Manila Timezone)
  const timeString = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  }).format(currentDateTime);

  return (
    <header className="sticky top-0 z-50 h-16 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md px-4 sm:px-6 transition-colors duration-300">
      <div className="flex h-full items-center justify-between">
        
        {/* Left Side: Logo */}
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link to="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center p-1.5 rounded-xl bg-white border border-slate-200/80 dark:border-slate-700/80 shadow-xs group-hover:scale-105 transition-transform">
                <img src={logo} alt="SmartPark Logo" className="h-7 w-auto object-contain rounded-md" />
            </div>
            <div className="flex flex-col">
              <span className="font-poppins text-base font-extrabold tracking-wider text-slate-900 dark:text-white group-hover:text-[#0053CC] dark:group-hover:text-blue-400 transition-colors">
                SMARTPARK
              </span>
              <span className="text-[9px] font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase -mt-1">
                Control Center
              </span>
            </div>
          </Link>
        </div>

        {/* Right Side: Live Manila Date/Time Badge, Notifications, Theme Toggle, & Profile */}
        <div className="flex items-center gap-3 sm:gap-5">
          
          <div className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 text-xs">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span className="font-poppins font-medium tracking-tight">{dateString}</span>
            </div>
            <span className="h-3 w-px bg-slate-300 dark:bg-slate-700"></span>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span className="font-poppins font-bold tracking-tight">{timeString}</span>
            </div>
          </div>

          {/* Notification Bell na may Active State */}
          <Link 
            to="/admin/notifications"
            className={`relative p-2.5 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center ${
              isNotificationActive
                ? "bg-[#0053CC] text-white shadow-md shadow-blue-600/30"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
            }`}
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </Link>

          {/* Theme Toggle Button sa Header */}
          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-amber-400" />
            ) : (
              <Moon className="h-5 w-5 text-slate-600" />
            )}
          </button>

          <span className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></span>

          {/* Profile Link na may Active State */}
          <Link 
            to="/admin/profile" 
            className={`flex items-center gap-3 group rounded-xl p-1 sm:pr-2.5 transition-all ${
              isProfileActive 
                ? "bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 shadow-xs" 
                : "hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
            }`}
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                alt="Admin Profile"
                className="h-9 w-9 rounded-xl object-cover border-2 border-slate-200 dark:border-slate-700 shadow-xs group-hover:border-[#0053CC] transition-colors"
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
            </div>

            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#0053CC] dark:group-hover:text-blue-400 transition-colors">
                John Doe
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                Super Admin
              </span>
            </div>
          </Link>

        </div>
      </div>
    </header>
  );
}