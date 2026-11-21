import { useState, useEffect } from "react";
import { 
  Plus, 
  QrCode, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  ShieldAlert,
  Loader2,
  Download,
  AlertCircle
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  getMyVehicles, 
  registerVehicle, 
  updateVehicle, 
  deactivateVehicle,
  deleteVehicle,
  type Vehicle 
} from "@/api/vehicleApi";

// Import icons
import carIcon from "@/assets/car-icon.svg";
import motorIcon from "@/assets/motor-icon.svg";

export default function Vehicles() {
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal States
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedQrVehicle, setSelectedQrVehicle] = useState<Vehicle | null>(null);
  const [isNotApprovedModalOpen, setIsNotApprovedModalOpen] = useState(false);
  const [notApprovedModalVehicle, setNotApprovedModalVehicle] = useState<Vehicle | null>(null);

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

  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      const res = await getMyVehicles();
      if (res.success) {
        setVehicles(res.vehicles || []);
      }
    } catch (err: any) {
      console.error("Failed to fetch vehicles:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    fetchVehicles();
  }, []);

  // Lock body scroll when any modal is open
  useEffect(() => {
    const isAnyModalOpen = 
      isRegisterOpen || 
      isEditOpen || 
      isDeactivateOpen || 
      isSuccessModalOpen || 
      isQrModalOpen || 
      isNotApprovedModalOpen;

    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isRegisterOpen, isEditOpen, isDeactivateOpen, isSuccessModalOpen, isQrModalOpen, isNotApprovedModalOpen]);

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
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await registerVehicle({
        type: formData.type,
        plateNumber: formData.plateNumber,
        brand: formData.brand,
        model: formData.model,
        color: formData.color,
        year: formData.year,
      });

      setIsRegisterOpen(false);
      resetForm();
      await fetchVehicles();
      setSuccessMessage("Vehicle registered successfully! Your SmartPark Digital QR Pass has been generated.");
      setIsSuccessModalOpen(true);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to register vehicle.";
      setErrors({ general: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) return;

    setIsSubmitting(true);
    try {
      await updateVehicle(selectedVehicle.id, {
        type: formData.type,
        plateNumber: formData.plateNumber,
        brand: formData.brand,
        model: formData.model,
        color: formData.color,
        year: formData.year,
      });

      setIsEditOpen(false);
      await fetchVehicles();
      setSuccessMessage("Vehicle details updated successfully!");
      setIsSuccessModalOpen(true);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to update vehicle.";
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete / Remove Vehicle
  const handleDeleteVehicle = async (vehicle: Vehicle) => {
    if (!window.confirm(`Are you sure you want to remove vehicle ${vehicle.plateNumber}?`)) return;

    try {
      setIsSubmitting(true);
      const res = await deleteVehicle(vehicle.id);
      if (res.success) {
        setSuccessMessage("Vehicle removed successfully. You may now re-register this plate number if desired.");
        setIsSuccessModalOpen(true);
        await fetchVehicles();
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to remove vehicle.";
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Action Buttons based on Vehicle Status
  const renderActionButtons = (vehicle: Vehicle) => {
    return (
      <div className="flex items-center gap-2 pt-5 border-t border-slate-100 dark:border-slate-800 mt-5">
        {vehicle.status === "Approved" && (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleViewQr(vehicle)}
              className="flex-1 h-9 rounded-xl border-slate-200 dark:border-slate-700 text-xs font-semibold text-[#0053CC] dark:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <QrCode className="h-3.5 w-3.5" /> View QR Code
            </Button>
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
          </>
        )}

        {vehicle.status === "Inactive" && (
          <Button
            type="button"
            variant="outline"
            onClick={() => handleDeleteVehicle(vehicle)}
            className="w-full h-9 rounded-xl border-red-200 dark:border-red-900/50 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" /> Remove
          </Button>
        )}

        {vehicle.status === "Pending" && (
          <>
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
              className="flex-1 h-9 rounded-xl border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDeleteVehicle(vehicle)}
              className="flex-1 h-9 rounded-xl border-red-200 dark:border-red-900/50 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </Button>
          </>
        )}

        {vehicle.status === "Rejected" && (
          <Button
            type="button"
            variant="outline"
            onClick={() => handleDeleteVehicle(vehicle)}
            className="w-full h-9 rounded-xl border-red-200 dark:border-red-900/50 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" /> Remove
          </Button>
        )}
      </div>
    );
  };

  // Handle Deactivate
  const handleDeactivateConfirm = async () => {
    if (!selectedVehicle) return;

    setIsSubmitting(true);
    try {
      await deactivateVehicle(selectedVehicle.id);
      setIsDeactivateOpen(false);
      await fetchVehicles();
      setSuccessMessage("Vehicle deactivated successfully. It can no longer be used for parking access.");
      setIsSuccessModalOpen(true);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to deactivate vehicle.";
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle View / Generate QR Code
  const handleViewQr = async (vehicle: Vehicle) => {
    if (vehicle.status !== "Approved" || !vehicle.qrCode) {
      setNotApprovedModalVehicle(vehicle);
      setIsNotApprovedModalOpen(true);
      return;
    }
    setSelectedQrVehicle(vehicle);
    setIsQrModalOpen(true);
  };

  // Function to download QR code as PNG image
  const handleDownloadQr = () => {
    if (!selectedQrVehicle) return;
    const svgElement = document.getElementById("vehicle-qr-svg");
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    canvas.width = 300;
    canvas.height = 300;

    img.onload = () => {
      if (!ctx) return;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `SmartPark-QR-${selectedQrVehicle.plateNumber.replace(/\s+/g, "_")}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
  };

  // Filtered lists for Cars and Motorcycles
  const carsList = vehicles.filter((v) => v.type === "Car");
  const motorcyclesList = vehicles.filter((v) => v.type === "Motorcycle");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-28 transition-colors duration-300">
      {/* Top Header */}
      <Header currentUser={currentUser} />

      {/* Main Content Area */}
      <main className="mx-auto max-w-5xl p-4 sm:p-8 space-y-6">
        
        {/* VEHICLE MANAGEMENT BANNER */}
        <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors duration-300">
          <div>
            <h1 className="font-poppins text-xl sm:text-2xl font-extrabold text-[#0053CC] dark:text-blue-400">  
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

        {/* LOADING STATE */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xs">
            <Loader2 className="h-8 w-8 animate-spin text-[#0053CC] dark:text-blue-400 mb-2" />
            <p className="text-xs text-slate-500 dark:text-slate-400">Loading your vehicles...</p>
          </div>
        ) : vehicles.length === 0 ? (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xs">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400">
              <img src={carIcon} alt="Car" className="h-10 w-10 object-contain" />
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
          <div className="space-y-8">
            
            {/* ----------------- CARS SECTION ----------------- */}
            {carsList.length > 0 && (
              <div className="space-y-4">
                <h2 className="font-poppins text-base font-bold text-slate-600 dark:text-slate-300">
                  Cars
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {carsList.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between transition-all duration-300"
                    >
                      <div>
                        {/* Top Row: Icon & Status Badge */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex h-16 w-20 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/50 p-2">
                            <img src={carIcon} alt="Car Icon" className="h-10 w-auto object-contain" />
                          </div>

                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                              vehicle.status === "Approved"
                                ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                                : vehicle.status === "Pending"
                                ? "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                                : vehicle.status === "Rejected"
                                ? "bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                            }`}
                          >
                            {vehicle.status}
                          </span>
                        </div>

                        {/* Plate Number */}
                        <h3 className="font-poppins text-lg font-bold text-slate-900 dark:text-white mb-2">
                          {vehicle.plateNumber}
                        </h3>

                        {/* Rejection Notice if rejected */}
                        {vehicle.status === "Rejected" && vehicle.rejectionReason && (
                          <div className="mb-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 p-2.5 text-xs text-rose-700 dark:text-rose-300">
                            <span className="font-bold">Dahilan ng Disapproval:</span> {vehicle.rejectionReason}
                          </div>
                        )}

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
                            <span>Year</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{vehicle.year}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {renderActionButtons(vehicle)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ----------------- MOTORCYCLE SECTION ----------------- */}
            {motorcyclesList.length > 0 && (
              <div className="space-y-4 pt-4">
                <h2 className="font-poppins text-base font-bold text-slate-600 dark:text-slate-300">
                  Motorcycles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {motorcyclesList.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between transition-all duration-300"
                    >
                      <div>
                        {/* Top Row: Icon & Status Badge */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex h-16 w-20 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/50 p-2">
                            <img src={motorIcon} alt="Motorcycle Icon" className="h-10 w-auto object-contain" />
                          </div>

                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                              vehicle.status === "Approved"
                                ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                                : vehicle.status === "Pending"
                                ? "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                                : vehicle.status === "Rejected"
                                ? "bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                            }`}
                          >
                            {vehicle.status}
                          </span>
                        </div>

                        {/* Plate Number */}
                        <h3 className="font-poppins text-lg font-bold text-slate-900 dark:text-white mb-2">
                          {vehicle.plateNumber}
                        </h3>

                        {/* Rejection Notice if rejected */}
                        {vehicle.status === "Rejected" && vehicle.rejectionReason && (
                          <div className="mb-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 p-2.5 text-xs text-rose-700 dark:text-rose-300">
                            <span className="font-bold">Dahilan ng Disapproval:</span> {vehicle.rejectionReason}
                          </div>
                        )}

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
                            <span>Year</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{vehicle.year}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {renderActionButtons(vehicle)}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </main>

      {/* ----------------- MODAL 1: REGISTER VEHICLE ----------------- */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            <div className="text-center">
              <h2 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">Register Vehicle</h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Enter your vehicle details for campus access approval.
              </p>
            </div>

            {errors.general && (
              <div className="mt-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 p-3 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Vehicle Type */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Vehicle Type <span className="text-red-500">*</span>
                  </Label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full h-11 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#0053CC]"
                  >
                    <option value="" disabled>Select Vehicle Type</option>
                    <option value="Car">Car</option>
                    <option value="Motorcycle">Motorcycle</option>
                  </select>
                  {errors.type && <p className="text-[10px] text-red-500">{errors.type}</p>}
                </div>

                {/* Plate Number */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Plate Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="e.g. ABC 1234"
                    value={formData.plateNumber}
                    onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value.toUpperCase() })}
                    className="h-11 rounded-xl text-xs uppercase"
                  />
                  {errors.plateNumber && <p className="text-[10px] text-red-500">{errors.plateNumber}</p>}
                </div>

                {/* Brand */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Brand <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="e.g. Toyota, Honda"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="h-11 rounded-xl text-xs"
                  />
                  {errors.brand && <p className="text-[10px] text-red-500">{errors.brand}</p>}
                </div>

                {/* Model */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Model <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="e.g. Vios, Click 125i"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="h-11 rounded-xl text-xs"
                  />
                  {errors.model && <p className="text-[10px] text-red-500">{errors.model}</p>}
                </div>

                {/* Color */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Color <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="e.g. White, Black"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="h-11 rounded-xl text-xs"
                  />
                  {errors.color && <p className="text-[10px] text-red-500">{errors.color}</p>}
                </div>

                {/* Year */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Year <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="e.g. 2024"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="h-11 rounded-xl text-xs"
                  />
                  {errors.year && <p className="text-[10px] text-red-500">{errors.year}</p>}
                </div>
              </div>

              {/* Declaration Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.declaration}
                    onChange={(e) => setFormData({ ...formData, declaration: e.target.checked })}
                    className="mt-0.5 rounded border-slate-300 dark:border-slate-700 text-[#0053CC] focus:ring-[#0053CC] h-4 w-4"
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-400 leading-tight">
                    I declare that this vehicle is registered in my name or authorized for my use, and complies with QCU traffic rules and regulations.
                  </span>
                </label>
                {errors.declaration && <p className="text-[10px] text-red-500 mt-1">{errors.declaration}</p>}
              </div>

              <div className="pt-4 space-y-2.5">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-white font-semibold text-sm transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                    </span>
                  ) : (
                    "Submit Registration"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsRegisterOpen(false)} 
                  className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm font-semibold text-[#0053CC] dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </Button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ----------------- MODAL 2: EDIT VEHICLE ----------------- */}
      {isEditOpen && selectedVehicle && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            <div className="text-center">
              <h2 className="font-poppins text-xl font-bold text-[#0053CC] dark:text-blue-400">Edit Vehicle Details</h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Update the vehicle specifications or plate number. Note: Changing plate or vehicle details of an Approved vehicle will revert status to Pending for re-approval.
              </p>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 pt-6">
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
                    onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value.toUpperCase() })}
                    className="h-11 rounded-xl text-xs uppercase"
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
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-white font-semibold text-sm transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
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
      {isDeactivateOpen && selectedVehicle && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-8 text-center shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-500">
              <ShieldAlert className="h-7 w-7" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Are you sure you want to deactivate this vehicle?</h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Vehicle <strong className="text-slate-800 dark:text-slate-200">{selectedVehicle.plateNumber}</strong> will no longer be active and cannot be used for campus parking access.
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
                disabled={isSubmitting}
                onClick={handleDeactivateConfirm}
                className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Deactivating..." : "Deactivate"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MODAL 4: SUCCESS POPUP ----------------- */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
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

      {/* ----------------- MODAL 5: VIEW QR GATE PASS (WITH DOWNLOAD) ----------------- */}
      {isQrModalOpen && selectedQrVehicle && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-8 text-center shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400">
              <QrCode className="h-6 w-6" />
            </div>

            <div>
              <h3 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">SmartPark Digital QR Pass</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Campus Gate Access Clearance</p>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-inner border border-slate-200 dark:border-slate-700 inline-block mx-auto">
              <QRCodeSVG 
                id="vehicle-qr-svg"
                value={selectedQrVehicle.qrCode || selectedQrVehicle.plateNumber}
                size={180}
                level="H"
              />
            </div>

            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3.5 text-left space-y-2 text-xs border border-slate-100 dark:border-slate-700/60">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Plate Number</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedQrVehicle.plateNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Vehicle</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedQrVehicle.brand} {selectedQrVehicle.model} ({selectedQrVehicle.color})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Owner</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Registered Student"}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <Button
                type="button"
                onClick={handleDownloadQr}
                className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" /> Save / Download QR Pass
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setIsQrModalOpen(false)}
                className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MODAL 6: PASS NOT READY / NOT APPROVED ----------------- */}
      {isNotApprovedModalOpen && notApprovedModalVehicle && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-8 text-center shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-500">
              <ShieldAlert className="h-7 w-7" />
            </div>

            <div>
              <h3 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">QR Gate Pass Not Available</h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Vehicle <strong className="text-slate-800 dark:text-slate-200">{notApprovedModalVehicle.plateNumber}</strong> is currently status: <span className="font-semibold text-amber-600 dark:text-amber-400">{notApprovedModalVehicle.status}</span>.
              </p>
              
              {notApprovedModalVehicle.status === "Rejected" && notApprovedModalVehicle.rejectionReason && (
                <div className="mt-3 text-left rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 p-3 text-xs text-rose-700 dark:text-rose-300">
                  <span className="font-bold">Dahilan ng Disapproval:</span> {notApprovedModalVehicle.rejectionReason}
                </div>
              )}

              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Kailangan munang ma-approve ng administrator ang vehicle registration bago magkaroon ng digital gate pass.
              </p>
            </div>

            <Button
              type="button"
              onClick={() => setIsNotApprovedModalOpen(false)}
              className="w-full h-11 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-white font-semibold text-xs shadow-sm cursor-pointer"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}