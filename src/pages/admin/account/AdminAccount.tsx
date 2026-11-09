import { useNavigate } from "react-router-dom";
import { Users, Shield, UserCheck } from "lucide-react";

interface AdminAccountProps {
  searchTerm: string;
}

export default function AdminAccount({ searchTerm }: AdminAccountProps) {
  const navigate = useNavigate();

  const adminData = [
    {
      id: 1,
      name: "John Doe",
      email: "john@qcu.edu.ph",
      role: "Super Admin",
      status: "Active",
      lastLogin: "Today, 10:15 AM",
    },
    {
      id: 2,
      name: "Mark Admin",
      email: "mark@qcu.edu.ph",
      role: "Administrator",
      status: "Active",
      lastLogin: "Yesterday, 06:00 PM",
    },
  ];

  // Kina-calculate ang eksaktong bilang para sa cards
  const totalAdmins = adminData.length;
  const superAdmins = adminData.filter((item) => item.role === "Super Admin").length;
  const regularAdmins = adminData.filter((item) => item.role === "Administrator").length;

  const filteredData = adminData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* 3 Metric Cards: Total Admins, Super Admins, Regular Admins */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex justify-between items-start transition-colors">
          <div>
            <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">Total Admins</p>
            <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              {totalAdmins}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">All system administrators</p>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex justify-between items-start transition-colors">
          <div>
            <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">Super Admins</p>
            <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              {superAdmins}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">Unrestricted root rights</p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <Shield className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex justify-between items-start transition-colors">
          <div>
            <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">Regular Admins</p>
            <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              {regularAdmins}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">Standard restricted access</p>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400">
            <UserCheck className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Admin Table */}
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
                <tr
                  key={item.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-3 font-bold text-slate-900 dark:text-white">
                    {item.name}
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-400">
                    {item.email}
                  </td>
                  <td className="py-3 font-medium text-slate-800 dark:text-slate-200">
                    {item.role}
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500">{item.lastLogin}</td>
                  <td className="py-3 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/accounts/details/${item.id}`)}
                      className="font-bold text-[#0053CC] dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/accounts/edit/${item.id}`)}
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
                  No administrator accounts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}