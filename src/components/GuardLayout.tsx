import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  QrCode, 
  UserPlus, 
  MonitorCheck, 
  LogOut 
} from "lucide-react";
import { GuardHeader } from "@/components/GuardHeader";

export function GuardLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", path: "/guard", icon: LayoutDashboard },
    { label: "Scan QR", path: "/guard/scan-qr", icon: QrCode },
    { label: "Gate Registration", path: "/guard/registration", icon: UserPlus },
    { label: "Gate Monitoring", path: "/guard/monitoring", icon: MonitorCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      
      {/* GUARD HEADER */}
      <GuardHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* BODY CONTAINER */}
      <div className="flex-1 flex relative">
        
        {/* MOBILE OVERLAY */}
        {isSidebarOpen && (
          <div 
            onClick={() => setIsSidebarOpen(false)} 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden" 
          />
        )}

        {/* GUARD SIDEBAR */}
        <aside className={`fixed lg:sticky top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0B0F19] p-5 flex flex-col justify-between transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}>
          
          <div className="space-y-6">
            {/* Guard Profile Card in Sidebar */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" 
                alt="James Santos" 
                className="h-10 w-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
              />
              <div>
                <h4 className="font-poppins text-xs font-bold text-slate-900 dark:text-white">James Santos</h4>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 mt-0.5">
                  Guard
                </span>
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => {
                      navigate(item.path);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive 
                        ? "bg-[#0053CC] text-white shadow-md shadow-blue-500/20 font-bold" 
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Logout Button */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Log out</span>
            </button>
          </div>

        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  );
}