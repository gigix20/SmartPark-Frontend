import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QrCode, UserPlus, Users, ArrowUpRight, ArrowDownRight, Bell } from "lucide-react";
import { GuardHeader } from "@/components/GuardHeader";
import { GuardNav } from "@/components/GuardNav";

export default function GuardDashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Pwede mong baguhin kung ilang rows ang gusto bawat page

  const recentActivities = [
    { id: 1, plateNo: "ABD 3654", type: "Car", action: "EXIT", time: "Sept 30, 9:40 AM" },
    { id: 2, plateNo: "ABC 4901", type: "Car", action: "ENTRY", time: "Sept 29, 1:40 AM" },
    { id: 3, plateNo: "TRS 1117", type: "Motorcycle", action: "ENTRY", time: "Sept 28, 7:48 AM" },
    { id: 4, plateNo: "XYZ 3478", type: "Motorcycle", action: "ENTRY", time: "Sept 26, 9:00 AM" },
    { id: 5, plateNo: "QIU-5209", type: "Car", action: "ENTRY", time: "Sept 27, 10:30 AM" },
    { id: 6, plateNo: "MNO 1122", type: "Car", action: "EXIT", time: "Sept 30, 11:15 AM" },
    { id: 7, plateNo: "ZZZ 9999", type: "Motorcycle", action: "ENTRY", time: "Sept 30, 01:20 PM" },
  ];

  const totalPages = Math.ceil(recentActivities.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentActivities = recentActivities.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      
      {/* Header */}
      <GuardHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex-1 flex relative">
        
        {/* Navigation Sidebar */}
        <GuardNav isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Main Content Area */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto lg:pl-72 transition-all">
          <div className="space-y-6 max-w-6xl mx-auto">
            
            {/* Header Title */}
            <div>
              <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">Guard Dashboard</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">View and manage vehicle access, registrations, and security checkpoints.</p>
            </div>

            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Vehicles Inside */}
              <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-3 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Vehicles inside</span>
                  <Users className="h-4 w-4 text-[#0053CC] dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white">45<span className="text-xs text-slate-400 font-normal">/160</span></h3>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#0053CC] h-full rounded-full w-[30%]"></div>
                </div>
              </div>

              {/* Entries Today */}
              <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-3 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Entries today</span>
                  <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                    <ArrowDownRight className="h-4 w-4" />
                  </div>
                </div>
                <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white">160</h3>
                <p className="text-[10px] text-slate-400">Total recorded campus entries</p>
              </div>

              {/* Exits Today */}
              <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-3 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Exits today</span>
                  <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
                <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white">150</h3>
                <p className="text-[10px] text-slate-400">Total recorded campus exits</p>
              </div>

              {/* Unread Notifications */}
              <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-3 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Unread notifications</span>
                  <Bell className="h-4 w-4 text-amber-500" />
                </div>
                <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white">3</h3>
                <p className="text-[10px] text-slate-400">Requires guard attention</p>
              </div>

            </div>

            {/* Lower Grid: Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Quick Actions */}
              <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4 transition-colors lg:col-span-1">
                <h3 className="font-poppins text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Quick Actions
                </h3>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => navigate("/guard/scan-qr")}
                    className="w-full flex flex-col items-center justify-center p-6 rounded-2xl bg-[#0053CC] hover:bg-[#0042A5] text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer group space-y-2"
                  >
                    <div className="p-3 rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors">
                      <QrCode className="h-6 w-6" />
                    </div>
                    <span className="font-bold text-xs">Scan Vehicle QR</span>
                    <span className="text-[10px] text-blue-100 font-normal">Scan the QR entry on the vehicle</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/guard/registration")}
                    className="w-full flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white transition-all cursor-pointer group space-y-2"
                  >
                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400">
                      <UserPlus className="h-6 w-6" />
                    </div>
                    <span className="font-bold text-xs">Gate Registration</span>
                    <span className="text-[10px] text-slate-400 font-normal">Register vehicle at the gate</span>
                  </button>
                </div>
              </div>

              {/* Recent Activity Table with Pagination */}
              <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4 transition-colors lg:col-span-2 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <h3 className="font-poppins text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Recent activity
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-112.5">
                    <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                      <tr>
                        <th className="pb-3">Plate No.</th>
                        <th className="pb-3">Vehicle Type</th>
                        <th className="pb-3">Action</th>
                        <th className="pb-3">Date & Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {currentActivities.length > 0 ? (
                        currentActivities.map((act) => (
                          <tr key={act.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="py-3 font-bold text-slate-900 dark:text-white">{act.plateNo}</td>
                            <td className="py-3">
                              <span className="px-2 py-0.5 rounded-md font-medium text-[11px] bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400 border border-blue-100 dark:border-blue-900">
                                {act.type}
                              </span>
                            </td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                                act.action === "ENTRY" 
                                  ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800" 
                                  : "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                              }`}>
                                {act.action}
                              </span>
                            </td>
                            <td className="py-3 text-slate-500">{act.time}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-slate-400 text-xs italic">
                            No recent activities found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Dynamic Pagination Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                  <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, recentActivities.length)} of {recentActivities.length} activities</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                      <button 
                        key={number}
                        type="button" 
                        onClick={() => setCurrentPage(number)}
                        className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                          currentPage === number 
                            ? "bg-[#0053CC] text-white" 
                            : "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        {number}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        </main>

      </div>

    </div>
  );
}