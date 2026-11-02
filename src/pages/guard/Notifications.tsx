import { useState } from "react";
import { Search, AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import { GuardHeader } from "@/components/GuardHeader";
import { GuardNav } from "@/components/GuardNav";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "alert" | "update" | "warning";
  read: boolean;
}

export default function Notifications() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "alerts" | "updates">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock Notifications Data
  const [notifications, setNotifications] = useState<NotificationItem[]>([
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
    {
      id: "4",
      title: "Inactive vehicle attempt",
      description: "Plate TRX 117 tried to enter, but the vehicle status is Inactive.",
      time: "Sept 29, 4:10 PM",
      type: "alert",
      read: true,
    },
  ]);

  // Filtering Logic
  const filteredNotifications = notifications.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === "unread") return !item.read;
    if (activeTab === "alerts") return item.type === "alert" || item.type === "warning";
    if (activeTab === "updates") return item.type === "update";

    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex flex-col transition-colors font-sans">
      <GuardHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex-1 flex relative">
        <GuardNav isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto lg:pl-72 transition-all">
          <div className="space-y-6 max-w-5xl mx-auto pb-16">
       
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
                    {unreadCount} unread • {notifications.length} total
                  </p>
                </div>
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
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((item) => (
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
                        <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${
                          item.type === "alert" 
                            ? "bg-rose-50 dark:bg-rose-950/50 text-rose-600 border-rose-200 dark:border-rose-900" 
                            : item.type === "warning"
                            ? "bg-amber-50 dark:bg-amber-950/50 text-amber-600 border-amber-200 dark:border-rose-900"
                            : "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border-emerald-200 dark:border-rose-900"
                        }`}>
                          {item.type === "alert" ? (
                            <ShieldAlert className="h-5 w-5" />
                          ) : item.type === "warning" ? (
                            <AlertTriangle className="h-5 w-5" />
                          ) : (
                            <CheckCircle2 className="h-5 w-5" />
                          )}
                        </div>

                        <div className="space-y-1">
                          <h2 className="font-poppins text-sm font-bold text-slate-900 dark:text-white">
                            {item.title}
                          </h2>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center shrink-0">
                        <span className="text-[11px] font-mono font-medium text-slate-400">
                          {item.time}
                        </span>
                        {!item.read && (
                          <button
                            type="button"
                            onClick={() => {
                              setNotifications((prev) =>
                                prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
                              );
                            }}
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
        </main>
      </div>
    </div>
  );
}