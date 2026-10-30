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
} from "lucide-react";
import { logoutUser } from "@/pages/auth/api/authApi";

interface AdminNavProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminNav({ isOpen = false, onClose }: AdminNavProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const [isVehiclesOpen, setIsVehiclesOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (location.pathname.startsWith("/admin/vehicles")) {
      setIsVehiclesOpen(true);
    } else {
      setIsVehiclesOpen(false);
    }
  }, [location.pathname]);

  const handleConfirmLogout = () => {
    logoutUser();
    setShowLogoutModal(false);
    navigate("/login");
  };

  return (
    <>
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden animate-in fade-in"
        />
      )}

      <aside className={`w-64 fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white dark:bg-[#0B0F19] text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80 flex flex-col justify-between p-4 font-sans select-none overflow-y-auto z-40 transition-colors duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        
        <div className="space-y-6 pt-2">
          <nav className="space-y-6 text-xs">
            
            <div className="space-y-1">
              <Link
                to="/admin/dashboard"
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all duration-200 ${
                  isActive("/admin/dashboard")
                    ? "bg-[#0053CC] text-white shadow-md shadow-blue-600/30"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <LayoutDashboard className="h-4 w-4 shrink-0" />
                <span>Dashboard</span>
              </Link>
            </div>

            <div className="space-y-1.5">
              <p className="px-3 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                Operations
              </p>

              <Link
                to="/admin/accounts"
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  isActive("/admin/accounts")
                    ? "bg-[#0053CC] text-white font-bold shadow-md shadow-blue-600/30"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Users className="h-4 w-4 shrink-0" />
                <span>Accounts</span>
              </Link>

              {/* Vehicles Menu */}
              <div className="space-y-1">
                <div className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 ${
                  location.pathname.startsWith("/admin/vehicles") 
                    ? "bg-[#0053CC] text-white font-bold shadow-md shadow-blue-600/30" 
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                }`}>
                  <Link
                    to="/admin/vehicles"
                    onClick={onClose}
                    className="flex items-center gap-3 flex-1"
                  >
                    <Car className="h-4 w-4 shrink-0" />
                    <span>Vehicles</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setIsVehiclesOpen(!isVehiclesOpen)}
                    className="p-1 hover:bg-white/20 rounded-lg cursor-pointer transition-colors"
                    aria-label="Toggle Vehicles Menu"
                  >
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isVehiclesOpen ? "rotate-180" : ""}`} />
                  </button>
                </div>

                {isVehiclesOpen && (
                  <div className="pl-7 pr-2 pt-1.5 space-y-1 text-xs">
                    <Link
                      to="/admin/vehicles/registration"
                      onClick={onClose}
                      className={`block py-2 px-3 rounded-xl transition-colors ${
                        isActive("/admin/vehicles/registration") 
                          ? "bg-blue-50 dark:bg-blue-950/40 text-[#0053CC] dark:text-blue-400 font-bold" 
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 font-medium"
                      }`}
                    >
                      Vehicle Registration
                    </Link>
                  </div>
                )}
              </div>

              {/* Parking Menu */}
              <Link
                to="/admin/parking"
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  location.pathname.startsWith("/admin/parking")
                    ? "bg-[#0053CC] text-white font-bold shadow-md shadow-blue-600/30"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <ParkingSquare className="h-4 w-4 shrink-0" />
                <span>Parking</span>
              </Link>

              {/* Incidents Menu (Ginawang startsWith para saklaw pati ang review/history sub-pages) */}
              <Link
                to="/admin/incidents"
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  location.pathname.startsWith("/admin/incidents")
                    ? "bg-[#0053CC] text-white font-bold shadow-md shadow-blue-600/30"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>Incidents</span>
              </Link>
            </div>

            <div className="space-y-1.5">
              <p className="px-3 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                System Control
              </p>

              {/* Access & Records Menu */}
              <Link
                to="/admin/access-records"
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  location.pathname.startsWith("/admin/access-records")
                    ? "bg-[#0053CC] text-white font-bold shadow-md shadow-blue-600/30"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <FileText className="h-4 w-4 shrink-0" />
                <span>Access & Records</span>
              </Link>
            </div>

          </nav>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all cursor-pointer group"
          >
            <LogOut className="h-4 w-4 text-rose-600 dark:text-rose-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative overflow-hidden bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-200">
            
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
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Are you sure you want to log out from SmartPark system?
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.98] transition-all shadow-md shadow-rose-500/20 cursor-pointer"
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