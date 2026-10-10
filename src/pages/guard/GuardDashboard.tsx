import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, LogOut, User as UserIcon, ShieldAlert } from "lucide-react";
import { Header } from "@/components/Header";
import { logoutUser, getCurrentUser, type User as UserType } from "@/pages/auth/api/authApi";
import { Button } from "@/components/ui/button";

export default function GuardDashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserType | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        setCurrentUser(res.user);
        localStorage.setItem("user", JSON.stringify(res.user));
      })
      .catch(() => {
        logoutUser();
        navigate("/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 text-slate-500">
        Loading Guard Portal...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* Reusable Header */}
      <Header currentUser={currentUser} />

      {/* Main Content Area */}
      <main className="mx-auto max-w-5xl p-6 sm:p-10">
        {/* Guard Welcome Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-8 text-white shadow-lg">
          <div className="flex flex-col gap-2">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-xs">
              <ShieldCheck className="h-3.5 w-3.5" />
              Guard Security Portal
            </span>
            <h1 className="font-poppins text-2xl font-extrabold sm:text-3xl">
              Guard Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100">
              Welcome back, {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Guard"}! Monitor entry points and parking security.
            </p>
          </div>
        </div>

        {/* Authenticated Guard Information Card */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Account Profile Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <UserIcon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold text-slate-900 text-sm">Guard Profile Credentials</h3>
            <div className="mt-3 space-y-1.5 text-xs text-slate-600">
              <p>Name: <span className="font-semibold text-slate-800">{currentUser?.firstName} {currentUser?.lastName}</span></p>
              <p>Email: <span className="font-semibold text-slate-800">{currentUser?.email}</span></p>
              <p>Employee ID: <span className="font-semibold text-slate-800">{currentUser?.schoolId}</span></p>
              <p>Assigned Role: <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">{currentUser?.role}</span></p>
              <p>Account Status: <span className="font-semibold text-emerald-600">{currentUser?.accountStatus || "Active"}</span></p>
            </div>
          </div>

          {/* Quick Actions & Auth Control */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900 text-sm">Security Station Controls</h3>
              <p className="mt-2 text-xs text-slate-500">
                Authentication status verified. You are authorized to access security scanning tools and check vehicle authorization passes.
              </p>
            </div>
            
            <Button
              type="button"
              onClick={handleLogout}
              variant="outline"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border-red-200 bg-red-50 text-xs font-semibold text-red-600 hover:bg-red-100 hover:text-red-700"
            >
              <LogOut className="h-4 w-4" />
              Sign Out from Guard Station
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}