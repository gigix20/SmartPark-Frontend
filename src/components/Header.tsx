import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/smartpark-logo.svg"; // I-adjust ang path kung kinakailangan

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-6 sm:px-10">
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-3">
        <img src={logo} alt="SmartPark Logo" className="h-9 w-auto object-contain" />
        <span className="font-poppins text-lg font-bold text-slate-900">
          QCU SmartPark
        </span>
      </div>

      {/* User Info & Avatar Dropdown */}
      <div className="flex items-center gap-4">
        {/* User Details Label */}
        <div className="hidden text-right sm:block">
          <p className="text-xs font-semibold text-slate-800">
            {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "User"}
          </p>
          <p className="text-[11px] text-slate-500">
            {currentUser?.schoolId || "24-1478"} • {currentUser?.role || "STUDENT"}
          </p>
        </div>

        {/* Profile Avatar Trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="h-9 w-9 cursor-pointer overflow-hidden rounded-full border border-slate-200 bg-slate-300 transition-all hover:ring-2 hover:ring-slate-300 focus:outline-none"
          >
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </button>

          {/* Full Dropdown Menu */}
          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDropdown(false)}
              />

              <div className="absolute right-0 z-50 mt-2 w-52 rounded-2xl border border-slate-100 bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Menu
                </div>

                <div className="flex flex-col gap-0.5 text-xs font-medium text-slate-700">
                  <Link
                    to="/profile"
                    onClick={() => setShowDropdown(false)}
                    className="rounded-xl px-3 py-2 hover:bg-slate-100 transition-colors"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setShowDropdown(false)}
                    className="rounded-xl px-3 py-2 hover:bg-slate-100 transition-colors"
                  >
                    Settings
                  </Link>
                  <Link
                    to="/help"
                    onClick={() => setShowDropdown(false)}
                    className="rounded-xl px-3 py-2 hover:bg-slate-100 transition-colors"
                  >
                    Help & Support
                  </Link>
                  <Link
                    to="/terms-and-conditions"
                    onClick={() => setShowDropdown(false)}
                    className="rounded-xl px-3 py-2 hover:bg-slate-100 transition-colors"
                  >
                    Terms & Conditions
                  </Link>
                  <Link
                    to="/privacy-policy"
                    onClick={() => setShowDropdown(false)}
                    className="rounded-xl px-3 py-2 hover:bg-slate-100 transition-colors"
                  >
                    Privacy / Data Privacy
                  </Link>
                </div>

                <div className="my-1.5 h-px bg-slate-100" />

                <button
                  type="button"
                  onClick={() => {
                    setShowDropdown(false);
                    setShowLogoutModal(true);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}

          {/* Confirmation Modal */}
          {showLogoutModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
              <div className="w-full max-w-xs rounded-2xl bg-white p-5 text-center shadow-2xl transition-all animate-in fade-in zoom-in-95">
                <h3 className="font-poppins text-base font-bold text-slate-900">
                  Sign Out
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Are you sure you want to logout?
                </p>

                <div className="mt-5 flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowLogoutModal(false)}
                    className="h-9 flex-1 rounded-xl border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="button"
                    onClick={() => {
                      setShowLogoutModal(false);
                      handleLogout();
                    }}
                    className="h-9 flex-1 rounded-xl bg-red-600 text-xs font-semibold text-white shadow-sm hover:bg-red-700"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}