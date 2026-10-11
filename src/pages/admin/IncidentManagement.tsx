import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Search, History } from "lucide-react";
import logo from "@/assets/smartpark - favicon.svg";
import { AdminNav } from "@/components/AdminNav";

export default function IncidentManagement() {
  const [activeTab, setActiveTab] = useState("All");

  const incidentsData = [
    { id: 1, ref: "INC-2025-098", reporter: "Bryan Marcelo", type: "Motorcycle", plate: "GHI 9091", reportType: "Obstruction", status: "Pending", desc: "Vehicle l...", submitted: "Sept 30, 8:42 AM", action: "Review" },
    { id: 2, ref: "INC-2025-097", reporter: "Aivan Dormetorio", type: "Car", plate: "NDG 5214", reportType: "Illegal Parking", status: "Rejected", desc: "Incorr...", submitted: "Sept 29, 2:00 PM", action: "View" },
    { id: 3, ref: "INC-2025-096", reporter: "Duke Tolentino", type: "Car", plate: "Unknown", reportType: "Unidentified", status: "Unidentified", desc: "Resolv...", submitted: "Sept 28, 3:00 PM", action: "View" },
    { id: 4, ref: "INC-2025-095", reporter: "Kyle Antonio", type: "Car", plate: "ABC 1234", reportType: "Illegal Parking", status: "Pending", desc: "Owne...", submitted: "Sept 27, 10:00 AM", action: "Review" },
    { id: 5, ref: "INC-2025-094", reporter: "Kurt Laride", type: "Motorcycle", plate: "XYZ 9876", reportType: "Double parking", status: "Reviewed", desc: "Daily...", submitted: "Sept 26, 7:10 AM", action: "View" },
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

        {/* Main Content Area na may ml-64 para hindi matakpan ng fixed sidebar */}
        <main className="flex-1 ml-64 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
          
          {/* Page Title & View History Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-poppins text-xl font-bold text-slate-900">Incident Management</h1>
              <p className="text-xs text-slate-500">Review and manage parking incident reports submitted by users.</p>
            </div>
            <Link
              to="/admin/incidents/history"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0053CC] px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors w-fit shadow-xs"
            >
              <History className="h-4 w-4" />
              <span>View Incident History</span>
            </Link>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-700">Waiting for review</p>
                <h3 className="font-poppins text-3xl font-extrabold text-slate-900 mt-2">2</h3>
                <p className="text-[10px] font-medium text-slate-400 mt-1">New reports</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-700">Reviewed this week</p>
                <h3 className="font-poppins text-3xl font-extrabold text-slate-900 mt-2">12</h3>
                <p className="text-[10px] font-medium text-slate-400 mt-1">4 today</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-700">Reviewed this week</p>
                <h3 className="font-poppins text-3xl font-extrabold text-slate-900 mt-2">18</h3>
                <p className="text-[10px] font-medium text-slate-400 mt-1">Within target</p>
              </div>
            </div>
          </div>

          {/* Table Container Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            
            {/* Search & Tabs Filter */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="relative w-full lg:w-72">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search reference or plate" 
                  className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#0053CC]"
                />
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold w-full lg:w-auto overflow-x-auto">
                {["All", "Pending", "Reviewed", "Rejected", "Unidentified"].map((tab) => (
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
                    <th className="pb-3">Reference</th>
                    <th className="pb-3">Reporter</th>
                    <th className="pb-3">Vehicle Type</th>
                    <th className="pb-3">Plate No.</th>
                    <th className="pb-3">Report Type</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Description</th>
                    <th className="pb-3">Submitted</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {incidentsData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-semibold text-[#0053CC]">{item.ref}</td>
                      <td className="py-3 text-slate-800">{item.reporter}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          {item.type}
                        </span>
                      </td>
                      <td className="py-3 font-bold text-slate-900">{item.plate}</td>
                      <td className="py-3 text-slate-600">{item.reportType}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          item.status === "Pending" ? "bg-amber-50 text-amber-600 border border-amber-200" :
                          item.status === "Rejected" ? "bg-red-50 text-red-600 border border-red-200" :
                          item.status === "Reviewed" ? "bg-blue-50 text-[#0053CC] border border-blue-200" :
                          "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-500">{item.desc}</td>
                      <td className="py-3 text-slate-600">{item.submitted}</td>
                      <td className="py-3">
                        <button type="button" className="font-bold text-[#0053CC] hover:underline">
                          {item.action}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500 gap-4">
              <span>Showing 1 to 5 of 248 records</span>
              <div className="flex items-center gap-1">
                <button type="button" className="px-3 py-1 rounded-lg font-medium text-slate-500 bg-slate-50 hover:bg-slate-100 transition-colors">
                  Previous
                </button>
                <button type="button" className="px-3 py-1 rounded-lg font-semibold bg-[#0053CC] text-white">1</button>
                <button type="button" className="px-3 py-1 rounded-lg font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200">2</button>
                <button type="button" className="px-3 py-1 rounded-lg font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200">3</button>
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