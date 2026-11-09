import { useNavigate } from "react-router-dom";
import { ShieldAlert, UserCheck, UserX, UserPlus } from "lucide-react";

interface GuardAccountProps {
  searchTerm: string;
}

export default function GuardAccount({ searchTerm }: GuardAccountProps) {
  const navigate = useNavigate();

  const guardData = [
    {
      id: 3,
      name: "Guard Reyes",
      email: "reyes.guard@qcu.edu.ph",
      role: "Guard",
      status: "Active",
      lastLogin: "2 days ago",
    },
  ];

  const totalPersonnel = guardData.length;
  const activeGuards = guardData.filter((i) => i.status === "Active").length;
  const offDutyGuards = guardData.filter((i) => i.status !== "Active").length;

  const filteredData = guardData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* 3 Metric Cards para sa Guards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex justify-between items-start transition-colors">
          <div>
            <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">Total Personnel</p>
            <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              {totalPersonnel}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">All security guard profiles</p>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
            <ShieldAlert className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex justify-between items-start transition-colors">
          <div>
            <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">Active</p>
            <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              {activeGuards}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">Currently on duty / active status</p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <UserCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex justify-between items-start transition-colors">
          <div>
            <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">Off-Duty</p>
            <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              {offDutyGuards}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">Inactive or off-shift guards</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500">
            <UserX className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Button para magpunta sa GuardCreate */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => navigate("/admin/guards/create")}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0053CC] px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
        >
          <UserPlus className="h-4 w-4" />
          <span>+ ADD GUARD ACCOUNT</span>
        </button>
      </div>

      {/* Guard Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs min-w-150">
          <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold uppercase text-[10px]">
            <tr>
              <th className="pb-3">Name</th>
              <th className="pb-3">Email</th>
              <th className="pb-3">Role</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Last Login</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 font-bold text-slate-900 dark:text-white">{item.name}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-400">{item.email}</td>
                  <td className="py-3 font-medium text-slate-800 dark:text-slate-200">{item.role}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500">{item.lastLogin}</td>
                  <td className="py-3 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/guards/details/${item.id}`)}
                      className="font-bold text-[#0053CC] dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/guards/edit/${item.id}`)}
                      className="font-bold text-slate-600 dark:text-slate-300 hover:underline cursor-pointer"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-6 text-center text-slate-400">
                  No guard accounts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}