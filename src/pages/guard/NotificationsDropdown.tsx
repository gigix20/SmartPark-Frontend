import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, AlertTriangle, CheckCircle2, ShieldAlert, X, CheckCheck, ExternalLink } from "lucide-react";
import {
  getGuardNotifications,
  markGuardNotificationAsRead,
  markAllGuardNotificationsAsRead,
  type NotificationItem,
} from "@/api/notificationApi";

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsDropdown({ isOpen, onClose }: NotificationsDropdownProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "alerts" | "updates">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce search para sa backend query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Function para kunin ang live notifications mula sa database
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getGuardNotifications({
        search: debouncedSearch,
        tab: activeTab,
      });

      if (res.success) {
        setNotifications(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
        setTotalCount(res.totalCount || 0);
      }
    } catch (err) {
      console.error("Failed to fetch guard notifications:", err);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, activeTab]);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  // Isara kapag pinindot sa labas ng dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handler para sa Mark as Read ng isang item
  const handleMarkAsRead = async (id: string) => {
    try {
      await markGuardNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      window.dispatchEvent(new Event("guardNotificationsUpdated"));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  // Handler para sa Mark All as Read
  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0 || isMarkingAll) return;
    setIsMarkingAll(true);
    try {
      await markAllGuardNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      window.dispatchEvent(new Event("guardNotificationsUpdated"));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    } finally {
      setIsMarkingAll(false);
    }
  };

  // Handler kapag pinindot ang "View Details" o ang notification
  const handleViewDetails = (item: NotificationItem) => {
    if (!item.read) {
      handleMarkAsRead(item.id);
    }
    onClose();

    // Laging idirekta sa valid Guard pages upang maiwasan ang "No permission" error
    if (item.link?.includes("/registration") || item.link?.includes("/vehicle")) {
      navigate("/guard/registration");
    } else {
      // Directs to Gate Monitoring bilang primary guard monitoring workspace
      navigate("/guard/monitoring");
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 top-14 z-50 w-80 sm:w-96 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-2xl space-y-3 transition-colors font-sans animate-in fade-in zoom-in-95"
    >
      {/* Header Title & Count */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <h2 className="font-poppins text-base font-bold text-slate-900 dark:text-white">
            Notifications
          </h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-[#0053CC] dark:text-blue-400 border border-blue-100 dark:border-blue-900">
            {unreadCount} unread • {totalCount} total
          </span>
        </div>

        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAll}
              title="Mark all as read"
              className="p-1.5 rounded-xl text-slate-400 hover:text-[#0053CC] dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <CheckCheck className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search notifications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0053CC] transition-all"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none border-b border-slate-100 dark:border-slate-800">
        {(["all", "unread", "alerts", "updates"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === tab
                ? "bg-[#0053CC] text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="max-h-72 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100 dark:divide-slate-800/50">
        {isLoading ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            Loading notifications...
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((item) => (
            <div
              key={item.id}
              className={`pt-2 first:pt-0 pb-2 flex flex-col gap-1.5 transition-colors rounded-xl p-2 ${
                !item.read
                  ? "bg-blue-50/40 dark:bg-blue-950/20"
                  : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5">
                  {item.type === "alert" && (
                    <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-500">
                      <ShieldAlert className="h-3.5 w-3.5" />
                    </div>
                  )}
                  {item.type === "warning" && (
                    <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-500">
                      <AlertTriangle className="h-3.5 w-3.5" />
                    </div>
                  )}
                  {item.type === "update" && (
                    <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className={`text-xs font-semibold leading-tight truncate ${
                      !item.read ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"
                    }`}>
                      {item.title}
                    </p>
                    {!item.read && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#0053CC] shrink-0" />
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                    {item.description}
                  </p>
                  
                  {/* View Details Action Button */}
                  <button
                    type="button"
                    onClick={() => handleViewDetails(item)}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0053CC] dark:text-blue-400 hover:underline pt-0.5 cursor-pointer"
                  >
                    <span>View Details</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/60 text-[10px]">
                <span className="font-mono text-slate-400">{item.time}</span>
                {!item.read && (
                  <button
                    type="button"
                    onClick={() => handleMarkAsRead(item.id)}
                    className="font-bold text-[#0053CC] dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-10 text-center text-slate-400 italic text-xs">
            No notifications found in database.
          </div>
        )}
      </div>
    </div>
  );
}