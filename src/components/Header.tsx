import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/smartpark - favicon.svg";

interface UserProfile {
  firstName?: string;
  lastName?: string;
  schoolId?: string;
  role?: string;
}

export function Header({ currentUser }: { currentUser?: UserProfile | null }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

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

  // Lock scroll sa background screen kapag nakabukas ang Sign Out Modal
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 sm:px-10 transition-colors duration-300">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="SmartPark Logo" className="h-8 w-auto object-contain rounded-lg bg-white p-1" />
          <span className="font-poppins text-lg font-bold text-slate-900 dark:text-white">
            QCU SmartPark
          </span>
        </div>

        {/* User Info & Avatar Dropdown */}
        <div className="flex items-center gap-3">
          
          {/* Dark Mode Toggle Button */}
          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 transition-colors shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 text-amber-400 shrink-0" />
            ) : (
              <Moon className="h-4 w-4 text-slate-600 shrink-0" />
            )}
          </button>

          {/* User Details Label */}
          <div className="hidden text-right sm:block">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "User"}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {currentUser?.schoolId || "24-1478"} • {currentUser?.role || "STUDENT"}
            </p>
          </div>

          {/* Profile Avatar Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="h-9 w-9 cursor-pointer overflow-hidden rounded-full border border-slate-200 dark:border-slate-700 bg-slate-300 transition-all hover:ring-2 hover:ring-slate-300 dark:hover:ring-slate-700 focus:outline-none"
            >
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowDropdown(false)}
                />

                <div className="absolute right-0 z-50 mt-2 w-52 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-xl animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                    Menu
                  </div>

                  <div className="flex flex-col gap-0.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                    <Link
                      to="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="rounded-xl px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/parking"
                      onClick={() => setShowDropdown(false)}
                      className="rounded-xl px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Parking
                    </Link>
                    <Link
                      to="/Vehicles"
                      onClick={() => setShowDropdown(false)}
                      className="rounded-xl px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Vehicles
                    </Link>
                    <Link
                      to="/studentHome"
                      onClick={() => setShowDropdown(false)}
                      className="rounded-xl px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Homepage
                    </Link>
                    <Link
                      to="/reports"
                      onClick={() => setShowDropdown(false)}
                      className="rounded-xl px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Reports
                    </Link>
                  </div>

                  <div className="my-1.5 h-px bg-slate-100 dark:bg-slate-800" />

                  <button
                    type="button"
                    onClick={() => {
                      setShowDropdown(false);
                      setShowLogoutModal(true);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* SIGN OUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-[28px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 sm:p-8 text-center shadow-2xl transition-all animate-in zoom-in-95">
            <h3 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">
              Sign Out
            </h3>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              Are you sure you want to logout?
            </p>

            <div className="mt-6 flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowLogoutModal(false)}
                className="h-11 flex-1 rounded-2xl border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={() => {
                  setShowLogoutModal(false);
                  handleLogout();
                }}
                className="h-11 flex-1 rounded-2xl bg-red-600 text-xs font-bold text-white shadow-sm hover:bg-red-700 cursor-pointer"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}