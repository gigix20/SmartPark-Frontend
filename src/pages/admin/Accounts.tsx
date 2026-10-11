import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Search, UserPlus, ShieldAlert, Shield, Users, UserCheck, Menu } from "lucide-react";
import logo from "@/assets/smartpark - favicon.svg";
import { AdminNav } from "@/components/AdminNav";

export default function Accounts() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [showAccessDeniedModal, setShowAccessDeniedModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Halimbawa: Role ng kasalukuyang naka-login ("Admin" o "Super Admin")
  const currentUserRole = "Admin"; 

  // Function para sa tab change[cite: 4]
  const handleTabChange = (tab: string) => {
    if ((tab === "Administrators" || tab === "Super Admins") && currentUserRole !== "Super Admin") {
      setShowAccessDeniedModal(true);
      return;
    }
    setActiveTab(tab);
  };

  const accountsData = [
    { id: 1, name: "John Doe", email: "john@qcu.edu.ph", role: "Super Admin", status: "Active" },
    { id: 2, name: "Mark Admin", email: "mark@qcu.edu.ph", role: "Administrator", status: "Active" },
    { id: 3, name: "Guard Reyes", email: "reyes.guard@qcu.edu.ph", role: "Guard", status: "Active" },
    { id: 4, name: "Maria Santos", email: "maria@gmail.com", role: "User", status: "Active" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 font-sans relative transition-colors">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-6 transition-colors">
        <div className="flex items-center gap-3">
          {/* Hamburger Menu Button para sa Mobile */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <img src={logo} alt="SmartPark Logo" className="h-8 w-auto object-contain rounded-lg bg-white p-1" />
            <span className="font-poppins text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              SMARTPARK
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden text-right sm:block">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Tue, Sep 29, 2026</p>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">10:21:15 PM</p>
          </div>

          <button type="button" className="relative rounded-full p-2 text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          <Link 
            to="/admin/profile" 
            className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-4 sm:pl-6 group hover:opacity-80 transition-opacity"
          >
            <div className="hidden text-right md:block">
              <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#0053CC] transition-colors">John Doe</p>
              <p className="text-[10px] font-semibold text-emerald-600">Admin</p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
              alt="Admin Profile"
              className="h-9 w-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
            />
          </Link>
        </div>
      </header>

      <div className="flex">
        {/* Responsive Admin Sidebar */}
        <AdminNav isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Main Content Area na may responsive margins at padding */}
        <main className="flex-1 ml-0 lg:ml-64 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto overflow-x-hidden">
          
          {/* Title & Add Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">Admin Management</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Create, audit, and configure administrative roles and privilege limits.</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0053CC] px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors w-fit shadow-xs cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              <span>+ ADD ADMIN ACCOUNT</span>
            </button>
          </div>

          {/* Metric Counter Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Admins */}
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

            {/* Super Admins */}
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

            {/* Regular Admins */}
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

          {/* Table Container Card */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs space-y-4 transition-colors">
            
            {/* Search & Tabs Filter */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="relative w-full lg:w-72">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search name or email" 
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#0053CC]"
                />
              </div>

              {/* Filter Tabs */}
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

            {/* Table na may horizontal scroll wrapper para sa mobile */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[600px]">
                <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {accountsData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 font-bold text-slate-900 dark:text-white">{item.name}</td>
                      <td className="py-3 text-slate-600 dark:text-slate-400">{item.email}</td>
                      <td className="py-3 font-medium text-slate-800 dark:text-slate-200">{item.role}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <button type="button" className="font-bold text-[#0053CC] dark:text-blue-400 hover:underline cursor-pointer">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 gap-4">
              <span>Showing 4 accounts</span>
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

        </main>
      </div>

      {/* Access Denied Modal */}
      {showAccessDeniedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-8 shadow-2xl text-center space-y-5 border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/50 border border-red-100 dark:border-red-900">
              <ShieldAlert className="h-8 w-8 text-red-500 dark:text-red-400" />
            </div>

            <div className="space-y-2">
              <h3 className="font-poppins text-xl font-bold text-slate-900 dark:text-white">Access Denied</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-2">
                You do not have permission to access this page or perform this action.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowAccessDeniedModal(false);
                  navigate("/admin/accounts");
                }}
                className="w-full rounded-2xl border-2 border-blue-600 dark:border-blue-500 py-3 text-xs font-bold text-[#0053CC] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 active:bg-blue-100 transition-colors cursor-pointer"
              >
                Back to Accounts
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}