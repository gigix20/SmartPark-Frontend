import { useState, useEffect } from "react";
import { 
  Car, 
  Bike, 
  Plus, 
  QrCode, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  FileText, 
  ShieldAlert 
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Vehicle {
  id: string;
  type: "Car" | "Motorcycle";
  plateNumber: string;
  brand: string;
  model: string;
  color: string;
  year: string;
  status: "Approved" | "Pending" | "Rejected" | "Inactive";
}

export default function Vehicles() {
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  // Mock list ng vehicles
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: "1",
      type: "Car",
      plateNumber: "NQR 4821",
      brand: "Toyota",
      model: "Vios",
      color: "White",
      year: "2026",
      status: "Approved",
    },
    {
      id: "2",
      type: "Car",
      plateNumber: "XYZ 1234",
      brand: "Honda",
      model: "Civic",
      color: "Silver",
      year: "2025",
      status: "Pending",
    },
    {
      id: "3",
      type: "Motorcycle",
      plateNumber: "592-XYZ",
      brand: "Yamaha",
      model: "Click 125i",
      color: "Matte Black",
      year: "2026",
      status: "Rejected",
    },
  ]);

  // Modal States
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  // Selected Vehicle for Action
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Form Fields & Validation States
  const [formData, setFormData] = useState({
    type: "",
    plateNumber: "",
    brand: "",
    model: "",
    color: "",
    year: "",
    declaration: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Lock body scroll kapag may bukas na modal
  useEffect(() => {
    const isAnyModalOpen = isRegisterOpen || isEditOpen || isDeactivateOpen || isSuccessModalOpen;
    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isRegisterOpen, isEditOpen, isDeactivateOpen, isSuccessModalOpen]);

  // Reset Form
  const resetForm = () => {
    setFormData({
      type: "",
      plateNumber: "",
      brand: "",
      model: "",
      color: "",
      year: "",
      declaration: false,
    });
    setErrors({});
  };

  // Validate Form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.type) newErrors.type = "Vehicle type is required.";
    if (!formData.plateNumber.trim()) newErrors.plateNumber = "Plate number is required.";
    if (!formData.brand.trim()) newErrors.brand = "Brand is required.";
    if (!formData.model.trim()) newErrors.model = "Model is required.";
    if (!formData.color.trim()) newErrors.color = "Color is required.";
    if (!formData.year.trim()) newErrors.year = "Year is required.";
    if (!formData.declaration) newErrors.declaration = "You must confirm the vehicle declaration.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Register Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      type: formData.type as "Car" | "Motorcycle",
      plateNumber: formData.plateNumber,
      brand: formData.brand,
      model: formData.model,
      color: formData.color,
      year: formData.year,
      status: "Pending",
    };

    setVehicles([newVehicle, ...vehicles]);
    setIsRegisterOpen(false);
    resetForm();
    setSuccessMessage("Vehicle Register Submitted! You will be notified once your registration has been reviewed.");
    setIsSuccessModalOpen(true);
  };

  // Handle Edit Submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !selectedVehicle) return;

    setVehicles(
      vehicles.map((v) =>
        v.id === selectedVehicle.id
          ? { ...v, ...formData, type: formData.type as "Car" | "Motorcycle", status: "Pending" }
          : v
      )
    );
    setIsEditOpen(false);
    resetForm();
    setSuccessMessage("Vehicle Information Updated Successfully! Your vehicle information changes are pending administrator approval.");
    setIsSuccessModalOpen(true);
  };

  // Handle Deactivate / Remove
  const handleDeactivateConfirm = () => {
    if (!selectedVehicle) return;

    setVehicles(
      vehicles.map((v) =>
        v.id === selectedVehicle.id ? { ...v, status: "Inactive" } : v
      )
    );
    setIsDeactivateOpen(false);
    setSuccessMessage("Vehicle deactivated successfully! This vehicle is no longer active and cannot be used for parking access.");
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-28 transition-colors duration-300">
      {/* Top Header */}
      <Header currentUser={currentUser} />

      {/* Main Content Area */}
      <main className="mx-auto max-w-5xl p-4 sm:p-8 space-y-6">
        
        {/* VEHICLE MANAGEMENT BANNER */}
        <div className="rounded-[24px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors duration-300">
          <div>
            <h1 className="font-poppins text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Vehicle Management
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Manage your campus-approved vehicles and access QR codes.
            </p>
          </div>

          <Button
            type="button"
            onClick={() => {
              resetForm();
              setIsRegisterOpen(true);
            }}
            className="h-11 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Register New Vehicle
          </Button>
        </div>

        {/* CONDITIONAL CONTENT: EMPTY STATE VS VEHICLE CARDS */}
        {vehicles.length === 0 ? (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center rounded-[24px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400">
              <Car className="h-10 w-10" />
            </div>
            <h2 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">
              No registered vehicle found.
            </h2>
            <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              There are currently no vehicles linked to your account. Please register a vehicle to access parking features.
            </p>
            <Button
              type="button"
              onClick={() => {
                resetForm();
                setIsRegisterOpen(true);
              }}
              className="mt-6 h-11 px-6 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-white font-semibold text-xs transition-all shadow-sm cursor-pointer"
            >
              Register Vehicle
            </Button>
          </div>
        ) : (
          /* VEHICLE LIST CARDS */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="rounded-[24px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between transition-all duration-300"
                >
                  <div>
                    {/* Top Row: Icon & Status Badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400">
                        {vehicle.type === "Car" ? <Car className="h-7 w-7" /> : <Bike className="h-7 w-7" />}
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                          vehicle.status === "Approved"
                            ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400"
                            : vehicle.status === "Pending"
                            ? "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400"
                            : vehicle.status === "Rejected"
                            ? "bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {vehicle.status}
                      </span>
                    </div>

                    {/* Plate Number & Details */}
                    <h3 className="font-poppins text-lg font-bold text-slate-900 dark:text-white mb-3">
                      {vehicle.plateNumber}
                    </h3>

                    <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
                      <div className="flex justify-between">
                        <span>Vehicle Type</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{vehicle.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Brand</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{vehicle.brand}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Model</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{vehicle.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Color</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{vehicle.color}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Year Registered</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{vehicle.year}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-5 border-t border-slate-100 dark:border-slate-800 mt-5">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 h-9 rounded-xl border-slate-200 dark:border-slate-700 text-xs font-semibold text-[#0053CC] dark:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 flex items-center gap-1.5 cursor-pointer"
                    >
                      <QrCode className="h-3.5 w-3.5" /> View QR Code
                    </Button>

                    {vehicle.status !== "Inactive" && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setSelectedVehicle(vehicle);
                          setFormData({
                            type: vehicle.type,
                            plateNumber: vehicle.plateNumber,
                            brand: vehicle.brand,
                            model: vehicle.model,
                            color: vehicle.color,
                            year: vehicle.year,
                            declaration: true,
                          });
                          setIsEditOpen(true);
                        }}
                        className="h-9 px-3 rounded-xl border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="h-3.5 w-3.5" /> Edit
                      </Button>
                    )}

                    {vehicle.status !== "Inactive" && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setSelectedVehicle(vehicle);
                          setIsDeactivateOpen(true);
                        }}
                        className="h-9 px-3 rounded-xl border-red-200 dark:border-red-900/50 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Deactivate
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ----------------- MODAL 1: REGISTER VEHICLE FORM ----------------- */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-lg rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 my-8">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">Vehicle Registration Form</h3>
                  <p className="text-[11px] text-slate-400">Please fill the vehicle details below.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Vehicle Type */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Vehicle Type<span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className={`w-full h-11 rounded-xl border bg-white dark:bg-slate-800 px-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none transition-colors ${
                      errors.type ? "border-red-500 bg-red-50/20" : "border-slate-300 dark:border-slate-700"
                    }`}
                  >
                    <option value="">Select vehicle type</option>
                    <option value="Car">Car</option>
                    <option value="Motorcycle">Motorcycle</option>
                  </select>
                  {errors.type && <span className="text-[10px] text-red-500 font-medium">{errors.type}</span>}
                </div>

                {/* Plate Number */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Plate Number<span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input
                    placeholder="Enter plate number"
                    value={formData.plateNumber}
                    onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                    className={`h-11 rounded-xl text-xs ${errors.plateNumber ? "border-red-500 bg-red-50/20" : ""}`}
                  />
                  {errors.plateNumber && <span className="text-[10px] text-red-500 font-medium">{errors.plateNumber}</span>}
                </div>

                {/* Brand */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Brand<span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input
                    placeholder="Enter brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className={`h-11 rounded-xl text-xs ${errors.brand ? "border-red-500 bg-red-50/20" : ""}`}
                  />
                  {errors.brand && <span className="text-[10px] text-red-500 font-medium">{errors.brand}</span>}
                </div>

                {/* Model */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Model<span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input
                    placeholder="Enter model"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className={`h-11 rounded-xl text-xs ${errors.model ? "border-red-500 bg-red-50/20" : ""}`}
                  />
                  {errors.model && <span className="text-[10px] text-red-500 font-medium">{errors.model}</span>}
                </div>

                {/* Color */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Color<span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input
                    placeholder="Enter color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className={`h-11 rounded-xl text-xs ${errors.color ? "border-red-500 bg-red-50/20" : ""}`}
                  />
                  {errors.color && <span className="text-[10px] text-red-500 font-medium">{errors.color}</span>}
                </div>

                {/* Year */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Year<span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input
                    placeholder="Enter year"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className={`h-11 rounded-xl text-xs ${errors.year ? "border-red-500 bg-red-50/20" : ""}`}
                  />
                  {errors.year && <span className="text-[10px] text-red-500 font-medium">{errors.year}</span>}
                </div>
              </div>

              {/* Declaration Checkbox */}
              <div className="space-y-1 pt-2">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="regDeclaration"
                    checked={formData.declaration}
                    onChange={(e) => setFormData({ ...formData, declaration: e.target.checked })}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#0053CC] focus:ring-[#0053CC]"
                  />
                  <label htmlFor="regDeclaration" className="text-[11px] text-slate-600 dark:text-slate-300 cursor-pointer">
                    I confirm that the vehicle information provided is accurate and that I am the owner or an authorized user of this vehicle.
                  </label>
                </div>
                {errors.declaration && <span className="text-[10px] text-red-500 font-medium">{errors.declaration}</span>}
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-4">
                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-white font-semibold text-sm transition-all shadow-sm cursor-pointer"
                >
                  Register Vehicle
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsRegisterOpen(false)}
                  className="w-full h-12 rounded-xl border border-slate-200 text-sm font-semibold text-[#0053CC] hover:bg-slate-50"
                >
                  Cancel
                </Button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ----------------- MODAL 2: EDIT VEHICLE FORM ----------------- */}
      {isEditOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-lg rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 my-8">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400">
                  <Edit3 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">Edit Vehicle</h3>
                  <p className="text-[11px] text-slate-400">Update your vehicle information.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Vehicle Type */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">Vehicle Type</Label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full h-11 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="Car">Car</option>
                    <option value="Motorcycle">Motorcycle</option>
                  </select>
                </div>

                {/* Plate Number */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">Plate Number</Label>
                  <Input
                    value={formData.plateNumber}
                    onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                    className="h-11 rounded-xl text-xs"
                  />
                </div>

                {/* Brand */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">Brand</Label>
                  <Input
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="h-11 rounded-xl text-xs"
                  />
                </div>

                {/* Model */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">Model</Label>
                  <Input
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="h-11 rounded-xl text-xs"
                  />
                </div>

                {/* Color */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">Color</Label>
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="h-11 rounded-xl text-xs"
                  />
                </div>

                {/* Year */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">Year</Label>
                  <Input
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="h-11 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 space-y-2.5">
                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-white font-semibold text-sm transition-all shadow-sm cursor-pointer"
                >
                  Save Changes
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditOpen(false)} 
                  className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm font-semibold text-[#0053CC] dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </Button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ----------------- MODAL 3: DEACTIVATE CONFIRMATION ----------------- */}
      {isDeactivateOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-8 text-center shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-500">
              <ShieldAlert className="h-7 w-7" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Are you sure you want to deactivate this vehicle?</h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              This vehicle will no longer be active and cannot be used for parking access.
            </p>

            <div className="mt-6 flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDeactivateOpen(false)}
                className="flex-1 h-11 rounded-xl border border-slate-200 text-xs font-semibold text-[#0053CC] hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleDeactivateConfirm}
                className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-sm cursor-pointer"
              >
                Deactivate
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MODAL 4: SUCCESS POPUP ----------------- */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-8 text-center shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500">
              <CheckCircle2 className="h-7 w-7" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Success!</h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {successMessage}
            </p>

            <Button
              type="button"
              onClick={() => setIsSuccessModalOpen(false)}
              className="mt-6 w-full h-11 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-white font-semibold text-xs shadow-sm cursor-pointer"
            >
              OK
            </Button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}