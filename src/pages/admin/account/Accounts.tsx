import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  UserPlus,
  ShieldAlert,
  Shield,
  Users,
  UserCheck,
  Filter,
  ChevronDown,
  Loader2,
  FileText,
  X,
} from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { getAccounts, getAppeals, reviewAppeal } from "./api/accountApi";

export default function Accounts() {
  const navigate = useNavigate();
  const location = useLocation();

  // Read current user role for RBAC
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const isSuperAdmin = currentUser?.role?.toUpperCase() === "SUPER_ADMIN";

  // Unconditionally default to "All" every time Account Management is opened
  const [activeTab, setActiveTab] = useState(() => {
    return (
      ((location as any).state as any)?.activeTab ||
      localStorage.getItem("accountsActiveTab") ||
      "All"
    );
  });

  useEffect(() => {
    const stateTab = ((location as any).state as any)?.activeTab;
    if (stateTab) {
      setActiveTab(stateTab);
    }
  }, [(location as any).state]);

  useEffect(() => {
    if (activeTab) {
      localStorage.setItem("accountsActiveTab", activeTab);
    }
  }, [activeTab]);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [accounts, setAccounts] = useState<any[]>([]);
  const [appeals, setAppeals] = useState<any[]>([]);
  const [pendingAppealsCount, setPendingAppealsCount] = useState(0);
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

  // Appeals Modal states
  const [isAppealsModalOpen, setIsAppealsModalOpen] = useState(false);
  const [appealsFilter, setAppealsFilter] = useState("All");
  const [appealsSearch, setAppealsSearch] = useState("");
  const [isAppealsLoading, setIsAppealsLoading] = useState(false);

  useEffect(() => {
    if (isAppealsModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isAppealsModalOpen]);

  const fetchAppealsData = async () => {
    try {
      setIsAppealsLoading(true);
      const res = await getAppeals();
      if (res.success) {
        setAppeals(res.appeals || []);
        setPendingAppealsCount(res.metrics?.pendingAppeals || 0);
      }
    } catch (err) {
      console.error("Failed to fetch appeals:", err);
    } finally {
      setIsAppealsLoading(false);
    }
  };

  const filteredAppeals = useMemo(() => {
    return appeals.filter((appeal) => {
      const matchesFilter =
        appealsFilter === "All" || appeal.status === appealsFilter;
      const q = appealsSearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        appeal.user?.name?.toLowerCase().includes(q) ||
        appeal.user?.email?.toLowerCase().includes(q) ||
        appeal.subject?.toLowerCase().includes(q) ||
        appeal.reason?.toLowerCase().includes(q) ||
        appeal.referenceId?.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [appeals, appealsFilter, appealsSearch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    let isCurrent = true;
    async function fetchData() {
      try {
        setIsLoading(true);
        const res = await getAccounts({
          search: debouncedSearch,
          tab: activeTab,
          status: statusFilter,
          page: currentPage,
          limit: itemsPerPage,
        });
        if (!isCurrent) return;
        if (res.success) {
          setAccounts(res.accounts || []);
          setMetrics(
            res.metrics || {
              totalAccounts: 0,
              totalAdmins: 0,
              totalGuards: 0,
              totalUsers: 0,
            },
          );
          setPagination(res.pagination || { total: 0, page: 1, totalPages: 1 });
        }
        // Also fetch appeals count for badge
        try {
          const appealsRes = await getAppeals();
          if (!isCurrent) return;
          if (appealsRes.success) {
            setAppeals(appealsRes.appeals || []);
            setPendingAppealsCount(appealsRes.metrics?.pendingAppeals || 0);
          }
        } catch {
          // ignore
        }
      } catch (err) {
        if (!isCurrent) return;
        console.error("Failed to fetch data:", err);
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }
    fetchData();
    return () => {
      isCurrent = false;
    };
  }, [debouncedSearch, activeTab, statusFilter, currentPage]);

  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
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
    setAccounts([]); // Reset accounts immediately to prevent showing previous tab's data
    setIsLoading(true);
  };

  // Safeguard: strictly ensure accounts displayed match activeTab
  const displayedAccounts = useMemo(() => {
    if (activeTab === "Administrators") {
      return accounts.filter((a) => {
        const r = a.role?.toUpperCase();
        return r === "ADMIN" || r === "SUPER_ADMIN";
      });
    }
    if (activeTab === "Guards") {
      return accounts.filter((a) => a.role?.toUpperCase() === "GUARD");
    }
    if (activeTab === "Users") {
      return accounts.filter((a) => {
        const r = a.role?.toUpperCase();
        return r === "USER" || r === "STUDENT";
      });
    }
    return accounts;
  }, [accounts, activeTab]);

  const statusOptions = ["Active", "Suspended", "Inactive", "Deactivated"];

  const getStatusBadgeClass = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "active":
        return "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
      case "suspended":
        return "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800";
      case "inactive":
        return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700";
      case "deactivated":
        return "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800";
      default:
        return "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  const getStatusColorClass = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "active":
        return "text-emerald-600 dark:text-emerald-400";
      case "suspended":
        return "text-amber-600 dark:text-amber-400";
      case "inactive":
        return "text-slate-500 dark:text-slate-400";
      case "deactivated":
        return "text-rose-600 dark:text-rose-400";
      default:
        return "text-slate-700 dark:text-slate-300";
    }
  };

  const formatStatusDisplay = (status: string) => {
    if (!status) return "Active";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
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
    const r = item.role?.toUpperCase();
    if (r === "GUARD") {
      navigate(`/admin/guards/edit/${item.id}`);
    } else if (r === "USER") {
      navigate(`/admin/users/edit/${item.id}`);
    } else {
      navigate(`/admin/accounts/edit/${item.id}`);
    }
  };
  const handleReviewAppeal = async (
    appealId: number,
    action: "Approved" | "Rejected",
  ) => {
    try {
      setIsAppealsLoading(true);
      const res = await reviewAppeal(appealId, action);
      if (res.success) {
        await fetchAppealsData();
        // Also refresh the accounts table so status updates if an account was unsuspended
        const accountsRes = await getAccounts({
          search: debouncedSearch,
          tab: activeTab,
          status: statusFilter,
          page: currentPage,
          limit: itemsPerPage,
        });
        if (accountsRes.success) {
          setAccounts(accountsRes.accounts || []);
          setMetrics(
            accountsRes.metrics || {
              totalAccounts: 0,
              totalAdmins: 0,
              totalGuards: 0,
              totalUsers: 0,
            },
          );
        }
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to review appeal");
    } finally {
      setIsAppealsLoading(false);
    }
  };

  const getHeaderInfo = () => {
    switch (activeTab) {
      case "Administrators":
        return {
          title: "Admin Management",
          description:
            "Create, Audit, and Configure Administrative Roles and Privilege Tiers.",
        };
      case "Guards":
        return {
          title: "Guard Management",
          description:
            "Configure campus access personnel, gate deployment profiles, and shifts.",
        };
      case "Users":
        return {
          title: "User Management",
          description:
            "Manage active campus parking customers, vehicles link, and parking privilege scope.",
        };
      default:
        return {
          title: "Account Management",
          description:
            "Create, manage, and audit QCU SmartPark personnel and users.",
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

        <div className="flex items-center gap-3">
          {/* Suspension Appeals Button at Top with Badge */}
          <button
            type="button"
            onClick={() => {
              setIsAppealsModalOpen(true);
              fetchAppealsData();
            }}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all shadow-xs cursor-pointer relative"
          >
            <FileText className="h-4 w-4 text-[#0053CC] dark:text-blue-400" />
            <span>Suspension Appeals</span>
            {pendingAppealsCount > 0 && (
              <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white shadow-xs">
                {pendingAppealsCount}
              </span>
            )}
          </button>

          {/* Only show Add button for Administrators if isSuperAdmin; Both can add Guards; No one can add Users */}
          {((activeTab === "Administrators" && isSuperAdmin) ||
            activeTab === "Guards") && (
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
      </div>

      {/* ================= METRIC CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-xs flex justify-between items-start transition-colors">
          <div>
            <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">
              Total Account
            </p>
            <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              {metrics.totalAccounts}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">
              All registered system profiles
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0053CC]">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-xs flex justify-between items-start transition-colors">
          <div>
            <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">
              Administrators
            </p>
            <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              {metrics.totalAdmins}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">
              System administrators & super admins
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
            <Shield className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-xs flex justify-between items-start transition-colors">
          <div>
            <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">
              Security Guards
            </p>
            <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              {metrics.totalGuards}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">
              Active checkpoint personnel
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600">
            <ShieldAlert className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-xs flex justify-between items-start transition-colors">
          <div>
            <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">
              Users
            </p>
            <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              {metrics.totalUsers}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">
              Students, faculty, & vehicle owners
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600">
            <UserCheck className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* ================= UNIFIED TABLE CONTAINER SECTION ================= */}
      <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
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
                  statusFilter,
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
              ) : displayedAccounts.length > 0 ? (
                displayedAccounts.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-3">
                        {item.avatar ? (
                          <img
                            src={item.avatar}
                            alt={item.name || `${item.firstName} ${item.lastName}`}
                            className="h-9 w-9 rounded-full object-cover shrink-0 border-2 border-slate-200 dark:border-slate-700 shadow-xs"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-950/60 text-[#0053CC] dark:text-blue-400 font-bold text-xs flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800">
                            {(item.name || `${item.firstName} ${item.lastName}`)
                              .split(" ")
                              .map((p: string) => p[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()}
                          </div>
                        )}
                        <span>{item.name || `${item.firstName} ${item.lastName}`}</span>
                      </div>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">
                      {item.email}
                    </td>
                    <td className="py-3 font-medium text-slate-800 dark:text-slate-200">
                      {formatRoleDisplay(item.role)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(
                          item.accountStatus,
                        )}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            item.accountStatus?.toLowerCase() === "active"
                              ? "bg-emerald-500"
                              : item.accountStatus?.toLowerCase() ===
                                  "suspended"
                                ? "bg-amber-500"
                                : item.accountStatus?.toLowerCase() ===
                                    "inactive"
                                  ? "bg-slate-400"
                                  : "bg-rose-500"
                          }`}
                        />
                        {formatStatusDisplay(item.accountStatus)}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500">
                      {item.updatedAt
                        ? new Date(item.updatedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
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
                      {item.role?.toUpperCase() !== "USER" &&
                        (!item.role?.toUpperCase().includes("ADMIN") ||
                          isSuperAdmin) && (
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
            Showing {displayedAccounts.length} of {pagination.total} accounts
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
            {Array.from(
              { length: pagination.totalPages || 1 },
              (_, i) => i + 1,
            ).map((number) => (
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
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, pagination.totalPages),
                )
              }
              disabled={
                currentPage === pagination.totalPages ||
                pagination.totalPages === 0 ||
                isLoading
              }
              className="px-3 py-1 rounded-lg font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ================= SUSPENSION APPEALS MODAL ================= */}
      {isAppealsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 sm:p-6">
          <div className="w-full max-w-4xl max-h-[90vh] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden transition-colors">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#0053CC] dark:text-blue-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">
                      Suspension Appeals
                    </h2>
                    {pendingAppealsCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-600 text-white">
                        {pendingAppealsCount} Pending
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    Review and act on appeal submissions from suspended
                    personnel and users.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAppealsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Filter and Search Bar inside Modal */}
            <div className="p-4 sm:px-6 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or subject..."
                  value={appealsSearch}
                  onChange={(e) => setAppealsSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 pl-8 pr-7 py-1.5 text-xs focus:outline-none focus:border-[#0053CC]"
                />
                {appealsSearch && (
                  <button
                    type="button"
                    onClick={() => setAppealsSearch("")}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold w-full sm:w-auto">
                {["All", "Pending", "Approved", "Rejected"].map((status) => {
                  const isActive = appealsFilter === status;
                  const activeColor =
                    status === "Pending"
                      ? "bg-amber-600 text-white"
                      : status === "Approved"
                        ? "bg-emerald-700 text-white"
                        : status === "Rejected"
                          ? "bg-rose-700 text-white"
                          : "bg-[#0053CC] text-white";

                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setAppealsFilter(status)}
                      className={`px-3 py-1 rounded-lg transition-colors cursor-pointer text-xs ${
                        isActive
                          ? `${activeColor} font-bold shadow-xs`
                          : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Appeals Content Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {isAppealsLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-2 text-slate-400">
                  <Loader2 className="h-6 w-6 animate-spin text-[#0053CC]" />
                  <span className="text-xs">Loading suspension appeals...</span>
                </div>
              ) : filteredAppeals.length > 0 ? (
                filteredAppeals.map((appeal) => {
                  const isApproved = appeal.status === "Approved";
                  const isRejected = appeal.status === "Rejected";

                  // Deeper, richer full-card color theme per status
                  const cardTheme = isApproved
                    ? {
                        card: "bg-emerald-100/85 border-emerald-300 dark:bg-emerald-950/65 dark:border-emerald-700/80",
                        divider:
                          "border-emerald-300/80 dark:border-emerald-800/80",
                        reasonBox:
                          "bg-emerald-50/90 border-emerald-300/80 dark:bg-emerald-950/80 dark:border-emerald-800",
                        label: "text-emerald-900/75 dark:text-emerald-300",
                        badge: "bg-emerald-700 text-white border-emerald-700",
                        avatarFallback:
                          "bg-emerald-700 text-white ring-2 ring-emerald-300 dark:ring-emerald-700",
                      }
                    : isRejected
                      ? {
                          card: "bg-rose-100/85 border-rose-300 dark:bg-rose-950/65 dark:border-rose-700/80",
                          divider: "border-rose-300/80 dark:border-rose-800/80",
                          reasonBox:
                            "bg-rose-50/90 border-rose-300/80 dark:bg-rose-950/80 dark:border-rose-800",
                          label: "text-rose-900/75 dark:text-rose-300",
                          badge: "bg-rose-700 text-white border-rose-700",
                          avatarFallback:
                            "bg-rose-700 text-white ring-2 ring-rose-300 dark:ring-rose-700",
                        }
                      : {
                          card: "bg-amber-100/85 border-amber-300 dark:bg-amber-950/65 dark:border-amber-700/80",
                          divider:
                            "border-amber-300/80 dark:border-amber-800/80",
                          reasonBox:
                            "bg-amber-50/90 border-amber-300/80 dark:bg-amber-950/80 dark:border-amber-800",
                          label: "text-amber-900/75 dark:text-amber-300",
                          badge: "bg-amber-600 text-white border-amber-600",
                          avatarFallback:
                            "bg-amber-600 text-white ring-2 ring-amber-300 dark:ring-amber-700",
                        };

                  // Supports common user image field names with initials fallback
                  const userAvatarUrl =
                    (appeal.user as any).profilePicture ||
                    (appeal.user as any).avatarUrl ||
                    (appeal.user as any).avatar ||
                    (appeal.user as any).image;

                  const userInitials = appeal.user.name
                    .split(" ")
                    .map((part: string) => part[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();

                  return (
                    <div
                      key={appeal.id}
                      className={`rounded-2xl border p-5 shadow-xs space-y-3.5 transition-colors ${cardTheme.card}`}
                    >
                      {/* Top Row: Avatar + User + Role + Status */}
                      <div
                        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3.5 ${cardTheme.divider}`}
                      >
                        <div className="flex items-center gap-3">
                          {userAvatarUrl ? (
                            <img
                              src={userAvatarUrl}
                              alt={appeal.user.name}
                              className="h-11 w-11 rounded-full object-cover shrink-0 border-2 border-white dark:border-slate-800 shadow-xs"
                            />
                          ) : (
                            <div
                              className={`h-11 w-11 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${cardTheme.avatarFallback}`}
                            >
                              {userInitials}
                            </div>
                          )}

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                                {appeal.user.name}
                              </h4>
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300/80 dark:border-slate-700">
                                {formatRoleDisplay(appeal.user.role)}
                              </span>
                              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                                ID: {appeal.user.schoolId}
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                              {appeal.user.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-start sm:self-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${cardTheme.badge}`}
                          >
                            {appeal.status}
                          </span>
                          <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                            {new Date(appeal.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Middle: Subject, Reason & Notes */}
                      <div className="space-y-2.5 text-xs">
                        <div>
                          <span
                            className={`font-bold uppercase tracking-wider text-[10px] ${cardTheme.label}`}
                          >
                            Subject
                          </span>
                          <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                            {appeal.subject}
                          </p>
                        </div>

                        <div
                          className={`rounded-xl border p-3.5 ${cardTheme.reasonBox}`}
                        >
                          <span
                            className={`font-bold uppercase tracking-wider text-[10px] ${cardTheme.label}`}
                          >
                            Reason for Appeal
                          </span>
                          <p className="text-slate-800 dark:text-slate-200 text-xs mt-1 leading-relaxed whitespace-pre-wrap">
                            {appeal.reason}
                          </p>
                        </div>

                        {appeal.additionalInfo && (
                          <div
                            className={`rounded-xl border p-3 text-[11px] text-slate-700 dark:text-slate-300 ${cardTheme.reasonBox}`}
                          >
                            <span className="font-bold text-[#0053CC] dark:text-blue-400 block text-[10px] uppercase">
                              Additional Information / Details
                            </span>
                            <p className="mt-0.5">{appeal.additionalInfo}</p>
                          </div>
                        )}
                      </div>

                      {/* Footer: Actions */}
                      {appeal.status === "Pending" ? (
                        <div
                          className={`flex items-center justify-end gap-2.5 pt-2.5 border-t ${cardTheme.divider}`}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              handleReviewAppeal(appeal.id, "Rejected")
                            }
                            disabled={isAppealsLoading}
                            className="px-4 py-2 rounded-xl border border-rose-300 text-rose-700 bg-white hover:bg-rose-700 hover:text-white hover:border-rose-700 dark:bg-slate-900 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-700 dark:hover:text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                          >
                            Reject Appeal
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleReviewAppeal(appeal.id, "Approved")
                            }
                            disabled={isAppealsLoading}
                            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                          >
                            Approve & Lift Suspension
                          </button>
                        </div>
                      ) : (
                        <div
                          className={`flex items-center justify-end pt-2 border-t text-[11px] font-bold ${cardTheme.divider} ${
                            isApproved
                              ? "text-emerald-800 dark:text-emerald-300"
                              : "text-rose-800 dark:text-rose-300"
                          }`}
                        >
                          Appeal has been {appeal.status.toLowerCase()}.
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="py-16 text-center text-slate-400 space-y-2">
                  <FileText className="h-8 w-8 mx-auto text-slate-300 dark:text-slate-600" />
                  <p className="text-xs">
                    No suspension appeals found matching your criteria.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:px-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end">
              <button
                type="button"
                onClick={() => setIsAppealsModalOpen(false)}
                className="px-5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
