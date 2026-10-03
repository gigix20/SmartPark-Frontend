import { 
  Menu, 
  Sun, 
  ParkingSquare, 
  Car, 
  Home, 
  FileText, 
  User, 
  Gauge 
} from "lucide-react";
import logo from "@/assets/logo.svg"; // Siguraduhing tama ang path ng logo mo

export default function StudentHome() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F4F6FA] font-sans pb-20">
      
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm md:px-8">
        <button className="text-slate-700 hover:text-slate-900">
          <Menu className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-2">
          <img src={logo} alt="SmartPark Logo" className="h-7 w-auto" />
        </div>

        <div className="flex items-center gap-3">
          <button className="text-slate-500 hover:text-slate-700">
            <Sun className="h-5 w-5" />
          </button>
          <div className="h-8 w-8 overflow-hidden rounded-full border border-slate-200 bg-slate-300">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Main Scrollable Content */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 md:px-6">
        
        {/* 2. Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#0053CC] to-[#2563EB] text-white shadow-lg">
          <div className="flex flex-col justify-between p-6 md:flex-row md:items-center md:p-8">
            <div className="z-10 max-w-sm space-y-2">
              <h1 className="font-poppins text-2xl font-bold md:text-3xl">
                Good Morning, Sophia!
              </h1>
              <p className="text-xs text-blue-100 md:text-sm">
                Here's what's happening in QCU's parking today
              </p>
            </div>
            
            {/* Banner Image / Decor */}
            <div className="mt-4 md:mt-0 z-10 flex justify-end">
              <div className="h-28 w-44 overflow-hidden rounded-2xl shadow-md md:h-32 md:w-56">
                <img
                  src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=500"
                  alt="Parking Hero"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
          {/* Subtle background circles */}
          <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-xl" />
          <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-black/10 blur-xl" />
        </div>

        {/* 3. Parking Overview Card (Donut Chart & Legend) */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            
            {/* Donut Chart Indicator */}
            <div className="relative flex items-center justify-center">
              <svg className="h-40 w-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  stroke="#E2E8F0"
                  strokeWidth="16"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  stroke="#0053CC"
                  strokeWidth="16"
                  strokeDasharray="377"
                  strokeDashoffset={377 - (377 * 65) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center text-center">
                <span className="text-2xl font-black text-slate-800">65 / 100</span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Currently Inside
                </span>
              </div>
            </div>

            {/* Title & Legend Info */}
            <div className="flex flex-col gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2 text-[#0053CC]">
                <Gauge className="h-5 w-5" />
                <h2 className="font-bold text-lg text-slate-900">Parking Overview</h2>
              </div>

              <div className="flex flex-col gap-2 text-xs font-medium text-slate-600">
                <div className="flex items-center justify-between gap-8">
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#0053CC]" />
                    Occupied
                  </span>
                  <span className="font-bold text-slate-800">65</span>
                </div>
                <div className="flex items-center justify-between gap-8">
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-slate-300" />
                    Available
                  </span>
                  <span className="font-bold text-slate-800">35</span>
                </div>
                <div className="flex items-center justify-between gap-8">
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-slate-200" />
                    Total Capacity
                  </span>
                  <span className="font-bold text-slate-800">100</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 4. Bottom Grid Cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          
          {/* Parking Availability Card */}
          <div className="flex flex-col justify-between rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 text-[#0053CC]">
              <ParkingSquare className="h-5 w-5" />
              <h3 className="font-bold text-sm text-slate-800">Parking Availability</h3>
            </div>
            <div className="my-4 rounded-xl bg-amber-50 py-3 text-center border border-amber-200">
              <span className="text-lg font-extrabold text-amber-600">Moderate</span>
            </div>
            <span className="text-xs font-medium text-slate-400">28 slots</span>
          </div>

          {/* My Vehicles Card */}
          <div className="flex flex-col justify-between rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 text-[#0053CC]">
              <Car className="h-5 w-5" />
              <h3 className="font-bold text-sm text-slate-800">My Vehicles</h3>
            </div>
            <div className="my-2 text-center">
              <span className="text-4xl font-black text-slate-900">4</span>
            </div>
            <span className="text-xs font-medium text-slate-400">2 registered</span>
          </div>

          {/* Vehicle History Card */}
          <div className="flex flex-col justify-between rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 text-[#0053CC] mb-3">
              <FileText className="h-5 w-5" />
              <h3 className="font-bold text-sm text-slate-800">Vehicle History</h3>
            </div>
            
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between border-b pb-1 text-slate-400 font-medium">
                <span>Date & Time</span>
                <span>Vehicle Info</span>
                <span>Type</span>
              </div>
              <div className="flex items-center justify-between font-medium text-slate-700">
                <span className="text-[10px] text-slate-400">Oct 23, 2024<br/>10:15 AM</span>
                <span>Toyota Vios (NGR 4821)</span>
                <span className="rounded bg-red-100 px-1.5 py-0.5 text-[9px] font-bold text-red-600">EXIT</span>
              </div>
              <div className="flex items-center justify-between font-medium text-slate-700">
                <span className="text-[10px] text-slate-400">Oct 24, 2024<br/>07:45 AM</span>
                <span>Toyota Vios (NGR 4821)</span>
                <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600">ENTRANCE</span>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* 5. Fixed Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 z-50 flex w-full justify-around border-t bg-white py-2 shadow-lg">
        <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#0053CC]">
          <ParkingSquare className="h-5 w-5" />
          <span className="text-[10px] font-medium">Parking</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#0053CC]">
          <Car className="h-5 w-5" />
          <span className="text-[10px] font-medium">Vehicles</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-[#0053CC]">
          <Home className="h-5 w-5" />
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#0053CC]">
          <FileText className="h-5 w-5" />
          <span className="text-[10px] font-medium">Reports</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#0053CC]">
          <User className="h-5 w-5" />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </nav>

    </div>
  );
}