import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  QrCode, 
  UserPlus, 
  MonitorCheck, 
  LogOut, 
  X,
} from "lucide-react";

interface GuardNavProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function GuardNav({ isOpen = false, onClose }: GuardNavProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Nilo-lock ang background scroll kapag bukas ang Logout Modal
  useEffect(() => {
    if (showLogoutModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showLogoutModal]);

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    
    // Nililinis ang buong session at storage para mawala ang authorization check
    localStorage.clear();
    sessionStorage.clear();

    // Direktang ibabato sa login page
    navigate("/login", { replace: true });
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
            
            {/* Dashboard Link */}
            <div className="space-y-1">
              <Link
                to="/guard"
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all duration-200 ${
                  isActive("/guard")
                    ? "bg-[#0053CC] text-white shadow-md shadow-blue-600/30"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <LayoutDashboard className="h-4 w-4 shrink-0" />
                <span>Dashboard</span>
              </Link>
            </div>

            {/* Checkpoint Operations Section */}
            <div className="space-y-1.5">
              <p className="px-3 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                Checkpoint Operations
              </p>

              {/* Scan QR */}
              <Link
                to="/guard/scan-qr"
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  isActive("/guard/scan-qr")
                    ? "bg-[#0053CC] text-white font-bold shadow-md shadow-blue-600/30"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <QrCode className="h-4 w-4 shrink-0" />
                <span>Scan QR</span>
              </Link>

              {/* Gate Registration */}
              <Link
                to="/guard/registration"
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  location.pathname.startsWith("/guard/registration")
                    ? "bg-[#0053CC] text-white font-bold shadow-md shadow-blue-600/30"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <UserPlus className="h-4 w-4 shrink-0" />
                <span>Gate Registration</span>
              </Link>

              {/* Gate Monitoring */}
              <Link
                to="/guard/monitoring"
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  isActive("/guard/monitoring")
                    ? "bg-[#0053CC] text-white font-bold shadow-md shadow-blue-600/30"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <MonitorCheck className="h-4 w-4 shrink-0" />
                <span>Gate Monitoring</span>
              </Link>
            </div>

          </nav>
        </div>

        {/* Logout Button */}
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

      {/* Logout Confirmation Modal */}
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