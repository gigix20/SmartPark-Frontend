import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Search, Filter, Car, CheckCircle2, Clock } from "lucide-react";
import logo from "@/assets/smartpark - favicon.svg";
import { AdminNav } from "@/components/AdminNav";

export default function VehicleRegistration() {
  const pendingVehicles = [
    { id: 1, owner: "Maria Clara Reyes", vehicleType: "Toyota Wigo (Sedan)", plateNo: "XYZ 9091", status: "Pending", date: "Sep 28, 2026" },
    { id: 2, owner: "Juan De La Cruz", vehicleType: "Honda Civic", plateNo: "ABC 1234", status: "Approved", date: "Sep 25, 2026" },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = pendingVehicles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(pendingVehicles.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
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

        <main className="flex-1 ml-64 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
          <div>
            <h1 className="font-poppins text-xl font-bold text-slate-900">Vehicle Registration</h1>
            <p className="text-xs text-slate-500">Manage and approve registered vehicles entering QCU premises.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Total Registered</span>
                <Car className="h-4 w-4 text-[#0053CC]" />
              </div>
              <h3 className="font-poppins text-2xl font-bold text-slate-900 mt-2">1,240</h3>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Pending Approvals</span>
                <Clock className="h-4 w-4 text-amber-500" />
              </div>
              <h3 className="font-poppins text-2xl font-bold text-slate-900 mt-2">14</h3>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Active Passes</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <h3 className="font-poppins text-2xl font-bold text-slate-900 mt-2">1,226</h3>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search plate number, owner..." 
                  className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#0053CC]"
                />
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Filter className="h-3.5 w-3.5 text-[#0053CC]" />
                <span className="font-semibold text-slate-700">Filter: All Vehicles</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="pb-3">Owner Name</th>
                    <th className="pb-3">Vehicle Type</th>
                    <th className="pb-3">Plate Number</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Date Submitted</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {currentItems.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 font-medium text-slate-900">{item.owner}</td>
                      <td className="py-3 text-slate-500">{item.vehicleType}</td>
                      <td className="py-3 font-semibold text-slate-800">{item.plateNo}</td>
                      <td className="py-3">
                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          item.status === "Approved" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-500">{item.date}</td>
                      <td className="py-3 text-right space-x-2">
                        {item.status === "Pending" ? (
                          <>
                            <button type="button" className="rounded-lg bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-600 hover:bg-emerald-100 transition-colors">Approve</button>
                            <button type="button" className="rounded-lg bg-red-50 px-2.5 py-1 font-semibold text-red-600 hover:bg-red-100 transition-colors">Reject</button>
                          </>
                        ) : (
                          <button type="button" className="text-[#0053CC] hover:underline font-medium">View</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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