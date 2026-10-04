import { Wrench } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";

export default function Reports() {
     // Kunin ang user data mula sa localStorage (o i-set sa null)
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  return (
      <div className="min-h-screen bg-slate-50 font-sans pb-24">
        {/* Top Header */}
        <Header currentUser={currentUser} />

        {/* Main Content Area */}
     <div className="flex flex-col items-center justify-center pt-20 px-6 text-center">
        {/* Icon Container */}
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-50/80 shadow-sm">
            <Wrench className="h-12 w-12 text-[#0053CC]" />
        </div>

        {/* Main Title */}
        <h1 className="font-poppins text-xl font-bold text-slate-900 md:text-2xl">
            This feature is not available yet
        </h1>

        {/* Subtitle Message */}
        <p className="mt-2 max-w-sm text-xs font-normal leading-relaxed text-slate-500">
            We're currently working on this feature. It will be available in a
            future update. Thank you for your patience!
        </p>
     </div>
        {/* Bottom Navigation */}
        <BottomNav />
    </div>
  );
}