import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Search, Calendar, ChevronDown, RotateCcw } from "lucide-react";
import logo from "@/assets/smartpark - favicon.svg";
import { AdminNav } from "@/components/AdminNav";

export default function ParkingHistory() {
  // Mock data para sa Parking History batay sa larawan
  const historyData = [
    { id: 1, date: "Sept 30, 2025", vehicleName: "Mitsubishi Mirage", plateNo: "NDO 5214", entryTime: "08:30 PM", exitTime: "--", duration: "1h 11m", status: "Complete" },
    { id: 2, date: "Sept 30, 2025", vehicleName: "Mitsubishi Xpander", plateNo: "DEF 9012", entryTime: "08:02 AM", exitTime: "--", duration: "--", status: "Currently Parked" },
    { id: 3, date: "Sept 30, 2025", vehicleName: "Honda Civic", plateNo: "NDO 5214", entryTime: "05:30 PM", exitTime: "12:00 PM", duration: "5h 15m", status: "Complete" },
    { id: 4, date: "Sept 29, 2025", vehicleName: "Toyota Fortuner", plateNo: "MHI 1234", entryTime: "07:30 AM", exitTime: "04:15 PM", duration: "8h 45m", status: "Complete" },
    { id: 5, date: "Sept 28, 2025", vehicleName: "Yamaha Aerox", plateNo: "XYZ 5678", entryTime: "11:15 AM", exitTime: "01:30 PM", duration: "2h 15m", status: "Complete" },
    { id: 6, date: "Sept 27, 2025", vehicleName: "Honda Click", plateNo: "PH-8888", entryTime: "03:00 PM", exitTime: "--", duration: "--", status: "Currently Parked" },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = historyData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(historyData.length / itemsPerPage);

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
            <Bell className="h-5 v-5" />
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
          <div>
            <h1 className="font-poppins text-xl font-bold text-slate-900">Parking History</h1>
            <p className="text-xs text-slate-500">Historical parking records.</p>
          </div>

          {/* Table Container Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            
            {/* Filter and Search Section */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="relative w-full lg:w-72">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search plates, names, logs..." 
                  className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#0053CC]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                {/* Date Filter Dropdown */}
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-600 bg-white">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>Sept 24 to 30</span>
                </div>

                {/* Vehicle Type Dropdown */}
                <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-600 bg-white min-w-30">
                  <span>Vehicle Type</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </div>

                {/* Time Dropdown */}
                <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-600 bg-white min-w-22.5">
                  <span>Time</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </div>

                {/* Reset Button */}
                <button type="button" className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0053CC] px-2 py-1 transition-colors">
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Vehicle Name</th>
                    <th className="pb-3">Plate Number</th>
                    <th className="pb-3">Entry Time</th>
                    <th className="pb-3">Exit Time</th>
                    <th className="pb-3">Duration</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {currentItems.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 text-slate-600">{item.date}</td>
                      <td className="py-3 font-medium text-slate-800">{item.vehicleName}</td>
                      <td className="py-3 font-bold text-slate-900">{item.plateNo}</td>
                      <td className="py-3 text-slate-600">{item.entryTime}</td>
                      <td className="py-3 text-slate-500">{item.exitTime}</td>
                      <td className="py-3 text-slate-600">{item.duration}</td>
                      <td className="py-3">
                        <span className={`font-semibold ${
                          item.status === "Complete" ? "text-slate-700" : "text-amber-600 font-bold"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500 gap-4">
              <span>Showing 1 to 6 of 248 records</span>
              <div className="flex items-center gap-1">
                <button type="button" className="px-3 py-1 rounded-lg font-medium text-slate-500 bg-slate-50 hover:bg-slate-100 transition-colors">
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    type="button"
                    onClick={() => setCurrentPage(number)}
                    className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                      currentPage === number
                        ? "bg-[#0053CC] text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {number}
                  </button>
                ))}
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