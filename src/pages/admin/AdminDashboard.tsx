import { Car, TrendingUp, ArrowUpRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">Admin Dashboard</h1>

      {/* Top 5 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Parking Availability</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-3 flex items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50 py-2.5 border border-emerald-100 dark:border-emerald-800">
            <span className="font-poppins text-lg font-bold text-emerald-600 dark:text-emerald-400">High</span>
          </div>
          <p className="mt-2 text-[10px] text-slate-400">+45 this week</p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Currently Inside</span>
            <Car className="h-4 w-4 text-[#0053CC] dark:text-blue-400" />
          </div>
          <div className="mt-3">
            <h3 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white">30<span className="text-xs text-slate-400 font-normal"> / 100</span></h3>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">30% occupied</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Today's Vehicle Entries</span>
            <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-3">
            <h3 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white">12</h3>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">+3 from yesterday</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Today's Vehicle Exits</span>
            <ArrowUpRight className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-3">
            <h3 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white">20</h3>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Last Exit: 9:30 PM</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs sm:col-span-2 lg:col-span-1 transition-colors">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Pending Incident Reports</span>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-3">
            <h3 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white">5</h3>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">3 high priority</p>
          </div>
        </div>
      </div>

      {/* Middle Section: Chart & Awaiting Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs lg:col-span-2 flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">Parking Utilization Trends</h3>
              <span className="text-xs text-slate-400">● Mon-Sun Usage</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Daily average occupied spaces vs capacity</p>
          </div>
          <div className="my-6 h-48 w-full flex items-end">
            <svg className="w-full h-full text-[#0053CC] dark:text-blue-400" viewBox="0 0 500 150" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 130 Q 100 80, 180 50 T 340 20 T 480 90" stroke="currentColor" strokeWidth="3" fill="none" />
            </svg>
          </div>
          <div className="flex justify-between text-[11px] font-medium text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs flex flex-col gap-4 transition-colors">
          <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">Awaiting Action</h3>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Pending Vehicle Registrations</p>
            <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3 space-y-2">
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Reyes, Maria Clara</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Toyota Wigo • Plate: XYZ 9091</p>
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" className="rounded-lg bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors cursor-pointer">Approve</button>
                <button type="button" className="rounded-lg bg-red-50 dark:bg-red-950/50 px-3 py-1 text-[11px] font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 transition-colors cursor-pointer">Reject</button>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Pending Incident Reports</p>
            <div className="rounded-xl border border-rose-100 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/30 p-3 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-rose-700 dark:text-rose-400">Blocking Parking Space</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Toyota Avanza • Plate QWE 0987</p>
              </div>
              <button type="button" className="rounded-lg bg-rose-100 dark:bg-rose-900/60 px-3 py-1.5 text-[11px] font-semibold text-rose-700 dark:text-rose-200 hover:bg-rose-200 transition-colors cursor-pointer">Review</button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs transition-colors">
        <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0"></span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">Vehicle ABC 1234 has entered</span>
            </div>
            <span className="text-[11px] text-slate-400 shrink-0 ml-2">Just now</span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0"></span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">New registration request from John Doe</span>
            </div>
            <span className="text-[11px] text-slate-400 shrink-0 ml-2">4 mins ago</span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0"></span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">Incident #1042 resolved (Block B Fencing)</span>
            </div>
            <span className="text-[11px] text-slate-400 shrink-0 ml-2">12 mins ago</span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-red-500 shrink-0"></span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">Security alert: Unauthorized parking in Reserved Spot #02</span>
            </div>
            <span className="text-[11px] text-slate-400 shrink-0 ml-2">25 mins ago</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}