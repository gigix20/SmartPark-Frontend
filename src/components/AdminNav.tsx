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
  X 
} from "lucide-react";

export function AdminNav() {
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

  return (
    <>
      <aside className="w-64 fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-slate-200 flex flex-col justify-between p-4 font-sans select-none overflow-y-auto z-40">
        <div className="space-y-6">
          
          <nav className="space-y-1 text-xs">
            
            {/* Dashboard */}
            <Link
              to="/admin/dashboard"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${
                isActive("/admin/dashboard")
                  ? "bg-blue-50 text-[#0053CC] font-semibold"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>

            {/* Accounts */}
            <Link
              to="/admin/accounts"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${
                isActive("/admin/accounts")
                  ? "bg-blue-50 text-[#0053CC] font-semibold"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Users className="h-4 w-4" />
              Accounts
            </Link>

            {/* Vehicles Dropdown */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setIsVehiclesOpen(!isVehiclesOpen)}
                className={`flex w-full items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-colors ${
                  location.pathname.startsWith("/admin/vehicles")
                    ? "bg-blue-50 text-[#0053CC] font-semibold"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Car className="h-4 w-4" />
                  <span>Vehicles</span>
                </div>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isVehiclesOpen ? "rotate-180" : ""}`} />
              </button>

              {isVehiclesOpen && (
                <div className="pl-9 space-y-1 pt-1">
                  <Link
                    to="/admin/vehicles"
                    className={`block py-1.5 font-medium transition-colors ${
                      isActive("/admin/vehicles") ? "text-[#0053CC] font-semibold" : "text-slate-500 hover:text-[#0053CC]"
                    }`}
                  >
                    Vehicle Management
                  </Link>
                  <Link
                    to="/admin/vehicles/registration"
                    className={`block py-1.5 font-medium transition-colors ${
                      isActive("/admin/vehicles/registration") ? "text-[#0053CC] font-semibold" : "text-slate-500 hover:text-[#0053CC]"
                    }`}
                  >
                    Vehicle Registration
                  </Link>
                </div>
              )}
            </div>

            {/* Parking Dropdown */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setIsParkingOpen(!isParkingOpen)}
                className={`flex w-full items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-colors ${
                  location.pathname.startsWith("/admin/parking")
                    ? "bg-blue-50 text-[#0053CC] font-semibold"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <ParkingSquare className="h-4 w-4" />
                  <span>Parking</span>
                </div>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isParkingOpen ? "rotate-180" : ""}`} />
              </button>

              {isParkingOpen && (
                <div className="pl-9 space-y-1 pt-1">
                  <Link
                    to="/admin/parking/capacity"
                    className={`block py-1.5 font-medium transition-colors ${
                      isActive("/admin/parking/capacity") ? "text-[#0053CC] font-semibold" : "text-slate-500 hover:text-[#0053CC]"
                    }`}
                  >
                    Parking Capacity
                  </Link>
                  <Link
                    to="/admin/parking/history"
                    className={`block py-1.5 font-medium transition-colors ${
                      isActive("/admin/parking/history") ? "text-[#0053CC] font-semibold" : "text-slate-500 hover:text-[#0053CC]"
                    }`}
                  >
                    Parking History
                  </Link>
                  <Link
                    to="/admin/parking/analytics"
                    className={`block py-1.5 font-medium transition-colors ${
                      isActive("/admin/parking/analytics") ? "text-[#0053CC] font-semibold" : "text-slate-500 hover:text-[#0053CC]"
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
                    ? "bg-blue-50 text-[#0053CC] font-semibold"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
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
                    className={`block py-1.5 font-medium transition-colors ${
                      isActive("/admin/incidents") ? "text-[#0053CC] font-semibold" : "text-slate-500 hover:text-[#0053CC]"
                    }`}
                  >
                    Incident History
                  </Link>
                </div>
              )}
            </div>

            {/* Access & Records Dropdown (Kasama ang Main Page at Access History) */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setIsAccessOpen(!isAccessOpen)}
                className={`flex w-full items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-colors ${
                  location.pathname.startsWith("/admin/access-records")
                    ? "bg-blue-50 text-[#0053CC] font-semibold"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4" />
                  <span>Access & Records</span>
                </div>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isAccessOpen ? "rotate-180" : ""}`} />
              </button>

              {isAccessOpen && (
                <div className="pl-9 space-y-1 pt-1">
                  <Link
                    to="/admin/access-records"
                    className={`block py-1.5 font-medium transition-colors ${
                      location.pathname === "/admin/access-records"
                        ? "text-[#0053CC] font-semibold"
                        : "text-slate-500 hover:text-[#0053CC]"
                    }`}
                  >
                    Access Records
                  </Link>
                  <Link
                    to="/admin/access-records/history"
                    className={`block py-1.5 font-medium transition-colors ${
                      isActive("/admin/access-records/history")
                        ? "text-[#0053CC] font-semibold"
                        : "text-slate-500 hover:text-[#0053CC]"
                    }`}
                  >
                    Access History
                  </Link>
                </div>
              )}
            </div>

          </nav>
        </div>

        {/* Logout Button */}
        <div className="pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 active:bg-rose-100 transition-all duration-200 cursor-pointer group"
          >
            <LogOut className="h-4 w-4 text-rose-500 group-hover:translate-x-0.5 transition-transform" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
                <LogOut className="h-5 w-5" />
              </div>
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <h3 className="font-poppins text-base font-bold text-slate-900">Log out confirmation</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to log out from SmartPark system?
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 transition-colors shadow-xs"
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