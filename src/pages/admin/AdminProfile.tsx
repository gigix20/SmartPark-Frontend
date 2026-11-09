import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Edit2, AlertCircle } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";

const initialData = {
  firstName: "John",
  lastName: "Doe",
  email: "admin@qcu.edu.ph",
  employeeId: "QCU-IT-2024-08",
  role: "Super Administrator",
  phone: "+63 912 345 6789",
};

export default function AdminProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialData);
  const [currentInitialData, setCurrentInitialData] = useState(initialData);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Lock scroll background kapag nakabukas ang confirmation modal
  useEffect(() => {
    if (showConfirmModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showConfirmModal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Suriin kung may totoong pagbabago kumpara sa kasalukuyang na-save na data
  const isFormChanged =
    formData.firstName.trim() !== currentInitialData.firstName.trim() ||
    formData.lastName.trim() !== currentInitialData.lastName.trim() ||
    formData.phone.trim() !== currentInitialData.phone.trim();

  // Trigger ng modal kapag cliniclick ang "Save Changes"
  const handleOpenModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormChanged) {
      setShowConfirmModal(true);
    }
  };

  // Kumpirmahin ang pag-save ng mga pagbabago
  const handleConfirmSave = () => {
    setCurrentInitialData(formData); // I-update ang baseline initial data para mag-hide ulit ang button
    setShowConfirmModal(false);
    console.log("Changes saved successfully:", formData);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">
          Admin Profile
        </h1>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs space-y-6 transition-colors">
          <div className="rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 p-4 sm:p-6 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                  alt="John Doe"
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-xs"
                />
                <button
                  type="button"
                  className="absolute bottom-0 right-0 rounded-full bg-white dark:bg-slate-800 p-1.5 text-blue-600 dark:text-blue-400 shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border border-slate-100 dark:border-slate-700 cursor-pointer"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
              <div>
                <h2 className="font-poppins text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  John Doe
                </h2>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                  Super Admin
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1.5 text-xs border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-200 dark:border-slate-800">
              <div className="flex sm:justify-end items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  Account Status
                </span>
                <span className="rounded-md bg-emerald-100/70 dark:bg-emerald-950/50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                  Active
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400">
                Date Created:{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  December 2025
                </span>
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Last Updated:{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Sep 28, 2026, 9:30 AM
                </span>
              </p>
            </div>
          </div>

          {/* Form Inputs */}
          <form onSubmit={handleOpenModal} className="space-y-6">
            <div className="space-y-4 pt-2">
              <h3 className="font-poppins text-base font-bold text-[#0053CC] dark:text-blue-400">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    First Name:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-medium text-slate-800 dark:text-white focus:border-[#0053CC] focus:outline-none pr-9"
                    />
                    <Edit2 className="absolute right-3 top-3 h-3.5 w-3.5 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Last Name:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-medium text-slate-800 dark:text-white focus:border-[#0053CC] focus:outline-none pr-9"
                    />
                    <Edit2 className="absolute right-3 top-3 h-3.5 w-3.5 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Email Address:
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-3.5 py-2.5 text-xs font-medium text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Employee ID:
                  </label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    disabled
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-3.5 py-2.5 text-xs font-medium text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Role:
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    disabled
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-3.5 py-2.5 text-xs font-medium text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Phone Number:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-medium text-slate-800 dark:text-white focus:border-[#0053CC] focus:outline-none pr-9"
                    />
                    <Edit2 className="absolute right-3 top-3 h-3.5 w-3.5 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => navigate("/admin/change-password")}
                className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Update Password
              </button>

              {isFormChanged && (
                <button
                  type="submit"
                  className="rounded-xl bg-[#0053CC] px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all cursor-pointer animate-in fade-in zoom-in-95"
                >
                  Save Changes
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Safety Net Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative overflow-hidden bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-200 text-center">
            
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400">
              <AlertCircle className="h-6 w-6" />
            </div>

            <div>
              <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">
                Save Changes?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Are you sure you want to update your personal information details?
              </p>
            </div>

            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="w-1/2 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                className="w-1/2 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0053CC] hover:bg-blue-700 active:scale-[0.98] transition-all shadow-md shadow-blue-500/20 cursor-pointer"
              >
                Yes, Save
              </button>
            </div>

          </div>
        </div>
      )}
    </AdminLayout>
  );
}