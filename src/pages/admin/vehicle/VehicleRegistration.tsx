import { useState } from "react";
import { Search, Filter, Car, CheckCircle2, Clock, X, Check, AlertCircle, ChevronDown } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";

export default function VehicleRegistration() {
  const [pendingVehicles, setPendingVehicles] = useState([
    { id: 1, owner: "Maria Clara Reyes", vehicleType: "Toyota Wigo (Sedan)", brand: "Toyota", model: "Wigo", color: "White", plateNo: "XYZ 9091", status: "Pending", date: "Sep 28, 2026", email: "mariaclare@gmail.com", phone: "+63 912 345 6789", idNo: "24-0123" },
    { id: 2, owner: "Juan De La Cruz", vehicleType: "Honda Civic", brand: "Honda", model: "Civic", color: "Gray", plateNo: "ABC 1234", status: "Pending", date: "Sep 25, 2026", email: "juandc@gmail.com", phone: "+63 918 765 4321", idNo: "24-0456" },
  ]);

  // States para sa search, filter dropdown, at pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All Vehicles");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [modalType, setModalType] = useState<"review" | "confirmApprove" | "rejectReason" | "confirmReject" | "approvedSuccess" | "rejectedSuccess" | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const filterOptions = ["Pending", "Approved", "Rejected"];

  // Filter at Search Logic
  const filteredVehicles = pendingVehicles.filter((vehicle) => {
    const matchesSearch = 
      vehicle.plateNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.owner.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter !== "All Vehicles" && vehicle.status !== selectedFilter) {
      return false;
    }

    return true;
  });

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredVehicles.slice(indexOfFirstItem, indexOfLastItem);

  const confirmApproveAction = () => {
    if (selectedVehicle) {
      setPendingVehicles(pendingVehicles.map(v => v.id === selectedVehicle.id ? { ...v, status: "Approved" } : v));
      setModalType("approvedSuccess");
    }
  };

  const confirmRejectAction = () => {
    if (selectedVehicle) {
      setPendingVehicles(pendingVehicles.map(v => v.id === selectedVehicle.id ? { ...v, status: "Rejected" } : v));
      setModalType("rejectedSuccess");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">Vehicle Registration</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage and approve registered vehicles entering QCU premises.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs transition-colors">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
              <span>Total Registered</span>
              <Car className="h-4 w-4 text-[#0053CC] dark:text-blue-400" />
            </div>
            <h3 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white mt-2">1,240</h3>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs transition-colors">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
              <span>Pending Approvals</span>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <h3 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white mt-2">
              {pendingVehicles.filter(v => v.status === "Pending").length}
            </h3>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs transition-colors">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
              <span>Active Passes</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white mt-2">1,226</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs space-y-4 transition-colors">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search plate number, owner..." 
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#0053CC]"
              />
            </div>

            {/* Interactive Filter Dropdown with Clear Filter (All) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                <Filter className="h-3.5 w-3.5 text-[#0053CC] dark:text-blue-400" />
                <span>Filter: {selectedFilter}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {isFilterDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl py-1 z-20 text-xs overflow-hidden">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFilter("All Vehicles");
                      setIsFilterDropdownOpen(false);
                      setCurrentPage(1);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs italic text-[#0053CC] dark:text-blue-400 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Clear Filter (All)
                  </button>
                  {filterOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setSelectedFilter(option);
                        setIsFilterDropdownOpen(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-4 py-2.5 transition-colors cursor-pointer ${
                        selectedFilter === option 
                          ? "bg-blue-50 dark:bg-blue-950/50 font-bold text-[#0053CC] dark:text-blue-400" 
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-175">
              <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="pb-3">Owner Name</th>
                  <th className="pb-3">Vehicle Type</th>
                  <th className="pb-3">Plate Number</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date Submitted</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 font-medium text-slate-900 dark:text-white">{item.owner}</td>
                      <td className="py-3 text-slate-500 dark:text-slate-400">{item.vehicleType}</td>
                      <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">{item.plateNo}</td>
                      <td className="py-3">
                        <span className={`rounded-md px-2.5 py-1 text-[10px] font-bold ${
                          item.status === "Approved" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
                          item.status === "Pending" ? "bg-amber-50 text-amber-600 border border-amber-200" :
                          "bg-rose-50 text-rose-600 border border-rose-200"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-500 dark:text-slate-400">{item.date}</td>
                      <td className="py-3 text-right">
                        <button 
                          type="button" 
                          onClick={() => { setSelectedVehicle(item); setModalType("review"); }}
                          className="h-9 px-4 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400 text-xs italic">
                      No vehicle records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Functional Pagination Controls */}
          {filteredVehicles.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 gap-4">
              <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredVehicles.length)} of {filteredVehicles.length} records</span>
              <div className="flex items-center gap-1">
                <button 
                  type="button" 
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-lg font-medium text-slate-500 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 cursor-pointer disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    type="button"
                    onClick={() => setCurrentPage(number)}
                    className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                      currentPage === number ? "bg-[#0053CC] text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    {number}
                  </button>
                ))}
                <button 
                  type="button" 
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-3 py-1 rounded-lg font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 cursor-pointer disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* 1. Review Details Modal */}
      {modalType === "review" && selectedVehicle && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-2xl rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-6 relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="font-poppins text-lg font-bold text-[#0053CC] dark:text-blue-400">Vehicle Details</h2>
              <button onClick={() => setModalType(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <Car className="h-16 w-16 text-[#0053CC] dark:text-blue-400" />
              <div>
                <h3 className="font-poppins text-xl font-extrabold text-slate-900 dark:text-white">{selectedVehicle.plateNo}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{selectedVehicle.vehicleType} • {selectedVehicle.color}</p>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-[#0053CC] dark:text-blue-300 text-[10px] font-bold">Car</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Vehicle Information</h4>
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div><span className="text-slate-400 block">Vehicle Type</span> <strong className="text-slate-800 dark:text-slate-200">{selectedVehicle.vehicleType}</strong></div>
                <div><span className="text-slate-400 block">Brand</span> <strong className="text-slate-800 dark:text-slate-200">{selectedVehicle.brand}</strong></div>
                <div><span className="text-slate-400 block">Model</span> <strong className="text-slate-800 dark:text-slate-200">{selectedVehicle.model}</strong></div>
                <div><span className="text-slate-400 block">Color</span> <strong className="text-slate-800 dark:text-slate-200">{selectedVehicle.color}</strong></div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Owner Information</h4>
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div><span className="text-slate-400 block">Email Address</span> <strong className="text-slate-800 dark:text-slate-200">{selectedVehicle.email}</strong></div>
                <div><span className="text-slate-400 block">Phone Number</span> <strong className="text-slate-800 dark:text-slate-200">{selectedVehicle.phone}</strong></div>
                <div><span className="text-slate-400 block">Full Name</span> <strong className="text-slate-800 dark:text-slate-200">{selectedVehicle.owner}</strong></div>
                <div><span className="text-slate-400 block">ID Number</span> <strong className="text-slate-800 dark:text-slate-200">{selectedVehicle.idNo}</strong></div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setModalType("rejectReason")}
                className="flex-1 h-10 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer" >
                Disapprove
              </button>
              <button
                type="button"
                onClick={() => setModalType("confirmApprove")}
                className="flex-1 h-10 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer">
                Approve 
              </button>		
            </div>
          </div>
        </div>
      )}

      {/* 2. Confirmation Modal para sa Approve */}
      {modalType === "confirmApprove" && selectedVehicle && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-8 text-center shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 animate-in zoom-in-95">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-[#0053CC]">
              <Check className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">Are you sure?</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Do you really want to approve vehicle registration for <strong>{selectedVehicle.plateNo}</strong>?</p>
            </div>
            
            <div className="flex items-center justify-center gap-3 pt-2">
              <button onClick={() => setModalType("review")} className="flex-1 h-10 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer">
                Cancel
              </button>
              <button onClick={confirmApproveAction} className="flex-1 h-10 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer">
                Yes, Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Reason for Rejection Modal */}
      {modalType === "rejectReason" && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">Reason for Rejection</h3>
              <button onClick={() => setModalType(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500">The reporter will receive an email with the reason.</p>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Reason for rejection*</label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Insufficient vehicle documentation or incorrect plate number."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0053CC]"
              />
            </div>
            
            <div className="flex items-center justify-center gap-3 pt-2">
              <button onClick={() => setModalType("review")} className="flex-1 h-10 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer">
                Cancel
              </button>
              <button onClick={() => setModalType("confirmReject")} className="flex-1 h-10 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/20 cursor-pointer">
                Disapprove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Confirmation Modal para sa Disapprove */}
      {modalType === "confirmReject" && selectedVehicle && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-8 text-center shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 animate-in zoom-in-95">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <AlertCircle className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">Are you sure?</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Do you really want to disapprove vehicle registration for <strong>{selectedVehicle.plateNo}</strong>?</p>
            </div>
            
            <div className="flex items-center justify-center gap-3 pt-2">
              <button onClick={() => setModalType("rejectReason")} className="flex-1 h-10 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer">
                Cancel
              </button>
              <button onClick={confirmRejectAction} className="flex-1 h-10 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/20 cursor-pointer">
                Yes, Disapprove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Approved Success Pop-up */}
      {modalType === "approvedSuccess" && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-8 text-center shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4 animate-in zoom-in-95">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <Check className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">Vehicle Registration Approved</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">The vehicle is now listed under Registered Vehicles.</p>
            </div>
            <button onClick={() => setModalType(null)} className="w-full h-11 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer">
              Close
            </button>
          </div>
        </div>
      )}

      {/* 6. Disapproved Success Pop-up */}
      {modalType === "rejectedSuccess" && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-8 text-center shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4 animate-in zoom-in-95">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <AlertCircle className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">Vehicle Registration Disapproved</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">The vehicle is not Approved.</p>
            </div>
            <button onClick={() => setModalType(null)} className="w-full h-11 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer">
              Close
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}