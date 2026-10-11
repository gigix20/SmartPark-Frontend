import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Search, Filter, Car, ShieldCheck, Menu } from "lucide-react";
import logo from "@/assets/smartpark - favicon.svg";
import { AdminNav } from "@/components/AdminNav";

export default function VehicleManagement() {
  const vehiclesData = [
    { id: 1, plateNo: "ABC 1234", owner: "Dela Cruz, Rafael", type: "Car", brandModel: "Toyota Vios", color: "White", regDate: "15 Dec 2025", status: "Approved" },
    { id: 2, plateNo: "XYZ 5678", owner: "Cruz, Mark Anthony", type: "Motorcycle", brandModel: "Honda Click 125", color: "Black", regDate: "02 Jan 2026", status: "Approved" },
    { id: 3, plateNo: "DEF 9012", owner: "Santos, Maria", type: "Car", brandModel: "Mitsubishi L300", color: "Silver", regDate: "14 Jan 2026", status: "Pending" },
    { id: 4, plateNo: "GHI 3456", owner: "Reyes, Jose", type: "Car", brandModel: "Hyundai Accent", color: "Red", regDate: "20 Jan 2026", status: "Approved" },
    { id: 5, plateNo: "JKL 7890", owner: "Del Prado, Juan", type: "Motorcycle", brandModel: "Yamaha Mio", color: "Blue", regDate: "22 Jan 2026", status: "Rejected" },
    { id: 6, plateNo: "MNO 1122", owner: "Villanueva, Ana", type: "Car", brandModel: "Honda Civic", color: "Gray", regDate: "05 Feb 2026", status: "Approved" },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = vehiclesData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(vehiclesData.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 font-sans relative transition-colors">
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
          <div>
            <h1 className="font-poppins text-xl font-bold text-slate-900 dark:text-white">Vehicle Management</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Manage registered vehicles of users[cite: 12].</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs transition-colors">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                <span>Total Registered</span>
                <Car className="h-4 w-4 text-[#0053CC] dark:text-blue-400" />
              </div>
              <h3 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white mt-2">1,247</h3>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs transition-colors">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                <span>Cars & SUVs</span>
                <Car className="h-4 w-4 text-blue-500" />
              </div>
              <h3 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white mt-2">890</h3>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs transition-colors">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                <span>Motorcycles</span>
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white mt-2">357</h3>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs space-y-4 transition-colors">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search plates, names, logs..." 
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#0053CC]"
                />
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Filter className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">Status: Approved</span>
              </div>
            </div>

            {/* Table na may horizontal scroll wrapper para sa mobile */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-187.5">
                <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="pb-3">Plate No.</th>
                    <th className="pb-3">Owner</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Brand & Model</th>
                    <th className="pb-3">Color</th>
                    <th className="pb-3">Registration Date</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {currentItems.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 font-semibold text-slate-900 dark:text-white">{vehicle.plateNo}</td>
                      <td className="py-3 font-medium text-slate-800 dark:text-slate-200">{vehicle.owner}</td>
                      <td className="py-3">
                        <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-400">
                          {vehicle.type}
                        </span>
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-400">{vehicle.brandModel}</td>
                      <td className="py-3 text-slate-500 dark:text-slate-400">{vehicle.color}</td>
                      <td className="py-3 text-slate-500 dark:text-slate-400">{vehicle.regDate}</td>
                      <td className="py-3">
                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          vehicle.status === "Approved" ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400" :
                          vehicle.status === "Pending" ? "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400" : "bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400"
                        }`}>
                          {vehicle.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button type="button" className="text-[#0053CC] dark:text-blue-400 hover:underline font-medium cursor-pointer">
                          {vehicle.status === "Pending" || vehicle.status === "Rejected" ? "Review" : "View"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

             <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 gap-4">
              <span>Showing 1 to 6 of 248 records[cite: 12]</span>
              <div className="flex items-center gap-1">
                <button type="button" className="px-3 py-1 rounded-lg font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    type="button"
                    onClick={() => setCurrentPage(number)}
                    className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                      currentPage === number
                        ? "bg-[#0053CC] text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {number}
                  </button>
                ))}
                <button type="button" className="px-3 py-1 rounded-lg font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer">
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