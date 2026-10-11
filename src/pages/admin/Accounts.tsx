import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Search, UserPlus } from "lucide-react";
import logo from "@/assets/smartpark - favicon.svg";
import { AdminNav } from "@/components/AdminNav";

export default function Accounts() {
  const [activeTab, setActiveTab] = useState("All");

  // Halimbawa ng pinagsamang data ng mga accounts
  const accountsData = [
    { id: 1, name: "John Doe", email: "john@qcu.edu.ph", role: "Administrator", status: "Active" },
    { id: 2, name: "Guard Reyes", email: "reyes.guard@qcu.edu.ph", role: "Guard", status: "Active" },
    { id: 3, name: "Maria Santos", email: "maria@gmail.com", role: "User", status: "Active" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="SmartPark Logo" className="h-8 w-auto object-contain" />
            <span className="font-poppins text-lg font-bold tracking-tight text-slate-900">
              SMARTPARK
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden text-right sm:block">
            <p className="text-xs font-medium text-slate-500">Tue, Sep 29, 2026</p>
            <p className="text-xs font-bold text-slate-800">10:21:15 PM</p>
          </div>

          <button type="button" className="relative rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          <Link 
            to="/admin/profile" 
            className="flex items-center gap-3 border-l border-slate-200 pl-6 group hover:opacity-80 transition-opacity"
          >
            <div className="hidden text-right md:block">
              <p className="text-xs font-bold text-slate-900 group-hover:text-[#0053CC] transition-colors">John Doe</p>
              <p className="text-[10px] font-semibold text-emerald-600">Admin</p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
              alt="Admin Profile"
              className="h-9 w-9 rounded-full object-cover border border-slate-200 shadow-xs"
            />
          </Link>
        </div>
      </header>

      <div className="flex">
        <AdminNav />

        {/* Main Content Area */}
        <main className="flex-1 ml-64 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
          
          {/* Page Title & Add Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-poppins text-xl font-bold text-slate-900">Account Management</h1>
              <p className="text-xs text-slate-500">Manage system administrators, guards, and registered users.</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0053CC] px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors w-fit shadow-xs"
            >
              <UserPlus className="h-4 w-4" />
              <span>Add New Account</span>
            </button>
          </div>

          {/* Table Container Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            
            {/* Search & Tabs Filter (Dito na nila iv-filter ang Admins, Guards, Users) */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="relative w-full lg:w-72">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search name or email" 
                  className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#0053CC]"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold w-full lg:w-auto overflow-x-auto">
                {["All", "Administrators", "Guards", "Users"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                      activeTab === tab ? "bg-white text-[#0053CC] shadow-xs font-bold" : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {accountsData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-bold text-slate-900">{item.name}</td>
                      <td className="py-3 text-slate-600">{item.email}</td>
                      <td className="py-3 font-medium text-slate-800">{item.role}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <button type="button" className="font-bold text-[#0053CC] hover:underline">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500 gap-4">
              <span>Showing 3 accounts</span>
              <div className="flex items-center gap-1">
                <button type="button" className="px-3 py-1 rounded-lg font-medium text-slate-500 bg-slate-50 hover:bg-slate-100 transition-colors">
                  Previous
                </button>
                <button type="button" className="px-3 py-1 rounded-lg font-semibold bg-[#0053CC] text-white">1</button>
                <button type="button" className="px-3 py-1 rounded-lg font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors">
                  Next
                </button>
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}