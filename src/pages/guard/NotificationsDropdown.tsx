import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Search, AlertTriangle, CheckCircle2, ShieldAlert, X, CheckCheck, Loader2, ExternalLink } from "lucide-react";

// Palitan o i-import ito mula sa iyong API file kapag mayroon na
interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "alert" | "update" | "warning";
  read: boolean;
  link?: string;
}

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsDropdown({ isOpen, onClose }: NotificationsDropdownProps) {
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

  // Function para kunin ang notifications mula sa backend
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      /* 
        TODO: Palitan ito ng totoong API call kapag naka-ready na ang backend route mo, halimbawa:
        const res = await getGuardNotifications({ search: debouncedSearch, tab: activeTab });
        if (res.success) {
          setNotifications(res.notifications);
          setUnreadCount(res.unreadCount);
          setTotalCount(res.totalCount);
        }
      */

      // -- MOCK DATA MUNA HABANG WALA PA ANG BACKEND --
      const mockData: NotificationItem[] = [
        {
          id: "1",
          title: "Access denied: vehicle mismatch",
          description: "The scanned QR for plate ABD 9034 did not match the registered vehicle.",
          time: "Sept 30, 8:42 AM",
          type: "alert",
          read: false,
        },
        {
          id: "2",
          title: "Parking lot is full",
          description: "Capacity reached 160 of 160. Entries are paused until a vehicle exits.",
          time: "Sept 30, 9:15 AM",
          type: "warning",
          read: false,
        },
        {
          id: "3",
          title: "Vehicle registration approved",
          description: "The registration of MNO 2210 was approved by Admin Cruz. Its QR is now valid.",
          time: "Sept 29, 4:10 PM",
          type: "update",
          read: true,
        },
      ];

      // Filtering simulation para sa backend readiness
      let filtered = mockData.filter((item) => {
        const matchesSearch =
          item.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          item.description.toLowerCase().includes(debouncedSearch.toLowerCase());
        if (!matchesSearch) return false;
        if (activeTab === "unread") return !item.read;
        if (activeTab === "alerts") return item.type === "alert" || item.type === "warning";
        if (activeTab === "updates") return item.type === "update";
        return true;
      });

      setNotifications(filtered);
      setUnreadCount(mockData.filter((n) => !n.read).length);
      setTotalCount(mockData.length);
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
      /* 
        TODO: await markNotificationAsRead(id); 
      */
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
      /* 
        TODO: await markAllNotificationsAsRead(); 
      */
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      window.dispatchEvent(new Event("guardNotificationsUpdated"));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    } finally {
      setIsMarkingAll(false);
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

      {/* Search Box */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notifications..."
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0053CC] transition-colors"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 overflow-x-auto text-[11px]">
        {(["all", "unread", "alerts", "updates"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap capitalize ${
              activeTab === tab
                ? "bg-[#0053CC] text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notification Items List (Scrollable) */}
      <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
        {isLoading ? (
          <div className="py-10 flex flex-col items-center justify-center text-center space-y-2 text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin text-[#0053CC]" />
            <span className="text-[11px]">Loading notifications...</span>
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col gap-2 p-3 rounded-2xl border transition-all ${
                item.read
                  ? "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 opacity-80"
                  : "border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/40 shadow-xs"
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Icon Batay sa Uri */}
                <div className={`p-2 rounded-xl border shrink-0 mt-0.5 ${
                  item.type === "alert" 
                    ? "bg-rose-50 dark:bg-rose-950/50 text-rose-600 border-rose-200 dark:border-rose-900" 
                    : item.type === "warning"
                    ? "bg-amber-50 dark:bg-amber-950/50 text-amber-600 border-amber-200 dark:border-amber-900"
                    : "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border-emerald-200 dark:border-emerald-900"
                }`}>
                  {item.type === "alert" ? (
                    <ShieldAlert className="h-4 w-4" />
                  ) : item.type === "warning" ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                </div>

                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-poppins text-xs font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    {!item.read && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#0053CC] inline-block"></span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                  {item.link && (
                    <Link
                      to={item.link}
                      onClick={onClose}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0053CC] dark:text-blue-400 hover:underline pt-0.5"
                    >
                      <span>View Details</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </Link>
                  )}
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
            No notifications found.
          </div>
        )}
      </div>

    </div>
  );
}