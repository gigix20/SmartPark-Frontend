import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, LogOut, User as UserIcon } from "lucide-react";
import { Header } from "@/components/Header";
import {
  logoutUser,
  getCurrentUser,
  type User as UserType,
} from "@/pages/auth/api/authApi";

export default function AdminDashboard() {
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
        Loading Admin Portal...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      <Header currentUser={currentUser} />

      <main className="mx-auto max-w-5xl p-6 sm:p-10">
        <div className="rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-700 p-8 text-white shadow-lg">
          <div className="flex flex-col gap-2">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-xs">
              <ShieldAlert className="h-3.5 w-3.5" />
              System Control Console
            </span>
            <h1 className="font-poppins text-2xl font-extrabold sm:text-3xl">
              Admin Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-purple-100">
              Welcome back,{" "}
              {currentUser
                ? `${currentUser.firstName} ${currentUser.lastName}`
                : "Admin"}
              ! Monitor parking operations and system settings.
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                <UserIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Admin Profile</h3>
                <p className="text-xs text-slate-500">System Administrator</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-xs text-slate-600">
              <p>
                Name:{" "}
                <span className="font-semibold text-slate-800">
                  {currentUser?.firstName} {currentUser?.lastName}
                </span>
              </p>
              <p>
                Email:{" "}
                <span className="font-semibold text-slate-800">
                  {currentUser?.email}
                </span>
              </p>
              <p>
                ID:{" "}
                <span className="font-semibold text-slate-800">
                  {currentUser?.schoolId}
                </span>
              </p>
              <p>
                Role:{" "}
                <span className="font-semibold text-indigo-600">
                  {currentUser?.role}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
            <p className="text-xs text-slate-500">Total Users</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">--</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
            <p className="text-xs text-slate-500">Active Parking</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">--</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
            <p className="text-xs text-slate-500">Pending Appeals</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">--</p>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl bg-red-50 px-6 py-3 text-sm font-medium text-red-600 hover:bg-red-100"
          >
            <LogOut className="h-4 w-4" />
            Sign Out from Admin Station
          </button>
        </div>
      </main>
    </div>
  );
}
