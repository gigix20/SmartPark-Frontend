import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, UserPlus, Shield, Users, UserCheck } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";

export default function Accounts() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const accountsData = [
    { id: 1, name: "John Doe", email: "john@qcu.edu.ph", role: "Super Admin", status: "Active", lastLogin: "Today, 10:15 AM" },
    { id: 2, name: "Mark Admin", email: "mark@qcu.edu.ph", role: "Administrator", status: "Active", lastLogin: "Yesterday, 06:00 PM" },
    { id: 3, name: "Guard Reyes", email: "reyes.guard@qcu.edu.ph", role: "Guard", status: "Active", lastLogin: "2 days ago" },
    { id: 4, name: "Maria Santos", email: "maria@gmail.com", role: "User", status: "Active", lastLogin: "Today, 08:30 AM" },
  ];

  const filteredAccounts = accountsData.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "Administrators") {
      return matchesSearch && (item.role === "Super Admin" || item.role === "Administrator");
    }
    if (activeTab === "Guards") {
      return matchesSearch && item.role === "Guard";
    }
    if (activeTab === "Users") {
      return matchesSearch && item.role === "User";
    }

    return matchesSearch;
  });

  const getAddButtonText = () => {
    if (activeTab === "Guards") return "+ ADD GUARD ACCOUNT";
    if (activeTab === "Users") return "+ ADD USER ACCOUNT";
    if (activeTab === "Administrators") return "+ ADD ADMIN ACCOUNT";
    return "";
  };

  const handleAddClick = () => {
    if (activeTab === "Administrators") {
      navigate("/admin/accounts/create");
    }
  };

  const handleView = (item: typeof accountsData[0]) => {
    if (item.role === "Guard") {
      navigate(`/admin/guards/details/${item.id}`);
    } else {
      navigate(`/admin/accounts/details/${item.id}`);
    }
  };

  const handleEdit = (item: typeof accountsData[0]) => {
    if (item.role === "Guard") {
      navigate(`/admin/guards/edit/${item.id}`);
    } else {
      navigate(`/admin/accounts/edit/${item.id}`);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">Admin Management</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Create, audit, and configure administrative roles and privilege limits.</p>
        </div>
        {activeTab !== "All" && (
          <button
            type="button"
            onClick={handleAddClick}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0053CC] px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors w-fit shadow-xs cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            <span>{getAddButtonText()}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex justify-between items-start transition-colors">
          <div>
            <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">Total Admins</p>
            <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">3</h3>
            <p className="text-[10px] text-slate-400 mt-1">All system administrators</p>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex justify-between items-start transition-colors">
          <div>
            <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">Super Admins</p>
            <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">1</h3>
            <p className="text-[10px] text-slate-400 mt-1">Unrestricted root rights</p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <Shield className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex justify-between items-start transition-colors">
          <div>
            <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">Regular Admins</p>
            <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">2</h3>
            <p className="text-[10px] text-slate-400 mt-1">Standard restricted access</p>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400">
            <UserCheck className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search name or email" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#0053CC]"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold w-full lg:w-auto overflow-x-auto">
            {["All", "Administrators", "Guards", "Users"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => handleTabChange(tab)}
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
                <th className="pb-3">Name</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Last Login</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map((item) => (
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
                        onClick={() => handleView(item)}
                        className="font-bold text-[#0053CC] dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        View
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleEdit(item)}
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
                    No accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 gap-4">
          <span>Showing {filteredAccounts.length} accounts</span>
          <div className="flex items-center gap-1">
            <button type="button" className="px-3 py-1 rounded-lg font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer">
              Previous
            </button>
            <button type="button" className="px-3 py-1 rounded-lg font-semibold bg-[#0053CC] text-white cursor-pointer">1</button>
            <button type="button" className="px-3 py-1 rounded-lg font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer">
              Next
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}