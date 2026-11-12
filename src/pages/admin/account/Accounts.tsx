import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, UserPlus, ShieldAlert, Shield, Users, UserCheck, Filter, ChevronDown, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { getAccounts } from "./api/accountApi";

export default function Accounts() {
  const navigate = useNavigate();
  
  // Read current user role for RBAC
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const isSuperAdmin = currentUser?.role?.toUpperCase() === "SUPER_ADMIN";
  
  // Basahin ang huling tab mula sa localStorage, o i-default sa "All"
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("admin_accounts_active_tab") || "All";
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [accounts, setAccounts] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    totalAccounts: 0,
    totalAdmins: 0,
    totalGuards: 0,
    totalUsers: 0,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    async function fetchAccountsData() {
      try {
        setIsLoading(true);
        const res = await getAccounts({
          search: debouncedSearch,
          tab: activeTab,
          status: statusFilter,
          page: currentPage,
          limit: itemsPerPage,
        });
        if (res.success) {
          setAccounts(res.accounts || []);
          setMetrics(res.metrics || { totalAccounts: 0, totalAdmins: 0, totalGuards: 0, totalUsers: 0 });
          setPagination(res.pagination || { total: 0, page: 1, totalPages: 1 });
        }
      } catch (err) {
        console.error("Failed to fetch accounts:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAccountsData();
  }, [debouncedSearch, activeTab, statusFilter, currentPage]);

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

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setStatusFilter("All");
    setIsStatusDropdownOpen(false);
    setCurrentPage(1);
    localStorage.setItem("admin_accounts_active_tab", tab);
  };

  const statusOptions = ["Active", "Suspended", "Inactive", "Deactivated"];

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
      case "Suspended":
        return "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800";
      case "Inactive":
      case "Deactivated":
        return "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800";
      default:
        return "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "Active":
        return "text-emerald-600 dark:text-emerald-400";
      case "Suspended":
        return "text-amber-600 dark:text-amber-400";
      case "Inactive":
      case "Deactivated":
        return "text-rose-600 dark:text-rose-400";
      default:
        return "text-slate-700 dark:text-slate-300";
    }
  };


  const formatRoleDisplay = (role: string) => {
    switch (role?.toUpperCase()) {
      case "SUPER_ADMIN":
        return "Super Admin";
      case "ADMIN":
        return "Administrator";
      case "GUARD":
        return "Guard";
      case "USER":
        return "User";
      default:
        return role;
    }
  };

  const handleView = (item: any) => {
    localStorage.setItem("admin_accounts_active_tab", activeTab);
    const r = item.role?.toUpperCase();
    if (r === "GUARD") {
      navigate(`/admin/guards/details/${item.id}`, { state: { activeTab } });
    } else if (r === "USER") {
      navigate(`/admin/users/details/${item.id}`, { state: { activeTab } });
    } else {
      navigate(`/admin/accounts/details/${item.id}`, { state: { activeTab } });
    }
  };

  const handleEdit = (item: any) => {
    localStorage.setItem("admin_accounts_active_tab", activeTab);
    const r = item.role?.toUpperCase();
    if (r === "GUARD") {
      navigate(`/admin/guards/edit/${item.id}`);
    } else if (r === "USER") {
      navigate(`/admin/users/edit/${item.id}`);
    } else {
      navigate(`/admin/accounts/edit/${item.id}`);
    }
  };

  const getHeaderInfo = () => {
    switch (activeTab) {
      case "Administrators":
        return {
          title: "Admin Management",
          description: "Create, Audit, and Configure Administrative Roles and Privilege Tiers.",
        };
      case "Guards":
        return {
          title: "Guard Management",
          description: "Configure campus access personnel, gate deployment profiles, and shifts.",
        };
      case "Users":
        return {
          title: "User Management",
          description: "Manage active campus parking customers, vehicles link, and parking privilege scope.",
        };
      default:
        return {
          title: "Account Management",
          description: "Create, manage, and audit QCU SmartPark personnel and users.",
        };
    }
  };

  const headerInfo = getHeaderInfo();

  const getAddButtonText = () => {
    if (activeTab === "Guards") return "+ ADD GUARD ACCOUNT";
    if (activeTab === "Administrators") return "+ ADD ADMIN ACCOUNT";
    return "";
  };

  const handleAddClick = () => {
    localStorage.setItem("admin_accounts_active_tab", activeTab);
    if (activeTab === "Administrators") {
      navigate("/admin/accounts/create");
    } else if (activeTab === "Guards") {
      navigate("/admin/guards/create");
    }
  };

  return (
    <AdminLayout>
      {/* Title and Description */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">
            {headerInfo.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {headerInfo.description}
          </p>
        </div>

        {/* Only show Add button for Administrators if isSuperAdmin; Both can add Guards; No one can add Users */}
        {((activeTab === "Administrators" && isSuperAdmin) || activeTab === "Guards") && (
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

      {/* ================= METRIC CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">Total Account</p>
            <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              {metrics.totalAccounts}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">All registered system profiles</p>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0053CC]">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">Administrators</p>
            <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              {metrics.totalAdmins}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">System administrators & super admins</p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
            <Shield className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">Security Guards</p>
            <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              {metrics.totalGuards}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">Active checkpoint personnel</p>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600">
            <ShieldAlert className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">Users</p>
            <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              {metrics.totalUsers}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">Students, faculty, & vehicle owners</p>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600">
            <UserCheck className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* ================= TABLE CONTAINER SECTION ================= */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search name or email"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#0053CC]"
              />
            </div>

            {/* Custom Filter Dropdown */}
            <div className="relative w-full sm:w-auto" ref={filterRef}>
              <button
                type="button"
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className={`flex items-center justify-between gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold transition-colors cursor-pointer w-full sm:w-auto ${getStatusColorClass(
                  statusFilter
                )}`}
              >
                <div className="flex items-center gap-2">
                  <Filter className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Status: {statusFilter}</span>
                </div>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-slate-400 transition-transform ${
                    isStatusDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isStatusDropdownOpen && (
                <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-48 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg py-1 z-20 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter("All");
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
                        setStatusFilter(status);
                        setIsStatusDropdownOpen(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer ${
                        statusFilter === status
                          ? "font-bold text-[#0053CC] dark:text-blue-400"
                          : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
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

        {/* Table Section */}
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
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin text-[#0053CC]" />
                      <span>Loading accounts from database...</span>
                    </div>
                  </td>
                </tr>
              ) : accounts.length > 0 ? (
                accounts.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 font-bold text-slate-900 dark:text-white">
                      {item.name || `${item.firstName} ${item.lastName}`}
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">
                      {item.email}
                    </td>
                    <td className="py-3 font-medium text-slate-800 dark:text-slate-200">
                      {formatRoleDisplay(item.role)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getStatusBadgeClass(
                          item.accountStatus
                        )}`}
                      >
                        {item.accountStatus}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500">
                      {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "N/A"}
                    </td>
                    <td className="py-3 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleView(item)}
                        className="font-bold text-[#0053CC] dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        View
                      </button>
                      
                      {/* Show Edit only if it's NOT an Admin, OR if the current user is a Super Admin */}
                      {(!item.role?.toUpperCase().includes("ADMIN") || isSuperAdmin) && (
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
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
                    No accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 gap-4">
          <span>
            Showing {accounts.length} of {pagination.total} accounts
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || isLoading}
              className="px-3 py-1 rounded-lg font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: pagination.totalPages || 1 }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                type="button"
                onClick={() => setCurrentPage(number)}
                disabled={isLoading}
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
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))}
              disabled={currentPage === pagination.totalPages || pagination.totalPages === 0 || isLoading}
              className="px-3 py-1 rounded-lg font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}