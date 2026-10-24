import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/AdminLayout";
import { AlertCircle, Check, ArrowLeft } from "lucide-react";

export default function ParkingCapacity() {
  const navigate = useNavigate();
  const [carCapacity, setCarCapacity] = useState<string>("60");
  const [motorcycleCapacity, setMotorcycleCapacity] = useState<string>("40");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorField, setErrorField] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const carParked = 38;
  const motorcycleParked = 19;
  const totalOccupied = carParked + motorcycleParked;
  
  const parsedCar = parseInt(carCapacity, 10) || 0;
  const parsedMoto = parseInt(motorcycleCapacity, 10) || 0;
  const totalCapacity = parsedCar + parsedMoto;

  const utilizationPercentage = totalCapacity > 0 
    ? Math.round((totalOccupied / totalCapacity) * 100) 
    : 0;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setErrorField(null);

    if (!carCapacity.trim()) {
      setErrorMessage("Please fill out this field.");
      setErrorField("car");
      return;
    }

    if (!motorcycleCapacity.trim()) {
      setErrorMessage("Please fill out this field.");
      setErrorField("motorcycle");
      return;
    }

    if (
      carCapacity.includes(".") || 
      motorcycleCapacity.includes(".") ||
      isNaN(parsedCar) || 
      isNaN(parsedMoto) || 
      parsedCar <= 0 || 
      parsedMoto <= 0 || 
      totalCapacity <= 0
    ) {
      setErrorMessage("Invalid parking capacity. Use whole numbers with a total above 0.");
      setErrorField("car");
      return;
    }

    setShowSuccessModal(true);
  };

  return (
    <AdminLayout>
      <div className="mb-2">
        <button
          type="button"
          onClick={() => navigate("/admin/parking")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#0053CC] dark:hover:text-blue-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Parking Management</span>
        </button>
      </div>

      <div>
        <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">Manage Parking Capacity</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Update the number of spaces for cars and motorcycles.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition-colors">
          <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">Total capacity</p>
          <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{totalCapacity}</h3>
          <p className="text-[10px] font-medium text-slate-400 mt-1">Total configured stalls</p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition-colors">
          <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">Car capacity</p>
          <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{carParked}</h3>
          <p className="text-[10px] font-medium text-slate-400 mt-1">Inside now: {carParked}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition-colors">
          <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">Motorcycle capacity</p>
          <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{motorcycleParked}</h3>
          <p className="text-[10px] font-medium text-slate-400 mt-1">Inside now: {motorcycleParked}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition-colors">
          <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">Total Occupied</p>
          <h3 className="font-poppins text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{totalOccupied}</h3>
          <p className="text-[10px] font-medium text-slate-400 mt-1">Inside now: {totalOccupied}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-3 transition-colors">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-[#0053CC] dark:text-blue-400 border-b-2 border-[#0053CC] dark:border-blue-400 pb-1">Utilization Percentage</span>
          <span className="text-slate-500 dark:text-slate-400 font-semibold">{utilizationPercentage}% used</span>
        </div>
        <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#0053CC] dark:bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-6 transition-colors">
        <div>
          <h2 className="font-poppins text-sm font-bold text-[#0053CC] dark:text-blue-400">Update capacity</h2>
          <p className="text-xs text-slate-400">Specify the maximum vehicle stall thresholds.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-4 max-w-full" noValidate>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Car capacity<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="1"
              value={carCapacity}
              onChange={(e) => {
                setCarCapacity(e.target.value);
                setErrorMessage(null);
                setErrorField(null);
              }}
              className={`w-full rounded-xl bg-white dark:bg-slate-800 px-4 py-2.5 text-xs focus:outline-none text-slate-800 dark:text-white transition-colors ${
                errorField === "car" 
                  ? "border border-rose-500 ring-1 ring-rose-500" 
                  : "border border-slate-200 dark:border-slate-700 focus:border-[#0053CC]"
              }`}
            />
            {errorField === "car" && (
              <div className="flex items-center gap-1.5 text-rose-500 text-[11px] font-medium mt-1 animate-in fade-in">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Motorcycle capacity<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="1"
              value={motorcycleCapacity}
              onChange={(e) => {
                setMotorcycleCapacity(e.target.value);
                setErrorMessage(null);
                setErrorField(null);
              }}
              className={`w-full rounded-xl bg-white dark:bg-slate-800 px-4 py-2.5 text-xs focus:outline-none text-slate-800 dark:text-white transition-colors ${
                errorField === "motorcycle" 
                  ? "border border-rose-500 ring-1 ring-rose-500" 
                  : "border border-slate-200 dark:border-slate-700 focus:border-[#0053CC]"
              }`}
            />
            {errorField === "motorcycle" && (
              <div className="flex items-center gap-1.5 text-rose-500 text-[11px] font-medium mt-1 animate-in fade-in">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Total capacity (calculated)
            </label>
            <input
              type="number"
              value={totalCapacity}
              readOnly
              className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 text-xs text-slate-500 dark:text-slate-400 cursor-not-allowed focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setCarCapacity("60");
                setMotorcycleCapacity("40");
                setErrorMessage(null);
                setErrorField(null);
              }}
              className="rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#0053CC] px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Save capacity
            </button>
          </div>
        </form>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-8 text-center shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4 animate-in zoom-in-95">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <Check className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">Parking capacity updated</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Total capacity is now {totalCapacity} spaces ({parsedCar} cars, {parsedMoto} motorcycles).
              </p>
            </div>
            <button 
              onClick={() => setShowSuccessModal(false)} 
              className="w-full h-11 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer transition-all"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}