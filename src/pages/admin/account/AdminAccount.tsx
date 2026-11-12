import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, ChevronDown } from "lucide-react";

interface AdminAccountProps {
  searchTerm: string;
}

export default function AdminAccount({ searchTerm }: AdminAccountProps) {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Read current user role for RBAC
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const isSuperAdmin = currentUser?.role?.toUpperCase() === "SUPER_ADMIN";

  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const adminData = [
    { id: 1, name: "John Doe", email: "john@qcu.edu.ph", role: "Super Admin", status: "Active", lastLogin: "Today, 10:15 AM" },
    { id: 2, name: "Mark Admin", email: "mark@qcu.edu.ph", role: "Administrator", status: "Active", lastLogin: "Yesterday, 06:00 PM" },
    { id: 30, name: "Admin Sarah", email: "sarah.admin@qcu.edu.ph", role: "Administrator", status: "Inactive", lastLogin: "5 days ago" },
  ];

  const statusOptions = ["Active", "Suspended", "Inactive"];

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "Active": return "text-emerald-600 dark:text-emerald-400";
      case "Suspended": return "text-amber-600 dark:text-amber-400";
      case "Inactive": return "text-rose-600 dark:text-rose-400";
      default: return "text-slate-700 dark:text-slate-300";
    }
  };

  const filteredData = adminData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "All" || item.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="space-y-4">
      {/* Filter Dropdown */}
      <div className="flex justify-start">
        <div className="relative w-full sm:w-auto" ref={filterRef}>
          <button
            type="button"
            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            className={`flex items-center justify-between gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold transition-colors cursor-pointer w-full sm:w-auto ${getStatusColorClass(selectedStatus)}`}
          >
            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              <span>Status: {selectedStatus}</span>
            </div>
            <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${isStatusDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {isStatusDropdownOpen && (
            <div className="absolute left-0 mt-2 w-48 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg py-1 z-20 text-xs">
              <button
                type="button"
                onClick={() => {
                  setSelectedStatus("All");
                  setIsStatusDropdownOpen(false);
                  setCurrentPage(1);
                }}
                className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer text-slate-500 italic border-b border-slate-100 dark:border-slate-700/50"
              >
                Clear Filter (All)
              </button>

              {statusOptions.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => {
                    setSelectedStatus(status);
                    setIsStatusDropdownOpen(false);
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer ${
                    selectedStatus === status ? "font-bold text-[#0053CC] dark:text-blue-400" : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-xs transition-colors">
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
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
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
                    {isSuperAdmin && (
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/accounts/edit/${item.id}`)}
                        className="font-bold text-slate-600 dark:text-slate-300 hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-6 text-center text-slate-400">
                  No admin accounts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 gap-4">
          <span>Showing {currentItems.length} of {filteredData.length} records</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((number) => (
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
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 rounded-lg font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}