import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Car, Shield, CheckCircle2 } from "lucide-react";
import logo from "@/assets/smartpark-logo.svg";
import { Button } from "@/components/ui/button";
import { logoutUser, getCurrentUser, type User as UserType } from "@/pages/auth/api/authApi";

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserType | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    // Verify session with backend /me endpoint
    getCurrentUser()
      .then((res) => {
        setCurrentUser(res.user);
        localStorage.setItem("user", JSON.stringify(res.user));
      })
      .catch(() => {
        // If token is invalid or expired, redirect to login
        logoutUser();
        navigate("/login");
      });
  }, [navigate]);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-6 sm:px-10">
        <div className="flex items-center gap-3">
          <img src={logo} alt="SmartPark Logo" className="h-9 w-auto object-contain" />
          <span className="font-poppins text-lg font-bold text-slate-900">
            QCU SmartPark
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-xs font-semibold text-slate-800">
              {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "User"}
            </p>
            <p className="text-[11px] text-slate-500">
              {currentUser?.schoolId || "Student"} • {currentUser?.role || "STUDENT"}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-xl border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-red-600"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-5xl p-6 sm:p-10">
        {/* Welcome Banner */}
        <div className="rounded-3xl bg-linear-to-r from-[#0053CC] via-[#2563eb] to-[#4a80e2] p-8 text-white shadow-lg">
          <div className="flex flex-col gap-2">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-xs">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Account {currentUser?.accountStatus || "Active"}
            </span>
            <h1 className="font-poppins text-2xl font-extrabold sm:text-3xl">
              Welcome back, {currentUser?.firstName || "Student"}!
            </h1>
            <p className="text-xs sm:text-sm text-blue-100">
              Manage your QCU parking permissions, view available parking slots, and track entry passes.
            </p>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Card 1: User Profile */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0053CC]">
              <User className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold text-slate-900 text-sm">Account Info</h3>
            <div className="mt-2 space-y-1 text-xs text-slate-500">
              <p>Email: <span className="font-medium text-slate-800">{currentUser?.email}</span></p>
              <p>ID: <span className="font-medium text-slate-800">{currentUser?.schoolId}</span></p>
              <p>Role: <span className="font-medium text-slate-800">{currentUser?.role}</span></p>
            </div>
          </div>

          {/* Card 2: Vehicles Placeholder */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Car className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold text-slate-900 text-sm">Registered Vehicles</h3>
            <p className="mt-2 text-xs text-slate-500">
              No vehicles registered yet. Vehicle registration is coming in the next feature update.
            </p>
          </div>

          {/* Card 3: Security & Status */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold text-slate-900 text-sm">Parking Access</h3>
            <p className="mt-2 text-xs text-slate-500">
              Status: <span className="font-semibold text-emerald-600">Good Standing</span>. Zero violations recorded.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
