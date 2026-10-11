import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  ParkingSquare, 
  AlertTriangle, 
  FileText, 
  LogOut, 
  ChevronDown,
  X,
  Sun,
  Moon
} from "lucide-react";

interface AdminNavProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminNav({ isOpen = false, onClose }: AdminNavProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  // States para sa Dropdowns at Logout Modal
  const [isVehiclesOpen, setIsVehiclesOpen] = useState(false);
  const [isParkingOpen, setIsParkingOpen] = useState(false);
  const [isIncidentsOpen, setIsIncidentsOpen] = useState(false);
  const [isAccessOpen, setIsAccessOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (location.pathname.startsWith("/admin/vehicles")) {
      setIsVehiclesOpen(true);
    }
    if (location.pathname.startsWith("/admin/parking")) {
      setIsParkingOpen(true);
    }
    if (location.pathname.startsWith("/admin/incidents")) {
      setIsIncidentsOpen(true);
    }
    if (location.pathname.startsWith("/admin/access-records")) {
      setIsAccessOpen(true);
    }
  }, [location.pathname]);

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    navigate("/");
  };

  // Dark Mode State at Handler
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <>
      {/* Mobile Backdrop Overlay kapag bukas ang drawer */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar - Responsive para sa Mobile at Desktop */}
      <aside className={`w-64 fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between p-4 font-sans select-none overflow-y-auto z-50 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <div className="space-y-6">
          
          <nav className="space-y-1 text-xs">
            
            {/* Dashboard */}
            <Link
              to="/admin/dashboard"
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${
                isActive("/admin/dashboard")
                  ? "bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400 font-semibold"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>

            {/* Accounts */}
            <Link
              to="/admin/accounts"
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${
                isActive("/admin/accounts")
                  ? "bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400 font-semibold"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Users className="h-4 w-4" />
              Accounts
            </Link>

            {/* Vehicles Dropdown */}
            <div className={`space-y-1 rounded-xl transition-colors ${
              location.pathname.startsWith("/admin/vehicles") ? "bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400 font-semibold" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}>
              <div className="flex items-center justify-between px-3 py-2.5">
                <Link
                  to="/admin/vehicles"
                  onClick={onClose}
                  className="flex items-center gap-3 flex-1 font-medium"
                >
                  <Car className="h-4 w-4" />
                  <span>Vehicles</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsVehiclesOpen(!isVehiclesOpen)}
                  className="p-1 hover:bg-slate-200/60 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition-colors"
                  aria-label="Toggle Vehicles Menu"
                >
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isVehiclesOpen ? "rotate-180" : ""}`} />
                </button>
              </div>

              {isVehiclesOpen && (
                <div className="pl-9 pr-3 pb-2 space-y-1">
                  <Link
                    to="/admin/vehicles"
                    onClick={onClose}
                    className={`block py-1.5 font-medium transition-colors ${
                      isActive("/admin/vehicles") ? "text-[#0053CC] dark:text-blue-400 font-semibold" : "text-slate-500 dark:text-slate-400 hover:text-[#0053CC] dark:hover:text-blue-400"
                    }`}
                  >
                    Vehicle Management
                  </Link>
                  <Link
                    to="/admin/vehicles/registration"
                    onClick={onClose}
                    className={`block py-1.5 font-medium transition-colors ${
                      isActive("/admin/vehicles/registration") ? "text-[#0053CC] dark:text-blue-400 font-semibold" : "text-slate-500 dark:text-slate-400 hover:text-[#0053CC] dark:hover:text-blue-400"
                    }`}
                  >
                    Vehicle Registration
                  </Link>
                </div>
              )}
            </div>

            {/* Parking Dropdown */}
            <div className={`space-y-1 rounded-xl transition-colors ${
              location.pathname.startsWith("/admin/parking") ? "bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400 font-semibold" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}>
              <div className="flex items-center justify-between px-3 py-2.5">
                <Link
                  to="/admin/parking"
                  onClick={onClose}
                  className="flex items-center gap-3 flex-1 font-medium"
                >
                  <ParkingSquare className="h-4 w-4" />
                  <span>Parking</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsParkingOpen(!isParkingOpen)}
                  className="p-1 hover:bg-slate-200/60 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition-colors"
                  aria-label="Toggle Parking Menu"
                >
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isParkingOpen ? "rotate-180" : ""}`} />
                </button>
              </div>

              {isParkingOpen && (
                <div className="pl-9 pr-3 pb-2 space-y-1">
                  <Link
                    to="/admin/parking"
                    onClick={onClose}
                    className={`block py-1.5 font-medium transition-colors ${
                      isActive("/admin/parking") ? "text-[#0053CC] dark:text-blue-400 font-semibold" : "text-slate-500 dark:text-slate-400 hover:text-[#0053CC] dark:hover:text-blue-400"
                    }`}
                  >
                    Parking Management
                  </Link>
                  <Link
                    to="/admin/parking/capacity"
                    onClick={onClose}
                    className={`block py-1.5 font-medium transition-colors ${
                      isActive("/admin/parking/capacity") ? "text-[#0053CC] dark:text-blue-400 font-semibold" : "text-slate-500 dark:text-slate-400 hover:text-[#0053CC] dark:hover:text-blue-400"
                    }`}
                  >
                    Parking Capacity
                  </Link>
                  <Link
                    to="/admin/parking/history"
                    onClick={onClose}
                    className={`block py-1.5 font-medium transition-colors ${
                      isActive("/admin/parking/history") ? "text-[#0053CC] dark:text-blue-400 font-semibold" : "text-slate-500 dark:text-slate-400 hover:text-[#0053CC] dark:hover:text-blue-400"
                    }`}
                  >
                    Parking History
                  </Link>
                  <Link
                    to="/admin/parking/analytics"
                    onClick={onClose}
                    className={`block py-1.5 font-medium transition-colors ${
                      isActive("/admin/parking/analytics") ? "text-[#0053CC] dark:text-blue-400 font-semibold" : "text-slate-500 dark:text-slate-400 hover:text-[#0053CC] dark:hover:text-blue-400"
                    }`}
                  >
                    Analytics & Forecast
                  </Link>
                </div>
              )}
            </div>

            {/* Incidents Dropdown */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setIsIncidentsOpen(!isIncidentsOpen)}
                className={`flex w-full items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-colors ${
                  location.pathname.startsWith("/admin/incidents")
                    ? "bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400 font-semibold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Incidents</span>
                </div>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isIncidentsOpen ? "rotate-180" : ""}`} />
              </button>

              {isIncidentsOpen && (
                <div className="pl-9 space-y-1 pt-1">
                  <Link
                    to="/admin/incidents"
                    onClick={onClose}
                    className={`block py-1.5 font-medium transition-colors ${
                      isActive("/admin/incidents") ? "text-[#0053CC] dark:text-blue-400 font-semibold" : "text-slate-500 dark:text-slate-400 hover:text-[#0053CC] dark:hover:text-blue-400"
                    }`}
                  >
                    Incident History
                  </Link>
                </div>
              )}
            </div>

            {/* Access & Records Dropdown */}
            <div className={`space-y-1 rounded-xl transition-colors ${
              location.pathname.startsWith("/admin/access-records") ? "bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400 font-semibold" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}>
              <div className="flex items-center justify-between px-3 py-2.5">
                <Link
                  to="/admin/access-records"
                  onClick={onClose}
                  className="flex items-center gap-3 flex-1 font-medium"
                >
                  <FileText className="h-4 w-4" />
                  <span>Access & Records</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsAccessOpen(!isAccessOpen)}
                  className="p-1 hover:bg-slate-200/60 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition-colors"
                  aria-label="Toggle Access Menu"
                >
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isAccessOpen ? "rotate-180" : ""}`} />
                </button>
              </div>

              {isAccessOpen && (
                <div className="pl-9 pr-3 pb-2 space-y-1">
                  <Link
                    to="/admin/access-records"
                    onClick={onClose}
                    className={`block py-1.5 font-medium transition-colors ${
                      isActive("/admin/access-records") ? "text-[#0053CC] dark:text-blue-400 font-semibold" : "text-slate-500 dark:text-slate-400 hover:text-[#0053CC] dark:hover:text-blue-400"
                    }`}
                  >
                    Access Records
                  </Link>
                  <Link
                    to="/admin/access-records/history"
                    onClick={onClose}
                    className={`block py-1.5 font-medium transition-colors ${
                      isActive("/admin/access-records/history") ? "text-[#0053CC] dark:text-blue-400 font-semibold" : "text-slate-500 dark:text-slate-400 hover:text-[#0053CC] dark:hover:text-blue-400"
                    }`}
                  >
                    Access History
                  </Link>
                </div>
              )}
            </div>

          </nav>
        </div>

        {/* Bottom Section: Dark Mode Toggle & Logout Button */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-1">
          {/* Dark Mode Toggle Button */}
          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 cursor-pointer"
          >
            {isDarkMode ? (
              <>
                <Sun className="h-4 w-4 shrink-0 text-amber-400" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 shrink-0 text-slate-500" />
                <span>Dark Mode</span>
              </>
            )}
          </button>

          {/* Logout Button */}
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 active:bg-rose-100 transition-all duration-200 cursor-pointer group"
          >
            <LogOut className="h-4 w-4 text-rose-500 group-hover:translate-x-0.5 transition-transform" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
                <LogOut className="h-5 w-5" />
              </div>
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">Log out confirmation</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Are you sure you want to log out from SmartPark system?
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 transition-colors shadow-xs cursor-pointer"
              >
                Yes, Log out
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}