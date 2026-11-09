import { useNavigate } from "react-router-dom";

interface UserAccountProps {
  searchTerm: string;
}

export default function UserAccount({ searchTerm }: UserAccountProps) {
  const navigate = useNavigate();

  const userData = [
    {
      id: 4,
      name: "Maria Santos",
      email: "maria@gmail.com",
      role: "User",
      status: "Active",
      lastLogin: "Today, 08:30 AM",
    },
  ];

  const filteredData = userData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
                No user accounts found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}