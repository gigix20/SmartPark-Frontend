import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/AdminLayout";
import { AlertCircle, Check, ArrowLeft, Loader2 } from "lucide-react";
import { getParkingCapacity, updateParkingCapacity } from "@/api/parkingApi";

export default function ParkingCapacity() {
  const navigate = useNavigate();
  const [carCapacity, setCarCapacity] = useState<string>("60");
  const [motorcycleCapacity, setMotorcycleCapacity] = useState<string>("40");
  const [carParked, setCarParked] = useState<number>(0);
  const [motorcycleParked, setMotorcycleParked] = useState<number>(0);
  const [totalOccupied, setTotalOccupied] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorField, setErrorField] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  // Fetch initial capacity and occupancy from backend
  const fetchCapacityData = async () => {
    try {
      setIsLoading(true);
      const res = await getParkingCapacity();
      if (res.success && res.data) {
        setCarCapacity(res.data.carCapacity.toString());
        setMotorcycleCapacity(res.data.motorcycleCapacity.toString());
        setCarParked(res.data.carParked);
        setMotorcycleParked(res.data.motorcycleParked);
        setTotalOccupied(res.data.totalOccupied);
      }
    } catch (err) {
      console.error("Failed to fetch parking capacity:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCapacityData();
  }, []);

  const parsedCar = parseInt(carCapacity, 10) || 0;
  const parsedMoto = parseInt(motorcycleCapacity, 10) || 0;
  const totalCapacity = parsedCar + parsedMoto;
  const MAX_CAPACITY = 10000;

  const utilizationPercentage =
    totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

  const handleSave = async (e: React.FormEvent) => {
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
      isNaN(parsedCar) ||
      parsedCar <= 0
    ) {
      setErrorMessage("Invalid car capacity. Must be a whole number greater than 0.");
      setErrorField("car");
      return;
    }

    if (parsedCar > MAX_CAPACITY) {
      setErrorMessage(`Car capacity cannot exceed ${MAX_CAPACITY.toLocaleString()} spaces.`);
      setErrorField("car");
      return;
    }

    if (parsedCar < carParked) {
      setErrorMessage(`Car capacity cannot be less than the ${carParked.toLocaleString()} cars currently parked.`);
      setErrorField("car");
      return;
    }

    if (
      motorcycleCapacity.includes(".") ||
      isNaN(parsedMoto) ||
      parsedMoto <= 0
    ) {
      setErrorMessage("Invalid motorcycle capacity. Must be a whole number greater than 0.");
      setErrorField("motorcycle");
      return;
    }

    if (parsedMoto > MAX_CAPACITY) {
      setErrorMessage(`Motorcycle capacity cannot exceed ${MAX_CAPACITY.toLocaleString()} spaces.`);
      setErrorField("motorcycle");
      return;
    }

    if (parsedMoto < motorcycleParked) {
      setErrorMessage(`Motorcycle capacity cannot be less than the ${motorcycleParked.toLocaleString()} motorcycles currently parked.`);
      setErrorField("motorcycle");
      return;
    }

    try {
      setIsSaving(true);
      const res = await updateParkingCapacity({
        carCapacity: parsedCar,
        motorcycleCapacity: parsedMoto,
      });

      if (res.success) {
        setShowSuccessModal(true);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to update parking capacity.";
      const field = err.response?.data?.field || "car";
      setErrorMessage(msg);
      setErrorField(field);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      {/* Back Button & Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/admin/parking")}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">
            Manage Parking Capacity
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Update the number of spaces for cars and motorcycles.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 flex flex-col items-center justify-center text-center space-y-3">
          <Loader2 className="h-8 w-8 text-[#0053CC] animate-spin" />
          <p className="text-xs text-slate-500 dark:text-slate-400">Loading capacity configuration...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-xs transition-colors overflow-hidden min-w-0">
              <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">Total capacity</p>
              <h3 className="font-poppins text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 truncate" title={totalCapacity.toLocaleString()}>
                {totalCapacity.toLocaleString()}
              </h3>
              <p className="text-[10px] font-medium text-slate-400 mt-1 truncate">Total configured stalls</p>
            </div>

            <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-xs transition-colors overflow-hidden min-w-0">
              <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">Car capacity</p>
              <h3 className="font-poppins text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 truncate" title={parsedCar.toLocaleString()}>
                {parsedCar.toLocaleString()}
              </h3>
              <p className="text-[10px] font-medium text-slate-400 mt-1 truncate">Inside now: {carParked.toLocaleString()}</p>
            </div>

            <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-xs transition-colors overflow-hidden min-w-0">
              <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">Motorcycle capacity</p>
              <h3 className="font-poppins text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 truncate" title={parsedMoto.toLocaleString()}>
                {parsedMoto.toLocaleString()}
              </h3>
              <p className="text-[10px] font-medium text-slate-400 mt-1 truncate">Inside now: {motorcycleParked.toLocaleString()}</p>
            </div>

            <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-xs transition-colors overflow-hidden min-w-0">
              <p className="text-xs font-bold text-[#0053CC] dark:text-blue-400">Total Occupied</p>
              <h3 className="font-poppins text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 truncate" title={totalOccupied.toLocaleString()}>
                {totalOccupied.toLocaleString()}
              </h3>
              <p className="text-[10px] font-medium text-slate-400 mt-1 truncate">Inside now: {totalOccupied.toLocaleString()}</p>
            </div>
          </div>

          <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-3 transition-colors">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#0053CC] dark:text-blue-400 border-b-2 border-[#0053CC] dark:border-blue-400 pb-1">
                Utilization Percentage
              </span>
              <span className="text-slate-500 dark:text-slate-400 font-semibold">{utilizationPercentage}% used</span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0053CC] dark:bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
            <div>
              <h2 className="font-poppins text-sm font-bold text-[#0053CC] dark:text-blue-400">Update capacity</h2>
              <p className="text-xs text-slate-400">Specify the maximum vehicle stall thresholds (max 10,000 stalls).</p>
            </div>

            <form onSubmit={handleSave} className="space-y-4 max-w-full" noValidate>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Car capacity<span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Max: 10,000</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  step="1"
                  value={carCapacity}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 5);
                    setCarCapacity(val);
                    setErrorMessage(null);
                    setErrorField(null);
                  }}
                  placeholder="e.g. 60"
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
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Motorcycle capacity<span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Max: 10,000</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  step="1"
                  value={motorcycleCapacity}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 5);
                    setMotorcycleCapacity(val);
                    setErrorMessage(null);
                    setErrorField(null);
                  }}
                  placeholder="e.g. 40"
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
                  type="text"
                  value={totalCapacity.toLocaleString()}
                  readOnly
                  className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 text-xs text-slate-500 dark:text-slate-400 cursor-not-allowed focus:outline-none font-semibold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={fetchCapacityData}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-xl bg-[#0053CC] px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{isSaving ? "Saving..." : "Save capacity"}</span>
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-8 text-center shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4 animate-in zoom-in-95">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <Check className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">
                Parking capacity updated
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Total capacity is now {totalCapacity.toLocaleString()} spaces ({parsedCar.toLocaleString()} cars, {parsedMoto.toLocaleString()} motorcycles).
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