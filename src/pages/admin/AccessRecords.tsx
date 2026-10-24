import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, History } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";

export default function AccessRecords() {
  const [activeTab, setActiveTab] = useState("Entries");

  const recordsData = [
    { 
      id: 1, 
      plateNo: "NDX 5521", 
      vehicleDesc: "Yamaha Mio", 
      owner: "Maria Santos", 
      dateTime: "Sept 29, 7:42 AM", 
      guard: "Reyes", 
      type: "Motorcycle" 
    },
    { 
      id: 2, 
      plateNo: "QWE 4477", 
      vehicleDesc: "Nissan Almera", 
      owner: "Jon Dela Cruz", 
      dateTime: "Sept 29, 7:41 AM", 
      guard: "Santos", 
      type: "Car" 
    },
    { 
      id: 3, 
      plateNo: "GHI 3456", 
      vehicleDesc: "Hyundai Accent", 
      owner: "Liza Dizon", 
      dateTime: "Sept 29, 7:40 AM", 
      guard: "Reyes", 
      type: "Car" 
    },
  ];

  return (
    <AdminLayout>
      {/* Title & View History Button Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">Access & Records</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Review and manage parking access logs and real-time records.</p>
        </div>
        <Link
          to="/admin/access-records/history"
          className="inline-flex items-center gap-2 rounded-xl bg-[#0053CC] px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors w-fit shadow-xs cursor-pointer"
        >
          <History className="h-4 w-4" />
          <span>View All History</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex justify-between items-start transition-colors">
          <div>
            <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">Today's Entry Logs</p>
            <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">86</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex justify-between items-start transition-colors">
          <div>
            <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">Today's Exit Logs</p>
            <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">71</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex justify-between items-start transition-colors">
          <div>
            <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">Currently inside</p>
            <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">15</h3>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search owner, id, or plate" 
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#0053CC]"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold w-full lg:w-auto overflow-x-auto">
            {["Entries", "Exits", "Currently Inside"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === tab 
                    ? "bg-white dark:bg-slate-900 text-[#0053CC] dark:text-blue-400 shadow-xs font-bold" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-150">
            <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="pb-3">Plate No.</th>
                <th className="pb-3">Owner</th>
                <th className="pb-3">Date & Time</th>
                <th className="pb-3">Guard</th>
                <th className="pb-3">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {recordsData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3">
                    <p className="font-bold text-slate-900 dark:text-white">{item.plateNo}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{item.vehicleDesc}</p>
                  </td>
                  <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">{item.owner}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-400">{item.dateTime}</td>
                  <td className="py-3 font-medium text-slate-700 dark:text-slate-300">{item.guard}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      item.type === "Motorcycle" 
                        ? "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800" 
                        : "bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                    }`}>
                      {item.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 gap-4">
          <span>Showing 3 of 15 vehicles</span>
          <div className="flex items-center gap-1">
            <button type="button" className="px-3 py-1 rounded-lg font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer">
              Previous
            </button>
            <button type="button" className="px-3 py-1 rounded-lg font-semibold bg-[#0053CC] text-white cursor-pointer">1</button>
            <button type="button" className="px-3 py-1 rounded-lg font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer">2</button>
            <button type="button" className="px-3 py-1 rounded-lg font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer">3</button>
            <button type="button" className="px-3 py-1 rounded-lg font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer">
              Next
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}