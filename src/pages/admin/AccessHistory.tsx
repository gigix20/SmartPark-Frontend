import { useNavigate } from "react-router-dom";
import { Search, Calendar, ChevronDown, RotateCcw, User, ArrowLeft } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";

export default function AccessHistory() {
  const navigate = useNavigate();
  const historyData = [
    { 
      id: 1, 
      plateNo: "NDX 5521", 
      vehicleDesc: "Yamaha Mio", 
      owner: "Maria Santos", 
      action: "Entry", 
      dateTime: "Sept 29, 7:42 AM", 
      guard: "Reyes", 
      source: "User registration" 
    },
    { 
      id: 2, 
      plateNo: "NDX 5521", 
      vehicleDesc: "Yamaha Mio", 
      owner: "Maria Santos", 
      action: "Exit", 
      dateTime: "Sept 28, 5:10 PM", 
      guard: "Santos", 
      source: "User registration" 
    },
    { 
      id: 3, 
      plateNo: "QWE 4477", 
      vehicleDesc: "Nissan Almera", 
      owner: "Jon Dela Cruz", 
      action: "Entry", 
      dateTime: "Sept 28, 8:05 AM", 
      guard: "Santos", 
      source: "Gate registration" 
    },
    { 
      id: 4, 
      plateNo: "DEF 9012", 
      vehicleDesc: "Mitsubishi L300", 
      owner: "Liza Dizon", 
      action: "Exit", 
      dateTime: "Sept 27, 4:48 PM", 
      guard: "Reyes", 
      source: "User registration" 
    },
    { 
      id: 5, 
      plateNo: "GHI 3456", 
      vehicleDesc: "Hyundai Accent", 
      owner: "Visitor: R. Cruz", 
      action: "Entry", 
      dateTime: "Sept 26, 9:20 AM", 
      guard: "Reyes", 
      source: "Gate registration" 
    },
  ];

  return (
    <AdminLayout>
      <div className="mb-2">
        <button
          type="button"
          onClick={() => navigate("/admin/access-records")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#0053CC] dark:hover:text-blue-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Access & Records</span>
        </button>
      </div>

      <div>
        <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">Access History</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Review and manage parking incident reports submitted by users.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Plate number, owner, or guard" 
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#0053CC]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>Sept 24 to 30</span>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 min-w-27.5">
              <span>All actions</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </div>

            <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 min-w-27.5">
              <span>All sources</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </div>

            <button type="button" className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-[#0053CC] dark:hover:text-blue-400 px-2 py-1 transition-colors cursor-pointer">
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-162.5">
            <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="pb-3">Plate</th>
                <th className="pb-3">Owner or Driver</th>
                <th className="pb-3">Action</th>
                <th className="pb-3">Date and Time</th>
                <th className="pb-3">Guard</th>
                <th className="pb-3">Registration Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {historyData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3">
                    <p className="font-bold text-slate-900 dark:text-white">{item.plateNo}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{item.vehicleDesc}</p>
                  </td>
                  <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">{item.owner}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold ${
                      item.action === "Entry" 
                        ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800" 
                        : "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${item.action === "Entry" ? "bg-emerald-500" : "bg-amber-500"}`}></span>
                      {item.action}
                    </span>
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-400">{item.dateTime}</td>
                  <td className="py-3 font-medium text-slate-700 dark:text-slate-300">{item.guard}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold ${
                      item.source === "User registration"
                        ? "bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                        : "bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800"
                    }`}>
                      <User className="h-3 w-3" />
                      {item.source}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 gap-4">
          <span>Showing 5 records</span>
          <div className="flex items-center gap-1">
            <button type="button" className="px-3 py-1 rounded-lg font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer">
              &lt;
            </button>
            <button type="button" className="px-3 py-1 rounded-lg font-semibold bg-[#0053CC] text-white">1</button>
            <button type="button" className="px-3 py-1 rounded-lg font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}