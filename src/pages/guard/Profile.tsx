import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Edit3, CheckCircle2 } from "lucide-react";
import { GuardHeader } from "@/components/GuardHeader";
import { GuardNav } from "@/components/GuardNav";

export default function Profile() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Kunin ang nakasave na profile image mula sa localStorage o gamitin ang default
  const [profileImage, setProfileImage] = useState<string>(() => {
    return localStorage.getItem("guard_profile_image") || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150";
  });
  
  // Reference para sa hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // HUWAG PAALISIN: Ito ang naglolock sa background scroll kapag lumitaw ang modal
  useEffect(() => {
    if (showSuccessModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showSuccessModal]);

  // Handler para basahin ang mismong file at i-convert sa Base64 para permanenteng ma-save
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileImage(base64String);
        // I-save ang mismong image data sa localStorage
        localStorage.setItem("guard_profile_image", base64String);
        
        // I-broadcast ang event para magbago rin agad ang header kahit nasa parehong page
        window.dispatchEvent(new Event("profileImageUpdated"));
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger para mag-open ang file selector kapag pinindot ang camera button
  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccessModal(true); // Magbubukas ang modal at mai-lock ang scroll
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex flex-col transition-colors font-sans">
      <GuardHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex-1 flex relative">
        <GuardNav isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto lg:pl-72 transition-all">
          <div className="space-y-6 max-w-5xl mx-auto pb-16">
            
            {/* Main Profile Card Container */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6">
              
              {/* Profile Top Banner Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={profileImage}
                      alt="James Santos"
                      className="h-20 w-20 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 shadow-xs"
                    />
                    
                    {/* Hidden File Input para sa pag-upload ng pic */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />

                    <button 
                      type="button" 
                      onClick={handleCameraClick}
                      className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-[#0053CC] text-white shadow-sm hover:bg-[#0042A5] cursor-pointer"
                      title="Change Profile Picture"
                    >
                      <Camera className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div>
                    <h1 className="font-poppins text-xl font-bold text-slate-900 dark:text-white">James Santos</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Guard</p>
                  </div>
                </div>

                <div className="text-xs space-y-1.5 sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200 dark:border-slate-700">
                  <div className="flex sm:justify-end gap-2"><span className="text-slate-400">Account Status:</span> <span className="font-bold text-emerald-600">ACTIVE</span></div>
                  <div className="flex sm:justify-end gap-2"><span className="text-slate-400">Date Created:</span> <span className="font-bold text-slate-700 dark:text-slate-300">December 2025</span></div>
                  <div className="flex sm:justify-end gap-2"><span className="text-slate-400">Last Updated:</span> <span className="font-bold text-slate-700 dark:text-slate-300">Sep 28, 2026, 9:30 AM</span></div>
                </div>
              </div>

              {/* Personal Information Form */}
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <h2 className="font-poppins text-base font-bold text-[#0053CC] dark:text-blue-400">Personal Information</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                    <div className="relative">
                      <input type="text" defaultValue="James" className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#0053CC]" />
                      <Edit3 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Last Name</label>
                    <div className="relative">
                      <input type="text" defaultValue="Santos" className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#0053CC]" />
                      <Edit3 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                    <input type="email" disabled defaultValue="jamessantos@qcu.edu.ph" className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 px-3.5 py-2.5 text-slate-500 cursor-not-allowed" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Employee ID</label>
                    <input type="text" disabled defaultValue="QCU-IT-2025-08" className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 px-3.5 py-2.5 text-slate-500 cursor-not-allowed" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Role</label>
                    <input type="text" disabled defaultValue="Guard" className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 px-3.5 py-2.5 text-slate-500 cursor-not-allowed" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Phone Number</label>
                    <div className="relative">
                      <input type="text" defaultValue="+63 912 315 6798" className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#0053CC]" />
                      <Edit3 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => navigate("/guard/change-password")}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Update Password
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>

            </div>

          </div>
        </main>
      </div>

      {/* ================= SUCCESS POP-UP MODAL (LOCKED BACKGROUND SCROLL) ================= */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-110 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-[32px] bg-white dark:bg-slate-900 p-7 text-center shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 animate-in zoom-in-95 relative transition-colors">
            
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/40">
              <CheckCircle2 className="h-7 w-7" />
            </div>

            <div>
              <h3 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">Profile Updated Successfully</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed px-2">
                The changes have been saved to your account.
              </p>
            </div>
            
            <div className="pt-2">
              <button 
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="w-full h-11 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}