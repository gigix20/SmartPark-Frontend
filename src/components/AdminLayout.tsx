import { useState, type ReactNode} from "react";
import { AdminHeader } from "./AdminHeader";
import { AdminNav } from "./AdminNav";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 font-sans relative transition-colors">
      <AdminHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex">
        <AdminNav isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 ml-0 lg:ml-64 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}