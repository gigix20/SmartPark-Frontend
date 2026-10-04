import { Link, useLocation } from "react-router-dom";
import { ParkingSquare, Car, Home, FileText, User } from "lucide-react";

export function BottomNav() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: "Parking", path: "/parking", icon: ParkingSquare },
    { label: "Vehicles", path: "/vehicles", icon: Car },
    { label: "Home", path: "/StudentHome", icon: Home },
    { label: "Reports", path: "/reports", icon: FileText },
    { label: "Profile", path: "/profile", icon: User },
  ];

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="flex w-full max-w-md items-center justify-between rounded-2xl border border-slate-200/80 bg-white/90 px-3 py-2 shadow-xl backdrop-blur-md transition-all">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center justify-center gap-1 rounded-xl px-3 py-1.5 transition-all duration-200 active:scale-95 ${
                active
                  ? "bg-[#0053CC]/10 text-[#0053CC]"
                  : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <Icon
                className={`h-5 w-5 transition-transform duration-200 ${
                  active ? "scale-110 stroke-[2.25]" : "stroke-[1.75]"
                }`}
              />
              <span
                className={`text-[10px] tracking-tight ${
                  active ? "font-bold" : "font-medium"
                }`}
              >
                {item.label}
              </span>

              {/* Active Indicator Dot sa Ibaba */}
              {active && (
                <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-[#0053CC]" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}