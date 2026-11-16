import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Loader2,
  CheckCheck,
  ExternalLink,
} from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import {
  getAdminNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  type NotificationItem,
} from "@/api/notificationApi";

export default function Notifications() {
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "alerts" | "updates">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getAdminNotifications({
        search: debouncedSearch,
        tab: activeTab,
      });

      if (res.success) {
        setNotifications(res.notifications);
        setUnreadCount(res.unreadCount);
        setTotalCount(res.totalCount);
      }
    } catch (err) {
      console.error("Failed to fetch admin notifications:", err);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, activeTab]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await markNotificationAsRead(id);
      if (res.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
        setUnreadCount(res.unreadCount);
        // Trigger event so header badge can update
        window.dispatchEvent(new Event("adminNotificationsUpdated"));
      }
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0 || isMarkingAll) return;
    setIsMarkingAll(true);
    try {
      const res = await markAllNotificationsAsRead();
      if (res.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
        window.dispatchEvent(new Event("adminNotificationsUpdated"));
      }
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    } finally {
      setIsMarkingAll(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl mx-auto pb-16 font-sans">
        {/* Main Notifications Card Container */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
          {/* Header Title & Count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-poppins text-2xl font-bold text-slate-900 dark:text-white">
                  Notifications
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-[#0053CC] dark:text-blue-400 border border-blue-100 dark:border-blue-900">
                  {unreadCount} unread
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {unreadCount} unread • {totalCount} total
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAll}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer w-fit"
              >
                <CheckCheck className="h-4 w-4 text-[#0053CC] dark:text-blue-400" />
                <span>{isMarkingAll ? "Marking..." : "Mark all as read"}</span>
              </button>
            )}
          </div>

          {/* Search & Tabs Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Box */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notifications..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0053CC] transition-colors"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 w-full sm:w-auto overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "all"
                    ? "bg-[#0053CC] text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("unread")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "unread"
                    ? "bg-[#0053CC] text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Unread
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("alerts")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "alerts"
                    ? "bg-[#0053CC] text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Alerts
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("updates")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "updates"
                    ? "bg-[#0053CC] text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Updates
              </button>
            </div>
          </div>

          {/* Notification Items List */}
          <div className="space-y-3 pt-2">
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-2 text-slate-400">
                <Loader2 className="h-6 w-6 animate-spin text-[#0053CC]" />
                <span className="text-xs">Loading notifications...</span>
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border transition-all ${
                    item.read
                      ? "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 opacity-80"
                      : "border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 shadow-xs"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon Batay sa Uri ng Notif */}
                    <div
                      className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${
                        item.type === "alert"
                          ? "bg-rose-50 dark:bg-rose-950/50 text-rose-600 border-rose-200 dark:border-rose-900"
                          : item.type === "warning"
                          ? "bg-amber-50 dark:bg-amber-950/50 text-amber-600 border-amber-200 dark:border-amber-900"
                          : "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border-emerald-200 dark:border-emerald-900"
                      }`}
                    >
                      {item.type === "alert" ? (
                        <ShieldAlert className="h-5 w-5" />
                      ) : item.type === "warning" ? (
                        <AlertTriangle className="h-5 w-5" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h2 className="font-poppins text-sm font-bold text-slate-900 dark:text-white">
                          {item.title}
                        </h2>
                        {!item.read && (
                          <span className="h-2 w-2 rounded-full bg-[#0053CC] inline-block"></span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {item.description}
                      </p>
                      {item.link && (
                        <Link
                          to={item.link}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0053CC] dark:text-blue-400 hover:underline pt-1"
                        >
                          <span>View Details</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center shrink-0">
                    <span className="text-[11px] font-mono font-medium text-slate-400">
                      {item.time}
                    </span>
                    {!item.read && (
                      <button
                        type="button"
                        onClick={() => handleMarkAsRead(item.id)}
                        className="px-3 py-1 rounded-lg text-[10px] font-bold bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400 border border-blue-200 dark:border-blue-900 hover:bg-blue-100 transition-colors cursor-pointer"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-400 italic text-xs">
                No notifications found.
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}